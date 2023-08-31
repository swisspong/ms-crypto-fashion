import { getInfoSsr } from "@/src/services/user.service";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
export const withUser = () => {
    const getServerSideProps: GetServerSideProps = async (context) => {
        const queryClient = new QueryClient();

        await queryClient.prefetchQuery(["me"], () =>
            getInfoSsr(context.req.headers.cookie)
        );
        const me = queryClient.getQueryData(["me"]);
        if (!me) {
            return {
                redirect: {
                    destination: "/signin",
                    permanent: false,
                },
            };
        }
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };
    return getServerSideProps
}

export const withoutUser =()=>{
    const getServerSideProps: GetServerSideProps = async (context) => {
        const queryClient = new QueryClient();
        await queryClient.prefetchQuery(["me"], () =>
            getInfoSsr(context.req.headers.cookie)
        );
        const me = queryClient.getQueryData(["me"]);
        console.log("test", me);
        if (me) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };
    return getServerSideProps
}