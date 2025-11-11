import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    scrollerView: {
        flexGrow: 1,
        backgroundColor: AppColor.color_F5F5F5
    },

    myProfileView: {
        backgroundColor: AppColor.color_ffffff,
        borderRadius: 10,
        elevation: 5,
        marginTop: 30,
        marginHorizontal: 15,
        padding: 15,
        flexDirection: 'row'
    },

    leftSideProfileCard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    rightSideProfileCard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 150,
        resizeMode: 'cover',
    },
    nameAndNumber: {
        flexGrow: 1,
        flexDirection: 'column',
        marginLeft: 12
    },
    userNameText: {
        fontSize: 12,
        fontWeight: 700,
        color: AppColor.mainColor
    },

    userNumber: {
        fontSize: 10,
        fontWeight: 700,
        color: AppColor.mainColor
    },
    editProfileText: {
        fontSize: 10,
        fontWeight: 700,
        color: AppColor.mainColor
    },
    moreOptionContainer: {
        marginTop: 20,
        backgroundColor: AppColor.color_ffffff,
        marginHorizontal: 15,
        flexDirection: 'column',
        paddingVertical: 15,
        borderRadius: 10,
        elevation: 5,
    },

    divider: {
        height: 1,
        backgroundColor: AppColor.color_E5E5E5,
        marginVertical: 15
    }
})