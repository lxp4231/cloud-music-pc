<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="mvUrl">
          抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以 <a href="https://www.baidu.com">下载</a>
          并用你喜欢的播放器观看!
        </video>
      </div>

      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img v-lazy="artistAvatarUrl" alt="" />
          </div>
          <!-- 发布者昵称 -->
          <span class="name">{{ mvDetail.artistName }}</span>
        </div>
        <div class="mv-info">
          <!-- mv名称 -->
          <h2 class="title">{{ mvDetail.name }}</h2>
          <span class="date">发布：{{ mvDetail.publishTime }}</span>
          <span class="number">播放：{{ mvDetail.playCount }}次</span>
          <p class="desc">{{ mvDetail.desc }}</p>
        </div>
      </div>

      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="mvCommentInfo.isHotComments">
        <p class="title">
          精彩评论<span class="number">({{ mvCommentInfo.hotComments.length }})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in mvCommentInfo.hotComments" :key="index">
            <div class="icon-wrap">
              <img v-lazy="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}：</span>
                <span class="comment">{{ item.content }}</span>
              </div>
              <div class="date">
                {{ item.time | LocaleString }}
                <span class="iconfont icon-zan float-right">{{ item.likedCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最新评论 -->
      <div class="comment-wrap" v-if="mvCommentInfo.isComment">
        <p class="title">
          最新评论<span class="number">({{ mvCommentInfo.total }})</span>
        </p>
        <div class="comments-wrap">
          <div class="item" v-for="(item, index) in mvCommentInfo.comments" :key="index">
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
              <div class="date">{{ item.time | LocaleString }}</div>
            </div>
          </div>
        </div>
        <el-pagination
          :hide-on-single-page="true"
          @size-change="sizeChange"
          @current-change="currentPageChange"
          :current-page="commentQueryInfo.offset"
          :page-sizes="[5, 10, 20, 30, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="mvCommentInfo.total"
        >
        </el-pagination>
      </div>
      <el-alert v-else title="好像没有评论耶~" effect="dark" type="info" center show-icon> </el-alert>
    </div>

    <!-- 相关推荐 -->
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" @click="init(item.id)" v-for="(item, index) in similarMv" :key="index">
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mv',
  data() {
    return {
      // 当前mv的 id
      id: '',
      // mv相关信息
      mvUrl: '',
      // 相关推荐
      similarMv: [],
      // MV详情
      mvDetail: {},
      // 歌手头像
      artistAvatarUrl: '',
      // mv评论信息
      mvCommentInfo: {},
      // 评论信息query对象
      commentQueryInfo: {
        id: '',
        limit: 20,
        offset: 0,
      },
    }
  },
  created() {
    this.commentQueryInfo.id = this.$route.query.id
    this.init(this.commentQueryInfo.id)
  },
  methods: {
    // 页容量发生变化
    sizeChange(newSize) {
      console.log(newSize)
      this.commentQueryInfo.limit = newSize
      this.getMvComment()
    },
    // 页码发生变化
    currentPageChange(newPage) {
      console.log(newPage)
      this.commentQueryInfo.offset = newPage
      this.getMvComment()
    },
    // 暂停播放音乐
    stop() {
      // Do something
    },
    // 初始化页面需要的信息
    init(mvId) {
      this.commentQueryInfo.id = mvId
      // 获取mv地址
      this.getMvUrl(mvId)
      // 获取相似mv
      this.getSimiMvInfo(mvId)
      // 获取mv信息
      this.getMvDetail(mvId)
      // 获取MV评论信息
      this.getMvComment(mvId)
    },
    // 获取mvUrl
    async getMvUrl(id) {
      const { data: data } = await this.$axios.get('/mv/url', {
        params: {
          id,
        },
      })
      if (data.code == 200) {
        this.mvUrl = data.data.url
      }
    },
    // 获取相似mv
    async getSimiMvInfo(id) {
      const { data: data } = await this.$axios.get(`/simi/mv?mvid=${id}`)
      if (data.code == 200) {
        this.similarMv = data.mvs
      }
    },
    // 获取mv详细信息
    async getMvDetail(id) {
      const { data: data } = await this.$axios.get(`/mv/detail?mvid=${id}`)
      if (data.code == 200) {
        this.mvDetail = data.data
        // 获取歌手详细信息，拿到歌手头像
        this.getArtisiDetail(this.mvDetail.artists[0].id)
      }
    },
    // 获取歌手信息
    async getArtisiDetail(id) {
      const { data: data } = await this.$axios.get(`/artist/detail?id=${id}`)
      if (data.code == 200) {
        this.artistAvatarUrl = data.data.artist.cover
      }
    },
    // 获取MV评论信息
    async getMvComment() {
      const { data: data } = await this.$axios.get(`/comment/mv`, {
        params: this.commentQueryInfo,
      })
      console.log('data: ', data)
      if (data.code == 200) {
        // 是否显示最新评论
        if (data.comments.length > 0) {
          this.mvCommentInfo.isComment = true
        } else {
          this.mvCommentInfo.isComment = false
        }

        // 判断是否显示精彩评论
        if (data.hotComments.length > 0) {
          this.mvCommentInfo.isHotComments = true
        } else {
          this.mvCommentInfo.isHotComments = false
        }

        this.mvCommentInfo.total = data.total
        this.mvCommentInfo.comments = data.comments
        this.mvCommentInfo.hotComments = data.hotComments
      }
    },
  },
}
</script>

<style>
</style>
