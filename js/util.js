function loadJSON(path, success, error, successData) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success)
          success(
            JSON.parse(xhr.responseText.replace(/\bNaN\b/g, 'null')),
            successData
          );
      } else {
        if (error)
          error(xhr);
      }
    }
  };
  xhr.open('GET', path, true);
  xhr.send();
}

function loadUserJsonData(settings,type, successcb, errcb, key) {
  if (settings.users != undefined && settings.users != null && typeof settings.users != "undefined") {
      for (var kuser in settings.users) {
          if (settings.users.hasOwnProperty(kuser)) {
              var user = settings.users[kuser];
              if(user.enable)
                loadJSON(type + user.username + '.json?' + Date.now(), successcb, errcb, typeof key == "undefined" ? kuser : key);
          }
      }
  }
};

function pad_with_zeroes(number, length) {
  var my_string = '' + number;
  while (my_string.length < length) {
      my_string = '0' + my_string;
  }
  return my_string;
};

$('.button-collapse').sideNav({
  menuWidth: 210, // Default is 300
  edge: 'left', // Choose the horizontal origin
  closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
  draggable: true, // Choose whether you can drag to open on touch screens,
  onOpen: function (el) { /* Do Stuff */ }, // A function to be called when sideNav is opened
  onClose: function (el) { /* Do Stuff*/ }, // A function to be called when sideNav is closed
});

if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

Date.prototype.customFormat = function (formatString) {
  var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
  YY = ((YYYY = this.getFullYear()) + "").slice(-2);
  MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
  MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
  DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
  DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()]).substring(0, 3);
  th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
  formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
  h = (hhh = this.getHours());
  if (h == 0) h = 24;
  if (h > 12) h -= 12;
  hh = h < 10 ? ('0' + h) : h;
  hhhh = hhh < 10 ? ('0' + hhh) : hhh;
  AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
  mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
  ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
  return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
};