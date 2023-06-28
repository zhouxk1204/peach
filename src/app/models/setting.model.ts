import { SettingJson } from "../types/index.type";

export class Setting {
  /**
   * 上班工分倍率
   * @type {number}
   */
  workMultiplier: number;

  /**
   * 加班工分倍率
   * @type {number}
   */
  extraMultiplier: number;

  /**
   * 胃2加权系数
   * @type {number}
   */
  specialWeight: number;

  /**
   * 保留小数位数
   * @type {number}
   */
  decimalPlaces: number;

  constructor(data: SettingJson) {
    this.workMultiplier = data.workMultiplier;
    this.extraMultiplier = data.extraMultiplier;
    this.specialWeight = data.specialWeight;
    this.decimalPlaces = data.decimalPlaces;
  }
}
