import * as moment from "moment";
import { TYPE } from "../constants/commom.constant";
import { HolidayJson } from "../models/holiday.model";
import { SettingJson, TypeWeight } from "../types/index.type";
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
    workWeight: getSettingByKey("workMultiplier"),
    extraWeight: getSettingByKey("extraMultiplier"),
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

/**
 * 生成指定长度和行号的 Excel 列范围。
 * @param start_index 要生成范围的起始列的索引值。
 * @param length 要生成的列数。
 * @param row 要生成范围的行号。
 * @returns 表示 Excel 列范围的字符串。
 */
export function generateExcelColumnRange(
  start_index: number,
  length: number,
  row: number
): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let end_index = start_index + length - 1;
  let end_column = "";

  // 如果结束列在 A 到 Z 范围内，直接用对应的字母表示
  if (end_index < 26) {
    end_column = letters[end_index];
  } else {
    // 如果结束列不在 A 到 Z 范围内，需要用多个字母来表示列名
    const quotient = Math.floor(end_index / 26);
    const remainder = end_index % 26;
    if (remainder === 0) {
      end_column = letters[quotient - 2] + letters[25];
    } else {
      end_column = letters[quotient - 1] + letters[remainder - 1];
    }
  }

  // 返回生成的 Excel 列范围字符串
  return `${letters[start_index]}${row}:${end_column}${row}`;
}

export function getSettingByKey(key: keyof SettingJson): number {
  const local = localStorage.getItem("setting") ?? "";
  if (local.length > 0) {
    const data = JSON.parse(local) as SettingJson;
    return data[key];
  } else {
    return {
      workMultiplier: 1,
      extraMultiplier: 1.5,
      specialWeight: 0.1,
      decimalPlaces: 2,
    }[key];
  }
}
