// /components/Dashboard.tsx

import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useMemo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/board/DashboardLayout";
import DashboardContent from "@/components/board/DashboardContent";
import useSocketIO from "@/hooks/useSocketIO";
import { CanopyModel } from "@/types/models";

const SearchParamsComponent: React.FC<{
  onSearchParamsChange: (params: URLSearchParams) => void;
}> = ({ onSearchParamsChange }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    onSearchParamsChange(searchParams);
  }, [searchParams, onSearchParamsChange]);

  return null;
};

type DashboardProps = {
  userType: "admin" | "buyer";
};

const Dashboard: React.FC<DashboardProps> = ({ userType }) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const {
    sendControlCommand: socketSendControlCommand,
    isLoading: socketLoading,
    error: socketError,
  } = useSocketIO(userType, userId);
  const [canopies, setCanopies] = useState<CanopyModel[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      router.push(`/homepage/${userType}/login`);
    }
  }, [router, userType]);

  const fetchModels = useCallback(async () => {
    if (!userId) return;

    try {
      const url =
        userType === "admin"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/database/canopy/show/`
          : `${process.env.NEXT_PUBLIC_API_URL}/database/canopy/show/buyer?buyerId=${userId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch canopy data");
      }
      const result = await response.json();
      console.log("Fetched canopy data:", result.data);
      setCanopies(result.data);
    } catch (error) {
      console.error("Error fetching model data:", error);
      setFetchError("Failed to load canopy data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, userType]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (userId) {
      fetchModels();
    }
  }, [userId, fetchModels]);

  const handleSearchParamsChange = useCallback(() => {
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
          router.push(`/homepage/${userType}/login`);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Logout error:", error);
        alert("로그아웃 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const memoizedDashboardContent = useMemo(
    () => (
      <DashboardContent
        dashboardData={canopies}
        onControlChange={handleControlChange}
        userId={userId}
      />
    ),
    [canopies, handleControlChange, userId]
  );

  if (fetchError) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{fetchError}</p>
      </div>
    );
  }

  return (
    <DashboardLayout userType={userType} onLogout={handleLogout}>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsComponent
          onSearchParamsChange={handleSearchParamsChange}
        />
        {isLoading || socketLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>로딩 중...</p>
          </div>
        ) : socketError ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">에러: {socketError}</p>
          </div>
        ) : (
          memoizedDashboardContent
        )}
      </Suspense>
    </DashboardLayout>
  );
};

export default Dashboard;
