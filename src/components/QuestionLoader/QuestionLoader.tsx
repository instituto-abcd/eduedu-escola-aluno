import { ModelProps } from "./templates";
import { Model10 } from "./templates/Model10";
import { Model11 } from "./templates/Model11";
import { Model2 } from "./templates/Model2";
import { Model32 } from "./templates/Model32";
import { Model4 } from "./templates/Model4";
import { Model5 } from "./templates/Model5";
import { Model8 } from "./templates/Model8";
import { QME2x2Audio } from "./templates/QME2x2Audio";
import { QME2x2Text } from "./templates/QME2x2Text";
import { QME2x2Text2 } from "./templates/QME2x2Text2";
import { QME2x2Video } from "./templates/QME2x2Video";
import { QME2x3Video } from "./templates/QMES2x3Video";
import { QMES5 } from "./templates/QMES5";
import { QORD3x2 } from "./templates/QORD3x2";

type QuestionLoaderProps = ModelProps;

export function QuestionLoader({
  question,
  answerCallback,
}: QuestionLoaderProps) {
  const commonProps: ModelProps = {
    question,
    answerCallback,
  };

  switch (question.model_id) {
    case "MODEL2":
      return <Model2 {...commonProps} />;
    case "MODEL4":
      return <Model4 {...commonProps} />;
    case "MODEL5":
      return <Model5 {...commonProps} />;
    case "MODEL8":
      return <Model8 {...commonProps} />;
    case "MODEL10":
      return <Model10 {...commonProps} />;
    case "MODEL11":
      return <Model11 {...commonProps} />;
    case "MODEL32":
      return <Model32 {...commonProps} />;

    // Orfãos
    case "QME2x2Audio":
      return <QME2x2Audio {...commonProps} />;
    case "QME2x2Text":
      return <QME2x2Text {...commonProps} />;
    case "QME2x2Text2":
      return <QME2x2Text2 {...commonProps} />;
    case "QMES5":
      return <QMES5 {...commonProps} />;
    case "QME2x2Video":
      return <QME2x2Video {...commonProps} />;
    case "QMES2x3Video":
      return <QME2x3Video {...commonProps} />;
    case "QORD3x2":
      return <QORD3x2 {...commonProps} />;

    default:
      return <h1>Question NULL</h1>;
  }
}
