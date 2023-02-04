import { Howl } from 'howler';
import { useEffect, useMemo } from 'react';

import bgmUrl from '@/assets/battle-of-the-dragons-8037.mp3?url';

export const useBGM = () => {
    const bgmHowl = useMemo(() => new Howl({
        volume: 0.5,
        src: bgmUrl,
        loop: true,
    }), []);

    useEffect(() => {
        bgmHowl.play();

        return () => {
            bgmHowl.stop();
        }
    }, [bgmHowl]);

}