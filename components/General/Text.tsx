import { Text as RNText, TextProps } from "react-native";
import { ReactNode } from "react";

interface CustomTextProps extends TextProps {
  children?: ReactNode;
}

/**
 * Custom text component with default styles and props that can be overridden.
 *
 * @param children
 * @param className
 * @param style
 * @param props
 */
const Text = ({
  children,
  className = "",
  style,
  ...props
}: CustomTextProps) => {
  const mergedClasses = `font-sans text-body text-projectBlack ${className}`;

  return (
    <RNText {...props} className={mergedClasses} style={style}>
      {children}
    </RNText>
  );
};

export default Text;

export { Text };
