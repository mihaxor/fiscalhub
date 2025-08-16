import {useEffect, useState} from 'react';

const useResize = () => {
    const [size, setSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    useEffect(() => {
        const handler = () => setSize({width: window.innerWidth, height: window.innerHeight});

        window.addEventListener('resize', handler);

        return () => window.removeEventListener('resize', handler);
    }, []);

    return {width: size.width, height: size.height};
}

export default useResize;