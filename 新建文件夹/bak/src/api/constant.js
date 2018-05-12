function fipEnum (obj) {
  const keys = Object.keys(obj)
  keys.forEach(key => {
    obj[obj[key]] = key.replace(/_/g, '-').toLowerCase()
  })
}

export const VISUAL_TYPES = {
  TABLE: 1,
  MATRIX: 2,
  COLUMN: 3,
  LINE: 4,
  LINE_STACKED_COLUMN_COMBO: 5,
  PIE: 6,
  GAUGE: 7,
  MAP: 8,
  CARD: 9,
  SLICER: 10,
  TEXTBOX: 50,
  IMAGEBOX: 52,
  BASE_SHAPE: 51
}
fipEnum(VISUAL_TYPES)

export const BUCKET_ROLES = {
  VALUE: '01',
  ROW: '11',
  COLUMN: '12'
}

export const PROPERTY_TYPES = {
  TEXT: 1,
  DATE: 2,
  NUMBER: 3
}

export const PROPERTY_GROUP_TYPES = {
  GROUP: '0', // 组
  LEVEL: '1' // 层次
}

export const FORMAT_FIELD_TYPES = {
  INTEGER: '1',
  NUMBER: '2',
  TEXT: '3',
  BOOLEAN: '4',
  ENUM: '5',
  LIST: '6',
  PROPERTY: '61',
  UNIT: '62',
  COLOR: '7',
  FONT: '8',
  RANGE: '11',
  ACTION_RESTORE: '01',
  ACTION_EDIT: '02',
  ACTION_DELETE: '03',
  ACTION_CONFIRM: '04',
  ACTION_CANCEL: '05',
  RAW: '20'
}

export const MENU_ACTION_VALUE_MAP = {
  0: '无',
  1: '求和',
  2: '最小值',
  3: '最大值',
  4: '平均值',
  5: '第一条',
  6: '最后一条',
  20: '计数',
  21: '去重计数'
}

export const FORMAT_TYPES = {
  REPORT_VIEW: '50',
  REPORT_VIEW_CURRENT_SECTION: '5005',
  REPORT_VIEW_SHOW_GRID: '5002',
  REPORT_VIEW_ADJUST_GRID: '5003',

  SECTION_VIEW: '50',
  SECTION_VIEW_MODE: '5001',
  SECTION_VIEW_CURRENT_POP_OUT: '5006',

  SECTION_SIZE: '49',
  SECTION_SIZE_TYPE: '4901',
  SECTION_WIDTH: '4902',
  SECTION_HEIGHT: '4903',

  GENERAL: '01',
  GENERAL_X: '0101',
  GENERAL_Y: '0102',
  GENERAL_WIDTH: '0103',
  GENERAL_HEIGHT: '0104',

  TITLE_CARD: '02',
  TITLE: '0201',
  TITLE_TEXT: '020101',
  TITLE_COLOR: '020102',
  TITLE_BACKGROUND_COLOR: '020103',
  TITLE_ALIGN: '020104',
  TITLE_FONT_FAMILY: '020105',
  TITLE_FONT_SIZE: '020106',

  BORDER_CARD: '04',
  BORDER: '0401',
  BORDER_COLOR: '040101',
  BORDER_WIDTH: '040102',

  BACKGROUND_CARD: '03',
  BACKGROUND: '0301',
  BACKGROUND_COLOR: '030101',
  BACKGROUND_TRANSPARENCY: '030102',

  TEXT: '82',
  TEXT_VALUE: '8201',

  EXTEND: '61',
  EXTEND_QUERY_MODE: '6110',

  LEVEL: '63',
  LEVEL_ROW: '6301',
  LEVEL_COLUMN: '6302',

  BASE_SHAPE_TYPE_CARD: '72',
  BASE_SHAPE_TYPE: '7201',

  BASE_SHAPE_LINE: '45',
  BASE_SHAPE_LINE_COLOR: '4501',
  BASE_SHAPE_LINE_TRANSPARENCY: '4502',
  BASE_SHAPE_LINE_WEIGHT: '4503',
  BASE_SHAPE_LINE_ROUND_EDGE: '4504',

  BASE_SHAPE_FILL: '46',
  BASE_SHAPE_FILL_COLOR: '4601',
  BASE_SHAPE_FILL_TRANSPARENCY: '4602',

  BASE_SHAPE_ANGLE_CARD: '47',
  BASE_SHAPE_ANGLE: '4701',

  PROPERTY: '17',
  PROPERTY_CONFIG_ENABLE: '170100',

  SLICER_HEADER: '40',
  SLICER_HEADER_SHOW: '4001',
  SLICER_HEADER_FONT_COLOR: '400101',
  SLICER_HEADER_FONT_FAMILY: '400102',
  SLICER_HEADER_FONT_SIZE: '400103',

  SLICER_CONTROL: '41',
  SLICER_CONTROL_SHOW_CHECK_ALL: '4101',
  SLICER_CONTROL_ALLOW_MULTIPLE: '4102',

  SLICER_ITEM: '42',
  SLICER_ITEM_FONT_COLOR: '4201',
  SLICER_ITEM_FONT_FAMILY: '4202',
  SLICER_ITEM_FONT_SIZE: '4203',

  SLICER_INPUT: '43',
  SLICER_INPUT_FONT_COLOR: '4301',
  SLICER_INPUT_FONT_FAMILY: '4302',
  SLICER_INPUT_FONT_SIZE: '4303',

  SLICER_SLIDER: '44',
  SLICER_SLIDER_SHOW: '4401',
  SLIDER_SLIDER_COLOR: '440101',

  SLICER_TYPE: '68',
  SLICER_TYPE_VALUE: '6801',

  SLICER_VALUE: '81',
  SLICER_VALUE_CONDITION: '8101',
  SLICER_VALUE_EQ: '810101',
  SLICER_VALUE_EGT: '810102',
  SLICER_VALUE_ELT: '810103'
}

