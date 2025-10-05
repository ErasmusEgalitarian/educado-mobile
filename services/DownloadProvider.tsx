// This file is to update download icon dynamically in main menu and download page
import { createContext, useState } from "react";
import PropTypes from "prop-types";
export const IconContext = createContext();

export const DownloadProvider = ({ children }) => {
  const [iconState, setIconState] = useState({}); // Store icons for each course or card

  const updateIcon = (courseId, icon) => {
    setIconState((prevState) => ({
      ...prevState,
      [courseId]: icon,
    }));
  };

  return (
    <IconContext.Provider value={{ iconState, updateIcon }}>
      {children}
    </IconContext.Provider>
  );
};

DownloadProvider.propTypes = {
  children: PropTypes.node,
};
