export interface EmployeeData {
  firstName: string;
  lastName: string;
  employeeId: string;
  jobTitle: string;
  employmentStatus: string;
  profilePicturePath: string;
}

export interface ApiEmployee {
  empNumber: number;
  employeeId: string;
  firstName: string;
  lastName: string;
}

export interface ApiJobDetails {
  jobTitle?: { id: number; title?: string; name?: string } | null;
  empStatus?: { id: number; name: string } | null;
}
