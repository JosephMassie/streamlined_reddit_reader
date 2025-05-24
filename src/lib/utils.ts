import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parseHtml(a_html: string) {
    if (typeof a_html !== 'string') return '';
    const html = a_html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#34;/g, '"')
        .replace(/&#39;/g, "'");

    return html;
}

export const createMarkup = (unsafeHtml: string) => ({
    __html: unsafeHtml,
});
