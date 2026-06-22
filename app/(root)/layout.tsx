import MobileNavbar from "@/components/MobileNavbar";
import SideBar from "@/components/SideBar";
import { getLoggedInUser } from "@/lib/actions/user.action";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Meow mega corp bank",
  description:
    "Meow bank is a modern bank that is built for you and your business",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/sign-in");
  return (
    <main className="flex h-screen w-full font-inter">
      <SideBar user={loggedIn} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNavbar user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
