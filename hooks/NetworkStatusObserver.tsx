import { useEffect } from "react";
import { NetworkStatusService } from "../services/network-status-service";
import PropTypes from "prop-types";

/**
 * A React functional component that observes network status changes.
 *
 * This component subscribes to the NetworkStatusService to receive updates about the network connectivity.
 * It uses the `setIsOnline` function passed in as a prop to update the parent component's state
 * based on the network status. It does not render any visual elements and returns null.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setIsOnline - A function to set the online status in the parent component.
 *
 * @returns {null} - This component does not render anything.
 */
export default function NetworkStatusObserver({ setIsOnline }) {
  const networkStatusService = NetworkStatusService.getInstance();

  useEffect(() => {
    const observer = {
      update: (status) => {
        setIsOnline(status);
      },
    };

    setIsOnline(networkStatusService.addObserver(observer));

    return () => networkStatusService.removeObserver(observer);
  }, [setIsOnline, networkStatusService]);

  return null; // This component does not render anything
}

NetworkStatusObserver.propTypes = {
  setIsOnline: PropTypes.func.isRequired,
};
