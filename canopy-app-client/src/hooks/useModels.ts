"use client";
import { useState, useEffect, useCallback } from "react";
import { AnyModel } from "@/types/models";
import { RelatedData } from "@/types/data";

export const useModels = <T extends AnyModel>(
  apiUrl: string,
  initialModel: T
) => {
  const [models, setModels] = useState<T[]>([]);
  const [relatedModels, setRelatedModels] = useState<{
    [key: number]: RelatedData[];
  }>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<T>(initialModel);

  const fetchModels = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/show`);
      const result = await response.json();

      const data: T[] = result.data;
      const relatedData: { [key: number]: RelatedData[] } = result.relatedData;

      setModels(data);
      setRelatedModels(relatedData);
    } catch (error) {
      console.error("모델 데이터를 가져오는 중 오류 발생:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchModels();

    // 주기적으로 데이터 새로고침
    const interval = setInterval(fetchModels, 5000); // 5초마다 새로고침

    return () => clearInterval(interval);
  }, [fetchModels]);

  const handleUpdate = (model: T) => {
    setCurrentModel(model);
    setIsPopupOpen(true);
    setIsAddPopupOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("이 데이터를 삭제하시겠습니까?")) {
      try {
        await fetch(`${apiUrl}/delete?id=${id}`, {
          method: "DELETE",
        });
        setModels((prevModels) =>
          prevModels.filter((model) => model.id !== id)
        );
        alert("데이터가 성공적으로 삭제되었습니다.");
        // 삭제 후 데이터 새로고침
        fetchModels();
      } catch (error) {
        console.error("데이터 삭제 중 오류 발생:", error);
        alert("데이터 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentModel) {
      alert("모델이 초기화되지 않았습니다.");
      return;
    }

    try {
      const apiEndpoint = currentModel.id !== 0 ? "update" : "create";
      const modelToSubmit: T = { ...currentModel };

      const response = await fetch(`${apiUrl}/${apiEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modelToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();

      // 상태 업데이트
      if (apiEndpoint === "update") {
        setModels((prevModels) =>
          prevModels.map((model) => (model.id === result.id ? result : model))
        );
      } else {
        setModels((prevModels) => [...prevModels, result]);
      }

      setIsPopupOpen(false);
      setIsAddPopupOpen(false);
      setCurrentModel(initialModel);

      // 제출 후 데이터 새로고침
      fetchModels();
    } catch (error) {
      console.error("제출된 데이터 처리 중 오류 발생:", error);
      alert("데이터 처리 중 오류가 발생했습니다.");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setIsAddPopupOpen(false);
    setCurrentModel(initialModel);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: number | boolean | string;

    if (type === "number") {
      newValue = value === "" ? 0 : Number(value);
    } else if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else {
      newValue = value;
    }

    setCurrentModel((prevModel) => ({
      ...prevModel,
      data: {
        ...prevModel.data,
        [name]: newValue,
      },
    }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleChange(e);
  };

  const openAddPopup = () => {
    setCurrentModel(initialModel);
    setIsAddPopupOpen(true);
    setIsPopupOpen(false);
  };

  return {
    models,
    relatedModels,
    isPopupOpen,
    isAddPopupOpen,
    currentModel,
    handleUpdate,
    handleDelete,
    handleSubmit,
    handleChange,
    handleCheckboxChange,
    handleClosePopup,
    openAddPopup,
    fetchModels, // fetchModels 함수를 반환값에 추가
  };
};
