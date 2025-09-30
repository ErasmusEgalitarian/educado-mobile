import RN from "react-native";
import PropTypes from "prop-types";

export default function Text(props) {
  return (
    <RN.Text {...props} className="font-sans text-body text-projectBlack">
      {props.children}
    </RN.Text>
  );
}

Text.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};
