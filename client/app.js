 //<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
});
//</debug>

Ext.application({
    controllers: ['SignIn', 'SignUp', 'Setting', 'List', 'Home', 'find.Find','find.Email','find.Phone',
        'contact.Contact', 'activity.Find', 'activity.Create', 'activity.Invite',
        'message.Message','message.ChatList','message.GroupList','message.Friend','message.Group','message.Other',
        'setting.Main','setting.Info','setting.Account','setting.Shortcut','setting.Status', 'setting.Privacy'],

    models: ['User', 'Message','ChattingFriends','ChattingGroups','ChattingContent','Activity','Contact'],

    name: 'Chihiro',

    requires: [
        'Ext.MessageBox'
    ],

    views: ['SignIn',
        'signup.Main', 'signup.InterestInfo', 'signup.OptionalInfo', 'signup.RequiredInfo',
        'Home',
        'message.List',
        'contact.List',
        'activity.List', 'activity.BasicActivityInfo','activity.Create','activity.DetailActivityInfo','activity.MapLocate',
        'activitylist.BasicInformation','activitylist.Detail','activitylist.DetailInformation','activitylist.List','activitylist.ListItem','activitylist.Map',
        'activitylist.InviteToActivity',
        'find.Main', 'find.Email', 'find.Phone', 'find.Contact', 'find.Nearby',
        'setting.Main',
        'userlist.List', 'userlist.MyList','userlist.Detail','userlist.GroupDetail', 'userlist.ListItem','userlist.SimpleFriendList',
        'message.List','message.GroupList','message.Groups','message.ChatList','message.ChatListItem','message.Friends','message.Content',
        'message.Sentence','message.ChattingFriendData','message.ChattingGroupData','message.ChattingGroupPanel','message.ChattingFriendPanel','message.GroupContent',
        'message.other.Nickname','message.other.Canvas','message.other.InviteToGroup','message.GroupListItem', 'message.other.GroupInfoModify'
    ],

    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },

    phoneStartupScreen: 'resources/loading/Homescreen.png',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.png',

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        Ext.create('Chihiro.view.Home');

        // Initialize the signin view
        Ext.Viewport.add(Ext.create('Chihiro.view.SignIn'));

        Ext.Viewport.getLayout().setAnimation({
            type: 'pop'
        });
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});
