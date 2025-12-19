import logo from "~/assets/logos/eduedu-azul.svg";
import { useStudent } from "~/stores/student";
import { SCHOOL_GRADE, SCHOOL_PERIOD } from "../../constants";
import { Logout } from "../Logout";
import { useEffect, useState } from "react";
import { cx } from "~/utils/cx";
import { IconChevronDown } from "@tabler/icons-react";

type Props = {
  inView: boolean;
  onMouseLeave: () => void;
};

export function Navbar({ inView, onMouseLeave }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const student = useStudent();
  const links = [
    { label: "Aluno:", value: student?.name },
    { label: "Matrícula:", value: student?.registry },
    { label: "Série:", value: student?.schoolClassName },
    { label: "Turma:", value: SCHOOL_GRADE[student?.schoolGrade] ?? "" },
    { label: "Período:", value: SCHOOL_PERIOD[student?.schoolPeriod] ?? "" },
  ] as const;

  useEffect(() => {
    if (inView) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [inView, onMouseLeave]);

  return (
    <header
      className="w-full"
      onMouseLeave={onMouseLeave}
    >
      <div
        className={cx(
          "flex items-center justify-evenly md:px-4 px-2 absolute z-50 bg-white shadow-md w-full max-w-[100vw] h-[50px] transition-transform",
          { "translate-y-[-100%]": !isOpen }
        )}
      >
        <img
          src={logo}
          className="hidden lg:block h-[90%]"
          alt="EduEdu Escola"
        />

        <div className="flex items-center justify-center space-x-8">
          {links.map((link, i) => (
            <div
              key={i}
              className={cx("flex items-center md:space-x-2 space-x-1 nowrap", {
                "hidden md:flex":
                  link.label !== "Aluno:" && link.label !== "Turma:",
              })}
            >
              <span className="hidden lg:block text-gray-600 font-semibold text-sm no-underline">
                {link.label}
              </span>

              <span className={"text-sm"}>{link.value}</span>
            </div>
          ))}
        </div>
        {student.id && <Logout />}
        <button
          className={cx(
            "absolute bg-white h-[30px] w-[50px] z-[900] top-[30px] right-[10%] flex items-center justify-center shadow-md rounded-b-[18px] transition-transform",
            {
              "translate-y-[20px]": !isOpen,
              "translate-y-[18px]": isOpen,
            }
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <IconChevronDown
            size={36}
            color="#000"
            className={cx("transition-transform", {
              "rotate-180": isOpen,
            })}
          />
        </button>
      </div>
    </header>
  );
}
