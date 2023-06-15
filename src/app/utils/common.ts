import * as moment from "moment";
import {
  DEFAULT_EXTRA_WEIGHT,
  DEFAULT_WORK_WEIGHT,
  TYPE,
} from "../constants/commom.constant";
import { HolidayJson } from "../models/holiday.model";
import { TypeWeight } from "../types/index.type";
import { Employee, EmployeeJson } from "../models/employee.model";

/**
 * 根据职员id获取职员信息
 * @param {Date} date 日期
 * @returns {Employee | undefined} 职员
 */
export function getTypeWeightByDate(date: Date): TypeWeight {
  const local = localStorage.getItem("holidayList") ?? "";
  const momentDate = moment(date);
  if (local.length > 0) {
    const holidayJsonList = JSON.parse(local) as HolidayJson[];
    const holidayJson = holidayJsonList.find((e) =>
      moment(e.date).isSame(momentDate, "day")
    );

    if (holidayJson) {
      const { workWeight, extraWeight, type } = holidayJson;
      return {
        type: [TYPE.HOLIDAY_REST.id, TYPE.HOLIDAY_WORK.id][type],
        workWeight,
        extraWeight,
      };
    }
  }

  const isWeekend = momentDate.day() === 0 || momentDate.day() === 6;
  return {
    type: isWeekend ? 1 : 0,
    workWeight: DEFAULT_WORK_WEIGHT,
    extraWeight: DEFAULT_EXTRA_WEIGHT,
  };
}

/**
 * 根据职员id获取职员信息
 * @param {string} id 职员id
 * @returns {Employee | undefined} 职员
 */
export function getEmployeeById(id: string): Employee | undefined {
  const local = localStorage.getItem("employeeList") ?? "";
  if (local.length > 0) {
    const employeeJsonList = JSON.parse(local) as EmployeeJson[];
    const employeeJson = employeeJsonList.find((e) => e.id === id);
    if (employeeJson) {
      return new Employee(employeeJson);
    }
  }
  return undefined;
}
