import axios from 'axios';
import qs from 'qs';

// Hardcoded predefined input string
const predefinedInput = "3\n1 2\n3 4\n5 6";

async function makeCodexRequest(code, language) {
    const requestData = qs.stringify({
        code,
        language,
        input: predefinedInput || ''
    });

    const config = {
        method: 'post',
        url: 'https://api.codex.jaagrav.in',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: requestData
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

async function compileCode(req, res) {
    try {
        console.log('Compilation request received:', req.body);
        const { code, language } = req.body;
        const result = await makeCodexRequest(code, language);
        console.log('Compilation successful. Response:', result);
        res.json(result);
    } catch (error) {
        console.error('Error occurred during compilation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function submitCode(req, res) {
    try {
        console.log('Submission request received:', req.body);
        const { code, language } = req.body;
        const result = await makeCodexRequest(code, language);
        console.log('Submission successful. Response:', result);
        res.json(result);
    } catch (error) {
        console.error('Error occurred during submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export { compileCode, submitCode };
