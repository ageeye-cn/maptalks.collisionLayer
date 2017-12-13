import * as maptalks from 'maptalks'
import rbush from 'rbush'

const options = {
    activeId: null,
}

export class CollisionLayer extends maptalks.VectorLayer {
    onAdd() {
        this.map.on('viewchange', this.onViewChange, this)
        this._rbush = rbush()
    }

    onViewChange() {
        this.updateCollision()
    }

    updateCollision() {
        this._rbush.clear()

        const markers = this.getGeometries(geometry => {
            return geometry.type === 'Point' && geometry
        })

        markers.forEach(marker => {
            console.log(this.getMarkerPointExtent(marker))
        })
    }

    getMarkerPointExtent(marker){
        const {width, height} = marker.getSize(),
            {x, y} = this.map.coordinateToContainerPoint(marker.getCoordinates()),
            xmin =  Math.round(x - width / 2),
            xmax = Math.round(x + width / 2),
            ymin =  Math.round(y - height / 2),
            ymax = Math.round(y + height / 2)

        return new maptalks.PointExtent({xmin, xmax, ymin, ymax})
    }
}

CollisionLayer.mergeOptions(options);