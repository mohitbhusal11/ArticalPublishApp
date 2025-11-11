import React, { useState } from 'react'
import { AppString } from '../../strings'
import { styles } from './style'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { AppImage } from '../../config/AppImage'
import { persistor, RootState, store } from '../../redux/store'
import { useSelector } from 'react-redux'
import { clearToken } from '../../redux/slices/authSlice'
import { clearUserDetails } from '../../redux/slices/userSlice'
import { imageBaseURL } from '../../services/api/axiosInstance'
import { logout } from '../../services/calls/authService'
import { deleteUserDetails } from '../../services/calls/userService'
import ToastUtils from '../../utils/toast'
import GlobalSafeArea from '../../component/GlobalSafeArea'
import GlobalText from '../../component/GlobalText'
import SettingsRow from '../../component/SettingsRow'
import ConfirmModal from '../../component/ConfirmModal'

const SettingsScreen = ({ navigation }: any) => {
  const user = useSelector((state: RootState) => state.userDetails.details);
  const [isNotificationEnable, setIsNotificationEnable] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);

  console.log(user);
  

  console.log("userName: ", user?.userName);
  console.log("UserMobileNo: ", user?.mobileNo);
  const imgUrl = imageBaseURL + user?.imgUrl

  const handlePushNotificationClick = () => {

  }

  const handleChangePasswordClick = () => {
    navigation.navigate('ChangePasswordScreen')
  }

  const handleEditProfileClick = () => {
    navigation.navigate('EditProfileScreen')
  }

  const logoutUser = async () => {
    try {
      const response = await logout()
      console.log("logout response: ", response);
      setShowLogout(false);
      store.dispatch(clearToken());
      store.dispatch(clearUserDetails());
      await persistor.purge();
    } catch (error) {
      console.log("error: ", error);      
      setShowLogout(false);
    }
  }

  const deleteUser = async () => {
    try {
      console.log("user?.id : ", user?.id);
      const response = await deleteUserDetails(user?.id || 0);
      console.log("deleteUserDetails response: ", response);
      if (!response.user.isActive) {
        setShowDeleteUser(false);
        store.dispatch(clearToken());
        store.dispatch(clearUserDetails());
        await persistor.purge();
      } else {
        setShowDeleteUser(false);
        ToastUtils.error("Something went wrong, please try again later.");
      }

    } catch (error) {
      console.log("error: ", error);
      setShowDeleteUser(false);
    }
  }

  return (
    <GlobalSafeArea style={styles.mainContainer} >
      <ScrollView style={styles.scrollerView} >

        <View style={styles.myProfileView} >
          <View style={styles.leftSideProfileCard} >
            <Image style={styles.profileImage} source={user?.imgUrl
              ? { uri: imgUrl }
              : AppImage.profile_placeholder_ic} />
            <View style={styles.nameAndNumber} >
              {
                user?.userName && <GlobalText formatNumber={false} style={styles.userNameText} >{user?.userName}</GlobalText>
              }
              {
                user?.mobileNo && <GlobalText formatNumber={false} style={styles.userNumber} > +91 {user?.mobileNo}</GlobalText>
              }
            </View>
          </View>
          <View style={styles.rightSideProfileCard} >
            <TouchableOpacity onPress={handleEditProfileClick} >
              <GlobalText style={styles.editProfileText} >{AppString.common.viewProfile}</GlobalText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.moreOptionContainer} >
          <SettingsRow
            icon={AppImage.bottomnavigation_notification_ic}
            title={AppString.common.pushNotification}
            subtitle={AppString.common.pushNotificationDesc}
            showSwitch
            switchValue={isNotificationEnable}
            onSwitchChange={(value) => setIsNotificationEnable(value)}
            onPress={() => {
              handlePushNotificationClick
            }}
          />

          <View style={styles.divider} />

          <SettingsRow
            icon={AppImage.setting_row_password_ic}
            title={AppString.common.changePassword}
            subtitle={AppString.common.changePasswordDesc}
            onPress={
              handleChangePasswordClick
            }
          />

          {/* <View style={styles.divider} />

          <SettingsRow
            icon={AppImage.setting_row_report_ic}
            title={AppString.common.dailyCollectionReport}
            subtitle={AppString.common.dailyCollectionReportDesc}
            onPress={
              handleApprovedSuccessfullyScreen
            }
          /> */}

          <View style={styles.divider} />

          <SettingsRow
            icon={AppImage.delete_user_ic}
            title={AppString.common.DeleteAccount}
            subtitle={AppString.common.deleteAccountDesc}
            onPress={() => setShowDeleteUser(true)}
          />

          <View style={styles.divider} />

          <SettingsRow
            icon={AppImage.setting_row_logout_ic}
            title={AppString.common.logOut}
            onPress={() => setShowLogout(true)}
          />

          <View style={styles.divider} />

        </View>

        <ConfirmModal
          visible={showLogout}
          onConfirm={logoutUser}
          onCancel={() => setShowLogout(false)}
        />

        <ConfirmModal
          visible={showDeleteUser}
          title={AppString.common.DeleteAccount}
          message={AppString.common.deleteAccountDesc}
          onConfirm={deleteUser}
          onCancel={() => setShowDeleteUser(false)}
        />

      </ScrollView>
    </GlobalSafeArea>
  )
}

export default SettingsScreen

