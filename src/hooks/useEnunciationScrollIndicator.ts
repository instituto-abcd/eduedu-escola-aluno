import { useEffect, useRef, useState } from "react";
import { Question } from "~/api/exam";

export const useEnunciationScrollIndicator = (question: Question) => {
    const [enunciationScrollIndicator, setEnunciationScrollIndicator] = useState<boolean>(false);
    const enunciationScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (enunciationScrollRef.current) {
            if (enunciationScrollRef.current.clientHeight > 0 && 
                enunciationScrollRef.current.scrollHeight > enunciationScrollRef.current.clientHeight) {
            setEnunciationScrollIndicator(true);
            return;
          }
          setEnunciationScrollIndicator(false);
        }
    }, [question]);

    useEffect(() => {
        if (!enunciationScrollRef.current) return;

        enunciationScrollRef.current.addEventListener('scroll', handleScroll);

        return () => {
            enunciationScrollRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [enunciationScrollRef]);

    const handleScroll = () => {
        if (enunciationScrollRef.current?.scrollTop === 0) {
            setEnunciationScrollIndicator(true);
            return;
        }
        setEnunciationScrollIndicator(false);
    };

    return { 
        enunciationScrollIndicator, setEnunciationScrollIndicator, enunciationScrollRef 
    };
}
