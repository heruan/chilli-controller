"use strict";

System.register(["aurelia-http-client", "./chap"], function (_export, _context) {
  var HttpClient, chap, _class, _temp, ChilliController;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaHttpClient) {
      HttpClient = _aureliaHttpClient.HttpClient;
    }, function (_chap) {
      chap = _chap.chap;
    }],
    execute: function () {
      _export("ChilliController", ChilliController = (_temp = _class = function () {
        function ChilliController(host) {
          var port = arguments.length <= 1 || arguments[1] === undefined ? 3990 : arguments[1];

          var _this = this;

          var ssl = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
          var ident = arguments.length <= 3 || arguments[3] === undefined ? "00" : arguments[3];

          _classCallCheck(this, ChilliController);

          this.api = new HttpClient();
          this.host = host;
          this.port = port;
          this.ssl = ssl;
          this.ident = ident;
          this.api.configure(function (api) {
            var baseUrl = (_this.ssl ? "https://" : "http://") + _this.host + ":" + _this.port + "/json";
            api.withBaseUrl(baseUrl);
          });
        }

        ChilliController.prototype.logon = function logon(username, password) {
          var _this2 = this;

          var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          if (options.protocol) {
            var valid = ~Pepper.authProtocols.indexOf(options.protocol.toLowerCase());
            if (!valid) {
              return Promise.reject(new Error("Invalid or unsupported authentication protocol"));
            }
          }
          var protocol = options.protocol ? options.protocol.toLowerCase() : "chap";
          return this.api.jsonp("status").then(function (success) {
            var data = success.content;
            if (!data.challange) {
              throw new Error("Cannot find a challange");
            } else if (data.clientState === Pepper.stateCodes.AUTH) {
              throw new Error("Current clientState is already %d", Pepper.stateCodes.AUTH);
            }
            if (_this2.uamservice && protocol === "chap") {
              throw new Error("Not supported yet: uamservice");
            } else {
              var payload = {
                username: username
              };
              if (protocol === "chap") {
                payload.response = chap(_this2.ident, password, data.challange);
              } else {
                payload.password = password;
              }
              return _this2.api.createRequest("logon").asGet().asJsonp("jsoncallback").withParams(payload).send().then(function (success) {
                return success.content;
              });
            }
          });
        };

        ChilliController.prototype.logoff = function logoff() {
          return this.api.jsonp("logoff").then(function (success) {
            return success.content;
          });
        };

        return ChilliController;
      }(), _class.stateCodes = {
        UNKNOWN: -1,
        NOT_AUTH: 0,
        AUTH: 1,
        AUTH_PENDING: 2,
        AUTH_SPLASH: 3
      }, _class.authProtocols = ["pap", "chap"], _temp));

      _export("ChilliController", ChilliController);
    }
  };
});