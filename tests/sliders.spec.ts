import { test, expect, Page } from "@playwright/test";

/**
 * Sets the value of a slider element on a page.
 * 
 * @param {Page} page - The Playwright page object.
 * @param {string} sliderId - The ID of the slider element.
 * @param {number} valueAsPercent - The desired value of the slider as a percentage.
 * @param {number} currentSliderValue - The current value of the slider as a percentage.
 * @returns {Promise<void>} - A promise that resolves when the slider value is set.
 */
async function setSliderValue(
  page: Page,
  sliderId: string,
  valueAsPercent: number,
  currentSliderValue: number
) {
  // Find the slider element using the provided ID and obtain its bounding box
  const sliderBound = await page.locator(sliderId).boundingBox();

  if (!sliderBound) {
    return null;
  }

  // Calculate the target X and Y coordinates for the mouse cursor based on the current slider value
  const targetX =
    sliderBound.x + (sliderBound.width * currentSliderValue) / 100;
  const targetY = sliderBound.y + sliderBound.height / 2;

  // Move the mouse cursor to the calculated position
  await page.mouse.move(targetX, targetY);

  // Simulate a mouse click by pressing the mouse button
  await page.mouse.down();

  // Move the mouse cursor to the desired position by the provided valueAsPercent
  await page.mouse.move(
    sliderBound.x + (sliderBound.width * valueAsPercent) / 100,
    sliderBound.y + sliderBound.height / 2
  );

  // Release the mouse button to complete the interaction
  await page.mouse.up();
}

test.describe("Practice Automation - Slider tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/slider/");
  });

  test("Verify slider value can be increased", async ({ page }) => {
    const initialValue = parseInt(await page.locator("#value").innerText(), 10);
    await setSliderValue(page, "#slideMe", 80, initialValue);
    const currentValue = parseInt(await page.locator("#value").innerText(), 10);
    expect(currentValue).toBeGreaterThan(initialValue);
  });

  test("Verify slider value can be decreased", async ({ page }) => {
    const initialValue = parseInt(await page.locator("#value").innerText(), 10);
    await setSliderValue(page, "#slideMe", 10, initialValue);
    const currentValue = parseInt(await page.locator("#value").innerText(), 10);
    expect(currentValue).toBeLessThan(initialValue);
  });
});
