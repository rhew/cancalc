function canTypeToInches(canType)
{
    var inches = Number(canType.substring(0,1));
    var sixteenths = Number(canType.substring(1, 2));
    return inches + sixteenths / 16;
}

function canstructionDiameter(canType, count)
{
    radius = canTypeToInches(canType) / 2;

    var centerToCanCenter = Math.sin((Math.PI - 2 * Math.PI / count ) / 2)
        * 2 * radius / Math.sin(2 * Math.PI / count);

    return 2 * (centerToCanCenter + radius);
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

function handleCanDrawing(canvas) {
    if (canvas.getContext) {
        var context = canvas.getContext('2d');

        window.addEventListener('resize', resizeCanvas, false);
        
        function resizeCanvas() {
                canvas.width = window.innerWidth;
                
                drawCans(); 
        }
        resizeCanvas();
        
        function drawCans() {
            var radius = 70;

            context.beginPath();
            context.arc(canvas.width / 2,
                canvas.height / 2,
                radius,
                0,
                2 * Math.PI,
                false);
            context.fillStyle = 'silver';
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = 'grey';
            context.stroke();
        }
    }
}

function buildCanTable()
{
    var canDataSets = buildCanDataSets(['202', '300', '303', '603']);

    $(function() {
        addForwardReferencesForTabs('#canTabs', canDataSets);
        Object.keys(canDataSets).forEach(function(canType) {
            addCanTableTab('#canTabs', canType, canDataSets);
        });
        $('#canTabs').tabs();

        handleCanDrawing(document.getElementById('canDrawing'));
    });
};
