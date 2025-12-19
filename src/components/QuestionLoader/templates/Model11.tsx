import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import type { QuestionOption, QuestionTitle } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { TextTitle } from "~/components/question-components/TextTitle";
import { DroppableLetter, DraggableLetter } from "~/components/dnd";
import { ImageTitle } from "~/components/question-components";
import { cx } from "~/utils/cx";

// TODO: possibly use nRows rule for word splitting

export function Model11({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const { getRule, imageTitles, textTitles, hasAudioTitle } =
		useQuestionHelper(question);

	const [answer, setAnswer] = useState<Array<QuestionOption | null>>([null]);
	function handleAnswer(ans: QuestionOption | null, inx?: number) {
		if (Number.isInteger(inx)) {
			setAnswer((state) =>
				produce(state, (draft) => {
					draft[inx as number] = ans ? { ...ans, positionAnswer: inx } : null;
				}),
			);
		} else if (ans && typeof inx === "undefined") {
			setAnswer([ans]);
		} else {
			const initialSlots = new Array<null>(slotsQty).fill(null);
			setAnswer(initialSlots);
		}
	}
	const answerRule = getRule("answers");

	/*
	 *    Helpers para o título da questão
	 *    Referente ao texto que apresenta a questão (enunciado)
	 */
	const questionTitle = textTitles.filter((title) => {
		const conditions = [
			!title.placeholder?.startsWith("Texto a ser preenchido") ||
				!title.placeholder?.includes("preenchido") ||
				!title.placeholder?.includes("preencher"),
			title.description !== "",
		];

		return conditions.every((condition) => condition === true);
	})[0];
	const hasTitle = !!questionTitle;

	/*
	 *    Helpers para o texto de completar
	 */
	const textToComplete = getTextToComplete(textTitles);
	const shouldRepeatAnswer = checkShouldRepeatAnswer();

	function checkShouldRepeatAnswer() {
		if (!answerRule) return false;

		const answers = answerRule.value.split(",");
		if (answers.length === 1) return false;
		if (new Set(answers).size !== answers.length) return true;
		return false;
	}

	function getTextToComplete(titles: QuestionTitle[]) {
		return titles.find(
			(title) =>
				title.placeholder?.startsWith("Texto a ser preenchido") ||
				title.placeholder?.includes("preenchido") ||
				title.placeholder?.includes("preencher"),
		) as QuestionTitle;
	}

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

	const segments = useMemo(() => {
		const arr = transformString(textToComplete.description.replace(/\\n/g, ""));

		return arr.map((seg, inx) => {
			if (typeof seg === "string") {
				return (
					<p
						key={inx}
						className="text-text font-black leading-none text-2xl md:text-4xl"
					>
						{seg}
					</p>
				);
			} else
				return (
					<DroppableLetter
						id={seg}
						key={inx}
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
			{hasTitle && !questionTitle.description?.includes("_") && (
				<TextTitle text={questionTitle.description as string} />
			)}

			<div className="flex flex-col lg:flex-row items-center justify-evenly gap-6 size-full">
				<ImageTitle titles={imageTitles} />

				<div className="flex flex-col gap-6 items-center w-full lg:max-w-[50vw]">
					{/* Text to complete */}
					<div className="p-4 flex items-center justify-center gap-2 flex-wrap w-full max-h-[25vh] md:max-h-[40vh] overflow-y-auto">
						{...segments}
					</div>

					{/* Alternativas */}
					<div
						className={cx("grid grid-cols-2 gap-5", {
							"md:grid-cols-3": question.options.length % 2 !== 0,
						})}
					>
						{question.options.map((option) => (
							<DraggableLetter
								optionItem={option}
								id={option.id}
								key={option.id}
								className={cx({
									"last:col-span-2 md:last:col-span-1 last:w-min":
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
