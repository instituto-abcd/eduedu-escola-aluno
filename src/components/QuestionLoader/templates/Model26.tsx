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
import { produce } from "immer";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import type { QuestionOption } from "~/api/exam";
import { AudioContainer } from "~/components/AudioContainer";
import { DraggableLetter, DroppableLetter } from "~/components/dnd";
import { ImageTitle } from "~/components/question-components";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import type { ModelProps } from ".";

export function Model26({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const { hasAudioTitle, imageTitles, textTitles } =
		useQuestionHelper(question);
	const letterSlots = textTitles.find((title) =>
		title?.description?.includes("_"),
	);

	const isSlotsOnly = (title: string) =>
		title.replace(/_|\s/g, "").length === 0;

	const initialSlots =
		letterSlots && isSlotsOnly(letterSlots.description)
			? letterSlots.description.split(" ").map(() => null)
			: [];

	const [slots, setSlots] =
		useState<Array<QuestionOption | null>>(initialSlots);

	const handleDrop = useCallback(
		(item: QuestionOption | null, index: number) => {
			setSlots((state) =>
				produce(state, (draft) => {
					draft[index] = item;
				}),
			);
		},
		[],
	);

	function handleClear(index: number) {
		handleDrop(null, index);
	}

	useEffect(() => {
		setSlots(initialSlots);
	}, [question]);

	useEffect(() => {
		onAnswerChange(
			slots
				.filter((slot) => slot !== null)
				.map((item, index) => ({
					...item,
					positionAnswer: index,
				})) as QuestionOption[],
		);
	}, [slots]);

	const conditions = useMemo(
		() => [slots.length === question.options.length && !slots.includes(null)],
		[slots],
	);

	useEffect(() => {
		onConditionsChange(conditions);
	}, [slots]);

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
			handleDrop(option, targetIndex);
		}
	}

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

	/* Map id to options */
	const options = useMemo(
		() =>
			question.options.map((option) => ({
				...option,
				id: uuid(),
			})),
		[question],
	);

	return (
		<DndContext
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			sensors={sensors}
		>
			{hasAudioTitle && <AudioContainer question={question} />}

			<div className="size-full flex flex-col lg:flex-row lg:gap-8 items-center justify-evenly">
				<ImageTitle titles={imageTitles} />

				<div className="flex flex-col items-center gap-6 max-w-screen-md">
					{letterSlots && isSlotsOnly(letterSlots.description) && (
						<div className="flex w-full gap-4 items-center justify-center">
							{slots.map((_, inx) => (
								<DroppableLetter
									key={inx}
									id={inx}
									replaceWith={
										slots[inx] && (
											<DraggableLetter
												id={inx}
												optionItem={slots[inx]}
												disabled
												onClear={() => handleClear(inx)}
												className="w-auto"
											/>
										)
									}
								/>
							))}
						</div>
					)}

					{letterSlots && !isSlotsOnly(letterSlots.description) && (
						<div className="flex flex-wrap items-center justify-center">
							{letterSlots.description
								.replaceAll(/\\n/g, " ")
								.split(/_+/g) // separa os segmentos de texto dos underlines
								.map((w, inx, arr) => {
									const notLastFragment = arr.length !== inx + 1;
									const isLastFragment = arr.length === 1 && w.endsWith(" ");
									const isFirstFragment = arr.length === 1 && w.startsWith(" ");

									const canRenderLast =
										(isLastFragment || notLastFragment) && !isFirstFragment;
									const canRenderFirst = isFirstFragment && !isLastFragment;

									return (
										<Fragment key={inx}>
											{canRenderFirst && (
												<DroppableLetter
													id={inx}
													replaceWith={
														slots[inx] && (
															<DraggableLetter
																id={inx}
																optionItem={slots[inx]}
																disabled
																onClear={() => handleClear(inx)}
																className="w-auto"
															/>
														)
													}
												/>
											)}

											{w.split(" ").map((frag, inx) => (
												<span
													className="text-text px-0.5 font-black text-3xl"
													key={inx}
												>
													{frag}
												</span>
											))}

											{canRenderLast && (
												<DroppableLetter
													id={inx}
													replaceWith={
														slots[inx] && (
															<DraggableLetter
																id={inx}
																optionItem={slots[inx]}
																disabled
																onClear={() => handleClear(inx)}
																className="w-auto"
															/>
														)
													}
												/>
											)}
										</Fragment>
									);
								})}
						</div>
					)}

					<div className="flex gap-4">
						{options.map((option) => (
							<DraggableLetter
								id={option.id}
								optionItem={option}
								key={option.description}
								hidden={slots.includes(option)}
							/>
						))}
					</div>
				</div>
			</div>

			<DragOverlay>
				{activeDrag && <DraggableLetter optionItem={activeDrag} id={542321} />}
			</DragOverlay>
		</DndContext>
	);
}
