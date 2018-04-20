import request from '@/utils/api'
class YkqkService {
  static getInstance () {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }
}

export default YkqkService.getInstance()

