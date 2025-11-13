import { MongoClient } from mongodb;

export default class dbConnection{


    async testConnection(db){
        try {
            await db.command({ ping: 1 });
            console.log(`DB connected successfully`);
        } catch (ex) {
            console.log(`Error connecting because ${ex.message}`);
            process.exit(1);
        }
    }

    constructor(credentials){
        this.credentials = credentials;
        this.url = `mongodb+srv://${credentials.userName}:${credentials.password}@${credentials.hostname}`;
        this.client = new MongoClient(this.url);
        this.db = client.db('WorkCirle');
        this.testConnection(this.db);

        this.users = this.db.collection("users");
        this.chats = this.db.collection("chats");
        this.joinCodes = this.db.collection("joinCodes");
    }


    async isUsernameAvailable(username){
        return !(await this.users.find({ username : username }));
    }

    async createNewUser(username, passwordHash){
        if(!this.isUsernameAvailable(username)){
            return false;
        }
        const user = {username:username, passwordHash:passwordHash, chats: []};
        await this.users.insertOne(user);
        return true;
    }

    async addGuestUserToChat(username,chatID){
        await this.chats.updateOne({chatID:chatID}, {$push: {users:username}});
        return true;
    }

    async addUsertoChat(username, chatID){
        await this.users.updateOne({username:username}, { $addToSet : {chats : chatID}});
        await this.chats.updateOne({chatID:chatID}, {$addToSet : {users:username}});
        return true;
    }
    async removeUserChat(username, chatID){
        await this.users.updateOne({username:username}, { $pull : {chats:chatID}});
        await this.chats.updateOne({chatID:chatID}, {$pull : {users:username}});
        return true;
    }

    async getUser(username){
        return await this.users.findOne({username:username});
    }
    
    async getUserChats(username){
        return (await this.users.findOne({username:username})).chats;
    }

    async getPasswordHash(username){
        return (await this.users.findOne({username:username})).passwordHash;
    }

    async getJoinCodes(){   
        return await this.joinCodes.find();
    }

    async createNewChat(chatName, chatID, user, joinCode){
        
    }

    async getChatWithID(chatID){

    }

    async getChatWithJoinCode(joinCode){

    }

    async updateChatData(chatID, chatData){

    }

    async addChatMessage(username, message, chatID){

    }

    async deleteChat(username, chatID){

    }

    async #removeJoinCode(joinCode){

    }

}