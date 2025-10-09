import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { ReactNode } from "react";
import {
  TextStyle,
  Tone,
  toneToUtility,
  textStyleToUtility,
  Align,
  alignToUtility,
} from "@/theme/typography";

interface TextProps extends RNTextProps {
  children?: ReactNode;
  textStyle?: TextStyle;
  tone?: Tone;
  align?: Align;
  className?: string;
}

/**
 * The main text component used throughout the app.
 *
 * @param children - The text content.
 * @param textStyle - One of the text styles defined in the Figma.
 * @param tone - One of the tones defined in the Figma.
 * @param align - Text alignment.
 * @param className - Additional classes to apply to the text.
 * @param style - Additional styles to apply to the text.
 * @param props - Additional props to pass to the text element.
 */
export const Text = ({
  children,
  textStyle = "body-regular",
  tone = "default",
  align = "left",
  className = "",
  style,
  ...props
}: TextProps) => {
  const mergedClasses = [
    textStyleToUtility(textStyle),
    toneToUtility[tone],
    alignToUtility[align],
    className,
  ].join(" ");

  return (
    <RNText {...props} className={mergedClasses} style={style}>
      {children}
    </RNText>
  );
};

// For legacy purposes
export default Text;
