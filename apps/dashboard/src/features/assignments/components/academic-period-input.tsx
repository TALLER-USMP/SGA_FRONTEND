import { getSemesterName } from "../../../common/utils/academic-period";

interface AcademicPeriodInputProps {
  academicPeriod: string;
}

export default function AcademicPeriodInput({
  academicPeriod,
}: AcademicPeriodInputProps) {
  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-800 mb-2">
        4. Periodo Académico
      </label>
      <input
        type="text"
        value={academicPeriod}
        readOnly
        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 font-medium"
      />
      <p className="text-sm text-gray-500 mt-1">
        {academicPeriod && getSemesterName(academicPeriod)} - Periodo generado
        automáticamente según el ciclo académico actual de la USMP
      </p>
    </div>
  );
}
