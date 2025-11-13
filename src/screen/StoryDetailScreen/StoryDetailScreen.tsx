import React from "react";
import { View, ScrollView, useWindowDimensions, StyleSheet } from "react-native";
import GlobalText from "../../component/GlobalText";
import RenderHTML, {
  defaultSystemFonts,
  HTMLElementModel,
  HTMLContentModel,
} from "react-native-render-html";
import { format } from "date-fns";
import Video from "react-native-video";

// ✅ Clean & minimal Story Detail screen
const StoryDetailScreen = ({ route }) => {
  const { item } = route.params;
  const { width } = useWindowDimensions();
  console.log(item);

  // 🎥 Custom renderer for <video>
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

  // ✅ Define custom model for <video>
  const customHTMLElementModels = {
    video: HTMLElementModel.fromCustomModel({
      tagName: "video",
      contentModel: HTMLContentModel.block,
    }),
  };

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  };

  const systemFonts = [...defaultSystemFonts, "System"];

  return (
    <ScrollView style={styles.container}>
      {/* Headline */}
      <GlobalText style={styles.headline}>{item.headline}</GlobalText>

      {/* Meta info */}
      <View style={styles.metaContainer}>
        <GlobalText style={styles.metaText}>
          Status: <GlobalText style={styles.metaValue}>{item.status || "Unknown"}</GlobalText>
        </GlobalText>
        <GlobalText style={styles.metaText}>
          Created:{" "}
          <GlobalText style={styles.metaValue}>{item.createdAt}</GlobalText>
        </GlobalText>
      </View>

      {/* Description HTML */}
      <View style={styles.htmlContainer}>
        <RenderHTML
          contentWidth={width}
          source={{ html: item.description }}
          systemFonts={systemFonts}
          renderers={renderers}
          renderersProps={renderersProps}
          customHTMLElementModels={customHTMLElementModels}
        />
      </View>
    </ScrollView>
  );
};

export default StoryDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  headline: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111",
  },
  metaContainer: {
    marginBottom: 16,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  metaValue: {
    fontWeight: "600",
    color: "#000",
  },
  htmlContainer: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  video: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
    borderRadius: 10,
    marginVertical: 10,
  },
});
