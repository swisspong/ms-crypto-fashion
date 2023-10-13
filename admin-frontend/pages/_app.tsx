import MyThemeProvider from "@/lib/theme/MythemeContext";
import "@/styles/globals.css";
import React, { useContext, useState } from "react";
import {
  MutationCache,
  Query,
  QueryClient,
  QueryCache,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { ThemeProvider, useTheme } from "next-themes";
import { Router, useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2 } from "lucide-react";
interface QueryCacheError extends AxiosError {
  // Define any additional properties you want to include in the error
  customProperty: string;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof Error) {
              const axiosError = error as AxiosError;
              const customError = axiosError;

              const { errors } = customError.response?.data as {
                errors: { field: string; message: string }[];
              };

              if (customError.response?.status === 401) {
                router.push("/signin");
              } else {
                const data:
                  | { statusCode: string; message: string }
                  | undefined = customError.response?.data
                  ? (customError.response?.data as {
                      statusCode: string;
                      message: string;
                    })
                  : undefined;
                if (data?.message) toast.error(data.message);
              }
            } else {
              toast(`Something went wrong`, {
                // position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                // theme: "dark",
              });
            }
          },
        }),
        queryCache: new QueryCache({
          onError: (
            error: unknown,
            query: Query<unknown, unknown, unknown>
          ) => {
            if (error instanceof Error) {
              const axiosError = error as AxiosError;
              const customError = axiosError;

              if (customError.response?.status === 401) {
                router.push("/signin");
              }
            } else {
            }
          },
        }),
      })
  );

  const [loading, setLoading] = React.useState(false);

  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
  });
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {loading ? (
        <div className="h-screen w-screen rounded-lg p-8 flex justify-center items-center">
          <div className="flex space-x-2 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <h1 className="text-xl font-bold tracking-tight">Please wait...</h1>
          </div>
        </div>
      ) : (
        <QueryClientProvider client={queryClient}>
          <MyThemeProvider>
            <ReactQueryDevtools />
            <Component {...pageProps} />
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={"light"}
            />
          </MyThemeProvider>
        </QueryClientProvider>
      )}
    </ThemeProvider>
  );
}
