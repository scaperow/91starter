var keystone = require('keystone');
var request = require('request');
var middleware = require('../middleware');
var jar = request.jar();

var GET_VALIDATE_CODE_URL = 'http://cmeapp.91huayi.com/UserInfo/GetCode';
var LOGIN_URL = 'http://cmeapp.91huayi.com/UserInfo/Login';
exports = module.exports = function (req, res) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    locals.validationErrors = {};
    locals.formData = req.body || {};
    locals.section = 'learn';
    locals.messages = { success: [], info: [], error: [] };


    view.on('init', function (next) {
        if (req.cookies.cme) {   // show all course
            // [{"Id":"042EA550-9454-433D-B474-5966DBDF6BDA","Course_Id":"9d8d1f78-329d-404d-9419-b528ee653bb5","Course_Name":"《医学科研诚信和相关行为规范》解读","Folder_Name":"201612510325","Course_Content":"本项目从多维度介绍了我国科研诚信建设情况、面临的问题、管理措施以及国内外进展，对《医学科研诚信和相关行为规范》中的重要内容进行了全面解读。《医学科研诚信和相关行为规范》中不仅涉及科研诚信，也关注科研伦理，知情同意、伦理审查、医学研究的透明性及可重复性等，都是国际上广泛关注的热点。","Img_Url":"2016012510362377.jpg","Is_National":1,"Item_No":"2017-15-01-021(国)","Old_Ttem_No":null,"Score_Name":"国家I类 5.0学分","Weight":1000,"Expert_Name":"丛亚丽","Work_Unit_Name":"北京大学医学部","Attention":2.0,"Insert_Time":"\/Date(1453689388680)\/","Study_State":0,"Is_Public":0,"Dept_Id":"00000000-0000-0000-0000-000000000000","Training_Way_Id":"d3169470-6777-4658-b7a1-9e650122348d","Assign_Type_Name":"国家I类","Assign_Num":"5.0","Score_Kind_Show":"国家I类 5.0学分","StreamLine":"国","FistNavLink":null,"DeptName":null,"FistNav":null,"IsNational":null,"Item_no":"2017-15-01-021(国)","Old_item_no":"","C_expertname":null,"C_unitname":null,"Expert_id":"00000000-0000-0000-0000-000000000000","Public_Weight":0,"C_Attention":0,"State":0,"ShowAssNum":null,"Study_State_Name":null},{"Id":"7DB1F7EE-57C0-4009-B668-99D350F1DE77","Course_Id":"c0bedbaf-4567-4ca4-b0fe-5d5eb2b93e3b","Course_Name":"从医患关系现状谈医务人员的医患沟通技巧与培养","Folder_Name":"201633095850","Course_Content":"近年来，在医患纠纷中患方辱骂、殴打医务人员，围攻医院，有甚者故意将医务人员致残、致死的恶性案件时有发生，性质极其恶劣，解析医患关系，提出改善医患关系的建议，维护医疗服务行业秩序，已不仅仅是卫生行政部门的责任，而是社会共同面对的话题。良好的医患沟通是消除医患纠纷的最好途径，良好的沟通也是帮助患者重树生活信心、与医生建立良好配合的有效方式。医务工作者掌握好了沟通的技巧，才能更好地为患者服务，有效减少医疗纠纷。通过本项目的学习，使学员深入了解医患沟通的重要意义，掌握医患沟通的技巧，通过对国外医患沟通模式与方法的学习，能够对我国构建和谐医患关系有所借鉴，提高医师的沟通技能，从而减少医患纠纷的发生。","Img_Url":"2016033010005673.jpg","Is_National":1,"Item_No":"2017-15-01-016(国)","Old_Ttem_No":null,"Score_Name":"国家I类 5.0学分","Weight":1000,"Expert_Name":"吴任钢","Work_Unit_Name":"北京大学医学部","Attention":2.0,"Insert_Time":"\/Date(1459303320653)\/","Study_State":0,"Is_Public":0,"Dept_Id":"00000000-0000-0000-0000-000000000000","Training_Way_Id":"d3169470-6777-4658-b7a1-9e650122348d","Assign_Type_Name":"国家I类","Assign_Num":"5.0","Score_Kind_Show":"国家I类 5.0学分","StreamLine":"国","FistNavLink":null,"DeptName":null,"FistNav":null,"IsNational":null,"Item_no":"2017-15-01-016(国)","Old_item_no":"","C_expertname":null,"C_unitname":null,"Expert_id":"00000000-0000-0000-0000-000000000000","Public_Weight":0,"C_Attention":0,"State":0,"ShowAssNum":null,"Study_State_Name":null},{"Id":"309294EE-61EF-44C7-9F64-5F7ACEF9F426","Course_Id":"cbc52c06-d33f-4719-9503-0d8ef1970af3","Course_Name":"感恩、共情--医患共筑和谐情","Folder_Name":"201510151557","Course_Content":"近几年来因医患沟通不够或沟通无效而导致医患关系紧张，医疗纠纷现象时有发生。通过本项目的学习，旨在使临床医护工作者了解医患关系现状、了解在医疗活动中医患关系的特征、表现及影响因素，掌握有效的医患沟通技巧，使临床医护工作者适应医疗变革，建立新型和谐的医患关系，从而减少医疗投诉事件和医疗纠纷的发生。","Img_Url":"2015101503593385.jpg","Is_National":1,"Item_No":"2017-15-01-014(国)","Old_Ttem_No":null,"Score_Name":"国家I类 5.0学分","Weight":1000,"Expert_Name":"张桂青","Work_Unit_Name":"石河子大学医学院第一附属医院","Attention":2.0,"Insert_Time":"\/Date(1444895977227)\/","Study_State":3,"Is_Public":0,"Dept_Id":"00000000-0000-0000-0000-000000000000","Training_Way_Id":"d3169470-6777-4658-b7a1-9e650122348d","Assign_Type_Name":"国家I类","Assign_Num":"5.0","Score_Kind_Show":"国家I类 5.0学分","StreamLine":"国","FistNavLink":null,"DeptName":null,"FistNav":null,"IsNational":null,"Item_no":"2017-15-01-014(国)","Old_item_no":"","C_expertname":null,"C_unitname":null,"Expert_id":"00000000-0000-0000-0000-000000000000","Public_Weight":0,"C_Attention":0,"State":0,"ShowAssNum":null,"Study_State_Name":null},{"Id":"B068C404-2401-4A1F-9221-FEE2C8446801","Course_Id":"4eab6516-8465-423e-9a4d-634fba6fa4c7","Course_Name":"基本医疗法解读及医疗纠纷实例剖析","Folder_Name":"201612615494","Course_Content":"当今社会，随着医疗水平的不断提高，与之相伴随的是医患纠纷愈演愈烈。然而，令人深思的并非是医疗纠纷数量的增多，而是相当多的医疗纠纷未得到妥善解决最终转化为暴力冲突，北京同仁医院患者持刀砍伤医生等恶性事件的发生便是明证。患者维权未果转而求助于“医闹”甚而出现暴力行为，医方为求自保也采取各种对抗性手段，导致医患关系愈发紧张，社会负面影响极坏。因此，如何公平有效地解决医疗纠纷已成为社会各界广泛关注的热点问题。","Img_Url":"2016012603515033.jpg","Is_National":1,"Item_No":"2017-15-01-020(国)","Old_Ttem_No":null,"Score_Name":"国家I类 5.0学分","Weight":1000,"Expert_Name":"张振峰","Work_Unit_Name":"北京市盈科律师事务所","Attention":2.0,"Insert_Time":"\/Date(1453794716517)\/","Study_State":0,"Is_Public":0,"Dept_Id":"00000000-0000-0000-0000-000000000000","Training_Way_Id":"d3169470-6777-4658-b7a1-9e650122348d","Assign_Type_Name":"国家I类","Assign_Num":"5.0","Score_Kind_Show":"国家I类 5.0学分","StreamLine":"国","FistNavLink":null,"DeptName":null,"FistNav":null,"IsNational":null,"Item_no":"2017-15-01-020(国)","Old_item_no":"","C_expertname":null,"C_unitname":null,"Expert_id":"00000000-0000-0000-0000-000000000000","Public_Weight":0,"C_Attention":0,"State":0,"ShowAssNum":null,"Study_State_Name":null},{"Id":"81C3F4C4-9F05-40DB-85F8-E92453BB2279","Course_Id":"96fb7c71-911f-4c54-b81f-7e22f4fbda7b","Course_Name":"建设和谐医院--医改深化发展的当务之需","Folder_Name":"201612110283","Course_Content":"随着新医改政策的全方位贯彻实施以及经济社会的全面发展，公众对健康的重视程度逐渐增强，对医疗卫生行业的服务要求也越来越高，医患关系也随之日趋紧张，医疗纠纷发生率大幅度攀升。医患矛盾正成为急需解决的社会问题，正确处理好医患关系已成了目前全社会的迫切愿望。 该项目以协调医患关系为出发点，重点对医院文化医院精神是员工个人价值追求的融汇、和谐医院建设中的领导人、知识密集的团队更加需要人文关爱与温馨、医疗服务中良善工作模式的建设与人际关系的处理以及在团队集体努力中重建和谐温馨医患关系和正常医疗秩序等内容作了重点讲解，以使广大医务工作者从自身做起，打造和谐医院，为构建和谐社会，推进医改的深化发展作出积极贡献","Img_Url":"2016012110294565.jpg","Is_National":1,"Item_No":"2017-15-01-017(国)","Old_Ttem_No":null,"Score_Name":"国家I类 5.0学分","Weight":1000,"Expert_Name":"陈文叔","Work_Unit_Name":"北京医学会伦理学分会","Attention":2.0,"Insert_Time":"\/Date(1453343380763)\/","Study_State":3,"Is_Public":0,"Dept_Id":"00000000-0000-0000-0000-000000000000","Training_Way_Id":"d3169470-6777-4658-b7a1-9e650122348d","Assign_Type_Name":"国家I类","Assign_Num":"5.0","Score_Kind_Show":"国家I类 5.0学分","StreamLine":"国","FistNavLink":null,"DeptName":null,"FistNav":null,"IsNational":null,"Item_no":"2017-15-01-017(国)","Old_item_no":"","C_expertname":null,"C_unitname":null,"Expert_id":"00000000-0000-0000-0000-000000000000","Public_Weight":0,"C_Attention":0,"State":0,"ShowAssNum":null,"Study_State_Name":null}]
            middleware.requestToCME(
                req,
                res,
                'http://cmeapp.91huayi.com/Course/LoadCourseList?assign_type_id=&deptid=&indexpage=1&kind=2&order_by=&pageSize=5&titleId=60ff34fa-cee9-4bdf-b711-ce615e9951fa',
                'GET',
                function (res) {
                  
                    locals.courses = res;
                    next();
                });

            locals.isLoginToCME = true;
        
        } else {
            if(!req.cookies.cme_tmp){
            request({
                url: GET_VALIDATE_CODE_URL,
                method: 'GET',
                jar: jar
            }, function (error, response, body) {
                res.cookie('cme_tmp', jar.getCookieString(GET_VALIDATE_CODE_URL));
                next();
            });
        }else{
            next();
        }
        }
    });


    view.on('post', function (next) {
        if(!req.cookies.cme_tmp){
            res.flash('没有找到相关会话，请刷新浏览器重试');
            return next();
        }

        request({
            url: LOGIN_URL,
            method: 'POST',
            jar: jar,
            headers: {
                'Cookie': req.cookies.cme_tmp
            },
            form: {
                userName: req.body.user,
                userPwd: req.body.password,
                weixinId: null,
                code: req.body.validateCode,
                isBind: true,
            }
        }, function (error, response, body) {
            body = JSON.parse(body);

            if (body && body.Success && body.Data) {
                req.flash('success', '登录成功');
                res.cookie('cme',req.cookies.cme_tmp);
                res.clearCookie('cme_tmp');
                locals.isLoginToCME = true;
            } else {
                req.flash('error', body.Message || '登录失败');
            }

            next();
        });
    });

    middleware.requireUser(req, res, function () {
        view.render('learn');

    });

};
