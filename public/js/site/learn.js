$(function () {

    var lastMajorId, lastTitleId, pageIndex = 1, pageSize = 20;
    var fetchCourse = function (loading) {
        $.get('/learn/courses', {
            majorId: lastMajorId,
            titleId: lastTitleId,
            pageIndex: pageIndex,
            pageSize: pageSize
        }, function (response) {
            if (loading) {
                layer.close(loading);
            }

            if (!response) {
                layer.message('没有更多了');
            }

            $('#course_list').append(response);
        }, 'html');
    };

    window.showChapter = function (courseId) {
        var loading = layer.load();

        $.get('/learn/chapters', {
            courseId: courseId
        }, function (response) {
            if (loading) {
                layer.close(loading);
            }

            $('#course_chapter_' + courseId).html(response);
        }, 'html');
    };

    window.study = function (courseId, score) {
        var confirmId = layer.confirm('学习成功后将会从您的账户扣除' + score + '学分，是否继续学习？', {
            btn: ['是', '否'] //按钮
        }, function () {
            layer.close(confirmId);
            var tipId = layer.msg('正在学习，请稍候...', {
                time: 0
            });

            setTimeout(function () {
                $.post('/learn/exam', {
                    courseId: courseId
                }, function (response) {
                    layer.close(tipId);

                    if (response && response.success) {
                        layer.msg('学习成功，恭喜你可以为该课程的申请证书了');

                        $.get('/learn/course', {
                            courseId: courseId
                        }, function (response) {
                            $('#course_container_' + courseId).replaceWith(response);
                        }, 'html');
                    } else {
                        layer.msg(response.message || '出现了一点问题', {
                            time: 0,
                            btn: ['好的'],
                            yes: function (index) {
                                layer.close(index);
                            }
                        });
                    }
                }, 'json');
            });
        });
    };

    window.loadMoreCourse = function () {
        pageIndex++;
        fetchCourse(layer.load());
    };

    window.onClickLevelMajor = function (currentLevel, majorId, parentId) {
        lastMajorId = majorId;
        var loading = layer.load();
        if (currentLevel >= 3) {
            $('#course_list').html('');
            pageIndex = 1;
            fetchCourse(loading);
        } else {
            $.get('/learn/majors', {
                level: currentLevel + 1,
                majorId: majorId
            }, function (response) {
                $('#sub_major_' + majorId).html(response);
                layer.close(loading);
            }, 'html');
        }
    };

    window.onClickTitle = function (titleId) {
        lastTitleId = titleId;
        var loading = layer.load();
        $.get('/learn/titles', {
            titleId: lastTitleId,
        }, function (response) {
            $('.sub-title').html('');

            if (response) {
                $('#sub_title' + titleId).html(response);
                layer.close(loading);
            } else {
                $('#course_list').html('');
                pageIndex = 1;
                fetchCourse(loading);
            }
        }, 'html');
    };


    $.ajaxSetup({
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401) {
                window.location.href = "/login";
            } else {
                layer.msg('发生了一些错误');
            }
        }
    });
});