<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img v-lazy="playList.coverImgUrl" class="boder-radius" alt="" />
        <div class="play-count iconfont icon-play">{{ playList.playCount | ellipsisPlayVolume }}</div>
      </div>
      <div class="info-wrap">
        <!-- 歌单名称 -->
        <p class="title">{{ playList.name }}</p>
        <div class="author-wrap">
          <!-- 创建者头像 -->
          <img class="avatar" v-lazy="playList.creator.avatarUrl" alt="" />
          <!-- 创建者昵称 -->
          <span class="name">{{ playList.creator.nickname }}</span>
          <!-- 创建时间 -->
          <span class="time">{{ playList.createTime | LocaleDateString }}创建</span>
        </div>
        <div class="play-wrap">
          <el-tooltip class="item" effect="dark" content="替换播放列表" placement="bottom">
            <span class="text iconfont icon-circle-play" @click="playAll">播放全部</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="添加到播放列表" placement="right">
            <span class="iconfont icon-add add-playlist" @click="addAplayer"></span>
          </el-tooltip>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item, index) in playList.tags" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playList.description || playList.name }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
            <tr class="el-table__row" @dblclick="playMusic(item.id, item.name)" v-for="(item, index) in playList.tracks" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="img-wrap">
                  <div @click="playMusic(item.id, item.name)">
                    <img v-lazy="item.al.picUrl" alt="" />
                    <span class="iconfont icon-play"></span>
                  </div>
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
                    <span @click="playMv(item.mvid)" v-if="item.mvid" class="iconfont icon-mv"></span>
                  </div>
                </div>
              </td>
              <!-- 歌手名称 -->
              <td>{{ item.ar[0].name }}</td>
              <!-- 专辑名称 -->
              <td>{{ item.al.name }}</td>
              <td>{{ item.dt | formatDuration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>

      <el-tab-pane :label="'评论(' + (commentInfo.total + commentInfo.hotComments.length) + ')'" name="2">
        <!-- 精彩评论 -->
        <div v-if="commentInfo.hotComments.length > 0" class="comment-wrap">
          <p class="title">
            精彩评论<span class="number">{{ `(${commentInfo.hotComments.length})` }}</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in commentInfo.hotComments" :key="index">
              <div class="icon-wrap">
                <img v-lazy="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied[0]">
                  <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <!-- <div class="date">2020-02-12 17:26:11</div> -->
                <div class="date">
                  <span>{{ item.time | LocaleDateString }}</span>
                  <span class="iconfont icon-zan float-right">{{ item.likedCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最新评论 -->
        <div class="comment-wrap" v-if="commentInfo.comments.length > 0">
          <p class="title">
            最新评论<span class="number">({{ commentInfo.total }})</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in commentInfo.comments" :key="index">
              <div class="icon-wrap">
                <img v-lazy="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied[0]">
                  <span class="name">{{ item.beReplied[0].user.nickname }}：</span>
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time | LocaleDateString }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-alert v-else title="啥也没有耶~" effect="dark" type="info" center show-icon :closable="false"> </el-alert>
        <!-- 分页器 -->
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChagne"
          @current-change="currentPageChange"
          :current-page="queryInfo.offset"
          :page-sizes="[5, 10, 20, 30, 50]"
          :page-size="queryInfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="commentInfo.total"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Playlist',
  data() {
    return {
      activeIndex: '1',
      // 歌单信息
      playList: {
        creator: {
          avatarUrl: '',
        },
      },
      // 评论信息
      commentInfo: {
        comments: [],
        hotComments: [],
        total: 0,
      },
      queryInfo: {
        limit: 10,
        offset: 0,
      },
      // 当前歌单id
      id: '',
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getMusicListDetail(this.id)
    this.getMusicComment(this.id)
  },
  methods: {
    // 页码发生变化
    sizeChagne(newSize) {
      this.queryInfo.limit = newSize
      this.getMusicComment(this.id)
    },
    // 当前页发生变化
    currentPageChange(newPage) {
      this.queryInfo.offset = newPage
      this.getMusicComment(this.id)
    },
    // 获取歌单详情
    async getMusicListDetail(id) {
      const { data: data } = await this.$axios.get(`/playlist/detail?id=${id}`)
      console.log('data: ', data)
      if (data.code == 200) {
        console.log(1)
        this.playList = data.playlist
        console.log('this.playList: ', this.playList)
      }
    },
    // 获取歌单评论信息
    async getMusicComment(id) {
      const { data: data } = await this.$axios.get('/comment/playlist', {
        params: {
          id: id,
          limit: this.queryInfo.limit,
          offset: this.queryInfo.offset,
        },
      })

      if (data.code == 200) {
        if (this.queryInfo.offset > 0) {
          this.commentInfo.comments = data.comments
        } else {
          let newData = {
            comments: data.comments,
            total: data.total,
          }
          newData.hotComments = data.hotComments || data.topComments
          this.commentInfo = newData
        }
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
    // 添加歌单到Aplayer
    addAplayer() {
      this.playList.tracks.forEach(item => {
        // console.log(item.id);
        this.$store.dispatch('getAudioInfo', { id: item.id })
      })
      setTimeout(() => {
        console.log('提交播放')
        this.$Bus.$emit('play')
      }, 400)
    },
    // 播放全部
    playAll() {
      this.$store.commit('clear')
      this.addAplayer()
    },
    playMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
  },
}
</script>

<style scope>
.img-wrap {
  position: relative;
}
.play-count {
  position: absolute;
  top: 5px;
  right: 10px;
  color: white;
}
.float-right {
  float: right;
}
.add-playlist {
  margin: 0;
  padding-left: 5px;
  border-left: 2px solid;
  height: 100%;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.boder-radius {
  border-radius: 15px;
}
</style>
