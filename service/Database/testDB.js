




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
        const user = {username:username, passwordHash:passwordHash, chats:[]};
        this.users.push(user)
        return user;
    }

    addUserChats(username, chatID){
        this.users[username]?.chats?.push(chatID);
    }
    removeUserChat(username, chatID){
        const idx = this.users[username]?.chats?.indexOf(chatID);
        this.users[username]?.chats?.splice(idx,1);
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
        this.chats[chatID] = {owner:user, joinCode:joinCode, title:chatName, messages:[], users:[user.username]};
        user.chats.push(chatID);
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