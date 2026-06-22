import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Meow | auth",
  description:
    "Meow bank is a modern bank that is built for you and your business",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-image.png"
            alt="Auth"
            width={500}
            height={500}
          />
        </div>
      </div>
    </main>
  );
}
