import bcrypt from "bcrypt";

export default class verifyAuth{

    constructor(dbConnecion){
        this.dbConnecion = dbConnecion;
        this.sessionTokens = {};
        this.guestTokens = {};
    }

    async verifyCredentials(username,password){
        const pwHash = this.dbConnecion.getPasswordHash(username);
        if(!pwHash) return false;
        const isValid = await bcrypt.compare(password, pwHash);
        if(isValid){
           return this.#generateSessionToken(username);
        }
        return false;
    }

    

    #generateSessionToken(user){
        const token = crypto.randomUUID();
        this.sessionTokens[token] = user;
        return token;
    }

    verifySessionToken(token){
        return this.sessionTokens.hasOwnProperty(token);
    }

    endSession(token){
        delete this.sessionTokens[token];
    }

    generateGuestToken(guestName){
        const token = crypto.randomUUID();
        this.guestTokens[token] = guestName;
        return token;
    }
    verifyGuestToken(token){
        return this.guestTokens.hasOwnProperty(token);
    }
    endGuestSession(token){
        delete this.guestTokens[token];
    }
}