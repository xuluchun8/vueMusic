import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

// 通过jsonp的方式使用新接口(可以使用)
// export function getSingerList () {
//   var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?'
//   var data = Object.assign({}, commonParams, {
//     g_tk: 388900894,
//     hostUin: 0,
//     format: 'jsonp',
//     inCharset: 'utf8',
//     notice: 0,
//     platform: 'yqq',
//     needNewCode: 0,
//     data: '{"comm":{"ct":24,"cv":10000},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}'
//   })
//   return jsonp(url, data)
// }

// 使用原接口
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

// singerDetail
export function getSingerDetail (id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: id
  })

  return jsonp(url, data, options)
}