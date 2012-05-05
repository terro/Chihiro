Ext.define('Chihiro.view.activity.BasicActivityInfo',{
    extend: 'Ext.form.Panel',
    xtype: 'basicactivityinfo',
    config:{
        title: '基本信息',
        items:[
            {
                xtype:'fieldset',
                id:'basicActivityField',
                defaults:{
                    required:true,
                    allowBlank:false
                },
                items:[
                    {
                        xtype:'textfield',
                        name:'name',
                        label:'名称',
                        placeHolder:'请输入活动名称'
                    },
                    {
                        xtype: 'datepickerfield',
                        label: '日期',
                        name: 'date',
                        dateFormat: 'Y/m/d/',
                        value: new Date(),
                        picker: {
                            yearFrom: new Date().getFullYear(),
                            yearTo: new Date().getFullYear()+2
                        }
                    },
                    {
                        xtype: 'panel',
                        name: 'time',
                        layout: 'hbox',
                        items:[
                            {
                                xtype: 'textfield',
                                name: 'starttime',
                                label: '起始时间',
                                placeHolder: '00:00',
                                flex: 1
                            },
                            {
                                xtype: 'textfield',
                                name: 'endtime',
                                label: '结束时间',
                                placeHolder: '00:00',
                                flex: 1
                            }
                        ]
                    },
                    {
                        xtype:'textfield',
                        name:'location',
                        label:'地点'
                    },
                    {
                        xtype:'textfield',
                        name: 'cost',
                        label:'花费'
                    },
                    {
                        xtype:'textfield',
                        name:'type',
                        label:'类型'
                    }
                ]
            },
            {
                xtype:'panel',
                layout:'hbox',
                defaults:{
                    xtype:'button',
                    flex:1,
                    width:'40%'
                },
                items:[
                    {
                        text:'确定',
                        ui:'confirm',
                        left:'10%',
                        enabled:false,
                        action: 'toMapLocate'
                    },
                    {
                        text:'返回',
                        ui:'decline',
                        right:'10%',
                        action: 'backToActivityList'
                    }
                ]
            }
        ]
    }
})