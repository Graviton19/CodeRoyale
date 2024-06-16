import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import Question from "../models/question.model.js";
import Play from "../models/play.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const findMatch = asyncHandler(async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.state !== 'idle') {
            return res.status(400).json({ success: false, message: 'User is already in a match' });
        }

        const matchUser = await User.findOne({ _id: { $ne: userId }, state: 'finding-match' });

        if (!matchUser) {
            await User.findByIdAndUpdate(userId, { state: 'finding-match' });
            return res.json({ success: false, message: 'Waiting for a match...' });
        }

        await User.findByIdAndUpdate(userId, { state: 'pre-match' });
        await User.findByIdAndUpdate(matchUser._id, { state: 'pre-match' });

        const question = await Question.aggregate([{ $sample: { size: 1 } }]);

        if (!question || question.length === 0) {
            return res.status(500).json({ success: false, message: 'No question found' });
        }

        const play = new Play({
            question: question[0]._id,
            user1: userId,
            user2: matchUser._id,
            state: 'pre-match'
        });
        await play.save();

        await User.findByIdAndUpdate(userId, { state: 'in-match', play: play._id });
        await User.findByIdAndUpdate(matchUser._id, { state: 'in-match', play: play._id });

        // Set timeout to transition to 'started' after 30 seconds
        setTimeout(async () => {
            const playSession = await Play.findById(play._id);

            if (!playSession) {
                console.error('Play session not found');
                return;
            }

            if (playSession.state === 'pre-match') {
                playSession.state = 'started';
                await playSession.save();
            }
        }, 30 * 1000); // 30 seconds timer

        // Set timeout to force finish after 5 minutes if still in 'started'
        setTimeout(async () => {
            const playSession = await Play.findById(play._id);

            if (!playSession) {
                console.error('Play session not found');
                return;
            }

            if (playSession.state === 'started') {
                playSession.state = 'finished';
                await playSession.save();

                // Move play session to history for both users
                await User.findByIdAndUpdate(playSession.user1, { state: 'idle', $addToSet: { history: playSession._id } });
                await User.findByIdAndUpdate(playSession.user2, { state: 'idle', $addToSet: { history: playSession._id } });
            }
        }, 1 * 60 * 1000); // 5 minutes timer

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
