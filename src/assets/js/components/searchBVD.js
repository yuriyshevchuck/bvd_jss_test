define(function (require) {

    return function () {
        var ORBIS_SEARCH_LINK = 'https://orbisdirectory.bvdinfo.com/version-2017328/orbisdirectory/companies/Search/opensearch/';

        $(document).ready(function () {

            $('#heroSearchForm input[type=search], #contentSearchForm input[type=search], #uiSearchForm input[type=search]').on('change invalid', function () {
                var textfield = $(this).get(0);

                // 'setCustomValidity not only sets the message, but also marks
                // the field as invalid. In order to see whether the field really is
                // invalid, we have to remove the message first
                textfield.setCustomValidity('');

                if (!textfield.validity.valid) {
                    textfield.setCustomValidity('Please enter your search criteria');
                }
            });
            //we turn off validation message and only add animation for invalid state
            $('.desktop form.search-nav input[type=search]').on("invalid", onInvalid);
            $('.mobile form.search-nav input[type=search]').on("invalid", onInvalid);

            $('#contentSearchForm input[type=search]').on("input", correctFormAction);
        });

        function onInvalid(event) {
            event.preventDefault();
            $(this).addClass('invalid');

            $(this).on("webkitAnimationEnd animationEnd mozAnimationEnd", function () {
                $(this).removeClass('invalid');
            });
        }

        function correctFormAction() {
            $('#contentSearchForm').attr('action', ORBIS_SEARCH_LINK + $(this).val());
        }

    }
});