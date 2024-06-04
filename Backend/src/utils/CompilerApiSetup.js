import axios from 'axios';
import qs from 'qs';
import { requestData } from '../constants.js';
import { config } from "../constants.js";

async function compileCode(req, res) {
    try {
        const { code, language, input } = req.body;
        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        console.error('Request error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default compileCode;



// import https from 'https'

// // Define API request options
// const options = {
//     method: 'POST',
//     hostname: 'online-code-compiler.p.rapidapi.com',
//     path: '/v1/',
//     headers: {
//         'x-rapidapi-key': (`${process.env.RAPID_API_KEY}`),
//         'x-rapidapi-host': 'online-code-compiler.p.rapidapi.com',
//         'Content-Type': 'application/json'
//     }
// };

// // Function to compile code
// function compileCode(req, res) {
//     // Define API request payload
//     const payload = JSON.stringify({
//         language: req.body.language,
//         version: 'latest',
//         code: req.body.code,
//         input: req.body.input || null
//     });

//     // Send API request
//     const apiRequest = https.request(options, function (apiResponse) {
//         // Collect response data
//         const chunks = [];
//         apiResponse.on('data', function (chunk) {
//             chunks.push(chunk);
//         });
//         // Process response
//         apiResponse.on('end', function () {
//             const body = Buffer.concat(chunks);
//             res.json(JSON.parse(body.toString()));
//         });
//     });

//     // Handle request error
//     apiRequest.on('error', function (error) {
//         console.error('Request error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     });

//     // Send payload data
//     apiRequest.write(payload);

//     // End the request
//     apiRequest.end();
// }

// export default compileCode;
