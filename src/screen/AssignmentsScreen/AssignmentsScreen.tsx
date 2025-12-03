import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AppString } from "../../strings";
import { AppColor } from "../../config/AppColor";
import { Assignment, getAssignments, updateAssignment, UpdateAssignmentModal } from "../../services/calls/assignmentService";
import { useIsFocused, useRoute } from "@react-navigation/native";
import GlobalText from "../../component/GlobalText";
import { styles } from "./style";
import ToastUtils from "../../utils/toast";
import LottieView from "lottie-react-native";
import { AppLottie } from "../../config/AppLottie";

const filters = ["All", "Accepted", "Submit", "Pending", "Rejected"];

const AssignmentsScreen: React.FC = ({ navigation }: any) => {
  const route = useRoute<any>();
  const incomingStatus = route.params?.status ?? undefined;
  console.log("incomingStatus: ", incomingStatus);
  const isFocused = useIsFocused();
  const [search, setSearch] = useState<string>("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
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
      }, 100);
    }
  }, [status]);


  const resetAndFetch = () => {
    setPage(1);
    setAssignments([]);
    setHasMore(true);
    fetchAssignment(1, false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      resetAndFetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchAssignment = async (pageNumber: number, isLoadMore = false) => {
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

      const response = await getAssignments(query);

      const newData = response.data ?? [];
      const total = response.total ?? 0;

      setAssignments((prev) => (pageNumber === 1 ? newData : [...prev, ...newData]));

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
    fetchAssignment(nextPage, true);
  };

  const handleAccept = async (id: number) => {
    setLoading(true);
    try {
      const payload: UpdateAssignmentModal = {
        assignmentId: id,
        isAccepted: true,
      };
      const response = await updateAssignment(payload);
      console.log("Accept Response:", response);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "accepted" } : a
        )
      );
      ToastUtils.success("Assignment accepted");
    } catch (error) {
      console.log("Accept error:", error);
      ToastUtils.error("Failed to accept assignment");
    } finally {
      setLoading(false);
    }
  };


  const handleDecline = async (id: number) => {
    try {
      setLoading(true);

      const payload: UpdateAssignmentModal = {
        assignmentId: id,
        isAccepted: false,
      };

      const response = await updateAssignment(payload);
      console.log("Decline Response:", response);

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: "rejected" } : a
        )
      );

      ToastUtils.success("Assignment declined");
    } catch (error) {
      console.log("Decline error:", error);
      ToastUtils.error("Failed to decline assignment");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmitStory = (item: Assignment) => {
    navigation.navigate("AssignmentDetailsScreen", item)
  };

  const renderCard = ({ item }: { item: Assignment }) => {
    const getBadgeColor = () => {
      switch (item.status.toLowerCase()) {
        case "pending":
          return AppColor.color_F39C12;
        case "accepted":
          return AppColor.color_3498DB;
        case "submit":
          return AppColor.color_27AE60;
        case "rejected":
          return AppColor.color_E82427;
        default:
          return AppColor.color_BDC3C7;
      }
    };

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handleSubmitStory(item)}
      >
        <View style={styles.headerRow}>
          <GlobalText numberOfLines={1} style={styles.title}>{item.title}</GlobalText>
          <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
            <GlobalText style={styles.badgeText}>{item.status.toUpperCase()}</GlobalText>
          </View>
        </View>

        <GlobalText numberOfLines={2} style={styles.description}>{item.brief}</GlobalText>

        <View style={styles.metaRow}>
          <GlobalText style={styles.metaText}>📅 {AppString.common.deadline}: {item.deadlineAt}</GlobalText>
        </View>


        {item.status.toLowerCase() === "pending" && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.acceptBtn]}
              onPress={() => handleAccept(item.id)}
            >
              <GlobalText style={styles.btnText}>{AppString.common.accept}</GlobalText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.declineBtn]}
              onPress={() => handleDecline(item.id)}
            >
              <GlobalText style={styles.btnText}>{AppString.common.decline}</GlobalText>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, styles.submitBtn]}
          onPress={() => handleSubmitStory(item)}
        >
          <GlobalText style={styles.btnText}>{AppString.common.seeDetails}</GlobalText>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const onFilterPress = (filter: string) => {
    const normalized =
      filter.toLowerCase() === "all" ? undefined : filter.toLowerCase();

    setStatus(normalized);
    setStatusTrigger((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search assignment..."
        placeholderTextColor="#888"
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
        data={assignments.filter((a) =>
          a.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 40 }}
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
              No Assignment found
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
    </View>
  );
};

export default AssignmentsScreen;