'use strict';

var socket_io;
var socket2_io;
var socket3_io;
var socket4_io;
var socket5_io;
var pokemonActions;

    
var events = {
        api_error:                         'red',
		badges:                            'blue',
        bot_exit:                          'red',
        bot_start:                         'green',
        catch_limit:                       'red',
  catch_log:                         'magenta',
        config_error:                      'red',
        egg_already_incubating:            'yellow',
        egg_hatched:                       'green',
  evolve_log:                        'magenta',
        future_pokemon_release:            'yellow',
        incubate:                          'green',
        
        inventory_full:                    'yellow',
        item_discard_fail:                 'red',
        item_discarded:                    'green',
        next_force_recycle:                'green',
        force_recycle:                     'green',
        keep_best_release:                 'green',
        level_up:                          'green',
        level_up_reward:                   'green',
        location_cache_error:              'yellow',
        location_cache_ignored:            'yellow',
        login_failed:                      'red',
  login_log:                         'magenta',
        login_successful:                  'green',
  log_stats:                         'magenta',
        lucky_egg_error:                   'red',
        move_to_map_pokemon_encounter:     'green',
        move_to_map_pokemon_fail:          'red',
        next_egg_incubates:                'yellow',
        next_sleep:                        'green',
        next_random_pause:                 'green',
        next_random_alive_pause:           'green',
        no_pokeballs:                      'red',
		path_lap_end:                      'green',
        pokemon_appeared:                  'yellow',
        pokemon_capture_failed:            'red',
        pokemon_caught:                    'blue',
        pokemon_evolved:                   'green',
        pokemon_fled:                      'red',
        pokemon_inventory_full:            'red',
        pokemon_nickname_invalid:          'red',
        pokemon_not_in_range:              'yellow',
        pokemon_release:                   'green',
        pokemon_vanished:                  'red',
        pokestop_empty:                    'yellow',
  pokestop_log:                      'magenta',
        pokestop_searching_too_often:      'yellow',
        rename_pokemon:                    'green',
  show_best_pokemon:                 'magenta',
  show_inventory:                    'magenta',
        skip_evolve:                       'yellow',
        softban:                           'red',
  softban_log:                       'magenta',
        spun_pokestop:                     'cyan',
        threw_berry_failed:                'red',
        transfer_log:                      'magenta',
        unknown_spin_result:               'red',
        unset_pokemon_nickname:            'red',
        vip_pokemon:                       'red',
        arrived_at_cluster:                'white',
        arrived_at_fort:                   'white',
        bot_sleep:                         'white',
        bot_random_pause:                  'white',
        bot_random_alive_pause:            'white',
        //catchable_pokemon:                 'white',
        found_cluster:                     'white',
        
        load_cached_location:              'white',
        location_found:                    'white',
        login_started:                     'white',
        
        move_to_map_pokemon_move_towards:  'white',
        move_to_map_pokemon_updated_map:   'white',
        
        moving_to_fort:                    'white',
        moving_to_lured_fort:              'white',
        //pokemon_catch_rate:                'white',
        pokemon_evolve_fail:               'white',
        pokestop_on_cooldown:              'white',
        pokestop_out_of_range:             'white',
        polyline_request:                  'white',
        //position_update:                   'white',
        path_lap_update:                   'white',
        set_start_location:                'white',
        softban_fix:                       'white',
        softban_fix_done:                  'white',
        spun_fort:                         'white',
        threw_berry:                       'white',
        threw_pokeball:                    'white',
        used_lucky_egg:                    'white',
        gained_candy:                      'white',
        //player_data:                       'white',
        moving_to_pokemon_throught_fort:   'white'
}	

socket_io = io.connect('127.0.0.1:4000');
socket2_io = io.connect('127.0.0.1:4002');
socket3_io = io.connect('127.0.0.1:4003');
socket4_io = io.connect('127.0.0.1:4004');
socket5_io = io.connect('127.0.0.1:4005');

