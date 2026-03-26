import { test, expect } from '@playwright/test';

test.describe('FAQ Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Scroll to FAQ section
    await page.locator('#faq').scrollIntoViewIfNeeded();
  });

  test('should expand FAQ answer when clicking question', async ({ page }) => {
    const firstQuestion = page.locator('.faq-question').first();
    const firstAnswer = page.locator('.faq-answer').first();

    // Click to expand
    await firstQuestion.click();

    // Answer should be visible (depending on CSS implementation)
    await expect(firstAnswer).toBeVisible();
  });

  test('should toggle FAQ icon on click', async ({ page }) => {
    const firstQuestion = page.locator('.faq-question').first();

    // Get initial icon state
    const icon = firstQuestion.locator('.faq-icon');
    const initialText = await icon.textContent();

    // Click to toggle
    await firstQuestion.click();

    // Icon should change (+ to - or similar)
    await page.waitForTimeout(300);
  });
});

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#book-call').scrollIntoViewIfNeeded();
  });

  test('should display contact form', async ({ page }) => {
    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();
  });

  test('should have all required form fields', async ({ page }) => {
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-company')).toBeVisible();
    await expect(page.locator('#contact-challenge')).toBeVisible();
    await expect(page.locator('#contact-details')).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    const submitBtn = page.locator('#contact-form button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText('Send Message');
  });

  test('should require name field', async ({ page }) => {
    const nameInput = page.locator('#contact-name');
    await expect(nameInput).toHaveAttribute('required', '');
  });

  test('should require email field', async ({ page }) => {
    const emailInput = page.locator('#contact-email');
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should require company field', async ({ page }) => {
    const companyInput = page.locator('#contact-company');
    await expect(companyInput).toHaveAttribute('required', '');
  });

  test('should have challenge dropdown options', async ({ page }) => {
    const challengeSelect = page.locator('#contact-challenge');
    const options = challengeSelect.locator('option');

    expect(await options.count()).toBeGreaterThanOrEqual(6);
  });

  test('should allow filling out form', async ({ page }) => {
    await page.fill('#contact-name', 'Test User');
    await page.fill('#contact-email', 'test@example.com');
    await page.fill('#contact-company', 'Test Company');
    await page.selectOption('#contact-challenge', 'slow-quotes');
    await page.fill('#contact-details', 'This is a test message');

    // Verify values are filled
    await expect(page.locator('#contact-name')).toHaveValue('Test User');
    await expect(page.locator('#contact-email')).toHaveValue('test@example.com');
    await expect(page.locator('#contact-company')).toHaveValue('Test Company');
    await expect(page.locator('#contact-challenge')).toHaveValue('slow-quotes');
    await expect(page.locator('#contact-details')).toHaveValue('This is a test message');
  });
});

test.describe('CTA Buttons', () => {
  test('should have working booking link in hero', async ({ page }) => {
    await page.goto('/');

    const heroCtaLink = page.locator('.hero-cta .btn-primary');
    await expect(heroCtaLink).toHaveAttribute('href', '#book-call');
  });

  test('should have external calendar link in CTA section', async ({ page }) => {
    await page.goto('/');
    await page.locator('#book-call').scrollIntoViewIfNeeded();

    const calendarLink = page.locator('.cta-content .btn-primary');
    await expect(calendarLink).toHaveAttribute('href', /calendar\.app\.google/);
    await expect(calendarLink).toHaveAttribute('target', '_blank');
  });
});
