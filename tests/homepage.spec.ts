import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/41 Labs/);
  });

  test('should display hero section with main heading', async ({ page }) => {
    const heroHeading = page.locator('.hero h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText('Stop losing revenue to manual processes');
  });

  test('should display hero CTA button', async ({ page }) => {
    const ctaButton = page.locator('.hero-cta .btn-primary');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('Book Your Free');
  });

  test('should display social proof stats', async ({ page }) => {
    const statsSection = page.locator('.social-proof-stats');
    await expect(statsSection).toBeVisible();

    const statItems = page.locator('.stat-item');
    await expect(statItems).toHaveCount(3);
  });

  test('should display problem cards', async ({ page }) => {
    const problemCards = page.locator('.problem-card');
    await expect(problemCards).toHaveCount(3);
  });

  test('should display "What You Get" section', async ({ page }) => {
    const section = page.locator('#what-we-do');
    await expect(section).toBeVisible();

    const heading = section.locator('h2');
    await expect(heading).toContainText('What You Get');
  });

  test('should display process steps', async ({ page }) => {
    const processSteps = page.locator('.process-step');
    await expect(processSteps).toHaveCount(4);
  });

  test('should display use cases', async ({ page }) => {
    const useCases = page.locator('.usecase-card');
    await expect(useCases).toHaveCount(3);
  });

  test('should display trust badges', async ({ page }) => {
    const trustBadges = page.locator('.trust-badge-card');
    await expect(trustBadges).toHaveCount(4);
  });

  test('should display FAQ section', async ({ page }) => {
    const faqSection = page.locator('#faq');
    await expect(faqSection).toBeVisible();

    const faqItems = page.locator('.faq-item');
    expect(await faqItems.count()).toBeGreaterThanOrEqual(5);
  });

  test('should display footer with contact info', async ({ page }) => {
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();

    const email = footer.locator('a[href="mailto:alexander@41labs.ai"]');
    await expect(email).toBeVisible();
  });
});
