import { NextPage } from "next"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, Loader2, X } from "lucide-react"
import { withoutUserChangeEmail } from "@/src/hooks/auth/auth-hook"
import { StatusFormat } from "@/src/types/enums/common"
import { useSignout } from "@/src/hooks/auth/mutations"
import { useEffect } from "react"

const ChangeEmailPage: NextPage<{ data: IStatus | undefined }> = ({ data }) => {
    const router = useRouter()
    const {
        mutate: signoutHandler,
        isLoading: siginoutLoading,
        isSuccess,
    } = useSignout();

    useEffect(() => {
        signoutHandler()
    }, [data])
    return (
        <div className="min-h-screen h-full ">
            <div className="border-t">
                <div className="h-full fixed inset-0 flex items-center justify-center">
                    {
                        !data?.status ? (
                            <Card className="w-9/12 sm:w-96">
                                <CardHeader>
                                    <div className="flex items-center justify-center w-full">
                                        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                            <span>กรุณารอสักครู่</span>

                                        </h2>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl text-muted-foreground">
                                            <span>กำลังดำเนินการตรวจสอบข้อมูลของคุณและจะแจ้งให้คุณทราบเมื่อเสร็จสมบูรณ์ กรุณารอสักครู่</span>
                                        </p>
                                    </div>
                                </CardHeader>

                            </Card>
                        ) : data.status === StatusFormat.SUCCESS ? (
                            <Card className="w-9/12 sm:w-96">
                                <CardHeader>
                                    <div className="flex items-center justify-center w-full">
                                        <CheckIcon className="mr-2 h-16 w-16" />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                            <span>เปลี่ยนอีเมลสำเร็จ</span>
                                        </h2>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl text-muted-foreground">
                                            <span>คุณได้ทำการเปลี่ยนแปลงอีเมลเรียบร้อยแล้ว คุณสามารถเข้าใช้บัญชีของคุณตอนนี้ด้วยอีเมลใหม่</span>
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        className="w-full"
                                        onClick={() => router.push('signin')}
                                    >
                                        เข้าสู่ระบบ
                                    </Button>
                                </CardFooter>
                            </Card>
                        ) : data.status === StatusFormat.FAILURE ? (
                            <Card className="w-9/12 sm:w-96">
                                <CardHeader>
                                    <div className="flex items-center justify-center w-full">
                                        <X className="mr-2 h-16 w-16" />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                            <span>เกิดข้อผิดพลาด</span>
                                        </h2>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl text-muted-foreground">
                                            <span>ขออภัยในความไม่สะดวก ดูเหมือนว่ามีข้อผิดพลาดเกิดขึ้นในการเปลี่ยนแปลงอีเมล</span>
                                        </p>
                                    </div>
                                </CardHeader>

                            </Card>
                        ) : (
                            <Loader2 className="mr-2 h-16 w-16 animate-spin" />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ChangeEmailPage

export const getServerSideProps = withoutUserChangeEmail()