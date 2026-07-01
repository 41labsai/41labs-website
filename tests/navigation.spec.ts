import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  // Desktop nav is hidden behind the hamburger on small screens, so pin these
  // to a desktop viewport (the Mobile Navigation block below covers small screens).
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display logo in navbar', async ({ page }) => {
    const logo = page.locator('.navbar .logo-img');
    await expect(logo).toBeVisible();
  });

  test('should have top-level navigation items', async ({ page }) => {
    const nav = page.locator('.nav-links');

    await expect(nav.getByRole('link', { name: '41 Closer' })).toBeVisible();
    await expect(nav.locator('.nav-dropdown-trigger', { hasText: 'Solutions' })).toBeVisible();
    await expect(nav.locator('.nav-dropdown-trigger', { hasText: 'Industries' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Case Studies' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Events' })).toBeVisible();
  });

  test('should have WhatsApp CTA in navbar', async ({ page }) => {
    const navCta = page.locator('.nav-cta');
    await expect(navCta).toBeVisible();
    await expect(navCta).toContainText('WhatsApp');
    await expect(navCta).toHaveAttribute('href', /wa\.me/);
    await expect(navCta).toHaveAttribute('target', '_blank');
  });

  test('flagship "41 Closer" nav link points to the Closer page', async ({ page }) => {
    const closer = page.locator('.nav-links').getByRole('link', { name: '41 Closer' });
    await expect(closer).toHaveAttribute('href', /41-closer/);
  });

  test('Case Studies nav link navigates to the case studies page', async ({ page }) => {
    await page.locator('.nav-links').getByRole('link', { name: 'Case Studies' }).click();
    await expect(page).toHaveURL(/case-studies/);
  });

  test('key homepage sections are present', async ({ page }) => {
    await expect(page.locator('#what-we-do')).toBeAttached();
    await expect(page.locator('#faq')).toBeAttached();
    await expect(page.locator('#book-call')).toBeAttached();
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
