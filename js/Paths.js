class Paths {
    constructor() {
        this.customPaths = [];
        this.customPathsLine = undefined;
        this.init();
    }

    init() {
        $('#path_add').click(this.addPathMarker);
        $('#path_delete').click(this.deletePathMarker);
        $('#paths_download').click(this.generatePathFile);
        $('#paths_clear').click(this.clearPathMarkers);
    }

    addPathMarker() {
        var self = main.paths,
            i = Object.keys(self.customPaths).length;

        self.customPaths[i] = {};

        var mapCenter = main.maps.element.getCenter();

        self.customPaths[i].marker = new google.maps.Marker({
            position: mapCenter,
            map: main.maps.element,
            draggable: true,
            clickable: true,
            title: 'Path #' + i
        });

        var contentString = '<b>Path #{0}</b><br><b>Latitude:</b> {1}<br><b>Longitude:</b> {2}';

        self.customPaths[i].infowindow = new google.maps.InfoWindow({ content: contentString.format(i, mapCenter.lat(), mapCenter.lng()) });

        google.maps.event.addListener(self.customPaths[i].marker, 'click', (function(infowindow) {
            return function() { infowindow.open(this.map, this); };
        })(self.customPaths[i].infowindow));

        google.maps.event.addListener(self.customPaths[i].marker, 'drag', (function(content, infowindow) {
            return function() {
                var thisPos = this.getPosition();
                infowindow.setContent(contentString.format(i, thisPos.lat(), thisPos.lng()));
                self.updatePathLine();
            };
        })(contentString, self.customPaths[i].infowindow));

        google.maps.event.addListener(self.customPaths[i].marker, 'dragend', (function(content, infowindow) {
            return function() {
                var thisPos = this.getPosition();
                infowindow.setContent(contentString.format(i, thisPos.lat(), thisPos.lng()));
                self.updatePathLine();
            };
        })(contentString, self.customPaths[i].infowindow));

        $('#path_delete').removeClass('disabled');
        $('#paths_download').removeClass('disabled');
        $('#paths_clear').removeClass('disabled');

        self.updatePathLine();
    }

    deletePathMarker() {
        var self = main.paths,
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
    }

    updatePathLine() {
        var self = main.paths;

        if (!Object.keys(self.customPaths).length) { // if customPaths array is empty
            self.customPathsLine.setMap(null);
            self.customPathsLine = undefined;
            return;
        }

        var ps = [];
        for (var p in self.customPaths) {
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
        self.customPathsLine.setMap(main.maps.element);
    }

    generatePathFile() {
        var self = main.paths,
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
    }

    clearPathMarkers() {
        var self = main.paths;

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
    }
}