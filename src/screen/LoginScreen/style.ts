import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1, // remove absoluteFillObject
        // backgroundColor: "rgba(12, 29, 58, 0.6)",
    },

    scrollContainer: {
        flexGrow: 2,
        justifyContent: "flex-end", // center vertically (not bottom)
        backgroundColor: AppColor.color0A2C59
    },
    safeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    bgImage: {
        flex: 1,
        resizeMode: 'contain'
    },

    contentBox: {
        backgroundColor: "white",
        flexDirection: "column",
        // borderTopLeftRadius: 15,
        // borderTopRightRadius: 15,
        flex: 1
        // height: 400,
    },
    title: {
        fontSize: 18,
        textAlign: "center",
        color: AppColor.mainColor,
        fontWeight: 600,
    },
    desc: {
        fontSize: 16,
        color: AppColor.color_9A9A9A,
        marginHorizontal: 32,
        marginTop: 8,
        textAlign: "center",
    },
    dotContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginTop: 32,
        alignItems: "flex-end",
        flexGrow: 1
    },
    dot: {
        width: 15,
        height: 15,
        borderRadius: 50,
    },
    buttonWrapper: {
        marginTop: 10,
        marginBottom: 70,
        height: 50,
        marginHorizontal: 16,
    },
    button: {
        flex: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: AppColor.color_ffffff,
        fontSize: 16,
        fontWeight: "600",
    },
    logoIC: {
        width: 100,
        height: 66,
        alignSelf: 'center',
        marginTop: 24,
        resizeMode: 'contain'
    },
    titileWithLines: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 10
    },
    colorLine: {
        width: 50,
        flexGrow: 1,
        marginHorizontal: 24
    },

    credientialsBox: {
        flexDirection: 'column',
        marginHorizontal: 24,
        marginVertical: 24,
    },
    fieldTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: AppColor.mainColor
    },
    inputContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        marginTop: 3
    },
    fieldIcon: {
        width: 20,
        height: 20
    },
    fieldIconContainer: {
        backgroundColor: AppColor.mainColor,
        width: 60,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    hideShowPasswordContainer: {
        backgroundColor: AppColor.ffffff,
        width: 60,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 12,
        borderWidth: 1,
        borderBottomRightRadius: 12,
        borderColor: AppColor.color_D7D7D7,
    },
    inputfieldContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    inputField: {
        flex: 1,
        borderColor: AppColor.color_D7D7D7,
        borderWidth: 1,
        color: AppColor.c000000
    },
    otherOthers: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkboxContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rememberText: {
        fontSize: 12,
        color: AppColor.color_5A5A5A,
        fontWeight: 500
    },
    checkBox: {
        width: 50,
        height: 50,
    },
    forgotPasswordText: {
        fontSize: 12,
        color: AppColor.mainColor,
        fontWeight: 500
    },
    loaderOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: AppColor.loaderOverlayColor,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
});