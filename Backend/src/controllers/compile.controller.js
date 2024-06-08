import axios from 'axios';
import qs from 'qs';
import { User } from '../models/user.models.js';
import Play from '../models/play.model.js';
import Question from '../models/question.model.js'; // Import Question model

// Function to send code to Codex API for compilation and execution
async function makeCodexRequest(code, language, input) {
    const requestData = qs.stringify({
        code,
        language,
        input
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

// Function to compile and run user code, then compare output with expected results
async function submitCode(req, res) {
    try {
        console.log('Submission request received:', req.body);
        const { userId, code, language } = req.body;

        // Find the user and their current play session
        const user = await User.findById(userId).populate('play');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const play = await Play.findById(user.play);
        if (!play) {
            return res.status(404).json({ error: 'Play session not found for user' });
        }

        // Populate the question details from the play session
        const question = await Question.findById(play.question);
        if (!question) {
            return res.status(404).json({ error: 'Question not found in play session' });
        }

        const testCases = question.testCases;
        let allTestsPassed = true;
        let testResults = [];

        for (const testCase of testCases) {
            // Send the code and input to Codex for execution
            const result = await makeCodexRequest(code, language, testCase.input);

            // Compare the output with the expected output
            const testPassed = result.output.trim() === testCase.output.trim();
            if (!testPassed) {
                allTestsPassed = false;
            }

            // Add the result of this test case to the testResults array
            testResults.push({
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: result.output,
                passed: testPassed
            });
        }

        // Determine which user's results to save in the Play model
        const userField = play.user1.toString() === userId ? 'user1Result' : 'user2Result';
        play[userField] = { allTestsPassed, testResults };
        await play.save();

        // Set the user's state to idle
        user.state = 'idle';
        await user.save();

        // Respond with the play session details, including the test results
        res.json({ success: true, play });
    } catch (error) {
        console.error('Error occurred during code submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to compile code with a specific input
async function compileCode(req, res) {
    try {
        console.log('Compilation request received:', req.body);
        const { code, language, input } = req.body;
        const result = await makeCodexRequest(code, language, input);
        console.log('Compilation successful. Response:', result);
        res.json(result);
    } catch (error) {
        console.error('Error occurred during compilation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export { compileCode, submitCode };
