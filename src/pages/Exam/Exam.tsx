import { Loader, Stack } from "@mantine/core";
import { QuestionLoader } from "~/components/QuestionLoader";
import { useGetFirstExamQuestion } from "~/api/student";
import { useState } from "react";
import { Question } from "~/api/exam";

export function ExamPage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const { isLoading } = useGetFirstExamQuestion({
    onSuccess: (question) => {
      if (!currentQuestion) {
        setCurrentQuestion(question);
      }
    },
  });

  function handleAnswer(
    answer:
      | Question
      | {
          examCompleted: true;
        }
  ) {
    if ("examCompleted" in answer) {
      console.log("EXAM COMPLETED");
    } else {
      setCurrentQuestion(answer);
    }
  }

  const _fakeQuestion = {
    orderedAnswer: false,
    level: 1,
    options: [
      {
        image_name: "",
        sound_url:
          "https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/exam%2Faudio%2Flct1a_alternativa1.mp3?alt=media&token=4847022b-40c6-458d-92da-53071e6303d6",
        image_url: null,
        sound_name: "lct1a_alternativa1.mp3",
        description: "1",
        position: 0,
        isCorrect: true,
      },
      {
        image_name: "",
        sound_url:
          "https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/exam%2Faudio%2Flct1a_alternativa2.mp3?alt=media&token=25c2e808-9ad9-49c4-9810-a4511d3672f3",
        image_url: null,
        sound_name: "lct1a_alternativa2.mp3",
        description: "2",
        position: 1,
        isCorrect: false,
      },
      {
        image_name: "",
        sound_url:
          "https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/exam%2Faudio%2Flct1a_alternativa3.mp3?alt=media&token=1e6228e8-adf2-46fb-ac45-dd3687349312",
        image_url: null,
        sound_name: "lct1a_alternativa3.mp3",
        description: "3",
        position: 2,
        isCorrect: false,
      },
      {
        image_name: "",
        sound_url:
          "https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/exam%2Faudio%2Flct1a_alternativa4.mp3?alt=media&token=6a5ebd98-6be8-483b-9517-ddaf13fd6985",
        image_url: null,
        sound_name: "lct1a_alternativa4.mp3",
        description: "4",
        position: 3,
        isCorrect: false,
      },
    ],
    description: "question",
    id: 65,
    axis_code: "LC",
    model_id: "QME2x2Audio",
    titles: [
      {
        file_url:
          "https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/exam%2Faudio%2Flct1a_enunciado.mp3?alt=media&token=e61b57d7-b924-4026-b322-1831ba706158",
        file_name: "lct1a_enunciado.mp3",
        description: "question",
        position: 1,
        placeholder: "",
        type: "AUDIO",
      },
      {
        file_url:
          "https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/exam%2Faudio%2Flct1ab2ab_texto.mp3?alt=media&token=c66e0d16-9513-4e4e-84ee-7b64d3b4c94b",
        file_name: "lct1ab2ab_texto.mp3",
        description: "text",
        position: 1,
        placeholder: "",
        type: "AUDIO",
      },
      {
        file_url:
          "https://firebasestorage.googleapis.com/v0/b/eduedu-escola-hub---stg.appspot.com/o/exam%2Faudio%2Flct1ab_intro.mp3?alt=media&token=559560f9-e29d-441c-9d89-f3ae8da73ddc",
        file_name: "lct1ab_intro.mp3",
        description: "text",
        position: 1,
        placeholder: "",
        type: "AUDIO",
      },
    ],
    category: "A",
    school_year: 0,
    order: 2,
  } as unknown as Question;

  return (
    <Stack
      align="center"
      justify="space-between"
      h="100%"
      style={{ position: "relative" }}
    >
      {isLoading && <Loader />}
      <Stack spacing={55} align="center" h="100%" w="100%" px={54}>
        {currentQuestion && (
          <QuestionLoader
            question={_fakeQuestion}
            answerCallback={handleAnswer}
          />
        )}
      </Stack>
    </Stack>
  );
}
