import { useContext, useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import * as StorageService from "@/services/storage-service";
import { checkCourseStoredLocally } from "@/services/storage-service";
import trashCanOutline from "@/assets/images/trash-can-outline.png";
import fileDownload from "@/assets/images/file_download.png";
import { IconContext } from "@/services/DownloadProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface DownloadCourseButtonProps {
  course: {
    courseId: string;
  };
  disabled: boolean;
}

const DownloadCourseButton = ({
  course,
  disabled,
}: DownloadCourseButtonProps) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { iconState, updateIcon } = useContext(IconContext) as {
    iconState: Record<string, unknown>;
    updateIcon: (courseId: string, icon: unknown) => void;
  };

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
                  <Text
                    style={{
                      marginBottom: 4,
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#000",
                    }}
                  >
                    {isDownloaded ? "Excluir download" : "Baixar download"}
                  </Text>
                  <MaterialCommunityIcons
                    size={24}
                    name="close"
                    color={"gray"}
                    onPress={() => setModalVisible(false)}
                  ></MaterialCommunityIcons>
                </View>
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 16,
                    color: "#000",
                  }}
                >
                  Você tem certeza que deseja excluir o download do curso? Você
                  ainda pode assisti-lo com acesso à internet e baixá-lo
                  novamente.
                </Text>
                <View className="w-100 flex-row items-center justify-between">
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#007AFF",
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#007AFF",
                      }}
                    >
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
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
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

export default DownloadCourseButton;
