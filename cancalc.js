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

function buildCanTable()
{
    var canTypes = ['202', '300', '303'];

    var canDataSets = [];
    canTypes.forEach(function(canType) {
        canDataSets[canType] = [];
        for (var i = 3; i<=100; i++) {
            canDataSets[canType].push([i, canstructionDiameter(canType, i).toFixed(1)]);
        }
    });

    $(function() {
        // tabs require a list with forward references to each tab div
        $('#canTabs').append('<ul id="canTabList"></ul>');
        Object.keys(canDataSets).forEach(function(canType) {
            var divId = 'canTab-' + canType;
            $('#canTabList').append(
                '<li><a href="#' + divId +
                '">Circle of #' + canType + ' cans</a></li>');
        });

        Object.keys(canDataSets).forEach(function(canType) {
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
        });
        $('#canTabs').tabs();
    });
};
