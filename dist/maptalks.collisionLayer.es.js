/*!
 * maptalks.collisionLayer v0.1.1
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
 */
/*!
 * requires maptalks@>=0.36.0 
 */
import { MultiPoint, VectorLayer } from 'maptalks';
import rbush from 'rbush';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var options = {
    activeId: null,
    hidePointsSymbol: {
        'markerType': 'ellipse',
        'markerFillOpacity': 0.3,
        'markerLineOpacity': 0.3,
        'markerWidth': 3,
        'markerHeight': 3
    }
};

var CollisionLayer = function (_maptalks$VectorLayer) {
    _inherits(CollisionLayer, _maptalks$VectorLayer);

    function CollisionLayer() {
        _classCallCheck(this, CollisionLayer);

        return _possibleConstructorReturn(this, _maptalks$VectorLayer.apply(this, arguments));
    }

    CollisionLayer.prototype.onAdd = function onAdd() {
        this.map.on('viewchange', this.onViewChange, this);
        this._rbush = rbush();
        this._hideMarkers = null;
    };

    CollisionLayer.prototype.onViewChange = function onViewChange() {
        var _this2 = this;

        setTimeout(function () {
            return _this2.updateCollision();
        }, 0);
    };

    CollisionLayer.prototype.updateCollision = function updateCollision() {
        var _this3 = this;

        this._rbush.clear();
        this._hideMarkers && this._hideMarkers.remove();

        var hidePoints = [],
            _options = this.options,
            activeId = _options.activeId,
            hidePointsSymbol = _options.hidePointsSymbol,
            activeGeometry = this.getGeometryById(activeId),
            markers = this.getGeometries(function (geometry) {
            return geometry.type === 'Point' && geometry;
        });


        if (activeGeometry && activeGeometry.type === 'Point') {
            this._rbush.insert(this.getMarkerBox(activeGeometry));
            activeGeometry.show();
        }

        markers.forEach(function (marker) {
            if (activeGeometry === marker) {
                return;
            }

            var box = _this3.getMarkerBox(marker),
                result = _this3._rbush.search(box);

            if (result.length === 0) {
                _this3._rbush.insert(box);
                marker.show();
            } else {
                marker.hide();
                hidePoints.push(marker.getCoordinates());
            }
        });

        if (hidePointsSymbol) {
            this._hideMarkers = new MultiPoint(hidePoints, { symbol: hidePointsSymbol }).addTo(this);
            this._hideMarkers.bringToBack();
        }
    };

    CollisionLayer.prototype.getMarkerBox = function getMarkerBox(marker) {
        var _marker$getSize = marker.getSize(),
            width = _marker$getSize.width,
            height = _marker$getSize.height,
            _map$coordinateToCont = this.map.coordinateToContainerPoint(marker.getCoordinates()),
            x = _map$coordinateToCont.x,
            y = _map$coordinateToCont.y,
            minX = Math.round(x - width / 2),
            maxX = Math.round(x + width / 2),
            minY = Math.round(y - height / 2),
            maxY = Math.round(y + height / 2);

        return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
    };

    return CollisionLayer;
}(VectorLayer);

CollisionLayer.mergeOptions(options);

export { CollisionLayer };

typeof console !== 'undefined' && console.log('maptalks.collisionLayer v0.1.1, requires maptalks@>=0.36.0.');
