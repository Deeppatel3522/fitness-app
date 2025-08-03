import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CommonActions } from '@react-navigation/native';

const InitialRouteHandler = ({ navigation }) => {
  const { isFirstLaunch, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading) {
      // Navigate based on first launch status
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [
          { name: isFirstLaunch ? 'Onboarding' : 'Home' }
        ],
      });
      navigation.dispatch(resetAction);
    }
  }, [isLoading, isFirstLaunch, navigation]);

  return null; // This component doesn't render anything
};

export default InitialRouteHandler;
