(function($) {

//Scripts for Sitecor 9.1 Forms
function hideFormLabel(field) {
    var formLabel = $("label[for='" + field.attr("id") + "']");

    if (field.val().length > 0) {
        formLabel.addClass('completed');
    } else {
        formLabel.removeClass('completed');
    }
}

function hasError(field){
    if(field.hasClass('input-validation-error')){
        field.parent('.form-field').addClass('has-error');
    }else{
        field.parent('.form-field').removeClass('has-error');
    }
}

function iCheck (){
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional

    });
    }

    function manageHelpText(status, field) {
        var $helpField = field.next('.form-field'),
            $helpText = $helpField.find('.help-block');

        if ($helpText) {
            if (status === true) {
                $helpText.slideDown(300);
                $helpField.addClass('help-block-wrapper');
            } else {
                $helpText.slideUp(300);
                $helpField.removeClass('help-block-wrapper');
            }
        }
    }

function inputFocus() {
    var $inputFields = $('.form-field');

    $inputFields.each(function () {
        var $field = $(this),
        $list =  $field.find('.scfEmailBorder, .scfSingleLineTextBorder, .scfTelephoneBorder, .scfDroplistBorder, .scfMultipleLineTextBorder, .scfCheckboxBorder');

        if($field.find('.scfEmailBorder, .scfSingleLineTextBorder, .scfTelephoneBorder').length){
            $field.addClass('single-lineT-text');
        } else if ($field.find('select').length) {
            $field.addClass('dropdown-list');
        } else if ($field.find('.scfMultipleLineTextBorder').length) {
            $field.addClass('text-area');
        } else if ($field.find('.scfCheckboxBorder, .scfCheckBoxListBorder').length) {
            $field.addClass('check-box');
        }

        $list.focus(function () {
            $field.addClass('active');
            hasError($list);

            manageHelpText(true, $field);
        });
        
        $list.blur(function () {
            $field.removeClass('active');
            
            hideFormLabel($list);
            hasError($list);

            manageHelpText(false, $field);
        });

        if ($list.is('select')) {
            $list.change(function () {
                if ($(this).val() !== '') {
                    $field.removeClass('active');
                    hideFormLabel($list);
                    hasError($list);
                } else {
                    $field.addClass('active');
                }

            });
        }

        $list.keyup(function() {
            if($list.hasClass('valid')){
                $list.addClass('has-success');
            }else{
                $list.removeClass('has-success');
            }
        });
    });
}
    //display validate message
    function displayValidate(list) {
        var $dropdown = list,
            dataAttr = $($dropdown).data('val-required'),
            $errorMsgSpan = $dropdown.parents('.form-field').find('.field-validation-valid');

        if (dataAttr !== undefined) {
            if ($dropdown.val() == '') {
                $errorMsgSpan.empty().append('<span>' + dataAttr + '</span>').addClass('field-validation-error');
                list.parent().parent().removeClass('valid');
            } else {
                $errorMsgSpan.empty().removeClass('field-validation-error');
                list.parent().parent().addClass('valid');
            }
        }
    }

    $(document).ready(function () {
        var $form = $('.container.field-set').parent('form');

        $form.find('.hiddenCountryForSelectState').parent().addClass('hiddenSelectState');

        if ($('.form-field').length) {
            inputFocus();
            iCheck();
        }

        $form.find('input[type="submit"]').click(function () {
            $form.find('select').each(function () {
                if ($(this).parent().parent().is(':visible')) {
                    displayValidate($(this));
                } else {
                    $(this).val('Select-State');
                }
            });
        });

        $('.recaptcha-label').parent().addClass('recaptcha-label-wrapper');

        if ($('.form-field').length) {
            $('.consumer-privacy-form').find('.authorized-agent-label').parent().addClass('authorized-agent-wrapper');
        }
    });

})(jQuery);