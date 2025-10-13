{
  description = "Android emulation environment for Educado Mobile";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-node18.url = "github:NixOS/nixpkgs/c5dd43934613ae0f8ff37c59f61c507c2e8f980d";
  };

  outputs = { self, nixpkgs, nixpkgs-node18 }:
    let
      supportedSystems = [ "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      pkgsFor = system: nixpkgs.legacyPackages.${system}.extend (self: super: {
        nodejs_18 = nixpkgs-node18.legacyPackages.${system}.nodejs_18;
      });
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = pkgsFor system;
        in {
          android-emulator = pkgs.androidenv.emulateApp {
            name = "emulate-MyAndroidApp";
            platformVersion = "34";
            abiVersion = "arm64-v8a";
            systemImageType = "google_apis_playstore";
          };
        });

      devShells = forAllSystems (system:
        let
          pkgs = pkgsFor system;
          
          # Configure Android SDK with the packages you need
          androidComposition = pkgs.androidenv.composeAndroidPackages {
            platformVersions = [ "34" ];
            buildToolsVersions = [ "34.0.0" "33.0.1" ];
            includeNDK = true;
            ndkVersions = [ "25.1.8937393" ];
            cmakeVersions = [ "3.22.1" ];
            includeEmulator = false;
            includeSystemImages = false;
            includeSources = false;
          };
          
        in {
          default = pkgs.mkShell {
            buildInputs = [
              self.packages.${system}.android-emulator
              pkgs.nodejs_18
              pkgs.jdk17
              androidComposition.androidsdk
            ];
            
            shellHook = ''
              echo "🚀 Educado Mobile Development Environment"
              echo "📱 Android emulator: ${self.packages.${system}.android-emulator}"
              echo "📦 Node.js: $(node --version)"
              echo ""
              
              # Set Android environment variables to the Nix-provided SDK
              export ANDROID_HOME="${androidComposition.androidsdk}/libexec/android-sdk"
              export ANDROID_SDK_ROOT=$ANDROID_HOME
              export PATH=$PATH:$ANDROID_HOME/platform-tools
              export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
              export PATH=$PATH:$ANDROID_HOME/build-tools/33.0.1
              
              echo "🔧 Android SDK: $ANDROID_HOME"
              echo "🔧 Platform 34: $ANDROID_HOME/platforms/android-34"
              echo "🔧 Build Tools: 34.0.0, 33.0.1"
              echo "🔧 NDK: $ANDROID_HOME/ndk/25.1.8937393"
              echo "🔧 CMake: $ANDROID_HOME/cmake/3.22.1"
              echo "🔧 ADB: $ANDROID_HOME/platform-tools/adb"
              echo ""
              echo "To start your app:"
              echo "  npm start"
              echo ""
              echo "To run on Android:"
              echo "  npm run android"
              echo ""
              echo "Make sure your Android emulator is running first!"
            '';
          };
        });
    };
}