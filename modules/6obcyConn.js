const WebSocket = require("ws");
const EventEmitter = require("events");
class obcy extends EventEmitter{
constructor(){
    super();
    this.connected = false;
    this.ceid = 0;
    this.idn = 0;
    this.ckey = undefined;
    this.discb = undefined;
}


init(){
    var randport = Math.floor(Math.random()*9);
    this.ws = new WebSocket(
        // Dostępne porty od 7001 do 7010
        
        "wss://server.6obcy.pl:"+(7001+randport)+"/6eio/?EIO=3&transport=websocket",
        {
            origin: "https://6obcy.org",
        }
    );

    this.ws.on("open",()=>{
        this.emit("connected");
    });
    this.pingtime = 0;
    this.lastping = 0;
    this.ws.on("message", (data)=>{
        if(data != "3"){
            var parseddata = JSON.parse(data.substring(1));
            //console.log(data)
            if(parseddata.pingInterval){
                setInterval(()=>{
                    this.ws.send("2");
                    this.pingtime = Date.now();
                },parseddata.pingInterval);
            }
            if(parseddata.ev_name == "cn_acc"){
                var authdata = {"ev_name":"_cinfo","ev_data":{"hash":parseddata.ev_data.hash,"dpa":true,"caper":true}};
                this.ws.send("4"+JSON.stringify(authdata));
            }
            if(parseddata.ev_name == "talk_s"){
                this.ckey = parseddata.ev_data.ckey;
                console.log(this.ckey);
                this.cid = parseddata.ev_data.cid;
                var ackeddata = {"ev_name":"_begacked","ev_data":{"ckey":this.ckey},"ceid":this.ceid};
                this.ceid = this.ceid + 1;
                this.idn = 0;
                this.ws.send("4"+JSON.stringify(ackeddata));
            }
            if(parseddata.ev_name == "count"){
                this.count = parseddata.ev_data.count;
            }
            if(parseddata.ev_name == "sdis"){
                this.ckey = undefined;
                this.connected = false;
                if(this.discb){
                    this.discb();
                    this.discb = undefined;
                }
            }
            
            this.emit(parseddata.ev_name,parseddata.ev_data);
        }else{
            this.lastping = Date.now() - this.pingtime;
        }
    });
}
disconnect(cb){
    if(this.ckey){
        console.log("disc",this.ckey);
        var disdata = {"ev_name":"_distalk","ev_data":{"ckey":this.ckey},"ceid":this.ceid};
        this.ws.send("4"+JSON.stringify(disdata));
        this.ckey = undefined;
        this.connected = false;
        this.discb = cb;
    }
}
reconnect(){
    if(this.ckey && this.discb == undefined){
        this.disconnect(this.searchPerson);
    }else{
        this.searchPerson();
    }
}
sendMessage(txt){
    if(this.ckey){
        var msgdata = {"ev_name":"_pmsg","ev_data":{"ckey":this.ckey,"msg":txt,"idn":this.idn},"ceid":this.ceid};
        this.ws.send("4"+JSON.stringify(msgdata));
        this.ceid = this.ceid + 1;
        this.idn = this.idn + 1;
    }
}
sendCaptcha(txt){
    //{"ev_name":"_capsol","ev_data":{"solution":"geng"}}
    var msgdata = {"ev_name":"_capsol","ev_data":{"solution":txt}};
    this.ws.send("4"+JSON.stringify(msgdata));
}
searchPerson(){
    var data = {"ev_name":"_sas","ev_data":{"channel":"main","myself":{"sex":0,"loc":0},"preferences":{"sex":0,"loc":0}},"ceid":this.ceid};
    if(this.ckey == undefined && !this.connected){
        this.ws.send("4"+JSON.stringify(data));
        this.ceid = this.ceid + 1;
    }
    
}
}
module.exports = obcy;