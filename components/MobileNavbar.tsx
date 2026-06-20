"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNavbar = ({ user }: MobileNavProps) => {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src={"/icons/hamburger.svg"}
            width={30}
            height={30}
            alt={"hamburger"}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-1 px-4"
          >
            <Image
              src={"/icons/logo.svg"}
              width={34}
              height={34}
              alt={"logo"}
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
              MMCB
            </h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((i) => {
                  const isActive =
                    pathname === i.route || pathname.startsWith(`${i.route}/`);
                  return (
                    <SheetClose asChild key={i.route}>
                      <Link
                        href={i.route}
                        key={i.label}
                        className={`mobilenav-sheet_close w-full mx-1! py-3! ${isActive ? "bg-bank-gradient" : ""}`}
                      >
                        <Image
                          src={i.imgURL}
                          alt={i.label}
                          width={20}
                          height={20}
                          className={isActive ? "brightness-[3] invert-0" : ""}
                        />
                        <p
                          className={`text-16 font-semibold text-black-2  ${isActive ? "text-white!" : ""}`}
                        >
                          {i.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
                USER
              </nav>
            </SheetClose>
            FOOTER
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNavbar;
