
import Message from "./Message";
import User from "./User";

export default interface Conversation {
    _id?: string
    conversationLink: string
    isPublic?:boolean
    subject?:string
    users: User[]
    messages: Message[]
    hasNewMessage?: boolean
}