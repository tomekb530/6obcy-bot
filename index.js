const obcy = require("./6obcyConn.js");
var Obcy = require("./6obcyConn.js");
var io = require("./ui.js");
var obcy1 = new Obcy();
var obcy2 = new Obcy();
var relaying = true;
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
        if(obcy1.ckey){
            obcy1.disconnect(()=>{
                obcy1.searchPerson();
                console.log("1: Searching!");
                socket.emit("search1");
            });
        }else{
            obcy1.searchPerson();
            console.log("1: Searching!");
            socket.emit("search1");
        }
    });
    socket.on("newsearch2",()=>{
        if(obcy2.ckey){
            obcy2.disconnect(()=>{
                obcy2.searchPerson();
                console.log("2: Searching!");
                socket.emit("search2");
            });
        }else{
            obcy2.searchPerson();
            console.log("2: Searching!");
            socket.emit("search2");
        }
    });
    socket.on("personinput1",txt=>{
        console.log("1: Sent: "+txt);
        obcy1.sendMessage(txt);
    });
    socket.on("personinput2",txt=>{
        console.log("2: Sent: "+txt);
        obcy2.sendMessage(txt);
    });
    socket.on("relaytoggle",checked=>{
        console.log("UI: Toggled Relaying");
        relaying = checked;
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
    console.log("1: New connection (ID: "+data.cid+" CKey: "+data.ckey+")");
    io.emit("talk_s1",data);
});
obcy1.on("rmsg",(data)=>{
    console.log("1: Chat: "+data.msg);
    io.emit("rmsg1",data);
    if(relaying)
        obcy2.sendMessage(data.msg);
});
obcy1.on("sdis",()=>{
    console.log("1: Disconnected :(");
    io.emit("sdis1");
});
obcy1.on("count",data=>{
    io.emit("count",data);
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
    io.emit("rmsg2",data);
    if(relaying)
        obcy1.sendMessage(data.msg);
});
obcy2.on("sdis",()=>{
    console.log("2: Disconnected :(");
    io.emit("sdis2");
});