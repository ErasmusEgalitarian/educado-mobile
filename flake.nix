{
  description = "Educado Mobile - React Native Android Development";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    nixpkgs-node18.url = "github:NixOS/nixpkgs/c5dd43934613ae0f8ff37c59f61c507c2e8f980d";
    devshell.url = "github:numtide/devshell";
    flake-utils.url = "github:numtide/flake-utils";
    android-nixpkgs.url = "github:tadfisher/android-nixpkgs";
  };

  outputs = { self, nixpkgs, nixpkgs-node18, devshell, flake-utils, android-nixpkgs }:
    {
      overlay = final: prev: {
        inherit (self.packages.${final.system}) android-sdk;
      };
    }
    //
    flake-utils.lib.eachSystem [ "aarch64-darwin" "x86_64-darwin" "x86_64-linux" ] (system:
      let
        inherit (nixpkgs) lib;
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
          overlays = [
            devshell.overlays.default
            self.overlay
          ];
        };
        pkgs-node18 = import nixpkgs-node18 {
          inherit system;
          config.allowUnfree = true;
        };
      in
      {
        packages = {
          android-sdk = android-nixpkgs.sdk.${system} (sdkPkgs: with sdkPkgs; [
            # Essential packages for building and testing
            build-tools-34-0-0
            build-tools-33-0-1
            cmdline-tools-latest
            emulator
            platform-tools
            platforms-android-34
            sources-android-34
            ndk-25-1-8937393
            cmake-3-22-1
          ]
          ++ lib.optionals (system == "aarch64-darwin") [
            # ARM64 system images for Apple Silicon Macs
            system-images-android-34-google-apis-playstore-arm64-v8a
          ]
          ++ lib.optionals (system == "x86_64-darwin" || system == "x86_64-linux") [
            # x86_64 system images for Intel Macs and Linux
            system-images-android-34-google-apis-playstore-x86-64
          ]);
        };

        devShells.default = pkgs.devshell.mkShell {
          name = "educado-mobile";
          
          packages = with pkgs; [
            # Node.js and npm from specific nixpkgs commit that has Node.js 18
            pkgs-node18.nodejs_18            
            # Java for Android development
            jdk17
            
            # Android SDK
            self.packages.${system}.android-sdk
            
            # Development tools
            git
            curl
            jq
            watchman
          ];

          env = [
            {
              name = "ANDROID_HOME";
              value = "${self.packages.${system}.android-sdk}/share/android-sdk";
            }
            {
              name = "ANDROID_SDK_ROOT";
              value = "${self.packages.${system}.android-sdk}/share/android-sdk";
            }
            {
              name = "JAVA_HOME";
              value = "${pkgs.jdk17}";
            }
            {
              name = "REACT_NATIVE_PACKAGER_HOSTNAME";
              value = "127.0.0.1";
            }
          ];

          commands = [
            {
              name = "create-avd";
              help = "Create Android Virtual Device";
              command = ''
                AVD_NAME="educado-avd"
                AVD_DIR="''${ANDROID_AVD_HOME:-$HOME/.android/avd}"
                
                # Detect system architecture
                ARCH=$(uname -m)
                case "$ARCH" in
                  "arm64"|"aarch64")
                    ABI="arm64-v8a"
                    ;;
                  "x86_64")
                    ABI="x86_64"
                    ;;
                  *)
                    echo "❌ Unsupported architecture: $ARCH"
                    exit 1
                    ;;
                esac
                
                # Create AVD directory if it doesn't exist
                mkdir -p "$AVD_DIR"
                
                # Check if AVD already exists
                if [ -d "$AVD_DIR/$AVD_NAME.avd" ]; then
                  echo "⚠️  AVD $AVD_NAME already exists"
                  echo "   Delete it first with: delete-avd"
                  exit 1
                fi
                
                # Create the AVD using avdmanager
                echo "🔧 Creating AVD: $AVD_NAME"
                echo "📁 AVD Directory: $AVD_DIR"
                echo "🔧 Android SDK: $ANDROID_HOME"
                echo "📱 Creating AVD with configuration:"
                echo "   Platform: Android 34"
                echo "   ABI: $ABI"
                echo "   System Image: google_apis_playstore"
                echo "   Hardware: pixel_6"
                echo "   RAM: 4096MB"
                
                avdmanager create avd \
                  --name "$AVD_NAME" \
                  --package "system-images;android-34;google_apis_playstore;$ABI" \
                  --device "pixel_6" \
                  --force
                
                # Configure AVD properties
                AVD_CONFIG_FILE="$AVD_DIR/$AVD_NAME.avd/config.ini"
                if [ -f "$AVD_CONFIG_FILE" ]; then
                  echo "" >> "$AVD_CONFIG_FILE"
                  echo "# Custom configuration" >> "$AVD_CONFIG_FILE"
                  echo "hw.ramSize=4096" >> "$AVD_CONFIG_FILE"
                  echo "vm.heapSize=256" >> "$AVD_CONFIG_FILE"
                  echo "disk.dataPartition.size=8000M" >> "$AVD_CONFIG_FILE"
                  echo "sdcard.size=1000M" >> "$AVD_CONFIG_FILE"
                  echo "hw.gpu.enabled=yes" >> "$AVD_CONFIG_FILE"
                  echo "hw.gpu.mode=auto" >> "$AVD_CONFIG_FILE"
                  echo "hw.keyboard=yes" >> "$AVD_CONFIG_FILE"
                  echo "hw.trackBall=no" >> "$AVD_CONFIG_FILE"
                  echo "hw.camera.back=webcam0" >> "$AVD_CONFIG_FILE"
                  echo "hw.camera.front=webcam0" >> "$AVD_CONFIG_FILE"
                fi
                
                echo "✅ AVD $AVD_NAME created successfully!"
                echo "🚀 Start it with: start-emulator"
              '';
            }
            {
              name = "list-avds";
              help = "List available Android Virtual Devices";
              command = ''
                echo "📱 Available AVDs:"
                avdmanager list avd 2>/dev/null || echo "  No AVDs found"
                echo ""
                echo "🔧 AVD Directory: ''${ANDROID_AVD_HOME:-$HOME/.android/avd}"
              '';
            }
            {
              name = "delete-avd";
              help = "Delete an Android Virtual Device";
              command = ''
                if [ $# -eq 0 ]; then
                  echo "Usage: delete-avd <avd-name>"
                  echo "Available AVDs:"
                  avdmanager list avd 2>/dev/null || echo "  No AVDs found"
                  exit 1
                fi
                
                AVD_NAME="$1"
                AVD_DIR="''${ANDROID_AVD_HOME:-$HOME/.android/avd}"
                
                echo "🗑️  Deleting AVD: $AVD_NAME"
                
                # Try to delete using avdmanager first
                if avdmanager delete avd --name "$AVD_NAME" 2>/dev/null; then
                  echo "✅ AVD $AVD_NAME deleted successfully!"
                else
                  echo "⚠️  avdmanager failed, cleaning up manually..."
                  
                  # Manual cleanup
                  AVD_PATH="$AVD_DIR/$AVD_NAME.avd"
                  AVD_INI="$AVD_DIR/$AVD_NAME.ini"
                  
                  if [ -d "$AVD_PATH" ]; then
                    echo "🧹 Removing AVD directory: $AVD_PATH"
                    rm -rf "$AVD_PATH"
                  fi
                  
                  if [ -f "$AVD_INI" ]; then
                    echo "🧹 Removing AVD config: $AVD_INI"
                    rm -f "$AVD_INI"
                  fi
                  
                  echo "✅ AVD $AVD_NAME completely removed!"
                fi
              '';
            }
            {
              name = "start-emulator";
              help = "Start Android emulator with AVD";
              command = ''
                AVD_NAME="educado-avd"
                
                # Check if emulator is already running
                if adb devices 2>/dev/null | grep -q emulator; then
                  echo "⚠️  Emulator already running"
                  exit 0
                fi
                
                # Check if AVD exists
                if ! avdmanager list avd 2>/dev/null | grep -q "$AVD_NAME"; then
                  echo "❌ AVD $AVD_NAME not found!"
                  echo "   Create it first with: create-avd"
                  exit 1
                fi
                
                LOG_FILE="''${XDG_CACHE_HOME:-$HOME/.cache}/educado-emulator.log"
                mkdir -p "$(dirname "$LOG_FILE")"
                
                echo "🚀 Starting AVD: $AVD_NAME"
                # Detect system architecture for display
                ARCH=$(uname -m)
                case "$ARCH" in
                  "arm64"|"aarch64")
                    ABI="arm64-v8a"
                    ;;
                  "x86_64")
                    ABI="x86_64"
                    ;;
                  *)
                    ABI="unknown"
                    ;;
                esac
                echo "📱 ABI: $ABI"
                echo "📄 Logs: $LOG_FILE"
                
                # Start emulator with AVD
                # Run emulator natively (android-nixpkgs provides ARM64 emulator)
                # Explicitly set environment variables for the emulator process
                ANDROID_HOME="$ANDROID_HOME" ANDROID_SDK_ROOT="$ANDROID_SDK_ROOT" emulator -avd "$AVD_NAME" \
                  -gpu auto \
                  -camera-back webcam0 \
                  -camera-front webcam0 \
                  > "$LOG_FILE" 2>&1 &
                
                EMULATOR_PID=$!
                
                echo "🔧 Emulator PID: $EMULATOR_PID"
                echo "📋 Check status: adb devices"
                echo "📄 View logs: tail -f $LOG_FILE"
                
                # Wait for emulator to boot
                echo "⏳ Waiting for emulator to boot..."
                # Use a simple loop instead of timeout command
                COUNTER=0
                while [ $COUNTER -lt 30 ]; do
                  if adb devices 2>/dev/null | grep -q emulator; then
                    echo "✅ Emulator is ready!"
                    break
                  fi
                  sleep 2
                  COUNTER=$((COUNTER + 1))
                done
                if [ $COUNTER -eq 30 ]; then
                  echo "⚠️  Emulator may still be starting..."
                fi
              '';
            }
            {
              name = "stop-emulator";
              help = "Stop Android emulator";
              command = ''
                if adb emu kill 2>/dev/null; then
                  echo "🛑 Emulator stopped via ADB"
                else
                  echo "🛑 Force killing emulator process..."
                  pkill -9 -f "emulator.*avd" || echo "ℹ️  No emulator running"
                fi
              '';
            }
            {
              name = "emulator-status";
              help = "Check connected Android devices";
              command = ''
                echo "📱 Connected Android devices:"
                adb devices
              '';
            }
          ];

          bash.extra = ''
            # Colors
            RED="\033[0;31m"
            GREEN="\033[0;32m"
            YELLOW="\033[1;33m"
            BLUE="\033[0;34m"
            PURPLE="\033[0;35m"
            CYAN="\033[0;36m"
            WHITE="\033[1;37m"
            BOLD="\033[1m"
            NC="\033[0m" # No Color
            
            # Clear screen and show header
            clear
            echo -e "''${BOLD}''${CYAN}╔══════════════════════════════════════════════════════════════════════════════╗''${NC}"
            echo -e "''${BOLD}''${CYAN}║''${NC}                                                                              ''${BOLD}''${CYAN}║''${NC}"
            echo -e "''${BOLD}''${CYAN}║''${NC}    ''${BOLD}''${WHITE}🚀 Educado Mobile Development Environment''${NC}                                 ''${BOLD}''${CYAN}║''${NC}"
            echo -e "''${BOLD}''${CYAN}║''${NC}        ''${YELLOW}React Native • Expo • Android • Nix''${NC}                                   ''${BOLD}''${CYAN}║''${NC}"
            echo -e "''${BOLD}''${CYAN}║''${NC}                                                                              ''${BOLD}''${CYAN}║''${NC}"
            echo -e "''${BOLD}''${CYAN}╚══════════════════════════════════════════════════════════════════════════════╝''${NC}"
            echo ""
            
            # Environment info
            echo -e "''${BOLD}''${GREEN}📋 Environment Status:''${NC}"
            echo -e "  ''${BLUE}📦 Node.js:''${NC} $(node --version)"
            echo -e "  ''${BLUE}☕ Java:''${NC} $(java -version 2>&1 | head -n 1)"
            echo -e "  ''${BLUE}🔧 Android SDK:''${NC} $ANDROID_HOME"
            echo -e "  ''${BLUE}🔧 ADB:''${NC} $(which adb)"
            echo ""
            
            # AVD Commands
            echo -e "''${BOLD}''${PURPLE}📱 Android Virtual Device Commands:''${NC}"
            echo -e "  ''${GREEN}create-avd''${NC}        ''${YELLOW}→''${NC} Create Android Virtual Device"
            echo -e "  ''${GREEN}list-avds''${NC}         ''${YELLOW}→''${NC} List available AVDs"
            echo -e "  ''${GREEN}delete-avd''${NC}        ''${YELLOW}→''${NC} Delete an AVD"
            echo -e "  ''${GREEN}start-emulator''${NC}    ''${YELLOW}→''${NC} Start Android emulator with AVD"
            echo -e "  ''${GREEN}stop-emulator''${NC}     ''${YELLOW}→''${NC} Stop Android emulator"
            echo -e "  ''${GREEN}emulator-status''${NC}   ''${YELLOW}→''${NC} Check connected devices"
            echo ""
            
            # Development Commands
            echo -e "''${BOLD}''${CYAN}🚀 Development Commands:''${NC}"
            echo -e "  ''${GREEN}npm start''${NC}              ''${YELLOW}→''${NC} Start Metro bundler"
            echo -e "  ''${GREEN}npm run android''${NC}        ''${YELLOW}→''${NC} Build and run on Android"
            echo -e "  ''${GREEN}npx expo run:android''${NC}   ''${YELLOW}→''${NC} Run with Expo"
            echo ""
            
            # Quick start guide
            echo -e "''${BOLD}''${YELLOW}⚡ Quick Start:''${NC}"
            echo -e "  1. ''${GREEN}create-avd''${NC}     # Create your Android Virtual Device"
            echo -e "  2. ''${GREEN}start-emulator''${NC} # Start the emulator"
            echo -e "  3. ''${GREEN}npx expo run:android''${NC} # Build and run your app"
            echo ""
            
            # Footer
            echo -e "''${BOLD}''${WHITE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━''${NC}"
            echo -e "''${CYAN}💡 Tip:''${NC} Use ''${GREEN}emulator-status''${NC} to check if your device is connected"
            echo -e "''${CYAN}🔧 Debug:''${NC} Check emulator logs with ''${GREEN}tail -f ~/.cache/educado-emulator.log''${NC}"
          '';
        };
      }
    );
}
