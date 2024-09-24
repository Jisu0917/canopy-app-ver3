import dynamic from "next/dynamic";

const AdminLoginPage = dynamic(() => import("./layout"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
});

export default AdminLoginPage;
