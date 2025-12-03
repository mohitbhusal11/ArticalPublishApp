import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import GlobalText from "../../component/GlobalText";
import { useRoute, useNavigation } from "@react-navigation/native";
import { styles } from "./style";
import {
    Assignment,
    updateAssignment,
    UpdateAssignmentModal,
} from "../../services/calls/assignmentService";
import ToastUtils from "../../utils/toast";
import { AppColor } from "../../config/AppColor";

const AssignmentDetailsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const item: Assignment = route.params;

    const [loading, setLoading] = useState(false);
    const [assignment, setAssignment] = useState<Assignment>(item);

    const getBadgeColor = () => {
        switch (assignment.status.toLowerCase()) {
            case "pending":
                return AppColor.color_F39C12;
            case "accepted":
                return AppColor.color_3498DB;
            case "submited":
                return AppColor.color_27AE60;
            case "rejected":
                return AppColor.color_E82427;
            default:
                return AppColor.color_BDC3C7;
        }
    };

    const handleAccept = async (id: number) => {
        setLoading(true);
        try {
            const payload: UpdateAssignmentModal = {
                assignmentId: id,
                isAccepted: true,
            };

            await updateAssignment(payload);

            setAssignment((prev) => ({
                ...prev,
                status: "accepted",
                isAccepted: true,
            }));

            ToastUtils.success("Assignment accepted");
        } catch (error) {
            ToastUtils.error("Failed to accept assignment");
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async (id: number) => {
        setLoading(true);
        try {
            const payload: UpdateAssignmentModal = {
                assignmentId: id,
                isAccepted: false,
            };

            await updateAssignment(payload);

            setAssignment((prev) => ({
                ...prev,
                status: "rejected",
                isAccepted: false,
            }));

            ToastUtils.success("Assignment declined");
        } catch (error) {
            ToastUtils.error("Failed to decline assignment");
        } finally {
            setLoading(false);
        }
    };

    const renderActions = () => {
        const status = assignment.status.toLowerCase();

        if (status === "pending") {
            return (
                <View style={styles.actionRow}>

                    <TouchableOpacity
                        style={[styles.button, styles.acceptBtn]}
                        onPress={() => handleAccept(assignment.id)}
                        disabled={loading}
                    >
                        <GlobalText style={styles.btnText}>Accept</GlobalText>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[styles.button, styles.declineBtn]}
                        onPress={() => handleDecline(assignment.id)}
                        disabled={loading}
                    >
                        <GlobalText style={styles.btnText}>Decline</GlobalText>
                    </TouchableOpacity>
                </View>
            );
        }

        if (status === "accepted") {
            return (
                <TouchableOpacity
                    style={[styles.button, styles.createBtn]}
                    onPress={() => navigation.navigate("EditorScreen", assignment)}
                >
                    <GlobalText style={styles.btnText}>Create Story</GlobalText>
                </TouchableOpacity>
            );
        }

        if (status === "rejected") {
            return (
                <View style={styles.infoBox}>
                    <GlobalText style={styles.infoText}>
                        You have rejected this assignment.
                    </GlobalText>
                </View>
            );
        }

        if (status === "submitted") {
            return (
                <View style={styles.infoBox}>
                    <GlobalText style={styles.infoText}>
                        You have submitted the assignment story.
                    </GlobalText>
                </View>
            );
        }

        return null;
    };

    return (
        <ScrollView style={styles.container}>

            <GlobalText style={styles.title}>{assignment.title}</GlobalText>

            <View style={styles.card}>
                <Row label="Assignment Code" value={assignment.assignmentCode} />
                <Row label="Posted By" value={assignment.proposedBy || "N/A"} />
                <Row label="Posted To" value={assignment.postedTo || "N/A"} />
                <Row label="Deadline" value={assignment.deadlineAt || "No Deadline"} />
                <Row label="Geo Location" value={assignment.geoLocation || "Not Provided"} />
                <Row label="Created At" value={assignment.createdAt} />

                <Row
                    label="Status"
                    value={assignment.status}
                    isStatus
                    statusColor={getBadgeColor()}
                />
            </View>

            <View style={styles.briefCard}>
                <GlobalText style={styles.sectionTitle}>Brief</GlobalText>
                <GlobalText style={styles.briefText}>{assignment.brief}</GlobalText>
            </View>

            {renderActions()}
        </ScrollView>
    );
};

export default AssignmentDetailsScreen;

const Row = ({ label, value, isStatus = false, statusColor = AppColor.mainColor }) => {
    return (
        <View style={styles.rowContainer}>
            <GlobalText style={styles.rowLabel}>{label}</GlobalText>

            {isStatus ? (
                <View
                    style={[
                        styles.badge,
                        { backgroundColor: statusColor || AppColor.color_BDC3C7 },
                    ]}
                >
                    <GlobalText style={styles.badgeText}>{value}</GlobalText>
                </View>
            ) : (
                <GlobalText numberOfLines={3} style={styles.rowValue}>
                    {value}
                </GlobalText>
            )}
        </View>
    );
};