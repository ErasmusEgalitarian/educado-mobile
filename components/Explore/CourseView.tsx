import { View, StyleSheet, Pressable } from "react-native";
import { Icon } from "@rneui/base";
import Text from "../General/Text";
import PropTypes from "prop-types";

export default function CourseView({ title }) {
  return (
    <View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
      <Pressable style={styles.courses}>
        <Icon // icon
          size={90}
          name="plus-thick"
          type="material-community"
          color="darkgray"
        />
      </Pressable>
      <Text style={styles.coursesTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  courses: {
    backgroundColor: "#C7CDC6",
    alignItems: "center",
    width: "75%",
    borderRadius: 15,
  },
  coursesTitle: {
    alignSelf: "center",
    fontSize: 20,
  },
});

CourseView.propTypes = {
  title: PropTypes.string,
};
