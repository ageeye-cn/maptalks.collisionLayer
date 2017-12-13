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
const layer = new maptalks.CollisionLayer('v').addTo(map)

var extent = map.getExtent(),
    min = extent.getMin(),
    w = extent.getWidth(),
    h = extent.getHeight(),
    markers = [];
for (var i = 0; i < 100; i++) {
    markers.push(new maptalks.Marker([min.x + Math.random() * w, min.y + Math.random() * h]));
}
layer.addGeometry(markers)