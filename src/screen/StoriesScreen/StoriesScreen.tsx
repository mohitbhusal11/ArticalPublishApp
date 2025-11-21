import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getStories, Story } from "../../services/calls/stories";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { styles } from "./style";
import GlobalText from "../../component/GlobalText";
import GlobalSafeArea from "../../component/GlobalSafeArea";
import { AppColor } from "../../config/AppColor";
import LottieView from "lottie-react-native";
import { AppLottie } from "../../config/AppLottie";

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]+>/g, "").trim();
};

function getStatusColorAdvanced(status?: string): string {
  switch (status?.toLowerCase()) {
    case "draft":
      return "#E74C3C";
    case "submit":
      return "#3B82F6";
    case "publish":
      return "#10B981";
    case "review":
      return "#F59E0B";
    case "approved":
      return "#6366F1";
    default:
      return "#6B7280";
  }
}


const filters = ["All", "Submit", "Approved", "Review", "Draft", "Publish"];

const StoriesScreen = ({ navigation }: any) => {
  const route = useRoute<any>();
  const incomingStatus = route.params?.status ?? undefined;
  console.log("incomingStatus: ", incomingStatus);
  const isFocused = useIsFocused();
  const [stories, setStories] = useState<Story[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(incomingStatus);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [statusTrigger, setStatusTrigger] = useState(0);
  const filterListRef = useRef<FlatList>(null);


  useEffect(() => {
    if (isFocused) {
      const normalized =
        !incomingStatus || incomingStatus.toLowerCase() === "all"
          ? undefined
          : incomingStatus.toLowerCase();
      setStatus(normalized);
      setStatusTrigger((prev) => prev + 1);
    }
  }, [isFocused, incomingStatus]);

  // useEffect(() => {
  //   if (isFocused) {
  //     if (!incomingStatus) {
  //       setStatus(undefined);
  //     } else {
  //       const normalized =
  //         incomingStatus.toLowerCase() === "all"
  //           ? undefined
  //           : incomingStatus.toLowerCase();
  //       setStatus(normalized);
  //     }

  //     navigation.setParams({ status: undefined }); // Clear it

  //     setStatusTrigger((prev) => prev + 1);
  //   }
  // }, [isFocused]);

  // useEffect(() => {
  //   if (incomingStatus !== undefined) {
  //     const normalized =
  //       !incomingStatus || incomingStatus.toLowerCase() === "all"
  //         ? undefined
  //         : incomingStatus.toLowerCase();

  //     setStatus(normalized);
  //     setStatusTrigger((prev) => prev + 1);
  //   }
  // }, [incomingStatus]);

  useEffect(() => {
    resetAndFetch();
  }, [status, statusTrigger]);

  useEffect(() => {
    const index = filters.findIndex(f =>
      (f.toLowerCase() === "all" && status === undefined) ||
      status === f.toLowerCase()
    );

    if (index !== -1) {
      setTimeout(() => {
        filterListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }, 100); // small delay to allow rendering
    }
  }, [status]);


  const resetAndFetch = () => {
    setPage(1);
    setStories([]);
    setHasMore(true);
    fetchStories(1, false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      resetAndFetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchStories = async (pageNumber: number, isLoadMore = false) => {
    if (loading || loadingMore) return;

    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const query: any = {
        page: pageNumber,
        pageSize,
        search,
      };

      if (status) {
        query.status = status;
      }

      console.log("API Payload:", query);

      const response = await getStories(query);

      const newData = response.data ?? [];
      const total = response.total ?? 0;

      setStories((prev) => (pageNumber === 1 ? newData : [...prev, ...newData]));

      setHasMore(pageNumber * pageSize < total);
      console.log(response);

    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStories(nextPage, true);
  };

  const handleStoryCard = (item: Story) => {
    switch (item.status?.toLowerCase()) {
      case "draft":
        navigation.navigate("DraftStoryScreen", { item });
        return;
      default:
        navigation.navigate("StoryDetailScreen", { item });
        return;
    }
  };

  const renderCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => handleStoryCard(item)}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <GlobalText style={styles.title} numberOfLines={1}>
          {item.headline}
        </GlobalText>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColorAdvanced(item.status) },
          ]}
        >
          <GlobalText style={styles.statusText}>{item.status}</GlobalText>
        </View>
      </View>

      <GlobalText style={styles.description} numberOfLines={3}>
        {stripHtml(item.description)}
      </GlobalText>

      <View style={styles.cardFooter}>
        <GlobalText style={styles.date}>{item.createdAt}</GlobalText>
      </View>
    </TouchableOpacity>
  );

  const onFilterPress = (filter: string) => {
    const normalized =
      filter.toLowerCase() === "all" ? undefined : filter.toLowerCase();

    setStatus(normalized);
    setStatusTrigger((prev) => prev + 1);
  };


  return (
    <GlobalSafeArea style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search stories..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
      />

      <View style={{ marginTop: 10, marginBottom: 5, paddingVertical: 2 }}>
        <FlatList
          ref={filterListRef}
          horizontal
          data={filters}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
          renderItem={({ item }) => {
            // const isActive = status === item;
            const isActive =
              (item.toLowerCase() === "all" && status === undefined) ||
              status === item.toLowerCase();


            return (
              <TouchableOpacity
                onPress={() => onFilterPress(item)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 18,
                  borderRadius: 25,
                  marginRight: 10,
                  backgroundColor: isActive ? AppColor.mainColor : AppColor.color_D7D7D7,
                  shadowColor: "#000",
                  shadowOpacity: isActive ? 0.25 : 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: isActive ? 4 : 1,
                }}
              >
                <GlobalText
                  style={{
                    color: isActive ? "white" : "#111",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {item}
                </GlobalText>
              </TouchableOpacity>
            );
          }}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              filterListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 300);
          }}

        />
      </View>

      <FlatList
        data={stories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" style={{ marginVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={() =>
          !loading && (
            <GlobalText style={{ textAlign: "center", marginTop: 50 }}>
              No stories found
            </GlobalText>
          )
        }
      />

      {loading && page === 1 && (
        <View style={styles.loaderOverlay}>
          <LottieView
            source={AppLottie.loader}
            autoPlay
            loop
            style={{ width: 50, height: 50 }}
          />
        </View>
      )}
    </GlobalSafeArea>
  );
};

export default StoriesScreen;
