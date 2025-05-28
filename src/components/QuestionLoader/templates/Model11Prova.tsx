import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { AudioContainer } from "~/components/AudioContainer";
import { TextTitle } from "~/components/question-components/TextTitle";
import { ImageTitle } from "~/components/question-components";
import { DraggableLetter, DroppableLetter } from "~/components/dnd";
import { cx } from "~/utils/cx";

export function Model11Prova({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const {
		getRule,

		textTitles,
		imageTitles,

		hasAudioTitle,
	} = useQuestionHelper(question);

	const [answer, setAnswer] = useState<Array<QuestionOption | null>>([null]);

	function handleAnswer(ans: QuestionOption | null, inx?: number) {
		if (Number.isInteger(inx)) {
			setAnswer((state) =>
				produce(state, (draft) => {
					draft[inx!] = ans ? { ...ans, positionAnswer: inx } : null;
				}),
			);
		} else if (ans && typeof inx === "undefined") {
			setAnswer([ans]);
		} else {
			const initialSlots = new Array<null>(slotsQty).fill(null);
			setAnswer(initialSlots);
		}
	}

	/*
	 *    Helpers para o título da questão
	 *    Referente ao texto que apresenta a questão (enunciado)
	 */
	const questionTitle = textTitles[0]?.description.split("/")[0] ?? "";
	const hasTitle = !!questionTitle;

	/*
	 *    Helpers para o texto de completar
	 */
	const textToComplete = getTextToComplete(textTitles);
	const shouldRepeatAnswer = checkShouldRepeatAnswer();

	function checkShouldRepeatAnswer() {
		const answerRule = getRule("answers");
		if (!answerRule) return false;

		const answers = answerRule.value.split(",");
		if (answers.length === 1) return false;
		if (new Set(answers).size !== answers.length) return true;
		return false;
	}

	function getTextToComplete(titles: QuestionTitle[]) {
		return titles.find(
			(title) =>
				title.description?.includes("Complete") ||
				title.description?.includes("complete"),
		) as QuestionTitle;
	}

	/* 🧙 */
	const slotsQty = textToComplete
		? textToComplete.description.split(/_./g).filter((w) => w !== "").length -
				1 <=
			0
			? 1
			: textToComplete.description.split(/_./g).filter((w) => w !== "").length -
				1
		: 1;

	useEffect(() => {
		const initialSlots = new Array<null>(slotsQty).fill(null);
		setAnswer(initialSlots);
	}, [question]);

	useEffect(() => {
		onAnswerChange(answer.filter((item) => item !== null));
	}, [answer]);

	const conditions = useMemo(() => [!answer.includes(null)], [answer]);

	useEffect(() => {
		onConditionsChange(conditions);
	}, [conditions]);

	/* Drag Handlers */
	const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

	function onDragStart(e: DragStartEvent) {
		if (e.active.data.current) {
			const option = e.active.data.current.option;
			setActiveDrag(() => option);
		}
	}

	function onDragEnd(e: DragEndEvent) {
		setActiveDrag(null);
		if (e.over) {
			const targetIndex = Number(e.over.id);
			const option = (e.active.data.current?.option as QuestionOption) ?? null;
			handleAnswer(option, targetIndex);
		}
	}

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

	/* Elements */

	const segments = useMemo(() => {
		const arr = transformString(textToComplete.description.split("/")[1]);

		return arr.map((seg, inx) => {
			if (typeof seg === "string") {
				return (
					<p key={inx} className="text-text font-black leading-none text-4xl">
						{seg}
					</p>
				);
			} else
				return (
					<DroppableLetter
						id={seg}
						key={inx}
						size={2}
						replaceWith={
							!!answer[seg] && (
								<DraggableLetter
									optionItem={answer[seg]}
									id={seg}
									disabled
									compact
									onClear={() => handleAnswer(null, seg)}
								/>
							)
						}
					/>
				);
		});
	}, [textToComplete, answer]);

	return (
		<DndContext
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			sensors={sensors}
		>
			{hasAudioTitle && <AudioContainer question={question} />}

			{/* Enunciado */}
			{hasTitle && <TextTitle text={questionTitle} />}

			<div className="flex flex-col lg:flex-row items-center justify-evenly gap-6 size-full">
				<ImageTitle titles={imageTitles} />

				<div className="flex flex-col gap-6 items-center lg:max-w-[50vw]">
					{/* Text to complete */}
					<div className="p-4 flex items-center justify-center gap-2 flex-wrap w-full max-h-[25vh] md:max-h-[40vh] overflow-y-auto">
						{...segments}
					</div>

					{/* Alternativas */}
					<div
						className={cx("grid grid-cols-2 gap-5", {
							["md:grid-cols-3"]: question.options.length % 2 !== 0,
						})}
					>
						{question.options.map((option) => (
							<DraggableLetter
								optionItem={option}
								id={option.id}
								key={option.id}
								className={cx({
									["last:col-span-2 md:last:col-span-1 last:w-min"]:
										question.options.length % 2 !== 0,
								})}
								hidden={
									!shouldRepeatAnswer &&
									answer.some(
										(item) =>
											(item as QuestionOption & { id: string })?.id ===
											option.id,
									)
								}
							/>
						))}
					</div>
				</div>
			</div>

			<DragOverlay>
				<DraggableLetter optionItem={activeDrag!} id={542321} />
			</DragOverlay>
		</DndContext>
	);
}

/*
 * Helper for splitting strings
 * ex (question id "0b47b82c-5cc6-4a68-9657-d87c2143399c"):
 * "te _ oura" -> ["te", 0, "oura"]
 * 0 is the position of the slot (underscore) related to other slots
 */

function transformString(input: string): (string | number)[] {
	let underscoreIndex = 0;
	return input
		.split(/(_+)/)
		.filter(Boolean)
		.flatMap<string | number>((segment) =>
			segment.startsWith("_")
				? [underscoreIndex++]
				: segment.trim().split(/\s+/),
		);
}
