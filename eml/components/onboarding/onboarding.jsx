import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStudentInfo } from '../../services/StorageService';
import { Button } from 'react-native-paper';

const Tooltip = ({ text, tailPosition = '50%', tailSide = 'bottom', position, uniqueKey, uniCodeChar }) => {
  const [points, setPoints] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const storageKey = useMemo(() => `tooltip_shown_${uniqueKey}`, [uniqueKey]);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const initializeTooltip = async () => {
      try {
        console.log('Storage key:', storageKey);
        const shownTooltip = await AsyncStorage.getItem(storageKey);
        console.log('Shown tooltip: for' + uniqueKey, shownTooltip);

        if (shownTooltip) { //should be !shownTooltip
          await AsyncStorage.setItem(storageKey, 'true');
          setTimeout(() => {
            setIsVisible(true);
          }, 1500);
        }

        const studentInfo = await getStudentInfo();
        setPoints(studentInfo?.points || 0);
      } catch (error) {
        console.error("Error initializing tooltip:", error);
      }
    };
    console.log(storageKey);
    initializeTooltip();
  }, [storageKey, getStudentInfo]);

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -20,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 20,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [scaleAnim, rotateAnim, isVisible]);

  const tailStyles = useMemo(() => getTailStyles(tailSide, tailPosition), [tailSide, tailPosition]);

  if (!isVisible) {
    return null;
  }

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      {
        rotate: rotateAnim.interpolate({
          inputRange: [-20, 20],
          outputRange: ['-20deg', '20deg'],
        })
      },
    ],
  };

  return (
    <View style={[styles.overlay, position]}>
      <Animated.View style={[styles.tooltip, tailStyles.tooltip, animatedStyle]}>
        <Text style={styles.unicodeCharacter}>{uniCodeChar}</Text>
        <Text style={styles.tooltipText}>{text}</Text>
        <Button onPress={() => setIsVisible(false)} style={styles.tooltipFooter}>
          <Text style={styles.tooltipFooterText}>fechar</Text>
        </Button>
        <Animated.View style={[styles.tooltipTail, tailStyles.tooltipTail, animatedStyle]} />
      </Animated.View>
    </View>
  );
};

const getTailStyles = (side, position) => {
  const baseSize = 25;
  const heightSize = 15;

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
    borderRadius: 10,
    position: 'relative',
    zIndex: 1001,
    width: 265,
    height: 155,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 5,
    marginTop: 0,
    marginLeft: 25,
    marginRight: 1,
  },
  tooltipFooter: {
    position: 'absolute',
    bottom: 5,
    right: 10,
  },
  tooltipFooterText: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  tooltipTail: {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 1000,
  },
  unicodeCharacter: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: 20,
  },
});

export default Tooltip;