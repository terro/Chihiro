function getCurrentTime()
{
    //获取当前时间，应该写成一个函数
    var now = new Date();
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var clock = '';
    if(month < 10)
        clock += "0";
    clock += month + "-";
    if(day < 10)
        clock += "0";
    clock += day + " ";
    if(hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return clock;
}

Ext.define('Chihiro.controller.Home', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            homeView: '#homeView'
        },
        control: {
            homeView: {
                activate: 'listening'
            }
        }
    },

    listening: function() {
        locateGeo();

        socket.on('friend request', function(user) {

            var clock = getCurrentTime();
            user.lastmsg = user.nickname + "想加您为好友！回复任意内容即可确认";
            user.lasttime = clock;
            Ext.getCmp('messagetab').tab.setBadgeText(++unreadMsg);
            var chattinglists = Ext.getCmp('ChattingFriends');
            var myChattingFriend = chattinglists.getData();
            var newuser = [user];
            if(myChattingFriend)
                for(i=0; i < myChattingFriend.length;i++){
                    newuser.push(myChattingFriend[i]);
                }

            chattinglists.setData([]);
            var store = chattinglists.getStore();
            store.load();
            chattinglists.setData(newuser);
        });

        socket.on('messages', function(msg) {
            var chattinglists = Ext.getCmp('ChattingFriends');
            var myChattingFriend = chattinglists.getData();
            for(var i = 0; i < friendList.length;i++)
            {
                if(friendList[i]._id === msg.from) {
                    friendList[i].lastmsg = msg.message;
                    friendList[i].lasttime = msg.time;
                }
            }

            if(msg.from === chattingID){
                var ChattingRecord = Ext.getCmp('ChattingContent').getData();
                ChattingRecord.push(
                    {
                        id: '',
                        image:'',
                        nickname:msg.nickname,
                        xindex:'1',
                        message:msg.message,
                        time:msg.time
                    });
                Ext.getCmp('ChattingContent').setData([]);
                if(Ext.getCmp('homeView').getActiveItem().title != '聊天') Ext.getCmp('messagetab').tab.setBadgeText(++unreadMsg);

                var store = Ext.getCmp('ChattingContent').getStore();
                store.load();
                Ext.getCmp('ChattingContent').setData(ChattingRecord);

                var scroller = Ext.getCmp('ChattingContent').getScrollable();
                scroller.getScroller().scrollToEnd();
            }
            else{
                if(Ext.getCmp('homeView').getActiveItem().title != '聊天') Ext.getCmp('messagetab').tab.setBadgeText(++unreadMsg);
                if(!friendList)
                    return;
                Ext.getCmp('ChattingFriends').setData([]);
                var store = Ext.getCmp('ChattingFriends').getStore();
                store.load();
                Ext.getCmp('ChattingFriends').setData(friendList);
            }
        });

        socket.on('topic', function(msg) {
            var chattinglists = Ext.getCmp('ChattingGroups');
            var myChattingGroup = chattinglists.getData();

            if(msg.uid === sid)
                return;

            for(var i = 0; i < myChattingGroup.length;i++)
            {
                if(myChattingGroup[i].id === msg.tid) {
                    myChattingGroup[i].lastmsg = msg.msg;
                    myChattingGroup[i].lasttime = msg.time;
                }
            }

            if(msg.tid === chattingID){
                var ChattingRecord = Ext.getCmp('GroupChattingContent').getData();
                ChattingRecord.push(
                    {
                        id: '',
                        image:'',
                        nickname:msg.nickname,
                        xindex:'1',
                        message:msg.msg,
                        time:''
                    });
                Ext.getCmp('GroupChattingContent').setData([]);
                if(Ext.getCmp('homeView').getActiveItem().title != '聊天') Ext.getCmp('messagetab').tab.setBadgeText(++unreadMsg);

                var store = Ext.getCmp('GroupChattingContent').getStore();
                store.load();
                Ext.getCmp('GroupChattingContent').setData(ChattingRecord);

                var scroller = Ext.getCmp('GroupChattingContent').getScrollable();
                scroller.getScroller().scrollToEnd();
            }
            else{
                console.log(myChattingGroup);
                if(Ext.getCmp('homeView').getActiveItem().title != '聊天') Ext.getCmp('messagetab').tab.setBadgeText(++unreadMsg);
                if(!myChattingGroup)
                    return;

                Ext.getCmp('ChattingGroups').setData([]);
                var store = Ext.getCmp('ChattingGroups').getStore();
                store.load();
                Ext.getCmp('ChattingGroups').setData(myChattingGroup);
            }
        });


        socket.on('friend confirmed', function(obj) {
            alert("friend confirmed");
            addFriendAndShow(obj);
        });
        socket.on('recommend activity', function(obj){
            if(obj.creator_id == sid){
                return;
            }
            Ext.Msg.confirm("附近有新活动：" + obj.name, '想去看看吗？', function(choice) {
                if(choice == 'yes') {
                    addActivityID = obj._id;
                    var user = obj;
                    user.data = user;
                    var view;
                    if(Ext.getCmp('activitydetail')) view = Ext.getCmp('activitydetail');
                    else view = Ext.create('Chihiro.view.activitylist.Detail');
                    Ext.getCmp('ParticipateBtn').setHidden(false);
                    Ext.getCmp('EditBtn').setHidden(true);
                    Ext.getCmp('QuitBtn').setHidden(true);
                    view.setUser(user);
                    view.updateUser(user);
                    if (!view.getParent()) {
                        Ext.Viewport.add(view);
                    }
                    view.show();
                }
            });
        });
        socket.on('recommend by interests', function(id) {
            socket.emit('get info by id',id,function(msg) {
                Ext.Msg.confirm(msg.obj.nickname + "和你有共同兴趣！", '想去加他为好友吗？', function(choice) {
                    if(choice == 'yes') {
                        addFriendID = id;
                        var user = msg.obj;
                        user.data = user;
                        console.log(user.data);
                        if(user.data.birthday){
                            var birthday = user.data.birthday.split('T');
                            birthday = birthday[0];
                        }
                        var view;
                        if(Ext.getCmp('DetailPanel')) view = Ext.getCmp('DetailPanel');
                        else view = Ext.create('Chihiro.view.userlist.Detail');
                        Ext.getCmp('addFriendBtn').setHidden(false);
                        Ext.getCmp('deleteFriendBtn').setHidden(true);
                        view.setUser(user);
                        view.updateUser(user);
                        if (!view.getParent()) {
                            Ext.Viewport.add(view);
                        }
                        view.show();
                    }
                });
            });
        });
    }
});
function locateGeo() {
    Ext.create('Ext.util.Geolocation', {
        autoUpdate: true,
        frequency: 300000,
        listeners: {
            locationupdate: function(geo) {
                socket.emit('update location', {
                    longitude: geo.getLongitude(),
                    latitude: geo.getLatitude()
                });
                myLocation=geo;
            }
        }
    })
};
function addFriendAndShow(obj)
{
    if(friendList != null){
        friendList.push(obj);
        Ext.getCmp('SimpleFriendList').setData([]);
        var store = Ext.getCmp('SimpleFriendList').getStore();
        store.load();
        Ext.getCmp('SimpleFriendList').setData(friendList);
    } else{
        Ext.getCmp('SimpleFriendList').setData(friendList);
    }
}