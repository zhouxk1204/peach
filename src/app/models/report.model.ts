import Decimal from "decimal.js";
import {
  ROLE,
  TYPE,
  TYPE1,
  TYPE2,
  WEIGHT_SPECIAL_FACTOR,
} from "../constants/commom.constant";
import {
  DayReportJson,
  PointDetailJson,
  EmployeeReportJson,
} from "../types/index.type";
import { getEmployeeById, getTypeWeightByDate } from "../utils/common";
import * as moment from "moment";

export class PointDetail {
  /**
   * 种类1
   * 上班 0
   * 加班 1
   * 休 2
   * @type {number}
   */
  type1: number;
  type1Name: string;

  /**
   * 种类2
   * 其他岗位 0
   * 胃2岗位 1
   * 年休 2
   * 换休 3
   * 事假 4
   * 病假 5
   * 婚假 6
   * 产假 7
   * @type {number}
   */
  type2: number;
  type2Name: string;

  /**
   * 相应种别工分（小时）
   * @type {number}
   */
  point: number;

  /**
   * 相应种别工分倍率
   * @type {number}
   */
  weight: number;

  /**
   * 相应种别工分小计
   * @type {number}
   */
  subtotal: number;

  constructor(data: PointDetailJson) {
    this.type1 = data.type1;
    this.type2 = data.type2;
    this.type1Name = data.type1Name;
    this.type2Name = data.type2Name;
    this.point = data.point;
    this.weight = data.weight;
    this.subtotal = Number(new Decimal(data.point).times(data.weight));
  }
}

export class DailyReport {
  /**
   * 日期
   * @type {Date}
   */
  date: Date;

  /**
   * 当日类型
   * 工作日：0；
   * 周末：1；
   * 法定节假日上班：2；
   * 法定节假日补班：3；
   * @type {number}
   */
  type: number;

  /**
   * 当日类型
   * 工作日：0；
   * 周末：1；
   * 法定节假日上班：2；
   * 法定节假日补班：3；
   * @type {string}
   */
  typeName: string;

  /**
   * 上班工分倍率
   * @type {number}
   */
  workWeight: number;

  /**
   * 加班工分倍率
   * @type {number}
   */
  extraWeight: number;

  /**
   * 当日填写工分记录
   * @type {string}
   */
  label: string; // 工作记录

  /**
   * 工分详细
   * @type {PointDetail}
   */
  pointDetailList: PointDetail[];

  constructor(data: DayReportJson) {
    this.date = moment(data.date).toDate();
    this.label = data.label;
    const { type, workWeight, extraWeight } = getTypeWeightByDate(data.date);
    this.type = type;
    this.typeName =
      Object.values(TYPE).find((e) => e.id === type)?.label ?? "error";
    this.workWeight = workWeight;
    this.extraWeight = extraWeight;
    this.pointDetailList = this.getPointDetailList(data);
  }

  /**
   * 解析填写的工作记录
   * @param label 填写记录
   * @param isWorkday 是否为工作日
   */
  private parseLabel(label: string): PointDetail[] {
    const pointDetailList: PointDetail[] = [];
    // 判断为上班，补班；节假日加班，周末
    const isWorkday = [TYPE.WORKDAY.id, TYPE.HOLIDAY_WORK.id].includes(
      this.type
    );
    // 胃9.5+2
    // 胃9.5
    // 手0+2
    // 手2
    // 9.5
    // 0.5年休
    const [h1 = 0, h2 = 0] = label
      .split("+")
      .map((e) => +e.replace(/[^\d\.]+/g, ""));

    if (label.indexOf("年休") > -1) {
      pointDetailList.push(
        new PointDetail({
          type1: TYPE1.REST.id, // 休
          type2: TYPE2.ANNUAL_LEAVE.id, // 年休
          type1Name: TYPE1.REST.label,
          type2Name: TYPE2.ANNUAL_LEAVE.label,
          point: h1,
          weight: 0,
        })
      );
    } else {
      const type2 =
        label.indexOf("胃") > -1
          ? TYPE2.ATTENDANCE_SPECIAL.id
          : TYPE2.ATTENDANCE_OTHER.id;
      const type2Name =
        label.indexOf("胃") > -1
          ? TYPE2.ATTENDANCE_SPECIAL.label
          : TYPE2.ATTENDANCE_OTHER.label;
      // 是否含有【胃】
      if (isWorkday) {
        pointDetailList.push(
          new PointDetail({
            type1: TYPE1.WORK.id, // 上班
            type2, // 胃2岗位
            type1Name: TYPE1.WORK.label,
            type2Name,
            point: h1,
            weight: this.workWeight,
          })
        );
        pointDetailList.push(
          new PointDetail({
            type1: TYPE1.EXTRA.id, // 加班
            type2, // 胃2岗位
            type1Name: TYPE1.EXTRA.label,
            type2Name,
            point: h2,
            weight: this.extraWeight,
          })
        );
      } else {
        pointDetailList.push(
          new PointDetail({
            type1: TYPE1.EXTRA.id, // 加班
            type2,
            type1Name: TYPE1.EXTRA.label,
            type2Name,
            point: Number(new Decimal(h1).plus(h2)),
            weight: this.extraWeight,
          })
        );
      }
    }
    return pointDetailList;
  }

