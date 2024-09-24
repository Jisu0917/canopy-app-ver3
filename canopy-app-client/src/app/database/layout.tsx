import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-auto scrollbar-hide">
    {/* <header className="bg-gray-100 text-gray-800 p-4 shadow-md z-10">
      <h1 className="text-xl font-bold">데이터베이스 관리 페이지</h1>
    </header> */}
    <main className="flex-1">{children}</main>
    {/* <footer className="bg-blue-300 text-white p-3 text-center z-10">
      © 2024 다기능 그늘막 데이터베이스
    </footer> */}
  </div>
);

export default Layout;
