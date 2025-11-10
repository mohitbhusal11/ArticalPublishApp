import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform
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

const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [userId, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState('');

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
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isButtonEnabled = userId.trim().length > 4 && password.trim().length >= 8;

  return (
    <GlobalSafeArea style={styles.safeArea}>
      <ImageBackground source={AppImage.onboardingBg} style={styles.bgImage}>
        {/* Don’t use absoluteFillObject here */}
        <View style={styles.overlay}>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.contentBox}>
                <Image style={styles.logoIC} source={AppImage.rajexpresslogo} />

                <View style={styles.titileWithLines}>
                  <Image
                    style={styles.colorLine}
                    source={AppImage.gradient_line_left_to_right}
                  />
                  <GlobalText style={styles.title}>
                    {AppString.common.enterYourCredentials}
                  </GlobalText>
                  <Image
                    style={styles.colorLine}
                    source={AppImage.gradient_line_left_to_right}
                  />
                </View>

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
                      style={styles.inputField}
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
                      style={styles.inputField}
                      placeholder={AppString.common.enterYourPassword}
                      secureTextEntry={true}
                      placeholderTextColor="#9a9a9a"
                    />
                  </View>

                  <View style={styles.otherOthers}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPasswordScreen")}
                      style={styles.forgotPasswordContainer}
                    >
                      <GlobalText style={styles.forgotPasswordText}>
                        {AppString.common.forgotPassword}
                      </GlobalText>
                    </TouchableOpacity>
                  </View>
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
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </GlobalSafeArea>
  )
};

export default LoginScreen;
