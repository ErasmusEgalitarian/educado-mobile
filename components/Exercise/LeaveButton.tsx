import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon, Button } from "@rneui/base";
import tailwindConfig from "../../tailwind.config.js";
const projectColors = tailwindConfig.theme.colors;
import PropTypes from "prop-types";

const LeaveButton = ({ navigationPlace, courseId }) => {
  LeaveButton.propTypes = {
    navigationPlace: PropTypes.string.isRequired,
    courseId: PropTypes.string,
  };

  const navigation = useNavigation();
  return (
    <Button
      buttonStyle={styles.buttons}
      color="invisible"
      radius="20"
      size="sm"
      onPress={() =>
        navigation.navigate(navigationPlace, { courseId: courseId })
      }
      icon={
        <Icon
          size={25}
          name="chevron-left"
          type="material-community"
          color={projectColors.projectBlack}
        />
      }
    ></Button>
  );
};
const styles = StyleSheet.create({
  buttons: { width: 50, height: 50 },
});

export default LeaveButton;
