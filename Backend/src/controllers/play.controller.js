import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import Question from "../models/question.model.js";
import Play from "../models/play.model.js"; 

const findMatch = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.user;
        // Find another user in the matching state
        const matchUser = await User.findOne({ _id: { $ne: userId }, state: 'matching' });

        if (!matchUser) {
            await User.findByIdAndUpdate(userId, { state: 'matching' });
            return res.json({ success: false, message: 'Waiting for a match...' });
        }

        await User.findByIdAndUpdate(userId, { state: 'playing' });
        await User.findByIdAndUpdate(matchUser._id, { state: 'playing' });

        const question = await Question.aggregate([{ $sample: { size: 1 } }]);
        const play = new Play({
            question: question[0]._id,
            user1: userId,
            user2: matchUser._id
        });
        await play.save();

        await User.findByIdAndUpdate(userId, { play: play._id });
        await User.findByIdAndUpdate(matchUser._id, { play: play._id });

        res.json({ success: true, play });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export { findMatch };
