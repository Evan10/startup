import { MongoClient } from "mongodb";

export default class dbConnection{
    JOIN_CODE_ARRAY_ID = "joinCodes";

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
        this.db = this.client.db('WorkCirle');
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
        const user = await this.users.findOne({username:username});
        return user?.chats;
    }


    async getPasswordHash(username){
        return (await this.users.findOne({username:username})).passwordHash;
    }

    async getJoinCodes(){   
        return await this.joinCodes.findOne({_id:this.JOIN_CODE_ARRAY_ID}).joinCodes;
    }

    async createNewChat(chatName, chatID, user, joinCode){
        const chat = {owner:user.username, chatID:chatID, joinCode:joinCode, title:chatName, messages:[], users:[user.username]};
        await this.joinCodes.updateOne({_id:this.JOIN_CODE_ARRAY_ID},{$push:{joinCodes : joinCode}}, { upsert: true } )
        await this.chats.insertOne(chat);
        await this.users.updateOne({username:user.username}, {$addToSet : {chats: chatID}});
        return chatID;
    }

    async getChatWithID(chatID){
        return await this.chats.findOne({chatID:chatID});
    }

    
    async getManyChatTitlesWithIDs(chatIDs){
        return await this.chats.find({chatID :{$in: chatIDs }}, {projection : {chatID:1, title: 1, _id:0}}).toArray();
    }

    async getChatWithJoinCode(joinCode){
        return await this.chats.findOne({joinCode:joinCode});
    }

    async updateChatData(chatID, chatData){
        await this.chats.replaceOne({chatID:chatID}, chatData);
        return true;
    }

    async addChatMessage(username, message, chatID){
        const result = await this.chats.updateOne({chatID:chatID, users:username}, {$push:{messages:message}});
        return result.modifiedCount != 0;
    }

    async deleteChat(username, chatID){
        const chat = await this.chats.findOneAndDelete({chatID:chatID, owner:username});
        if(!chat) return false;
        await this.#removeJoinCode(chat.joinCode);
        return true;
    }

    async #removeJoinCode(joinCode){
        await this.joinCodes.updateOne({_id:this.JOIN_CODE_ARRAY_ID}, {$pull:{joinCodes : joinCode}})
    }

}