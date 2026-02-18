import { expect, test } from '@playwright/test';

test.describe('Fraction Quest gameplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('starts a game and shows level UI', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Fraction Quest' })).toBeVisible();
    await page.getByTestId('start-game').click();

    await expect(page.getByTestId('level-indicator')).toContainText('Level 1 / 10');
    await expect(page.getByTestId('lives-indicator')).toContainText('Lives: ❤️❤️❤️');
    await expect(page.getByRole('math', { name: 'fraction expression' })).toBeVisible();
  });

  test('invalid input shows helpful feedback', async ({ page }) => {
    await page.getByTestId('start-game').click();
    await page.getByLabel('Your answer').fill('not-a-fraction');
    await page.getByTestId('check-answer').click();

    await expect(page.getByText('Please enter a whole number, decimal, fraction (a/b), or mixed number (2 1/3).')).toBeVisible();
    await expect(page.getByTestId('lives-indicator')).toContainText('Lives: ❤️❤️❤️');
  });

  test('wrong answers reduce lives until game over', async ({ page }) => {
    await page.getByTestId('start-game').click();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await page.getByLabel('Your answer').fill('9999');
      await page.getByTestId('check-answer').click();
    }

    await expect(page.getByRole('heading', { name: 'Game Over 🐻' })).toBeVisible();
    await expect(page.getByTestId('play-again')).toBeVisible();
  });

  test('sound toggle is available', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Mute sound' })).toBeVisible();
    await page.getByRole('button', { name: 'Mute sound' }).click();
    await expect(page.getByRole('button', { name: 'Enable sound' })).toBeVisible();
  });
});
