<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{ queryInfo.keywords }}</h2>
      <span class="sub-title">{{ `共找到${count - 1 || 0}个结果` }}</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <el-alert v-if="count < 1" title="什么东西也没有耶~" effect="dark" type="info" center show-icon :closable="false"> </el-alert>
        <table class="el-table infinite-list">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" @dblclick="playMusic(item.id, item.name)" v-for="(item, index) in searchResult.songs" :key="index">
              <td>{{ limit.songs * (queryInfo.offset - 1) + index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <!-- 歌名 -->
                    <span>{{ item.name }}</span>
                    <!-- 添加到播放列表 -->
                    <el-tooltip class="item" effect="dark" content="添加到播放列表" :enterable="false" placement="bottom">
                      <span @click="playMusic(item.id, item.name, false)" class="iconfont add-music icon-add-list"></span>
                    </el-tooltip>
                    <!-- mv的图标 -->
                    <span @click="playMv(item.mvid)" v-if="item.mvid" class="iconfont icon-mv"></span>
                  </div>
                </div>
              </td>
              <!-- 歌手的名字 -->
              <td>{{ item.artists[0].name }}</td>
              <!-- 专辑名称 -->
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration | formatDuration }}</td>
            </tr>
          </tbody>
        </table>
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="queryInfo.offset"
          :page-sizes="[5, 10, 15, 20, 50]"
          :page-size="limit.songs"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count - 1"
        >
        </el-pagination>
      </el-tab-pane>

      <el-tab-pane label="歌单" name="lists">
        <el-alert v-if="count < 1" title="什么东西也没有耶~" effect="dark" type="info" center show-icon :closable="false"> </el-alert>
        <div class="items">
          <div class="item" v-for="(item, index) in searchResult.playlists" @click="playList(item.id)" :key="index">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量：
                <span class="num">{{ item.playCount | ellipsisPlayVolume }}</span>
              </div>
              <img v-lazy="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="queryInfo.offset"
          :page-sizes="[5, 10, 15, 20, 50]"
          :page-size="limit.playlists"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </el-tab-pane>

      <el-tab-pane label="MV" name="mv">
        <el-alert v-if="count < 1" title="什么东西也没有耶~" effect="dark" type="info" center show-icon :closable="false"> </el-alert>
        <div class="items mv">
          <div class="item" @click="playMv(item.id)" v-for="(item, index) in searchResult.mvs" :key="index">
            <div class="img-wrap">
              <img v-lazy="item.cover" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ item.playCount | ellipsisPlayVolume }}</div>
              </div>
              <span class="time">{{ item.duration | formatDuration }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="queryInfo.offset"
          :page-sizes="[4, 8, 12, 16, 20, 52]"
          :page-size="limit.mvs"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Result',
  data() {
    return {
      activeIndex: 'songs',
      queryInfo: {
        keywords: '',
        // type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
        type: 1,
        // limit : 返回数量 , 默认为 30
        // limit: 10,
        // offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
        offset: 1,
      },
      limit: {
        songs: 10,
        playlists: 10,
        mvs: 8,
      },
      // 搜索结果
      searchResult: [],
      // 搜索总计
      count: 0,
      // 是否加载更多
      disabled: false,
    }
  },
  computed: {
    // watch的路由信息
    searchQueryInfo() {
      return this.$route.query.q
    },
  },
  created() {
    // 初次查询信息
    this.queryInfo.keywords = this.$route.query.q
    // this.queryInfo.type = this.$route.query.type || 1
    this.searchMusic()
  },
  watch: {
    // 切换面板 查询信息
    activeIndex(newVal) {
      let type = null
      switch (newVal) {
        case 'songs':
          type = 1
          break
        case 'lists':
          type = 1000
          break
        case 'mv':
          type = 1004
          break
        default:
          type = 1
          break
      }
      this.queryInfo.type = type
      this.searchMusic()
    },
    // 当在result页面搜索的时候触发该函数
    searchQueryInfo: {
      handler: function () {
        this.queryInfo.keywords = this.$route.query.q
        this.searchMusic()
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions(['getMusicInfo']),
    // 页码发生改变
    sizeChange(newVal) {
      if (this.activeIndex == 'songs') {
        this.limit.songs = newVal
      } else if (this.activeIndex == 'lists') {
        this.limit.playlists = newVal
      } else {
        this.limit.mvs = newVal
      }
      this.searchMusic()
    },
    // 页码发生变化
    currentPageChange(newVal) {
      this.queryInfo.offset = newVal

      this.searchMusic()
    },
    // 搜索音乐
    async searchMusic() {
      let limit
      if (this.activeIndex == 'songs') {
        limit = this.limit.songs
      } else if (this.activeIndex == 'lists') {
        limit = this.limit.playlists
      } else {
        limit = this.limit.mvs
      }
      // 获取歌曲信息

      const { data: data } = await this.$axios.get('/search', {
        params: {
          keywords: this.queryInfo.keywords,
          type: this.queryInfo.type,
          limit: limit,
          offset: (this.queryInfo.offset - 1) * limit,
        },
      })
      console.log('data: ', data)
      if (data.code == 200) {
        this.count = data.result.songCount || data.result.playlistCount || data.result.mvCount
        this.searchResult = data.result
      }
    },
    // 播放音乐
    playMusic(id, name, insert = true) {
      this.$store.dispatch('getAudioInfo', {
        id,
        isInsert: insert,
      })
      if (insert) {
        insert && this.$Bus.$emit('switch')
        this.$notify({
          title: '开始播放：' + name,
          offset: 50,
        })
      } else {
        this.$notify({
          title: name,
          message: `已添加到播放列表~`,
          offset: 50,
        })
      }
    },
    // 查看歌单
    playList(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
  },
}
</script>

<style scoped>
tr,
th,
td,
song-wrap,
name-wrap {
  user-select: none;
}
.el-pagination {
  margin-top: 10px;
}
</style>
