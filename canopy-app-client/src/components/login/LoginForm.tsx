import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm: React.FC<{
  loginType: boolean; // true: admin, false: buyer
  setErrorMessage: (msg: string) => void;
}> = ({ loginType, setErrorMessage }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        loginType ? "/api/login/admin" : "/api/login/buyer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId, password, rememberMe }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // 로그인 성공 시 사용자 ID를 로컬 스토리지에 저장
        localStorage.setItem("userId", data.userId);
        // 로그인 성공시 대시보드 페이지로 리다이렉트
        router.push(
          loginType ? "/homepage/admin/dashboard" : "/homepage/buyer/dashboard"
        );
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setErrorMessage("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <form
      className="w-full flex flex-col justify-center items-center"
      onSubmit={handleSubmit}
    >
      <div className="mb-3">
        <input
          type="text"
          id="user_id"
          name="user_id"
          placeholder="아이디"
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="text-sm placeholder-[#a9a9a9] h-[40px] w-[260px] p-2 border border-[#f3f3f3] rounded-[3px] bg-[#f3f3f3] text-gray-700"
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-sm placeholder-[#a9a9a9] h-[40px] w-[260px] p-2 border border-[#f3f3f3] rounded-[3px] bg-[#f3f3f3] text-gray-700"
        />
      </div>
      <div className="w-[260px] flex flex-row items-center mb-3 text-gray-600 text-sm">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          className="mr-[10px]"
        />
        <label htmlFor="rememberMe" className="text-sm text-[#727272]">
          자동 로그인
        </label>
      </div>
      <button
        type="submit"
        className="text-sm w-[260px] h-[40px] py-2 mb-1 bg-[#4dc1e9] text-white rounded transition-opacity duration-300 hover:opacity-80"
      >
        {loginType ? "관리자 로그인" : "로그인"}
      </button>
    </form>
  );
};

export default LoginForm;
