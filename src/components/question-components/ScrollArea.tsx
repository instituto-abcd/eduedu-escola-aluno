import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cx } from "~/utils/cx";

const MIN_THUMB_HEIGHT = 24;

type Thumb = { top: number; height: number };

type Props = {
	className?: string;
	children: React.ReactNode;
};

/**
 * Área com rolagem vertical e barra de rolagem sempre visível quando há
 * overflow. A barra nativa é overlay em mobile/tablet e some até o usuário
 * rolar (e o Safari do iOS ignora ::-webkit-scrollbar), então ela é escondida
 * e desenhada aqui.
 */
export function ScrollArea({ className, children }: Props) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{ startY: number; startScrollTop: number } | null>(
		null,
	);
	const [thumb, setThumb] = useState<Thumb | null>(null);

	const update = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;

		const { scrollHeight, clientHeight, scrollTop } = el;
		const maxScroll = scrollHeight - clientHeight;
		if (maxScroll < 1) {
			setThumb(null);
			return;
		}

		const height = Math.max(
			(clientHeight / scrollHeight) * clientHeight,
			MIN_THUMB_HEIGHT,
		);
		const top = (scrollTop / maxScroll) * (clientHeight - height);
		setThumb((prev) =>
			prev?.top === top && prev.height === height ? prev : { top, height },
		);
	}, []);

	// Recalcula a cada render (lacunas preenchidas mudam a altura do texto) e
	// quando o container ou os segmentos mudam de tamanho (viewport, fontes).
	useLayoutEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		for (const child of Array.from(el.children)) observer.observe(child);
		return () => observer.disconnect();
	});

	const onThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		const el = scrollRef.current;
		if (!el) return;
		event.currentTarget.setPointerCapture(event.pointerId);
		dragRef.current = { startY: event.clientY, startScrollTop: el.scrollTop };
	};

	const onThumbPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		const el = scrollRef.current;
		const drag = dragRef.current;
		if (!el || !drag || !thumb) return;

		const maxScroll = el.scrollHeight - el.clientHeight;
		const maxThumbTop = el.clientHeight - thumb.height;
		el.scrollTop =
			drag.startScrollTop +
			((event.clientY - drag.startY) * maxScroll) / maxThumbTop;
	};

	const onThumbPointerUp = () => {
		dragRef.current = null;
	};

	return (
		<div className="relative w-full">
			<div
				ref={scrollRef}
				onScroll={update}
				className={cx("overflow-y-auto scrollbar-none", className)}
			>
				{children}
			</div>

			{thumb && (
				<div className="absolute inset-y-0 right-1 w-2 rounded-full bg-text/10">
					<div
						className="absolute inset-x-0 rounded-full bg-text/50 touch-none cursor-pointer"
						style={{ top: thumb.top, height: thumb.height }}
						onPointerDown={onThumbPointerDown}
						onPointerMove={onThumbPointerMove}
						onPointerUp={onThumbPointerUp}
						onPointerCancel={onThumbPointerUp}
					/>
				</div>
			)}
		</div>
	);
}
