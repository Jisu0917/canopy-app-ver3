"use client";
import React from "react";
import Sidebar from "@/components/database/Sidebar";
import Table from "@/components/database/Table";
import Popup from "@/components/database/Popup";
import PopupForm from "@/components/database/PopupForm";
import { useModels } from "@/hooks/useModels";
import { CanopyModel } from "@/types/models";

const CanopyPage: React.FC = () => {
  const initialCanopy: CanopyModel = {
    id: 0,
    data: {
      id: 0,
      manage_number: "",
      class_number: "",
      location_id: 0,
      buyer_id: 0,
      status_fold: null,
      status_motor: null,
      status_led: null,
      status_sound: null,
      status_inform: null,
      status_temperature: 0,
      status_transmit: null,
    },
  };

  const {
    models: canopies,
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
  } = useModels<CanopyModel>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/database/canopy/`,
    initialCanopy
  );

  const fields = {
    id: { label: "ID", type: "number" },
    manage_number: { label: "관리 번호", type: "text", required: true },
    class_number: { label: "구분 번호", type: "text", required: true },
    location_id: { label: "위치 ID", type: "number", required: true },
    buyer_id: { label: "구매자 ID", type: "number", required: false },
    status_temperature: { label: "온도", type: "number" },
    status_fold: { label: "접힘", type: "checkbox" },
    status_motor: { label: "모터", type: "checkbox" },
    status_led: { label: "LED", type: "checkbox" },
    status_sound: { label: "소리", type: "checkbox" },
    status_inform: { label: "정보", type: "checkbox" },
    status_transmit: { label: "수신", type: "checkbox" },
  };

  const relatedFields = {
    region: { label: "관할 구역", type: "text", required: true },
    supervisor_name: { label: "담당자 성함", type: "text", required: true },
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="pl-48">
          <h1 className="text-xl font-bold">그늘막 데이터 관리</h1>
          <Table
            // main model data columns
            data={canopies}
            columns={[
              { Header: "ID", accessor: "id" },
              { Header: "관리 번호", accessor: "data.manage_number" },
              { Header: "구분 번호", accessor: "data.class_number" },
              { Header: "위치 ID", accessor: "data.llcation_id" },
              { Header: "구매자 ID", accessor: "data.buyer_id" },
            ]}
            subcolumns={[
              { Header: "접힘", accessor: "data.status_fold" },
              { Header: "모터", accessor: "data.status_motor" },
              { Header: "LED", accessor: "data.status_led" },
              { Header: "소리", accessor: "data.status_sound" },
              { Header: "정보", accessor: "data.status_inform" },
              { Header: "온도", accessor: "data.status_temperature" },
              { Header: "수신상태", accessor: "data.status_transmit" },
            ]}
            // related models data columns
            relatedData={relatedModels}
            relatedcolumns={[
              { Header: "위치 ID", accessor: "data.location_id" },
              { Header: "관할 구역", accessor: "data.region" },
              { Header: "구매자 ID", accessor: "data.buyer_id" },
              { Header: "담당자 이름", accessor: "data.supervisor_name" },
            ]}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isButtonsDisabled={isPopupOpen || isAddPopupOpen}
            expanded
          />
        </div>
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

export default CanopyPage;
