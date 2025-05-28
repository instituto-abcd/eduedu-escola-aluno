import { SimpleGrid } from "@mantine/core";
import type { ModelProps } from ".";
import { useEffect, useMemo, useRef, useState } from "react";
import { produce } from "immer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import type { QuestionOption } from "~/api/exam";
import type { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { AuxiliaryVideoModal } from "~/components/AuxiliaryVideoModal";
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
import {
	DroppableCard,
	DraggableCard,
	DroppablePictureCard,
	DraggablePictureCard,
} from "~/components/dnd";
import { VideoTitle } from "~/components/question-components";

type OptionWithSound = QuestionOption & {
	id: string;
	sound?: Howl;
};

export function Model2({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
		question.options.map(() => null),
	);

	function handleDrop(option: OptionWithSound | null, targetIndex: number) {
		setAnswers((state) =>
			produce(state, (draft) => {
				let opt: QuestionOption | null = null;
				if (option) {
					const { id: _id, sound: _sound, ..._option } = option;
					opt = _option;
				}

				/* @ts-ignore */
				draft[targetIndex] = option
					? { ...opt, positionAnswer: targetIndex }
					: null;
			}),
		);
	}

	function handleClearAnswer(optionIndex: number) {
		setAnswers((state) =>
			produce(state, (draft) => {
				draft[optionIndex] = null;
			}),
		);
	}

	const {
		audioTitles,
		hasAudioTitle,
		audioTitleAutoplay,
		textTitles,
		getRule,
		videoTitles,
	} = useQuestionHelper(question);

	/* Autoplay Aux Audio Logic */
	const auxAutoPlayRule = getRule("auxAutoPlay");
	const shouldPlayAux = auxAutoPlayRule?.value === "false" ? false : true;
	const noPaddingRule = getRule("noPadding")?.value === "true";

	const mainAudioRef = useRef<AudioButtonRef>(null);
	const auxRef = useRef<AudioButtonRef>(null);

	useEffect(() => {
		if (mainAudioRef.current && auxRef.current) {
			if (shouldPlayAux) {
				mainAudioRef.current.sound.onEnd(() => {
					auxRef.current?.sound.play();
				});
			}
		}
	}, [mainAudioRef, auxRef]);
	/* End Aux Logic */

	useEffect(() => {
		setAnswers(question.options.map(() => null));
	}, [question]);

	useEffect(() => {
		onAnswerChange(answers.filter((answer) => answer !== null));
	}, [answers]);

	const conditions = useMemo(
		() => [answers.every((answer) => answer !== null)],
		[answers],
	);

	useEffect(() => {
		onConditionsChange(conditions);
	}, [conditions]);

	const auxVideo = videoTitles.find((title, index) => index >= 1);

	const cardSize =
		question.options.length > 3 ? question.options.length : undefined;

	/* Drag Handlers */
	const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

	function onDragStart(e: DragStartEvent) {
		if (e.active.data.current) {
			const option: OptionWithSound = e.active.data.current.option;
			if (!option.sound?.playing()) {
				option.sound?.play();
			}
			setActiveDrag(() => option);
		}
	}

	function onDragEnd(e: DragEndEvent) {
		setActiveDrag(null);
		if (e.over) {
			const targetIndex = Number(e.over.id);
			const option = (e.active.data.current?.option as QuestionOption) ?? null;
			handleDrop(option as OptionWithSound, targetIndex);
		}
	}

	function replaceSlotWithCard(
		option: QuestionOption | null,
		slotIndex: number,
	) {
		if (option) {
			return (
				<DraggableCard
					id={+option.position}
					optionItem={option}
					image={option?.image_url}
					text={option?.description}
					sound={option?.sound_url}
					onClear={() => handleClearAnswer(slotIndex)}
					debug={{ skipDebug: true }}
					disabled
				/>
			);
		} else return null;
	}

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
	const optionsWithSound = useMemo(
		() =>
			question.options.map((option) => ({
				...option,
				sound: new Howl({
					src: [option.sound_url ?? ""],
					html5: true,
					format: ["mp3"],
					loop: false,
				}),
			})),
		[question],
	);

	return (
		<DndContext
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			sensors={sensors}
		>
			{hasAudioTitle && (
				<div className="flex gap-4 lg:self-start">
					{audioTitles.map((title, inx) => (
						<AudioButton
							index={inx}
							key={inx}
							autoPlay={audioTitleAutoplay(inx)}
							src={title.file_url!}
							ref={inx === 1 ? auxRef : mainAudioRef}
						/>
					))}
					{auxVideo && (
						<AuxiliaryVideoModal videoUrl={auxVideo.file_url ?? ""} />
					)}
				</div>
			)}
			<div className="my-auto flex flex-col items-center w-full gap-4 md:gap-9 max-h-[80vh]">
				{textTitles.map((title) => (
					<p
						key={title.description}
						className="text-center text-zinc-600 text-2xl font-medium"
					>
						{title.description}
					</p>
				))}

				{question.model_id === "MODEL2-VIDEO" && (
					<VideoTitle
						titles={videoTitles}
						className="max-h-[200px] w-full max-w-[400px]"
					/>
				)}

				{!noPaddingRule && (
					<SimpleGrid
						cols={question.options.length}
						className="xl:place-items-center grid xl:h-[40vh] xl:w-auto max-w-[500px]"
					>
						{answers.map((slot, inx) => (
							<DroppableCard
								key={inx}
								id={inx}
								size={cardSize}
								replaceWith={replaceSlotWithCard(slot, inx)}
								style={{ maxWidth: "150px", maxHeight: "150px" }}
							/>
						))}
					</SimpleGrid>
				)}

				{noPaddingRule && (
					<div className="place-items-center grid grid-cols-3 gap-0 lg:h-[40vh] w-fit">
						{answers.map((slot, inx) => (
							<DroppablePictureCard
								key={inx}
								optionItem={slot}
								index={inx}
								total={question.options.length}
								id={inx}
								replaceWith={
									<DraggablePictureCard
										id={slot ? +slot.position : inx}
										index={inx}
										total={question.options.length}
										optionItem={slot!}
										image={slot?.image_url ?? null}
										sound={slot?.sound_url ?? null}
										onClear={() => handleClearAnswer(inx)}
										disabled
									/>
								}
							/>
						))}
					</div>
				)}

				<SimpleGrid
					cols={question.options.length}
					className="place-items-center max-w-[500px] xl:min-w-[800px] gap-4 lg:h-[40vh] lg:w-auto"
				>
					{optionsWithSound.map((item, inx) =>
						answers.find((slot) => slot?.position === item.position) ? (
							<DraggableCard
								id={Math.random() * 30}
								key={inx}
								optionItem={item}
								size={cardSize}
								image={item.image_url}
								text={item.description}
								sound={item.sound_url}
								hidden
								debug={{ skipDebug: true }}
							/>
						) : (
							<DraggableCard
								id={item.id}
								key={inx}
								optionItem={item}
								size={cardSize}
								image={item.image_url}
								text={item.description}
								sound={item.sound_url}
								debug={{ debugProperty: "position" }}
								style={{ maxWidth: "150px", maxHeight: "150px" }}
							/>
						),
					)}
				</SimpleGrid>
			</div>

			<DragOverlay>
				{activeDrag ? (
					<DraggableCard
						id={32145}
						optionItem={activeDrag}
						size={cardSize}
						image={activeDrag.image_url}
						text={activeDrag.description}
						sound={activeDrag.sound_url}
						debug={{ skipDebug: true }}
						style={{ maxWidth: "150px", maxHeight: "150px" }}
						disabled
					/>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
