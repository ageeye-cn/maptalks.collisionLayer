import * as maptalks from 'maptalks'
import rbush from 'rbush'

const options = {
    activeId: null,
    isCollision: true,
    isShowCollisionPoints: true,
    hidePointsId: 'hidePoints',
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
        this._hidePoints = new maptalks.MultiPoint([], {
            id: this.options.hidePointsId,
            symbol: this.options.hidePointsSymbol
        })
    }

    onViewChange() {
        setTimeout(() => this.updateCollision(), 0)
    }

    updateCollision() {
        if (!this.options.isCollision) {
            return
        }

        if (!this.getGeometryById(this.options.hidePointsId)) {
            this.addGeometry(this._hidePoints)
        }

        this._rbush.clear()

        const hidePoints = [],
            {activeId, isShowCollisionPoints} = this.options,
            activeGeometry = this.getGeometryById(activeId),
            markers = this.getMarkers()

        if (activeGeometry && activeGeometry.type === 'Point') {
            const box = this.getMarkerBox(activeGeometry)
            if (box){
                this._rbush.insert(box)
            }
            activeGeometry.show()
        }

        markers.forEach(marker => {
            if (activeGeometry === marker) {
                return
            }

            const box = this.getMarkerBox(marker)

            if (!box){
                marker.show()
                return
            }

            const result = this._rbush.search(box)

            if (result.length === 0) {
                this._rbush.insert(box)
                marker.show()
            } else {
                marker.hide()
                hidePoints.push(marker.getCoordinates())
            }
        })

        if (isShowCollisionPoints) {
            this._hidePoints.setCoordinates(hidePoints)
            this._hidePoints.bringToBack()
        } else {
            this._hidePoints.setCoordinates([])
        }
    }

    getMarkerBox(marker) {
        const size = marker.getSize()

        if (!size){
            return
        }

        const  {width, height} = size,
            coordinates = marker.getCoordinates()

        if (!coordinates){
            return
        }

        const  {x, y} = this.map.coordinateToContainerPoint(marker.getCoordinates()),
            minX = Math.round(x - width / 2),
            maxX = Math.round(x + width / 2),
            minY = Math.round(y - height / 2),
            maxY = Math.round(y + height / 2)

        return {minX, maxX, minY, maxY}
    }

    getMarkers() {
        return this.getGeometries(geometry => {
            return geometry.type === 'Point' && geometry
        })
    }

    isShowCollisionPoints() {
        return this.options.isShowCollisionPoints
    }

    showCollisionPoints() {
        this.options.isShowCollisionPoints = true
        this.updateCollision()
    }

    hideCollisionPoints() {
        this.options.isShowCollisionPoints = false
        this.updateCollision()
    }

    setActiveId(id) {
        this.options.activeId = id
        this.updateCollision()
    }

    enableCollision() {
        this.options.isCollision = true
        this.updateCollision()
    }

    disableCollision() {
        this.options.isCollision = false

        this._hidePoints.setCoordinates([])
        const markers = this.getMarkers()
        markers.forEach(marker => {
            marker.show()
        })
    }

    isCollision() {
        return this.options.isCollision
    }
}

CollisionLayer.mergeOptions(options);

CollisionLayer.registerJSONType('CollisionLayer');
