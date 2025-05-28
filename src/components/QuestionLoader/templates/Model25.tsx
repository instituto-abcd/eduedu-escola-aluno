import { produce } from "immer";
import { useEffect, useMemo, useState, useRef } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
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
import {
	DraggableCardSquare,
	DroppablePictureCardSquare,
	DraggablePictureCardSquare,
} from "~/components/dnd";

type OptionWithSound = QuestionOption & {
	id: string;
	sound?: Howl;
};

export function Model25({
	question,
	onAnswerChange,
	onConditionsChange,
}: ModelProps) {
	const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
		question.options.map(() => null),
	);

	const {
		audioTitles,
		hasAudioTitle,
		audioTitleAutoplay,
		textTitles,
		getRule,
		getTitlesOfType,
	} = useQuestionHelper(question);

	const imageTitles = getTitlesOfType("IMAGE");

	const auxAutoPlayRule = getRule("auxAutoPlay");
	const shouldPlayAux = auxAutoPlayRule?.value === "false" ? false : true;

	const mainAudioRef = useRef<AudioButtonRef>(null);
	const auxRef = useRef<AudioButtonRef>(null);

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

	const [activeDrag, setActiveDrag] = useState<QuestionOption | null>(null);

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

	function handleClearAnswer(optionIndex: number) {
		setAnswers((state) =>
			produce(state, (draft) => {
				draft[optionIndex] = null;
			}),
		);
	}

	const conditions = useMemo(
		() => [answers.every((answer) => answer !== null)],
		[answers],
	);

	useEffect(() => {
		if (mainAudioRef.current && auxRef.current) {
			if (shouldPlayAux) {
				mainAudioRef.current.sound.onEnd(() => {
					auxRef.current?.sound.play();
				});
			}
		}
	}, [mainAudioRef, auxRef]);

	useEffect(() => {
		setAnswers(question.options.map(() => null));
	}, [question]);

	useEffect(() => {
		onAnswerChange(answers.filter((answer) => answer !== null));
	}, [answers]);

	useEffect(() => {
		onConditionsChange(conditions);
	}, [conditions]);

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
							key={title.file_url}
							autoPlay={audioTitleAutoplay(inx)}
							src={title.file_url!}
							ref={inx === 1 ? auxRef : mainAudioRef}
						/>
					))}
				</div>
			)}
			<div className="flex flex-col items-center justify-evenly flex-1">
				<div>
					{textTitles.map((title) => (
						<p
							key={title.description}
							className="text-center text-zinc-600 text-2xl font-medium"
						>
							{title.description}
						</p>
					))}
				</div>

				<div className="grid grid-cols-3 gap-1 place-content-center place-items-center sm:gap-2 h-fit w-full ">
					{answers.map((slot, inx) => (
						<div
							className="flex flex-col items-center h-full max-h-[40vh] md:max-h-[50vh] aspect-[2/4]"
							key={inx}
						>
							<div className="flex items-center w-full max-w-[350px] min-h-[125px] aspect-[2/3] rounded-[20px] md:rounded-[45px] border-2 border-[#4c494140]">
								<div>
									{imageTitles[inx]?.file_url ? (
										<img
											key={imageTitles[inx]?.file_url}
											src={imageTitles[inx]?.file_url}
											alt={imageTitles[inx]?.placeholder}
											className="w-full px-8 min-h-[125px] h-[200px] md:h-[350px] object-scale-down"
										/>
									) : (
										<span className="flex p-1 text-center w-full text-[#757575]">
											{imageTitles[inx]?.description}
										</span>
									)}
								</div>
							</div>
							<DroppablePictureCardSquare
								optionItem={slot}
								index={inx}
								total={question.options.length}
								id={inx}
								replaceWith={
									slot && (
										<DraggablePictureCardSquare
											id={slot ? +slot.position : inx}
											index={inx}
											total={question.options.length}
											optionItem={slot}
											image={slot?.image_url ?? null}
											sound={slot?.sound_url ?? null}
											onClear={() => handleClearAnswer(inx)}
											disabled
										/>
									)
								}
							/>
						</div>
					))}
				</div>

				<div className="grid grid-cols-3 place-content-center place-items-center w-full max-w-1/2 max-h-[20vh]">
					{question.options.map((item) =>
						answers.find((slot) => slot?.position === item.position) ? (
							<DraggableCardSquare
								id={Math.random() * 30}
								key={item.id}
								optionItem={item}
								size={3}
								image={item.image_url}
								text={item.description}
								sound={item.sound_url}
								hidden
								debug={{ skipDebug: true }}
								disabled={mainAudioRef.current?.sound.playing()}
							/>
						) : (
							<DraggableCardSquare
								id={item.id}
								key={item.id}
								optionItem={item}
								size={3}
								image={item.image_url}
								text={item.description}
								sound={item.sound_url}
								debug={{ debugProperty: "position" }}
								disabled={mainAudioRef.current?.sound.playing()}
							/>
						),
					)}
				</div>
				<DragOverlay>
					{activeDrag ? (
						<DraggableCardSquare
							id={32145}
							optionItem={activeDrag}
							size={3}
							image={activeDrag.image_url}
							text={activeDrag.description}
							sound={activeDrag.sound_url}
							debug={{ skipDebug: true }}
							disabled
						/>
					) : null}
				</DragOverlay>
			</div>
		</DndContext>
	);
}
