import React from 'react';

const FlagRo = (): React.ReactNode => (
    <svg viewBox="0 0 512 512" className="w-5.5 h-5.5 rounded-md">
        <defs>
            <clipPath id="clip-ro">
                <rect x="0" y="0" width="512" height="512" rx="51.2" ry="51.2"/>
            </clipPath>
        </defs>
        <g clipPath="url(#clip-ro)">
            <rect x="0" y="0" width="512" height="512" fill="#0052b4"/>
            <rect x="170.67" y="0" width="170.66" height="512" fill="#ffda44"/>
            <rect x="341.33" y="0" width="170.67" height="512" fill="#d80027"/>
        </g>
    </svg>
);

export default FlagRo;