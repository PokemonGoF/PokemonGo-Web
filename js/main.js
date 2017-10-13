'use strict';

var mvManager = new MapViewManager();

$(document).ready(function () {
  mvManager.mapView.initSettings();
  mvManager.mapView.initSockets();
  mvManager.mapView.init();
});