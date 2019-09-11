<template>
    <div class="message">
        <van-nav-bar
                title="留言版"
                left-text="返回"
                left-arrow
                @click-left="goBack">
            <div slot="right" class="nav-right">
                <van-button plain hairline type="info" size="mini" text="留 言" @click="showMessage = true"></van-button>
            </div>
        </van-nav-bar>

        <div class="main">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
            ref="vanList"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">

                <van-cell
                        @click="details(index)"
                        :key="item.id" v-for="(item,index) in list"
                        size="large"
                        is-link
                        :title="item.post_title | splitStr(12)"
                        :value="splitTime(item.published_time,'m')+'-'+splitTime(item.published_time,'d')"
                        :label="item.post_excerpt | splitStr(20)" />


            </van-list>
            </van-pull-refresh>
        </div>

        <!--留言面板-->
        <van-popup v-model="showMessage" position="right">
            <van-nav-bar
                    title="留言提交"
                    left-text="返回"
                    left-arrow
                    @click-left="showMessage = false">
            </van-nav-bar>

            <div class="main">
                <van-cell-group>
                    <van-field
                            required
                            label="留言标题:"
                            v-model="post_title"
                            placeholder="请输入标题"/>
                </van-cell-group>

                <van-cell-group>
                    <van-field
                            class="message-input"
                            required
                            v-model="message"
                            label="留言内容:"
                            type="textarea"
                            placeholder="请输入留言"
                            rows="1"
                            autosize
                    />
                </van-cell-group>

                <div class="popup-foot">
                    <van-row type="flex" justify="center">
                        <van-col span="6" type="flex" justify="center" align="center">
                            <van-button type="primary" @click="submit" block :loading="submitLoading">提交</van-button>
                        </van-col>

                        <van-col span="6" type="flex" justify="center" align="center" offset="1">
                            <van-button type="default" block @click="clearForm">清 空</van-button>
                        </van-col>
                    </van-row>
                </div>
            </div>


        </van-popup>

        <!--留言详情查看-->
        <van-popup v-model="showDetails" position="right">
            <van-nav-bar
                    title="留言查看"
                    left-text="返回"
                    left-arrow
                    @click-left="showDetails = false">
            </van-nav-bar>

            <div class="main">
                <div class="detail-content">
                    <h3 class="title">{{currentMessage.post_title}}</h3>
                    <p class="subhead">{{currentMessage.published_time}}</p>
                    <div class="content" v-html="currentMessage.post_content"></div>
                </div>
            </div>


        </van-popup>
    </div>
</template>

<script>
    import url from '@/services/api.js'
    import util from '@/util.js'
    import schema from 'async-validator'

    export default {
        name: 'messages',
        data() {
            return {
                list: [],            //数据列表
                loading: false,     //上拉加载状态
                finished: false,    //上拉加载结束
                isLoading: false,   //下拉刷新状态
                page: 1,             //当前页

                showMessage: false,     //留言面板显示
                showDetails:false,    //留言详情查看

                post_title: '',      //留言标题
                message: '',          //留言内容
                submitLoading: false, //按钮加载状态
                currentMessage:{}

            }
        },
        methods: {
            details(index){
                this.showDetails = true
                this.currentMessage = this.list[index]
            },
            splitTime(date,value){
                let arr = util.splitTime(date)
                if(arr){
                    return arr[value] || ''
                }else {
                    return ''
                }
            },
            clearForm(){                //清空表单数据
                this.post_title = ''
                this.message = ''
            },
            async submit() {               //提交留言

                var descriptor = {
                    post_title: [
                        {
                            type: "string",
                            required: true,
                            message: '留言标题必须'
                        },
                        {
                            max: 25,
                            message: '留言标题长度25个字'
                        }

                    ],
                    message: [
                        {
                            type: "string",
                            required: true,
                            message: '留言内容必须'
                        },
                        {
                            max: 200,
                            message: '留言内容长度200个字'
                        },

                    ]

                }

                var validator = new schema(descriptor);
                try{
                    let validator_error  = await validator.validate({
                        post_title: this.post_title,
                        message: this.message
                    },(errors, fields) => {
                        if (errors) {
                            //console.log(errors, fields)
                            let str = '';
                            for (let i = 0; i < errors.length; i++) {
                                str += errors[i].message + "\n"
                            }
                            this.$toast({message: str})
                            throw new Error('验证失败')
                        }
                    })

                    if(validator_error){
                        return false
                    }


                    this.submitLoading = true
                    let res = await this.$http.post(url.saveMessage, {
                        'post_title': this.post_title,
                        'post_content': this.message,
                    })
                    this.submitLoading = false
                    res = res.data
                    if (res.code === 1) {
                        this.post_title = ''
                        this.message = ''
                    }
                    this.$toast(res.msg || '网络异常，请稍后再试!!!');


                }catch(e){
                    this.submitLoading = false
                    console.log(e)
                }

            },
            goBack() {      //返回
                this.$router.go(-1)
            },
            async onLoad() {                      //上拉加载
                let list = await this.getArticleList()
                if (list.length == 0) {
                    this.finished = true         //数据全部加载完成
                } else {
                    this.list = this.list.concat(list)
                }
                this.loading = false           //加载状态结束
            },
            async onRefresh() {                 //下拉刷新
                this.list = []
                this.page = 1
                await this.onLoad()
                this.isLoading = false       //刷新状态结束
                this.finished = false        //上拉加载结束状态取消
                this.$refs.vanList.check()   //检查当前的滚动位置，若已滚动至底部，则会触发 load 事件
            },
            async getArticleList() {        //获取留言信息
                var page = [this.page++,10]
                let list = await this.$http.get(url.getCategoryPostLists, {
                    category_id: 2,
                    page:page.join(',')
                })
                list  =  list.data.code === 1 ? list.data.data.list:[]
                return list
            }
        },
        computed:{

        },
        mounted(){

        }
    }
</script>

<style lang="less">
    @import "../assets/css/list";

    .message {
        .main {
            .list-item {

            }


            .message-input{
                textarea{
                    height:240px !important;
                }
            }
        }

        .detail-content{
            padding:10px;
            .title,.subhead{
                margin:10px 0;
                text-align:center;
            }
            .title{
                font-size:16px;
            }
            .subhead{
                font-size:12px;
            }

            .content {
                font-size:14px;
                text-indent: 15px;
            }
        }
    }
</style>
