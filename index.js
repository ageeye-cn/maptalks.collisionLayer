import * as maptalks from 'maptalks'


const options = {
    activeId: null,
    hidePointsSymbol: {
        'markerType': 'ellipse',
        'markerFillOpacity': 0.3,
        'markerLineOpacity': 0.3,
        'markerWidth': 3,
        'markerHeight': 3,
    }
}

export class CollisionLayer extends maptalks.VectorLayer {
    onAdd() {
        this.map.on('viewchange', this.onViewChange, this)
        this._rbush = rbush()
        this._hideMarkers = null
    }
    onViewChange() {
        setTimeout(()=>this.updateCollision(), 0)
    }
    updateCollision() {
        this._rbush.clear()
        this._hideMarkers && this._hideMarkers.remove()

        const hidePoints = [],
            {activeId, hidePointsSymbol} = this.options,
            activeGeometry = this.getGeometryById(activeId),
            markers = this.getGeometries(geometry => {
                return geometry.type === 'Point' && geometry
            })

        if (activeGeometry){
            this._rbush.insert(this.getMarkerBox(activeGeometry))
            activeGeometry.show()
        }

        markers.forEach(marker => {
            if (activeGeometry === marker){
                return
            }

            const box = this.getMarkerBox(marker),
                result = this._rbush.search(box)

            if (result.length === 0) {
                this._rbush.insert(box)
                marker.show()
            } else {
                marker.hide()
                hidePoints.push(marker.getCoordinates())
            }
        })

        if (hidePointsSymbol){
            this._hideMarkers = new maptalks.MultiPoint(hidePoints, {symbol: hidePointsSymbol}).addTo(this)
            this._hideMarkers.bringToBack()
        }
    }

    getMarkerBox(marker) {
        const {width, height} = marker.getSize(),
            {x, y} = this.map.coordinateToContainerPoint(marker.getCoordinates()),
            minX = Math.round(x - width / 2),
            maxX = Math.round(x + width / 2),
            minY = Math.round(y - height / 2),
            maxY = Math.round(y + height / 2)

        return {minX, maxX, minY, maxY}
    }
}

CollisionLayer.mergeOptions(options);