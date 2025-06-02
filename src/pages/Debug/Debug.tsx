import { Anchor, List, Title, Container, Stack } from "@mantine/core";
import { useState } from "react";
import { useGetStudentAwards } from "~/api/student";
import { AwardDisplay } from "~/components/AwardDisplay/AwardDisplay";
import { AwardImage, AWARDS_IMAGES } from "~/constants/awards";

export function DebugPage() {
	const debugLinks = [
		{
			label: "Planetas — listagem de TODOS os planetas cadastrados",
			href: "planet",
		},
		{
			label:
				"Questões de prova — listagem das questões que podem aparecer em uma execução de prova",
			href: "questions",
		},
		{
			label: "Modelos — listagem de TODOS os modelos cadastrados",
			href: "model",
		},
	];

	const pocLinks = [
		{
			label: "POC Seleção ano escolar (novo fluxo)",
			href: "school-year-select",
		},
		{
			label: "POC Seleção sala/turma (novo fluxo)",
			href: "school-class-select",
		},
	];

	const [awards, setAwards] = useState<AwardImage[]>(AWARDS_IMAGES);
	useGetStudentAwards({
		onSuccess: (data) => {
			const newawards = AWARDS_IMAGES.map((aw) => {
				const match = data.find((award) => award.name === aw.name);
				if (!match) return aw;
				return { ...aw, ...match, active: true };
			});

			setAwards(newawards);
		},
	});

	return (
		<Container>
			<Stack py={24}>
				<Title>Painel de desenvolvedor</Title>

				<Title order={2}>Páginas de depuração</Title>
				<List>
					{debugLinks.map((link) => (
						<List.Item key={link.label}>
							<Anchor href={`/debug/${link.href}`}>{link.label}</Anchor>
						</List.Item>
					))}
				</List>

				<Title order={2}>Testes e POCs</Title>
				<List>
					{pocLinks.map((link) => (
						<List.Item key={link.label}>
							<Anchor href={`/debug/test/${link.href}`}>{link.label}</Anchor>
						</List.Item>
					))}
				</List>

				<div className="grid grid-cols-6">
					{awards.map((aw) => (
						<AwardDisplay award={aw} />
					))}
				</div>
			</Stack>
		</Container>
	);
}
