export const ROLE = Object.freeze([
  {
    id: 0,
    label: "护士",
  },
  {
    id: 1,
    label: "护士长",
  },
]);

export const STATUS = Object.freeze([
  {
    id: 0,
    label: "在职",
  },
  {
    id: 1,
    label: "离职",
  },
]);

export const GENDER = Object.freeze([
  {
    id: 0,
    label: "女",
  },
  {
    id: 1,
    label: "男",
  },
  {
    id: 2,
    label: "保密",
  },
]);

export const HOLIDAY = Object.freeze([
  {
    id: 0,
    label: "元旦",
  },
  {
    id: 1,
    label: "春节",
  },
  {
    id: 2,
    label: "清明节",
  },
  {
    id: 3,
    label: "劳动节",
  },
  {
    id: 4,
    label: "端午节",
  },
  {
    id: 5,
    label: "中秋节",
  },
  {
    id: 6,
    label: "国庆节",
  },
]);

export const TYPE = {
  WORKDAY: {
    id: 0,
    label: "工作日",
  },
  WEEKEND: {
    id: 1,
    label: "周末",
  },
  HOLIDAY_REST: {
    id: 2,
    label: "节假日放假",
  },
  HOLIDAY_WORK: {
    id: 3,
    label: "节假日补班",
  },
};

export const HOLIDAY_TYPE = Object.freeze([
  {
    id: 0,
    label: "法定节假日",
  },
  {
    id: 1,
    label: "法定节假日补班",
  },
]);

export const TYPE1 = {
  WORK: {
    id: 0,
    label: "上班",
  },
  EXTRA: {
    id: 1,
    label: "加班",
  },
  REST: {
    id: 2,
    label: "休",
  },
};

export const TYPE2 = Object.freeze({
  ATTENDANCE_OTHER: {
    label: "其他岗位",
    id: 0,
  },
  ATTENDANCE_SPECIAL: {
    label: "胃2岗位",
    id: 1,
  },
  LEAVE: {
    label: "补休",
    id: 2,
  },
  ANNUAL_LEAVE: {
    label: "年休",
    id: 3,
  },
  PERSONAL_LEAVE: {
    label: "事假",
    id: 4,
  },
  SICK_LEAVE: {
    label: "病假",
    id: 5,
  },
  MARRIAGE_LEAVE: {
    label: "婚假",
    id: 6,
  },
  MATERNITY_LEAVE: {
    label: "产假",
    id: 7,
  },
});

// export const DEFAULT_WORK_WEIGHT: number = 1;
// export const DEFAULT_EXTRA_WEIGHT: number = 1.5;

// export const WEIGHT_SPECIAL_FACTOR: number = 0.1;
