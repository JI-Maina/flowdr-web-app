"use server";

import { z } from "zod";

import { loginSchema, regSchema } from "@/lib/schemas";
import { cookies } from "next/headers";

export async function registerUser(values: z.infer<typeof regSchema>) {
  const url = process.env.NEXT_PUBLIC_API_HOST;

  const res = await fetch(`${url}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "owner",
      ...values,
    }),
  });

  if (!res.ok) {
    return { error: await res.json() };
  }

  return { success: await res.json() };
}

export async function loginUser(values: z.infer<typeof loginSchema>) {
  const url = process.env.NEXT_PUBLIC_API_HOST;

  const res = await fetch(`${url}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    return { error: await res.json() };
  }

  const data = await res.json();

  const accessToken = data["access_token"];
  const refreshToken = data["refresh_token"];

  const sessionData = {
    accessToken,
    refreshToken,
  };

  const cookieStore = await cookies();

  cookieStore.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12, // 12 hours
    path: "/",
    sameSite: "strict",
  });

  return data;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie);
  } catch (error) {
    console.error("Failed to parse session cookie:", error);
    return null;
  }
}

export async function resetAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { path: "/", maxAge: -1 });
}

export async function getToken() {
  const session = await getSession();
  return session?.accessToken || null;
}
