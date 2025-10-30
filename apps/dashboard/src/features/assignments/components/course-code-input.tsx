interface CourseCodeInputProps {
  courseCode: string;
}

export default function CourseCodeInput({ courseCode }: CourseCodeInputProps) {
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-800 mb-2">
        3. Código de Asignatura
      </label>
      <input
        type="text"
        value={courseCode}
        readOnly
        placeholder="Selecciona una asignatura"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700"
      />
    </div>
  );
}
