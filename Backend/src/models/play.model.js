import mongoose from 'mongoose';

const { Schema } = mongoose;

const playSchema = new Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user1Result: { type: Object },
    user2Result: { type: Object },
    user1SubmissionTime: {
        type: Date,
        default: null
    },
    user2SubmissionTime: {
        type: Date,
        default: null
    },
    state: {
        type: String,
        enum: ['pre-match', 'started', 'finished', 'aborted'],
        default: 'pre-match'
    },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Play', playSchema);
