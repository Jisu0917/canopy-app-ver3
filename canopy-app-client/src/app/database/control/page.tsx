"use client";
import React from "react";
import Sidebar from "@/components/database/Sidebar";
import Table from "@/components/database/Table";
import Popup from "@/components/database/Popup";
import PopupForm from "@/components/database/PopupForm";
import { useModels } from "@/hooks/useModels";
import { ControlModel } from "@/types/models";

const ControlPage: React.FC = () => {
  const initialControl: ControlModel = {
    id: 0,
    data: {
      id: 0,
      canopy_id: 0,
      buyer_id: 0,
      fold: false,
      motor: false,
      led: false,
      sound: false,
      inform: false,
      timestamp: new Date(),
    },
  };

  const {
    models: controls,
    relatedModels,
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
  } = useModels<ControlModel>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/database/control/`,
    initialControl
  );

  const fields = {
    id: { label: "ID", type: "number" },
    data: {
      canopy_id: { label: "그늘막 ID", type: "number", required: true },
      buyer_id: { label: "구매자 ID", type: "number", required: true },
      fold: { label: "접힘", type: "checkbox", required: true },
      motor: { label: "모터", type: "checkbox", required: true },
      led: { label: "LED", type: "checkbox", required: true },
      sound: { label: "사운드", type: "checkbox", required: true },
      inform: { label: "정보", type: "checkbox", required: true },
      timestamp: { label: "Time", type: "datetime-local" },
    },
  };

  const relatedFields = {
    manage_number: { label: "관리 번호", type: "select", required: true },
    supervisor_nume: { label: "담당자 성함", type: "select", required: true },
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="pl-48">
          <h1 className="text-xl font-bold">제어 데이터 관리</h1>
          <Table
            data={controls}
            columns={[
              { Header: "ID", accessor: "id" },
              { Header: "그늘막 ID", accessor: "data.canopy_id" },
              { Header: "구매자 ID", accessor: "data.buyer_id" },
              { Header: "접힘", accessor: "data.fold" },
              { Header: "모터", accessor: "data.motor" },
              { Header: "LED", accessor: "data.led" },
              { Header: "사운드", accessor: "data.sound" },
              { Header: "정보", accessor: "data.inform" },
              { Header: "Time", accessor: "data.timestamp" },
            ]}
            // related models data columns
            relatedData={relatedModels}
            relatedcolumns={[
              { Header: "그늘막 ID", accessor: "data.canopy_id" },
              { Header: "관리 번호", accessor: "data.manage_number" },
              { Header: "구매자 ID", accessor: "data.buyer_id" },
              { Header: "담당자 이름", accessor: "data.supervisor_name" },
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
              fields={fields}
              relatedData={relatedModels}
              relatedFields={relatedFields}
              onChange={handleChange}
              onCheckboxChange={handleCheckboxChange}
              onSubmit={handleSubmit}
              onClose={handleClosePopup}
              isUpdate={true}
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
            model={currentModel}
            fields={fields}
            relatedData={relatedModels}
            relatedFields={relatedFields}
            onChange={handleChange}
            onCheckboxChange={handleCheckboxChange}
            onSubmit={handleSubmit}
            onClose={handleClosePopup}
            isUpdate={false}
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

export default ControlPage;
