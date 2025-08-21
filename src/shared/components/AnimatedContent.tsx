'use client';

import React, {ReactNode, useEffect, useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedContentProps {
    children: ReactNode;
    distance?: number;
    direction?: 'vertical' | 'horizontal';
    reverse?: boolean;
    duration?: number;
    ease?: string | ((progress: number) => number);
    initialOpacity?: number;
    animateOpacity?: boolean;
    scale?: number;
    threshold?: number;
    delay?: number;
    className?: string;
    onComplete?: () => void;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
                                                             children,
                                                             distance = 150,
                                                             direction = 'vertical',
                                                             reverse = false,
                                                             duration = 2,
                                                             ease = 'power3.out',
                                                             initialOpacity = 0,
                                                             animateOpacity = true,
                                                             scale = 1.1,
                                                             threshold = 0.2,
                                                             delay = 0.3,
                                                             className = '',
                                                             onComplete,
                                                         }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const axis = direction === 'horizontal' ? 'x' : 'y';
        const offset = reverse ? -distance : distance;
        const startPct = (1 - threshold) * 100;

        gsap.set(el, {
            [axis]: offset,
            scale,
            opacity: animateOpacity ? initialOpacity : 1,
        });

        gsap.to(el, {
            [axis]: 0,
            scale: 1,
            opacity: 1,
            duration,
            ease,
            delay,
            onComplete,
            scrollTrigger: {
                trigger: el,
                start: `top ${startPct}%`,
                toggleActions: 'play none none none',
                once: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
            gsap.killTweensOf(el);
        };
    }, [
        distance,
        direction,
        reverse,
        duration,
        ease,
        initialOpacity,
        animateOpacity,
        scale,
        threshold,
        delay,
        onComplete,
    ]);

    return <div className={className} ref={ref}>{children}</div>;
};

export default AnimatedContent;
