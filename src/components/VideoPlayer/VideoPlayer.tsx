import { Button, Group, HoverCard, Loader, Table } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import {
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
	IconPlayerStopFilled,
	IconRotateClockwise,
} from "@tabler/icons-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useAudioStatus } from "~/stores/audio";
import { useDebugInfo } from "~/stores/debug-info";
import { cx } from "~/utils/cx";

export type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement>;

export function VideoPlayer({
	className,
	autoPlay,
	...props
}: VideoPlayerProps) {
	const ref = useRef<HTMLVideoElement>(null);
	const [isLoadingData, setIsLoadingData] = useState(true);

	// O store de áudio é global e só diz se ALGUMA mídia toca no app; ele não sabe
	// se este vídeo já foi reproduzido. Sem estado próprio o overlay mostrava o
	// ícone de "reproduzir novamente" sobre vídeo que nunca tocou.
	const [playState, setPlayState] = useState<
		"pending" | "playing" | "paused" | "ended" | "blocked"
	>("pending");

	const audioStatus = useAudioStatus();
	// O contador global é de referências: só devolve o decremento quem incrementou.
	const hasCounted = useRef(false);

	const isHorizontal =
		ref.current && ref.current.videoWidth > ref.current.videoHeight;

	function setPlaying(playing: boolean) {
		if (playing === hasCounted.current) return;
		hasCounted.current = playing;
		audioStatus.setPlaying(playing);
	}

	function play() {
		if (!ref.current) return;
		if (ref.current.ended) {
			ref.current.currentTime = 0;
		}
		// Em iOS o autoplay de vídeo com som é bloqueado quando a chamada não parte
		// de um gesto do usuário. A rejeição precisa virar estado, senão o player
		// fica indistinguível de um vídeo que já foi assistido.
		ref.current
			.play()
			.then(() => setPlayState("playing"))
			.catch(() => setPlayState("blocked"));
	}

	function stop() {
		if (ref.current) {
			ref.current.pause();
			ref.current.currentTime = 0;
		}
	}

	function pause() {
		ref.current?.pause();
	}

	useEffect(() => {
		// `VideoTitle` reaproveita a instância entre questões (key por índice), então
		// o estado precisa voltar ao início a cada src, senão o vídeo novo herda o
		// "ended" do anterior e nasce com o ícone de replay.
		setIsLoadingData(true);
		setPlayState("pending");

		const timer = autoPlay ? setTimeout(play, 200) : undefined;

		return () => {
			if (timer) clearTimeout(timer);
			setPlaying(false);
		};
	}, [props.src]);

	return (
		<div className="relative size-full flex flex-col items-center">
			<video
				{...props}
				ref={ref}
				className={cx(
					"w-full h-auto",
					{
						["w-auto h-full"]: !isHorizontal,
					},
					className,
				)}
				controls={false}
				playsInline
				disablePictureInPicture
				disableRemotePlayback
				controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
				onLoadedData={() => setIsLoadingData(false)}
				onPlay={(e) => {
					props.onPlay?.(e);
					setPlayState("playing");
					setPlaying(true);
				}}
				onPause={(e) => {
					props.onPause?.(e);
					// `pause` pode chegar junto com `ended`; o fim tem precedência.
					setPlayState((state) => (state === "ended" ? state : "paused"));
					setPlaying(false);
				}}
				onEnded={(e) => {
					props.onEnded?.(e);
					setPlayState("ended");
					setPlaying(false);
				}}
			></video>

			<div className="absolute inset-0 grid place-items-center z-10 text-white">
				{isLoadingData && <Loader />}
				{/* Replay só depois de assistir até o fim. */}
				{!isLoadingData && playState === "ended" && (
					<IconRotateClockwise
						size={100}
						className="pointer opacity-90 stroke-blue-300"
						onClick={play}
					/>
				)}
				{/* Nunca assistido: autoplay barrado ou pausado no meio. */}
				{!isLoadingData &&
					(playState === "blocked" || playState === "paused") && (
						<IconPlayerPlayFilled
							size={100}
							className="pointer opacity-90 fill-blue-300 stroke-blue-300"
							onClick={play}
						/>
					)}
			</div>
		</div>
	);
}

// TODO: add debuger
function Debug({
	children,
	isPlaying,
	canPlay,
	stop,
	pause,
}: {
	children: ReactNode;
	isPlaying: boolean;
	canPlay: boolean;
	stop: () => void;
	pause: () => void;
}) {
	const debug = useDebugInfo((s) => s.VideoPlayer);
	if (!debug) return children;

	return (
		<HoverCard width={200} shadow="md" position="left">
			<HoverCard.Target>
				<div>{children}</div>
			</HoverCard.Target>
			<HoverCard.Dropdown>
				<Table withTableBorder fz={12}>
					<Table.Tbody>
						<Table.Tr>
							<Table.Td>Playing?</Table.Td>
							<Table.Td>{isPlaying ? "✅" : "❌"}</Table.Td>
						</Table.Tr>
						<Table.Tr>
							<Table.Td>Can play?</Table.Td>
							<Table.Td>{canPlay ? "✅" : "❌"}</Table.Td>
						</Table.Tr>
					</Table.Tbody>
				</Table>
				<Group wrap="nowrap">
					<Button
						onClick={stop}
						size="compact-sm"
						color="red"
						mt="sm"
						disabled={!isPlaying}
						leftSection={<IconPlayerStopFilled size={16} />}
					>
						Stop
					</Button>
					<Button
						onClick={pause}
						size="compact-sm"
						mt="sm"
						variant="outline"
						disabled={!isPlaying}
						leftSection={<IconPlayerPauseFilled size={16} />}
					>
						Pause
					</Button>
				</Group>
			</HoverCard.Dropdown>
		</HoverCard>
	);
}
