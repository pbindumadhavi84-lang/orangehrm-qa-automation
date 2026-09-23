import { expect, type Locator, type Page } from '@playwright/test';
import type { EmployeeData } from '../models/employee';

export class EmployeePage {
  constructor(private readonly page: Page) {}

  async openAddEmployee(): Promise<void> {
     await Promise.all([
    this.page.waitForURL(/\/pim\/viewEmployeeList/, {
      waitUntil: 'domcontentloaded',
    }),
    this.page
      .getByRole('link', { name: 'PIM', exact: true })
      .click(),
  ]);

  const addEmployeeLink = this.page.getByRole('link', {
    name: 'Add Employee',
    exact: true,
  });

  await expect(
    addEmployeeLink,
    'Add Employee navigation link should be visible',
  ).toBeVisible();

  await Promise.all([
    this.page.waitForURL(/\/pim\/addEmployee/, {
      waitUntil: 'domcontentloaded',
    }),
    addEmployeeLink.click(),
  ]);
    await expect(
    this.page.getByRole('heading', {
      name: 'Add Employee',
      exact: true,
    }),
    'Add Employee form should be visible',
    ).toBeVisible();
  }

  async addEmployee(
    employee: EmployeeData,
  ): Promise<number> {
    await this.page.getByPlaceholder('First Name').fill(employee.firstName);
    await this.page.getByPlaceholder('Last Name').fill(employee.lastName);
    await this.inputGroup('Employee Id').locator('input').fill(employee.employeeId);
    await this.page
      .locator('input[type="file"]')
      .setInputFiles(employee.profilePicturePath);
    await this.page.getByRole('button', { name: 'Save' }).click();

    await this.assertSuccessToast();

    await this.page.waitForURL(
      /\/pim\/viewPersonalDetails\/empNumber\/\d+/,
      {
        waitUntil: 'domcontentloaded',
      },
    );

    await expect(
      this.page.getByRole('heading', {
        name: 'Personal Details',
        exact: true,
      }),
      'Personal Details should appear after employee creation',
    ).toBeVisible();

    const match = this.page.url().match(/empNumber\/(\d+)/);
    expect(match, 'Created employee number should be present in the URL').not.toBeNull();
    return Number(match![1]);
  }

  async openEmployeeList(): Promise<void> {
     await Promise.all([
    this.page.waitForURL(/\/pim\/viewEmployeeList/, {
      waitUntil: 'domcontentloaded',
    }),
    this.page
      .getByRole('link', { name: 'PIM', exact: true })
      .click(),
    ]);

    const employeeListLink = this.page.getByRole('link', {name: 'Employee List',exact: true,});

    await expect(employeeListLink,
    'Employee List navigation link should be visible',
    ).toBeVisible();

     await Promise.all([
    this.page.waitForURL(/\/pim\/viewEmployeeList/, {
        waitUntil: 'domcontentloaded',
    }), employeeListLink.click(),
    ]);
    //await this.page.getByRole('link', { name: 'Employee List' }).click();
    await expect(
      this.page.getByRole('heading', { name: 'Employee Information' }),
      'Employee Information search page should be visible',
    ).toBeVisible();
  }

  async searchByEmployeeId(employeeId: string): Promise<Locator> {
    await this.inputGroup('Employee Id').locator('input').fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();

    const row = this.page.locator('.oxd-table-card').filter({ hasText: employeeId });
    await expect(
      row,
      `Employee ${employeeId} should be present in search results`,
    ).toHaveCount(1);
    return row;
  }

  async openEmployeeFromSearch(employeeId: string): Promise<void> {
    const row = await this.searchByEmployeeId(employeeId);
    //await row.locator('button').last().click();
    await row.getByText(employeeId, { exact: true }).click();
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
  }

  async updateJobDetails(jobTitle: string, employmentStatus: string): Promise<void> {
    await this.page.getByRole('link', { name: 'Job', exact: true }).click();
    await expect(
      this.page.getByRole('heading', { name: 'Job Details' }),
      'Job Details form should be visible',
    ).toBeVisible();

    await this.selectOption('Job Title', jobTitle);
    await this.selectOption('Employment Status', employmentStatus);
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.assertSuccessToast();
  }

  async assertJobDetails(jobTitle: string, employmentStatus: string): Promise<void> {
    await expect(
      this.inputGroup('Job Title').locator('.oxd-select-text-input'),
      'Saved job title should be reflected in the UI',
    ).toHaveText(jobTitle);
    await expect(
      this.inputGroup('Employment Status').locator('.oxd-select-text-input'),
      'Saved employment status should be reflected in the UI',
    ).toHaveText(employmentStatus);
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    const row = await this.searchByEmployeeId(employeeId);
    //await row.locator('button').first().click();
    await row.locator('button:has(i.bi-trash)').click();
    await this.page.getByRole('button', { name: /Yes, Delete/i }).click();
    await this.assertSuccessToast();
  }

  async assertEmployeeAbsent(employeeId: string): Promise<void> {
    await this.inputGroup('Employee Id').locator('input').fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();
    const noRecordsMessage = this.page
    .locator('.orangehrm-horizontal-padding')
    .getByText('No Records Found', { exact: true });
    
    await expect(
      noRecordsMessage,
      `Employee ${employeeId} should no longer exist in the UI`,
    ).toBeVisible();
  }

  private inputGroup(label: string): Locator {
    return this.page.locator('.oxd-input-group').filter({
      has: this.page.getByText(label, { exact: true }),
    });
  }

  private async selectOption(label: string, option: string): Promise<void> {
    const group = this.inputGroup(label);
    await group.locator('.oxd-select-text').click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }

  private async assertSuccessToast(): Promise<void> {
    await expect(
      this.page.locator('.oxd-toast').filter({ hasText: 'Success' }),
      'A success notification should confirm the operation',
    ).toBeVisible();
  }
}
