<template>
    <div class="program">
        <van-nav-bar
                title="山歌节目"
                left-text="返回"
                left-arrow
                @click-left="goBack">
        </van-nav-bar>

        <div class="main">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                        ref="vanList"
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad">

                    <div class="list" slots="default">
                        <div class="list-item" :key="item.id" v-for="(item,index) in list" @click="jump(item.post_source)">
                            <img  v-lazy="item.more.thumbnail || ''" >
                            <i class="iconfont play-icon">&#xe641;</i>
                            <p class="title">{{item.post_title | splitStr(8)}}</p>
                        </div>
                    </div>

                </van-list>
            </van-pull-refresh>
        </div>

    </div>
</template>

<script>
    import url from '@/services/api.js'
    import util from '@/util.js'
    import Cookies from 'js-cookie'


    export default {
        name: 'program',
        data() {
            return {
                list: [],            //数据列表
                loading: false,     //上拉加载状态
                finished: false,    //上拉加载结束
                isLoading: false,   //下拉刷新状态
                page:1,             //当前页

            }
        },
        computed:{
            images(index){
                return this.list.map((currentValue,index,arr)=>currentValue.more.thumbnail)
            }
        },

        methods: {
            jump(jump_url){                           //跳转
                if(jump_url){
                    this.$http.get(url.checkLogin).then(res=>{
                        if(res.data.code === 10001){
                            this.$toast.fail(res.data.msg)
                        } else {
                            let userInfo = JSON.parse(Cookies.get('userInfo'))
                            if(userInfo.vip === 1){
                                window.location.href = jump_url
                            } else {
                                this.$toast.fail('请先成为付费会员')
                            }
                        }
                    })

                } else {
                    this.$toast.fail('抱歉暂时没有资源')
                }
            },
            goBack() {                             //返回上一页
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
                this.finished = false        //上拉加载结束
                this.$refs.vanList.check()   //检查当前的滚动位置，若已滚动至底部，则会触发 load 事件
            },
            async getArticleList(){
                var page = [this.page++,12]
                let list = await this.$http.get(url.getCategoryPostLists, {
                    category_id: 4,
                    page:page.join(','),
                    ...this.queryParam
                })
                list  =  list.data.code === 1 ? list.data.data.list:[]
                return list
            }
        },
        async mounted(){

        }

    }
</script>

<style lang="less">

    @import "../assets/css/list";

    .program {
        .main{
            .list-item{
                position: relative;
                img{
                    width:100%;
                    height:100%;
                }

                .play-icon{
                    position:absolute;
                    top:5px;
                    left:10px;
                    font-size:20px;
                    color:#fff;
                }

                .title{
                    position:absolute;
                    bottom:5px;
                    left:10px;
                    color:#fff;
                    font-size:14px;
                    margin:0;
                }
            }
        }
    }
</style>
