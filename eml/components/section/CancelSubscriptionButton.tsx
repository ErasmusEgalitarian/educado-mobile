import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import tailwindConfig from "../../tailwind.config";
import PropTypes from "prop-types";

/**
 * Renders a button component for cancelling a subscription.
 * @param {Function} onPress - The function to be called when the button is pressed.
 * @returns {JSX.Element} - The rendered component.
 */
const SubscriptionCancel = ({ onPress }) => {
  SubscriptionCancel.propTypes = {
    onPress: PropTypes.func.isRequired,
  };

  return (
    <View className="py-4 self-center justify-end w-1/2">
      <Button
        mode={'text'}
        color={tailwindConfig.theme.colors.error}
        testID="subscriptionCancelButton"
        onPress={onPress}
        uppercase={false}
      >
          <Text className='underline font-bold'>Retirar curso</Text>
      </Button>
    </View>
  );
};

export default SubscriptionCancel;
