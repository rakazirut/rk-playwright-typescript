import { test, expect, Page } from "@playwright/test";

/**
 * Fills the name field on the page with the specified name.
 * @param {Page} page - The Playwright page object.
 * @param {string} name - The name to be filled in the field.
 * @returns {Promise<void>} - A promise that resolves when the name field is filled.
 */
async function fillNameField(page: Page, name: string) {
  await page.fill("#name", name);
}

/**
 * Fills the email field on the page with the specified email.
 * @param {Page} page - The Playwright page object.
 * @param {string} email - The email to be filled in the field.
 * @returns {Promise<void>} - A promise that resolves when the email field is filled.
 */
async function fillEmailField(page: Page, email: string) {
  await page.fill("#email", email);
}

/**
 * Fills the message field on the page with the provided email.
 * @param {Page} page - The Playwright page object.
 * @param {string} email - The email to fill in the message field.
 * @returns {Promise<void>} - A promise that resolves when the message field is filled.
 */
async function fillMessageField(page: Page, email: string) {
  await page.fill("#message", email);
}

/**
 * Clicks the submit button on the page.
 * @param {Page} page - The Playwright page object.
 * @returns {Promise<void>} - A promise that resolves when the button is clicked.
 */
async function clickSubmitButton(page: Page) {
  await page.getByRole("button", { name: "Submit" }).click();
}

/**
 * Selects favorite drink(s) on a given page.
 * 
 * @param {Page} page - The Playwright page object.
 * @param {("Water" | "Milk" | "Coffee" | "Wine" | "Ctrl-Alt-Delight")[]} drink - The favorite drink(s) to select.
 * @returns {Promise<void>} - A promise that resolves when the drink(s) are selected.
 */
async function selectFavoriteDrink(
  page: Page,
  drink: ("Water" | "Milk" | "Coffee" | "Wine" | "Ctrl-Alt-Delight")[]
) {
  for (let d of drink) {
    await page.getByLabel(d, { exact: true }).click();
  }
}

/**
 * Selects the favorite color on the page.
 * 
 * @param {Page} page - The Playwright page object.
 * @param {string} color - The color to select. Can be one of "Red", "Blue", "Yellow", "Green", or "#FFC0CB".
 * @returns {Promise<void>} - A promise that resolves once the color is selected.
 */
async function selectFavoriteColor(
  page: Page,
  color: "Red" | "Blue" | "Yellow" | "Green" | "#FFC0CB"
) {
  await page.getByLabel(color, { exact: true }).click();
}

/**
 * Selects the specified option for the siblings field on the page.
 * 
 * @param {Page} page - The Playwright page object.
 * @param {string} siblings - The option to select for the siblings field. Must be one of "Yes", "No", or "Maybe".
 * @returns {Promise<void>} - A promise that resolves once the option is selected.
 */
async function selectSiblings(page: Page, siblings: "Yes" | "No" | "Maybe") {
  await page.selectOption("#siblings", siblings);
}

const testName = "John Doe";
const testEmail = "john@example.com";
const testMessage = "Hello, World!";

test.describe("Practice Automation - Form Fields tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/form-fields/");
  });

  test("Verify filling name field", async ({ page }) => {
    await fillNameField(page, testName);
    await expect(page.locator("#name")).toHaveValue(testName);
  });

  test("Verify filling email field", async ({ page }) => {
    await fillEmailField(page, testEmail);
    await expect(page.locator("#email")).toHaveValue(testEmail);
  });

  test("Verify filling message field", async ({ page }) => {
    await fillMessageField(page, testMessage);
    await expect(page.locator("#message")).toHaveValue(testMessage);
  });

  test("Verify selecting favorite drink", async ({ page }) => {
    await selectFavoriteDrink(page, ["Water", "Milk", "Coffee"]);
    await expect(page.getByLabel("Water")).toBeChecked();
    await expect(page.getByLabel("Milk")).toBeChecked();
    await expect(page.getByLabel("Coffee")).toBeChecked();
    await expect(page.getByLabel("Wine")).not.toBeChecked();
    await expect(page.getByLabel("Ctrl-Alt-Delight")).not.toBeChecked();
  });

  test("Verify selecting favorite color", async ({ page }) => {
    await selectFavoriteColor(page, "Red");
    await expect(page.getByLabel("Red", { exact: true })).toBeChecked();
    await expect(page.getByLabel("Blue", { exact: true })).not.toBeChecked();
    await expect(page.getByLabel("Yellow", { exact: true })).not.toBeChecked();
    await expect(page.getByLabel("Green", { exact: true })).not.toBeChecked();
    await expect(page.getByLabel("#FFC0CB", { exact: true })).not.toBeChecked();
  });

  test("Verify selecting siblings", async ({ page }) => {
    await selectSiblings(page, "Yes");
    await expect(page.locator("#siblings")).toHaveValue("yes");
    await selectSiblings(page, "No");
    await expect(page.locator("#siblings")).toHaveValue("no");
    await selectSiblings(page, "Maybe");
    await expect(page.locator("#siblings")).toHaveValue("maybe");
  });

  test("Verify submitting completed form", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      await expect(dialog.message()).toBe("Message received!");
      await dialog.accept();
    });
    await fillNameField(page, testName);
    await fillEmailField(page, testEmail);
    await fillMessageField(page, testMessage);
    await selectFavoriteDrink(page, ["Water", "Milk", "Coffee"]);
    await selectFavoriteColor(page, "Red");
    await selectSiblings(page, "Yes");
    await clickSubmitButton(page);
  });
});
