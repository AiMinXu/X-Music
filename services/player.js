import { xRequest } from './index'

export function getSongDetail(ids) {
  return xRequest.get({
    url: '/song/detail',
    data: {
      ids
    }
  })
}
export function getSongLyric(id) {
  return xRequest.get({
    url: '/lyric',
    data: {
      id
    }
  })
}