import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  mode: 'text' | 'background';
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#000000', '#ffffff', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#FFFF00', '#800080',
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  onSelectColor,
  mode,
  colors = DEFAULT_COLORS,
}) => {
  const [customColor, setCustomColor] = useState('');

  const handleCustomColorSelect = () => {
    // Validate hex color format
    const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    if (hexRegex.test(customColor)) {
      onSelectColor(customColor);
      setCustomColor('');
      onClose();
    } else {
      alert('Please enter a valid hex color, e.g., #FF0000');
    }
  };

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

          {/* Color grid */}
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

          {/* Custom color input */}
          <View style={styles.customColorContainer}>
            <TextInput
              placeholder="#RRGGBB"
              style={styles.colorInput}
              value={customColor}
              onChangeText={setCustomColor}
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleCustomColorSelect}
            >
              <Text style={{ color: '#fff' }}>Apply</Text>
            </TouchableOpacity>
          </View>

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
    backgroundColor: '#cac8c8ff',
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
  customColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  colorInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
    marginRight: 5,
  },
  applyButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
});

export default ColorPickerModal;
