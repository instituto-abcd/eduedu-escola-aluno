import {
	Anchor,
	Button,
	Center,
	Image,
	Loader,
	Modal,
	Notification,
	Rating,
	Stack,
	Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useSearchParams } from "react-router-dom";
import { usePlanetFeedback } from "~/api/student";
import feedbackLow from "~/assets/planets/feedback_low.svg";
import feedbackHigh from "~/assets/planets/feedback_high.svg";
import { useNewAward } from "~/stores/new-award";

type Props = {
	onClose: (lastPlanetId: string | null) => void;
};

export function PlanetCompletedFeedback({ onClose }: Props) {
	const { requestView } = useNewAward();
	const [params, setParams] = useSearchParams();
	const planetCompleted = params.get("planet-completed");

	const {
		data: planetData,
		refetch,
		error,
		isLoading,
		isSuccess,
		isError,
	} = usePlanetFeedback(planetCompleted ?? "", {
		enabled: !!planetCompleted,
		cacheTime: 0,
	});

	function closeModal() {
		setParams((prev) => {
			prev.delete("planet-completed");
			return prev;
		});
		onClose(planetCompleted);
		requestView();
	}

	if (!planetCompleted) return null;

	return (
		<Modal
			opened={!!planetCompleted}
			onClose={closeModal}
			title={isError && "Um erro aconteceu"}
			withCloseButton={isError ?? false}
			closeOnClickOutside={isError ?? false}
			radius="md"
			centered
		>
			<Stack align="center" spacing="xl">
				{error && (
					<>
						<Image src={feedbackLow} width={200} style={{ zIndex: 10 }} />
						<Notification
							color="red"
							icon={<IconX />}
							title="Erro"
							withCloseButton={false}
							withBorder
						>
							{error.message}
						</Notification>
						<Anchor size="sm" onClick={() => void refetch()}>
							Tentar novamente
						</Anchor>
					</>
				)}

				{isLoading && (
					<Center>
						<Loader />
					</Center>
				)}

				{isSuccess && (
					<>
						<Image
							src={(planetData?.stars ?? 0) > 0 ? feedbackHigh : feedbackLow}
							width={200}
							style={{ zIndex: 10 }}
						/>
						<Rating
							value={planetData?.stars ?? 0}
							readOnly
							size="xl"
							fractions={4}
						/>
						<Text color="dark.3" size="xl">
							Muito bem! Você terminou o {planetData?.planetName}.
						</Text>
						<Button fullWidth color="blue.4" onClick={closeModal} size="md">
							Continuar
						</Button>
					</>
				)}
			</Stack>
		</Modal>
	);
}
