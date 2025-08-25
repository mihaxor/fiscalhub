'use client';

import {useEffect, useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

interface GSAPInstance {
    gsap: typeof gsap | null;
    ScrollTrigger: typeof ScrollTrigger | null;
    isReady: boolean;
}

const useGsap = (): GSAPInstance => {
    const [gsapState, setGsapState] = useState<GSAPInstance>({
        gsap: null,
        ScrollTrigger: null,
        isReady: false
    });

    useEffect(() => {
        const checkGsap = () => {
            if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
                setGsapState({
                    gsap: window.gsap,
                    ScrollTrigger: window.ScrollTrigger,
                    isReady: true
                });
            } else {
                Promise.all([
                    import('gsap'),
                    import('gsap/ScrollTrigger')
                ])
                    .then(([gsapModule, scrollTriggerModule]) => {
                        const {gsap} = gsapModule;
                        const {ScrollTrigger} = scrollTriggerModule;

                        gsap.registerPlugin(ScrollTrigger);

                        setGsapState({
                            gsap,
                            ScrollTrigger,
                            isReady: true
                        });
                    }).catch(console.error);
            }
        };

        checkGsap();

        const timeout = setTimeout(checkGsap, 100);

        return () => clearTimeout(timeout);
    }, []);

    return gsapState;
};

export default useGsap;

declare global {
    interface Window {
        gsap: typeof gsap;
        ScrollTrigger: typeof ScrollTrigger;
    }
}