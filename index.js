const obcy = require("./6obcyConn.js");
var Obcy = require("./6obcyConn.js");
var io = require("./ui.js");
var translate = require("./translation.js");
var obcy1 = new Obcy();
var obcy2 = new Obcy();
var relaying = true;
var translation1 = false;
var translation2 = false;
var translationtype1 = false;
var translationtype2 = false;
console.log("Connecting to 6obcy..");
obcy1.init();
obcy2.init();
io.on("connection",(socket)=>{
    console.log("UI: New Connection");
    socket.on("ping",()=>{
        //console.log("[UI] Ping!");
        socket.emit("pong",obcy1.lastping);
    });
    socket.on("newsearch1",()=>{
        obcy1.reconnect();
        console.log("1: Searching!");
        socket.emit("search1");
    });
    socket.on("newsearch2",()=>{
        obcy2.reconnect();
        console.log("2: Searching!");
        socket.emit("search2");
    });
    socket.on("personinput1",txt=>{
        console.log("1: Sent: "+txt);
        obcy1.sendMessage(txt);
    });
    socket.on("personinput2",txt=>{
        console.log("2: Sent: "+txt);
        obcy2.sendMessage(txt);
    });
    socket.on("captchas1",txt=>{
        console.log("1: Captcha: "+txt);
        obcy1.sendCaptcha(txt);
    });
    socket.on("captchas2",txt=>{
        console.log("2: Captcha: "+txt);
        obcy2.sendCaptcha(txt);
    });
    socket.on("relaytoggle",checked=>{
        console.log("UI: Toggled Relaying");
        relaying = checked;
    });
    socket.on("translationtoggle1",checked=>{
        console.log("UI: Translation1",checked && "Enabled" || "Disabled");
        translation1 = checked;
    });
    socket.on("translationtoggle2",checked=>{
        console.log("UI: Translation2",checked && "Enabled" || "Disabled");
        translation2 = checked;
    });
    socket.on("translationtype1",checked=>{
        console.log("UI: Translation1 Type: "+(!checked && "Man" || "Woman"));
        translationtype1 = !checked;
    });
    socket.on("translationtype2",checked=>{
        console.log("UI: Translation2 Type: "+(!checked && "Man" || "Woman"));
        translationtype2 = !checked;
    });
    if(obcy1.connected){
        obcy1.pingtime = Date.now();
        obcy1.ws.send("2");
    }
});
obcy1.on("connected",()=>{
    console.log("1: Connected!");
    io.emit("conn1");
});
obcy1.on("cn_acc",()=>{
    console.log("1: Handshaked(?)");
    io.emit("cn_acc1");
});
obcy1.on("talk_s",(data)=>{
    console.log("1: New connection (ID: "+data.cid+")");
    io.emit("talk_s1",data);
});
obcy1.on("rmsg",(data)=>{
    console.log("1: Chat: "+data.msg);
    var oldmsg = data.msg;
    if(translation1){
        data.msg = data.msg +" ("+translate(data.msg,translationtype1)+")";
    }
    io.emit("rmsg1",data);
    data.msg = oldmsg;
    if(relaying){
        if(translation1){
            data.msg = translate(data.msg,translationtype1);
        }
        obcy2.sendMessage(data.msg);
    }
});
obcy1.on("sdis",()=>{
    console.log("1: Disconnected :(");
    io.emit("sdis1");
});
obcy1.on("count",data=>{
    io.emit("count",data);
});
obcy1.on("caprecvsas",data=>{
    io.emit("captcha1",data.tlce.data);
});
obcy1.on("capissol",data=>{
    console.log(data);
    io.emit("capissol1",data);
});
obcy2.on("connected",()=>{
    console.log("2: Connected!");
});
obcy2.on("cn_acc",()=>{
    console.log("2: Handshaked(?)");
    io.emit("cn_acc2");
});
obcy2.on("talk_s",(data)=>{
    console.log("2: New connection (ID: "+data.cid+")");
    io.emit("talk_s2",data);
});
obcy2.on("rmsg",(data)=>{
    console.log("2: Chat: "+data.msg);
    var oldmsg = data.msg;
    if(translation2){
        data.msg = data.msg +" ("+translate(data.msg,translationtype2)+")";
    }
    io.emit("rmsg2",data);
    data.msg = oldmsg;
    if(relaying){
        if(translation2){
            data.msg = translate(data.msg,translationtype2);
        }
        obcy1.sendMessage(data.msg);
    }
});
obcy2.on("sdis",()=>{
    console.log("2: Disconnected :(");
    io.emit("sdis2");
});
obcy2.on("caprecvsas",data=>{
    io.emit("captcha2",data.tlce.data);
});
//4{"ev_name":"capissol","ev_data":{"success":false,"wait":true}}
obcy2.on("capissol",data=>{
    console.log(data);
    io.emit("capissol2",data);
});