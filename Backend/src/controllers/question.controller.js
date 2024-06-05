import Question from '../models/question.model.js';

export const addQuestion = async (req, res) => {
    try {
        const { questionId, questionText, examples, testCases, numberOfTestCases } = req.body;

        // Log the request body
        console.log('Request Body:', req.body);

        // Create a new question document
        const newQuestion = new Question({
            questionId,
            questionText,
            examples,
            testCases,
            numberOfTestCases
        });

        // Log the new question object before saving
        console.log('New Question Object:', newQuestion);

        // Save the new question to the database
        const savedQuestion = await newQuestion.save();

        // Log the saved question object
        console.log('Saved Question:', savedQuestion);

        // Send a success response
        res.status(201).json({ message: 'Question saved successfully', question: savedQuestion });
    } catch (error) {
        // Log the error
        console.error('Error saving question:', error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(({ message }) => message);
            console.log('Validation Errors:', validationErrors);
            return res.status(400).json({ error: validationErrors });
        }
        
        // Handle other errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
