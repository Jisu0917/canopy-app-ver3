import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { user_id, password, rememberMe } = await request.json();

    // 관리자 찾기
    const admin = await prisma.admin.findUnique({
      where: { user_id: user_id },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isValid = await compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = sign(
      { userId: admin.id, userType: "admin" },
      process.env.JWT_SECRET!,
      { expiresIn: rememberMe ? "7d" : "1h" }
    );

    // 응답 생성
    const response = NextResponse.json(
      { userId: admin.id, message: "로그인 성공" },
      { status: 200 }
    );

    // HttpOnly 쿠키로 토큰 설정
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 : 60 * 60, // 7일 또는 1시간
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
