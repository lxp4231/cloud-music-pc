<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel indicator-position="none" loop :interval="4000" type="card">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <a :href="item.url">
          <img v-lazy="item.imageUrl" alt="" />
        </a>
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in list" :key="index" @click="toPlayListDetail(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ item.copywriter }}</span>
            </div>
            <img v-lazy="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <div class="items">
        <div class="item cursor-pointer" @click="playMusic(item.id)" v-for="(item, index) in songs" :key="index">
          <div class="img-wrap">
            <img v-lazy="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{ item.name }}</div>
            <div class="singer">{{ item.song.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in mvs" :key="index">
          <div class="img-wrap" @click="playMv(item.id)">
            <img v-lazy="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <!-- 播放次数 -->
              <div class="num">{{ item.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <!-- mv名 -->
            <div class="name">{{ item.name }}</div>
            <!-- 歌手名 -->
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 回到顶部 -->
    <el-backtop></el-backtop>
  </div>
</template>

<script>
// 导入辅助函数
import { mapActions } from 'vuex'

export default {
  name: 'Discovery',
  data() {
    return {
      // 轮播图图片地址数组
      banners: [],
      // 推荐歌单
      list: [],
      // 最新音乐
      songs: [],
      // 推荐mv
      mvs: [],
    }
  },
  async created() {
    // 1.轮播图的 banners
    const { data: data } = await this.$axios.get('/banner')
    if (data.code == 200) {
      this.banners = data.banners
    }

    // 2.推荐歌单
    const { data: playLists } = await this.$axios.get('/personalized', {
      params: {
        // 获取的数据量
        limit: 15,
      },
    })
    if (playLists.code == 200) {
      this.list = playLists.result
    }

    // 3.最新音乐
    const { data: newSongs } = await this.$axios.get('/personalized/newsong')
    if (newSongs.code == 200) {
      this.songs = newSongs.result
    }

    // 4.最新MV
    const { data: mvs } = await this.$axios.get('/personalized/mv')
    if (mvs.code == 200) {
      this.mvs = mvs.result
    }
  },
  methods: {
    // 通过辅助函数把mutations里的函数引用到这里
    ...mapActions(['getAudioInfo']),
    // 点击按钮，播放音乐
    async playMusic(id) {
      this.getAudioInfo({ id, isInsert: true })
      this.$Bus.$emit('switch')
      // 1.利用 $parent传递数据
      // this.$parent.musicUrl = data.data[0].url

      // 2.利用事件总线传递数据 需要在main.js中 Vue.prototype.$Bus = new Vue()
      // this.$Bus.$emit('newMusic',url)

      // 3.利用 vuex 传递
      // 3.1 通过commit 触发 mutations
      // this.$store.commit('updateMusicUrl', url)

      // 3.2通过导入的辅助函数触发 vuex
    },
    // 去往歌单详情页
    toPlayListDetail(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    // 播放Mv
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
  },
}
</script>

<style >
</style>
