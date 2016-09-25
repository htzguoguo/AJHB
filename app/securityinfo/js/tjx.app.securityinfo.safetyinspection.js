/**
 * Created by Administrator on 2016/1/15.
 */
/*
 * module_template.js
 * Template for browser feature modules
 */
/*jslint browser : true, continue : true,
 devel : true, indent : 2, maxerr : 50,
 newcap : true, nomen : true, plusplus : true,
 regexp : true, sloppy : true, vars : false,
 white : true
 */
/*global $, tjx */
tjx.app.securityinfo.safetyinspection = (function () {
//---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            settable_map : { color_name: true },
            color_name : 'blue'
        },
        stateMap = {
            $container : null,
            validator : null,
            is_new : false,
            is_modal : false
        },
        jqueryMap = {},
        setJqueryMap, configModule, initModule,
        onSumitData, onCancelData, onSuccess,
        onFail, setFormValidate, setDeviceNames,
        onGetDeviceNamesData,
        onInitForm,
        onInitSuccess,
        onEditData,
        onEditSuccess
        ;
//----------------- END MODULE SCOPE VARIABLES ---------------
//------------------- BEGIN UTILITY METHODS ------------------
// example : getTrimmedString
    // help-block has-error help-block-error
    setFormValidate = function () {

        var error1 = $('.alert-danger', jqueryMap.$form);
        var success1 = $('.alert-success', jqueryMap.$form);
        stateMap.validator =  jqueryMap.$form.validate(
            {
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                ignore: "",  // validate all fields including form hidden input
                rules : {
                    EquipmentName : {
                        required: true
                    },
                    DetectionTime : {
                        required: true
                    },
                    ExpirationDate : {
                        required: true
                    }
                },
                messages : {
                    EquipmentName : {
                        required: '请输入设备设施名称'
                    },
                    DetectionTime : {
                        required: '请输入检测时间'
                    },
                    ExpirationDate : {
                        required: '请输入有效期限'
                    }
                },
                invalidHandler: function (event, validator) { //display error alert on form submit
                    success1.hide();
                    error1.show();
                    //jqueryMap.$form.scrollTo(error1, -200);
                    tjx.util.ui.scrollTo($(error1, jqueryMap.$form), -200);
                    // tjx.util.ui.scrollTo($('.has-error', jqueryMap.$form), -200);
                    // tjx.util.ui.scrollTo($('.has-error', jqueryMap.$form) , -200);

                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').addClass('has-error'); // set error class to the control group

                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                    label
                        .closest('.form-group').removeClass('has-error'); // set success class to the control group
                },

                submitHandler: function (form) {
                    success1.show();
                    error1.hide();
                    // onSumitData();
                }
            }
        );
    }
//-------------------- END UTILITY METHODS -------------------
//--------------------- BEGIN DOM METHODS --------------------

    setDeviceNames = function () {
        var name = tjx.shell.currentUserChsName();
        var arg_map = {
            data : name,
            success : onGetDeviceNamesData,
            fail : onFail
        };
        tjx.data.equipment.getDeviceNames( arg_map );
    }

    onGetDeviceNamesData = function ( data ) {
       if ( data ){
           if ( data.length > 0 ){
               for ( var i = 0; i < data.length; i++ ){
                   jqueryMap.$devices.append("<option value=\'" + data[i] +  "\'>" +  data[i] + "</option>");
               }
           }
       }
    }

// Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container : $container,
            $form : $container.find( '.form-horizontal' ),
            $formbody : $container.find( '.form-body' ),
            $send : $container.find( '#ok' ),
            $cancel : $container.find( '#cancel' ),
            $caption : $container.find( '.caption' ),
            $devices : $container.find( '*[tjx-data-field = EquipmentName]')
        };
    };
