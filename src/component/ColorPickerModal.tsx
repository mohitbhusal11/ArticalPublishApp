import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  mode: 'text' | 'background';
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFF00', '#800080',
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  onSelectColor,
  mode,
  colors = DEFAULT_COLORS,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'text' ? 'Select Text Color' : 'Select Background Color'}
          </Text>

          <FlatList
            data={colors}
            keyExtractor={(item) => item}
            numColumns={4}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.colorBox, { backgroundColor: item }]}
                onPress={() => onSelectColor(item)}
              />
            )}
          />

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  colorBox: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 4,
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default ColorPickerModal;