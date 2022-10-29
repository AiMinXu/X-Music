import { xRequest } from './index'

export function getTopMv(offset = 0, limit = 20) {
  return xRequest.get({
    url: '/top/mv',
    data: {
      limit,
      offset
    }
  })
}

export function getMvUrl(id) {
  return xRequest.get({
    url: '/mv/url',
    data: {
      id
    }
  })
}

export function getMvInfo(mvid) {
  return xRequest.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}
export function getMvRelated(id) {
  return xRequest.get({
    url: "/related/allvideo",
    data: {
      id
    }
  })
}
