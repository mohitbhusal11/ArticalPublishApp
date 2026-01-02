import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColor.color_f7f9fc,
    },

    listContent: {
        padding: 16,
    },

    card: {
        flexDirection: "row",
        padding: 14,
        borderRadius: 14,
        backgroundColor: AppColor.color_ffffff,
        alignItems: "center",
        shadowColor: AppColor.color_000,
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    unreadCard: {
        backgroundColor: AppColor.color_EAF0FF,
        borderLeftWidth: 3,
        borderLeftColor: AppColor.mainColor,
    },

    icon: {
        width: 46,
        height: 46,
        marginRight: 12,
        borderRadius: 10,
        backgroundColor: AppColor.color_EDEDED,
    },

    content: {
        flex: 1,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },

    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        color: AppColor.color_5A5A5A,
    },

    unreadTitle: {
        fontWeight: "700",
        color: AppColor.color_222,
    },

    description: {
        fontSize: 13,
        lineHeight: 18,
        color: AppColor.color_727272,
        marginTop: 4,
    },

    readDescription: {
        color: AppColor.color_9A9A9A,
    },

    dateText: {
        fontSize: 11,
        color: AppColor.color_9A9A9A,
        marginTop: 6,
        alignSelf: "flex-end",
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: AppColor.mainColor,
        marginLeft: 8,
    },
});
