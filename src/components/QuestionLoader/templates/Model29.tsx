import { v4 as uuid } from "uuid";
import { produce } from "immer";
import { useEffect, useMemo, useState, useCallback } from "react";
import type { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";
import { TextTitle } from "~/components/question-components/TextTitle";
import { AudioContainer } from "~/components/AudioContainer";
import {
	DraggableCardSquare,
	DroppableCard,
} from "~/components/dnd";
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

type OptionWithId = QuestionOption & { id: string };

export function Model29({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const { textTitles, hasAudioTitle } = useQuestionHelper(question);

	/* Map id to options */
	const options = useMemo(
		() =>
			question.options.map((option) => ({
				...option,
				id: uuid(),
			})),
		[question],
	);

	const [answers, setAnswers] = useState<Array<OptionWithId | null>>(
		options.map(() => null),
	);

	const handleDrop = useCallback(function (
		item: OptionWithId | null,
		index: number,
	) {
		if (item === null) return;
		setAnswers((state) =>
			produce(state, (draft) => {
				draft[index] = item;
			}),
		);
	}, []);

	function handleClear(index: number) {
		setAnswers((state) =>
			produce(state, (draft) => {
				draft[index] = null;
			}),
		);
	}

	useEffect(() => {
		onAnswerChange(
			answers
				.filter((ans) => ans !== null)
				.map((item, index) => ({
					...item,
					positionAnswer: index,
				})) as OptionWithId[],
		);
	}, [answers]);

	const conditions = useMemo(
		() => [answers.every((ans) => ans !== null)],
		[answers],
	);

	useEffect(() => {
		onConditionsChange(conditions);
	}, [conditions]);

	/* Drag Handlers */
	const [activeDrag, setActiveDrag] = useState<OptionWithId | null>(null);

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
			const option = (e.active.data.current?.option as OptionWithId) ?? null;
			handleDrop(option, targetIndex);
		}
	}

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

	return (
		<DndContext
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			sensors={sensors}
		>
			{hasAudioTitle && <AudioContainer question={question} />}

			<div className="flex flex-col lg:flex-row justify-evenly items-center size-full max-h-[90vh] my-auto gap-4">

				<div>
					{textTitles[0]?.description && (
						<TextTitle text={textTitles[0].description} />
					)}
				</div>

				<div className="flex flex-col items-center justify-between size-full gap-4 lg:h-auto lg:gap-8">
          <div className="grid grid-cols-4 gap-4 max-w-screen-md w-full">
					{answers.map((answer, inx) => (
						<DroppableCard
							key={inx}
							id={inx}
							className="bg-[#f8f6f2] flex items-center justify-center w-[20vw] md:w-auto shadow-card"
							replaceWith={
								answer && (
									<DraggableCardSquare
										id={(answer as QuestionOption & { id: string }).id}
										optionItem={answer}
										image={answers[inx]?.image_url}
										text={answers[inx]?.description}
										disabled
										className="w-[20vw] md:w-auto aspect-auto max-w-none max-h-none md:max-w-none md:max-h-none"
										onClear={() => handleClear(inx)}
										debug={{ skipDebug: true }}
									/>
								)
							}
						>
							<p className="text-[#DEDEDE] font-black text-5xl">{inx + 1}</p>
						</DroppableCard>
					))}
				</div>

				<div className="grid grid-cols-2 size-full gap-4 max-w-screen-md max-h-[340px]">
					{options.map((option) => (
						<DraggableCardSquare
							id={option.id}
							key={option.id}
							optionItem={option}
							image={option.image_url}
							text={option.description}
							className="!max-w-none !max-h-none aspect-auto"
							hidden={answers.some((ans) => ans?.id === option.id)}
							debug={{ debugProperty: "position" }}
						/>
					))}
				</div></div>
			</div>

			<DragOverlay>
				{activeDrag && (
					<DraggableCardSquare
						optionItem={activeDrag}
						image={activeDrag.image_url}
						text={activeDrag.description}
						className="size-full max-w-none max-h-none aspect-auto"
						debug={{ debugProperty: "position" }}
						id={uuid()}
					/>
				)}
			</DragOverlay>
		</DndContext>
	);
}
