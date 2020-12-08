//Selectric them dropdowns

define(function (require) {
    return function () {
        var selectCountryField = '';

        //initialization for all selectrics on website
        $('select').each(function (index, element) {
            var $element = $(this),
                
                //declaring this as a separate function so we have an opportunity to rewrite it
                onChangeSelectric = function (e) {
                    //hide label when any value is selected

                    if ($(e).parents('.form-field').length == 0) {
                        return false
                    }

                    var formLabel = $(e).parents('.form-field').children('label');

                    if (formLabel) {
                        formLabel.addClass('completed');
                    }

                    //passing event to select
                    $(e).change();
                };

            //hide select state field by default.
            if ($element.parent().hasClass('selectState')) {
                if ($element.parent().length == 0) {
                    return false
                }
                hideSelectStateField();
                //selectric will be assigned later to this field
            }

            //for formCountryField selectric, add condition to show state on change
            if ($element.hasClass('formCountryField')) {

                onChangeSelectric = function (e) {

                    //comparing selected value with predefined form-control which holds value that is triggering logic
                    if ($(e).val() == $('.hiddenCountryForSelectState').val()) {
                        showSelectStateField();
                        //adding check so hidden isn't appended multiple times
                    } else if ($('.selectric-selectState').length > 0 &&
                        !$('.selectric-selectState').hasClass('hiddenFormField')) {
                        hideSelectStateField();
                    }

                    var formLabel = $(e).parents('form-field').children('label');
                    formLabel.addClass('completed');
                    validateSelectric($element);
                    $(e).change();
                }
            }

            $element.selectric({
                disableOnMobile: true,
                //switch active class in order to animate DDL label (fix for wffm)
                onBeforeOpen: function (e) {
                    $(e).parent().parent().parent().addClass('active');
                },
                onClose: function (e) {
                    $(e).parent().parent().parent().removeClass('active');
                },
                onChange: onChangeSelectric
            });

            var $selectricElement = $element.closest(".selectric-wrapper");

            //adding class equal to id allows us to style particular selectric
            if (element.id !== "") {
                $selectricElement.addClass(element.id)
                    .hide()
                    ;
            }
            //showing them after all selectric stuff is repainted
            $selectricElement.fadeIn(500);

            if ($element.hasClass('selectState')) {
                $element.parent().parent().parent('.form-field').addClass('hiddn-field');
            }

            $element.parents('form').submit(function (event) {
                validateSelectric($element);
            });

        });

        function validateSelectric(element) {
            var $element = element,
                valMsg = $element.data('val-required'),
                $selectricWrapper = $element.parent().parent('.selectric-wrapper');

            if (valMsg == 'undefined' || $selectricWrapper.length == 0) {
                return false;
            }

            if ($element.val() == '' && valMsg) {

                $selectricWrapper.addClass('has-error');
                $selectricWrapper.parent('.form-field').addClass('has-error');
                $selectricWrapper.append('<span class="field-validation-error"><span>' + valMsg + '</span></span>');
            } else {
                $selectricWrapper.removeClass('has-error');
                $selectricWrapper.parent('.form-field').removeClass('has-error');
                $selectricWrapper.find('.field-validation-error').remove();
            }

        }

        //show selectState and make it required
        function showSelectStateField() {
            var $selectState = $('.selectric-selectState').parent();

            //ensuring we will be working with field that has appeared in DOM
            if ($('.selectState').length == 0) {
                return;
            }
            $selectState.removeClass('hiddn-field');
            $selectState.children('label').addClass('completed');

        }

        //hide selectState and make it unneccessary
        function hideSelectStateField() {
            let $siletriWrapper = $('.selectric-selectState');

            //ensuring we will be working with field that is present in DOM
            if ($('.selectState').length == 0) {
                return;
            }

            $siletriWrapper.parent().addClass('hiddn-field');
            $siletriWrapper.find('select').val('Select State');
            $siletriWrapper.find('.selectric-items li').removeClass('selected');
            $siletriWrapper.find('.selectric .label').html('');

        }

        function initSelectricForField($formGroup) {

            onChangeSelectric = function (e) {
                //hide label when any value is selected
                var formLabel = $(e).parents('form-field').children('label');

                if (formLabel.length == 0) {
                    return false;
                }

                formLabel.addClass('completed');
                //passing event to select
                $(e).change();
            };

            $formGroup.selectric({
                disableOnMobile: true,
                //switch active class in order to animate DDL label (fix for wffm)
                onBeforeOpen: function (e) {
                    $(e).parent().parent().parent().addClass('active');
                },
                onClose: function (e) {
                    $(e).parent().parent().parent().removeClass('active');
                },
                onChange: onChangeSelectric
            });

            $formGroup.find(".form-control").focus(function () {
                $(this).parent().toggleClass("active");
            });
            $formGroup.find(".form-control").bind('blur', function () {
                $(this).parent().removeClass("active");
            });

            $formGroup.find('input[type=text], input[type = "email"], input[type = "tel"],  textarea').on("input", hideFormLabel);

            function hideFormLabel() {
                var formLabel = $("label[for='" + $(this).attr("id") + "']");

                if ($(this).val().length > 0) {
                    formLabel.addClass('completed');
                } else {
                    formLabel.removeClass('completed');
                }
            }
        }
    }
});