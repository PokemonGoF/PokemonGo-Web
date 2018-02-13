function MapViewManager() {
    //private vars 
    var usersSocket;
    var gVars;
    var map = [];
    var user_index = 0;
    var currentUserId = 0;
    var emptyDex = [];
    var forts = [];
    var info_windows = [];
    var numTrainers = [
        177,
        109
    ];
    var teams = [
        'TeamLess',
        'Mystic',
        'Valor',
        'Instinct'
    ];
    var trainerSex = [
        'm',
        'f'
    ];
    var pathColors = [
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
    ];
    var bagCandy = {};
    var bagItems = {};
    var bagPokemon = {};
    var inventory = {};
    var playerInfo = {};
    var pokedex = {};
    var pokemonArray = {};
    var pokemoncandyArray = {};
    var badgesArray = {};
    var levelXpArray = {};
    var stats = {};
    var user_data = {};
    var user_xps = {};
    var pathcoords = {};
    var settings = {};
    var logCount = 0;

    this.mapView = new MapView();
    var self = this.mapView;

    function MapView() {
        this.map;

        //loadUserJsonData is in the utils file

        this.placeTrainer = function () {
            loadUserJsonData(settings, 'location-', trainerHandler, this.errorHandler);
        };

        this.placeEvents = function () {
            loadJSON('events-' + settings.users[currentUserId].username + '.json?' + Date.now(), eventsHandler, this.errorHandler, 0);
        };

        this.addCatchable = function () {
            loadUserJsonData(settings, 'catchable-', catchSuccess, this.errorHandler);
        };

        this.addInventory = function () {
            loadUserJsonData(settings, 'inventory-', invSuccess, this.errorHandler);
        };

        var trainerHandler = function (data, user_index) {
            var username = settings.users[user_index].username
            var coords = pathcoords[username][pathcoords[username].length - 1];

            if (data.hasOwnProperty("cells"))
                if (data.cells != undefined && typeof data.cells != "undefined" && data.cells != null)
                    manageCellsForts(data.cells);

            if (coords > 1) {
                var tempcoords = [{
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                }];

                if (tempcoords.lat != coords.lat && tempcoords.lng != coords.lng || pathcoords[settings.users[user_index].username].length === 1) {
                    pathcoords[settings.users[user_index].username].push({
                        lat: parseFloat(data.lat),
                        lng: parseFloat(data.lng)
                    });
                }
            } else {
                pathcoords[settings.users[user_index].username].push({
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                });
            }

            if (user_data[settings.users[user_index].username].hasOwnProperty('marker') === false) {

                buildTrainerList();
                self.addInventory();
                self.log({
                    message: "Trainer loaded: " + settings.users[user_index].username,
                    color: "blue"
                });

                var randomSex = Math.floor(Math.random() * 1);
                user_data[settings.users[user_index].username].marker = new google.maps.Marker({
                    map: self.map,
                    position: {
                        lat: parseFloat(data.lat),
                        lng: parseFloat(data.lng)
                    },
                    icon: 'image/trainer/' + trainerSex[randomSex] + Math.floor(Math.random() * numTrainers[randomSex]) + '.png',
                    zIndex: 2,
                    label: settings.users[user_index].username,
                    clickable: false
                });
            } else {
                user_data[settings.users[user_index].username].marker.setPosition({
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lng)
                });

                if (pathcoords[settings.users[user_index].username].length === 2) {
                    user_data[settings.users[user_index].username].trainerPath = new google.maps.Polyline({
                        map: self.map,
                        path: pathcoords[settings.users[user_index].username],
                        geodisc: true,
                        strokeColor: pathColors[user_index],
                        strokeOpacity: settings.userPath ? 1.0 : 0.0,
                        strokeWeight: 2
                    });
                } else {
                    user_data[settings.users[user_index].username].trainerPath.setPath(pathcoords[settings.users[user_index].username]);
                }
            }

            if (settings.users.length > 0 && settings.userZoom === true) {
                self.map.setZoom(settings.zoom);
            }

            if (settings.users.length > 0 && settings.userFollow === true) {
                if (currentUserId == user_index) {
                    self.map.panTo({
                        lat: parseFloat(data.lat),
                        lng: parseFloat(data.lng)
                    });
                }
            }
        }

        var manageCellsForts = function (cells) {
            for (var ckey in cells) {
                if (cells.hasOwnProperty(ckey)) {

                    var cell = cells[ckey];

                    if (cell.forts != undefined) {
                        for (var fkey in cell.forts) {
                            if (cell.forts.hasOwnProperty(fkey)) {

                                var fort = cell.forts[fkey],
                                    icon = 'image/forts/img_pokestop.png',
                                    fortPoints = '',
                                    fortTeam = '',
                                    fortType = 'PokeStop',
                                    guardName = '',
                                    pokemonGuard = '';

                                if (fort.type === 1) {
                                    if (fort.active_fort_modifier && fort.active_fort_modifier == 501) {
                                        icon = 'image/forts/img_pokestop_lured.png';
                                    }
                                } else {
                                    icon = 'image/forts/' + teams[(fort.owned_by_team || 0)] + '.png';
                                    fortType = 'Gym';

                                    if (fort.guard_pokemon_id != undefined) {
                                        fortPoints = 'Points: ' + fort.gym_points;
                                        fortTeam = 'Team: ' + teams[fort.owned_by_team] + '<br>';

                                        if (typeof pokemonArray[fort.guard_pokemon_id - 1] !== 'undefined') {
                                            guardName = pokemonArray[fort.guard_pokemon_id - 1].Name;
                                        }

                                        pokemonGuard = 'Guard Pokemon: ' + (guardName || "None") + '<br>';
                                    }
                                }

                                var contentString = 'Id: ' + fort.id + '<br>Type: ' + fortType + '<br>' + fortTeam + pokemonGuard + fortPoints;

                                if (!forts[fort.id]) {

                                    forts[fort.id] = new google.maps.Marker({
                                        map: self.map,
                                        position: {
                                            lat: parseFloat(fort.latitude),
                                            lng: parseFloat(fort.longitude)
                                        },
                                        icon: icon
                                    });

                                    info_windows[fort.id] = new google.maps.InfoWindow({
                                        content: contentString
                                    });

                                    google.maps.event.addListener(forts[fort.id], 'click', (function (marker, content, infowindow) {
                                        return function () {
                                            infowindow.setContent(content);
                                            infowindow.open(map, marker);
                                        };
                                    })(forts[fort.id], contentString, info_windows[fort.id]));

                                } else {
                                    forts[fort.id].setIcon(icon);
                                    info_windows[fort.id].setContent(contentString);
                                }
                            }
                        }
                    }
                }
            }
        };

        var buildTrainerList = function () {
            var out = '<div class="col s12"><ul id="bots-list" class="collapsible" data-collapsible="accordion"> \
            <li><div class="collapsible-title"><i class="material-icons">people</i>Bots</div></li>';

            for (var key in settings.users) {
                if (settings.users.hasOwnProperty(key)) {
                    var user = settings.users[key];

                    if (user.enable) {
                        var socketEnabled = (user.enableSocket) ? ' checked' : '';
                        var alias = user.alias;

                        if (!alias) {
                            alias = user.username;
                        }

                        var content = '<li class="bot-user">\
                        <div class="collapsible-header bot-name">\
                        <span class="right tooltipped" data-position="bottom" data-tooltip="Enable/disable web socket connection">\
                        <input class="toggle-connection" type="checkbox" id="check_{1}" value="{1}"' + socketEnabled + ' />\
                        <label for="check_{1}" style="padding-left: 15px; margin-left: 5px;">&nbsp</label></span>\
                        <span data-bot-id="{0}" class="bot_title">' + alias + '</span></div>\
                        <div class="collapsible-body">\
                        <ul class="bot-items" data-user-id="{1}">\
                        <li><a class="bot-' + key + ' waves-effect waves-light btn tInfo">Info</a></li><br>\
                        <li><a class="bot-' + key + ' waves-effect waves-light btn tItems">Items</a></li><br>\
                        <li><a class="bot-' + key + ' waves-effect waves-light btn tPokemon">Pokemon</a></li><br>\
                        <li><a class="bot-' + key + ' waves-effect waves-light btn tPokedex">Pokedex</a></li><br>\
                        <li><a class="bot-' + key + ' waves-effect waves-light btn tFind">Find</a></li>\
                        </ul>\
                        </div>\
                        </li>';

                        out += content.format(user.username, key);
                    }
                }
            }

            out += "</ul></div>";
            $('#trainers').html(out);
            $('.collapsible').collapsible();
            $('.tooltipped').tooltip({ delay: 10, html: true });
        }

        var invSuccess = function (data, user_index) {
            var userData = user_data[settings.users[user_index].username],
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

            user_data[settings.users[user_index].username] = userData;

            if (!(user_index in user_xps)) {
                user_xps[user_index] = [];
            }

            var t = (new Date()).getTime() / 1000.0;
            var xp = userData.stats[0].inventory_item_data.player_stats.experience;
            user_xps[user_index].push({ 't': t, 'xp': xp });

            while (user_xps[user_index].length && t - user_xps[user_index][0].t > 600) {
                user_xps[user_index].shift();
            }
        }

        var catchSuccess = function (data, user_index) {
            var user = user_data[settings.users[user_index].username],
                poke_name = '';

            if (data !== undefined && Object.keys(data).length > 0) {
                if (user.catchables === undefined) {
                    user.catchables = {};
                }

                if (data.latitude !== undefined) {
                    if (user.catchables.hasOwnProperty(data.spawnpoint_id) === false) {
                        user.catchables[data.spawnpoint_id] = new google.maps.Marker({
                            map: self.map,
                            position: {
                                lat: parseFloat(data.latitude),
                                lng: parseFloat(data.longitude)
                            },
                            icon: {
                                url: 'image/pokemon/' + pad_with_zeroes(data.pokemon_id, 3) + '.png',
                                scaledSize: new google.maps.Size(70, 70)
                            },
                            zIndex: 4,
                            optimized: false,
                            clickable: false
                        });

                        if (settings.userZoom === true) {
                            self.map.setZoom(settings.zoom);
                        }

                        if (settings.userFollow === true) {
                            if (currentUserId == user_index) {
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
                            url: 'image/pokemon/' + pad_with_zeroes(data.pokemon_id, 3) + '.png',
                            scaledSize: new google.maps.Size(70, 70)
                        });
                    }
                }

            } else {
                if (user.catchables !== undefined && Object.keys(user.catchables).length > 0) {
                    for (var key in user.catchables) {
                        user.catchables[key].setMap(null);
                    }
                    user.catchables = undefined;
                }
            }
        };

        var eventsHandler = function (data, user_index) {
            // //first clear all messages
            $("#events-output").empty();

            //Print them in different order, so that newest is always on top.
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var tEvent = data[key];
                    printevent({
                        message: tEvent.event.friendly_msg,
                        event: tEvent.event.event,
                        timestamp: tEvent.event.timestamp,
                        level: tEvent.event.level
                    });
                }
            }
        };

        var printevent = function (event_object) {
            var timeout = event_object.timeout
            var eventType = event_object.event;
            var eventColor = 'color: ' + gVars.eventsColors[eventType] + ';';
            var eventBGColor = typeof event_object.bgcolor !== 'undefined' && event_object.bgcolor != '' ? eventBGColor = 'background-color: ' + event_object.bgcolor + ';' : '';
            var currentDate = new Date(event_object.timestamp);
            var time = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + (currentDate.getMinutes())).slice(-2);

            $("#events-output").prepend("<div class='event-item'>\
                <span class='event-date'>" + time + "</span><span class='event-type'>[" + event_object.event + "] </span><span style='" + eventColor + "padding: 2px 5px;" + eventBGColor + "'>" + event_object.message + "</span></div>");

            eventCount = $(".event-item").length;
            if (eventCount > 100) {
                $(".event-item:last-child").remove();
            }
        };
    };

    MapView.prototype.init = function () {

        this.bindUI();

        $.getScript('https://maps.googleapis.com/maps/api/js?key={0}&libraries=drawing'.format(settings.gMapsAPIKey), function () {
            self.log({
                message: 'Loading Data..'
            });

            loadJSON('data/pokemondata.json?' + Date.now(), function (data, successData) {
                pokemonArray = data;
            }, self.errorHandler, 'pokemonData');

            loadJSON('data/pokemoncandy.json?' + Date.now(), function (data, successData) {
                pokemoncandyArray = data;
            }, self.errorHandler, 'pokemonCandy');

            loadJSON('data/badges.json?' + Date.now(), function (data, successData) {
                badgesArray = data;
            }, self.errorHandler, 'badges');

            loadJSON('data/levelXp.json?' + Date.now(), function (data, successData) {
                levelXpArray = data;
            }, self.errorHandler, 'levelXp');

            loadJSON('data/moves.json?' + Date.now(), function (data, successData) {
                moveList = {};
                data.map(function (move) {
                    moveList[move.id] = move;
                });
            }, self.errorHandler, 'moveList');

            loadJSON('data/items.json?' + Date.now(), function (data, successData) {
                itemsArray = data;
            }, self.errorHandler, 'itemsArray');

            for (var key in settings.users) {
                if (settings.users.hasOwnProperty(key)) {
                    var user = settings.users[key].username;
                    user_data[user] = {};
                    pathcoords[user] = [];
                }
            }

            self.initMap();
            self.map.setZoom(settings.zoom);
            self.log({
                message: 'Data Loaded!'
            });
        });
    }

    MapView.prototype.bindUI = function () {
        $('#switchPan').prop('checked', settings.userFollow);
        $('#switchZoom').prop('checked', settings.userZoom);
        $('#strokeOn').prop('checked', settings.userPath);

        $('#switchPan').change(function () {
            settings.userFollow = this.checked ? true : false;
        });

        $('#switchZoom').change(function () {
            settings.userZoom = this.checked ? true : false;
        });

        $('#strokeOn').change(function () {
            for (var key in settings.users) {
                if (settings.users.hasOwnProperty(key)) {
                    if (settings.users[key].enable) {
                        user_data[settings.users[key].username].trainerPath.setOptions({
                            strokeOpacity: this.checked ? 1.0 : 0.0
                        });
                    }
                }
            }
        });

        $('#optionsButton').click(function () {
            $('#optionsList').toggle();
        });

        $('#logs-button').click(function () {
            $('#logs-panel').toggle();
            if ($('#events-panel').css('display') != "none")
                $('#events-panel').toggle();
        });

        $('#events-button').click(function () {
            $('#events-panel').toggle();
            if ($('#logs-panel').css('display') != "none")
                $('#logs-panel').toggle();
        });

        // Init tooltip
        $(document).ready(function () {
            $('.tooltipped').tooltip({
                delay: 50
            });

            $('#events-title').width($('#events-output').width());
        });

        // Bots list and menus
        var submenuIndex = 0;
        $('body').on('click', ".bot-user .bot-items .btn:not(.tFind)", function () {
            var itemIndex = $(this).parent().parent().find('.btn').index($(this)) + 1,
                userId = $(this).closest('ul').data('user-id');
            if ($('#submenu').is(':visible') && itemIndex == submenuIndex && currentUserId == userId) {
                $('#submenu').toggle();
            } else {
                submenuIndex = itemIndex;
                currentUserId = userId;
                buildMenu(userId, itemIndex);
                self.placeEvents();
            }
        });

        $('body').on('click', '#close', function () {
            $('#submenu').toggle();
        });

        $('body').on('click', '#close-logs', function () {
            $('#logs-panel').toggle();
        });

        $('body').on('click', '#close-events', function () {
            $('#events-panel').toggle();
        });

        $('body').on('click', '.tFind', function () {
            findBot($(this).closest('ul').data('user-id'));
        });

        // Binding sorts
        $('body').on('click', '.item-sort a', function () {
            var item = $(this);
            var userId = item.parent().data('user-id');
            $(item).addClass('selected bot-' + userId);
            $(item).siblings().removeClass('selected bot-' + userId);
            sortAndShowBagItems(userId);
        });

        $('body').on('click', '.item-filter a', function () {
            var item = $(this);
            var userId = item.parent().data('user-id');
            $(item).toggleClass('selected bot-' + userId);
            $(item).siblings().removeClass('selected bot-' + userId);
            sortAndShowBagItems(userId);
        });

        $('body').on('click', '.pokemon-orderby a', function () {
            var item = $(this);
            var userId = item.parent().data('user-id');
            $(item).addClass('selected bot-' + userId);
            $(item).siblings().removeClass('selected bot-' + userId);
            sortAndShowBagPokemon(userId);
        });

        $('body').on('click', '.pokemon-sort a', function () {
            var item = $(this);
            var userId = item.parent().data('user-id');
            $(item).addClass('selected bot-' + userId);
            $(item).siblings().removeClass('selected bot-' + userId);
            sortAndShowBagPokemon(userId);
        });

        $('body').on('click', '.pokedex-sort a', function () {
            var item = $(this);
            var userId = item.parent().data('user-id');
            $(item).addClass('selected bot-' + userId);
            $(item).siblings().removeClass('selected bot-' + userId);
            sortAndShowPokedex(userId);
        });

        $('body').on('click', '.pokedex-filter a', function () {
            var item = $(this);
            var userId = item.parent().data('user-id');
            $(item).toggleClass('selected bot-' + userId);
            $(item).siblings().removeClass('selected bot-' + userId);
            sortAndShowPokedex(userId);
        });

        // Binding toggle for socket connections
        $('body').on('click', '.toggle-connection', function () {
            var item = $(this),
                user_index = item.val();

            settings.users[user_index].enableSocket = item.is(':checked');

            if (settings.users[user_index].enableSocket) {
                if (typeof usersSocket[user_index] === 'undefined') {
                    self.initSocket(user_index);
                } else {
                    usersSocket[user_index].connect();
                }
            } else {
                if (typeof usersSocket[user_index] !== 'undefined') {
                    usersSocket[user_index].disconnect();
                }
            }
        });

        //Change title
        var alias = settings.users[0].alias;
        if (!alias) {
            alias = settings.users[0].username;
        }

        $("#UI-Title").empty();
        $("#UI-Title").append("&nbsp;&nbsp;");
        $("#UI-Title").append(alias);
        $("#UI-Title").append(" - Pikabot web ui");

        function findBot(user_index) {
            var coords = pathcoords[settings.users[user_index].username][pathcoords[settings.users[user_index].username].length - 1];
            currentUserId = user_index;

            //Change title
            var alias = settings.users[user_index].alias;

            if (!alias) {
                alias = settings.users[user_index].username;
            }

            $("#UI-Title").empty();
            $("#UI-Title").append("&nbsp;&nbsp;");
            $("#UI-Title").append(alias);
            $("#UI-Title").append(" - Pikabot web ui");

            self.map.setZoom(settings.zoom);
            self.map.panTo({
                lat: parseFloat(coords.lat),
                lng: parseFloat(coords.lng)
            });
        };

        function buildMenu(user_id, menu) {
            var out = '';
            $("#submenu").show();

            switch (menu) {
                case 1:
                    var current_user_stats = user_data[settings.users[user_id].username].stats[0].inventory_item_data.player_stats;
                    $('#subtitle').html($("div.bot-name").find("[data-bot-id='" + settings.users[user_id].username + "']").html());
                    $('#sortButtons').html('');
                    $('#filterButtons').html('');

                    var xps = '';
                    if ((user_id in user_xps) && user_xps[user_id].length) {
                        var xp_first = user_xps[user_id][0];
                        var xp_last = user_xps[user_id][user_xps[user_id].length - 1];
                        var d_xp = xp_last.xp - xp_first.xp;
                        var d_t = xp_last.t - xp_first.t;
                        xps = 'XP/H: ' + (Math.round(360000 * d_xp / d_t) / 100 || 0) + ' (earned ' + d_xp + ' XP in last ' + Math.round(d_t) + ' s)';
                    }

                    out += '<div class="trainerinfo col s12">' +
                        'Level: ' + current_user_stats.level + '<br>' +
                        'Exp to Lvl ' + (parseInt(current_user_stats.level, 10) + 1) + ': ' +
                        (current_user_stats.experience - levelXpArray[current_user_stats.level - 1].current_level_xp) +
                        ' / ' + levelXpArray[current_user_stats.level - 1].exp_to_next_level + '<br>' +
                        'Total Exp: ' + current_user_stats.experience + '<br>' +
                        xps + '<br>' +
                        '<div class="progress botbar-' + user_id + '" style="height: 10px"> <div class="determinate bot-' + user_id + '" style="width: ' +
                        ((current_user_stats.experience - levelXpArray[current_user_stats.level - 1].current_level_xp) /
                            levelXpArray[current_user_stats.level - 1].exp_to_next_level) * 100 +
                        '%"></div>';

                    for (var i = 0; i < badgesArray.length; i++) {
                        if (badgesArray[i]['disabled'] == 'true') {
                            continue;
                        }

                        var playerstat = badgesArray[i]['Playerstat'];
                        var current_value = 0;

                        if (playerstat == 'pokemon_caught_by_type' && typeof current_user_stats[playerstat] !== 'undefined') {
                            current_value = current_user_stats[playerstat][badgesArray[i]['Pokemontype']];
                        } else if (playerstat == 'pikachu_caught') {
                            var pikachu_entry = user_data[settings.users[user_id].username].pokedex.filter(function (obj) {
                                return obj.inventory_item_data.pokedex_entry.pokemon_id === 25;
                            });

                            if (pikachu_entry.length === 1) {
                                current_value = pikachu_entry[0].inventory_item_data.pokedex_entry.times_captured;
                            }

                        } else if (playerstat == 'unown_caught') {
                            var unown_entry = user_data[settings.users[user_id].username].pokedex.filter(function (obj) {
                                return obj.inventory_item_data.pokedex_entry.pokemon_id === 201;
                            });

                            if (unown_entry.length === 1) {
                                current_value = unown_entry[0].inventory_item_data.pokedex_entry.times_captured;
                            }

                        } else if (playerstat == 'gym_hours_defended') {
                            var gym_def_ms_to_hours = user_data[settings.users[user_id].username].stats[0].inventory_item_data.player_stats.total_defended_ms / 1000 / 60 / 60;
                            current_value = Math.round(gym_def_ms_to_hours);
                        } else {
                            current_value = current_user_stats[playerstat];
                        }

                        current_value = +(parseFloat((typeof current_value === 'undefined') ? 0 : current_value).toFixed(2))

                        var thresholds = badgesArray[i]['Thresholds'];
                        var current_goal = 0;

                        for (var j = 0; j < thresholds.length; j++) {
                            current_goal = j;
                            if (current_value < thresholds[j]) {
                                break;
                            }
                        }

                        out += '<div class="badge col s12 m6 l3 center">' +
                            '<img src="image/trainer/b' + (current_value >= thresholds[2] ? 3 : current_goal) + '.png" class="item_img"><br>' +
                            '<b>' + badgesArray[i]['Name'] + '</b><br>' +
                            badgesArray[i]['Description'] + '<br>' +
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
                    sortAndShowBagItems(user_id);
                    break;

                case 3:
                    var pkmnTotal = user_data[settings.users[user_id].username].bagPokemon.length;
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

                    var orderBy = '<div class="col s12 pokemon-orderby chips" data-user-id="' + user_id + '">OrderBy : ' 
                    + '<a class="chip selected bot-' + user_id + '" href="#" data-order="as">Ascending</a>' 
                    + '<a class="chip" href="#" data-order="ds">Descending</a>'

                    $('#sortButtons').html(orderBy);
                    $('#filterButtons').html(sortButtons);
                    sortAndShowBagPokemon(user_id);
                    break;

                case 4:
                    var pkmnTotal = user_data[settings.users[user_id].username].pokedex.length;
                    $('#subtitle').html('Pokedex ' + pkmnTotal + ' / 386');

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
                    sortAndShowPokedex(user_id);

                    break;
                default:
                    break;
            }
        };

        function sortAndShowBagItems(user_id) {

            var current_user_bag_items = user_data[settings.users[user_id].username].bagItems;

            for (var i = 0; i < current_user_bag_items.length; i++) {
                var item_id = current_user_bag_items[i].inventory_item_data.item.item_id;
                var item = $.grep(itemsArray, function (e) { return e.id == item_id; })[0];
                current_user_bag_items[i].inventory_item_data.item.name = item.name;
                current_user_bag_items[i].inventory_item_data.item.category = item.category;
            }

            var sortBy = $(".item-sort a.selected").data("sort");

            current_user_bag_items.sort(function (a, b) {
                var aSortBy = a.inventory_item_data.item[sortBy];
                var bSortBy = b.inventory_item_data.item[sortBy];
                return ((aSortBy < bSortBy) ? -1 : ((aSortBy > bSortBy) ? 1 : 0));
            });

            var out = '<div class="items"><div class="row">';
            var bagItemCount = 0;

            for (var i = 0; i < current_user_bag_items.length; i++) {
                var item = current_user_bag_items[i].inventory_item_data.item;

                if ($(".item-filter a.selected").data("filter") === 'possession' && item.count === 0) {
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

            $('#subtitle').html(bagItemCount + " item" + (bagItemCount !== 1 ? "s" : "") + " in bag");
            $('#subcontent').html(out);
        };

        function sortAndShowBagPokemon(user_id) {
            var eggs = 0,
                eggs10 = 0,
                eggs5 = 0,
                eggs2 = 0,
                sortedPokemon = [],
                out = '',
                user = user_data[settings.users[user_id].username],
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
                    pkmnName = pokemonArray[pkmID - 1].Name,
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
                    pkmFavorite = pokemonData.favorite || 0,
                    pkmIsBad = pokemonData.is_bad || false,
                    pkmShiny = pokemonData.pokemon_display.shiny || false;

                //ptd = pokemonTemplateData wich is from pokemonArray[index-1]
                var ptd = pokemonArray[pkmID - 1];

                var pkmDateCaptured = new Date(pokemonData.creation_time_ms);
                var pkmTypeI = ptd['Type I'][0];

                if (typeof ptd['Type II'] !== 'undefined') {
                    pkmTypeII = ptd['Type II'][0];
                } else {
                    pkmTypeII = '';
                }

                var pkmWeakness = ptd.Weaknesses,
                    pkmBaseAttack = ptd.BaseAttack,
                    pkmBaseDefense = ptd.BaseDefense,
                    pkmBaseStamina = ptd.BaseStamina;

                var worst_cp = calc_cp(pkmBaseAttack, pkmBaseDefense, pkmBaseStamina, 0, 0, 0, pkmCPMultiplier),
                    perfect_cp = calc_cp(pkmBaseAttack, pkmBaseDefense, pkmBaseStamina, 15, 15, 15, pkmCPMultiplier),
                    current_cp = calc_cp(pkmBaseAttack, pkmBaseDefense, pkmBaseStamina, pkmIVA, pkmIVD, pkmIVS, pkmCPMultiplier),
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
                    "candy": getCandy(pkmID, user_id),
                    "move1": move1ID,
                    "move2": move2ID,
                    "type1": pkmTypeI,
                    "type2": pkmTypeII,
                    "weakness": pkmWeakness,
                    "favorite": pkmFavorite,
                    "date_captured": pkmDateCaptured.customFormat("#YYYY#/#MM#/#DD# #hhhh#:#mm#:#ss#"),
                    "is_bad": pkmIsBad,
                    "is_shiny": pkmShiny,
                });
            }

            var sortby = typeof $(".pokemon-sort a.selected").data("sort") != "undefined" ? $(".pokemon-sort a.selected").data("sort") : '';
            var orderby = typeof $(".pokemon-orderby a.selected").data("order") != "undefined" ? $(".pokemon-orderby a.selected").data("order") : 'as';
            sortedPokemon.sort(function (a, b) {
                if (sortby != '' && sortby != "cp") {
                    if(orderby == 'as'){
                        if (a[sortby == "time" ? "creation_time" : sortby] < b[sortby == "time" ? "creation_time" : sortby]) return -1;
                        if (a[sortby == "time" ? "creation_time" : sortby] > b[sortby == "time" ? "creation_time" : sortby]) return 1;
                    }else{
                        if (a[sortby == "time" ? "creation_time" : sortby] > b[sortby == "time" ? "creation_time" : sortby]) return -1;
                        if (a[sortby == "time" ? "creation_time" : sortby] < b[sortby == "time" ? "creation_time" : sortby]) return 1;
                    }                    
                }

                if (sortby == '' || sortby == 'cp' || sortby != 'candy' && sortby != 'iv' && sortby != 'time' && sortby != 'lvl') {
                    if (orderby == 'as'){
                        if (a.cp < b.cp) return -1;
                        if (a.cp > b.cp) return 1;
                    }else{
                        if (a.cp > b.cp) return -1;
                        if (a.cp < b.cp) return 1;
                    }
                }
                return 0;
            });

            for (var i = 0; i < sortedPokemon.length; i++) {
                var pSorted = sortedPokemon[i];
                var pkmnNum = pSorted.id,
                    pkmnImage = pad_with_zeroes(pkmnNum, 3),
                    pkmnName = pokemonArray[pkmnNum - 1].Name,
                    pkmnLvl = pSorted.lvl,
                    pkmnCP = pSorted.cp,
                    pkmnIV = pSorted.iv,
                    pkmnIVA = pSorted.attack,
                    pkmnIVD = pSorted.defense,
                    pkmnIVS = pSorted.stamina,
                    pkmnHP = pSorted.health,
                    pkmnMHP = pSorted.max_health,
                    move1ID = pSorted.move1,
                    move2ID = pSorted.move2,
                    pkmnUnique = pSorted.unique_id,
                    pkmnTypeI = pSorted.type1,
                    pkmnTypeII = pSorted.type2,
                    pkmnWeakness = pSorted.weakness,
                    candyNum = getCandy(pkmnNum, user_id),
                    pkmnDateCaptured = pSorted.date_captured;

                var outWeakness = '<b>Weaknesses:</b><br>',
                    newLine = '';

                for (var x = 0; x < pkmnWeakness.length; x++) {
                    outWeakness += getType(pkmnWeakness[x]) + newLine;
                }

                out += '<div class="col s12 m6 l3 center" data-uniqueid="' + pkmnUnique + '" style="position: relative;">';
                if (pSorted.favorite) {
                    out += '<span class="favorite"><img src="image/trainer/favorite.png"></span>';
                }
                if (pSorted.is_bad) {
                    out += '<div style="height:80px; width:80px;"><img src="image/pokemon/' + pkmnImage + '.png"' +
                        'class="png_img" style="position:absolute;">' +
                        '<img src="image/trainer/is_bad.png" class="png_img" style="position:absolute;"></div></br>'
                } else if (pSorted.is_shiny) {
                    out += '<img src="image/pokemon/' + pkmnImage + '_shiny.png" class="png_img"></br>'
                } else {
                    out += '<img src="image/pokemon/' + pkmnImage + '.png" class="png_img"></br>'
                }
                out += '<span style="cursor: pointer;" class="tooltipped" data-html="true" data-tooltip="' + outWeakness + '"><b>' +
                    pkmnName + ' [ Lv.' + pkmnLvl + ' ]</b></span>' +
                    '<br>' + getType(pkmnTypeI);
                if (pkmnTypeII != '') {
                    out += getType(pkmnTypeII);
                }

                var move1STAB = '';
                var move2STAB = '';
                var move1DPSwSTAB = '';
                var move2DPSwSTAB = '';

                if (moveList[move1ID].type.toLowerCase() == pkmnTypeI.toLowerCase() || moveList[move1ID].type.toLowerCase() == pkmnTypeII.toLowerCase()) {
                    move1STAB = (moveList[move1ID].damage * 1.25);
                    move1DPSwSTAB = parseFloat(move1STAB / parseFloat(moveList[move1ID].duration / 1000).toFixed(2)).toFixed(2);
                }

                if (moveList[move2ID].type.toLowerCase() == pkmnTypeI.toLowerCase() || moveList[move2ID].type.toLowerCase() == pkmnTypeII.toLowerCase()) {
                    move2STAB = (moveList[move2ID].damage * 1.25);
                    move2DPSwSTAB = parseFloat(move2STAB / parseFloat(moveList[move2ID].duration / 1000).toFixed(2)).toFixed(2);
                }

                out += '<br><div class="progress pkmn-progress pkmn-' + pkmnNum + '" style="margin: 0.25rem auto; width: 70%;"> <div class="determinate pkmn-' + pkmnNum + '" style="width: ' + (pkmnHP / pkmnMHP) * 100 + '%"></div> </div>' +
                    '<b>HP:</b> ' + pkmnHP + ' / ' + pkmnMHP +
                    '<br/><b>CP: </b>' + pkmnCP +
                    '<br/><b>IV: </b>' + (pkmnIV >= 0.8 ? '<span style="color: #039be5">' + pkmnIV + '</span>' : pkmnIV) +
                    '<br/><b>A/D/S: </b>' + pkmnIVA + '/' + pkmnIVD + '/' + pkmnIVS +
                    '<br><b>Candy: </b>' + candyNum +
                    '<br>' + pkmnDateCaptured +
                    '<br><span style="background-color: #dadada; display: block; margin: 0 5px 5px; padding-bottom: 2px;"><b>Moves:</b><br>' +
                    '<span style="cursor: pointer;" class="tooltipped" data-html="true" data-position="right" data-tooltip="<b>Type:</b> ' + getType(moveList[move1ID].type) + '<br><b>Damage:</b> ' + moveList[move1ID].damage;

                if (move1STAB != '') {
                    out += '<br><b>STAB:</b> ' + move1STAB;
                }

                out += '<br><b>Energy Gained:</b> ' + moveList[move1ID].energy + '<br><b>Cooldown:</b> ' + parseFloat(moveList[move1ID].duration / 1000).toFixed(2) + 's<br><b>DPS:</b> ' + parseFloat(moveList[move1ID].dps).toFixed(2);

                if (move1DPSwSTAB != '') {
                    out += '<br><b>DPS (w/STAB):</b> ' + move1DPSwSTAB;
                }

                out += '">' + moveList[move1ID].name + ' [ ' + moveList[move1ID].damage + ' ]</span><br>' +
                    '<span style="cursor: pointer;" class="tooltipped" data-html="true" data-position="right" data-tooltip="<b>Type:</b> ' + getType(moveList[move2ID].type) + '<br><b>Damage:</b> ' + moveList[move2ID].damage;

                if (move2STAB != '') {
                    out += '<br><b>STAB:</b> ' + move2STAB;
                }

                out += '<br><b>Energy Used:</b> ' + moveList[move2ID].energy + '<br><b>Cooldown:</b> ' + parseFloat(moveList[move2ID].duration / 1000).toFixed(2) + 's<br><b>DPS:</b> ' + parseFloat(moveList[move2ID].dps).toFixed(2);

                if (move2DPSwSTAB != '') {
                    out += '<br><b>DPS (w/STAB):</b> ' + move2DPSwSTAB;
                }
                out += '">' + moveList[move2ID].name + ' [ ' + moveList[move2ID].damage + ' ]</span>' +
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

            for (var b = 0; b < incubators.length; b++) {
                var incubator = incubators[b];
                if (!incubator.item_id) {
                    incubator = incubators[0];
                }
                var current_user_stats = user_data[settings.users[user_id].username].stats[0].inventory_item_data.player_stats;
                var totalToWalk = incubator.target_km_walked - incubator.start_km_walked;
                var kmsLeft = incubator.target_km_walked - current_user_stats.km_walked;
                var walked = totalToWalk - kmsLeft;
                var eggString = '';
                if (typeof incubator.start_km_walked !== 'undefined') {
                    eggString += '<b>' + (parseFloat(walked).toFixed(2) || 0) + "/" + (parseFloat(totalToWalk).toFixed(1) || 0) + " km</b><br>";
                } else {
                    eggString += '<b>Not in use</b><br>';
                }
                var img = '901_full';
                if (incubator.item_id == 902) {
                    img = '902_full';
                    eggString += '<b>Uses Remaining:</b> ' + incubator.uses_remaining;
                } else if (incubator.item_id == 903) {
                    img = '903_full';
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
            $('.tooltipped').tooltip({ delay: 10, html: true });
        };

        function sortAndShowPokedex(user_id) {
            var out = '',
                sortedPokedex = [],
                user_id = (user_id || 0),
                user = user_data[settings.users[user_id].username];

            sortedPokedex = pokemonArray.slice().map(function (pokemon) {
                pokemon.enc = 0;
                pokemon.cap = 0;
                return pokemon;
            });

            out = '<div class="items"><div class="row">';

            for (var i = 0; i < user.pokedex.length; i++) {
                var pokedex_entry = user.pokedex[i].inventory_item_data.pokedex_entry,
                    pkmID = pokedex_entry.pokemon_id;

                sortedPokedex[pkmID - 1].cap = pokedex_entry.times_captured || 0;
                sortedPokedex[pkmID - 1].enc = pokedex_entry.times_encountered || 0;
            }

            var sortby = typeof $(".pokedex-sort a.selected").data("sort") != 'undefined' ? $(".pokedex-sort a.selected").data("sort") : '';

            sortedPokedex.sort(function (a, b) {
                if (sortby == 'name' || sortby == 'enc' || sortby == "cap") {
                    if (a[sortby == 'name' ? "Name" : sortby] < b[sortby == 'name' ? "Name" : sortby]) return -1;
                    if (a[sortby == 'name' ? "Name" : sortby] > b[sortby == 'name' ? "Name" : sortby]) return 1;
                    return 0;
                } else {
                    return a.Number - b.Number;
                }
            });

            var filtered = 0,
                filter = $(".pokedex-filter a.selected").data("filter"),
                pkmnTotal = 386;

            if ($(".pokedex-filter a.selected").length === 0) {
                pkmnTotal = user_data[settings.users[user_id].username].stats[0].inventory_item_data.player_stats.unique_pokedex_entries;
            }

            for (var i = 0; i < sortedPokedex.length; i++) {
                var pSorted = sortedPokedex[i];
                var pkmnNum = pSorted.Number,
                    pkmnImage = pkmnNum + '.png',
                    pkmnName = pSorted.Name,
                    pkmnEnc = pSorted.enc,
                    pkmnCap = pSorted.cap,
                    pkmnBuddyDist = pSorted.BuddyDistanceNeeded,
                    candyNum = getCandy(parseInt(pkmnNum), user_id) || 0;

                if ((filter === 'seen' && pkmnEnc === 0) || (filter === 'unseen' && pkmnEnc > 0) || (filter === 'caught' && pkmnCap === 0) || (filter === 'uncaught' && pkmnCap > 0)) {
                    filtered++;
                    continue;
                }

                out += '<div class="col s12 m6 l3 center"><img src="image/pokemon/' +
                    pkmnImage +
                    '" class="png_img' +
                    (pkmnEnc ? '' : ' gray') +
                    '"><br><b> ' +
                    pkmnNum +
                    ' ' +
                    pkmnName +
                    '</b><br>Times seen: ' +
                    pkmnEnc +
                    '<br>Times caught: ' +
                    pkmnCap +
                    '<br>Candy: ' +
                    candyNum +
                    '<br>Buddy distance: ' +
                    pkmnBuddyDist +
                    '</div>';
            }
            out += '</div></div>';
            var nth = 0;
            out = out.replace(/<\/div><div/g, function (match, i, original) {
                nth++;
                return (nth % 4 === 0) ? '</div></div><div class="row"><div' : match;
            });
            $('#subcontent').html(out);
            $('#subtitle').html('Pokedex ' + (pkmnTotal - filtered) + ' / 386');
        }
    };

    //initilize the Google map ui and api
    MapView.prototype.initMap = function () {
        self.map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 50.0830986,
                lng: 6.7613762
            },
            zoom: 8
        });

        self.placeTrainer();
        self.addCatchable();
        self.placeEvents();

        setInterval(self.placeTrainer, 10000);
        setInterval(self.placeEvents, 2500);
        setInterval(self.addCatchable, 15000);
        setInterval(self.addInventory, 15000);
    };

    //initilizes the default settings
    MapView.prototype.initSettings = function () {
        gVars = new GlobalVars();
        gVars.loadJsonFileVars();

        settings = $.extend(true, settings, userInfo);
    };

    //initilizing socket for user index (for multi bot)
    MapView.prototype.initSocket = function (user_key) {
        if (typeof settings.users != "undefined" && settings.users != undefined && settings.users != null)
            if (typeof settings.users.length > user_key)
                if (typeof settings.users[user_key] != "undefined" && settings.users[user_key] != undefined && settings.users[user_key] != null)
                    SocketIOUsers.createUser(settings.users[user_key], this);
    };

    MapView.prototype.initSockets = function () {
        if (typeof settings.users != "undefined" && settings.users != undefined && settings.users != null)
            usersSocket = SocketIOUsers.init(settings.users, this);
    };

    MapView.prototype.getEventsColors = function () {
        if (gVars != null && gVars != undefined && typeof gVars != "undefined")
            if (gVars.eventsColors != null && gVars.eventsColors != undefined && typeof gVars.eventsColors != "undefined")
                return gVars.eventsColors;

        return {};
    };

    //MapView function helpers
    MapView.prototype.log = function (log_object) {
        var timeout = typeof log_object.timeout == 'undefined' ? 3000 : log_object.timeout;
        var logColor = typeof log_object.color !== 'undefined' && log_object.color != '' ? logColor = 'color: ' + log_object.color + ';' : '';
        var logBGColor = typeof log_object.bgcolor !== 'undefined' && log_object.bgcolor != '' ? logBGColor = 'background-color: ' + log_object.bgcolor + ';' : '';
        var currentDate = new Date();
        var time = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + (currentDate.getMinutes())).slice(-2);

        $("#logs-output").prepend("<div class='log-item'>\
            <span class='log-date'>" + time + "</span><p style='" + logColor + "padding: 2px 5px;" + logBGColor + "'>" + log_object.message + "</p></div>");
        if (!$('#logs-panel').is(":visible")) {
            //Materialize.toast(log_object.message, timeout);
        }

        logCount = $(".log-item").length;

        if (logCount > 100) {
            $(".log-item:last-child").remove();
        }
    };

    MapView.prototype.errorHandler = function (err) {
        console.error(err);
    };

    MapView.prototype.filter = function (arr, search) {

        var filtered = [];

        for (var i = 0; i < arr.length; i++) {
            if (search === 'pokemon') {
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
    };

    function getCandy(p_num, user_id) {
        var user = user_data[settings.users[user_id].username];

        for (var i = 0; i < user.bagCandy.length; i++) {
            var checkCandy = user.bagCandy[i].inventory_item_data.candy.family_id;
            if (pokemoncandyArray[p_num] === checkCandy) {
                return (user.bagCandy[i].inventory_item_data.candy.candy || 0);
            }
        }
    };

    function getType(p_type) {
        if (typeof p_type !== 'undefined') {
            return '<span class=\'move-type\' style=\'background-color:' + gVars.moveTypes[p_type.toLowerCase()] + ';\'>' + p_type + '</span>';
        }
        return '';
    };

    function calc_cp(base_attack, base_defense, base_stamina, iv_attack, iv_defense, iv_stamina, cp_multiplier) {
        var bAttack = (base_attack + iv_attack),
            bDefense = Math.sqrt(base_defense + iv_defense),
            bStamina = Math.sqrt(base_stamina + iv_stamina),
            cpMulti = Math.pow(cp_multiplier, 2);

        return (bAttack * bDefense * bStamina * cpMulti / 10);
    };
};
