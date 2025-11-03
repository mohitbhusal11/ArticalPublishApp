import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppImage } from '../config/AppImage'
import { AppColor } from '../config/AppColor'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useNavigation } from '@react-navigation/native'
import { imageBaseURL } from '../services/api/axiosInstance'
import GlobalText from './GlobalText'


type TopBarProps = {
    screenName?: String
    secondScreenName?: String
}

const TopBar: React.FC<TopBarProps> = ({ screenName, secondScreenName }) => {
    const user = useSelector((state: RootState) => state.userDetails.details);
    const imgUrl = imageBaseURL + user?.imgUrl
    console.log("userName: ", user?.userName);
    console.log("userBusinessName: ", user?.businessUnitName);
    console.log("userimgUrl: ", imgUrl);
    const navigation = useNavigation()

    const [imgURlhook, setImgURLhook] = useState("")
    useEffect(() => {
        setImgURLhook(imgUrl)
    }, [imgUrl])

    const handleClick = async () => {
        // navigation.navigate("ComplaintDetails", { id: 13 })
        navigation.navigate('EditProfileScreen')
        // navigation.navigate('WorkOrderView')
        // navigation.navigate('ComplainAcceptDetails', { id: 13 })
        // navigation.navigate('TotalUnitList')
        // navigation.navigate('MaterialAddScreen')
    }

    return (
        <View style={styles.mainContainer} >

            <View style={styles.leftSideContainer} >

                <View style={styles.leftBottomContainer} >
                    {/* <Image style={styles.logo} source={AppImage.raj_group_logo} /> */}
                    <View style={styles.verticalDivider} />
                    <GlobalText style={styles.screenNameText} >{screenName} {secondScreenName && '>'}</GlobalText>
                    <GlobalText style={[styles.screenNameText, { color: AppColor.color_ffffff }]} >{secondScreenName}</GlobalText>
                </View>
            </View>
            <TouchableOpacity onPress={handleClick} style={styles.rightSideContainer} >
                <Image style={styles.profileImg} source={
                    user?.imgUrl
                        ? { uri: imgURlhook }
                        : { uri: imgURlhook }

                } />
                <View style={styles.rightSideNameContainer} >
                    <GlobalText formatNumber={false} numberOfLines={1} style={styles.userNameText}>
                        {user?.userName}
                    </GlobalText>

                    <View style={styles.divider} />

                    <GlobalText numberOfLines={1} style={styles.userRole}>
                        {user?.userTypeName}
                    </GlobalText>

                </View>

            </TouchableOpacity>

        </View>
    )
}

export default TopBar

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: AppColor.color_05193B,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 35,
        elevation: 10,
        paddingBottom: 12,
    },
    leftSideContainer: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 12
    },
    rightSideContainer: {
        flexDirection: 'row',
        // flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // marginRight: 12,
        backgroundColor: AppColor.color_D9D9D91A,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        height: 45,
        overflow: 'hidden',
    },
    userNameText: {
        color: AppColor.color_ffffff,
        fontSize: 10,
        fontWeight: 500,
        textAlign: 'left'
    },
    divider: {
        height: 1,
        backgroundColor: AppColor.color_EDEDED40,
        marginTop: 4,
        flex: 1
    },
    leftBottomContainer: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 6,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    logo: {
        width: 32,
        height: 30,
        resizeMode: 'contain',
        tintColor: AppColor.color_ffffff
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: AppColor.color_EDEDED,
    },
    screenNameText: {
        fontSize: 14,
        fontWeight: 300,
        color: AppColor.color_ffffff
    },
    profileImg: {
        width: 45,
        height: 45,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        resizeMode: 'contain'
    },
    rightSideNameContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    userRole: {
        color: AppColor.color_ffffff,
        fontSize: 8,
        fontWeight: 500,
        backgroundColor: AppColor.color_C92A2A,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 3
    }
})