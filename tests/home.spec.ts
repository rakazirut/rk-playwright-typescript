import { test, expect } from "@playwright/test";
import { expectedHomepageButtonText as homePageButtonData } from "../test-data/homePage";

const expectedButtonText = homePageButtonData;

test.describe("Practice Automation - Home Page tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Verify Title contains expected text", async ({ page }) => {
    await expect(page).toHaveTitle(/Practice Automation/);
  });

  test("Verify expected button links appear", async ({ page }) => {
    const actualButtonText = await page
      .locator(".wp-block-buttons")
      .allInnerTexts();
    for (let b of actualButtonText) {
      await expect(expectedButtonText).toContain(b);
    }
  });

  expectedButtonText.forEach((buttonText) => {
    test(`Verify page navigation for ${buttonText} button`, async ({
      page,
    }) => {
      await page.getByRole("link", { name: buttonText }).click();
      if (buttonText === "Sliders" || buttonText === "Carousels") {
        await expect(page.url()).toContain(
          buttonText.slice(0, -1).toLowerCase()
        );
      } else {
        await expect(page.url()).toContain(
          buttonText.replace(" ", "-").toLowerCase()
        );
      }
    });
  });
});
