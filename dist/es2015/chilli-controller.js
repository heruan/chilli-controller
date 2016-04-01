var _class, _temp;

import { HttpClient } from "aurelia-http-client";
import { chap } from "./chap";

export let ChilliController = (_temp = _class = class ChilliController {

  constructor(host, port = 3990, ssl = false, ident = "00") {
    this.api = new HttpClient();
    this.host = host;
    this.port = port;
    this.ssl = ssl;
    this.ident = ident;
    this.api.configure(api => {
      let baseUrl = (this.ssl ? "https://" : "http://") + this.host + ":" + this.port + "/json";
      api.withBaseUrl(baseUrl);
    });
  }

  logon(username, password, options = {}) {
    if (options.protocol) {
      let valid = ~Pepper.authProtocols.indexOf(options.protocol.toLowerCase());
      if (!valid) {
        return Promise.reject(new Error("Invalid or unsupported authentication protocol"));
      }
    }
    let protocol = options.protocol ? options.protocol.toLowerCase() : "chap";
    return this.status().then(status => {
      if (!status.challange) {
        throw new Error("Cannot find a challange");
      } else if (status.clientState === Pepper.stateCodes.AUTH) {
        throw new Error("Current clientState is already %d", Pepper.stateCodes.AUTH);
      }
      if (this.uamservice && protocol === "chap") {
        throw new Error("Not supported yet: uamservice");
      } else {
        let payload = {
          username: username
        };
        if (protocol === "chap") {
          payload.response = chap(this.ident, password, status.challange);
        } else {
          payload.password = password;
        }
        return this.api.createRequest("logon").asGet().asJsonp("jsoncallback").withParams(payload).send().then(success => success.content);
      }
    });
  }

  logoff() {
    return this.api.jsonp("logoff").then(success => success.content);
  }

  status() {
    return this.api.jsonp("status").then(success => success.content);
  }

}, _class.stateCodes = {
  UNKNOWN: -1,
  NOT_AUTH: 0,
  AUTH: 1,
  AUTH_PENDING: 2,
  AUTH_SPLASH: 3
}, _class.authProtocols = ["pap", "chap"], _temp);