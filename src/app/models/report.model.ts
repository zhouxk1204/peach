import { TYPE, TYPE1, TYPE2 } from "../constants/commom.constant";

export interface DayJson {
  type: number;
  date: Date;
  workWeight: number;
  extraWeight: number;
}

export interface DayReportJson {
  day: DayJson;
  type: number; // 工作日，周末，法定节假日
  label: string;
  detail: Detail;
}

export interface DetailItemJson {
  hour: number;
  type1: number; // 上班，加班, 休
  type2: number; // 普通，胃2，年休，换休，事假，病假，婚假，产假
  weight: number;
}

export class DetailItem {
  hour: number;
  type1: number; // 上班，加班, 休
  type2: number; // 普通，胃2，年休，换休，事假，病假，婚假，产假
  weight: number;

  constructor(data: DetailItemJson) {
    this.hour = data.hour;
    this.type1 = data.type1;
    this.type2 = data.type2;
    this.weight = data.weight;
  }
}

export class Day {
  type: number; // 工作日，周末，法定节假日
  date: Date;
  workWeight: number;
  extraWeight: number;

  constructor(data: DayJson) {
    this.type = data.type; // 工作日，周末，法定节假日
    this.date = data.date;
    this.workWeight = data.workWeight;
    this.extraWeight = data.extraWeight;
  }
}

export class Detail {
  detailItemList: Array<DetailItem> = [];

  constructor() {
    this.detailItemList = [];
  }

  addDetailItem(detailItem: DetailItemJson) {
    this.detailItemList.push(new DetailItem(detailItem));
  }
}

export class DayReport {
  day: Day;
  type: number; // 工作日，周末，法定节假日
  label: string;
  detail: Detail;

  constructor(data: DayReportJson) {
    this.day = new Day(data.day);
    this.label = data.label;
    this.type = data.type; // 工作日，周末，法定节假日, 0, 1, 2
    this.detail = this.getDetail(data);
  }

  private getDetail(data: DayReportJson) {
    const { label } = data;

    const detail = new Detail();
    const type2 = Object.values(TYPE2).findIndex((e) => e.label === label);

    if (type2 > 1) {
      // 如果记录字符串为年休，换休，事假，病假，婚假，产假
      detail.addDetailItem({
        type1: TYPE1.REST, // 休
        type2,
        hour: 0,
        weight: 0,
      });
    } else {
      // 胃9.5+2/手0+2
      const labels = label.split("/").filter((e) => e.length > 0); // 将记录字符串按斜线 '/' 分割为两部分，去除空字符串

      if (labels.length > 0) {
        labels.forEach(() => {
          this.parseLabel(label, detail);
        });
      }
    }
    return detail;
  }

  /**
   *
   * @param label 填写记录
   * @param isWorkday 是否为工作日
   */
  private parseLabel(label: string, detail: Detail): void {
    const isWorkday = ![TYPE.WEEKEND, TYPE.HOLIDAY].includes(this.type); // 判断为上班，补班；节假日加班，周末
    // 胃9.5+2
    // 胃9.5
    // 手0+2
    // 手2
    // 9.5
    const [h1 = 0, h2 = 0] = label
      .split("+")
      .map((e) => +e.replace(/[^\d\.]+/g, ""));

    // 是否含有【胃】
    if (label.indexOf("胃") > -1) {
      if (isWorkday) {
        detail.addDetailItem(
          new DetailItem({
            type1: TYPE1.WORK, // 上班
            type2: TYPE2.ATTENDANCE_SPECIAL.id, // 胃2岗位
            hour: h1,
            weight: 1,
          })
        );
        detail.addDetailItem(
          new DetailItem({
            type1: TYPE1.EXTRA, // 加班
            type2: TYPE2.ATTENDANCE_SPECIAL.id, // 胃2岗位
            hour: h2,
            weight: 1.5,
          })
        );
      } else {
        [
          {
            type1: 1, // 加班
            type2: 1, // 胃2岗位
            hour: h1 + h2,
            weight: 1.5,
          },
        ];
      }
    }
  }
}
