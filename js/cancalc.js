var inchesToPx = 10;

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

function canstructionDiameter(canType, count)
{
    radius = canTypeToInches(canType) / 2;
    return 2 * (centerToCanCenter(radius, count) + radius);
}

function drawCan(canLayer, shadowLayer, draggableLayer, x, y, radius, label, draggable) {
    var circle = new Kinetic.Circle({
        x: x,
        y: y,
        radius: radius,
        fill: 'silver',
        stroke: 'grey',
        strokeWidth: 1,
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

    var labelText = new Kinetic.Text({
        x: x,
        y: y,
        text: label,
        fontSize: 1 * inchesToPx,
        fontFamily: 'Arial',
        fill: 'black',
    });
    labelText.setOffset({
        x: labelText.getWidth() / 2,
        y: labelText.getHeight() / 2
    });

    if (draggable) {
        var group = new Kinetic.Group({
            draggable: true
        });
        group.add(shadow);
        group.add(circle);
        group.add(labelText);
        draggableLayer.add(group);
    } else {
        shadowLayer.add(shadow);
        canLayer.add(circle);
        canLayer.add(labelText);
    }
}

function drawCans(stage, x, y, canType, canCount) {
    var canRadius = canTypeToInches(canType) / 2;
    var canRenderRadius = canRadius * inchesToPx;
    var circleRenderRadius = centerToCanCenter(canRadius, canCount) * inchesToPx;

    var canLayer = new Kinetic.Layer();
    var shadowLayer = new Kinetic.Layer();
    var draggableLayer = new Kinetic.Layer();
    for (angle = 0; angle < (2 * Math.PI); angle += (2 * Math.PI / canCount)) {
        renderAngle = angle + Math.PI / 2;
        drawCan(
            canLayer,
            shadowLayer,
            draggableLayer,
            x + circleRenderRadius * Math.sin(renderAngle),
            y + circleRenderRadius * Math.cos(renderAngle),
            canRenderRadius,
            '#' + canType,
            0 === angle // make the first can draggable
        );
    }
    stage.add(shadowLayer);
    stage.add(canLayer);
    stage.add(draggableLayer);
}

var stage = new Kinetic.Stage({
    container: 'canCalcContainer',
    width: window.innerWidth,
    height: 300
});


var centerX = 12 * inchesToPx;
var centerY = stage.getHeight() / 2;

drawCans(
    stage,
    12 * inchesToPx,
    stage.getHeight() / 2,
    "300",
    16
); 
