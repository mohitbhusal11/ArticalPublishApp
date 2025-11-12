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
} from "react-native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { launchImageLibrary } from "react-native-image-picker";
import { styles } from "./style";
import { AppString } from "../../strings";
import GlobalText from "../../component/GlobalText";
import { AppColor } from "../../config/AppColor";

const customFontAction = "customFontPicker";

const handleHead1 = ({ tintColor }: { tintColor: string }) => (
    <Text style={{ color: tintColor, fontWeight: "bold" }}>H1</Text>
);
const handleHead2 = ({ tintColor }: { tintColor: string }) => (
    <Text style={{ color: tintColor, fontWeight: "bold" }}>H2</Text>
);
const handleHead3 = ({ tintColor }: { tintColor: string }) => (
    <Text style={{ color: tintColor, fontWeight: "bold" }}>H3</Text>
);
const handleHead4 = ({ tintColor }: { tintColor: string }) => (
    <Text style={{ color: tintColor, fontWeight: "bold" }}>H4</Text>
);
const handleHead5 = ({ tintColor }: { tintColor: string }) => (
    <Text style={{ color: tintColor, fontWeight: "bold" }}>H5</Text>
);
const handleHead6 = ({ tintColor }: { tintColor: string }) => (
    <Text style={{ color: tintColor, fontWeight: "bold" }}>H6</Text>
);


const FontIcon = ({ tintColor }: { tintColor: string }) => (
    <Text style={{ color: tintColor, fontWeight: "bold" }}>Aa</Text>
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

        // const finalPayload = {
        //     title: `<h1>${title.trim()}</h1>`,
        //     description: htmlContent.trim(),
        // };
        const finalPayload = {
            title: title.trim(),
            description: htmlContent.trim(),

        };

        try {
            console.log("📤 Payload to send:", finalPayload);
        } catch (error) {
            console.error("API Error:", error);

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
                mediaType: "mixed",
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
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                <Text style={styles.label}>{AppString.common.title}</Text>
                <TextInput
                    maxLength={200}
                    placeholder="Enter your title..."
                    value={title}
                    onChangeText={setTitle}
                    style={styles.titleInput}
                    placeholderTextColor="#aaa"
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
                                <Text style={[styles.customToolText, {fontSize: 20}]}>▦</Text>
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
                </View>

                <RichEditor
                    ref={richText}
                    placeholder="Start writing something awesome..."
                    style={styles.editor}
                    initialContentHTML=""
                    onChange={(text) => setHtmlContent(text)}
                    editorStyle={{
                        backgroundColor: "#fff",
                        color: "#222",
                        placeholderColor: "#aaa",
                        contentCSSText: `
                            font-size: 16px;
                            line-height: 24px;
                            overflow-y: auto;
                            padding: 10px;
                        `,
                    }}


                />

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <GlobalText style={styles.submitText}>{AppString.common.submit}</GlobalText>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showLinkModal} transparent animationType="fade" onRequestClose={closeModal}>
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20
                    }}>
                        <GlobalText style={{ fontWeight: 'bold', marginBottom: 10 }}>{AppString.common.insertLink}</GlobalText>
                        <TextInput
                            placeholder="Link Title"
                            value={linkTitle}
                            onChangeText={setLinkTitle}
                            style={{ borderBottomWidth: 1, marginBottom: 10 }}
                        />
                        <TextInput
                            placeholder="Link URL"
                            value={linkUrl}
                            onChangeText={setLinkUrl}
                            style={{ borderBottomWidth: 1, marginBottom: 20 }}
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
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        width: '80%',
                        backgroundColor: AppColor.ffffff,
                        borderRadius: 10,
                        padding: 20,
                        maxHeight: '60%',
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
                            {AppString.common.selectFont}
                        </Text>
                        <ScrollView>
                            {fonts.map((font) => (
                                <TouchableOpacity
                                    key={font}
                                    style={{
                                        paddingVertical: 8,
                                        borderBottomWidth: 1,
                                        borderColor: '#eee',
                                    }}
                                    onPress={() => handleSelectFont(font)}
                                >
                                    <Text style={{ fontFamily: font, fontSize: 18 }}>{font}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            onPress={() => setShowFontModal(false)}
                            style={{
                                marginTop: 15,
                                backgroundColor: '#eee',
                                paddingVertical: 10,
                                borderRadius: 8,
                                alignItems: 'center',
                            }}>
                            <Text style={{ fontWeight: '500' }}>{AppString.common.cancel}</Text>
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