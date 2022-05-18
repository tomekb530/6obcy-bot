var imiona = require("./names.js");
var translationman = {
    "łeś":"łaś",
    "łem":"łam",
    "k ":"m ",
    "szy": "sza",
    "lem": "lam",
    "leś": "laś",
    "les": "les",
};
var punctuation = [",",".","!","?",":",";","-","_","(",")","[","]","{","}","<",">","/","\\","\"","'","=","+","*","&","^","%","$","#","@","~","`","|"," ","\n","\t","\r"];
Object.keys(translationman).forEach(key=>{
    punctuation.forEach(punc=>{
        translationman[key+punc] = translationman[key]+punc;
    });
});
Object.keys(translationman).forEach(key=>{
    punctuation.forEach(punc=>{
        translationman[key.toUpperCase()] = translationman[key].toUpperCase();
    });
});
var translationwoman = {};
Object.keys(translationman).forEach(key=>{
    translationwoman[translationman[key]] = key;
});
var patternwoman = /[kK]([0-9]+)/gm;
var patternman = /[mM]([0-9]+)/gm;
function translate(words,toman){
    if(words == "M" && !toman)
        return "K";
    if(words == "m" && !toman)
        return "k";
    if(words == "k" && toman)
        return "m";
    if(words == "K" && toman)
        return "M"; // DONT BULLY ME
    var translation;
    var final = "";
    if(toman){
        translation = translationwoman;
    }else{
        translation = translationman;
    }
    words = words.split(" ");
    words.forEach(word=>{
        Object.keys(translation).forEach(key=>{
            if(word.endsWith(key)){
                word = word.replace(key,translation[key]);
            }
            if(word == "m" && !toman){
                word = "k";
            }
            if(word == "M" && !toman){
                word = "K";
            }
            if(toman){
                word = word.replace(patternwoman,"m$1");
            }
            if(!toman){
                word = word.replace(patternman,"k$1");
            }
        });
        if(imiona[0].includes(word) && !toman){
            word = imiona[3][Math.floor(Math.random()*imiona[3].length)];
        }else if(imiona[1].includes(word) && toman){
            word = imiona[2][Math.floor(Math.random()*imiona[2].length)];
        }
        final += word+" ";
    });
    return final;
}
//console.log(translate("Cześć jestem Marcin mam 18 lat dzisiaj byłem na uczelni i jadłem obiad",false));
module.exports = translate;
