
import { test as base } from '@playwright/test';
import { PlaywrightAiFixture, PlayWrightAiFixtureType } from "@midscene/web";

export const test = base.extend<PlayWrightAiFixtureType>(PlaywrightAiFixture());

test.beforeEach(async ({ page }) => {
  page.setViewportSize({ width: 1280, height: 1000 });
});

test("Valencia", async ({ page, ai, aiQuery, aiAssert }) => {
  const urls = [
    "https://www.facebook.com/photo/?fbid=3446691682292938&set=gm.7473728146085296&idorvanity=260151250776391",
  "https://www.facebook.com/photo/?fbid=9670714172956535&set=gm.1290992678816826&idorvanity=457552105494225&locale=es_ES",
  "https://www.facebook.com/photo/?fbid=8955711397823971&set=a.1998772063517974&locale=es_ES",
  ]
  let events = []
  for (const url of urls) {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const event = await aiQuery(
      "{infoUrl: string, name: string, date: Date, organizerName:string, startTime:string, endTime:string, locationName:string, salsaPercentage: number, bachataPercentage:string, kizombaPercentage:string}, give me the salsa, bachata, kizomba social data. We are in the year 2024. If there is no information about the percentage of salsa, bachata, kizomba, give me 40% salsa, 60% bachata, 0% kizomba."
    );
    events.push(event);
  }
  console.log("events", events);
});