$(document).ready(function() {
  mapView.init();
    socket_io.on('connect', function() {
      console.log('connected!');
    });
    socket_io.on('logging', function(msg) {
      for(var i = 0; i < msg.length; i++) {
        mapView.log({
          message: msg[i].output,
          color: msg[i].color + "-text"
        });
      }
    });

    pokemonActions = function(socket_io){
        var actions = {
            releasePokemon: {
                button: function(pokemon, user_id){
                    return '<a href="#!" onClick="pokemonActions.releasePokemon.action(\''+pokemon.unique_id+'\')">Release</a>';
                },
                action: function(id){
                    if(confirm("Are you sure you want to release this pokemon? THIS CANNOT BE UNDONE!")){
                        socket_io.emit('user_action', {'event':'release_pokemon', data: {'pokemon_id': id}});
                        mapView.sortAndShowBagPokemon(false, false);
                    }
                }
            },

            evolvePokemon: {
                button: function(pokemon, user_id){
                    var pkmnData = mapView.pokemonArray[pokemon.id - 1],
                        candy = mapView.getCandy(pokemon.id, user_id),
                        canEvolve = false;
                    if("undefined" != typeof pkmnData['Next evolution(s)'] && "undefined" != typeof pkmnData['Next Evolution Requirements']){
                        canEvolve = (candy >= pkmnData['Next Evolution Requirements']['Amount'])
                    }
                    return (canEvolve ? '<a href="#!" onClick="pokemonActions.evolvePokemon.action(\''+pokemon.unique_id+'\')">Evolve</a>' : false);
                },
                action: function(id){
                    if(confirm("Are you sure you want to evolve this pokemon? THIS CANNOT BE UNDONE!")){
                        socket_io.emit('user_action', {'event':'evolve_pokemon', data: {'pokemon_id': id}});
                        mapView.sortAndShowBagPokemon(false, false);
                    }
                }
            }
        }

        var enabledActions = {};
        for(var i in actions){
            if(mapView.settings.actionsEnabled === true){
                enabledActions[i] = actions[i];
            } else if(Array.isArray(mapView.settings.actionsEnabled)){
                if (mapView.settings.actionsEnabled.indexOf(i) !== -1){
                    enabledActions[i] = actions[i];
                }
            }
        }

        return enabledActions;
    }(socket_io)
});
var mStyles = {
    "nolabels": { name: "No Labels", style: [{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]}] },
    "light2": { name: "Light2", style: [{elementType:"geometry",stylers:[{hue:"#ff4400"},{saturation:-68},{lightness:-4},{gamma:.72}]},{featureType:"road",elementType:"labels.icon"},{featureType:"landscape.man_made",elementType:"geometry",stylers:[{hue:"#0077ff"},{gamma:3.1}]},{featureType:"water",stylers:[{hue:"#00ccff"},{gamma:.44},{saturation:-33}]},{featureType:"poi.park",stylers:[{hue:"#44ff00"},{saturation:-23}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{hue:"#007fff"},{gamma:.77},{saturation:65},{lightness:99}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{gamma:.11},{weight:5.6},{saturation:99},{hue:"#0091ff"},{lightness:-86}]},{featureType:"transit.line",elementType:"geometry",stylers:[{lightness:-48},{hue:"#ff5e00"},{gamma:1.2},{saturation:-23}]},{featureType:"transit",elementType:"labels.text.stroke",stylers:[{saturation:-64},{hue:"#ff9100"},{lightness:16},{gamma:.47},{weight:2.7}]}] },
    "dark": { name: "Dark", style: [{featureType:"all",elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#b39964"},{lightness:40}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"on"},{color:"#000000"},{lightness:16}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:17},{weight:1.2}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#000000"},{lightness:21}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#000000"},{lightness:18}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#181818"},{lightness:16}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#000000"},{lightness:19}]},{featureType:"water",elementType:"geometry",stylers:[{lightness:17},{color:"#525252"}]}] },
    "pokemongo": { name: "Pokemon Go", style: [{featureType:"landscape.man_made",elementType:"geometry.fill",stylers:[{color:"#a1f199"}]},{featureType:"landscape.natural.landcover",elementType:"geometry.fill",stylers:[{color:"#37bda2"}]},{featureType:"landscape.natural.terrain",elementType:"geometry.fill",stylers:[{color:"#37bda2"}]},{featureType:"poi.attraction",elementType:"geometry.fill",stylers:[{visibility:"on"}]},{featureType:"poi.business",elementType:"geometry.fill",stylers:[{color:"#e4dfd9"}]},{featureType:"poi.business",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{color:"#37bda2"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#84b09e"}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{color:"#fafeb8"},{weight:"1.25"}]},{featureType:"road.highway",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#5ddad6"}]}] },
    "light2_nolabels": { name: "Light2 (No Labels)", style: [{elementType:"geometry",stylers:[{hue:"#ff4400"},{saturation:-68},{lightness:-4},{gamma:.72}]},{featureType:"road",elementType:"labels.icon"},{featureType:"landscape.man_made",elementType:"geometry",stylers:[{hue:"#0077ff"},{gamma:3.1}]},{featureType:"water",stylers:[{hue:"#00ccff"},{gamma:.44},{saturation:-33}]},{featureType:"poi.park",stylers:[{hue:"#44ff00"},{saturation:-23}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{hue:"#007fff"},{gamma:.77},{saturation:65},{lightness:99}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{gamma:.11},{weight:5.6},{saturation:99},{hue:"#0091ff"},{lightness:-86}]},{featureType:"transit.line",elementType:"geometry",stylers:[{lightness:-48},{hue:"#ff5e00"},{gamma:1.2},{saturation:-23}]},{featureType:"transit",elementType:"labels.text.stroke",stylers:[{saturation:-64},{hue:"#ff9100"},{lightness:16},{gamma:.47},{weight:2.7}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.text.fill",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]}] },
    "dark_nolabels": { name: "Dark (No Labels)", style: [{featureType:"all",elementType:"labels.text.fill",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:17},{weight:1.2}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#000000"},{lightness:21}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#000000"},{lightness:18}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#181818"},{lightness:16}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#000000"},{lightness:19}]},{featureType:"water",elementType:"geometry",stylers:[{lightness:17},{color:"#525252"}]}] },
    "pokemongo_nolabels": { name: "Pokemon Go (No Labels)", style: [{featureType:"landscape.man_made",elementType:"geometry.fill",stylers:[{color:"#a1f199"}]},{featureType:"landscape.natural.landcover",elementType:"geometry.fill",stylers:[{color:"#37bda2"}]},{featureType:"landscape.natural.terrain",elementType:"geometry.fill",stylers:[{color:"#37bda2"}]},{featureType:"poi.attraction",elementType:"geometry.fill",stylers:[{visibility:"on"}]},{featureType:"poi.business",elementType:"geometry.fill",stylers:[{color:"#e4dfd9"}]},{featureType:"poi.business",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{color:"#37bda2"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#84b09e"}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{color:"#fafeb8"},{weight:"1.25"}]},{featureType:"road.highway",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#5ddad6"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.text.fill",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]}] },
    // https://github.com/OpenPoGo/OpenPoGoWeb/issues/122
    "chrischi-": { name: "Chrischi-'s Pokemon Go (No Labels)", style: [{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#4f9f92"},{visibility:"on"}]},{featureType:"water",elementType:"geometry.stroke",stylers:[{color:"#feff95"},{visibility:"on"},{weight:1.2}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#adff9d"},{visibility:"on"}]},{featureType:"water",stylers:[{visibility:"on"},{color:"#147dd9"}]},{featureType:"poi",elementType:"geometry.fill",stylers:[{color:"#d3ffcc"}]},{elementType:"labels",stylers:[{visibility:"off"}]}] },
  },
  selectedStyle = undefined;
var minGPPerLevel = { 1: 0, 2: 2000, 3: 4000, 4: 8000, 5: 12000, 6: 16000, 7: 20000, 8: 30000, 9: 40000, 10: 50000 };
var hasFocused = false;
var mapView = {
  map: [],
  lastClickLocation: null,
  user_index: 0,
  emptyDex: [],
  forts: [],
  info_windows: [],
  numTrainers: [
    177,
    109
  ],
    requiredExpToLevelUp: { 1: 1000, 2: 2000, 3: 3000, 4: 4000, 5: 5000, 6: 6000, 7: 7000, 8: 8000, 9: 9000, 10: 10000,
        11: 10000, 12: 10000, 13: 10000, 14: 15000, 15: 20000, 16: 20000, 17: 20000, 18: 25000, 19: 25000, 20: 50000,
        21: 75000, 22: 100000, 23: 125000, 24: 150000, 25: 190000, 26: 200000, 27: 250000, 28: 300000, 29: 350000, 30: 500000,
        31: 500000, 32: 750000, 33: 1000000, 34: 1250000, 35: 1500000, 36: 2000000, 37: 2500000, 38: 3000000, 39: 5000000, 40: 5000000
    },
    minimumGymPointsPerLevel: {
  	1:0,
	2:2000,
	3:4000,
	4:8000,
	5:12000,
	6:16000,
	7:20000,
	8:30000,
	9:40000,
	10:50000
  },
  teams: [
    'TeamLess',
    'Mystic',
    'Valor',
    'Instinct'
  ],
    pokemon_sprite: {
        columns: 7,
        icon_width: 65,
        icon_height: 65,
        sprite_width: 455,
        sprite_height: 1430,
        filename: 'image/pokemon_sprite_highres.png'
    },
  trainerSex: [
    'm',
    'f'
  ],
  pathColors: [
    '#A93226',
    '#884EA0',
    '#2471A3',
    '#17A589',
    '#229954',
    '#D4AC0D',
    '#CA6F1E',
    '#CB4335',
    '#7D3C98',
    '#2E86C1',
    '#138D75',
    '#28B463',
    '#D68910',
    '#BA4A00'
  ],
  bagCandy: {},
  bagItems: {},
  bagPokemon: {},
  inventory: {},
  playerInfo: {},
  pokedex: {},
  pokemonArray: {},
  pokemoncandyArray: {},
  levelXpArray: {},
  stats: {},
  user_data: {},
  user_xps: {},
  pathcoords: {},

  settings: {},
  customPaths: {}, // array of custom paths for Paths menu
  customPathsLine: 0, // polyline of all the custom paths for Paths menu
  init: function() {
    var self = this;
    self.settings = $.extend(true, self.settings, userInfo, dataUpdates);
    self.bindUi();

for (var k in events){		
	if (events.hasOwnProperty(k)) {
		let renk = events[k];
		socket_io.on(k+':'+self.settings.users[0], function (data) {
			//console.log(data);
			if(data['data']['msg'] != null){
			Materialize.toast("<span style='color:" + renk + "'>" + data['data']['msg'] + "</span>", 5000);
}
}
);
socket2_io.on(k+':'+self.settings.users[1], function (data) {
			console.log(data);
			if(data['data']['msg'] != null){Materialize.toast("<span style='color:#884EA0'>" + data['data']['msg'] + "</span>", 5000);
}
}
);
socket3_io.on(k+':'+self.settings.users[2], function (data) {
			console.log(data);
			if(data['data']['msg'] != null){Materialize.toast("<span style='color:#2471A3'>" + data['data']['msg'] + "</span>", 5000);
}
}
);
socket4_io.on(k+':'+self.settings.users[3], function (data) {
			console.log(data);
			if(data['data']['msg'] != null){Materialize.toast("<span style='color:#17A589'>" + data['data']['msg'] + "</span>", 5000);
}
}
);
socket5_io.on(k+':'+self.settings.users[4], function (data) {
			console.log(data);
			if(data['data']['msg'] != null){Materialize.toast("<span style='color:#229954'>" + data['data']['msg'] + "</span>", 5000);
}
}
);
}
}


   
      loadJSON('data/pokemondata.json?'+Date.now(), function(data, successData) {
        self.pokemonArray = data;
      }, self.errorFunc, 'pokemonData');
      loadJSON('data/pokemoncandy.json?'+Date.now(), function(data, successData) {
        self.pokemoncandyArray = data;
      }, self.errorFunc, 'pokemonCandy');
      loadJSON('data/levelXp.json?'+Date.now(), function(data, successData) {
        self.levelXpArray = data;
      }, self.errorFunc, 'levelXp');
loadJSON('data/moves.json?'+Date.now(), function(data, successData) { 
self.moveList = {}; 
data.map(move => { 
self.moveList[move.id] = move;
}); 
}, self.errorFunc, 'moveList');
loadJSON('data/items.json?'+Date.now(), function(data, successData) { 
self.itemsArray = data; 
}, self.errorFunc, 'itemsArray'); 

      for (var i = 0; i < self.settings.users.length; i++) {
        var user = self.settings.users[i];
        self.user_data[user] = {};
        self.pathcoords[user] = [];
      }
 
    $.getScript('https://maps.googleapis.com/maps/api/js?key={0}&libraries=drawing'.format(self.settings.gMapsAPIKey), function() {
      self.initMap();
        self.map.setZoom(self.settings.zoom);
      self.log({
        message: 'Data Loaded!'
      });
    });
  },
  setBotPathOptions: function(checked) {
      var self = this;
      for (var user in self.settings.users) {
        var trainerPath = self.user_data[user];
        if (!trainerPath) { continue; } // failsafe, in case user data hasn't been fully loaded
        self.user_data[user].trainerPath.setOptions({
          strokeOpacity: (checked ? 1.0 : 0.0),
          zIndex: (checked ? 4 : 0)
        });
      }
  },
  
  bindUi: function() {
    var self = this;
    $('#switchPan').prop('checked', self.settings.userFollow);
    $('#switchZoom').prop('checked', self.settings.userZoom);
    $('#strokeOn').prop('checked',  self.settings.userPath);

    $('#switchPan').change(function() {
      if (this.checked) {
        self.settings.userFollow = true;
      } else {
        self.settings.userFollow = false;
      }
    });

    $('#switchZoom').change(function() {
      if (this.checked) {
        self.settings.userZoom = true;
      } else {
        self.settings.userZoom = false;
      }
    });

    $('#strokeOn').change(function() {
      for (var i = 0; i < self.settings.users.length; i++) {
        self.user_data[self.settings.users[i]].trainerPath.setOptions({
          strokeOpacity: this.checked ? 1.0 : 0.0
        });
      }
    });

    $('#optionsButton').click(function() {
      $('#optionsList').toggle();
    });

    $('#logs-button').click(function() {
      $('#logs-panel').toggle();
    });
    // Init tooltip
    $(document).ready(function() {
      $('.tooltipped').tooltip({
        delay: 50
      });
    });

    // Bots list and menus
    var submenuIndex = 0,
      currentUserId;
    $('body').on('click', ".bot-user .bot-items .btn:not(.tFind)", function() {
      var itemIndex = $(this).parent().parent().find('.btn').index($(this)) + 1,
        userId = $(this).closest('ul').data('user-id');
      if ($('#submenu').is(':visible') && itemIndex == submenuIndex && currentUserId == userId) {
        $('#submenu').toggle();
      } else {
        submenuIndex = itemIndex;
        currentUserId = userId;
        self.buildMenu(userId, itemIndex);
      }
    });

    $('body').on('click', '#close', function() {
      $('#submenu').toggle();
    });

    $('body').on('click', '.tFind', function() {
      self.findBot($(this).closest('ul').data('user-id'));
    });

    // Binding sorts
    $('body').on('click', '.pokemon-sort a', function() {
      var item = $(this);
      self.sortAndShowBagPokemon(item.data('sort'), item.parent().parent().data('user-id'));
    });
    $('body').on('click', '.pokedex-sort a', function() {
      var item = $(this);
      self.sortAndShowPokedex(item.data('sort'), item.parent().parent().data('user-id'));
    });
$('body').on('click', '.not-pokedex-sort a', function() {
      var item = $(this);
      self.sortAndShowNotPokedex(item.data('sort'), item.parent().parent().data('user-id'));
    });
	},
changeMapStyle: function(style) {
    var self = mapView,
      style = $(this).data('style');

    if (!style) { return; }

    if (mStyles[style] && mStyles[style].style) {
      self.map.setOptions({
        mapTypeId: 'roadmap',
        styles: mStyles[style].style
      });
    } else {
      self.map.setOptions({
        mapTypeId: (style == 'satellite' ? 'satellite' : 'roadmap'),
        styles: []
      });
    }

    Cookies.set('mapStyle', style, { expires: 365 });
    
  },
  initMap: function() {
    var self = this,
      cookies = Cookies.get('mapStyle'),
      desiredStyle = cookies || self.settings.defaultMapStyle || undefined;
    self.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 50.0830986, lng: 6.7613762 },
      zoom: 8,
      mapTypeId: (desiredStyle && desiredStyle == 'satellite' ? 'satellite' : 'roadmap'),
      styles: ((desiredStyle && desiredStyle != 'satellite' && mStyles[desiredStyle] && mStyles[desiredStyle].style) ? mStyles[desiredStyle].style : []),
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      fullscreenControlOptions: { position: google.maps.ControlPosition.TOP_LEFT }
    });

    var ops = $('#mapStyles');
    if (mStyles != undefined && Object.keys(mStyles).length && ops != undefined) {
      ops.append('<li class="divider"></li>');
      for (var s in mStyles) {
        if (mStyles[s].name != undefined && mStyles[s].style != undefined) {
          ops.append('<li><a data-style="' + s + '">' + mStyles[s].name + '</a></li><li class="divider"></li>');
        }
      }
      ops.find('li.divider:last-child').remove(); // remove latest divider thingy
      ops.find('li > a').click(self.changeMapStyle); // add click handler
    }

    if (cookies) { Cookies.set('mapStyle', cookies, { expires: 365 }); } // refresh cookies
    self.placeTrainer();
    self.addCatchable();
    self.buildContextMenu();
    setInterval(self.updateTrainer, self.settings.updateTrainer);
    setInterval(self.addCatchable, self.settings.addCatchable);
    setInterval(self.addInventory, self.settings.addInventory);
    self.bindPathMenu();
  },
  addCatchable: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      loadJSON('catchable-' + self.settings.users[i] + '.json?'+Date.now(), self.catchSuccess, self.errorFunc, i);
    }
  },
  buildContextMenu: function () {
    var self = this;
    google.maps.event.addListener(self.map, 'rightclick', function(event) {
      self.lastClickLocation = event.latLng;
      $('#map').contextMenu({ x: event.pixel.x, y: event.pixel.y });
    });
    google.maps.event.addListener(self.map, 'click', function(event) {
      $('#map').contextMenu('hide');
    });
    $.contextMenu({
      selector: '#map',
      items: {
        copyLoc: {
          name: "Copy location",
          icon: 'copy',
          callback: function() {
            if (!self.lastClickLocation) return;
            var locString = self.lastClickLocation.lat() + ', ' + self.lastClickLocation.lng();
            clipboard.copy(locString);
          }
        }
      }
    });
  },
  addInventory: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      loadJSON('inventory-' + self.settings.users[i] + '.json?'+Date.now(), self.invSuccess, self.errorFunc, i);
    }
  },
  calculateTotalPreviousExps: function(level)
  {
    var t, i;
    t = 0;
    for (i = 1; i < level; i++) { t += requiredExpToLevelUp[i]; }
    return t;
  },
  buildMenu: function(user_id, menu) {
    var self = this,
      out = '';
    $("#submenu").show();
    switch (menu) {
      case 1:
        var current_user_stats = self.user_data[self.settings.users[user_id]].stats[0].inventory_item_data.player_stats;
        $('#subtitle').html('Trainer Info');
        $('#sortButtons').html('');

        var xps = '';
        if ((user_id in self.user_xps) && self.user_xps[user_id].length) {
            var xp_first = self.user_xps[user_id][0];
            var xp_last = self.user_xps[user_id][self.user_xps[user_id].length-1];
            var d_xp = xp_last.xp - xp_first.xp;
            var d_t = xp_last.t - xp_first.t;
            if (d_t > 0) {
            xps = '<br>XP/H: '+(Math.round(360000*d_xp/d_t)/100)+ ' (earned '+d_xp+' XP in last '+Math.round(d_t)+' s) ';
            }
        }

        out += '<div class="row"><div class="col s12"><h5>Non Test Bot Online</h5><br>Level: ' +
          current_user_stats.level +
          '<br><div class="progress bot-exp-bar" style="height: 20px"> <div class="determinate bot-' + user_id + '" style="width: '+
          parseFloat((current_user_stats.experience - self.levelXpArray[current_user_stats.level - 1].current_level_xp) /
          self.levelXpArray[current_user_stats.level - 1].exp_to_next_level * 100).toFixed(2) +
          '%"></div><span class="progress-text">' +
                    parseFloat((current_user_stats.experience - self.levelXpArray[current_user_stats.level - 1].current_level_xp) /
          self.levelXpArray[current_user_stats.level - 1].exp_to_next_level * 100).toFixed(2) + '%</span></div>Total Exp: ' +
          current_user_stats.experience +
          xps +
          '<br>Exp to Lvl ' +
          (parseInt(current_user_stats.level, 10) + 1) +
          ': ' +
          (current_user_stats.experience - self.levelXpArray[current_user_stats.level - 1].current_level_xp) +

		  ' / ' + self.levelXpArray[current_user_stats.level - 1].exp_to_next_level +
          '<br>Pokemon Encountered: ' +
          (current_user_stats.pokemons_encountered || 0) +
          '<br>Pokeballs Thrown: ' +
          (current_user_stats.pokeballs_thrown || 0) +
          '<br>Pokemon Caught: ' +
          (current_user_stats.pokemons_captured || 0) +
          '<br>Small Ratata Caught: ' +
          (current_user_stats.small_rattata_caught || 0) +
          '<br>Pokemon Evolved: ' +
          (current_user_stats.evolutions || 0) +
          '<br>Eggs Hatched: ' +
          (current_user_stats.eggs_hatched || 0) +
          '<br>Unique Pokedex Entries: ' +
          (current_user_stats.unique_pokedex_entries || 0) +
          '<br>PokeStops Visited: ' +
          (current_user_stats.poke_stop_visits || 0) +
          '<br>Kilometers Walked: ' +
          (parseFloat(current_user_stats.km_walked).toFixed(2) || 0) +
          '</div></div>';

        $('#subcontent').html(out);
        break;
      case 2:
        var current_user_bag_items = self.user_data[self.settings.users[user_id]].bagItems;

        $('#sortButtons').html('');

        out = '<div class="items"><div class="row">';
        var bagItemCount = 0;
        for (var i = 0; i < current_user_bag_items.length; i++) {
          bagItemCount += current_user_bag_items[i].inventory_item_data.item.count;
          out += '<div class="col s12 m6 l3 center" style="float: left"><img src="image/items/' +
            current_user_bag_items[i].inventory_item_data.item.item_id +
            '.png" class="item_img"><br><b>' +
            self.itemsArray[current_user_bag_items[i].inventory_item_data.item.item_id] +
            '</b><br>Count: ' +
            (current_user_bag_items[i].inventory_item_data.item.count || 0) +
            '</div>';
        }
        out += '</div></div>';
        var nth = 0;
        out = out.replace(/<\/div><div/g, function (match, i, original) {
          nth++;
          return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
        });
        $('#subtitle').html(bagItemCount + " item" + (bagItemCount !== 1 ? "s" : "") + " in Bag");
        $('#subcontent').html(out);
        break;
      case 3:
        var pkmnTotal = self.user_data[self.settings.users[user_id]].bagPokemon.length;
        $('#subtitle').html(pkmnTotal + " Pokemon");

        var sortButtons = '<div class="col s12 pokemon-sort" data-user-id="' + user_id + '">Sort : ';
        sortButtons += '<div class="chip"><a href="#" data-sort="cp">CP</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="iv">IV</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="name">Name</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="id">ID</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="time">Time</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="candy">Candy</a></div>';
        sortButtons += '</div>';

        $('#sortButtons').html(sortButtons);

        self.sortAndShowBagPokemon('cp', user_id);
        break;
      case 4:
        var pkmnTotal = self.user_data[self.settings.users[user_id]].pokedex.length;
        $('#subtitle').html('Pokedex ' + pkmnTotal + ' / 151');

        var sortButtons = '<div class="col s12 pokedex-sort" dat-user-id="' + user_id + '">Sort : ';
        sortButtons += '<div class="chip"><a href="#" data-sort="id">ID</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="name">Name</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="enc">Seen</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="cap">Caught</a></div>';
                sortButtons += '<div class="chip"><a href="#" data-sort="candy">Candy</a></div>';
        sortButtons += '</div>';

        $('#sortButtons').html(sortButtons);

        self.sortAndShowPokedex('id', user_id);
        break;
      default:
        break;
    }
  },
  
  buildTrainerList: function() {
    var self = this,
      users = self.settings.users;
    var out = '<div class="col s12"><ul id="bots-list" class="collapsible" data-collapsible="accordion"> \
              <li><div class="collapsible-title"><i class="material-icons">people</i>Bots</div></li>';

   for (var i = 0; i < users.length; i++) {
      var content = '<li class="bot-user">\
            <div class="collapsible-header bot-name">Attention-Pro &#3592;&#3635;&#3585;&#3633;&#3604;</div>\
                <div class="collapsible-body">\
                    <ul class="bot-items" data-user-id="{1}">\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tInfo">Info</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tItems">Items</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tPokemon">Pokemon</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tPokedex">Pokedex</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tFind">Find</a></li>\
                   </ul>\
               </div>\
           </li>';
      out += content.format(users[i], i);
    }
    out += "</ul></div>";
    $('#trainers').html(out);
    $('.collapsible').collapsible();
  },
  catchSuccess: function(data, user_index) {
    var self = mapView,
      user = self.user_data[self.settings.users[user_index]],
      poke_name = '';
    if (data !== undefined && Object.keys(data).length > 0) {
      if (user.catchables === undefined) {
        user.catchables = {};
      }
      if (data.latitude !== undefined) {
        if (user.catchables.hasOwnProperty(data.spawnpoint_id) === false) {
          poke_name = self.pokemonArray[data.pokemon_id - 1].Name;
          self.log({
            message: "&#3594;&#3639;&#3656;&#3629;&#3650;&#3611;&#3648;&#3585;&#3617;&#3656;&#3629;&#3609;&#3607;&#3637;&#3656;&#3588;&#3657;&#3609;&#3614;&#3610; " + poke_name,
            color: "green-text"
          });
          user.catchables[data.spawnpoint_id] = new google.maps.Marker({
            map: self.map,
            position: {
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            },
            icon: {
              url: 'image/pokemon/' + self.pad_with_zeroes(data.pokemon_id, 3) + '.png',
              scaledSize: new google.maps.Size(50, 50)
            },
            zIndex: 4,
            optimized: false,
            clickable: false
          });
          if (self.settings.userZoom === true) {
            self.map.setZoom(self.settings.zoom);
          }
          if (self.settings.userFollow === true) {
            self.map.panTo({
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            });
          }
        } else {
          user.catchables[data.spawnpoint_id].setPosition({
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude)
          });
          user.catchables[data.spawnpoint_id].setIcon({
            url: 'image/pokemon/' + self.pad_with_zeroes(data.pokemon_id, 3) + '.png',
            scaledSize: new google.maps.Size(70, 70)
          });
        }
      }
    } else {
      if (user.catchables !== undefined && Object.keys(user.catchables).length > 0) {
        self.log({
          message: "[" + self.settings.users[user_index] + "] " + poke_name + " has been caught or fled"
        });
        for (var key in user.catchables) {
          user.catchables[key].setMap(null);
        }
        user.catchables = undefined;
      }
    }
  },
  errorFunc: function(xhr) {
    console.error(xhr);
  },
  filter: function(arr, search) {
    var filtered = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].inventory_item_data[search] != undefined) {
        filtered.push(arr[i]);
      }
    }
    return filtered;
  },
  findBot: function(user_index) {
    var self = this,
      coords = self.pathcoords[self.settings.users[user_index]][self.pathcoords[self.settings.users[user_index]].length - 1];

    self.map.setZoom(self.settings.zoom);
    self.map.panTo({
      lat: parseFloat(coords.lat),
      lng: parseFloat(coords.lng)
    });
  },
  getCandy: function(p_num, user_id) {
    var self = this,
      user = self.user_data[self.settings.users[user_id]];

    for (var i = 0; i < user.bagCandy.length; i++) {
      var checkCandy = user.bagCandy[i].inventory_item_data.candy.family_id;
      if (self.pokemoncandyArray[p_num] === checkCandy) {
        return (user.bagCandy[i].inventory_item_data.candy.candy || 0);
      }
    }
  },
  invSuccess: function(data, user_index) {
    var self = mapView,
      userData = self.user_data[self.settings.users[user_index]],
      bagCandy = self.filter(data, 'candy'),
      bagItems = self.filter(data, 'item'),
      bagPokemon = self.filter(data, 'pokemon_data'),
      pokedex = self.filter(data, 'pokedex_entry'),
      stats = self.filter(data, 'player_stats');
    userData.bagCandy = bagCandy;
    userData.bagItems = bagItems;
    userData.bagPokemon = bagPokemon;
    userData.pokedex = pokedex;
    userData.stats = stats;
    userData.eggs = self.filter(data, 'egg_incubators');
    self.user_data[self.settings.users[user_index]] = userData;

    if (!(user_index in self.user_xps)) {
        self.user_xps[user_index] = [];
    }

    var t = (new Date()).getTime()/1000.0;
    var xp = userData.stats[0].inventory_item_data.player_stats.experience;
    self.user_xps[user_index].push({'t': t, 'xp': xp});
    while (self.user_xps[user_index].length && t-self.user_xps[user_index][0].t > 600) {
        self.user_xps[user_index].shift();
    }
  },
  pad_with_zeroes: function(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
      my_string = '0' + my_string;
    }
    return my_string;
  },
  placeTrainer: function() {
    var self = mapView;

    for (var i = 0; i < self.settings.users.length; i++) {
      loadJSON('location-' + self.settings.users[i] + '.json?'+Date.now(), self.trainerFunc, self.errorFunc, i);
    }
  },
  sortAndShowBagPokemon: function(sortOn, user_id) {
    var self = this,
      eggs = 0,
      sortedPokemon = [],
      out = '',
      user_id = user_id || 0,
      user = self.user_data[self.settings.users[user_id]];

    if (!user.bagPokemon.length) return;

    out = '<div class="items"><div class="row">';
    for (var i = 0; i < user.bagPokemon.length; i++) {
      if (user.bagPokemon[i].inventory_item_data.pokemon_data.is_egg) {
        eggs++;
        continue;
      }
    var jsChkTime = moment().subtract(1, 'days');
      var pokemonData = user.bagPokemon[i].inventory_item_data.pokemon_data,
        pkmID = pokemonData.pokemon_id,
        pkmUID = pokemonData.id,
        pkmnName = self.pokemonArray[pkmID - 1].Name,
      pkmLvl = pokemonData.level || 0,
        pkmCP = pokemonData.cp,
        pkmIVA = pokemonData.individual_attack || 0,
        pkmIVD = pokemonData.individual_defense || 0,
        pkmIVS = pokemonData.individual_stamina || 0,
        pkmHP = pokemonData.stamina || 0,
        pkmMHP = pokemonData.stamina_max || 0,
        pkmIV = ((pkmIVA + pkmIVD + pkmIVS) / 45.0).toFixed(2),
move1ID = pokemonData.move_1 || 0,
        move2ID = pokemonData.move_2 || 0,
        pkmTime = pokemonData.creation_time_ms || 0;

      sortedPokemon.push({
        "name": pkmnName,
        "id": pkmID,
        "unique_id": pkmUID,
        "lvl": pkmLvl,
        "cp": pkmCP,
        "iv": pkmIV,
        "attack": pkmIVA,
        "defense": pkmIVD,
        "stamina": pkmIVS,

        "move1": move1ID,
        "move2": move2ID,

        "health": pkmHP,
        "max_health": pkmMHP,
        "creation_time": pkmTime,
        'candy': self.getCandy(pkmID, user_id)
      });
    }
    switch (sortOn) {
      case 'name':
        sortedPokemon.sort(function(a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          if (a.cp > b.cp) return -1;
          if (a.cp < b.cp) return 1;
          return 0;
        });
        break;
      case 'id':
        sortedPokemon.sort(function(a, b) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          if (a.cp > b.cp) return -1;
          if (a.cp < b.cp) return 1;
          return 0;
        });
        break;
      case 'cp':
        sortedPokemon.sort(function(a, b) {
          if (a.cp > b.cp) return -1;
          if (a.cp < b.cp) return 1;
          return 0;
        });
        break;
      case 'iv':
        sortedPokemon.sort(function(a, b) {
          if (a.iv > b.iv) return -1;
          if (a.iv < b.iv) return 1;
          return 0;
        });
        break;
      case 'time':
        sortedPokemon.sort(function(a, b) {
          if (a.creation_time > b.creation_time) return -1;
          if (a.creation_time < b.creation_time) return 1;
          return 0;
        });
        break;
      case 'candy':
        sortedPokemon.sort(function(a, b) {
          if (a.candy > b.candy) return -1;
          if (a.candy < b.candy) return 1;
          return 0;
        });
        break;
      default:
        sortedPokemon.sort(function(a, b) {
          if (a.cp > b.cp) return -1;
          if (a.cp < b.cp) return 1;
          return 0;
        });
        break;
    }
    for (var i = 0; i < sortedPokemon.length; i++) {
      var pkmnNum = sortedPokemon[i].id,
        pkmnUnique = sortedPokemon[i].unique_id,
        pkmnImage = self.pad_with_zeroes(pkmnNum, 3) + '.png',
        pkmnName = self.pokemonArray[pkmnNum - 1].Name,
        pkmnLvl = sortedPokemon[i].lvl,
        pkmnCP = sortedPokemon[i].cp,
        pkmnIV = sortedPokemon[i].iv,
        pkmnIVA = sortedPokemon[i].attack,
        pkmnIVD = sortedPokemon[i].defense,
        pkmnIVS = sortedPokemon[i].stamina,

        move1ID = sortedPokemon[i].move1,
        move2ID = sortedPokemon[i].move2,

        pkmnHP = sortedPokemon[i].health,
        pkmnMHP = sortedPokemon[i].max_health,
        candyNum = self.getCandy(pkmnNum, user_id);

      out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' +
        pkmnImage + '" class="png_img"><br><b>' +
        pkmnName + " [ Lv." + pkmnLvl + " ]" +
        '</b><br><div class="progress pkmn-progress pkmn-' + pkmnNum + '"> <div class="determinate pkmn-' + pkmnNum + '" style="width: ' + (pkmnHP / pkmnMHP) * 100 +'%"></div> </div>'+
        '<b>HP:</b> ' + pkmnHP + ' / ' + pkmnMHP +
        '<br><b>CP:</b>' + pkmnCP +
        '<br><b>IV:</b> ' + (pkmnIV >= 0.8 ? '<span style="color: #039be5">' + pkmnIV + '</span>' : pkmnIV) +
        '<br><b>A/D/S:</b> ' + pkmnIVA + '/' + pkmnIVD + '/' + pkmnIVS +
        '<br><span class="pkmn-info-candy">' +
          '<span class="tooltipped" data-position="right" data-delay="25" data-tooltip="' + candyNum + ' Candies">' +
            '<b>' + candyNum + '</b>' +
            '<img src="image/items/Candy_new.png">' +
          '</span>' +
        '</span>' +
        (sortOn == 'time' ?
        '<span class="pkmn-info-capture-time" title="' + jsPkmTime.format("dddd, MMMM Do YYYY, h:mm:ss a") + '">' +
          jsPkmTime.fromNow() +
        '</span>' : '') +
        '<br><b>Moves1:</b><br>' + 
 self.moveList[move1ID].name + '['  + '<span style="color: #039be5">' + self.moveList[move1ID].damage +  '</span>' + ']' + 
'<br><span class="type POKEMON_TYPE_' + self.moveList[move1ID].type + ' move-tooltip" data-type="POKEMON_TYPE_' + self.moveList[move1ID].type + '">' + self.moveList[move1ID].type + '</span><br>' +
'Energy + ' + '<span style="color: #0fe503">' + self.moveList[move1ID].energy +  '</span>' + '<br><b>Moves2:</b><br>'
 + self.moveList[move2ID].name + '['  + '<span style="color: #039be5">' + self.moveList[move2ID].damage +  '</span>' + ']' + 
'<br><span class="type POKEMON_TYPE_' + self.moveList[move2ID].type + ' move-tooltip" data-type="POKEMON_TYPE_' + self.moveList[move2ID].type + '">' + self.moveList[move2ID].type + '</span><br>' +
'Energy - ' + '<span style="color: #e50303">' + self.moveList[move2ID].energy +  '</span>' 
;
 

   
    
 
      out += '</div>';
    }
    // Add number of eggs
    out += '<div class="col s12 m4 l3 center" style="float: left;"><img src="image/pokemon/Egg.png" class="png_img"><br><b>You have ' + eggs + ' egg' + (eggs !== 1 ? "s" : "") + '</div>';
    for(var b=0; b<user.eggs.length; b++) {
      var incubator = user.eggs[b].inventory_item_data.egg_incubators.egg_incubator;
      if (!incubator.item_id) {
        var incubator = user.eggs[b].inventory_item_data.egg_incubators.egg_incubator[0];
      }
      var current_user_stats = self.user_data[self.settings.users[user_id]].stats[0].inventory_item_data.player_stats;
      var totalToWalk  = incubator.target_km_walked - incubator.start_km_walked;
      var kmsLeft = incubator.target_km_walked - current_user_stats.km_walked;
      var walked = totalToWalk - kmsLeft;
      var eggString = (parseFloat(walked).toFixed(1) || 0) + "/" + (parseFloat(totalToWalk).toFixed(1) || 0) + "km";
      if (incubator.item_id == 902) {
        var img = 'EggIncubator';
      } else {
        var img = 'EggIncubatorUnlimited';
      }
      out += '<div class="col s12 m4 l3 center" style="float: left;"><img src="image/items/' + img + '.png" class="png_img"><br>';
      out += eggString;
    }
    out += '</div></div>';
    var nth = 0;
    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });
    $('#subcontent').html(out);
    $('#subcontent .tooltipped').tooltip();
  },
  sortAndShowPokedex: function(sortOn, user_id) {
    var self = this,
      out = '',
      sortedPokedex = [],
      user_id = (user_id || 0),
      user = self.user_data[self.settings.users[user_id]];

    sortedPokedex = self.pokemonArray.slice().map(pokemon => {
      pokemon.enc = 0;
      pokemon.cap = 0;
      return pokemon;
    });

    out = '<div class="items"><div class="row">';
    for (var i = 0; i < user.pokedex.length; i++) {
      var pokedex_entry = user.pokedex[i].inventory_item_data.pokedex_entry,
        pkmID = pokedex_entry.pokemon_id,
        pkmnName = self.pokemonArray[pkmID - 1].Name,
        pkmEnc = pokedex_entry.times_encountered,
        pkmCap = pokedex_entry.times_captured;

      sortedPokedex[pkmID-1].cap = pkmCap;
      sortedPokedex[pkmID-1].enc = pkmEnc;
      sortedPokedex[pkmID-1].candy = self.getCandy(pkmID, user_id);
    }
    switch (sortOn) {
      case 'id':
        sortedPokedex.sort((a, b) => {
          return a.Number - b.Number;
        });
        break;
      case 'name':
        sortedPokedex.sort((a, b) => {
          if (a.Name < b.Name) return -1;
          if (a.Name > b.Name) return 1;
          return 0;
        });
        break;
      case 'enc':
        sortedPokedex.sort((a, b) => {
          return b.enc - a.enc;
        });
        break;
      case 'cap':
        sortedPokedex.sort((a, b) => {
          return b.cap - a.cap;
        });
    }
    for (var i = 0; i < sortedPokedex.length; i++) {
      var pkmnNum = sortedPokedex[i].Number,
        pkmnImage = pkmnNum + '.png',
        pkmnName = sortedPokedex[i].Name,
        pkmnEnc = sortedPokedex[i].enc,
        pkmnCap = sortedPokedex[i].cap,
        candyNum = self.getCandy(parseInt(pkmnNum), user_id) || 0;

      out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' +
        pkmnImage +
        '" class="png_img' +
        (pkmnEnc ? '':' gray') +
        '"><br><b> ' +
        pkmnNum +
        ' ' +
        pkmnName +
        '</b><br>Times Seen: ' +
        pkmnEnc +
        '<br>Times Caught: ' +
        pkmnCap +
        '<br>Candy: ' +
        candyNum +
        '</div>';
    }
    out += '</div></div>';
    var nth = 0;
    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });
    $('#subcontent').html(out);
    $('#subcontent .tooltipped').tooltip();
  },
 showGymInfo: function(fort_json) {
    var self = mapView;
    $("#submenu").toggle();
    var fort_object = JSON.parse(fort_json)[0];
    $('#subtitle').html('GYM: ' + fort_object.gym_details.name);
    $('#sortButtons').html('');
	
    var users = fort_object.gym_details.gym_state.memberships;
    var out = '<div class="items"><center><img src="' + fort_object.gym_details.urls[0] + '" class="rounded"><br>';
    out += fort_object.gym_details.description || "No description available";
    out += '<hr>';
    out += '<div class="row">';
    for(var i = 0; i < users.length; i++) {
      var user = users[i];
      var pokemonData = user.pokemon_data,
        trainerData = user.trainer_public_profile,
        pkmID = pokemonData.pokemon_id,
        pkmnName = self.pokemonArray[pkmID - 1].Name,
        pkmCP = pokemonData.cp,
        pkmnImage = self.pad_with_zeroes(pkmID, 3) + '.png',
        pkmIVA = pokemonData.individual_attack || 0,
        pkmIVD = pokemonData.individual_defense || 0,
        pkmIVS = pokemonData.individual_stamina || 0,
        pkmHP = pokemonData.stamina || 0,
        pkmMHP = pokemonData.stamina_max || 0,
        pkmIV = ((pkmIVA + pkmIVD + pkmIVS) / 45.0).toFixed(2),
        trainerLevel = trainerData.level || 1,
        trainerName = trainerData.name;
      out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' + pkmnImage + '" class="png_img">';
      out += '<br><b>' +pkmnName +'</b><br>';
      out += '<div class="progress pkmn-progress pkmn-' + pkmID + '">';
      out += '<div class="determinate pkmn-' + pkmID + '" style="width: ' + (pkmHP / pkmMHP) * 100 + '%"></div> </div>';
      out += '<b>HP:</b> ' + pkmHP + ' / ' + pkmMHP;
      out += '<br><b>CP:</b> ' + pkmCP;
      out += '<br><b>IV:</b> ' + (pkmIV >= 0.8 ? '<span style="color: #039be5">' + pkmIV + '</span>' : pkmIV);
      out += '<br><b>A/D/S:</b> ' + pkmIVA + '/' + pkmIVD + '/' + pkmIVS;
      out += '<br><b>Trainer Name: </b>' + trainerName;
      out += '<br><b>Trainer Level: </b>' + trainerLevel + '</div>';
    }
    out += '</div></div>';
    var nth = 0;
    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });
    $('#subcontent').html(out);
  },
  updateTrainer: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      loadJSON('location-' + self.settings.users[i] + '.json', self.trainerFunc, self.errorFunc, i);
    }
  },

