import { test } from '@playwright/test';
import { OrangeHrmApi } from '../api/orangehrm.api';
import { EmployeePage } from '../pages/employee.page';
import { LoginPage } from '../pages/login.page';
import { getEmployeeData } from '../utils/test-data';

test.describe('Employee lifecycle management', () => {
  test('creates, updates, validates, deletes, and logs out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const employeePage = new EmployeePage(page);
    const employeeApi = new OrangeHrmApi(page.request);
    const employee = getEmployeeData();

    await test.step('Login and verify the dashboard', async () => {
      await loginPage.open();
      await loginPage.login(
        process.env.ORANGEHRM_USERNAME ?? 'Admin',
        process.env.ORANGEHRM_PASSWORD ?? 'admin123',
      );
    });

    let employeeNumber: number;
    await test.step('Create an employee from JSON test data with a profile picture', async () => {
      await employeePage.openAddEmployee();
      employeeNumber = await employeePage.addEmployee(employee);
    });

    await test.step('Search for the employee and update job details', async () => {
      await employeePage.openEmployeeList();
      await employeePage.openEmployeeFromSearch(employee.employeeId);
      await employeePage.updateJobDetails(
        employee.jobTitle,
        employee.employmentStatus,
      );
      await employeePage.assertJobDetails(
        employee.jobTitle,
        employee.employmentStatus,
      );
    });

    await test.step('Cross-check UI values through the authenticated OrangeHRM API', async () => {
      await employeeApi.verifyEmployee(employee, employeeNumber);
    });

    await test.step('Delete the employee and verify deletion through UI and API', async () => {
      await employeePage.openEmployeeList();
      await employeePage.deleteEmployee(employee.employeeId);
      await employeePage.assertEmployeeAbsent(employee.employeeId);
      await employeeApi.verifyEmployeeDeleted(employee.employeeId);
    });

    await test.step('Logout and verify that the session is invalidated', async () => {
      await loginPage.logout();
      await loginPage.assertSessionInvalidated();
    });
  });
});
