import React from 'react';

const FlagEn = (): React.ReactNode => (
    <svg viewBox="0 0 512 512" className="w-5.5 h-5.5 rounded-md">
        <defs>
            <clipPath id="clip-uk">
                <rect x="0" y="0" width="512" height="512" rx="51.2" ry="51.2"/>
            </clipPath>
        </defs>
        <rect x="0" y="0" width="512" height="512" rx="51.2" ry="51.2" fill="#f0f0f0"/>
        <g clipPath="url(#clip-uk)">
            <rect width="512" height="512" fill="#003d82"/>
            <path d="M0 0L512 512M512 0L0 512" stroke="#f0f0f0" strokeWidth="68"/>
            <path d="M0 0L512 512" stroke="#d80027" strokeWidth="34.1"/>
            <path d="M512 0L0 512" stroke="#d80027" strokeWidth="34.1"/>
            <path d="M256 0V512M0 256H512" stroke="#f0f0f0" strokeWidth="110"/>
            <path d="M256 0V512M0 256H512" stroke="#d80027" strokeWidth="51.2"/>
        </g>
    </svg>
);

export default FlagEn;