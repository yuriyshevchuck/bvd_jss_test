/**
 * Created by Sergey on 31.03.2017.
 */

define(function (require) {

    var siteFunctions = require('siteFunctions');
    var cookies = require('components/cookiesBVD');
    var odometer = require('components/odometerBVD');
    var header = require('components/headerBVD');
    var search = require('components/searchBVD');
    var secondaryMenu = require('components/secondaryMenuBVD');
    var fullScreenMenu = require('components/fullScreenMenuBVD');
    var viewWhitePaperCookies = require('components/viewWhitePaperCookies');
    var GDPR = require('components/GDPR');

    siteFunctions.init();
    cookies();
    odometer();
    header();
    search();
    secondaryMenu();
    fullScreenMenu();
    viewWhitePaperCookies();
    GDPR();
});
