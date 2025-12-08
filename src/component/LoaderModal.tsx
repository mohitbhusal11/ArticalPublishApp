import LottieView from "lottie-react-native";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import { AppLottie } from "../config/AppLottie";

export type LoaderModalRef = {
    show: () => void;
    hide: () => void;
};

const LoaderModal = forwardRef<LoaderModalRef>((props, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => setVisible(true),
        hide: () => setVisible(false),
    }));

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.loaderBox}>
                    <LottieView
                        style={{ width: 50, height: 50 }}
                        autoPlay
                        loop
                        source={AppLottie.loader}
                    />
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    loaderBox: {
        padding: 5,
        backgroundColor: "white",
        borderRadius: 12,
    },
});

export default LoaderModal;
