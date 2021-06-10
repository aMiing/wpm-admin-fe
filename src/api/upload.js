import request from '@/utils/request'

const baseUrl = '/upload/'

export function uploadImg(data) {
    return request({
        url: baseUrl + 'uploadImg',
        method: 'post',
        data,
    })
}