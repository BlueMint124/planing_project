import { expect, test } from "@playwright/test";

test("polished demo flow edits inputs, generates, shares, and loads the shared page", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1000);

  await page.locator(".compact-options input").nth(2).check();
  await expect(page.locator(".compact-options .option-button").nth(2)).toHaveClass(
    /selected/,
  );
  await page.locator(".style-options input").nth(1).check();
  await page.locator(".style-options input").nth(0).uncheck();
  await page.locator(".member-card").first().locator("input").nth(0).fill("지민");
  await page
    .locator(".member-card")
    .first()
    .locator("input")
    .nth(1)
    .fill("카페, 사진");
  await page.locator(".member-card").first().locator("input").nth(2).fill("등산");

  await page.locator(".primary-button").click();
  await expect(page.locator(".result-panel")).toBeVisible();
  await expect(page.locator(".map-card")).toBeVisible();

  await page.locator(".share-card .secondary-button").nth(0).click();
  await expect(page.locator(".result-panel")).toBeVisible();

  await page.locator(".share-card .secondary-button").nth(1).click();
  const shareUrl = await page.locator(".share-url").textContent();
  expect(shareUrl).toContain("/share/trip_demo_jeju_001");

  await page.goto(shareUrl!);
  await expect(page.locator(".result-panel")).toBeVisible();
  await expect(page.locator(".trip-id")).toHaveText("trip_demo_jeju_001");
});
