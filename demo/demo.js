const map = new maptalks.Map('map', {
    center: [104,31],
    zoom: 5,
    attribution: {
        content: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    },
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a','b','c','d']
    })
})

const collisionLayer = new maptalks.CollisionLayer('layerName').addTo(map)

collisionLayer.addGeometry(new maptalks.LineString([[104,31],[104,32]]))

var extent = map.getExtent(),
    min = extent.getMin(),
    w = extent.getWidth(),
    h = extent.getHeight(),
    markers = [];
for (var i = 0; i < 1000; i++) {
    markers.push(new maptalks.Marker([min.x + Math.random() * w, min.y + Math.random() * h]));
}

collisionLayer.addGeometry(markers)
collisionLayer.updateCollision()

function enableCollision() {
    collisionLayer.enableCollision()
}

function disableCollision() {
    collisionLayer.disableCollision()
}

function showCollisionPoints() {
    collisionLayer.showCollisionPoints()
}

function hideCollisionPoints() {
    collisionLayer.hideCollisionPoints()
}

