import { useContext, useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import * as StorageService from "../../../services/storage-service";
import PropTypes from "prop-types";
import { checkCourseStoredLocally } from "../../../services/storage-service";
import trashCanOutline from "../../../assets/images/trash-can-outline.png";
import fileDownload from "../../../assets/images/file_download.png";
import { IconContext } from "../../../services/DownloadProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DownloadCourseButton = ({ course, disabled }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { iconState, updateIcon } = useContext(IconContext);

  useEffect(() => {
    let isMounted = true;

    const checkIfDownloaded = async () => {
      try {
        const result = await checkCourseStoredLocally(course.courseId);
        if (isMounted) {
          setIsDownloaded(result);
          if (
            iconState[course.courseId] !==
            (result ? trashCanOutline : fileDownload)
          ) {
            updateIcon(
              course.courseId,
              result ? trashCanOutline : fileDownload,
            );
          }
        }
      } catch (error) {
        console.error("Error checking if course is downloaded:", error);
      }
    };

    checkIfDownloaded();
    return () => {
      isMounted = false;
    };
  }, [course.courseId, iconState, updateIcon]);

  const handleDownload = async () => {
    try {
      const result = await StorageService.storeCourseLocally(course.courseId);
      if (result) {
        setIsDownloaded(true);
        updateIcon(course.courseId, trashCanOutline);
      } else {
        alert(
          "Não foi possível baixar o curso. Certifique-se de estar conectado à Internet.",
        );
      }
    } catch (error) {
      console.error("Error downloading course:", error);
    }
    setModalVisible(false);
  };

  const handleRemove = async () => {
    try {
      const result = await StorageService.deleteLocallyStoredCourse(
        course.courseId,
      );
      if (result) {
        setIsDownloaded(false);
        updateIcon(course.courseId, fileDownload);
      } else {
        alert(
          "Algo deu errado. Não foi possível remover os dados armazenados do curso.",
        );
      }
    } catch (error) {
      console.error("Error removing downloaded course:", error);
    }
    setModalVisible(false);
  };

  const handlePress = () => {
    if (disabled) return;
    setModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress} disabled={disabled}>
        <View className="h-8 w-8 items-center justify-center">
          {isDownloaded ? (
            <Image source={trashCanOutline} className="h-7 w-6" />
          ) : (
            <Image source={fileDownload} className="h-8 w-8" />
          )}
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Outer View with semi-transparent black background */}
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback>
              {/* Modal content container */}
              <View className="w-[90%] rounded-xl bg-projectLightGray p-5">
                <View className="flex-row items-center justify-between">
                  <Text className="mb-1 text-xl font-bold text-projectBlack">
                    {isDownloaded ? "Excluir download" : "Baixar download"}
                  </Text>
                  <MaterialCommunityIcons
                    size={24}
                    name="close"
                    color={"gray"}
                    onPress={() => setModalVisible(false)}
                  ></MaterialCommunityIcons>
                </View>
                <Text className="mb-2.5 text-base text-projectBlack">
                  Você tem certeza que deseja excluir o download do curso? Você
                  ainda pode assisti-lo com acesso à internet e baixá-lo
                  novamente.
                </Text>
                <View className="w-100 flex-row items-center justify-between">
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text className="border-b border-primary_custom text-xl font-bold text-primary_custom">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={isDownloaded ? handleRemove : handleDownload}
                    className={
                      isDownloaded
                        ? "rounded-lg bg-error px-10 py-4"
                        : "rounded-lg bg-primary_custom px-10 py-4"
                    }
                  >
                    <Text className="text-xl font-bold text-projectWhite">
                      {isDownloaded ? "Excluir" : "Baixar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

DownloadCourseButton.propTypes = {
  course: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

export default DownloadCourseButton;
