import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
    'p',
    'br',
    'strong',
    'em',
    'b',
    'i',
    'u',
    'ul',
    'ol',
    'li',
    'h2',
    'h3',
    'h4',
    'a',
    'blockquote',
    'div',
    'span',
];

const ALLOWED_ATTR = ['href', 'title', 'id', 'class', 'target', 'rel'];

export function sanitizeHtml(dirty) {
    if (!dirty) {
        return '';
    }

    return DOMPurify.sanitize(String(dirty), {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: false,
    });
}
