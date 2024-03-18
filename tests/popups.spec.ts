import { test, expect, Page } from "@playwright/test";

/**
 * Handles the alert popup on the given page.
 *
 * @param {Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves once the alert popup is handled.
 */
async function handleAlertPopup(page: Page) {
  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toBe("Hi there, pal!");
    await dialog.accept();
  });
}

/**
 * Handles the confirmation popup on a page.
 *
 * @param {Page} page - The Playwright page object.
 * @param {boolean} accept - Determines whether to accept or dismiss the popup.
 * @returns {Promise<void>} - A promise that resolves once the popup is handled.
 */
async function handleConfirmPopup(page: Page, accept: boolean) {
  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toBe("OK or Cancel, which will it be?");
    accept ? await dialog.accept() : await dialog.dismiss();
  });
}

/**
 * Handles the prompt popup on a page.
 *
 * @param {Page} page - The Playwright page object.
 * @param {boolean} accept - Determines whether to accept or dismiss the prompt popup.
 * @param {string} [input] - The input value to be entered in the prompt popup.
 * @returns {Promise<void>} - A promise that resolves once the prompt popup is handled.
 */
async function handlePromptPopup(page: Page, accept: boolean, input?: string) {
  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toBe("Hi there, what's your name?");
    if (input) {
      await dialog.accept(input);
    } else {
      accept ? await dialog.accept() : await dialog.dismiss();
    }
  });
}

test.describe("Practice Automation - Popups tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/popups/");
  });

  test("Verify expected text appears for Alert Popup", async ({ page }) => {
    await handleAlertPopup(page);
    await page.getByRole("button", { name: "Alert Popup" }).click();
  });

  test("Verify expected text appears for Confirm Popup when clicking OK", async ({
    page,
  }) => {
    await handleConfirmPopup(page, true);
    await page.getByRole("button", { name: "Confirm Popup" }).click();
    await expect(page.locator("#confirmResult")).toHaveText("OK it is!");
  });

  test("Verify expected text appears for Confirm Popup when clicking Cancel", async ({
    page,
  }) => {
    await handleConfirmPopup(page, false);
    await page.getByRole("button", { name: "Confirm Popup" }).click();
    await expect(page.locator("#confirmResult")).toHaveText("Cancel it is!");
  });

  test("Verify expected text appears for Prompt Popup when clicking OK and providing input", async ({
    page,
  }) => {
    const promptText = "Test";
    await handlePromptPopup(page, true, promptText);
    await page.getByRole("button", { name: "Prompt Popup" }).click();
    await expect(page.locator("#promptResult")).toHaveText(
      `Nice to meet you, ${promptText}!`
    );
  });

  test("Verify expected text appears for Prompt Popup when clicking OK and not providing input", async ({
    page,
  }) => {
    await handlePromptPopup(page, true);
    await page.getByRole("button", { name: "Prompt Popup" }).click();
    await expect(page.locator("#promptResult")).toHaveText(
      "Fine, be that way..."
    );
  });

  test("Verify expected text appears for Prompt Popup when clicking Cancel", async ({
    page,
  }) => {
    await handlePromptPopup(page, false);
    await page.getByRole("button", { name: "Prompt Popup" }).click();
    await expect(page.locator("#promptResult")).toHaveText(
      "Fine, be that way..."
    );
  });

  test("Verify tooltip appears and has the correct text", async ({ page }) => {
    await page.locator(".tooltip_1").click();
    await expect(page.locator("#myTooltip")).toBeVisible();
    await expect(page.locator("#myTooltip")).toHaveText("Cool text");
  });
});
