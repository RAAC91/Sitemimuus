"use client";

import { useAuth } from "@/providers/AuthProvider";

const ADMIN_EMAILS = ['rueliton.andrade@gmail.com'];

export function useAdmin() {
  const { user } = useAuth();
  
  const isAdmin = !!(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim()));

  return { isAdmin };
}
