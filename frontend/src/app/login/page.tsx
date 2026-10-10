"use client";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/landing/auth-modal";

export default function LoginPage() {
  const router = useRouter();
  return <AuthModal onClose={() => router.push("/")} />;
}
