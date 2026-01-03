import { test, expect } from '@playwright/test';

test.describe('DevOps Roadmap App - Critical User Flows', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the app loads
    await expect(page).toHaveTitle(/DevOps Roadmap/);

    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate between main sections', async ({ page }) => {
    await page.goto('/');

    // Check if navigation links exist (these would need to be updated based on actual nav structure)
    const navLinks = page.locator('nav a');

    // At minimum, we should have some navigation elements
    await expect(navLinks.first()).toBeVisible();
  });

  test('should handle user authentication flow', async ({ page }) => {
    await page.goto('/');

    // Look for login/register elements
    // This test would need to be updated based on actual auth implementation
    const loginButton = page.locator('text=Login').or(page.locator('text=Sign In'));
    const registerButton = page.locator('text=Register').or(page.locator('text=Sign Up'));

    // Check that at least one auth option is visible
    await expect(loginButton.or(registerButton)).toBeVisible();
  });

  test('should display learning content', async ({ page }) => {
    await page.goto('/');

    // Check for learning-related content
    const learningContent = page.locator('text=Training').or(page.locator('text=Learn')).or(page.locator('text=Course'));

    // Should have some learning content visible
    await expect(learningContent).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.goto('/');

      // Check that navigation is accessible on mobile
      await expect(page.locator('nav')).toBeVisible();

      // Check that content is readable on mobile viewport
      const mainContent = page.locator('main').or(page.locator('[role="main"]')).or(page.locator('.app'));
      await expect(mainContent).toBeVisible();
    }
  });
});</content>
<parameter name="filePath">c:\Users\ayode\Desktop\devops-roadmap-app\client\e2e\app.spec.ts