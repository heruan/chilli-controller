"use strict";

System.register(["./core-md5"], function (_export, _context) {
  var md5;


  function str2hex(str) {
    var hex_tab = "0123456789abcdef";
    var hex = '';
    var val;
    for (var i = 0; i < str.length; i++) {
      val = str.charCodeAt(i);
      hex = hex + hex_tab.charAt(val / 16);
      hex = hex + hex_tab.charAt(val % 16);
    }
    return hex;
  }

  function hex2binl(hex) {
    hex = hex.toLowerCase();
    hex = hex.replace(/ /g, '');

    var bin = [];

    for (i = 0; i < hex.length * 4; i = i + 8) {
      octet = parseInt(hex.substr(i / 4, 2), 16);
      bin[i >> 5] |= (octet & 255) << i % 32;
    }
    return bin;
  }

  function binl2hex(binarray) {
    var hex_tab = "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 0xF);
    }
    return str;
  }
  return {
    setters: [function (_coreMd) {
      md5 = _coreMd.md5;
    }],
    execute: function () {
      function chap(ident, password, challenge) {
        var hexPassword = str2hex(password);

        var hex = ident + hexPassword + challenge;
        var bin = hex2binl(hex);
        var md5 = md5(bin, hex.length * 4);

        return binl2hex(md5);
      }
      _export("chap", chap);
    }
  };
});