"use client";
import { logout } from "@/lib/actions/user.action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter();
  const handleLogout = async () => {
    const res = await logout();
    if (res) {
      toast.success("Logged out", { description: "You have been signed out successfully." });
      router.push("/sign-in");
    } else {
      toast.error("Logout failed", { description: "Could not complete logout. Please try again." });
    }
  };
  return (
    <footer className="footer px-4!">
      {user && (
        <>
          <div
            className={type === "mobile" ? "footer_name-mobile" : "footer_name"}
          >
            <p className="text-xl font-bold text-gray-700">{user?.firstName[0]}</p>
          </div>
          <div
            className={
              type === "mobile" ? "footer_email-mobile" : "footer_email"
            }
          >
            <h1 className="text-14 truncate text-gray-700 font-semibold">
              {user.name}
            </h1>
            <p className="text-14 truncate font-normal text-gray-600">
              {user.email}
            </p>
          </div>
          <div className="footer_image" onClick={handleLogout}>
            <Image src={"/icons/logout.svg"} fill alt="logout" />
          </div>
        </>
      )}
    </footer>
  );
};

export default Footer;
