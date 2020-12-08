define(function (require) {

    return function () {

        $(window).scroll(function () {
            if ($(window).scrollTop() > $(".main-header").height()) {
                $('.main-header').addClass('stuck');
                $('.sticky').addClass('greyBg');
                $('body').addClass('header-stuck');
            }
            else {
                $('.main-header').removeClass('stuck');
                $('.sticky').removeClass('greyBg');
                $('body').removeClass('header-stuck');
            }
        });

        $(document).ready(function () {
            var siteFunctions = require('siteFunctions');

            //enabling closing phone popup on clicking anywhere
            $("body").click(function (e) {
                if (!($("#phone-popup .btn").is(e.target)) && $("#phone-popup").hasClass('open')) { // if the target of the click isn't the container...
                    togglePopupClickHandler(e, $('#phone-popup'));
                }
                if (!($("globe-link").is(e.target)) && $(".main-header .country-lister").hasClass('open')) { // if the target of the click isn't the container...
                    togglePopupClickHandler(e, $('.main-header .country-lister'));
                }
                if (!($('.fullscreen.desktop .bottom-content, .fullscreen-mobile .bottom-content').is(e.target)) && $('.bottom-content .country-lister').hasClass("open")) {
                    togglePopupClickHandler(e, $('.bottom-content .country-lister'));
                }
                function hideOnOutsideClickOf(container) {
                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) { // ... nor a descendant of the container
                        container.removeClass('visible');
                    }
                }
                hideOnOutsideClickOf($(".desktop .search-nav"));
                hideOnOutsideClickOf($(".mobile .search-nav"));
            });

            $('.main-header .right .login, footer .btn-container .login').on('click', function (e) {

                e.preventDefault();
                $('body').toggleClass('login-open');

                $('.sign-in').show();
                setTimeout(function () { $('.sign-in').toggleClass("open"); }, 100);
                setTimeout(function () { $('.lightbox').toggleClass("displayed"); }, 600);
            });

            $(".sign-in select").change(function () {
                siteFunctions.trackGoal($(".goto-product"));
                $(".goto-product").attr("href", $(this).val());
                $(".goto-product").trigger('click');
                if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) {
                    //new window couldn't be opened so user need to click on button
                } else {
                    window.open($(this).val(), '_blank');
                }
            });

            
            $(".goto-product").click(function () {
                //Product Login
                if ($(this).attr("href") == undefined || $(this).attr("href") == "")
                    return false;

            });

            $('.lightbox .close, .veil-right').on('click', function (e) {
                $('body').toggleClass('login-open');

                //$('.sign-in').show();  
                $('.lightbox').toggleClass("displayed");

                $('.veil-right, .veil-left').addClass('close');


                setTimeout(function () {
                    $('.sign-in').toggleClass("open");

                    $('.veil-right').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                        function (e) {
                            if (!$('.sign-in').hasClass('open')) {
                                $('.veil-right, .veil-left').removeClass('close');

                                $('.sign-in').hide();
                            };
                        });
                }, 400);
            });

            $('.main-header.mobile .mobile-trigger').on('click', function (e) {
                $('body').toggleClass('menu-open mobile');
                $('.fullscreen-mobile').show();
                setTimeout(function () { $('.fullscreen-mobile').toggleClass("open"); }, 100);

                $('.fullscreen-mobile .content nav a').each(function (i) {
                    var t = $(this);
                    setTimeout(function () { t.toggleClass('nav-open'); }, (i + 1) * 75);
                });

                $('.fullscreen-mobile .menu-panel').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                    function (e) {
                        if (!$('.fullscreen-mobile').hasClass('open')) {
                            $('.fullscreen-mobile').hide();
                        };
                    });
            });


            // Language pop-up in header panel
            $('#globe-link').on('click', function (e) {
                closeActiveWindows(e);
                togglePopupClickHandler(e, $('.main-header .country-lister'));
            });
            // Language pop-up in menu panel
            $('.fullscreen.desktop .bottom-content, .fullscreen-mobile .bottom-content').on('click', function (e) {
                closeActiveWindows(e);
                togglePopupClickHandler(e, $('.bottom-content .country-lister'));
            });
            //enabling phone popup on clicking phone button
            $('img.phone').on('click', function (e) {
                closeActiveWindows(e);
                togglePopupClickHandler(e, $('#phone-popup'));
            });
            // Search button handler
            $(".desktop img.search").click(function (e) {
                $(".desktop .search-nav input").focus();
                closeActiveWindows(e);
                $(".desktop .search-nav").addClass('visible');
            });
            $(".mobile img.search").click(function (e) {
                $(".mobile .search-nav input").focus();
                closeActiveWindows(e);
                $(".mobile .search-nav").addClass('visible');
            });
            $(".country-lister i").click(function (e) {
                closeActiveWindows(e);
            });
        });

        $(window).on('resize', function () {
            aligningCountryListerHeight($('.fullscreen-mobile .bottom-content .country-lister'));
        });

        /**
         * toggle popup z-index on user click (without class active it has z-index:-1 so it wouldn't prevent clicks even if we don't hide it)
         * @param e
         * @param $popupEl
         * @param forceClose - when we need only to close window if it is currently opened
         */
        function togglePopupClickHandler(e, $popupEl, forceClose) {
            if (forceClose && !$($popupEl).hasClass("open")) {//if we use rawClosing but there is nothing to close, do nothing
                return;
            }
            if ($popupEl.hasClass("open")) {
                $popupEl.removeClass("open");
            } else {
                $popupEl.addClass("open");
                $popupEl.removeClass('invisible');
                aligningCountryListerHeight($popupEl);
            }
            $popupEl.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
                function (e) {
                    if (!$(this).hasClass('open')) {
                        $(this).addClass('invisible');
                    }
                });
        }
        
        /**
        * this code is responsible for setting height of the country-lister in footer on small resolutions
        */
        function aligningCountryListerHeight($popupEl) {
            //when it's getting invoked on resizes we need to check if popup is opened at all
            if (!$popupEl.hasClass('open')) {
                return;
            }

            var $bottomCountryLister = $popupEl.filter('.fullscreen-mobile .bottom-content .country-lister');
            //if this country lister was called to be opened
            if (!!($bottomCountryLister)) {
                $bottomCountryLister.height(Math.min(calculateCountryListerHeight(), 400)); //lister bigger than 400 px looks bad, especially if there isn't much content
                //this string will ensure that we would receive actual height of scrolling items on this element (in setTimeout function)
                $(".overflow-scroll").hide();

                //waiting transition time so height of the bottomCountryLister is getting updated properly
                setTimeout(function () {

                    //setting height for scroll element separately counting calculated height of container and subtractioning header height
                    var scrollerHeight = $bottomCountryLister.height() - $bottomCountryLister.find('h3').outerHeight() - 15; //that's margin to look pretty

                    $(".overflow-scroll").height(scrollerHeight); 
                    $(".overflow-scroll").fadeIn();
                    
                }, 600); //transition time + 100ms
            }
        }

        function calculateCountryListerHeight(){
            return window.innerHeight - $('header').outerHeight() - $('.fullscreen-mobile .bottom-content').outerHeight() - 30;//that's margin to look pretty
        }

        /**
         * kill event and close all popups/searchlines
         * @param e
         */
        function closeActiveWindows(e) {
            if (e != null) {
                e.stopImmediatePropagation(); //prevent from double firing on body click subscription (and hiding on that subscription)
                e.preventDefault(); // prevent from scrolling up
            }
            togglePopupClickHandler(e, $('.bottom-content .country-lister'), true);
            togglePopupClickHandler(e, $('.main-header .country-lister'), true);
            togglePopupClickHandler(e, $('#phone-popup'), true);
            $(".desktop .search-nav").removeClass('visible');
            $(".mobile .search-nav").removeClass('visible');
        }
    }
});