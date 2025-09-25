import {i18nRouter} from 'next-i18n-router';
import {NextRequest, NextResponse} from 'next/server';
import i18nConfig from '@/config/i18n';

function generateNonce(): string {
    return Buffer.from(crypto.randomUUID()).toString('base64');
}

function buildCsp(nonce: string): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const vercelLive = 'https://vercel.live';

    return [
        'default-src \'self\'',
        `script-src 'self' ${isProduction ? `'nonce-${nonce}' 'strict-dynamic'` : `'unsafe-inline'`}`,
        `style-src 'self' ${isProduction ? `'nonce-${nonce}'` : `'unsafe-inline'`}`,
        'img-src \'self\' data:',
        'font-src \'self\' data:',
        'object-src \'none\'',
        'base-uri \'self\'',
        'form-action \'self\'',
        'connect-src \'self\'',
        'frame-ancestors \'none\'',
        isProduction && `frame-src ${vercelLive}`
    ].filter(Boolean).join('; ');
}

export function middleware(request: NextRequest) {
    const nonce = generateNonce();
    const csp = buildCsp(nonce);

    const response = i18nRouter(request, i18nConfig) as NextResponse;

    response.headers.set('x-nonce', nonce);
    response.headers.set('Content-Security-Policy', csp);

    return response;
}

export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)'
};