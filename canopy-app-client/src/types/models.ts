/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from "@prisma/client";
import React from "react";

// Base Model 인터페이스 정의
export interface BaseModel {
  id: number;
  children?: React.ReactNode;
  type?: string | number;
  props?: { [key: string]: any };
}

// Model 타입 정의
export type Model<T> = BaseModel & {
  data: T;
};

// Admin 데이터 타입 정의
export type AdminData = Prisma.AdminGetPayload<{}>;

// AdminModel 타입 정의
export interface AdminModel extends BaseModel {
  data: AdminData;
}

// Buyer 데이터 타입 정의
export type BuyerData = Prisma.BuyerGetPayload<{}> & {
  canopies?: Prisma.CanopyGetPayload<{}>[] | null;
  controls?: Prisma.ControlGetPayload<{}>[] | null;
};

// BuyerModel 타입 정의
export interface BuyerModel extends BaseModel {
  data: BuyerData;
}

// Location 데이터 타입 정의
export type LocationData = Prisma.LocationGetPayload<{}> & {
  canopies?: Prisma.CanopyGetPayload<{}>[] | null;
};

// LocationModel 타입 정의
export interface LocationModel extends BaseModel {
  data: LocationData;
}

// Canopy 데이터 타입 정의
export type CanopyData = Prisma.CanopyGetPayload<{}> & {
  location?: Prisma.LocationGetPayload<{}> | null;
  buyer?: Prisma.BuyerGetPayload<{}> | null;
  controls?: Prisma.ControlGetPayload<{}>[] | null;
};

// CanopyModel 타입 정의
export interface CanopyModel extends BaseModel {
  data: CanopyData;
}

// Control 데이터 타입 정의
export type ControlData = Prisma.ControlGetPayload<{}> & {
  canopy?: Prisma.CanopyGetPayload<{}> | null;
  buyer?: Prisma.BuyerGetPayload<{}> | null;
};

// ControlModel 타입 정의
export interface ControlModel extends BaseModel {
  data: ControlData;
}

export type AnyData =
  | AdminData
  | BuyerData
  | CanopyData
  | ControlData
  | LocationData;

// 모든 Model 타입을 포함하는 유니온 타입
export type AnyModel =
  | AdminModel
  | BuyerModel
  | LocationModel
  | CanopyModel
  | ControlModel;
