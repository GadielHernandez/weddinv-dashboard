export default (content, fileName) => {
    let mimeType = 'text/csv;encoding:utf-8'
    const anchor = document.createElement('a')
    mimeType = mimeType || 'application/octet-stream'

    if (navigator.msSaveBlob) {
        // IE10
        navigator.msSaveBlob(
            new Blob(['\uFEFF' + content], { type: mimeType }),
            fileName
        )
    } else if (URL && 'download' in anchor) {
        //html5 A[download]
        anchor.href = URL.createObjectURL(
            new Blob(['\uFEFF' + content], {
                type: mimeType,
            })
        )
        anchor.setAttribute('download', fileName)
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
    } else {
        location.href =
            'data:application/octet-stream,' +
            encodeURIComponent('\uFEFF' + content) // only this mime type is supported
    }
}