import axios from 'axios';
import qs from 'qs';
import { User } from '../models/user.models.js';
import Play from '../models/play.model.js';
import Question from '../models/question.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { EloCalculator } from '../utils/EloRatings.js';

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

async function submitCode(req, res) {
    console.log('submitCode function started');
    try {
        const { _id: userId } = req.user;
        const { code, language } = req.body;
        console.log(`User ID: ${userId}, Code: ${code}, Language: ${language}`);

        const user = await User.findById(userId).populate('play');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User found:', user);

        const play = await Play.findById(user.play);
        if (!play || play.state !== 'started') {
            console.log('Game has ended or not started yet');
            return res.status(400).json({ error: 'Game has ended or not started yet' });
        }
        console.log('Play found and started:', play);

        // Check if the play session is finished
        if (play.state === 'finished') {
            console.log('Play session is finished, cannot submit code');
            return res.status(400).json({ error: 'Play session is finished, cannot submit code' });
        }

        const question = await Question.findById(play.question);
        if (!question) {
            console.log('Question not found in play session');
            return res.status(404).json({ error: 'Question not found in play session' });
        }
        console.log('Question found:', question);

        let PassedCount = 0;
        const testResults = [];
        const testsNotPassed = [];
        for (const testCase of question.testCases) {
            console.log(`Running test case with input: ${testCase.input}`);
            const result = await makeCodexRequest(code, language, testCase.input);
            const testPassed = result.output.trim() === testCase.output.trim();
            if (testPassed) {
                PassedCount++;
            } else {
                testsNotPassed.push({
                    input: testCase.input
                });
            }
            testResults.push({
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: result.output,
                passed: testPassed,
            });
        }

        const currentTime = new Date();
        if (play.user1.toString() === userId) {
            play.user1SubmissionTime = currentTime;
        } else {
            play.user2SubmissionTime = currentTime;
        }

        const userField = play.user1.toString() === userId ? 'user1Result' : 'user2Result';
        play[userField] = {
            allTestsPassed: testResults.every(test => test.passed),
            testResults,
            NoOfTestCasesPassed: PassedCount,
            testsNotPassed,
        };
        await play.save();
        console.log('Play updated with test results:', play);
        const user1Result = play.user1Result;
        const user2Result = play.user2Result;

        if (user1Result && user2Result) {
            if (user1Result.allTestsPassed && user2Result.allTestsPassed) {
                let winner;
                if (play.user1SubmissionTime < play.user2SubmissionTime) {
                    winner = "user1";
                } else if (play.user1SubmissionTime > play.user2SubmissionTime) {
                    winner = "user2";
                } else {
                    winner = 'draw';
                }

                play.state = 'finished';
                play.winner = winner;

                const A = await User.findById(play.user1);
                const B = await User.findById(play.user2);
                const { NewRatingA, NewRatingB } = EloCalculator(A.rating, B.rating, winner);
                A.rating = NewRatingA;
                B.rating = NewRatingB;
                await A.save({ validateBeforeSave: false });
                await B.save({ validateBeforeSave: false });
                await play.save();
                console.log('Winner determined and play session finished:', play);
            }
        }

        res.json({ success: true, play });
    } catch (error) {
        console.error('Error in submitCode:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function compileCode(req, res) {
    try {
        const { code, language, input } = req.body;

        if (!code || !language || !input) {
            return res.status(400).json({ error: 'Code, language, and input are required' });
        }

        const result = await makeCodexRequest(code, language, input);
        res.json(result);
    } catch (error) {
        console.error('Error in compileCode:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export { compileCode, submitCode };
