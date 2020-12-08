define(function (require) {
    return function () {
        /*-----------------------------------------------------------------------------------
        :: READY
        ---------------------------------------------------------------------------------- */

        $(document).ready(function () {

            $('.menu-panel nav a').hoverIntent({
                timeout: 200,
                out: hoverOut,
                over: hoverIn
            });

            $('.menu-toggle .menu-icon').on('click', function (e) {
                $('body').toggleClass('menu-open');
                $('.fullscreen').show();
                setTimeout(function () { $('.fullscreen').toggleClass("open"); }, 100);

                $('.fullscreen .left .content nav a').each(function (i) {
                    var t = $(this);
                    setTimeout(function () { t.toggleClass('nav-open'); }, (i + 1) * 75);
                });

                $('.fullscreen .right .content.displayed .grid ul li').each(function (i) {
                    var t = $(this);
                    setTimeout(function () { t.toggleClass('grid-load'); }, (i + 1) * 75);
                });

                $('.fullscreen .right').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                    function (e) {
                        if (!$('.fullscreen').hasClass('open')) {

                            $('.fullscreen').hide();
                        };
                    });
            });

            function hoverIn(el) {
                el = $(this);
                var menuID = $(this).data('menu-id');

                $(el).removeClass('active');
                $('.right.menu-panel .content').removeClass('displayed');
                $('.grid ul li').removeClass('grid-load');


                $(this).addClass('active');

                $('#' + menuID).addClass('displayed');

                $('#' + menuID).find('.grid ul li').each(function (i) {
                    var t = $(this);
                    setTimeout(function () { t.addClass('grid-load'); }, (i + 1) * 75);
                });
            }
            function hoverOut(el) {
                el = $(this);
                $(this).removeClass('active');
            }
            

            
            
        });
    }
});