<template>
  <div id="app">
    <keep-alive>
        <router-view/>
    </keep-alive>
  </div>
</template>

<style lang="less">

    @font-face {
        font-family: 'iconfont';  /* project id 1219153 */
        src: url('//at.alicdn.com/t/font_1219153_hf8u8ga18i.eot');
        src: url('//at.alicdn.com/t/font_1219153_hf8u8ga18i.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1219153_hf8u8ga18i.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1219153_hf8u8ga18i.woff') format('woff'),
        url('//at.alicdn.com/t/font_1219153_hf8u8ga18i.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1219153_hf8u8ga18i.svg#iconfont') format('svg');
    }

    .iconfont {
        font-family:"iconfont" !important;
        font-size:1.5rem;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
