import { getInfoSsr } from "@/src/services/user.service";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { IUserRes } from "@/src/types/user";
export const withUser = (roles?: string[]) => {
    const getServerSideProps: GetServerSideProps = async (context) => {
        const queryClient = new QueryClient();

        await queryClient.prefetchQuery(["me"], () =>
            getInfoSsr(context.req.headers.cookie)
        );
        const me = queryClient.getQueryData(["me"]);
        if (!me) {
            return {
                redirect: {
                    destination: `${process.env.HOST_CUSTOMER}/signin`,
                    permanent: false,
                },
            };
        }
        console.log(me,roles)
        console.log("------------------------------")
        if (me && roles && roles.length > 0) {
            const info = me as IUserRes
            const isInclude = roles.includes(info.role)
            if (!isInclude) return {
                redirect: {
                    destination: "http://localhost:3000",
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
export const withoutUser = () => {
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