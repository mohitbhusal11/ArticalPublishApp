import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Alert,
    TouchableOpacity,
    TextInput,
    Modal,
    Image,
} from "react-native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { launchImageLibrary } from "react-native-image-picker";

import { AppString } from "../../strings";
import GlobalText from "../../component/GlobalText";
import { AppColor } from "../../config/AppColor";
import { AppImage } from "../../config/AppImage";
import { AttachmentModal, MediaModal, postDraft, postStory, PostStoryModal } from "../../services/calls/stories";
import ToastUtils from "../../utils/toast";
import { styles } from "./style";
import { Assignment, getAssignments } from "../../services/calls/assignmentService";
import { deleteFile, fileUpload } from "../../services/calls/imageUpload";
import LottieView from "lottie-react-native";
import { AppLottie } from "../../config/AppLottie";
import { normalizeAttachment, normalizeMedia } from "../../utils/normalizeFun";
import { pick, types } from "@react-native-documents/picker";
import FontSizePickerSimple from "../../component/FontSizePicker";

const BLOCKED_EXTENSIONS = [
    '.php', '.exe', '.env', '.sh', '.bat', '.cmd', '.msi',
    '.js', '.ts', '.py', '.rb', '.jar', '.apk'
];

const MAX_FILE_SIZE_MB = 20; // your limit 
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;


const customFontAction = "customFontPicker";

const handleHead1 = ({ tintColor }: { tintColor: string }) => (
    <Text style={[styles.iconStyle, { color: tintColor }]}>H1</Text>
);
const handleHead2 = ({ tintColor }: { tintColor: string }) => (
    <Text style={[styles.iconStyle, { color: tintColor }]}>H2</Text>
);
const handleHead3 = ({ tintColor }: { tintColor: string }) => (
    <Text style={[styles.iconStyle, { color: tintColor }]}>H3</Text>
);
const handleHead4 = ({ tintColor }: { tintColor: string }) => (
    <Text style={[styles.iconStyle, { color: tintColor }]}>H4</Text>
);
const handleHead5 = ({ tintColor }: { tintColor: string }) => (
    <Text style={[styles.iconStyle, { color: tintColor }]}>H5</Text>
);
const handleHead6 = ({ tintColor }: { tintColor: string }) => (
    <Text style={[styles.iconStyle, { color: tintColor }]}>H6</Text>
);


const FontIcon = ({ tintColor }: { tintColor: string }) => (
    <Text style={[styles.iconStyle, { color: tintColor }]}>Aa</Text>
);



