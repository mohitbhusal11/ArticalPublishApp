import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import FastImage from "react-native-fast-image";
import GlobalSafeArea from "../../component/GlobalSafeArea";
import GlobalText from "../../component/GlobalText";
import { AppImage } from "../../config/AppImage";
import { AppColor } from "../../config/AppColor";

type NotificationItem = {
    id: string | number;
    title: string;
    description: string;
    date: string;
    iconUrl?: string | null;
};

const CARD_HEIGHT = 92;

const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return d.toLocaleDateString();
};

const NotificationsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
    const [items, setItems] = useState<NotificationItem[]>([]);

    const loadNotifications = async () => {
        const mock: NotificationItem[] = [
            {
                id: 1,
                title: "Welcome to RensApp",
                description: "Thanks for joining! Explore the app and customize your profile.",
                date: new Date().toISOString(),
                iconUrl: null,
            },
            {
                id: 2,
                title: "Assignment updated",
                description: "Your assignment has been reviewed. Check the details in Assignments screen for comments and next steps.",
                date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
                iconUrl: "https://example.com/icons/assignment.png",
            },
        ];
        setItems(mock);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const source = item.iconUrl
            ? { uri: item.iconUrl, priority: FastImage.priority.normal }
            : AppImage.notification;

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.card}
                onPress={() => {}}>
                <FastImage source={source as any} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
                <View style={styles.content}>
                    <GlobalText style={styles.title} numberOfLines={1}>
                        {item.title}
                    </GlobalText>

                    <View style={styles.bottomRow}>
                        <GlobalText style={styles.description} numberOfLines={3}>
                            {item.description}
                        </GlobalText>

                        <GlobalText style={styles.dateText}>
                            {formatDate(item.date)}
                        </GlobalText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <GlobalSafeArea style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(i) => i.id.toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </GlobalSafeArea>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: AppColor.ffffff,
        borderRadius: 8,
        padding: 12,
        minHeight: CARD_HEIGHT,
        shadowColor: AppColor.c000000,
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 2,
    },
    icon: {
        width: 24,
        height: 24,
        borderRadius: 8,
        backgroundColor: AppColor.color_f2f2f2,
        alignSelf: 'center'
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
        color: AppColor.mainColor,
    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "flex-end",
    },
    description: {
        flex: 1,
        fontSize: 13,
        color: AppColor.color_555555,
        lineHeight: 18,
    },
    dateText: {
        marginLeft: 8,
        fontSize: 12,
        color: AppColor.color_999999,
        alignSelf: "flex-end",
    },
});