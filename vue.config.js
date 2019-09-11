
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
module.exports = {

    publicPath: 'mobile',
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxtorem({
                        rootValue: 37.5,
                        propList: ['*'],
                        // 该项仅在使用 Circle 组件时需要
                        // 原因参见 https://github.com/youzan/vant/issues/1948
                        selectorBlackList: ['van-circle__layer']
                    })
                ]
            }
        }
    },

    devServer: {

        // string | Object 代理设置
        proxy: {
            // 接口是 '/api' 开头的才用代理
            '/api': {                   //api接口
                target: 'http://xbsg.my', // 目标地址
                changeOrigin: true, // 是否改变源地址
            },
            '/portal': {                //下载资源
                target: 'http://xbsg.my', // 目标地址
                changeOrigin: true, // 是否改变源地址
            }
        },
    },
}
