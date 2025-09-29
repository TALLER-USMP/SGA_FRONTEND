// eslint-disable-next-line no-empty-pattern
export default function Header({}: { title: string }) {
  return (
    <header className="w-full bg-red-700 text-white flex justify-end items-center px-6 py-3">
      {/* <h1 className="text-lg font-semibold">{title}</h1> */}
      <button className="bg-white text-black px-4 py-1 rounded shadow">
        Docente ⬇
      </button>
    </header>
  );
}
