import { TableHeader } from "src/app/types/index.type";

export const reportTableHeaders: TableHeader[] = [
  {
    key: "name",
    label: "姓名",
  },
  {
    key: "factor",
    label: "系数",
  },
  {
    key: "totalOtherWorkPoint",
    label: "其他岗位(上班)",
  },
  {
    key: "totalOtherExtraPoint",
    label: "其他岗位(加班)",
  },
  {
    key: "other",
    label: "其他岗位总工分",
  },
  {
    key: "totalSpecialWorkPoint",
    label: "胃2岗位(上班)",
  },
  {
    key: "totalSpecialExtraPoint",
    label: "胃2岗位(加班)",
  },
  {
    key: "special",
    label: "胃2岗位总工分",
  },
  {
    key: "score",
    label: "时间工分",
  },
  {
    key: "annual",
    label: "年休天数",
  },
  {
    key: "attendances",
    label: "出勤天数（包含周末节假日）",
  },
  {
    key: "serveDay",
    label: "科务天数",
  },
  // {
  //   key: "workdays",
  //   label: "工作日天数",
  // },
  // {
  //   key: "displayServe",
  //   label: "科务分",
  // },
  // {
  //   key: "score",
  //   label: "系数分",
  // },
];

export const EXPORT_HEADERS = [
  [
    "姓名",
    "系数",
    "其他岗位工分",
    "胃2岗位工分",
    "时间总工分",
    "时间总工分系数分",
    "本月出勤天数",
    "本月年假天数",
    "科务天数",
  ],
];
