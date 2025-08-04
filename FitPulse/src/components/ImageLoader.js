import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

const ImageLoader = ({ 
  source, 
  style, 
  placeholderSource, 
  loaderColor = '#4CAF50',
  loaderSize = 'small',
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Main Image */}
      <Image
        {...props}
        source={error && placeholderSource ? placeholderSource : source}
        style={[style, { opacity: loading ? 0 : 1 }]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
      
      {/* Loading Overlay */}
      {loading && (
        <View style={[styles.loadingOverlay, style]}>
          {/* Show placeholder image with low opacity while loading */}
          {placeholderSource && (
            <Image 
              source={placeholderSource} 
              style={[style, styles.placeholder]} 
              resizeMode="contain"
            />
          )}
          {/* Loading Spinner */}
          <ActivityIndicator 
            size={loaderSize} 
            color={loaderColor}
            style={styles.spinner}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  placeholder: {
    position: 'absolute',
    opacity: 0.2,
  },
  spinner: {
    position: 'absolute',
  },
});

export default ImageLoader;
