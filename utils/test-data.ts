import employeeJson from '../data/employee.json';
import type { EmployeeData } from '../models/employee';

export function getEmployeeData(): EmployeeData {
  return employeeJson as EmployeeData;
}
