import * as React from "react";
import { Image } from "react-native";
import PropTypes from "prop-types";
import logo from "../../assets/images/logo_educado.png";

export default function EducadoLogo(props) {
  EducadoLogo.propTypes = {
    style: PropTypes.object,
  };

  return (
    <Image
      source={logo}
      style={props.style}
      className={"h-12"}
      resizeMode="contain"
    />
  );
}

// THE CODE BELOW DOES NOT WORK. THE SVG NEVER SHOWS AFTER MERGING TO DEV.
// I SUSPECT IT IS BECAUSE OF THE REACT-NATIVE-SVG PACKAGE CLASHING WITH OTHER PACKAGES
// I WILL LEAVE IT HERE FOR FUTURE REFERENCE, AS IT MAY ASSIST IN A FURTHER IMPLEMENTATION OF SVG'S

// import { styled } from "nativewind"
// import Svg, { Ellipse, Path } from "react-native-svg"

/*
const StyledEllipse = styled(Ellipse, { classProps: ["fill", "stroke"] });
const StyledPath = styled(Path, { classProps: ["fill", "stroke"] });
*/

/*export default function EducadoLogo({fill, width, height, ...props }) {

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : 176} 
      height={height ? height : 26} 
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 176 26"
      {...props}
    >
      <StyledEllipse cx={13.595} cy={0.931} rx={0.938} ry={0.931} fill={fill} />
      <StyledEllipse cx={23.781} cy={17.428} rx={0.938} ry={0.931} fill={fill} />
      <StyledEllipse cx={3.142} cy={18.227} rx={0.938} ry={0.931} fill={fill} />
      <StyledEllipse cx={16.276} cy={0.931} rx={0.938} ry={0.931} fill={fill} />
      <StyledEllipse cx={22.709} cy={20.089} rx={0.938} ry={0.931} fill={fill} />
      <StyledEllipse cx={1.802} cy={15.832} rx={0.938} ry={0.931} fill={fill} />
      <StyledEllipse cx={14.801} cy={3.459} rx={0.804} ry={0.798} fill={fill} />
      <StyledEllipse cx={20.966} cy={17.561} rx={0.804} ry={0.798} fill={fill} />
      <StyledEllipse cx={4.348} cy={15.699} rx={0.804} ry={0.798} fill={fill} />
      <StyledEllipse cx={18.956} cy={1.73} rx={0.67} ry={0.665} fill={fill} />
      <StyledEllipse cx={0.997} cy={13.171} rx={0.67} ry={0.665} fill={fill} />
      <StyledEllipse cx={17.348} cy={3.858} rx={0.67} ry={0.665} fill={fill} />
      <StyledEllipse cx={3.678} cy={13.437} rx={0.67} ry={0.665} fill={fill} />
      <StyledEllipse cx={21.1} cy={2.794} rx={0.67} ry={0.665} fill={fill} />
      <StyledEllipse cx={0.729} cy={10.51} rx={0.67} ry={0.665} fill={fill} />
      <StyledEllipse cx={21.1} cy={21.952} rx={0.67} ry={0.665} fill={fill} />
      <StyledEllipse cx={19.626} cy={5.056} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={3.276} cy={10.909} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={19.626} cy={19.69} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={16.41} cy={6.12} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={5.956} cy={13.038} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={18.018} cy={17.828} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={19.09} cy={7.184} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={5.688} cy={10.377} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={15.338} cy={22.351} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={16.142} cy={19.956} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={21.502} cy={6.652} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={4.08} cy={8.515} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={13.729} cy={25.012} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={17.75} cy={21.287} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={23.111} cy={4.789} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={1.399} cy={7.982} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={18.822} cy={23.415} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={21.904} cy={16.098} rx={0.134} ry={0.133} fill={fill} />
      <StyledEllipse cx={11.987} cy={3.326} rx={0.134} ry={0.133} fill={fill} />
      <StyledEllipse cx={6.626} cy={18.227} rx={0.134} ry={0.133} fill={fill} />
      <StyledEllipse cx={25.255} cy={14.634} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={10.781} cy={5.854} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={11.585} cy={0.798} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={8.1} cy={20.222} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={22.843} cy={13.836} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={9.441} cy={3.459} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={4.884} cy={19.956} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={20.162} cy={13.57} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={9.441} cy={18.094} rx={0.268} ry={0.266} fill={fill} />
      <StyledEllipse cx={20.564} cy={11.309} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={8.502} cy={6.785} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={7.162} cy={4.656} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={8.502} cy={23.548} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={11.451} cy={19.291} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={23.245} cy={11.309} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={6.626} cy={1.996} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={10.111} cy={21.42} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={25.657} cy={12.107} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={8.771} cy={1.197} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={6.626} cy={22.218} rx={0.402} ry={0.399} fill={fill} />
      <StyledEllipse cx={25.523} cy={9.313} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={12.657} cy={22.085} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={22.843} cy={8.781} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={5.152} cy={6.386} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={11.049} cy={24.48} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={24.719} cy={6.918} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={4.348} cy={3.725} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={2.472} cy={5.588} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={16.41} cy={24.746} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={20.162} cy={9.047} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={6.76} cy={8.515} rx={0.536} ry={0.532} fill={fill} />
      <StyledEllipse cx={13.729} cy={19.69} rx={0.536} ry={0.532} fill={fill} />

      <StyledPath
        fill={fill}
        fillRule="evenodd"
        d="M100.918 3.6c-2.538.758-5.092 2.855-6.311 5.18-.899 1.716-.994 5.65-.187 7.778 2.086 5.505 9.178 7.918 14.537 4.945 2.683-1.489 2.97-2.012 1.896-3.455-.662-.888-.936-.946-1.758-.37-3.925 2.747-7.388 2.689-10.266-.175-1.51-1.503-1.75-2.111-1.75-4.44 0-2.113.3-3.052 1.386-4.338 2.324-2.754 6.383-3.206 9.783-1.089.934.581 1.281.581 1.984 0 1.357-1.123 1.001-2.088-1.169-3.17-2.829-1.413-5.4-1.686-8.145-.866Zm62.851-.633c-5.469 1.23-9.083 6.137-8.047 10.924 1.413 6.53 6.873 9.956 12.984 8.147 7.148-2.117 9.615-10.73 4.589-16.025-2.529-2.665-6.119-3.813-9.526-3.046Zm-129.71 9.985v9.682h14.543v-3.221H37.291v-4.784l3.636-.159c3.52-.154 3.64-.206 3.806-1.635l.17-1.477h-7.612V6.526h10.305l-.17-1.477-.17-1.477-6.599-.15-6.598-.151v9.681ZM51.197 3.57c-.546.562.694 2.957 1.531 2.957.57 0 .722 1.681.722 8.054v8.054h4.274c4.678 0 6.645-.532 8.57-2.318 2.014-1.87 2.944-4.17 2.99-7.396.034-2.416-.245-3.435-1.43-5.22-2.165-3.26-4.012-4.004-10.634-4.277-3.11-.129-5.82-.063-6.023.146Zm21.853.5c-.177.463-.228 3.681-.112 7.153.24 7.158.975 9.214 3.817 10.683 2.332 1.205 7.168 1.208 9.44.005 3.354-1.775 3.913-3.468 3.753-11.357l-.14-6.98h-2.694l-.27 6.98c-.147 3.839-.454 7.264-.68 7.612-.67 1.028-4.1 1.916-6.013 1.559-3.278-.614-3.778-1.76-4.079-9.36-.26-6.545-.313-6.798-1.483-6.963-.728-.103-1.345.165-1.539.669Zm47.504.678c.23 1.16-.583 3.29-3.508 9.187-2.094 4.223-3.808 7.908-3.808 8.189 0 1.07 3.096.517 3.905-.697.718-1.079 1.33-1.228 5.708-1.396 4.836-.184 4.913-.167 5.542 1.208.469 1.026 1.043 1.396 2.167 1.396.841 0 1.53-.217 1.53-.482 0-.266-1.912-4.554-4.248-9.531-4.063-8.655-4.32-9.056-5.918-9.216-1.571-.158-1.653-.077-1.37 1.342Zm49.809 2.873c1.999 1.497 2.549 3.09 2.135 6.177-.541 4.016-4.785 6.582-8.738 5.281-2.486-.818-5.108-3.884-5.108-5.975 0-6.161 6.648-9.274 11.711-5.483Zm-106.005.94c2.051 2.045 2.465 5.053 1.05 7.63-1.295 2.36-2.914 3.204-6.168 3.214l-2.559.008V6.375l3.058.315c2.41.248 3.388.644 4.619 1.87Zm60.218 4.463c.913 1.802 1.583 3.344 1.489 3.426-.093.082-1.65.252-3.458.377l-3.289.227 1.618-3.653c.891-2.009 1.7-3.653 1.8-3.653.1 0 .928 1.475 1.84 3.276ZM133.76 3.34c-.545.562.695 2.957 1.532 2.957.571 0 .722 1.682.722 8.054v8.054h4.274c4.678 0 6.645-.532 8.569-2.318 2.015-1.87 2.945-4.17 2.991-7.396.034-2.416-.245-3.434-1.43-5.22-2.165-3.26-4.012-4.004-10.634-4.277-3.111-.128-5.821-.062-6.024.146Zm14.212 12.622c1.415-2.577 1.001-5.585-1.051-7.63-1.23-1.227-2.207-1.623-4.618-1.87l-3.058-.315V19.184l2.559-.008c3.254-.01 4.873-.854 6.168-3.214Z"
        clipRule="evenodd"
      />
    </Svg>
  );
}*/
