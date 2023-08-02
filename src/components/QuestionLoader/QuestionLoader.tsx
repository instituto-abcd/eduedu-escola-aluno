import { ModelProps } from "./templates";
import { Model10 } from "./templates/Model10";
import { Model11 } from "./templates/Model11";
import { Model2 } from "./templates/Model2";
import { Model32 } from "./templates/Model32";
import { Model4 } from "./templates/Model4";
import { Model5 } from "./templates/Model5";
import { Model8 } from "./templates/Model8";

type QuestionLoaderProps = ModelProps;

export function QuestionLoader({ question, onAnswer }: QuestionLoaderProps) {
  const commonProps = {
    question,
    onAnswer,
  };

  switch (question.model) {
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

    default:
      return <h1>Question NULL</h1>;
  }
}
