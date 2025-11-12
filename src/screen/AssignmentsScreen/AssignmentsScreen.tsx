import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { AppString } from "../../strings";
import { AppColor } from "../../config/AppColor";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  created: string;
  assignedBy: string;
  status: "pending" | "accepted" | "completed";
}

const sampleData: Assignment[] = [
  {
    id: "1",
    title: "Sports Event Coverage",
    description: "Cover the upcoming football championship final at National Stadium",
    deadline: "2025-10-20",
    created: "2025-10-17",
    assignedBy: "Ashish Sharma",
    status: "pending",
  },
  {
    id: "2",
    title: "City Infrastructure Report",
    description: "Investigate and report on the new metro rail construction progress",
    deadline: "2025-10-22",
    created: "2025-10-16",
    assignedBy: "Nitesh Dubey",
    status: "accepted",
  },
  {
    id: "3",
    title: "Education Reform Analysis",
    description: "Interview officials about the new curriculum changes",
    deadline: "2025-10-18",
    created: "2025-10-10",
    assignedBy: "Rajendra Rajput",
    status: "completed",
  },
];

const AssignmentsScreen: React.FC = ({ navigation }: any) => {
  const [search, setSearch] = useState<string>("");
  const [assignments, setAssignments] = useState<Assignment[]>(sampleData);

  const handleAccept = (id: string) => {

    //call api and then update the list for now
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "accepted" } : a))
    );
  };

  const handleDecline = (id: string) => {
    //call api and then update the list for now
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmitStory = (id: string) => {
    //call api and then update the list for now
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a))
    );
  };

  const renderCard = ({ item }: { item: Assignment }) => {
    const getBadgeColor = () => {
      switch (item.status) {
        case "pending":
          return AppColor.color_F39C12;
        case "accepted":
          return AppColor.color_3498DB;
        case "completed":
          return AppColor.color_27AE60;
        default:
          return AppColor.color_BDC3C7;
      }
    };

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => console.log("Card clicked:", item.title)}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
            <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📅 {AppString.common.deadline}: {item.deadline}</Text>
          <Text style={styles.metaText}>🧑‍💼 {AppString.common.assignedBy}: {item.assignedBy}</Text>
        </View>


        {item.status === "pending" && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.acceptBtn]}
              onPress={() => handleAccept(item.id)}
            >
              <Text style={styles.btnText}>{AppString.common.accept}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.declineBtn]}
              onPress={() => handleDecline(item.id)}
            >
              <Text style={styles.btnText}>{AppString.common.deadline}</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === "accepted" && (
          <TouchableOpacity
            style={[styles.button, styles.submitBtn]}
            onPress={() => handleSubmitStory(item.id)}
          >
            <Text style={styles.btnText}>{AppString.common.submitStory}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
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

      <FlatList
        data={assignments.filter((a) =>
          a.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

export default AssignmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 14,
    height: 45,
    marginBottom: 16,
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  description: {
    color: "#555",
    marginTop: 6,
    fontSize: 14,
  },
  metaRow: {
    marginTop: 10,
  },
  metaText: {
    color: "#777",
    fontSize: 13,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  acceptBtn: {
    backgroundColor: "#27AE60",
    marginRight: 10,
  },
  declineBtn: {
    backgroundColor: "#E74C3C",
  },
  submitBtn: {
    backgroundColor: "#2ECC71",
    marginTop: 14,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
