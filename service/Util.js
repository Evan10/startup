
const DEFAULT_CHARS = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";

export function generateRandomString(length = 6, CHARS = DEFAULT_CHARS){
    let str = "";
    while(code.length < length){
        str+=CHARS.at(Math.floor(Math.random()*CHARS.length));
    }
    return str;
}
