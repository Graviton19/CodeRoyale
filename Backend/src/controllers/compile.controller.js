import axios from 'axios';
import qs from 'qs';

async function compileCode(req, res) {
    try {
        console.log('Compilation request received:', req.body);

        const { code, language, input } = req.body;
        const requestData = qs.stringify({
            code: code,
            language: language,
            input: input || ''
        });
        console.log('Request data:', requestData);

        const config = {
            method: 'post',
            url: 'https://api.codex.jaagrav.in',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: requestData
        };

        console.log('Sending compilation request to Codex API...');
        const response = await axios(config);

        console.log('Compilation successful. Response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error occurred during compilation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default compileCode;
