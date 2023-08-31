import { ModelProps } from "./templates";
import { Model10 } from "./templates/Model10";
import { Model11 } from "./templates/Model11";
import { Model2 } from "./templates/Model2";
import { Model2Video } from "./templates/Model2Video";
import { Model32 } from "./templates/Model32";
import { Model4 } from "./templates/Model4";
import { Model5 } from "./templates/Model5";
import { Model8 } from "./templates/Model8";
import { Model12 } from "./templates/Model12";
import { Model13 } from "./templates/Model13";
import { Model14 } from "./templates/Model14";
import { Model15 } from "./templates/Model15";
import { Model16 } from "./templates/Model16";
import { Model18 } from "./templates/Model18";
import { Model19 } from "./templates/Model19";
import { Model20 } from "./templates/Model20";
import { Model21 } from "./templates/Model21";
import { Model22 } from "./templates/Model22";
import { Model24 } from "./templates/Model24";
import { Model25 } from "./templates/Model25";
import { Model26 } from "./templates/Model26";
import { Model27 } from "./templates/Model27";
import { Model28 } from "./templates/Model28";
import { Model29 } from "./templates/Model29";
import { Model30 } from "./templates/Model30";
import { Model31 } from "./templates/Model31";
import { Model33 } from "./templates/Model33";
import { QME2x2Audio } from "./templates/QME2x2Audio";
import { QME2x2Text } from "./templates/QME2x2Text";
import { QME2x2Text2 } from "./templates/QME2x2Text2";
import { QME2x2Video } from "./templates/QME2x2Video";
import { QME2x3Video } from "./templates/QMES2x3Video";
import { QMES5 } from "./templates/QMES5";
import { QORD3x2 } from "./templates/QORD3x2";
import { Model8Prova } from "./templates/Model8Prova";
import { Model10Prova } from "./templates/Model10Prova";

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
    case "MODEL2-VIDEO":
      return <Model2Video {...commonProps} />;
    case "MODEL4":
      return <Model4 {...commonProps} />;
    case "MODEL5":
      return <Model5 {...commonProps} />;
    case "MODEL8":
      return <Model8 {...commonProps} />;
    case "MODEL8-PROVA":
      return <Model8Prova {...commonProps} />;
    case "MODEL10":
      return <Model10 {...commonProps} />;
    case "MODEL10-PROVA":
      return <Model10Prova {...commonProps} />;
    case "MODEL11":
      return <Model11 {...commonProps} />;
    case "MODEL12":
      return <Model12 {...commonProps} />;
    case "MODEL13":
      return <Model13 {...commonProps} />;
    case "MODEL14":
      return <Model14 {...commonProps} />;
    case "MODEL15":
      return <Model15 {...commonProps} />;
    case "MODEL16":
      return <Model16 {...commonProps} />;
    case "MODEL18":
      return <Model18 {...commonProps} />;
    case "MODEL19":
      return <Model19 {...commonProps} />;
    case "MODEL20":
      return <Model20 {...commonProps} />;
    case "MODEL21":
      return <Model21 {...commonProps} />;
    case "MODEL22":
      return <Model22 {...commonProps} />;
    case "MODEL24":
      return <Model24 {...commonProps} />;
    case "MODEL25":
      return <Model25 {...commonProps} />;
    case "MODEL26":
      return <Model26 {...commonProps} />;
    case "MODEL27":
      return <Model27 {...commonProps} />;
    case "MODEL28":
      return <Model28 {...commonProps} />;
    case "MODEL29":
      return <Model29 {...commonProps} />;
    case "MODEL30":
      return <Model30 {...commonProps} />;
    case "MODEL31":
      return <Model31 {...commonProps} />;
    case "MODEL33":
      return <Model33 {...commonProps} />;
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
