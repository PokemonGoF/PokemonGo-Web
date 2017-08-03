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


$('.button-collapse').sideNav({
      menuWidth: 210, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens,
      onOpen: function(el) { /* Do Stuff */ }, // A function to be called when sideNav is opened
      onClose: function(el) { /* Do Stuff*/ }, // A function to be called when sideNav is closed
    }
  );