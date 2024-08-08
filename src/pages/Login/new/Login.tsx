import { useState } from "react";
import { ProfileSelection } from "./ProfileSelection";
import { GradeSelection } from "./GradeSelection";

enum LOGIN_STEP {
  PROFILE,
  GRADE,
  CLASS,
  PASSWORD,
}

export function LoginPage() {
  const [step, setStep] = useState<LOGIN_STEP>(LOGIN_STEP.PROFILE);

  const next = () =>
    setStep((s) => {
      if (s === LOGIN_STEP.PASSWORD) return LOGIN_STEP.PASSWORD;
      return s + 1;
    });

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
    default:
      return (
        <>
          <h1>hello?</h1>
        </>
      );
  }
}
