import { ScrollView, View } from 'react-native'
import React from 'react'
import { AppString } from '../../strings'
import { styles } from './style'
import { RootState } from '../../redux/store'
import { useSelector } from 'react-redux'
import GlobalSafeArea from '../../component/GlobalSafeArea'
import GlobalText from '../../component/GlobalText'
import FastImage from 'react-native-fast-image'

const EditProfileScreen = () => {
  const user = useSelector((state: RootState) => state.userDetails.details);

  return (
    <GlobalSafeArea style={styles.mainContainer} >
      <ScrollView style={styles.scrollerView} >
        <View style={styles.editProfileContainer} >
          <GlobalText style={styles.editProfileText} >{AppString.common.editProfile}</GlobalText>
          <View style={styles.imageContainer} >
            <FastImage
              style={styles.profileIcon}
              source={{ uri: user?.imgUrl }}
              resizeMode={FastImage.resizeMode.cover}
            />
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