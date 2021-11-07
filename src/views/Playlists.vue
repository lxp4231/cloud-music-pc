<template>
  <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <!-- 封面 -->
        <img v-lazy="topList.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <!-- 标题 -->
        <div class="title">{{ topList.name }}</div>
        <!-- 介绍 -->
        <div class="info">
          {{ topList.description }}
        </div>
      </div>
      <!-- 背景 -->
      <img v-lazy="topList.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span :class="['item', { active: selected == '全部' }]" @click="selected = '全部'">全部</span>
        <span :class="['item', { active: selected == '欧美' }]" @click="selected = '欧美'">欧美</span>
        <span :class="['item', { active: selected == '华语' }]" @click="selected = '华语'">华语</span>
        <span :class="['item', { active: selected == '流行' }]" @click="selected = '流行'">流行</span>
        <span :class="['item', { active: selected == '说唱' }]" @click="selected = '说唱'">说唱</span>
        <span :class="['item', { active: selected == '摇滚' }]" @click="selected = '摇滚'">摇滚</span>
        <span :class="['item', { active: selected == '民谣' }]" @click="selected = '民谣'">民谣</span>
        <span :class="['item', { active: selected == '电子' }]" @click="selected = '电子'">电子</span>
        <span :class="['item', { active: selected == '轻音乐' }]" @click="selected = '轻音乐'">轻音乐</span>
        <span :class="['item', { active: selected == '影视原声' }]" @click="selected = '影视原声'">影视原声</span>
        <span :class="['item', { active: selected == 'ACG' }]" @click="selected = 'ACG'">ACG</span>
        <span :class="['item', { active: selected == '怀旧' }]" @click="selected = '怀旧'">怀旧</span>
        <!-- <span :class="['item',{ active: selected == '治愈' }]" @click="selected = '治愈'">治愈</span>
        <span :class="['item',{ active: selected == '旅行' }]" @click="selected = '旅行'">旅行</span> -->
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" @click="toPlayListDetail(item.id)" v-for="(item, index) in list" :key="index">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img v-lazy="item.coverImgUrl" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 
      分页器
      total 总条数
      current-page  当前页
      page-size 每页多少条数据
     -->
    <el-pagination
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationForm.page"
      :page-sizes="[5, 10, 15, 20, 50]"
      :page-size="paginationForm.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paginationForm.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Recommend',
  data() {
    return {
      paginationForm: {
        // 总条数
        total: 0,
        // 页码
        page: 0,
        // 页容量
        size: 10,
      },
      // 顶部推荐歌单
      topList: {},
      // 歌单列表
      list: [],
      // 当前选中的栏目
      selected: '全部',
    }
  },
  watch: {
    // 监听 selected 变化
    selected() {
      // 获取新的顶部精品歌单
      this.getTopList(1, this.selected)

      // 获取新的歌单列表
      this.getList(10, this.selected)
    },
  },
  created() {
    // 获取顶部精品歌单
    this.getTopList(1, '全部')

    // 获取歌单列表
    this.getList(10, '全部')
  },
  methods: {
    ...mapMutations(['updateMusicUrl']),
    // 当前页码发生变化触发
    handleCurrentChange(val) {
      this.paginationForm.page = val
      this.getList(this.paginationForm.size, this.selected, this.paginationForm.page)
    },
    // 页容量发生变化
    handleSizeChange(val) {
      this.paginationForm.size = val
      this.getList(this.paginationForm.size, this.selected, this.paginationForm.page)
      console.log('val: ', val)
    },
    // 获取顶部精品歌单
    async getTopList(limit, cat) {
      // 顶部 精品歌单
      const { data: data } = await this.$axios.get('/top/playlist/highquality', {
        params: {
          limit,
          cat,
        },
      })
      if (data.code == 200) {
        this.topList = data.playlists[0]
      }
    },
    // 获取歌单列表
    async getList(limit, cat, offset = 0) {
      const { data: data } = await this.$axios.get('/top/playlist/', {
        params: {
          limit,
          offset,
          cat,
        },
      })
      if (data.code == 200) {
        this.paginationForm.total = data.total
        this.list = data.playlists
      }
    },
    // 去歌单详情页
    toPlayListDetail(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
  },
}
</script>

<style >
</style>
