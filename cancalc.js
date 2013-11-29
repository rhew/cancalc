function canstructionDiameter(count)
{
    STANDARD_303_CAN_RADIUS_INCHES = 1.59375;
    STANDARD_300_CAN_RADIUS_INCHES = 1.5;
    var radius = STANDARD_300_CAN_RADIUS_INCHES;

    return 2 * (Math.sin((Math.PI - 2 * Math.PI / count ) / 2)
        * 2 * radius / Math.sin(2 * Math.PI / count) + radius);
}

function buildCanTable()
{
    var canData = [];

    for (var i = 3; i<=100; i++) {
        canData.push([i, canstructionDiameter(i).toFixed(1)]);
    }

    $(function() {
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
