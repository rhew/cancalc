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

function drawCan(context, x, y, radius, label) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'silver';
    context.fill();

    context.lineWidth = 1;
    context.strokeStyle = 'grey';
    context.stroke();

    context.fillStyle = 'black';
    context.font="8px Arial";
    context.textAlign="center";
    context.textBaseline="middle";
    context.fillText(label, x, y);
}

function handleCanDrawing(canvas) {
    if (canvas.getContext) {
        var context = canvas.getContext('2d');

        window.addEventListener('resize', resizeCanvas, false);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            drawCans("300", 16); 
        }

        resizeCanvas();
        
        function drawCans(canType, canCount) {
            var canRadius = canTypeToInches(canType) / 2;
            var canRenderRadius = canRadius * 10;
            var circleRenderRadius = centerToCanCenter(canRadius, canCount) * 10;

            var centerX = 120;
            var centerY = canvas.height / 2;
            for (angle = 0; angle < (2 * Math.PI); angle += (2 * Math.PI / canCount)) {
                drawCan(
                    context,
                    centerX + circleRenderRadius * Math.sin(angle),
                    centerY + circleRenderRadius * Math.cos(angle),
                    canRenderRadius,
                    '#' + canType);
            }
        }
    }
}

function renderCanCalc()
{
    $(function() {
        handleCanDrawing(document.getElementById('canCalcCanvas'));
    });
};
