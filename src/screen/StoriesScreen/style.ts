import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        padding: 16,
    },
    createButton: {
        backgroundColor: AppColor.mainColor,
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    searchInput: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        marginBottom: 16,
        fontSize: 15,
        color: "#333",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8,
    },
    statusText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "600",
    },
    editText: {
        color: "#4A90E2",
        fontWeight: "600",
    },
    description: {
        color: "#555",
        fontSize: 14,
        marginTop: 6,
        marginBottom: 10,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    date: {
        color: "#999",
        fontSize: 12,
    },
    deleteText: {
        color: "#E74C3C",
        fontWeight: "600",
        fontSize: 13,
    },
});