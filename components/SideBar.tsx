"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import PlaidLink from "./PlaidLink";

const SideBar = ({user}:SiderbarProps) => {
  const pathname = usePathname();
  return (
    <section className="sidebar h-[95vh]!">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image
            src={"/icons/logo.svg"}
            width={34}
            height={34}
            alt={"logo"}
            className="size-6 max-xl:size-14"
          />
          <h1 className="sidebar-logo">MMCB</h1>
        </Link>
        {sidebarLinks.map((i) => {
          const isActive =
            pathname === i.route || pathname.startsWith(`${i.route}/`);
          return (
            <Link
              href={i.route}
              key={i.label}
              className={`sidebar-link py-3! px-2! mr-5! ${isActive ? "bg-bank-gradient" : ""}`}
            >
              <div className="relative size-6">
                <Image
                  src={i.imgURL}
                  alt={i.label}
                  fill
                  className={isActive ? "brightness-[3] invert-0" : ""}
                />
              </div>
              <p className={`sidebar-label ${isActive ? "text-white!" : ""}`}>
                {i.label}
              </p>
            </Link>
          );
        })}
        <PlaidLink user={user} />
      </nav>
      <Footer user={user}/>
    </section>
  );
};

export default SideBar;
