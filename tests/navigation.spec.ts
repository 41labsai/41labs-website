import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display logo in navbar', async ({ page }) => {
    const logo = page.locator('.navbar .logo-img');
    await expect(logo).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    const navLinks = page.locator('.nav-links a');

    await expect(navLinks.nth(0)).toContainText('What We Do');
    await expect(navLinks.nth(1)).toContainText('Case Studies');
    await expect(navLinks.nth(2)).toContainText('About');
    await expect(navLinks.nth(3)).toContainText('Blog');
    await expect(navLinks.nth(4)).toContainText('FAQ');
  });

  test('should have Book a Call CTA in navbar', async ({ page }) => {
    const navCta = page.locator('.nav-cta');
    await expect(navCta).toBeVisible();
    await expect(navCta).toContainText('Book a Call');
  });

  test('should scroll to section when clicking nav link', async ({ page }) => {
    await page.click('.nav-links a[href="#what-we-do"]');

    // Wait for scroll
    await page.waitForTimeout(500);

    const section = page.locator('#what-we-do');
    await expect(section).toBeInViewport();
  });

  test('should scroll to FAQ section', async ({ page }) => {
    await page.click('.nav-links a[href="#faq"]');

    await page.waitForTimeout(500);

    const faqSection = page.locator('#faq');
    await expect(faqSection).toBeInViewport();
  });

  test('should scroll to booking section when clicking CTA', async ({ page }) => {
    await page.click('.nav-cta');

    await page.waitForTimeout(500);

    const bookSection = page.locator('#book-call');
    await expect(bookSection).toBeInViewport();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show mobile menu button on small screens', async ({ page }) => {
    await page.goto('/');

    const mobileMenuBtn = page.locator('.mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();
  });

  test('should hide desktop nav links on mobile', async ({ page }) => {
    await page.goto('/');

    const navLinks = page.locator('.nav-links');
    await expect(navLinks).not.toBeVisible();
  });
});
