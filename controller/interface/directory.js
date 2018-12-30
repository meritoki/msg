var mkdirp = require('mkdirp');

exports.make = function (path, mask, cb) {
  if (typeof mask == 'function') {
    cb = mask;
    mask = 0777;
  }
  mkdirp(path, mask, function(err) {
    if (err) {
      if (err.code == 'EEXIST') cb(null);
      else cb(err);
    } else cb(null);
  });
}
