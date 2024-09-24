"use client"; // 클라이언트 사이드에서만 동작
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/common/Logo";
import LoginForm from "@/components/login/LoginForm";
import ErrorMessage from "@/components/common/ErrorMessage";
import bgImage from "@/assets/images/YOUfun_bg.png";

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  return (
    <div
      className="flex flex-row justify-start items-center w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col justify-center items-center text-center w-[380px] h-full bg-white bg-opacity-90 rounded-lg shadow-lg">
        <Logo
          onClick={() => window.open("http://youfuni.co.kr/main/", "_blank")}
        />
        <LoginForm loginType={false} setErrorMessage={setErrorMessage} />
        <ErrorMessage message={errorMessage} />
        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="text-sm w-[260px] h-[40px] py-2 mt-3 bg-[#f3f3f3] text-[#727171] rounded transition-opacity duration-300 hover:opacity-80"
        >
          관리자 로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
