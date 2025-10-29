

export default class dbConnection{

    constructor(credentials){
        this.credentials = credentials;
    }


    isUsernameAvailable(username){
        return false;
    }

    


    getPasswordHash(username){
        // get hash from db
        return null;
    }
}