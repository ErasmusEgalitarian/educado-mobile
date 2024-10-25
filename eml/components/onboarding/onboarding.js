import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tooltip = ({ text, tailPosition = '50%', tailSide = 'bottom', position }) => {
  const tailStyles = getTailStyles(tailSide, tailPosition);

  return (
    <View style={styles.overlay}>
      <View style={[styles.tooltip, tailStyles.tooltip]}>
        <Text style={styles.tooltipText}>{text}</Text>
        <View style={[styles.tooltipTail, tailStyles.tooltipTail]} />
      </View>
    </View>
  );
};

const getTailStyles = (side, position) => {
  const baseSize = 20; // Base size for the tail
  const heightSize = 10; // Height size for the tail

  switch (side) {
    case 'top':
      return {
        tooltip: {
          marginBottom: heightSize,
        },
        tooltipTail: {
          top: -heightSize,
          left: position,
          borderTopWidth: 0,
          borderBottomWidth: heightSize,
          borderBottomColor: '#166276',
          borderLeftWidth: baseSize / 2,
          borderRightWidth: baseSize / 2,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
        },
      };
    case 'right':
      return {
        tooltip: {
          marginLeft: heightSize,
        },
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
        tooltip: {
          marginRight: heightSize,
        },
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
        tooltip: {
          marginTop: heightSize,
        },
        tooltipTail: {
          bottom: -heightSize,
          left: position,
          borderBottomWidth: 0,
          borderTopWidth: heightSize,
          borderTopColor: '#166276',
          borderLeftWidth: baseSize / 2,
          borderRightWidth: baseSize / 2,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
        },
      };
  }
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: position.top,
    left: position.left,
    right: position.right,
    bottom: position.bottom,
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
  },
  tooltipTail: {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 1000,
  },
});

export default Tooltip;