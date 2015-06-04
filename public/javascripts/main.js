// app namespace
em = {};

require(["esri/map", "dojo/domReady!"], function(Map) { 
    'use strict';

    var map_div = $('#map');
    var win = $(window);

    map_div.height(win.height());

    $(window).resize(function () {
        map_div.height(win.height());
    });

    em.map = new Map('map', {
        center: [-118, 34.5],
        zoom: 8,
        basemap: "topo",
        autoResize: true
    });
});