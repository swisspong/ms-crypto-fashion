import MyThemeProvider from "@/lib/theme/MythemeContext";
import "@/styles/globals.css";
import {
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            // any error handling code...
            if (error instanceof Error) {
              const axiosError = error as AxiosError;
              const customError = axiosError;

              // console.log(`Something went wrong: ${customError.message}`);
              // console.log(`Status code: ${customError.response?.status}`);
              // console.log(`Status code: ${customError.response?.data}`);
              // console.log(customError.response?.data);
              const { errors } = customError.response?.data as {
                errors: { field: string; message: string }[];
              };

              if (customError.response?.status === 401) {
                router.push("http://localhost:3000/signin");
              } else {
                console.log(customError);
                const data:
                  | { statusCode: string; message: string }
                  | undefined = customError.response?.data
                  ? (customError.response?.data as {
                      statusCode: string;
                      message: string;
                    })
                  : undefined;
                if (data?.message) toast.error(data.message);
                // errors.map(({ field, message }, index) => {
                //   toast(`${field ? `${field}:` : ""}${message}`, {
                //     // position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     // theme: "dark",
                //   });
                // });
              }
              // console.log("test");
              //console.log(`Custom property: ${customError.customProperty}`);
            } else {
              // console.log("ttt");
              // console.log(`Something went wrong: ${error}`);
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
            console.log("on error");

            if (error instanceof Error) {
              const axiosError = error as AxiosError;
              const customError = axiosError;

              console.log(`Something went wrong: ${customError.message}`);
              console.log(`Status code: ${customError.response?.status}`);
              if (customError.response?.status === 401) {
                // toast("Please sigin");
                router.push("http://localhost:3000/signin");
              }
              //  else if (customError.response?.status === 400) {
              //   toast.error(customError.message)
              // }
            } else {
            }
          },
        }),
      })
  );
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <MyThemeProvider>
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
    </ThemeProvider>
  );
}
