import { View } from "react-native";
import { Button } from "react-native-paper";
import tailwindConfig from "../../tailwind.config.js";
import PropTypes from "prop-types";

/**
 * Renders a button component for cancelling a subscription.
 * @param {Function} onPress - The function to be called when the button is pressed.
 * @returns {JSX.Element} - The rendered component.
 */
const SubscriptionCancelButton = ({ onPress }) => {
  SubscriptionCancelButton.propTypes = {
    onPress: PropTypes.func.isRequired,
  };

  return (
    <View className="w-1/2 justify-end self-center py-4">
      <Button
        mode={"contained"}
        color={tailwindConfig.theme.colors.error}
        testID="subscriptionCancelButton"
        onPress={onPress}
      >
        Cancelar inscrição
      </Button>
    </View>
  );
};

export default SubscriptionCancelButton;
