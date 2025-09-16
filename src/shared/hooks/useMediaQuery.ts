'use client';

import {useLayoutEffect, useState} from 'react';

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useLayoutEffect(() => {
        const media = window.matchMedia(query);

        setMatches(media.matches);

        const listener = () => setMatches(media.matches);

        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);

    }, [query]);

    return matches;
}

export default useMediaQuery;