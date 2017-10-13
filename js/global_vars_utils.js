function GlobalVars() {    
    this.moveTypes = null;
    this.eventsColors = null;

    this.errorHandler = function(err){
        console.log(err);
    };    
}

GlobalVars.prototype.loadJsonFileVars = function () {
    var self = this;

    loadJSON('config/config.json?' + Date.now(), function (data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {                
                switch (key) {
                    case "moveTypes":
                        self.moveTypes = data[key];
                        break;

                    case "eventsColors":
                        self.eventsColors = data[key];
                        break;

                    default:
                        break;
                }
            }
        }
    }, self.errorHandler);
};