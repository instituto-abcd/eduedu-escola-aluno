import { useEffect, useMemo, useState } from "react";
import { type QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { ReadButton } from "~/components/ReadButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import { TEXT_PLACEHOLDERS } from "~/constants/text-placeholders";
import { OptionButton } from "~/components/OptionButton";
import { ImageTitle } from "~/components/question-components";
import { TextTitle } from "~/components/question-components/TextTitle";

export function Model32({
	question,
	auxQuestion,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const {
		textTitles,
		imageTitles,
		hasAudioTitle,
		hasImageTitle,
		hasTextTitle,
	} = useQuestionHelper(question);
	const [answer, setAnswer] = useState<QuestionOption | null>(null);

	useEffect(() => {
		setAnswer(null);
	}, [question]);

	useEffect(() => {
		onAnswerChange(answer ? [answer] : []);
	}, [answer]);

	const conditions = useMemo(() => [Boolean(answer)], [answer]);

	useEffect(() => {
		onConditionsChange(conditions);
	}, [conditions]);

	const historia =
		textTitles.find(
			(title) => title.classification === QuestionTitleClassification.HISTORIA,
		)?.description ?? textTitles[0]?.description;

	// Na prova, a instrução geral da questão ("Leia a fábula e responda à
	// pergunta") vem em um título de texto sem classificação. Os slots de
	// história e enunciado já estão ocupados pelo texto-base e pela pergunta,
	// então sem um slot próprio essa instrução nunca chega à tela.
	const instrucao = textTitles.find(
		(title) => !title.classification && title.description !== historia,
	)?.description;

	const textSections: Record<string, undefined | string> = {
		enunciado: textTitles.find(
			(title) => title.classification === QuestionTitleClassification.ENUNCIADO,
		)?.description,

		campo:
			textTitles.find(
				(title) =>
					title.placeholder?.includes(TEXT_PLACEHOLDERS.CAMPO) ||
					(!title.placeholder && title.description),
			)?.description ?? "",

		historia,

		enunciado_alt: textTitles.find(
			(title) =>
				title.placeholder?.includes(TEXT_PLACEHOLDERS.ENUNCIADO) ||
				title.placeholder?.includes(TEXT_PLACEHOLDERS.QUEM_DISSE),
		)?.description,

		instrucao,
	} as const;

	const isPlanet =
		question.planet_id !== "" && typeof question.planet_id === "string";

	return (
		<>
			<div className="md:min-h-14 md:self-start">
				{(hasAudioTitle || auxQuestion) && (
					<AudioContainer question={question}>
						{auxQuestion && <ReadButton question={auxQuestion} />}
					</AudioContainer>
				)}
			</div>

			<div className="size-full lg:max-w-screen-xl gap-4 md:gap-12 flex flex-col md:flex-row justify-evenly items-center">
				{(hasImageTitle || hasTextTitle) && (
					<div className="size-full lg:max-w-screen-md flex flex-col justify-evenly items-center max-h-[30vh] md:max-h-[80vh] overflow-auto">
						{!isPlanet && textSections.instrucao && (
							<TextTitle
								text={textSections.instrucao}
								className="xl:text-2xl"
							/>
						)}

						{hasImageTitle && <ImageTitle titles={imageTitles} />}

						{isPlanet && textSections.campo && (
							<TextTitle text={textSections.campo} className="xl:text-2xl" />
						)}

						{!isPlanet && textSections.historia && (
							<TextTitle text={textSections.historia} className="xl:text-2xl" />
						)}

						{isPlanet && textSections.enunciado_alt && (
							<TextTitle
								text={textSections.enunciado_alt}
								className="xl:text-2xl"
							/>
						)}
					</div>
				)}

				<div className="w-full max-w-[500px] flex flex-col gap-4 container-inline">
					{textSections.enunciado && (
						<TextTitle
							text={textSections.enunciado}
							className="text-2xl font-bold"
						/>
					)}

					{question.options.map((option) => (
						<OptionButton
							key={option.id}
							onClick={() =>
								setAnswer({
									...option,
									positionAnswer: question.orderedAnswer
										? option.position
										: undefined,
								} as QuestionOption)
							}
							data-selected={answer?.id === option.id}
							option={option}
							debug={{ size: 10 }}
							className="lg:max-h-36 w-full p-2 lg:text-[4cqw] xl:text-[4cqw]"
						>
							{option.description}
						</OptionButton>
					))}
				</div>
			</div>
		</>
	);
}
