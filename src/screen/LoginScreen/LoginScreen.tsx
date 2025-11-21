import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native';
import { AppImage } from '../../config/AppImage';
import { styles } from './style';
import { AppString } from '../../strings';
import { useDispatch } from 'react-redux';
import ToastUtils from '../../utils/toast';
import { login } from '../../services/calls/authService';
import { requestUserNotificationPermission } from '../../notifications/permission';
import DeviceInfo from 'react-native-device-info';
import GlobalSafeArea from '../../component/GlobalSafeArea';
import GlobalText from '../../component/GlobalText';
import GlobalButton from '../../component/GlobalButton';
import LottieView from 'lottie-react-native';
import { AppLottie } from '../../config/AppLottie';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [userId, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [showPassword, setShowPassword] = useState(false)

  const validateInputs = () => {
    if (userId.trim().length === 0) {
      ToastUtils.warn('User ID is required');
      return false;
    }
    if (password.trim().length < 8) {
      ToastUtils.warn('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  useEffect(() => {
    requestUserNotificationPermission();
  }, []);

  useEffect(() => {
    const loadDeviceId = async () => {
      try {
        const uniqueId = await DeviceInfo.getUniqueId();
        setDeviceId(uniqueId);
      } catch (error) {
        console.log("error: ", error);

        setDeviceId('');
      }
    };
    loadDeviceId();
  }, []);

  const handleOnClick = async () => {
    if (!validateInputs()) return;
    try {
      setLoading(true);
      const res = await dispatch<any>(login(userId, password, 'fcmToken', deviceId));
      ToastUtils.success('Login successful! response: ', res);
      setLoading(false);
    } catch (error) {
      console.log('Login error:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const isButtonEnabled = userId.trim().length > 4 && password.trim().length >= 8;

  return (
    <GlobalSafeArea style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentBox}>
          <Image style={styles.logoIC} source={AppImage.rajexpresslogo} />

          <GlobalText style={styles.title}>
            {AppString.common.signIn}
          </GlobalText>

          <View style={styles.credientialsBox}>
            <GlobalText style={styles.fieldTitle}>
              {AppString.common.userID}
            </GlobalText>
            <View style={styles.inputContainer}>
              <View style={styles.fieldIconContainer}>
                <Image style={styles.fieldIcon} source={AppImage.user_ic} />
              </View>
              <TextInput
                onChangeText={setUserID}
                style={[styles.inputField, { borderTopRightRadius: 12, borderBottomRightRadius: 12 }]}
                placeholder={AppString.common.enterYourID}
                placeholderTextColor="#9a9a9a"
              />
            </View>

            <GlobalText style={[styles.fieldTitle, { marginTop: 16 }]}>
              {AppString.common.password}
            </GlobalText>
            <View style={styles.inputContainer}>
              <View style={styles.fieldIconContainer}>
                <Image style={styles.fieldIcon} source={AppImage.password_ic} />
              </View>
              <TextInput
                onChangeText={setPassword}
                style={[styles.inputField, { borderRightWidth: 0 }]}
                placeholder={AppString.common.enterYourPassword}
                secureTextEntry={!showPassword
                }
                placeholderTextColor="#9a9a9a"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.hideShowPasswordContainer}>
                <Image style={styles.fieldIcon} source={showPassword ? AppImage.hide_password_ic : AppImage.show_password_ic} />
              </Pressable>
            </View>

            {/* <View style={styles.otherOthers}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPasswordScreen")}
                style={styles.forgotPasswordContainer}
              >
                <GlobalText style={styles.forgotPasswordText}>
                  {AppString.common.forgotPassword}
                </GlobalText>
              </TouchableOpacity>
            </View> */}
          </View>

          <View style={styles.buttonWrapper}>
            <GlobalButton
              onPress={handleOnClick}
              disabled={!isButtonEnabled || loading}
              style={[
                styles.button,
                { opacity: !isButtonEnabled || loading ? 0.6 : 1 },
              ]}
            >
              <GlobalText style={styles.buttonText}>
                {AppString.common.continue}
              </GlobalText>
            </GlobalButton>
          </View>

          <LottieView
            source={AppLottie.login_screen_lottie}
            autoPlay
            loop
            style={{ height: 250 }}
          />
        </View>
        {loading && (
          <View style={styles.loaderOverlay}>
            <LottieView
              source={AppLottie.loader}
              autoPlay
              loop
              style={{ width: 50, height: 50 }}
            />
          </View>
        )}
      </ScrollView>
    </GlobalSafeArea>
  )
};

export default LoginScreen;
