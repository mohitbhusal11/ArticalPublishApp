import React, { useState } from "react";
import { View, ScrollView, Image } from "react-native";
import GlobalText from "../../component/GlobalText";
import { AttachmentModal } from "../../services/calls/stories";
import { AppImage } from "../../config/AppImage";
import { AppColor } from "../../config/AppColor";
import { AppString } from "../../strings";
import { RichEditor } from "react-native-pell-rich-editor";
import GlobalButton from "../../component/GlobalButton";
import { styles } from "./style";
import Editor from "../../component/EditorComponent/Editor";

type Status = 'draft' | 'submit' | 'publish' | 'review';

function getStatusColorAdvanced(status: Status): string {
  switch (status?.toLowerCase()) {
    case 'draft':
      return AppColor.color_E74C3C;
    case 'submit':
      return AppColor.color_3B82F6;
    case 'publish':
      return AppColor.color_10B981;
    case 'review':
      return AppColor.color_F59E0B;
    default:
      return AppColor.color_6B7280;
  }
}

const StoryDetailScreen = ({ route }: any) => {
  const { item } = route.params;
  console.log("Story description:", item.description);

  console.log(item);
  const [attachmentList] = useState<AttachmentModal[]>(item.attachment)
  const richText = React.useRef<RichEditor>(null);
  const [showNewUpdate, setShowNewUpdate] = useState(false)

  const [editorState, setEditorState] = useState(null);

  const renderNewUpdate = () => {
    return (

      <View style={[styles.htmlContainer, { marginVertical: 24 }]}>
        <GlobalText style={{ fontSize: 16, fontWeight: 600, color: AppColor.mainColor }} >last update date: {new Date().toDateString()} </GlobalText>
        <RichEditor
          ref={richText}
          placeholder="Start writing something awesome..."
          initialContentHTML={item.description}
          androidLayerType={"hardware"}
          useContainer={false}
          disabled={true}
          style={{
            flex: 1,
            height: 500,
            backgroundColor: "#fff",
            borderWidth: 2,
            margin: 5,
            elevation: 2,
            borderRadius: 12,
          }}
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
    )
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <GlobalText style={styles.headline}>{item.headline}</GlobalText>

      <View style={styles.metaContainer}>
        <GlobalText style={styles.metaText}>
          {AppString.common.status}: <GlobalText style={[styles.metaValue, { color: getStatusColorAdvanced(item.status) }]}>{item.status || "Unknown"}</GlobalText>
        </GlobalText>
        <GlobalText style={styles.metaText}>
          {AppString.common.created}:{" "}
          <GlobalText style={styles.metaValue}>{item.createdAt}</GlobalText>
        </GlobalText>
        <GlobalText style={styles.metaText}>
          {AppString.common.updated}:{" "}
          <GlobalText style={styles.metaValue}>{item.updatedAt}</GlobalText>
        </GlobalText>
      </View>

      {/* <GlobalButton style={{ marginBottom: 10, padding: 12 }} onPress={() => setShowNewUpdate(!showNewUpdate)}><GlobalText style={{ color: AppColor.ffffff }} >{showNewUpdate ? AppString.common.cancelNewUpdate : AppString.common.newUpdate}</GlobalText></GlobalButton> */}

      {
        showNewUpdate &&
        <View style={{ marginVertical: 24, backgroundColor: AppColor.color_9A9A9A }} >
          <Editor
            initialTitle=""
            initialHtml=""
          />
        </View>
      }

      <View style={styles.htmlContainer}>
        <RichEditor
          ref={richText}
          placeholder="Start writing something awesome..."
          initialContentHTML={item.description}
          androidLayerType={"hardware"}
          useContainer={false}
          disabled={true}
          scrollEnabled={false}
          style={{
            flex: 1,
            height: 500,
            backgroundColor: "#fff",
            borderWidth: 2,
            margin: 5,
            elevation: 2,
            borderRadius: 12,
          }}
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

      {/* {renderNewUpdate()} */}

      {attachmentList.length > 0 && (
        <View style={styles.mediaContainer}>
          <GlobalText style={styles.mediaHeader}>
            {AppString.common.media}:
          </GlobalText>
          <View style={styles.listContainer}>
            {attachmentList.map((item, index) => {
              const fileName = item.filePath.split("/").pop() || "file";

              const isImage = item.mediaType === "Image";
              const isVideo = item.mediaType === "Video";
              const isDoc = item.mediaType === "Document";

              return (
                <View key={index} style={styles.row}>
                  <Image source={AppImage.file_ic} style={styles.fileIcon} />
                  <GlobalText style={styles.fileName} numberOfLines={1}>
                    {fileName}
                  </GlobalText>
                  {isImage && (
                    <Image source={{ uri: item.filePath }} style={styles.imagePreview} />
                  )}
                  {isVideo && (
                    <View style={styles.videoPreview}>
                      <GlobalText style={styles.videoText}>{AppString.common.video}</GlobalText>
                    </View>
                  )}
                  {isDoc && (
                    <View style={styles.docPreview}>
                      <GlobalText style={styles.docText}>{AppString.common.doc}</GlobalText>
                    </View>
                  )}

                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default StoryDetailScreen;