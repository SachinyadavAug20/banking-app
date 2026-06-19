import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meow | auth",
  description:
    "Meow bank is a modern bank that is built for you and your business",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return(
    <main>
  { children }
  </main>

  )
  ;
}
