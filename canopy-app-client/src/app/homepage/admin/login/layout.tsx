"use client"; // 클라이언트 사이드에서만 동작
import React, { useState } from "react";
import Logo from "@/components/common/Logo";
import LoginForm from "@/components/login/LoginForm";
import ErrorMessage from "@/components/common/ErrorMessage";
import bgImage from "@/assets/images/YOUfun_bg.png";

const AdminLoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");

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
        <LoginForm loginType={true} setErrorMessage={setErrorMessage} />
        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
};

export default AdminLoginPage;
