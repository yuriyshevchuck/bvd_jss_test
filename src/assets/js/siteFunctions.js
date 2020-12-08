define(function (require) {



    function _trackGoal($element) {

        var goalId = $element.data("goal-id");

        if (goalId !== undefined && goalId !== "") {
            jQuery.ajax({
                type: "POST",
                url: '/GoalTracking/TriggerGoal', // url - route to your controller action
                data: { "id": goalId },
                success: function (obj) {
                    console.log("Goal '" + goalId + "' trigered.");
                },
                dataType: 'json'
            });
        }
    }

    function _trackGoalAsQueryStringParameter(goalQuery) {
        $.get(window.location.href + goalQuery, function (data) {
            console.log(data);
        });
    }

    function loginRedirect() {
        var $loginBox = $('.sign-in');

        $loginBox.find('select').on('selectric-select', function (event, element, selectric) {
            var url = this.value;

            window.location.replace(url);
            $loginBox.find('.goto-product').attr('href', url);
        });
    }

    return {
        init: function () {
            /*-----------------------------------------------------------------------------------
            :: READY
            ---------------------------------------------------------------------------------- */

            $(document).ready(function () {

                var lastScrollTop = 0;
                var $sideMenu = $('.menu-toggle');
                var $botText = $sideMenu.find('h5');
                var $aboutSubscription = $('.aboutThisSubscription');

                if (!isMobile())
                    var s = skrollr.init();

                //refreshing body height to get this updated afterwards
                $('body').height("auto");
                setTimeout(function () {
                    if (!isMobile())
                        var s = skrollr.init();
                }, 100); //100ms is enough

                alignComponentsHeight();

                window.selectricFunction = require('components/selectric');
                window.selectricFunction();

                // URL js Goal trigger

                $(".share-buttons .at-share-btn").click(function () {
                    var goalQuery = "?=sc_trk=Share content";
                    _trackGoalAsQueryStringParameter(goalQuery);
                });

                $(".search-widget.orbisBlueBg .readMore-container a").click(function () {
                    var goalQuery = "?=sc_trk=Orbis Directory View";
                    _trackGoalAsQueryStringParameter(goalQuery);
                });

                // Form validation 
                $('#contentSearchForm, #heroSearchForm, #menuPanelSearch, #uiSearchForm').each(function () {
                    $(this).validate();
                });

                window.iCheckFunction = require('components/iCheck');
                window.iCheckFunction();

                if ($(".breadcrumb-container").length > 0) {
                    $("header").toggleClass("breadcrumb-shown");
                }


                $(".grid-container .grid a").on("click touchend", function (e) {
                    var el = $(this);
                    var link = el.attr("href");
                    window.location = link;
                });


                // Swap YT Thumb with video
                $('.btn-play').click(function (e) {
                    _trackGoal($(this));
                    videoReplace(this);
                });

                $(".search-widget .readMore").click(function () {
                    _trackGoal($(this));
                });
                if (!isMobile()) {
                    new Tippy('.tippy', {
                        theme: 'custom'
                    })
                }


                //equalHeightsRow();


                $(".owl-carousel").owlCarousel({
                    items: 1,
                    singleItem: true,
                    dots: true
                });

                $(".owl-carousel.incontent").owlCarousel({
                    items: 1,
                    singleItem: true,
                    dots: true
                });

                $(".accordion-panel-title").click(function () {
                    $(this).next(".accordion-panel-content").toggleClass("show");
                    $(this).toggleClass("open");
                });

                $('.scfEmailBorder').bind('blur', function () {
                      validateEmailsCorrespondance("The Confirm email field doesn't correspond to Email field");
                });


                $(".scfEmailBorder").on("input keyup", function () {
                    setTimeout(function () {
                        validateEmailsCorrespondance("The Confirm email field doesn't correspond to Email field");
                    }, 50);
                });



                $("#uiSearchForm .search").focus(function () {
                    $(this).parent().toggleClass("active");
                });
                $('#uiSearchForm .search').bind('blur', function () {
                    $(this).parent().removeClass("active");
                });


                /**
                * this function is looking for fields with classes .scfEmailBorder and checking their content with field with class .confirmEmail
                * if their values aren't correspond, validation error is thrown. if they are ok, validation error is removed
                */
                function validateEmailsCorrespondance(errorNotEqualMessage) {
                    var $confirmEmail = $(".confirmEmail").parent('.form-field');
                    var $helpBlock = $confirmEmail.find("span");

                    function emailAndEmailConfirmationMatch() {
                        return $(".scfEmailBorder").not(".confirmEmail").val() != $(".scfEmailBorder.confirmEmail").val();
                    }

                    function changeValidationClass(vldClass1, vldClass2, vldClass3, vldClass4, vldClass5, vldClass6, validationMsg) {
                        $confirmEmail.removeClass(vldClass1).addClass(vldClass2);
                        $helpBlock
                            .removeClass(vldClass3)
                            .addClass(vldClass4);
                        $helpBlock.html("<span>" + validationMsg + "</span>");
                        $confirmEmail.find('input').removeClass(vldClass5).addClass(vldClass6);
                    }

                    function confirmEmailHasNotError() {

                        $confirmEmail.find('input').removeClass("valid has-success").addClass('input-validation-error');
                        changeValidationClass("has-error", "has-success", "field-validation-error", "field-validation-valid", "input-validation-error","valid", "");
                        $confirmEmail.find('input').removeClass('input-validation-error').addClass('valid');

                        $(":submit").on('click', function (e) {
                            if (emailAndEmailConfirmationMatch()) {
                                e.preventDefault();
                            }
                        })
                    }

                    function errorAlreadyExist() {
                        var $helpBlock = $confirmEmail.find("span");

                        if ($helpBlock.html() != "<span>" + errorNotEqualMessage + "</span>") {
                            changeValidationClass("has-success", "has-error", "field-validation-valid", "field-validation-error", "valid", "input-validation-error", "<span>The Confirm email field doesn't correspond to Email field</span>");
                        }
                    }

                    if (emailAndEmailConfirmationMatch()) {                  
                        errorAlreadyExist();
                    } else {
                        confirmEmailHasNotError();
                    }
                }
                // Input focus Toggle TODO if nothing will be broken with these inputs subscriptions being commented for a while, delete this code. 6/2/2017
                //$("input, textarea").focus(function () {
                //    $(this).parent().toggleClass("active");
                //});
                //$('input, textarea').bind('blur', function () {
                //    $(this).parent().removeClass("active");
                //});

                $('form .form-group').find('input[type=text], input[type = "email"], input[type = "tel"],  textarea').on("input", hideFormLabel);

                // Input focus Toggle end



                //moved content alignment from here to the resize function

                //TURN THIS OFF IF YOU WANT WAYPOINTS BACK
                //$('.scroll-effect').waypoint(function () {
                //    $(this.element).toggleClass('in-view');
                //}, {
                //    offset: '80%'
                //});

                $('.scroll-effect').toggleClass('in-view'); //toggling this on constant basis so we won't have waypoints on this project

                $('select#productsearchCountryDropdown').change(function () {
                    var countryId = $(this).val();
                    insertParam([{ key: 'country', value: countryId }]);
                });
                $('select#blogSearchCountryDropdown').change(function () {
                    var blogCategoryId = $(this).val();
                    var parts = document.location.pathname.split('/');
                    parts[3] = blogCategoryId;
                    var href = document.location.href;
                    href = href.replace(document.location.pathname, parts.join('/'));
                    href = href.replace(document.location.search, '');
                    document.location.href = href;
                    //insertParam([{ key: 'blogcategory', value: blogCategoryId }, { key: 'page', value: 1 }]);
                });
                $('select#contactsListCountryDropdown').change(function () {
                    var countryId = $(this).val();
                    location.href = "#countriesList";
                    insertParam([{ key: 'country', value: countryId }]);
                });
                $('select#searchCountDropdown').change(function () {
                    var showCount = $(this).val();
                    insertParam([{ key: 'show', value: showCount }, { key: 'page', value: 1 }]);
                });


                $(".see-more").click(function () {
                    $('html,body').animate({ scrollTop: $(this).offset().top + 200 }, 'slow');
                });

                $(".pagination .arrows a.disabled").click(function (event) {
                    event.preventDefault();
                });

                function isIE() {
                    ua = navigator.userAgent;
                    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

                    return is_ie;
                }

                if ($botText.length) {
                    var isKorea = $("body").hasClass("ko");
                    var isJapan = $("body").hasClass("ja");
                    var isChina = $("body").hasClass("zh");
                    if (!isKorea && !isJapan && !isChina) {
                        var decoded = $botText.html().replace(/&amp;/g, '&');
                        $botText.html(decoded.replace(/./g, "<span>$&</span>"));
                        $botText.show(300);
                    }
                }

                if ($aboutSubscription.length && $('.re-captcha').length <= 0) {
                    $aboutSubscription.addClass('regular-margin');
                }

                if ($('.sign-in')) {
                    loginRedirect()
                }

            });
            //////////////

            function insertParam(arr) {


                var location = '?';
                var parameters = [];
                var kvp = document.location.search.substr(1).split('&');

                if (kvp == '' || kvp == undefined)
                    parameters = arr;
                else {
                    for (i = 0; i < kvp.length; i++) {
                        pare = kvp[i].split('=');
                        parameters.push({ key: pare[0], value: pare[1] });
                    }

                    $.each(arr, function (i, item) {

                        var find = false;

                        $.each(parameters, function (j, parameter) {
                            if (parameter.key == escape(item.key)) {
                                find = true;
                                parameters[j].value = escape(item.value);
                            }
                        });

                        if (!find)
                            parameters.push({ key: escape(item.key), value: escape(item.value) });

                    });
                }

                $.each(parameters, function (k, parameter) {
                    location += parameter.key + "=" + parameter.value;

                    if (k + 1 < parameters.length)
                        location += "&";
                });

                document.location.search = location;
            }
            /*-----------------------------------------------------------------------------------
            :: RESIZE
            ---------------------------------------------------------------------------------- */

            $(window).on('resize', function () {

                if (!isMobile())
                    skrollr.init();

                alignComponentsHeight();

            });

            /*-----------------------------------------------------------------------------------
            :: FUNCTIONS
            ---------------------------------------------------------------------------------- */
            //content height adjustments
            function alignComponentsHeight() {
                var whitePapersRatio = 1.8;
                if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= 480) {
                    whitePapersRatio = 1.3;
                }
                $('.white-paper-list-banner-cover').each(function () {
                    var brochureheight = $(this).width() * whitePapersRatio;
                    $(this).css("min-height", brochureheight);
                });

                //equalButtons($('.btnContainer.equalWidth'));

                //ensure height is auto (giving us correct value for the given resolution)
                $('.card-banner-vertical p').height('auto');
                //excluding mobile devices as we are putting them to the width=100% (no point of aligning heights)
                if (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) >= 767) {
                    setTimeout(function () {
                        // Cache the highest
                        var highestBox = 0;
                        // Select and loop the elements you want to equalise
                        $('.card-banner-vertical p').each(function () {
                            // If this box is higher than the cached highest then store it
                            if ($(this).height() > highestBox) {
                                highestBox = $(this).height();
                            }
                        });
                        // Set the height of all those children to whichever was highest
                        $('.card-banner-vertical p').height(highestBox);
                    }, 100);
                }

                //TODO need to check all below code if there will be issues with height alighnment
                $('.container').each(function () {
                    var highestBox = 0;
                    if ($(window).width() > 960) {
                        setTimeout(function () {
                            $('.card-banner-vertical, .latest-news-content, .blog-list-item', this).each(function () {
                                if ($(this).height() > highestBox) {
                                    highestBox = $(this).height();
                                }
                            });
                            $('.card-banner-vertical, .latest-news-content , .blog-list-item', this).height(highestBox);
                        }, 150);
                    }
                });

                //TODO need to check all below code if there will be issues with height alighnment
                $('.overlap-top .container').each(function () {
                    var highestBox = 0;
                    if ($(window).width() > 960) {
                        $('.UI002 p', this).each(function () {
                            if ($(this).height() > highestBox) {
                                highestBox = $(this).height();
                            }
                        });
                        $('.UI002 p', this).height(highestBox);
                    }
                });

                $('.container').each(function () {
                    var highestBox = 0;
                    $('.service-contact-card li.address', this).each(function () {
                        if ($(this).height() > highestBox) {
                            highestBox = $(this).height();
                        }
                    });
                    $('.service-contact-card li.address', this).height(highestBox);
                });

                $('.container').each(function () {
                    var highestBox = 0;
                    $('.card-banner-vertical-thumb', this).each(function () {
                        if ($(this).height() > highestBox) {
                            highestBox = $(this).height();
                        }
                    });
                    $('.card-banner-vertical-thumb', this).height(highestBox);
                });

                equalButtons($('.btnContainer.equalWidth'));

                $('.parallax-block .front').each(function () {
                    var parallaxBlock = $(this).width() * 1;
                    $(this).height(parallaxBlock);
                });
            }

            // Video replace
            function videoReplace(e) {
                var el = $(e);
                if (el.hasClass('ytSwapButton')) {
                    var youtubeID = el.attr("id");
                    $('<iframe class="embed-responsive-item" width="640" height="360" src="https://www.youtube.com/embed/' + youtubeID + '?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>').insertAfter(el);
                } else {
                    //console.log(el);
                    var videoURLMP4 = el.attr("data-mp4"),
                        videoURLWEBM = el.attr("data-webm"),
                        videoURLOGV = el.attr("data-ogv"),
                        videoSourceMP4 = "",
                        videoSourceWEBM = "";
                    videoSourceOGV = "";

                    //console.log('Video URLS = ' + videoURLMP4 + videoURLWEBM);

                    if (videoURLMP4 != "") {
                        // console.log('has MP4');
                        videoSourceMP4 = '<source src="' + videoURLMP4 + '" type="video/mp4">';
                    }
                    if (videoURLWEBM != "") {
                        // console.log('has WEBM');
                        videoSourceWEBM = '<source src="' + videoURLWEBM + '" type="video/webm">';
                    }
                    if (videoURLOGV != "") {
                        videoSourceOGV = '<source src="' + videoURLOGV + '" type="video/ogg">';
                    }

                    var videoSources = videoSourceMP4 + videoSourceWEBM + videoSourceOGV;

                    $('<video class="embed-responsive-item" controls autoplay>' + videoSources + '</video>').insertAfter(el);
                }
                $(el).parent().parent().toggleClass('hide-copy');
                $(el).hide();
            }

            function equalButtons($element) {
                $element.each(function (i, el) {
                    var widestBox = 0;
                    var buttons = $(el).find('a.btn');
                    buttons.each(function (i, el) {
                        if ($(el).width() > widestBox) {
                            widestBox = $(el).width();
                        }
                    });
                    $(buttons).width(widestBox);
                });
            }

            function hideFormLabel() {
                var formLabel = $("label[for='" + $(this).attr("id") + "']");

                if ($(this).val().length > 0) {
                    formLabel.addClass('completed');
                } else {
                    formLabel.removeClass('completed');
                }
            }

            function isMobile() {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
                    return true;
                else
                    return false;
            }
            ///////////////
        },
        trackGoal: _trackGoal
    }
});
