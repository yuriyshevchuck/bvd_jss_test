define(function (require) {

    return function () {

        $(window).on('load', function () {
            cookieBanner();
        });

        $(document).ready(function () {
            $('#cookieBanner .close').on('click', function (e) {
                e.preventDefault();
                $('#cookieBanner').hide();
            });
        });

        // Init the cookie banner
        //
        function cookieBanner() {
            if (getCookie("cookieAcceptedV2") == "") {
                var cookieBanner = document.getElementById("cookieBanner");
              var cookieAcceptBtn = document.getElementById("cookieAcceptBtn");
              if (cookieBanner != null) { 
                cookieBanner.style.display = "block";
                cookieAcceptBtn.onclick = function () {
                  setCookie("cookieAcceptedV2", "cookieAcceptedV2", 9999);
                  cookieBanner.style.display = "none";
                };
              }
            }
        }
        // Cookie functions
        //
        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        }
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }
        function checkCookie() {
            var user = getCookie("username");
            if (user != "") {
                alert("Welcome again " + user);
            } else {
                user = prompt("Please enter your name:", "");
                if (user != "" && user != null) {
                    setCookie("username", user, 365);
                }
            }
        }

    }
});