import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { usePlanetAnswer } from "~/api/planet";
import { lousaHeight, lousaWidth } from "~/constants/dimensions";

// Components:
import { Group, Box, SimpleGrid, Image, LoadingOverlay } from "@mantine/core";
import { EduButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";

export function Model3({ question, answerCallback }: ModelProps) {
    const { videoTitles } = useQuestionHelper(question);
    const mediaTrack = useMediaTrackStore();
    const [answer, setAnswer] = useState<Answer | null>(null);

    const { mutate, isLoading } = usePlanetAnswer({
        onSuccess: (q) => answerCallback(q),
    });
    function submitAnswer() {
        if (answer === null) return;

        mutate({
            planetId: question.planet_id,
            questionId: question.id,
            optionsAnswered: [answer],
        });
    }

    useEffect(() => {
        setAnswer(null);
    }, [question]);

    console.log(question)
    return (
        <>
            <Group
                m="auto"
                spacing={(lousaWidth * 5 / 100)}
            >
                <Box maw={lousaWidth * 10 / 100}>
                    <VideoPlayer
                        src={videoTitles[0]?.file_url ?? ""}
                        onPlayStatusChange={mediaTrack.setPlayStatus}
                        canPlay={mediaTrack.canPlay()}
                        autoPlay
                        customHeight={(lousaWidth * 10 / 100).toString()}
                    />
                </Box>
                <Box maw={lousaWidth * 80 / 100}>
                    <SimpleGrid cols={4}>
                        {question.options.map((option) => (
                            <OptionButton
                                key={option.description}
                                onClick={() =>
                                    setAnswer({
                                        position: option.position,
                                        positionAnswer: option.position,
                                    })
                                }
                                data-selected={answer?.position === option.position}
                                isCorrect={option.isCorrect}
                            >
                                <Image src={option?.image_url} />
                                {option.description}
                            </OptionButton>
                        ))}
                    </SimpleGrid>
                </Box>
            </Group>

            {/* Continue to the next screen button */}
            <EduButton
                disabled={!answer}
                onClick={submitAnswer}
                style={{
                    marginTop: "auto"
                }}
            >
                Continuar
            </EduButton>

            {/* Loading animation */}
            <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
        </>
    )
}