// components/Editor/Editor.tsx
import React, { useRef, useState, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
    Image,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import ImagePicker from "react-native-image-crop-picker";
import { launchImageLibrary } from "react-native-image-picker";
import { pick, types } from "@react-native-documents/picker";
import { fileUpload, deleteFile } from "../../services/calls/imageUpload";
import { AppImage } from "../../config/AppImage";
import { AppString } from "../../strings";
import { AppColor } from "../../config/AppColor";
import ColorPickerModal from "../ColorPickerModal";
import FontSizePickerSimple from "../FontSizePicker";

export type Assignment = {
    id: string | number;
    title: string;
    [key: string]: any;
};

export type MediaModal = {
    mediaType: "Photo" | "Video" | "Audio" | "Other";
    caption?: string;
    shotTime?: string;
    filePath: string;
};

export type AttachmentModal = {
    mediaType: "Image" | "Video" | "Document";
    caption?: string;
    shotTime?: string;
    filePath: string;
};

export interface EditorOutput {
    title: string;
    html: string;
    media: MediaModal[];
    attachments: AttachmentModal[];
    assignment: Assignment | null;
}

export interface EditorProps {
    initialHtml?: string;

    storyId?: number;
    storyDescId?: number | null;

    onDraft?: (html: string) => void;
    onSubmit?: (html: string) => void;

    onChangeHtml?: (html: string) => void;

    showLoader?: () => void;
    hideLoader?: () => void;
}

const BLOCKED_EXTENSIONS = [
    ".php",
    ".exe",
    ".env",
    ".sh",
    ".bat",
    ".cmd",
    ".msi",
    ".js",
    ".ts",
    ".py",
    ".rb",
    ".jar",
    ".apk",
];
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const Editor: React.FC<EditorProps> = ({
    initialHtml = "",
    showLoader,
    hideLoader,
    onDraft,
    onSubmit,
    onChangeHtml
}) => {
    const richText = useRef<RichEditor | null>(null);

    const [htmlContent, setHtmlContent] = useState<string>(initialHtml);

    const [mediaList, setMediaList] = useState<MediaModal[]>([]);
    const [attachmentList, setAttachmentList] = useState<AttachmentModal[]>([]);


    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");

    const [showTableModal, setShowTableModal] = useState(false);
    const [rows, setRows] = useState("");
    const [cols, setCols] = useState("");

    const [showFontModal, setShowFontModal] = useState(false);
    const [fonts] = useState([
        "Arial",
        "Georgia",
        "Courier New",
        "Times New Roman",
        "Verdana",
        "Tahoma",
        "Trebuchet MS",
        "Helvetica",
        "Noto Sans",
    ]);

    const [showPicker, setShowPicker] = useState(false);
    const [colorModalVisible, setColorModalVisible] = useState(false);
    const [currentMode, setCurrentMode] = useState<"text" | "background">("text");
    const [textColor, setTextColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");

    const [loading, setLoading] = useState(false);

    const setLoadingState = useCallback(
        (val: boolean) => {
            setLoading(val);
            if (val) {
                showLoader?.();
            } else {
                hideLoader?.();
            }
        },
        [showLoader, hideLoader]
    );

    const handleAddImageUpload = async () => {
        try {
            setLoadingState(true);
            const image = await ImagePicker.openPicker({
                width: 1200,
                height: 800,
                cropping: true,
                compressImageQuality: 0.8,
                mediaType: "photo",
                freeStyleCropEnabled: true,
            });

            if (!image.path) return;

            const formData = new FormData();
            formData.append("image", {
                uri: image.path,
                type: (image as any).mime || "image/jpeg",
                name: (image as any).filename || `image_${Date.now()}.jpg`,
            } as any);

            const response = await fileUpload(formData);
            const uploadedUrl = response?.files?.[0]?.url as string | undefined;

            const mediaPayload: MediaModal = {
                mediaType: "Photo",
                caption: "",
                shotTime: "",
                filePath: uploadedUrl ?? image.path,
            };

            setMediaList((prev) => [...prev, mediaPayload]);

            if (uploadedUrl && richText.current) {
                richText.current.insertImage(uploadedUrl);
            } else if (!uploadedUrl) {
                Alert.alert("Upload failed", "No URL returned for image upload.");
            }
        } catch (err: any) {
            if (err?.message && (err.message.includes("cancel") || err.message.includes("User cancelled"))) {
            } else {
                console.error("Image Upload Error:", err);
                Alert.alert("Error", "Failed to upload image.");
            }
        } finally {
            setLoadingState(false);
        }
    };

    const handleAddVideoUpload = async () => {
        try {
            setLoadingState(true);
            const result = await launchImageLibrary({
                mediaType: "video",
                videoQuality: "medium",
            } as any);

            if (result.didCancel) return;
            if (!result.assets || result.assets.length === 0) return;

            const asset = result.assets[0];
            if (!asset.uri) return;

            const formData = new FormData();
            formData.append("video", {
                uri: asset.uri,
                type: asset.type || "video/mp4",
                name: asset.fileName || `video_${Date.now()}.mp4`,
            } as any);

            const response = await fileUpload(formData);
            const uploadedUrl = response?.files?.[0]?.url as string | undefined;

            const mediaPayload: MediaModal = {
                mediaType: "Video",
                caption: "",
                shotTime: "",
                filePath: uploadedUrl ?? asset.uri,
            };

            setMediaList((prev) => [...prev, mediaPayload]);

            if (uploadedUrl && richText.current?.insertVideo) {
                if (richText.current.insertVideo) {
                    richText.current.insertVideo(uploadedUrl);
                } else {
                    richText.current?.insertHTML(`<video controls src="${uploadedUrl}" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0;"></video>`);
                }
            } else if (!uploadedUrl) {
                Alert.alert("Upload failed", "No URL returned for video upload.");
            }
        } catch (err) {
            console.error("Video Upload Error:", err);
            Alert.alert("Error", "Failed to upload video.");
        } finally {
            setLoadingState(false);
        }
    };

    const handleAttachments = async () => {
        try {
            setLoadingState(true);

            const results = await pick({
                type: [types.allFiles],
            });

            const uploadedItems: AttachmentModal[] = [];

            for (const file of results) {
                const fileExt = file.name?.substring(file.name.lastIndexOf(".")).toLowerCase() ?? "";
                if (BLOCKED_EXTENSIONS.includes(fileExt)) {
                    Alert.alert("Unsupported File", `Files of type ${fileExt} are not allowed.`);
                    continue;
                }

                if (file.size && file.size > MAX_FILE_SIZE) {
                    Alert.alert("File Too Large", `The file "${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
                    continue;
                }

                const formData = new FormData();
                formData.append("file", {
                    uri: file.uri,
                    name: file.name,
                    type: file.type || "application/octet-stream",
                } as any);

                const uploadResponse = await fileUpload(formData);
                const uploadedUrl = uploadResponse?.files?.[0]?.url as string | undefined;
                if (!uploadedUrl) continue;

                let mediaType: AttachmentModal["mediaType"] = "Document";
                if (file.type?.startsWith("image")) mediaType = "Image";
                else if (file.type?.startsWith("video")) mediaType = "Video";

                uploadedItems.push({
                    mediaType,
                    caption: "",
                    shotTime: "",
                    filePath: uploadedUrl,
                });
            }

            if (uploadedItems.length > 0) {
                setAttachmentList((prev) => [...prev, ...uploadedItems]);
            }
        } catch (err: any) {
            if (err?.code === "CANCELLED" || err?.message?.includes("canceled")) {
            } else {
                console.error("Attachment Upload Error:", err);
                Alert.alert("Error", "Failed to upload attachments.");
            }
        } finally {
            setLoadingState(false);
        }
    };

    const handleDeleteAttachment = async (index: number) => {
        try {
            setLoadingState(true);
            const fileToDelete = attachmentList[index];
            if (!fileToDelete) return;
            await deleteFile({ fileKey: fileToDelete.filePath });
            setAttachmentList((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Delete attachment error:", err);
            Alert.alert("Delete Failed", "Unable to delete the file from server.");
        } finally {
            setLoadingState(false);
        }
    };

    const handleInsertTable = () => setShowTableModal(true);
    const handleConfirmInsert = () => {
        const numRows = parseInt(rows, 10);
        const numCols = parseInt(cols, 10);
        if (!numRows || !numCols || numRows <= 0 || numCols <= 0) {
            Alert.alert("Invalid Input", "Please enter valid row and column numbers.");
            return;
        }

        let tableHTML = `<table border="1" style="border-collapse: collapse; width: 100%;"><tr>`;
        for (let c = 1; c <= numCols; c++) tableHTML += `<th>Header ${c}</th>`;
        tableHTML += `</tr>`;
        for (let r = 1; r <= numRows; r++) {
            tableHTML += `<tr>`;
            for (let c = 1; c <= numCols; c++) {
                tableHTML += `<td style="height: 35px; padding: 8px; min-width: 60px;">&nbsp;</td>`;
            }
            tableHTML += `</tr>`;
        }
        tableHTML += `</table><br/>`;
        richText.current?.insertHTML(tableHTML);
        setRows("");
        setCols("");
        setShowTableModal(false);
    };

    const handleInsertLink = () => setShowLinkModal(true);
    const insertLink = () => {
        if (linkTitle && linkUrl) {
            richText.current?.insertLink(linkTitle, linkUrl);
            setLinkTitle("");
            setLinkUrl("");
            setShowLinkModal(false);
        }
    };

    const handleSelectFont = (font: string) => {
        richText.current?.commandDOM?.(`document.execCommand('fontName', false, '${font}')`);
        setShowFontModal(false);
        setTimeout(() => richText.current?.focusContentEditor?.(), 200);
    };

    const handleFontSize = () => setShowPicker(true);

    const openColorPicker = (mode: "text" | "background") => {
        setCurrentMode(mode);
        setColorModalVisible(true);
    };

    const handleSelectColor = (color: string) => {
        if (currentMode === "text") {
            richText.current?.setForeColor?.(color);
            setTextColor(color);
        } else {
            richText.current?.setHiliteColor?.(color);
            setBgColor(color);
        }
        setColorModalVisible(false);
    };

    const applyFontSize = (px) => {
        richText.current?.commandDOM(
            `document.execCommand("fontSize", false, "7");
         var fontElements = document.getElementsByTagName('font');
         for (var i = 0; i < fontElements.length; i++) {
             if (fontElements[i].size === "7") {
                 fontElements[i].removeAttribute("size");
                 fontElements[i].style.fontSize = "${px}px";
             }
         }`
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.toolbarWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.toolbarRow}>
                        <TouchableOpacity style={styles.customToolButton} onPress={() => setShowFontModal(true)}>
                            <Text style={styles.customToolText}>Aa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.customToolButton} onPress={() => openColorPicker("text")}>
                            <Text style={styles.customToolText}>A</Text>
                            <View style={[styles.colorBlock, { backgroundColor: textColor }]} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.customToolButton} onPress={() => openColorPicker("background")}>
                            <Text style={[styles.customToolText, { fontSize: 18 }]}>▨</Text>
                            <View style={[styles.colorBlock, { backgroundColor: bgColor }]} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.customToolButton} onPress={handleInsertTable}>
                            <Text style={[styles.customToolText, { fontSize: 18 }]}>▦</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.customToolButton} onPress={handleFontSize}>
                            <Text style={styles.customToolText}>A+</Text>
                        </TouchableOpacity>

                        <RichToolbar
                            editor={richText}
                            selectedIconTint={AppColor?.mainColor ?? "#2563eb"}
                            iconTint="#666"
                            style={styles.richToolbar}
                            iconSize={20}
                            actions={[
                                actions.heading1,
                                actions.heading2,
                                actions.heading3,
                                actions.setBold,
                                actions.setItalic,
                                actions.setUnderline,
                                actions.insertBulletsList,
                                actions.insertOrderedList,
                                actions.insertLink,
                                actions.insertImage,
                                actions.insertVideo,
                                actions.alignLeft,
                                actions.alignCenter,
                                actions.alignRight,
                                actions.undo,
                                actions.redo,
                                actions.line,
                                actions.blockquote,
                            ]}
                            onPressAddImage={handleAddImageUpload}
                            insertVideo={handleAddVideoUpload}
                            onInsertLink={handleInsertLink}
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.actionBar}>
                <TouchableOpacity onPress={() => onDraft?.(htmlContent)}>
                    <Text style={styles.draftText}>{AppString.common.draft}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={() => onSubmit?.(htmlContent)}
                >
                    <Image source={AppImage.submit_ic} style={styles.submitIcon} />
                    <Text style={styles.submitTextTopBar}>{AppString.common.submit}</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.editorWrapper}>
                <RichEditor
                    ref={richText}
                    useContainer
                    scrollEnabled
                    automaticallyAdjustContentInsets={false}
                    placeholder="Start writing something awesome..."
                    initialContentHTML={initialHtml}
                    editorStyle={{
                        backgroundColor: "#fff",
                        color: "#222",
                        placeholderColor: "#999",
                        contentCSSText: `
              body { font-size: 16px; padding: 10px; font-family: 'Noto Sans', sans-serif; }
              img, video { max-width:100% !important; height:auto !important; border-radius:8px; margin:8px 0; object-fit:contain !important; max-height:250px !important; }
            `,
                    }}
                    style={styles.richEditor}
                    onChange={(text) => {
                        setHtmlContent(text);
                        onChangeHtml?.(text);
                    }}

                />
            </View>

            {/* <View style={styles.mediaContainer}>
                <Text style={styles.mediaHeader}>Media Attachments</Text>

                <TouchableOpacity style={styles.uploadBox} onPress={handleAttachments}>
                    <Image source={AppImage?.attach_ic} style={styles.uploadIcon} />
                    <View style={styles.uploadTextWrap}>
                        <Text style={styles.uploadText}>Upload Files</Text>
                        <Text style={styles.uploadSubText}>Images, Videos, Documents (max {MAX_FILE_SIZE_MB}MB)</Text>
                    </View>
                </TouchableOpacity>

                {attachmentList.length > 0 && (
                    <View style={styles.attachmentList}>
                        {attachmentList.map((item, index) => {
                            const fileName = item.filePath.split("/").pop() || "file";
                            const isImage = item.mediaType === "Image";
                            const isVideo = item.mediaType === "Video";

                            return (
                                <View key={index} style={styles.attachmentRow}>
                                    <Image source={AppImage?.file_ic} style={styles.fileIcon} />
                                    <Text style={styles.fileName} numberOfLines={1}>
                                        {fileName}
                                    </Text>

                                    {isImage && <Image source={{ uri: item.filePath }} style={styles.previewImage} />}
                                    {isVideo && (
                                        <View style={styles.videoPreview}>
                                            <Text style={styles.videoText}>Video</Text>
                                        </View>
                                    )}

                                    <TouchableOpacity onPress={() => handleDeleteAttachment(index)}>
                                        <Image source={AppImage?.delete_ic} style={styles.deleteIcon} />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View> */}

            <Modal visible={showLinkModal} transparent animationType="fade" onRequestClose={() => setShowLinkModal(false)}>
                <View style={styles.modalOverlayCenter}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{AppString?.common?.insertLink ?? "Insert Link"}</Text>
                        <TextInput placeholder="Link Title" value={linkTitle} onChangeText={setLinkTitle} style={styles.input} />
                        <TextInput placeholder="Link URL" value={linkUrl} onChangeText={setLinkUrl} style={styles.input} />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.button} onPress={() => setShowLinkModal(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonPrimary} onPress={insertLink}>
                                <Text style={styles.buttonPrimaryText}>Insert</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={showFontModal} transparent animationType="fade" onRequestClose={() => setShowFontModal(false)}>
                <View style={styles.modalOverlayCenter}>
                    <View style={styles.fontModal}>
                        <Text style={styles.modalTitle}>{AppString?.common?.selectFont ?? "Select Font"}</Text>
                        <ScrollView style={{ maxHeight: 220 }}>
                            {fonts.map((f) => (
                                <TouchableOpacity key={f} style={styles.fontItem} onPress={() => handleSelectFont(f)}>
                                    <Text style={{ fontFamily: f }}>{f}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.button} onPress={() => setShowFontModal(false)}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={showTableModal} transparent animationType="fade" onRequestClose={() => setShowTableModal(false)}>
                <View style={styles.modalOverlayCenter}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>{AppString?.common?.insertTable ?? "Insert Table"}</Text>
                        <TextInput
                            placeholder="Rows"
                            value={rows}
                            onChangeText={setRows}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Columns"
                            value={cols}
                            onChangeText={setCols}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.button} onPress={() => setShowTableModal(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonPrimary} onPress={handleConfirmInsert}>
                                <Text style={styles.buttonPrimaryText}>Insert</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" />
                </View>
            )}

            <FontSizePickerSimple
                visible={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={(px) => applyFontSize(px)}
            />

            <ColorPickerModal
                visible={colorModalVisible}
                onClose={() => setColorModalVisible(false)}
                onSelectColor={handleSelectColor}
                mode={currentMode}
            />
        </View>
    );
};

export default Editor;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8", padding: 8 },
    topbar: { marginBottom: 8 },
    topActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8 },
    clearText: { color: "#666" },
    draftText: { color: "#999", marginRight: 8 },
    submitText: { color: "#2f9d27" },
    actionBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 8,
        gap: 16,
    },

    submitBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    submitIcon: {
        width: 16,
        height: 16,
        tintColor: AppColor.color_27AE60,
    },
    submitTextTopBar: {
        fontSize: 16,
        color: AppColor.color_27AE60,
        marginRight: 20,
        fontWeight: "500",
    },
    titleInput: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        marginBottom: 8,
    },
    toolbarWrapper: { marginBottom: 8 },
    toolbarRow: { flexDirection: "row", alignItems: "center" },
    customToolButton: {
        backgroundColor: "#fff",
        padding: 8,
        marginRight: 6,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#eee",
    },
    customToolText: { fontWeight: "600" },
    colorBlock: { width: 18, height: 12, marginLeft: 6, borderRadius: 2, borderWidth: 1, borderColor: "#ddd" },
    richToolbar: { backgroundColor: "transparent", paddingVertical: 6 },
    // editorWrapper: { height: 360, backgroundColor: "#fff", borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#eee" },
    editorWrapper: {
        flex: 1,
        minHeight: 360,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },
    richEditor: { flex: 1, padding: 8 },
    assignmentContainer: { marginTop: 12 },
    assignmentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    assignmentQuestion: { fontWeight: "600" },
    assignmentClearBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#eee", borderRadius: 6 },
    assignmentClearText: { color: "#333" },
    assignmentDropdownButton: { marginTop: 8, backgroundColor: "#fff", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#eee", flexDirection: "row", justifyContent: "space-between" },
    assignmentDropdownText: { color: "#333" },
    assignmentArrow: { color: "#999" },
    assignmentList: { maxHeight: 200, backgroundColor: "#fff", borderRadius: 8, marginTop: 6, borderWidth: 1, borderColor: "#eee" },
    assignmentItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#fafafa" },
    assignmentItemText: {},
    mediaContainer: { marginTop: 12 },
    mediaHeader: { fontWeight: "700", marginBottom: 8 },
    uploadBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#eee" },
    uploadIcon: { width: 28, height: 28, marginRight: 10, tintColor: "#666" },
    uploadTextWrap: { flex: 1 },
    uploadText: { fontWeight: "600" },
    uploadSubText: { color: "#888", fontSize: 12 },
    attachmentList: { marginTop: 8 },
    attachmentRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#fafafa" },
    fileIcon: { width: 26, height: 26, marginRight: 8, tintColor: "#666" },
    fileName: { flex: 1 },
    previewImage: { width: 60, height: 40, marginRight: 8, borderRadius: 6 },
    videoPreview: { width: 60, height: 40, marginRight: 8, borderRadius: 6, backgroundColor: "#eee", alignItems: "center", justifyContent: "center" },
    videoText: { color: "#666" },
    deleteIcon: { width: 22, height: 22, tintColor: "#d33" },
    modalOverlayCenter: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 16 },
    modalBox: { width: "100%", maxWidth: 520, backgroundColor: "#fff", borderRadius: 12, padding: 16 },
    modalTitle: { fontWeight: "700", marginBottom: 12 },
    input: { backgroundColor: "#f7f7f7", padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#eee" },
    modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
    button: { padding: 10, borderRadius: 8, marginLeft: 8, backgroundColor: "#eee" },
    buttonText: { color: "#333" },
    buttonPrimary: { padding: 10, borderRadius: 8, marginLeft: 8, backgroundColor: "#2563eb" },
    buttonPrimaryText: { color: "#fff" },
    fontModal: { width: "100%", maxWidth: 420, backgroundColor: "#fff", borderRadius: 12, padding: 12 },
    fontItem: { padding: 10, borderBottomColor: "#fafafa", borderBottomWidth: 1 },
    colorModal: { width: "100%", maxWidth: 420, backgroundColor: "#fff", borderRadius: 12, padding: 12, alignItems: "center" },
    colorPalette: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 12 },
    colorSwatch: { width: 36, height: 36, margin: 6, borderRadius: 6, borderWidth: 1, borderColor: "#ddd" },
    loadingOverlay: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.6)" },
});
