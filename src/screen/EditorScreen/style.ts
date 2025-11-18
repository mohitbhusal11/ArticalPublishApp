import { StyleSheet } from "react-native";
import { AppColor } from "../../config/AppColor";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    scrollContent: {
        // flexGrow: 1,
        paddingHorizontal: 16,
        // paddingTop: 20,
        // paddingBottom: 40,
    },
    title: {
        fontSize: 16,
        fontWeight: 400,
        color: "#1e293b",
        marginBottom: 4,
    },
    toolbarWrapper: {
        marginTop: 0,
        marginBottom: 4,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        paddingVertical: 0,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 1,
    },
    toolbarScroll: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    toolbarContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    toolbar: {
        backgroundColor: "transparent",
    },
    titleInput: {
        fontSize: 22,
        fontWeight: 500,
        color: "#111827",
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        padding: 12,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#eee',
    },
    insertButton: {
        backgroundColor: '#007bff',
    },
    insertText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelText: {
        color: '#333',
        fontWeight: '500',
    },
    customToolButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginHorizontal: 2,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    customToolText: {
        color: "#444",
        fontSize: 16,
        fontWeight: "600",
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 15,
        textAlign: "center",
    },

    iconStyle: {
        fontWeight: "bold"
    },


    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    linkTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textInput: {
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fontModalBox: {
        width: '80%',
        backgroundColor: AppColor.ffffff,
        borderRadius: 10,
        padding: 20,
        maxHeight: '60%',
    },
    fontModalTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    fontOption: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    fontCancelButton: {
        marginTop: 15,
        backgroundColor: '#eee',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    fontCancelText: {
        fontWeight: '500',
    },

    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 10,
    },

    fontlistitemtext: {
        fontSize: 18
    },
    topActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingHorizontal: 10,
    },

    draftText: {
        fontSize: 16,
        color: AppColor.mainColor,
        marginRight: 20,
        fontWeight: "500",
    },
    submitTextTopBar: {
        fontSize: 16,
        color: AppColor.color_27AE60,
        marginRight: 20,
        fontWeight: "500",
    },

    clearText: {
        fontSize: 16,
        color: "#ff3b30",
        fontWeight: "500",
    },
    topbarcontainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    /* ---------------- ASSIGNMENT SECTION ---------------- */

    assignmentContainer: {
        // marginHorizontal: 16,
        marginTop: 10,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    assignmentHeader: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
    },

    assignmentToggleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    assignmentToggleText: {
        fontSize: 15,
        color: "#333",
    },

    assignmentToggleBtn: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 10,
        backgroundColor: '#27AE60'
    },

    assignmentToggleLabel: {
        color: "#fff",
        fontWeight: "600",
    },

    assignmentDropdownLabel: {
        marginBottom: 8,
        fontSize: 15,
        color: "#444",
    },

    assignmentDropdownButton: {
        padding: 14,
        borderWidth: 1,
        borderColor: "#bbb",
        borderRadius: 10,
        backgroundColor: "#fafafa",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    assignmentDropdownSelected: {
        fontSize: 15,
        color: "#333",
    },

    assignmentDropdownArrow: {
        fontSize: 18,
        color: "#333",
    },

    assignmentDropdownBox: {
        marginTop: 8,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        maxHeight: 160,
        overflow: "hidden",
    },

    assignmentDropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    assignmentDropdownItemText: {
        fontSize: 15,
        color: "#333",
    },

    /* -------------- END ASSIGNMENT SECTION -------------- */

    mediaContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
        // marginHorizontal: 8,
    },

    mediaHeader: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        color: "#222",
    },

    uploadBox: {
        height: 140,
        borderWidth: 1,
        borderColor: "#d0d0d0",
        borderStyle: "dashed",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#fafafa",
    },

    uploadIcon: {
        width: 40,
        height: 40,
        tintColor: "#888",
        marginBottom: 6,
    },

    uploadText: {
        fontSize: 14,
        color: "#444",
        fontWeight: "500",
    },

    uploadSubText: {
        fontSize: 12,
        color: "#999",
        marginTop: 3,
    },


});
