import { Platform, ToastAndroid } from 'react-native';
import Toast, { ToastPosition } from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  title?: string;
  duration?: number;
  position?: ToastPosition;
  autoHide?: boolean;
  onPress?: () => void;
  numberOfLines?: number;
}

class ToastUtils {
  static success(options: ToastOptions | string): void {
    const toastOptions = typeof options === 'string' 
      ? { message: options } 
      : options;
    
    this.showToast({
      type: 'success',
      title: 'Success',
      ...toastOptions
    });
  }

  static error(options: ToastOptions | string): void {
    const toastOptions = typeof options === 'string' 
      ? { message: options } 
      : options;
    
    this.showToast({
      type: 'error',
      title: 'Error',
      ...toastOptions
    });
  }

  static warn(options: ToastOptions | string): void {
    const toastOptions = typeof options === 'string' 
      ? { message: options } 
      : options;
    
    this.showToast({
      type: 'warning',
      title: 'Warning',
      ...toastOptions
    });
  }

  static info(options: ToastOptions | string): void {
    const toastOptions = typeof options === 'string' 
      ? { message: options } 
      : options;
    
    this.showToast({
      type: 'info',
      title: 'Info',
      ...toastOptions
    });
  }

  private static showToast(options: ToastOptions & { type: ToastType }): void {
    const {
      type,
      message,
      title = type.charAt(0).toUpperCase() + type.slice(1),
      duration = 4000,
      position = 'bottom',
      autoHide = true,
      onPress,
      numberOfLines = 0 
    } = options;

    if (Platform.OS === 'android' && !onPress) {
      if (message.length > 100) {
        Toast.show({
          type,
          text1: title,
          text2: message,
          visibilityTime: Math.max(duration, 5000), 
          position: position,
          autoHide,
          onPress,
          props: {
            type,
            numberOfLines
          }
        });
      } else {
        Toast.show({
          type,
          text1: title,
          text2: message,
          visibilityTime: Math.max(duration, 2000), 
          position: position,
          autoHide,
          onPress,
          props: {
            type,
            numberOfLines
          }
        });
      }
    } else {
      Toast.show({
        type,
        text1: title,
        text2: message,
        visibilityTime: duration,
        position: position,
        autoHide,
        onPress,
        props: {
          type,
          numberOfLines
        }
      });
    }
  }

  private static getAndroidGravity(position: ToastPosition): number {
    switch (position) {
      case 'top':
        return ToastAndroid.TOP;
      default:
        return ToastAndroid.BOTTOM;
    }
  }

  static hide(): void {
    Toast.hide();
  }
}

export default ToastUtils;