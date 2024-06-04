export const DB_NAME = "dev_CodeRoyale"

export const requestData = qs.stringify({
    code: code,
    language: language,
    input: input || ''
});

export const config = {
    method: 'post',
    url: 'https://api.codex.jaagrav.in',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: requestData
};