"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();
  return (
    <section className="sidebar">
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
              className={`sidebar-link mx-1! py-3! ${isActive ? "bg-bank-gradient" : ""}`}
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
        USER
      </nav>
      FOOTER
    </section>
  );
};

export default SideBar;