  get other() {
    return this.getSubTotalByType2(TYPE2.ATTENDANCE_OTHER.id);
  }

  get special() {
    return this.getSubTotalByType2(TYPE2.ATTENDANCE_SPECIAL.id);
  }

  get annual() {
    return Number(
      this.pointDetailList
        .filter((e) => e.type2 === TYPE2.ANNUAL_LEAVE.id)
        .reduce((pre, cur) => {
          return pre.plus(cur.point);
        }, new Decimal(0))
    );
  }

  get total() {
    return new Decimal(this.other).plus(this.special).toNumber();
  }

  /**
   * 获取工作种类列表
   * @param data
   * @returns {PointDetail[]}
   */
  private getPointDetailList(data: DayReportJson): PointDetail[] {
    const { label } = data;
    const type2 = Object.values(TYPE2).findIndex((e) => e.label === label);
    if (type2 > 1) {
      // 如果记录字符串为年休，换休，事假，病假，婚假，产假
      return [
        new PointDetail({
          type1: TYPE1.REST.id, // 休
          type2,
          type1Name: TYPE1.REST.label,
          type2Name: label,
          point: 1, // 算为1天
          weight: 0,
        }),
      ];
    } else {
      // 将记录字符串按斜线 '/' 分割为两部分，去除空字符串（胃9.5+2/手0+2）
      const labels = label.split("/").filter((e) => e.length > 0);
      return labels.length > 0
        ? labels.map((e) => this.parseLabel(e)).flat()
        : [];
    }
  }

  private getSubTotalByType2(type2Id: number): number {
    return this.pointDetailList
      .filter((e) => e.type2 === type2Id)
      .reduce((pre, cur) => {
        return pre.plus(cur.subtotal);
      }, new Decimal(0))
      .toNumber();
  }
}

export class EmployeeReport {
  /**
   * 顺序
   * @type {number}
   */
  workScheduleSort: number;

  /**
   * 职员id
   * @type {string}
   */
  employeeId: string;

  /**
   * 职员姓名
   * @type {string}
   */
  name: string;

  /**
   * 职员系数
   * @type {number}
   */
  factor: number;

  /**
   * 每日工分信息
   * @type {string}
   */
  dailyReportList: DailyReport[];

  /**
   * 科务分
   * @type {number}
   */
  serve: number;

  /**
   * 职位
   * @type {number}
   */
  role: number;

  constructor(data: EmployeeReportJson) {
    this.employeeId = data.employeeId;
    const employee = getEmployeeById(data.employeeId);
    this.name = employee?.name ?? "error";
    this.factor = employee?.factor ?? -1;
    this.workScheduleSort = employee?.workScheduleSort ?? -1;
    this.role = employee?.role ?? -1;
    this.dailyReportList = data.dayReportJsonList.map(
      (e) => new DailyReport(e)
    );
    this.serve = 0;
  }

  /**
   * 设置科务分
   * @param {number} 科务分
   */
  setServe(serve: number): void {
    this.serve = serve;
  }

  get displayServe(): number {
    return this.role === ROLE[1].id
      ? new Decimal(this.serve).times(2).toNumber()
      : 0;
  }

