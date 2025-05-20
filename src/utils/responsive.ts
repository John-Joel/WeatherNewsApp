import { Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number): number =>
  (width / guidelineBaseWidth) * size;

export const verticalScale = (size: number): number =>
  (height / guidelineBaseHeight) * size;

export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

export { wp, hp };
