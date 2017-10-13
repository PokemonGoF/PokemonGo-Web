function SocketIOUsers() {
};

SocketIOUsers.prototype.init = function (users, mapView) {
    var usersSocket = [];

    for (var key in users) {
        if (users.hasOwnProperty(key)) {
            var user = users[key];
            var userSocket = this.createUser(user, mapView);

            if (usersSocket != undefined && usersSocket != null && typeof userSocket != "undefined")
                usersSocket[key] = usersSocket
        }
    }

    return usersSocket;
};

//user is element from the userInfo.users object
SocketIOUsers.prototype.createUser = function (user, self) {
    if (!user.enable || !user.enableSocket)
        return undefined;

    var retry_time = 30,
        prevMsg = '',
        timeOut = 5000,
        bgColor = '',
        eventsColors = self.getEventsColors(),
        isConnected = false,
        logThis = /(egg_hatched|pokemon_appeared|pokemon_caught|pokemon_fled|pokemon_vanished|vip_pokemon|level_up|bot_sleep|show_best_pokemon|show_inventory|no_pokeballs|bot_sleep|bot_random_pause|api_error|pokemon_release|future_pokemon_release|bot_random_alive_pause|next_egg_incubates|spun_pokestop|path_lap_end|gained_candy|used_lucky_egg|lured_pokemon_found|softban|pokemon_inventory_full|inventory_full|buddy_next_reward|buddy_candy_earned|buddy_pokemon|buddy_update|buddy_reward|buddy_walked)/;

    var user_io = io.connect(user.socketAddress, { 'reconnectionAttempts': 5 });

    user_io.on('connect', function (event) {
        var thisSocket = this;
        isConnected = true;

        self.log({
            message: "<span style='color: green;'><b>Connected to '" + thisSocket.io.uri + "'...</b></span>",
            timeout: 3000
        });
    });

    user_io.on('disconnect', function (event) {
        isConnected = false;
        var thisSocket = this;
        self.log({
            message: "<span style='color: red;'><b>Disconnected from '" + thisSocket.io.uri + "'... Trying to reconnect, please wait...</b></span>",
            timeout: 3000
        });
    });

    user_io.on('reconnect_failed', function (event) {
        var thisSocket = this;
        if (!isConnected) {
            self.log({
                message: "<span style='color: red;'><b>Connecting to '" + thisSocket.io.uri + "' failed. Retrying after " + retry_time + " seconds.</b></span>",
                timeout: 3000
            });

            setTimeout(function () {
                reconnectSocket();
            }, retry_time * 1000);
        }
    });

    function reconnectSocket() {
        self.log({
            message: "<span style='color: blue;'><b>Reconnecting to " + user_io.io.uri + "...</b></span>",
            timeout: 3000
        });
        user_io.connect({
            'reconnectionAttempts': 5
        });
    };

    for (var k in eventsColors) {
        if (eventsColors.hasOwnProperty(k)) {
            if (typeof user_io !== 'undefined') {
                user_io.on(k + ':' + user.username, function (data) {
                    if (data['event'] == 'log_stats') {
                        $("div.bot-name").find("[data-bot-id='" + data['account'] + "']").text(data['data']['stats_raw']['username'])
                    }
                    if (data['data']['msg'] != null && data['data']['msg'] !== prevMsg) {
                        var renk = eventsColors[data['event']];
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

                        prevMsg = data['data']['msg'];
                    }
                });
            }
        }
    }

    return user_io;
};

var SocketIOUsers = new SocketIOUsers();