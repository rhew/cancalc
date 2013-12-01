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

function buildCanDataSets(canTypes) {
    var canDataSets = [];
    canTypes.forEach(function(canType) {
        canDataSets[canType] = [];
        for (var i = 3; i<=100; i++) {
            canDataSets[canType].push([i, canstructionDiameter(canType, i).toFixed(1)]);
        }
    });
    return canDataSets;
}

function addForwardReferencesForTabs(el, canDataSets) {
    // tabs require a list with forward references to each tab div
    $(el).append('<ul id="canTabList"></ul>');
    Object.keys(canDataSets).forEach(function(canType) {
        var divId = 'canTab-' + canType;
        $('#canTabList').append(
            '<li><a href="#' + divId +
            '">Circle of #' + canType + ' cans</a></li>');
    });
}

function addCanTableTab(el, canType, canDataSets) {
    var divId = 'canTab-' + canType;
    var tableId = 'canTable-' + canType;
    $('#canTabs').append('<div id="' + divId + '"></div>');
    $('#' + divId).append(
        "<table id=\"" + tableId + "\"><tbody></tbody></table>"
    );
    $('#' + tableId).dataTable({
        "bSort": false,
        "aaData" : canDataSets[canType],
        "aoColumns" : [
            {"sTitle": "# of cans"},
            {"sTitle": "diameter"},
        ]
    });
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
    var canDataSets = buildCanDataSets(['202', '300', '303', '603']);

    $(function() {
        addForwardReferencesForTabs('#canTabs', canDataSets);
        Object.keys(canDataSets).forEach(function(canType) {
            addCanTableTab('#canTabs', canType, canDataSets);
        });
        $('#canTabs').tabs();

        handleCanDrawing(document.getElementById('canCalcCanvas'));

    });
};
