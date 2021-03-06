Ext.define('Chihiro.view.setting.Main', {
    extend: 'Ext.navigation.View',

    xtype: 'settingpanel',
    id:'settingpanel',

    requires: [
        'Ext.data.Store',
        'Ext.dataview.List'
    ],

    config: {
        defaultBackButtonText: '返回',
        items:[
            {
                title: '设置',
                xtype: 'list',
                layout:'fit',
                ui:'round',
                disableSelection: true,
                grouped:true,
                pinHeaders:false,

                store: {
                    fields: ['text', 'sort','func'],
                    sorters:'sort',
                    grouper:function(record){
                        return record.get('sort');
                    },

                    data: [
                        { text: '个人名片', sort:' ',func: 'Info'},
                        { text: '兴趣签名', sort:' ',func: 'Status'},
                        { text: '我的帐户', sort:' ',func: 'Account'},
                        { text: '选择头像', sort:' ',func: 'Shortcut'},
                        //{ text: '推送', sort:'  ',func: 'Push' },
                        { text: '隐私', sort:'  ',func: 'Privacy' }
                    ]
                },
                itemTpl: '<div class="contact"><strong>{text}</strong></div>',
//
//                onItemDisclosure: function(record, btn, index) {
//                    Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
//                },

                listeners: {
                    itemtap: function(view, index, target, record) {
                        var panel = Ext.create('Chihiro.view.setting.' + record.get('func'), {
                            title: record.get('text')
                        });
                        if(index == 4){
                            Ext.getCmp('geoVisible').setValue(profile.privacy);
                            if(!(profile.requireConfirm == '0'))
                                Ext.getCmp('friendverify').setChecked(true);
                            else
                                Ext.getCmp('friendverify').setChecked(false);
                            console.log(Ext.getCmp('friendverify'));
                        }
                        if(panel.isXType('formpanel')) panel.setValues(profile);
                        panel.fireEvent('show',panel);
                        this.parent.push(panel);
                    }
                }
            },
            {
                xtype: 'button',
                id:'logout',
                docked: 'bottom',
                text: '退出登录',
                ui: 'decline',
                margin: '5 10 15 10',
                action: 'logout'
            }
        ]
    }
});