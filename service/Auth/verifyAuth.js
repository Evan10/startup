import bcrypt from "bcrypt";

export default class verifyAuth{

    constructor(dbConnecion){
        this.dbConnecion = dbConnecion;
        this.sessionTokens = {};
    }

    async verifyCredentials(username,password){
        const pwHash = this.dbConnecion.getPasswordHash(username);
        if(!pwHash) return false;
        const isValid = await bcrypt.compare(password, pwHash);
        if(isValid){
           return generateSessionToken(username);
        }
        return false;
    }

    generateSessionToken(user){
        const token = crypto.randomUUID();
        this.sessionTokens[user] = token;
        return token;
    }

    verifySessionToken(user, token){
        return this.sessionTokens[user] === token;
    }
}