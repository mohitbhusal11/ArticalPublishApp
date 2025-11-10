import React, { useState, useEffect } from 'react'
import { Image, ImageBackground, TextInput, View } from 'react-native'
import { AppImage } from '../../config/AppImage'
import { AppString } from '../../strings'
import { styles } from './style'
import ToastUtils from '../../utils/toast'
import { forgotPassword, verifyOtp } from '../../services/calls/authService'
import GlobalSafeArea from '../../component/GlobalSafeArea'
import GlobalText from '../../component/GlobalText'
import GlobalButton from '../../component/GlobalButton'

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [userId, setUserID] = useState("")
  const [otp, setOtp] = useState("")
  const [mobileNumberText, setMobileNumberText] = useState("")
  const [showOtp, setShowOtp] = useState(false)
  const [buttonName, setButtonName] = useState<'Send OTP' | 'Resend'>('Send OTP')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (otp.trim().length === 6) {
      verifyOTP();
    }
  }, [otp])

  useEffect(() => {
    if (timer === 0 && showOtp) {
      setButtonName("Resend")
    }
  }, [timer, showOtp])

  const handleOnClick = () => {
    if (userId.trim().length > 5 && !showOtp) {
      setShowOtp(true)
      setButtonName('Resend')
      setTimer(60 * 5)
      sendOtp();
    } else if (userId.trim().length > 5 && showOtp && timer === 0) {
      setTimer(60 * 5)
      sendOtp()
    } else {
      ToastUtils.warn(AppString.common.enterValidDetails)
    }
  }

  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await forgotPassword(userId);
      console.log("send OTP Response success:", res);
      ToastUtils.success(res.messageUser)
      if (res.result) {
        setMobileNumberText(res.payload.mobile)
      }
    } catch (error: any) {
      console.log("send OTP Response error:", error);
      ToastUtils.error(`"Error" ${error?.response?.data?.message || "send OTP failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (userId.trim().length > 5 && otp.trim().length === 6) {
      setLoading(true);
      try {
        const res = await verifyOtp(userId, otp);
        console.log("verifyOTP success:", res);
        if (res?.result) {
          ToastUtils.success(res.messageUser)
          console.log("verify OTP Response userId:", userId);
          navigation.replace("ResetPasswordScreen", { userId: userId })
        } else {
          ToastUtils.warn(res.messageUser)
        }
      } catch (error: any) {
        console.log("verify OTP error:", error);
        ToastUtils.error(`"Error" ${error?.response?.data?.message || "verify OTP failed"}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const isButtonEnabled = userId.trim().length > 4 && timer === 0

  return (
    <GlobalSafeArea style={styles.safeArea}>
        <ImageBackground source={AppImage.onboardingBg} style={styles.bgImage}>
          <View style={styles.overlay}>
            <View style={styles.contentBox}>
              <Image style={styles.logoIC} source={AppImage.rajexpresslogo} />

              <View style={styles.titileWithLines}>
                <Image style={styles.colorLine} source={AppImage.gradient_line_left_to_right} />
                <GlobalText style={styles.title}>{AppString.common.forgotPasswordTitle}</GlobalText>
                <Image style={styles.colorLine} source={AppImage.gradient_line_left_to_right} />
              </View>

              <View style={styles.credientialsBox}>
                <GlobalText style={styles.fieldTitle}>{AppString.common.userID}</GlobalText>
                <View style={styles.inputContainer}>
                  <View style={styles.fieldIconContainer}>
                    <Image style={styles.fieldIcon} source={AppImage.user_ic} />
                  </View>
                  <View style={styles.inputfieldContainer}>
                    <TextInput
                      onChangeText={setUserID}
                      style={styles.inputField}
                      placeholder={AppString.common.userID}
                      keyboardType="default"
                    />
                  </View>
                </View>

                {showOtp && (
                  <View>
                    <GlobalText style={[styles.fieldTitle, { marginTop: 16 }]}>
                      {AppString.common.enterOtp}
                    </GlobalText>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputfieldContainer}>
                        <TextInput
                          onChangeText={setOtp}
                          maxLength={6}
                          style={[styles.inputField, { borderRadius: 12, }]}
                          placeholder={AppString.common.enterOtp}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                    <GlobalText style={{ fontSize: 12, marginTop: 6, textAlign: "center" }}>
                      {AppString.common.firstPartOfOtpDesc}{" " + mobileNumberText} {" "}{AppString.common.secondPartOfOtpDesc}
                      {timer > 0 ? `(${minutes}:${seconds < 10 ? `0${seconds}` : seconds})` : ""}
                      {" "}{AppString.common.thirdPartOfOtpDesc}
                    </GlobalText>
                  </View>
                )}
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
                    {buttonName}
                  </GlobalText>
                </GlobalButton>
              </View>
            </View>
          </View>
        </ImageBackground>
      </GlobalSafeArea>
  )
}

export default ForgotPasswordScreen
