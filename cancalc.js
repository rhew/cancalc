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
    var canType = '300';
    var canData = [];

    for (var i = 3; i<=100; i++) {
        canData.push([i, canstructionDiameter(canType, i).toFixed(1)]);
    }

    $(function() {
        $('#canTableDiv').append("<table id=\"canTable\"><tbody></tbody></table>");
        $('#canTable').dataTable({
            "bSort": false,
            "aaData" : canData,
            "aoColumns" : [
                {"sTitle": "# of cans"},
                {"sTitle": "diameter"},
            ]
        });
    });
};
