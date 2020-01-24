import { Dimensions } from 'react-native'

let width = Dimensions.get('window').width
let height = Dimensions.get('window').height

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
}
