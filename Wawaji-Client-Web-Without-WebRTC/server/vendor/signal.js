const request=require("request"),WebSocket=require("ws");Signal_=function(e){function n(e){var n,t,i;for(i=e.length;i;i--)n=Math.floor(Math.random()*i),t=e[i-1],e[i-1]=e[n],e[n]=t}function t(e,n,t){request({uri:e,method:"GET",timeout:n},function(e,n,i){e?"ETIMEDOUT"===e.code?t("timeout",""):t(e.code,""):t("",i)})}function i(e,n,t){var i=e.split(n,t),o=0;for(var s in i)o+=n.length+i[s].length;return i.push(e.substr(o)),i}this.lbs_url1=["https://lbs-1-sig.agora.io","https://lbs-2-sig.agora.io"],this.lbs_url2=["https://lbs-3-sig.agora.io","https://lbs-4-sig.agora.io"],this.vid=e,this.appid=e;var o=this,s=function(s,a){this.onLoginSuccess="",this.onLoginFailed="",this.onLogout="",this.onInviteReceived="",this.onMessageInstantReceive="",this.account=s,this.state="session_state_logining",this.line="",this.uid=0,this.dbg=!1;var l=this;l.lbs_state="requesting";var r=[];n(r),l.idx=0,l.socket=null;var c=function(){if(l.dbg){var e=[];for(var n in arguments)e.push(arguments[n]);console.log.apply(null,["Agora sig dbg :"].concat(e))}},h=function(e){return"wss://"+(e[0].replace(/\./g,"-")+"-sig-web.agora.io")+":"+(e[1]+1)+"/"};l.logout=function(){"session_state_logined"==l.state&&l.onLogout?l.call2("user_logout",{line:l.line},function(e,n){l.fire_logout(e),l.socket.close()}):"session_state_logining"==l.state&&l.fire_logout(0)},l.fire_logout=function(e){e||(e=0);try{"session_state_logined"==l.state&&l.onLogout&&l.onLogout(e)}catch(e){console.error(e)}finally{l.state="session_state_logout"}};var u=function(n,i,o){if("requesting"==l.lbs_state){t(i[o]+"/getaddr?vid="+e,5e3,function(e,t){if(e)n-1>0?u(n-1,i,(o+1)%i.length):l.fire_login_failed("lbs timeout");else{if("requesting"!=l.lbs_state)return;l.lbs_state="completed",r=JSON.parse(t).web,f(),f()}})}},f=function(){if("session_state_logining"==l.state)var n=new function(){var e=h(r[l.idx]);l.idx+=1;var t=new WebSocket(e);t.state="CONNECTING",setTimeout(function(){t.readyState!=t.CONNECTING||t.close()},6e3),t.onopen=function(e){if("session_state_logout"==l.state)t.close();else if("session_state_logining"==l.state){l.socket=n,t.state="OPEN",l.state="session_state_logined",c("on conn open"),l.go_login();for(var i in s)t.send(JSON.stringify(s[i]))}else"session_state_logined"==l.state&&t.close()},t.onclose=function(e){"OPEN"==t.state&&(o("_close",""),c("on conn close")),"CONNECTING"==t.state&&f()},t.onmessage=function(e){var n=e.data,t=JSON.parse(n);t[0];o(t[0],t[1])},t.onerror=function(e){t.state="CLOSED",l.idx<r.length&&e.target.readyState==e.target.CLOSED?f():(c("on conn error"),"session_state_logined"==l.state?l.fire_logout("conn error"):"session_state_logining"==l.state&&l.fire_login_failed("conn err"))};var i={},o=function(e,n){e in i&&i[e](n)},s=[];this.on=function(e,n){i[e]=n},this.emit=function(e,n){0!=t.readyState?t.send(JSON.stringify([e,n])):s.push([e,n])},this.close=function(){t.close()}};var t=0,o=function(){setTimeout(function(){"session_state_logined"==l.state&&(c("send ping",++t),l.socket.emit("ping",t),o())},1e4)};l.go_login=function(){""==l.line?(l.socket.emit("login",{vid:e,account:s,uid:0,token:a,device:"websdk",ip:""}),l.socket.on("login_ret",function(e){var n=e[0],t=JSON.parse(e[1]);if(c("login ret",n,t),n||"ok"!=t.result)try{l.onLoginFailed&&l.onLoginFailed(0)}catch(e){console.error(e)}else{l.uid=t.uid,l.line=t.line,l.state="session_state_logined",o(),S();try{l.onLoginSuccess&&l.onLoginSuccess(l.uid)}catch(e){console.error(e)}finally{C()}}})):l.socket.emit("line_login",{line:l.line});var n=0,t={},r={};l.call2=function(e,i,o){t[++n]=[e,i,o],c("call ",[e,n,i]),l.socket.emit("call2",[e,n,i])},l.socket.on("call2-ret",function(e){var n=e[0],i=e[1],o=e[2];if(n in t){var s=t[n][2];if(""==i)try{"ok"!=(o=JSON.parse(o)).result&&(i=o.data.result)}catch(e){i="wrong resp:"+o}s&&s(i,o)}});var h,u=function(e,n){return""==e},f=function(e){if(e.startsWith("msg-v2 ")){var n=i(e," ",6);if(7==n.length){return[n[1],n[4],n[6]]}}return null};l.socket.on("pong",function(e){c("recv pong")}),l.socket.on("close",function(e){l.fire_logout(0),l.socket.close()}),l.socket.on("_close",function(e){l.fire_logout(0)}),l.fire_login_failed=function(e){try{"session_state_logining"==l.state&&l.onLoginFailed&&l.onLoginFailed(0)}catch(e){console.error(e)}finally{l.state="session_state_logout"}};var g=function(e){var n=e,t=n[0],i=n[1],o=n[2];if("instant"==i)try{l.onMessageInstantReceive&&l.onMessageInstantReceive(t,0,o)}catch(e){console.error(e)}if(i.startsWith("voip_")){var s,a=JSON.parse(o),c=a.channel,h=a.peer,u=a.extra,f=a.peeruid;if("voip_invite"==i)s=new b(c,h,f,u),l.call2("voip_invite_ack",{line:l.line,channelName:c,peer:h,extra:""});else if(!(s=r[c+h]))return;if("voip_invite"==i)try{l.onInviteReceived&&l.onInviteReceived(s)}catch(e){console.error(e)}if("voip_invite_ack"==i)try{s.onInviteReceivedByPeer&&s.onInviteReceivedByPeer(u)}catch(e){console.error(e)}if("voip_invite_accept"==i)try{s.onInviteAcceptedByPeer&&s.onInviteAcceptedByPeer(u)}catch(e){console.error(e)}if("voip_invite_refuse"==i)try{s.onInviteRefusedByPeer&&s.onInviteRefusedByPeer(u)}catch(e){console.error(e)}if("voip_invite_failed"==i)try{s.onInviteFailed&&s.onInviteFailed(u)}catch(e){console.error(e)}if("voip_invite_bye"==i)try{s.onInviteEndByPeer&&s.onInviteEndByPeer(u)}catch(e){console.error(e)}if("voip_invite_msg"==i)try{s.onInviteMsg&&s.onInviteMsg(u)}catch(e){console.error(e)}}},v=function(){return Date.now()},_=0,d=0,p=0,m=0,y=0,I=!1,C=function(){I||(I=!0,l.call2("user_getmsg",{line:l.line,ver_clear:_,max:30},function(e,n){if(""==e){var t=n;_=t.ver_clear,p=_;for(var i in t.msgs){var o=t.msgs[i][0],s=t.msgs[i][1];g(f(s)),_=o}(30==t.msgs.length||_<d)&&C(),m=v()}I=!1,y=v()}))},N=function(){y=v()},S=function(){setTimeout(function(){if("session_state_logout"!=l.state){if("session_state_logined"==l.state){var e=v();p<_&&e-y>1e3?C():e-y>=6e4&&C()}S()}},100)};l.socket.on("notify",function(e){c("recv notify ",e),"string"==typeof e&&(e=(e=i(e," ",2)).slice(1));var n=e[0];if("channel2"==n){var t=e[1],o=e[2];if(0!=h.m_channel_msgid&&h.m_channel_msgid+1>o)return void c("ignore channel msg",t,o,h.m_channel_msgid);h.m_channel_msgid=o;var s=f(e[3]);if(s){s[0];var a=s[1],l=s[2],r=JSON.parse(l);if("channel_msg"==a)try{h.onMessageChannelReceive&&h.onMessageChannelReceive(r.account,r.uid,r.msg)}catch(n){console.error(n)}if("channel_user_join"==a)try{h.onChannelUserJoined&&h.onChannelUserJoined(r.account,r.uid)}catch(n){console.error(n)}if("channel_user_leave"==a)try{h.onChannelUserLeaved&&h.onChannelUserLeaved(r.account,r.uid)}catch(n){console.error(n)}if("channel_attr_update"==a)try{h.onChannelAttrUpdated&&h.onChannelAttrUpdated(r.name,r.value,r.type)}catch(n){console.error(n)}}}if("msg"==n&&(d=e[1],C()),"recvmsg"==n){var u=JSON.parse(e[1]),v=u[0],p=u[1];v==_+1?(g(f(p)),_=v,N()):(d=v,C())}}),l.messageInstantSend=function(e,n,t){l.call2("user_sendmsg",{line:l.line,peer:e,flag:"v1:E:3600",t:"instant",content:n},function(e,n){t&&t(!u(e,n))})},l.invoke=function(e,n,t){if(e.startsWith("io.agora.signal.")){var i=e.split(".")[3];n.line=l.line,l.call2(i,n,function(e,n){t&&t(e,n)})}};var b=function(e,n,t){this.onInviteReceivedByPeer="",this.onInviteAcceptedByPeer="",this.onInviteRefusedByPeer="",this.onInviteFailed="",this.onInviteEndByPeer="",this.onInviteEndByMyself="",this.onInviteMsg="";var i=this;this.channelName=e,this.peer=n,this.extra=t,r[e+n]=i,this.channelInviteUser2=function(){t=t||"",l.call2("voip_invite",{line:l.line,channelName:e,peer:n,extra:t},function(e,n){if(u(e,n));else try{i.onInviteFailed(e)}catch(e){console.error(e)}})},this.channelInviteAccept=function(t){t=t||"",l.call2("voip_invite_accept",{line:l.line,channelName:e,peer:n,extra:t})},this.channelInviteRefuse=function(t){t=t||"",l.call2("voip_invite_refuse",{line:l.line,channelName:e,peer:n,extra:t})},this.channelInviteDTMF=function(t){l.call2("voip_invite_msg",{line:l.line,channelName:e,peer:n,extra:JSON.stringify({msgtype:"dtmf",msgdata:t})})},this.channelInviteEnd=function(t){t=t||"",l.call2("voip_invite_bye",{line:l.line,channelName:e,peer:n,extra:t});try{i.onInviteEndByMyself&&i.onInviteEndByMyself("")}catch(e){console.error(e)}}};l.channelInviteUser2=function(e,n,t){var i=new b(e,n,t);return i.channelInviteUser2(),i},l.channelJoin=function(e){if("session_state_logined"==l.state)return h=new function(){this.onChannelJoined="",this.onChannelJoinFailed="",this.onChannelLeaved="",this.onChannelUserList="",this.onChannelUserJoined="",this.onChannelUserLeaved="",this.onChannelUserList="",this.onChannelAttrUpdated="",this.onMessageChannelReceive="",this.name=e,this.state="joining",this.m_channel_msgid=0,this.messageChannelSend=function(n,t){l.call2("channel_sendmsg",{line:l.line,name:e,msg:n},function(e,n){t&&t()})},this.channelLeave=function(n){l.call2("channel_leave",{line:l.line,name:e},function(e,t){if(h.state="leaved",n)n();else try{h.onChannelLeaved&&h.onChannelLeaved(0)}catch(e){console.error(e)}})},this.channelSetAttr=function(n,t,i){l.call2("channel_set_attr",{line:l.line,channel:e,name:n,value:t},function(e,n){i&&i()})},this.channelDelAttr=function(n,t){l.call2("channel_del_attr",{line:l.line,channel:e,name:n},function(e,n){t&&t()})},this.channelClearAttr=function(n){l.call2("channel_clear_attr",{line:l.line,channel:e},function(e,t){n&&n()})}},l.call2("channel_join",{line:l.line,name:e},function(e,n){if(""==e){h.state="joined";try{h.onChannelJoined&&h.onChannelJoined()}catch(e){console.error(e)}var t=n;try{h.onChannelUserList&&h.onChannelUserList(t.list)}catch(e){console.error(e)}try{if(h.onChannelAttrUpdated)for(var i in t.attrs)h.onChannelAttrUpdated("update",i,t.attrs[i])}catch(e){console.error(e)}}else try{h.onChannelJoinFailed&&h.onChannelJoinFailed(e)}catch(e){console.error(e)}}),h;c("You should log in first.")}}};n(o.lbs_url1),n(o.lbs_url2),u(2,o.lbs_url1,0),u(2,o.lbs_url2,0)};this.login=function(e,n){return new s(e,n)}},Signal=function(e){return new Signal_(e)},module.exports=Signal;