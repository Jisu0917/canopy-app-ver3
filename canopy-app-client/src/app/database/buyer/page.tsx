"use client";
import React from "react";
import Sidebar from "@/components/database/Sidebar";
import Table from "@/components/database/Table";
import Popup from "@/components/database/Popup";
import PopupForm from "@/components/database/PopupForm";
import { useModels } from "@/hooks/useModels";
import { BuyerModel } from "@/types/models";

// BuyerPage 컴포넌트 정의
const BuyerPage: React.FC = () => {
  // 초기 모델 데이터 정의
  const initialBuyer: BuyerModel = {
    id: 0,
    data: {
      id: 0,
      user_id: "",
      password: "",
      region: "",
      supervisor_name: "",
      supervisor_phone: "",
    },
  };

  // useModels 훅 사용
  const {
    models: buyers,
    isPopupOpen,
    isAddPopupOpen,
    currentModel,
    handleUpdate,
    handleDelete,
    handleSubmit,
    handleClosePopup,
    handleChange,
    handleCheckboxChange,
    openAddPopup,
  } = useModels<BuyerModel>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/database/buyer/`,
    initialBuyer
  );

  // 필드 정의
  const fields = {
    id: { label: "ID", type: "number" },
    user_id: { label: "사용자 ID", type: "text", required: true },
    password: { label: "비밀번호", type: "password" },
    region: { label: "지역", type: "text", required: true },
    supervisor_name: { label: "관리자 이름", type: "text", required: true },
    supervisor_phone: {
      label: "관리자 전화번호",
      type: "text",
      required: true,
    },
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="pl-48">
          <h1 className="text-xl font-bold">구매자 데이터 관리</h1>
          <Table
            data={buyers}
            columns={[
              { Header: "ID", accessor: "id" },
              { Header: "사용자 ID", accessor: "data.user_id" },
              { Header: "지역", accessor: "data.region" },
              { Header: "관리자 이름", accessor: "data.supervisor_name" },
              { Header: "관리자 전화번호", accessor: "data.supervisor_phone" },
            ]}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isButtonsDisabled={isPopupOpen || isAddPopupOpen}
          />
        </div>

        {/* 수정 팝업 */}
        <Popup
          id="update-popup"
          isOpen={isPopupOpen}
          title="데이터 수정하기"
          onClose={handleClosePopup}
        >
          {currentModel && (
            <PopupForm
              model={currentModel}
              onChange={handleChange}
              onCheckboxChange={handleCheckboxChange}
              onSubmit={handleSubmit}
              onClose={handleClosePopup}
              isUpdate={true}
              fields={fields}
            />
          )}
        </Popup>

        {/* 추가 팝업 */}
        <Popup
          id="add-popup"
          isOpen={isAddPopupOpen}
          title="데이터 추가하기"
          onClose={handleClosePopup}
        >
          <PopupForm
            model={currentModel} // initialBuyer 대신 currentModel 사용
            onChange={handleChange}
            onCheckboxChange={handleCheckboxChange}
            onSubmit={handleSubmit}
            onClose={handleClosePopup}
            isUpdate={false}
            fields={fields}
          />
        </Popup>

        {/* 팝업 열기 버튼 */}
        <div
          className={`fixed bottom-5 right-5 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full cursor-pointer z-50 ${
            isPopupOpen || isAddPopupOpen ? "hidden" : ""
          }`}
          onClick={() => openAddPopup()}
        >
          <span className="text-3xl">+</span>
        </div>
      </main>
    </div>
  );
};

export default BuyerPage;
