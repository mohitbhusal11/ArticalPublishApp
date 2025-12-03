import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { AppColor } from "../config/AppColor";
import GlobalText from "./GlobalText";

type ConfirmModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = "Logout Confirmation",
  message = "Are you sure you want to do logout?",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          <GlobalText style={styles.title}>{title}</GlobalText>

          <GlobalText style={styles.message}>{message}</GlobalText>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <GlobalText style={styles.confirmText}>Confirm</GlobalText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <GlobalText style={styles.cancelText}>Cancel</GlobalText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: AppColor.color_ffffff,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: AppColor.c000000,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: AppColor.color_555555,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  confirmBtn: {
    backgroundColor: AppColor.mainColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  confirmText: {
    color: AppColor.color_ffffff,
    fontWeight: "600",
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: AppColor.mainColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  cancelText: {
    color: AppColor.mainColor,
    fontWeight: "600",
  },
});
