import "@/styles/globals.css";
import { ClientSessionProvider } from "@/components/common/ClientSessionProvider";

export const metadata = {
  title: "다기능 그늘막",
  description: "다기능 그늘막 홈페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-full flex flex-col justify-center items-center">
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}
