<template>
    <div class="home">
        <div class="title">西部山歌联盟会</div>

        <div>


            <swiper :options="swiperOption" ref="mySwiper">

                <swiper-slide v-for="item in slides">
                    <img v-lazy="item.image" alt="" :data-img="item.url">
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>

            </swiper>

            <ul class="menu">
                <li @click="goto('program')">
                    <i class="iconfont">&#xe6cf;</i><span>山歌节目</span>
                </li>

                <li @click="goto('song')">
                    <i class="iconfont">&#xe602;</i><span>山歌歌词</span>
                </li>

                <li @click="goto('accompany')">
                    <img class="icon" :src="imgs.music" alt="">
                    <span>山歌伴奏</span>
                </li>
            </ul>

            <ul class="menu">
                <li @click="goto('actor')"><img class="icon" :src="imgs.actor" alt=""><span>演员剧照</span></li>
                <li @click="showDetails = true"><img class="icon" :src="imgs.intro" alt=""><span>联盟会简介</span></li>
                <li @click="showRegister = true">
                    <div class="icon-vip flex-center">
                        <i class="iconfont" style="font-size:32px;">&#xe71e;</i>
                    </div>

                    <span>会员登录</span>
                </li>
            </ul>

            <div class="study" @click="goto('messages')">
                <img id="talk" :src="imgs.talk" alt="">
                <span>山歌学习交流</span>
            </div>



        </div>

        <!-- 页脚 -->
        <div class="foot">
            <div class="left">
                <i class="iconfont" style="font-size:0.5rem;">&#xeba6;</i>
                <span>消息公告</span>
                <span></span>
            </div>
            <div class="right">
                <van-notice-bar
                        color="#fff"
                        background="#1989fa"
                        :text="inform"
                />
            </div>
        </div>

        <!--联盟会简介-->
        <van-popup class="my-popup" v-model="showDetails" position="right">
            <van-nav-bar
                    title="联盟会简介"
                    left-text="返回"
                    left-arrow
                    @click-left="showDetails = false">
            </van-nav-bar>

            <div class="popup-main">
                <div class="popup-box">
                    <h3 class="popup-title">{{about && about.post_title}}</h3>
                    <p class="popup-subhead">{{about && about.published_time}}</p>
                    <div class="popup-content" v-html="about && about.post_content"></div>
                </div>
            </div>


        </van-popup>


        <!--会员注册-->
        <van-popup class="my-popup" v-model="showRegister" position="right">
            <van-nav-bar
                    title="会员登录"
                    left-text="返回"
                    left-arrow
                    @click-left="showRegister = false">
            </van-nav-bar>

            <div class="popup-main">
                <div class="popup-box user-loging flex-center">

                    <div v-if="isLogin" class="portrait">
                        <img :src="userInfo.headimgurl" alt="">
                    </div>

                    <div v-if="isLogin" class="nickname">
                        欢迎您：{{userInfo.user_nickname}}
                    </div>
                    <div v-if="isLogin">
                        <van-button  type="info" :loading="loginLoing" @click="logout">注销</van-button>

                    </div>

                    <div v-else>

                        <div class="wxlog" @click="login">
                            <i class="iconfont">&#xe61e;</i>
                            <div>微信登录</div>
                        </div>
                        <!--<van-button  type="info" :loading="loginLoing" >登 录</van-button>-->
                    </div>
                </div>
            </div>
        </van-popup>


    </div>

</template>

