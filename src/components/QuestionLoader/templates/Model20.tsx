import { useEffect, useMemo, useState } from "react";
import type { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";
import { AudioContainer } from "~/components/AudioContainer";
import { ImageTitle } from "~/components/question-components";
import { DraggableLetter } from "~/components/dnd";
import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	MouseSensor,
	TouchSensor,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { cx } from "~/utils/cx";
import { produce } from "immer";

export function Model20({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const { imageTitles } = useQuestionHelper(question);
	const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
		question.options.map(() => null),
	);

	function setItem(option: QuestionOption) {
		setAnswers((state) =>
			produce(state, (draft) => {
				const index = draft.findIndex((item) => item === null);
				if (index === -1) return draft;

				draft[index] = option;

				return draft;
			}),
		);
	}

	function clearItem(index: number) {
		setAnswers((state) =>
			produce(state, (draft) => {
				draft = draft.filter((_, inx) => inx !== index);
				draft.push(null);

				return draft;
			}),
		);
	}

	useEffect(() => {
		setAnswers(question.options.map(() => null));
	}, [question]);

	useEffect(() => {
		onAnswerChange(
			answers
				.filter((item) => item !== null)
				.map((item, index) => ({
					...item,
					positionAnswer: index,
				})) as QuestionOption[],
		);
	}, [answers]);

	const conditions = useMemo(
		() => [answers.every((item) => item !== null)],
		[answers],
	);

	useEffect(() => {
		onConditionsChange(conditions);
	}, [conditions]);

	/* Drag Handlers */
	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
	const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

	function onDragStart(e: DragStartEvent) {
		if (e.active.data.current) {
			const option = e.active.data.current.option;
			if (!option.sound?.playing()) {
				option.sound?.play();
			}
			setActiveDrag(() => option);
		}
	}

	function onDragEnd(e: DragEndEvent) {
		setActiveDrag(null);
		if (e.over) {
			const option = (e.active.data.current?.option as QuestionOption) ?? null;
			setItem(option);
		}
	}

	return (
		<DndContext
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			sensors={sensors}
		>
			<AudioContainer question={question} />

			<div className="flex flex-col items-center h-full lg:w-full lg:max-w-5xl justify-evenly">
				<div className="flex flex-col justify-center lg:flex-row lg:w-full items-center gap-8">
					<ImageTitle titles={imageTitles} containerClasses="lg:w-2/3" />

					<DropArea
						answers={answers.filter(Boolean) as QuestionOption[]}
						onClear={clearItem}
					/>
				</div>

				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-center gap-4 flex-wrap max-w-3xl">
						{question.options.map((option, index) => (
							<DraggableLetter
								id={index}
								key={index}
								optionItem={option}
								className="!w-auto !px-2"
								hidden={
									!!answers.find(
										(item) => JSON.stringify(item) === JSON.stringify(option),
									)
								}
							/>
						))}
					</div>
				</div>
			</div>
			<DragOverlay>
				{activeDrag && (
					<DraggableLetter id={32145} optionItem={activeDrag} disabled />
				)}
			</DragOverlay>
		</DndContext>
	);
}

function DropArea({
	answers,
	onClear,
}: {
	answers: QuestionOption[];
	onClear: (inx: number) => void;
}) {
	const { setNodeRef, isOver } = useDroppable({ id: 1 });

	return (
		<div
			className={cx(
				"w-full rounded-[45px] min-h-[155px] border-2 border-stone-200 transition-colors duration-300",
				"flex items-center justify-start flex-wrap px-4 gap-2",
				{
					"border-green-300": isOver,
				},
			)}
			ref={setNodeRef}
		>
			{answers.map((ans, inx) => (
				<DraggableLetter
					optionItem={ans}
					id={ans.id}
					key={ans.id}
					className="!w-auto !px-2"
					onClear={() => onClear(inx)}
					disabled
				/>
			))}
		</div>
	);
}
