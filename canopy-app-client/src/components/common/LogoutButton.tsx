"use client";
import React from "react";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      // 로그아웃 로직 구현
      // 예: API 호출 후 로그인 페이지로 리다이렉트
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-auto px-6 py-2 bg-blue-400 text-white rounded hover:bg-blue-300 transition-colors"
    >
      관리자 로그아웃
    </button>
  );
};

export default LogoutButton;
