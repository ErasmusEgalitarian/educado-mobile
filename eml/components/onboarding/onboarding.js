import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStudentInfo } from '../../services/StorageService';

const Tooltip = ({ text, tailPosition = '50%', tailSide = 'bottom', position, uniqueKey }) => {
  const [points, setPoints] = useState(null);
const [isVisible, setIsVisible] = useState(false);
const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for re-running useEffect

// Dynamically compute storageKey based on uniqueKey
const storageKey = useMemo(() => `tooltip_shown_${uniqueKey}`, [uniqueKey]);

// Call this function whenever you want to re-run the useEffect
const refreshTooltip = () => setRefreshTrigger(prev => prev + 1);

useEffect(() => {
  const initializeTooltip = async () => {
    try {
      console.log('Storage key:', storageKey);
      const shownTooltip = await AsyncStorage.getItem(storageKey);
      console.log('Tooltip shown status:', shownTooltip);
      
      if (shownTooltip === null) {
        console.log('Tooltip has not been shown before; initializing to false.');
        await AsyncStorage.setItem(storageKey, 'false'); // Initialize the value if null
        setIsVisible(true); // Show tooltip since it hasn't been shown before
      } else if (shownTooltip === 'false') {
        console.log('Showing Tooltip');
        await AsyncStorage.setItem(storageKey, 'true'); // Update the value to indicate it has been shown
        setIsVisible(true);
      } else {
        setIsVisible(false); // Tooltip has been shown already
        return
      }

      const studentInfo = await getStudentInfo();
      const studentPoints = studentInfo?.points || 0;
      setPoints(studentPoints);
    } catch (error) {
      console.error("Error initializing tooltip:", error);
    }
  };

  initializeTooltip();
}, ); // Depend on storageKey and refreshTrigger



  const tailStyles = useMemo(() => getTailStyles(tailSide, tailPosition), [tailSide, tailPosition]);

  if (!isVisible) {
    return null;
  }
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
  }, [fadeAnim]);

  return (
    <View style={[styles.overlay, { 
      top: position.top, 
      left: position.left, 
      right: position.right, 
      bottom: position.bottom 
    }]}>
      <View style={[styles.tooltip, tailStyles.tooltip]}>
        <Text style={styles.unicodeCharacter}>👩‍🏫</Text>
        <Text style={styles.tooltipText}>{text}</Text>
        <View style={[styles.tooltipTail, tailStyles.tooltipTail]} />
      </View>
    </View>
  );
};

const getTailStyles = (side, position) => {
  const baseSize = 20;
  const heightSize = 10;

  const commonStyles = {
    borderLeftWidth: baseSize / 2,
    borderRightWidth: baseSize / 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  };

  switch (side) {
    case 'top':
      return {
        tooltip: { marginBottom: heightSize },
        tooltipTail: {
          ...commonStyles,
          top: -heightSize,
          left: position,
          borderTopWidth: 0,
          borderBottomWidth: heightSize,
          borderBottomColor: '#166276',
        },
      };
    case 'right':
      return {
        tooltip: { marginLeft: heightSize },
        tooltipTail: {
          right: -heightSize,
          top: position,
          borderRightWidth: 0,
          borderLeftWidth: heightSize,
          borderLeftColor: '#166276',
          borderTopWidth: baseSize / 2,
          borderBottomWidth: baseSize / 2,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
        },
      };
    case 'left':
      return {
        tooltip: { marginRight: heightSize },
        tooltipTail: {
          left: -heightSize,
          top: position,
          borderLeftWidth: 0,
          borderRightWidth: heightSize,
          borderRightColor: '#166276',
          borderTopWidth: baseSize / 2,
          borderBottomWidth: baseSize / 2,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
        },
      };
    case 'bottom':
    default:
      return {
        tooltip: { marginTop: heightSize },
        tooltipTail: {
          ...commonStyles,
          bottom: -heightSize,
          left: position,
          borderBottomWidth: 0,
          borderTopWidth: heightSize,
          borderTopColor: '#166276',
        },
      };
  }
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  tooltip: {
    backgroundColor: '#166276',
    padding: 10,
    borderRadius: 5,
    position: 'relative',
    zIndex: 1001,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  tooltipTail: {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    zIndex: 1002,
  },
  closeButtonText: {
    color: '#166276',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
});

export default Tooltip;