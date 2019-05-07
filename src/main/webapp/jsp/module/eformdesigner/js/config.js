/**
 * 电子表单设计配置
 */
EformConfig = {
    formdesignPath: "avicit/platform6/eform/formdesign",
    contentCssPath: "avicit/platform6/eform/formdesign/css/tinymce-content",
    dropitems: [
        {
            name: '基础控件',
            group: ['label-box','text-box', 'date-box', 'number-box', 'textarea-box', 'select-box', 'radio-box', 'check-box','secret-box','autocode-box','custom-select-box']
        },
        {
            name: '高级控件',
            group: ['rtf-box','currency-box','dictionary-box','user-box', 'dept-box', 'org-box','role-box','group-box', 'position-box', 'marco-box', 'linkage-box','datatable', 'url-box', 'fileupload-box', 'bpmopinion-box','photo-box','dbfield-box','virtual-box','form-box']
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