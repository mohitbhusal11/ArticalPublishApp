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
import { styles } from "./style";
import { AppString } from "../../strings";
import GlobalText from "../../component/GlobalText";
import { AppColor } from "../../config/AppColor";
import { AppImage } from "../../config/AppImage";
import { AttachmentModal, MediaModal, postDraft, postStory, PostStoryModal } from "../../services/calls/stories";
import ToastUtils from "../../utils/toast";
import { getAssignments } from "../../services/calls/assignmentService";
import { fileUpload } from "../../services/calls/imageUpload";

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



const EditorScreen = ({ navigation } : any) => {
    const richText = React.useRef<RichEditor>(null);
    const [title, setTitle] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkTitle, setLinkTitle] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [showTableModal, setShowTableModal] = useState(false);
    const [rows, setRows] = useState("");
    const [cols, setCols] = useState("");
    const [mediaList, setMediaList] = useState<MediaModal[]>([])
    const [attachmentList, setAttachmentList] = useState<AttachmentModal[]>([])

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

        // Hindi fonts
        "Noto Sans"
    ]);

    const [assignmentList] = useState([
        { id: 1, title: "City Report" },
        { id: 2, title: "Sports Event Coverage" },
        { id: 3, title: "Political Beat" },
    ]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showAssignmentDropdown, setShowAssignmentDropdown] = useState(false);

    const fetchAssignments = async () => {
        try {
            const response = await getAssignments()
            console.log(response);

        } catch (error) {
            console.log("fetchAssignments error: ", error);

        }
    }

    useEffect(() => {
        fetchAssignments()
    }, [])

    const handleAttachments = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: "mixed",
                quality: 0.8,
                selectionLimit: 0
            });

            if (result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                if (imageUri) {
                    // Inserts the selected image into the editor
                    richText.current?.insertImage(imageUri);
                }
            }
        } catch (error) {
            console.warn("Error picking image:", error);
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
            const response = await postStory(finalPayload, { assignmentId: selectedAssignment?.id ?? undefined });
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
            const response = await postDraft(finalPayload, { assignmentId: selectedAssignment?.id ?? undefined });
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
        }
    };

    const handleAddVideoUpload = async () => {
        try {
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
        // Add headers
        for (let c = 1; c <= numCols; c++) {
            tableHTML += `<th>Header ${c}</th>`;
        }
        tableHTML += `</tr>`;

        // Add rows (empty cells)
        for (let r = 1; r <= numRows; r++) {
            tableHTML += `<tr>`;
            for (let c = 1; c <= numCols; c++) {
                tableHTML += `<td style="height: 35px; padding: 8px; min-width: 60px;">&nbsp;</td>`;
            }
            tableHTML += `</tr>`;
        }
        tableHTML += `</table><br/>`;

        // Insert into the editor
        richText.current?.insertHTML(tableHTML);

        // Reset
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
        // Apply font to selected or future text
        richText.current?.commandDOM(
            `document.execCommand('fontName', false, '${font}')`
        );
        setShowFontModal(false);
        setTimeout(() => {
            richText.current?.focusContentEditor();
        }, 300);
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
                                // onPressAddImage={handleAddImage}
                                // onPressAddImage={handleAddImageBase64}
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
                // showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >

                <View style={{ height: 400, overflow: "hidden" }}>
                    <RichEditor
                        ref={richText}
                        placeholder="Start writing something awesome..."
                        initialContentHTML=""
                        // androidHardwareAccelerationDisabled={false}
                        androidLayerType={"hardware"}
                        useContainer={false}

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
                    />
                </View>


                {/* -------------------- ASSIGNMENT SECTION -------------------- */}
                <View style={styles.assignmentContainer}>

                    {/* Toggle Yes / No */}
                    <View style={styles.assignmentToggleRow}>
                        <GlobalText style={styles.assignmentToggleText}>
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

                    <View>
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
                    </View>

                </View>
                {/* ---------------- END ASSIGNMENT SECTION ------------------ */}

                {/* -------------------- MEDIA ATTACHMENTS -------------------- */}
                <View style={styles.mediaContainer}>

                    <GlobalText style={styles.mediaHeader}>
                        Media Attachments
                    </GlobalText>

                    <TouchableOpacity
                        onPress={handleAttachments}
                        style={styles.uploadBox}
                    >
                        <Image
                            source={AppImage.attach_ic}
                            style={styles.uploadIcon}
                        />
                        <Text style={styles.uploadText}>Upload Files</Text>
                        <Text style={styles.uploadSubText}>Images, Videos, Documents (max 100MB)</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        onPress={handleAddVideoUpload}
                        style={styles.uploadBox}
                    >
                        <Image
                            source={AppImage.video_placeholder}
                            style={styles.uploadIcon}
                        />
                        <Text style={styles.uploadText}>Click to upload videos</Text>
                        <Text style={styles.uploadSubText}>MP4 / MOV (max 100MB)</Text>
                    </TouchableOpacity> */}

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

        </SafeAreaView>
    );
};

export default EditorScreen;