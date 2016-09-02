'use strict';

var socket_io;

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

socket_io = io.connect('127.0.0.1:4000');


$(document).ready(function() {
  mapView.init();

});

var mapView = {
  map: [],
  user_index: 0,
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
  levelXpArray: {},
  stats: {},
  user_data: {},
  pathcoords: {},
  slowMoves: {
    32: "Stone Edge",
    28: "Cross Chop",
    83: "Dragon Claw",
    40: "Blizzard",
    131: "Body Slam",
    22: "Megahorn",
    122: "Hurricane",
    116: "Solar Beam",
    103: "Fire Blast",
    14: "Hyper Beam",
    31: "Earthquake",
    118: "Power Whip",
    107: "Hydro Pump",
    117: "Leaf Blade",
    78: "Thunder",
    123: "Brick Break",
    92: "Gunk Shot",
    90: "Sludge Bomb",
    42: "Heat Wave",
    87: "Moonblast",
    91: "Sludge Wave",
    79: "Thunderbolt",
    47: "Petal Blizzard",
    89: "Cross Poison",
    108: "Psychic",
    58: "Aqua Tail",
    24: "Flamethrower",
    88: "Play Rough",
    82: "Dragon Pulse",
    39: "Ice Beam",
    49: "Bug Buzz",
    46: "Drill Run",
    59: "Seed Bomb",
    77: "Thunder Punch",
    100: "X Scissor",
    129: "Hyper Fang",
    64: "Rock Slide",
    94: "Bone Club",
    36: "Flash Cannon",
    74: "Iron Head",
    38: "Drill Peck",
    60: "Psyshock",
    70: "Shadow Ball",
    99: "Signal Beam",
    115: "Fire Punch",
    54: "Submission",
    102: "Flame Burst",
    127: "Stomp",
    35: "Discharge",
    65: "Power Gem",
    106: "Scald",
    109: "Psystrike",
    56: "Low Sweep",
    51: "Night Slash",
    86: "Dazzling Gleam",
    16: "Dark Pulse",
    33: "Ice Punch",
    26: "Dig",
    20: "Vice Grip",
    18: "Sludge",
    96: "Mud Bomb",
    126: "Horn Attack",
    121: "Air Cutter",
    132: "Rest",
    72: "Magnet Bomb",
    57: "Aqua Jet",
    105: "Water Pulse",
    30: "Psybeam",
    63: "Rock Tomb",
    50: "Poison Fang",
    104: "Brine",
    45: "Aerial Ace",
    53: "Bubble Beam",
    95: "Bulldoze",
    125: "Swift",
    62: "Ancient Power",
    114: "Giga Drain",
    69: "Ominous Wind",
    67: "Shadow Punch",
    80: "Twister",
    85: "Draining Kiss",
    21: "Flame Wheel",
    133: "Struggle",
    101: "Flame Charge",
    34: "Heart Stamp",
    75: "Parabolic Charge",
    111: "Icy Wind",
    84: "Disarming Voice",
    13: "Wrap",
    66: "Shadow Sneak",
    48: "Mega Drain"
  },
  fastMoves: {
    222: "Pound",
    228: "Metal Claw",
    226: "Psycho Cut",
    210: "Wing Attack",
    202: "Bite",
    204: "Dragon Breath",
    220: "Scratch",
    230: "Water Gun",
    240: "Fire Fang",
    213: "Shadow Claw",
    238: "Feint Attack",
    224: "Poison Jab",
    234: "Zen Headbutt",
    239: "Steel Wing",
    201: "Bug Bite",
    218: "Frost Breath",
    233: "Mud Slap",
    216: "Mud Shot",
    221: "Tackle",
    237: "Bubble",
    214: "Vine Whip",
    217: "Ice Shard",
    241: "Rock Smash",
    223: "Cut",
    236: "Poison Sting",
    215: "Razor Leaf",
    212: "Lick",
    206: "Spark",
    203: "Sucker Punch",
    235: "Confusion",
    225: "Acid",
    209: "Ember",
    227: "Rock Throw",
    211: "Peck",
    207: "Low Kick",
    205: "Thunder Shock",
    229: "Bullet Punch",
    219: "Quick Attack",
    200: "Fury Cutter",
    208: "Karate Chop",
    231: "Splash"
  },
  itemsArray: {
    '0': 'Unknown',
    '1': 'Pokeball',
    '2': 'Greatball',
    '3': 'Ultraball',
    '4': 'Masterball',
    '101': 'Potion',
    '102': 'Super Potion',
    '103': 'Hyper Potion',
    '104': 'Max Potion',
    '201': 'Revive',
    '202': 'Max Revive',
    '301': 'Lucky Egg',
    '401': 'Incense',
    '402': 'Spicy Incense',
    '403': 'Cool Incense',
    '404': 'Floral Incense',
    '501': 'Lure Module',
    '602': 'X Attack',
    '603': 'X Defense',
    '604': 'X Miracle',
    '701': 'Razz Berry',
    '702': 'Bluk Berry',
    '703': 'Nanab Berry',
    '704': 'Wepar Berry',
    '705': 'Pinap Berry',
    '801': 'Special Camera',
    '901': 'Incubator (Unlimited)',
    '902': 'Incubator',
    '1001': 'Pokemon Storage Upgrade',
    '1002': 'Item Storage Upgrade'
  },
  settings: {},
  init: function() {
    var self = this;
    self.settings = $.extend(true, self.settings, userInfo);
    self.bindUi();

for (var k in events){    
  if (events.hasOwnProperty(k)) {
    var renk = events[k];
    socket_io.on(k+':'+self.settings.users[0], function (data) {
      console.log(data);
      if(data['data']['msg'] != null){
        Materialize.toast("<span style='color: " + renk + "'>" + data['data']['msg'] + "</span>", 8000);
      }
    });
  }
}

    $.getScript('https://maps.googleapis.com/maps/api/js?key={0}&libraries=drawing'.format(self.settings.gMapsAPIKey), function() {
      self.log({
        message: 'Loading Data..'
      });
      self.loadJSON('data/pokemondata.json', function(data, successData) {
        self.pokemonArray = data;
      }, self.errorFunc, 'pokemonData');
      self.loadJSON('data/pokemoncandy.json', function(data, successData) {
        self.pokemoncandyArray = data;
      }, self.errorFunc, 'pokemonCandy');
      self.loadJSON('data/levelXp.json', function(data, successData) {
        self.levelXpArray = data;
      }, self.errorFunc, 'levelXp');
      for (var i = 0; i < self.settings.users.length; i++) {
        var user = self.settings.users[i];
        self.user_data[user] = {};
        self.pathcoords[user] = [];
      }
      self.initMap();
      self.log({
        message: 'Data Loaded!'
      });
    });
  },
  bindUi: function() {
    var self = this;
    $('#switchPan').prop('checked', self.settings.userFollow);
    $('#switchZoom').prop('checked', self.settings.userZoom);
    $('#strokeOn').prop('checked', false);

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
  addCatchable: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      self.loadJSON('catchable-' + self.settings.users[i] + '.json', self.catchSuccess, self.errorFunc, i);
    }
  },
  addInventory: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      self.loadJSON('inventory-' + self.settings.users[i] + '.json', self.invSuccess, self.errorFunc, i);
    }
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

        out += '<div class="row"><div class="col s12"><h5>' +
          self.settings.users[user_id] +
          '</h5><br>Level: ' +
          current_user_stats.level +
          '<br><div class="progress botbar-' + user_id + '" style="height: 10px"> <div class="determinate bot-' + user_id + '" style="width: '+
          ((current_user_stats.experience - self.levelXpArray[current_user_stats.level - 1].current_level_xp) /
          self.levelXpArray[current_user_stats.level - 1].exp_to_next_level) * 100 +
          '%"></div></div>Total Exp: ' +
          current_user_stats.experience +
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
        sortButtons += '<div class="chip"><a href="#" data-sort="candy">Candy</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="time">Time</a></div>';
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
        sortButtons += '</div>';

        $('#sortButtons').html(sortButtons);

        self.sortAndShowPokedex('id', user_id);
        break;
      case 5:
        var pkmnTotal = self.user_data[self.settings.users[user_id]].pokedex.length;
        var sortButtons = '<div class="col s12 not-pokedex-sort" dat-user-id="' + user_id + '">Sort : ';
        sortButtons += '<div class="chip"><a href="#" data-sort="id">ID</a></div>';
        sortButtons += '<div class="chip"><a href="#" data-sort="name">Name</a></div>';
        sortButtons += '</div>';

        $('#sortButtons').html(sortButtons);
        $('#subtitle').html('Not In Pokedex: ' + (151 - pkmnTotal));
        self.sortAndShowNotPokedex('id', user_id);
        break;
      default:
        break;
    }
  },
  sortAndShowNotPokedex: function (sortOn, user_id) {
    var self = this,
      sortedPokemon = [],
      out = '',
      user_id = user_id || 0,
      user = self.user_data[self.settings.users[user_id]];

    if (!user.bagPokemon.length) return;

    var pkmnTotal = self.user_data[self.settings.users[user_id]].pokedex.length;
    var arrayNotPokedex = [];
  
    for (var i = 0; i < self.pokemonArray.length; i++) {
      var alreadyHave = false;

      for (var j = 0; j < pkmnTotal; j++) {
        var id = self.pad_with_zeroes(self.user_data[self.settings.users[user_id]].pokedex[j].inventory_item_data.pokedex_entry.pokemon_id, 3);
        if (id == self.pokemonArray[i].Number) {
          alreadyHave = true;
        }
      }

      if (!alreadyHave) {
        arrayNotPokedex.push(self.pokemonArray[i]);
      }
    }
    
    out = '<div class="items"><div class="row">';
    for (var i = 0; i < arrayNotPokedex.length; i++) {
      sortedPokemon.push({
        'name': arrayNotPokedex[i].Name,
        'id': arrayNotPokedex[i].Number
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
        pkmnName = self.pokemonArray[pkmnNum - 1].Name;

      out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' +
        pkmnImage + '" class="png_img"><br><b>' +
        pkmnName;
      out += '</div>';
   }
    
    var nth = 0;
    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });
    $('#subcontent').html(out);
    $('.dropdown-button').dropdown();
  },
  buildTrainerList: function() {
    var self = this,
      users = self.settings.users;
    var out = '<div class="col s12"><ul id="bots-list" class="collapsible" data-collapsible="accordion"> \
              <li><div class="collapsible-title"><i class="material-icons">people</i>Bots</div></li>';

    for (var i = 0; i < users.length; i++) {
      var content = '<li class="bot-user">\
            <div class="collapsible-header bot-name">{0}</div>\
                <div class="collapsible-body">\
                    <ul class="bot-items" data-user-id="{1}">\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tInfo">Info</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tItems">Items</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tPokemon">Pokemon</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tPokedex">Pokedex</a></li><br>\
                       <li><a class="bot-' + i + ' waves-effect waves-light btn tNotPokedex">Not</a></li><br>\
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
            message: "[" + self.settings.users[user_index] + "] " + poke_name + " appeared",
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
    self.user_data[self.settings.users[user_index]] = userData;
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
      self.loadJSON('location-' + self.settings.users[i] + '.json', self.trainerFunc, self.errorFunc, i);
    }
  },
  sortAndShowBagPokemon: function(sortOn, user_id) {
    var self = this,
      eggs = 0,
      sortedPokemon = [],
      out = '',
      user = self.user_data[self.settings.users[user_id]],
      user_id = user_id || 0;

    if (!user.bagPokemon.length) return;

    out = '<div class="items"><div class="row">';
    for (var i = 0; i < user.bagPokemon.length; i++) {
      if (user.bagPokemon[i].inventory_item_data.pokemon_data.is_egg) {
        eggs++;
        continue;
      }
      var pokemonData = user.bagPokemon[i].inventory_item_data.pokemon_data,
        pkmID = pokemonData.pokemon_id,
        pkmnName = self.pokemonArray[pkmID - 1].Name,
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
        pkmMHP = pokemonData.stamina_max || 0;

      sortedPokemon.push({
        "name": pkmnName,
        "id": pkmID,
        "unique_id": pkmUID,
        "cp": pkmCP,
        "iv": pkmIV,
        "attack": pkmIVA,
        "defense": pkmIVD,
        "stamina": pkmIVS,
        "health": pkmHP,
        "max_health": pkmMHP,
        "creation_time": pkmTime,
        'candy': self.getCandy(pkmID, user_id),
        "move1": move1ID,
        "move2": move2ID
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
        pkmnCP = sortedPokemon[i].cp,
        pkmnIV = sortedPokemon[i].iv,
        pkmnIVA = sortedPokemon[i].attack,
        pkmnIVD = sortedPokemon[i].defense,
        pkmnIVS = sortedPokemon[i].stamina,
        move1ID = sortedPokemon[i].move1,
        move2ID = sortedPokemon[i].move2,
        candyNum = self.getCandy(pkmnNum, user_id);

      out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' +
        pkmnImage +
        '" class="png_img"><br><b>' +
        pkmnName +
        '</b><br>' +
        pkmnCP +
        '<br>IV: ' +
        pkmnIV +
        '<br>A/D/S:' +
        pkmnIVA + '/' + pkmnIVD + '/' + pkmnIVS +
        '<br>Candy: ' +
        candyNum +
        '<br>Moves: ' +
        self.fastMoves[move1ID] + ', ' + self.slowMoves[move2ID] +   
        '</div>';
    }
    // Add number of eggs
    out += '<div class="col s12 m4 l3 center" style="float: left;"><img src="image/pokemon/Egg.png" class="png_img"><br><b>You have ' + eggs + ' egg' + (eggs !== 1 ? "s" : "") + '</div>';
    out += '</div></div>';
    var nth = 0;
    out = out.replace(/<\/div><div/g, function (match, i, original) {
      nth++;
      return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
    });
    $('#subcontent').html(out);
  },
  sortAndShowPokedex: function(sortOn, user_id) {
    var self = this,
      out = '',
      sortedPokedex = [],
      user_id = (user_id || 0),
      user = self.user_data[self.settings.users[user_id]];

    if (!user.pokedex.length) return;

    out = '<div class="items"><div class="row">';
    for (var i = 0; i < user.pokedex.length; i++) {
      var pokedex_entry = user.pokedex[i].inventory_item_data.pokedex_entry,
        pkmID = pokedex_entry.pokemon_id,
        pkmnName = self.pokemonArray[pkmID - 1].Name,
        pkmEnc = pokedex_entry.times_encountered,
        pkmCap = pokedex_entry.times_captured;

      sortedPokedex.push({
        "name": pkmnName,
        "id": pkmID,
        "cap": (pkmCap || 0),
        "enc": (pkmEnc || 0)
      });
    }
    switch (sortOn) {
      case 'id':
        sortedPokedex.sort(function(a, b) {
          return a.id - b.id;
        });
        break;
      case 'name':
        sortedPokedex.sort(function(a, b) {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        break;
      case 'enc':
        sortedPokedex.sort(function(a, b) {
          return a.enc - b.enc;
        });
        break;
      case 'cap':
        sortedPokedex.sort(function(a, b) {
          return a.cap - b.cap;
        });
        break;
      default:
        sortedPokedex.sort(function(a, b) {
          return a.id - b.id;
        });
        break;
    }
    for (var i = 0; i < sortedPokedex.length; i++) {
      var pkmnNum = sortedPokedex[i].id,
        pkmnImage = self.pad_with_zeroes(pkmnNum, 3) + '.png',
        pkmnName = self.pokemonArray[pkmnNum - 1].Name,
        pkmnName = self.pokemonArray[pkmnNum - 1].Name,
        pkmnEnc = sortedPokedex[i].enc,
        pkmnCap = sortedPokedex[i].cap,
        candyNum = self.getCandy(pkmnNum, user_id);
      out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' +
        pkmnImage +
        '" class="png_img"><br><b> ' +
        self.pad_with_zeroes(pkmnNum, 3) +
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
  },
  trainerFunc: function(data, user_index) {
    var self = mapView,
      coords = self.pathcoords[self.settings.users[user_index]][self.pathcoords[self.settings.users[user_index]].length - 1];
    for (var i = 0; i < data.cells.length; i++) {
      var cell = data.cells[i];
      if (data.cells[i].forts != undefined) {
        for (var x = 0; x < data.cells[i].forts.length; x++) {
          var fort = cell.forts[x];
          if (!self.forts[fort.id]) {
            if (fort.type === 1) {
              var icon = 'image/forts/img_pokestop.png'
              if(fort.lure_info || fort.lure_expires_timestamp_ms){
                icon = 'image/forts/img_pokestop_lured.png'
              }
              self.forts[fort.id] = new google.maps.Marker({
                map: self.map,
                position: {
                  lat: parseFloat(fort.latitude),
                  lng: parseFloat(fort.longitude)
                },
                icon: icon
              });
            } else {
              self.forts[fort.id] = new google.maps.Marker({
                map: self.map,
                position: {
                  lat: parseFloat(fort.latitude),
                  lng: parseFloat(fort.longitude)
                },
                icon: 'image/forts/' + self.teams[(fort.owned_by_team || 0)] + '.png'
              });
            }
            var fortPoints = '',
              fortTeam = '',
              fortType = 'PokeStop',
              pokemonGuard = '';
            if (fort.guard_pokemon_id != undefined) {
              fortPoints = 'Points: ' + fort.gym_points;
              fortTeam = 'Team: ' + self.teams[fort.owned_by_team] + '<br>';
              fortType = 'Gym';
              pokemonGuard = 'Guard Pokemon: ' + (self.pokemonArray[fort.guard_pokemon_id - 1].Name || "None") + '<br>';
            }
            var contentString = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + pokemonGuard + fortPoints;
            self.info_windows[fort.id] = new google.maps.InfoWindow({
              content: contentString
            });
            google.maps.event.addListener(self.forts[fort.id], 'click', (function(marker, content, infowindow) {
              return function() {
                infowindow.setContent(content);
                infowindow.open(map, marker);
              };
            })(self.forts[fort.id], contentString, self.info_windows[fort.id]));
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
        message: "Trainer loaded: " + self.settings.users[user_index],
        color: "blue-text"
      });
      var randomSex = Math.floor(Math.random() * 1);
      self.user_data[self.settings.users[user_index]].marker = new google.maps.Marker({
        map: self.map,
        position: {
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng)
        },
        icon: 'image/trainer/' + self.trainerSex[randomSex] + Math.floor(Math.random() * self.numTrainers[randomSex]) + '.png',
        zIndex: 2,
        label: self.settings.users[user_index],
        clickable: false
      });
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
          strokeOpacity: 0.0,
          strokeWeight: 2
        });
      } else {
        self.user_data[self.settings.users[user_index]].trainerPath.setPath(self.pathcoords[self.settings.users[user_index]]);
      }
    }
    if (self.settings.users.length === 1 && self.settings.userZoom === true) {
      self.map.setZoom(self.settings.zoom);
    }
    if (self.settings.users.length === 1 && self.settings.userFollow === true) {
      self.map.panTo({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng)
      });
    }
  },
  updateTrainer: function() {
    var self = mapView;
    for (var i = 0; i < self.settings.users.length; i++) {
      self.loadJSON('location-' + self.settings.users[i] + '.json', self.trainerFunc, self.errorFunc, i);
    }
  },
  loadJSON: function(path, success, error, successData) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success)
            success(JSON.parse(xhr.responseText.replace(/\bNaN\b/g, 'null')), successData);
        } else {
          if (error)
            error(xhr);
        }
      }
    };
    xhr.open('GET', path, true);
    xhr.send();
  },

/*
  loadJSON: function(path, success, error, successData) {
    $.getJSON({
      url: path + "?" + Date.now()
    }).done(function(data) {
      if(data !== undefined) {
        success(data, successData);
        console.log(data);
      } else {
        error(data);
      }
    });
  },
*/

  // Adds events to log panel and if it's closed sends Toast
  log: function(log_object) {
    var currentDate = new Date();
    var time = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + (currentDate.getMinutes())).slice(-2);
    $("#logs-panel .card-content").append("<div class='log-item'>\
  <span class='log-date'>" + time + "</span><p class='" + log_object.color + "'>" + log_object.message + "</p></div>");
    if (!$('#logs-panel').is(":visible")) {
      Materialize.toast(log_object.message, 3000);
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
