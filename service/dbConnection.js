import {MongoClient} from mongodb;

export default class dbConnection{

    constructor(credentials){
        this.credentials = credentials;
        this.url = `mongodb+srv://${credentials.userName}:${credentials.password}@${credentials.hostname}`;
        this.client = new MongoClient(this.url);
        this.db = client.db('WorkCirle');
        this.users = this.db.collection("users");
        this.chats = this.db.collection("chats");
    }


    isUsernameAvailable(username){
        return false;
    }

    //return true when successfully created
    createNewUser(username, passwordHash){
        return false;
    }

    getPasswordHash(username){
        // get hash from db
        return null;
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