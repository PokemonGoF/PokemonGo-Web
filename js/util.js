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
