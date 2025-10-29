




export default class testDB{


    constructor(credentials){
        this.credentials = credentials;
        this.users = [];
        this.chats = {};
        this.joinCodes = [];
    }

    isUsernameAvailable(username){
        return !this.users.find((user) => user.username === username);
    }

    //return true when successfully created
    createNewUser(username, passwordHash){
        if(!isUsernameAvailable(username)){
            return false;
        }   
        this.users.push({username:username, passwordHash:passwordHash})
        return true;
    }

    getPasswordHash(username){
        const user = this.users.find((user) => user.username === username);
        return user?.passwordHash;
    }



    getJoinCodes(){
        return this.joinCodes;    
    }

    createNewChat(chatName, chatID, user, joinCode){
        this.chats[chatID] = {owner:user, joinCode:joinCode, chatName:chatName, messages:[]};
        this.joinCodes.push(joinCode);
        return true;
    }

    getChatWithID(chatID){
        return this.chats[id];
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

    deleteChat(username, chatID){
        const chat = this.chats[chatID];
        if (username !== chat.owner){
            return false;
        }
        return delete this.chats[chatID]; // returns true if there was a chat to delete and false if it didnt exist
    }

}