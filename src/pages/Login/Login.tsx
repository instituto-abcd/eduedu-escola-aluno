import { useState } from "react";
import { ProfileSelection } from "./ProfileSelection";
import { GradeSelection } from "./GradeSelection";
import { ClassSelection } from "./ClassSelection";
import { useSchoolClassGetAll, useSchoolGradeCount } from "~/api/school-class";
import { PasswordSelection } from "./PasswordSelection";
import { useGetAccessCodes } from "~/api/user";
import { useStudent } from "~/stores/student";
import { StudentSelection } from "./StudentSelection";
import { useStudentGetAll, useStudentReserve } from "~/api/student";
import { AudioSettings } from "./AudioSettings";
import { useNavigate } from "react-router-dom";
import { PATH } from "~/constants/path";
import { LoginLoader } from "./LoginLoader";

enum LOGIN_STEP {
  PROFILE,
  GRADE,
  CLASS,
  PASSWORD,
  STUDENT,
  PREFERENCES,
}

export function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<LOGIN_STEP>(LOGIN_STEP.PROFILE);
  const studentState = useStudent();

  useSchoolGradeCount();
  useSchoolClassGetAll();
  useGetAccessCodes(studentState.schoolClassId, {
    enabled: !!studentState.schoolClassId,
  });
  useStudentGetAll(
    { schoolClassId: studentState.schoolClassId, "page-size": 9999 },
    { enabled: !!studentState.schoolClassId },
  );

  const next = () => {
    if (step === LOGIN_STEP.STUDENT) {
      if (studentState.firstAccess) {
        navigate(PATH.INTRO);
        return;
      }

      if (!studentState.examPerformed) {
        navigate(PATH.EXAM);
        return;
      }
      navigate(PATH.DASHBOARD);
      return;
    }

    setStep((s) => {
      return s + 1;
    });
  };

  const back = () =>
    setStep((s) => {
      if (s === LOGIN_STEP.PROFILE) return LOGIN_STEP.PROFILE;
      return s - 1;
    });

  switch (step) {
    case LOGIN_STEP.PROFILE:
      return <ProfileSelection onNext={next} />;
    case LOGIN_STEP.GRADE:
      return <GradeSelection onNext={next} onBack={back} />;
    case LOGIN_STEP.CLASS:
      return <ClassSelection onNext={next} onBack={back} />;
    case LOGIN_STEP.PASSWORD:
      return <PasswordSelection onNext={next} onBack={back} />;
    case LOGIN_STEP.STUDENT:
      return <StudentSelection onNext={next} onBack={back} />;
    // case LOGIN_STEP.PREFERENCES:
    //   return <AudioSettings onNext={next} onBack={back} />;

    default:
      return <LoginLoader />;
  }
}
