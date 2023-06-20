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
    key: "other",
    label: "其他岗位工分",
  },
  {
    key: "special",
    label: "胃2岗位工分",
  },
  {
    key: "total",
    label: "总工分",
  },
  {
    key: "annual",
    label: "年休天数",
  },
  {
    key: "attendances",
    label: "出勤天数",
  },
  {
    key: "workdays",
    label: "工作日天数",
  },
  {
    key: "displayServe",
    label: "科务分",
  },
  {
    key: "score",
    label: "系数分",
  },
];

export const EXPORT_HEADERS = [
  [
    "姓名",
    "系数",
    "其他工分",
    "胃2工分",
    "总工分",
    "工作天数",
    "年假天数",
    "科务分",
    "系数分",
  ],
  ["姓名", "系数", "系数分", "出勤天数"],
];
