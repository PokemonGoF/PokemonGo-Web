'use strict';

var socket_io = [];

var events = {
  api_error:                         'red',
  badges:                            'blue',
  bot_exit:                          'red',
  bot_start:                         'green',
  buddy_candy_earned:                'green',
  buddy_candy_fail:                  'red',
  buddy_keep_active:                 'red',
  buddy_next_reward:                 'yellow',
  buddy_not_available:               'red',
  buddy_pokemon:                     'magenta',
  buddy_update:                      'blue',
  buddy_update_fail:                 'red',
  buddy_reward:                      'green',
  buddy_walked:                      'yellow',
  catch_limit:                       'red',
  catch_log:                         'magenta',
  config_error:                      'red',
  egg_already_incubating:            'yellow',
  egg_hatched:                       'green',
  evolve_log:                        'magenta',
  future_pokemon_release:            'yellow',
  incubate:                          'green',
  incubator_already_used:            'yellow',
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
  incubate_try:                      'white',
  load_cached_location:              'white',
  location_found:                    'white',
  login_started:                     'white',
  lured_pokemon_found:               'white',
  move_to_map_pokemon_move_towards:  'white',
  move_to_map_pokemon_teleport_to:   'white',
  move_to_map_pokemon_teleport_back: 'white',
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

var moveTypes = {
  normal:                            '#A8A878',
  fire:                              '#F08030',
  water:                             '#6890F0',
  grass:                             '#78C850',
  poison:                            '#A040A0',
  electric:                          '#F8D030',
  ground:                            '#E0C068',
  psychic:                           '#F85888',
  rock:                              '#B8A038',
  ice:                               '#98D8D8',
  bug:                               '#A8B820',
  dragon:                            '#7038F8',
  ghost:                             '#705898',
  steel:                             '#B8B8D0',
  fairy:                             '#EE99AC',
  dark:                              '#705848',
  flying:                            '#A890F0',
  fighting:                          '#C02038'
}

$(document).ready(function() {
  mapView.initSettings();
  var retry_id;
  for (var i = 0; i < mapView.settings.users.length; i++) {
    if (mapView.settings.users[i].enable && mapView.settings.users[i].enableSocket) {
      retry_id = i;
      mapView.initSockets(i);
    }
  }

  mapView.init();
});

var mapView = {
  map: [],
  user_index: 0,
  currentUserId: 0,
  emptyDex: [],
  forts: [],
  info_windows: [],
  numTrainers: [
    177,
    109
  ],
  teams: [
    'TeamLess',
    'Mystic',
    'Valor',
    'Instinct'
  ],
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
  badgesArray: {},
  levelXpArray: {},
  stats: {},
  user_data: {},
  user_xps: {},
  pathcoords: {},
  settings: {},
  logCount: 0,
  init: function() {
    var self = this;
    //self.settings = $.extend(true, self.settings, userInfo);
    self.bindUi();

    $.getScript('https://maps.googleapis.com/maps/api/js?key={0}&libraries=drawing'.format(self.settings.gMapsAPIKey), function() {
        self.log({
          message: 'Loading Data..'
        });

        loadJSON('data/pokemondata.json?'+Date.now(), function(data, successData) {
          self.pokemonArray = data;
        }, self.errorFunc, 'pokemonData');
        loadJSON('data/pokemoncandy.json?'+Date.now(), function(data, successData) {
          self.pokemoncandyArray = data;
        }, self.errorFunc, 'pokemonCandy');
        loadJSON('data/badges.json?'+Date.now(), function(data, successData) {
          self.badgesArray = data;
        }, self.errorFunc, 'badges');
        loadJSON('data/levelXp.json?'+Date.now(), function(data, successData) {
          self.levelXpArray = data;
        }, self.errorFunc, 'levelXp');
        loadJSON('data/moves.json?'+Date.now(), function(data, successData) {
          self.moveList = {};
          data.map(function(move) {
            self.moveList[move.id] = move;
          });
        }, self.errorFunc, 'moveList');
        loadJSON('data/items.json?'+Date.now(), function(data, successData) {
          self.itemsArray = data;
        }, self.errorFunc, 'itemsArray');

        for (var i = 0; i < self.settings.users.length; i++) {
          if (self.settings.users[i].enable) {
            var user = self.settings.users[i].username;
            self.user_data[user] = {};
            self.pathcoords[user] = [];
          }
        }

        self.initMap();
        self.map.setZoom(self.settings.zoom);
        self.log({
          message: 'Data Loaded!'
        });
  });
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
        if (self.settings.users[i].enable) {
          self.user_data[self.settings.users[i].username].trainerPath.setOptions({
            strokeOpacity: this.checked ? 1.0 : 0.0
          });
        }
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
    var submenuIndex = 0;
    $('body').on('click', ".bot-user .bot-items .btn:not(.tFind)", function() {
      var itemIndex = $(this).parent().parent().find('.btn').index($(this)) + 1,
      userId = $(this).closest('ul').data('user-id');
      if ($('#submenu').is(':visible') && itemIndex == submenuIndex && self.currentUserId == userId) {
        $('#submenu').toggle();
      } else {
        submenuIndex = itemIndex;
        self.currentUserId = userId;
        self.buildMenu(userId, itemIndex);
      }
    });

    $('body').on('click', '#close', function() {
      $('#submenu').toggle();
    });

    $('body').on('click', '#close-logs', function() {
      $('#logs-panel').toggle();
    });

    $('body').on('click', '.tFind', function() {
      self.findBot($(this).closest('ul').data('user-id'));
    });

    // Binding sorts
    $('body').on('click', '.item-sort a', function() {
      var item = $(this);
      var userId = item.parent().data('user-id');
      $(item).addClass('selected bot-' + userId);
      $(item).siblings().removeClass('selected bot-' + userId);
      self.sortAndShowBagItems(userId);
    });
    $('body').on('click', '.item-filter a', function() {
      var item = $(this);
      var userId = item.parent().data('user-id');
      $(item).toggleClass('selected bot-' + userId);
      $(item).siblings().removeClass('selected bot-' + userId);
      self.sortAndShowBagItems(userId);
    });
    $('body').on('click', '.pokemon-sort a', function() {
      var item = $(this);
      var userId = item.parent().data('user-id');
      $(item).addClass('selected bot-' + userId);
      $(item).siblings().removeClass('selected bot-' + userId);
      self.sortAndShowBagPokemon(userId);
    });
    $('body').on('click', '.pokedex-sort a', function() {
      var item = $(this);
      var userId = item.parent().data('user-id');
      $(item).addClass('selected bot-' + userId);
      $(item).siblings().removeClass('selected bot-' + userId);
      self.sortAndShowPokedex(userId);
    });
    $('body').on('click', '.pokedex-filter a', function() {
      var item = $(this);
      var userId = item.parent().data('user-id');
      $(item).toggleClass('selected bot-' + userId);
      $(item).siblings().removeClass('selected bot-' + userId);
      self.sortAndShowPokedex(userId);
    });

    // Binding toggle for socket connections
    $('body').on('click', '.toggle-connection', function() {
      var item = $(this),
      user_index = item.val();

      self.settings.users[user_index].enableSocket = item.is(':checked');

      if (self.settings.users[user_index].enableSocket) {
        if (typeof socket_io[user_index] === 'undefined') {
          self.initSockets(user_index);
        } else {
          socket_io[user_index].connect();
        }
      } else {
        if (typeof socket_io[user_index] !== 'undefined') {
          socket_io[user_index].disconnect();
        }
      }
    });
  },
  initMap: function() {
    var self = this;
    self.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 50.0830986,
        lng: 6.7613762
      },
      zoom: 8
    });
    self.placeTrainer();
    self.addCatchable();
    setInterval(self.updateTrainer, 1000);
    setInterval(self.addCatchable, 1000);
    setInterval(self.addInventory, 5000);
  },
  initSettings: function() {
    var self = mapView;
    self.settings = $.extend(true, self.settings, userInfo);
  },
  initSockets: function(user_index) {
    var self = mapView,
    retry_time = 30,
    prevMsg = '',
    timeOut = 5000,
    bgColor = '',
    logThis = /(egg_hatched|pokemon_appeared|pokemon_caught|pokemon_fled|pokemon_vanished|vip_pokemon|level_up|bot_sleep|show_best_pokemon|show_inventory|no_pokeballs|bot_sleep|bot_random_pause|api_error|pokemon_release|future_pokemon_release|bot_random_alive_pause|next_egg_incubates|spun_pokestop|path_lap_end|gained_candy|used_lucky_egg|lured_pokemon_found|softban|pokemon_inventory_full|inventory_full|buddy_next_reward|buddy_candy_earned|buddy_pokemon|buddy_update|buddy_reward|buddy_walked)/;

    socket_io[user_index] = io.connect(self.settings.users[user_index].socketAddress, {
      'reconnectionAttempts': 5
    });

    socket_io[user_index].on('connect', function(event) {
      var thisSocket = this;
      self.log({
        message: "<span style='color: green;'><b>Connected to '" + thisSocket.io.uri + "'...</b></span>",
        timeout: 3000
      });
    });

    socket_io[user_index].on('disconnect', function(event) {
      var thisSocket = this;
      self.log({
        message: "<span style='color: red;'><b>Disconnected from '" + thisSocket.io.uri + "'... Trying to reconnect, please wait...</b></span>",
        timeout: 3000
      });
    });

    socket_io[user_index].on('reconnect_failed', function(event) {
      var thisSocket = this;
      self.log({
        message: "<span style='color: red;'><b>Connecting to '" + thisSocket.io.uri + "' failed. Retrying after " + retry_time + " seconds.</b></span>",
        timeout: 3000
      });
      setTimeout(function() {
        self.reconnectSocket(thisSocket);
      }, retry_time * 1000);
    });

    for (var k in events){
      if (events.hasOwnProperty(k)) {
        //let renk = events[k];
        if (typeof socket_io[user_index] !== 'undefined') {
          socket_io[user_index].on(k+':'+self.settings.users[user_index].username, function (data) {
            //console.log(data);
            if (data['event'] == 'log_stats') {
              $("div.bot-name").find("[data-bot-id='" + data['account'] + "']").text(data['data']['stats_raw']['username'])
            }
            if(data['data']['msg'] != null && data['data']['msg'] !== prevMsg){
              var renk = events[data['event']];
              if (logThis.test(data['event'])) {
                if (data['event'] == 'vip_pokemon') {
                  timeOut = 8000;
                }

                bgColor = (/(yellow|cyan|white)/.test(renk)) ? '#323232' : '#dedede';
                var thisBot = $("div.bot-name").find("[data-bot-id='" + data['account'] + "']").html();
                self.log({
                  message: "<span style='color: " + renk + "'>[ <b>" + thisBot + "</b> ] " + data['data']['msg'] + "</span>",
                  timeout: timeOut,
                  bgcolor: bgColor
                });
              }
              //Materialize.toast("<span style='color: " + renk + "'>" + data['data']['msg'] + "</span>", 8000);
              prevMsg = data['data']['msg'];
            }
          });
        }
      }
    }
  },
  addCatchable: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      if (self.settings.users[i].enable) {
        loadJSON('catchable-' + self.settings.users[i].username + '.json?'+Date.now(), self.catchSuccess, self.errorFunc, i);
      }
    }
  },
  addInventory: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      if (self.settings.users[i].enable) {
        loadJSON('inventory-' + self.settings.users[i].username + '.json?'+Date.now(), self.invSuccess, self.errorFunc, i);
      }
    }
  },
  buildMenu: function(user_id, menu) {
    var self = this,
    out = '';
    $("#submenu").show();
    switch (menu) {
      case 1:
        var current_user_stats = self.user_data[self.settings.users[user_id].username].stats[0].inventory_item_data.player_stats;
        $('#subtitle').html($("div.bot-name").find("[data-bot-id='" + self.settings.users[user_id].username + "']").html());
        $('#sortButtons').html('');
        $('#filterButtons').html('');

        var xps = '';
        if ((user_id in self.user_xps) && self.user_xps[user_id].length) {
          var xp_first = self.user_xps[user_id][0];
          var xp_last = self.user_xps[user_id][self.user_xps[user_id].length-1];
          var d_xp = xp_last.xp - xp_first.xp;
          var d_t = xp_last.t - xp_first.t;
          xps = 'XP/H: ' + (Math.round(360000 * d_xp / d_t) / 100 || 0) + ' (earned ' + d_xp + ' XP in last ' + Math.round(d_t) + ' s)';
        }

        out += '<div class="trainerinfo col s12">' +
          'Level: ' + current_user_stats.level + '<br>' +
          'Exp to Lvl ' + (parseInt(current_user_stats.level, 10) + 1) + ': ' +
          (current_user_stats.experience - self.levelXpArray[current_user_stats.level - 1].current_level_xp) +
          ' / ' + self.levelXpArray[current_user_stats.level - 1].exp_to_next_level + '<br>' +
          'Total Exp: ' + current_user_stats.experience + '<br>' +
          xps + '<br>' +
          '<div class="progress botbar-' + user_id + '" style="height: 10px"> <div class="determinate bot-' + user_id + '" style="width: '+
          ((current_user_stats.experience - self.levelXpArray[current_user_stats.level - 1].current_level_xp) /
           self.levelXpArray[current_user_stats.level - 1].exp_to_next_level) * 100 +
          '%"></div>';

        for (var i = 0; i < self.badgesArray.length; i++) {
            if (self.badgesArray[i]['disabled'] == 'true'){
                continue;
            }

            var playerstat = self.badgesArray[i]['Playerstat'];
            var current_value = 0;
            if (playerstat == 'pokemon_caught_by_type' && typeof current_user_stats[playerstat] !== 'undefined'){
                current_value = current_user_stats[playerstat][self.badgesArray[i]['Pokemontype']];
            } else if (playerstat == 'pikachu_caught') {
                var pikachu_entry = self.user_data[self.settings.users[user_id].username].pokedex.filter(function ( obj ) {
                    return obj.inventory_item_data.pokedex_entry.pokemon_id === 25;
                });
                if (pikachu_entry.length === 1){
                    current_value = pikachu_entry[0].inventory_item_data.pokedex_entry.times_captured;
                }
            } else {
                current_value = current_user_stats[playerstat];
            }
            current_value = +(parseFloat((typeof current_value === 'undefined') ? 0 : current_value).toFixed(2))

            var thresholds = self.badgesArray[i]['Thresholds'];
            var current_goal = 0;
            for (var j = 0; j < thresholds.length; j++) {
                current_goal = j;
                if(current_value < thresholds[j]){
                    break;
                }
            }
            out += '<div class="badge col s12 m6 l3 center">' +
              '<img src="image/trainer/b' + (current_value >= thresholds[2] ? 3 : current_goal) + '.png" class="item_img"><br>' +
              '<b>' + self.badgesArray[i]['Name'] + '</b><br>' +
              self.badgesArray[i]['Description'] + '<br>' +
              current_value + ' / ' + thresholds[current_goal] + '</div>';
        }

        var nth = 0;
        out = out.replace(/<\/div><div/g, function (match, i, original) {
        return (nth++ % 4 === 0) ? '</div></div><div class="row"><div' : match;
        });

        $('#subcontent').html(out);
        break;
      case 2:
        var sortButtons = '<div class="item-sort chips" data-user-id="' + user_id + '">Sort: ';
        sortButtons += '<a class="chip selected bot-' + user_id + '" href="#" data-sort="item_id">Type</a>';
        sortButtons += '<a class="chip" href="#" data-sort="name">Name</a>';
        sortButtons += '</div>';
        $('#sortButtons').html(sortButtons);

        var filterButtons = '<div class="item-filter chips" data-user-id="' + user_id + '">Toggle: ';
        filterButtons += '<a class="chip selected bot-' + user_id + '" href="#" data-filter="possession">Possession</a>';
        filterButtons += '</div>';
        $('#filterButtons').html(filterButtons);
        
        self.sortAndShowBagItems(user_id);
        break;
      case 3:
        var pkmnTotal = self.user_data[self.settings.users[user_id].username].bagPokemon.length;
        $('#subtitle').html(pkmnTotal + " Pokemon");

        var sortButtons = '<div class="col s12 pokemon-sort chips" data-user-id="' + user_id + '">Sort : ';
        sortButtons += '<a class="chip selected bot-' + user_id + '" href="#" data-sort="cp">CP</a>';
        sortButtons += '<a class="chip" href="#" data-sort="iv">IV</a>';
        sortButtons += '<a class="chip" href="#" data-sort="name">Name</a>';
        sortButtons += '<a class="chip" href="#" data-sort="id">ID</a>';
        sortButtons += '<a class="chip" href="#" data-sort="candy">Candy</a>';
        sortButtons += '<a class="chip" href="#" data-sort="time">Time</a>';
        sortButtons += '<a class="chip" href="#" data-sort="lvl">Level</a>';
        sortButtons += '</div>';
        $('#sortButtons').html(sortButtons);
        
        $('#filterButtons').html('');

        self.sortAndShowBagPokemon(user_id);
        break;
      case 4:
        var pkmnTotal = self.user_data[self.settings.users[user_id].username].pokedex.length;
        $('#subtitle').html('Pokedex ' + pkmnTotal + ' / 151');

        var sortButtons = '<div class="pokedex-sort chips" data-user-id="' + user_id + '">Sort: ';
        sortButtons += '<a class="chip selected bot-' + user_id + '" href="#" data-sort="id">ID</a>';
        sortButtons += '<a class="chip" href="#" data-sort="name">Name</a>';
        sortButtons += '<a class="chip" href="#" data-sort="enc">Seen</a>';
        sortButtons += '<a class="chip" href="#" data-sort="cap">Caught</a>';
        sortButtons += '</div>';
        $('#sortButtons').html(sortButtons);

        var filterButtons = '<div class="pokedex-filter chips" data-user-id="' + user_id + '">Filter: ';
        filterButtons += '<a class="chip" href="#" data-filter="seen">Seen</a>';
        filterButtons += '<a class="chip" href="#" data-filter="unseen">Unseen</a>';
        filterButtons += '<a class="chip" href="#" data-filter="caught">Caught</a>';
        filterButtons += '<a class="chip" href="#" data-filter="uncaught">Uncaught</a>';
        filterButtons += '</div>';
        $('#filterButtons').html(filterButtons);

        self.sortAndShowPokedex(user_id);
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
      if (users[i].enable) {
        var socketEnabled = (users[i].enableSocket) ? ' checked' : '';
        var content = '<li class="bot-user">\
                      <div class="collapsible-header bot-name">\
                      <span class="right tooltipped" data-position="bottom" data-tooltip="Enable/disable web socket connection">\
                      <input class="toggle-connection" type="checkbox" id="check_{1}" value="{1}"' + socketEnabled + ' />\
                      <label for="check_{1}" style="padding-left: 15px; margin-left: 5px;">&nbsp</label></span>\
                      <span data-bot-id="{0}">{0}</span></div>\
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
        out += content.format(users[i].username, i);
      }
    }
    out += "</ul></div>";
    $('#trainers').html(out);
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip({delay: 50, html: true});
  },
  catchSuccess: function(data, user_index) {
    var self = mapView,
    user = self.user_data[self.settings.users[user_index].username],
    poke_name = '';
    if (data !== undefined && Object.keys(data).length > 0) {
      if (user.catchables === undefined) {
        user.catchables = {};
      }
      if (data.latitude !== undefined) {
        if (user.catchables.hasOwnProperty(data.spawnpoint_id) === false) {
          //poke_name = self.pokemonArray[data.pokemon_id - 1].Name;
          //self.log({
          //  message: "[" + self.settings.users[user_index].username + "] " + poke_name + " appeared",
          //  color: "green"
          //});
          user.catchables[data.spawnpoint_id] = new google.maps.Marker({
            map: self.map,
            position: {
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude)
            },
            icon: {
              url: 'image/pokemon/' + self.pad_with_zeroes(data.pokemon_id, 3) + '.png',
              scaledSize: new google.maps.Size(70, 70)
            },
            zIndex: 4,
            optimized: false,
            clickable: false
          });
          if (self.settings.userZoom === true) {
            self.map.setZoom(self.settings.zoom);
          }
          if (self.settings.userFollow === true) {
            if (self.currentUserId == user_index) {
              self.map.panTo({
                lat: parseFloat(data.latitude),
                lng: parseFloat(data.longitude)
              });
            }
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
        //self.log({
        //  message: "[" + self.settings.users[user_index].username + "] " + poke_name + " has been caught or fled"
        //});
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
      if (search === 'pokemon'){
        if (!arr[i].inventory_item_data.pokemon_data.is_egg) {
          filtered.push(arr[i]);
        }
      } else {
        if (arr[i].inventory_item_data[search] != undefined) {
          filtered.push(arr[i]);
        }
      }
    }
    return filtered;
  },
  findBot: function(user_index) {
    var self = this,
    coords = self.pathcoords[self.settings.users[user_index].username][self.pathcoords[self.settings.users[user_index].username].length - 1];
    self.currentUserId = user_index;

    self.map.setZoom(self.settings.zoom);
    self.map.panTo({
      lat: parseFloat(coords.lat),
      lng: parseFloat(coords.lng)
    });
  },
  getCandy: function(p_num, user_id) {
    var self = this,
    user = self.user_data[self.settings.users[user_id].username];

    for (var i = 0; i < user.bagCandy.length; i++) {
      var checkCandy = user.bagCandy[i].inventory_item_data.candy.family_id;
      if (self.pokemoncandyArray[p_num] === checkCandy) {
        return (user.bagCandy[i].inventory_item_data.candy.candy || 0);
      }
    }
  },
  getType: function(p_type) {
    var returnType = '';
    if (typeof p_type !== 'undefined') {
      returnType = '<span class=\'move-type\' style=\'background-color:' + moveTypes[p_type.toLowerCase()] + ';\'>' + p_type + '</span>';
    }
    return returnType;
  },
  invSuccess: function(data, user_index) {
    var self = mapView,
    userData = self.user_data[self.settings.users[user_index].username],
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
    self.user_data[self.settings.users[user_index].username] = userData;

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
      if (self.settings.users[i].enable) {
      	loadJSON('location-' + self.settings.users[i].username + '.json?'+Date.now(), self.trainerFunc, self.errorFunc, i);
      }
    }
  },
  sortAndShowBagItems: function(user_id) {
    var self = this,
    current_user_bag_items = self.user_data[self.settings.users[user_id].username].bagItems;
        
    for (var i = 0; i < current_user_bag_items.length; i++) {
        var item_id = current_user_bag_items[i].inventory_item_data.item.item_id;
        var item = $.grep(self.itemsArray, function(e){ return e.id == item_id; })[0];
        current_user_bag_items[i].inventory_item_data.item.name = item.name;
        current_user_bag_items[i].inventory_item_data.item.category = item.category;
    }
    
    var sortBy = $(".item-sort a.selected").data("sort");
    current_user_bag_items.sort(function (a, b){
        var aSortBy = a.inventory_item_data.item[sortBy];
        var bSortBy = b.inventory_item_data.item[sortBy];
        return ((aSortBy < bSortBy) ? -1 : ((aSortBy > bSortBy) ? 1 : 0));
    });

    var out = '<div class="items"><div class="row">';
    var bagItemCount = 0;
    for (var i = 0; i < current_user_bag_items.length; i++) {
      var item = current_user_bag_items[i].inventory_item_data.item;
      if ($(".item-filter a.selected").data("filter") === 'possession' && item.count === 0){
          continue;
      }
      bagItemCount += item.count;
      out += '<div class="col s12 m6 l3 center"><img src="image/items/' +
        item.item_id +
        '.png" class="item_img"><br><b>' +
        item.name +
        '</b><br>Count: ' +
        (item.count || 0) +
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
  },
  sortAndShowBagPokemon: function(user_id) {
    var self = this,
    eggs = 0,
    eggs10 = 0,
    eggs5 = 0,
    eggs2 = 0,
    sortedPokemon = [],
    out = '',
    user = self.user_data[self.settings.users[user_id].username],
    user_id = user_id || 0;

    if (!user.bagPokemon.length) return;

    out = '<div class="items"><div class="row">';
    for (var i = 0; i < user.bagPokemon.length; i++) {
      if (user.bagPokemon[i].inventory_item_data.pokemon_data.is_egg) {
        if (user.bagPokemon[i].inventory_item_data.pokemon_data.egg_km_walked_target == 10) {
          eggs10++;
        } else if (user.bagPokemon[i].inventory_item_data.pokemon_data.egg_km_walked_target == 5) {
          eggs5++;
        } else {
          eggs2++;
        }
        eggs++;
        continue;
      }
      var pokemonData = user.bagPokemon[i].inventory_item_data.pokemon_data,
      pkmID = pokemonData.pokemon_id,
      pkmnName = self.pokemonArray[pkmID - 1].Name,
      pkmLvl = pokemonData.level || 0,
      pkmCP = pokemonData.cp,
      pkmIVA = pokemonData.individual_attack || 0,
      pkmIVD = pokemonData.individual_defense || 0,
      pkmIVS = pokemonData.individual_stamina || 0,
      pkmIV = ((pkmIVA + pkmIVD + pkmIVS) / 45.0).toFixed(2),
      move1ID = pokemonData.move_1 || 0,
      move2ID = pokemonData.move_2 || 0,
      pkmTime = pokemonData.creation_time_ms || 0,
      pkmUID = pokemonData.id,
      pkmHP = pokemonData.stamina || 0,
      pkmMHP = pokemonData.stamina_max || 0,
      pkmCPMultiplier = pokemonData.cp_multiplier,
      pkmFavorite = pokemonData.favorite || 0;

      var pkmDateCaptured = new Date(pokemonData.creation_time_ms);
      var pkmTypeI = self.pokemonArray[pkmID - 1].TypeI[0],
      pkmTypeII = '';
      if (typeof self.pokemonArray[pkmID - 1].TypeII !== 'undefined') {
        pkmTypeII = self.pokemonArray[pkmID - 1].TypeII[0];
      }
      var pkmWeakness = self.pokemonArray[pkmID - 1].Weaknesses,
      pkmBaseAttack = self.pokemonArray[pkmID - 1].BaseAttack,
      pkmBaseDefense = self.pokemonArray[pkmID - 1].BaseDefense,
      pkmBaseStamina = self.pokemonArray[pkmID - 1].BaseStamina;

      var worst_cp = self.calc_cp(pkmBaseAttack, pkmBaseDefense, pkmBaseStamina, 0, 0, 0, pkmCPMultiplier),
      perfect_cp = self.calc_cp(pkmBaseAttack, pkmBaseDefense, pkmBaseStamina, 15, 15, 15, pkmCPMultiplier),
      current_cp = self.calc_cp(pkmBaseAttack, pkmBaseDefense, pkmBaseStamina, pkmIVA, pkmIVD, pkmIVS, pkmCPMultiplier),
      pkmIVCP = ((current_cp - worst_cp) / (perfect_cp - worst_cp)).toFixed(2);

      sortedPokemon.push({
        "name": pkmnName,
        "id": pkmID,
        "unique_id": pkmUID,
        "lvl": pkmLvl,
        "cp": pkmCP,
        "iv": pkmIV,
        "ivcp": pkmIVCP,
        "attack": pkmIVA,
        "defense": pkmIVD,
        "stamina": pkmIVS,
        "health": pkmHP,
        "max_health": pkmMHP,
        "creation_time": pkmTime,
        'candy': self.getCandy(pkmID, user_id),
        "move1": move1ID,
        "move2": move2ID,
        "type1": pkmTypeI,
        "type2": pkmTypeII,
        "weakness": pkmWeakness,
        "favorite": pkmFavorite,
        "date_captured": pkmDateCaptured.customFormat( "#MM#/#DD#/#YYYY#" )
      });
    }
    switch ($(".pokemon-sort a.selected").data("sort")) {
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
      case 'candy':
        sortedPokemon.sort(function(a, b) {
          if (a.candy > b.candy) return -1;
          if (a.candy < b.candy) return 1;
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
      case 'lvl':
        sortedPokemon.sort(function(a, b) {
          if (a.lvl > b.lvl) return -1;
          if (a.lvl < b.lvl) return 1;
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
        pkmnImage = self.pad_with_zeroes(pkmnNum, 3) + '.png',
        pkmnName = self.pokemonArray[pkmnNum - 1].Name,
        pkmnLvl = sortedPokemon[i].lvl,
        pkmnCP = sortedPokemon[i].cp,
        pkmnIV = sortedPokemon[i].iv,
        pkmnIVA = sortedPokemon[i].attack,
        pkmnIVD = sortedPokemon[i].defense,
        pkmnIVS = sortedPokemon[i].stamina,
        pkmnHP = sortedPokemon[i].health,
        pkmnMHP = sortedPokemon[i].max_health,
        move1ID = sortedPokemon[i].move1,
        move2ID = sortedPokemon[i].move2,
        pkmnUnique = sortedPokemon[i].unique_id,
        pkmnTypeI = sortedPokemon[i].type1,
        pkmnTypeII = sortedPokemon[i].type2,
        pkmnWeakness = sortedPokemon[i].weakness,
        candyNum = self.getCandy(pkmnNum, user_id),
        pkmnDateCaptured = sortedPokemon[i].date_captured;

      var outWeakness = '<b>Weaknesses:</b><br>',
        newLine = '';
      for (var x = 0; x < pkmnWeakness.length; x++) {
        outWeakness += self.getType(pkmnWeakness[x]) + newLine;
      }

      out += '<div class="col s12 m6 l3 center" data-uniqueid="'+pkmnUnique+'" style="position: relative;">';
      if (sortedPokemon[i].favorite) {
        out += '<span class="favorite"><img src="image/trainer/favorite.png"></span>';
      }
      out += '<img src="image/pokemon/' + pkmnImage + '" class="png_img"></br>' +
        '<span style="cursor: pointer;" class="tooltipped" data-html="true" data-tooltip="' + outWeakness + '"><b>' +
        pkmnName + ' [ Lv.' + pkmnLvl + ' ]</b></span>' +
        '<br>' + self.getType(pkmnTypeI);
        if (pkmnTypeII != '') {
          out += self.getType(pkmnTypeII);
        }

      var move1STAB = '';
      var move2STAB = '';
      var move1DPSwSTAB = '';
      var move2DPSwSTAB = '';
      if (self.moveList[move1ID].type.toLowerCase() == pkmnTypeI.toLowerCase() || self.moveList[move1ID].type.toLowerCase() == pkmnTypeII.toLowerCase()) {
        move1STAB = (self.moveList[move1ID].damage * 1.25);
        move1DPSwSTAB = parseFloat(move1STAB / parseFloat(self.moveList[move1ID].duration / 1000).toFixed(2)).toFixed(2);
      }
      if (self.moveList[move2ID].type.toLowerCase() == pkmnTypeI.toLowerCase() || self.moveList[move2ID].type.toLowerCase() == pkmnTypeII.toLowerCase()) {
        move2STAB = (self.moveList[move2ID].damage * 1.25);
        move2DPSwSTAB = parseFloat(move2STAB / parseFloat(self.moveList[move2ID].duration / 1000).toFixed(2)).toFixed(2);
      }

      out += '<br><div class="progress pkmn-progress pkmn-' + pkmnNum + '" style="margin: 0.25rem auto; width: 70%;"> <div class="determinate pkmn-' + pkmnNum + '" style="width: ' + (pkmnHP / pkmnMHP) * 100 +'%"></div> </div>' +
        '<b>HP:</b> ' + pkmnHP + ' / ' + pkmnMHP +
        '<br/><b>CP: </b>' + pkmnCP +
        '<br/><b>IV: </b>' + (pkmnIV >= 0.8 ? '<span style="color: #039be5">' + pkmnIV + '</span>' : pkmnIV) +
        '<br/><b>A/D/S: </b>' + pkmnIVA + '/' + pkmnIVD + '/' + pkmnIVS +
        '<br><b>Candy: </b>' + candyNum +
        '<br><b>Date Captured: </b>' + pkmnDateCaptured +
        '<br><span style="background-color: #dadada; display: block; margin: 0 5px 5px; padding-bottom: 2px;"><b>Moves:</b><br>' +
        '<span style="cursor: pointer;" class="tooltipped" data-html="true" data-position="right" data-tooltip="<b>Type:</b> ' + self.getType(self.moveList[move1ID].type) + '<br><b>Damage:</b> ' + self.moveList[move1ID].damage;
      if (move1STAB != '') {
        out += '<br><b>STAB:</b> ' + move1STAB;
      }
      out += '<br><b>Energy Gained:</b> ' + self.moveList[move1ID].energy + '<br><b>Cooldown:</b> ' + parseFloat(self.moveList[move1ID].duration / 1000).toFixed(2) + 's<br><b>DPS:</b> ' + parseFloat(self.moveList[move1ID].dps).toFixed(2);
      if (move1DPSwSTAB != '') {
        out += '<br><b>DPS (w/STAB):</b> ' + move1DPSwSTAB;
      }
      out += '">' + self.moveList[move1ID].name + ' [ ' + self.moveList[move1ID].damage + ' ]</span><br>' +
        '<span style="cursor: pointer;" class="tooltipped" data-html="true" data-position="right" data-tooltip="<b>Type:</b> ' + self.getType(self.moveList[move2ID].type) + '<br><b>Damage:</b> ' + self.moveList[move2ID].damage;
      if (move2STAB != '') {
        out += '<br><b>STAB:</b> ' + move2STAB;
      }
      out += '<br><b>Energy Used:</b> ' + self.moveList[move2ID].energy + '<br><b>Cooldown:</b> ' + parseFloat(self.moveList[move2ID].duration / 1000).toFixed(2) + 's<br><b>DPS:</b> ' + parseFloat(self.moveList[move2ID].dps).toFixed(2);
      if (move2DPSwSTAB != '') {
        out += '<br><b>DPS (w/STAB):</b> ' + move2DPSwSTAB;
      }
      out += '">' + self.moveList[move2ID].name + ' [ ' + self.moveList[move2ID].damage + ' ]</span>' +
        '</span></div>';
    }
    // Add number of eggs
    out += '<div class="col s12 m4 l3 center" style="float: left;"><img src="image/pokemon/Egg.png" class="png_img"><br><b>You have ' + eggs + ' egg' + (eggs !== 1 ? "s" : "") + '</b><br>';
    if (eggs10 > 0) {
      out += '<b>10km:</b> ' + eggs10 + ' egg' + (eggs10 !== 1 ? "s" : "") + '<br>';
    }
    if (eggs5 > 0) {
      out += '<b>5km:</b> ' + eggs5 + ' egg' + (eggs5 !== 1 ? "s" : "") + '<br>';
    }
    if (eggs2 > 0) {
      out += '<b>2km:</b> ' + eggs2 + ' egg' + (eggs2 !== 1 ? "s" : "");
    }
    out += '</div>';
    var incubators = user.eggs[0].inventory_item_data.egg_incubators.egg_incubator;
    for(var b=0; b<incubators.length; b++) {
      var incubator = incubators[b];
      if (!incubator.item_id) {
        incubator = incubators[0];
      }
      var current_user_stats = self.user_data[self.settings.users[user_id].username].stats[0].inventory_item_data.player_stats;
      var totalToWalk  = incubator.target_km_walked - incubator.start_km_walked;
      var kmsLeft = incubator.target_km_walked - current_user_stats.km_walked;
      var walked = totalToWalk - kmsLeft;
      var eggString = '';
      if (typeof incubator.start_km_walked !== 'undefined') {
        eggString += '<b>' + (parseFloat(walked).toFixed(2) || 0) + "/" + (parseFloat(totalToWalk).toFixed(1) || 0) + " km</b><br>";
      } else {
        eggString += '<b>Not in use</b><br>';
      }
      var img = 'EggIncubatorUnlimited';
      if (incubator.item_id == 902) {
        img = 'EggIncubator';
        eggString += '<b>Uses Remaining:</b> ' + incubator.uses_remaining;
      }
      out += '<div class="col s12 m4 l3 center" style="float: left;"><img src="image/items/' + img + '.png" class="png_img"><br>';
      out += eggString;
      out += '</div>';
    }
    out += '</div>';
    var nth = 0;
    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });
    $('#subcontent').html(out);
    $('.tooltipped').tooltip({delay: 50, html: true});
  },
  sortAndShowPokedex: function(user_id) {
    var self = this,
    out = '',
    sortedPokedex = [],
    user_id = (user_id || 0),
    user = self.user_data[self.settings.users[user_id].username];

    sortedPokedex = self.pokemonArray.slice().map(function(pokemon) {
      pokemon.enc = 0;
      pokemon.cap = 0;
      return pokemon;
    });

    out = '<div class="items"><div class="row">';
    for (var i = 0; i < user.pokedex.length; i++) {
      var pokedex_entry = user.pokedex[i].inventory_item_data.pokedex_entry,
        pkmID = pokedex_entry.pokemon_id;

      sortedPokedex[pkmID-1].cap = pokedex_entry.times_captured || 0;
      sortedPokedex[pkmID-1].enc = pokedex_entry.times_encountered || 0;
    }
    switch ($(".pokedex-sort a.selected").data("sort")) {
      case 'id':
        sortedPokedex.sort(function(a, b) {
          return a.Number - b.Number;
        });
        break;
      case 'name':
        sortedPokedex.sort(function(a, b) {
          if (a.Name < b.Name) return -1;
          if (a.Name > b.Name) return 1;
          return 0;
        });
        break;
      case 'enc':
        sortedPokedex.sort(function(a, b) {
          return b.enc - a.enc;
        });
        break;
      case 'cap':
        sortedPokedex.sort(function(a, b) {
          return b.cap - a.cap;
        });
        break;
      default:
        sortedPokedex.sort(function(a, b) {
          return a.Number - b.Number;
        });
        break;
    }
    var filtered = 0,
      filter = $(".pokedex-filter a.selected").data("filter"),
      pkmnTotal = 151;
    if ($(".pokedex-filter a.selected").length === 0){
        pkmnTotal = self.user_data[self.settings.users[user_id].username].stats[0].inventory_item_data.player_stats.unique_pokedex_entries;
    }
    for (var i = 0; i < sortedPokedex.length; i++) {
      var pkmnNum = sortedPokedex[i].Number,
        pkmnImage = pkmnNum + '.png',
        pkmnName = sortedPokedex[i].Name,
        pkmnEnc = sortedPokedex[i].enc,
        pkmnCap = sortedPokedex[i].cap,
        candyNum = self.getCandy(parseInt(pkmnNum), user_id) || 0;

      if ((filter === 'seen' && pkmnEnc === 0) || (filter === 'unseen' && pkmnEnc > 0) || (filter === 'caught' && pkmnCap === 0) || (filter === 'uncaught' && pkmnCap > 0)){
        filtered++;
        continue;
      }

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
    $('#subtitle').html('Pokedex ' + (pkmnTotal - filtered) + ' / 151');
  },
  trainerFunc: function(data, user_index) {
    var self = mapView,
    coords = self.pathcoords[self.settings.users[user_index].username][self.pathcoords[self.settings.users[user_index].username].length - 1];
    for (var i = 0; i < data.cells.length; i++) {
      var cell = data.cells[i];
      if (data.cells[i].forts != undefined) {
        for (var x = 0; x < data.cells[i].forts.length; x++) {
          var fort = cell.forts[x],
            icon = 'image/forts/img_pokestop.png',
            fortPoints = '',
            fortTeam = '',
            fortType = 'PokeStop',
            guardName = '',
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
              if (typeof self.pokemonArray[fort.guard_pokemon_id - 1] !== 'undefined') {
                guardName = self.pokemonArray[fort.guard_pokemon_id - 1].Name;
              }
              pokemonGuard = 'Guard Pokemon: ' + (guardName || "None") + '<br>';
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
      if (tempcoords.lat != coords.lat && tempcoords.lng != coords.lng || self.pathcoords[self.settings.users[user_index].username].length === 1) {
        self.pathcoords[self.settings.users[user_index].username].push({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        });
      }
    } else {
      self.pathcoords[self.settings.users[user_index].username].push({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
    }
    if (self.user_data[self.settings.users[user_index].username].hasOwnProperty('marker') === false) {
      self.buildTrainerList();
      self.addInventory();
      self.log({
        message: "Trainer loaded: " + self.settings.users[user_index].username,
        color: "blue"
      });
      var randomSex = Math.floor(Math.random() * 1);
      self.user_data[self.settings.users[user_index].username].marker = new google.maps.Marker({
        map: self.map,
        position: {
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        },
        icon: 'image/trainer/' + self.trainerSex[randomSex] + Math.floor(Math.random() * self.numTrainers[randomSex]) + '.png',
        zIndex: 2,
        label: self.settings.users[user_index].username,
        clickable: false
      });
    } else {
      self.user_data[self.settings.users[user_index].username].marker.setPosition({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
      if (self.pathcoords[self.settings.users[user_index].username].length === 2) {
        self.user_data[self.settings.users[user_index].username].trainerPath = new google.maps.Polyline({
          map: self.map,
          path: self.pathcoords[self.settings.users[user_index].username],
          geodisc: true,
          strokeColor: self.pathColors[user_index],
          strokeOpacity: self.settings.userPath ? 1.0 : 0.0,
          strokeWeight: 2
        });
      } else {
        self.user_data[self.settings.users[user_index].username].trainerPath.setPath(self.pathcoords[self.settings.users[user_index].username]);
      }
    }
    if (self.settings.users.length > 0 && self.settings.userZoom === true) {
      self.map.setZoom(self.settings.zoom);
    }
    if (self.settings.users.length > 0 && self.settings.userFollow === true) {
      if (self.currentUserId == user_index) {
        self.map.panTo({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        });
      }
    }
  },
  updateTrainer: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      if (self.settings.users[i].enable) {
        loadJSON('location-' + self.settings.users[i].username + '.json?'+Date.now(), self.trainerFunc, self.errorFunc, i);
      }
    }
  },
  calc_cp: function(base_attack, base_defense, base_stamina, iv_attack, iv_defense, iv_stamina, cp_multiplier) {
    var bAttack = (base_attack + iv_attack),
    bDefense = Math.sqrt(base_defense + iv_defense),
    bStamina = Math.sqrt(base_stamina + iv_stamina),
    cpMulti = Math.pow(cp_multiplier, 2);
    return (bAttack * bDefense * bStamina * cpMulti / 10);
  },
  reconnectSocket: function(user_socket) {
    var self = mapView;
    self.log({
      message: "<span style='color: blue;'><b>Reconnecting to " + user_socket.io.uri + "...</b></span>",
      timeout: 3000
    });
    user_socket.connect({
      'reconnectionAttempts': 5
    });
  },
  // Adds events to log panel and if it's closed sends Toast
  log: function(log_object) {
    var self = mapView;
    var timeout = log_object.timeout
    var logColor = '';
    var logBGColor = '';
    if (typeof timeout == 'undefined') {
      timeout = 3000;
    }
    if (typeof log_object.color !== 'undefined' && log_object.color != '') {
      logColor = 'color: ' + log_object.color + ';';
    }
    if (typeof log_object.bgcolor !== 'undefined' && log_object.bgcolor != '') {
      logBGColor = 'background-color: ' + log_object.bgcolor + ';';
    }
    var currentDate = new Date();
    var time = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + (currentDate.getMinutes())).slice(-2);
    $("#logs-output").prepend("<div class='log-item'>\
        <span class='log-date'>" + time + "</span><p style='" + logColor + "padding: 2px 5px;" + logBGColor + "'>" + log_object.message + "</p></div>");
    if (!$('#logs-panel').is(":visible")) {
      Materialize.toast(log_object.message, timeout);
    }

    self.logCount = $(".log-item").length;
    if (self.logCount > 100) {
      $(".log-item:last-child").remove();
    }
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

Date.prototype.customFormat = function(formatString){
  var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
  YY = ((YYYY=this.getFullYear())+"").slice(-2);
  MM = (M=this.getMonth()+1)<10?('0'+M):M;
  MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
  DD = (D=this.getDate())<10?('0'+D):D;
  DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
  th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
  formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
  h=(hhh=this.getHours());
  if (h==0) h=24;
  if (h>12) h-=12;
  hh = h<10?('0'+h):h;
  hhhh = hhh<10?('0'+hhh):hhh;
  AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
  mm=(m=this.getMinutes())<10?('0'+m):m;
  ss=(s=this.getSeconds())<10?('0'+s):s;
  return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};
