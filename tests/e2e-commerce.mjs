import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const base = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const browser = await puppeteer.launch({ headless:true, executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", args:["--no-sandbox","--disable-gpu"] });
const page = await browser.newPage();
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
page.on("pageerror", (error) => consoleErrors.push(error.message));
page.on("response", (response) => { if (response.status() >= 400) consoleErrors.push(`HTTP ${response.status()} ${response.url()}`); });
await mkdir("artifacts/e2e", { recursive:true });

try {
  for (const width of [320,375,425,768,1024,1440]) {
    await page.setViewport({ width, height:900, deviceScaleFactor:1 });
    await page.goto(base, { waitUntil:"networkidle0" });
    const layout = await page.evaluate(() => ({ overflow:document.documentElement.scrollWidth > window.innerWidth + 1, title:document.querySelector("h1")?.textContent?.trim(), content:document.body.innerText.trim().length }));
    assert.equal(layout.overflow, false, `horizontal overflow at ${width}px`);
    assert.ok(layout.title?.includes("rendement"), `home heading missing at ${width}px`);
    assert.ok(layout.content > 500, `home content too short at ${width}px`);
    await page.screenshot({ path:`artifacts/e2e/home-${width}.png`, fullPage:false });
  }

  await page.setViewport({ width:375,height:900,deviceScaleFactor:1 });
  await page.goto(`${base}/catalog`, { waitUntil:"networkidle0" });
  assert.match(await page.$eval(".catalog-toolbar strong", (node) => node.textContent ?? ""), /300/);
  await page.click(".mobile-filter-trigger");
  assert.equal(await page.$eval(".catalog-filters", (node) => node.classList.contains("open")), true);
  await page.type('.catalog-filters input[placeholder="Modèle"]', "TerraNova Terra 220A");
  await new Promise((resolve) => setTimeout(resolve, 350));
  assert.match(await page.$eval(".catalog-toolbar strong", (node) => node.textContent ?? ""), /1 résultat/);
  const productHref = await page.$eval(".product-card-new h3 a", (node) => node.getAttribute("href"));
  assert.ok(productHref?.startsWith("/produits/tracteurs/"));

  await page.goto(`${base}${productHref}`, { waitUntil:"networkidle0" });
  assert.equal(await page.$$eval("img", (images) => images.every((image) => Boolean(image.alt))), true, "an image is missing alt text");
  await page.click(".purchase-actions .button-primary");
  await page.waitForSelector(".cart-drawer.open");
  assert.equal(await page.$eval(".cart-trigger span", (node) => node.textContent), "1");
  await page.reload({ waitUntil:"networkidle0" });
  await new Promise((resolve) => setTimeout(resolve, 150));
  assert.equal(await page.$eval(".cart-trigger span", (node) => node.textContent), "1", "cart did not persist");

  await page.setViewport({ width:1440,height:900,deviceScaleFactor:1 });
  await page.goto(base, { waitUntil:"networkidle0" });
  await page.select(".header-tools .language-selector select", "en");
  await page.waitForFunction(() => document.querySelector("h1")?.textContent?.includes("More output"));
  await page.reload({ waitUntil:"networkidle0" });
  assert.match(await page.$eval("h1", (node) => node.textContent ?? ""), /More output/);

  await page.goto(`${base}/quote-request?product=tracteurs-02`, { waitUntil:"networkidle0" });
  const inputs = await page.$$(".quote-form-new input");
  await inputs[0].type("Aïcha Test"); await inputs[1].type("+2290197000000"); await inputs[2].type("aicha@example.com");
  await page.click('.quote-form-new button[type="submit"]');
  assert.ok((await page.$$("[role=alert]")).length > 0, "privacy validation did not run");
  await inputs[6].click();
  await page.click('.quote-form-new button[type="submit"]');
  await page.waitForSelector(".form-success", { timeout:3000 });
  assert.ok((await page.$eval(".form-success", (node) => node.textContent ?? "")).length > 10);

  for (const route of ["/","/catalog","/parts","/quote-request","/legal/privacy","/robots.txt","/sitemap.xml"]) {
    const response = await page.goto(`${base}${route}`, { waitUntil:"domcontentloaded" });
    assert.equal(response?.status(), 200, `${route} did not return 200`);
  }
  assert.deepEqual(consoleErrors, [], `browser console errors:\n${consoleErrors.join("\n")}`);
  console.log("E2E_PASS widths=6 cart=persistent i18n=persistent filters=ok quote=ok routes=7");
} finally {
  await browser.close();
}
