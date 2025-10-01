import { View, Text, Image } from "react-native";
import logo from "../../assets/images/logo.png";
import PropTypes from "prop-types";
import { formatDate } from "../../services/utils";

const CertificateTemplate = ({
  studentName,
  estimatedCourseDuration,
  courseName,
  dateOfCompletion,
  creatorName,
}) => {
  return (
    <View className={"flex items-center rounded-sm bg-projectWhite p-2"}>
      <View className={"border-2"} /* style={styles.outerBleed} */>
        <View
          className={
            "m-2 flex border-2 border-progressBar"
          } /* style={styles.innerBleed} */
        >
          <View
            className={
              "flex flex-col items-center justify-around px-8"
            } /* style={styles.content} */
          >
            <Text
              className={
                "mb-2 mt-5 text-base font-semibold text-primary_custom"
              } /* style={styles.title} */
            >
              CERTIFICADO DE CONCLUSÃO
            </Text>
            <Text
              className={
                "text-center text-[10px]"
              } /* style={styles.mainText} */
            >
              Certificamos que {studentName} concluiu com sucesso{" "}
              {estimatedCourseDuration} horas do curso de {courseName} no dia{" "}
              {formatDate(dateOfCompletion)}, na modalidade de educação à
              distância na plataforma Educado.
            </Text>
            <View
              className="mt-4 flex w-full items-center" /* style={styles.signatureContainer} */
            >
              <Text
                className="text-[8px] italic" /* style={styles.signature} */
              >
                {creatorName}
              </Text>
              <View className="border-black mt-1 w-[40%] border-b" />
              <Text className="text-[8px]">{creatorName}, Instrutor</Text>
            </View>

            <Image
              className={"scale-[0.25]"}
              /* style={styles.logo} */
              source={logo}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
CertificateTemplate.propTypes = {
  studentName: PropTypes.string.isRequired,
  estimatedCourseDuration: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  dateOfCompletion: PropTypes.string.isRequired,
  creatorName: PropTypes.string.isRequired,
};

export default CertificateTemplate;