// End DOM method /setJqueryMap/
//---------------------- END DOM METHODS ---------------------
//------------------- BEGIN EVENT HANDLERS -------------------
// example: onClickButton = ...
    onSumitData = function ( event ) {
        // event.preventDefault();
        if (jqueryMap.$form.validate().form()){
            var data = tjx.util.getValuesFromFormInput( jqueryMap.$formbody );
            var arg_map = {
                data : data,
                success : onSuccess,
                fail : onFail
            };
            tjx.data.safetyinspection.addSafetyInspection( arg_map );
        }

    }

    onCancelData = function ( event ) {
        var val =   jqueryMap.$form.validate();
        //  console.log('validate', val.validate());

    }

    onSuccess = function ( data  ) {
        if ( data.IsSuccess ){
            tjx.util.ui.showSuccess( '系统提示' , '安全设施（设备）检测登记完成。');
            if ( stateMap.is_modal ){
                $.gevent.publish( 'table-update', [ {} ]);
            }else {
                jqueryMap.$cancel.trigger("click");
            }
        }else{
            tjx.util.ui.showAlert( '系统提示' , '安全设施（设备）检测登记不成功，请重试。');
        }
    }

    onFail = function ( data ) {

    }

    onInitForm = function (  ) {
        var arg_map = {
            data : { key : tjx.table.getSelectedKey() },
            success : onInitSuccess,
            fail : onFail
        };
        tjx.data.safetyinspection.getSafetyInspection( arg_map );
    }

    onInitSuccess = function ( data ) {
        tjx.util.setFormValuesFromData( jqueryMap.$formbody, data );
    }

    onEditData = function ( event ) {
        // event.preventDefault();
        var data = tjx.util.getValuesFromFormInput( jqueryMap.$formbody );
        var arg_map = {
            key : tjx.table.getSelectedKey(),
            data : data,
            success : onEditSuccess,
            fail : onFail
        };
        
        tjx.data.safetyinspection.updateSafetyInspection( arg_map );
    }

    onEditSuccess = function ( data ) {
        if ( data.IsSuccess ){
            tjx.util.ui.showSuccess( '系统提示' , '安全设施（设备）检测更新完成。');
            $.gevent.publish( 'table-update', [ {} ]);
        }else{
            tjx.util.ui.showAlert( '系统提示' , '安全设施（设备）检测更新不成功，请重试。');
        }
    }

//-------------------- END EVENT HANDLERS --------------------
//------------------- BEGIN PUBLIC METHODS -------------------
// Begin public method /configModule/
// Purpose : Adjust configuration of allowed keys
// Arguments : A map of settable keys and values
// * color_name - color to use
// Settings :
// * configMap.settable_map declares allowed keys
// Returns : true
// Throws : none
//
    configModule = function ( input_map ) {
        spa.butil.setConfigMap({
            input_map : input_map,
            settable_map : configMap.settable_map,
            config_map : configMap
        });
        return true;
    };
// End public method /configModule/
// Begin public method /initModule/
// Purpose : Initializes module
// Arguments :
// * $container the jquery element used by this feature
// Returns : true
// Throws : nonaccidental
//
    initModule = function ( $container , isnew, ismodal) {
        stateMap.$container = $container;
        setJqueryMap();
        setFormValidate();
        setDeviceNames();
        stateMap.is_new = isnew;
        stateMap.is_modal = ismodal;
        if ( stateMap.is_new ) {
            if ( ! stateMap.is_modal ){
                jqueryMap.$caption.append( tjx.index3.getTitle() );
            }
            $.fn.datepicker.defaults.language = 'zh-CN';
            if (jQuery().datepicker) {
                $('.date-picker').datepicker({
                    rtl: false,
                    orientation: "left",
                    autoclose: true
                });
            }
            jqueryMap.$send.bind( 'click', onSumitData );
        }
        else
        {
            onInitForm();
            jqueryMap.$send.bind( 'click', onEditData );
        }

        // jqueryMap.$cancel.bind( 'click', onCancelData );

        return true;
    };
// End public method /initModule/
// return public methods
    return {
        configModule : configModule,
        initModule : initModule
    };
//------------------- END PUBLIC METHODS ---------------------
}());


