import { VISUAL_TYPES } from '../../../api/constant'

export default {
  [VISUAL_TYPES.TABLE]: require('../../../assets/visualWatermark/table.svg'),
  [VISUAL_TYPES.MATRIX]: require('../../../assets/visualWatermark/matrix.svg'),
  [VISUAL_TYPES.COLUMN]: require('../../../assets/visualWatermark/column.svg'),
  [VISUAL_TYPES.LINE]: require('../../../assets/visualWatermark/line.svg'),
  [VISUAL_TYPES.LINE_STACKED_COLUMN_COMBO]: require('../../../assets/visualWatermark/combo.svg'),
  [VISUAL_TYPES.PIE]: require('../../../assets/visualWatermark/pie.svg'),
  [VISUAL_TYPES.MAP]: require('../../../assets/visualWatermark/map.svg'),
  [VISUAL_TYPES.GAUGE]: require('../../../assets/visualWatermark/gauge.svg'),
  [VISUAL_TYPES.SLICER]: require('../../../assets/visualWatermark/slicer.svg'),
  [VISUAL_TYPES.CARD]: require('../../../assets/visualWatermark/card.svg')
}
