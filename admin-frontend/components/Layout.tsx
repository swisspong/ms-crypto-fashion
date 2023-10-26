"use client"
import { Menu } from "@/components/Menu";
import { Sidebar } from "@/components/Sidebar";

import { ReactNode } from "react";
import { useTheme } from "next-themes";
import { MyThemeContext } from "@/lib/theme/MythemeContext";

interface Props {
  children: ReactNode | ReactNode[];
}

const Layout = ({ children }: Props) => {
  // const { theme, setTheme } = useTheme();
  // const { themeToast, setThemeToastHandler } = useContext(MyThemeContext);
  // const [theming, setTheming] = useState<string | undefined>(undefined);

  // useEffect(() => setTheming(theme), [theme]);
  return (
    <div className="layout-admin min-h-screen h-full">
      <div className="border-t">
        <div className="h-full fixed inset-0">

          <div className="grid lg:grid-cols-5 h-full border-t ">
            <Sidebar className="hidden lg:block bg-background relative h-full  row-span-1" />
            <div className="col-span-3 lg:col-span-4 lg:border-l bg-background overflow-x-hidden">
              <Menu />
              <div className="px-4 py-6 pr-4 break-words lg:px-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
