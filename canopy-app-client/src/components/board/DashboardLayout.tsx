import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/YOUfun_logo.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "admin" | "buyer";
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userType,
  onLogout,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-white p-4 flex items-center border-b border-gray-200 shadow-sm">
        <Image
          src={Logo.src}
          alt="Logo"
          width={100}
          height={33}
          className="mr-8"
        />
        <Link
          href="http://youfuni.co.kr/main/"
          className="mx-6 text-gray-700"
          target="_blank"
        >
          홈페이지
        </Link>
        <Link
          href="https://venture.g2b.go.kr:8321/index.jsp"
          className="mx-6 text-gray-700"
          target="_blank"
        >
          나라장터
        </Link>
        <Link href={`/${userType}/linking`} className="mx-6 text-gray-700">
          그늘막 연동
        </Link>
        <button
          onClick={onLogout}
          className="ml-auto px-6 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
        >
          관리자 로그아웃
        </button>
      </nav>
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
