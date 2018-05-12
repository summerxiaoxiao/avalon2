import {option, option2} from './example-data'

export default {
  selectedVisualContainerId: null,
  currentSectionId: 1,
  sectionIds: [1],
  visualContainers: {
    1: {
      id: 1,
      type: 'matrix',
      config: JSON.stringify(option),
      width: 812,
      height: 700,
      x: 0,
      y: 0,
      z: 0
    },
    2: {
      id: 2,
      type: 'pie',
      config: JSON.stringify(option2),
      width: 400,
      height: 300,
      x: 819,
      y: 0,
      z: 1
    }
  },
  sections: {
    1: {
      id: 1,
      name: 'test',
      displayName: 'test',
      displayOption: 1,
      viewMode: 1,
      width: 1280,
      height: 720,
      visualContainerIds: [1, 2]
    }
  }
}
