export type EmployeeJson = {
  id: string;
  workScheduleSort: number;
  name: string;
  factor: number;
  gender: number;
  role: number;
};

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
   * 员工的职位
   */
  role: number;

  constructor(data: EmployeeJson) {
    this.id = data.id;
    this.name = data.name;
    this.factor = data.factor;
    this.gender = data.gender;
    this.role = data.role;
    this.workScheduleSort = data.workScheduleSort;
  }
}
