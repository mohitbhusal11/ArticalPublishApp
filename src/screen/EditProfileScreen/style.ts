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

    editProfileContainer: {
        backgroundColor: AppColor.color_ffffff,
        paddingBottom: 15,
        elevation: 5,
        marginTop: 20,
        marginHorizontal: 15,
        borderRadius: 12,
        overflow: 'hidden'
    },

    editProfileText: {
        backgroundColor: AppColor.mainColor,
        color: AppColor.color_ffffff,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        fontSize: 12,
        fontWeight: 600
    },

    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12
    },

    imgStyle: {
        width: 74,
        height: 74,
        borderRadius: 150,
        resizeMode: 'cover',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 150
    },

    imgRadius: {
        borderRadius: 150,
    },

    editIcon: {
        width: 30,
        height: 30,
        tintColor: AppColor.color_ffffff,
        alignSelf: 'center'
    },

    centerIcon: {
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },

    divider: {
        height: 1,
        backgroundColor: AppColor.color_E5E5E5,
        // marginVertical: 15
    },

    nameTitle: {
        color: AppColor.mainColor,
        fontSize: 12,
        fontWeight: 600,
        marginTop: 18,
        marginHorizontal: 18,
        textAlign: 'left'
    },

    mobileNumberTitile: {
        color: AppColor.mainColor,
        fontSize: 12,
        fontWeight: 600,
        marginTop: 18,
        marginHorizontal: 18,
        textAlign: 'left'
    },

    userName: {
        color: AppColor.color_767676,
        fontSize: 14,
        fontWeight: 600,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: AppColor.color_BADEFF,
        marginTop: 8,
        marginHorizontal: 18,
        backgroundColor: AppColor.color_E9E9E9
    },

    mobileNumber: {
        color: AppColor.color_767676,
        fontSize: 14,
        fontWeight: 600,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: AppColor.color_BADEFF,
        marginTop: 8,
        marginHorizontal: 18,
        backgroundColor: AppColor.color_E9E9E9
    },

    button: {
        flex: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
        marginHorizontal: 15,
        paddingVertical: 5
    },

    buttonText: {
        color: AppColor.color_ffffff,
        fontSize: 16,
        fontWeight: "600",
    },
})