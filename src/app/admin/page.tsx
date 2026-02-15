import type { Metadata } from "next";
import AdminContent from "@/components/AdminContent";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "Admin | Smoky",
};

export default function AdminPage() {
  return <AdminContent />;
}
