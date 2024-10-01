"use client";
import React from "react";
import Sidebar from "@/components/database/Sidebar";
import Table from "@/components/database/Table";
import Popup from "@/components/database/Popup";
import PopupForm from "@/components/database/PopupForm";
import { useModels } from "@/hooks/useModels";
import { LocationModel } from "@/types/models";

const LocationPage: React.FC = () => {
  const initialLocation: LocationModel = {
    id: 0,
    data: {
      id: 0,
      region: "",
      address: "",
    },
  };

  const {
    models: locations,
    relatedModels,
    isPopupOpen,
    isAddPopupOpen,
    currentModel,
    handleUpdate,
    handleDelete,
    handleSubmit,
    handleClosePopup,
    handleChange,
    openAddPopup,
  } = useModels<LocationModel>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/database/location/`,
    initialLocation
  );

  const fields = {
    id: { label: "ID", type: "number" },
    region: { label: "관할 구역", type: "text", required: true },
    address: { label: "주소", type: "text", required: true },
  };

  const relatedFields = {
    manage_number: { label: "관리 번호", type: "text", required: true },
    class_number: { label: "구분 번호", type: "text", required: true },
    buyer_id: { label: "구매자 ID", type: "select", required: true },
    region: { label: "관할 구역", type: "select", required: true },
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="pl-48">
          <h1 className="text-xl font-bold">위치 데이터 관리</h1>
          <Table
            // main model data columns
            data={locations}
            columns={[
              { Header: "ID", accessor: "id" },
              { Header: "관할 구역", accessor: "data.region" },
              { Header: "주소", accessor: "data.address" },
            ]}
            // related models data columns
            relatedData={relatedModels}
            relatedcolumns={[
              { Header: "관리 번호", accessor: "data.manage_number" },
              { Header: "구분 번호", accessor: "data.class_number" },
              { Header: "구매자 ID", accessor: "data.buyer_id" },
              { Header: "관할 구역", accessor: "data.region" },
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

export default LocationPage;
