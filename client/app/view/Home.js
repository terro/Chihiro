/**
 * Created by JetBrains WebStorm.
 * User: jacklyne
 * Date: 12-3-26
 * Time: 上午12:22
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Chihiro.view.Home', {
    extend: 'Ext.tab.Panel',
    xtype: 'homeView',
    config: {
        fullscreen:true,
        tabBarPosition:'bottom',
        items:[
            {
                xtype: 'navigationview',
                title:'消息',
                iconCls:'star',
                items:[
                    {
                        title: '消息'
//                        xtype:'titlebar',
//                        docked:'top',
//                        title:'新鲜事',
//                        items:[
//                            {
//                                iconCls:'refresh',
//                                align:'right'
//                            }
//                        ]
                    }
                ]
            },
            {
                title:'活动',
                items:[
                    {
                        xtype:'titlebar',
                        docked:'top',
                        title:'活动'
                    }
                ]
            },
            {
                title:'通讯录',
                items:[
                    {
                        xtype:'titlebar',
                        docked:'top',
                        title:'通讯录',
                        items:[
                            {
                                iconCls:'user',
                                align:'right'
                            }
                        ]
                    }
                ]
            },
            {
                xclass: 'Chihiro.view.FindFriend',
                title:'找朋友',
                iconCls:'search'
            },
            {
                xclass: 'Chihiro.view.Settings',
                title:'设置',
                iconCls:'settings'
            }
        ]
    }

})