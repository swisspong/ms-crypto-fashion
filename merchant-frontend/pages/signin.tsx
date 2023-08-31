import Link from "next/link"
import AdminAuthForm from "@/components/signin-form"

export default function Signin() {
    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

                <div className="p-10 rounded-lg shadow-2xl mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    


                    <div className="flex flex-col space-y-2 mb-6 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Sign in to Crypto fashion
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email and password below
                        </p>
                    </div>
                    <AdminAuthForm />
                </div>
            </div>
        </>
    )
}