import React, { useState, useEffect } from "react"
import { Image, ImageBackground, TextInput, View } from "react-native"
import { AppImage } from "../../config/AppImage"
import { AppString } from "../../strings"
import { styles } from "./style"
import ToastUtils from "../../utils/toast"
import { resetPassword } from "../../services/calls/authService"
import GlobalSafeArea from "../../component/GlobalSafeArea"
import GlobalText from "../../component/GlobalText"
import GlobalButton from "../../component/GlobalButton"

const ResetPasswordScreen = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [hasMinLength, setHasMinLength] = useState(false)
  const [hasUppercase, setHasUppercase] = useState(false)
  const [hasLowercase, setHasLowercase] = useState(false)
  const [hasNumberOrSpecial, setHasNumberOrSpecial] = useState(false)

  useEffect(() => {
    setHasMinLength(newPassword.length >= 8)
    setHasUppercase(/[A-Z]/.test(newPassword))
    setHasLowercase(/[a-z]/.test(newPassword))
    setHasNumberOrSpecial(/[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword))
  }, [newPassword])

  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasNumberOrSpecial
  const doPasswordsMatch = newPassword === confirmPassword
  const isButtonEnabled = isPasswordValid && doPasswordsMatch

  const verifyOTP = async () => {
    try {
      const res = await resetPassword(userId, newPassword);
      console.log("reset Password success:", res);
      if (res?.result) {
        ToastUtils.success(res.messageUser)
        navigation.goBack()
      } else {
        ToastUtils.warn(res.messageUser)
      }
    } catch (error: any) {
      console.log("reset Password error:", error);
      ToastUtils.error(`"Error" ${error?.response?.data?.message || "Reset Password failed"}`);
    }
  };

  const handleSave = () => {
    if (!isButtonEnabled) {
      ToastUtils.warn(AppString.common.enterValidDetails)
      return
    }
    verifyOTP();
  }

  return (
    <GlobalSafeArea style={styles.safeArea}>
      <ImageBackground source={AppImage.onboardingBg} style={styles.bgImage}>
        <View style={styles.overlay}>
          <View style={styles.contentBox}>
            <Image style={styles.logoIC} source={AppImage.rajexpresslogo} />

            <View style={styles.titileWithLines}>
              <Image
                style={styles.colorLine}
                source={AppImage.gradient_line_left_to_right}
              />
              <GlobalText style={styles.title}>
                {AppString.common.resetPasswordTitle}
              </GlobalText>
              <Image
                style={styles.colorLine}
                source={AppImage.gradient_line_left_to_right}
              />
            </View>

            <View style={styles.credientialsBox}>
              <GlobalText style={styles.fieldTitle}>
                {AppString.common.enterNewPassword}
              </GlobalText>
              <View style={styles.inputContainer}>
                <View style={styles.inputfieldContainer}>
                  <TextInput
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={[styles.inputField, { borderRadius: 12 }]}
                    placeholder={AppString.common.enterNewPassword}
                  />
                </View>
              </View>

              <GlobalText style={[styles.fieldTitle, { marginTop: 16 }]}>
                {AppString.common.confirmNewPassword}
              </GlobalText>
              <View style={styles.inputContainer}>
                <View style={styles.inputfieldContainer}>
                  <TextInput
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={[styles.inputField, { borderRadius: 12 }]}
                    placeholder={AppString.common.confirmNewPassword}
                  />
                </View>
              </View>

              <GlobalText style={{ marginTop: 16, fontSize: 13 }}>
                {AppString.common.newPasswordMustContain}
              </GlobalText>
              <View style={{ marginTop: 4 }}>
                <GlobalText
                  style={{ color: hasMinLength ? "green" : "red", fontSize: 12 }}
                >
                  {AppString.common.atLeast8Characters}
                </GlobalText>
                <GlobalText
                  style={{ color: hasUppercase ? "green" : "red", fontSize: 12 }}
                >
                  {AppString.common.atLeast1UppercaseCharacter}
                </GlobalText>
                <GlobalText
                  style={{ color: hasLowercase ? "green" : "red", fontSize: 12 }}
                >
                  {AppString.common.atLeast1LowercaseCharacter}
                </GlobalText>
                <GlobalText
                  style={{ color: hasNumberOrSpecial ? "green" : "red", fontSize: 12 }}
                >
                  {AppString.common.atLeast1NumberOrSpecialCharacter}
                </GlobalText>
              </View>
            </View>

            <View style={styles.buttonWrapper}>
              <GlobalButton
                onPress={handleSave}
                disabled={!isButtonEnabled}
                style={[
                  styles.button,
                  { opacity: !isButtonEnabled ? 0.6 : 1 },
                ]}
              >
                <GlobalText style={styles.buttonText}>Save</GlobalText>
              </GlobalButton>
            </View>
          </View>
        </View>
      </ImageBackground>
    </GlobalSafeArea>
  )
}

export default ResetPasswordScreen
