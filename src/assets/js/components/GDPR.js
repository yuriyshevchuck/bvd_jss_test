var clicked = false;
define(function (require) {

    return function () {
        $(document).ready(function () {

            setupSubscriptionToggle();
            initHelpFields();

        });

        function initHelpFields() {
            var selector = "input.form-control.single-line, textarea.form-control";


            // this is the text which appears when clicking on the field
            $(selector).click(function () {
                if (clicked) {
                    return;
                }
                //it isn't help block of confirmEmail, and it is help block of email, and we are on free trial
                var isFreeTrialEmailHelpBlock = ($(this).parents(".free-trial").length > 0 && $(this).parents(".scfEmailBorder:not(.confirmEmail)").length > 0);

                // Show the help block for corresponding field excepting help-blocks for fields validation
                var $helpBlocks = $(this).siblings(".help-block:not(.field-validation-valid):not(.field-validation-error)");
                if ($helpBlocks.length > 0) {
                    if ($helpBlocks.text().length > 0) {

                        if (isFreeTrialEmailHelpBlock) {
                            clicked = true;
                            //moving helpBlock for email under confirm-email according to GDPR-47
                            $helpBlocks.clone().appendTo(".confirmEmail")
                                .addClass("clonedHelpBlock")
                                .css({
                                    opacity: 0,
                                    display: 'block'
                                })
                                .animate({
                                    opacity: 1
                                }, 300);
                        } else {

                            $helpBlocks.css({
                                opacity: 0,
                                display: 'block'
                            }).animate({ opacity: 1 }, 300);
                        }
                    }
                }
            });

            $(selector).on("focusout", function () {
                //it isn't help block of confirmEmail, and it is help block of email, and we are on free trial
                var isFreeTrialEmailHelpBlock = ($(this).parents(".free-trial").length > 0 && $(this).parents(".scfEmailBorder:not(.confirmEmail)").length > 0);

                if (isFreeTrialEmailHelpBlock) {
                    $(".clonedHelpBlock").fadeOut(200).remove();
                    clicked = false;
                } else {
                    //hiding help block for corresponding field excepting help-blocks for fields validation
                    $(this).siblings(".help-block:not(.field-validation-valid):not(.field-validation-error)").fadeOut(200);
                }
            });
        };

        function setupSubscriptionToggle() {
            $(".aboutThisSubscriptionTitle").click(function () {
                $(".aboutThisSubscriptionBody").slideToggle();
                $(".aboutThisSubscriptionTitle").toggleClass("opened");
            });
        }
    }
});