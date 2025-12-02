import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelect: (px: number) => void;
}

export default function FontSizePickerSimple({ visible, onClose, onSelect }: Props) {
    const [value, setValue] = useState(16);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Font Size</Text>

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.circle}
                            onPress={() => setValue(v => Math.max(8, v - 1))}
                        >
                            <Text style={styles.symbol}>–</Text>
                        </TouchableOpacity>

                        <Text style={styles.value}>{value}px</Text>

                        <TouchableOpacity
                            style={styles.circle}
                            onPress={() => setValue(v => Math.min(72, v + 1))}
                        >
                            <Text style={styles.symbol}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { onSelect(value); onClose(); }}
                    >
                        <Text style={styles.buttonText}>Apply</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        width: '75%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    circle: {
        width: 45,
        height: 45,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center'
    },
    symbol: {
        fontSize: 30,
        color: '#2563eb'
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 20
    },
    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    },
    cancel: {
        paddingTop: 10,
        fontSize: 16,
        color: 'red'
    }
});
