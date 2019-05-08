/**
 * 电子表单设计配置
 */
EformConfig = {
    formdesignPath: "jsp/module/eformdesigner",
    contentCssPath: "jsp/module/eformdesigner/css/tinymce-content",
    dropitems: [
        {
            name: '基础控件',
            group: ['label-box','text-box', 'date-box', 'number-box', 'textarea-box', 'select-box', 'radio-box',
                'check-box','linkage-box','virtual-box','datatable','fileupload-box'
            ]
        }
    ],
    tinymceContentStyle: [
        //default样式必须存在
        {
            styleName: "default",
            showText: "默认样式",
            showIcon: "ace-icon fa fa-css3 bigger-200"
        },
        {
            styleName: "document",
            showText: "信纸样式",
            showIcon: "ace-icon fa fa-file-word-o bigger-200"
        }
    ]
};