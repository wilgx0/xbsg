<template>
    <div class="song">
        <van-nav-bar
                title="歌词下载"
                left-text="返回"
                left-arrow
                @click-left="goBack">
            <div slot="right" class="nav-right">
                <van-button plain hairline :type="newOder === true ? 'info' : ''" size="mini" text="最新上传"
                            @click="newData"></van-button>
                <van-button plain hairline :type="newOder === false ? 'info' : ''" size="mini" text="热门下载"
                            @click="hotData"></van-button>
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
                    <div class="list" slots="default">

                        <div class="list-item" :key="item.id" v-for="(item,index) in list"
                             @click="down(item.more.files,item.post_title,item.id)">

                            <div class="left">
                                <span>{{item.post_title | splitStr(8)}}</span>
                            </div>

                            <div class="right">
                                <span @click.stop="addHits(index,item.id)" :class="{'highlight':item.isZan}"><i class="iconfont" :class="{'highlight':item.isZan}">&#xe60e;</i>{{item.post_hits}}</span>
                                <span @click.stop="doLike(index,item.id)" :class="{'highlight':item.isLike}"><i class="iconfont" :class="{'highlight':item.isLike}">&#xe63b;</i>{{item.post_like}}</span>
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
        name: 'song',
        data() {
            return {
                list: [],            //数据列表
                loading: false,     //上拉加载状态
                finished: false,    //上拉加载结束
                isLoading: false,   //下拉刷新状态
                page: 1,             //当前页
                newOder: true,       //按最新排序
                queryParam: {
                    order: '-published_time'
                },        //查询字符串

            }
        },
        methods: {
            addHits(index,id){

                if(this.list[index].isZan === true){
                    return false
                }

                this.$http.get(url.addHits,{
                    id:id
                })
                .then(res=>{
                   //console.log(res)
                    if(res.data.code === 1){
                        this.list[index].post_hits +=1
                        this.list[index].isZan = true

                    }
                })
                .catch(err=>{
                    console.log(err)
                    this.$toast('网络故障，请稍后再试!!')
                })
            },
            doLike(index,id){

                this.$http.post(url.doLike,{
                    id:id
                })
                .then(res=>{
                   // console.log(res)
                    if(res.data.code === 1){
                        this.list[index].post_like +=1
                        this.list[index].isLike = true
                    }

                    this.$toast(res.data.msg)
                })
                .catch(err=>{
                    console.log(err)
                    this.$toast('网络故障，请稍后再试!!')
                })
            },
            newData() {      //按最新排序
                this.newOder = true
                this.queryParam = {
                    order: '-published_time'
                }
                this.onRefresh()
            },
            hotData() {         //按热门排序
                this.newOder = false
                this.queryParam = {
                    order: '-post_hits,-published_time'
                }
                this.onRefresh()
            },
            down(downUrl, name, id) {             //下载歌词文件
                if (downUrl && downUrl.length > 0 && name && id) {
                    this.$http.get(url.checkLogin).then(res=>{

                        if(res.data.code === 10001){
                            this.$toast.fail(res.data.msg)
                        } else {
                            let userInfo = JSON.parse(Cookies.get('userInfo'))
                            if(userInfo.vip === 1){
                               // let param = '?url=' + downUrl[0].url + '&name=' + downUrl[0].name.replace(/\..+$/,'') + '&id=' + id
                                //util.downloadFile(url.downAudio + param)
                                //this.$toast.success('下载成功!');

                                let param = '?fileurl=' + downUrl[0].url + '&name=' + downUrl[0].name.replace(/\..+$/,'') + '&id=' + id
                                //console.log(url.bootdown + param)
                                window.location.href = url.bootdown + param


                            } else {
                                this.$toast.fail('请先成为付费会员')
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
            async getArticleList() {
                var page = [this.page++, 12]
                let list = await this.$http.get(url.getCategoryPostLists, {
                    category_id: 5,
                    page: page.join(','),
                    ...this.queryParam
                })
                list = list.data.code === 1 ? list.data.data.list : []
                return list
            }
        },
        async mounted() {

        }

    }
</script>

<style lang="less">
    @import "../assets/css/list";

    .icon {
        font-size: 0.1rem;
        color: #cccccc;
    }

    .song {


        .main {
            .list-item {
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                padding-top: 20px;
                .left {
                    width: 100%;
                    font-size: 14px;
                    height: 22px;
                    line-height: 22px;
                    text-align: center;
                    color: #fff;
                    position: relative;
                    span {
                        display: block;
                        background-color: #1989fa;
                        width: 120px;
                        margin: 0 auto;
                    }

                    &::after, &::before {
                        position: absolute;
                        content: '';
                        height: 17px;
                        width: 17px;
                        background-color: #1989fa;
                    }
                    &::after {
                        top: 3px;
                        right: 17px;
                    }
                    &::before {
                        top: 3px;
                        left: 17px;
                    }
                }
                .right {
                    height:32px;
                    line-height:32px;
                    width: 100%;
                    border-top: 1px solid #ebedf0;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 10px;
                    color: #ccc;
                    box-sizing: border-box;
                    .iconfont {
                        font-size: 14px;
                        color: #ccc;
                    }
                }
            }
        }
    }
</style>
