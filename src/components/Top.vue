<template>
  <div class="top-container">
    <div class="left dflex">
      <img src="~/assets/images/home.svg" class="homeImg" align="middle" alt="" />
      <el-tooltip class="item" :enterable="false" effect="dark" content="去主页：www.bookbook.cc" placement="right">
        <a href="https://www.bookbook.cc" target="blank">bookbook.cc</a>
      </el-tooltip>
      <div class="control-go">
        <el-button type="info" size="small" class="clear-icon el-icon-arrow-left" @click="go(-1)" circle></el-button>
        <el-button type="info" size="small" class="clear-icon el-icon-arrow-right" @click="go(1)" circle></el-button>
        <el-button type="info" size="small" class="clear-icon iconfont icon-zhuye2" @click="goHome" circle></el-button>
      </div>
    </div>
    <div class="center">
      <el-autocomplete
        @keyup.native.enter="search"
        v-model="inputValue"
        :fetch-suggestions="getSearchAsync"
        :placeholder="placeholder"
        @select="handleSelect"
        prefix-icon="el-icon-search"
        clearable
        class="border-radius"
        size="small"
      ></el-autocomplete>
    </div>
    <div class="right">
      <el-switch v-model="navState" @change="changeNavState"> </el-switch>
      <el-switch class="music-control-state" v-model="state" @change="changeState"> </el-switch>
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="to('/discovery')" icon="iconfont icon-find-music">发现音乐</el-dropdown-item>
          <el-dropdown-item @click.native="to('/playlists')" icon="iconfont icon-find-music">推荐歌单</el-dropdown-item>
          <el-dropdown-item @click.native="to('/songs')" icon="iconfont icon-music">最新音乐</el-dropdown-item>
          <el-dropdown-item @click.native="to('/mvs')" icon="iconfont icon-mv">最新MV</el-dropdown-item>
          <el-dropdown-item divided>
            <a href="https://www.bilibili.com/video/BV1RE411W776" target="_blank">教程地址 BiliBili</a>
          </el-dropdown-item>
          <el-dropdown-item>
            <a href="https://gitee.com/penggang-home/cloud-music" target="_blank">前端地址 Gitee</a>
          </el-dropdown-item>
          <el-dropdown-item>
            <a href="https://github.com/Binaryify/NeteaseCloudMusicApi" target="_blank">后端地址 Github</a>
          </el-dropdown-item>
          <el-dropdown-item >
            <a href="https://neteasecloudmusicapi.vercel.app/#/?id=neteasecloudmusicapi" target="_blank">API接口文档</a>
          </el-dropdown-item>
        
          <el-dropdown-item disabled>版本号：v1.0.0</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-tooltip class="item" effect="dark" content="指不定哪天派上用场~" placement="bottom">
        <el-button type="danger" size="small" round v-popover:popover>
          <i class="iconfont icon-power"></i>
        </el-button>
      </el-tooltip> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Top',
  data() {
    return {
      // 输入提示
      placeholder: '',
      // 输入的内容
      inputValue: '',
      // 热搜列表
      searchHot: [],
      // 热搜推荐列表
      searchHotList: [],
      // 用于标识是系统请求，还是用户请求
      auth: '',
      // 暂存搜索关键字
      searchKeywords: '',
      // 开关状态  是否显示音乐面板
      state: true,
      // 是否显示导航栏 nav
      navState: true,
    }
  },
  created() {
    // 获取默认搜索关键词
    this.getDefaultKeywords()
  },
  computed: {},
  methods: {
    // 跳转到指定页面
    to(str) {
      if (this.$route.path != str) {
        this.$router.push(str)
      }
    },
    // 前进 or 后退
    go(index) {
      window.history.go(index)
    },
    // 去主页
    goHome() {
      if (this.$route.path != '/discovery') {
        this.$router.push('/discovery')
      }
    },
    // 改变开关状态的回调
    changeState() {
      this.$Bus.$emit('switchState', this.state)
    },
    changeNavState() {
      this.$Bus.$emit('changeNavState', this.navState)
    },
    // 搜索方法
    search() {
      // 新搜索结果等于旧搜索结果 取消搜索
      if (this.$route.query.q == this.inputValue.trim()) {
        return
      }

      if (this.inputValue.trim() == '') {
        this.$message('请输入搜索内容~')
        return
      }

      // 去搜索页面
      if (this.$route.path != '/result') {
        this.$router.push(`/result?q=${this.inputValue}`)
      } else {
        this.$router.replace(`/result?q=${this.inputValue}`)
      }
    },
    // 获取默认搜索提示和关键字
    async getDefaultKeywords() {
      const { data: data } = await this.$axios.get('/search/default')
      if (data.code == 200) {
        this.placeholder = data.data.showKeyword
        // 关键字
        // this.inputValue = data.data.realkeyword
      }
    },
    // 搜索推荐+搜索多重匹配
    async getSearchAsync(queryString, cb) {
      if (this.inputValue == '') {
        // 如果有数据就不需要重新请求
        if (this.searchHotList != '') return cb(this.searchHotList)
        this.auth = 'system'
        this.searchHotList = []
        // 获取推荐搜索信息
        const { data: data } = await this.$axios.get('/search/hot/')
        if (data.code == 200) {
          data.result.hots.forEach(item => {
            this.searchHotList.push({ value: item.first })
          })
          cb(this.searchHotList)
        }
      } else {
        // 判断有没有输入新的字符
        if (queryString == this.searchKeywords) return cb(this.searchHot)

        this.auth = 'user'
        this.searchHot = []
        // 获取搜索建议
        const { data: data } = await this.$axios.get(`/search/suggest?keywords=${queryString}`)
        if (data.code == 200) {
          this.searchKeywords = queryString
          // 歌曲 songs
          if (data.result.songs && data.result.songs.length > 0) {
            data.result.songs.forEach(item => {
              this.searchHot.push({
                // value: '歌曲：' + item.name + '—' + item.artists[0].name,
                value: item.name + '—' + item.artists[0].name,
                id: item.id,
                type: 'songs',
              })
            })
          }
          // 专辑  albums
          // if (data.result.albums && data.result.albums.length > 0) {
          //   data.result.albums.forEach(item => {
          //     this.searchHot.push({
          //       value: '专辑：' + item.name + '——' + item.artist.name,
          //       id: item.id,
          //       type: 'albums',
          //     })
          //   })
          // }
          // 歌单 playlists
          // if (data.result.playlists && data.result.playlists.length > 0) {
          //   data.result.playlists.forEach(item => {
          //     this.searchHot.push({
          //       value: '歌单：' + item.name + '——' + item.name,
          //       id: item.id,
          //       type: 'playlists',
          //     })
          //   })
          // }
          cb(this.searchHot)
        }
      }
    },
    // 创建状态过滤器
    handleSelect(item) {
      this.search()
    },
  },
}
</script>

<style  scoped>
.top-container {
  padding: 0;
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.center {
  flex-basis: 400px;
}
.el-autocomplete {
  width: 100%;
}
.left .homeImg {
  width: 28px;
  height: auto;
  object-fit: cover;
}
.left {
  position: relative;
  flex-basis: 200px;
  text-align: center;
}
.left a {
  padding-left: 5px;
  font-size: 22px;
  color: black;
}
.control-go {
  position: absolute;
  right: -117px;
}
.clear-icon {
  outline: none;
}
.music-control-state {
  transform: rotate(-90deg);
}
.el-dropdown {
  cursor: pointer;
}
.el-dropdown-menu__item {
  user-select: none;
}
a {
  color: black;
}
</style>
