import React, { useState } from "react";
import { View, ScrollView, Image } from "react-native";
import GlobalText from "../../component/GlobalText";
import { AttachmentModal, descNewUpdate, getStoryByID } from "../../services/calls/stories";
import { AppImage } from "../../config/AppImage";
import { AppColor } from "../../config/AppColor";
import { AppString } from "../../strings";
import { RichEditor } from "react-native-pell-rich-editor";
import { styles } from "./style";
import Editor from "../../component/EditorComponent/Editor";
import GlobalButton from "../../component/GlobalButton";
import { hideLoader, showLoader } from "../../../App";
import ToastUtils from "../../utils/toast";

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
  const storyId = item.id;
  const [storyData, setStoryData] = useState(item);
  const [newUpdateHtml, setNewUpdateHtml] = useState("");
  // console.log(item);
  const [attachmentList] = useState<AttachmentModal[]>(item.attachment)
  const [showNewUpdate, setShowNewUpdate] = useState(false)

  const renderStoryUpdates = () => {
    const updates = storyData.storyDescription ?? [];

    return updates.map((update: any, index: number) => {
      const isEditable = update.statusId === 1;

      return (
        <View
          key={update.id}
          style={[styles.htmlContainer, { marginVertical: 16 }]}
        >
          <GlobalText
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: AppColor.mainColor,
              marginBottom: 8,
            }}
          >
            Update {index + 1}
            {update.createdAt && ` • ${new Date(update.createdAt).toDateString()}`}
          </GlobalText>

          {isEditable ? (
            <Editor
              initialHtml={update.desc}
              storyId={storyId}
              storyDescId={update.id}
              onDraft={(html) => handleSave(html, 1, update.id)}
              onSubmit={(html) => handleSave(html, 2, update.id)}
            />
          ) : (
            <RichEditor
              disabled
              useContainer
              initialContentHTML={update.desc}
              androidLayerType="hardware"
              style={{
                height: 500,
                backgroundColor: "#fff",
                borderWidth: 2,
              }}
            />
          )}
        </View>
      );
    });
  };

  const refetchStory = async () => {
    try {
      const data = await getStoryByID({ storyId: storyId });
      console.log("Data story details: ",data);
      
      setStoryData(data);
    } catch (error) {
      console.log(error);
    }
  };


  const renderMainStory = () => (
    <View style={[styles.htmlContainer, { marginVertical: 16 }]}>
      <GlobalText
        style={{ fontSize: 16, fontWeight: "600", color: AppColor.mainColor }}
      >
        Original Story
      </GlobalText>

      <RichEditor
        disabled
        useContainer
        initialContentHTML={storyData.description}
        androidLayerType="hardware"
        style={{
          height: 500,
          backgroundColor: "#fff",
          borderWidth: 2,
          // borderRadius: 12,
        }}
      />
    </View>
  );

  const handleSave = async (
    html: string,
    statusId: 1 | 2,
    storyDescId?: number
  ) => {
    try {
      showLoader?.();

      const payload = {
        StoryDescription: [
          {
            ...(storyDescId ? { id: storyDescId } : {}),
            Desc: html,
            StatusId: statusId,
          },
        ],
      };

      console.log("payload: ", payload);
      console.log("storyData.id: ", storyData.id);


      await descNewUpdate(payload, {
        storyId: storyData.id,
      });

      ToastUtils.success(statusId === 1
          ? "Draft saved successfully"
          : "Story submitted successfully")

      // 🔄 REFRESH SCREEN DATA AFTER SAVE
      await refetchStory(); // your API call
      if (!storyDescId) {
        setNewUpdateHtml("");       // clear editor content
        setShowNewUpdate(false);    // hide editor
      }
    } catch (err) {
      // Alert.alert("Error Something went wrong");
      ToastUtils.error("Error Something went wrong")
      console.log(err);
    } finally {
      hideLoader?.();
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <GlobalText style={styles.headline}>{storyData.headline}</GlobalText>

      <View style={styles.metaContainer}>
        <GlobalText style={styles.metaText}>
          {AppString.common.status}: <GlobalText style={[styles.metaValue, { color: getStatusColorAdvanced(storyData.status) }]}>{item.status || "Unknown"}</GlobalText>
        </GlobalText>
        <GlobalText style={styles.metaText}>
          {AppString.common.created}:{" "}
          <GlobalText style={styles.metaValue}>{storyData.createdAt}</GlobalText>
        </GlobalText>
        <GlobalText style={styles.metaText}>
          {AppString.common.updated}:{" "}
          <GlobalText style={styles.metaValue}>{storyData.updatedAt}</GlobalText>
        </GlobalText>
      </View>

      <GlobalButton style={{ marginBottom: 10, padding: 12 }} onPress={() => setShowNewUpdate(!showNewUpdate)}><GlobalText style={{ color: AppColor.ffffff }} >{showNewUpdate ? AppString.common.cancelNewUpdate : AppString.common.newUpdate}</GlobalText></GlobalButton>

      {showNewUpdate && (
        <View style={{ marginVertical: 24 }}>
          <Editor
            initialHtml={newUpdateHtml}
            storyId={storyId}
            storyDescId={null}
            onChangeHtml={setNewUpdateHtml}
            onDraft={(html) => handleSave(html, 1)}
            onSubmit={(html) => handleSave(html, 2)}
          />
        </View>
      )}

      {renderMainStory()}

      {renderStoryUpdates()}

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