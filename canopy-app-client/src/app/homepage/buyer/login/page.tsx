import dynamic from "next/dynamic";

const LoginPage = dynamic(() => import("./layout"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
});

export default LoginPage;
