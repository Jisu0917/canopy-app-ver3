// /app/homepage/admin/dashboard/page.tsx

"use client";

import React from "react";
import Dashboard from "@/components/board/Dashboard";

const AdminDashboard: React.FC = () => {
  return <Dashboard userType="admin" />;
};

export default AdminDashboard;
