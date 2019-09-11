<template>
    <div class="accompany">
        <van-nav-bar
                title="山歌伴奏"
                left-text="返回"
                left-arrow
                @click-left="goBack">
            <div slot="right" class="nav-right">
                <van-button plain hairline :type="newOder === true ? 'info' : ''" size="mini" text="最新上传" @click="newData"></van-button>
                <van-button plain hairline :type="newOder === false ? 'info' : ''" size="mini" text="热门下载" @click="hotData"></van-button>
            </div>
        </van-nav-bar>

        <div class="main"  ref="wrapper">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <van-list
                        ref="vanList"
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad">
                    <div class="list" slots="default">
                        <div class="list-item" :key="item.id" v-for="item in list" @click="down(item.more.audio,item.post_title,item.id)" >
                            <div class="left">
                                <van-icon name="play-circle-o" color="#1989fa" size="30px"/>
                                <span>{{item.post_title| splitStr(8)}}</span>
                            </div>
                            <div class="right">

                            </div>
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
        name: 'accompany',
        data() {
            return {
                list: [],            //数据列表
                loading: false,     //上拉加载状态
                finished: false,    //上拉加载结束
                isLoading: false,   //下拉刷新状态
                page:1,             //当前页
                newOder:true,       //按最新排序
                queryParam:{
                    order:'-published_time'
                },        //查询字符串
                scroll:undefined   //惯性滚动对象
            }
        },
        methods: {

            newData(){      //按最新排序
                this.newOder = true
                this.queryParam = {
                    order:'-published_time'
                }
                this.onRefresh()
            },
            hotData(){         //按热门排序
                this.newOder = false
                this.queryParam = {
                    order:'-post_hits,-published_time'
                }
                this.onRefresh()
            },
            down(downUrl,name,id){             //下载伴奏
                if(downUrl  && name && id){

                    this.$http.get(url.checkLogin).then(res=>{
                        if(res.data.code === 10001){
                            this.$toast(res.data.msg)
                        } else {
                            let userInfo = JSON.parse(Cookies.get('userInfo'))
                            if(userInfo.vip === 1){
                                // let param = '?url=' + downUrl + '&name=' + name + '&id='+ id
                                // util.downloadFile(url.downAudio + param)

                                let param = '?fileurl=' + downUrl + '&name=' + name + '&id='+ id
                                window.location.href = url.bootdown + param
                            } else {
                                this.$toast('请先成为付费会员')
                            }
                        }
                    })
                }

                else {
                    this.$toast.fail('抱歉暂时没有资源')
                }
            },
            goBack() {
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
                    category_id: 1,
                    page:page.join(','),
                    ...this.queryParam
                })
                list  =  list.data.code === 1 ? list.data.data.list:[]
                return list
            }
        },
        mounted(){}

    }
</script>

<style lang="less">
    @import "../assets/css/list";
    .icon{
        font-size:0.1rem;
        color:#cccccc;
    }
    .accompany {
        .main{
            .list-item{
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                .left{
                    display:flex;
                    align-items:center;
                    & > span{
                        padding-left:10px;
                        font-size:16px;
                    }
                }
                .right{
                    width:4rem;
                    height:0.2rem;
                    background-image:url(~@/assets/img/voice.png);
                    background-repeat:no-repeat;
                    background-position:0 0;
                    background-size: 4rem 0.2rem;
                    margin-top:0.2rem;
                }
            }
        }
    }
</style>
