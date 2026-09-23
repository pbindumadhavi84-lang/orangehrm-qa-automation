import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/web/index.php/auth/login');
    await expect(
      this.page.getByRole('heading', { name: 'Login' }),
      'The OrangeHRM login page should be visible',
    ).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();

    await expect(
      this.page.getByRole('heading', { name: 'Dashboard' }),
      'Dashboard should be visible after login',
    ).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.locator('.oxd-userdropdown-tab').click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(
      this.page.getByRole('heading', { name: 'Login' }),
      'Login page should be visible after logout',
    ).toBeVisible();
  }

  async assertSessionInvalidated(): Promise<void> {
    await this.page.goto('/web/index.php/dashboard/index');
    await expect(
      this.page,
      'Opening a protected page after logout should redirect to login',
    ).toHaveURL(/\/auth\/login/);
  }
}
