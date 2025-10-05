import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function NoWifiScreen() {
  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Image
          source={require("./path-to-logo.png")} // Replace with your image path
          style={styles.logo}
        />
        <Text style={styles.logoText}>Sem conexão com internet</Text>
      </View>

      {/* Icon and Message Section */}
      <View style={styles.iconMessageSection}>
        <Image
          source={require("./path-to-wifi-off-icon.png")} // Replace with your image path
          style={styles.wifiIcon}
        />
        <Text style={styles.messageText}>
          Você está sem acesso à internet. Vá para meus cursos e acesse os
          cursos baixados.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ir para meus cursos</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("./path-to-home-icon.png")} // Replace with your image path
            style={styles.icon}
          />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("./path-to-courses-icon.png")} // Replace with your image path
            style={styles.icon}
          />
          <Text style={styles.navText}>Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require("./path-to-settings-icon.png")} // Replace with your image path
            style={styles.icon}
          />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F9FB",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 80,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 26,
    height: 26,
  },
  logoText: {
    marginLeft: 8,
    fontSize: 24,
    fontWeight: "500",
    color: "#383838",
  },
  iconMessageSection: {
    alignItems: "center",
  },
  wifiIcon: {
    width: 183,
    height: 180,
  },
  messageText: {
    marginTop: 16,
    fontSize: 18,
    textAlign: "center",
    color: "#383838",
  },
  button: {
    backgroundColor: "#166276",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F9FB",
    shadowColor: "#B3B3B3",
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  navItem: {
    alignItems: "center",
  },
  icon: {
    width: 16,
    height: 16,
  },
  navTextActive: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 4,
  },
  navText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#A1ACB2",
    marginTop: 4,
  },
});
