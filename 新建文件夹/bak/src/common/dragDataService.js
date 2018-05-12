export class DragDataService {
  setDragElement (element) {
    this.dragElement = element
  }
  setDragContext (context) {
    this.dragContext = context
  }
  getDragElement () {
    return this.dragElement
  }
  getDragContext () {
    return this.dragContext
  }
}

export default new DragDataService()

