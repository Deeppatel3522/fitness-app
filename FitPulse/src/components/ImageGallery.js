import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

const ImageGallery = ({ images, visible, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        
        <Image 
          source={images[selectedImageIndex]}
          style={styles.fullscreenImage}
          resizeMode="contain"
        />
        
        <View style={styles.thumbnailContainer}>
          {images.map((image, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => setSelectedImageIndex(index)}
            >
              <Image 
                source={image}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.selectedThumbnail
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fullscreenImage: {
    width: width * 0.9,
    height: height * 0.6,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
});

export default ImageGallery;
