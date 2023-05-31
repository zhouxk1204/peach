import * as moment from "moment";
import { HOLIDAY, HOLIDAY_TYPE } from "../constants/commom.constant";

export interface HolidayJson {
  id: string;
  holiday: number;
  type: number;
  date: Date;
  workWeight: number;
  extraWeight: number;
}

export class Holiday {
  /**
   * 假期ID
   */
  id: string;

  /**
   * 假期ID
   */
  holiday: number;

  /**
   * 假期ID
   */
  holidayName: string;

  /**
   * 假期类型ID
   */
  type: number;

  /**
   * 假期类型ID
   */
  typeName: string;

  /**
   * 日期
   */
  date: Date;

  /**
   * 工作权重
   */
  workWeight: number;

  /**
   * 额外权重
   */
  extraWeight: number;

  /**
   * 创建一个节假日
   * @param holidayJson 包含节假日数据的 JSON 对象
   */
  constructor(holidayJson: HolidayJson) {
    this.id = holidayJson.id;
    this.holiday = holidayJson.holiday;
    this.holidayName = this.getHolidayName(holidayJson.holiday);
    this.type = holidayJson.type;
    this.typeName = this.getTypeName(holidayJson.type);
    this.date = holidayJson.date;
    this.workWeight = holidayJson.workWeight;
    this.extraWeight = holidayJson.extraWeight;
  }

  getTypeName(type: number): string {
    return HOLIDAY_TYPE.find((e) => e.id === type)?.label ?? "error";
  }

  getHolidayName(holiday: number): string {
    return HOLIDAY.find((e) => e.id === holiday)?.label ?? "error";
  }

  get dateString() {
    return moment(this.date).format("YYYY-MM-DD");
  }
}
