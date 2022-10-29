import { xRequest } from './index'

export function getMusicBannerList(type = 0) {
  return xRequest.get({
    url: '/banner',
    data: {
      type
    }
  })
}

export function getPlaylistDetail(id) {
  return xRequest.get({
    url: '/playlist/detail',
    data: {
      id
    }
  })
}

export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return xRequest.get({
    url: '/top/playlist',
    data: {
      cat,
      limit,
      offset
    }
  })
}
export function getSongMenuTag() {
  return xRequest.get({
    url: '/playlist/hot'
  })
}
