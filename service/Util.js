


export function generateJoinCode(length = 6){
    const CHARS = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    let code = "";
    while(code.length < length){
        code+=CHARS.at(Math.floor(Math.random()*CHARS.length));
    }
    return code;
}