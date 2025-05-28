import { useCallback, useMemo } from "react";
import type { Question, QuestionOption } from "~/api/exam";
import { validate as validateUUID } from "uuid";

export function useQuestionHelper(question: Question) {
	const isExam = !question.planet_id;
	const isPlanet = !!question.planet_id;

	const hasTitleOfType = useCallback(
		function (type: string) {
			return question.titles.filter((title) => title.type === type).length > 0;
		},
		[question],
	);

	const getTitlesOfType = useCallback(
		function getTitlesOfType(type: string) {
			return question.titles.filter((title) => title.type === type);
		},
		[question],
	);

	const getSupportText = useCallback(
		function getSupportText(text: string, options?: { uuid?: boolean }) {
			const supportText = question.titles.filter(
				(title) => title?.placeholder?.includes(text) && !!title?.description,
			);

			if (supportText.length > 0) return supportText;

			if (options?.uuid) {
				const supportTextWithUuid = question.titles.filter(
					(title) => validateUUID(title.description) === true,
				);

				return supportTextWithUuid;
			}

			return [];
		},
		[question],
	);

	const textTitles = getTitlesOfType("TEXT");

	const videoTitles = getTitlesOfType("VIDEO");
	const lottieTitles = getTitlesOfType("LOTTIE");
	const supportText = getSupportText("ID da historinha", { uuid: true });
	const hasAuxQuestion = !!supportText[0]?.["description"];
	const auxQuestionId = hasAuxQuestion ? supportText[0].description : null;

	function optionArrKey(option: QuestionOption, inx?: number) {
		return `[${inx ?? "_"}]-[${option.position}]:${option.description}(${
			option.image_url ?? option.sound_url ?? "_"
		})`;
	}

	/*
	 * Image helpers
	 */
	const imageTitles = getTitlesOfType("IMAGE")
		.filter((title) => title.file_url)
		.filter((t) => typeof t.file_url === "string" && t.file_url !== "");

	const hasImageTitle = useMemo(
		() => imageTitles.some((title) => title.file_url),
		[imageTitles],
	);

	/*
	 * Audio helpers
	 */

	const audioTitles = getTitlesOfType("AUDIO")
		.filter(
			(title) =>
				typeof title.file_url === "string" && title.file_url.trim() !== "",
		)
		.sort((a, b) => a.position - b.position);

	const hasAudioTitle = useMemo(
		() => audioTitles.some((title) => title.file_url),
		[audioTitles],
	);
	const audioTitleAutoplay = (index: number) => {
		if (index !== 0) return false;
		const rule =
			Array.isArray(question.rules) &&
			question.rules.find((rule) => rule.name === "autoplay");

		if (!rule) return true;
		if (typeof rule.value === "boolean") return rule.value;

		return rule.value === "true";
	};

	/*
	 * Rule helpers
	 */

	const getRule = (rule: string) =>
		question.rules?.find((r) => r.name === rule);

	const skipFeedback =
		getRule("skipFeedback")?.value === "true" ||
		question.model_id === "MODEL27" ||
		question.model_id === "MODEL12" ||
		question.model_id === "MODEL13";

	const hasTextTitle = useMemo(
		() => textTitles.some((title) => title.description),
		[textTitles],
	);

	return {
		hasTitleOfType,
		getTitlesOfType,
		textTitles,
		imageTitles,
		hasImageTitle,
		audioTitles,
		videoTitles,
		lottieTitles,
		supportText,
		hasAudioTitle,
		audioTitleAutoplay,
		optionArrKey,
		getRule,
		isExam,
		isPlanet,
		hasAuxQuestion,
		auxQuestionId,
		skipFeedback,
		hasTextTitle,
	};
}
