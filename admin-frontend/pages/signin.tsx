"use client"
import React from 'react';
import Link from "next/link";
import AdminAuthForm from "@/components/signin-form";
import { withoutUser } from "@/src/hooks/auth/isAuth";
import dynamic from "next/dynamic";
// const Layout = dynamic(() => import("@/components/Layout"), {
//   ssr: false,
// });
export default function Signin() {
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="p-10 rounded-lg shadow-2xl mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex flex-col space-y-2 mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              เข้าสู่ระบบ
            </h1>
            <p className="text-sm text-muted-foreground">
              กรอกอีเมลและรหัสผ่านของคุณด้านล่างเพื่อเข้าสู่ระบบ
            </p>
          </div>
          <AdminAuthForm />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = withoutUser();
