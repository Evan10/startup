import bcrypt from "bcrypt";

export default class verifyAuth{

    constructor(dbConnecion){
        this.dbConnecion = dbConnecion;
    }

    async verifyAuth(username,password){
        const pwHash = this.dbConnecion.getPasswordHash(username);
        if(!pwHash) return false;
        return (await bcrypt.compare(password, pwHash)) == true;
    }

}