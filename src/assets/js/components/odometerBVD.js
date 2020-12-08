define(function (require) {

    return function () {

        $(document).ready(function () {
            //subscriptions would be executed once
            var $quantity = $('.BC001-row .number .quantity');
            $quantity
                .addClass('odometer')
                .each(odometerInit);

            $quantity
                .waypoint(odometerRefresh,
                { offset: '80%' });
        });
        function odometerRefresh() {
            //this would be executed each scroll into object
            var quantity = parseInt($(this.element).parent().find('.quantity-hidden').text());
            //and refresh odometer value
            $(this.element)[0].innerText = '000';
            $(this.element).text(quantity);
        }

        function odometerInit() {
            var el = $(this)[0];
            var odometer = new Odometer({
                el: el,
                value: 0,
                theme: 'minimal',
                duration: 2000
            });
            odometer.render();
        }

    }
});