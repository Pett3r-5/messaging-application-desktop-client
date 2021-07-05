export enum ChatState {
    OPTIONS,
    OPENED,
    CLOSED
  }
  
 export interface Display {
    chatState: ChatState
  }
  
 export interface UserState {
    clientId: string
    name: string
  }