import https from 'https'

// Define API request options
const options = {
    method: 'POST',
    hostname: 'online-code-compiler.p.rapidapi.com',
    path: '/v1/',
    headers: {
        'x-rapidapi-key': 'b281972eacmshaaa2e1b0ca39eddp194aa7jsndf1f297fa265',
        'x-rapidapi-host': 'online-code-compiler.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
};

// Function to compile code
function compileCode(req, res) {
    // Define API request payload
    const payload = JSON.stringify({
        language: req.body.language,
        version: 'latest',
        code: req.body.code,
        input: req.body.input || null
    });

    // Send API request
    const apiRequest = https.request(options, function (apiResponse) {
        // Collect response data
        const chunks = [];
        apiResponse.on('data', function (chunk) {
            chunks.push(chunk);
        });
        // Process response
        apiResponse.on('end', function () {
            const body = Buffer.concat(chunks);
            res.json(JSON.parse(body.toString()));
        });
    });

    // Handle request error
    apiRequest.on('error', function (error) {
        console.error('Request error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    // Send payload data
    apiRequest.write(payload);

    // End the request
    apiRequest.end();
}

export default compileCode;
