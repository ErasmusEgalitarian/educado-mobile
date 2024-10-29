import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStudentInfo } from '../../services/StorageService';

const Tooltip = ({ text, tailPosition = '50%', tailSide = 'bottom', position, uniqueKey }) => {
  const [points, setPoints] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Dynamically compute storageKey based on uniqueKey
  const storageKey = useMemo(() => `tooltip_shown_${uniqueKey}`, [uniqueKey]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initialize Tooltip visibility and fetch points data
  useEffect(() => {
    const initializeTooltip = async () => {
      try {
        console.log('Storage key:', storageKey);
        const shownTooltip = await AsyncStorage.getItem(storageKey);

        if (!shownTooltip) {
          // Show tooltip and mark as shown
          await AsyncStorage.setItem(storageKey, 'true');
          setIsVisible(true);

          // Optionally hide tooltip after a delay
          setTimeout(() => {
            setIsVisible(false);
          }, 3000); // Adjust delay as necessary
        }

        const studentInfo = await getStudentInfo();
        setPoints(studentInfo?.points || 0);
      } catch (error) {
        console.error("Error initializing tooltip:", error);
      }
    };

    initializeTooltip();
  }, [storageKey]); // Only re-run when storageKey changes

  // Start fade-in animation when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isVisible]);

  const tailStyles = useMemo(() => getTailStyles(tailSide, tailPosition), [tailSide, tailPosition]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={[styles.overlay, position]}>
      <Animated.View style={[styles.tooltip, tailStyles.tooltip, { opacity: fadeAnim }]}>
        <Text style={styles.unicodeCharacter}>👩‍🏫</Text>
        <Text style={styles.tooltipText}>{text}</Text>
        <View style={[styles.tooltipTail, tailStyles.tooltipTail]} />
      </Animated.View>
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
  unicodeCharacter: {
    fontSize: 20,
    marginBottom: 5,
  },
});

export default Tooltip;