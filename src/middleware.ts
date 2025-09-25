import {i18nRouter} from 'next-i18n-router';
import {NextRequest, NextResponse} from 'next/server';
import i18nConfig from '@/config/i18n';

function generateNonce(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const vercelLive = 'https://vercel.live';

    return [
        'default-src \'self\'',
        'base-uri \'self\'',
        `script-src 'self' ${isProduction ? `'unsafe-inline'` : `'nonce-${nonce}' ${vercelLive}`}`,
        'style-src \'self\' \'unsafe-inline\'',
        'img-src \'self\' data:',
        'font-src \'self\' data:',
        'connect-src \'self\'',
        !isProduction && `frame-src ${vercelLive}`,
        'object-src \'none\'',
        'frame-ancestors \'none\''
    ].filter(Boolean).join('; ');
}

export function middleware(request: NextRequest) {
    const response = i18nRouter(request, i18nConfig) as NextResponse;

    const nonce = generateNonce();
    const csp = buildCsp(nonce);

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('x-nonce', nonce);

    return response;
}

export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)'
};