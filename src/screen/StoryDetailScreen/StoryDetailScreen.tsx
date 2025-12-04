import React, { useState } from "react";
import { View, ScrollView, useWindowDimensions, StyleSheet, Image } from "react-native";
import GlobalText from "../../component/GlobalText";
import RenderHTML, {
  defaultSystemFonts,
  HTMLElementModel,
  HTMLContentModel,
} from "react-native-render-html";
import Video from "react-native-video";
import { AttachmentModal } from "../../services/calls/stories";
import { AppImage } from "../../config/AppImage";
import { AppColor } from "../../config/AppColor";
import { AppString } from "../../strings";

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

  const { width } = useWindowDimensions();
  console.log(item);
  const [attachmentList] = useState<AttachmentModal[]>(item.attachment)

  const renderers = {
    video: ({ tnode }: any) => {
      const src = tnode?.attributes?.src;
      const poster = tnode?.attributes?.poster;
      if (!src) return null;
      return (
        <Video
          source={{ uri: src }}
          poster={poster}
          controls
          resizeMode="contain"
          style={styles.video}
        />
      );
    },
  };

  const customHTMLElementModels = {
    video: HTMLElementModel.fromCustomModel({
      tagName: "video",
      contentModel: HTMLContentModel.block,
    }),
  };

  const tagsStyles: Record<string, any> = {
    img: {
      width: "100%",
      maxHeight: 200,
      resizeMode: "contain",
      borderRadius: 10,
      marginVertical: 10,
    },
    video: {
      width: "100%",
      height: 200,
      borderRadius: 10,
      marginVertical: 10,
      backgroundColor: AppColor.color_000,
    }
  };

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  };

  const systemFonts = [...defaultSystemFonts, "System"];

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.htmlContainer}>
        <RenderHTML
          contentWidth={width}
          source={{ html: item.description }}
          systemFonts={systemFonts}
          tagsStyles={tagsStyles}
          renderers={renderers}
          renderersProps={renderersProps}
          customHTMLElementModels={customHTMLElementModels}
          computeEmbeddedMaxWidth={() => width - 40}
        />
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: AppColor.color_F5F5F5,
  },
  headline: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: AppColor.color_111111,
  },
  metaContainer: {
    marginBottom: 16,
    backgroundColor: AppColor.color_ffffff,
    padding: 10,
    borderRadius: 12,
    shadowColor: AppColor.color_000,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metaText: {
    fontSize: 14,
    color: AppColor.color_666666,
  },
  metaValue: {
    fontWeight: "600",
    color: AppColor.c000000,
  },
  htmlContainer: {
    backgroundColor: AppColor.color_ffffff,
    padding: 12,
    borderRadius: 12,
    shadowColor: AppColor.color_000,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  video: {
    width: "100%",
    height: 220,
    backgroundColor: AppColor.color_000,
    borderRadius: 10,
    marginVertical: 10,
  },
  mediaContainer: {
    marginTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },

  mediaHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: AppColor.color_222,
  },
  listContainer: {
    marginTop: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: AppColor.color_DDDDDD,
  },

  fileIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },

  fileName: {
    flex: 1,
    color: AppColor.color_333333,
  },

  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },

  videoPreview: {
    width: 40,
    height: 40,
    backgroundColor: AppColor.color_000,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginRight: 10,
  },
  videoText: {
    color: AppColor.color_FFFFFF,
    fontSize: 10,
  },

  docPreview: {
    width: 40,
    height: 40,
    backgroundColor: AppColor.color_E9E9E9,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginRight: 10,
  },
  docText: {
    color: AppColor.color_555555,
    fontSize: 10,
  },
});