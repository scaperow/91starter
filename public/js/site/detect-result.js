$(function () {
    // 用户名密码检测
    var $step = $('.step1');
    $step.find('.result').hide();
    $step.find('.waiting').show();

    $.get('/detect-api/check-account', function (response) {
        $step.attr('class', 'step1 alert alert-info');
        $step.find('.waiting').hide();
        $step.find('.result').show();

        if (response) {
            $step.attr('class', 'step1 alert alert-success');
            $step.find('.error').hide();
            $step.find('.success').show();
        } else {
            $step.attr('class', 'step1 alert alert-danger');
            $step.find('.success').hide();
            $step.find('.error').show();
        }
    }, 'json');

    // 学习卡检测

    // 学分是否及格检测

    // 需要多少分的检测


});