import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="p-6 bg-white flex-1">{children}</main>
      </div>
    </div>
  );
}