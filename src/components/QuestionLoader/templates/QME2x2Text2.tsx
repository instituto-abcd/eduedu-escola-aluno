import { Question } from "~/api/exam";
import { TextOptionButton } from "~/components/OptionButton";

export function QME2x2Text2({ question }: { question: Question }) {
  const title = "Leia a fábula e responda à pergunta.";
  const subtitle = "A raposa e a uva";
  const text =
    "Era uma vez uma raposa que estava sem comer havia muitos dias. Ela foi passear no pomar e encontrou um lindo cacho de uvas. O cacho estava no alto de uma parreira, e a raposa decidiu se esforçar para apanhá-lo. Ela deu muitos pulos para tentar alcançar, mas, depois de muitas tentativas, ficou exausta e continuava faminta. Então, a raposa deu de ombros e resolveu ir embora.";

  const imgUrl = "https://place-hold.it/102";

  const qtitle = "Por que a raposa disse que as uvas estavam verdes?";

  return (
    <div className="flex flex-col items-center w-full">
      <h1
        className="text-gray-700 font-medium mb-6"
        style={{ fontSize: "2.5vh" }}
      >
        {title}
      </h1>

      <div className="flex w-full max-w-5xl gap-[75px]">
        <div
          className="overflow-y-auto p-5 flex flex-col items-center"
          style={{ height: 380 }}
        >
          <h2
            className="text-gray-700 font-medium mb-4 text-center"
            style={{ fontSize: "2.5vh" }}
          >
            {subtitle}
          </h2>
          <p
            className="text-gray-700 font-normal mb-6 text-center"
            style={{ fontSize: 20 }}
          >
            {text}
          </p>
          <img
            src={imgUrl}
            alt="Imagem"
            width={102}
            height="auto"
          />
        </div>

        <div className="flex flex-col items-center p-5">
          <h2
            className="text-gray-700 font-medium mb-6 text-center"
            style={{ fontSize: "2.5vh" }}
          >
            {qtitle}
          </h2>
          <div className="flex flex-col gap-4 w-full max-w-md">
            {question.options.map((option, index) => (
              <TextOptionButton
                key={index}
                option={option}
              >
                {option.description}
              </TextOptionButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
