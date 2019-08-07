angular
    .module('MyApp', ['ngMaterial', 'ngMessages', 'angularMoment'])
    .config(function ($mdDateLocaleProvider, moment) {

    $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('MM/DD/YYYY');
    };

    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'MM/DD/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    }

    })
    .controller('AppController', function (moment) {
    var appCtrl = this;

    appCtrl.myDate = new Date();
    appCtrl.minDate = moment(appCtrl.myDate).subtract(5, 'years').toDate();
    appCtrl.maxDate = moment(appCtrl.myDate).add(5, 'years').toDate();
});
