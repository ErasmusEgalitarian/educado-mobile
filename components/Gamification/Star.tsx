import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Star() {
  return (
    <MaterialCommunityIcons
      style={{
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "#ffd633",
      }}
      size={30}
      name="star"
      type="material-community"
      color="#ffd633"
    />
  );
}
