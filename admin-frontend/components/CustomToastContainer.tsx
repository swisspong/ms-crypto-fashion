// import { useTheme } from "next-themes";
import React, { useContext } from "react";
import { Theme, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CustomToastContainer = () => {
  // const {theme} = useTheme()
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={"light"}
    />
  );
};

export default CustomToastContainer;
