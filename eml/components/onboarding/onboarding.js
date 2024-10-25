import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Tooltip = ({ text, tailPosition = '50%', tailSide = 'bottom', position }) => {
  const tailStyles = getTailStyles(tailSide, tailPosition);

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
  const baseSize = 20; // Base size for the tail
  const heightSize = 10; // Height size for the tail
  const offset = -9; // Offset for the tail

  switch (side) {
    case 'top':
      return {
        tooltip: {
          marginBottom: heightSize,
        },
        tooltipTail: {
          top: offset,
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
          right: offset,
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
          left: -offset,
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
          bottom: -offset,
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    
  },
  tooltip: {
    backgroundColor: '#166276',
    padding: 10,
    borderRadius: 8,
    position: 'relative',
    zIndex: 1001,
    width: 265,
    height: 155,
  },
  tooltipText: {
    color: '#FFFFFF',
    font: 'Montserrat', 
    fontSize: 19,
    left : 23,
    right : 22,
  },
  tooltipTail: {
    position: 'absolute',
    width: 4,
    height: 4,
    zIndex: 1000,
  },
  unicodeCharacter: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: 20, // Adjust the font size as needed
  },
});

export default Tooltip;