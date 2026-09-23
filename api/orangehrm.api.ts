import { expect, type APIRequestContext } from '@playwright/test';
import type { ApiEmployee, ApiJobDetails, EmployeeData } from '../models/employee';

interface CollectionResponse<T> {
  data: T[];
}

interface ItemResponse<T> {
  data: T;
}

export class OrangeHrmApi {
  constructor(private readonly request: APIRequestContext) {}

  async verifyEmployee(employee: EmployeeData, expectedEmpNumber: number): Promise<void> {
    const record = await this.findEmployee(employee.employeeId);

    expect(record, `API should return employee ${employee.employeeId}`).toBeDefined();
    expect(record!.empNumber, 'API and UI employee numbers should match').toBe(
      expectedEmpNumber,
    );
    expect(record!.firstName, 'API first name should match UI input').toBe(
      employee.firstName,
    );
    expect(record!.lastName, 'API last name should match UI input').toBe(
      employee.lastName,
    );

    const response = await this.request.get(
      `/web/index.php/api/v2/pim/employees/${expectedEmpNumber}/job-details`,
    );
    expect(response.ok(), 'Job-details API should return a successful response').toBeTruthy();

    const body = (await response.json()) as ItemResponse<ApiJobDetails>;
    const apiJobTitle = body.data.jobTitle?.title ?? body.data.jobTitle?.name;
    expect(apiJobTitle, 'API job title should match the UI').toBe(employee.jobTitle);
    expect(
      body.data.empStatus?.name,
      'API employment status should match the UI',
    ).toBe(employee.employmentStatus);
  }

  async verifyEmployeeDeleted(employeeId: string): Promise<void> {
    const employee = await this.findEmployee(employeeId);
    expect(employee, `API should not return deleted employee ${employeeId}`).toBeUndefined();
  }

  private async findEmployee(employeeId: string): Promise<ApiEmployee | undefined> {
    const response = await this.request.get('/web/index.php/api/v2/pim/employees', {
      params: {
        limit: 50,
        offset: 0,
        model: 'detailed',
        employeeId,
        includeEmployees: 'onlyCurrent',
        sortField: 'employee.firstName',
        sortOrder: 'ASC',
      },
    });
    expect(response.ok(), 'Employee search API should return a successful response').toBeTruthy();

    const body = (await response.json()) as CollectionResponse<ApiEmployee>;
    return body.data.find((item) => item.employeeId === employeeId);
  }
}
