import request from '@/axios/index'
import type { AxiosResponse } from 'axios'
function downloadEl(url: string, fileName: string) {
  const el = document.createElement('a')
  el.style.display = 'none'
  el.setAttribute('target', '_blank')
  if (fileName) {
    el.setAttribute('download', fileName)
  }
  el.href = url
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}

export function useDownloadUploadFile() {
  return (url: string, fileName: string) => {
    request({
      method: 'get',
      baseURL: '',
      url,
      responseType: 'blob',
    }).then((res: AxiosResponse<Blob>) => {
      const blobUrl = URL.createObjectURL(res.data)
      downloadEl(blobUrl, fileName)

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl)
      }, 1000)
    })
  }
}
