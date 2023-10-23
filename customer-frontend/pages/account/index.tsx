"use client";

import { useEffect, useState } from "react";

import CartItem from "@/components/cart-item";
import Container from "@/components/container";
import Summary from "@/components/summary";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/account/profile-form";
import { SidebarNav } from "@/components/account/sidebar-nav";
import { EmailForm } from "@/components/account/email-form";
import { PasswordForm } from "@/components/account/passowrd-form";
import { useUserInfo } from "@/src/hooks/user/queries";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/account",
  },
  {
    title: "Address",
    href: "/account/address",
  },
];

const ProfilePage = () => {
  const {
    data: me,
    isLoading: meLoading,
    isSuccess: meSuccess,
  } = useUserInfo();

  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 min-h-screen">
          <div
            // className="space-y-6 p-10 pb-16"
            className="space-y-6 p-3 sm:p-10 pb-16"
          >
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">บัญชี</h2>
              <p className="text-muted-foreground">
                จัดการการตั้งค้าบัญชีของคุณเอง
              </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="-mx-4 lg:w-1/5">
                <SidebarNav items={sidebarNavItems} />
              </aside>{" "}
              <div className="space-y-6">
                {!me?.address && !me?.google_id ? (
                  <div className="flex-1 lg:max-w-4xl">
                    <ProfileForm
                      me={me!}
                      meLoading={meLoading}
                      meSuccess={meSuccess}
                      key={me?.user_id}
                    />
                    <EmailForm />
                    <PasswordForm />
                  </div>
                ) : (
                  <div className="flex-1 lg:max-w-4xl">
                    <ProfileForm
                      me={me!}
                      meLoading={meLoading}
                      meSuccess={meSuccess}
                      key={me?.user_id}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ProfilePage;
