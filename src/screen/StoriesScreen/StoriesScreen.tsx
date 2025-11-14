import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ListRenderItem,
} from "react-native";
import { AppString } from "../../strings";
import { getStories, Story } from "../../services/calls/stories";
import { useIsFocused } from "@react-navigation/native";
import { styles } from "./style";

// 🧩 Interface for Story data model
// export interface Story {
//   id: string;
//   title: string;
//   description: string; // HTML string
//   date: string;
//   isPublished: boolean;
// }

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]+>/g, "").trim();
};

// const sampleData: Story[] = [
//   {
//     id: "1",
//     title: "My First Story",
//     description:
//       "<div>this is description&nbsp;</div><h3>this is heading h3</h3><div><br></div><div>there will be html data.</div>",
//     date: "Nov 10, 2025",
//     isPublished: true,
//   },
//   {
//     id: "2",
//     title: "A Beautiful Journey",
//     description:
//       "<div>Exploring the world of creativity through stories and imagination.</div>",
//     date: "Nov 09, 2025",
//     isPublished: false,
//   },
// ];

const StoriesScreen: React.FC = ({ navigation }) => {
  const [search, setSearch] = useState<string>("");
  const [stories, setStories] = useState<Story[]>([]);
  const isFocused = useIsFocused();


  const fetchStories = async () => {
    try {
      const response = await getStories()
      console.log("response getStories: ", response);
      setStories(response.data)
    } catch (error) {
      console.log("error in fetchStories: ", error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchStories()
    }
  }, [isFocused])

  const handleStoryCard = (item: Story) => {
    console.log("clicked ");

    switch (item.status?.toLowerCase()) {
      case 'draft':
        navigation.navigate("DraftStoryScreen", { item: item })
        return;
      case 'submit':
        navigation.navigate("StoryDetailScreen", { item: item })
        return;
      case 'publish':
        navigation.navigate("StoryDetailScreen", { item: item })
        return;
      case 'review':
        navigation.navigate("StoryDetailScreen", { item: item })
        return;
      default:
        navigation.navigate("StoryDetailScreen", { item: item })
        return;
    }
  }

  const renderCard: ListRenderItem<Story> = ({ item }) => (
    <TouchableOpacity onPress={handleStoryCard.bind(null, item)} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={1}>
          {item.headline}
        </Text>

        {/* Status Badge */}
        {/* <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.isPublished ? "#4CAF50" : "#F39C12" },
          ]}
        >
          <Text style={styles.statusText}>
            {item.isPublished ? "Published" : "Draft"}
          </Text>
        </View> */}

        {/* Edit Button */}
        {/* {!item.isPublished && <TouchableOpacity>
          <Text style={styles.editText}>{AppString.common.edit}</Text>
        </TouchableOpacity>} */}
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {stripHtml(item.description)}
      </Text>

      <View style={styles.cardFooter}>
        {/* <Text style={styles.date}>{item.date}</Text> */}
        <Text style={styles.date}>{new Date().getDate()}</Text>
        <TouchableOpacity>
          <Text style={styles.deleteText}>{AppString.common.delete}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.searchInput}
        placeholder="Search stories..."
        placeholderTextColor="#777"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={stories.filter((s) =>
          s.headline.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default StoriesScreen;
