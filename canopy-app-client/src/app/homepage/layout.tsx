import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-auto scrollbar-hide">
    <main className="flex-1">{children}</main>
  </div>
);

export default Layout;
