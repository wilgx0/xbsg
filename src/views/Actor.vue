<template>
    <div class="actor">
        <van-nav-bar
                title="演员剧照"
                left-text="返回"
                left-arrow
                @click-left="goBack">
            <div slot="right" class="nav-right">
                <van-button plain hairline :type="newOder === true ? 'info' : ''" size="mini" text="最新上传" @click="newData"></van-button>
                <van-button plain hairline :type="newOder === false ? 'info' : ''" size="mini" text="热门剧照" @click="hotData"></van-button>
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
                        <div class="list-item" :key="item.id" v-for="(item,index) in list"  @click="showImages(index)">
                            <img  v-lazy="item.more.thumbnail || ''" >
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

    import { ImagePreview } from 'vant'

    export default {
        name: 'actor',
        data() {
            return {
                list: [],            //数据列表
                loading: false,     //上拉加载状态
                finished: false,    //上拉加载结束
                isLoading: false,   //下拉刷新状态
                page:1,             //当前页
                newOder:true,       //按最新排序
                queryParam:{        //查询字符串
                    order:'-published_time'
                }
            }
        },
        computed:{
            images(index){
                return this.list.map((currentValue,index,arr)=>currentValue.more.thumbnail)
            }
        },

        methods: {
            showImages(index){     //图片预览
                //console.log(this.images)
                ImagePreview({
                    images:this.images,
                    startPosition:index
                })
            },
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
                    category_id: 3,
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

    .actor {
        .main{
            .list-item{
                img{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
</style>
