"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/board/DashboardLayout";
import DashboardContent from "@/components/board/DashboardContent";
import useSocketIO from "@/hooks/useSocketIO";
import { CanopyModel } from "@/types/models";

const BuyerDashboard: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const {
    sendControlCommand: socketSendControlCommand,
    isLoading,
    error,
  } = useSocketIO("buyer", userId);
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
      router.push("/homepage/buyer/login");
    }
  }, [router]);

  const fetchModels = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/database/canopy/show/buyer?buyerId=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch canopy data");
      }
      const result = await response.json();
      console.log("Fetched canopy data:", result.data);
      setCanopies(result.data);
    } catch (error) {
      console.error("Error fetching model data:", error);
      setFetchError("Failed to load canopy data. Please refresh the page.");
    }
  }, [userId]);

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
          router.push("/homepage/buyer/login");
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
    <DashboardLayout userType="buyer" onLogout={handleLogout}>
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

export default BuyerDashboard;
