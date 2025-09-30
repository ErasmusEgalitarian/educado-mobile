import NetInfo from "@react-native-community/netinfo";

/**
 * Singleton class for monitoring network status.
 * Utilizes NetInfo from '@react-native-community/netinfo' to listen for network changes.
 */
export class NetworkStatusService {
  static #instance;
  #isOnline = false;
  #observers = [];
  #simulateOffline = false; // Flag to simulate offline status for testing purposes. TODO: Implement in a future .env file.

  constructor() {
    if (NetworkStatusService.#instance) {
      throw new Error(
        "NetworkStatusService is a singleton. Use NetworkStatusService.getInstance() instead.",
      );
    }
    this.#initializeNetworkInfo();
    NetworkStatusService.#instance = this;
  }

  /**
   * Provides the singleton instance of the NetworkStatusService.
   * @returns {NetworkStatusService} The singleton instance.
   */
  static getInstance() {
    if (!this.#instance) {
      this.#instance = new NetworkStatusService();
    }
    return this.#instance;
  }

  /**
   * Adds an observer to the list. Observers are notified of network status changes.
   * @param {Object} observer - The observer object that should have an 'update' method.
   * @returns {boolean} The current network status.
   */
  addObserver(observer) {
    this.#observers.push(observer);
    return this.#isOnline;
  }

  /**
   * Removes an observer from the list.
   * @param {Object} observer - The observer to remove.
   */
  removeObserver(observer) {
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  /**
   * Initializes the NetInfo event listener to monitor network changes.
   */
  #initializeNetworkInfo() {
    NetInfo.addEventListener((state) => {
      this.#updateNetworkStatus(state.isConnected);
    });
  }

  /**
   * Updates the network status and notifies observers if there's a change.
   * @param {boolean} isOnline - The current network status.
   */
  #updateNetworkStatus(isOnline) {
    // Adjust network status based on simulateOffline
    let networkStatus = this.#simulateOffline ? false : isOnline;

    if (this.#isOnline !== networkStatus) {
      this.#isOnline = networkStatus;
      this.#notifyObservers();
    }
  }

  /**
   * Notifies all observers about the current network status.
   */
  #notifyObservers() {
    this.#observers.forEach((observer) => observer.update(this.#isOnline));
  }

  get isOnline() {
    return this.#isOnline;
  }
}
