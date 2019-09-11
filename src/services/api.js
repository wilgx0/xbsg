const URL = {
    getSlides:'/api/home/slides/1',         //获取幻灯片
    getCategoryPostLists:'/api/portal/lists/getCategoryPostLists',  //按分类获取文章列表
    downAudio:'/portal/index/downAudio',              //下载音频文件地址
    bootdown:'/portal/index/bootdown',              //引导用户下载页面
    saveMessage:'/api/portal/articles',               //提交留言
    doLike:'/api/portal/articles/doLike',             //文章点赞
    addHits:'/api/portal/articles/addHits',           //增加查看数，用于排序查看
    getPages:'/api/portal/pages/',                           //获取单页面文章
    getUserByOpenid:'/api/wxapi/index/getUserByOpenid',         //获取用户信息
    logout:'/api/wxapi/index/logout',                        //用户退出
    checkLogin:'/api/wxapi/index/getUserId',                  //检查是否登录
    getVip:'/api/wxapi/user/getVip',                     //获取近期付费vip
}

export default  URL
