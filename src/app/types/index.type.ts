import { EmployeeJson } from "../models/employee.model";

export interface TypeWeight {
  type: number;
  workWeight: number;
  extraWeight: number;
}

export interface TableHeader {
  key: string;
  label: string;
}

export interface DayType {
  id: string;
  name: string;
}

export interface PointDetailJson {
  type1: number;
  type2: number;
  type1Name: string;
  type2Name: string;
  point: number;
  weight: number;
}

export interface DayReportJson {
  date: Date;
  label: string;
}

export interface EmployeeReportJson {
  employeeId: string;
  dayReportJsonList: DayReportJson[];
}
