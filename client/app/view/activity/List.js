Ext.define('Chihiro.view.activity.List', {
    extend: 'Ext.Carousel',

    xtype: 'activitypanel',
    id: 'activitypanel',

    requires: [
        'Ext.data.Store',
        'Ext.dataview.List'
    ],
    config: {
        scrollable: true,
        items:[
            {
                xtype: 'toolbar',
                ui: 'dark',
                docked: 'top',
                scrollable: false,
                //title: '活动',
                items:[
                    {
                        docked: 'left',
                        iconCls: 'refresh',
                        iconMask: true,
                        ui: 'plain',
                        action: 'refreshList'
                    },
                    {
                        xtype: 'segmentedbutton',
                        id:'activitygroup',
                        allowDepress: false,
                        //docked:'mid',
                        items: [
                            {
                                text: '附近活动',
                                pressed: true
                            },
                            {
                                text: '我发起的活动'
                            },
                            {
                                text: '我参加的活动'
                            }
                        ]
                    },
                    {
                        docked: 'right',
                        iconCls: 'add',
                        iconMask: true,
                        ui: 'plain',
                        action: 'createActivity'
                    }
                ]
            },
            {
                xtype: 'activitylist',
                id: 'nearactivitylist',
                title: '附近活动'
            },
            {
                xtype: 'activitylist',
                id: 'sponseactivitylist',
                title: '我发起的活动'
            },
            {
                xtype: 'activitylist',
                id: 'participateactivitylist',
                title: '我参加的活动'
            }
        ]
    }
});