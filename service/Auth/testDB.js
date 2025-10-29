




export default class testDB{


    constructor(credentials){
        this.credentials = credentials;
        this.users = [];
        this.chats = {};

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
        return {};    
    }

    createNewChat(chatName, chatID, user, join_code){
        return false;
    }

    getChatData(username, chatID, startTime = null, endTime = null){
        return {};
    }

    updateChatData(chatID, chatData){
        return false;
    }

    deleteChat(username, chatID){
        return false;
    }

}