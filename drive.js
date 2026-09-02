// Turns a pasted Google Drive share link into an inline-thumbnail URL.
// Shared by index.html and admin.html so both render images the same way.
//
// Google Drive's /thumbnail endpoint is unofficial (no published contract,
// no API key needed) but is what most small tools use for exactly this --
// it only works for files shared "Anyone with the link can view." If a
// link can't be parsed, or the thumbnail request fails, callers should
// fall back to a plain "Open image" link to the original URL rather than
// a broken image icon -- see driveThumbUrl() usage in index.html/admin.html
// for the <img onerror> fallback pattern.

function driveFileId(url) {
  if (!url || typeof url !== 'string') return null;
  var patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{10,})/,   // .../file/d/FILE_ID/view
    /[?&]id=([a-zA-Z0-9_-]{10,})/,        // .../open?id=FILE_ID or .../uc?id=FILE_ID
    /\/d\/([a-zA-Z0-9_-]{10,})/           // fallback: any .../d/FILE_ID/...
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = url.match(patterns[i]);
    if (m) return m[1];
  }
  return null;
}

function driveThumbUrl(url, size) {
  var id = driveFileId(url);
  if (!id) return null;
  return 'https://drive.google.com/thumbnail?id=' + id + '&sz=w' + (size || 800);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { driveFileId: driveFileId, driveThumbUrl: driveThumbUrl };
}
