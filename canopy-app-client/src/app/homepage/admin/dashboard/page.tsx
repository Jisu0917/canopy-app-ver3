"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/board/DashboardLayout";
import DashboardContent from "@/components/board/DashboardContent";
import useSocketIO from "@/hooks/useSocketIO";
import { CanopyModel } from "@/types/models";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const {
    sendControlCommand: socketSendControlCommand,
    isLoading,
    error,
  } = useSocketIO("admin", userId);
  const [canopies, setCanopies] = useState<CanopyModel[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchUserId = useCallback(async () => {
    try {
      const response = await fetch("/api/login/user");
      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      console.error("Failed to fetch user ID:", error);
      setFetchError("Failed to fetch user ID. Please try logging in again.");
      router.push("/homepage/admin/login");
    }
  }, [router]);

  const fetchModels = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/database/canopy/show/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch canopy data");
      }
      const result = await response.json();
      console.log("Fetched canopy data:", result.data); // 디버깅을 위한 로그
      setCanopies(result.data); // 서버에서 받은 데이터 구조를 그대로 사용
    } catch (error) {
      console.error("Error fetching model data:", error);
      setFetchError("Failed to load canopy data. Please refresh the page.");
    }
  }, []);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (userId) {
      fetchModels();
    }
  }, [userId, fetchModels]);

  const handleControlChange = useCallback(
    async (id: number, control: string, value: boolean) => {
      try {
        const success = await socketSendControlCommand(id, control, value);
        if (success) {
          setCanopies((prevCanopies) =>
            prevCanopies.map((canopy) => {
              if (canopy.data.id === id) {
                return {
                  ...canopy,
                  data: {
                    ...canopy.data,
                    [`status_${control}`]: value,
                  },
                };
              }
              return canopy;
            })
          );
        }
        return success;
      } catch (error) {
        console.error("Control change error:", error);
        return false;
      }
    },
    [socketSendControlCommand]
  );

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      try {
        const response = await fetch("/api/logout", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          router.push("/homepage/admin/login");
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Logout error:", error);
        alert("로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  if (fetchError) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{fetchError}</p>
      </div>
    );
  }

  return (
    <DashboardLayout userType="admin" onLogout={handleLogout}>
      {!userId || isLoading ? (
        <div className="flex justify-center items-center h-full">
          <p>로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">에러: {error}</p>
        </div>
      ) : (
        <DashboardContent
          dashboardData={canopies}
          onControlChange={handleControlChange}
          userId={userId}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
