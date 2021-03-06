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
            var valid = ~ChilliController.authProtocols.indexOf(options.protocol.toLowerCase());
            if (!valid) {
              return Promise.reject(new Error("Invalid or unsupported authentication protocol"));
            }
          }
          var protocol = options.protocol ? options.protocol.toLowerCase() : "chap";
          return this.status().then(function (status) {
            if (!status.challenge) {
              throw new Error("Cannot find a challenge");
            } else if (status.clientState === ChilliController.stateCodes.AUTH) {
              throw new Error("Current clientState is already %d", ChilliController.stateCodes.AUTH);
            }
            if (_this2.uamservice && protocol === "chap") {
              throw new Error("Not supported yet: uamservice");
            } else {
              var payload = {
                username: username
              };
              if (protocol === "chap") {
                payload.response = chap(_this2.ident, password, status.challenge);
              } else {
                payload.password = password;
              }
              return _this2.api.createRequest("logon").asGet().asJsonp(ChilliController.JSONP_CALLBACK).withParams(payload).send().then(function (success) {
                return success.content;
              });
            }
          });
        };

        ChilliController.prototype.logoff = function logoff() {
          return this.api.jsonp("logoff", ChilliController.JSONP_CALLBACK).then(function (success) {
            return success.content;
          });
        };

        ChilliController.prototype.status = function status() {
          return this.api.jsonp("status", ChilliController.JSONP_CALLBACK).then(function (success) {
            return success.content;
          });
        };

        return ChilliController;
      }(), _class.JSONP_CALLBACK = "callback", _class.stateCodes = {
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