<script>
    import util from '@/util.js'
    import 'swiper/dist/css/swiper.css'
    import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import url from '@/services/api.js'

    //引入图片
    import actor from '@/assets/img/actor.png'
    import intro from '@/assets/img/intro.png'
    import music from '@/assets/img/music.png'
    import talk from '@/assets/img/talk.png'
    import voice from '@/assets/img/voice.png'

    import Cookies from 'js-cookie'

    export default {
        name: 'home',
        data() {
            return {
                swiperOption: {
                    loop: true, // 循环模式选项
                    // 如果需要分页器
                    pagination: {
                        el: '.swiper-pagination'
                    },
                    on: {
                        tap: function (event) {
                            let url = event.target.dataset.img
                            if (url) {
                                window.location.href = url
                            }

                        },
                    },
                },
                slides: [], //幻灯片

                imgs: {              //首页菜单图标
                    actor,
                    intro,
                    music,
                    talk,
                    voice
                },
                showDetails: false,   //联盟会简介显示
                showRegister: false,     //会员注册
                about: {},              //联盟会简介
                openid:'',
                loginLoing:false,              //登录按钮加载状态
                isLogin:false,              //是否已经登录
                userInfo:{},                //用户信息
                vipUser:[]          //近期成为vip的会员
            }
        },

        methods: {
            goto(path) {
                this.$router.push({name: path})
            },
            async login() {        //微信登录

                if(this.isLogin){
                    this.$toast('您已经登录了')
                    return false
                }

                if(this.openid){
                    this.loginLoing = true

                    let res = await this.$http.get(url.getUserByOpenid,{
                        openid:this.openid,
                        device_type:util.getConfig('device')
                    })

                    this.loginLoing = false
                    if(res.data.code ===1){         //登录成功
                        let userInfo  = res.data.data
                        this.isLogin = true
                        this.userInfo = userInfo.user
                        Cookies.set('userInfo', userInfo.user)
                        Cookies.set('token', userInfo.token)
                        this.showRegister = false
                    } else {
                        this.$toast('请您先关注公众号!')
                    }
                    //this.$toast(res.data.msg)
                } else {
                    this.$toast('请您先关注公众号!')
                }

            },

            logout(){           //注销
                this.isLogin = false
                this.userInfo = {}
                Cookies.remove('userInfo')
                this.$http.get(url.logout)
            },

            getVip(){
                this.$http.get(url.getVip).then(res => {
                    console.log(res)

                    if(res.data.code == 1 ){
                        this.vipUser = res.data.data

                    }
                })
            }
        },

        computed:{
            inform(){
                return  this.vipUser.reduce((a, b)=>{
                    return a + " 恭喜[" + b.user_nickname + "]成为我们的付费会员!!! "
                },'')
            }


        },
        components: {
            swiper,
            swiperSlide
        },
        mounted() {
            //获取幻灯片
            this.$http.get(url.getSlides).then(res => {
                //console.log(res)
                if (res.data.code === 1) {
                    this.slides = res.data.data[0].items
                }
            })

            //获取联盟会简介
            this.$http.get(url.getPages + '59').then(res => {
                //console.log(res)
                if (res.data.code === 1) {
                    this.about = res.data.data
                }
            })

            //获取近期的付费会员
            this.getVip()

            //获取用户的openid
            let openid = Cookies.get('openid')
            this.openid = openid
            //console.log(process.env.NODE_ENV)
            //添加测试环境数据
            if(process.env.NODE_ENV !== 'production'){
                this.openid = 'owq7B5xvuJ6dqOP84tx545s8SGNY'
            }


            // 自动登录
            this.login()

        }
    }
</script>

<style lang="less">
    @import "../assets/css/style";



    .flex-center {
        justify-content: center;
        align-items: center;
    }

    .home {


        .wxlog{
            display:flex;
            flex-direction:column;
            .iconfont{
                color:#44b549;
            }

            .flex-center();

        }
        /*登录页面 */
        .user-loging{
            display:flex;
            flex-direction: column;
            height:100%;
            width:100%;
            button{
                width:200px;
            }

            .portrait{
                width:100px;
                height:100px;
                img{
                    width:100%;
                    height:100%;
                }
                margin-bottom:10px;
            }

            .nickname{
                margin-bottom:10px;
            }
        }

        .title {
            /*position: fixed;*/
            /*top: 0;*/
            height: 44px;
            line-height: 44px;
            text-align: center;
            color: #fff;
            background-color: #1989fa;
            box-sizing: border-box;
            width: 100%;
            font-size:14px;
            font-weight:bold;
        }

        .main {
            /*margin-top: 44px;*/
            /*height: calc(100vh - 114px);*/
            /*overflow: scroll;*/
        }

        .swiper-container {
            height: 5rem;
            img {
                width: 100%;
                height: 100%;
            }
        }

        .menu {
            display: flex;
            justify-content: space-between;
            margin: 0.2rem 0;
            .icon {
                width: 1.8rem;
                height: 1.8rem;
            }
            .icon-vip{
                display:flex;
                height:66px;
                width: 80px;
                box-sizing: border-box;
                padding-left: 10px;
            }
            li {
                width: 3.2rem;
                height: 3.2rem;
                color: #fff;
                background-color: #1989fa;
                font-size: 14px;
                display: flex;
                flex-direction: column;
                .flex-center();
                & > i {
                    margin-bottom: 0.2rem;
                }
                & > span {
                    font-size: 14px;
                    font-weight: bold;
                }
            }
        }

        .study {

            #talk {
                width: 1.5rem;
                height: 1.5rem;
                margin-right:40px;
            }
            span {
                font-size: 24px;
                font-weight: bold;
                color: #fff;

            }


            height: 2.7rem;
            background-color: #1989fa;
            display: flex;
            justify-content:flex-start;
            align-items:center;
            padding-left:23px;
        }

        .foot {
            /*position: fixed;*/
            /*bottom: 0;*/
            width: 375px;
            height: 70px;
            box-sizing: border-box;
            .left {
                font-size: 16px;
                font-weight: bold;
                line-height: 32px;
                color: #1989fa;
                display: flex;
                justify-content: space-between;
                padding: 0 0.1rem;
            }
            .right {
                .van-notice-bar {
                    font-size: 14px;
                }
            }

        }

    }
</style>
