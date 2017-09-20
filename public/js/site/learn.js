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

    window.study = function (courseId, chapterId) {
        var loading = layer.load();
        sessionStorage.setItem('cwid', chapterId);
  
        $.post('/course/study', {
            chapterId: chapterId
        }, function (response) {
            if (loading) {
                layer.close(loading);
            }

            if (response && response.success) {
                layer.msg('恭喜你，学习成功');
            } else {
                layer.msg(response.message || '出现了一点问题');
            }
        }, 'json');
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
});