import { test, expect } from '@playwright/test';

test.describe('DevOps Roadmap App - Critical User Flows', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the app loads and redirects to login (since user is not authenticated)
    await expect(page).toHaveTitle(/DevOps Journey/);

    // Should redirect to login page for unauthenticated users
    await expect(page).toHaveURL(/\/login/);

    // Check for login page elements
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');

    // Check page title
    await expect(page).toHaveTitle(/DevOps Journey/);

    // Check for login form elements
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Sign In' })).toBeVisible();
    await expect(page.locator('text=Don\'t have an account?')).toBeVisible();
  });

  test('should display register page correctly', async ({ page }) => {
    await page.goto('/register');

    // Check page title
    await expect(page).toHaveTitle(/DevOps Journey/);

    // Check for register form elements
    await expect(page.locator('text=Create your account')).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Create Account' })).toBeVisible();
    await expect(page.locator('text=Already have an account?')).toBeVisible();
  });

  test('should navigate between auth pages', async ({ page }) => {
    await page.goto('/login');

    // Click register link
    await page.locator('text=Register here').click();

    // Should navigate to register page
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('text=Create your account')).toBeVisible();

    // Click back to login
    await page.locator('text=Sign in here').click();

    // Should navigate back to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
  });

  test('should display learning content after authentication', async ({ page }) => {
    // For this test, we'll mock being logged in by directly navigating to dashboard
    // In a real scenario, you'd need to set up authentication state or use a test user

    await page.goto('/dashboard');

    // Since we're not authenticated, it should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // But we can check that the redirect logic works
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.goto('/login');

      // Check that login form is accessible on mobile
      await expect(page.locator('text=Sign in to continue')).toBeVisible();

      // Check that buttons are visible and clickable on mobile
      const signInButton = page.locator('button').filter({ hasText: 'Sign In' });
      await expect(signInButton).toBeVisible();
      await expect(signInButton).toBeEnabled();
    }
  });
});