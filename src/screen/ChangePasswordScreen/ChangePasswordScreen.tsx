import React, { useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'

import { AppString } from '../../strings'
import ToastUtils from '../../utils/toast'
import { changePassword } from '../../services/calls/authService'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import GlobalSafeArea from '../../component/GlobalSafeArea'
import { styles } from './style'
import GlobalText from '../../component/GlobalText'

const ChangePasswordScreen = ({ navigation }: any) => {

  const user = useSelector((state: RootState) => state.userDetails.details);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isButtonEnabled = oldPassword.trim().length > 7 && newPassword.trim().length > 7 && confirmPassword.trim() === newPassword.trim()

  const validatePassword = () => {

    if (newPassword === oldPassword) {
      ToastUtils.warn(AppString.common.Newpasswordcannotbesameasoldpassword);
      return;
    }
    handleChangePassword();
  };

  const handleChangePassword = async () => {
    try {
        console.log("userName change password: ", user?.userName);
      const res = await changePassword(user?.userName, newPassword, oldPassword);
      console.log("Change Password success:", res);
      if (res?.result) {
        ToastUtils.success(res.messageUser)
        navigation.goBack()
      } else {
        ToastUtils.warn(res.messageUser)
      }
    } catch (error: any) {
      console.log("Change Password error:", error);
      ToastUtils.error(`"Error" ${error?.response?.data?.message || "Change Password failed"}`);
    }
  };

  return (

    <GlobalSafeArea style={styles.safeArea}>

      <View style={styles.mainContainer}>

        <GlobalText style={styles.containerBlueRoundView}>{AppString.common.changePassword}</GlobalText>

        <View style={styles.card}>

          <GlobalText style={styles.cardTitle}>{AppString.common.OldPassword}</GlobalText>

          <TextInput style={styles.passwordInput} placeholder={AppString.common.EnterOldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={true} />

          <GlobalText style={styles.cardTitle}>{AppString.common.NewPassword}</GlobalText>
          <TextInput style={styles.passwordInput} placeholder={AppString.common.enterNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true} />

          <GlobalText style={styles.cardTitle}>{AppString.common.ConfirmPassword}</GlobalText>

          <TextInput style={styles.passwordInput} placeholder={AppString.common.EnterConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true} />

          <TouchableOpacity style={[styles.Btn, { opacity: !isButtonEnabled ? 0.6 : 1 }]} onPress={() => validatePassword()}
            disabled={!isButtonEnabled}
          >
            <GlobalText style={styles.btnText}>{AppString.common.Save}</GlobalText>
          </TouchableOpacity>

        </View>
      </View>
    </GlobalSafeArea>
  )
}

export default ChangePasswordScreen