trainerFunc: function(data, user_index) {
    var self = mapView,
      coords = self.pathcoords[self.settings.users[user_index]][self.pathcoords[self.settings.users[user_index]].length - 1];
    for (var i = 0; i < data.cells.length; i++) {
      var cell = data.cells[i];
      if (data.cells[i].forts != undefined) {
        for (var x = 0; x < data.cells[i].forts.length; x++) {
          var fort = cell.forts[x],
	      icon = 'image/forts/img_pokestop.png',
	      fortPoints = '',
              fortTeam = '',
              fortType = 'PokeStop',
              pokemonGuard = '';
	  if (fort.type === 1) {
	    if(fort.active_fort_modifier && (fort.active_fort_modifier == 501)){
	        icon = 'image/forts/img_pokestop_lured.png';
	    }
	  } else {
	    icon = 'image/forts/' + self.teams[(fort.owned_by_team || 0)] + '.png';
            fortType = 'Gym';
            if (fort.guard_pokemon_id != undefined) {
              fortPoints = 'Points: ' + fort.gym_points;
              fortTeam = 'Team: ' + self.teams[fort.owned_by_team] + '<br>';
              pokemonGuard = 'Guard Pokemon: ' + (self.pokemonArray[fort.guard_pokemon_id - 1].Name || "None") + '<br>';
            }
	  }
          var contentString = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + fortTeam + pokemonGuard + fortPoints;
          if (!self.forts[fort.id]) {
	    self.forts[fort.id] = new google.maps.Marker({
	      map: self.map,
	      position: {
	      	lat: parseFloat(fort.latitude),
	      	lng: parseFloat(fort.longitude)
	      },
	      icon: icon
	    });
            self.info_windows[fort.id] = new google.maps.InfoWindow({
              content: contentString
            });
            google.maps.event.addListener(self.forts[fort.id], 'click', (function(marker, content, infowindow) {
              return function() {
                infowindow.setContent(content);
                infowindow.open(map, marker);
              };
            })(self.forts[fort.id], contentString, self.info_windows[fort.id]));
          } else {
            self.forts[fort.id].setIcon(icon);
            self.info_windows[fort.id].setContent(contentString);
          }
        }
      }
    }
    if (coords > 1) {
      var tempcoords = [{
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      }];
      if (tempcoords.lat != coords.lat && tempcoords.lng != coords.lng || self.pathcoords[self.settings.users[user_index]].length === 1) {
        self.pathcoords[self.settings.users[user_index]].push({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        });
      }
    } else {
      self.pathcoords[self.settings.users[user_index]].push({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
    }
    if (self.user_data[self.settings.users[user_index]].hasOwnProperty('marker') === false) {
      self.buildTrainerList();
      self.addInventory();
      self.log({
        message: "&#3650;&#3611;&#3619;&#3648;&#3585;&#3617;&#3656;&#3629;&#3609;&#3650;&#3585; &#3610;&#3629;&#3607;&#3629;&#3629;&#3609;&#3652;&#3621;&#3609;&#3660; &#3650;&#3604;&#3618; &#3609;&#3609;&#3607;&#3660;&#3626;&#3640;&#3604;&#3627;&#3621;&#3656;&#3629; &#3592;&#3619;&#3636;&#3591;&#3592;&#3619;&#3636;&#3591;&#3609;&#3632;",
        color: "blue-text"
      });
      var randomSex = Math.floor(Math.random() * 1);
      self.user_data[self.settings.users[user_index]].marker = new google.maps.Marker({
        map: self.map,
        position: {
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        },
        icon: 'image/trainer/new_a6.gif',
        zIndex: 5,
        label: self.settings.users[user_index],
        clickable: true
      });
      var contentString = '<b>Bot</b>';
      self.user_data[self.settings.users[user_index]].infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      google.maps.event.addListener(self.user_data[self.settings.users[user_index]].marker, 'click', (function(content, infowindow) {
        return function() {
          infowindow.setContent(content);
          infowindow.open(this.map, this);
        };
      })(contentString, self.user_data[self.settings.users[user_index]].infowindow));
    } else {
      self.user_data[self.settings.users[user_index]].marker.setPosition({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
      if (self.pathcoords[self.settings.users[user_index]].length === 2) {
        self.user_data[self.settings.users[user_index]].trainerPath = new google.maps.Polyline({
          map: self.map,
          path: self.pathcoords[self.settings.users[user_index]],
          geodisc: true,
          strokeColor: self.pathColors[user_index],
          strokeOpacity: self.settings.userPath ? 1.0 : 0.0,
          strokeWeight: 2
        });
      } else {
        self.user_data[self.settings.users[user_index]].trainerPath.setPath(self.pathcoords[self.settings.users[user_index]]);
      }
    }
    self.setBotPathOptions(self.settings.botPath);
    if (self.settings.users.length === 1 && self.settings.userZoom === true) {
      self.map.setZoom(self.settings.zoom);
    }
    if (self.settings.users.length === 1 && self.settings.userFollow === true) {
      self.map.panTo({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
    }
    if (!hasFocused && self.settings.users.length > 1 && self.settings.users[self.settings.users[user_index]].focus) {
      self.map.setZoom(self.settings.zoom);
      self.map.panTo({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
      hasFocused = true;
    }
  },
  addPathMarker: function() {
    var self = mapView,
      i = Object.keys(self.customPaths).length;

    self.customPaths[i] = {};

    self.customPaths[i].marker = new google.maps.Marker({
      position: self.map.getCenter(),
      map: self.map,
      draggable: true,
      clickable: true,
      title: 'Path #' + i
    });

    var mapCenter = self.map.getCenter(),
      contentString = '<b>Path #{0}</b><br><b>Latitude:</b> {1}<br><b>Longitude:</b> {2}';

    self.customPaths[i].infowindow = new google.maps.InfoWindow({ content: contentString.format(i, mapCenter.lat(), mapCenter.lng()) });

    google.maps.event.addListener(self.customPaths[i].marker, 'click', (function(infowindow) {
      return function() { infowindow.open(this.map, this); };
    })(self.customPaths[i].infowindow));

    google.maps.event.addListener(self.customPaths[i].marker, 'drag', (function(content, infowindow) {
      return function() { infowindow.setContent(contentString.format(i, this.getPosition().lat(), this.getPosition().lng())); self.updatePathLine(); };
    })(contentString, self.customPaths[i].infowindow));

    google.maps.event.addListener(self.customPaths[i].marker, 'dragend', (function(content, infowindow) {
      return function() { infowindow.setContent(contentString.format(i, this.getPosition().lat(), this.getPosition().lng())); self.updatePathLine(); }
    })(contentString, self.customPaths[i].infowindow));

    $('#path_delete').removeClass('disabled');
    $('#paths_download').removeClass('disabled');
    $('#paths_clear').removeClass('disabled');

    self.updatePathLine();
  },
  deletePathMarker: function() {
    var self = mapView,
      i = Object.keys(self.customPaths).length;

    if (!i || !self.customPaths[i-1]) { return; } // if customPaths array is empty or previous path doesn't exist

    self.customPaths[i-1].marker.setMap(null);
    self.customPaths[i-1].infowindow.setMap(null);
    delete self.customPaths[i-1];

    if (!Object.keys(self.customPaths).length) {
      $('#path_delete').addClass('disabled');
      $('#paths_download').addClass('disabled');
      $('#paths_clear').addClass('disabled');
    }

    self.updatePathLine();
  },
  updatePathLine: function() {
    var self = mapView;
	for (var i = 0; i < self.settings.users.length; i++) {
      loadJSON('location-' + self.settings.users[i] + '.json?'+Date.now(), self.trainerFunc, self.errorFunc, i);
    }
  
    if (!Object.keys(self.customPaths).length) { // if customPaths array is empty
      self.customPathsLine.setMap(null);
      self.customPathsLine = 0;
      return;
    }

    var ps = [];//, tpos;
    for (var p in self.customPaths) {
      //tpos = self.customPaths[p].marker.getPosition();
      //ps.push({ lat: tpos.lat(), lng: tpos.lng() });
      ps.push(self.customPaths[p].marker.getPosition());
    }

    if (!self.customPathsLine) {
      self.customPathsLine = new google.maps.Polyline({
        path: ps,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
    }

    self.customPathsLine.setOptions({path: ps});
    self.customPathsLine.setMap(self.map);
  },
  generatePathFile: function() {
    var self = mapView,
      i = Object.keys(self.customPaths).length;

    if (!i) { return; } // if customPaths array is empty

    var fileContent = '[';
    for (var p in self.customPaths) {
      fileContent += '\n\t{"location": "' + self.customPaths[p].marker.getPosition().lat() + ', ' + self.customPaths[p].marker.getPosition().lng() + '"}';
      if (p < (i - 1)) { fileContent += ','; }
    }
    fileContent += '\n]';

    var download = $('<a>');
    download.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
    download.attr('download', 'path.json');
    download.css('display', 'none');
    $('body').append(download);
    download[0].click();
    download.remove();
  },
  clearPathMarkers: function() {
    var self = mapView;

    if (!Object.keys(self.customPaths).length) { return; } // if customPaths array is empty

    for (var p in self.customPaths) {
      self.customPaths[p].marker.setMap(null);
      self.customPaths[p].infowindow.setMap(null);
    }

    self.customPaths = {};

    $('#path_delete').addClass('disabled');
    $('#paths_download').addClass('disabled');
    $('#paths_clear').addClass('disabled');

    self.updatePathLine();
  },
  bindPathMenu: function() {
    var self = this;

    $('#path_add').click(self.addPathMarker);
    $('#path_delete').click(self.deletePathMarker);
    $('#paths_download').click(self.generatePathFile);
    $('#paths_clear').click(self.clearPathMarkers);
  },
  
   // Adds events to log panel and if it's closed sends Toast
  log: function(log_object) {
    var currentDate = new Date();
    var time = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + (currentDate.getMinutes())).slice(-2);
    $("#logs-panel .card-content").prepend("<div class='log-item'>\
  <span class='log-date'>" + time + "</span><p class='" + log_object.color + "'>" + log_object.message + "</p></div>");
    if (!$('#logs-panel').is(":visible")) {
      Materialize.toast(log_object.message, 8000);
    }
  },
  getGymLevel : function(gymPoints) {
		var self = mapView;
		var level = 1;
		for (var myLevel in self.minimumPointsForLevel) {
			var minimumPoints = self.minimumPointsForLevel[myLevel];
			if (minimumPoints < gymPoints) {
				var level = myLevel;
			}
		}
		return level;
	},
  createID : function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }


};
    
       
 



if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}
