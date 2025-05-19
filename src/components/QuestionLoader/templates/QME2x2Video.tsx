import { IconVolume } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { VideoTitle } from "~/components/question-components";
import type { ModelProps } from ".";
import type { QuestionOption } from "~/api/exam";

export function QME2x2Video({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const [answer, setAnswer] = useState<QuestionOption | null>(null);
	const { videoTitles } = useQuestionHelper(question);

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
		<div className="size-full flex flex-col lg:flex-row items-center justify-evenly">
			<VideoTitle titles={videoTitles} autoPlay />

			<div className="grid grid-cols-2 max-w-screen-md gap-4 min-w-[292px]">
				{question.options.map((option) => (
					<OptionButton
						key={option.position}
						data-selected={JSON.stringify(answer) === JSON.stringify(option)}
						onClick={() => setAnswer(option)}
						option={option}
					>
						{option.image_url && (
							<img
								src={option.image_url}
								alt={option.description}
								className="w-full object-cover"
							/>
						)}
						{!option.image_url && option.sound_url && <IconVolume size={80} />}
						{!option.image_url && !option.sound_url && option.description && (
							<p className="text-text font-black">{option.description}</p>
						)}
					</OptionButton>
				))}
			</div>
		</div>
	);
}
