$(function () {

    var $step1 = $('.step1');
    var $step2 = $('.step2');
    var $step3 = $('.step3');
    var $step4 = $('.step4');

    $('.alert')
        .removeClass('alert-success alert-warning alert-danger')
        .addClass('alert-info');

    $('.result').hide();
    $('.message').text('正在检测');

    $('#total-progress').show();


    // 用户名密码检测
    var step1 = function () {
        var deferred = $.Deferred();

        $.get('/detect-api/check-account', function (response) {
            if (response && response.error === 0) {
                $step1
                    .addClass('alert-success')
                    .removeClass('alert-info')
                    .find('.success').show();

                deferred.resolve();
            } else {
                $step1
                    .addClass('alert-danger')
                    .removeClass('alert-info')
                    .find('.error').show();

                deferred.reject();
            }
        }, 'json');

        return deferred;
    }

    // 学习卡检测
    var step2 = function () {
        var deferred = $.Deferred();
        $.get('/detect-api/check-card', function (response) {
            if (response && response.DataList) {
                if (response.DataList.Bind_Card > 0) {
                    $step2
                        .addClass('alert-success')
                        .removeClass('alert-info')
                        .find('.success')
                        .show();

                    $step2.find('.message').text('当前账户绑定了' + response.DataList.Bind_Card.Bind_Card + "张学习卡");

                    deferred.resolve();
                } else {
                    $step2
                        .addClass('alert-warning')
                        .removeClass('alert-info')
                        .find('.error')
                        .show();

                    $step2.find('.message').text("当前账户没有绑定学习卡");
                    deferred.resolve();
                }
            } else {
                $step2
                    .addClass('alert-danger')
                    .removeClass('alert-info')
                    .find('.error').show();

                deferred.reject();
            }
        }, 'json');

        return deferred;
    }

    //  补修课检测
    var step3 = function () {
        var deferred = $.Deferred();
        $.get('/detect-api/check-history-course', function (response) {
            if (response) {
                $step3
                    .addClass('alert-success')
                    .removeClass('alert-info')
                    .find('.success')
                    .show();

                $step3.find('.message').text("sss");
                deferred.resolve();
            } else {
                $step3
                    .addClass('alert-danger')
                    .removeClass('alert-info')
                    .find('.error').show();

                deferred.reject();
            }
        }, 'json');

        return deferred;
    }

    // 需要多少分的检测
    var step4 = function () {
        var deferred = $.Deferred();
        $.get('/detect-api/check-course-score', function (response) {
            if (response) {
                $step4
                    .addClass('alert-success')
                    .removeClass('alert-info')
                    .find('.success')
                    .show();

                $step4.find('.message').text("3");
                deferred.resolve();
            } else {
                $step4
                    .addClass('alert-danger')
                    .removeClass('alert-info')
                    .find('.error').show();

                deferred.reject();
            }
        }, 'json');

        return deferred;
    }


    $('#total-progress .progress-bar').text("检测中").addClass("progress-bar-striped");;
    $.when()
        //.then(step1)
        //.then(step2)
        .then(step3)
        .then(step4)
        .done(function () {
        })
        .fail(function () {

        })
        .always(function () {
            $('#total-progress .progress-bar').text("已完成").removeClass("progress-bar-striped");
        });
});