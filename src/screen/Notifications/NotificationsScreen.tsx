import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import GlobalSafeArea from "../../component/GlobalSafeArea";
import GlobalText from "../../component/GlobalText";
import { AppImage } from "../../config/AppImage";
import {
    fetchNotifications,
    markNotificationAsRead,
    NotificationItem,
} from "../../services/calls/notificationService";
import { styles } from "./style";

const NotificationsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
    const [items, setItems] = useState<NotificationItem[]>([]);

    const loadNotifications = async () => {
        try {
            const notifications = await fetchNotifications();
            setItems(notifications);
        } catch (error) {
            console.log("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleNotificationClick = async (item: NotificationItem) => {
        try {
            setItems(prev =>
                prev.map(n =>
                    n.id === item.id ? { ...n, isRead: true } : n
                )
            );

            await markNotificationAsRead(item.id);

            if (item.entityType && item.entityId) {
                const type = item.entityType.toLowerCase();
                
                if (type === 'story') {
                    navigation?.navigate("StoryDetailScreen", { id: item.entityId });
                } else if (type === 'assignment') {
                    // navigation?.navigate("AssignmentDetailsScreen", { id: item.entityId });
                    navigation?.navigate("AssignmentsScreen");
                }
            }

        } catch (error) {
            console.log("Error handling notification:", error);
            setItems(prev =>
                prev.map(n =>
                    n.id === item.id ? { ...n, isRead: item.isRead } : n
                )
            );
        }
    };

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const isUnread = !item.isRead;

        const source = item.iconUrl
            ? { uri: item.iconUrl, priority: FastImage.priority.normal }
            : AppImage.notification;

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                style={[
                    styles.card,
                    isUnread && styles.unreadCard,
                ]}
                onPress={() => handleNotificationClick(item)}
            >
                <FastImage
                    source={source as any}
                    style={styles.icon}
                    resizeMode={FastImage.resizeMode.contain}
                />

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <GlobalText
                            numberOfLines={1}
                            style={[
                                styles.title,
                                isUnread && styles.unreadTitle,
                            ]}
                        >
                            {item.notificationTitle}
                        </GlobalText>

                        {isUnread && <View style={styles.unreadDot} />}
                    </View>

                    <GlobalText
                        numberOfLines={2}
                        style={[
                            styles.description,
                            !isUnread && styles.readDescription,
                        ]}
                    >
                        {item.notificationMessage}
                    </GlobalText>

                    <GlobalText style={styles.dateText}>
                        {item.createdDate}
                    </GlobalText>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <GlobalSafeArea style={styles.container}>
            <GlobalText style={styles.screenTitle}>Complete Your KYC</GlobalText>
            <View style={styles.headerSpacer} />
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                showsVerticalScrollIndicator={false}
            />
        </GlobalSafeArea>
    );
};

export default NotificationsScreen;