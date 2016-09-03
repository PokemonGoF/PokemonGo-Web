'use strict';

var socket_handler = {
  position_update: function (map, user, data) {
    var lat = data.data.current_position[0];
    var lng = data.data.current_position[1];

    map.pathcoords[user].push({
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    });

    // set marker position
    map.user_data[user].marker.setPosition({
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    })

    // draw
    map.user_data[user].trainerPath = new google.maps.Polyline({
      map: map.map,
      path: mapView.pathcoords[user],
      geodisc: true,
      strokeColor: mapView.pathColors[0],
      strokeOpacity: map.settings.strokeOpacity,
      strokeWeight: 2
    });
  }
}

var socket_events = [
  'position_update'
];

var socket = {
  init: function(io, map, users) {
    for (var index in users) {
      var user = users[index]

      // setup socket events -- position_update
      for (var i in socket_events) {
        io.on(socket_events[i] + ":" + user, function(data) {
          socket_handler[socket_events[i]](map, user, data);
        });
      }
    }
  },
  handler: function(fn, user, data) {
    socket_handler[fn](user, data);
  }
}
