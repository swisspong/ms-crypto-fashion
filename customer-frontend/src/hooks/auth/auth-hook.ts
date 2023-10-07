import { changeEmailUser, getInfoSsr, verifyEmail } from "@/src/services/user.service";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useRouter } from "next/router";

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
        console.log('context => ',context.req.headers)
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

export const withoutUserVerify =()=>{
    const getServerSideProps: GetServerSideProps = async (context) => {
        const queryClient = new QueryClient();
        
        const token = context.query.token as string
        
        await queryClient.prefetchQuery(["verify"], () =>
            verifyEmail(token)
        );

        const data: IStatus | undefined = queryClient.getQueryData(["verify"]);
        console.log("data",data)
        if (!token) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }else if (data) {
            return {
                props: {data}
            }
        }
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };
    return getServerSideProps
}

export const withoutUserChangeEmail =()=>{
    const getServerSideProps: GetServerSideProps = async (context) => {
        const queryClient = new QueryClient();
        
        const token = context.query.token as string
        
        await queryClient.prefetchQuery(["change-email"], () =>
            changeEmailUser(token)
        );

        const data: IStatus | undefined = queryClient.getQueryData(["change-email"]);

        if (!token) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }else if (data) {
            return {
                props: {data}
            }
        }
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
            },
        };
    };
    return getServerSideProps
}