import { Text as RNText, TextProps as RNTextProps } from "react-native";

/**
 * @deprecated Use React Native's `Text` component directly instead.
 *
 * The main text component used throughout the app.
 *
 * @param children - The text content.
 * @param className - Additional classes to apply to the text.
 * @param style - Additional styles to apply to the text.
 * @param props - Additional props to pass to the text element.
 */
export const Text = ({
  children,
  className = "",
  style,
  ...props
}: RNTextProps) => {
  return (
    <RNText {...props} className={className} style={style}>
      {children}
    </RNText>
  );
};

// For legacy purposes
export default Text;
