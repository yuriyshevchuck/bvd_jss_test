define(function (require) {
    return function () {

        $(document).ready(function () {

            initStuckMenu();

            if ($('.showSecondaryMenuLinks').length)
                secondaryMenuNavigation();

            if ($('.buttonScrollingHotspot').length)
                buttonScrollingHotspotNavigation();

            //Events
            $('a[href*="#"]:not([href="#"])').click(function () {
                scroolOnLinkClick(this);
            });

            //selecting all anchors from the page
            var $secondaryMenuPageSection = $('.secondary-menu-nav-anchor.pageSection');

            //setting active class for the first anchor (if someone loads page with other anchor scroll will activate another anchor and will remove this class from the first anchor)
            $("ul li.secondaryMenuAnchor0").addClass('active');

            $secondaryMenuPageSection
                .waypoint(function (direction) {
                    //retrieving current element which triggers waypoint (which is scrolled through)
                    var activeSection = $(this.element);

                    //if we're moving to the top, we receiving waypoint event when anchor is scrolled (not whole section)
                    //so we're detecting not when actual section is scrolled through but detecting when anchor situated under the section bottom is scrolled
                    //that's why we are taking section which is situated upper to the current anchor
                    if (direction === 'up') {
                        var prevAnchorIdNumber = parseInt(this.element.id.slice(-1)) - 1;
                        var prevSection = $('#secondaryMenuAnchor' + prevAnchorIdNumber);
                        if (prevAnchorIdNumber != -1) {
                            activeSection = $('#secondaryMenuAnchor' + prevAnchorIdNumber);
                        }
                    }

                    var sectionId = activeSection.attr('id');

                    //removing active class from other list items
                    $('.secondaryMenuNavigation li').removeClass('active');

                    //adding active state to the list item which corresponds to the current section
                    $('.secondaryMenuNavigation li.' + sectionId).addClass('active');
                }, {
                    offset: 300 //this offset is empiric. it allows us to execute code when element is 360px from top of the screen. 
                                //it fits much better as we 
                                //a) almost everywhere has top margins between components, so it doesn't break the look (as well as on mobiles)
                                //b) it fix issue with links sometimes not triggering waypoints, as scrolling to anchor scrolls it so anchor appearing not on top but a bit lower (browser behavior)
                                //I guess we can modify this offset a bit, but we need to check issue b) after this (if links clicking enables waypoints)
                });

            

        });

        function initStuckMenu() {
            var menu = $("section.secondary-nav");

            if (menu.length) {

                var distance = menu.offset().top - 90;

                $(window).scroll(function () {
                    if ($(window).scrollTop() >= distance) {
                        $('section.secondary-nav').addClass('isStuck');
                        $('body').addClass('secondary-nav-isStuck');
                    } else {
                        $('section.secondary-nav').removeClass('isStuck');
                        $('body').removeClass('secondary-nav-isStuck');
                    }
                });

            }
        }

        function secondaryMenuNavigation() {

            $('.secondary-menu-nav-anchor').each(function (i, el) {

                var curHeading = $(el).find('.secondary-menu-nav-head').attr("data-lead-nav-head");
                var navItem = $('<li class="secondary-menu-item secondaryMenuAnchor' + i + '"><a class="secondaryMenuNavLink" href="#secondaryMenuAnchor' + i + '"><b>' + curHeading + '</b></a></li>');

                $(el).attr('id', 'secondaryMenuAnchor' + i);

                navItem.appendTo('.secondaryMenuNavigation');
            });
        }

        function buttonScrollingHotspotNavigation() {
            $('.secondary-menu-nav-anchor.buttonScrollingHotspot').each(function (i, el) {

                var curHeading = $(el).find('.secondary-menu-nav-head').attr("data-lead-nav-head");
                var curId = $(el).attr('data-anchor-id');
                var link = $(el).attr('id');

                if (link == null) {
                    $(el).attr('id', 'secondaryMenuAnchor' + i);
                    link = $(el).attr('id');
                }

                var navItem = $('<a class="secondaryMenuNavLink" href="#' + link + '"><b>' + curHeading + '</b></a>');
                navItem.appendTo("div.buttonScrollingHotspot[id='" + curId + "']");
            });
        }
        
        function scroolOnLinkClick(element) {
            var menuisStuck = $(".showSecondaryMenuLinks").hasClass("isStuck");
            var offset = getRelatedContent(element).offset().top - 160;

            if (!menuisStuck)
                offset = offset - 105;

            $('html,body').animate({ scrollTop: offset });

            return false;
        }

        function getRelatedContent(el) {
            return $($(el).attr('href'));
        }

        function getRelatedNavigation(el) {
            return $('nav a[href=#' + $(el).attr('id') + ']');
        }
    }
});