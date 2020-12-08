// iCheck them checkboxes
define(function (require) {
    return function () {

        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' // optional

        });
        $('input[type=radio][name=country]').on('ifChecked', function (event) {
            $(this).closest("form").submit();
        });
    }
});