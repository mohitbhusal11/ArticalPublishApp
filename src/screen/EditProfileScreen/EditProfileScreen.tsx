import { ImageBackground, ScrollView, View } from 'react-native'
import React from 'react'
import { AppString } from '../../strings'
import { styles } from './style'
import { AppImage } from '../../config/AppImage'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'
import { imageBaseURL } from '../../services/api/axiosInstance'
import GlobalSafeArea from '../../component/GlobalSafeArea'
import GlobalText from '../../component/GlobalText'

const EditProfileScreen = () => {
  const user = useSelector((state: RootState) => state.userDetails.details);

  console.log("userName: ", user?.userName);
  const imgUrl = imageBaseURL + user?.imgUrl
  return (
    <GlobalSafeArea style={styles.mainContainer} >
      <ScrollView style={styles.scrollerView} >
        <View style={styles.editProfileContainer} >
          <GlobalText style={styles.editProfileText} >{AppString.common.editProfile}</GlobalText>
          <View style={styles.imageContainer} >
            <ImageBackground
              source={
                user?.imgUrl
                  ? { uri: imgUrl }
                  : AppImage.profile_placeholder_ic
              }
              style={styles.imgStyle}
              imageStyle={styles.imgRadius}
            >
              <View style={styles.overlay} />
            </ImageBackground>
          </View>
          <View style={styles.divider} />
          <GlobalText style={styles.nameTitle} >{AppString.common.name}</GlobalText>
          <GlobalText formatNumber={false} style={styles.userName} >{user?.userName}</GlobalText>
          <GlobalText style={styles.mobileNumberTitile} >{AppString.common.mobileNumber}</GlobalText>
          <GlobalText formatNumber={false} style={styles.mobileNumber} >+91 {user?.mobileNo}</GlobalText>
        </View>
      </ScrollView>
    </GlobalSafeArea>
  )
}

export default EditProfileScreen