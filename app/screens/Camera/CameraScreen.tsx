import { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Image, Dimensions } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import {
  Camera as CameraIcon,
  SwitchCamera,
  Check,
  X,
  Image as ImageIcon,
} from "lucide-react-native";
import {
  getStudentInfo,
  updateStudentInfo,
} from "../../services/storage-service";
import { uploadPhoto } from "../../api/user-api";
import BackButton from "../../components/General/BackButton";
import { getLoginToken } from "../../services/storage-service";
import { getBucketImage } from "../../api/api";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(
        status === "granted" && galleryStatus.status === "granted",
      );
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setCapturedImage(result);
    }
  };

  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  };

  const handleAccept = async () => {
    let profile = await getStudentInfo();
    profile.profilePhoto = capturedImage.uri;
    profile.photo = capturedImage.uri; // Temporarily set photo to local uri
    await updateStudentInfo(profile);
    navigation.navigate("EditProfile");
    try {
      await uploadPhoto(
        profile.baseUser,
        capturedImage.uri,
        await getLoginToken(),
      ).then(async (res) => {
        let photo = await getBucketImage(res.profilePhoto);
        profile.photo = photo;
        await updateStudentInfo(profile);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeny = () => {
    setCapturedImage(null);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View className="bg-gray-900 flex-1 items-center justify-center">
        <Text className="text-white text-lg">
          No access to camera or gallery
        </Text>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View className="bg-black flex-1">
        <View className="absolute left-4 top-12">
          <BackButton onPress={() => navigation.navigate("EditProfile")} />
        </View>
        <View className="flex-1 items-center justify-center">
          <Image
            source={{ uri: capturedImage.uri }}
            style={{
              width: screenWidth,
              height: screenWidth,
              resizeMode: "cover",
            }}
          />
        </View>
        <View className="absolute bottom-4 left-10 right-10 flex-row items-center justify-around p-4">
          <TouchableOpacity
            onPress={handleDeny}
            className="rounded-full bg-error p-3"
          >
            <X size={24} className="text-projectWhite" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAccept}
            className="rounded-full bg-success p-3"
          >
            <Check size={24} className="text-projectWhite" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-projectGray">
      <Camera className="flex-1" type={type} ref={cameraRef}>
        <View className="mx-4 mb-6 mt-12">
          <BackButton onPress={() => navigation.navigate("EditProfile")} />
        </View>
        <View className="bg-transparent flex-1 items-center justify-end pb-10">
          <View className="w-full flex-row items-center justify-around px-4">
            <TouchableOpacity
              onPress={pickImage}
              className="rounded-full bg-projectGray p-3"
            >
              <ImageIcon size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePicture}
              className="rounded-full bg-lightGray p-4"
            >
              <CameraIcon size={32} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleCameraType}
              className="rounded-full bg-projectGray p-3"
            >
              <SwitchCamera size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen;
