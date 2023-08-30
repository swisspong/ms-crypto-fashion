import { getInfoSsr } from "@/src/services/auth.service";
import { RoleFormat } from "@/src/types/enums/role";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";

export const withoutUser = () => {
    const getServerSideProps: GetServerSideProps = async (context) => {
        const queryClient = new QueryClient();
        await queryClient.prefetchQuery(["me"], () =>
            getInfoSsr(context.req.headers.cookie)
        );
        const me = queryClient.getQueryData(["me"]);
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

export const withUser = () => {
    const getServerSideProps: GetServerSideProps = async (context) => {
        const queryClient = new QueryClient();

        await queryClient.prefetchQuery(["me"], () =>
            getInfoSsr(context.req.headers.cookie)
        );
        const me: IAdmin | undefined = queryClient.getQueryData(["me"]);
        if (!me) {
            return {
                redirect: {
                    destination: "/signin",
                    permanent: false,
                },
            };
        } else if (me) {
            const role = me.role
            console.log(role)
            if (role !== RoleFormat.ADMIN) {
                return {
                    redirect: {
                        destination: "http://localhost:3000/signin",
                        permanent: false,
                    },
                };
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

export const withUserPermission = (permission: string[], next: string) => {
    const getServerSideProps: GetServerSideProps = async (context) => {
        const queryClient = new QueryClient();

        await queryClient.prefetchQuery(["me"], () =>
            getInfoSsr(context.req.headers.cookie)
        );
        const me: IAdmin | undefined = queryClient.getQueryData(["me"]);

        if (!me) {
            return {
                redirect: {
                    destination: "/signin",
                    permanent: false,
                },
            };
        } else if (me) {
            const permissions = me.permission
            const role = me.role
            if (permissions && role === RoleFormat.ADMIN) {

                const per_check = permission.every((val) => {
                    const per = permissions.includes(val)
                    if (!per) return per

                    return per
                })

                if (!per_check) {
                    return {
                        redirect: {
                            destination: next,
                            permanent: false,
                        },
                    };
                }
            } else if (role !== RoleFormat.ADMIN) {

                return {
                    redirect: {
                        destination: "http://localhost:3000/signin",
                        permanent: false,
                    },
                };


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