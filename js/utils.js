var rtlprogress = {
  resolved: 0,
  new: 0,

  loadJson: function(href, callback) {
    if (!callback)
      return;
    var xhr = new XMLHttpRequest();
    xhr.onerror = function() {
      console.error('Failed to fetch file: ' + href, xhr.statusText);
    };
    xhr.onload = function() {
      callback(JSON.parse(xhr.response.body.getElementsByTagName('pre')[0].innerHTML));
    };
    xhr.open('GET', href); // async
    xhr.responseType = 'document';
    xhr.send();
  },
  parse: function(obj) {
    for (i = 0; i < obj.bugs.length; i++) {
      if ((obj.bugs[i].status == "RESOLVED") || (obj.bugs[i].status == "VERIFIED")) {
        rtlprogress.resolved++;
      } else {
        rtlprogress.new++;
      }
    }
    var finalP = parseInt((rtlprogress.resolved / obj.bugs.length) * 100);
    var oldvalue = parseInt(document.getElementById('progress-in').style.width);
    document.getElementById('progress-in').style.width = finalP + "%";
    document.getElementById('progress-val').innerHTML = finalP + "%";
    document.getElementById('headerTitle').innerHTML = "RTL Watch: " + finalP + "%";
    document.getElementById('open-bugs').innerHTML = rtlprogress.new;
    document.getElementById('solved-bugs').innerHTML = rtlprogress.resolved;

  },
  init: function(){
    rtlprogress.loadJson("https://bugzilla.mozilla.org/rest/bug?blocks=906270&include_fields=status", rtlprogress.parse);
  }
};

window.addEventListener('load', function rwOnLoad(evt) {
  window.removeEventListener('load', rwOnLoad);
  Tabzilla.disableEasterEgg();
  // Other arguments that can be added to include_flieds are resolution,id,summary
  rtlprogress.init();
});