export const SLICER_TYPE = {
  LIST: '0',
  DROPDOWN: '1',
  INPUT_BETWEEN: '2',
  INPUT_EGT: '3',
  INPUT_ELT: '4'
}

export const FORMAT_TEXT_ALIGN_MAP = {
  '0': 'left',
  '1': 'center',
  '2': 'right'
}

export const SECTION_SIZE_MAP = {
  '1': [1600, 900],
  '2': [1600, 1200],
  '3': [600, 900],
  '4': [1280, 720]
}

export const FORMAT_GENERAL_DEFAULT_VALUES = {
  X: 80,
  Y: 80,
  WIDTH: 400,
  HEIGHT: 400
}

export const QUERY_TYPE = {
  JH: 1,
  NORMAL: 2
}

export const SORT_TYPE = {
  DEFAULT: 0,
  ASC: 1, // 升序
  DESC: 2, // 降序
  MANUAL: 3 // 手动
}

export const VIEW_MODE = {
  VIEW: 0,
  EDIT: 1
}

export const RESIZE_MODE = {
  RESIZING: 1,
  RESIZED: 2
}

export const PROPERTY_KIND_DATASET = 'dataset'
export const PROPERTY_KIND_FIELD = 'field'
export const PROPERTY_KIND_FILTER = 'filter'

export const FILTER_TYPE_BASE = 'base'
export const FILTER_TYPE_ADVANCED = 'advanced'

export const FORMAT_PROPERTY_EXTRA = {
  DEFAULT: 0,
  ALL: 1,
  TEXT_DATE: 2,
  NUMBER: 3
}

export const OPERATOR = {
  INCLUDE: '1',
  EXCLUDE: '2',
  STARTS_WITH: '3',
  ENDS_WITH: '4',
  EQ: '5',
  NEQ: '6',
  EMPTY: '7',
  NOT_EMPTY: '8',

  LT: '1',
  ELT: '2',
  GT: '3',
  EGT: '4'
}

export const TEXT_OPERATOR_LIST = [
  {value: '1', name: '包含'},
  {value: '2', name: '不包含'},
  {value: '3', name: '开头是'},
  {value: '4', name: '开头不是'},
  {value: '5', name: '等于'},
  {value: '6', name: '不等于'},
  {value: '7', name: '为空'},
  {value: '8', name: '不为空'}
]

export const DATE_OPERATOR_LIST = [
  {value: '1', name: '晚于'},
  {value: '2', name: '晚于或等于'},
  {value: '3', name: '早于'},
  {value: '4', name: '早于或等于'},
  {value: '5', name: '等于'},
  {value: '6', name: '不等于'},
  {value: '7', name: '为空'},
  {value: '8', name: '不为空'}
]

export const NUMBER_OPERATOR_LIST = [
  {value: '1', name: '小于'},
  {value: '2', name: '小于或等于'},
  {value: '3', name: '大于'},
  {value: '4', name: '大于或等于'},
  {value: '5', name: '等于'},
  {value: '6', name: '不等于'},
  {value: '7', name: '为空'},
  {value: '8', name: '不为空'}
]

export const BASE_SHAPE = {
  RECTANGLE: 0, // 方形
  OVAL: 1, // 圆形
  LINE: 2, // 线
  TRIANGLE: 3 // 三角形
}

export const DROP_ACTION = {
  NONE: 0,
  REPLACE: 1,
  PREPEND: 2,
  APPEND: 3
}

export const DROP_POSITION = {
  ABOVE: 0, // 上方
  BELOW: 1 // 下方
}

export const OPERATOR_AND = '0'
export const OPERATOR_OR = '1'

export const ENABLE_JH = true

export const VISUAL_TYPE_LIST = [
  {type: 'table', title: '单维表', value: VISUAL_TYPES.TABLE, visible: true},
  {type: 'matrix', title: '多维表', value: VISUAL_TYPES.MATRIX, visible: true},
  {type: 'textbox', title: '文本框', value: VISUAL_TYPES.TEXTBOX, visible: false},
  {type: 'base-shape', title: '形状', value: VISUAL_TYPES.BASE_SHAPE, visible: false},
  /*
  ,
  {type: 'column', title: '柱型图', value: VISUAL_TYPES.COLUMN},
  {type: 'line', title: '折线图', value: VISUAL_TYPES.LINE},
  {type: 'pie', title: '构成图', value: VISUAL_TYPES.PIE}
  ,
  {type: 'line-stacked-column-combo', title: '组合图'},
  */
  /*
  {type: 'map', title: '地理图'},
  {type: 'gauge', title: '仪表图'},
  {type: 'card', title: '卡片图'},
  */
  {type: 'slicer', title: '过滤器', value: VISUAL_TYPES.SLICER, visible: true}
]

