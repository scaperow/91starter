(function () {
    var app = new Vue({
        el: '#app',
        data: {
            result1: null,
            result2: null,
            result3: null,
            result4: null
        },
        methods: {
            step1: function () {
                var deferred = $.Deferred();
                axios.get('/detect-api/check-account')
                    .then(function (response) {
                        if (response.data && response.data.success) {
                            app.result1 = response.data;
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    .catch(function (error) {
                        alert('网络错误');
                        deferred.reject();
                    });

                return deferred;
            },

            step2: function () {
                var deferred = $.Deferred();
                axios.get('/detect-api/check-card')
                    .then(function (response) {
                        app.result2 = response.data;
                        deferred.resolve();
                    })
                    .catch(function (error) {
                        alert('网络错误');
                        deferred.reject();
                    });

                return deferred;
            },

            step3: function () {
                var deferred = $.Deferred();
                axios.get('/detect-api/check-card')
                    .then(function (response) {
                        app.result3 = response.data;
                        deferred.resolve();
                    })
                    .catch(function (error) {
                        alert('网络错误');
                        deferred.reject();
                    });

                return deferred;
            },

            step4: function () {
                var categoryScoreRex = new RegExp(/(\w+)类学分不足(\d+)分/g);
                var totalScorerRex = new RegExp(/总分不足(\d+)学分/g);
                var deferred = $.Deferred();
                var regexResult = null;

                axios.get('/detect-api/check-course-score')
                    .then(function (response) {
                        app.result4 = response.data;
                        app.result4.scores.forEach(function (score) {
                            if (score.scores && score.scores.length > 0) {
                                var scoreItem = score.scores[0];
                                if (!scoreItem.score_id && !scoreItem.score_type && scoreItem.dabiaoResult.indexOf("不达标") > -1) {
                                    // 不达标
                                    score.isPass = false;
                                    score.categoryReson = [];
                                    score.totalReason = null;
                                    regexResult = null;
                                    while ((regexResult = categoryScoreRex.exec(score.dabiaoResult)) !== null) {
                                        score.categoryReson.push({
                                            title: regexResult[0],
                                            category: regexResult[1],
                                            score: regexResult[2]
                                        });
                                    }

                                    regexResult = totalScorerRex.exec(score.dabiaoResult);
                                    if (regexResult === null) {
                                        score.totalReason = {
                                            title: '解析时发生了错误'
                                        }
                                    } else {
                                        score.totalReason = {
                                            title: regexResult[0],
                                            score: regexResult[1]
                                        };
                                    }

                                } else {
                                    // 达标
                                    score.isPass = true;
                                }
                            }
                        });
                        deferred.resolve();
                    })
                    .catch(function (error) {
                        alert('网络错误');
                        deferred.reject();
                    });
            },


        },
        created: function () {
            let $this = this;
            this.step1()
                .done(function () {
                    $.when()
                        .then($this.step2)
                        .then($this.step4)
                        .done(function () {
                        })
                        .fail(function () {
                        })
                        .always(function () {
                        });
                }).fail(function () {
                    alert('用户名密码检测失败，请重新登录');
                    top.window.location = "/detect";
                });


        }
    });
})();
