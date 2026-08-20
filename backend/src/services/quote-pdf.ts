import PDFDocument from "pdfkit";

export type QuotePdfData={reference:string;status:string;created_at:Date|string;company_name:string;contact_name:string;email:string;phone:string;product_slug:string;surface_hectares:string|number;message:string;configuration:Record<string,unknown>;total_cents:string|null;currency:string};
const money=(value:string|null,currency:string)=>value===null?"Prix sur devis":new Intl.NumberFormat("fr-FR",{style:"currency",currency}).format(Number(value)/100);

export function createQuotePdf(quote:QuotePdfData):Promise<Buffer>{
  return new Promise((resolve,reject)=>{
    const doc=new PDFDocument({size:"A4",margin:54,info:{Title:`Devis ${quote.reference}`,Author:"AgriFrance Machines"}});const chunks:Buffer[]=[];doc.on("data",chunk=>chunks.push(chunk));doc.on("end",()=>resolve(Buffer.concat(chunks)));doc.on("error",reject);
    doc.rect(0,0,595,110).fill("#132e1b");doc.fillColor("#f4b41a").fontSize(23).font("Helvetica-Bold").text("AGRIFRANCE",54,38);doc.fillColor("#ffffff").fontSize(9).font("Helvetica").text("MACHINES AGRICOLES PROFESSIONNELLES",54,70);
    doc.fillColor("#132e1b").font("Helvetica-Bold").fontSize(28).text("Demande de devis",54,142);doc.fontSize(12).fillColor("#687169").text(`Référence ${quote.reference}`,54,178);doc.text(new Date(quote.created_at).toLocaleDateString("fr-FR"),420,178,{width:120,align:"right"});
    const block=(title:string,y:number,lines:string[])=>{doc.roundedRect(54,y,487,30+lines.length*20,4).fill("#f3f5f1");doc.fillColor("#2c5e3b").font("Helvetica-Bold").fontSize(10).text(title.toUpperCase(),72,y+14);doc.fillColor("#1a1a1a").font("Helvetica").fontSize(11);lines.forEach((line,index)=>doc.text(line,72,y+37+index*20,{width:450}));return y+48+lines.length*20;};
    let y=block("Client",220,[quote.contact_name,quote.company_name,quote.email,quote.phone]);y=block("Projet",y+14,[`Produit : ${quote.product_slug}`,`Surface : ${quote.surface_hectares} ha`,`Statut : ${quote.status}`]);
    const configuration=Object.entries(quote.configuration??{}).map(([key,value])=>`${key} : ${String(value)}`);if(configuration.length)y=block("Configuration",y+14,configuration.slice(0,6));
    if(quote.message){doc.fillColor("#2c5e3b").font("Helvetica-Bold").fontSize(10).text("BESOIN EXPRIMÉ",54,y+14);doc.fillColor("#303730").font("Helvetica").fontSize(10).text(quote.message,54,y+34,{width:487,height:70});y+=100;}
    doc.moveTo(54,y+15).lineTo(541,y+15).strokeColor("#d8ddd8").stroke();doc.fillColor("#132e1b").font("Helvetica-Bold").fontSize(13).text("Estimation",54,y+34);doc.fontSize(20).fillColor("#e67e22").text(money(quote.total_cents,quote.currency),330,y+30,{width:210,align:"right"});
    doc.font("Helvetica").fontSize(8).fillColor("#727a73").text("Ce document récapitule votre demande. Le tarif final, les options, le transport, les taxes et le délai seront confirmés par une offre commerciale signée.",54,740,{width:487,align:"center"});doc.fillColor("#132e1b").text("AgriFrance Machines · Service commercial",54,780,{width:487,align:"center"});doc.end();
  });
}
