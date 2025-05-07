import { v4 as uuid } from "uuid";
import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import type { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";
import { TextTitle } from "~/components/question-components/TextTitle";
import { AudioContainer } from "~/components/AudioContainer";
import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	MouseSensor,
	TouchSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { cx } from "~/utils/cx";
import { IconX } from "@tabler/icons-react";

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

	const handleDrop = (item: OptionWithId | null, index: number) => {
		if (item === null) return;
		setAnswers((state) =>
			produce(state, (draft) => {
				draft[index] = item;
			}),
		);
	};

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

			<div className="flex flex-col lg:flex-row justify-evenly items-center size-full max-h-[90vh] max-w-screen-xl my-auto gap-4">
				<div>
					{textTitles[0]?.description && (
						<TextTitle text={textTitles[0].description} />
					)}
				</div>

				<div className="flex flex-col items-center justify-center size-full gap-4 lg:h-auto lg:gap-8 max-w-[550px]">
					<div className="grid grid-cols-4 gap-2 max-w-screen-lg w-full min-h-[190px] lg:min-h-0">
						{answers.map((answer, inx) => (
							<Droppable
								key={inx}
								id={inx}
								replaceWith={
									answer && (
										<Draggable
											id={(answer as QuestionOption & { id: string }).id}
											optionItem={answer}
											disabled
											onClear={() => handleClear(inx)}
										/>
									)
								}
							>
								<p className="text-[#DEDEDE] font-black text-5xl">{inx + 1}</p>
							</Droppable>
						))}
					</div>

					<div className="grid grid-cols-2 size-full gap-4 max-h-[280px]">
						{options.map((option, index) => (
							<Draggable
								id={index}
								key={option.id}
								optionItem={option}
								hidden={answers.some((ans) => ans?.id === option.id)}
							/>
						))}
					</div>
				</div>
			</div>

			<DragOverlay>
				{activeDrag && (
					<Draggable optionItem={activeDrag} id={uuid()} overlay />
				)}
			</DragOverlay>
		</DndContext>
	);
}

function Droppable({
	id,
	replaceWith,
	...props
}: {
	replaceWith?: React.ReactNode;
	id: number;
	children?: React.ReactNode;
}) {
	const { setNodeRef, isOver } = useDroppable({ id });

	if (replaceWith) return replaceWith;

	return (
		<div
			className={cx(
				"rounded-[20px]  transition-all bg-[#f8f6f2] flex items-center justify-center ",
				"size-full shadow-card lg:aspect-square",
				{
					"bg-green-300/20": isOver,
				},
			)}
			ref={setNodeRef}
			{...props}
		/>
	);
}

function Draggable({
	optionItem,
	onClear,
	hidden = false,
	disabled = false,
	id,
	overlay = false,
}: {
	optionItem: QuestionOption;
	onClear?: () => void;
	hidden?: boolean;
	disabled?: boolean;
	id: string | number;
	overlay?: boolean;
}) {
	const { setNodeRef, isDragging, attributes, listeners } = useDraggable({
		id,
		data: { option: optionItem },
		disabled,
	});

	return (
		<div
			className={cx(
				"rounded-[20px] bg-[#F8F6F2] shadow-card grid place-items-center relative",
				"cursor-grab p-1 flex-1",
				"w-auto h-[130px]",
				{
					"opacity-40 cursor-grabbing": isDragging,
					"pointer-events-none": disabled || hidden,
					"opacity-10": hidden,
					"h-full": disabled,
					"aspect-square": overlay,
				},
			)}
			ref={setNodeRef}
			{...attributes}
			{...listeners}
		>
			<p
				className={cx(
					"font-bold text-text select-none pointer-events-none text-3xl",
					{
						"text-lg md:text-3xl": disabled,
					},
				)}
			>
				{optionItem.description}
			</p>
			<img
				src={optionItem.image_url ?? ""}
				alt={optionItem.description}
				className={cx(
					"pointer-events-none select-none object-cover my-auto aspect-square w-[80px]",
				)}
			/>
			{onClear && (
				<button
					type="button"
					className={cx(
						"bg-red-500 text-white rounded-full grid place-items-center absolute",
						"size-8 -top-3 right-auto -left-3 pointer-events-auto",
					)}
					onClick={onClear}
					onKeyDown={onClear}
				>
					<IconX className="size-5 xl:size-7" />
				</button>
			)}
		</div>
	);
}
