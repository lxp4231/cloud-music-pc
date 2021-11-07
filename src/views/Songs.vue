<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span :class="['item', { active: tagId == '0' }]" @click="tagId = 0">全部</span>
      <span :class="['item', { active: tagId == '7' }]" @click="tagId = 7">华语</span>
      <span :class="['item', { active: tagId == '96' }]" @click="tagId = 96">欧美</span>
      <span :class="['item', { active: tagId == '8' }]" @click="tagId = 8">日本</span>
      <span :class="['item', { active: tagId == '16' }]" @click="tagId = 16">韩国</span>
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr @dblclick="playMusic(item.id, item.name)" class="el-table__row" v-for="(item, index) in currentList" :key="index">
          <td>{{ (queryInfo.offset - 1) * queryInfo.limit + index + 1 }}</td>
          <td>
            <div class="img-wrap" @click="playMusic(item.id, item.name)">
              <img v-lazy="item.album.picUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <!-- 音乐标题 -->
                <span>{{ item.name }}</span>
                <el-tooltip class="item" effect="dark" content="添加到播放列表" :enterable="false" placement="bottom">
                  <span @click="playMusic(item.id, item.name, false)" class="iconfont add-music icon-add-list"></span>
                </el-tooltip>
                <!-- <span class="iconfont icon-mv"></span> -->
                <span @click="playMv(item.mvid)" v-if="item.mvid" class="iconfont icon-mv"></span>
              </div>
              <span></span>
            </div>
          </td>
          <!-- 歌手 -->
          <td>{{ item.album.artists[0].name }}</td>
          <!-- 专辑 -->
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
      :page-sizes="[5, 10, 15, 20, 30]"
      :page-size="queryInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="100"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Songs',
  data() {
    return {
      // 歌曲列表
      list: [],
      // 分类id 全部:0华语:7欧美:96日本:8韩国:16
      tagId: 0,
      // 当前展示的音乐信息
      currentList: [],
      queryInfo: {
        limit: 10,
        offset: 1,
      },
    }
  },
  watch: {
    // 监听
    tagId() {
      this.queryInfo.offset = 1
      this.getNewMusic()
    },
  },
  created() {
    this.getNewMusic()
  },
  methods: {
    // 获取最新音乐数据
    async getNewMusic() {
      console.log(this.tagId)
      const { data: data } = await this.$axios.get('/top/song', {
        params: {
          // 地区类型ID
          type: this.tagId,
          limit: 20,
          offset: 1,
        },
      })
      if (data.code == 200) {
        this.list = [...data.data]
        this.currentList = this.list.slice(0, this.queryInfo.limit)
      }
    },
    // 页容量发生变化
    sizeChange(newSize) {
      this.queryInfo.limit = newSize
      let start = (this.queryInfo.offset - 1) * this.queryInfo.limit
      let end = (this.queryInfo.offset - 1) * this.queryInfo.limit + this.queryInfo.limit
      this.currentList = this.list.slice(start, end)
    },
    // 页码发生变化
    currentPageChange(newPage) {
      this.queryInfo.offset = newPage

      let start = (this.queryInfo.offset - 1) * this.queryInfo.limit
      let end = (this.queryInfo.offset - 1) * this.queryInfo.limit + this.queryInfo.limit
      this.currentList = this.list.slice(start, end)
      console.log('this.list.splice(start, end): ', this.list.slice(15, 30))
    },
    // 播放音乐
    playMusic(id, name, insert = true) {
      console.log(1)
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
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
  },
}
</script>

<style >
</style>
