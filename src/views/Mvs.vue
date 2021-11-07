<template>
  <div class="mvs-container">
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span :class="['title', { active: queryInfo.area == '全部' }]" @click="queryInfo.area = '全部'">全部</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.area == '内地' }]" @click="queryInfo.area = '内地'">内地</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.area == '港台' }]" @click="queryInfo.area = '港台'">港台</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.area == '欧美' }]" @click="queryInfo.area = '欧美'">欧美</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.area == '日本' }]" @click="queryInfo.area = '日本'">日本</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.area == '韩国' }]" @click="queryInfo.area = '韩国'">韩国</span>
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span :class="['title', { active: queryInfo.type == '全部' }]" @click="queryInfo.type = '全部'">全部</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.type == '官方版' }]" @click="queryInfo.type = '官方版'">官方版</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.type == '原声' }]" @click="queryInfo.type = '原声'">原声</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.type == '现场版' }]" @click="queryInfo.type = '现场版'">现场版</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.type == '网易出品' }]" @click="queryInfo.type = '网易出品'">网易出品</span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span :class="['title', { active: queryInfo.order == '上升最快' }]" @click="queryInfo.order = '上升最快'">上升最快</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.order == '最热' }]" @click="queryInfo.order = '最热'">最热</span>
          </li>
          <li class="tab">
            <span :class="['title', { active: queryInfo.order == '最新' }]" @click="queryInfo.order = '最新'">最新</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <div class="items">
        <div class="item" @click="toMv(item.id)" v-for="(item, index) in mvlist" :key="index">
          <div class="img-wrap">
            <img v-lazy="item.cover" alt="" />
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ item.playCount | ellipsisPlayVolume }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <el-pagination
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginationForm.page"
        :page-sizes="[4, 8, 12, 16, 20, 40]"
        :page-size="paginationForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationForm.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mvs',
  data() {
    return {
      // 分页信息
      paginationForm: {
        // 总条数
        total: 0,
        // 页码
        page: 0,
        // 页容量
        limit: 8,
      },
      // 查询信息
      queryInfo: {
        // `area`: 地区,可选值为：全部、内地、港台、欧美、日本、韩国、不填则为全部
        area: '欧美',
        // `type`: 类型,可选值为：全部、官方版、原生、现场版、网易出品,不填则为全部
        type: '全部',
        // `order`: 排序,可选值为：上升最快、最热、最新、不填则为上升最快
        order: '最热',
      },
      // mv列表
      mvlist: [],
    }
  },
  created() {
    this.getMvs()
  },
  computed: {
    // watch对象巧用计算属性
    // queryInfoArea(){
    //   return this.queryInfo.area
    // }
  },
  watch: {
    // 1.watch对象方式一
    queryInfo: {
      handler(val) {
        this.paginationForm = {
          total: 0,
          page: 0,
          limit: 8,
        }
        this.queryInfo = val
        this.getMvs()
      },
      deep: true,
    },

    // 2.watch对象方式二
    // 'queryInfo.area': {
    //   handler: function (val) {
    //     console.log(val);
    //   },
    // },

    // 3.watch对象方式三 巧用计算属性
    // queryInfoArea(val){
    //   console.log(val);
    // }
  },
  // 过滤器
  filters: {
    // 省略播放量
    ellipsisPlayVolume(val) {
      // 大于十万的显示 xx万
      if (val < 100000) return val
      return parseInt(val / 10000) + '万'
    },
  },
  methods: {
    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    },
    // 页码发生变化
    handleCurrentChange(val) {
      this.paginationForm.page = val
      this.getMvs()
    },
    // 页容量发生变化
    handleSizeChange(val) {
      this.paginationForm.limit = val
      this.getMvs()
    },
    // 获取所有mv数据
    async getMvs() {
      const { data: data } = await this.$axios.get('/mv/all', {
        params: {
          // 歌曲地区
          area: this.queryInfo.area,
          // 歌曲类型
          type: this.queryInfo.type,
          // 歌曲排序
          order: this.queryInfo.order,
          // 页面容量
          limit: this.paginationForm.limit,
          // 分页 相当于页码
          offset: this.paginationForm.page,
        },
      })
      if (data.code == 200) {
        this.mvlist = data.data
        // 当切换页码和页容量的 的时候未返回total,不能赋值
        if (data.count) {
          this.paginationForm.total = data.count
        }
      }
    },
  },
}
</script>

<style >
</style>
