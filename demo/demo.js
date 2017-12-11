const map = new maptalks.Map('map', {
    center: [104,31],
    zoom: 5,
    attribution: {
        content: '&copy; TianDiTu'
    },
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}',
        subdomains: ['1','2','3','4']
    })
})
const mouseCoordinate = new maptalks.MouseCoordinate().addTo(map)