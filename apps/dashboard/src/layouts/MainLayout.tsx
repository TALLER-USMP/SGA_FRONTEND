import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import React from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col max-h-screen">
        <Header />
        <main className="p-6 bg-white flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
