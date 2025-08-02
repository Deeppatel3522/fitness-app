import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress, height = 8, backgroundColor = '#e0e0e0', fillColor = '#4CAF50' }) => {
  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View 
        style={[
          styles.fill, 
          { 
            width: `${progress}%`, 
            backgroundColor: fillColor,
            height 
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
});

export default ProgressBar;
