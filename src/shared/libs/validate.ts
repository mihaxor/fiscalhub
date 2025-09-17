export const

    validateStrictLength = (value: string, length: number) =>
        !value || length === 0 ? value : value.length <= length ? value : value.substring(0, length - 3),

    validateMaxWords = (value: string, max: number) =>
        !value ? value : value.split(/\s+/).length <= max ? value : value.split(/\s+/).slice(0, max).join(' ');
