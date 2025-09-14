import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
    participants: {
        type: Array,
        required: true,
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Message',
        required: true,
    },
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

export default Conversation;