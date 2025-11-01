




export default class testDB{


    constructor(credentials){
        this.credentials = credentials;
        this.users = [];
        this.chats = {};
        this.joinCodes = [];
    }

    isUsernameAvailable(username){
        return !this.users.some((user) => user.username === username);
    }

    //return true when successfully created
    createNewUser(username, passwordHash){
        if(!this.isUsernameAvailable(username)){
            return false;
        }   
        this.users.push({username:username, passwordHash:passwordHash, chats:[]})
        return true;
    }

    updateUserChats(username, chatID){
        this.users[username]?.chats?.push(chatID);
    }

    getUserChats(username){
        return this.users[username]?.chats;
    }

    getPasswordHash(username){
        const user = this.users.find((user) => user.username === username);
        return user?.passwordHash;
    }

    getJoinCodes(){
        return this.joinCodes;    
    }

    createNewChat(chatName, chatID, user, joinCode){
        this.chats[chatID] = {owner:user, joinCode:joinCode, chatName:chatName, messages:[], users:[owner.username]};
        this.joinCodes.push(joinCode);
        return chats[chatID];
    }

    getChatWithID(chatID){
        return this.chats[chatID];
    }

    getChatWithJoinCode(joinCode){
        const id = Object.keys(this.chats).find((id) => this.chats[id].joinCode === joinCode);
        if(!id){return undefined;}
        return this.chats[id];
    }

    updateChatData(chatID, chatData){
        this.chats[chatID] = chatData;
        return true;
    }

    addChatMessage(username, message, chatID){
        const chat = this.chats[chatID];
        if(username in chat.users ){chat.messages.push(message);return true}
        return false;
    }

    deleteChat(username, chatID){
        const chat = this.chats[chatID];
        if (!chat) return false;
        if (username !== chat.owner) return false;
        this.#removeJoinCode(this.chats[chatID].joinCode)
        delete this.chats[chatID];
        return true;
    }

    #removeJoinCode(joinCode){
        const idx = this.joinCodes.indexOf(joinCode);
        if(idx === -1){return false;}
        this.joinCodes.splice(idx,1);
        return true;
    }

}