import Message from '.././db/models/messageModel.js'
import Conversation from '.././db/models/conversationModel.js'

export const fetchMessage = async(sender, receiver)=> {
    const conversationData = await Conversation.findOne({
        participants: {
            $all: [sender, receiver]}
    }).populate('messages')

    if (conversationData) {
        const messages = conversationData.messages
        return messages
    } else {
        return "no messages"
    }
}

export const saveMessage = async(sender, receiver, msg)=> {
    // Save message to database
    const message = new Message( {
        sender,
        receiver,
        message: msg
    })
    const result = await message.save()

    const conversationData = await Conversation.findOne({
        participants: {
            $all: [sender, receiver]}
    })
    let conversationRes
    // Create new document if not exists
    if (!conversationData) {
        const conversation = new Conversation( {
            participants: [sender, receiver],
            messages: [result._id]
        })

        conversationRes = await conversation.save()
    }
    // Otherwise append to the existing document
    else {
        conversationRes = await Conversation.updateOne(
            {
                _id: conversationData._id
            },
            {
                $push: {
                    messages: result._id
                }
            }
        );
    }
}