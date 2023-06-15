import { GENDER, ROLE, STATUS } from "../constants/commom.constant";

export interface EmployeeJson {
  id: string;
  workScheduleSort: number;
  name: string;
  factor: number;
  gender: number;
  role: number;
  status: number;
}

export class Employee {
  /**
   * 员工的唯一标识符
   */
  id: string;

  /**
   * 排班顺序（工作）
   */
  workScheduleSort: number;

  /**
   * 员工名
   */
  name: string;

  /**
   * 员工的系数
   */
  factor: number;

  /**
   * 员工的性别
   */
  gender: number;

  /**
   * 员工的性别
   */
  genderName: string;

  /**
   * 员工的职位
   */
  role: number;

  /**
   * 员工的职位
   */
  roleName: string;

  /**
   * 员工在职状态
   * 0：在职
   * 1：离职
   */
  status: number;
  statusName: string;

  constructor(data: EmployeeJson) {
    this.id = data.id;
    this.name = data.name;
    this.factor = data.factor;
    this.gender = data.gender;
    this.genderName = this.getGenderName(data.gender);
    this.role = data.role;
    this.status = data.status;
    this.statusName = this.getStatusName(data.status);
    this.roleName = this.getRoleName(data.role);
    this.workScheduleSort = data.workScheduleSort;
  }

  getGenderName(gender: number): string {
    return GENDER.find((e) => e.id === gender)?.label ?? "error";
  }

  getRoleName(role: number): string {
    return ROLE.find((e) => e.id === role)?.label ?? "error";
  }

  getStatusName(status: number): string {
    return STATUS.find((e) => e.id === status)?.label ?? "error";
  }
}
