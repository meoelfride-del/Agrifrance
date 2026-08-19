import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const base = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const browser = await puppeteer.launch({ headless:true, executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe", args:["--no-sandbox","--disable-gpu"] });
const page = await browser.newPage();
await page.setRequestInterception(true);
page.on("request", (request) => {
  if (request.url().endsWith("/api/quotes") && request.method() === "OPTIONS") {
    void request.respond({ status:204, headers:{ "access-control-allow-origin":base, "access-control-allow-methods":"POST,OPTIONS", "access-control-allow-headers":"content-type" } });
  } else if (request.url().endsWith("/api/quotes") && request.method() === "POST") {
    void request.respond({ status:201, contentType:"application/json", headers:{ "access-control-allow-origin":base }, body:JSON.stringify({ reference:"DV-E2E-001" }) });
  } else void request.continue();
});
const consoleErrors = [];
page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
page.on("pageerror", (error) => consoleErrors.push(error.message));
page.on("requestfailed", (request) => consoleErrors.push(`${request.failure()?.errorText ?? "REQUEST_FAILED"} ${request.url()}`));
page.on("response", (response) => { if (response.status() >= 400) consoleErrors.push(`HTTP ${response.status()} ${response.url()}`); });
await mkdir("artifacts/e2e", { recursive:true });

try {
  for (const width of [320,375,425,768,1024,1440]) {
    await page.setViewport({ width, height:900, deviceScaleFactor:1 });
    await page.goto(base, { waitUntil:"domcontentloaded" });
    await page.waitForSelector("h1");
    const layout = await page.evaluate(() => ({ overflow:document.documentElement.scrollWidth > window.innerWidth + 1, title:document.querySelector("h1")?.textContent?.trim(), content:document.body.innerText.trim().length }));
    assert.equal(layout.overflow, false, `horizontal overflow at ${width}px`);
    assert.ok(layout.title?.includes("rendement"), `home heading missing at ${width}px`);
    assert.ok(layout.content > 500, `home content too short at ${width}px`);
    await page.screenshot({ path:`artifacts/e2e/home-${width}.png`, fullPage:false });
  }
  assert.equal(await page.$$eval(".offer-card", (cards) => cards.length), 2, "AgriFrance financing offers are missing");
  assert.match(await page.$eval(".offers-section", (node) => node.textContent ?? ""), /2\s?500\s?\$ US/);
  assert.equal(await page.$$eval('.offer-card a[href="/catalog?category=tracteurs"]', (links) => links.length), 2, "promotion links do not target tractors");

  await page.setViewport({ width:375,height:900,deviceScaleFactor:1 });
  await page.goto(`${base}/catalog`, { waitUntil:"domcontentloaded" });
  assert.match(await page.$eval(".catalog-toolbar strong", (node) => node.textContent ?? ""), /300/);
  await page.waitForSelector(".catalog-filters");
  const visibleProductImages = await page.$$eval(".product-card-new img", (images) => images.map((image) => image.currentSrc || image.src));
  assert.equal(new Set(visibleProductImages).size, visibleProductImages.length, "catalog cards reuse the same primary image");
  await new Promise((resolve) => setTimeout(resolve, 500));
  const initiallyOpen = await page.$eval(".catalog-filters", (node) => node.classList.contains("open"));
  if (!initiallyOpen) await page.click(".mobile-filter-trigger");
  if (consoleErrors.length) console.error("BROWSER_ERRORS", consoleErrors);
  await page.waitForFunction(() => document.querySelector(".catalog-filters")?.classList.contains("open"));
  await page.type('.catalog-filters input', "TerraNova Terra 220A");
  await new Promise((resolve) => setTimeout(resolve, 350));
  assert.match(await page.$eval(".catalog-toolbar strong", (node) => node.textContent ?? ""), /^1\s/);
  const productHref = await page.$eval(".product-card-new h3 a", (node) => node.getAttribute("href"));
  assert.ok(productHref?.startsWith("/produits/tracteurs/"));

  await page.goto(`${base}${productHref}`, { waitUntil:"domcontentloaded" });
  assert.equal(await page.$$eval("img", (images) => images.every((image) => Boolean(image.alt))), true, "an image is missing alt text");
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.click(".purchase-actions .button-primary");
  await page.waitForSelector(".cart-drawer.open");
  assert.equal(await page.$eval(".cart-trigger span", (node) => node.textContent), "1");
  await page.reload({ waitUntil:"domcontentloaded" });
  await page.waitForFunction(() => document.querySelector(".cart-trigger span")?.textContent === "1");
  assert.equal(await page.$eval(".cart-trigger span", (node) => node.textContent), "1", "cart did not persist");

  await page.setViewport({ width:1440,height:900,deviceScaleFactor:1 });
  await page.goto(base, { waitUntil:"domcontentloaded" });
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.select(".header-tools .language-selector select", "en");
  await page.waitForFunction(() => document.querySelector("h1")?.textContent?.includes("More output"));
  await page.reload({ waitUntil:"domcontentloaded" });
  assert.match(await page.$eval("h1", (node) => node.textContent ?? ""), /More output/);

  await page.goto(`${base}/quote-request?product=tracteurs-02`, { waitUntil:"domcontentloaded" });
  await new Promise((resolve) => setTimeout(resolve, 500));
  const inputs = await page.$$(".quote-form-new input");
  await inputs[0].type("Aicha Test"); await inputs[1].type("+2290197000000"); await inputs[2].type("aicha@example.com");
  await page.click('.quote-form-new button[type="submit"]');
  assert.ok((await page.$$("[role=alert]")).length > 0, "privacy validation did not run");
  await inputs[6].click();
  await page.click('.quote-form-new button[type="submit"]');
  await page.waitForSelector(".form-success", { timeout:3000 });
  assert.ok((await page.$eval(".form-success", (node) => node.textContent ?? "")).length > 10);

  await page.goto(`${base}/configurator`, { waitUntil:"domcontentloaded" });
  await new Promise((resolve) => setTimeout(resolve, 700));
  const transformBefore = await page.$eval(".stage-tractor", (node) => node.style.transform);
  await page.$eval('.view-controls button[aria-label="Agrandir"]', (node) => node.click());
  await page.waitForFunction(() => document.querySelector(".stage-tractor")?.getAttribute("style")?.includes("scale(1.1)"));
  const transformAfter = await page.$eval(".stage-tractor", (node) => node.style.transform);
  assert.notEqual(transformAfter, transformBefore, "configurator zoom control is inactive");

  await page.goto(`${base}/account`, { waitUntil:"domcontentloaded" });
  await new Promise((resolve) => setTimeout(resolve, 700));
  assert.equal(await page.$$eval(".account-access form", (forms) => forms.length), 1, "secure account form is missing");
  await page.click(".account-switch");
  assert.match(await page.$eval(".account-access h1", (node) => node.textContent ?? ""), /Créer un compte/);

  for (const route of ["/","/catalog","/parts","/quote-request","/account","/configurator","/legal/privacy","/legal/data-rights","/legal/complaints","/legal/terms","/legal/notices","/legal/cookies","/robots.txt","/sitemap.xml"]) {
    const response = await page.goto(`${base}${route}`, { waitUntil:"domcontentloaded" });
    assert.equal(response?.status(), 200, `${route} did not return 200`);
  }
  assert.deepEqual(consoleErrors, [], `browser console errors:\n${consoleErrors.join("\n")}`);
  console.log("E2E_PASS widths=6 cart=persistent i18n=persistent filters=ok quote=ok account=ok configurator=ok routes=14");
} finally {
  await browser.close();
}