const DraftStoryScreen = ({ navigation, route }: any) => {
    const { item } = route.params;
    console.log("Draft Screen itemData: ", item);

    const richText = React.useRef<RichEditor>(null);
    const [title, setTitle] = useState(item.headline);
    const [htmlContent, setHtmlContent] = useState(item.description);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkTitle, setLinkTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
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
        "Noto Sans"
    ]);
    const [assignmentList, setAssignmentList] = useState<Assignment[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(item.title);
    const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mediaList, setMediaList] = useState<MediaModal[]>(
        normalizeMedia(item?.media)
    );
    const [attachmentList, setAttachmentList] = useState<AttachmentModal[]>(
        normalizeAttachment(item?.attachment)
    );

    const [showPicker, setShowPicker] = useState(false);


    const fetchAssignments = async () => {
        try {
            const response = await getAssignments({ pageSize: 50, status: "Accepted" })
            console.log(response);
            setAssignmentList(response.data)

        } catch (error) {
            console.log("fetchAssignments error: ", error);

        }
    }

    useEffect(() => {
        fetchAssignments()
    }, [])

    const handleAttachments = async () => {
        try {
            setLoading(true);

            const results = await pick({
                type: [types.allFiles],
            });

            const uploadedItems: AttachmentModal[] = [];

            for (const file of results) {
                console.log('Picked file:', file.uri, file.name, file.type, file.size);

                const fileExt = file.name?.substring(file.name.lastIndexOf('.')).toLowerCase();
                if (BLOCKED_EXTENSIONS.includes(fileExt)) {
                    Alert.alert("Unsupported File", `Files of type ${fileExt} are not allowed.`);
                    continue;
                }

                if (file.size && file.size > MAX_FILE_SIZE) {
                    Alert.alert(
                        "File Too Large",
                        `The file "${file.name}" exceeds ${MAX_FILE_SIZE_MB} MB limit.`
                    );
                    continue; // skip uploading this file
                }

                const formData = new FormData();
                formData.append('file', {
                    uri: file.uri,
                    name: file.name,
                    type: file.type,
                } as any);

                const uploadResponse = await fileUpload(formData);
                const uploadedUrl = uploadResponse?.files?.[0]?.url;
                if (!uploadedUrl) continue;

                let mediaType = 'Document';
                if (file.type?.startsWith('image')) mediaType = 'Image';
                if (file.type?.startsWith('video')) mediaType = 'Video';

                uploadedItems.push({
                    mediaType,
                    caption: '',
                    shotTime: '',
                    filePath: uploadedUrl,
                });
            }

            setAttachmentList(prev => [...prev, ...uploadedItems]);
        } catch (err: any) {
            // new package throws a cancel error similar to old API
            if (err?.code === 'CANCELLED' || err?.message?.includes('canceled')) {
                // user cancelled — ignore
            } else {
                console.error('Attachment Upload Error:', err);
                Alert.alert('Error', 'Failed to upload attachments.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !htmlContent.trim()) {
            Alert.alert("Missing Data", "Please add both Title and Description!");
            return;
        }

        const finalPayload: PostStoryModal = {
            headLine: title.trim(),
            description: htmlContent.trim(),
            media: mediaList,
            attachment: attachmentList
        };
        console.log("MediaList: ", mediaList);

        try {
            console.log("📤 Payload to send:", finalPayload);
            const response = await postStory(finalPayload, { storyId: item.id, assignmentId: selectedAssignment?.id ?? undefined });
            console.log("response poststory: ", response);
            ToastUtils.success("Story created successfully");
            navigation.goBack()
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Error", "Something went wrong while submitting.");
        }
    };

    const handleDraft = async () => {
        if (!title.trim() || !htmlContent.trim()) {
            Alert.alert("Missing Data", "Please add both Title and Description!");
            return;
        }

        const finalPayload: PostStoryModal = {
            headLine: title.trim(),
            description: htmlContent.trim(),
            media: mediaList,
            attachment: attachmentList
        };
        console.log("MediaList: ", mediaList);

        try {
            console.log("📤 Payload to send:", finalPayload);
            const response = await postDraft(finalPayload, { storyId: item.id, assignmentId: selectedAssignment?.id ?? undefined });
            console.log("response poststory: ", response);
            ToastUtils.success("Story created successfully");
            navigation.goBack()
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Error", "Something went wrong while submitting.");
        }
    };

    const handleAddImageUpload = async () => {
        try {
            setLoading(true);
            const result = await launchImageLibrary({
                mediaType: "photo",
                quality: 0.8,
            });

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) return;

                const formData = new FormData();
                formData.append("image", {
                    uri: asset.uri,
                    type: asset.type || "image/jpeg",
                    name: asset.fileName || "upload.jpg",
                });

                console.log("formData: ", formData);
                const response = await fileUpload(formData);
                console.log("Upload Response:", response);
                const uploadedUrl = response?.files?.[0]?.url;
                const mediaPayload: MediaModal = {
                    mediaType: 'Photo',
                    caption: '',
                    shotTime: '',
                    filePath: uploadedUrl || "upload.jpg"
                }
                setMediaList(prev => [...prev, mediaPayload])

                if (!uploadedUrl) {
                    Alert.alert("Upload failed", "No Image URL returned.");
                    return;
                } else {
                    richText.current?.insertImage(uploadedUrl);
                }


            }
        } catch (error) {
            console.error("Image Upload Error:", error);
            Alert.alert("Error", "Something went wrong while uploading the image.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddVideoUpload = async () => {
        try {
            setLoading(true);
            const result = await launchImageLibrary({
                mediaType: "video",
                videoQuality: "medium",
            });

            if (result.didCancel) return;

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) return;

                const formData = new FormData();
                formData.append("video", {
                    uri: asset.uri,
                    type: asset.type || "video/mp4",
                    name: asset.fileName || "upload.mp4",
                });

                console.log("Uploading video...", formData);
                const response = await fileUpload(formData);
                console.log("Upload Response:", response);
                const uploadedUrl = response?.files?.[0]?.url;
                const mediaPayload: MediaModal = {
                    mediaType: 'Video',
                    caption: '',
                    shotTime: '',
                    filePath: uploadedUrl || "upload.mp4"
                };
                setMediaList(prev => [...prev, mediaPayload]);

                if (!uploadedUrl) {
                    Alert.alert("Upload failed", "No video URL returned.");
                    return;
                } else {
                    richText.current?.insertVideo(uploadedUrl);
                }

            }
        } catch (error) {
            console.error("Video Upload Error:", error);
            Alert.alert("Error", "Something went wrong while uploading the video.");
        } finally {
            setLoading(false);
        }
    };

    const handleInsertLink = () => {
        setShowLinkModal(true);
    };

    const handleFontList = () => {
        setShowFontModal(true)
    }

    const handleInsertTable = () => {
        setShowTableModal(true);
    };

    const handleConfirmInsert = () => {
        const numRows = parseInt(rows, 10);
        const numCols = parseInt(cols, 10);

        if (!numRows || !numCols || numRows <= 0 || numCols <= 0) {
            Alert.alert("Invalid Input", "Please enter valid row and column numbers.");
            return;
        }

        let tableHTML = `<table border="1" style="border-collapse: collapse; width: 100%;"><tr>`;

        for (let c = 1; c <= numCols; c++) {
            tableHTML += `<th>Header ${c}</th>`;
        }
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

    const insertLink = () => {
        if (linkTitle && linkUrl) {
            richText.current?.insertLink(linkTitle, linkUrl);
            closeModal();
        }
    };

    const closeModal = () => {
        setShowLinkModal(false);
        setLinkTitle('');
        setLinkUrl('');
    };

    const handleSelectFont = (font: string) => {
        richText.current?.commandDOM(
            `document.execCommand('fontName', false, '${font}')`
        );
        setShowFontModal(false);
        setTimeout(() => {
            richText.current?.focusContentEditor();
        }, 300);
    };

    const handleDeleteAttachment = async (index: number) => {
        try {
            setLoading(true);
            const fileToDelete: AttachmentModal = attachmentList[index];

            console.log("Deleting File:", fileToDelete);

            await deleteFile({ fileKey: fileToDelete.filePath });

            setAttachmentList(prev => prev.filter((_, i) => i !== index));

            console.log("Attachment removed successfully.");

        } catch (error) {
            Alert.alert("Delete Failed", "Unable to delete the file from server.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFontSize = () => {
        setShowPicker(true);
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
        <SafeAreaView style={styles.container}>
            <View style={styles.topbarcontainer} >
                <View style={styles.topActions}>
                    <TouchableOpacity onPress={() => {
                        setTitle("");
                        setHtmlContent("");
                        richText.current?.setContentHTML("");
                    }}>
                        <Text style={styles.clearText}>{AppString.common.clear}</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row' }} >
                        <TouchableOpacity onPress={handleDraft}>
                            <Text style={styles.draftText}>{AppString.common.draft}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}
                            onPress={handleSubmit}>
                            <Image source={AppImage.submit_ic} style={{ width: 16, height: 16, tintColor: AppColor.color_27AE60 }} />
                            <Text style={styles.submitTextTopBar}>{AppString.common.submit}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <Text style={styles.label}>{AppString.common.title}</Text> */}
                <TextInput
                    maxLength={200}
                    placeholder="Enter your title..."
                    value={title}
                    onChangeText={setTitle}
                    style={styles.titleInput}
                    placeholderTextColor={AppColor.color_aaa}
                />
                {/* <Text style={styles.title}>{AppString.common.description}</Text> */}

                <View style={styles.toolbarWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.toolbarScroll}>
                        <View style={styles.toolbarContainer}>
                            <TouchableOpacity
                                style={styles.customToolButton}
                                onPress={handleFontList}>
                                <Text style={styles.customToolText}>Aa</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.customToolButton}
                                onPress={handleInsertTable}>
                                <Text style={styles.customToolText}>▦</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.customToolButton}
                                onPress={handleFontSize}>
                                <Text style={styles.customToolText}>A+</Text>
                            </TouchableOpacity>

                            <RichToolbar
                                editor={richText}
                                selectedIconTint="#2563eb"
                                iconTint="#666"
                                style={styles.toolbar}
                                iconSize={20}
                                actions={[
                                    actions.heading1,
                                    actions.heading2,
                                    actions.heading3,
                                    actions.heading4,
                                    actions.heading5,
                                    actions.heading6,
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
                                ]}
                                iconMap={{
                                    [actions.heading1]: handleHead1,
                                    [actions.heading2]: handleHead2,
                                    [actions.heading3]: handleHead3,
                                    [actions.heading4]: handleHead4,
                                    [actions.heading5]: handleHead5,
                                    [actions.heading6]: handleHead6,
                                    [customFontAction]: FontIcon,
                                }}
                                onPressAddImage={handleAddImageUpload}
                                insertVideo={handleAddVideoUpload}
                                onInsertLink={handleInsertLink}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}>

                <View style={{ height: 400, overflow: "hidden" }}>
                    <RichEditor
                        ref={richText}
                        placeholder="Start writing something awesome..."
                        initialContentHTML={htmlContent}
                        androidLayerType={"hardware"}
                        useContainer={false}
                        style={{
                            flex: 1,
                            height: 400,
                            backgroundColor: "#fff",
                            borderWidth: 2,
                            margin: 5,
                            elevation: 2,
                            borderRadius: 12,
                        }}
                        onChange={(text) => setHtmlContent(text)}
                        editorStyle={{
                            backgroundColor: AppColor.ffffff,
                            color: AppColor.color_222,
                            placeholderColor: AppColor.color_aaa,
                            contentCSSText: `
                            body {
                                font-size: 16px;
                                height: 100%;
                                max-height: 500px;
                                overflow-y: auto;   
                                padding: 10px;
                                font-family: 'NotoSans-Regular', 'Arial', 'Mangal', 'NotoSansDevanagari-Regular', sans-serif;
                            }
                            img, video {
                                max-width: 100% !important;
                                height: auto !important;
                                border-radius: 8px;
                                margin: 8px 0;
                                display: block;
                                object-fit: contain !important;
                                max-height: 250px !important;
                            }
                        `,
                        }}
                    />
                </View>

                {/* -------------------- ASSIGNMENT SECTION -------------------- */}
                {assignmentList && <View style={styles.assignmentContainer}>

                    <View style={styles.row}>
                        <GlobalText style={styles.fileName} numberOfLines={1}>
                            Is this story related to an assignment?
                        </GlobalText>
                        {selectedAssignment && <TouchableOpacity
                            onPress={() => {
                                setSelectedAssignment(null)
                            }}
                            style={styles.assignmentToggleBtn}>
                            <Text style={styles.assignmentToggleLabel}>
                                Clear
                            </Text>
                        </TouchableOpacity>
                        }
                    </View>

                    {assignmentList && <View>
                        <TouchableOpacity
                            onPress={() => setShowAssignmentDropdown(!showAssignmentDropdown)}
                            style={styles.assignmentDropdownButton}
                        >
                            <Text style={styles.assignmentDropdownSelected}>
                                {selectedAssignment ? selectedAssignment.title : "Choose assignment"}
                            </Text>
                            <Text style={styles.assignmentDropdownArrow}>⌄</Text>
                        </TouchableOpacity>

                        {showAssignmentDropdown && (
                            <View style={styles.assignmentDropdownBox}>
                                <ScrollView>
                                    {assignmentList.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.assignmentDropdownItem}
                                            onPress={() => {
                                                setSelectedAssignment(item);
                                                setShowAssignmentDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.assignmentDropdownItemText}>
                                                {item.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>}

                </View>}
                {/* ---------------- END ASSIGNMENT SECTION ------------------ */}

                {/* -------------------- MEDIA ATTACHMENTS -------------------- */}
                <View style={styles.mediaContainer}>

                    <GlobalText style={styles.mediaHeader}>
                        Media Attachments
                    </GlobalText>

                    <TouchableOpacity onPress={handleAttachments} style={styles.uploadBox}>
                        <Image source={AppImage.attach_ic} style={styles.uploadIcon} />
                        <Text style={styles.uploadText}>Upload Files</Text>
                        <Text style={styles.uploadSubText}>Images, Videos, Documents (max 100MB)</Text>
                    </TouchableOpacity>

                    {attachmentList.length > 0 && (
                        <View style={styles.listContainer}>
                            {attachmentList.map((item, index) => {
                                const fileName = item.filePath.split("/").pop() || "file";

                                const isImage = item.mediaType === "Image";
                                const isVideo = item.mediaType === "Video";
                                const isDoc = item.mediaType === "Document";

                                return (
                                    <View key={index} style={styles.row}>
                                        <Image source={AppImage.file_ic} style={styles.fileIcon} />
                                        <Text style={styles.fileName} numberOfLines={1}>
                                            {fileName}
                                        </Text>
                                        {isImage && (
                                            <Image source={{ uri: item.filePath }} style={styles.imagePreview} />
                                        )}
                                        {isVideo && (
                                            <View style={styles.videoPreview}>
                                                <Text style={styles.videoText}>Video</Text>
                                            </View>
                                        )}
                                        {isDoc && (
                                            <View style={styles.docPreview}>
                                                <Text style={styles.docText}>DOC</Text>
                                            </View>
                                        )}
                                        <TouchableOpacity onPress={() => handleDeleteAttachment(index)}>
                                            <Image source={AppImage.delete_ic} style={styles.deleteIcon} />
                                        </TouchableOpacity>

                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
                {/* ---------------- END MEDIA ------------------ */}
            </ScrollView>

            <Modal visible={showLinkModal} transparent animationType="fade" onRequestClose={closeModal}>
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>
                        <GlobalText style={styles.linkTitle}>{AppString.common.insertLink}</GlobalText>
                        <TextInput
                            placeholder="Link Title"
                            value={linkTitle}
                            onChangeText={setLinkTitle}
                            style={styles.textInput}
                        />
                        <TextInput
                            placeholder="Link URL"
                            value={linkUrl}
                            onChangeText={setLinkUrl}
                            style={[styles.textInput, { marginBottom: 20 }]}
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={closeModal}
                            >
                                <Text style={styles.cancelText}>{AppString.common.cancel}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.insertButton]}
                                onPress={insertLink}
                            >
                                <Text style={styles.insertText}>{AppString.common.insert}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showFontModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowFontModal(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.fontModalBox}>
                        <Text style={styles.fontModalTitle}>
                            {AppString.common.selectFont}
                        </Text>
                        <ScrollView>
                            {fonts.map((font) => (
                                <TouchableOpacity
                                    key={font}
                                    style={styles.fontOption}
                                    onPress={() => handleSelectFont(font)}
                                >
                                    <Text style={[styles.fontlistitemtext, { fontFamily: font }]}>{font}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            onPress={() => setShowFontModal(false)}
                            style={styles.fontCancelButton}>
                            <Text style={styles.fontCancelText}>{AppString.common.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showTableModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowTableModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{AppString.common.insertTable}</Text>

                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Rows"
                            value={rows}
                            onChangeText={setRows}
                        />

                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Columns"
                            value={cols}
                            onChangeText={setCols}
                        />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowTableModal(false)}
                            >
                                <Text style={styles.cancelText}>{AppString.common.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.insertButton]}
                                onPress={handleConfirmInsert}
                            >
                                <Text style={styles.insertText}>{AppString.common.insert}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <FontSizePickerSimple
                visible={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={(px) => applyFontSize(px)}
            />

            {loading && (
                <View style={styles.loaderOverlay}>
                    <LottieView
                        source={AppLottie.loader}
                        autoPlay
                        loop
                        style={{ width: 50, height: 50 }}
                    />
                </View>
            )}

        </SafeAreaView>
    );
};

export default DraftStoryScreen;