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
                    var formLabel = $(e).parent().parent().parent().find('.control-label');
                    formLabel.addClass('completed');
                    //passing event to select
                    $(e).change();
                };

            //hide select state field by default.
            if ($element.parent().hasClass('selectState')) {
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

                    var formLabel = $(e).parent().parent().parent().find('.control-label');
                    formLabel.addClass('completed');
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

        });

        //show selectState and make it required
        function showSelectStateField() {
            //ensuring we will be working with field that has appeared in DOM
            if ($('.selectState').length == 0) {
                return;
            }
            $('.selectric-selectState').parent() .slideDown(300);
            //initSelectricForField($('.selectState'));

        }

        //hide selectState and make it unneccessary
        function hideSelectStateField() {
            //ensuring we will be working with field that is present in DOM
            if ($('.selectState').length == 0) {
                return;
            }
            $('.selectric-selectState').parent().slideUp(300);
            //if selectCountryField isn't filled with anything then fill it with selectState content
            //otherwise don't rewrite it, as selectState after applying selectric isn't applicable for selectric reinitialization
            if (selectCountryField == "") {
             //   selectCountryField = $('.selectState')[0].outerHTML;
            }
            //$('.selectState').remove();
        }

        function initSelectricForField($formGroup) {
            var $element = $formGroup.find("select"),

                onChangeSelectric = function (e) {
                //hide label when any value is selected
                var formLabel = $(e).parent().parent().parent().find('.control-label');
                formLabel.addClass('completed');
                //passing event to select
                $(e).change();
            };

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