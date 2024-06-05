import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true }
});


const questionSchema = new mongoose.Schema({
    questionId: { type: Number, required: true },
    questionText: { type: String, required: true },
    numberOfTestCases: { type: Number, required: true },
    testCases: [testCaseSchema],
    examples: [{
        input: { type: mongoose.Schema.Types.Mixed, required: true },
        output: { type: String, required: true }
    }]
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
