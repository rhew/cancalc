var canCalc = (function () {
    var inchesToPx = 10;
    var MIN_CAN_COUNT = 3;
    var MAX_CAN_COUNT = 200;
    var CAN_TYPE = '300';

    var stage = new Kinetic.Stage({
        container: 'canCalcContainer',
        width: window.innerWidth,
        height: window.innerHeight
    });
    var floorLayer = new Kinetic.Layer();
    var canLayer = new Kinetic.Layer();
    var shadowLayer = new Kinetic.Layer();
    var dynamicLayer = new Kinetic.Layer();
    var infoLayer = new Kinetic.Layer();

    var centerX = 12 * inchesToPx;
    var centerY = stage.getHeight() / 2;

    var ruler = new Kinetic.Line({
        points: [centerX, centerY, centerX, centerY],
        stroke: 'green',
        dashArray: [11 * inchesToPx, 1 * inchesToPx],
        strokeWidth: 1
    });

    rulerLabel = '0.0"';
    var rulerDisplay = new Kinetic.Text({
        x: centerX,
        y: centerY,
        text: rulerLabel,
        fontSize: 5 * inchesToPx,
        fontFamily: 'Arial',
        fill: 'darkred',
    });
    rulerDisplay.setOffset({
        x: rulerDisplay.getWidth() / 2,
        y: rulerDisplay.getHeight() / 2
    });

    dynamicLayer.add(ruler);
    dynamicLayer.add(rulerDisplay);
    stage.add(dynamicLayer);

    var canDataSets = buildCanDataSets([CAN_TYPE]);

    var dropSound = new Audio('media/drop1.wav');

    var sources = {
        can: 'media/can.png',
        floor: 'media/floor.png',
    };

    imageLoader(sources, 
        function(images) {
            drawScreen(
                images,
                stage,
                12 * inchesToPx,
                stage.getHeight() / 2,
                CAN_TYPE,
                16,
                false
            );
    });

    function imageLoader(sourceList, callback) {
        var imageList = {};
        var numLoaded = 0;

        Object.keys(sourceList).forEach(function (key) {
            imageList[key] = new Image();
            imageList[key].onload = function() {
                numLoaded++;
                if (numLoaded >= Object.keys(sourceList).length) {
                    callback(imageList);
                }
            };
            imageList[key].src = sourceList[key];
        });
    }

    function canTypeToInches(canType)
    {
        var inches = Number(canType.substring(0,1));
        var sixteenths = Number(canType.substring(1, 2));
        return inches + sixteenths / 16;
    }

    function centerToCanCenter(canRadius, count) {
        return Math.sin((Math.PI - 2 * Math.PI / count ) / 2)
            * 2 * canRadius / Math.sin(2 * Math.PI / count);
    }

    function buildCanDataSets(canTypes) {
        var canDataSets = [];
        $.each(canTypes, function(dummyIndex, canType) {
            canDataSets[canType] = [];
            for (var i = MIN_CAN_COUNT; i<=MAX_CAN_COUNT; i++) {
                canDataSets[canType][i] = centerToCanCenter(
                    canTypeToInches(canType) / 2,
                    i
                ).toFixed(1);
            }
        });
        return canDataSets;
    }

    function findClosestRadiusCanCount(proposedRadius, canType) {
        canTypeDataSet = canDataSets[canType];
        var newCanCount = MAX_CAN_COUNT;
        $.each(canTypeDataSet, function(canCount, diameter) {
            if (proposedRadius < diameter) {
                newCanCount = canCount;
                return false;
            }
        });
        return newCanCount;
    }


    // TODO: ruler.prototype
    function getRulerMeasurement() {
        var points = ruler.getPoints();
        var a = points[0].x - points[1].x;
        var b = points[0].y - points[1].y;
        
        return Math.sqrt(a * a + b * b) / inchesToPx;
    }

    // TODO: ruler.prototype
    function moveRulerEndPoint(x, y) {
        var points = ruler.getPoints();
        ruler.setPoints([
            points[0].x,
            points[0].y, 
            x,
            y
        ]);
        rulerDisplay.setText(getRulerMeasurement().toFixed(1) + '"');
        rulerDisplay.setOffset({
            x: rulerDisplay.getWidth() / 2,
            y: rulerDisplay.getHeight() / 2
        });

        ruler.getLayer().draw();
    }

    function drawCan(images, canLayer, shadowLayer, dynamicLayer, x, y, radius, draggable) {
        var circle = new Kinetic.Circle({
            radius: radius,
            drawFunc: function() {
                var context = this.getContext();
                context.drawImage(
                    images['can'],
                    x - radius,
                    y - radius,
                    2 * radius,
                    2 * radius
                );
            },
        });

        var shadow = new Kinetic.Circle({
            x: x,
            y: y,
            radius: radius,
            fill: 'silver',
            stroke: 'none',
            shadowColor: 'black',
            shadowOffset: 0.05 * inchesToPx * radius,
            shadowOpacity: 0.5,
            shadowBlur: 30,
        });

        if (draggable) {
            var group = new Kinetic.Group({
                draggable: true
            });
            group.add(shadow);
            group.add(circle);


            group.on('dragmove', function() {
                var circles = group.find('Circle');
                moveRulerEndPoint(
                    circles[0].getX() + group.getX(),
                    circles[0].getY() + group.getY()
                );
            });
            group.on('dragend', function() {
                drawScreen(
                    images,
                    stage,
                    12 * inchesToPx,
                    stage.getHeight() / 2,
                    CAN_TYPE,
                    findClosestRadiusCanCount(getRulerMeasurement(), CAN_TYPE),
                    true
                ); 
            });

            dynamicLayer.add(group);
        } else {
            shadowLayer.add(shadow);
            canLayer.add(circle);
        }
    }

    function drawInfoBox(canType, canCount, rulerMeasurement) {
        var text = new Kinetic.Text({
            x: 10,
            y: 10,
            text:
                'can type: #' + canType +
                '\ncan count: ' + canCount +
                '\nruler: ' + rulerMeasurement.toFixed(1) + '"' +
                '\noverall diameter: ' +
                    (rulerMeasurement * 2 + canTypeToInches(canType)).toFixed(1) + '"',
            fontSize: 14,
            fontFamily: 'Arial',
            fill: 'darkred',
            width: 180,
            padding: 10,
            align: 'left'
        });

        var rectangle = new Kinetic.Rect({
            x: 10,
            y: 10,
            stroke: '#555',
            strokeWidth: 5,
            fill: '#ddd',
            width: 180,
            height: text.getHeight(),
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2,
            opacity: 0.5,
            cornerRadius: 10
        });

        infoLayer.add(rectangle);
        infoLayer.add(text);
    }

    function drawScreen(images, stage, x, y, canType, canCount, canMoved) {
        if (canMoved) {
            dropSound.play();
        }
        var floorRect = new Kinetic.Rect({
            x: 0,
            y: 0,
            height: stage.getHeight(),
            width: stage.getWidth(),
            fillPatternRepeat: 'repeat',
            fillPatternImage: images['floor'],
        });
        floorLayer.add(floorRect);

        var canRadius = canTypeToInches(canType) / 2;
        var canRenderRadius = canRadius * inchesToPx;
        var circleRenderRadius = centerToCanCenter(canRadius, canCount) * inchesToPx;

        shadowLayer.destroyChildren();
        canLayer.destroyChildren();
        // delete the draggable can if it's there, leave the ruler
        var draggableCanGroups = dynamicLayer.find('Group');
        if (draggableCanGroups[0]) {
            draggableCanGroups[0].destroy();
        }
        infoLayer.destroyChildren();

        moveRulerEndPoint(centerX + circleRenderRadius, centerY);

        drawInfoBox(canType, canCount, getRulerMeasurement());

        for (angle = 0; angle < (2 * Math.PI); angle += (2 * Math.PI / canCount)) {
            renderAngle = angle + Math.PI / 2;
            drawCan(
                images,
                canLayer,
                shadowLayer,
                dynamicLayer,
                x + circleRenderRadius * Math.sin(renderAngle),
                y + circleRenderRadius * Math.cos(renderAngle),
                canRenderRadius,
                0 === angle // make the first can draggable
            );
        }
        stage.add(floorLayer);
        stage.add(shadowLayer);
        stage.add(canLayer);
        stage.add(dynamicLayer);
        stage.add(infoLayer);
    }
}());
