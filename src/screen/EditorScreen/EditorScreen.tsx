import React, { useState } from "react";
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
import sanitizeHtml from "sanitize-html";
import beautify from "js-beautify";
import { postStory, PostStoryModal } from "../../services/calls/stories";

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



const EditorScreen = () => {
    const richText = React.useRef<RichEditor>(null);
    const [title, setTitle] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
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

        // Hindi fonts
        "Noto Sans"
    ]);

    const handleAddImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: "photo",
                quality: 0.8,
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

        // let cleanDescription = sanitizeHtml(htmlContent, {
        //     allowedTags: [
        //         "p",
        //         "b",
        //         "i",
        //         "u",
        //         "strong",
        //         "em",
        //         "h1",
        //         "h2",
        //         "h3",
        //         "h4",
        //         "h5",
        //         "h6",
        //         "ul",
        //         "ol",
        //         "li",
        //         "a",
        //         "img",
        //         "video",
        //         "source",
        //         "br",
        //         "span",
        //     ],
        //     allowedAttributes: {
        //         a: ["href", "name", "target", "rel"],
        //         img: ["src", "alt", "width", "height"],
        //         video: ["src", "controls", "poster", "width", "height"],
        //         source: ["src", "type"],
        //         span: ["style"],
        //         p: ["style"],
        //     },
        //     allowedSchemes: ["http", "https", "data"],
        //     selfClosing: ["img", "br", "source"],
        //     transformTags: {
        //         div: "p", // convert <div> → <p>
        //         br: () => "", // remove redundant <br>
        //         p: sanitizeHtml.simpleTransform("p", {}, true),
        //     },
        //     textFilter: (text) =>
        //         text
        //             .replace(/&nbsp;/g, " ")
        //             .replace(/&gt;/g, ">")
        //             .replace(/&lt;/g, "<")
        //             .replace(/&amp;/g, "&")
        //             .replace(/\s+/g, " "), // normalize spaces
        // });

        // cleanDescription = cleanDescription
        //     .replace(/(<p>\s*<\/p>)+/g, "")
        //     .replace(/(<br\s*\/?>\s*){2,}/g, "<br />")
        //     .replace(/\s*<\/(p|h\d)>\s*/g, "</$1>\n")
        //     .trim();

        // const prettyHtml = beautify.html(cleanDescription, {
        //     indent_size: 2,
        //     preserve_newlines: true,
        //     unformatted: ["b", "i", "u", "span"],
        // });

        const finalPayload : PostStoryModal = {
            headLine: title.trim(),
            description: htmlContent.trim(),
        };

        try {
            console.log("📤 Payload to send:", finalPayload);
            const response = await postStory(finalPayload)
            console.log("response poststory: ", response);
            
            // await api.post("/your-endpoint", finalPayload);
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Error", "Something went wrong while submitting.");
        }
    };


    const handleAddImageBase64 = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: "photo",
                quality: 0.8,
                includeBase64: true, // Required to get base64 data
            });

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (asset.base64 && asset.type) {
                    const base64Uri = `data:${asset.type};base64,${asset.base64}`;
                    richText.current?.insertImage(base64Uri);
                } else if (asset.uri) {
                    richText.current?.insertImage(asset.uri);
                }
            }
        } catch (error) {
            console.warn("Error picking image:", error);
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

                const staticImageUrl = "https://raj-express-staging.s3.ap-south-1.amazonaws.com/images/02_svg_4e91631d67.png";
                richText.current?.insertImage(staticImageUrl);

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

                // const response = await fetch("https://your-api-endpoint.com/upload/video", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "multipart/form-data",
                //     },
                //     body: formData,
                // });

                // const data = await response.json();
                // console.log("Upload Response:", data);

                // if (response.ok && data.url) {
                //     // Assuming API returns uploaded file URL as `data.url`
                //     richText.current?.insertVideo(data.url);
                // } else {
                //     Alert.alert("Upload failed", "Could not upload the video.");
                // }

                const staticVideoUrl = "https://raj-express-staging.s3.ap-south-1.amazonaws.com/raj-express-staging/videos/0743dd55-37ae-4f69-a4f8-14cef534b0ba.webm";
                richText.current?.insertVideo(staticVideoUrl);

            }
        } catch (error) {
            console.error("Image Upload Error:", error);
            Alert.alert("Error", "Something went wrong while uploading the image.");
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
                        <TouchableOpacity onPress={() => {
                            console.log("Draft saved:", { title, htmlContent });
                            Alert.alert("Draft Saved", "Your draft has been saved temporarily.");
                        }}>
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

                <Text style={styles.label}>{AppString.common.title}</Text>
                <TextInput
                    maxLength={200}
                    placeholder="Enter your title..."
                    value={title}
                    onChangeText={setTitle}
                    style={styles.titleInput}
                    placeholderTextColor={AppColor.color_aaa}
                />
                <Text style={styles.title}>{AppString.common.description}</Text>

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
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                // showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                {/* <Text style={styles.label}>{AppString.common.title}</Text>
                <TextInput
                    maxLength={200}
                    placeholder="Enter your title..."
                    value={title}
                    onChangeText={setTitle}
                    style={styles.titleInput}
                    placeholderTextColor={AppColor.color_aaa}
                />
                <Text style={styles.title}>{AppString.common.description}</Text>

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
                                onPressAddImage={handleAddImage}
                                // onPressAddImage={handleAddImageBase64}
                                // onPressAddImage={handleAddImageUpload}
                                onInsertLink={handleInsertLink}
                            />
                        </View>
                    </ScrollView>
                </View> */}

                <RichEditor
                    ref={richText}
                    placeholder="Start writing something awesome..."
                    style={styles.editor}
                    initialContentHTML=""
                    onChange={(text) => setHtmlContent(text)}
                    editorStyle={{
                        backgroundColor: AppColor.ffffff,
                        color: AppColor.color_222,
                        placeholderColor: AppColor.color_aaa,
                        contentCSSText: `
                            font-size: 16px;
                            line-height: 24px;
                            font-family: 'NotoSans-Regular', 'Arial', 'Mangal', 'NotoSansDevanagari-Regular', sans-serif;
                            overflow-y: auto;
                            padding: 10px;
                            img {
                                max-width: 100%;
                                height: auto;
                                border-radius: 8px;
                                margin-vertical: 8px;
                            }
                        `,
                    }}


                />

                {/* <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <GlobalText style={styles.submitText}>{AppString.common.submit}</GlobalText>
                </TouchableOpacity> */}
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