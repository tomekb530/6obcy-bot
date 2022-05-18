document.addEventListener('DOMContentLoaded', ()=>{
    var socket = io();
    var messagesbox = document.getElementById("messages");
    var reconnecttoggle = document.getElementById("reconnecttoggle");
    var lastping = 0;
    var usrcount = 0;
    setInterval(()=>{
        lastping = Date.now();
        socket.emit("ping");
    },500);

    socket.on("pong",(obcyping)=>{
        var now = Date.now();
        var ping = Date.now() - lastping;
        var status = document.getElementById("backendstatus");
        status.setAttribute("style","color:lime;");
        status.textContent = "Connected! (srv: "+ping+"ms 6obcy: "+obcyping+"ms usercount: "+usrcount+")";
        //console.log("Pong! ("+ping+"ms)");
    });

    socket.on('count',(count)=>{
        console.log(count);
        usrcount = count;
    });
    socket.on("talk_s1",(data)=>{
        var personinfo = document.getElementById("infodata1");
        personinfo.setAttribute("style","color:lime;");
        personinfo.textContent = "Connected!";
        messagesbox.insertAdjacentHTML("beforeend","<div class='message person1'>Person 1: <strong>Connected</strong></div><br>");
    });
    
    socket.on("talk_s2",(data)=>{
        var personinfo = document.getElementById("infodata2");
        personinfo.setAttribute("style","color:lime;");
        personinfo.textContent = "Connected!";
        messagesbox.insertAdjacentHTML("beforeend","<div class='message person2'>Person 2: <strong>Connected</strong></div><br>");
    });

    socket.on("search1",()=>{
        var personinfo = document.getElementById("infodata1");
        personinfo.setAttribute("style","color:yellow;");
        personinfo.textContent = "Searching...";
    });
    socket.on("search2",()=>{
        var personinfo = document.getElementById("infodata2");
        personinfo.setAttribute("style","color:yellow;");
        personinfo.textContent = "Searching...";
    });

    socket.on("sdis1",()=>{
        var personinfo = document.getElementById("infodata1");
        personinfo.setAttribute("style","color:red;");
        personinfo.textContent = "Disconnected";
        messagesbox.insertAdjacentHTML("beforeend","<div class='message person1'>Person 1: <strong>Disconnected</strong></div><br>");
        window.scrollBy(0,9999);
        if(reconnecttoggle.checked){
            socket.emit("newsearch1");
            messagesbox.insertAdjacentHTML("beforeend","<div class='message person1'>Person 1: <strong>New Search</strong></div><br>");
            window.scrollBy(0,9999);
        }
    });

    socket.on("sdis2",()=>{
        var personinfo = document.getElementById("infodata2");
        personinfo.setAttribute("style","color:red;");
        personinfo.textContent = "Disconnected";
        messagesbox.insertAdjacentHTML("beforeend","<div class='message person2'>Person 2: <strong>Disconnected</strong></div><br>");
        window.scrollBy(0,9999);
        if(reconnecttoggle.checked){
            socket.emit("newsearch2");
            messagesbox.insertAdjacentHTML("beforeend","<div class='message person2'>Person 2: <strong>New Search</strong></div><br>");
            window.scrollBy(0,9999);
        }
    });

    socket.on("rmsg1",(data)=>{
        messagesbox.insertAdjacentHTML("beforeend","<div class='message person1'>Person 1: "+data.msg+"</div><br>");
        window.scrollBy(0,99999);
    });
    
    socket.on("rmsg2",(data)=>{
        messagesbox.insertAdjacentHTML("beforeend","<div class='message person2'>Person 2: "+data.msg+"</div><br>");
        window.scrollBy(0,99999);
    });

    var search1 = document.getElementById("search1");
    var search2 = document.getElementById("search2");
    search1.onclick = ()=>{
        socket.emit("newsearch1");
        messagesbox.insertAdjacentHTML("beforeend","<div class='message person1'>Person 1: <strong>New Search</strong></div><br>");
        window.scrollBy(0,9999);
        
    };
    search2.onclick = ()=>{
        socket.emit("newsearch2");
        messagesbox.insertAdjacentHTML("beforeend","<div class='message person2'>Person 2: <strong>New Search</strong></div><br>");
        window.scrollBy(0,9999);
    };
    socket.on("captcha1",(data)=>{
        var captcha = document.getElementById("captcha1");
        var captchaimg = document.getElementById("captchaimg1");
        captchaimg.setAttribute("src",data);
        captcha.setAttribute("style","display:block;");
    });
    socket.on("captcha2",(data)=>{
        var captcha = document.getElementById("captcha2");
        var captchaimg = document.getElementById("captchaimg2");
        captchaimg.setAttribute("src",data);
        captcha.setAttribute("style","display:block;");
    });
    var captchasend1 = document.getElementById("captchas1");
    var captchasend2 = document.getElementById("captchas2");
    captchasend1.onclick = ()=>{
        socket.emit("captchas1",document.getElementById("captchainput1").value);
    };
    captchasend2.onclick = ()=>{
        socket.emit("captchas2",document.getElementById("captchainput2").value);
    };

    socket.on("capissol1",(data)=>{
        var captcha = document.getElementById("captcha1");
        if(data.success){
            captcha.setAttribute("style","display:none;");
        }
        var errel = document.getElementById("captchas1_error");
        errel.innerHTML = JSON.stringify(data);
    });

    socket.on("capissol2",(data)=>{
        var captcha = document.getElementById("captcha2");
        if(data.success){
            captcha.setAttribute("style","display:none;");
        }
        var errel = document.getElementById("captchas2_error");
        errel.innerHTML = JSON.stringify(data);
    });

    var personinput1 = document.getElementById("personinput1");
    var personinput2 = document.getElementById("personinput2");
    personinput1.addEventListener("keyup",event=>{
        if(event.key == "Enter"){
            socket.emit("personinput1",personinput1.value);
            messagesbox.insertAdjacentHTML("beforeend","<div class='message person1'>You: "+personinput1.value+"</div><br>");
            window.scrollBy(0,99999);
            personinput1.value = "";
            event.preventDefault();
        }
    });
    personinput2.addEventListener("keyup",event=>{
        if(event.key == "Enter"){
            socket.emit("personinput2",personinput2.value);
            messagesbox.insertAdjacentHTML("beforeend","<div class='message person2'>You: "+personinput2.value+"</div><br>");
            window.scrollBy(0,99999);
            personinput2.value = "";
            event.preventDefault();
        }
    });

    var relaytoggle = document.getElementById("relaytoggle");
    relaytoggle.checked = true;
    $("#relaytoggle").change(()=>{
        socket.emit("relaytoggle",relaytoggle.checked);
    });



    $('#relaytoggle').bootstrapToggle({
        on:"Relaying Enabled",
        off:"Relaying Disabled"
    });
    $('#reconnecttoggle').bootstrapToggle({
        on:"Reconnect Enabled",
        off:"Reconnect Disabled"
    });
    $("#translatetoggle1").bootstrapToggle({
        on:"Translation Enabled",
        off:"Translation Disabled"
    });
    $("#translatetoggle1").change(()=>{
        socket.emit("translationtoggle1",$("#translatetoggle1").prop("checked"));
    });
    $("#translatetoggle2").bootstrapToggle({
        on:"Translation Enabled",
        off:"Translation Disabled"
    });
    $("#translatetoggle2").change(()=>{
        socket.emit("translationtoggle2",$("#translatetoggle2").prop("checked"));
    });
    $("#translatetype1").bootstrapToggle({
        on:"Woman",
        off:"Man"
    });
    $("#translatetype1").change(()=>{
        socket.emit("translationtype1",$("#translatetype1").prop("checked"));
    });
    $("#translatetype2").bootstrapToggle({
        on:"Woman",
        off:"Man"
    });
    $("#translatetype2").change(()=>{
        socket.emit("translationtype2",$("#translatetype2").prop("checked"));
    });
});