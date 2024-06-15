import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import Question from "../models/question.model.js";
import Play from "../models/play.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const findMatch = asyncHandler(async (req, res) => {
    try {
        console.log('findMatch function called');
        console.log('req user : ',req.user);

        const { _id: userId } = req.user; // Access user ID using destructuring
        console.log('User ID:', userId);

        const user = await User.findById(userId);
        console.log('User found:', user);

        if (!user) {
            console.error('User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.state !== 'idle') {
            console.log('User is not idle:', user.state);
            return res.status(400).json({ success: false, message: 'User is already in a match' });
        }

        const matchUser = await User.findOne({ _id: { $ne: userId }, state: 'finding-match' });
        console.log('Match user found:', matchUser);

        if (!matchUser) {
            console.log('No matching user found. Updating user state to finding-match.');
            await User.findByIdAndUpdate(userId, { state: 'finding-match' });
            return res.json({ success: false, message: 'Waiting for a match...' });
        }

        console.log('Updating user states to pre-match.');
        await User.findByIdAndUpdate(userId, { state: 'pre-match' });
        await User.findByIdAndUpdate(matchUser._id, { state: 'pre-match' });

        const question = await Question.aggregate([{ $sample: { size: 1 } }]);
        console.log('Question selected:', question);

        if (!question || question.length === 0) {
            console.error('No question found');
            return res.status(500).json({ success: false, message: 'No question found' });
        }

        const play = new Play({
            question: question[0]._id,
            user1: userId,
            user2: matchUser._id,
            state: 'started'
        });
        await play.save();
        console.log('Play session created:', play);

        console.log('Updating users with play session and setting state to in-match.');
        await User.findByIdAndUpdate(userId, { play: play._id, state: 'in-match' });
        await User.findByIdAndUpdate(matchUser._id, { play: play._id, state: 'in-match' });

        setTimeout(async () => {
            console.log('2 minutes timer expired. Ending play session:', play._id);
            const playSession = await Play.findById(play._id).populate('user1 user2');
            console.log('Play session after timeout:', playSession);

            if (!playSession) {
                console.error('Play session not found');
                return;
            }

            playSession.state = 'finished';

            const user1Score = playSession.user1Result?.allTestsPassed ? 1 : 0;
            const user2Score = playSession.user2Result?.allTestsPassed ? 1 : 0;

            if (user1Score > user2Score) {
                playSession.winner = playSession.user1;
            } else if (user2Score > user1Score) {
                playSession.winner = playSession.user2;
            } else {
                playSession.winner = null; // It's a tie
            }

            await playSession.save();
            console.log('Play session updated with results:', playSession);

            console.log('Updating user states to idle.');
            await User.findByIdAndUpdate(playSession.user1._id, { state: 'idle' });
            await User.findByIdAndUpdate(playSession.user2._id, { state: 'idle' });
        }, 2 * 60 * 1000); // 2 minutes timer

        res.json({ success: true, play });
    } catch (error) {
        console.error('Error in findMatch function:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const abortMatch = asyncHandler(async(req,res)=>{
    try {
        const userId = req.user._id

        const deleteAbortedDoc = async() => {
            try {
                await Play.deleteOne({userId})
            } catch (error) {
                throw new ApiError(500,"Error in deleting the play document")
            }
        }
        // const DeletedDoc = await Play.findOne({userId}).select("-user1Result -user2Result -state -winner -createdAt")
        setTimeout(deleteAbortedDoc,10000);
        // new ApiResponse(200, DeletedDoc, "Play Doc would be deleted Successfully")
    } catch (error) {
        throw new ApiError(500,"Error in deleting the document")
    }
});

export { findMatch, abortMatch };
