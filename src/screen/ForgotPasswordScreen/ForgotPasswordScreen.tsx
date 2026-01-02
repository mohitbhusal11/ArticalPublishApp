import React, { useState, useEffect } from 'react'
import { Image, TextInput, View } from 'react-native'
import { AppImage } from '../../config/AppImage'
import { AppString } from '../../strings'
import { styles } from './style'
import ToastUtils from '../../utils/toast'
import { forgotPassword, verifyEmailOtp } from '../../services/calls/authService'
import GlobalSafeArea from '../../component/GlobalSafeArea'
import GlobalText from '../../component/GlobalText'
import GlobalButton from '../../component/GlobalButton'
import { hideLoader, showLoader } from '../../../App'
import { isValidEmail } from '../../utils/mailValidation'

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtp, setShowOtp] = useState(false)
  const [buttonName, setButtonName] = useState<'Send OTP' | 'Resend' | 'Verify OTP'>('Send OTP')
  const [timer, setTimer] = useState(0)
  const [isEmailDisabled, setIsEmailDisabled] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
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
    if (timer === 0 && showOtp) {
      setButtonName("Resend")
    }
  }, [timer, showOtp])

  useEffect(() => {
    if (showOtp) {
      setIsEmailDisabled(true);
      setButtonName('Verify OTP');
    }
  }, [showOtp]);

  const handleOnClick = () => {
    const trimmedEmail = email.trim();

    if (isValidEmail(trimmedEmail) && !showOtp) {
      // Send OTP for valid email (first time)
      setShowOtp(true)
      setButtonName('Verify OTP')
      setTimer(60 * 5)
      sendOtp();
    } else if (isValidEmail(trimmedEmail) && showOtp && timer === 0) {
      // Resend OTP when timer expires
      setTimer(60 * 5)
      sendOtp()
      setButtonName('Verify OTP') // Reset button name after resend
    } else if (showOtp && otp.trim().length === 6 && !isVerifying) {
      // Verify OTP when 6 digits entered
      verifyOTP();
    } else {
      ToastUtils.warn("Please enter a valid email address")
    }
  }

  const sendOtp = async () => {
    const trimmedEmail = email.trim();
    
    try {
      showLoader()
      console.log(trimmedEmail);
      const res = await forgotPassword(trimmedEmail);
      console.log("send OTP Response success:", res);
      
      // Handle the response - only message field exists
      if (res?.message) {
        ToastUtils.success(res.message)
      } else {
        ToastUtils.success("OTP sent to your email")
      }
    } catch (error: any) {
      console.log("send OTP Response error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to send OTP";
      ToastUtils.error(errorMessage);
      
      // If OTP sending fails, reset the OTP state
      setShowOtp(false);
      setIsEmailDisabled(false);
      setButtonName('Send OTP');
      setOtp(""); // Clear OTP field
    } finally {
      hideLoader()
    }
  };

  const verifyOTP = async () => {
    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (isValidEmail(trimmedEmail) && trimmedOtp.length === 6 && !isVerifying) {
      setIsVerifying(true);
      
      try {
        showLoader()
        const res = await verifyEmailOtp(trimmedEmail, trimmedOtp);
        console.log("verifyOTP success:", res);
        
        // Check if verification was successful
        if (res?.statusCode === 200) {
          // Success case
          if (res?.message) {
            ToastUtils.success(res.message)
          } else {
            ToastUtils.success("OTP verified successfully")
          }
          navigation.replace("ResetPasswordScreen", { resetToken: res.resetToken })
        } else {
          // Failed case
          const errorMessage = res?.message || "Invalid OTP";
          ToastUtils.warn(errorMessage);
          setOtp(""); // Clear OTP on failure
        }
      } catch (error: any) {
        console.log("verify OTP error:", error);
        console.log("Error response data:", error?.response?.data);
        console.log("Error status:", error?.response?.status);
        
        let errorMessage = "OTP verification failed";
        
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        ToastUtils.error(errorMessage);
        setOtp(""); // Clear OTP on error
      } finally {
        hideLoader()
        setIsVerifying(false);
      }
    } else {
      if (!isValidEmail(trimmedEmail)) {
        ToastUtils.warn("Please enter a valid email address");
      } else if (trimmedOtp.length !== 6) {
        ToastUtils.warn("Please enter a valid 6-digit OTP");
      }
    }
  };

  const isButtonEnabled = () => {
    const trimmedEmail = email.trim();

    if (!showOtp) {
      // For Send OTP: Only need valid email
      return isValidEmail(trimmedEmail) && !isVerifying
    } else if (showOtp && timer === 0) {
      // For Resend: Need valid email and timer is 0
      return isValidEmail(trimmedEmail) && !isVerifying
    } else {
      // For Verify OTP: Need valid OTP (6 digits) and not currently verifying
      return otp.trim().length === 6 && !isVerifying
    }
  }

  const getButtonText = () => {
    if (!showOtp) {
      return 'Send OTP'
    } else if (showOtp && timer === 0) {
      return 'Resend'
    } else {
      return isVerifying ? 'Verifying...' : 'Verify OTP'
    }
  }

  // Function to format the email for display (mask part of it)
  const formatEmailForDisplay = (email: string) => {
    const [username, domain] = email.split('@');
    if (username && domain) {
      if (username.length <= 3) {
        return `***@${domain}`;
      }
      const firstThree = username.substring(0, 3);
      const stars = '*'.repeat(username.length - 3);
      return `${firstThree}${stars}@${domain}`;
    }
    return email;
  }

  return (
    <GlobalSafeArea style={styles.safeArea}>
      <View style={styles.contentBox}>
        <Image style={styles.logoIC} source={AppImage.rajexpresslogo} />

        <View style={styles.titileWithLines}>
          <Image style={styles.colorLine} source={AppImage.gradient_line_left_to_right} />
          <GlobalText style={styles.title}>{AppString.common.forgotPasswordTitle}</GlobalText>
          <Image style={styles.colorLine} source={AppImage.gradient_line_left_to_right} />
        </View>

        <View style={styles.credientialsBox}>
          <GlobalText style={styles.fieldTitle}>{AppString.common.email}</GlobalText>
          <View style={styles.inputContainer}>
            <View style={styles.fieldIconContainer}>
              <Image style={styles.fieldIcon} source={AppImage.user_ic} />
            </View>
            <View style={styles.inputfieldContainer}>
              <TextInput
                onChangeText={setEmail}
                value={email}
                style={[styles.inputField, isEmailDisabled && styles.disabledInput]}
                placeholder={AppString.common.email}
                keyboardType="email-address"
                editable={!isEmailDisabled}
                selectTextOnFocus={!isEmailDisabled}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999"
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
                    value={otp}
                    maxLength={6}
                    style={[styles.inputField, { borderRadius: 12 }]}
                    placeholder={AppString.common.enterOtp}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                    editable={!isVerifying}
                  />
                </View>
              </View>
              
              <GlobalText style={{ fontSize: 12, marginTop: 6, textAlign: "center", color: '#666' }}>
                {email ? `OTP sent to ${formatEmailForDisplay(email)}` : ''}
                {timer > 0 ? ` • Resend available in ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}` : " • You can resend OTP now"}
              </GlobalText>
            </View>
          )}
        </View>

        <View style={styles.buttonWrapper}>
          <GlobalButton
            onPress={handleOnClick}
            disabled={!isButtonEnabled()}
            style={[
              styles.button,
              { opacity: !isButtonEnabled() ? 0.6 : 1 },
            ]}
          >
            <GlobalText style={styles.buttonText}>
              {getButtonText()}
            </GlobalText>
          </GlobalButton>
        </View>
      </View>
    </GlobalSafeArea>
  )
}

export default ForgotPasswordScreen