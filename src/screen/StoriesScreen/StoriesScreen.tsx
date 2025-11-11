import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ListRenderItem,
} from "react-native";
import { AppColor } from "../../config/AppColor";

// 🧩 Interface for Story data model
export interface Story {
  id: string;
  title: string;
  description: string; // HTML string
  date: string;
  isPublished: boolean;
}

// 🧩 Helper function to strip HTML tags for preview
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]+>/g, "").trim();
};

// 🧩 Sample data (same as API response format)
const sampleData: Story[] = [
  {
    id: "1",
    title: "My First Story",
    description:
      "<div>this is description&nbsp;</div><h3>this is heading h3</h3><div><br></div><div>there will be html data.</div>",
    date: "Nov 10, 2025",
    isPublished: true,
  },
  {
    id: "2",
    title: "A Beautiful Journey",
    description:
      "<div>Exploring the world of creativity through stories and imagination.</div>",
    date: "Nov 09, 2025",
    isPublished: false,
  },
];

const StoriesScreen: React.FC = ({navigation}) => {
  const [search, setSearch] = useState<string>("");
  const [stories, setStories] = useState<Story[]>(sampleData);

  const renderCard: ListRenderItem<Story> = ({ item }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.isPublished ? "#4CAF50" : "#F39C12" },
          ]}
        >
          <Text style={styles.statusText}>
            {item.isPublished ? "Published" : "Draft"}
          </Text>
        </View>

        {/* Edit Button */}
        {!item.isPublished && <TouchableOpacity>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>}
      </View>

      {/* Description (HTML stripped) */}
      <Text style={styles.description} numberOfLines={3}>
        {stripHtml(item.description)}
      </Text>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.date}>{item.date}</Text>
        <TouchableOpacity>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Create New Story Button */}
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search stories..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
      />

      {/* FlatList */}
      <FlatList
        data={stories.filter((s) =>
          s.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default StoriesScreen;

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  createButton: {
    backgroundColor: AppColor.mainColor,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    fontSize: 15,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  editText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  description: {
    color: "#555",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "#999",
    fontSize: 12,
  },
  deleteText: {
    color: "#E74C3C",
    fontWeight: "600",
    fontSize: 13,
  },
});