  /**
   * 其他岗位工分合计
   * @returns {number} 其他岗位工分合计
   */
  get other(): number {
    return this.getTotalByField("other");
  }

  /**
   * 胃2岗位工分合计
   * @returns {number} 胃2岗位工分合计
   */
  get special(): number {
    return this.getTotalByField("special");
  }

  /**
   * 年休天数合计
   * @returns {number} 年休天数合计
   */
  get annual(): number {
    return this.getTotalByField("annual");
  }

  /**
   * 工作日天数合计
   * @returns {number} 工作日天数合计
   */
  get workdays(): number {
    return this.dailyReportList
      .filter(
        (e) =>
          !Object.values(TYPE2)
            .map((e) => e.label)
            .slice(2)
            .includes(e.label)
      )
      .filter((e) => [TYPE.HOLIDAY_WORK.id, TYPE.WORKDAY.id].includes(e.type))
      .length;
  }

  /**
   * 工作日天数合计
   * @returns {number} 工作日天数合计
   */
  get attendances(): number {
    return this.dailyReportList.filter(
      (e) =>
        !Object.values(TYPE2)
          .map((e) => e.label)
          .slice(2)
          .includes(e.label)
    ).length;
  }

  /**
   * 总工分合计
   * @returns {number} 总工分合计
   */
  get total(): number {
    return this.dailyReportList
      .map((e) => e.total)
      .reduce((pre, cur) => pre.plus(cur), new Decimal(0))
      .toNumber();
  }

  /**
   * 系数分
   * @returns {number} 系数分
   */
  get score(): number {
    const factorDec = new Decimal(this.factor);
    const s1 = factorDec.times(this.other); // 其他岗位公分 * 系数
    const s2 = factorDec.plus(WEIGHT_SPECIAL_FACTOR).times(this.special); // 胃2岗位公分 * （各自系数+ 胃2加权系数）
    const s3 = new Decimal(this.annual).times(this.serve).div(2); // 年休天数 * 科务分 / 2
    const s4 =
      this.role === ROLE[1].id
        ? factorDec.times(this.serve).times(2)
        : new Decimal(0); // 负责人科务分 * 2 * 系数
    return +s1.plus(s2).plus(s3).plus(s4).toFixed(2);
  }

  /**
   * 根据字段获取合计
   * @param field DailyReport字段
   * @returns {number} 对应合计
   */
  private getTotalByField(field: keyof DailyReport): number {
    return this.dailyReportList
      .reduce((total, report) => {
        const value = report[field];
        if (typeof value === "number") {
          const dec = new Decimal(value);
          if (Decimal.isDecimal(dec)) {
            return total.plus(dec);
          }
        }
        return total;
      }, new Decimal(0))
      .toNumber();
  }
}

export class EmployeeReportSummary {
  employeeReportList: EmployeeReport[] = [];

  addEmployeeReport(employeeReportJson: EmployeeReportJson): void {
    this.employeeReportList.push(new EmployeeReport(employeeReportJson));
    this.setServe();
    this.sortEmployee();
  }

  addEmployeeReportList(employeeReportJsonList: EmployeeReportJson[]): void {
    employeeReportJsonList.forEach((e) => {
      this.employeeReportList.push(new EmployeeReport(e));
    });
    this.setServe();
    this.sortEmployee();
  }

  get other(): number {
    return this.getTotalByKey("other");
  }

  get special(): number {
    return this.getTotalByKey("special");
  }

  get total(): number {
    return this.getTotalByKey("total");
  }

  get workdays(): number {
    return this.getTotalByKey("workdays");
  }

  get attendances(): number {
    return this.getTotalByKey("attendances");
  }

  get serve() {
    // 总工分 / 总工作日（不包含周末和节假日加班）
    return +new Decimal(this.total).div(this.workdays).toNumber().toFixed(2);
  }

  private getTotalByKey(key: keyof EmployeeReport): number {
    return this.employeeReportList
      .reduce((a, b) => a.plus(+b[key]), new Decimal(0))
      .toNumber();
  }

  private sortEmployee() {
    this.employeeReportList.sort(
      (a, b) => a.workScheduleSort - b.workScheduleSort
    );
  }

  private setServe() {
    this.employeeReportList.forEach((e) => {
      e.setServe(this.serve);
    });
  }
}
