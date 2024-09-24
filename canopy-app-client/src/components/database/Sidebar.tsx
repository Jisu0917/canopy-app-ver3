import React from "react";
import Link from "next/link";

const Sidebar: React.FC = () => (
  <div className="w-40 bg-gray-100 p-6 shadow-lg fixed h-screen">
    <h2 className="text-lg mb-2 font-semibold">관리 메뉴</h2>
    <p>
      <Link
        href="/database/admin"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
      >
        회원 정보 관리
      </Link>
    </p>
    <p>
      <Link
        href="/database/buyer"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
      >
        구매자 정보 관리
      </Link>
    </p>
    <p>
      <Link
        href="/database/canopy"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
      >
        그늘막 정보 관리
      </Link>
    </p>
    <p>
      <Link
        href="/database/control"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
      >
        제어 정보 관리
      </Link>
    </p>
    <p>
      <Link
        href="/database/location"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
      >
        위치 정보 관리
      </Link>
    </p>
    <h2 className="mt-8 text-lg mb-2 font-semibold">사이트 메뉴</h2>
    <p>
      <Link
        href="/homepage/admin/login"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
        target="_blank"
      >
        관리자 로그인
      </Link>
    </p>
    <p>
      <Link
        href="/homepage/buyer/login"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
        target="_blank"
      >
        구매자 로그인
      </Link>
    </p>
    <p>
      <Link
        href="/homepage/admin/dashboard"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
        target="_blank"
      >
        관리자 대시보드
      </Link>
    </p>
    <p>
      <Link
        href="/homepage/admin/control"
        className="block text-gray-600 text-sm mb-2 hover:text-blue-600"
        target="_blank"
      >
        그늘막 연동 페이지
      </Link>
    </p>
  </div>
);

export default Sidebar;
