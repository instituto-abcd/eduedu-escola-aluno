import { useStudent } from "~/stores/student";

const VERSION: string = import.meta.env.VITE_APP_VERSION;

export function Footer() {
  const schoolName = useStudent((s) => s.schoolClassName);
  return (
    <div className="bg-[#509BCA] text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <b>{schoolName}</b>
          <div className="flex items-center gap-3">
            <span>Desenvolvido por EduEdu+</span>
            &mdash;
            <span>{VERSION ? `Versão ${VERSION}` : "v1.0.0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
