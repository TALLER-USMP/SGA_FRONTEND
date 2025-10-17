interface HeaderProps {
  user?: {
    name?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="w-full bg-red-700 text-white flex justify-end items-center px-6 py-3">
      <button className="bg-white text-black px-4 py-1 rounded shadow">
        {user?.name ? `${user.name} ⬇` : "Docente ⬇"}
      </button>
    </header>
  );
}
