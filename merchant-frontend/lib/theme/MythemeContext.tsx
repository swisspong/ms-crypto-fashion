import { createContext, useState, ReactNode, useEffect } from "react";
interface IntialValue {
  setThemeToastHandler: (theme: string) => void;
  themeToast: string;
}
const initialValue: IntialValue = {
  setThemeToastHandler: (theme: string) => {},
  themeToast: "dark",
};

export const MyThemeContext = createContext(initialValue);

interface Props {
  children: ReactNode | ReactNode[];
}

const MyThemeProvider = ({ children }: Props) => {
  const [themeToast, setThemeToast] = useState<string>("");
  const setThemeToastHandler = (theme: string) => {
    setThemeToast(theme);
  };
  useEffect(()=>{
  },[themeToast])
  return (
    <MyThemeContext.Provider
      value={{
        setThemeToastHandler,
        themeToast,
      }}
    >
      {children}
    </MyThemeContext.Provider>
  );
};

export default MyThemeProvider;
