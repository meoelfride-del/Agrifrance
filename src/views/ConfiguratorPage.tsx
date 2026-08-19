"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/src/components/AppShell";

const steps = ["Moteur", "Transmission", "Cabine", "Smart Farming", "Pneumatiques"];
const options = [["380 ch","410 ch"],["Powershift 24×24","CVT TerraDrive"],["Cabine Confort","Cabine Premium"],["Pré-équipement GPS","GPS RTK ± 2,5 cm"],["Pneus 650 standard","Pneus VF 710"]];
const extras = [0,6400,4350,9900,2670];
const money = (value:number) => new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(value);

export function ConfiguratorPage(){
  const [step,setStep]=useState(0); const [choices,setChoices]=useState(["410 ch","CVT TerraDrive","Cabine Premium","GPS RTK ± 2,5 cm","Pneus VF 710"]); const [rotation,setRotation]=useState(0); const [zoom,setZoom]=useState(1);
  const total=425000+extras.reduce((sum,value,index)=>sum+(choices[index]===options[index][1]?value:0),0);
  return <AppShell><main className="config"><section className="config-stage"><div className="stage-label"><span>VOTRE CONFIGURATION</span><h1>Terra X9 410</h1></div><div className="stage-tractor" style={{transform:`scale(${zoom}) rotateY(${rotation}deg)`}}/><div className="view-controls"><button type="button" onClick={()=>setRotation(value=>value+180)} aria-label="Faire pivoter la machine">↻</button><span>Vue interactive</span><button type="button" onClick={()=>setZoom(value=>Math.min(1.35,value+.1))} aria-label="Agrandir">＋</button><button type="button" onClick={()=>setZoom(value=>Math.max(.8,value-.1))} aria-label="Réduire">−</button></div><div className="stage-stats"><span><b>410 ch</b>Puissance</span><span><b>CVT</b>Transmission</span><span><b>± 2,5 cm</b>Précision</span></div></section><section className="config-panel"><div className="steps">{steps.map((label,index)=><button type="button" key={label} className={index===step?"active":index<step?"done":""} onClick={()=>setStep(index)}><i>{index<step?"✓":index+1}</i><span>{label}</span></button>)}</div><div className="panel-body"><small>ÉTAPE {step+1} SUR 5</small><h2>{steps[step]}</h2><p>Sélectionnez l’option adaptée à vos conditions de travail.</p><div className="option-list">{options[step].map((option,index)=><button type="button" className={choices[step]===option?"selected":""} key={option} onClick={()=>setChoices(current=>current.map((value,choiceIndex)=>choiceIndex===step?option:value))}><span><b>{option}</b><small>{index===0?"Configuration standard":"Option performance recommandée"}</small></span><i>{choices[step]===option?"✓":""}</i></button>)}</div></div><div className="config-total"><div><small>PRIX ESTIMÉ HT</small><b>{money(total)}</b></div>{step<4?<button type="button" className="btn orange" onClick={()=>setStep(value=>value+1)}>Étape suivante →</button>:<Link className="btn orange" href={`/quote-request?product=tracteurs-01&configuration=${encodeURIComponent(choices.join("|"))}`}>Finaliser & devis →</Link>}</div></section></main></AppShell>;
}
