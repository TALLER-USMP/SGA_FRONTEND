import type HeaderProps from "../../interfaces/headerProps";
export default function Header({ user }: HeaderProps) {
  const displayName = user?.name || user?.email || "Docente";

  return (
    <header className="w-full bg-red-700 text-white flex justify-end items-center px-6 py-3">
      <button className="bg-white text-black px-4 py-1 rounded shadow">
        {`${displayName} ⬇`}
      </button>
    </header>
  );
}
