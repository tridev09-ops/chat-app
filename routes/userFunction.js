import User from '.././db/models/userModel.js'
import Conversation from '.././db/models/conversationModel.js'

export const fetchUser = async()=> {
    const userData = await User.find({}, {
        name: 1
    })

    return userData
}

export const fetchConversation = async(username)=> {
    const conversationData = await Conversation.find({
        participants: username
    }, {
        participants: 1
    })

    return conversationData
}