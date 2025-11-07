
const MIN_PASSWORD_LENGTH = 5;
const MAX_PASSWORD_LENGTH = 20;

const REGEX_CONTAIN_CAPITAL = /[A-Z]/;
const REGEX_CONTAIN_LOWERCASE = /[a-z]/;
const REGEX_CONTAIN_NUMBER = /[0-9]/;
const REGEX_CONTAIN_SYMBOL = /[!?><@#$%^&*()]/;

export default function verifyValidPassword(password){
    const reasons = [];
    if (password.length < MIN_PASSWORD_LENGTH){
        reasons.push(`Password is too short. Must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    } 
    if (password.length > MAX_PASSWORD_LENGTH){
        reasons.push(`Password is too long. Must be at most ${MAX_PASSWORD_LENGTH} characters long.`);
    } 
    if(!REGEX_CONTAIN_CAPITAL.test(password)){
        reasons.push("Password must contain an uppercase letter");
    }
    if(!REGEX_CONTAIN_LOWERCASE.test(password)){
        reasons.push("Password must contain a lowercase letter");
    }
    if(!REGEX_CONTAIN_NUMBER.test(password)){
        reasons.push("Password must contain a number");
    }
    if(!REGEX_CONTAIN_SYMBOL.test(password)){
        reasons.push("Password must contain one of these symbols !?><@#$%^&*()");
    }
    return {valid:reasons.length==0, reasons:reasons};
}