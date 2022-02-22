export const cookieToJSON = (cookie: string) => {
    if (!cookie) return {};

    return cookie.split('; ').reduce((prev: any, current) => {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
    }, {});
}

export const URLParameterBuilder = (data: any) => Object.keys(data).map((key) => [key, data[key]].map(encodeURIComponent).join('=')).join('&');