import { test, expect } from "@playwright/test";

test.describe("Practice Automation - JavaScript Delays tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/javascript-delays/");
  });

  test("Verify expected text appears in input after JavaScript delay", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Start" }).click();
    await expect(page.locator("#delay")).toHaveValue("Liftoff!", {
      timeout: 15000,
    });
  });
});
