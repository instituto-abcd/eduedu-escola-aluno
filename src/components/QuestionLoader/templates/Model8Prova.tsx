import { IconVolume } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import type { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton, TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";
import { TextTitle } from "~/components/question-components/TextTitle";
import { ImageTitle, VideoTitle } from "~/components/question-components";

const showTextOptionExceptions = [35, 36, 79, 80, 87, 88];

export function Model8Prova({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const { audioTitles, textTitles, imageTitles, videoTitles, hasAudioTitle } =
		useQuestionHelper(question);
	const [answer, setAnswer] = useState<QuestionOption | null>(null);

	const showAudioIndicatorOnly = !showTextOptionExceptions.includes(
		question.id,
	);

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

	return (
		<>
			{hasAudioTitle &&
				audioTitles.map((title, inx) => (
					<AudioButton
						index={inx}
						key={inx}
						src={title.file_url ?? ""}
						autoPlay
					/>
				))}

			<div className="flex flex-col md:flex-row size-full items-center justify-evenly">
				<div className="flex flex-col items-center gap-4 max-w-[500px]">
					{textTitles.map((title, inx) => (
						<TextTitle text={title.description} key={inx} />
					))}

					<ImageTitle titles={imageTitles} />
					<VideoTitle titles={videoTitles} />
				</div>

				<div className="grid grid-cols-2 gap-4 min-w-[292px] max-w-screen-md">
					{showAudioIndicatorOnly &&
						question.options.map((option, inx) => (
							<OptionButton
								key={inx}
								onClick={() => setAnswer(option)}
								data-selected={answer?.position === option.position}
								option={option}
								debug={{ size: 12 }}
							>
								<IconVolume size={boardW(62)} />
								<p className="text-text font-black text-xl">{inx + 1}</p>
							</OptionButton>
						))}

					{!showAudioIndicatorOnly &&
						question.options.map((option, inx) => (
							<TextOptionButton
								key={inx}
								onClick={() => setAnswer(option)}
								data-selected={answer?.position === option.position}
								option={option}
								debug={{ size: 12 }}
							>
								<p
									className="text-text font-black text-base"
									style={{
										wordWrap: "break-word",
										wordBreak: "break-word",
									}}
								>
									{option.description}
								</p>
							</TextOptionButton>
						))}
				</div>
			</div>
		</>
	);
}
