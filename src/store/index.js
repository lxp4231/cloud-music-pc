import Vue from 'Vue'
import Vuex from 'Vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 音乐列表信息 默认有两首歌曲，有新赋值时会直接替换掉
    audioInfo: [{
      id: 1617440573040,
      url: '/mp3/光辉岁月.mp3',
      cover: '/images/光辉岁月.png',
      lrc:
        "[00:00.000] 作词 : 黄家驹\n[00:01.000] 作曲 : 黄家驹\n[00:02.000]编曲 : Beyond\n[00:03.000]制作人 : Beyond / Gordon O'Yang\n[00:04.000]Synth Programming : Gordon O'Yang / 叶世荣\n[00:05.000]Mixed by Philip Kwok\n[00:06.000]\n[00:28.650]钟声响起归家的讯号\n[00:33.036]在他生命里\n[00:36.281]仿佛带点唏嘘\n[00:41.564]黑色肌肤给他的意义\n[00:46.038]是一生奉献 肤色斗争中\n[00:54.543]年月把拥有变做失去\n[01:01.056]疲倦的双眼带着期望\n[01:07.551]今天只有残留的躯壳\n[01:11.162]迎接光辉岁月\n[01:14.391]风雨中抱紧自由\n[01:20.515]一生经过彷徨的挣扎\n[01:24.167]自信可改变未来\n[01:27.343]问谁又能做到\n[01:31.091]\n[01:43.174]可否不分肤色的界限\n[01:47.643]愿这土地里\n[01:50.774]不分你我高低\n[01:56.103]缤纷色彩闪出的美丽\n[02:00.572]是因它没有\n[02:03.764]分开每种色彩\n[02:09.060]年月把拥有变做失去\n[02:15.509]疲倦的双眼带着期望\n[02:22.001]今天只有残留的躯壳\n[02:25.740]迎接光辉岁月\n[02:28.901]风雨中抱紧自由\n[02:34.992]一生经过彷徨的挣扎\n[02:38.655]自信可改变未来\n[02:41.900]问谁又能做到\n[02:45.698]\n[03:23.643]今天只有残留的躯壳\n[03:27.339]迎接光辉岁月\n[03:30.561]风雨中抱紧自由\n[03:36.626]一生经过彷徨的挣扎\n[03:40.315]自信可改变未来\n[03:43.493]问谁又能做到\n[03:48.026]Woo\n[03:50.494]\n[03:55.305]Ah\n[03:57.239]\n[03:59.359]今天只有残留的躯壳\n[04:02.934]迎接光辉岁月\n[04:06.174]风雨中抱紧自由\n[04:12.267]一生经过彷徨的挣扎\n[04:15.855]自信可改变未来\n[04:19.047]问谁又能做到\n[04:23.624]Woo\n[04:26.040]\n[04:30.932]Ah\n[04:32.610]\n[04:35.027]今天只有残留的躯壳\n[04:38.580]迎接光辉岁月\n[04:41.808]风雨中抱紧自由\n[04:47.928]一生经过彷徨的挣扎\n[04:51.555]自信可改变未来\n",
      theme: '#f56c6c',
      name: '光辉岁月',
      artist: '黄家驹',
    },
    {
      id: 1617440751144,
      url: '/mp3/海阔天空.mp3',
      cover: '/images/海阔天空.png',
      lrc:
        '[00:00.000] 作词 : 黄家驹\n[00:01.000] 作曲 : 黄家驹\n[00:02.000] 编曲 : Beyond/Kunihiko Ryo\n[00:03.000] 制作人 : Beyond/Kunihiko Ryo\n[00:04.000]\n[00:18.123]今天我 寒夜里看雪飘过\n[00:24.720]怀着冷却了的心窝漂远方\n[00:30.632]风雨里追赶 雾里分不清影踪\n[00:36.858]天空海阔你与我\n[00:39.922]可会变（谁没在变）\n[00:43.073]多少次 迎着冷眼与嘲笑\n[00:49.655]从没有放弃过心中的理想\n[00:55.537]一刹那恍惚 若有所失的感觉\n[01:01.742]不知不觉已变淡\n[01:04.863]心里爱（谁明白我）\n[01:08.371]原谅我这一生不羁放纵爱自由\n[01:15.410]也会怕有一天会跌倒\n[01:21.635]背弃了理想 谁人都可以\n[01:27.845]哪会怕有一天只你共我\n[01:33.698]\n[01:42.254]今天我 寒夜里看雪飘过\n[01:48.851]怀着冷却了的心窝漂远方\n[01:54.701]风雨里追赶 雾里分不清影踪\n[02:00.959]天空海阔你与我\n[02:04.052]可会变（谁没在变）\n[02:07.560]原谅我这一生不羁放纵爱自由\n[02:14.562]也会怕有一天会跌倒\n[02:20.822]背弃了理想 谁人都可以\n[02:27.073]哪会怕有一天只你共我\n[02:33.182]\n[03:07.939]仍然自由自我 永远高唱我歌\n[03:14.541]走遍千里\n[03:19.221]原谅我这一生不羁放纵爱自由\n[03:26.194]也会怕有一天会跌倒\n[03:32.460]背弃了理想 谁人都可以\n[03:38.709]哪会怕有一天只你共我\n[03:44.956]背弃了理想 谁人都可以\n[03:51.220]哪会怕有一天只你共我\n[03:56.672]原谅我这一生不羁放纵爱自由\n[04:03.671]也会怕有一天会跌倒\n[04:09.912]背弃了理想 谁人都可以\n[04:16.142]哪会怕有一天只你共我\n[04:22.325]\n[04:25.000]OP : Amuse Inc. & Fun House Inc.\n[04:28.000]SP : Amuse H.K. Ltd.\n',
      theme: '#f56c6c',
      name: '海阔天空',
      artist: '黄家驹',
    }],
  },
  mutations: {
    // 插入到音乐列表
    updateAudioInfo(state, payload) {
      // 过滤重复的
      state.audioInfo = state.audioInfo.filter(item => item.id != payload.id)
      state.audioInfo.push(payload)
    },
    // 插入到最前面
    insertAudioInfo(state, payload) {
      // 过滤重复的
      state.audioInfo = state.audioInfo.filter(item => item.id != payload.id)
      // 插入到前面
      state.audioInfo.unshift(payload)
    },
    // 清空播放列表
    clear(state) {
      state.audioInfo = []
    }
  },
  // 在Actions 中不能直接修改 state中的数据，要通过 mutations修改。
  actions: {
    // 获取歌曲信息
    async getAudioInfo(context, payload) {
      console.log('payload: ', payload);
      // payload:{
      //   id:id,
      //   isInsert:true || false
      // }

      let result = {}

      Promise.all([
        context.dispatch('getMusicUrl', payload.id),
        context.dispatch('getMusicInfo', payload.id),
        context.dispatch('getMusicLyric', payload.id)
      ]).then(res => {
        console.log('res: ', res);
        // id 是用来区分音频的唯一标识
        result.id = payload.id
        // 音乐地址
        result.url = res[0].data.data[0].url || false
        // 音乐标题
        result.name = res[1].data.songs[0].name || false
        // 艺术家
        result.artist = res[1].data.songs[0].ar[0].name || false
        // 封面
        result.cover = res[1].data.songs[0].al.picUrl || false
        // 歌词
        result.lrc = res[2].data.lrc ? res[2].data.lrc.lyric : null
        // 主题
        result.theme = '#f56c6c'

        if (payload.isInsert) {
          // 插入到最前面
          context.commit('insertAudioInfo', result)
        } else {
          // 追加到后面
          context.commit('updateAudioInfo', result)
        }
      }, reason => {
        console.log('失败结果: ', reason);
      })

    },
    // 获取歌曲Url
    getMusicUrl(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/song/url?id=${id}`).then(res => {
          resolve(res)
        }, reason => {
          reject(reason)
        })
      })
    },
    // 获取歌曲信息
    getMusicInfo(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/song/detail?ids=${id}`).then(res => {
          resolve(res)
        }, reason => {
          reject(reason)
        })
      })
    },
    // 获取歌词
    getMusicLyric(context, id) {
      return new Promise((resolve, reject) => {
        axios.get(`/lyric?id=${id}`).then(res => {
          resolve(res)
        }, reason => {
          reject(reason)
        })
      })
    }
  },
})