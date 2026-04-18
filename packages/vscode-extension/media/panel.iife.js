"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // ../../node_modules/papaparse/papaparse.min.js
  var require_papaparse_min = __commonJS({
    "../../node_modules/papaparse/papaparse.min.js"(exports2, module2) {
      ((e, t) => {
        "function" == typeof define && define.amd ? define([], t) : "object" == typeof module2 && "undefined" != typeof exports2 ? module2.exports = t() : e.Papa = t();
      })(exports2, function r() {
        var n = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== n ? n : {};
        var d2, s = !n.document && !!n.postMessage, a = n.IS_PAPA_WORKER || false, o = {}, h = 0, v2 = {};
        function u(e) {
          this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
            var t = b(e2);
            t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
            this._handle = new i(t), (this._handle.streamer = this)._config = t;
          }.call(this, e), this.parseChunk = function(t, e2) {
            var i2 = parseInt(this._config.skipFirstNLines) || 0;
            if (this.isFirstChunk && 0 < i2) {
              let e3 = this._config.newline;
              e3 || (r2 = this._config.quoteChar || '"', e3 = this._handle.guessLineEndings(t, r2)), t = [...t.split(e3).slice(i2)].join(e3);
            }
            this.isFirstChunk && U2(this._config.beforeFirstChunk) && void 0 !== (r2 = this._config.beforeFirstChunk(t)) && (t = r2), this.isFirstChunk = false, this._halted = false;
            var i2 = this._partialLine + t, r2 = (this._partialLine = "", this._handle.parse(i2, this._baseIndex, !this._finished));
            if (!this._handle.paused() && !this._handle.aborted()) {
              t = r2.meta.cursor, i2 = (this._finished || (this._partialLine = i2.substring(t - this._baseIndex), this._baseIndex = t), r2 && r2.data && (this._rowCount += r2.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview);
              if (a) n.postMessage({ results: r2, workerId: v2.WORKER_ID, finished: i2 });
              else if (U2(this._config.chunk) && !e2) {
                if (this._config.chunk(r2, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = true);
                this._completeResults = r2 = void 0;
              }
              return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(r2.data), this._completeResults.errors = this._completeResults.errors.concat(r2.errors), this._completeResults.meta = r2.meta), this._completed || !i2 || !U2(this._config.complete) || r2 && r2.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), i2 || r2 && r2.meta.paused || this._nextChunk(), r2;
            }
            this._halted = true;
          }, this._sendError = function(e2) {
            U2(this._config.error) ? this._config.error(e2) : a && this._config.error && n.postMessage({ workerId: v2.WORKER_ID, error: e2, finished: false });
          };
        }
        function f(e) {
          var r2;
          (e = e || {}).chunkSize || (e.chunkSize = v2.RemoteChunkSize), u.call(this, e), this._nextChunk = s ? function() {
            this._readChunk(), this._chunkLoaded();
          } : function() {
            this._readChunk();
          }, this.stream = function(e2) {
            this._input = e2, this._nextChunk();
          }, this._readChunk = function() {
            if (this._finished) this._chunkLoaded();
            else {
              if (r2 = new XMLHttpRequest(), this._config.withCredentials && (r2.withCredentials = this._config.withCredentials), s || (r2.onload = y(this._chunkLoaded, this), r2.onerror = y(this._chunkError, this)), r2.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !s), this._config.downloadRequestHeaders) {
                var e2, t = this._config.downloadRequestHeaders;
                for (e2 in t) r2.setRequestHeader(e2, t[e2]);
              }
              var i2;
              this._config.chunkSize && (i2 = this._start + this._config.chunkSize - 1, r2.setRequestHeader("Range", "bytes=" + this._start + "-" + i2));
              try {
                r2.send(this._config.downloadRequestBody);
              } catch (e3) {
                this._chunkError(e3.message);
              }
              s && 0 === r2.status && this._chunkError();
            }
          }, this._chunkLoaded = function() {
            4 === r2.readyState && (r2.status < 200 || 400 <= r2.status ? this._chunkError() : (this._start += this._config.chunkSize || r2.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((e2) => null !== (e2 = e2.getResponseHeader("Content-Range")) ? parseInt(e2.substring(e2.lastIndexOf("/") + 1)) : -1)(r2), this.parseChunk(r2.responseText)));
          }, this._chunkError = function(e2) {
            e2 = r2.statusText || e2;
            this._sendError(new Error(e2));
          };
        }
        function l(e) {
          (e = e || {}).chunkSize || (e.chunkSize = v2.LocalChunkSize), u.call(this, e);
          var i2, r2, n2 = "undefined" != typeof FileReader;
          this.stream = function(e2) {
            this._input = e2, r2 = e2.slice || e2.webkitSlice || e2.mozSlice, n2 ? ((i2 = new FileReader()).onload = y(this._chunkLoaded, this), i2.onerror = y(this._chunkError, this)) : i2 = new FileReaderSync(), this._nextChunk();
          }, this._nextChunk = function() {
            this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
          }, this._readChunk = function() {
            var e2 = this._input, t = (this._config.chunkSize && (t = Math.min(this._start + this._config.chunkSize, this._input.size), e2 = r2.call(e2, this._start, t)), i2.readAsText(e2, this._config.encoding));
            n2 || this._chunkLoaded({ target: { result: t } });
          }, this._chunkLoaded = function(e2) {
            this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
          }, this._chunkError = function() {
            this._sendError(i2.error);
          };
        }
        function c(e) {
          var i2;
          u.call(this, e = e || {}), this.stream = function(e2) {
            return i2 = e2, this._nextChunk();
          }, this._nextChunk = function() {
            var e2, t;
            if (!this._finished) return e2 = this._config.chunkSize, i2 = e2 ? (t = i2.substring(0, e2), i2.substring(e2)) : (t = i2, ""), this._finished = !i2, this.parseChunk(t);
          };
        }
        function p(e) {
          u.call(this, e = e || {});
          var t = [], i2 = true, r2 = false;
          this.pause = function() {
            u.prototype.pause.apply(this, arguments), this._input.pause();
          }, this.resume = function() {
            u.prototype.resume.apply(this, arguments), this._input.resume();
          }, this.stream = function(e2) {
            this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
          }, this._checkIsFinished = function() {
            r2 && 1 === t.length && (this._finished = true);
          }, this._nextChunk = function() {
            this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i2 = true;
          }, this._streamData = y(function(e2) {
            try {
              t.push("string" == typeof e2 ? e2 : e2.toString(this._config.encoding)), i2 && (i2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
            } catch (e3) {
              this._streamError(e3);
            }
          }, this), this._streamError = y(function(e2) {
            this._streamCleanUp(), this._sendError(e2);
          }, this), this._streamEnd = y(function() {
            this._streamCleanUp(), r2 = true, this._streamData("");
          }, this), this._streamCleanUp = y(function() {
            this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
          }, this);
        }
        function i(m2) {
          var n2, s2, a2, t, o2 = Math.pow(2, 53), h2 = -o2, u2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, d3 = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, i2 = this, r2 = 0, f2 = 0, l2 = false, e = false, c2 = [], p2 = { data: [], errors: [], meta: {} };
          function y2(e2) {
            return "greedy" === m2.skipEmptyLines ? "" === e2.join("").trim() : 1 === e2.length && 0 === e2[0].length;
          }
          function g2() {
            if (p2 && a2 && (k2("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + v2.DefaultDelimiter + "'"), a2 = false), m2.skipEmptyLines && (p2.data = p2.data.filter(function(e3) {
              return !y2(e3);
            })), _3()) {
              let t3 = function(e3, t4) {
                U2(m2.transformHeader) && (e3 = m2.transformHeader(e3, t4)), c2.push(e3);
              };
              var t2 = t3;
              if (p2) if (Array.isArray(p2.data[0])) {
                for (var e2 = 0; _3() && e2 < p2.data.length; e2++) p2.data[e2].forEach(t3);
                p2.data.splice(0, 1);
              } else p2.data.forEach(t3);
            }
            function i3(e3, t3) {
              for (var i4 = m2.header ? {} : [], r4 = 0; r4 < e3.length; r4++) {
                var n3 = r4, s3 = e3[r4], s3 = ((e4, t4) => ((e5) => (m2.dynamicTypingFunction && void 0 === m2.dynamicTyping[e5] && (m2.dynamicTyping[e5] = m2.dynamicTypingFunction(e5)), true === (m2.dynamicTyping[e5] || m2.dynamicTyping)))(e4) ? "true" === t4 || "TRUE" === t4 || "false" !== t4 && "FALSE" !== t4 && (((e5) => {
                  if (u2.test(e5)) {
                    e5 = parseFloat(e5);
                    if (h2 < e5 && e5 < o2) return 1;
                  }
                })(t4) ? parseFloat(t4) : d3.test(t4) ? new Date(t4) : "" === t4 ? null : t4) : t4)(n3 = m2.header ? r4 >= c2.length ? "__parsed_extra" : c2[r4] : n3, s3 = m2.transform ? m2.transform(s3, n3) : s3);
                "__parsed_extra" === n3 ? (i4[n3] = i4[n3] || [], i4[n3].push(s3)) : i4[n3] = s3;
              }
              return m2.header && (r4 > c2.length ? k2("FieldMismatch", "TooManyFields", "Too many fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3) : r4 < c2.length && k2("FieldMismatch", "TooFewFields", "Too few fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3)), i4;
            }
            var r3;
            p2 && (m2.header || m2.dynamicTyping || m2.transform) && (r3 = 1, !p2.data.length || Array.isArray(p2.data[0]) ? (p2.data = p2.data.map(i3), r3 = p2.data.length) : p2.data = i3(p2.data, 0), m2.header && p2.meta && (p2.meta.fields = c2), f2 += r3);
          }
          function _3() {
            return m2.header && 0 === c2.length;
          }
          function k2(e2, t2, i3, r3) {
            e2 = { type: e2, code: t2, message: i3 };
            void 0 !== r3 && (e2.row = r3), p2.errors.push(e2);
          }
          U2(m2.step) && (t = m2.step, m2.step = function(e2) {
            p2 = e2, _3() ? g2() : (g2(), 0 !== p2.data.length && (r2 += e2.data.length, m2.preview && r2 > m2.preview ? s2.abort() : (p2.data = p2.data[0], t(p2, i2))));
          }), this.parse = function(e2, t2, i3) {
            var r3 = m2.quoteChar || '"', r3 = (m2.newline || (m2.newline = this.guessLineEndings(e2, r3)), a2 = false, m2.delimiter ? U2(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), p2.meta.delimiter = m2.delimiter) : ((r3 = ((e3, t3, i4, r4, n3) => {
              var s3, a3, o3, h3;
              n3 = n3 || [",", "	", "|", ";", v2.RECORD_SEP, v2.UNIT_SEP];
              for (var u3 = 0; u3 < n3.length; u3++) {
                for (var d4, f3 = n3[u3], l3 = 0, c3 = 0, p3 = 0, g3 = (o3 = void 0, new E2({ comments: r4, delimiter: f3, newline: t3, preview: 10 }).parse(e3)), _4 = 0; _4 < g3.data.length; _4++) i4 && y2(g3.data[_4]) ? p3++ : (d4 = g3.data[_4].length, c3 += d4, void 0 === o3 ? o3 = d4 : 0 < d4 && (l3 += Math.abs(d4 - o3), o3 = d4));
                0 < g3.data.length && (c3 /= g3.data.length - p3), (void 0 === a3 || l3 <= a3) && (void 0 === h3 || h3 < c3) && 1.99 < c3 && (a3 = l3, s3 = f3, h3 = c3);
              }
              return { successful: !!(m2.delimiter = s3), bestDelimiter: s3 };
            })(e2, m2.newline, m2.skipEmptyLines, m2.comments, m2.delimitersToGuess)).successful ? m2.delimiter = r3.bestDelimiter : (a2 = true, m2.delimiter = v2.DefaultDelimiter), p2.meta.delimiter = m2.delimiter), b(m2));
            return m2.preview && m2.header && r3.preview++, n2 = e2, s2 = new E2(r3), p2 = s2.parse(n2, t2, i3), g2(), l2 ? { meta: { paused: true } } : p2 || { meta: { paused: false } };
          }, this.paused = function() {
            return l2;
          }, this.pause = function() {
            l2 = true, s2.abort(), n2 = U2(m2.chunk) ? "" : n2.substring(s2.getCharIndex());
          }, this.resume = function() {
            i2.streamer._halted ? (l2 = false, i2.streamer.parseChunk(n2, true)) : setTimeout(i2.resume, 3);
          }, this.aborted = function() {
            return e;
          }, this.abort = function() {
            e = true, s2.abort(), p2.meta.aborted = true, U2(m2.complete) && m2.complete(p2), n2 = "";
          }, this.guessLineEndings = function(e2, t2) {
            e2 = e2.substring(0, 1048576);
            var t2 = new RegExp(P2(t2) + "([^]*?)" + P2(t2), "gm"), i3 = (e2 = e2.replace(t2, "")).split("\r"), t2 = e2.split("\n"), e2 = 1 < t2.length && t2[0].length < i3[0].length;
            if (1 === i3.length || e2) return "\n";
            for (var r3 = 0, n3 = 0; n3 < i3.length; n3++) "\n" === i3[n3][0] && r3++;
            return r3 >= i3.length / 2 ? "\r\n" : "\r";
          };
        }
        function P2(e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function E2(C2) {
          var S = (C2 = C2 || {}).delimiter, O = C2.newline, x2 = C2.comments, I2 = C2.step, A2 = C2.preview, T2 = C2.fastMode, D2 = null, L2 = false, F2 = null == C2.quoteChar ? '"' : C2.quoteChar, j = F2;
          if (void 0 !== C2.escapeChar && (j = C2.escapeChar), ("string" != typeof S || -1 < v2.BAD_DELIMITERS.indexOf(S)) && (S = ","), x2 === S) throw new Error("Comment character same as delimiter");
          true === x2 ? x2 = "#" : ("string" != typeof x2 || -1 < v2.BAD_DELIMITERS.indexOf(x2)) && (x2 = false), "\n" !== O && "\r" !== O && "\r\n" !== O && (O = "\n");
          var z2 = 0, M2 = false;
          this.parse = function(i2, t, r2) {
            if ("string" != typeof i2) throw new Error("Input must be a string");
            var n2 = i2.length, e = S.length, s2 = O.length, a2 = x2.length, o2 = U2(I2), h2 = [], u2 = [], d3 = [], f2 = z2 = 0;
            if (!i2) return w2();
            if (T2 || false !== T2 && -1 === i2.indexOf(F2)) {
              for (var l2 = i2.split(O), c2 = 0; c2 < l2.length; c2++) {
                if (d3 = l2[c2], z2 += d3.length, c2 !== l2.length - 1) z2 += O.length;
                else if (r2) return w2();
                if (!x2 || d3.substring(0, a2) !== x2) {
                  if (o2) {
                    if (h2 = [], k2(d3.split(S)), R(), M2) return w2();
                  } else k2(d3.split(S));
                  if (A2 && A2 <= c2) return h2 = h2.slice(0, A2), w2(true);
                }
              }
              return w2();
            }
            for (var p2 = i2.indexOf(S, z2), g2 = i2.indexOf(O, z2), _3 = new RegExp(P2(j) + P2(F2), "g"), m2 = i2.indexOf(F2, z2); ; ) if (i2[z2] === F2) for (m2 = z2, z2++; ; ) {
              if (-1 === (m2 = i2.indexOf(F2, m2 + 1))) return r2 || u2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h2.length, index: z2 }), E3();
              if (m2 === n2 - 1) return E3(i2.substring(z2, m2).replace(_3, F2));
              if (F2 === j && i2[m2 + 1] === j) m2++;
              else if (F2 === j || 0 === m2 || i2[m2 - 1] !== j) {
                -1 !== p2 && p2 < m2 + 1 && (p2 = i2.indexOf(S, m2 + 1));
                var y2 = v3(-1 === (g2 = -1 !== g2 && g2 < m2 + 1 ? i2.indexOf(O, m2 + 1) : g2) ? p2 : Math.min(p2, g2));
                if (i2.substr(m2 + 1 + y2, e) === S) {
                  d3.push(i2.substring(z2, m2).replace(_3, F2)), i2[z2 = m2 + 1 + y2 + e] !== F2 && (m2 = i2.indexOf(F2, z2)), p2 = i2.indexOf(S, z2), g2 = i2.indexOf(O, z2);
                  break;
                }
                y2 = v3(g2);
                if (i2.substring(m2 + 1 + y2, m2 + 1 + y2 + s2) === O) {
                  if (d3.push(i2.substring(z2, m2).replace(_3, F2)), b2(m2 + 1 + y2 + s2), p2 = i2.indexOf(S, z2), m2 = i2.indexOf(F2, z2), o2 && (R(), M2)) return w2();
                  if (A2 && h2.length >= A2) return w2(true);
                  break;
                }
                u2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h2.length, index: z2 }), m2++;
              }
            }
            else if (x2 && 0 === d3.length && i2.substring(z2, z2 + a2) === x2) {
              if (-1 === g2) return w2();
              z2 = g2 + s2, g2 = i2.indexOf(O, z2), p2 = i2.indexOf(S, z2);
            } else if (-1 !== p2 && (p2 < g2 || -1 === g2)) d3.push(i2.substring(z2, p2)), z2 = p2 + e, p2 = i2.indexOf(S, z2);
            else {
              if (-1 === g2) break;
              if (d3.push(i2.substring(z2, g2)), b2(g2 + s2), o2 && (R(), M2)) return w2();
              if (A2 && h2.length >= A2) return w2(true);
            }
            return E3();
            function k2(e2) {
              h2.push(e2), f2 = z2;
            }
            function v3(e2) {
              var t2 = 0;
              return t2 = -1 !== e2 && (e2 = i2.substring(m2 + 1, e2)) && "" === e2.trim() ? e2.length : t2;
            }
            function E3(e2) {
              return r2 || (void 0 === e2 && (e2 = i2.substring(z2)), d3.push(e2), z2 = n2, k2(d3), o2 && R()), w2();
            }
            function b2(e2) {
              z2 = e2, k2(d3), d3 = [], g2 = i2.indexOf(O, z2);
            }
            function w2(e2) {
              if (C2.header && !t && h2.length && !L2) {
                var s3 = h2[0], a3 = /* @__PURE__ */ Object.create(null), o3 = new Set(s3);
                let n3 = false;
                for (let r3 = 0; r3 < s3.length; r3++) {
                  let i3 = s3[r3];
                  if (a3[i3 = U2(C2.transformHeader) ? C2.transformHeader(i3, r3) : i3]) {
                    let e3, t2 = a3[i3];
                    for (; e3 = i3 + "_" + t2, t2++, o3.has(e3); ) ;
                    o3.add(e3), s3[r3] = e3, a3[i3]++, n3 = true, (D2 = null === D2 ? {} : D2)[e3] = i3;
                  } else a3[i3] = 1, s3[r3] = i3;
                  o3.add(i3);
                }
                n3 && console.warn("Duplicate headers found and renamed."), L2 = true;
              }
              return { data: h2, errors: u2, meta: { delimiter: S, linebreak: O, aborted: M2, truncated: !!e2, cursor: f2 + (t || 0), renamedHeaders: D2 } };
            }
            function R() {
              I2(w2()), h2 = [], u2 = [];
            }
          }, this.abort = function() {
            M2 = true;
          }, this.getCharIndex = function() {
            return z2;
          };
        }
        function g(e) {
          var t = e.data, i2 = o[t.workerId], r2 = false;
          if (t.error) i2.userError(t.error, t.file);
          else if (t.results && t.results.data) {
            var n2 = { abort: function() {
              r2 = true, _2(t.workerId, { data: [], errors: [], meta: { aborted: true } });
            }, pause: m, resume: m };
            if (U2(i2.userStep)) {
              for (var s2 = 0; s2 < t.results.data.length && (i2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !r2); s2++) ;
              delete t.results;
            } else U2(i2.userChunk) && (i2.userChunk(t.results, n2, t.file), delete t.results);
          }
          t.finished && !r2 && _2(t.workerId, t.results);
        }
        function _2(e, t) {
          var i2 = o[e];
          U2(i2.userComplete) && i2.userComplete(t), i2.terminate(), delete o[e];
        }
        function m() {
          throw new Error("Not implemented.");
        }
        function b(e) {
          if ("object" != typeof e || null === e) return e;
          var t, i2 = Array.isArray(e) ? [] : {};
          for (t in e) i2[t] = b(e[t]);
          return i2;
        }
        function y(e, t) {
          return function() {
            e.apply(t, arguments);
          };
        }
        function U2(e) {
          return "function" == typeof e;
        }
        return v2.parse = function(e, t) {
          var i2 = (t = t || {}).dynamicTyping || false;
          U2(i2) && (t.dynamicTypingFunction = i2, i2 = {});
          if (t.dynamicTyping = i2, t.transform = !!U2(t.transform) && t.transform, !t.worker || !v2.WORKERS_SUPPORTED) return i2 = null, v2.NODE_STREAM_INPUT, "string" == typeof e ? (e = ((e2) => 65279 !== e2.charCodeAt(0) ? e2 : e2.slice(1))(e), i2 = new (t.download ? f : c)(t)) : true === e.readable && U2(e.read) && U2(e.on) ? i2 = new p(t) : (n.File && e instanceof File || e instanceof Object) && (i2 = new l(t)), i2.stream(e);
          (i2 = (() => {
            var e2;
            return !!v2.WORKERS_SUPPORTED && (e2 = (() => {
              var e3 = n.URL || n.webkitURL || null, t2 = r.toString();
              return v2.BLOB_URL || (v2.BLOB_URL = e3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", t2, ")();"], { type: "text/javascript" })));
            })(), (e2 = new n.Worker(e2)).onmessage = g, e2.id = h++, o[e2.id] = e2);
          })()).userStep = t.step, i2.userChunk = t.chunk, i2.userComplete = t.complete, i2.userError = t.error, t.step = U2(t.step), t.chunk = U2(t.chunk), t.complete = U2(t.complete), t.error = U2(t.error), delete t.worker, i2.postMessage({ input: e, config: t, workerId: i2.id });
        }, v2.unparse = function(e, t) {
          var n2 = false, _3 = true, m2 = ",", y2 = "\r\n", s2 = '"', a2 = s2 + s2, i2 = false, r2 = null, o2 = false, h2 = ((() => {
            if ("object" == typeof t) {
              if ("string" != typeof t.delimiter || v2.BAD_DELIMITERS.filter(function(e2) {
                return -1 !== t.delimiter.indexOf(e2);
              }).length || (m2 = t.delimiter), "boolean" != typeof t.quotes && "function" != typeof t.quotes && !Array.isArray(t.quotes) || (n2 = t.quotes), "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (i2 = t.skipEmptyLines), "string" == typeof t.newline && (y2 = t.newline), "string" == typeof t.quoteChar && (s2 = t.quoteChar), "boolean" == typeof t.header && (_3 = t.header), Array.isArray(t.columns)) {
                if (0 === t.columns.length) throw new Error("Option columns is empty");
                r2 = t.columns;
              }
              void 0 !== t.escapeChar && (a2 = t.escapeChar + s2), t.escapeFormulae instanceof RegExp ? o2 = t.escapeFormulae : "boolean" == typeof t.escapeFormulae && t.escapeFormulae && (o2 = /^[=+\-@\t\r].*$/);
            }
          })(), new RegExp(P2(s2), "g"));
          "string" == typeof e && (e = JSON.parse(e));
          if (Array.isArray(e)) {
            if (!e.length || Array.isArray(e[0])) return u2(null, e, i2);
            if ("object" == typeof e[0]) return u2(r2 || Object.keys(e[0]), e, i2);
          } else if ("object" == typeof e) return "string" == typeof e.data && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || r2), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : "object" == typeof e.data[0] ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || "object" == typeof e.data[0] || (e.data = [e.data])), u2(e.fields || [], e.data || [], i2);
          throw new Error("Unable to serialize unrecognized input");
          function u2(e2, t2, i3) {
            var r3 = "", n3 = ("string" == typeof e2 && (e2 = JSON.parse(e2)), "string" == typeof t2 && (t2 = JSON.parse(t2)), Array.isArray(e2) && 0 < e2.length), s3 = !Array.isArray(t2[0]);
            if (n3 && _3) {
              for (var a3 = 0; a3 < e2.length; a3++) 0 < a3 && (r3 += m2), r3 += k2(e2[a3], a3);
              0 < t2.length && (r3 += y2);
            }
            for (var o3 = 0; o3 < t2.length; o3++) {
              var h3 = (n3 ? e2 : t2[o3]).length, u3 = false, d3 = n3 ? 0 === Object.keys(t2[o3]).length : 0 === t2[o3].length;
              if (i3 && !n3 && (u3 = "greedy" === i3 ? "" === t2[o3].join("").trim() : 1 === t2[o3].length && 0 === t2[o3][0].length), "greedy" === i3 && n3) {
                for (var f2 = [], l2 = 0; l2 < h3; l2++) {
                  var c2 = s3 ? e2[l2] : l2;
                  f2.push(t2[o3][c2]);
                }
                u3 = "" === f2.join("").trim();
              }
              if (!u3) {
                for (var p2 = 0; p2 < h3; p2++) {
                  0 < p2 && !d3 && (r3 += m2);
                  var g2 = n3 && s3 ? e2[p2] : p2;
                  r3 += k2(t2[o3][g2], p2);
                }
                o3 < t2.length - 1 && (!i3 || 0 < h3 && !d3) && (r3 += y2);
              }
            }
            return r3;
          }
          function k2(e2, t2) {
            var i3, r3;
            return null == e2 ? "" : e2.constructor === Date ? JSON.stringify(e2).slice(1, 25) : (r3 = false, o2 && "string" == typeof e2 && o2.test(e2) && (e2 = "'" + e2, r3 = true), i3 = e2.toString().replace(h2, a2), (r3 = r3 || true === n2 || "function" == typeof n2 && n2(e2, t2) || Array.isArray(n2) && n2[t2] || ((e3, t3) => {
              for (var i4 = 0; i4 < t3.length; i4++) if (-1 < e3.indexOf(t3[i4])) return true;
              return false;
            })(i3, v2.BAD_DELIMITERS) || -1 < i3.indexOf(m2) || " " === i3.charAt(0) || " " === i3.charAt(i3.length - 1)) ? s2 + i3 + s2 : i3);
          }
        }, v2.RECORD_SEP = String.fromCharCode(30), v2.UNIT_SEP = String.fromCharCode(31), v2.BYTE_ORDER_MARK = "\uFEFF", v2.BAD_DELIMITERS = ["\r", "\n", '"', v2.BYTE_ORDER_MARK], v2.WORKERS_SUPPORTED = !s && !!n.Worker, v2.NODE_STREAM_INPUT = 1, v2.LocalChunkSize = 10485760, v2.RemoteChunkSize = 5242880, v2.DefaultDelimiter = ",", v2.Parser = E2, v2.ParserHandle = i, v2.NetworkStreamer = f, v2.FileStreamer = l, v2.StringStreamer = c, v2.ReadableStreamStreamer = p, n.jQuery && ((d2 = n.jQuery).fn.parse = function(o2) {
          var i2 = o2.config || {}, h2 = [];
          return this.each(function(e2) {
            if (!("INPUT" === d2(this).prop("tagName").toUpperCase() && "file" === d2(this).attr("type").toLowerCase() && n.FileReader) || !this.files || 0 === this.files.length) return true;
            for (var t = 0; t < this.files.length; t++) h2.push({ file: this.files[t], inputElem: this, instanceConfig: d2.extend({}, i2) });
          }), e(), this;
          function e() {
            if (0 === h2.length) U2(o2.complete) && o2.complete();
            else {
              var e2, t, i3, r2, n2 = h2[0];
              if (U2(o2.before)) {
                var s2 = o2.before(n2.file, n2.inputElem);
                if ("object" == typeof s2) {
                  if ("abort" === s2.action) return e2 = "AbortError", t = n2.file, i3 = n2.inputElem, r2 = s2.reason, void (U2(o2.error) && o2.error({ name: e2 }, t, i3, r2));
                  if ("skip" === s2.action) return void u2();
                  "object" == typeof s2.config && (n2.instanceConfig = d2.extend(n2.instanceConfig, s2.config));
                } else if ("skip" === s2) return void u2();
              }
              var a2 = n2.instanceConfig.complete;
              n2.instanceConfig.complete = function(e3) {
                U2(a2) && a2(e3, n2.file, n2.inputElem), u2();
              }, v2.parse(n2.file, n2.instanceConfig);
            }
          }
          function u2() {
            h2.splice(0, 1), e();
          }
        }), a && (n.onmessage = function(e) {
          e = e.data;
          void 0 === v2.WORKER_ID && e && (v2.WORKER_ID = e.workerId);
          "string" == typeof e.input ? n.postMessage({ workerId: v2.WORKER_ID, results: v2.parse(e.input, e.config), finished: true }) : (n.File && e.input instanceof File || e.input instanceof Object) && (e = v2.parse(e.input, e.config)) && n.postMessage({ workerId: v2.WORKER_ID, results: e, finished: true });
        }), (f.prototype = Object.create(u.prototype)).constructor = f, (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(c.prototype)).constructor = c, (p.prototype = Object.create(u.prototype)).constructor = p, v2;
      });
    }
  });

  // ../../node_modules/js-beautify/js/src/core/output.js
  var require_output = __commonJS({
    "../../node_modules/js-beautify/js/src/core/output.js"(exports2, module2) {
      "use strict";
      function OutputLine(parent) {
        this.__parent = parent;
        this.__character_count = 0;
        this.__indent_count = -1;
        this.__alignment_count = 0;
        this.__wrap_point_index = 0;
        this.__wrap_point_character_count = 0;
        this.__wrap_point_indent_count = -1;
        this.__wrap_point_alignment_count = 0;
        this.__items = [];
      }
      OutputLine.prototype.clone_empty = function() {
        var line = new OutputLine(this.__parent);
        line.set_indent(this.__indent_count, this.__alignment_count);
        return line;
      };
      OutputLine.prototype.item = function(index) {
        if (index < 0) {
          return this.__items[this.__items.length + index];
        } else {
          return this.__items[index];
        }
      };
      OutputLine.prototype.has_match = function(pattern) {
        for (var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
          if (this.__items[lastCheckedOutput].match(pattern)) {
            return true;
          }
        }
        return false;
      };
      OutputLine.prototype.set_indent = function(indent, alignment) {
        if (this.is_empty()) {
          this.__indent_count = indent || 0;
          this.__alignment_count = alignment || 0;
          this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count);
        }
      };
      OutputLine.prototype._set_wrap_point = function() {
        if (this.__parent.wrap_line_length) {
          this.__wrap_point_index = this.__items.length;
          this.__wrap_point_character_count = this.__character_count;
          this.__wrap_point_indent_count = this.__parent.next_line.__indent_count;
          this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count;
        }
      };
      OutputLine.prototype._should_wrap = function() {
        return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
      };
      OutputLine.prototype._allow_wrap = function() {
        if (this._should_wrap()) {
          this.__parent.add_new_line();
          var next = this.__parent.current_line;
          next.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count);
          next.__items = this.__items.slice(this.__wrap_point_index);
          this.__items = this.__items.slice(0, this.__wrap_point_index);
          next.__character_count += this.__character_count - this.__wrap_point_character_count;
          this.__character_count = this.__wrap_point_character_count;
          if (next.__items[0] === " ") {
            next.__items.splice(0, 1);
            next.__character_count -= 1;
          }
          return true;
        }
        return false;
      };
      OutputLine.prototype.is_empty = function() {
        return this.__items.length === 0;
      };
      OutputLine.prototype.last = function() {
        if (!this.is_empty()) {
          return this.__items[this.__items.length - 1];
        } else {
          return null;
        }
      };
      OutputLine.prototype.push = function(item) {
        this.__items.push(item);
        var last_newline_index = item.lastIndexOf("\n");
        if (last_newline_index !== -1) {
          this.__character_count = item.length - last_newline_index;
        } else {
          this.__character_count += item.length;
        }
      };
      OutputLine.prototype.pop = function() {
        var item = null;
        if (!this.is_empty()) {
          item = this.__items.pop();
          this.__character_count -= item.length;
        }
        return item;
      };
      OutputLine.prototype._remove_indent = function() {
        if (this.__indent_count > 0) {
          this.__indent_count -= 1;
          this.__character_count -= this.__parent.indent_size;
        }
      };
      OutputLine.prototype._remove_wrap_indent = function() {
        if (this.__wrap_point_indent_count > 0) {
          this.__wrap_point_indent_count -= 1;
        }
      };
      OutputLine.prototype.trim = function() {
        while (this.last() === " ") {
          this.__items.pop();
          this.__character_count -= 1;
        }
      };
      OutputLine.prototype.toString = function() {
        var result = "";
        if (this.is_empty()) {
          if (this.__parent.indent_empty_lines) {
            result = this.__parent.get_indent_string(this.__indent_count);
          }
        } else {
          result = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count);
          result += this.__items.join("");
        }
        return result;
      };
      function IndentStringCache(options, baseIndentString) {
        this.__cache = [""];
        this.__indent_size = options.indent_size;
        this.__indent_string = options.indent_char;
        if (!options.indent_with_tabs) {
          this.__indent_string = new Array(options.indent_size + 1).join(options.indent_char);
        }
        baseIndentString = baseIndentString || "";
        if (options.indent_level > 0) {
          baseIndentString = new Array(options.indent_level + 1).join(this.__indent_string);
        }
        this.__base_string = baseIndentString;
        this.__base_string_length = baseIndentString.length;
      }
      IndentStringCache.prototype.get_indent_size = function(indent, column) {
        var result = this.__base_string_length;
        column = column || 0;
        if (indent < 0) {
          result = 0;
        }
        result += indent * this.__indent_size;
        result += column;
        return result;
      };
      IndentStringCache.prototype.get_indent_string = function(indent_level, column) {
        var result = this.__base_string;
        column = column || 0;
        if (indent_level < 0) {
          indent_level = 0;
          result = "";
        }
        column += indent_level * this.__indent_size;
        this.__ensure_cache(column);
        result += this.__cache[column];
        return result;
      };
      IndentStringCache.prototype.__ensure_cache = function(column) {
        while (column >= this.__cache.length) {
          this.__add_column();
        }
      };
      IndentStringCache.prototype.__add_column = function() {
        var column = this.__cache.length;
        var indent = 0;
        var result = "";
        if (this.__indent_size && column >= this.__indent_size) {
          indent = Math.floor(column / this.__indent_size);
          column -= indent * this.__indent_size;
          result = new Array(indent + 1).join(this.__indent_string);
        }
        if (column) {
          result += new Array(column + 1).join(" ");
        }
        this.__cache.push(result);
      };
      function Output(options, baseIndentString) {
        this.__indent_cache = new IndentStringCache(options, baseIndentString);
        this.raw = false;
        this._end_with_newline = options.end_with_newline;
        this.indent_size = options.indent_size;
        this.wrap_line_length = options.wrap_line_length;
        this.indent_empty_lines = options.indent_empty_lines;
        this.__lines = [];
        this.previous_line = null;
        this.current_line = null;
        this.next_line = new OutputLine(this);
        this.space_before_token = false;
        this.non_breaking_space = false;
        this.previous_token_wrapped = false;
        this.__add_outputline();
      }
      Output.prototype.__add_outputline = function() {
        this.previous_line = this.current_line;
        this.current_line = this.next_line.clone_empty();
        this.__lines.push(this.current_line);
      };
      Output.prototype.get_line_number = function() {
        return this.__lines.length;
      };
      Output.prototype.get_indent_string = function(indent, column) {
        return this.__indent_cache.get_indent_string(indent, column);
      };
      Output.prototype.get_indent_size = function(indent, column) {
        return this.__indent_cache.get_indent_size(indent, column);
      };
      Output.prototype.is_empty = function() {
        return !this.previous_line && this.current_line.is_empty();
      };
      Output.prototype.add_new_line = function(force_newline) {
        if (this.is_empty() || !force_newline && this.just_added_newline()) {
          return false;
        }
        if (!this.raw) {
          this.__add_outputline();
        }
        return true;
      };
      Output.prototype.get_code = function(eol) {
        this.trim(true);
        var last_item = this.current_line.pop();
        if (last_item) {
          if (last_item[last_item.length - 1] === "\n") {
            last_item = last_item.replace(/\n+$/g, "");
          }
          this.current_line.push(last_item);
        }
        if (this._end_with_newline) {
          this.__add_outputline();
        }
        var sweet_code = this.__lines.join("\n");
        if (eol !== "\n") {
          sweet_code = sweet_code.replace(/[\n]/g, eol);
        }
        return sweet_code;
      };
      Output.prototype.set_wrap_point = function() {
        this.current_line._set_wrap_point();
      };
      Output.prototype.set_indent = function(indent, alignment) {
        indent = indent || 0;
        alignment = alignment || 0;
        this.next_line.set_indent(indent, alignment);
        if (this.__lines.length > 1) {
          this.current_line.set_indent(indent, alignment);
          return true;
        }
        this.current_line.set_indent();
        return false;
      };
      Output.prototype.add_raw_token = function(token) {
        for (var x2 = 0; x2 < token.newlines; x2++) {
          this.__add_outputline();
        }
        this.current_line.set_indent(-1);
        this.current_line.push(token.whitespace_before);
        this.current_line.push(token.text);
        this.space_before_token = false;
        this.non_breaking_space = false;
        this.previous_token_wrapped = false;
      };
      Output.prototype.add_token = function(printable_token) {
        this.__add_space_before_token();
        this.current_line.push(printable_token);
        this.space_before_token = false;
        this.non_breaking_space = false;
        this.previous_token_wrapped = this.current_line._allow_wrap();
      };
      Output.prototype.__add_space_before_token = function() {
        if (this.space_before_token && !this.just_added_newline()) {
          if (!this.non_breaking_space) {
            this.set_wrap_point();
          }
          this.current_line.push(" ");
        }
      };
      Output.prototype.remove_indent = function(index) {
        var output_length = this.__lines.length;
        while (index < output_length) {
          this.__lines[index]._remove_indent();
          index++;
        }
        this.current_line._remove_wrap_indent();
      };
      Output.prototype.trim = function(eat_newlines) {
        eat_newlines = eat_newlines === void 0 ? false : eat_newlines;
        this.current_line.trim();
        while (eat_newlines && this.__lines.length > 1 && this.current_line.is_empty()) {
          this.__lines.pop();
          this.current_line = this.__lines[this.__lines.length - 1];
          this.current_line.trim();
        }
        this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
      };
      Output.prototype.just_added_newline = function() {
        return this.current_line.is_empty();
      };
      Output.prototype.just_added_blankline = function() {
        return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
      };
      Output.prototype.ensure_empty_line_above = function(starts_with, ends_with) {
        var index = this.__lines.length - 2;
        while (index >= 0) {
          var potentialEmptyLine = this.__lines[index];
          if (potentialEmptyLine.is_empty()) {
            break;
          } else if (potentialEmptyLine.item(0).indexOf(starts_with) !== 0 && potentialEmptyLine.item(-1) !== ends_with) {
            this.__lines.splice(index + 1, 0, new OutputLine(this));
            this.previous_line = this.__lines[this.__lines.length - 2];
            break;
          }
          index--;
        }
      };
      module2.exports.Output = Output;
    }
  });

  // ../../node_modules/js-beautify/js/src/core/token.js
  var require_token = __commonJS({
    "../../node_modules/js-beautify/js/src/core/token.js"(exports2, module2) {
      "use strict";
      function Token(type2, text, newlines, whitespace_before) {
        this.type = type2;
        this.text = text;
        this.comments_before = null;
        this.newlines = newlines || 0;
        this.whitespace_before = whitespace_before || "";
        this.parent = null;
        this.next = null;
        this.previous = null;
        this.opened = null;
        this.closed = null;
        this.directives = null;
      }
      module2.exports.Token = Token;
    }
  });

  // ../../node_modules/js-beautify/js/src/javascript/acorn.js
  var require_acorn = __commonJS({
    "../../node_modules/js-beautify/js/src/javascript/acorn.js"(exports2) {
      "use strict";
      var baseASCIIidentifierStartChars = "\\x23\\x24\\x40\\x41-\\x5a\\x5f\\x61-\\x7a";
      var baseASCIIidentifierChars = "\\x24\\x30-\\x39\\x41-\\x5a\\x5f\\x61-\\x7a";
      var nonASCIIidentifierStartChars = "\\xaa\\xb5\\xba\\xc0-\\xd6\\xd8-\\xf6\\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u08a0\\u08a2-\\u08ac\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097f\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c33\\u0c35-\\u0c39\\u0c3d\\u0c58\\u0c59\\u0c60\\u0c61\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d60\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f4\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f0\\u1700-\\u170c\\u170e-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1877\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191c\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19c1-\\u19c7\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4b\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1ce9-\\u1cec\\u1cee-\\u1cf1\\u1cf5\\u1cf6\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2119-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u212d\\u212f-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u2e2f\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309d-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fcc\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua697\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua78e\\ua790-\\ua793\\ua7a0-\\ua7aa\\ua7f8-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa80-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uabc0-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc";
      var nonASCIIidentifierChars = "\\u0300-\\u036f\\u0483-\\u0487\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u0610-\\u061a\\u0620-\\u0649\\u0672-\\u06d3\\u06e7-\\u06e8\\u06fb-\\u06fc\\u0730-\\u074a\\u0800-\\u0814\\u081b-\\u0823\\u0825-\\u0827\\u0829-\\u082d\\u0840-\\u0857\\u08e4-\\u08fe\\u0900-\\u0903\\u093a-\\u093c\\u093e-\\u094f\\u0951-\\u0957\\u0962-\\u0963\\u0966-\\u096f\\u0981-\\u0983\\u09bc\\u09be-\\u09c4\\u09c7\\u09c8\\u09d7\\u09df-\\u09e0\\u0a01-\\u0a03\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a66-\\u0a71\\u0a75\\u0a81-\\u0a83\\u0abc\\u0abe-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ae2-\\u0ae3\\u0ae6-\\u0aef\\u0b01-\\u0b03\\u0b3c\\u0b3e-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b56\\u0b57\\u0b5f-\\u0b60\\u0b66-\\u0b6f\\u0b82\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd7\\u0be6-\\u0bef\\u0c01-\\u0c03\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c62-\\u0c63\\u0c66-\\u0c6f\\u0c82\\u0c83\\u0cbc\\u0cbe-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0ce2-\\u0ce3\\u0ce6-\\u0cef\\u0d02\\u0d03\\u0d46-\\u0d48\\u0d57\\u0d62-\\u0d63\\u0d66-\\u0d6f\\u0d82\\u0d83\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0df2\\u0df3\\u0e34-\\u0e3a\\u0e40-\\u0e45\\u0e50-\\u0e59\\u0eb4-\\u0eb9\\u0ec8-\\u0ecd\\u0ed0-\\u0ed9\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f41-\\u0f47\\u0f71-\\u0f84\\u0f86-\\u0f87\\u0f8d-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u1000-\\u1029\\u1040-\\u1049\\u1067-\\u106d\\u1071-\\u1074\\u1082-\\u108d\\u108f-\\u109d\\u135d-\\u135f\\u170e-\\u1710\\u1720-\\u1730\\u1740-\\u1750\\u1772\\u1773\\u1780-\\u17b2\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u1810-\\u1819\\u1920-\\u192b\\u1930-\\u193b\\u1951-\\u196d\\u19b0-\\u19c0\\u19c8-\\u19c9\\u19d0-\\u19d9\\u1a00-\\u1a15\\u1a20-\\u1a53\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1b46-\\u1b4b\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1bb0-\\u1bb9\\u1be6-\\u1bf3\\u1c00-\\u1c22\\u1c40-\\u1c49\\u1c5b-\\u1c7d\\u1cd0-\\u1cd2\\u1d00-\\u1dbe\\u1e01-\\u1f15\\u200c\\u200d\\u203f\\u2040\\u2054\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2d81-\\u2d96\\u2de0-\\u2dff\\u3021-\\u3028\\u3099\\u309a\\ua640-\\ua66d\\ua674-\\ua67d\\ua69f\\ua6f0-\\ua6f1\\ua7f8-\\ua800\\ua806\\ua80b\\ua823-\\ua827\\ua880-\\ua881\\ua8b4-\\ua8c4\\ua8d0-\\ua8d9\\ua8f3-\\ua8f7\\ua900-\\ua909\\ua926-\\ua92d\\ua930-\\ua945\\ua980-\\ua983\\ua9b3-\\ua9c0\\uaa00-\\uaa27\\uaa40-\\uaa41\\uaa4c-\\uaa4d\\uaa50-\\uaa59\\uaa7b\\uaae0-\\uaae9\\uaaf2-\\uaaf3\\uabc0-\\uabe1\\uabec\\uabed\\uabf0-\\uabf9\\ufb20-\\ufb28\\ufe00-\\ufe0f\\ufe20-\\ufe26\\ufe33\\ufe34\\ufe4d-\\ufe4f\\uff10-\\uff19\\uff3f";
      var unicodeEscapeOrCodePoint = "\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]+\\}";
      var identifierStart = "(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierStartChars + nonASCIIidentifierStartChars + "])";
      var identifierChars = "(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "])*";
      exports2.identifier = new RegExp(identifierStart + identifierChars, "g");
      exports2.identifierStart = new RegExp(identifierStart);
      exports2.identifierMatch = new RegExp("(?:" + unicodeEscapeOrCodePoint + "|[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "])+");
      exports2.newline = /[\n\r\u2028\u2029]/;
      exports2.lineBreak = new RegExp("\r\n|" + exports2.newline.source);
      exports2.allLineBreaks = new RegExp(exports2.lineBreak.source, "g");
    }
  });

  // ../../node_modules/js-beautify/js/src/core/options.js
  var require_options = __commonJS({
    "../../node_modules/js-beautify/js/src/core/options.js"(exports2, module2) {
      "use strict";
      function Options(options, merge_child_field) {
        this.raw_options = _mergeOpts(options, merge_child_field);
        this.disabled = this._get_boolean("disabled");
        this.eol = this._get_characters("eol", "auto");
        this.end_with_newline = this._get_boolean("end_with_newline");
        this.indent_size = this._get_number("indent_size", 4);
        this.indent_char = this._get_characters("indent_char", " ");
        this.indent_level = this._get_number("indent_level");
        this.preserve_newlines = this._get_boolean("preserve_newlines", true);
        this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786);
        if (!this.preserve_newlines) {
          this.max_preserve_newlines = 0;
        }
        this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	");
        if (this.indent_with_tabs) {
          this.indent_char = "	";
          if (this.indent_size === 1) {
            this.indent_size = 4;
          }
        }
        this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char"));
        this.indent_empty_lines = this._get_boolean("indent_empty_lines");
        this.templating = this._get_selection_list("templating", ["auto", "none", "angular", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
      }
      Options.prototype._get_array = function(name, default_value) {
        var option_value = this.raw_options[name];
        var result = default_value || [];
        if (typeof option_value === "object") {
          if (option_value !== null && typeof option_value.concat === "function") {
            result = option_value.concat();
          }
        } else if (typeof option_value === "string") {
          result = option_value.split(/[^a-zA-Z0-9_\/\-]+/);
        }
        return result;
      };
      Options.prototype._get_boolean = function(name, default_value) {
        var option_value = this.raw_options[name];
        var result = option_value === void 0 ? !!default_value : !!option_value;
        return result;
      };
      Options.prototype._get_characters = function(name, default_value) {
        var option_value = this.raw_options[name];
        var result = default_value || "";
        if (typeof option_value === "string") {
          result = option_value.replace(/\\r/, "\r").replace(/\\n/, "\n").replace(/\\t/, "	");
        }
        return result;
      };
      Options.prototype._get_number = function(name, default_value) {
        var option_value = this.raw_options[name];
        default_value = parseInt(default_value, 10);
        if (isNaN(default_value)) {
          default_value = 0;
        }
        var result = parseInt(option_value, 10);
        if (isNaN(result)) {
          result = default_value;
        }
        return result;
      };
      Options.prototype._get_selection = function(name, selection_list, default_value) {
        var result = this._get_selection_list(name, selection_list, default_value);
        if (result.length !== 1) {
          throw new Error(
            "Invalid Option Value: The option '" + name + "' can only be one of the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'"
          );
        }
        return result[0];
      };
      Options.prototype._get_selection_list = function(name, selection_list, default_value) {
        if (!selection_list || selection_list.length === 0) {
          throw new Error("Selection list cannot be empty.");
        }
        default_value = default_value || [selection_list[0]];
        if (!this._is_valid_selection(default_value, selection_list)) {
          throw new Error("Invalid Default Value!");
        }
        var result = this._get_array(name, default_value);
        if (!this._is_valid_selection(result, selection_list)) {
          throw new Error(
            "Invalid Option Value: The option '" + name + "' can contain only the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'"
          );
        }
        return result;
      };
      Options.prototype._is_valid_selection = function(result, selection_list) {
        return result.length && selection_list.length && !result.some(function(item) {
          return selection_list.indexOf(item) === -1;
        });
      };
      function _mergeOpts(allOptions, childFieldName) {
        var finalOpts = {};
        allOptions = _normalizeOpts(allOptions);
        var name;
        for (name in allOptions) {
          if (name !== childFieldName) {
            finalOpts[name] = allOptions[name];
          }
        }
        if (childFieldName && allOptions[childFieldName]) {
          for (name in allOptions[childFieldName]) {
            finalOpts[name] = allOptions[childFieldName][name];
          }
        }
        return finalOpts;
      }
      function _normalizeOpts(options) {
        var convertedOpts = {};
        var key;
        for (key in options) {
          var newKey = key.replace(/-/g, "_");
          convertedOpts[newKey] = options[key];
        }
        return convertedOpts;
      }
      module2.exports.Options = Options;
      module2.exports.normalizeOpts = _normalizeOpts;
      module2.exports.mergeOpts = _mergeOpts;
    }
  });

  // ../../node_modules/js-beautify/js/src/javascript/options.js
  var require_options2 = __commonJS({
    "../../node_modules/js-beautify/js/src/javascript/options.js"(exports2, module2) {
      "use strict";
      var BaseOptions = require_options().Options;
      var validPositionValues = ["before-newline", "after-newline", "preserve-newline"];
      function Options(options) {
        BaseOptions.call(this, options, "js");
        var raw_brace_style = this.raw_options.brace_style || null;
        if (raw_brace_style === "expand-strict") {
          this.raw_options.brace_style = "expand";
        } else if (raw_brace_style === "collapse-preserve-inline") {
          this.raw_options.brace_style = "collapse,preserve-inline";
        } else if (this.raw_options.braces_on_own_line !== void 0) {
          this.raw_options.brace_style = this.raw_options.braces_on_own_line ? "expand" : "collapse";
        }
        var brace_style_split = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
        this.brace_preserve_inline = false;
        this.brace_style = "collapse";
        for (var bs = 0; bs < brace_style_split.length; bs++) {
          if (brace_style_split[bs] === "preserve-inline") {
            this.brace_preserve_inline = true;
          } else {
            this.brace_style = brace_style_split[bs];
          }
        }
        this.unindent_chained_methods = this._get_boolean("unindent_chained_methods");
        this.break_chained_methods = this._get_boolean("break_chained_methods");
        this.space_in_paren = this._get_boolean("space_in_paren");
        this.space_in_empty_paren = this._get_boolean("space_in_empty_paren");
        this.jslint_happy = this._get_boolean("jslint_happy");
        this.space_after_anon_function = this._get_boolean("space_after_anon_function");
        this.space_after_named_function = this._get_boolean("space_after_named_function");
        this.keep_array_indentation = this._get_boolean("keep_array_indentation");
        this.space_before_conditional = this._get_boolean("space_before_conditional", true);
        this.unescape_strings = this._get_boolean("unescape_strings");
        this.e4x = this._get_boolean("e4x");
        this.comma_first = this._get_boolean("comma_first");
        this.operator_position = this._get_selection("operator_position", validPositionValues);
        this.test_output_raw = this._get_boolean("test_output_raw");
        if (this.jslint_happy) {
          this.space_after_anon_function = true;
        }
      }
      Options.prototype = new BaseOptions();
      module2.exports.Options = Options;
    }
  });

  // ../../node_modules/js-beautify/js/src/core/inputscanner.js
  var require_inputscanner = __commonJS({
    "../../node_modules/js-beautify/js/src/core/inputscanner.js"(exports2, module2) {
      "use strict";
      var regexp_has_sticky = RegExp.prototype.hasOwnProperty("sticky");
      function InputScanner(input_string) {
        this.__input = input_string || "";
        this.__input_length = this.__input.length;
        this.__position = 0;
      }
      InputScanner.prototype.restart = function() {
        this.__position = 0;
      };
      InputScanner.prototype.back = function() {
        if (this.__position > 0) {
          this.__position -= 1;
        }
      };
      InputScanner.prototype.hasNext = function() {
        return this.__position < this.__input_length;
      };
      InputScanner.prototype.next = function() {
        var val = null;
        if (this.hasNext()) {
          val = this.__input.charAt(this.__position);
          this.__position += 1;
        }
        return val;
      };
      InputScanner.prototype.peek = function(index) {
        var val = null;
        index = index || 0;
        index += this.__position;
        if (index >= 0 && index < this.__input_length) {
          val = this.__input.charAt(index);
        }
        return val;
      };
      InputScanner.prototype.__match = function(pattern, index) {
        pattern.lastIndex = index;
        var pattern_match = pattern.exec(this.__input);
        if (pattern_match && !(regexp_has_sticky && pattern.sticky)) {
          if (pattern_match.index !== index) {
            pattern_match = null;
          }
        }
        return pattern_match;
      };
      InputScanner.prototype.test = function(pattern, index) {
        index = index || 0;
        index += this.__position;
        if (index >= 0 && index < this.__input_length) {
          return !!this.__match(pattern, index);
        } else {
          return false;
        }
      };
      InputScanner.prototype.testChar = function(pattern, index) {
        var val = this.peek(index);
        pattern.lastIndex = 0;
        return val !== null && pattern.test(val);
      };
      InputScanner.prototype.match = function(pattern) {
        var pattern_match = this.__match(pattern, this.__position);
        if (pattern_match) {
          this.__position += pattern_match[0].length;
        } else {
          pattern_match = null;
        }
        return pattern_match;
      };
      InputScanner.prototype.read = function(starting_pattern, until_pattern, until_after) {
        var val = "";
        var match;
        if (starting_pattern) {
          match = this.match(starting_pattern);
          if (match) {
            val += match[0];
          }
        }
        if (until_pattern && (match || !starting_pattern)) {
          val += this.readUntil(until_pattern, until_after);
        }
        return val;
      };
      InputScanner.prototype.readUntil = function(pattern, until_after) {
        var val = "";
        var match_index = this.__position;
        pattern.lastIndex = this.__position;
        var pattern_match = pattern.exec(this.__input);
        if (pattern_match) {
          match_index = pattern_match.index;
          if (until_after) {
            match_index += pattern_match[0].length;
          }
        } else {
          match_index = this.__input_length;
        }
        val = this.__input.substring(this.__position, match_index);
        this.__position = match_index;
        return val;
      };
      InputScanner.prototype.readUntilAfter = function(pattern) {
        return this.readUntil(pattern, true);
      };
      InputScanner.prototype.get_regexp = function(pattern, match_from) {
        var result = null;
        var flags = "g";
        if (match_from && regexp_has_sticky) {
          flags = "y";
        }
        if (typeof pattern === "string" && pattern !== "") {
          result = new RegExp(pattern, flags);
        } else if (pattern) {
          result = new RegExp(pattern.source, flags);
        }
        return result;
      };
      InputScanner.prototype.get_literal_regexp = function(literal_string) {
        return RegExp(literal_string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
      };
      InputScanner.prototype.peekUntilAfter = function(pattern) {
        var start = this.__position;
        var val = this.readUntilAfter(pattern);
        this.__position = start;
        return val;
      };
      InputScanner.prototype.lookBack = function(testVal) {
        var start = this.__position - 1;
        return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
      };
      module2.exports.InputScanner = InputScanner;
    }
  });

  // ../../node_modules/js-beautify/js/src/core/tokenstream.js
  var require_tokenstream = __commonJS({
    "../../node_modules/js-beautify/js/src/core/tokenstream.js"(exports2, module2) {
      "use strict";
      function TokenStream(parent_token) {
        this.__tokens = [];
        this.__tokens_length = this.__tokens.length;
        this.__position = 0;
        this.__parent_token = parent_token;
      }
      TokenStream.prototype.restart = function() {
        this.__position = 0;
      };
      TokenStream.prototype.isEmpty = function() {
        return this.__tokens_length === 0;
      };
      TokenStream.prototype.hasNext = function() {
        return this.__position < this.__tokens_length;
      };
      TokenStream.prototype.next = function() {
        var val = null;
        if (this.hasNext()) {
          val = this.__tokens[this.__position];
          this.__position += 1;
        }
        return val;
      };
      TokenStream.prototype.peek = function(index) {
        var val = null;
        index = index || 0;
        index += this.__position;
        if (index >= 0 && index < this.__tokens_length) {
          val = this.__tokens[index];
        }
        return val;
      };
      TokenStream.prototype.add = function(token) {
        if (this.__parent_token) {
          token.parent = this.__parent_token;
        }
        this.__tokens.push(token);
        this.__tokens_length += 1;
      };
      module2.exports.TokenStream = TokenStream;
    }
  });

  // ../../node_modules/js-beautify/js/src/core/pattern.js
  var require_pattern = __commonJS({
    "../../node_modules/js-beautify/js/src/core/pattern.js"(exports2, module2) {
      "use strict";
      function Pattern(input_scanner, parent) {
        this._input = input_scanner;
        this._starting_pattern = null;
        this._match_pattern = null;
        this._until_pattern = null;
        this._until_after = false;
        if (parent) {
          this._starting_pattern = this._input.get_regexp(parent._starting_pattern, true);
          this._match_pattern = this._input.get_regexp(parent._match_pattern, true);
          this._until_pattern = this._input.get_regexp(parent._until_pattern);
          this._until_after = parent._until_after;
        }
      }
      Pattern.prototype.read = function() {
        var result = this._input.read(this._starting_pattern);
        if (!this._starting_pattern || result) {
          result += this._input.read(this._match_pattern, this._until_pattern, this._until_after);
        }
        return result;
      };
      Pattern.prototype.read_match = function() {
        return this._input.match(this._match_pattern);
      };
      Pattern.prototype.until_after = function(pattern) {
        var result = this._create();
        result._until_after = true;
        result._until_pattern = this._input.get_regexp(pattern);
        result._update();
        return result;
      };
      Pattern.prototype.until = function(pattern) {
        var result = this._create();
        result._until_after = false;
        result._until_pattern = this._input.get_regexp(pattern);
        result._update();
        return result;
      };
      Pattern.prototype.starting_with = function(pattern) {
        var result = this._create();
        result._starting_pattern = this._input.get_regexp(pattern, true);
        result._update();
        return result;
      };
      Pattern.prototype.matching = function(pattern) {
        var result = this._create();
        result._match_pattern = this._input.get_regexp(pattern, true);
        result._update();
        return result;
      };
      Pattern.prototype._create = function() {
        return new Pattern(this._input, this);
      };
      Pattern.prototype._update = function() {
      };
      module2.exports.Pattern = Pattern;
    }
  });

  // ../../node_modules/js-beautify/js/src/core/whitespacepattern.js
  var require_whitespacepattern = __commonJS({
    "../../node_modules/js-beautify/js/src/core/whitespacepattern.js"(exports2, module2) {
      "use strict";
      var Pattern = require_pattern().Pattern;
      function WhitespacePattern(input_scanner, parent) {
        Pattern.call(this, input_scanner, parent);
        if (parent) {
          this._line_regexp = this._input.get_regexp(parent._line_regexp);
        } else {
          this.__set_whitespace_patterns("", "");
        }
        this.newline_count = 0;
        this.whitespace_before_token = "";
      }
      WhitespacePattern.prototype = new Pattern();
      WhitespacePattern.prototype.__set_whitespace_patterns = function(whitespace_chars, newline_chars) {
        whitespace_chars += "\\t ";
        newline_chars += "\\n\\r";
        this._match_pattern = this._input.get_regexp(
          "[" + whitespace_chars + newline_chars + "]+",
          true
        );
        this._newline_regexp = this._input.get_regexp(
          "\\r\\n|[" + newline_chars + "]"
        );
      };
      WhitespacePattern.prototype.read = function() {
        this.newline_count = 0;
        this.whitespace_before_token = "";
        var resulting_string = this._input.read(this._match_pattern);
        if (resulting_string === " ") {
          this.whitespace_before_token = " ";
        } else if (resulting_string) {
          var matches = this.__split(this._newline_regexp, resulting_string);
          this.newline_count = matches.length - 1;
          this.whitespace_before_token = matches[this.newline_count];
        }
        return resulting_string;
      };
      WhitespacePattern.prototype.matching = function(whitespace_chars, newline_chars) {
        var result = this._create();
        result.__set_whitespace_patterns(whitespace_chars, newline_chars);
        result._update();
        return result;
      };
      WhitespacePattern.prototype._create = function() {
        return new WhitespacePattern(this._input, this);
      };
      WhitespacePattern.prototype.__split = function(regexp, input_string) {
        regexp.lastIndex = 0;
        var start_index = 0;
        var result = [];
        var next_match = regexp.exec(input_string);
        while (next_match) {
          result.push(input_string.substring(start_index, next_match.index));
          start_index = next_match.index + next_match[0].length;
          next_match = regexp.exec(input_string);
        }
        if (start_index < input_string.length) {
          result.push(input_string.substring(start_index, input_string.length));
        } else {
          result.push("");
        }
        return result;
      };
      module2.exports.WhitespacePattern = WhitespacePattern;
    }
  });

  // ../../node_modules/js-beautify/js/src/core/tokenizer.js
  var require_tokenizer = __commonJS({
    "../../node_modules/js-beautify/js/src/core/tokenizer.js"(exports2, module2) {
      "use strict";
      var InputScanner = require_inputscanner().InputScanner;
      var Token = require_token().Token;
      var TokenStream = require_tokenstream().TokenStream;
      var WhitespacePattern = require_whitespacepattern().WhitespacePattern;
      var TOKEN = {
        START: "TK_START",
        RAW: "TK_RAW",
        EOF: "TK_EOF"
      };
      var Tokenizer = function(input_string, options) {
        this._input = new InputScanner(input_string);
        this._options = options || {};
        this.__tokens = null;
        this._patterns = {};
        this._patterns.whitespace = new WhitespacePattern(this._input);
      };
      Tokenizer.prototype.tokenize = function() {
        this._input.restart();
        this.__tokens = new TokenStream();
        this._reset();
        var current;
        var previous = new Token(TOKEN.START, "");
        var open_token = null;
        var open_stack = [];
        var comments = new TokenStream();
        while (previous.type !== TOKEN.EOF) {
          current = this._get_next_token(previous, open_token);
          while (this._is_comment(current)) {
            comments.add(current);
            current = this._get_next_token(previous, open_token);
          }
          if (!comments.isEmpty()) {
            current.comments_before = comments;
            comments = new TokenStream();
          }
          current.parent = open_token;
          if (this._is_opening(current)) {
            open_stack.push(open_token);
            open_token = current;
          } else if (open_token && this._is_closing(current, open_token)) {
            current.opened = open_token;
            open_token.closed = current;
            open_token = open_stack.pop();
            current.parent = open_token;
          }
          current.previous = previous;
          previous.next = current;
          this.__tokens.add(current);
          previous = current;
        }
        return this.__tokens;
      };
      Tokenizer.prototype._is_first_token = function() {
        return this.__tokens.isEmpty();
      };
      Tokenizer.prototype._reset = function() {
      };
      Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
        this._readWhitespace();
        var resulting_string = this._input.read(/.+/g);
        if (resulting_string) {
          return this._create_token(TOKEN.RAW, resulting_string);
        } else {
          return this._create_token(TOKEN.EOF, "");
        }
      };
      Tokenizer.prototype._is_comment = function(current_token) {
        return false;
      };
      Tokenizer.prototype._is_opening = function(current_token) {
        return false;
      };
      Tokenizer.prototype._is_closing = function(current_token, open_token) {
        return false;
      };
      Tokenizer.prototype._create_token = function(type2, text) {
        var token = new Token(
          type2,
          text,
          this._patterns.whitespace.newline_count,
          this._patterns.whitespace.whitespace_before_token
        );
        return token;
      };
      Tokenizer.prototype._readWhitespace = function() {
        return this._patterns.whitespace.read();
      };
      module2.exports.Tokenizer = Tokenizer;
      module2.exports.TOKEN = TOKEN;
    }
  });

  // ../../node_modules/js-beautify/js/src/core/directives.js
  var require_directives = __commonJS({
    "../../node_modules/js-beautify/js/src/core/directives.js"(exports2, module2) {
      "use strict";
      function Directives(start_block_pattern, end_block_pattern) {
        start_block_pattern = typeof start_block_pattern === "string" ? start_block_pattern : start_block_pattern.source;
        end_block_pattern = typeof end_block_pattern === "string" ? end_block_pattern : end_block_pattern.source;
        this.__directives_block_pattern = new RegExp(start_block_pattern + / beautify( \w+[:]\w+)+ /.source + end_block_pattern, "g");
        this.__directive_pattern = / (\w+)[:](\w+)/g;
        this.__directives_end_ignore_pattern = new RegExp(start_block_pattern + /\sbeautify\signore:end\s/.source + end_block_pattern, "g");
      }
      Directives.prototype.get_directives = function(text) {
        if (!text.match(this.__directives_block_pattern)) {
          return null;
        }
        var directives = {};
        this.__directive_pattern.lastIndex = 0;
        var directive_match = this.__directive_pattern.exec(text);
        while (directive_match) {
          directives[directive_match[1]] = directive_match[2];
          directive_match = this.__directive_pattern.exec(text);
        }
        return directives;
      };
      Directives.prototype.readIgnored = function(input) {
        return input.readUntilAfter(this.__directives_end_ignore_pattern);
      };
      module2.exports.Directives = Directives;
    }
  });

  // ../../node_modules/js-beautify/js/src/core/templatablepattern.js
  var require_templatablepattern = __commonJS({
    "../../node_modules/js-beautify/js/src/core/templatablepattern.js"(exports2, module2) {
      "use strict";
      var Pattern = require_pattern().Pattern;
      var template_names = {
        django: false,
        erb: false,
        handlebars: false,
        php: false,
        smarty: false,
        angular: false
      };
      function TemplatablePattern(input_scanner, parent) {
        Pattern.call(this, input_scanner, parent);
        this.__template_pattern = null;
        this._disabled = Object.assign({}, template_names);
        this._excluded = Object.assign({}, template_names);
        if (parent) {
          this.__template_pattern = this._input.get_regexp(parent.__template_pattern);
          this._excluded = Object.assign(this._excluded, parent._excluded);
          this._disabled = Object.assign(this._disabled, parent._disabled);
        }
        var pattern = new Pattern(input_scanner);
        this.__patterns = {
          handlebars_comment: pattern.starting_with(/{{!--/).until_after(/--}}/),
          handlebars_unescaped: pattern.starting_with(/{{{/).until_after(/}}}/),
          handlebars: pattern.starting_with(/{{/).until_after(/}}/),
          php: pattern.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
          erb: pattern.starting_with(/<%[^%]/).until_after(/[^%]%>/),
          // django coflicts with handlebars a bit.
          django: pattern.starting_with(/{%/).until_after(/%}/),
          django_value: pattern.starting_with(/{{/).until_after(/}}/),
          django_comment: pattern.starting_with(/{#/).until_after(/#}/),
          smarty: pattern.starting_with(/{(?=[^}{\s\n])/).until_after(/[^\s\n]}/),
          smarty_comment: pattern.starting_with(/{\*/).until_after(/\*}/),
          smarty_literal: pattern.starting_with(/{literal}/).until_after(/{\/literal}/)
        };
      }
      TemplatablePattern.prototype = new Pattern();
      TemplatablePattern.prototype._create = function() {
        return new TemplatablePattern(this._input, this);
      };
      TemplatablePattern.prototype._update = function() {
        this.__set_templated_pattern();
      };
      TemplatablePattern.prototype.disable = function(language) {
        var result = this._create();
        result._disabled[language] = true;
        result._update();
        return result;
      };
      TemplatablePattern.prototype.read_options = function(options) {
        var result = this._create();
        for (var language in template_names) {
          result._disabled[language] = options.templating.indexOf(language) === -1;
        }
        result._update();
        return result;
      };
      TemplatablePattern.prototype.exclude = function(language) {
        var result = this._create();
        result._excluded[language] = true;
        result._update();
        return result;
      };
      TemplatablePattern.prototype.read = function() {
        var result = "";
        if (this._match_pattern) {
          result = this._input.read(this._starting_pattern);
        } else {
          result = this._input.read(this._starting_pattern, this.__template_pattern);
        }
        var next = this._read_template();
        while (next) {
          if (this._match_pattern) {
            next += this._input.read(this._match_pattern);
          } else {
            next += this._input.readUntil(this.__template_pattern);
          }
          result += next;
          next = this._read_template();
        }
        if (this._until_after) {
          result += this._input.readUntilAfter(this._until_pattern);
        }
        return result;
      };
      TemplatablePattern.prototype.__set_templated_pattern = function() {
        var items = [];
        if (!this._disabled.php) {
          items.push(this.__patterns.php._starting_pattern.source);
        }
        if (!this._disabled.handlebars) {
          items.push(this.__patterns.handlebars._starting_pattern.source);
        }
        if (!this._disabled.angular) {
          items.push(this.__patterns.handlebars._starting_pattern.source);
        }
        if (!this._disabled.erb) {
          items.push(this.__patterns.erb._starting_pattern.source);
        }
        if (!this._disabled.django) {
          items.push(this.__patterns.django._starting_pattern.source);
          items.push(this.__patterns.django_value._starting_pattern.source);
          items.push(this.__patterns.django_comment._starting_pattern.source);
        }
        if (!this._disabled.smarty) {
          items.push(this.__patterns.smarty._starting_pattern.source);
        }
        if (this._until_pattern) {
          items.push(this._until_pattern.source);
        }
        this.__template_pattern = this._input.get_regexp("(?:" + items.join("|") + ")");
      };
      TemplatablePattern.prototype._read_template = function() {
        var resulting_string = "";
        var c = this._input.peek();
        if (c === "<") {
          var peek1 = this._input.peek(1);
          if (!this._disabled.php && !this._excluded.php && peek1 === "?") {
            resulting_string = resulting_string || this.__patterns.php.read();
          }
          if (!this._disabled.erb && !this._excluded.erb && peek1 === "%") {
            resulting_string = resulting_string || this.__patterns.erb.read();
          }
        } else if (c === "{") {
          if (!this._disabled.handlebars && !this._excluded.handlebars) {
            resulting_string = resulting_string || this.__patterns.handlebars_comment.read();
            resulting_string = resulting_string || this.__patterns.handlebars_unescaped.read();
            resulting_string = resulting_string || this.__patterns.handlebars.read();
          }
          if (!this._disabled.django) {
            if (!this._excluded.django && !this._excluded.handlebars) {
              resulting_string = resulting_string || this.__patterns.django_value.read();
            }
            if (!this._excluded.django) {
              resulting_string = resulting_string || this.__patterns.django_comment.read();
              resulting_string = resulting_string || this.__patterns.django.read();
            }
          }
          if (!this._disabled.smarty) {
            if (this._disabled.django && this._disabled.handlebars) {
              resulting_string = resulting_string || this.__patterns.smarty_comment.read();
              resulting_string = resulting_string || this.__patterns.smarty_literal.read();
              resulting_string = resulting_string || this.__patterns.smarty.read();
            }
          }
        }
        return resulting_string;
      };
      module2.exports.TemplatablePattern = TemplatablePattern;
    }
  });

  // ../../node_modules/js-beautify/js/src/javascript/tokenizer.js
  var require_tokenizer2 = __commonJS({
    "../../node_modules/js-beautify/js/src/javascript/tokenizer.js"(exports2, module2) {
      "use strict";
      var InputScanner = require_inputscanner().InputScanner;
      var BaseTokenizer = require_tokenizer().Tokenizer;
      var BASETOKEN = require_tokenizer().TOKEN;
      var Directives = require_directives().Directives;
      var acorn = require_acorn();
      var Pattern = require_pattern().Pattern;
      var TemplatablePattern = require_templatablepattern().TemplatablePattern;
      function in_array(what, arr) {
        return arr.indexOf(what) !== -1;
      }
      var TOKEN = {
        START_EXPR: "TK_START_EXPR",
        END_EXPR: "TK_END_EXPR",
        START_BLOCK: "TK_START_BLOCK",
        END_BLOCK: "TK_END_BLOCK",
        WORD: "TK_WORD",
        RESERVED: "TK_RESERVED",
        SEMICOLON: "TK_SEMICOLON",
        STRING: "TK_STRING",
        EQUALS: "TK_EQUALS",
        OPERATOR: "TK_OPERATOR",
        COMMA: "TK_COMMA",
        BLOCK_COMMENT: "TK_BLOCK_COMMENT",
        COMMENT: "TK_COMMENT",
        DOT: "TK_DOT",
        UNKNOWN: "TK_UNKNOWN",
        START: BASETOKEN.START,
        RAW: BASETOKEN.RAW,
        EOF: BASETOKEN.EOF
      };
      var directives_core = new Directives(/\/\*/, /\*\//);
      var number_pattern = /0[xX][0123456789abcdefABCDEF_]*n?|0[oO][01234567_]*n?|0[bB][01_]*n?|\d[\d_]*n|(?:\.\d[\d_]*|\d[\d_]*\.?[\d_]*)(?:[eE][+-]?[\d_]+)?/;
      var digit = /[0-9]/;
      var dot_pattern = /[^\d\.]/;
      var positionable_operators = ">>> === !== &&= ??= ||= << && >= ** != == <= >> || ?? |> < / - + > : & % ? ^ | *".split(" ");
      var punct = ">>>= ... >>= <<= === >>> !== **= &&= ??= ||= => ^= :: /= << <= == && -= >= >> != -- += ** || ?? ++ %= &= *= |= |> = ! ? > < : / ^ - + * & % ~ |";
      punct = punct.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
      punct = "\\?\\.(?!\\d) " + punct;
      punct = punct.replace(/ /g, "|");
      var punct_pattern = new RegExp(punct);
      var line_starters = "continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export".split(",");
      var reserved_words = line_starters.concat(["do", "in", "of", "else", "get", "set", "new", "catch", "finally", "typeof", "yield", "async", "await", "from", "as", "class", "extends"]);
      var reserved_word_pattern = new RegExp("^(?:" + reserved_words.join("|") + ")$");
      var in_html_comment;
      var Tokenizer = function(input_string, options) {
        BaseTokenizer.call(this, input_string, options);
        this._patterns.whitespace = this._patterns.whitespace.matching(
          /\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff/.source,
          /\u2028\u2029/.source
        );
        var pattern_reader = new Pattern(this._input);
        var templatable = new TemplatablePattern(this._input).read_options(this._options);
        this.__patterns = {
          template: templatable,
          identifier: templatable.starting_with(acorn.identifier).matching(acorn.identifierMatch),
          number: pattern_reader.matching(number_pattern),
          punct: pattern_reader.matching(punct_pattern),
          // comment ends just before nearest linefeed or end of file
          comment: pattern_reader.starting_with(/\/\//).until(/[\n\r\u2028\u2029]/),
          //  /* ... */ comment ends with nearest */ or end of file
          block_comment: pattern_reader.starting_with(/\/\*/).until_after(/\*\//),
          html_comment_start: pattern_reader.matching(/<!--/),
          html_comment_end: pattern_reader.matching(/-->/),
          include: pattern_reader.starting_with(/#include/).until_after(acorn.lineBreak),
          shebang: pattern_reader.starting_with(/#!/).until_after(acorn.lineBreak),
          xml: pattern_reader.matching(/[\s\S]*?<(\/?)([-a-zA-Z:0-9_.]+|{[^}]+?}|!\[CDATA\[[^\]]*?\]\]|)(\s*{[^}]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{([^{}]|{[^}]+?})+?}))*\s*(\/?)\s*>/),
          single_quote: templatable.until(/['\\\n\r\u2028\u2029]/),
          double_quote: templatable.until(/["\\\n\r\u2028\u2029]/),
          template_text: templatable.until(/[`\\$]/),
          template_expression: templatable.until(/[`}\\]/)
        };
      };
      Tokenizer.prototype = new BaseTokenizer();
      Tokenizer.prototype._is_comment = function(current_token) {
        return current_token.type === TOKEN.COMMENT || current_token.type === TOKEN.BLOCK_COMMENT || current_token.type === TOKEN.UNKNOWN;
      };
      Tokenizer.prototype._is_opening = function(current_token) {
        return current_token.type === TOKEN.START_BLOCK || current_token.type === TOKEN.START_EXPR;
      };
      Tokenizer.prototype._is_closing = function(current_token, open_token) {
        return (current_token.type === TOKEN.END_BLOCK || current_token.type === TOKEN.END_EXPR) && (open_token && (current_token.text === "]" && open_token.text === "[" || current_token.text === ")" && open_token.text === "(" || current_token.text === "}" && open_token.text === "{"));
      };
      Tokenizer.prototype._reset = function() {
        in_html_comment = false;
      };
      Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
        var token = null;
        this._readWhitespace();
        var c = this._input.peek();
        if (c === null) {
          return this._create_token(TOKEN.EOF, "");
        }
        token = token || this._read_non_javascript(c);
        token = token || this._read_string(c);
        token = token || this._read_pair(c, this._input.peek(1));
        token = token || this._read_word(previous_token);
        token = token || this._read_singles(c);
        token = token || this._read_comment(c);
        token = token || this._read_regexp(c, previous_token);
        token = token || this._read_xml(c, previous_token);
        token = token || this._read_punctuation();
        token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
        return token;
      };
      Tokenizer.prototype._read_word = function(previous_token) {
        var resulting_string;
        resulting_string = this.__patterns.identifier.read();
        if (resulting_string !== "") {
          resulting_string = resulting_string.replace(acorn.allLineBreaks, "\n");
          if (!(previous_token.type === TOKEN.DOT || previous_token.type === TOKEN.RESERVED && (previous_token.text === "set" || previous_token.text === "get")) && reserved_word_pattern.test(resulting_string)) {
            if ((resulting_string === "in" || resulting_string === "of") && (previous_token.type === TOKEN.WORD || previous_token.type === TOKEN.STRING)) {
              return this._create_token(TOKEN.OPERATOR, resulting_string);
            }
            return this._create_token(TOKEN.RESERVED, resulting_string);
          }
          return this._create_token(TOKEN.WORD, resulting_string);
        }
        resulting_string = this.__patterns.number.read();
        if (resulting_string !== "") {
          return this._create_token(TOKEN.WORD, resulting_string);
        }
      };
      Tokenizer.prototype._read_singles = function(c) {
        var token = null;
        if (c === "(" || c === "[") {
          token = this._create_token(TOKEN.START_EXPR, c);
        } else if (c === ")" || c === "]") {
          token = this._create_token(TOKEN.END_EXPR, c);
        } else if (c === "{") {
          token = this._create_token(TOKEN.START_BLOCK, c);
        } else if (c === "}") {
          token = this._create_token(TOKEN.END_BLOCK, c);
        } else if (c === ";") {
          token = this._create_token(TOKEN.SEMICOLON, c);
        } else if (c === "." && dot_pattern.test(this._input.peek(1))) {
          token = this._create_token(TOKEN.DOT, c);
        } else if (c === ",") {
          token = this._create_token(TOKEN.COMMA, c);
        }
        if (token) {
          this._input.next();
        }
        return token;
      };
      Tokenizer.prototype._read_pair = function(c, d2) {
        var token = null;
        if (c === "#" && d2 === "{") {
          token = this._create_token(TOKEN.START_BLOCK, c + d2);
        }
        if (token) {
          this._input.next();
          this._input.next();
        }
        return token;
      };
      Tokenizer.prototype._read_punctuation = function() {
        var resulting_string = this.__patterns.punct.read();
        if (resulting_string !== "") {
          if (resulting_string === "=") {
            return this._create_token(TOKEN.EQUALS, resulting_string);
          } else if (resulting_string === "?.") {
            return this._create_token(TOKEN.DOT, resulting_string);
          } else {
            return this._create_token(TOKEN.OPERATOR, resulting_string);
          }
        }
      };
      Tokenizer.prototype._read_non_javascript = function(c) {
        var resulting_string = "";
        if (c === "#") {
          if (this._is_first_token()) {
            resulting_string = this.__patterns.shebang.read();
            if (resulting_string) {
              return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + "\n");
            }
          }
          resulting_string = this.__patterns.include.read();
          if (resulting_string) {
            return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + "\n");
          }
          c = this._input.next();
          var sharp = "#";
          if (this._input.hasNext() && this._input.testChar(digit)) {
            do {
              c = this._input.next();
              sharp += c;
            } while (this._input.hasNext() && c !== "#" && c !== "=");
            if (c === "#") {
            } else if (this._input.peek() === "[" && this._input.peek(1) === "]") {
              sharp += "[]";
              this._input.next();
              this._input.next();
            } else if (this._input.peek() === "{" && this._input.peek(1) === "}") {
              sharp += "{}";
              this._input.next();
              this._input.next();
            }
            return this._create_token(TOKEN.WORD, sharp);
          }
          this._input.back();
        } else if (c === "<" && this._is_first_token()) {
          resulting_string = this.__patterns.html_comment_start.read();
          if (resulting_string) {
            while (this._input.hasNext() && !this._input.testChar(acorn.newline)) {
              resulting_string += this._input.next();
            }
            in_html_comment = true;
            return this._create_token(TOKEN.COMMENT, resulting_string);
          }
        } else if (in_html_comment && c === "-") {
          resulting_string = this.__patterns.html_comment_end.read();
          if (resulting_string) {
            in_html_comment = false;
            return this._create_token(TOKEN.COMMENT, resulting_string);
          }
        }
        return null;
      };
      Tokenizer.prototype._read_comment = function(c) {
        var token = null;
        if (c === "/") {
          var comment = "";
          if (this._input.peek(1) === "*") {
            comment = this.__patterns.block_comment.read();
            var directives = directives_core.get_directives(comment);
            if (directives && directives.ignore === "start") {
              comment += directives_core.readIgnored(this._input);
            }
            comment = comment.replace(acorn.allLineBreaks, "\n");
            token = this._create_token(TOKEN.BLOCK_COMMENT, comment);
            token.directives = directives;
          } else if (this._input.peek(1) === "/") {
            comment = this.__patterns.comment.read();
            token = this._create_token(TOKEN.COMMENT, comment);
          }
        }
        return token;
      };
      Tokenizer.prototype._read_string = function(c) {
        if (c === "`" || c === "'" || c === '"') {
          var resulting_string = this._input.next();
          this.has_char_escapes = false;
          if (c === "`") {
            resulting_string += this._read_string_recursive("`", true, "${");
          } else {
            resulting_string += this._read_string_recursive(c);
          }
          if (this.has_char_escapes && this._options.unescape_strings) {
            resulting_string = unescape_string(resulting_string);
          }
          if (this._input.peek() === c) {
            resulting_string += this._input.next();
          }
          resulting_string = resulting_string.replace(acorn.allLineBreaks, "\n");
          return this._create_token(TOKEN.STRING, resulting_string);
        }
        return null;
      };
      Tokenizer.prototype._allow_regexp_or_xml = function(previous_token) {
        return previous_token.type === TOKEN.RESERVED && in_array(previous_token.text, ["return", "case", "throw", "else", "do", "typeof", "yield"]) || previous_token.type === TOKEN.END_EXPR && previous_token.text === ")" && previous_token.opened.previous.type === TOKEN.RESERVED && in_array(previous_token.opened.previous.text, ["if", "while", "for"]) || in_array(previous_token.type, [
          TOKEN.COMMENT,
          TOKEN.START_EXPR,
          TOKEN.START_BLOCK,
          TOKEN.START,
          TOKEN.END_BLOCK,
          TOKEN.OPERATOR,
          TOKEN.EQUALS,
          TOKEN.EOF,
          TOKEN.SEMICOLON,
          TOKEN.COMMA
        ]);
      };
      Tokenizer.prototype._read_regexp = function(c, previous_token) {
        if (c === "/" && this._allow_regexp_or_xml(previous_token)) {
          var resulting_string = this._input.next();
          var esc2 = false;
          var in_char_class = false;
          while (this._input.hasNext() && ((esc2 || in_char_class || this._input.peek() !== c) && !this._input.testChar(acorn.newline))) {
            resulting_string += this._input.peek();
            if (!esc2) {
              esc2 = this._input.peek() === "\\";
              if (this._input.peek() === "[") {
                in_char_class = true;
              } else if (this._input.peek() === "]") {
                in_char_class = false;
              }
            } else {
              esc2 = false;
            }
            this._input.next();
          }
          if (this._input.peek() === c) {
            resulting_string += this._input.next();
            resulting_string += this._input.read(acorn.identifier);
          }
          return this._create_token(TOKEN.STRING, resulting_string);
        }
        return null;
      };
      Tokenizer.prototype._read_xml = function(c, previous_token) {
        if (this._options.e4x && c === "<" && this._allow_regexp_or_xml(previous_token)) {
          var xmlStr = "";
          var match = this.__patterns.xml.read_match();
          if (match) {
            var rootTag = match[2].replace(/^{\s+/, "{").replace(/\s+}$/, "}");
            var isCurlyRoot = rootTag.indexOf("{") === 0;
            var depth = 0;
            while (match) {
              var isEndTag = !!match[1];
              var tagName = match[2];
              var isSingletonTag = !!match[match.length - 1] || tagName.slice(0, 8) === "![CDATA[";
              if (!isSingletonTag && (tagName === rootTag || isCurlyRoot && tagName.replace(/^{\s+/, "{").replace(/\s+}$/, "}"))) {
                if (isEndTag) {
                  --depth;
                } else {
                  ++depth;
                }
              }
              xmlStr += match[0];
              if (depth <= 0) {
                break;
              }
              match = this.__patterns.xml.read_match();
            }
            if (!match) {
              xmlStr += this._input.match(/[\s\S]*/g)[0];
            }
            xmlStr = xmlStr.replace(acorn.allLineBreaks, "\n");
            return this._create_token(TOKEN.STRING, xmlStr);
          }
        }
        return null;
      };
      function unescape_string(s) {
        var out = "", escaped = 0;
        var input_scan = new InputScanner(s);
        var matched = null;
        while (input_scan.hasNext()) {
          matched = input_scan.match(/([\s]|[^\\]|\\\\)+/g);
          if (matched) {
            out += matched[0];
          }
          if (input_scan.peek() === "\\") {
            input_scan.next();
            if (input_scan.peek() === "x") {
              matched = input_scan.match(/x([0-9A-Fa-f]{2})/g);
            } else if (input_scan.peek() === "u") {
              matched = input_scan.match(/u([0-9A-Fa-f]{4})/g);
              if (!matched) {
                matched = input_scan.match(/u\{([0-9A-Fa-f]+)\}/g);
              }
            } else {
              out += "\\";
              if (input_scan.hasNext()) {
                out += input_scan.next();
              }
              continue;
            }
            if (!matched) {
              return s;
            }
            escaped = parseInt(matched[1], 16);
            if (escaped > 126 && escaped <= 255 && matched[0].indexOf("x") === 0) {
              return s;
            } else if (escaped >= 0 && escaped < 32) {
              out += "\\" + matched[0];
            } else if (escaped > 1114111) {
              out += "\\" + matched[0];
            } else if (escaped === 34 || escaped === 39 || escaped === 92) {
              out += "\\" + String.fromCharCode(escaped);
            } else {
              out += String.fromCharCode(escaped);
            }
          }
        }
        return out;
      }
      Tokenizer.prototype._read_string_recursive = function(delimiter, allow_unescaped_newlines, start_sub) {
        var current_char;
        var pattern;
        if (delimiter === "'") {
          pattern = this.__patterns.single_quote;
        } else if (delimiter === '"') {
          pattern = this.__patterns.double_quote;
        } else if (delimiter === "`") {
          pattern = this.__patterns.template_text;
        } else if (delimiter === "}") {
          pattern = this.__patterns.template_expression;
        }
        var resulting_string = pattern.read();
        var next = "";
        while (this._input.hasNext()) {
          next = this._input.next();
          if (next === delimiter || !allow_unescaped_newlines && acorn.newline.test(next)) {
            this._input.back();
            break;
          } else if (next === "\\" && this._input.hasNext()) {
            current_char = this._input.peek();
            if (current_char === "x" || current_char === "u") {
              this.has_char_escapes = true;
            } else if (current_char === "\r" && this._input.peek(1) === "\n") {
              this._input.next();
            }
            next += this._input.next();
          } else if (start_sub) {
            if (start_sub === "${" && next === "$" && this._input.peek() === "{") {
              next += this._input.next();
            }
            if (start_sub === next) {
              if (delimiter === "`") {
                next += this._read_string_recursive("}", allow_unescaped_newlines, "`");
              } else {
                next += this._read_string_recursive("`", allow_unescaped_newlines, "${");
              }
              if (this._input.hasNext()) {
                next += this._input.next();
              }
            }
          }
          next += pattern.read();
          resulting_string += next;
        }
        return resulting_string;
      };
      module2.exports.Tokenizer = Tokenizer;
      module2.exports.TOKEN = TOKEN;
      module2.exports.positionable_operators = positionable_operators.slice();
      module2.exports.line_starters = line_starters.slice();
    }
  });

  // ../../node_modules/js-beautify/js/src/javascript/beautifier.js
  var require_beautifier = __commonJS({
    "../../node_modules/js-beautify/js/src/javascript/beautifier.js"(exports2, module2) {
      "use strict";
      var Output = require_output().Output;
      var Token = require_token().Token;
      var acorn = require_acorn();
      var Options = require_options2().Options;
      var Tokenizer = require_tokenizer2().Tokenizer;
      var line_starters = require_tokenizer2().line_starters;
      var positionable_operators = require_tokenizer2().positionable_operators;
      var TOKEN = require_tokenizer2().TOKEN;
      function in_array(what, arr) {
        return arr.indexOf(what) !== -1;
      }
      function ltrim(s) {
        return s.replace(/^\s+/g, "");
      }
      function generateMapFromStrings(list) {
        var result = {};
        for (var x2 = 0; x2 < list.length; x2++) {
          result[list[x2].replace(/-/g, "_")] = list[x2];
        }
        return result;
      }
      function reserved_word(token, word) {
        return token && token.type === TOKEN.RESERVED && token.text === word;
      }
      function reserved_array(token, words) {
        return token && token.type === TOKEN.RESERVED && in_array(token.text, words);
      }
      var special_words = ["case", "return", "do", "if", "throw", "else", "await", "break", "continue", "async"];
      var validPositionValues = ["before-newline", "after-newline", "preserve-newline"];
      var OPERATOR_POSITION = generateMapFromStrings(validPositionValues);
      var OPERATOR_POSITION_BEFORE_OR_PRESERVE = [OPERATOR_POSITION.before_newline, OPERATOR_POSITION.preserve_newline];
      var MODE = {
        BlockStatement: "BlockStatement",
        // 'BLOCK'
        Statement: "Statement",
        // 'STATEMENT'
        ObjectLiteral: "ObjectLiteral",
        // 'OBJECT',
        ArrayLiteral: "ArrayLiteral",
        //'[EXPRESSION]',
        ForInitializer: "ForInitializer",
        //'(FOR-EXPRESSION)',
        Conditional: "Conditional",
        //'(COND-EXPRESSION)',
        Expression: "Expression"
        //'(EXPRESSION)'
      };
      function remove_redundant_indentation(output, frame) {
        if (frame.multiline_frame || frame.mode === MODE.ForInitializer || frame.mode === MODE.Conditional) {
          return;
        }
        output.remove_indent(frame.start_line_index);
      }
      function split_linebreaks(s) {
        s = s.replace(acorn.allLineBreaks, "\n");
        var out = [], idx = s.indexOf("\n");
        while (idx !== -1) {
          out.push(s.substring(0, idx));
          s = s.substring(idx + 1);
          idx = s.indexOf("\n");
        }
        if (s.length) {
          out.push(s);
        }
        return out;
      }
      function is_array(mode) {
        return mode === MODE.ArrayLiteral;
      }
      function is_expression(mode) {
        return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
      }
      function all_lines_start_with(lines, c) {
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (line.charAt(0) !== c) {
            return false;
          }
        }
        return true;
      }
      function each_line_matches_indent(lines, indent) {
        var i = 0, len = lines.length, line;
        for (; i < len; i++) {
          line = lines[i];
          if (line && line.indexOf(indent) !== 0) {
            return false;
          }
        }
        return true;
      }
      function Beautifier(source_text, options) {
        options = options || {};
        this._source_text = source_text || "";
        this._output = null;
        this._tokens = null;
        this._last_last_text = null;
        this._flags = null;
        this._previous_flags = null;
        this._flag_store = null;
        this._options = new Options(options);
      }
      Beautifier.prototype.create_flags = function(flags_base, mode) {
        var next_indent_level = 0;
        if (flags_base) {
          next_indent_level = flags_base.indentation_level;
          if (!this._output.just_added_newline() && flags_base.line_indent_level > next_indent_level) {
            next_indent_level = flags_base.line_indent_level;
          }
        }
        var next_flags = {
          mode,
          parent: flags_base,
          last_token: flags_base ? flags_base.last_token : new Token(TOKEN.START_BLOCK, ""),
          // last token text
          last_word: flags_base ? flags_base.last_word : "",
          // last TOKEN.WORD passed
          declaration_statement: false,
          declaration_assignment: false,
          multiline_frame: false,
          inline_frame: false,
          if_block: false,
          else_block: false,
          class_start_block: false,
          // class A { INSIDE HERE } or class B extends C { INSIDE HERE }
          do_block: false,
          do_while: false,
          import_block: false,
          in_case_statement: false,
          // switch(..){ INSIDE HERE }
          in_case: false,
          // we're on the exact line with "case 0:"
          case_body: false,
          // the indented case-action block
          case_block: false,
          // the indented case-action block is wrapped with {}
          indentation_level: next_indent_level,
          alignment: 0,
          line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
          start_line_index: this._output.get_line_number(),
          ternary_depth: 0
        };
        return next_flags;
      };
      Beautifier.prototype._reset = function(source_text) {
        var baseIndentString = source_text.match(/^[\t ]*/)[0];
        this._last_last_text = "";
        this._output = new Output(this._options, baseIndentString);
        this._output.raw = this._options.test_output_raw;
        this._flag_store = [];
        this.set_mode(MODE.BlockStatement);
        var tokenizer = new Tokenizer(source_text, this._options);
        this._tokens = tokenizer.tokenize();
        return source_text;
      };
      Beautifier.prototype.beautify = function() {
        if (this._options.disabled) {
          return this._source_text;
        }
        var sweet_code;
        var source_text = this._reset(this._source_text);
        var eol = this._options.eol;
        if (this._options.eol === "auto") {
          eol = "\n";
          if (source_text && acorn.lineBreak.test(source_text || "")) {
            eol = source_text.match(acorn.lineBreak)[0];
          }
        }
        var current_token = this._tokens.next();
        while (current_token) {
          this.handle_token(current_token);
          this._last_last_text = this._flags.last_token.text;
          this._flags.last_token = current_token;
          current_token = this._tokens.next();
        }
        sweet_code = this._output.get_code(eol);
        return sweet_code;
      };
      Beautifier.prototype.handle_token = function(current_token, preserve_statement_flags) {
        if (current_token.type === TOKEN.START_EXPR) {
          this.handle_start_expr(current_token);
        } else if (current_token.type === TOKEN.END_EXPR) {
          this.handle_end_expr(current_token);
        } else if (current_token.type === TOKEN.START_BLOCK) {
          this.handle_start_block(current_token);
        } else if (current_token.type === TOKEN.END_BLOCK) {
          this.handle_end_block(current_token);
        } else if (current_token.type === TOKEN.WORD) {
          this.handle_word(current_token);
        } else if (current_token.type === TOKEN.RESERVED) {
          this.handle_word(current_token);
        } else if (current_token.type === TOKEN.SEMICOLON) {
          this.handle_semicolon(current_token);
        } else if (current_token.type === TOKEN.STRING) {
          this.handle_string(current_token);
        } else if (current_token.type === TOKEN.EQUALS) {
          this.handle_equals(current_token);
        } else if (current_token.type === TOKEN.OPERATOR) {
          this.handle_operator(current_token);
        } else if (current_token.type === TOKEN.COMMA) {
          this.handle_comma(current_token);
        } else if (current_token.type === TOKEN.BLOCK_COMMENT) {
          this.handle_block_comment(current_token, preserve_statement_flags);
        } else if (current_token.type === TOKEN.COMMENT) {
          this.handle_comment(current_token, preserve_statement_flags);
        } else if (current_token.type === TOKEN.DOT) {
          this.handle_dot(current_token);
        } else if (current_token.type === TOKEN.EOF) {
          this.handle_eof(current_token);
        } else if (current_token.type === TOKEN.UNKNOWN) {
          this.handle_unknown(current_token, preserve_statement_flags);
        } else {
          this.handle_unknown(current_token, preserve_statement_flags);
        }
      };
      Beautifier.prototype.handle_whitespace_and_comments = function(current_token, preserve_statement_flags) {
        var newlines = current_token.newlines;
        var keep_whitespace = this._options.keep_array_indentation && is_array(this._flags.mode);
        if (current_token.comments_before) {
          var comment_token = current_token.comments_before.next();
          while (comment_token) {
            this.handle_whitespace_and_comments(comment_token, preserve_statement_flags);
            this.handle_token(comment_token, preserve_statement_flags);
            comment_token = current_token.comments_before.next();
          }
        }
        if (keep_whitespace) {
          for (var i = 0; i < newlines; i += 1) {
            this.print_newline(i > 0, preserve_statement_flags);
          }
        } else {
          if (this._options.max_preserve_newlines && newlines > this._options.max_preserve_newlines) {
            newlines = this._options.max_preserve_newlines;
          }
          if (this._options.preserve_newlines) {
            if (newlines > 1) {
              this.print_newline(false, preserve_statement_flags);
              for (var j = 1; j < newlines; j += 1) {
                this.print_newline(true, preserve_statement_flags);
              }
            }
          }
        }
      };
      var newline_restricted_tokens = ["async", "break", "continue", "return", "throw", "yield"];
      Beautifier.prototype.allow_wrap_or_preserved_newline = function(current_token, force_linewrap) {
        force_linewrap = force_linewrap === void 0 ? false : force_linewrap;
        if (this._output.just_added_newline()) {
          return;
        }
        var shouldPreserveOrForce = this._options.preserve_newlines && current_token.newlines || force_linewrap;
        var operatorLogicApplies = in_array(this._flags.last_token.text, positionable_operators) || in_array(current_token.text, positionable_operators);
        if (operatorLogicApplies) {
          var shouldPrintOperatorNewline = in_array(this._flags.last_token.text, positionable_operators) && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE) || in_array(current_token.text, positionable_operators);
          shouldPreserveOrForce = shouldPreserveOrForce && shouldPrintOperatorNewline;
        }
        if (shouldPreserveOrForce) {
          this.print_newline(false, true);
        } else if (this._options.wrap_line_length) {
          if (reserved_array(this._flags.last_token, newline_restricted_tokens)) {
            return;
          }
          this._output.set_wrap_point();
        }
      };
      Beautifier.prototype.print_newline = function(force_newline, preserve_statement_flags) {
        if (!preserve_statement_flags) {
          if (this._flags.last_token.text !== ";" && this._flags.last_token.text !== "," && this._flags.last_token.text !== "=" && (this._flags.last_token.type !== TOKEN.OPERATOR || this._flags.last_token.text === "--" || this._flags.last_token.text === "++")) {
            var next_token = this._tokens.peek();
            while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, "else")) && !this._flags.do_block) {
              this.restore_mode();
            }
          }
        }
        if (this._output.add_new_line(force_newline)) {
          this._flags.multiline_frame = true;
        }
      };
      Beautifier.prototype.print_token_line_indentation = function(current_token) {
        if (this._output.just_added_newline()) {
          if (this._options.keep_array_indentation && current_token.newlines && (current_token.text === "[" || is_array(this._flags.mode))) {
            this._output.current_line.set_indent(-1);
            this._output.current_line.push(current_token.whitespace_before);
            this._output.space_before_token = false;
          } else if (this._output.set_indent(this._flags.indentation_level, this._flags.alignment)) {
            this._flags.line_indent_level = this._flags.indentation_level;
          }
        }
      };
      Beautifier.prototype.print_token = function(current_token) {
        if (this._output.raw) {
          this._output.add_raw_token(current_token);
          return;
        }
        if (this._options.comma_first && current_token.previous && current_token.previous.type === TOKEN.COMMA && this._output.just_added_newline()) {
          if (this._output.previous_line.last() === ",") {
            var popped = this._output.previous_line.pop();
            if (this._output.previous_line.is_empty()) {
              this._output.previous_line.push(popped);
              this._output.trim(true);
              this._output.current_line.pop();
              this._output.trim();
            }
            this.print_token_line_indentation(current_token);
            this._output.add_token(",");
            this._output.space_before_token = true;
          }
        }
        this.print_token_line_indentation(current_token);
        this._output.non_breaking_space = true;
        this._output.add_token(current_token.text);
        if (this._output.previous_token_wrapped) {
          this._flags.multiline_frame = true;
        }
      };
      Beautifier.prototype.indent = function() {
        this._flags.indentation_level += 1;
        this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
      };
      Beautifier.prototype.deindent = function() {
        if (this._flags.indentation_level > 0 && (!this._flags.parent || this._flags.indentation_level > this._flags.parent.indentation_level)) {
          this._flags.indentation_level -= 1;
          this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
        }
      };
      Beautifier.prototype.set_mode = function(mode) {
        if (this._flags) {
          this._flag_store.push(this._flags);
          this._previous_flags = this._flags;
        } else {
          this._previous_flags = this.create_flags(null, mode);
        }
        this._flags = this.create_flags(this._previous_flags, mode);
        this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
      };
      Beautifier.prototype.restore_mode = function() {
        if (this._flag_store.length > 0) {
          this._previous_flags = this._flags;
          this._flags = this._flag_store.pop();
          if (this._previous_flags.mode === MODE.Statement) {
            remove_redundant_indentation(this._output, this._previous_flags);
          }
          this._output.set_indent(this._flags.indentation_level, this._flags.alignment);
        }
      };
      Beautifier.prototype.start_of_object_property = function() {
        return this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ["get", "set"]));
      };
      Beautifier.prototype.start_of_statement = function(current_token) {
        var start = false;
        start = start || reserved_array(this._flags.last_token, ["var", "let", "const"]) && current_token.type === TOKEN.WORD;
        start = start || reserved_word(this._flags.last_token, "do");
        start = start || !(this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement) && reserved_array(this._flags.last_token, newline_restricted_tokens) && !current_token.newlines;
        start = start || reserved_word(this._flags.last_token, "else") && !(reserved_word(current_token, "if") && !current_token.comments_before);
        start = start || this._flags.last_token.type === TOKEN.END_EXPR && (this._previous_flags.mode === MODE.ForInitializer || this._previous_flags.mode === MODE.Conditional);
        start = start || this._flags.last_token.type === TOKEN.WORD && this._flags.mode === MODE.BlockStatement && !this._flags.in_case && !(current_token.text === "--" || current_token.text === "++") && this._last_last_text !== "function" && current_token.type !== TOKEN.WORD && current_token.type !== TOKEN.RESERVED;
        start = start || this._flags.mode === MODE.ObjectLiteral && (this._flags.last_token.text === ":" && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ["get", "set"]));
        if (start) {
          this.set_mode(MODE.Statement);
          this.indent();
          this.handle_whitespace_and_comments(current_token, true);
          if (!this.start_of_object_property()) {
            this.allow_wrap_or_preserved_newline(
              current_token,
              reserved_array(current_token, ["do", "for", "if", "while"])
            );
          }
          return true;
        }
        return false;
      };
      Beautifier.prototype.handle_start_expr = function(current_token) {
        if (!this.start_of_statement(current_token)) {
          this.handle_whitespace_and_comments(current_token);
        }
        var next_mode = MODE.Expression;
        if (current_token.text === "[") {
          if (this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === ")") {
            if (reserved_array(this._flags.last_token, line_starters)) {
              this._output.space_before_token = true;
            }
            this.print_token(current_token);
            this.set_mode(next_mode);
            this.indent();
            if (this._options.space_in_paren) {
              this._output.space_before_token = true;
            }
            return;
          }
          next_mode = MODE.ArrayLiteral;
          if (is_array(this._flags.mode)) {
            if (this._flags.last_token.text === "[" || this._flags.last_token.text === "," && (this._last_last_text === "]" || this._last_last_text === "}")) {
              if (!this._options.keep_array_indentation) {
                this.print_newline();
              }
            }
          }
          if (!in_array(this._flags.last_token.type, [TOKEN.START_EXPR, TOKEN.END_EXPR, TOKEN.WORD, TOKEN.OPERATOR, TOKEN.DOT])) {
            this._output.space_before_token = true;
          }
        } else {
          if (this._flags.last_token.type === TOKEN.RESERVED) {
            if (this._flags.last_token.text === "for") {
              this._output.space_before_token = this._options.space_before_conditional;
              next_mode = MODE.ForInitializer;
            } else if (in_array(this._flags.last_token.text, ["if", "while", "switch"])) {
              this._output.space_before_token = this._options.space_before_conditional;
              next_mode = MODE.Conditional;
            } else if (in_array(this._flags.last_word, ["await", "async"])) {
              this._output.space_before_token = true;
            } else if (this._flags.last_token.text === "import" && current_token.whitespace_before === "") {
              this._output.space_before_token = false;
            } else if (in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === "catch") {
              this._output.space_before_token = true;
            }
          } else if (this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
            if (!this.start_of_object_property()) {
              this.allow_wrap_or_preserved_newline(current_token);
            }
          } else if (this._flags.last_token.type === TOKEN.WORD) {
            this._output.space_before_token = false;
            var peek_back_two = this._tokens.peek(-3);
            if (this._options.space_after_named_function && peek_back_two) {
              var peek_back_three = this._tokens.peek(-4);
              if (reserved_array(peek_back_two, ["async", "function"]) || peek_back_two.text === "*" && reserved_array(peek_back_three, ["async", "function"])) {
                this._output.space_before_token = true;
              } else if (this._flags.mode === MODE.ObjectLiteral) {
                if (peek_back_two.text === "{" || peek_back_two.text === "," || peek_back_two.text === "*" && (peek_back_three.text === "{" || peek_back_three.text === ",")) {
                  this._output.space_before_token = true;
                }
              } else if (this._flags.parent && this._flags.parent.class_start_block) {
                this._output.space_before_token = true;
              }
            }
          } else {
            this.allow_wrap_or_preserved_newline(current_token);
          }
          if (this._flags.last_token.type === TOKEN.RESERVED && (this._flags.last_word === "function" || this._flags.last_word === "typeof") || this._flags.last_token.text === "*" && (in_array(this._last_last_text, ["function", "yield"]) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ["{", ","]))) {
            this._output.space_before_token = this._options.space_after_anon_function;
          }
        }
        if (this._flags.last_token.text === ";" || this._flags.last_token.type === TOKEN.START_BLOCK) {
          this.print_newline();
        } else if (this._flags.last_token.type === TOKEN.END_EXPR || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.END_BLOCK || this._flags.last_token.text === "." || this._flags.last_token.type === TOKEN.COMMA) {
          this.allow_wrap_or_preserved_newline(current_token, current_token.newlines);
        }
        this.print_token(current_token);
        this.set_mode(next_mode);
        if (this._options.space_in_paren) {
          this._output.space_before_token = true;
        }
        this.indent();
      };
      Beautifier.prototype.handle_end_expr = function(current_token) {
        while (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }
        this.handle_whitespace_and_comments(current_token);
        if (this._flags.multiline_frame) {
          this.allow_wrap_or_preserved_newline(
            current_token,
            current_token.text === "]" && is_array(this._flags.mode) && !this._options.keep_array_indentation
          );
        }
        if (this._options.space_in_paren) {
          if (this._flags.last_token.type === TOKEN.START_EXPR && !this._options.space_in_empty_paren) {
            this._output.trim();
            this._output.space_before_token = false;
          } else {
            this._output.space_before_token = true;
          }
        }
        this.deindent();
        this.print_token(current_token);
        this.restore_mode();
        remove_redundant_indentation(this._output, this._previous_flags);
        if (this._flags.do_while && this._previous_flags.mode === MODE.Conditional) {
          this._previous_flags.mode = MODE.Expression;
          this._flags.do_block = false;
          this._flags.do_while = false;
        }
      };
      Beautifier.prototype.handle_start_block = function(current_token) {
        this.handle_whitespace_and_comments(current_token);
        var next_token = this._tokens.peek();
        var second_token = this._tokens.peek(1);
        if (this._flags.last_word === "switch" && this._flags.last_token.type === TOKEN.END_EXPR) {
          this.set_mode(MODE.BlockStatement);
          this._flags.in_case_statement = true;
        } else if (this._flags.case_body) {
          this.set_mode(MODE.BlockStatement);
        } else if (second_token && (in_array(second_token.text, [":", ","]) && in_array(next_token.type, [TOKEN.STRING, TOKEN.WORD, TOKEN.RESERVED]) || in_array(next_token.text, ["get", "set", "..."]) && in_array(second_token.type, [TOKEN.WORD, TOKEN.RESERVED]))) {
          if (in_array(this._last_last_text, ["class", "interface"]) && !in_array(second_token.text, [":", ","])) {
            this.set_mode(MODE.BlockStatement);
          } else {
            this.set_mode(MODE.ObjectLiteral);
          }
        } else if (this._flags.last_token.type === TOKEN.OPERATOR && this._flags.last_token.text === "=>") {
          this.set_mode(MODE.BlockStatement);
        } else if (in_array(this._flags.last_token.type, [TOKEN.EQUALS, TOKEN.START_EXPR, TOKEN.COMMA, TOKEN.OPERATOR]) || reserved_array(this._flags.last_token, ["return", "throw", "import", "default"])) {
          this.set_mode(MODE.ObjectLiteral);
        } else {
          this.set_mode(MODE.BlockStatement);
        }
        if (this._flags.last_token) {
          if (reserved_array(this._flags.last_token.previous, ["class", "extends"])) {
            this._flags.class_start_block = true;
          }
        }
        var empty_braces = !next_token.comments_before && next_token.text === "}";
        var empty_anonymous_function = empty_braces && this._flags.last_word === "function" && this._flags.last_token.type === TOKEN.END_EXPR;
        if (this._options.brace_preserve_inline) {
          var index = 0;
          var check_token = null;
          this._flags.inline_frame = true;
          do {
            index += 1;
            check_token = this._tokens.peek(index - 1);
            if (check_token.newlines) {
              this._flags.inline_frame = false;
              break;
            }
          } while (check_token.type !== TOKEN.EOF && !(check_token.type === TOKEN.END_BLOCK && check_token.opened === current_token));
        }
        if ((this._options.brace_style === "expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
          if (this._flags.last_token.type !== TOKEN.OPERATOR && (empty_anonymous_function || this._flags.last_token.type === TOKEN.EQUALS || reserved_array(this._flags.last_token, special_words) && this._flags.last_token.text !== "else")) {
            this._output.space_before_token = true;
          } else {
            this.print_newline(false, true);
          }
        } else {
          if (is_array(this._previous_flags.mode) && (this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.COMMA)) {
            if (this._flags.last_token.type === TOKEN.COMMA || this._options.space_in_paren) {
              this._output.space_before_token = true;
            }
            if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR && this._flags.inline_frame) {
              this.allow_wrap_or_preserved_newline(current_token);
              this._previous_flags.multiline_frame = this._previous_flags.multiline_frame || this._flags.multiline_frame;
              this._flags.multiline_frame = false;
            }
          }
          if (this._flags.last_token.type !== TOKEN.OPERATOR && this._flags.last_token.type !== TOKEN.START_EXPR) {
            if (in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.SEMICOLON]) && !this._flags.inline_frame) {
              this.print_newline();
            } else {
              this._output.space_before_token = true;
            }
          }
        }
        this.print_token(current_token);
        this.indent();
        if (!empty_braces && !(this._options.brace_preserve_inline && this._flags.inline_frame)) {
          this.print_newline();
        }
      };
      Beautifier.prototype.handle_end_block = function(current_token) {
        this.handle_whitespace_and_comments(current_token);
        while (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }
        var empty_braces = this._flags.last_token.type === TOKEN.START_BLOCK;
        if (this._flags.inline_frame && !empty_braces) {
          this._output.space_before_token = true;
        } else if (this._options.brace_style === "expand") {
          if (!empty_braces) {
            this.print_newline();
          }
        } else {
          if (!empty_braces) {
            if (is_array(this._flags.mode) && this._options.keep_array_indentation) {
              this._options.keep_array_indentation = false;
              this.print_newline();
              this._options.keep_array_indentation = true;
            } else {
              this.print_newline();
            }
          }
        }
        this.restore_mode();
        this.print_token(current_token);
      };
      Beautifier.prototype.handle_word = function(current_token) {
        if (current_token.type === TOKEN.RESERVED) {
          if (in_array(current_token.text, ["set", "get"]) && this._flags.mode !== MODE.ObjectLiteral) {
            current_token.type = TOKEN.WORD;
          } else if (current_token.text === "import" && in_array(this._tokens.peek().text, ["(", "."])) {
            current_token.type = TOKEN.WORD;
          } else if (in_array(current_token.text, ["as", "from"]) && !this._flags.import_block) {
            current_token.type = TOKEN.WORD;
          } else if (this._flags.mode === MODE.ObjectLiteral) {
            var next_token = this._tokens.peek();
            if (next_token.text === ":") {
              current_token.type = TOKEN.WORD;
            }
          }
        }
        if (this.start_of_statement(current_token)) {
          if (reserved_array(this._flags.last_token, ["var", "let", "const"]) && current_token.type === TOKEN.WORD) {
            this._flags.declaration_statement = true;
          }
        } else if (current_token.newlines && !is_expression(this._flags.mode) && (this._flags.last_token.type !== TOKEN.OPERATOR || (this._flags.last_token.text === "--" || this._flags.last_token.text === "++")) && this._flags.last_token.type !== TOKEN.EQUALS && (this._options.preserve_newlines || !reserved_array(this._flags.last_token, ["var", "let", "const", "set", "get"]))) {
          this.handle_whitespace_and_comments(current_token);
          this.print_newline();
        } else {
          this.handle_whitespace_and_comments(current_token);
        }
        if (this._flags.do_block && !this._flags.do_while) {
          if (reserved_word(current_token, "while")) {
            this._output.space_before_token = true;
            this.print_token(current_token);
            this._output.space_before_token = true;
            this._flags.do_while = true;
            return;
          } else {
            this.print_newline();
            this._flags.do_block = false;
          }
        }
        if (this._flags.if_block) {
          if (!this._flags.else_block && reserved_word(current_token, "else")) {
            this._flags.else_block = true;
          } else {
            while (this._flags.mode === MODE.Statement) {
              this.restore_mode();
            }
            this._flags.if_block = false;
            this._flags.else_block = false;
          }
        }
        if (this._flags.in_case_statement && reserved_array(current_token, ["case", "default"])) {
          this.print_newline();
          if (!this._flags.case_block && (this._flags.case_body || this._options.jslint_happy)) {
            this.deindent();
          }
          this._flags.case_body = false;
          this.print_token(current_token);
          this._flags.in_case = true;
          return;
        }
        if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
          if (!this.start_of_object_property() && !// start of object property is different for numeric values with +/- prefix operators
          (in_array(this._flags.last_token.text, ["+", "-"]) && this._last_last_text === ":" && this._flags.parent.mode === MODE.ObjectLiteral)) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        }
        if (reserved_word(current_token, "function")) {
          if (in_array(this._flags.last_token.text, ["}", ";"]) || this._output.just_added_newline() && !(in_array(this._flags.last_token.text, ["(", "[", "{", ":", "=", ","]) || this._flags.last_token.type === TOKEN.OPERATOR)) {
            if (!this._output.just_added_blankline() && !current_token.comments_before) {
              this.print_newline();
              this.print_newline(true);
            }
          }
          if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD) {
            if (reserved_array(this._flags.last_token, ["get", "set", "new", "export"]) || reserved_array(this._flags.last_token, newline_restricted_tokens)) {
              this._output.space_before_token = true;
            } else if (reserved_word(this._flags.last_token, "default") && this._last_last_text === "export") {
              this._output.space_before_token = true;
            } else if (this._flags.last_token.text === "declare") {
              this._output.space_before_token = true;
            } else {
              this.print_newline();
            }
          } else if (this._flags.last_token.type === TOKEN.OPERATOR || this._flags.last_token.text === "=") {
            this._output.space_before_token = true;
          } else if (!this._flags.multiline_frame && (is_expression(this._flags.mode) || is_array(this._flags.mode))) {
          } else {
            this.print_newline();
          }
          this.print_token(current_token);
          this._flags.last_word = current_token.text;
          return;
        }
        var prefix = "NONE";
        if (this._flags.last_token.type === TOKEN.END_BLOCK) {
          if (this._previous_flags.inline_frame) {
            prefix = "SPACE";
          } else if (!reserved_array(current_token, ["else", "catch", "finally", "from"])) {
            prefix = "NEWLINE";
          } else {
            if (this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) {
              prefix = "NEWLINE";
            } else {
              prefix = "SPACE";
              this._output.space_before_token = true;
            }
          }
        } else if (this._flags.last_token.type === TOKEN.SEMICOLON && this._flags.mode === MODE.BlockStatement) {
          prefix = "NEWLINE";
        } else if (this._flags.last_token.type === TOKEN.SEMICOLON && is_expression(this._flags.mode)) {
          prefix = "SPACE";
        } else if (this._flags.last_token.type === TOKEN.STRING) {
          prefix = "NEWLINE";
        } else if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === "*" && (in_array(this._last_last_text, ["function", "yield"]) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ["{", ","]))) {
          prefix = "SPACE";
        } else if (this._flags.last_token.type === TOKEN.START_BLOCK) {
          if (this._flags.inline_frame) {
            prefix = "SPACE";
          } else {
            prefix = "NEWLINE";
          }
        } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
          this._output.space_before_token = true;
          prefix = "NEWLINE";
        }
        if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ")") {
          if (this._flags.inline_frame || this._flags.last_token.text === "else" || this._flags.last_token.text === "export") {
            prefix = "SPACE";
          } else {
            prefix = "NEWLINE";
          }
        }
        if (reserved_array(current_token, ["else", "catch", "finally"])) {
          if ((!(this._flags.last_token.type === TOKEN.END_BLOCK && this._previous_flags.mode === MODE.BlockStatement) || this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
            this.print_newline();
          } else {
            this._output.trim(true);
            var line = this._output.current_line;
            if (line.last() !== "}") {
              this.print_newline();
            }
            this._output.space_before_token = true;
          }
        } else if (prefix === "NEWLINE") {
          if (reserved_array(this._flags.last_token, special_words)) {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.text === "declare" && reserved_array(current_token, ["var", "let", "const"])) {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.type !== TOKEN.END_EXPR) {
            if ((this._flags.last_token.type !== TOKEN.START_EXPR || !reserved_array(current_token, ["var", "let", "const"])) && this._flags.last_token.text !== ":") {
              if (reserved_word(current_token, "if") && reserved_word(current_token.previous, "else")) {
                this._output.space_before_token = true;
              } else {
                this.print_newline();
              }
            }
          } else if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ")") {
            this.print_newline();
          }
        } else if (this._flags.multiline_frame && is_array(this._flags.mode) && this._flags.last_token.text === "," && this._last_last_text === "}") {
          this.print_newline();
        } else if (prefix === "SPACE") {
          this._output.space_before_token = true;
        }
        if (current_token.previous && (current_token.previous.type === TOKEN.WORD || current_token.previous.type === TOKEN.RESERVED)) {
          this._output.space_before_token = true;
        }
        this.print_token(current_token);
        this._flags.last_word = current_token.text;
        if (current_token.type === TOKEN.RESERVED) {
          if (current_token.text === "do") {
            this._flags.do_block = true;
          } else if (current_token.text === "if") {
            this._flags.if_block = true;
          } else if (current_token.text === "import") {
            this._flags.import_block = true;
          } else if (this._flags.import_block && reserved_word(current_token, "from")) {
            this._flags.import_block = false;
          }
        }
      };
      Beautifier.prototype.handle_semicolon = function(current_token) {
        if (this.start_of_statement(current_token)) {
          this._output.space_before_token = false;
        } else {
          this.handle_whitespace_and_comments(current_token);
        }
        var next_token = this._tokens.peek();
        while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, "else")) && !this._flags.do_block) {
          this.restore_mode();
        }
        if (this._flags.import_block) {
          this._flags.import_block = false;
        }
        this.print_token(current_token);
      };
      Beautifier.prototype.handle_string = function(current_token) {
        if (current_token.text.startsWith("`") && current_token.newlines === 0 && current_token.whitespace_before === "" && (current_token.previous.text === ")" || this._flags.last_token.type === TOKEN.WORD)) {
        } else if (this.start_of_statement(current_token)) {
          this._output.space_before_token = true;
        } else {
          this.handle_whitespace_and_comments(current_token);
          if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.inline_frame) {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
            if (!this.start_of_object_property()) {
              this.allow_wrap_or_preserved_newline(current_token);
            }
          } else if (current_token.text.startsWith("`") && this._flags.last_token.type === TOKEN.END_EXPR && (current_token.previous.text === "]" || current_token.previous.text === ")") && current_token.newlines === 0) {
            this._output.space_before_token = true;
          } else {
            this.print_newline();
          }
        }
        this.print_token(current_token);
      };
      Beautifier.prototype.handle_equals = function(current_token) {
        if (this.start_of_statement(current_token)) {
        } else {
          this.handle_whitespace_and_comments(current_token);
        }
        if (this._flags.declaration_statement) {
          this._flags.declaration_assignment = true;
        }
        this._output.space_before_token = true;
        this.print_token(current_token);
        this._output.space_before_token = true;
      };
      Beautifier.prototype.handle_comma = function(current_token) {
        this.handle_whitespace_and_comments(current_token, true);
        this.print_token(current_token);
        this._output.space_before_token = true;
        if (this._flags.declaration_statement) {
          if (is_expression(this._flags.parent.mode)) {
            this._flags.declaration_assignment = false;
          }
          if (this._flags.declaration_assignment) {
            this._flags.declaration_assignment = false;
            this.print_newline(false, true);
          } else if (this._options.comma_first) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        } else if (this._flags.mode === MODE.ObjectLiteral || this._flags.mode === MODE.Statement && this._flags.parent.mode === MODE.ObjectLiteral) {
          if (this._flags.mode === MODE.Statement) {
            this.restore_mode();
          }
          if (!this._flags.inline_frame) {
            this.print_newline();
          }
        } else if (this._options.comma_first) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
      };
      Beautifier.prototype.handle_operator = function(current_token) {
        var isGeneratorAsterisk = current_token.text === "*" && (reserved_array(this._flags.last_token, ["function", "yield"]) || in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.COMMA, TOKEN.END_BLOCK, TOKEN.SEMICOLON]));
        var isUnary = in_array(current_token.text, ["-", "+"]) && (in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.START_EXPR, TOKEN.EQUALS, TOKEN.OPERATOR]) || in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === ",");
        if (this.start_of_statement(current_token)) {
        } else {
          var preserve_statement_flags = !isGeneratorAsterisk;
          this.handle_whitespace_and_comments(current_token, preserve_statement_flags);
        }
        if (current_token.text === "*" && this._flags.last_token.type === TOKEN.DOT) {
          this.print_token(current_token);
          return;
        }
        if (current_token.text === "::") {
          this.print_token(current_token);
          return;
        }
        if (in_array(current_token.text, ["-", "+"]) && this.start_of_object_property()) {
          this.print_token(current_token);
          return;
        }
        if (this._flags.last_token.type === TOKEN.OPERATOR && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE)) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
        if (current_token.text === ":" && this._flags.in_case) {
          this.print_token(current_token);
          this._flags.in_case = false;
          this._flags.case_body = true;
          if (this._tokens.peek().type !== TOKEN.START_BLOCK) {
            this.indent();
            this.print_newline();
            this._flags.case_block = false;
          } else {
            this._flags.case_block = true;
            this._output.space_before_token = true;
          }
          return;
        }
        var space_before = true;
        var space_after = true;
        var in_ternary = false;
        if (current_token.text === ":") {
          if (this._flags.ternary_depth === 0) {
            space_before = false;
          } else {
            this._flags.ternary_depth -= 1;
            in_ternary = true;
          }
        } else if (current_token.text === "?") {
          this._flags.ternary_depth += 1;
        }
        if (!isUnary && !isGeneratorAsterisk && this._options.preserve_newlines && in_array(current_token.text, positionable_operators)) {
          var isColon = current_token.text === ":";
          var isTernaryColon = isColon && in_ternary;
          var isOtherColon = isColon && !in_ternary;
          switch (this._options.operator_position) {
            case OPERATOR_POSITION.before_newline:
              this._output.space_before_token = !isOtherColon;
              this.print_token(current_token);
              if (!isColon || isTernaryColon) {
                this.allow_wrap_or_preserved_newline(current_token);
              }
              this._output.space_before_token = true;
              return;
            case OPERATOR_POSITION.after_newline:
              this._output.space_before_token = true;
              if (!isColon || isTernaryColon) {
                if (this._tokens.peek().newlines) {
                  this.print_newline(false, true);
                } else {
                  this.allow_wrap_or_preserved_newline(current_token);
                }
              } else {
                this._output.space_before_token = false;
              }
              this.print_token(current_token);
              this._output.space_before_token = true;
              return;
            case OPERATOR_POSITION.preserve_newline:
              if (!isOtherColon) {
                this.allow_wrap_or_preserved_newline(current_token);
              }
              space_before = !(this._output.just_added_newline() || isOtherColon);
              this._output.space_before_token = space_before;
              this.print_token(current_token);
              this._output.space_before_token = true;
              return;
          }
        }
        if (isGeneratorAsterisk) {
          this.allow_wrap_or_preserved_newline(current_token);
          space_before = false;
          var next_token = this._tokens.peek();
          space_after = next_token && in_array(next_token.type, [TOKEN.WORD, TOKEN.RESERVED]);
        } else if (current_token.text === "...") {
          this.allow_wrap_or_preserved_newline(current_token);
          space_before = this._flags.last_token.type === TOKEN.START_BLOCK;
          space_after = false;
        } else if (in_array(current_token.text, ["--", "++", "!", "~"]) || isUnary) {
          if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
          space_before = false;
          space_after = false;
          if (current_token.newlines && (current_token.text === "--" || current_token.text === "++" || current_token.text === "~")) {
            var new_line_needed = reserved_array(this._flags.last_token, special_words) && current_token.newlines;
            if (new_line_needed && (this._previous_flags.if_block || this._previous_flags.else_block)) {
              this.restore_mode();
            }
            this.print_newline(new_line_needed, true);
          }
          if (this._flags.last_token.text === ";" && is_expression(this._flags.mode)) {
            space_before = true;
          }
          if (this._flags.last_token.type === TOKEN.RESERVED) {
            space_before = true;
          } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
            space_before = !(this._flags.last_token.text === "]" && (current_token.text === "--" || current_token.text === "++"));
          } else if (this._flags.last_token.type === TOKEN.OPERATOR) {
            space_before = in_array(current_token.text, ["--", "-", "++", "+"]) && in_array(this._flags.last_token.text, ["--", "-", "++", "+"]);
            if (in_array(current_token.text, ["+", "-"]) && in_array(this._flags.last_token.text, ["--", "++"])) {
              space_after = true;
            }
          }
          if ((this._flags.mode === MODE.BlockStatement && !this._flags.inline_frame || this._flags.mode === MODE.Statement) && (this._flags.last_token.text === "{" || this._flags.last_token.text === ";")) {
            this.print_newline();
          }
        }
        this._output.space_before_token = this._output.space_before_token || space_before;
        this.print_token(current_token);
        this._output.space_before_token = space_after;
      };
      Beautifier.prototype.handle_block_comment = function(current_token, preserve_statement_flags) {
        if (this._output.raw) {
          this._output.add_raw_token(current_token);
          if (current_token.directives && current_token.directives.preserve === "end") {
            this._output.raw = this._options.test_output_raw;
          }
          return;
        }
        if (current_token.directives) {
          this.print_newline(false, preserve_statement_flags);
          this.print_token(current_token);
          if (current_token.directives.preserve === "start") {
            this._output.raw = true;
          }
          this.print_newline(false, true);
          return;
        }
        if (!acorn.newline.test(current_token.text) && !current_token.newlines) {
          this._output.space_before_token = true;
          this.print_token(current_token);
          this._output.space_before_token = true;
          return;
        } else {
          this.print_block_commment(current_token, preserve_statement_flags);
        }
      };
      Beautifier.prototype.print_block_commment = function(current_token, preserve_statement_flags) {
        var lines = split_linebreaks(current_token.text);
        var j;
        var javadoc = false;
        var starless = false;
        var lastIndent = current_token.whitespace_before;
        var lastIndentLength = lastIndent.length;
        this.print_newline(false, preserve_statement_flags);
        this.print_token_line_indentation(current_token);
        this._output.add_token(lines[0]);
        this.print_newline(false, preserve_statement_flags);
        if (lines.length > 1) {
          lines = lines.slice(1);
          javadoc = all_lines_start_with(lines, "*");
          starless = each_line_matches_indent(lines, lastIndent);
          if (javadoc) {
            this._flags.alignment = 1;
          }
          for (j = 0; j < lines.length; j++) {
            if (javadoc) {
              this.print_token_line_indentation(current_token);
              this._output.add_token(ltrim(lines[j]));
            } else if (starless && lines[j]) {
              this.print_token_line_indentation(current_token);
              this._output.add_token(lines[j].substring(lastIndentLength));
            } else {
              this._output.current_line.set_indent(-1);
              this._output.add_token(lines[j]);
            }
            this.print_newline(false, preserve_statement_flags);
          }
          this._flags.alignment = 0;
        }
      };
      Beautifier.prototype.handle_comment = function(current_token, preserve_statement_flags) {
        if (current_token.newlines) {
          this.print_newline(false, preserve_statement_flags);
        } else {
          this._output.trim(true);
        }
        this._output.space_before_token = true;
        this.print_token(current_token);
        this.print_newline(false, preserve_statement_flags);
      };
      Beautifier.prototype.handle_dot = function(current_token) {
        if (this.start_of_statement(current_token)) {
        } else {
          this.handle_whitespace_and_comments(current_token, true);
        }
        if (this._flags.last_token.text.match("^[0-9]+$")) {
          this._output.space_before_token = true;
        }
        if (reserved_array(this._flags.last_token, special_words)) {
          this._output.space_before_token = false;
        } else {
          this.allow_wrap_or_preserved_newline(
            current_token,
            this._flags.last_token.text === ")" && this._options.break_chained_methods
          );
        }
        if (this._options.unindent_chained_methods && this._output.just_added_newline()) {
          this.deindent();
        }
        this.print_token(current_token);
      };
      Beautifier.prototype.handle_unknown = function(current_token, preserve_statement_flags) {
        this.print_token(current_token);
        if (current_token.text[current_token.text.length - 1] === "\n") {
          this.print_newline(false, preserve_statement_flags);
        }
      };
      Beautifier.prototype.handle_eof = function(current_token) {
        while (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }
        this.handle_whitespace_and_comments(current_token);
      };
      module2.exports.Beautifier = Beautifier;
    }
  });

  // ../../node_modules/js-beautify/js/src/javascript/index.js
  var require_javascript = __commonJS({
    "../../node_modules/js-beautify/js/src/javascript/index.js"(exports2, module2) {
      "use strict";
      var Beautifier = require_beautifier().Beautifier;
      var Options = require_options2().Options;
      function js_beautify(js_source_text, options) {
        var beautifier = new Beautifier(js_source_text, options);
        return beautifier.beautify();
      }
      module2.exports = js_beautify;
      module2.exports.defaultOptions = function() {
        return new Options();
      };
    }
  });

  // ../../node_modules/js-beautify/js/src/css/options.js
  var require_options3 = __commonJS({
    "../../node_modules/js-beautify/js/src/css/options.js"(exports2, module2) {
      "use strict";
      var BaseOptions = require_options().Options;
      function Options(options) {
        BaseOptions.call(this, options, "css");
        this.selector_separator_newline = this._get_boolean("selector_separator_newline", true);
        this.newline_between_rules = this._get_boolean("newline_between_rules", true);
        var space_around_selector_separator = this._get_boolean("space_around_selector_separator");
        this.space_around_combinator = this._get_boolean("space_around_combinator") || space_around_selector_separator;
        var brace_style_split = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
        this.brace_style = "collapse";
        for (var bs = 0; bs < brace_style_split.length; bs++) {
          if (brace_style_split[bs] !== "expand") {
            this.brace_style = "collapse";
          } else {
            this.brace_style = brace_style_split[bs];
          }
        }
      }
      Options.prototype = new BaseOptions();
      module2.exports.Options = Options;
    }
  });

  // ../../node_modules/js-beautify/js/src/css/beautifier.js
  var require_beautifier2 = __commonJS({
    "../../node_modules/js-beautify/js/src/css/beautifier.js"(exports2, module2) {
      "use strict";
      var Options = require_options3().Options;
      var Output = require_output().Output;
      var InputScanner = require_inputscanner().InputScanner;
      var Directives = require_directives().Directives;
      var directives_core = new Directives(/\/\*/, /\*\//);
      var lineBreak = /\r\n|[\r\n]/;
      var allLineBreaks = /\r\n|[\r\n]/g;
      var whitespaceChar = /\s/;
      var whitespacePattern = /(?:\s|\n)+/g;
      var block_comment_pattern = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g;
      var comment_pattern = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
      function Beautifier(source_text, options) {
        this._source_text = source_text || "";
        this._options = new Options(options);
        this._ch = null;
        this._input = null;
        this.NESTED_AT_RULE = {
          "page": true,
          "font-face": true,
          "keyframes": true,
          // also in CONDITIONAL_GROUP_RULE below
          "media": true,
          "supports": true,
          "document": true
        };
        this.CONDITIONAL_GROUP_RULE = {
          "media": true,
          "supports": true,
          "document": true
        };
        this.NON_SEMICOLON_NEWLINE_PROPERTY = [
          "grid-template-areas",
          "grid-template"
        ];
      }
      Beautifier.prototype.eatString = function(endChars) {
        var result = "";
        this._ch = this._input.next();
        while (this._ch) {
          result += this._ch;
          if (this._ch === "\\") {
            result += this._input.next();
          } else if (endChars.indexOf(this._ch) !== -1 || this._ch === "\n") {
            break;
          }
          this._ch = this._input.next();
        }
        return result;
      };
      Beautifier.prototype.eatWhitespace = function(allowAtLeastOneNewLine) {
        var result = whitespaceChar.test(this._input.peek());
        var newline_count = 0;
        while (whitespaceChar.test(this._input.peek())) {
          this._ch = this._input.next();
          if (allowAtLeastOneNewLine && this._ch === "\n") {
            if (newline_count === 0 || newline_count < this._options.max_preserve_newlines) {
              newline_count++;
              this._output.add_new_line(true);
            }
          }
        }
        return result;
      };
      Beautifier.prototype.foundNestedPseudoClass = function() {
        var openParen = 0;
        var i = 1;
        var ch = this._input.peek(i);
        while (ch) {
          if (ch === "{") {
            return true;
          } else if (ch === "(") {
            openParen += 1;
          } else if (ch === ")") {
            if (openParen === 0) {
              return false;
            }
            openParen -= 1;
          } else if (ch === ";" || ch === "}") {
            return false;
          }
          i++;
          ch = this._input.peek(i);
        }
        return false;
      };
      Beautifier.prototype.print_string = function(output_string) {
        this._output.set_indent(this._indentLevel);
        this._output.non_breaking_space = true;
        this._output.add_token(output_string);
      };
      Beautifier.prototype.preserveSingleSpace = function(isAfterSpace) {
        if (isAfterSpace) {
          this._output.space_before_token = true;
        }
      };
      Beautifier.prototype.indent = function() {
        this._indentLevel++;
      };
      Beautifier.prototype.outdent = function() {
        if (this._indentLevel > 0) {
          this._indentLevel--;
        }
      };
      Beautifier.prototype.beautify = function() {
        if (this._options.disabled) {
          return this._source_text;
        }
        var source_text = this._source_text;
        var eol = this._options.eol;
        if (eol === "auto") {
          eol = "\n";
          if (source_text && lineBreak.test(source_text || "")) {
            eol = source_text.match(lineBreak)[0];
          }
        }
        source_text = source_text.replace(allLineBreaks, "\n");
        var baseIndentString = source_text.match(/^[\t ]*/)[0];
        this._output = new Output(this._options, baseIndentString);
        this._input = new InputScanner(source_text);
        this._indentLevel = 0;
        this._nestedLevel = 0;
        this._ch = null;
        var parenLevel = 0;
        var insideRule = false;
        var insidePropertyValue = false;
        var enteringConditionalGroup = false;
        var insideNonNestedAtRule = false;
        var insideScssMap = false;
        var topCharacter = this._ch;
        var insideNonSemiColonValues = false;
        var whitespace;
        var isAfterSpace;
        var previous_ch;
        while (true) {
          whitespace = this._input.read(whitespacePattern);
          isAfterSpace = whitespace !== "";
          previous_ch = topCharacter;
          this._ch = this._input.next();
          if (this._ch === "\\" && this._input.hasNext()) {
            this._ch += this._input.next();
          }
          topCharacter = this._ch;
          if (!this._ch) {
            break;
          } else if (this._ch === "/" && this._input.peek() === "*") {
            this._output.add_new_line();
            this._input.back();
            var comment = this._input.read(block_comment_pattern);
            var directives = directives_core.get_directives(comment);
            if (directives && directives.ignore === "start") {
              comment += directives_core.readIgnored(this._input);
            }
            this.print_string(comment);
            this.eatWhitespace(true);
            this._output.add_new_line();
          } else if (this._ch === "/" && this._input.peek() === "/") {
            this._output.space_before_token = true;
            this._input.back();
            this.print_string(this._input.read(comment_pattern));
            this.eatWhitespace(true);
          } else if (this._ch === "$") {
            this.preserveSingleSpace(isAfterSpace);
            this.print_string(this._ch);
            var variable = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
            if (variable.match(/[ :]$/)) {
              variable = this.eatString(": ").replace(/\s+$/, "");
              this.print_string(variable);
              this._output.space_before_token = true;
            }
            if (parenLevel === 0 && variable.indexOf(":") !== -1) {
              insidePropertyValue = true;
              this.indent();
            }
          } else if (this._ch === "@") {
            this.preserveSingleSpace(isAfterSpace);
            if (this._input.peek() === "{") {
              this.print_string(this._ch + this.eatString("}"));
            } else {
              this.print_string(this._ch);
              var variableOrRule = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
              if (variableOrRule.match(/[ :]$/)) {
                variableOrRule = this.eatString(": ").replace(/\s+$/, "");
                this.print_string(variableOrRule);
                this._output.space_before_token = true;
              }
              if (parenLevel === 0 && variableOrRule.indexOf(":") !== -1) {
                insidePropertyValue = true;
                this.indent();
              } else if (variableOrRule in this.NESTED_AT_RULE) {
                this._nestedLevel += 1;
                if (variableOrRule in this.CONDITIONAL_GROUP_RULE) {
                  enteringConditionalGroup = true;
                }
              } else if (parenLevel === 0 && !insidePropertyValue) {
                insideNonNestedAtRule = true;
              }
            }
          } else if (this._ch === "#" && this._input.peek() === "{") {
            this.preserveSingleSpace(isAfterSpace);
            this.print_string(this._ch + this.eatString("}"));
          } else if (this._ch === "{") {
            if (insidePropertyValue) {
              insidePropertyValue = false;
              this.outdent();
            }
            insideNonNestedAtRule = false;
            if (enteringConditionalGroup) {
              enteringConditionalGroup = false;
              insideRule = this._indentLevel >= this._nestedLevel;
            } else {
              insideRule = this._indentLevel >= this._nestedLevel - 1;
            }
            if (this._options.newline_between_rules && insideRule) {
              if (this._output.previous_line && this._output.previous_line.item(-1) !== "{") {
                this._output.ensure_empty_line_above("/", ",");
              }
            }
            this._output.space_before_token = true;
            if (this._options.brace_style === "expand") {
              this._output.add_new_line();
              this.print_string(this._ch);
              this.indent();
              this._output.set_indent(this._indentLevel);
            } else {
              if (previous_ch === "(") {
                this._output.space_before_token = false;
              } else if (previous_ch !== ",") {
                this.indent();
              }
              this.print_string(this._ch);
            }
            this.eatWhitespace(true);
            this._output.add_new_line();
          } else if (this._ch === "}") {
            this.outdent();
            this._output.add_new_line();
            if (previous_ch === "{") {
              this._output.trim(true);
            }
            if (insidePropertyValue) {
              this.outdent();
              insidePropertyValue = false;
            }
            this.print_string(this._ch);
            insideRule = false;
            if (this._nestedLevel) {
              this._nestedLevel--;
            }
            this.eatWhitespace(true);
            this._output.add_new_line();
            if (this._options.newline_between_rules && !this._output.just_added_blankline()) {
              if (this._input.peek() !== "}") {
                this._output.add_new_line(true);
              }
            }
            if (this._input.peek() === ")") {
              this._output.trim(true);
              if (this._options.brace_style === "expand") {
                this._output.add_new_line(true);
              }
            }
          } else if (this._ch === ":") {
            for (var i = 0; i < this.NON_SEMICOLON_NEWLINE_PROPERTY.length; i++) {
              if (this._input.lookBack(this.NON_SEMICOLON_NEWLINE_PROPERTY[i])) {
                insideNonSemiColonValues = true;
                break;
              }
            }
            if ((insideRule || enteringConditionalGroup) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !insideNonNestedAtRule && parenLevel === 0) {
              this.print_string(":");
              if (!insidePropertyValue) {
                insidePropertyValue = true;
                this._output.space_before_token = true;
                this.eatWhitespace(true);
                this.indent();
              }
            } else {
              if (this._input.lookBack(" ")) {
                this._output.space_before_token = true;
              }
              if (this._input.peek() === ":") {
                this._ch = this._input.next();
                this.print_string("::");
              } else {
                this.print_string(":");
              }
            }
          } else if (this._ch === '"' || this._ch === "'") {
            var preserveQuoteSpace = previous_ch === '"' || previous_ch === "'";
            this.preserveSingleSpace(preserveQuoteSpace || isAfterSpace);
            this.print_string(this._ch + this.eatString(this._ch));
            this.eatWhitespace(true);
          } else if (this._ch === ";") {
            insideNonSemiColonValues = false;
            if (parenLevel === 0) {
              if (insidePropertyValue) {
                this.outdent();
                insidePropertyValue = false;
              }
              insideNonNestedAtRule = false;
              this.print_string(this._ch);
              this.eatWhitespace(true);
              if (this._input.peek() !== "/") {
                this._output.add_new_line();
              }
            } else {
              this.print_string(this._ch);
              this.eatWhitespace(true);
              this._output.space_before_token = true;
            }
          } else if (this._ch === "(") {
            if (this._input.lookBack("url")) {
              this.print_string(this._ch);
              this.eatWhitespace();
              parenLevel++;
              this.indent();
              this._ch = this._input.next();
              if (this._ch === ")" || this._ch === '"' || this._ch === "'") {
                this._input.back();
              } else if (this._ch) {
                this.print_string(this._ch + this.eatString(")"));
                if (parenLevel) {
                  parenLevel--;
                  this.outdent();
                }
              }
            } else {
              var space_needed = false;
              if (this._input.lookBack("with")) {
                space_needed = true;
              }
              this.preserveSingleSpace(isAfterSpace || space_needed);
              this.print_string(this._ch);
              if (insidePropertyValue && previous_ch === "$" && this._options.selector_separator_newline) {
                this._output.add_new_line();
                insideScssMap = true;
              } else {
                this.eatWhitespace();
                parenLevel++;
                this.indent();
              }
            }
          } else if (this._ch === ")") {
            if (parenLevel) {
              parenLevel--;
              this.outdent();
            }
            if (insideScssMap && this._input.peek() === ";" && this._options.selector_separator_newline) {
              insideScssMap = false;
              this.outdent();
              this._output.add_new_line();
            }
            this.print_string(this._ch);
          } else if (this._ch === ",") {
            this.print_string(this._ch);
            this.eatWhitespace(true);
            if (this._options.selector_separator_newline && (!insidePropertyValue || insideScssMap) && parenLevel === 0 && !insideNonNestedAtRule) {
              this._output.add_new_line();
            } else {
              this._output.space_before_token = true;
            }
          } else if ((this._ch === ">" || this._ch === "+" || this._ch === "~") && !insidePropertyValue && parenLevel === 0) {
            if (this._options.space_around_combinator) {
              this._output.space_before_token = true;
              this.print_string(this._ch);
              this._output.space_before_token = true;
            } else {
              this.print_string(this._ch);
              this.eatWhitespace();
              if (this._ch && whitespaceChar.test(this._ch)) {
                this._ch = "";
              }
            }
          } else if (this._ch === "]") {
            this.print_string(this._ch);
          } else if (this._ch === "[") {
            this.preserveSingleSpace(isAfterSpace);
            this.print_string(this._ch);
          } else if (this._ch === "=") {
            this.eatWhitespace();
            this.print_string("=");
            if (whitespaceChar.test(this._ch)) {
              this._ch = "";
            }
          } else if (this._ch === "!" && !this._input.lookBack("\\")) {
            this._output.space_before_token = true;
            this.print_string(this._ch);
          } else {
            var preserveAfterSpace = previous_ch === '"' || previous_ch === "'";
            this.preserveSingleSpace(preserveAfterSpace || isAfterSpace);
            this.print_string(this._ch);
            if (!this._output.just_added_newline() && this._input.peek() === "\n" && insideNonSemiColonValues) {
              this._output.add_new_line();
            }
          }
        }
        var sweetCode = this._output.get_code(eol);
        return sweetCode;
      };
      module2.exports.Beautifier = Beautifier;
    }
  });

  // ../../node_modules/js-beautify/js/src/css/index.js
  var require_css = __commonJS({
    "../../node_modules/js-beautify/js/src/css/index.js"(exports2, module2) {
      "use strict";
      var Beautifier = require_beautifier2().Beautifier;
      var Options = require_options3().Options;
      function css_beautify(source_text, options) {
        var beautifier = new Beautifier(source_text, options);
        return beautifier.beautify();
      }
      module2.exports = css_beautify;
      module2.exports.defaultOptions = function() {
        return new Options();
      };
    }
  });

  // ../../node_modules/js-beautify/js/src/html/options.js
  var require_options4 = __commonJS({
    "../../node_modules/js-beautify/js/src/html/options.js"(exports2, module2) {
      "use strict";
      var BaseOptions = require_options().Options;
      function Options(options) {
        BaseOptions.call(this, options, "html");
        if (this.templating.length === 1 && this.templating[0] === "auto") {
          this.templating = ["django", "erb", "handlebars", "php"];
        }
        this.indent_inner_html = this._get_boolean("indent_inner_html");
        this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", true);
        this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", true);
        this.indent_handlebars = this._get_boolean("indent_handlebars", true);
        this.wrap_attributes = this._get_selection(
          "wrap_attributes",
          ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"]
        );
        this.wrap_attributes_min_attrs = this._get_number("wrap_attributes_min_attrs", 2);
        this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size);
        this.extra_liners = this._get_array("extra_liners", ["head", "body", "/html"]);
        this.inline = this._get_array("inline", [
          "a",
          "abbr",
          "area",
          "audio",
          "b",
          "bdi",
          "bdo",
          "br",
          "button",
          "canvas",
          "cite",
          "code",
          "data",
          "datalist",
          "del",
          "dfn",
          "em",
          "embed",
          "i",
          "iframe",
          "img",
          "input",
          "ins",
          "kbd",
          "keygen",
          "label",
          "map",
          "mark",
          "math",
          "meter",
          "noscript",
          "object",
          "output",
          "progress",
          "q",
          "ruby",
          "s",
          "samp",
          /* 'script', */
          "select",
          "small",
          "span",
          "strong",
          "sub",
          "sup",
          "svg",
          "template",
          "textarea",
          "time",
          "u",
          "var",
          "video",
          "wbr",
          "text",
          // obsolete inline tags
          "acronym",
          "big",
          "strike",
          "tt"
        ]);
        this.inline_custom_elements = this._get_boolean("inline_custom_elements", true);
        this.void_elements = this._get_array("void_elements", [
          // HTLM void elements - aka self-closing tags - aka singletons
          // https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
          "area",
          "base",
          "br",
          "col",
          "embed",
          "hr",
          "img",
          "input",
          "keygen",
          "link",
          "menuitem",
          "meta",
          "param",
          "source",
          "track",
          "wbr",
          // NOTE: Optional tags are too complex for a simple list
          // they are hard coded in _do_optional_end_element
          // Doctype and xml elements
          "!doctype",
          "?xml",
          // obsolete tags
          // basefont: https://www.computerhope.com/jargon/h/html-basefont-tag.htm
          // isndex: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/isindex
          "basefont",
          "isindex"
        ]);
        this.unformatted = this._get_array("unformatted", []);
        this.content_unformatted = this._get_array("content_unformatted", [
          "pre",
          "textarea"
        ]);
        this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter");
        this.indent_scripts = this._get_selection("indent_scripts", ["normal", "keep", "separate"]);
      }
      Options.prototype = new BaseOptions();
      module2.exports.Options = Options;
    }
  });

  // ../../node_modules/js-beautify/js/src/html/tokenizer.js
  var require_tokenizer3 = __commonJS({
    "../../node_modules/js-beautify/js/src/html/tokenizer.js"(exports2, module2) {
      "use strict";
      var BaseTokenizer = require_tokenizer().Tokenizer;
      var BASETOKEN = require_tokenizer().TOKEN;
      var Directives = require_directives().Directives;
      var TemplatablePattern = require_templatablepattern().TemplatablePattern;
      var Pattern = require_pattern().Pattern;
      var TOKEN = {
        TAG_OPEN: "TK_TAG_OPEN",
        TAG_CLOSE: "TK_TAG_CLOSE",
        CONTROL_FLOW_OPEN: "TK_CONTROL_FLOW_OPEN",
        CONTROL_FLOW_CLOSE: "TK_CONTROL_FLOW_CLOSE",
        ATTRIBUTE: "TK_ATTRIBUTE",
        EQUALS: "TK_EQUALS",
        VALUE: "TK_VALUE",
        COMMENT: "TK_COMMENT",
        TEXT: "TK_TEXT",
        UNKNOWN: "TK_UNKNOWN",
        START: BASETOKEN.START,
        RAW: BASETOKEN.RAW,
        EOF: BASETOKEN.EOF
      };
      var directives_core = new Directives(/<\!--/, /-->/);
      var Tokenizer = function(input_string, options) {
        BaseTokenizer.call(this, input_string, options);
        this._current_tag_name = "";
        var templatable_reader = new TemplatablePattern(this._input).read_options(this._options);
        var pattern_reader = new Pattern(this._input);
        this.__patterns = {
          word: templatable_reader.until(/[\n\r\t <]/),
          word_control_flow_close_excluded: templatable_reader.until(/[\n\r\t <}]/),
          single_quote: templatable_reader.until_after(/'/),
          double_quote: templatable_reader.until_after(/"/),
          attribute: templatable_reader.until(/[\n\r\t =>]|\/>/),
          element_name: templatable_reader.until(/[\n\r\t >\/]/),
          angular_control_flow_start: pattern_reader.matching(/\@[a-zA-Z]+[^({]*[({]/),
          handlebars_comment: pattern_reader.starting_with(/{{!--/).until_after(/--}}/),
          handlebars: pattern_reader.starting_with(/{{/).until_after(/}}/),
          handlebars_open: pattern_reader.until(/[\n\r\t }]/),
          handlebars_raw_close: pattern_reader.until(/}}/),
          comment: pattern_reader.starting_with(/<!--/).until_after(/-->/),
          cdata: pattern_reader.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
          // https://en.wikipedia.org/wiki/Conditional_comment
          conditional_comment: pattern_reader.starting_with(/<!\[/).until_after(/]>/),
          processing: pattern_reader.starting_with(/<\?/).until_after(/\?>/)
        };
        if (this._options.indent_handlebars) {
          this.__patterns.word = this.__patterns.word.exclude("handlebars");
          this.__patterns.word_control_flow_close_excluded = this.__patterns.word_control_flow_close_excluded.exclude("handlebars");
        }
        this._unformatted_content_delimiter = null;
        if (this._options.unformatted_content_delimiter) {
          var literal_regexp = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
          this.__patterns.unformatted_content_delimiter = pattern_reader.matching(literal_regexp).until_after(literal_regexp);
        }
      };
      Tokenizer.prototype = new BaseTokenizer();
      Tokenizer.prototype._is_comment = function(current_token) {
        return false;
      };
      Tokenizer.prototype._is_opening = function(current_token) {
        return current_token.type === TOKEN.TAG_OPEN || current_token.type === TOKEN.CONTROL_FLOW_OPEN;
      };
      Tokenizer.prototype._is_closing = function(current_token, open_token) {
        return current_token.type === TOKEN.TAG_CLOSE && (open_token && ((current_token.text === ">" || current_token.text === "/>") && open_token.text[0] === "<" || current_token.text === "}}" && open_token.text[0] === "{" && open_token.text[1] === "{")) || current_token.type === TOKEN.CONTROL_FLOW_CLOSE && (current_token.text === "}" && open_token.text.endsWith("{"));
      };
      Tokenizer.prototype._reset = function() {
        this._current_tag_name = "";
      };
      Tokenizer.prototype._get_next_token = function(previous_token, open_token) {
        var token = null;
        this._readWhitespace();
        var c = this._input.peek();
        if (c === null) {
          return this._create_token(TOKEN.EOF, "");
        }
        token = token || this._read_open_handlebars(c, open_token);
        token = token || this._read_attribute(c, previous_token, open_token);
        token = token || this._read_close(c, open_token);
        token = token || this._read_script_and_style(c, previous_token);
        token = token || this._read_control_flows(c, open_token);
        token = token || this._read_raw_content(c, previous_token, open_token);
        token = token || this._read_content_word(c, open_token);
        token = token || this._read_comment_or_cdata(c);
        token = token || this._read_processing(c);
        token = token || this._read_open(c, open_token);
        token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
        return token;
      };
      Tokenizer.prototype._read_comment_or_cdata = function(c) {
        var token = null;
        var resulting_string = null;
        var directives = null;
        if (c === "<") {
          var peek1 = this._input.peek(1);
          if (peek1 === "!") {
            resulting_string = this.__patterns.comment.read();
            if (resulting_string) {
              directives = directives_core.get_directives(resulting_string);
              if (directives && directives.ignore === "start") {
                resulting_string += directives_core.readIgnored(this._input);
              }
            } else {
              resulting_string = this.__patterns.cdata.read();
            }
          }
          if (resulting_string) {
            token = this._create_token(TOKEN.COMMENT, resulting_string);
            token.directives = directives;
          }
        }
        return token;
      };
      Tokenizer.prototype._read_processing = function(c) {
        var token = null;
        var resulting_string = null;
        var directives = null;
        if (c === "<") {
          var peek1 = this._input.peek(1);
          if (peek1 === "!" || peek1 === "?") {
            resulting_string = this.__patterns.conditional_comment.read();
            resulting_string = resulting_string || this.__patterns.processing.read();
          }
          if (resulting_string) {
            token = this._create_token(TOKEN.COMMENT, resulting_string);
            token.directives = directives;
          }
        }
        return token;
      };
      Tokenizer.prototype._read_open = function(c, open_token) {
        var resulting_string = null;
        var token = null;
        if (!open_token || open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
          if (c === "<") {
            resulting_string = this._input.next();
            if (this._input.peek() === "/") {
              resulting_string += this._input.next();
            }
            resulting_string += this.__patterns.element_name.read();
            token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
          }
        }
        return token;
      };
      Tokenizer.prototype._read_open_handlebars = function(c, open_token) {
        var resulting_string = null;
        var token = null;
        if (!open_token || open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
          if ((this._options.templating.includes("angular") || this._options.indent_handlebars) && c === "{" && this._input.peek(1) === "{") {
            if (this._options.indent_handlebars && this._input.peek(2) === "!") {
              resulting_string = this.__patterns.handlebars_comment.read();
              resulting_string = resulting_string || this.__patterns.handlebars.read();
              token = this._create_token(TOKEN.COMMENT, resulting_string);
            } else {
              resulting_string = this.__patterns.handlebars_open.read();
              token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
            }
          }
        }
        return token;
      };
      Tokenizer.prototype._read_control_flows = function(c, open_token) {
        var resulting_string = "";
        var token = null;
        if (!this._options.templating.includes("angular")) {
          return token;
        }
        if (c === "@") {
          resulting_string = this.__patterns.angular_control_flow_start.read();
          if (resulting_string === "") {
            return token;
          }
          var opening_parentheses_count = resulting_string.endsWith("(") ? 1 : 0;
          var closing_parentheses_count = 0;
          while (!(resulting_string.endsWith("{") && opening_parentheses_count === closing_parentheses_count)) {
            var next_char = this._input.next();
            if (next_char === null) {
              break;
            } else if (next_char === "(") {
              opening_parentheses_count++;
            } else if (next_char === ")") {
              closing_parentheses_count++;
            }
            resulting_string += next_char;
          }
          token = this._create_token(TOKEN.CONTROL_FLOW_OPEN, resulting_string);
        } else if (c === "}" && open_token && open_token.type === TOKEN.CONTROL_FLOW_OPEN) {
          resulting_string = this._input.next();
          token = this._create_token(TOKEN.CONTROL_FLOW_CLOSE, resulting_string);
        }
        return token;
      };
      Tokenizer.prototype._read_close = function(c, open_token) {
        var resulting_string = null;
        var token = null;
        if (open_token && open_token.type === TOKEN.TAG_OPEN) {
          if (open_token.text[0] === "<" && (c === ">" || c === "/" && this._input.peek(1) === ">")) {
            resulting_string = this._input.next();
            if (c === "/") {
              resulting_string += this._input.next();
            }
            token = this._create_token(TOKEN.TAG_CLOSE, resulting_string);
          } else if (open_token.text[0] === "{" && c === "}" && this._input.peek(1) === "}") {
            this._input.next();
            this._input.next();
            token = this._create_token(TOKEN.TAG_CLOSE, "}}");
          }
        }
        return token;
      };
      Tokenizer.prototype._read_attribute = function(c, previous_token, open_token) {
        var token = null;
        var resulting_string = "";
        if (open_token && open_token.text[0] === "<") {
          if (c === "=") {
            token = this._create_token(TOKEN.EQUALS, this._input.next());
          } else if (c === '"' || c === "'") {
            var content = this._input.next();
            if (c === '"') {
              content += this.__patterns.double_quote.read();
            } else {
              content += this.__patterns.single_quote.read();
            }
            token = this._create_token(TOKEN.VALUE, content);
          } else {
            resulting_string = this.__patterns.attribute.read();
            if (resulting_string) {
              if (previous_token.type === TOKEN.EQUALS) {
                token = this._create_token(TOKEN.VALUE, resulting_string);
              } else {
                token = this._create_token(TOKEN.ATTRIBUTE, resulting_string);
              }
            }
          }
        }
        return token;
      };
      Tokenizer.prototype._is_content_unformatted = function(tag_name) {
        return this._options.void_elements.indexOf(tag_name) === -1 && (this._options.content_unformatted.indexOf(tag_name) !== -1 || this._options.unformatted.indexOf(tag_name) !== -1);
      };
      Tokenizer.prototype._read_raw_content = function(c, previous_token, open_token) {
        var resulting_string = "";
        if (open_token && open_token.text[0] === "{") {
          resulting_string = this.__patterns.handlebars_raw_close.read();
        } else if (previous_token.type === TOKEN.TAG_CLOSE && previous_token.opened.text[0] === "<" && previous_token.text[0] !== "/") {
          var tag_name = previous_token.opened.text.substr(1).toLowerCase();
          if (this._is_content_unformatted(tag_name)) {
            resulting_string = this._input.readUntil(new RegExp("</" + tag_name + "[\\n\\r\\t ]*?>", "ig"));
          }
        }
        if (resulting_string) {
          return this._create_token(TOKEN.TEXT, resulting_string);
        }
        return null;
      };
      Tokenizer.prototype._read_script_and_style = function(c, previous_token) {
        if (previous_token.type === TOKEN.TAG_CLOSE && previous_token.opened.text[0] === "<" && previous_token.text[0] !== "/") {
          var tag_name = previous_token.opened.text.substr(1).toLowerCase();
          if (tag_name === "script" || tag_name === "style") {
            var token = this._read_comment_or_cdata(c);
            if (token) {
              token.type = TOKEN.TEXT;
              return token;
            }
            var resulting_string = this._input.readUntil(new RegExp("</" + tag_name + "[\\n\\r\\t ]*?>", "ig"));
            if (resulting_string) {
              return this._create_token(TOKEN.TEXT, resulting_string);
            }
          }
        }
        return null;
      };
      Tokenizer.prototype._read_content_word = function(c, open_token) {
        var resulting_string = "";
        if (this._options.unformatted_content_delimiter) {
          if (c === this._options.unformatted_content_delimiter[0]) {
            resulting_string = this.__patterns.unformatted_content_delimiter.read();
          }
        }
        if (!resulting_string) {
          resulting_string = open_token && open_token.type === TOKEN.CONTROL_FLOW_OPEN ? this.__patterns.word_control_flow_close_excluded.read() : this.__patterns.word.read();
        }
        if (resulting_string) {
          return this._create_token(TOKEN.TEXT, resulting_string);
        }
        return null;
      };
      module2.exports.Tokenizer = Tokenizer;
      module2.exports.TOKEN = TOKEN;
    }
  });

  // ../../node_modules/js-beautify/js/src/html/beautifier.js
  var require_beautifier3 = __commonJS({
    "../../node_modules/js-beautify/js/src/html/beautifier.js"(exports2, module2) {
      "use strict";
      var Options = require_options4().Options;
      var Output = require_output().Output;
      var Tokenizer = require_tokenizer3().Tokenizer;
      var TOKEN = require_tokenizer3().TOKEN;
      var lineBreak = /\r\n|[\r\n]/;
      var allLineBreaks = /\r\n|[\r\n]/g;
      var Printer = function(options, base_indent_string) {
        this.indent_level = 0;
        this.alignment_size = 0;
        this.max_preserve_newlines = options.max_preserve_newlines;
        this.preserve_newlines = options.preserve_newlines;
        this._output = new Output(options, base_indent_string);
      };
      Printer.prototype.current_line_has_match = function(pattern) {
        return this._output.current_line.has_match(pattern);
      };
      Printer.prototype.set_space_before_token = function(value, non_breaking) {
        this._output.space_before_token = value;
        this._output.non_breaking_space = non_breaking;
      };
      Printer.prototype.set_wrap_point = function() {
        this._output.set_indent(this.indent_level, this.alignment_size);
        this._output.set_wrap_point();
      };
      Printer.prototype.add_raw_token = function(token) {
        this._output.add_raw_token(token);
      };
      Printer.prototype.print_preserved_newlines = function(raw_token) {
        var newlines = 0;
        if (raw_token.type !== TOKEN.TEXT && raw_token.previous.type !== TOKEN.TEXT) {
          newlines = raw_token.newlines ? 1 : 0;
        }
        if (this.preserve_newlines) {
          newlines = raw_token.newlines < this.max_preserve_newlines + 1 ? raw_token.newlines : this.max_preserve_newlines + 1;
        }
        for (var n = 0; n < newlines; n++) {
          this.print_newline(n > 0);
        }
        return newlines !== 0;
      };
      Printer.prototype.traverse_whitespace = function(raw_token) {
        if (raw_token.whitespace_before || raw_token.newlines) {
          if (!this.print_preserved_newlines(raw_token)) {
            this._output.space_before_token = true;
          }
          return true;
        }
        return false;
      };
      Printer.prototype.previous_token_wrapped = function() {
        return this._output.previous_token_wrapped;
      };
      Printer.prototype.print_newline = function(force) {
        this._output.add_new_line(force);
      };
      Printer.prototype.print_token = function(token) {
        if (token.text) {
          this._output.set_indent(this.indent_level, this.alignment_size);
          this._output.add_token(token.text);
        }
      };
      Printer.prototype.indent = function() {
        this.indent_level++;
      };
      Printer.prototype.deindent = function() {
        if (this.indent_level > 0) {
          this.indent_level--;
          this._output.set_indent(this.indent_level, this.alignment_size);
        }
      };
      Printer.prototype.get_full_indent = function(level) {
        level = this.indent_level + (level || 0);
        if (level < 1) {
          return "";
        }
        return this._output.get_indent_string(level);
      };
      var get_type_attribute = function(start_token) {
        var result = null;
        var raw_token = start_token.next;
        while (raw_token.type !== TOKEN.EOF && start_token.closed !== raw_token) {
          if (raw_token.type === TOKEN.ATTRIBUTE && raw_token.text === "type") {
            if (raw_token.next && raw_token.next.type === TOKEN.EQUALS && raw_token.next.next && raw_token.next.next.type === TOKEN.VALUE) {
              result = raw_token.next.next.text;
            }
            break;
          }
          raw_token = raw_token.next;
        }
        return result;
      };
      var get_custom_beautifier_name = function(tag_check, raw_token) {
        var typeAttribute = null;
        var result = null;
        if (!raw_token.closed) {
          return null;
        }
        if (tag_check === "script") {
          typeAttribute = "text/javascript";
        } else if (tag_check === "style") {
          typeAttribute = "text/css";
        }
        typeAttribute = get_type_attribute(raw_token) || typeAttribute;
        if (typeAttribute.search("text/css") > -1) {
          result = "css";
        } else if (typeAttribute.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1) {
          result = "javascript";
        } else if (typeAttribute.search(/(text|application|dojo)\/(x-)?(html)/) > -1) {
          result = "html";
        } else if (typeAttribute.search(/test\/null/) > -1) {
          result = "null";
        }
        return result;
      };
      function in_array(what, arr) {
        return arr.indexOf(what) !== -1;
      }
      function TagFrame(parent, parser_token, indent_level) {
        this.parent = parent || null;
        this.tag = parser_token ? parser_token.tag_name : "";
        this.indent_level = indent_level || 0;
        this.parser_token = parser_token || null;
      }
      function TagStack(printer) {
        this._printer = printer;
        this._current_frame = null;
      }
      TagStack.prototype.get_parser_token = function() {
        return this._current_frame ? this._current_frame.parser_token : null;
      };
      TagStack.prototype.record_tag = function(parser_token) {
        var new_frame = new TagFrame(this._current_frame, parser_token, this._printer.indent_level);
        this._current_frame = new_frame;
      };
      TagStack.prototype._try_pop_frame = function(frame) {
        var parser_token = null;
        if (frame) {
          parser_token = frame.parser_token;
          this._printer.indent_level = frame.indent_level;
          this._current_frame = frame.parent;
        }
        return parser_token;
      };
      TagStack.prototype._get_frame = function(tag_list, stop_list) {
        var frame = this._current_frame;
        while (frame) {
          if (tag_list.indexOf(frame.tag) !== -1) {
            break;
          } else if (stop_list && stop_list.indexOf(frame.tag) !== -1) {
            frame = null;
            break;
          }
          frame = frame.parent;
        }
        return frame;
      };
      TagStack.prototype.try_pop = function(tag, stop_list) {
        var frame = this._get_frame([tag], stop_list);
        return this._try_pop_frame(frame);
      };
      TagStack.prototype.indent_to_tag = function(tag_list) {
        var frame = this._get_frame(tag_list);
        if (frame) {
          this._printer.indent_level = frame.indent_level;
        }
      };
      function Beautifier(source_text, options, js_beautify, css_beautify) {
        this._source_text = source_text || "";
        options = options || {};
        this._js_beautify = js_beautify;
        this._css_beautify = css_beautify;
        this._tag_stack = null;
        var optionHtml = new Options(options, "html");
        this._options = optionHtml;
        this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, "force".length) === "force";
        this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === "force-expand-multiline";
        this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === "force-aligned";
        this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === "aligned-multiple";
        this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, "preserve".length) === "preserve";
        this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === "preserve-aligned";
      }
      Beautifier.prototype.beautify = function() {
        if (this._options.disabled) {
          return this._source_text;
        }
        var source_text = this._source_text;
        var eol = this._options.eol;
        if (this._options.eol === "auto") {
          eol = "\n";
          if (source_text && lineBreak.test(source_text)) {
            eol = source_text.match(lineBreak)[0];
          }
        }
        source_text = source_text.replace(allLineBreaks, "\n");
        var baseIndentString = source_text.match(/^[\t ]*/)[0];
        var last_token = {
          text: "",
          type: ""
        };
        var last_tag_token = new TagOpenParserToken(this._options);
        var printer = new Printer(this._options, baseIndentString);
        var tokens = new Tokenizer(source_text, this._options).tokenize();
        this._tag_stack = new TagStack(printer);
        var parser_token = null;
        var raw_token = tokens.next();
        while (raw_token.type !== TOKEN.EOF) {
          if (raw_token.type === TOKEN.TAG_OPEN || raw_token.type === TOKEN.COMMENT) {
            parser_token = this._handle_tag_open(printer, raw_token, last_tag_token, last_token, tokens);
            last_tag_token = parser_token;
          } else if (raw_token.type === TOKEN.ATTRIBUTE || raw_token.type === TOKEN.EQUALS || raw_token.type === TOKEN.VALUE || raw_token.type === TOKEN.TEXT && !last_tag_token.tag_complete) {
            parser_token = this._handle_inside_tag(printer, raw_token, last_tag_token, last_token);
          } else if (raw_token.type === TOKEN.TAG_CLOSE) {
            parser_token = this._handle_tag_close(printer, raw_token, last_tag_token);
          } else if (raw_token.type === TOKEN.TEXT) {
            parser_token = this._handle_text(printer, raw_token, last_tag_token);
          } else if (raw_token.type === TOKEN.CONTROL_FLOW_OPEN) {
            parser_token = this._handle_control_flow_open(printer, raw_token);
          } else if (raw_token.type === TOKEN.CONTROL_FLOW_CLOSE) {
            parser_token = this._handle_control_flow_close(printer, raw_token);
          } else {
            printer.add_raw_token(raw_token);
          }
          last_token = parser_token;
          raw_token = tokens.next();
        }
        var sweet_code = printer._output.get_code(eol);
        return sweet_code;
      };
      Beautifier.prototype._handle_control_flow_open = function(printer, raw_token) {
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        if (raw_token.newlines) {
          printer.print_preserved_newlines(raw_token);
        } else {
          printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        }
        printer.print_token(raw_token);
        printer.indent();
        return parser_token;
      };
      Beautifier.prototype._handle_control_flow_close = function(printer, raw_token) {
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.deindent();
        if (raw_token.newlines) {
          printer.print_preserved_newlines(raw_token);
        } else {
          printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        }
        printer.print_token(raw_token);
        return parser_token;
      };
      Beautifier.prototype._handle_tag_close = function(printer, raw_token, last_tag_token) {
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.alignment_size = 0;
        last_tag_token.tag_complete = true;
        printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        if (last_tag_token.is_unformatted) {
          printer.add_raw_token(raw_token);
        } else {
          if (last_tag_token.tag_start_char === "<") {
            printer.set_space_before_token(raw_token.text[0] === "/", true);
            if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.has_wrapped_attrs) {
              printer.print_newline(false);
            }
          }
          printer.print_token(raw_token);
        }
        if (last_tag_token.indent_content && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
          printer.indent();
          last_tag_token.indent_content = false;
        }
        if (!last_tag_token.is_inline_element && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
          printer.set_wrap_point();
        }
        return parser_token;
      };
      Beautifier.prototype._handle_inside_tag = function(printer, raw_token, last_tag_token, last_token) {
        var wrapped = last_tag_token.has_wrapped_attrs;
        var parser_token = {
          text: raw_token.text,
          type: raw_token.type
        };
        printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== "", true);
        if (last_tag_token.is_unformatted) {
          printer.add_raw_token(raw_token);
        } else if (last_tag_token.tag_start_char === "{" && raw_token.type === TOKEN.TEXT) {
          if (printer.print_preserved_newlines(raw_token)) {
            raw_token.newlines = 0;
            printer.add_raw_token(raw_token);
          } else {
            printer.print_token(raw_token);
          }
        } else {
          if (raw_token.type === TOKEN.ATTRIBUTE) {
            printer.set_space_before_token(true);
          } else if (raw_token.type === TOKEN.EQUALS) {
            printer.set_space_before_token(false);
          } else if (raw_token.type === TOKEN.VALUE && raw_token.previous.type === TOKEN.EQUALS) {
            printer.set_space_before_token(false);
          }
          if (raw_token.type === TOKEN.ATTRIBUTE && last_tag_token.tag_start_char === "<") {
            if (this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) {
              printer.traverse_whitespace(raw_token);
              wrapped = wrapped || raw_token.newlines !== 0;
            }
            if (this._is_wrap_attributes_force && last_tag_token.attr_count >= this._options.wrap_attributes_min_attrs && (last_token.type !== TOKEN.TAG_OPEN || // ie. second attribute and beyond
            this._is_wrap_attributes_force_expand_multiline)) {
              printer.print_newline(false);
              wrapped = true;
            }
          }
          printer.print_token(raw_token);
          wrapped = wrapped || printer.previous_token_wrapped();
          last_tag_token.has_wrapped_attrs = wrapped;
        }
        return parser_token;
      };
      Beautifier.prototype._handle_text = function(printer, raw_token, last_tag_token) {
        var parser_token = {
          text: raw_token.text,
          type: "TK_CONTENT"
        };
        if (last_tag_token.custom_beautifier_name) {
          this._print_custom_beatifier_text(printer, raw_token, last_tag_token);
        } else if (last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) {
          printer.add_raw_token(raw_token);
        } else {
          printer.traverse_whitespace(raw_token);
          printer.print_token(raw_token);
        }
        return parser_token;
      };
      Beautifier.prototype._print_custom_beatifier_text = function(printer, raw_token, last_tag_token) {
        var local = this;
        if (raw_token.text !== "") {
          var text = raw_token.text, _beautifier, script_indent_level = 1, pre = "", post = "";
          if (last_tag_token.custom_beautifier_name === "javascript" && typeof this._js_beautify === "function") {
            _beautifier = this._js_beautify;
          } else if (last_tag_token.custom_beautifier_name === "css" && typeof this._css_beautify === "function") {
            _beautifier = this._css_beautify;
          } else if (last_tag_token.custom_beautifier_name === "html") {
            _beautifier = function(html_source, options) {
              var beautifier = new Beautifier(html_source, options, local._js_beautify, local._css_beautify);
              return beautifier.beautify();
            };
          }
          if (this._options.indent_scripts === "keep") {
            script_indent_level = 0;
          } else if (this._options.indent_scripts === "separate") {
            script_indent_level = -printer.indent_level;
          }
          var indentation = printer.get_full_indent(script_indent_level);
          text = text.replace(/\n[ \t]*$/, "");
          if (last_tag_token.custom_beautifier_name !== "html" && text[0] === "<" && text.match(/^(<!--|<!\[CDATA\[)/)) {
            var matched = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(text);
            if (!matched) {
              printer.add_raw_token(raw_token);
              return;
            }
            pre = indentation + matched[1] + "\n";
            text = matched[4];
            if (matched[5]) {
              post = indentation + matched[5];
            }
            text = text.replace(/\n[ \t]*$/, "");
            if (matched[2] || matched[3].indexOf("\n") !== -1) {
              matched = matched[3].match(/[ \t]+$/);
              if (matched) {
                raw_token.whitespace_before = matched[0];
              }
            }
          }
          if (text) {
            if (_beautifier) {
              var Child_options = function() {
                this.eol = "\n";
              };
              Child_options.prototype = this._options.raw_options;
              var child_options = new Child_options();
              text = _beautifier(indentation + text, child_options);
            } else {
              var white = raw_token.whitespace_before;
              if (white) {
                text = text.replace(new RegExp("\n(" + white + ")?", "g"), "\n");
              }
              text = indentation + text.replace(/\n/g, "\n" + indentation);
            }
          }
          if (pre) {
            if (!text) {
              text = pre + post;
            } else {
              text = pre + text + "\n" + post;
            }
          }
          printer.print_newline(false);
          if (text) {
            raw_token.text = text;
            raw_token.whitespace_before = "";
            raw_token.newlines = 0;
            printer.add_raw_token(raw_token);
            printer.print_newline(true);
          }
        }
      };
      Beautifier.prototype._handle_tag_open = function(printer, raw_token, last_tag_token, last_token, tokens) {
        var parser_token = this._get_tag_open_token(raw_token);
        if ((last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) && !last_tag_token.is_empty_element && raw_token.type === TOKEN.TAG_OPEN && !parser_token.is_start_tag) {
          printer.add_raw_token(raw_token);
          parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
        } else {
          printer.traverse_whitespace(raw_token);
          this._set_tag_position(printer, raw_token, parser_token, last_tag_token, last_token);
          if (!parser_token.is_inline_element) {
            printer.set_wrap_point();
          }
          printer.print_token(raw_token);
        }
        if (parser_token.is_start_tag && this._is_wrap_attributes_force) {
          var peek_index = 0;
          var peek_token;
          do {
            peek_token = tokens.peek(peek_index);
            if (peek_token.type === TOKEN.ATTRIBUTE) {
              parser_token.attr_count += 1;
            }
            peek_index += 1;
          } while (peek_token.type !== TOKEN.EOF && peek_token.type !== TOKEN.TAG_CLOSE);
        }
        if (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) {
          parser_token.alignment_size = raw_token.text.length + 1;
        }
        if (!parser_token.tag_complete && !parser_token.is_unformatted) {
          printer.alignment_size = parser_token.alignment_size;
        }
        return parser_token;
      };
      var TagOpenParserToken = function(options, parent, raw_token) {
        this.parent = parent || null;
        this.text = "";
        this.type = "TK_TAG_OPEN";
        this.tag_name = "";
        this.is_inline_element = false;
        this.is_unformatted = false;
        this.is_content_unformatted = false;
        this.is_empty_element = false;
        this.is_start_tag = false;
        this.is_end_tag = false;
        this.indent_content = false;
        this.multiline_content = false;
        this.custom_beautifier_name = null;
        this.start_tag_token = null;
        this.attr_count = 0;
        this.has_wrapped_attrs = false;
        this.alignment_size = 0;
        this.tag_complete = false;
        this.tag_start_char = "";
        this.tag_check = "";
        if (!raw_token) {
          this.tag_complete = true;
        } else {
          var tag_check_match;
          this.tag_start_char = raw_token.text[0];
          this.text = raw_token.text;
          if (this.tag_start_char === "<") {
            tag_check_match = raw_token.text.match(/^<([^\s>]*)/);
            this.tag_check = tag_check_match ? tag_check_match[1] : "";
          } else {
            tag_check_match = raw_token.text.match(/^{{~?(?:[\^]|#\*?)?([^\s}]+)/);
            this.tag_check = tag_check_match ? tag_check_match[1] : "";
            if ((raw_token.text.startsWith("{{#>") || raw_token.text.startsWith("{{~#>")) && this.tag_check[0] === ">") {
              if (this.tag_check === ">" && raw_token.next !== null) {
                this.tag_check = raw_token.next.text.split(" ")[0];
              } else {
                this.tag_check = raw_token.text.split(">")[1];
              }
            }
          }
          this.tag_check = this.tag_check.toLowerCase();
          if (raw_token.type === TOKEN.COMMENT) {
            this.tag_complete = true;
          }
          this.is_start_tag = this.tag_check.charAt(0) !== "/";
          this.tag_name = !this.is_start_tag ? this.tag_check.substr(1) : this.tag_check;
          this.is_end_tag = !this.is_start_tag || raw_token.closed && raw_token.closed.text === "/>";
          var handlebar_starts = 2;
          if (this.tag_start_char === "{" && this.text.length >= 3) {
            if (this.text.charAt(2) === "~") {
              handlebar_starts = 3;
            }
          }
          this.is_end_tag = this.is_end_tag || this.tag_start_char === "{" && (!options.indent_handlebars || this.text.length < 3 || /[^#\^]/.test(this.text.charAt(handlebar_starts)));
        }
      };
      Beautifier.prototype._get_tag_open_token = function(raw_token) {
        var parser_token = new TagOpenParserToken(this._options, this._tag_stack.get_parser_token(), raw_token);
        parser_token.alignment_size = this._options.wrap_attributes_indent_size;
        parser_token.is_end_tag = parser_token.is_end_tag || in_array(parser_token.tag_check, this._options.void_elements);
        parser_token.is_empty_element = parser_token.tag_complete || parser_token.is_start_tag && parser_token.is_end_tag;
        parser_token.is_unformatted = !parser_token.tag_complete && in_array(parser_token.tag_check, this._options.unformatted);
        parser_token.is_content_unformatted = !parser_token.is_empty_element && in_array(parser_token.tag_check, this._options.content_unformatted);
        parser_token.is_inline_element = in_array(parser_token.tag_name, this._options.inline) || this._options.inline_custom_elements && parser_token.tag_name.includes("-") || parser_token.tag_start_char === "{";
        return parser_token;
      };
      Beautifier.prototype._set_tag_position = function(printer, raw_token, parser_token, last_tag_token, last_token) {
        if (!parser_token.is_empty_element) {
          if (parser_token.is_end_tag) {
            parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name);
          } else {
            if (this._do_optional_end_element(parser_token)) {
              if (!parser_token.is_inline_element) {
                printer.print_newline(false);
              }
            }
            this._tag_stack.record_tag(parser_token);
            if ((parser_token.tag_name === "script" || parser_token.tag_name === "style") && !(parser_token.is_unformatted || parser_token.is_content_unformatted)) {
              parser_token.custom_beautifier_name = get_custom_beautifier_name(parser_token.tag_check, raw_token);
            }
          }
        }
        if (in_array(parser_token.tag_check, this._options.extra_liners)) {
          printer.print_newline(false);
          if (!printer._output.just_added_blankline()) {
            printer.print_newline(true);
          }
        }
        if (parser_token.is_empty_element) {
          if (parser_token.tag_start_char === "{" && parser_token.tag_check === "else") {
            this._tag_stack.indent_to_tag(["if", "unless", "each"]);
            parser_token.indent_content = true;
            var foundIfOnCurrentLine = printer.current_line_has_match(/{{#if/);
            if (!foundIfOnCurrentLine) {
              printer.print_newline(false);
            }
          }
          if (parser_token.tag_name === "!--" && last_token.type === TOKEN.TAG_CLOSE && last_tag_token.is_end_tag && parser_token.text.indexOf("\n") === -1) {
          } else {
            if (!(parser_token.is_inline_element || parser_token.is_unformatted)) {
              printer.print_newline(false);
            }
            this._calcluate_parent_multiline(printer, parser_token);
          }
        } else if (parser_token.is_end_tag) {
          var do_end_expand = false;
          do_end_expand = parser_token.start_tag_token && parser_token.start_tag_token.multiline_content;
          do_end_expand = do_end_expand || !parser_token.is_inline_element && !(last_tag_token.is_inline_element || last_tag_token.is_unformatted) && !(last_token.type === TOKEN.TAG_CLOSE && parser_token.start_tag_token === last_tag_token) && last_token.type !== "TK_CONTENT";
          if (parser_token.is_content_unformatted || parser_token.is_unformatted) {
            do_end_expand = false;
          }
          if (do_end_expand) {
            printer.print_newline(false);
          }
        } else {
          parser_token.indent_content = !parser_token.custom_beautifier_name;
          if (parser_token.tag_start_char === "<") {
            if (parser_token.tag_name === "html") {
              parser_token.indent_content = this._options.indent_inner_html;
            } else if (parser_token.tag_name === "head") {
              parser_token.indent_content = this._options.indent_head_inner_html;
            } else if (parser_token.tag_name === "body") {
              parser_token.indent_content = this._options.indent_body_inner_html;
            }
          }
          if (!(parser_token.is_inline_element || parser_token.is_unformatted) && (last_token.type !== "TK_CONTENT" || parser_token.is_content_unformatted)) {
            printer.print_newline(false);
          }
          this._calcluate_parent_multiline(printer, parser_token);
        }
      };
      Beautifier.prototype._calcluate_parent_multiline = function(printer, parser_token) {
        if (parser_token.parent && printer._output.just_added_newline() && !((parser_token.is_inline_element || parser_token.is_unformatted) && parser_token.parent.is_inline_element)) {
          parser_token.parent.multiline_content = true;
        }
      };
      var p_closers = ["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "menu", "nav", "ol", "p", "pre", "section", "table", "ul"];
      var p_parent_excludes = ["a", "audio", "del", "ins", "map", "noscript", "video"];
      Beautifier.prototype._do_optional_end_element = function(parser_token) {
        var result = null;
        if (parser_token.is_empty_element || !parser_token.is_start_tag || !parser_token.parent) {
          return;
        }
        if (parser_token.tag_name === "body") {
          result = result || this._tag_stack.try_pop("head");
        } else if (parser_token.tag_name === "li") {
          result = result || this._tag_stack.try_pop("li", ["ol", "ul", "menu"]);
        } else if (parser_token.tag_name === "dd" || parser_token.tag_name === "dt") {
          result = result || this._tag_stack.try_pop("dt", ["dl"]);
          result = result || this._tag_stack.try_pop("dd", ["dl"]);
        } else if (parser_token.parent.tag_name === "p" && p_closers.indexOf(parser_token.tag_name) !== -1) {
          var p_parent = parser_token.parent.parent;
          if (!p_parent || p_parent_excludes.indexOf(p_parent.tag_name) === -1) {
            result = result || this._tag_stack.try_pop("p");
          }
        } else if (parser_token.tag_name === "rp" || parser_token.tag_name === "rt") {
          result = result || this._tag_stack.try_pop("rt", ["ruby", "rtc"]);
          result = result || this._tag_stack.try_pop("rp", ["ruby", "rtc"]);
        } else if (parser_token.tag_name === "optgroup") {
          result = result || this._tag_stack.try_pop("optgroup", ["select"]);
        } else if (parser_token.tag_name === "option") {
          result = result || this._tag_stack.try_pop("option", ["select", "datalist", "optgroup"]);
        } else if (parser_token.tag_name === "colgroup") {
          result = result || this._tag_stack.try_pop("caption", ["table"]);
        } else if (parser_token.tag_name === "thead") {
          result = result || this._tag_stack.try_pop("caption", ["table"]);
          result = result || this._tag_stack.try_pop("colgroup", ["table"]);
        } else if (parser_token.tag_name === "tbody" || parser_token.tag_name === "tfoot") {
          result = result || this._tag_stack.try_pop("caption", ["table"]);
          result = result || this._tag_stack.try_pop("colgroup", ["table"]);
          result = result || this._tag_stack.try_pop("thead", ["table"]);
          result = result || this._tag_stack.try_pop("tbody", ["table"]);
        } else if (parser_token.tag_name === "tr") {
          result = result || this._tag_stack.try_pop("caption", ["table"]);
          result = result || this._tag_stack.try_pop("colgroup", ["table"]);
          result = result || this._tag_stack.try_pop("tr", ["table", "thead", "tbody", "tfoot"]);
        } else if (parser_token.tag_name === "th" || parser_token.tag_name === "td") {
          result = result || this._tag_stack.try_pop("td", ["table", "thead", "tbody", "tfoot", "tr"]);
          result = result || this._tag_stack.try_pop("th", ["table", "thead", "tbody", "tfoot", "tr"]);
        }
        parser_token.parent = this._tag_stack.get_parser_token();
        return result;
      };
      module2.exports.Beautifier = Beautifier;
    }
  });

  // ../../node_modules/js-beautify/js/src/html/index.js
  var require_html = __commonJS({
    "../../node_modules/js-beautify/js/src/html/index.js"(exports2, module2) {
      "use strict";
      var Beautifier = require_beautifier3().Beautifier;
      var Options = require_options4().Options;
      function style_html(html_source, options, js_beautify, css_beautify) {
        var beautifier = new Beautifier(html_source, options, js_beautify, css_beautify);
        return beautifier.beautify();
      }
      module2.exports = style_html;
      module2.exports.defaultOptions = function() {
        return new Options();
      };
    }
  });

  // ../../node_modules/js-beautify/js/src/index.js
  var require_src = __commonJS({
    "../../node_modules/js-beautify/js/src/index.js"(exports2, module2) {
      "use strict";
      var js_beautify = require_javascript();
      var css_beautify = require_css();
      var html_beautify = require_html();
      function style_html(html_source, options, js, css) {
        js = js || js_beautify;
        css = css || css_beautify;
        return html_beautify(html_source, options, js, css);
      }
      style_html.defaultOptions = html_beautify.defaultOptions;
      module2.exports.js = js_beautify;
      module2.exports.css = css_beautify;
      module2.exports.html = style_html;
    }
  });

  // ../../node_modules/js-beautify/js/index.js
  var require_js = __commonJS({
    "../../node_modules/js-beautify/js/index.js"(exports2, module2) {
      "use strict";
      function get_beautify(js_beautify, css_beautify, html_beautify) {
        var beautify = function(src, config) {
          return js_beautify.js_beautify(src, config);
        };
        beautify.js = js_beautify.js_beautify;
        beautify.css = css_beautify.css_beautify;
        beautify.html = html_beautify.html_beautify;
        beautify.js_beautify = js_beautify.js_beautify;
        beautify.css_beautify = css_beautify.css_beautify;
        beautify.html_beautify = html_beautify.html_beautify;
        return beautify;
      }
      if (typeof define === "function" && define.amd) {
        define([
          "./lib/beautify",
          "./lib/beautify-css",
          "./lib/beautify-html"
        ], function(js_beautify, css_beautify, html_beautify) {
          return get_beautify(js_beautify, css_beautify, html_beautify);
        });
      } else {
        (function(mod) {
          var beautifier = require_src();
          beautifier.js_beautify = beautifier.js;
          beautifier.css_beautify = beautifier.css;
          beautifier.html_beautify = beautifier.html;
          mod.exports = get_beautify(beautifier, beautifier, beautifier);
        })(module2);
      }
    }
  });

  // ../../node_modules/prismjs/prism.js
  var require_prism = __commonJS({
    "../../node_modules/prismjs/prism.js"(exports2, module2) {
      var _self = typeof window !== "undefined" ? window : typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope ? self : {};
      var Prism3 = (function(_self2) {
        var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
        var uniqueId = 0;
        var plainTextGrammar = {};
        var _2 = {
          /**
           * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
           * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
           * additional languages or plugins yourself.
           *
           * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
           *
           * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
           * empty Prism object into the global scope before loading the Prism script like this:
           *
           * ```js
           * window.Prism = window.Prism || {};
           * Prism.manual = true;
           * // add a new <script> to load Prism's script
           * ```
           *
           * @default false
           * @type {boolean}
           * @memberof Prism
           * @public
           */
          manual: _self2.Prism && _self2.Prism.manual,
          /**
           * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
           * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
           * own worker, you don't want it to do this.
           *
           * By setting this value to `true`, Prism will not add its own listeners to the worker.
           *
           * You obviously have to change this value before Prism executes. To do this, you can add an
           * empty Prism object into the global scope before loading the Prism script like this:
           *
           * ```js
           * window.Prism = window.Prism || {};
           * Prism.disableWorkerMessageHandler = true;
           * // Load Prism's script
           * ```
           *
           * @default false
           * @type {boolean}
           * @memberof Prism
           * @public
           */
          disableWorkerMessageHandler: _self2.Prism && _self2.Prism.disableWorkerMessageHandler,
          /**
           * A namespace for utility methods.
           *
           * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
           * change or disappear at any time.
           *
           * @namespace
           * @memberof Prism
           */
          util: {
            encode: function encode(tokens) {
              if (tokens instanceof Token) {
                return new Token(tokens.type, encode(tokens.content), tokens.alias);
              } else if (Array.isArray(tokens)) {
                return tokens.map(encode);
              } else {
                return tokens.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
              }
            },
            /**
             * Returns the name of the type of the given value.
             *
             * @param {any} o
             * @returns {string}
             * @example
             * type(null)      === 'Null'
             * type(undefined) === 'Undefined'
             * type(123)       === 'Number'
             * type('foo')     === 'String'
             * type(true)      === 'Boolean'
             * type([1, 2])    === 'Array'
             * type({})        === 'Object'
             * type(String)    === 'Function'
             * type(/abc+/)    === 'RegExp'
             */
            type: function(o) {
              return Object.prototype.toString.call(o).slice(8, -1);
            },
            /**
             * Returns a unique number for the given object. Later calls will still return the same number.
             *
             * @param {Object} obj
             * @returns {number}
             */
            objId: function(obj) {
              if (!obj["__id"]) {
                Object.defineProperty(obj, "__id", { value: ++uniqueId });
              }
              return obj["__id"];
            },
            /**
             * Creates a deep clone of the given object.
             *
             * The main intended use of this function is to clone language definitions.
             *
             * @param {T} o
             * @param {Record<number, any>} [visited]
             * @returns {T}
             * @template T
             */
            clone: function deepClone(o, visited) {
              visited = visited || {};
              var clone2;
              var id;
              switch (_2.util.type(o)) {
                case "Object":
                  id = _2.util.objId(o);
                  if (visited[id]) {
                    return visited[id];
                  }
                  clone2 = /** @type {Record<string, any>} */
                  {};
                  visited[id] = clone2;
                  for (var key in o) {
                    if (o.hasOwnProperty(key)) {
                      clone2[key] = deepClone(o[key], visited);
                    }
                  }
                  return (
                    /** @type {any} */
                    clone2
                  );
                case "Array":
                  id = _2.util.objId(o);
                  if (visited[id]) {
                    return visited[id];
                  }
                  clone2 = [];
                  visited[id] = clone2;
                  /** @type {Array} */
                  /** @type {any} */
                  o.forEach(function(v2, i) {
                    clone2[i] = deepClone(v2, visited);
                  });
                  return (
                    /** @type {any} */
                    clone2
                  );
                default:
                  return o;
              }
            },
            /**
             * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
             *
             * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
             *
             * @param {Element} element
             * @returns {string}
             */
            getLanguage: function(element) {
              while (element) {
                var m = lang.exec(element.className);
                if (m) {
                  return m[1].toLowerCase();
                }
                element = element.parentElement;
              }
              return "none";
            },
            /**
             * Sets the Prism `language-xxxx` class of the given element.
             *
             * @param {Element} element
             * @param {string} language
             * @returns {void}
             */
            setLanguage: function(element, language) {
              element.className = element.className.replace(RegExp(lang, "gi"), "");
              element.classList.add("language-" + language);
            },
            /**
             * Returns the script element that is currently executing.
             *
             * This does __not__ work for line script element.
             *
             * @returns {HTMLScriptElement | null}
             */
            currentScript: function() {
              if (typeof document === "undefined") {
                return null;
              }
              if (document.currentScript && document.currentScript.tagName === "SCRIPT" && 1 < 2) {
                return (
                  /** @type {any} */
                  document.currentScript
                );
              }
              try {
                throw new Error();
              } catch (err) {
                var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
                if (src) {
                  var scripts = document.getElementsByTagName("script");
                  for (var i in scripts) {
                    if (scripts[i].src == src) {
                      return scripts[i];
                    }
                  }
                }
                return null;
              }
            },
            /**
             * Returns whether a given class is active for `element`.
             *
             * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
             * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
             * given class is just the given class with a `no-` prefix.
             *
             * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
             * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
             * ancestors have the given class or the negated version of it, then the default activation will be returned.
             *
             * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
             * version of it, the class is considered active.
             *
             * @param {Element} element
             * @param {string} className
             * @param {boolean} [defaultActivation=false]
             * @returns {boolean}
             */
            isActive: function(element, className, defaultActivation) {
              var no = "no-" + className;
              while (element) {
                var classList = element.classList;
                if (classList.contains(className)) {
                  return true;
                }
                if (classList.contains(no)) {
                  return false;
                }
                element = element.parentElement;
              }
              return !!defaultActivation;
            }
          },
          /**
           * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
           *
           * @namespace
           * @memberof Prism
           * @public
           */
          languages: {
            /**
             * The grammar for plain, unformatted text.
             */
            plain: plainTextGrammar,
            plaintext: plainTextGrammar,
            text: plainTextGrammar,
            txt: plainTextGrammar,
            /**
             * Creates a deep copy of the language with the given id and appends the given tokens.
             *
             * If a token in `redef` also appears in the copied language, then the existing token in the copied language
             * will be overwritten at its original position.
             *
             * ## Best practices
             *
             * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
             * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
             * understand the language definition because, normally, the order of tokens matters in Prism grammars.
             *
             * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
             * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
             *
             * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
             * @param {Grammar} redef The new tokens to append.
             * @returns {Grammar} The new language created.
             * @public
             * @example
             * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
             *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
             *     // at its original position
             *     'comment': { ... },
             *     // CSS doesn't have a 'color' token, so this token will be appended
             *     'color': /\b(?:red|green|blue)\b/
             * });
             */
            extend: function(id, redef) {
              var lang2 = _2.util.clone(_2.languages[id]);
              for (var key in redef) {
                lang2[key] = redef[key];
              }
              return lang2;
            },
            /**
             * Inserts tokens _before_ another token in a language definition or any other grammar.
             *
             * ## Usage
             *
             * This helper method makes it easy to modify existing languages. For example, the CSS language definition
             * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
             * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
             * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
             * this:
             *
             * ```js
             * Prism.languages.markup.style = {
             *     // token
             * };
             * ```
             *
             * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
             * before existing tokens. For the CSS example above, you would use it like this:
             *
             * ```js
             * Prism.languages.insertBefore('markup', 'cdata', {
             *     'style': {
             *         // token
             *     }
             * });
             * ```
             *
             * ## Special cases
             *
             * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
             * will be ignored.
             *
             * This behavior can be used to insert tokens after `before`:
             *
             * ```js
             * Prism.languages.insertBefore('markup', 'comment', {
             *     'comment': Prism.languages.markup.comment,
             *     // tokens after 'comment'
             * });
             * ```
             *
             * ## Limitations
             *
             * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
             * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
             * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
             * deleting properties which is necessary to insert at arbitrary positions.
             *
             * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
             * Instead, it will create a new object and replace all references to the target object with the new one. This
             * can be done without temporarily deleting properties, so the iteration order is well-defined.
             *
             * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
             * you hold the target object in a variable, then the value of the variable will not change.
             *
             * ```js
             * var oldMarkup = Prism.languages.markup;
             * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
             *
             * assert(oldMarkup !== Prism.languages.markup);
             * assert(newMarkup === Prism.languages.markup);
             * ```
             *
             * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
             * object to be modified.
             * @param {string} before The key to insert before.
             * @param {Grammar} insert An object containing the key-value pairs to be inserted.
             * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
             * object to be modified.
             *
             * Defaults to `Prism.languages`.
             * @returns {Grammar} The new grammar object.
             * @public
             */
            insertBefore: function(inside, before, insert, root2) {
              root2 = root2 || /** @type {any} */
              _2.languages;
              var grammar = root2[inside];
              var ret = {};
              for (var token in grammar) {
                if (grammar.hasOwnProperty(token)) {
                  if (token == before) {
                    for (var newToken in insert) {
                      if (insert.hasOwnProperty(newToken)) {
                        ret[newToken] = insert[newToken];
                      }
                    }
                  }
                  if (!insert.hasOwnProperty(token)) {
                    ret[token] = grammar[token];
                  }
                }
              }
              var old = root2[inside];
              root2[inside] = ret;
              _2.languages.DFS(_2.languages, function(key, value) {
                if (value === old && key != inside) {
                  this[key] = ret;
                }
              });
              return ret;
            },
            // Traverse a language definition with Depth First Search
            DFS: function DFS(o, callback, type2, visited) {
              visited = visited || {};
              var objId = _2.util.objId;
              for (var i in o) {
                if (o.hasOwnProperty(i)) {
                  callback.call(o, i, o[i], type2 || i);
                  var property2 = o[i];
                  var propertyType = _2.util.type(property2);
                  if (propertyType === "Object" && !visited[objId(property2)]) {
                    visited[objId(property2)] = true;
                    DFS(property2, callback, null, visited);
                  } else if (propertyType === "Array" && !visited[objId(property2)]) {
                    visited[objId(property2)] = true;
                    DFS(property2, callback, i, visited);
                  }
                }
              }
            }
          },
          plugins: {},
          /**
           * This is the most high-level function in Prism’s API.
           * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
           * each one of them.
           *
           * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
           *
           * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
           * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
           * @memberof Prism
           * @public
           */
          highlightAll: function(async, callback) {
            _2.highlightAllUnder(document, async, callback);
          },
          /**
           * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
           * {@link Prism.highlightElement} on each one of them.
           *
           * The following hooks will be run:
           * 1. `before-highlightall`
           * 2. `before-all-elements-highlight`
           * 3. All hooks of {@link Prism.highlightElement} for each element.
           *
           * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
           * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
           * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
           * @memberof Prism
           * @public
           */
          highlightAllUnder: function(container, async, callback) {
            var env = {
              callback,
              container,
              selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            _2.hooks.run("before-highlightall", env);
            env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));
            _2.hooks.run("before-all-elements-highlight", env);
            for (var i = 0, element; element = env.elements[i++]; ) {
              _2.highlightElement(element, async === true, env.callback);
            }
          },
          /**
           * Highlights the code inside a single element.
           *
           * The following hooks will be run:
           * 1. `before-sanity-check`
           * 2. `before-highlight`
           * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
           * 4. `before-insert`
           * 5. `after-highlight`
           * 6. `complete`
           *
           * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
           * the element's language.
           *
           * @param {Element} element The element containing the code.
           * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
           * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
           * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
           * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
           *
           * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
           * asynchronous highlighting to work. You can build your own bundle on the
           * [Download page](https://prismjs.com/download.html).
           * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
           * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
           * @memberof Prism
           * @public
           */
          highlightElement: function(element, async, callback) {
            var language = _2.util.getLanguage(element);
            var grammar = _2.languages[language];
            _2.util.setLanguage(element, language);
            var parent = element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === "pre") {
              _2.util.setLanguage(parent, language);
            }
            var code = element.textContent;
            var env = {
              element,
              language,
              grammar,
              code
            };
            function insertHighlightedCode(highlightedCode) {
              env.highlightedCode = highlightedCode;
              _2.hooks.run("before-insert", env);
              env.element.innerHTML = env.highlightedCode;
              _2.hooks.run("after-highlight", env);
              _2.hooks.run("complete", env);
              callback && callback.call(env.element);
            }
            _2.hooks.run("before-sanity-check", env);
            parent = env.element.parentElement;
            if (parent && parent.nodeName.toLowerCase() === "pre" && !parent.hasAttribute("tabindex")) {
              parent.setAttribute("tabindex", "0");
            }
            if (!env.code) {
              _2.hooks.run("complete", env);
              callback && callback.call(env.element);
              return;
            }
            _2.hooks.run("before-highlight", env);
            if (!env.grammar) {
              insertHighlightedCode(_2.util.encode(env.code));
              return;
            }
            if (async && _self2.Worker) {
              var worker = new Worker(_2.filename);
              worker.onmessage = function(evt) {
                insertHighlightedCode(evt.data);
              };
              worker.postMessage(JSON.stringify({
                language: env.language,
                code: env.code,
                immediateClose: true
              }));
            } else {
              insertHighlightedCode(_2.highlight(env.code, env.grammar, env.language));
            }
          },
          /**
           * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
           * and the language definitions to use, and returns a string with the HTML produced.
           *
           * The following hooks will be run:
           * 1. `before-tokenize`
           * 2. `after-tokenize`
           * 3. `wrap`: On each {@link Token}.
           *
           * @param {string} text A string with the code to be highlighted.
           * @param {Grammar} grammar An object containing the tokens to use.
           *
           * Usually a language definition like `Prism.languages.markup`.
           * @param {string} language The name of the language definition passed to `grammar`.
           * @returns {string} The highlighted HTML.
           * @memberof Prism
           * @public
           * @example
           * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
           */
          highlight: function(text, grammar, language) {
            var env = {
              code: text,
              grammar,
              language
            };
            _2.hooks.run("before-tokenize", env);
            if (!env.grammar) {
              throw new Error('The language "' + env.language + '" has no grammar.');
            }
            env.tokens = _2.tokenize(env.code, env.grammar);
            _2.hooks.run("after-tokenize", env);
            return Token.stringify(_2.util.encode(env.tokens), env.language);
          },
          /**
           * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
           * and the language definitions to use, and returns an array with the tokenized code.
           *
           * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
           *
           * This method could be useful in other contexts as well, as a very crude parser.
           *
           * @param {string} text A string with the code to be highlighted.
           * @param {Grammar} grammar An object containing the tokens to use.
           *
           * Usually a language definition like `Prism.languages.markup`.
           * @returns {TokenStream} An array of strings and tokens, a token stream.
           * @memberof Prism
           * @public
           * @example
           * let code = `var foo = 0;`;
           * let tokens = Prism.tokenize(code, Prism.languages.javascript);
           * tokens.forEach(token => {
           *     if (token instanceof Prism.Token && token.type === 'number') {
           *         console.log(`Found numeric literal: ${token.content}`);
           *     }
           * });
           */
          tokenize: function(text, grammar) {
            var rest = grammar.rest;
            if (rest) {
              for (var token in rest) {
                grammar[token] = rest[token];
              }
              delete grammar.rest;
            }
            var tokenList = new LinkedList();
            addAfter(tokenList, tokenList.head, text);
            matchGrammar(text, tokenList, grammar, tokenList.head, 0);
            return toArray2(tokenList);
          },
          /**
           * @namespace
           * @memberof Prism
           * @public
           */
          hooks: {
            all: {},
            /**
             * Adds the given callback to the list of callbacks for the given hook.
             *
             * The callback will be invoked when the hook it is registered for is run.
             * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
             *
             * One callback function can be registered to multiple hooks and the same hook multiple times.
             *
             * @param {string} name The name of the hook.
             * @param {HookCallback} callback The callback function which is given environment variables.
             * @public
             */
            add: function(name, callback) {
              var hooks = _2.hooks.all;
              hooks[name] = hooks[name] || [];
              hooks[name].push(callback);
            },
            /**
             * Runs a hook invoking all registered callbacks with the given environment variables.
             *
             * Callbacks will be invoked synchronously and in the order in which they were registered.
             *
             * @param {string} name The name of the hook.
             * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
             * @public
             */
            run: function(name, env) {
              var callbacks = _2.hooks.all[name];
              if (!callbacks || !callbacks.length) {
                return;
              }
              for (var i = 0, callback; callback = callbacks[i++]; ) {
                callback(env);
              }
            }
          },
          Token
        };
        _self2.Prism = _2;
        function Token(type2, content, alias, matchedStr) {
          this.type = type2;
          this.content = content;
          this.alias = alias;
          this.length = (matchedStr || "").length | 0;
        }
        Token.stringify = function stringify(o, language) {
          if (typeof o == "string") {
            return o;
          }
          if (Array.isArray(o)) {
            var s = "";
            o.forEach(function(e) {
              s += stringify(e, language);
            });
            return s;
          }
          var env = {
            type: o.type,
            content: stringify(o.content, language),
            tag: "span",
            classes: ["token", o.type],
            attributes: {},
            language
          };
          var aliases = o.alias;
          if (aliases) {
            if (Array.isArray(aliases)) {
              Array.prototype.push.apply(env.classes, aliases);
            } else {
              env.classes.push(aliases);
            }
          }
          _2.hooks.run("wrap", env);
          var attributes = "";
          for (var name in env.attributes) {
            attributes += " " + name + '="' + (env.attributes[name] || "").replace(/"/g, "&quot;") + '"';
          }
          return "<" + env.tag + ' class="' + env.classes.join(" ") + '"' + attributes + ">" + env.content + "</" + env.tag + ">";
        };
        function matchPattern(pattern, pos, text, lookbehind) {
          pattern.lastIndex = pos;
          var match = pattern.exec(text);
          if (match && lookbehind && match[1]) {
            var lookbehindLength = match[1].length;
            match.index += lookbehindLength;
            match[0] = match[0].slice(lookbehindLength);
          }
          return match;
        }
        function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
          for (var token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
              continue;
            }
            var patterns = grammar[token];
            patterns = Array.isArray(patterns) ? patterns : [patterns];
            for (var j = 0; j < patterns.length; ++j) {
              if (rematch && rematch.cause == token + "," + j) {
                return;
              }
              var patternObj = patterns[j];
              var inside = patternObj.inside;
              var lookbehind = !!patternObj.lookbehind;
              var greedy = !!patternObj.greedy;
              var alias = patternObj.alias;
              if (greedy && !patternObj.pattern.global) {
                var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
                patternObj.pattern = RegExp(patternObj.pattern.source, flags + "g");
              }
              var pattern = patternObj.pattern || patternObj;
              for (var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
                if (rematch && pos >= rematch.reach) {
                  break;
                }
                var str2 = currentNode.value;
                if (tokenList.length > text.length) {
                  return;
                }
                if (str2 instanceof Token) {
                  continue;
                }
                var removeCount = 1;
                var match;
                if (greedy) {
                  match = matchPattern(pattern, pos, text, lookbehind);
                  if (!match || match.index >= text.length) {
                    break;
                  }
                  var from = match.index;
                  var to = match.index + match[0].length;
                  var p = pos;
                  p += currentNode.value.length;
                  while (from >= p) {
                    currentNode = currentNode.next;
                    p += currentNode.value.length;
                  }
                  p -= currentNode.value.length;
                  pos = p;
                  if (currentNode.value instanceof Token) {
                    continue;
                  }
                  for (var k2 = currentNode; k2 !== tokenList.tail && (p < to || typeof k2.value === "string"); k2 = k2.next) {
                    removeCount++;
                    p += k2.value.length;
                  }
                  removeCount--;
                  str2 = text.slice(pos, p);
                  match.index -= pos;
                } else {
                  match = matchPattern(pattern, 0, str2, lookbehind);
                  if (!match) {
                    continue;
                  }
                }
                var from = match.index;
                var matchStr = match[0];
                var before = str2.slice(0, from);
                var after = str2.slice(from + matchStr.length);
                var reach = pos + str2.length;
                if (rematch && reach > rematch.reach) {
                  rematch.reach = reach;
                }
                var removeFrom = currentNode.prev;
                if (before) {
                  removeFrom = addAfter(tokenList, removeFrom, before);
                  pos += before.length;
                }
                removeRange(tokenList, removeFrom, removeCount);
                var wrapped = new Token(token, inside ? _2.tokenize(matchStr, inside) : matchStr, alias, matchStr);
                currentNode = addAfter(tokenList, removeFrom, wrapped);
                if (after) {
                  addAfter(tokenList, currentNode, after);
                }
                if (removeCount > 1) {
                  var nestedRematch = {
                    cause: token + "," + j,
                    reach
                  };
                  matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);
                  if (rematch && nestedRematch.reach > rematch.reach) {
                    rematch.reach = nestedRematch.reach;
                  }
                }
              }
            }
          }
        }
        function LinkedList() {
          var head2 = { value: null, prev: null, next: null };
          var tail = { value: null, prev: head2, next: null };
          head2.next = tail;
          this.head = head2;
          this.tail = tail;
          this.length = 0;
        }
        function addAfter(list, node, value) {
          var next = node.next;
          var newNode = { value, prev: node, next };
          node.next = newNode;
          next.prev = newNode;
          list.length++;
          return newNode;
        }
        function removeRange(list, node, count) {
          var next = node.next;
          for (var i = 0; i < count && next !== list.tail; i++) {
            next = next.next;
          }
          node.next = next;
          next.prev = node;
          list.length -= i;
        }
        function toArray2(list) {
          var array = [];
          var node = list.head.next;
          while (node !== list.tail) {
            array.push(node.value);
            node = node.next;
          }
          return array;
        }
        if (!_self2.document) {
          if (!_self2.addEventListener) {
            return _2;
          }
          if (!_2.disableWorkerMessageHandler) {
            _self2.addEventListener("message", function(evt) {
              var message = JSON.parse(evt.data);
              var lang2 = message.language;
              var code = message.code;
              var immediateClose = message.immediateClose;
              _self2.postMessage(_2.highlight(code, _2.languages[lang2], lang2));
              if (immediateClose) {
                _self2.close();
              }
            }, false);
          }
          return _2;
        }
        var script = _2.util.currentScript();
        if (script) {
          _2.filename = script.src;
          if (script.hasAttribute("data-manual")) {
            _2.manual = true;
          }
        }
        function highlightAutomaticallyCallback() {
          if (!_2.manual) {
            _2.highlightAll();
          }
        }
        if (!_2.manual) {
          var readyState = document.readyState;
          if (readyState === "loading" || readyState === "interactive" && script && script.defer) {
            document.addEventListener("DOMContentLoaded", highlightAutomaticallyCallback);
          } else {
            if (window.requestAnimationFrame) {
              window.requestAnimationFrame(highlightAutomaticallyCallback);
            } else {
              window.setTimeout(highlightAutomaticallyCallback, 16);
            }
          }
        }
        return _2;
      })(_self);
      if (typeof module2 !== "undefined" && module2.exports) {
        module2.exports = Prism3;
      }
      if (typeof global !== "undefined") {
        global.Prism = Prism3;
      }
      Prism3.languages.markup = {
        "comment": {
          pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
          greedy: true
        },
        "prolog": {
          pattern: /<\?[\s\S]+?\?>/,
          greedy: true
        },
        "doctype": {
          // https://www.w3.org/TR/xml/#NT-doctypedecl
          pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
          greedy: true,
          inside: {
            "internal-subset": {
              pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
              lookbehind: true,
              greedy: true,
              inside: null
              // see below
            },
            "string": {
              pattern: /"[^"]*"|'[^']*'/,
              greedy: true
            },
            "punctuation": /^<!|>$|[[\]]/,
            "doctype-tag": /^DOCTYPE/i,
            "name": /[^\s<>'"]+/
          }
        },
        "cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          greedy: true
        },
        "tag": {
          pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
          greedy: true,
          inside: {
            "tag": {
              pattern: /^<\/?[^\s>\/]+/,
              inside: {
                "punctuation": /^<\/?/,
                "namespace": /^[^\s>\/:]+:/
              }
            },
            "special-attr": [],
            "attr-value": {
              pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
              inside: {
                "punctuation": [
                  {
                    pattern: /^=/,
                    alias: "attr-equals"
                  },
                  {
                    pattern: /^(\s*)["']|["']$/,
                    lookbehind: true
                  }
                ]
              }
            },
            "punctuation": /\/?>/,
            "attr-name": {
              pattern: /[^\s>\/]+/,
              inside: {
                "namespace": /^[^\s>\/:]+:/
              }
            }
          }
        },
        "entity": [
          {
            pattern: /&[\da-z]{1,8};/i,
            alias: "named-entity"
          },
          /&#x?[\da-f]{1,8};/i
        ]
      };
      Prism3.languages.markup["tag"].inside["attr-value"].inside["entity"] = Prism3.languages.markup["entity"];
      Prism3.languages.markup["doctype"].inside["internal-subset"].inside = Prism3.languages.markup;
      Prism3.hooks.add("wrap", function(env) {
        if (env.type === "entity") {
          env.attributes["title"] = env.content.replace(/&amp;/, "&");
        }
      });
      Object.defineProperty(Prism3.languages.markup.tag, "addInlined", {
        /**
         * Adds an inlined language to markup.
         *
         * An example of an inlined language is CSS with `<style>` tags.
         *
         * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addInlined('style', 'css');
         */
        value: function addInlined2(tagName, lang) {
          var includedCdataInside = {};
          includedCdataInside["language-" + lang] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: true,
            inside: Prism3.languages[lang]
          };
          includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;
          var inside = {
            "included-cdata": {
              pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
              inside: includedCdataInside
            }
          };
          inside["language-" + lang] = {
            pattern: /[\s\S]+/,
            inside: Prism3.languages[lang]
          };
          var def = {};
          def[tagName] = {
            pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
              return tagName;
            }), "i"),
            lookbehind: true,
            greedy: true,
            inside
          };
          Prism3.languages.insertBefore("markup", "cdata", def);
        }
      });
      Object.defineProperty(Prism3.languages.markup.tag, "addAttribute", {
        /**
         * Adds an pattern to highlight languages embedded in HTML attributes.
         *
         * An example of an inlined language is CSS with `style` attributes.
         *
         * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
         * case insensitive.
         * @param {string} lang The language key.
         * @example
         * addAttribute('style', 'css');
         */
        value: function(attrName, lang) {
          Prism3.languages.markup.tag.inside["special-attr"].push({
            pattern: RegExp(
              /(^|["'\s])/.source + "(?:" + attrName + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
              "i"
            ),
            lookbehind: true,
            inside: {
              "attr-name": /^[^\s=]+/,
              "attr-value": {
                pattern: /=[\s\S]+/,
                inside: {
                  "value": {
                    pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                    lookbehind: true,
                    alias: [lang, "language-" + lang],
                    inside: Prism3.languages[lang]
                  },
                  "punctuation": [
                    {
                      pattern: /^=/,
                      alias: "attr-equals"
                    },
                    /"|'/
                  ]
                }
              }
            }
          });
        }
      });
      Prism3.languages.html = Prism3.languages.markup;
      Prism3.languages.mathml = Prism3.languages.markup;
      Prism3.languages.svg = Prism3.languages.markup;
      Prism3.languages.xml = Prism3.languages.extend("markup", {});
      Prism3.languages.ssml = Prism3.languages.xml;
      Prism3.languages.atom = Prism3.languages.xml;
      Prism3.languages.rss = Prism3.languages.xml;
      (function(Prism4) {
        var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
        Prism4.languages.css = {
          "comment": /\/\*[\s\S]*?\*\//,
          "atrule": {
            pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + string.source + ")*?" + /(?:;|(?=\s*\{))/.source),
            inside: {
              "rule": /^@[\w-]+/,
              "selector-function-argument": {
                pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                lookbehind: true,
                alias: "selector"
              },
              "keyword": {
                pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                lookbehind: true
              }
              // See rest below
            }
          },
          "url": {
            // https://drafts.csswg.org/css-values-3/#urls
            pattern: RegExp("\\burl\\((?:" + string.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
            greedy: true,
            inside: {
              "function": /^url/i,
              "punctuation": /^\(|\)$/,
              "string": {
                pattern: RegExp("^" + string.source + "$"),
                alias: "url"
              }
            }
          },
          "selector": {
            pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + string.source + ")*(?=\\s*\\{)"),
            lookbehind: true
          },
          "string": {
            pattern: string,
            greedy: true
          },
          "property": {
            pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
            lookbehind: true
          },
          "important": /!important\b/i,
          "function": {
            pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
            lookbehind: true
          },
          "punctuation": /[(){};:,]/
        };
        Prism4.languages.css["atrule"].inside.rest = Prism4.languages.css;
        var markup = Prism4.languages.markup;
        if (markup) {
          markup.tag.addInlined("style", "css");
          markup.tag.addAttribute("style", "css");
        }
      })(Prism3);
      Prism3.languages.clike = {
        "comment": [
          {
            pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
            lookbehind: true,
            greedy: true
          },
          {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: true,
            greedy: true
          }
        ],
        "string": {
          pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
          greedy: true
        },
        "class-name": {
          pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
          lookbehind: true,
          inside: {
            "punctuation": /[.\\]/
          }
        },
        "keyword": /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
        "boolean": /\b(?:false|true)\b/,
        "function": /\b\w+(?=\()/,
        "number": /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
        "operator": /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
        "punctuation": /[{}[\];(),.:]/
      };
      Prism3.languages.javascript = Prism3.languages.extend("clike", {
        "class-name": [
          Prism3.languages.clike["class-name"],
          {
            pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
            lookbehind: true
          }
        ],
        "keyword": [
          {
            pattern: /((?:^|\})\s*)catch\b/,
            lookbehind: true
          },
          {
            pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
            lookbehind: true
          }
        ],
        // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
        "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        "number": {
          pattern: RegExp(
            /(^|[^\w$])/.source + "(?:" + // constant
            (/NaN|Infinity/.source + "|" + // binary integer
            /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
            /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
            /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
            /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
            /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
          ),
          lookbehind: true
        },
        "operator": /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
      });
      Prism3.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
      Prism3.languages.insertBefore("javascript", "keyword", {
        "regex": {
          pattern: RegExp(
            // lookbehind
            // eslint-disable-next-line regexp/no-dupe-characters-character-class
            /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
            // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
            // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
            // with the only syntax, so we have to define 2 different regex patterns.
            /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
            /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
            /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
          ),
          lookbehind: true,
          greedy: true,
          inside: {
            "regex-source": {
              pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
              lookbehind: true,
              alias: "language-regex",
              inside: Prism3.languages.regex
            },
            "regex-delimiter": /^\/|\/$/,
            "regex-flags": /^[a-z]+$/
          }
        },
        // This must be declared before keyword because we use "function" inside the look-forward
        "function-variable": {
          pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
          alias: "function"
        },
        "parameter": [
          {
            pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          },
          {
            pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
            lookbehind: true,
            inside: Prism3.languages.javascript
          }
        ],
        "constant": /\b[A-Z](?:[A-Z_]|\dx?)*\b/
      });
      Prism3.languages.insertBefore("javascript", "string", {
        "hashbang": {
          pattern: /^#!.*/,
          greedy: true,
          alias: "comment"
        },
        "template-string": {
          pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
          greedy: true,
          inside: {
            "template-punctuation": {
              pattern: /^`|`$/,
              alias: "string"
            },
            "interpolation": {
              pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
              lookbehind: true,
              inside: {
                "interpolation-punctuation": {
                  pattern: /^\$\{|\}$/,
                  alias: "punctuation"
                },
                rest: Prism3.languages.javascript
              }
            },
            "string": /[\s\S]+/
          }
        },
        "string-property": {
          pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
          lookbehind: true,
          greedy: true,
          alias: "property"
        }
      });
      Prism3.languages.insertBefore("javascript", "operator", {
        "literal-property": {
          pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
          lookbehind: true,
          alias: "property"
        }
      });
      if (Prism3.languages.markup) {
        Prism3.languages.markup.tag.addInlined("script", "javascript");
        Prism3.languages.markup.tag.addAttribute(
          /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
          "javascript"
        );
      }
      Prism3.languages.js = Prism3.languages.javascript;
      (function() {
        if (typeof Prism3 === "undefined" || typeof document === "undefined") {
          return;
        }
        if (!Element.prototype.matches) {
          Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        }
        var LOADING_MESSAGE = "Loading\u2026";
        var FAILURE_MESSAGE = function(status, message) {
          return "\u2716 Error " + status + " while fetching file: " + message;
        };
        var FAILURE_EMPTY_MESSAGE = "\u2716 Error: File does not exist or is empty";
        var EXTENSIONS = {
          "js": "javascript",
          "py": "python",
          "rb": "ruby",
          "ps1": "powershell",
          "psm1": "powershell",
          "sh": "bash",
          "bat": "batch",
          "h": "c",
          "tex": "latex"
        };
        var STATUS_ATTR = "data-src-status";
        var STATUS_LOADING = "loading";
        var STATUS_LOADED = "loaded";
        var STATUS_FAILED = "failed";
        var SELECTOR = "pre[data-src]:not([" + STATUS_ATTR + '="' + STATUS_LOADED + '"]):not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';
        function loadFile(src, success, error) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", src, true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
              if (xhr.status < 400 && xhr.responseText) {
                success(xhr.responseText);
              } else {
                if (xhr.status >= 400) {
                  error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
                } else {
                  error(FAILURE_EMPTY_MESSAGE);
                }
              }
            }
          };
          xhr.send(null);
        }
        function parseRange(range) {
          var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || "");
          if (m) {
            var start = Number(m[1]);
            var comma = m[2];
            var end = m[3];
            if (!comma) {
              return [start, start];
            }
            if (!end) {
              return [start, void 0];
            }
            return [start, Number(end)];
          }
          return void 0;
        }
        Prism3.hooks.add("before-highlightall", function(env) {
          env.selector += ", " + SELECTOR;
        });
        Prism3.hooks.add("before-sanity-check", function(env) {
          var pre = (
            /** @type {HTMLPreElement} */
            env.element
          );
          if (pre.matches(SELECTOR)) {
            env.code = "";
            pre.setAttribute(STATUS_ATTR, STATUS_LOADING);
            var code = pre.appendChild(document.createElement("CODE"));
            code.textContent = LOADING_MESSAGE;
            var src = pre.getAttribute("data-src");
            var language = env.language;
            if (language === "none") {
              var extension = (/\.(\w+)$/.exec(src) || [, "none"])[1];
              language = EXTENSIONS[extension] || extension;
            }
            Prism3.util.setLanguage(code, language);
            Prism3.util.setLanguage(pre, language);
            var autoloader = Prism3.plugins.autoloader;
            if (autoloader) {
              autoloader.loadLanguages(language);
            }
            loadFile(
              src,
              function(text) {
                pre.setAttribute(STATUS_ATTR, STATUS_LOADED);
                var range = parseRange(pre.getAttribute("data-range"));
                if (range) {
                  var lines = text.split(/\r\n?|\n/g);
                  var start = range[0];
                  var end = range[1] == null ? lines.length : range[1];
                  if (start < 0) {
                    start += lines.length;
                  }
                  start = Math.max(0, Math.min(start - 1, lines.length));
                  if (end < 0) {
                    end += lines.length;
                  }
                  end = Math.max(0, Math.min(end, lines.length));
                  text = lines.slice(start, end).join("\n");
                  if (!pre.hasAttribute("data-start")) {
                    pre.setAttribute("data-start", String(start + 1));
                  }
                }
                code.textContent = text;
                Prism3.highlightElement(code);
              },
              function(error) {
                pre.setAttribute(STATUS_ATTR, STATUS_FAILED);
                code.textContent = error;
              }
            );
          }
        });
        Prism3.plugins.fileHighlight = {
          /**
           * Executes the File Highlight plugin for all matching `pre` elements under the given container.
           *
           * Note: Elements which are already loaded or currently loading will not be touched by this method.
           *
           * @param {ParentNode} [container=document]
           */
          highlight: function highlight(container) {
            var elements = (container || document).querySelectorAll(SELECTOR);
            for (var i = 0, element; element = elements[i++]; ) {
              Prism3.highlightElement(element);
            }
          }
        };
        var logged = false;
        Prism3.fileHighlight = function() {
          if (!logged) {
            console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.");
            logged = true;
          }
          Prism3.plugins.fileHighlight.highlight.apply(this, arguments);
        };
      })();
    }
  });

  // ../../node_modules/lodash-es/_freeGlobal.js
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeGlobal_default = freeGlobal;

  // ../../node_modules/lodash-es/_root.js
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal_default || freeSelf || Function("return this")();
  var root_default = root;

  // ../../node_modules/lodash-es/_Symbol.js
  var Symbol2 = root_default.Symbol;
  var Symbol_default = Symbol2;

  // ../../node_modules/lodash-es/_getRawTag.js
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var nativeObjectToString = objectProto.toString;
  var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
      value[symToStringTag] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  var getRawTag_default = getRawTag;

  // ../../node_modules/lodash-es/_objectToString.js
  var objectProto2 = Object.prototype;
  var nativeObjectToString2 = objectProto2.toString;
  function objectToString(value) {
    return nativeObjectToString2.call(value);
  }
  var objectToString_default = objectToString;

  // ../../node_modules/lodash-es/_baseGetTag.js
  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
  }
  var baseGetTag_default = baseGetTag;

  // ../../node_modules/lodash-es/isObjectLike.js
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_default = isObjectLike;

  // ../../node_modules/lodash-es/isSymbol.js
  var symbolTag = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
  }
  var isSymbol_default = isSymbol;

  // ../../node_modules/lodash-es/_arrayMap.js
  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
  var arrayMap_default = arrayMap;

  // ../../node_modules/lodash-es/isArray.js
  var isArray = Array.isArray;
  var isArray_default = isArray;

  // ../../node_modules/lodash-es/_baseToString.js
  var INFINITY = 1 / 0;
  var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
  var symbolToString = symbolProto ? symbolProto.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray_default(value)) {
      return arrayMap_default(value, baseToString) + "";
    }
    if (isSymbol_default(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  var baseToString_default = baseToString;

  // ../../node_modules/lodash-es/_trimmedEndIndex.js
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var trimmedEndIndex_default = trimmedEndIndex;

  // ../../node_modules/lodash-es/_baseTrim.js
  var reTrimStart = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex_default(string) + 1).replace(reTrimStart, "") : string;
  }
  var baseTrim_default = baseTrim;

  // ../../node_modules/lodash-es/isObject.js
  function isObject(value) {
    var type2 = typeof value;
    return value != null && (type2 == "object" || type2 == "function");
  }
  var isObject_default = isObject;

  // ../../node_modules/lodash-es/toNumber.js
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol_default(value)) {
      return NAN;
    }
    if (isObject_default(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject_default(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim_default(value);
    var isBinary2 = reIsBinary.test(value);
    return isBinary2 || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary2 ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_default = toNumber;

  // ../../node_modules/lodash-es/toFinite.js
  var INFINITY2 = 1 / 0;
  var MAX_INTEGER = 17976931348623157e292;
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber_default(value);
    if (value === INFINITY2 || value === -INFINITY2) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }
  var toFinite_default = toFinite;

  // ../../node_modules/lodash-es/toInteger.js
  function toInteger(value) {
    var result = toFinite_default(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }
  var toInteger_default = toInteger;

  // ../../node_modules/lodash-es/identity.js
  function identity(value) {
    return value;
  }
  var identity_default = identity;

  // ../../node_modules/lodash-es/isFunction.js
  var asyncTag = "[object AsyncFunction]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject_default(value)) {
      return false;
    }
    var tag = baseGetTag_default(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  var isFunction_default = isFunction;

  // ../../node_modules/lodash-es/_coreJsData.js
  var coreJsData = root_default["__core-js_shared__"];
  var coreJsData_default = coreJsData;

  // ../../node_modules/lodash-es/_isMasked.js
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  })();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  var isMasked_default = isMasked;

  // ../../node_modules/lodash-es/_toSource.js
  var funcProto = Function.prototype;
  var funcToString = funcProto.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  var toSource_default = toSource;

  // ../../node_modules/lodash-es/_baseIsNative.js
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto2 = Function.prototype;
  var objectProto3 = Object.prototype;
  var funcToString2 = funcProto2.toString;
  var hasOwnProperty2 = objectProto3.hasOwnProperty;
  var reIsNative = RegExp(
    "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function baseIsNative(value) {
    if (!isObject_default(value) || isMasked_default(value)) {
      return false;
    }
    var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource_default(value));
  }
  var baseIsNative_default = baseIsNative;

  // ../../node_modules/lodash-es/_getValue.js
  function getValue(object, key) {
    return object == null ? void 0 : object[key];
  }
  var getValue_default = getValue;

  // ../../node_modules/lodash-es/_getNative.js
  function getNative(object, key) {
    var value = getValue_default(object, key);
    return baseIsNative_default(value) ? value : void 0;
  }
  var getNative_default = getNative;

  // ../../node_modules/lodash-es/_WeakMap.js
  var WeakMap = getNative_default(root_default, "WeakMap");
  var WeakMap_default = WeakMap;

  // ../../node_modules/lodash-es/_baseCreate.js
  var objectCreate = Object.create;
  var baseCreate = /* @__PURE__ */ (function() {
    function object() {
    }
    return function(proto) {
      if (!isObject_default(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  })();
  var baseCreate_default = baseCreate;

  // ../../node_modules/lodash-es/_apply.js
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }
  var apply_default = apply;

  // ../../node_modules/lodash-es/noop.js
  function noop() {
  }
  var noop_default = noop;

  // ../../node_modules/lodash-es/_copyArray.js
  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }
  var copyArray_default = copyArray;

  // ../../node_modules/lodash-es/_shortOut.js
  var HOT_COUNT = 800;
  var HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }
  var shortOut_default = shortOut;

  // ../../node_modules/lodash-es/constant.js
  function constant(value) {
    return function() {
      return value;
    };
  }
  var constant_default = constant;

  // ../../node_modules/lodash-es/_defineProperty.js
  var defineProperty = (function() {
    try {
      var func = getNative_default(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  })();
  var defineProperty_default = defineProperty;

  // ../../node_modules/lodash-es/_baseSetToString.js
  var baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
    return defineProperty_default(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant_default(string),
      "writable": true
    });
  };
  var baseSetToString_default = baseSetToString;

  // ../../node_modules/lodash-es/_setToString.js
  var setToString = shortOut_default(baseSetToString_default);
  var setToString_default = setToString;

  // ../../node_modules/lodash-es/_arrayEach.js
  function arrayEach(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }
  var arrayEach_default = arrayEach;

  // ../../node_modules/lodash-es/_baseFindIndex.js
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }
  var baseFindIndex_default = baseFindIndex;

  // ../../node_modules/lodash-es/_baseIsNaN.js
  function baseIsNaN(value) {
    return value !== value;
  }
  var baseIsNaN_default = baseIsNaN;

  // ../../node_modules/lodash-es/_strictIndexOf.js
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1, length = array.length;
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }
  var strictIndexOf_default = strictIndexOf;

  // ../../node_modules/lodash-es/_baseIndexOf.js
  function baseIndexOf(array, value, fromIndex) {
    return value === value ? strictIndexOf_default(array, value, fromIndex) : baseFindIndex_default(array, baseIsNaN_default, fromIndex);
  }
  var baseIndexOf_default = baseIndexOf;

  // ../../node_modules/lodash-es/_arrayIncludes.js
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf_default(array, value, 0) > -1;
  }
  var arrayIncludes_default = arrayIncludes;

  // ../../node_modules/lodash-es/_isIndex.js
  var MAX_SAFE_INTEGER = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type2 = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (type2 == "number" || type2 != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  var isIndex_default = isIndex;

  // ../../node_modules/lodash-es/_baseAssignValue.js
  function baseAssignValue(object, key, value) {
    if (key == "__proto__" && defineProperty_default) {
      defineProperty_default(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }
  var baseAssignValue_default = baseAssignValue;

  // ../../node_modules/lodash-es/eq.js
  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  var eq_default = eq;

  // ../../node_modules/lodash-es/_assignValue.js
  var objectProto4 = Object.prototype;
  var hasOwnProperty3 = objectProto4.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty3.call(object, key) && eq_default(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue_default(object, key, value);
    }
  }
  var assignValue_default = assignValue;

  // ../../node_modules/lodash-es/_copyObject.js
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue_default(object, key, newValue);
      } else {
        assignValue_default(object, key, newValue);
      }
    }
    return object;
  }
  var copyObject_default = copyObject;

  // ../../node_modules/lodash-es/_overRest.js
  var nativeMax = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply_default(func, this, otherArgs);
    };
  }
  var overRest_default = overRest;

  // ../../node_modules/lodash-es/_baseRest.js
  function baseRest(func, start) {
    return setToString_default(overRest_default(func, start, identity_default), func + "");
  }
  var baseRest_default = baseRest;

  // ../../node_modules/lodash-es/isLength.js
  var MAX_SAFE_INTEGER2 = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
  }
  var isLength_default = isLength;

  // ../../node_modules/lodash-es/isArrayLike.js
  function isArrayLike(value) {
    return value != null && isLength_default(value.length) && !isFunction_default(value);
  }
  var isArrayLike_default = isArrayLike;

  // ../../node_modules/lodash-es/_isIterateeCall.js
  function isIterateeCall(value, index, object) {
    if (!isObject_default(object)) {
      return false;
    }
    var type2 = typeof index;
    if (type2 == "number" ? isArrayLike_default(object) && isIndex_default(index, object.length) : type2 == "string" && index in object) {
      return eq_default(object[index], value);
    }
    return false;
  }
  var isIterateeCall_default = isIterateeCall;

  // ../../node_modules/lodash-es/_createAssigner.js
  function createAssigner(assigner) {
    return baseRest_default(function(object, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }
  var createAssigner_default = createAssigner;

  // ../../node_modules/lodash-es/_isPrototype.js
  var objectProto5 = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto5;
    return value === proto;
  }
  var isPrototype_default = isPrototype;

  // ../../node_modules/lodash-es/_baseTimes.js
  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }
  var baseTimes_default = baseTimes;

  // ../../node_modules/lodash-es/_baseIsArguments.js
  var argsTag = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
  }
  var baseIsArguments_default = baseIsArguments;

  // ../../node_modules/lodash-es/isArguments.js
  var objectProto6 = Object.prototype;
  var hasOwnProperty4 = objectProto6.hasOwnProperty;
  var propertyIsEnumerable = objectProto6.propertyIsEnumerable;
  var isArguments = baseIsArguments_default(/* @__PURE__ */ (function() {
    return arguments;
  })()) ? baseIsArguments_default : function(value) {
    return isObjectLike_default(value) && hasOwnProperty4.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
  };
  var isArguments_default = isArguments;

  // ../../node_modules/lodash-es/stubFalse.js
  function stubFalse() {
    return false;
  }
  var stubFalse_default = stubFalse;

  // ../../node_modules/lodash-es/isBuffer.js
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer2 = moduleExports ? root_default.Buffer : void 0;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse_default;
  var isBuffer_default = isBuffer;

  // ../../node_modules/lodash-es/_baseIsTypedArray.js
  var argsTag2 = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var funcTag2 = "[object Function]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var objectTag = "[object Object]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  function baseIsTypedArray(value) {
    return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
  }
  var baseIsTypedArray_default = baseIsTypedArray;

  // ../../node_modules/lodash-es/_baseUnary.js
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  var baseUnary_default = baseUnary;

  // ../../node_modules/lodash-es/_nodeUtil.js
  var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
  var freeProcess = moduleExports2 && freeGlobal_default.process;
  var nodeUtil = (function() {
    try {
      var types2 = freeModule2 && freeModule2.require && freeModule2.require("util").types;
      if (types2) {
        return types2;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  })();
  var nodeUtil_default = nodeUtil;

  // ../../node_modules/lodash-es/isTypedArray.js
  var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
  var isTypedArray_default = isTypedArray;

  // ../../node_modules/lodash-es/_arrayLikeKeys.js
  var objectProto7 = Object.prototype;
  var hasOwnProperty5 = objectProto7.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty5.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
      (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
      isIndex_default(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  var arrayLikeKeys_default = arrayLikeKeys;

  // ../../node_modules/lodash-es/_overArg.js
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  var overArg_default = overArg;

  // ../../node_modules/lodash-es/_nativeKeys.js
  var nativeKeys = overArg_default(Object.keys, Object);
  var nativeKeys_default = nativeKeys;

  // ../../node_modules/lodash-es/_baseKeys.js
  var objectProto8 = Object.prototype;
  var hasOwnProperty6 = objectProto8.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype_default(object)) {
      return nativeKeys_default(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty6.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  var baseKeys_default = baseKeys;

  // ../../node_modules/lodash-es/keys.js
  function keys(object) {
    return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
  }
  var keys_default = keys;

  // ../../node_modules/lodash-es/assign.js
  var objectProto9 = Object.prototype;
  var hasOwnProperty7 = objectProto9.hasOwnProperty;
  var assign = createAssigner_default(function(object, source) {
    if (isPrototype_default(source) || isArrayLike_default(source)) {
      copyObject_default(source, keys_default(source), object);
      return;
    }
    for (var key in source) {
      if (hasOwnProperty7.call(source, key)) {
        assignValue_default(object, key, source[key]);
      }
    }
  });
  var assign_default = assign;

  // ../../node_modules/lodash-es/_nativeKeysIn.js
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }
  var nativeKeysIn_default = nativeKeysIn;

  // ../../node_modules/lodash-es/_baseKeysIn.js
  var objectProto10 = Object.prototype;
  var hasOwnProperty8 = objectProto10.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject_default(object)) {
      return nativeKeysIn_default(object);
    }
    var isProto = isPrototype_default(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty8.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }
  var baseKeysIn_default = baseKeysIn;

  // ../../node_modules/lodash-es/keysIn.js
  function keysIn(object) {
    return isArrayLike_default(object) ? arrayLikeKeys_default(object, true) : baseKeysIn_default(object);
  }
  var keysIn_default = keysIn;

  // ../../node_modules/lodash-es/_isKey.js
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray_default(value)) {
      return false;
    }
    var type2 = typeof value;
    if (type2 == "number" || type2 == "symbol" || type2 == "boolean" || value == null || isSymbol_default(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  var isKey_default = isKey;

  // ../../node_modules/lodash-es/_nativeCreate.js
  var nativeCreate = getNative_default(Object, "create");
  var nativeCreate_default = nativeCreate;

  // ../../node_modules/lodash-es/_hashClear.js
  function hashClear() {
    this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
    this.size = 0;
  }
  var hashClear_default = hashClear;

  // ../../node_modules/lodash-es/_hashDelete.js
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }
  var hashDelete_default = hashDelete;

  // ../../node_modules/lodash-es/_hashGet.js
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var objectProto11 = Object.prototype;
  var hasOwnProperty9 = objectProto11.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate_default) {
      var result = data[key];
      return result === HASH_UNDEFINED ? void 0 : result;
    }
    return hasOwnProperty9.call(data, key) ? data[key] : void 0;
  }
  var hashGet_default = hashGet;

  // ../../node_modules/lodash-es/_hashHas.js
  var objectProto12 = Object.prototype;
  var hasOwnProperty10 = objectProto12.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty10.call(data, key);
  }
  var hashHas_default = hashHas;

  // ../../node_modules/lodash-es/_hashSet.js
  var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
    return this;
  }
  var hashSet_default = hashSet;

  // ../../node_modules/lodash-es/_Hash.js
  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear_default;
  Hash.prototype["delete"] = hashDelete_default;
  Hash.prototype.get = hashGet_default;
  Hash.prototype.has = hashHas_default;
  Hash.prototype.set = hashSet_default;
  var Hash_default = Hash;

  // ../../node_modules/lodash-es/_listCacheClear.js
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }
  var listCacheClear_default = listCacheClear;

  // ../../node_modules/lodash-es/_assocIndexOf.js
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_default(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var assocIndexOf_default = assocIndexOf;

  // ../../node_modules/lodash-es/_listCacheDelete.js
  var arrayProto = Array.prototype;
  var splice = arrayProto.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf_default(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }
  var listCacheDelete_default = listCacheDelete;

  // ../../node_modules/lodash-es/_listCacheGet.js
  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf_default(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  var listCacheGet_default = listCacheGet;

  // ../../node_modules/lodash-es/_listCacheHas.js
  function listCacheHas(key) {
    return assocIndexOf_default(this.__data__, key) > -1;
  }
  var listCacheHas_default = listCacheHas;

  // ../../node_modules/lodash-es/_listCacheSet.js
  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf_default(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  var listCacheSet_default = listCacheSet;

  // ../../node_modules/lodash-es/_ListCache.js
  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear_default;
  ListCache.prototype["delete"] = listCacheDelete_default;
  ListCache.prototype.get = listCacheGet_default;
  ListCache.prototype.has = listCacheHas_default;
  ListCache.prototype.set = listCacheSet_default;
  var ListCache_default = ListCache;

  // ../../node_modules/lodash-es/_Map.js
  var Map2 = getNative_default(root_default, "Map");
  var Map_default = Map2;

  // ../../node_modules/lodash-es/_mapCacheClear.js
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash_default(),
      "map": new (Map_default || ListCache_default)(),
      "string": new Hash_default()
    };
  }
  var mapCacheClear_default = mapCacheClear;

  // ../../node_modules/lodash-es/_isKeyable.js
  function isKeyable(value) {
    var type2 = typeof value;
    return type2 == "string" || type2 == "number" || type2 == "symbol" || type2 == "boolean" ? value !== "__proto__" : value === null;
  }
  var isKeyable_default = isKeyable;

  // ../../node_modules/lodash-es/_getMapData.js
  function getMapData(map3, key) {
    var data = map3.__data__;
    return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  var getMapData_default = getMapData;

  // ../../node_modules/lodash-es/_mapCacheDelete.js
  function mapCacheDelete(key) {
    var result = getMapData_default(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }
  var mapCacheDelete_default = mapCacheDelete;

  // ../../node_modules/lodash-es/_mapCacheGet.js
  function mapCacheGet(key) {
    return getMapData_default(this, key).get(key);
  }
  var mapCacheGet_default = mapCacheGet;

  // ../../node_modules/lodash-es/_mapCacheHas.js
  function mapCacheHas(key) {
    return getMapData_default(this, key).has(key);
  }
  var mapCacheHas_default = mapCacheHas;

  // ../../node_modules/lodash-es/_mapCacheSet.js
  function mapCacheSet(key, value) {
    var data = getMapData_default(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }
  var mapCacheSet_default = mapCacheSet;

  // ../../node_modules/lodash-es/_MapCache.js
  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear_default;
  MapCache.prototype["delete"] = mapCacheDelete_default;
  MapCache.prototype.get = mapCacheGet_default;
  MapCache.prototype.has = mapCacheHas_default;
  MapCache.prototype.set = mapCacheSet_default;
  var MapCache_default = MapCache;

  // ../../node_modules/lodash-es/memoize.js
  var FUNC_ERROR_TEXT = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache_default)();
    return memoized;
  }
  memoize.Cache = MapCache_default;
  var memoize_default = memoize;

  // ../../node_modules/lodash-es/_memoizeCapped.js
  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize_default(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
    var cache = result.cache;
    return result;
  }
  var memoizeCapped_default = memoizeCapped;

  // ../../node_modules/lodash-es/_stringToPath.js
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped_default(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  var stringToPath_default = stringToPath;

  // ../../node_modules/lodash-es/toString.js
  function toString(value) {
    return value == null ? "" : baseToString_default(value);
  }
  var toString_default = toString;

  // ../../node_modules/lodash-es/_castPath.js
  function castPath(value, object) {
    if (isArray_default(value)) {
      return value;
    }
    return isKey_default(value, object) ? [value] : stringToPath_default(toString_default(value));
  }
  var castPath_default = castPath;

  // ../../node_modules/lodash-es/_toKey.js
  var INFINITY3 = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol_default(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY3 ? "-0" : result;
  }
  var toKey_default = toKey;

  // ../../node_modules/lodash-es/_baseGet.js
  function baseGet(object, path) {
    path = castPath_default(path, object);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey_default(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  var baseGet_default = baseGet;

  // ../../node_modules/lodash-es/get.js
  function get(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet_default(object, path);
    return result === void 0 ? defaultValue : result;
  }
  var get_default = get;

  // ../../node_modules/lodash-es/_arrayPush.js
  function arrayPush(array, values2) {
    var index = -1, length = values2.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values2[index];
    }
    return array;
  }
  var arrayPush_default = arrayPush;

  // ../../node_modules/lodash-es/_isFlattenable.js
  var spreadableSymbol = Symbol_default ? Symbol_default.isConcatSpreadable : void 0;
  function isFlattenable(value) {
    return isArray_default(value) || isArguments_default(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }
  var isFlattenable_default = isFlattenable;

  // ../../node_modules/lodash-es/_baseFlatten.js
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable_default);
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush_default(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }
  var baseFlatten_default = baseFlatten;

  // ../../node_modules/lodash-es/flatten.js
  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten_default(array, 1) : [];
  }
  var flatten_default = flatten;

  // ../../node_modules/lodash-es/_getPrototype.js
  var getPrototype = overArg_default(Object.getPrototypeOf, Object);
  var getPrototype_default = getPrototype;

  // ../../node_modules/lodash-es/_baseSlice.js
  function baseSlice(array, start, end) {
    var index = -1, length = array.length;
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }
  var baseSlice_default = baseSlice;

  // ../../node_modules/lodash-es/_arrayReduce.js
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }
  var arrayReduce_default = arrayReduce;

  // ../../node_modules/lodash-es/_stackClear.js
  function stackClear() {
    this.__data__ = new ListCache_default();
    this.size = 0;
  }
  var stackClear_default = stackClear;

  // ../../node_modules/lodash-es/_stackDelete.js
  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }
  var stackDelete_default = stackDelete;

  // ../../node_modules/lodash-es/_stackGet.js
  function stackGet(key) {
    return this.__data__.get(key);
  }
  var stackGet_default = stackGet;

  // ../../node_modules/lodash-es/_stackHas.js
  function stackHas(key) {
    return this.__data__.has(key);
  }
  var stackHas_default = stackHas;

  // ../../node_modules/lodash-es/_stackSet.js
  var LARGE_ARRAY_SIZE = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache_default) {
      var pairs2 = data.__data__;
      if (!Map_default || pairs2.length < LARGE_ARRAY_SIZE - 1) {
        pairs2.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache_default(pairs2);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }
  var stackSet_default = stackSet;

  // ../../node_modules/lodash-es/_Stack.js
  function Stack(entries) {
    var data = this.__data__ = new ListCache_default(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear_default;
  Stack.prototype["delete"] = stackDelete_default;
  Stack.prototype.get = stackGet_default;
  Stack.prototype.has = stackHas_default;
  Stack.prototype.set = stackSet_default;
  var Stack_default = Stack;

  // ../../node_modules/lodash-es/_baseAssign.js
  function baseAssign(object, source) {
    return object && copyObject_default(source, keys_default(source), object);
  }
  var baseAssign_default = baseAssign;

  // ../../node_modules/lodash-es/_baseAssignIn.js
  function baseAssignIn(object, source) {
    return object && copyObject_default(source, keysIn_default(source), object);
  }
  var baseAssignIn_default = baseAssignIn;

  // ../../node_modules/lodash-es/_cloneBuffer.js
  var freeExports3 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule3 = freeExports3 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports3 = freeModule3 && freeModule3.exports === freeExports3;
  var Buffer3 = moduleExports3 ? root_default.Buffer : void 0;
  var allocUnsafe = Buffer3 ? Buffer3.allocUnsafe : void 0;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }
  var cloneBuffer_default = cloneBuffer;

  // ../../node_modules/lodash-es/_arrayFilter.js
  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  var arrayFilter_default = arrayFilter;

  // ../../node_modules/lodash-es/stubArray.js
  function stubArray() {
    return [];
  }
  var stubArray_default = stubArray;

  // ../../node_modules/lodash-es/_getSymbols.js
  var objectProto13 = Object.prototype;
  var propertyIsEnumerable2 = objectProto13.propertyIsEnumerable;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable2.call(object, symbol);
    });
  };
  var getSymbols_default = getSymbols;

  // ../../node_modules/lodash-es/_copySymbols.js
  function copySymbols(source, object) {
    return copyObject_default(source, getSymbols_default(source), object);
  }
  var copySymbols_default = copySymbols;

  // ../../node_modules/lodash-es/_getSymbolsIn.js
  var nativeGetSymbols2 = Object.getOwnPropertySymbols;
  var getSymbolsIn = !nativeGetSymbols2 ? stubArray_default : function(object) {
    var result = [];
    while (object) {
      arrayPush_default(result, getSymbols_default(object));
      object = getPrototype_default(object);
    }
    return result;
  };
  var getSymbolsIn_default = getSymbolsIn;

  // ../../node_modules/lodash-es/_copySymbolsIn.js
  function copySymbolsIn(source, object) {
    return copyObject_default(source, getSymbolsIn_default(source), object);
  }
  var copySymbolsIn_default = copySymbolsIn;

  // ../../node_modules/lodash-es/_baseGetAllKeys.js
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
  }
  var baseGetAllKeys_default = baseGetAllKeys;

  // ../../node_modules/lodash-es/_getAllKeys.js
  function getAllKeys(object) {
    return baseGetAllKeys_default(object, keys_default, getSymbols_default);
  }
  var getAllKeys_default = getAllKeys;

  // ../../node_modules/lodash-es/_getAllKeysIn.js
  function getAllKeysIn(object) {
    return baseGetAllKeys_default(object, keysIn_default, getSymbolsIn_default);
  }
  var getAllKeysIn_default = getAllKeysIn;

  // ../../node_modules/lodash-es/_DataView.js
  var DataView = getNative_default(root_default, "DataView");
  var DataView_default = DataView;

  // ../../node_modules/lodash-es/_Promise.js
  var Promise2 = getNative_default(root_default, "Promise");
  var Promise_default = Promise2;

  // ../../node_modules/lodash-es/_Set.js
  var Set2 = getNative_default(root_default, "Set");
  var Set_default = Set2;

  // ../../node_modules/lodash-es/_getTag.js
  var mapTag2 = "[object Map]";
  var objectTag2 = "[object Object]";
  var promiseTag = "[object Promise]";
  var setTag2 = "[object Set]";
  var weakMapTag2 = "[object WeakMap]";
  var dataViewTag2 = "[object DataView]";
  var dataViewCtorString = toSource_default(DataView_default);
  var mapCtorString = toSource_default(Map_default);
  var promiseCtorString = toSource_default(Promise_default);
  var setCtorString = toSource_default(Set_default);
  var weakMapCtorString = toSource_default(WeakMap_default);
  var getTag = baseGetTag_default;
  if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
    getTag = function(value) {
      var result = baseGetTag_default(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag2;
          case mapCtorString:
            return mapTag2;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag2;
          case weakMapCtorString:
            return weakMapTag2;
        }
      }
      return result;
    };
  }
  var getTag_default = getTag;

  // ../../node_modules/lodash-es/_initCloneArray.js
  var objectProto14 = Object.prototype;
  var hasOwnProperty11 = objectProto14.hasOwnProperty;
  function initCloneArray(array) {
    var length = array.length, result = new array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty11.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }
  var initCloneArray_default = initCloneArray;

  // ../../node_modules/lodash-es/_Uint8Array.js
  var Uint8Array2 = root_default.Uint8Array;
  var Uint8Array_default = Uint8Array2;

  // ../../node_modules/lodash-es/_cloneArrayBuffer.js
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array_default(result).set(new Uint8Array_default(arrayBuffer));
    return result;
  }
  var cloneArrayBuffer_default = cloneArrayBuffer;

  // ../../node_modules/lodash-es/_cloneDataView.js
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer_default(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  var cloneDataView_default = cloneDataView;

  // ../../node_modules/lodash-es/_cloneRegExp.js
  var reFlags = /\w*$/;
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  var cloneRegExp_default = cloneRegExp;

  // ../../node_modules/lodash-es/_cloneSymbol.js
  var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
  var symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }
  var cloneSymbol_default = cloneSymbol;

  // ../../node_modules/lodash-es/_cloneTypedArray.js
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }
  var cloneTypedArray_default = cloneTypedArray;

  // ../../node_modules/lodash-es/_initCloneByTag.js
  var boolTag2 = "[object Boolean]";
  var dateTag2 = "[object Date]";
  var mapTag3 = "[object Map]";
  var numberTag2 = "[object Number]";
  var regexpTag2 = "[object RegExp]";
  var setTag3 = "[object Set]";
  var stringTag2 = "[object String]";
  var symbolTag2 = "[object Symbol]";
  var arrayBufferTag2 = "[object ArrayBuffer]";
  var dataViewTag3 = "[object DataView]";
  var float32Tag2 = "[object Float32Array]";
  var float64Tag2 = "[object Float64Array]";
  var int8Tag2 = "[object Int8Array]";
  var int16Tag2 = "[object Int16Array]";
  var int32Tag2 = "[object Int32Array]";
  var uint8Tag2 = "[object Uint8Array]";
  var uint8ClampedTag2 = "[object Uint8ClampedArray]";
  var uint16Tag2 = "[object Uint16Array]";
  var uint32Tag2 = "[object Uint32Array]";
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag2:
        return cloneArrayBuffer_default(object);
      case boolTag2:
      case dateTag2:
        return new Ctor(+object);
      case dataViewTag3:
        return cloneDataView_default(object, isDeep);
      case float32Tag2:
      case float64Tag2:
      case int8Tag2:
      case int16Tag2:
      case int32Tag2:
      case uint8Tag2:
      case uint8ClampedTag2:
      case uint16Tag2:
      case uint32Tag2:
        return cloneTypedArray_default(object, isDeep);
      case mapTag3:
        return new Ctor();
      case numberTag2:
      case stringTag2:
        return new Ctor(object);
      case regexpTag2:
        return cloneRegExp_default(object);
      case setTag3:
        return new Ctor();
      case symbolTag2:
        return cloneSymbol_default(object);
    }
  }
  var initCloneByTag_default = initCloneByTag;

  // ../../node_modules/lodash-es/_initCloneObject.js
  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype_default(object) ? baseCreate_default(getPrototype_default(object)) : {};
  }
  var initCloneObject_default = initCloneObject;

  // ../../node_modules/lodash-es/_baseIsMap.js
  var mapTag4 = "[object Map]";
  function baseIsMap(value) {
    return isObjectLike_default(value) && getTag_default(value) == mapTag4;
  }
  var baseIsMap_default = baseIsMap;

  // ../../node_modules/lodash-es/isMap.js
  var nodeIsMap = nodeUtil_default && nodeUtil_default.isMap;
  var isMap = nodeIsMap ? baseUnary_default(nodeIsMap) : baseIsMap_default;
  var isMap_default = isMap;

  // ../../node_modules/lodash-es/_baseIsSet.js
  var setTag4 = "[object Set]";
  function baseIsSet(value) {
    return isObjectLike_default(value) && getTag_default(value) == setTag4;
  }
  var baseIsSet_default = baseIsSet;

  // ../../node_modules/lodash-es/isSet.js
  var nodeIsSet = nodeUtil_default && nodeUtil_default.isSet;
  var isSet = nodeIsSet ? baseUnary_default(nodeIsSet) : baseIsSet_default;
  var isSet_default = isSet;

  // ../../node_modules/lodash-es/_baseClone.js
  var CLONE_DEEP_FLAG = 1;
  var CLONE_FLAT_FLAG = 2;
  var CLONE_SYMBOLS_FLAG = 4;
  var argsTag3 = "[object Arguments]";
  var arrayTag2 = "[object Array]";
  var boolTag3 = "[object Boolean]";
  var dateTag3 = "[object Date]";
  var errorTag2 = "[object Error]";
  var funcTag3 = "[object Function]";
  var genTag2 = "[object GeneratorFunction]";
  var mapTag5 = "[object Map]";
  var numberTag3 = "[object Number]";
  var objectTag3 = "[object Object]";
  var regexpTag3 = "[object RegExp]";
  var setTag5 = "[object Set]";
  var stringTag3 = "[object String]";
  var symbolTag3 = "[object Symbol]";
  var weakMapTag3 = "[object WeakMap]";
  var arrayBufferTag3 = "[object ArrayBuffer]";
  var dataViewTag4 = "[object DataView]";
  var float32Tag3 = "[object Float32Array]";
  var float64Tag3 = "[object Float64Array]";
  var int8Tag3 = "[object Int8Array]";
  var int16Tag3 = "[object Int16Array]";
  var int32Tag3 = "[object Int32Array]";
  var uint8Tag3 = "[object Uint8Array]";
  var uint8ClampedTag3 = "[object Uint8ClampedArray]";
  var uint16Tag3 = "[object Uint16Array]";
  var uint32Tag3 = "[object Uint32Array]";
  var cloneableTags = {};
  cloneableTags[argsTag3] = cloneableTags[arrayTag2] = cloneableTags[arrayBufferTag3] = cloneableTags[dataViewTag4] = cloneableTags[boolTag3] = cloneableTags[dateTag3] = cloneableTags[float32Tag3] = cloneableTags[float64Tag3] = cloneableTags[int8Tag3] = cloneableTags[int16Tag3] = cloneableTags[int32Tag3] = cloneableTags[mapTag5] = cloneableTags[numberTag3] = cloneableTags[objectTag3] = cloneableTags[regexpTag3] = cloneableTags[setTag5] = cloneableTags[stringTag3] = cloneableTags[symbolTag3] = cloneableTags[uint8Tag3] = cloneableTags[uint8ClampedTag3] = cloneableTags[uint16Tag3] = cloneableTags[uint32Tag3] = true;
  cloneableTags[errorTag2] = cloneableTags[funcTag3] = cloneableTags[weakMapTag3] = false;
  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== void 0) {
      return result;
    }
    if (!isObject_default(value)) {
      return value;
    }
    var isArr = isArray_default(value);
    if (isArr) {
      result = initCloneArray_default(value);
      if (!isDeep) {
        return copyArray_default(value, result);
      }
    } else {
      var tag = getTag_default(value), isFunc = tag == funcTag3 || tag == genTag2;
      if (isBuffer_default(value)) {
        return cloneBuffer_default(value, isDeep);
      }
      if (tag == objectTag3 || tag == argsTag3 || isFunc && !object) {
        result = isFlat || isFunc ? {} : initCloneObject_default(value);
        if (!isDeep) {
          return isFlat ? copySymbolsIn_default(value, baseAssignIn_default(result, value)) : copySymbols_default(value, baseAssign_default(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag_default(value, tag, isDeep);
      }
    }
    stack || (stack = new Stack_default());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (isSet_default(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap_default(value)) {
      value.forEach(function(subValue, key2) {
        result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
    }
    var keysFunc = isFull ? isFlat ? getAllKeysIn_default : getAllKeys_default : isFlat ? keysIn_default : keys_default;
    var props = isArr ? void 0 : keysFunc(value);
    arrayEach_default(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
    return result;
  }
  var baseClone_default = baseClone;

  // ../../node_modules/lodash-es/clone.js
  var CLONE_SYMBOLS_FLAG2 = 4;
  function clone(value) {
    return baseClone_default(value, CLONE_SYMBOLS_FLAG2);
  }
  var clone_default = clone;

  // ../../node_modules/lodash-es/compact.js
  function compact(array) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  }
  var compact_default = compact;

  // ../../node_modules/lodash-es/_setCacheAdd.js
  var HASH_UNDEFINED3 = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED3);
    return this;
  }
  var setCacheAdd_default = setCacheAdd;

  // ../../node_modules/lodash-es/_setCacheHas.js
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  var setCacheHas_default = setCacheHas;

  // ../../node_modules/lodash-es/_SetCache.js
  function SetCache(values2) {
    var index = -1, length = values2 == null ? 0 : values2.length;
    this.__data__ = new MapCache_default();
    while (++index < length) {
      this.add(values2[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
  SetCache.prototype.has = setCacheHas_default;
  var SetCache_default = SetCache;

  // ../../node_modules/lodash-es/_arraySome.js
  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  var arraySome_default = arraySome;

  // ../../node_modules/lodash-es/_cacheHas.js
  function cacheHas(cache, key) {
    return cache.has(key);
  }
  var cacheHas_default = cacheHas;

  // ../../node_modules/lodash-es/_equalArrays.js
  var COMPARE_PARTIAL_FLAG = 1;
  var COMPARE_UNORDERED_FLAG = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome_default(other, function(othValue2, othIndex) {
          if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  var equalArrays_default = equalArrays;

  // ../../node_modules/lodash-es/_mapToArray.js
  function mapToArray(map3) {
    var index = -1, result = Array(map3.size);
    map3.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  var mapToArray_default = mapToArray;

  // ../../node_modules/lodash-es/_setToArray.js
  function setToArray(set2) {
    var index = -1, result = Array(set2.size);
    set2.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var setToArray_default = setToArray;

  // ../../node_modules/lodash-es/_equalByTag.js
  var COMPARE_PARTIAL_FLAG2 = 1;
  var COMPARE_UNORDERED_FLAG2 = 2;
  var boolTag4 = "[object Boolean]";
  var dateTag4 = "[object Date]";
  var errorTag3 = "[object Error]";
  var mapTag6 = "[object Map]";
  var numberTag4 = "[object Number]";
  var regexpTag4 = "[object RegExp]";
  var setTag6 = "[object Set]";
  var stringTag4 = "[object String]";
  var symbolTag4 = "[object Symbol]";
  var arrayBufferTag4 = "[object ArrayBuffer]";
  var dataViewTag5 = "[object DataView]";
  var symbolProto3 = Symbol_default ? Symbol_default.prototype : void 0;
  var symbolValueOf2 = symbolProto3 ? symbolProto3.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag5:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag4:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
          return false;
        }
        return true;
      case boolTag4:
      case dateTag4:
      case numberTag4:
        return eq_default(+object, +other);
      case errorTag3:
        return object.name == other.name && object.message == other.message;
      case regexpTag4:
      case stringTag4:
        return object == other + "";
      case mapTag6:
        var convert = mapToArray_default;
      case setTag6:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
        convert || (convert = setToArray_default);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG2;
        stack.set(object, other);
        var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag4:
        if (symbolValueOf2) {
          return symbolValueOf2.call(object) == symbolValueOf2.call(other);
        }
    }
    return false;
  }
  var equalByTag_default = equalByTag;

  // ../../node_modules/lodash-es/_equalObjects.js
  var COMPARE_PARTIAL_FLAG3 = 1;
  var objectProto15 = Object.prototype;
  var hasOwnProperty12 = objectProto15.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty12.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  var equalObjects_default = equalObjects;

  // ../../node_modules/lodash-es/_baseIsEqualDeep.js
  var COMPARE_PARTIAL_FLAG4 = 1;
  var argsTag4 = "[object Arguments]";
  var arrayTag3 = "[object Array]";
  var objectTag4 = "[object Object]";
  var objectProto16 = Object.prototype;
  var hasOwnProperty13 = objectProto16.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag3 : getTag_default(object), othTag = othIsArr ? arrayTag3 : getTag_default(other);
    objTag = objTag == argsTag4 ? objectTag4 : objTag;
    othTag = othTag == argsTag4 ? objectTag4 : othTag;
    var objIsObj = objTag == objectTag4, othIsObj = othTag == objectTag4, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer_default(object)) {
      if (!isBuffer_default(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack_default());
      return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
      var objIsWrapped = objIsObj && hasOwnProperty13.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty13.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack_default());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack_default());
    return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
  }
  var baseIsEqualDeep_default = baseIsEqualDeep;

  // ../../node_modules/lodash-es/_baseIsEqual.js
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
  }
  var baseIsEqual_default = baseIsEqual;

  // ../../node_modules/lodash-es/_baseIsMatch.js
  var COMPARE_PARTIAL_FLAG5 = 1;
  var COMPARE_UNORDERED_FLAG3 = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack_default();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG5 | COMPARE_UNORDERED_FLAG3, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  var baseIsMatch_default = baseIsMatch;

  // ../../node_modules/lodash-es/_isStrictComparable.js
  function isStrictComparable(value) {
    return value === value && !isObject_default(value);
  }
  var isStrictComparable_default = isStrictComparable;

  // ../../node_modules/lodash-es/_getMatchData.js
  function getMatchData(object) {
    var result = keys_default(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable_default(value)];
    }
    return result;
  }
  var getMatchData_default = getMatchData;

  // ../../node_modules/lodash-es/_matchesStrictComparable.js
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  var matchesStrictComparable_default = matchesStrictComparable;

  // ../../node_modules/lodash-es/_baseMatches.js
  function baseMatches(source) {
    var matchData = getMatchData_default(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch_default(object, source, matchData);
    };
  }
  var baseMatches_default = baseMatches;

  // ../../node_modules/lodash-es/_baseHasIn.js
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  var baseHasIn_default = baseHasIn;

  // ../../node_modules/lodash-es/_hasPath.js
  function hasPath(object, path, hasFunc) {
    path = castPath_default(path, object);
    var index = -1, length = path.length, result = false;
    while (++index < length) {
      var key = toKey_default(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength_default(length) && isIndex_default(key, length) && (isArray_default(object) || isArguments_default(object));
  }
  var hasPath_default = hasPath;

  // ../../node_modules/lodash-es/hasIn.js
  function hasIn(object, path) {
    return object != null && hasPath_default(object, path, baseHasIn_default);
  }
  var hasIn_default = hasIn;

  // ../../node_modules/lodash-es/_baseMatchesProperty.js
  var COMPARE_PARTIAL_FLAG6 = 1;
  var COMPARE_UNORDERED_FLAG4 = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey_default(path) && isStrictComparable_default(srcValue)) {
      return matchesStrictComparable_default(toKey_default(path), srcValue);
    }
    return function(object) {
      var objValue = get_default(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn_default(object, path) : baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG6 | COMPARE_UNORDERED_FLAG4);
    };
  }
  var baseMatchesProperty_default = baseMatchesProperty;

  // ../../node_modules/lodash-es/_baseProperty.js
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  var baseProperty_default = baseProperty;

  // ../../node_modules/lodash-es/_basePropertyDeep.js
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet_default(object, path);
    };
  }
  var basePropertyDeep_default = basePropertyDeep;

  // ../../node_modules/lodash-es/property.js
  function property(path) {
    return isKey_default(path) ? baseProperty_default(toKey_default(path)) : basePropertyDeep_default(path);
  }
  var property_default = property;

  // ../../node_modules/lodash-es/_baseIteratee.js
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity_default;
    }
    if (typeof value == "object") {
      return isArray_default(value) ? baseMatchesProperty_default(value[0], value[1]) : baseMatches_default(value);
    }
    return property_default(value);
  }
  var baseIteratee_default = baseIteratee;

  // ../../node_modules/lodash-es/_arrayAggregator.js
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }
  var arrayAggregator_default = arrayAggregator;

  // ../../node_modules/lodash-es/_createBaseFor.js
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  var createBaseFor_default = createBaseFor;

  // ../../node_modules/lodash-es/_baseFor.js
  var baseFor = createBaseFor_default();
  var baseFor_default = baseFor;

  // ../../node_modules/lodash-es/_baseForOwn.js
  function baseForOwn(object, iteratee) {
    return object && baseFor_default(object, iteratee, keys_default);
  }
  var baseForOwn_default = baseForOwn;

  // ../../node_modules/lodash-es/_createBaseEach.js
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike_default(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  var createBaseEach_default = createBaseEach;

  // ../../node_modules/lodash-es/_baseEach.js
  var baseEach = createBaseEach_default(baseForOwn_default);
  var baseEach_default = baseEach;

  // ../../node_modules/lodash-es/_baseAggregator.js
  function baseAggregator(collection, setter, iteratee, accumulator) {
    baseEach_default(collection, function(value, key, collection2) {
      setter(accumulator, value, iteratee(value), collection2);
    });
    return accumulator;
  }
  var baseAggregator_default = baseAggregator;

  // ../../node_modules/lodash-es/_createAggregator.js
  function createAggregator(setter, initializer) {
    return function(collection, iteratee) {
      var func = isArray_default(collection) ? arrayAggregator_default : baseAggregator_default, accumulator = initializer ? initializer() : {};
      return func(collection, setter, baseIteratee_default(iteratee, 2), accumulator);
    };
  }
  var createAggregator_default = createAggregator;

  // ../../node_modules/lodash-es/defaults.js
  var objectProto17 = Object.prototype;
  var hasOwnProperty14 = objectProto17.hasOwnProperty;
  var defaults = baseRest_default(function(object, sources) {
    object = Object(object);
    var index = -1;
    var length = sources.length;
    var guard = length > 2 ? sources[2] : void 0;
    if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      var props = keysIn_default(source);
      var propsIndex = -1;
      var propsLength = props.length;
      while (++propsIndex < propsLength) {
        var key = props[propsIndex];
        var value = object[key];
        if (value === void 0 || eq_default(value, objectProto17[key]) && !hasOwnProperty14.call(object, key)) {
          object[key] = source[key];
        }
      }
    }
    return object;
  });
  var defaults_default = defaults;

  // ../../node_modules/lodash-es/isArrayLikeObject.js
  function isArrayLikeObject(value) {
    return isObjectLike_default(value) && isArrayLike_default(value);
  }
  var isArrayLikeObject_default = isArrayLikeObject;

  // ../../node_modules/lodash-es/_arrayIncludesWith.js
  function arrayIncludesWith(array, value, comparator) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }
  var arrayIncludesWith_default = arrayIncludesWith;

  // ../../node_modules/lodash-es/_baseDifference.js
  var LARGE_ARRAY_SIZE2 = 200;
  function baseDifference(array, values2, iteratee, comparator) {
    var index = -1, includes2 = arrayIncludes_default, isCommon = true, length = array.length, result = [], valuesLength = values2.length;
    if (!length) {
      return result;
    }
    if (iteratee) {
      values2 = arrayMap_default(values2, baseUnary_default(iteratee));
    }
    if (comparator) {
      includes2 = arrayIncludesWith_default;
      isCommon = false;
    } else if (values2.length >= LARGE_ARRAY_SIZE2) {
      includes2 = cacheHas_default;
      isCommon = false;
      values2 = new SetCache_default(values2);
    }
    outer:
      while (++index < length) {
        var value = array[index], computed = iteratee == null ? value : iteratee(value);
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values2[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        } else if (!includes2(values2, computed, comparator)) {
          result.push(value);
        }
      }
    return result;
  }
  var baseDifference_default = baseDifference;

  // ../../node_modules/lodash-es/difference.js
  var difference = baseRest_default(function(array, values2) {
    return isArrayLikeObject_default(array) ? baseDifference_default(array, baseFlatten_default(values2, 1, isArrayLikeObject_default, true)) : [];
  });
  var difference_default = difference;

  // ../../node_modules/lodash-es/last.js
  function last(array) {
    var length = array == null ? 0 : array.length;
    return length ? array[length - 1] : void 0;
  }
  var last_default = last;

  // ../../node_modules/lodash-es/drop.js
  function drop(array, n, guard) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger_default(n);
    return baseSlice_default(array, n < 0 ? 0 : n, length);
  }
  var drop_default = drop;

  // ../../node_modules/lodash-es/dropRight.js
  function dropRight(array, n, guard) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger_default(n);
    n = length - n;
    return baseSlice_default(array, 0, n < 0 ? 0 : n);
  }
  var dropRight_default = dropRight;

  // ../../node_modules/lodash-es/_castFunction.js
  function castFunction(value) {
    return typeof value == "function" ? value : identity_default;
  }
  var castFunction_default = castFunction;

  // ../../node_modules/lodash-es/forEach.js
  function forEach(collection, iteratee) {
    var func = isArray_default(collection) ? arrayEach_default : baseEach_default;
    return func(collection, castFunction_default(iteratee));
  }
  var forEach_default = forEach;

  // ../../node_modules/lodash-es/_arrayEvery.js
  function arrayEvery(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }
  var arrayEvery_default = arrayEvery;

  // ../../node_modules/lodash-es/_baseEvery.js
  function baseEvery(collection, predicate) {
    var result = true;
    baseEach_default(collection, function(value, index, collection2) {
      result = !!predicate(value, index, collection2);
      return result;
    });
    return result;
  }
  var baseEvery_default = baseEvery;

  // ../../node_modules/lodash-es/every.js
  function every(collection, predicate, guard) {
    var func = isArray_default(collection) ? arrayEvery_default : baseEvery_default;
    if (guard && isIterateeCall_default(collection, predicate, guard)) {
      predicate = void 0;
    }
    return func(collection, baseIteratee_default(predicate, 3));
  }
  var every_default = every;

  // ../../node_modules/lodash-es/_baseFilter.js
  function baseFilter(collection, predicate) {
    var result = [];
    baseEach_default(collection, function(value, index, collection2) {
      if (predicate(value, index, collection2)) {
        result.push(value);
      }
    });
    return result;
  }
  var baseFilter_default = baseFilter;

  // ../../node_modules/lodash-es/filter.js
  function filter(collection, predicate) {
    var func = isArray_default(collection) ? arrayFilter_default : baseFilter_default;
    return func(collection, baseIteratee_default(predicate, 3));
  }
  var filter_default = filter;

  // ../../node_modules/lodash-es/_createFind.js
  function createFind(findIndexFunc) {
    return function(collection, predicate, fromIndex) {
      var iterable = Object(collection);
      if (!isArrayLike_default(collection)) {
        var iteratee = baseIteratee_default(predicate, 3);
        collection = keys_default(collection);
        predicate = function(key) {
          return iteratee(iterable[key], key, iterable);
        };
      }
      var index = findIndexFunc(collection, predicate, fromIndex);
      return index > -1 ? iterable[iteratee ? collection[index] : index] : void 0;
    };
  }
  var createFind_default = createFind;

  // ../../node_modules/lodash-es/findIndex.js
  var nativeMax2 = Math.max;
  function findIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger_default(fromIndex);
    if (index < 0) {
      index = nativeMax2(length + index, 0);
    }
    return baseFindIndex_default(array, baseIteratee_default(predicate, 3), index);
  }
  var findIndex_default = findIndex;

  // ../../node_modules/lodash-es/find.js
  var find = createFind_default(findIndex_default);
  var find_default = find;

  // ../../node_modules/lodash-es/head.js
  function head(array) {
    return array && array.length ? array[0] : void 0;
  }
  var head_default = head;

  // ../../node_modules/lodash-es/_baseMap.js
  function baseMap(collection, iteratee) {
    var index = -1, result = isArrayLike_default(collection) ? Array(collection.length) : [];
    baseEach_default(collection, function(value, key, collection2) {
      result[++index] = iteratee(value, key, collection2);
    });
    return result;
  }
  var baseMap_default = baseMap;

  // ../../node_modules/lodash-es/map.js
  function map(collection, iteratee) {
    var func = isArray_default(collection) ? arrayMap_default : baseMap_default;
    return func(collection, baseIteratee_default(iteratee, 3));
  }
  var map_default = map;

  // ../../node_modules/lodash-es/flatMap.js
  function flatMap(collection, iteratee) {
    return baseFlatten_default(map_default(collection, iteratee), 1);
  }
  var flatMap_default = flatMap;

  // ../../node_modules/lodash-es/groupBy.js
  var objectProto18 = Object.prototype;
  var hasOwnProperty15 = objectProto18.hasOwnProperty;
  var groupBy = createAggregator_default(function(result, value, key) {
    if (hasOwnProperty15.call(result, key)) {
      result[key].push(value);
    } else {
      baseAssignValue_default(result, key, [value]);
    }
  });
  var groupBy_default = groupBy;

  // ../../node_modules/lodash-es/_baseHas.js
  var objectProto19 = Object.prototype;
  var hasOwnProperty16 = objectProto19.hasOwnProperty;
  function baseHas(object, key) {
    return object != null && hasOwnProperty16.call(object, key);
  }
  var baseHas_default = baseHas;

  // ../../node_modules/lodash-es/has.js
  function has(object, path) {
    return object != null && hasPath_default(object, path, baseHas_default);
  }
  var has_default = has;

  // ../../node_modules/lodash-es/isString.js
  var stringTag5 = "[object String]";
  function isString(value) {
    return typeof value == "string" || !isArray_default(value) && isObjectLike_default(value) && baseGetTag_default(value) == stringTag5;
  }
  var isString_default = isString;

  // ../../node_modules/lodash-es/_baseValues.js
  function baseValues(object, props) {
    return arrayMap_default(props, function(key) {
      return object[key];
    });
  }
  var baseValues_default = baseValues;

  // ../../node_modules/lodash-es/values.js
  function values(object) {
    return object == null ? [] : baseValues_default(object, keys_default(object));
  }
  var values_default = values;

  // ../../node_modules/lodash-es/includes.js
  var nativeMax3 = Math.max;
  function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike_default(collection) ? collection : values_default(collection);
    fromIndex = fromIndex && !guard ? toInteger_default(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0) {
      fromIndex = nativeMax3(length + fromIndex, 0);
    }
    return isString_default(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf_default(collection, value, fromIndex) > -1;
  }
  var includes_default = includes;

  // ../../node_modules/lodash-es/indexOf.js
  var nativeMax4 = Math.max;
  function indexOf(array, value, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger_default(fromIndex);
    if (index < 0) {
      index = nativeMax4(length + index, 0);
    }
    return baseIndexOf_default(array, value, index);
  }
  var indexOf_default = indexOf;

  // ../../node_modules/lodash-es/isEmpty.js
  var mapTag7 = "[object Map]";
  var setTag7 = "[object Set]";
  var objectProto20 = Object.prototype;
  var hasOwnProperty17 = objectProto20.hasOwnProperty;
  function isEmpty(value) {
    if (value == null) {
      return true;
    }
    if (isArrayLike_default(value) && (isArray_default(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer_default(value) || isTypedArray_default(value) || isArguments_default(value))) {
      return !value.length;
    }
    var tag = getTag_default(value);
    if (tag == mapTag7 || tag == setTag7) {
      return !value.size;
    }
    if (isPrototype_default(value)) {
      return !baseKeys_default(value).length;
    }
    for (var key in value) {
      if (hasOwnProperty17.call(value, key)) {
        return false;
      }
    }
    return true;
  }
  var isEmpty_default = isEmpty;

  // ../../node_modules/lodash-es/_baseIsRegExp.js
  var regexpTag5 = "[object RegExp]";
  function baseIsRegExp(value) {
    return isObjectLike_default(value) && baseGetTag_default(value) == regexpTag5;
  }
  var baseIsRegExp_default = baseIsRegExp;

  // ../../node_modules/lodash-es/isRegExp.js
  var nodeIsRegExp = nodeUtil_default && nodeUtil_default.isRegExp;
  var isRegExp = nodeIsRegExp ? baseUnary_default(nodeIsRegExp) : baseIsRegExp_default;
  var isRegExp_default = isRegExp;

  // ../../node_modules/lodash-es/isUndefined.js
  function isUndefined(value) {
    return value === void 0;
  }
  var isUndefined_default = isUndefined;

  // ../../node_modules/lodash-es/negate.js
  var FUNC_ERROR_TEXT2 = "Expected a function";
  function negate(predicate) {
    if (typeof predicate != "function") {
      throw new TypeError(FUNC_ERROR_TEXT2);
    }
    return function() {
      var args = arguments;
      switch (args.length) {
        case 0:
          return !predicate.call(this);
        case 1:
          return !predicate.call(this, args[0]);
        case 2:
          return !predicate.call(this, args[0], args[1]);
        case 3:
          return !predicate.call(this, args[0], args[1], args[2]);
      }
      return !predicate.apply(this, args);
    };
  }
  var negate_default = negate;

  // ../../node_modules/lodash-es/_baseSet.js
  function baseSet(object, path, value, customizer) {
    if (!isObject_default(object)) {
      return object;
    }
    path = castPath_default(path, object);
    var index = -1, length = path.length, lastIndex = length - 1, nested = object;
    while (nested != null && ++index < length) {
      var key = toKey_default(path[index]), newValue = value;
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return object;
      }
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : void 0;
        if (newValue === void 0) {
          newValue = isObject_default(objValue) ? objValue : isIndex_default(path[index + 1]) ? [] : {};
        }
      }
      assignValue_default(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }
  var baseSet_default = baseSet;

  // ../../node_modules/lodash-es/_basePickBy.js
  function basePickBy(object, paths, predicate) {
    var index = -1, length = paths.length, result = {};
    while (++index < length) {
      var path = paths[index], value = baseGet_default(object, path);
      if (predicate(value, path)) {
        baseSet_default(result, castPath_default(path, object), value);
      }
    }
    return result;
  }
  var basePickBy_default = basePickBy;

  // ../../node_modules/lodash-es/pickBy.js
  function pickBy(object, predicate) {
    if (object == null) {
      return {};
    }
    var props = arrayMap_default(getAllKeysIn_default(object), function(prop) {
      return [prop];
    });
    predicate = baseIteratee_default(predicate);
    return basePickBy_default(object, props, function(value, path) {
      return predicate(value, path[0]);
    });
  }
  var pickBy_default = pickBy;

  // ../../node_modules/lodash-es/_baseReduce.js
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection2) {
      accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
    });
    return accumulator;
  }
  var baseReduce_default = baseReduce;

  // ../../node_modules/lodash-es/reduce.js
  function reduce(collection, iteratee, accumulator) {
    var func = isArray_default(collection) ? arrayReduce_default : baseReduce_default, initAccum = arguments.length < 3;
    return func(collection, baseIteratee_default(iteratee, 4), accumulator, initAccum, baseEach_default);
  }
  var reduce_default = reduce;

  // ../../node_modules/lodash-es/reject.js
  function reject(collection, predicate) {
    var func = isArray_default(collection) ? arrayFilter_default : baseFilter_default;
    return func(collection, negate_default(baseIteratee_default(predicate, 3)));
  }
  var reject_default = reject;

  // ../../node_modules/lodash-es/_baseSome.js
  function baseSome(collection, predicate) {
    var result;
    baseEach_default(collection, function(value, index, collection2) {
      result = predicate(value, index, collection2);
      return !result;
    });
    return !!result;
  }
  var baseSome_default = baseSome;

  // ../../node_modules/lodash-es/some.js
  function some(collection, predicate, guard) {
    var func = isArray_default(collection) ? arraySome_default : baseSome_default;
    if (guard && isIterateeCall_default(collection, predicate, guard)) {
      predicate = void 0;
    }
    return func(collection, baseIteratee_default(predicate, 3));
  }
  var some_default = some;

  // ../../node_modules/lodash-es/_createSet.js
  var INFINITY4 = 1 / 0;
  var createSet = !(Set_default && 1 / setToArray_default(new Set_default([, -0]))[1] == INFINITY4) ? noop_default : function(values2) {
    return new Set_default(values2);
  };
  var createSet_default = createSet;

  // ../../node_modules/lodash-es/_baseUniq.js
  var LARGE_ARRAY_SIZE3 = 200;
  function baseUniq(array, iteratee, comparator) {
    var index = -1, includes2 = arrayIncludes_default, length = array.length, isCommon = true, result = [], seen = result;
    if (comparator) {
      isCommon = false;
      includes2 = arrayIncludesWith_default;
    } else if (length >= LARGE_ARRAY_SIZE3) {
      var set2 = iteratee ? null : createSet_default(array);
      if (set2) {
        return setToArray_default(set2);
      }
      isCommon = false;
      includes2 = cacheHas_default;
      seen = new SetCache_default();
    } else {
      seen = iteratee ? [] : result;
    }
    outer:
      while (++index < length) {
        var value = array[index], computed = iteratee ? iteratee(value) : value;
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        } else if (!includes2(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
    return result;
  }
  var baseUniq_default = baseUniq;

  // ../../node_modules/lodash-es/uniq.js
  function uniq(array) {
    return array && array.length ? baseUniq_default(array) : [];
  }
  var uniq_default = uniq;

  // ../../node_modules/@chevrotain/utils/lib/src/print.js
  function PRINT_ERROR(msg) {
    if (console && console.error) {
      console.error(`Error: ${msg}`);
    }
  }
  function PRINT_WARNING(msg) {
    if (console && console.warn) {
      console.warn(`Warning: ${msg}`);
    }
  }

  // ../../node_modules/@chevrotain/utils/lib/src/timer.js
  function timer(func) {
    const start = (/* @__PURE__ */ new Date()).getTime();
    const val = func();
    const end = (/* @__PURE__ */ new Date()).getTime();
    const total = end - start;
    return { time: total, value: val };
  }

  // ../../node_modules/@chevrotain/utils/lib/src/to-fast-properties.js
  function toFastProperties(toBecomeFast) {
    function FakeConstructor() {
    }
    FakeConstructor.prototype = toBecomeFast;
    const fakeInstance = new FakeConstructor();
    function fakeAccess() {
      return typeof fakeInstance.bar;
    }
    fakeAccess();
    fakeAccess();
    if (1)
      return toBecomeFast;
    (0, eval)(toBecomeFast);
  }

  // ../../node_modules/@chevrotain/gast/lib/src/model.js
  function tokenLabel(tokType) {
    if (hasTokenLabel(tokType)) {
      return tokType.LABEL;
    } else {
      return tokType.name;
    }
  }
  function hasTokenLabel(obj) {
    return isString_default(obj.LABEL) && obj.LABEL !== "";
  }
  var AbstractProduction = class {
    get definition() {
      return this._definition;
    }
    set definition(value) {
      this._definition = value;
    }
    constructor(_definition) {
      this._definition = _definition;
    }
    accept(visitor) {
      visitor.visit(this);
      forEach_default(this.definition, (prod) => {
        prod.accept(visitor);
      });
    }
  };
  var NonTerminal = class extends AbstractProduction {
    constructor(options) {
      super([]);
      this.idx = 1;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
    set definition(definition) {
    }
    get definition() {
      if (this.referencedRule !== void 0) {
        return this.referencedRule.definition;
      }
      return [];
    }
    accept(visitor) {
      visitor.visit(this);
    }
  };
  var Rule = class extends AbstractProduction {
    constructor(options) {
      super(options.definition);
      this.orgText = "";
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
  };
  var Alternative = class extends AbstractProduction {
    constructor(options) {
      super(options.definition);
      this.ignoreAmbiguities = false;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
  };
  var Option = class extends AbstractProduction {
    constructor(options) {
      super(options.definition);
      this.idx = 1;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
  };
  var RepetitionMandatory = class extends AbstractProduction {
    constructor(options) {
      super(options.definition);
      this.idx = 1;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
  };
  var RepetitionMandatoryWithSeparator = class extends AbstractProduction {
    constructor(options) {
      super(options.definition);
      this.idx = 1;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
  };
  var Repetition = class extends AbstractProduction {
    constructor(options) {
      super(options.definition);
      this.idx = 1;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
  };
  var RepetitionWithSeparator = class extends AbstractProduction {
    constructor(options) {
      super(options.definition);
      this.idx = 1;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
  };
  var Alternation = class extends AbstractProduction {
    get definition() {
      return this._definition;
    }
    set definition(value) {
      this._definition = value;
    }
    constructor(options) {
      super(options.definition);
      this.idx = 1;
      this.ignoreAmbiguities = false;
      this.hasPredicates = false;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
  };
  var Terminal = class {
    constructor(options) {
      this.idx = 1;
      assign_default(this, pickBy_default(options, (v2) => v2 !== void 0));
    }
    accept(visitor) {
      visitor.visit(this);
    }
  };
  function serializeGrammar(topRules) {
    return map_default(topRules, serializeProduction);
  }
  function serializeProduction(node) {
    function convertDefinition(definition) {
      return map_default(definition, serializeProduction);
    }
    if (node instanceof NonTerminal) {
      const serializedNonTerminal = {
        type: "NonTerminal",
        name: node.nonTerminalName,
        idx: node.idx
      };
      if (isString_default(node.label)) {
        serializedNonTerminal.label = node.label;
      }
      return serializedNonTerminal;
    } else if (node instanceof Alternative) {
      return {
        type: "Alternative",
        definition: convertDefinition(node.definition)
      };
    } else if (node instanceof Option) {
      return {
        type: "Option",
        idx: node.idx,
        definition: convertDefinition(node.definition)
      };
    } else if (node instanceof RepetitionMandatory) {
      return {
        type: "RepetitionMandatory",
        idx: node.idx,
        definition: convertDefinition(node.definition)
      };
    } else if (node instanceof RepetitionMandatoryWithSeparator) {
      return {
        type: "RepetitionMandatoryWithSeparator",
        idx: node.idx,
        separator: serializeProduction(new Terminal({ terminalType: node.separator })),
        definition: convertDefinition(node.definition)
      };
    } else if (node instanceof RepetitionWithSeparator) {
      return {
        type: "RepetitionWithSeparator",
        idx: node.idx,
        separator: serializeProduction(new Terminal({ terminalType: node.separator })),
        definition: convertDefinition(node.definition)
      };
    } else if (node instanceof Repetition) {
      return {
        type: "Repetition",
        idx: node.idx,
        definition: convertDefinition(node.definition)
      };
    } else if (node instanceof Alternation) {
      return {
        type: "Alternation",
        idx: node.idx,
        definition: convertDefinition(node.definition)
      };
    } else if (node instanceof Terminal) {
      const serializedTerminal = {
        type: "Terminal",
        name: node.terminalType.name,
        label: tokenLabel(node.terminalType),
        idx: node.idx
      };
      if (isString_default(node.label)) {
        serializedTerminal.terminalLabel = node.label;
      }
      const pattern = node.terminalType.PATTERN;
      if (node.terminalType.PATTERN) {
        serializedTerminal.pattern = isRegExp_default(pattern) ? pattern.source : pattern;
      }
      return serializedTerminal;
    } else if (node instanceof Rule) {
      return {
        type: "Rule",
        name: node.name,
        orgText: node.orgText,
        definition: convertDefinition(node.definition)
      };
    } else {
      throw Error("non exhaustive match");
    }
  }

  // ../../node_modules/@chevrotain/gast/lib/src/visitor.js
  var GAstVisitor = class {
    visit(node) {
      const nodeAny = node;
      switch (nodeAny.constructor) {
        case NonTerminal:
          return this.visitNonTerminal(nodeAny);
        case Alternative:
          return this.visitAlternative(nodeAny);
        case Option:
          return this.visitOption(nodeAny);
        case RepetitionMandatory:
          return this.visitRepetitionMandatory(nodeAny);
        case RepetitionMandatoryWithSeparator:
          return this.visitRepetitionMandatoryWithSeparator(nodeAny);
        case RepetitionWithSeparator:
          return this.visitRepetitionWithSeparator(nodeAny);
        case Repetition:
          return this.visitRepetition(nodeAny);
        case Alternation:
          return this.visitAlternation(nodeAny);
        case Terminal:
          return this.visitTerminal(nodeAny);
        case Rule:
          return this.visitRule(nodeAny);
        /* c8 ignore next 2 */
        default:
          throw Error("non exhaustive match");
      }
    }
    /* c8 ignore next */
    visitNonTerminal(node) {
    }
    /* c8 ignore next */
    visitAlternative(node) {
    }
    /* c8 ignore next */
    visitOption(node) {
    }
    /* c8 ignore next */
    visitRepetition(node) {
    }
    /* c8 ignore next */
    visitRepetitionMandatory(node) {
    }
    /* c8 ignore next 3 */
    visitRepetitionMandatoryWithSeparator(node) {
    }
    /* c8 ignore next */
    visitRepetitionWithSeparator(node) {
    }
    /* c8 ignore next */
    visitAlternation(node) {
    }
    /* c8 ignore next */
    visitTerminal(node) {
    }
    /* c8 ignore next */
    visitRule(node) {
    }
  };

  // ../../node_modules/@chevrotain/gast/lib/src/helpers.js
  function isSequenceProd(prod) {
    return prod instanceof Alternative || prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionMandatory || prod instanceof RepetitionMandatoryWithSeparator || prod instanceof RepetitionWithSeparator || prod instanceof Terminal || prod instanceof Rule;
  }
  function isOptionalProd(prod, alreadyVisited = []) {
    const isDirectlyOptional = prod instanceof Option || prod instanceof Repetition || prod instanceof RepetitionWithSeparator;
    if (isDirectlyOptional) {
      return true;
    }
    if (prod instanceof Alternation) {
      return some_default(prod.definition, (subProd) => {
        return isOptionalProd(subProd, alreadyVisited);
      });
    } else if (prod instanceof NonTerminal && includes_default(alreadyVisited, prod)) {
      return false;
    } else if (prod instanceof AbstractProduction) {
      if (prod instanceof NonTerminal) {
        alreadyVisited.push(prod);
      }
      return every_default(prod.definition, (subProd) => {
        return isOptionalProd(subProd, alreadyVisited);
      });
    } else {
      return false;
    }
  }
  function isBranchingProd(prod) {
    return prod instanceof Alternation;
  }
  function getProductionDslName(prod) {
    if (prod instanceof NonTerminal) {
      return "SUBRULE";
    } else if (prod instanceof Option) {
      return "OPTION";
    } else if (prod instanceof Alternation) {
      return "OR";
    } else if (prod instanceof RepetitionMandatory) {
      return "AT_LEAST_ONE";
    } else if (prod instanceof RepetitionMandatoryWithSeparator) {
      return "AT_LEAST_ONE_SEP";
    } else if (prod instanceof RepetitionWithSeparator) {
      return "MANY_SEP";
    } else if (prod instanceof Repetition) {
      return "MANY";
    } else if (prod instanceof Terminal) {
      return "CONSUME";
    } else {
      throw Error("non exhaustive match");
    }
  }

  // ../../node_modules/chevrotain/lib/src/parse/grammar/rest.js
  var RestWalker = class {
    walk(prod, prevRest = []) {
      forEach_default(prod.definition, (subProd, index) => {
        const currRest = drop_default(prod.definition, index + 1);
        if (subProd instanceof NonTerminal) {
          this.walkProdRef(subProd, currRest, prevRest);
        } else if (subProd instanceof Terminal) {
          this.walkTerminal(subProd, currRest, prevRest);
        } else if (subProd instanceof Alternative) {
          this.walkFlat(subProd, currRest, prevRest);
        } else if (subProd instanceof Option) {
          this.walkOption(subProd, currRest, prevRest);
        } else if (subProd instanceof RepetitionMandatory) {
          this.walkAtLeastOne(subProd, currRest, prevRest);
        } else if (subProd instanceof RepetitionMandatoryWithSeparator) {
          this.walkAtLeastOneSep(subProd, currRest, prevRest);
        } else if (subProd instanceof RepetitionWithSeparator) {
          this.walkManySep(subProd, currRest, prevRest);
        } else if (subProd instanceof Repetition) {
          this.walkMany(subProd, currRest, prevRest);
        } else if (subProd instanceof Alternation) {
          this.walkOr(subProd, currRest, prevRest);
        } else {
          throw Error("non exhaustive match");
        }
      });
    }
    walkTerminal(terminal, currRest, prevRest) {
    }
    walkProdRef(refProd, currRest, prevRest) {
    }
    walkFlat(flatProd, currRest, prevRest) {
      const fullOrRest = currRest.concat(prevRest);
      this.walk(flatProd, fullOrRest);
    }
    walkOption(optionProd, currRest, prevRest) {
      const fullOrRest = currRest.concat(prevRest);
      this.walk(optionProd, fullOrRest);
    }
    walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
      const fullAtLeastOneRest = [
        new Option({ definition: atLeastOneProd.definition })
      ].concat(currRest, prevRest);
      this.walk(atLeastOneProd, fullAtLeastOneRest);
    }
    walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
      const fullAtLeastOneSepRest = restForRepetitionWithSeparator(atLeastOneSepProd, currRest, prevRest);
      this.walk(atLeastOneSepProd, fullAtLeastOneSepRest);
    }
    walkMany(manyProd, currRest, prevRest) {
      const fullManyRest = [
        new Option({ definition: manyProd.definition })
      ].concat(currRest, prevRest);
      this.walk(manyProd, fullManyRest);
    }
    walkManySep(manySepProd, currRest, prevRest) {
      const fullManySepRest = restForRepetitionWithSeparator(manySepProd, currRest, prevRest);
      this.walk(manySepProd, fullManySepRest);
    }
    walkOr(orProd, currRest, prevRest) {
      const fullOrRest = currRest.concat(prevRest);
      forEach_default(orProd.definition, (alt) => {
        const prodWrapper = new Alternative({ definition: [alt] });
        this.walk(prodWrapper, fullOrRest);
      });
    }
  };
  function restForRepetitionWithSeparator(repSepProd, currRest, prevRest) {
    const repSepRest = [
      new Option({
        definition: [
          new Terminal({ terminalType: repSepProd.separator })
        ].concat(repSepProd.definition)
      })
    ];
    const fullRepSepRest = repSepRest.concat(currRest, prevRest);
    return fullRepSepRest;
  }

  // ../../node_modules/chevrotain/lib/src/parse/grammar/first.js
  function first(prod) {
    if (prod instanceof NonTerminal) {
      return first(prod.referencedRule);
    } else if (prod instanceof Terminal) {
      return firstForTerminal(prod);
    } else if (isSequenceProd(prod)) {
      return firstForSequence(prod);
    } else if (isBranchingProd(prod)) {
      return firstForBranching(prod);
    } else {
      throw Error("non exhaustive match");
    }
  }
  function firstForSequence(prod) {
    let firstSet = [];
    const seq2 = prod.definition;
    let nextSubProdIdx = 0;
    let hasInnerProdsRemaining = seq2.length > nextSubProdIdx;
    let currSubProd;
    let isLastInnerProdOptional = true;
    while (hasInnerProdsRemaining && isLastInnerProdOptional) {
      currSubProd = seq2[nextSubProdIdx];
      isLastInnerProdOptional = isOptionalProd(currSubProd);
      firstSet = firstSet.concat(first(currSubProd));
      nextSubProdIdx = nextSubProdIdx + 1;
      hasInnerProdsRemaining = seq2.length > nextSubProdIdx;
    }
    return uniq_default(firstSet);
  }
  function firstForBranching(prod) {
    const allAlternativesFirsts = map_default(prod.definition, (innerProd) => {
      return first(innerProd);
    });
    return uniq_default(flatten_default(allAlternativesFirsts));
  }
  function firstForTerminal(terminal) {
    return [terminal.terminalType];
  }

  // ../../node_modules/chevrotain/lib/src/parse/constants.js
  var IN = "_~IN~_";

  // ../../node_modules/chevrotain/lib/src/parse/grammar/follow.js
  var ResyncFollowsWalker = class extends RestWalker {
    constructor(topProd) {
      super();
      this.topProd = topProd;
      this.follows = {};
    }
    startWalking() {
      this.walk(this.topProd);
      return this.follows;
    }
    walkTerminal(terminal, currRest, prevRest) {
    }
    walkProdRef(refProd, currRest, prevRest) {
      const followName = buildBetweenProdsFollowPrefix(refProd.referencedRule, refProd.idx) + this.topProd.name;
      const fullRest = currRest.concat(prevRest);
      const restProd = new Alternative({ definition: fullRest });
      const t_in_topProd_follows = first(restProd);
      this.follows[followName] = t_in_topProd_follows;
    }
  };
  function computeAllProdsFollows(topProductions) {
    const reSyncFollows = {};
    forEach_default(topProductions, (topProd) => {
      const currRefsFollow = new ResyncFollowsWalker(topProd).startWalking();
      assign_default(reSyncFollows, currRefsFollow);
    });
    return reSyncFollows;
  }
  function buildBetweenProdsFollowPrefix(inner, occurenceInParent) {
    return inner.name + occurenceInParent + IN;
  }

  // ../../node_modules/@chevrotain/regexp-to-ast/lib/src/utils.js
  function cc(char) {
    return char.charCodeAt(0);
  }
  function insertToSet(item, set2) {
    if (Array.isArray(item)) {
      item.forEach(function(subItem) {
        set2.push(subItem);
      });
    } else {
      set2.push(item);
    }
  }
  function addFlag(flagObj, flagKey) {
    if (flagObj[flagKey] === true) {
      throw "duplicate flag " + flagKey;
    }
    const x2 = flagObj[flagKey];
    flagObj[flagKey] = true;
  }
  function ASSERT_EXISTS(obj) {
    if (obj === void 0) {
      throw Error("Internal Error - Should never get here!");
    }
    return true;
  }
  function ASSERT_NEVER_REACH_HERE() {
    throw Error("Internal Error - Should never get here!");
  }
  function isCharacter(obj) {
    return obj["type"] === "Character";
  }

  // ../../node_modules/@chevrotain/regexp-to-ast/lib/src/character-classes.js
  var digitsCharCodes = [];
  for (let i = cc("0"); i <= cc("9"); i++) {
    digitsCharCodes.push(i);
  }
  var wordCharCodes = [cc("_")].concat(digitsCharCodes);
  for (let i = cc("a"); i <= cc("z"); i++) {
    wordCharCodes.push(i);
  }
  for (let i = cc("A"); i <= cc("Z"); i++) {
    wordCharCodes.push(i);
  }
  var whitespaceCodes = [
    cc(" "),
    cc("\f"),
    cc("\n"),
    cc("\r"),
    cc("	"),
    cc("\v"),
    cc("	"),
    cc("\xA0"),
    cc("\u1680"),
    cc("\u2000"),
    cc("\u2001"),
    cc("\u2002"),
    cc("\u2003"),
    cc("\u2004"),
    cc("\u2005"),
    cc("\u2006"),
    cc("\u2007"),
    cc("\u2008"),
    cc("\u2009"),
    cc("\u200A"),
    cc("\u2028"),
    cc("\u2029"),
    cc("\u202F"),
    cc("\u205F"),
    cc("\u3000"),
    cc("\uFEFF")
  ];

  // ../../node_modules/@chevrotain/regexp-to-ast/lib/src/regexp-parser.js
  var hexDigitPattern = /[0-9a-fA-F]/;
  var decimalPattern = /[0-9]/;
  var decimalPatternNoZero = /[1-9]/;
  var RegExpParser = class {
    constructor() {
      this.idx = 0;
      this.input = "";
      this.groupIdx = 0;
    }
    saveState() {
      return {
        idx: this.idx,
        input: this.input,
        groupIdx: this.groupIdx
      };
    }
    restoreState(newState) {
      this.idx = newState.idx;
      this.input = newState.input;
      this.groupIdx = newState.groupIdx;
    }
    pattern(input) {
      this.idx = 0;
      this.input = input;
      this.groupIdx = 0;
      this.consumeChar("/");
      const value = this.disjunction();
      this.consumeChar("/");
      const flags = {
        type: "Flags",
        loc: { begin: this.idx, end: input.length },
        global: false,
        ignoreCase: false,
        multiLine: false,
        unicode: false,
        sticky: false
      };
      while (this.isRegExpFlag()) {
        switch (this.popChar()) {
          case "g":
            addFlag(flags, "global");
            break;
          case "i":
            addFlag(flags, "ignoreCase");
            break;
          case "m":
            addFlag(flags, "multiLine");
            break;
          case "u":
            addFlag(flags, "unicode");
            break;
          case "y":
            addFlag(flags, "sticky");
            break;
        }
      }
      if (this.idx !== this.input.length) {
        throw Error("Redundant input: " + this.input.substring(this.idx));
      }
      return {
        type: "Pattern",
        flags,
        value,
        loc: this.loc(0)
      };
    }
    disjunction() {
      const alts = [];
      const begin = this.idx;
      alts.push(this.alternative());
      while (this.peekChar() === "|") {
        this.consumeChar("|");
        alts.push(this.alternative());
      }
      return { type: "Disjunction", value: alts, loc: this.loc(begin) };
    }
    alternative() {
      const terms = [];
      const begin = this.idx;
      while (this.isTerm()) {
        terms.push(this.term());
      }
      return { type: "Alternative", value: terms, loc: this.loc(begin) };
    }
    term() {
      if (this.isAssertion()) {
        return this.assertion();
      } else {
        return this.atom();
      }
    }
    assertion() {
      const begin = this.idx;
      switch (this.popChar()) {
        case "^":
          return {
            type: "StartAnchor",
            loc: this.loc(begin)
          };
        case "$":
          return { type: "EndAnchor", loc: this.loc(begin) };
        // '\b' or '\B'
        case "\\":
          switch (this.popChar()) {
            case "b":
              return {
                type: "WordBoundary",
                loc: this.loc(begin)
              };
            case "B":
              return {
                type: "NonWordBoundary",
                loc: this.loc(begin)
              };
          }
          throw Error("Invalid Assertion Escape");
        // '(?=' or '(?!'
        case "(":
          this.consumeChar("?");
          let type2;
          switch (this.popChar()) {
            case "=":
              type2 = "Lookahead";
              break;
            case "!":
              type2 = "NegativeLookahead";
              break;
            case "<": {
              switch (this.popChar()) {
                case "=":
                  type2 = "Lookbehind";
                  break;
                case "!":
                  type2 = "NegativeLookbehind";
              }
              break;
            }
          }
          ASSERT_EXISTS(type2);
          const disjunction = this.disjunction();
          this.consumeChar(")");
          return {
            type: type2,
            value: disjunction,
            loc: this.loc(begin)
          };
      }
      return ASSERT_NEVER_REACH_HERE();
    }
    quantifier(isBacktracking = false) {
      let range = void 0;
      const begin = this.idx;
      switch (this.popChar()) {
        case "*":
          range = {
            atLeast: 0,
            atMost: Infinity
          };
          break;
        case "+":
          range = {
            atLeast: 1,
            atMost: Infinity
          };
          break;
        case "?":
          range = {
            atLeast: 0,
            atMost: 1
          };
          break;
        case "{":
          const atLeast = this.integerIncludingZero();
          switch (this.popChar()) {
            case "}":
              range = {
                atLeast,
                atMost: atLeast
              };
              break;
            case ",":
              let atMost;
              if (this.isDigit()) {
                atMost = this.integerIncludingZero();
                range = {
                  atLeast,
                  atMost
                };
              } else {
                range = {
                  atLeast,
                  atMost: Infinity
                };
              }
              this.consumeChar("}");
              break;
          }
          if (isBacktracking === true && range === void 0) {
            return void 0;
          }
          ASSERT_EXISTS(range);
          break;
      }
      if (isBacktracking === true && range === void 0) {
        return void 0;
      }
      if (ASSERT_EXISTS(range)) {
        if (this.peekChar(0) === "?") {
          this.consumeChar("?");
          range.greedy = false;
        } else {
          range.greedy = true;
        }
        range.type = "Quantifier";
        range.loc = this.loc(begin);
        return range;
      }
    }
    atom() {
      let atom;
      const begin = this.idx;
      switch (this.peekChar()) {
        case ".":
          atom = this.dotAll();
          break;
        case "\\":
          atom = this.atomEscape();
          break;
        case "[":
          atom = this.characterClass();
          break;
        case "(":
          atom = this.group();
          break;
      }
      if (atom === void 0 && this.isPatternCharacter()) {
        atom = this.patternCharacter();
      }
      if (ASSERT_EXISTS(atom)) {
        atom.loc = this.loc(begin);
        if (this.isQuantifier()) {
          atom.quantifier = this.quantifier();
        }
        return atom;
      }
      return ASSERT_NEVER_REACH_HERE();
    }
    dotAll() {
      this.consumeChar(".");
      return {
        type: "Set",
        complement: true,
        value: [cc("\n"), cc("\r"), cc("\u2028"), cc("\u2029")]
      };
    }
    atomEscape() {
      this.consumeChar("\\");
      switch (this.peekChar()) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          return this.decimalEscapeAtom();
        case "d":
        case "D":
        case "s":
        case "S":
        case "w":
        case "W":
          return this.characterClassEscape();
        case "f":
        case "n":
        case "r":
        case "t":
        case "v":
          return this.controlEscapeAtom();
        case "c":
          return this.controlLetterEscapeAtom();
        case "0":
          return this.nulCharacterAtom();
        case "x":
          return this.hexEscapeSequenceAtom();
        case "u":
          return this.regExpUnicodeEscapeSequenceAtom();
        default:
          return this.identityEscapeAtom();
      }
    }
    decimalEscapeAtom() {
      const value = this.positiveInteger();
      return { type: "GroupBackReference", value };
    }
    characterClassEscape() {
      let set2;
      let complement = false;
      switch (this.popChar()) {
        case "d":
          set2 = digitsCharCodes;
          break;
        case "D":
          set2 = digitsCharCodes;
          complement = true;
          break;
        case "s":
          set2 = whitespaceCodes;
          break;
        case "S":
          set2 = whitespaceCodes;
          complement = true;
          break;
        case "w":
          set2 = wordCharCodes;
          break;
        case "W":
          set2 = wordCharCodes;
          complement = true;
          break;
      }
      if (ASSERT_EXISTS(set2)) {
        return { type: "Set", value: set2, complement };
      }
      return ASSERT_NEVER_REACH_HERE();
    }
    controlEscapeAtom() {
      let escapeCode;
      switch (this.popChar()) {
        case "f":
          escapeCode = cc("\f");
          break;
        case "n":
          escapeCode = cc("\n");
          break;
        case "r":
          escapeCode = cc("\r");
          break;
        case "t":
          escapeCode = cc("	");
          break;
        case "v":
          escapeCode = cc("\v");
          break;
      }
      if (ASSERT_EXISTS(escapeCode)) {
        return { type: "Character", value: escapeCode };
      }
      return ASSERT_NEVER_REACH_HERE();
    }
    controlLetterEscapeAtom() {
      this.consumeChar("c");
      const letter = this.popChar();
      if (/[a-zA-Z]/.test(letter) === false) {
        throw Error("Invalid ");
      }
      const letterCode = letter.toUpperCase().charCodeAt(0) - 64;
      return { type: "Character", value: letterCode };
    }
    nulCharacterAtom() {
      this.consumeChar("0");
      return { type: "Character", value: cc("\0") };
    }
    hexEscapeSequenceAtom() {
      this.consumeChar("x");
      return this.parseHexDigits(2);
    }
    regExpUnicodeEscapeSequenceAtom() {
      this.consumeChar("u");
      return this.parseHexDigits(4);
    }
    identityEscapeAtom() {
      const escapedChar = this.popChar();
      return { type: "Character", value: cc(escapedChar) };
    }
    classPatternCharacterAtom() {
      switch (this.peekChar()) {
        // istanbul ignore next
        case "\n":
        // istanbul ignore next
        case "\r":
        // istanbul ignore next
        case "\u2028":
        // istanbul ignore next
        case "\u2029":
        // istanbul ignore next
        case "\\":
        // istanbul ignore next
        case "]":
          throw Error("TBD");
        default:
          const nextChar = this.popChar();
          return { type: "Character", value: cc(nextChar) };
      }
    }
    characterClass() {
      const set2 = [];
      let complement = false;
      this.consumeChar("[");
      if (this.peekChar(0) === "^") {
        this.consumeChar("^");
        complement = true;
      }
      while (this.isClassAtom()) {
        const from = this.classAtom();
        const isFromSingleChar = from.type === "Character";
        if (isCharacter(from) && this.isRangeDash()) {
          this.consumeChar("-");
          const to = this.classAtom();
          const isToSingleChar = to.type === "Character";
          if (isCharacter(to)) {
            if (to.value < from.value) {
              throw Error("Range out of order in character class");
            }
            set2.push({ from: from.value, to: to.value });
          } else {
            insertToSet(from.value, set2);
            set2.push(cc("-"));
            insertToSet(to.value, set2);
          }
        } else {
          insertToSet(from.value, set2);
        }
      }
      this.consumeChar("]");
      return { type: "Set", complement, value: set2 };
    }
    classAtom() {
      switch (this.peekChar()) {
        // istanbul ignore next
        case "]":
        // istanbul ignore next
        case "\n":
        // istanbul ignore next
        case "\r":
        // istanbul ignore next
        case "\u2028":
        // istanbul ignore next
        case "\u2029":
          throw Error("TBD");
        case "\\":
          return this.classEscape();
        default:
          return this.classPatternCharacterAtom();
      }
    }
    classEscape() {
      this.consumeChar("\\");
      switch (this.peekChar()) {
        // Matches a backspace.
        // (Not to be confused with \b word boundary outside characterClass)
        case "b":
          this.consumeChar("b");
          return { type: "Character", value: cc("\b") };
        case "d":
        case "D":
        case "s":
        case "S":
        case "w":
        case "W":
          return this.characterClassEscape();
        case "f":
        case "n":
        case "r":
        case "t":
        case "v":
          return this.controlEscapeAtom();
        case "c":
          return this.controlLetterEscapeAtom();
        case "0":
          return this.nulCharacterAtom();
        case "x":
          return this.hexEscapeSequenceAtom();
        case "u":
          return this.regExpUnicodeEscapeSequenceAtom();
        default:
          return this.identityEscapeAtom();
      }
    }
    group() {
      let capturing = true;
      this.consumeChar("(");
      switch (this.peekChar(0)) {
        case "?":
          this.consumeChar("?");
          this.consumeChar(":");
          capturing = false;
          break;
        default:
          this.groupIdx++;
          break;
      }
      const value = this.disjunction();
      this.consumeChar(")");
      const groupAst = {
        type: "Group",
        capturing,
        value
      };
      if (capturing) {
        groupAst["idx"] = this.groupIdx;
      }
      return groupAst;
    }
    positiveInteger() {
      let number = this.popChar();
      if (decimalPatternNoZero.test(number) === false) {
        throw Error("Expecting a positive integer");
      }
      while (decimalPattern.test(this.peekChar(0))) {
        number += this.popChar();
      }
      return parseInt(number, 10);
    }
    integerIncludingZero() {
      let number = this.popChar();
      if (decimalPattern.test(number) === false) {
        throw Error("Expecting an integer");
      }
      while (decimalPattern.test(this.peekChar(0))) {
        number += this.popChar();
      }
      return parseInt(number, 10);
    }
    patternCharacter() {
      const nextChar = this.popChar();
      switch (nextChar) {
        // istanbul ignore next
        case "\n":
        // istanbul ignore next
        case "\r":
        // istanbul ignore next
        case "\u2028":
        // istanbul ignore next
        case "\u2029":
        // istanbul ignore next
        case "^":
        // istanbul ignore next
        case "$":
        // istanbul ignore next
        case "\\":
        // istanbul ignore next
        case ".":
        // istanbul ignore next
        case "*":
        // istanbul ignore next
        case "+":
        // istanbul ignore next
        case "?":
        // istanbul ignore next
        case "(":
        // istanbul ignore next
        case ")":
        // istanbul ignore next
        case "[":
        // istanbul ignore next
        case "|":
          throw Error("TBD");
        default:
          return { type: "Character", value: cc(nextChar) };
      }
    }
    isRegExpFlag() {
      switch (this.peekChar(0)) {
        case "g":
        case "i":
        case "m":
        case "u":
        case "y":
          return true;
        default:
          return false;
      }
    }
    isRangeDash() {
      return this.peekChar() === "-" && this.isClassAtom(1);
    }
    isDigit() {
      return decimalPattern.test(this.peekChar(0));
    }
    isClassAtom(howMuch = 0) {
      switch (this.peekChar(howMuch)) {
        case "]":
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029":
          return false;
        default:
          return true;
      }
    }
    isTerm() {
      return this.isAtom() || this.isAssertion();
    }
    isAtom() {
      if (this.isPatternCharacter()) {
        return true;
      }
      switch (this.peekChar(0)) {
        case ".":
        case "\\":
        // atomEscape
        case "[":
        // characterClass
        // TODO: isAtom must be called before isAssertion - disambiguate
        case "(":
          return true;
        default:
          return false;
      }
    }
    isAssertion() {
      switch (this.peekChar(0)) {
        case "^":
        case "$":
          return true;
        // '\b' or '\B'
        case "\\":
          switch (this.peekChar(1)) {
            case "b":
            case "B":
              return true;
            default:
              return false;
          }
        // '(?=' or '(?!' or `(?<=` or `(?<!`
        case "(":
          return this.peekChar(1) === "?" && (this.peekChar(2) === "=" || this.peekChar(2) === "!" || this.peekChar(2) === "<" && (this.peekChar(3) === "=" || this.peekChar(3) === "!"));
        default:
          return false;
      }
    }
    isQuantifier() {
      const prevState = this.saveState();
      try {
        return this.quantifier(true) !== void 0;
      } catch (e) {
        return false;
      } finally {
        this.restoreState(prevState);
      }
    }
    isPatternCharacter() {
      switch (this.peekChar()) {
        case "^":
        case "$":
        case "\\":
        case ".":
        case "*":
        case "+":
        case "?":
        case "(":
        case ")":
        case "[":
        case "|":
        case "/":
        case "\n":
        case "\r":
        case "\u2028":
        case "\u2029":
          return false;
        default:
          return true;
      }
    }
    parseHexDigits(howMany) {
      let hexString = "";
      for (let i = 0; i < howMany; i++) {
        const hexChar = this.popChar();
        if (hexDigitPattern.test(hexChar) === false) {
          throw Error("Expecting a HexDecimal digits");
        }
        hexString += hexChar;
      }
      const charCode = parseInt(hexString, 16);
      return { type: "Character", value: charCode };
    }
    peekChar(howMuch = 0) {
      return this.input[this.idx + howMuch];
    }
    popChar() {
      const nextChar = this.peekChar(0);
      this.consumeChar(void 0);
      return nextChar;
    }
    consumeChar(char) {
      if (char !== void 0 && this.input[this.idx] !== char) {
        throw Error("Expected: '" + char + "' but found: '" + this.input[this.idx] + "' at offset: " + this.idx);
      }
      if (this.idx >= this.input.length) {
        throw Error("Unexpected end of input");
      }
      this.idx++;
    }
    loc(begin) {
      return { begin, end: this.idx };
    }
  };

  // ../../node_modules/@chevrotain/regexp-to-ast/lib/src/base-regexp-visitor.js
  var BaseRegExpVisitor = class {
    visitChildren(node) {
      for (const key in node) {
        const child = node[key];
        if (node.hasOwnProperty(key)) {
          if (child.type !== void 0) {
            this.visit(child);
          } else if (Array.isArray(child)) {
            child.forEach((subChild) => {
              this.visit(subChild);
            }, this);
          }
        }
      }
    }
    visit(node) {
      switch (node.type) {
        case "Pattern":
          this.visitPattern(node);
          break;
        case "Flags":
          this.visitFlags(node);
          break;
        case "Disjunction":
          this.visitDisjunction(node);
          break;
        case "Alternative":
          this.visitAlternative(node);
          break;
        case "StartAnchor":
          this.visitStartAnchor(node);
          break;
        case "EndAnchor":
          this.visitEndAnchor(node);
          break;
        case "WordBoundary":
          this.visitWordBoundary(node);
          break;
        case "NonWordBoundary":
          this.visitNonWordBoundary(node);
          break;
        case "Lookahead":
          this.visitLookahead(node);
          break;
        case "NegativeLookahead":
          this.visitNegativeLookahead(node);
          break;
        case "Lookbehind":
          this.visitLookbehind(node);
          break;
        case "NegativeLookbehind":
          this.visitNegativeLookbehind(node);
          break;
        case "Character":
          this.visitCharacter(node);
          break;
        case "Set":
          this.visitSet(node);
          break;
        case "Group":
          this.visitGroup(node);
          break;
        case "GroupBackReference":
          this.visitGroupBackReference(node);
          break;
        case "Quantifier":
          this.visitQuantifier(node);
          break;
      }
      this.visitChildren(node);
    }
    visitPattern(node) {
    }
    visitFlags(node) {
    }
    visitDisjunction(node) {
    }
    visitAlternative(node) {
    }
    // Assertion
    visitStartAnchor(node) {
    }
    visitEndAnchor(node) {
    }
    visitWordBoundary(node) {
    }
    visitNonWordBoundary(node) {
    }
    visitLookahead(node) {
    }
    visitNegativeLookahead(node) {
    }
    visitLookbehind(node) {
    }
    visitNegativeLookbehind(node) {
    }
    // atoms
    visitCharacter(node) {
    }
    visitSet(node) {
    }
    visitGroup(node) {
    }
    visitGroupBackReference(node) {
    }
    visitQuantifier(node) {
    }
  };

  // ../../node_modules/chevrotain/lib/src/scan/reg_exp_parser.js
  var regExpAstCache = {};
  var regExpParser = new RegExpParser();
  function getRegExpAst(regExp) {
    const regExpStr = regExp.toString();
    if (regExpAstCache.hasOwnProperty(regExpStr)) {
      return regExpAstCache[regExpStr];
    } else {
      const regExpAst = regExpParser.pattern(regExpStr);
      regExpAstCache[regExpStr] = regExpAst;
      return regExpAst;
    }
  }
  function clearRegExpParserCache() {
    regExpAstCache = {};
  }

  // ../../node_modules/chevrotain/lib/src/scan/reg_exp.js
  var complementErrorMessage = "Complement Sets are not supported for first char optimization";
  var failedOptimizationPrefixMsg = 'Unable to use "first char" lexer optimizations:\n';
  function getOptimizedStartCodesIndices(regExp, ensureOptimizations = false) {
    try {
      const ast = getRegExpAst(regExp);
      const firstChars = firstCharOptimizedIndices(ast.value, {}, ast.flags.ignoreCase);
      return firstChars;
    } catch (e) {
      if (e.message === complementErrorMessage) {
        if (ensureOptimizations) {
          PRINT_WARNING(`${failedOptimizationPrefixMsg}	Unable to optimize: < ${regExp.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`);
        }
      } else {
        let msgSuffix = "";
        if (ensureOptimizations) {
          msgSuffix = "\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details.";
        }
        PRINT_ERROR(`${failedOptimizationPrefixMsg}
	Failed parsing: < ${regExp.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues` + msgSuffix);
      }
    }
    return [];
  }
  function firstCharOptimizedIndices(ast, result, ignoreCase) {
    switch (ast.type) {
      case "Disjunction":
        for (let i = 0; i < ast.value.length; i++) {
          firstCharOptimizedIndices(ast.value[i], result, ignoreCase);
        }
        break;
      case "Alternative":
        const terms = ast.value;
        for (let i = 0; i < terms.length; i++) {
          const term = terms[i];
          switch (term.type) {
            case "EndAnchor":
            // A group back reference cannot affect potential starting char.
            // because if a back reference is the first production than automatically
            // the group being referenced has had to come BEFORE so its codes have already been added
            case "GroupBackReference":
            // assertions do not affect potential starting codes
            case "Lookahead":
            case "NegativeLookahead":
            case "Lookbehind":
            case "NegativeLookbehind":
            case "StartAnchor":
            case "WordBoundary":
            case "NonWordBoundary":
              continue;
          }
          const atom = term;
          switch (atom.type) {
            case "Character":
              addOptimizedIdxToResult(atom.value, result, ignoreCase);
              break;
            case "Set":
              if (atom.complement === true) {
                throw Error(complementErrorMessage);
              }
              forEach_default(atom.value, (code) => {
                if (typeof code === "number") {
                  addOptimizedIdxToResult(code, result, ignoreCase);
                } else {
                  const range = code;
                  if (ignoreCase === true) {
                    for (let rangeCode = range.from; rangeCode <= range.to; rangeCode++) {
                      addOptimizedIdxToResult(rangeCode, result, ignoreCase);
                    }
                  } else {
                    for (let rangeCode = range.from; rangeCode <= range.to && rangeCode < minOptimizationVal; rangeCode++) {
                      addOptimizedIdxToResult(rangeCode, result, ignoreCase);
                    }
                    if (range.to >= minOptimizationVal) {
                      const minUnOptVal = range.from >= minOptimizationVal ? range.from : minOptimizationVal;
                      const maxUnOptVal = range.to;
                      const minOptIdx = charCodeToOptimizedIndex(minUnOptVal);
                      const maxOptIdx = charCodeToOptimizedIndex(maxUnOptVal);
                      for (let currOptIdx = minOptIdx; currOptIdx <= maxOptIdx; currOptIdx++) {
                        result[currOptIdx] = currOptIdx;
                      }
                    }
                  }
                }
              });
              break;
            case "Group":
              firstCharOptimizedIndices(atom.value, result, ignoreCase);
              break;
            /* istanbul ignore next */
            default:
              throw Error("Non Exhaustive Match");
          }
          const isOptionalQuantifier = atom.quantifier !== void 0 && atom.quantifier.atLeast === 0;
          if (
            // A group may be optional due to empty contents /(?:)/
            // or if everything inside it is optional /((a)?)/
            atom.type === "Group" && isWholeOptional(atom) === false || // If this term is not a group it may only be optional if it has an optional quantifier
            atom.type !== "Group" && isOptionalQuantifier === false
          ) {
            break;
          }
        }
        break;
      /* istanbul ignore next */
      default:
        throw Error("non exhaustive match!");
    }
    return values_default(result);
  }
  function addOptimizedIdxToResult(code, result, ignoreCase) {
    const optimizedCharIdx = charCodeToOptimizedIndex(code);
    result[optimizedCharIdx] = optimizedCharIdx;
    if (ignoreCase === true) {
      handleIgnoreCase(code, result);
    }
  }
  function handleIgnoreCase(code, result) {
    const char = String.fromCharCode(code);
    const upperChar = char.toUpperCase();
    if (upperChar !== char) {
      const optimizedCharIdx = charCodeToOptimizedIndex(upperChar.charCodeAt(0));
      result[optimizedCharIdx] = optimizedCharIdx;
    } else {
      const lowerChar = char.toLowerCase();
      if (lowerChar !== char) {
        const optimizedCharIdx = charCodeToOptimizedIndex(lowerChar.charCodeAt(0));
        result[optimizedCharIdx] = optimizedCharIdx;
      }
    }
  }
  function findCode(setNode, targetCharCodes) {
    return find_default(setNode.value, (codeOrRange) => {
      if (typeof codeOrRange === "number") {
        return includes_default(targetCharCodes, codeOrRange);
      } else {
        const range = codeOrRange;
        return find_default(targetCharCodes, (targetCode) => range.from <= targetCode && targetCode <= range.to) !== void 0;
      }
    });
  }
  function isWholeOptional(ast) {
    const quantifier = ast.quantifier;
    if (quantifier && quantifier.atLeast === 0) {
      return true;
    }
    if (!ast.value) {
      return false;
    }
    return isArray_default(ast.value) ? every_default(ast.value, isWholeOptional) : isWholeOptional(ast.value);
  }
  var CharCodeFinder = class extends BaseRegExpVisitor {
    constructor(targetCharCodes) {
      super();
      this.targetCharCodes = targetCharCodes;
      this.found = false;
    }
    visitChildren(node) {
      if (this.found === true) {
        return;
      }
      switch (node.type) {
        case "Lookahead":
          this.visitLookahead(node);
          return;
        case "NegativeLookahead":
          this.visitNegativeLookahead(node);
          return;
        case "Lookbehind":
          this.visitLookbehind(node);
          return;
        case "NegativeLookbehind":
          this.visitNegativeLookbehind(node);
          return;
      }
      super.visitChildren(node);
    }
    visitCharacter(node) {
      if (includes_default(this.targetCharCodes, node.value)) {
        this.found = true;
      }
    }
    visitSet(node) {
      if (node.complement) {
        if (findCode(node, this.targetCharCodes) === void 0) {
          this.found = true;
        }
      } else {
        if (findCode(node, this.targetCharCodes) !== void 0) {
          this.found = true;
        }
      }
    }
  };
  function canMatchCharCode(charCodes, pattern) {
    if (pattern instanceof RegExp) {
      const ast = getRegExpAst(pattern);
      const charCodeFinder = new CharCodeFinder(charCodes);
      charCodeFinder.visit(ast);
      return charCodeFinder.found;
    } else {
      return find_default(pattern, (char) => {
        return includes_default(charCodes, char.charCodeAt(0));
      }) !== void 0;
    }
  }

  // ../../node_modules/chevrotain/lib/src/scan/lexer.js
  var PATTERN = "PATTERN";
  var DEFAULT_MODE = "defaultMode";
  var MODES = "modes";
  var SUPPORT_STICKY = typeof new RegExp("(?:)").sticky === "boolean";
  function analyzeTokenTypes(tokenTypes, options) {
    options = defaults_default(options, {
      useSticky: SUPPORT_STICKY,
      debug: false,
      safeMode: false,
      positionTracking: "full",
      lineTerminatorCharacters: ["\r", "\n"],
      tracer: (msg, action) => action()
    });
    const tracer = options.tracer;
    tracer("initCharCodeToOptimizedIndexMap", () => {
      initCharCodeToOptimizedIndexMap();
    });
    let onlyRelevantTypes;
    tracer("Reject Lexer.NA", () => {
      onlyRelevantTypes = reject_default(tokenTypes, (currType) => {
        return currType[PATTERN] === Lexer.NA;
      });
    });
    let hasCustom = false;
    let allTransformedPatterns;
    tracer("Transform Patterns", () => {
      hasCustom = false;
      allTransformedPatterns = map_default(onlyRelevantTypes, (currType) => {
        const currPattern = currType[PATTERN];
        if (isRegExp_default(currPattern)) {
          const regExpSource = currPattern.source;
          if (regExpSource.length === 1 && // only these regExp meta characters which can appear in a length one regExp
          regExpSource !== "^" && regExpSource !== "$" && regExpSource !== "." && !currPattern.ignoreCase) {
            return regExpSource;
          } else if (regExpSource.length === 2 && regExpSource[0] === "\\" && // not a meta character
          !includes_default([
            "d",
            "D",
            "s",
            "S",
            "t",
            "r",
            "n",
            "t",
            "0",
            "c",
            "b",
            "B",
            "f",
            "v",
            "w",
            "W"
          ], regExpSource[1])) {
            return regExpSource[1];
          } else {
            return options.useSticky ? addStickyFlag(currPattern) : addStartOfInput(currPattern);
          }
        } else if (isFunction_default(currPattern)) {
          hasCustom = true;
          return { exec: currPattern };
        } else if (typeof currPattern === "object") {
          hasCustom = true;
          return currPattern;
        } else if (typeof currPattern === "string") {
          if (currPattern.length === 1) {
            return currPattern;
          } else {
            const escapedRegExpString = currPattern.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
            const wrappedRegExp = new RegExp(escapedRegExpString);
            return options.useSticky ? addStickyFlag(wrappedRegExp) : addStartOfInput(wrappedRegExp);
          }
        } else {
          throw Error("non exhaustive match");
        }
      });
    });
    let patternIdxToType;
    let patternIdxToGroup;
    let patternIdxToLongerAltIdxArr;
    let patternIdxToPushMode;
    let patternIdxToPopMode;
    tracer("misc mapping", () => {
      patternIdxToType = map_default(onlyRelevantTypes, (currType) => currType.tokenTypeIdx);
      patternIdxToGroup = map_default(onlyRelevantTypes, (clazz) => {
        const groupName = clazz.GROUP;
        if (groupName === Lexer.SKIPPED) {
          return void 0;
        } else if (isString_default(groupName)) {
          return groupName;
        } else if (isUndefined_default(groupName)) {
          return false;
        } else {
          throw Error("non exhaustive match");
        }
      });
      patternIdxToLongerAltIdxArr = map_default(onlyRelevantTypes, (clazz) => {
        const longerAltType = clazz.LONGER_ALT;
        if (longerAltType) {
          const longerAltIdxArr = isArray_default(longerAltType) ? map_default(longerAltType, (type2) => indexOf_default(onlyRelevantTypes, type2)) : [indexOf_default(onlyRelevantTypes, longerAltType)];
          return longerAltIdxArr;
        }
      });
      patternIdxToPushMode = map_default(onlyRelevantTypes, (clazz) => clazz.PUSH_MODE);
      patternIdxToPopMode = map_default(onlyRelevantTypes, (clazz) => has_default(clazz, "POP_MODE"));
    });
    let patternIdxToCanLineTerminator;
    tracer("Line Terminator Handling", () => {
      const lineTerminatorCharCodes = getCharCodes(options.lineTerminatorCharacters);
      patternIdxToCanLineTerminator = map_default(onlyRelevantTypes, (tokType) => false);
      if (options.positionTracking !== "onlyOffset") {
        patternIdxToCanLineTerminator = map_default(onlyRelevantTypes, (tokType) => {
          if (has_default(tokType, "LINE_BREAKS")) {
            return !!tokType.LINE_BREAKS;
          } else {
            return checkLineBreaksIssues(tokType, lineTerminatorCharCodes) === false && canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
          }
        });
      }
    });
    let patternIdxToIsCustom;
    let patternIdxToShort;
    let emptyGroups;
    let patternIdxToConfig;
    tracer("Misc Mapping #2", () => {
      patternIdxToIsCustom = map_default(onlyRelevantTypes, isCustomPattern);
      patternIdxToShort = map_default(allTransformedPatterns, isShortPattern);
      emptyGroups = reduce_default(onlyRelevantTypes, (acc, clazz) => {
        const groupName = clazz.GROUP;
        if (isString_default(groupName) && !(groupName === Lexer.SKIPPED)) {
          acc[groupName] = [];
        }
        return acc;
      }, {});
      patternIdxToConfig = map_default(allTransformedPatterns, (x2, idx) => {
        return {
          pattern: allTransformedPatterns[idx],
          longerAlt: patternIdxToLongerAltIdxArr[idx],
          canLineTerminator: patternIdxToCanLineTerminator[idx],
          isCustom: patternIdxToIsCustom[idx],
          short: patternIdxToShort[idx],
          group: patternIdxToGroup[idx],
          push: patternIdxToPushMode[idx],
          pop: patternIdxToPopMode[idx],
          tokenTypeIdx: patternIdxToType[idx],
          tokenType: onlyRelevantTypes[idx]
        };
      });
    });
    let canBeOptimized = true;
    let charCodeToPatternIdxToConfig = [];
    if (!options.safeMode) {
      tracer("First Char Optimization", () => {
        charCodeToPatternIdxToConfig = reduce_default(onlyRelevantTypes, (result, currTokType, idx) => {
          if (typeof currTokType.PATTERN === "string") {
            const charCode = currTokType.PATTERN.charCodeAt(0);
            const optimizedIdx = charCodeToOptimizedIndex(charCode);
            addToMapOfArrays(result, optimizedIdx, patternIdxToConfig[idx]);
          } else if (isArray_default(currTokType.START_CHARS_HINT)) {
            let lastOptimizedIdx;
            forEach_default(currTokType.START_CHARS_HINT, (charOrInt) => {
              const charCode = typeof charOrInt === "string" ? charOrInt.charCodeAt(0) : charOrInt;
              const currOptimizedIdx = charCodeToOptimizedIndex(charCode);
              if (lastOptimizedIdx !== currOptimizedIdx) {
                lastOptimizedIdx = currOptimizedIdx;
                addToMapOfArrays(result, currOptimizedIdx, patternIdxToConfig[idx]);
              }
            });
          } else if (isRegExp_default(currTokType.PATTERN)) {
            if (currTokType.PATTERN.unicode) {
              canBeOptimized = false;
              if (options.ensureOptimizations) {
                PRINT_ERROR(`${failedOptimizationPrefixMsg}	Unable to analyze < ${currTokType.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`);
              }
            } else {
              const optimizedCodes = getOptimizedStartCodesIndices(currTokType.PATTERN, options.ensureOptimizations);
              if (isEmpty_default(optimizedCodes)) {
                canBeOptimized = false;
              }
              forEach_default(optimizedCodes, (code) => {
                addToMapOfArrays(result, code, patternIdxToConfig[idx]);
              });
            }
          } else {
            if (options.ensureOptimizations) {
              PRINT_ERROR(`${failedOptimizationPrefixMsg}	TokenType: <${currTokType.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`);
            }
            canBeOptimized = false;
          }
          return result;
        }, []);
      });
    }
    return {
      emptyGroups,
      patternIdxToConfig,
      charCodeToPatternIdxToConfig,
      hasCustom,
      canBeOptimized
    };
  }
  function validatePatterns(tokenTypes, validModesNames) {
    let errors = [];
    const missingResult = findMissingPatterns(tokenTypes);
    errors = errors.concat(missingResult.errors);
    const invalidResult = findInvalidPatterns(missingResult.valid);
    const validTokenTypes = invalidResult.valid;
    errors = errors.concat(invalidResult.errors);
    errors = errors.concat(validateRegExpPattern(validTokenTypes));
    errors = errors.concat(findInvalidGroupType(validTokenTypes));
    errors = errors.concat(findModesThatDoNotExist(validTokenTypes, validModesNames));
    errors = errors.concat(findUnreachablePatterns(validTokenTypes));
    return errors;
  }
  function validateRegExpPattern(tokenTypes) {
    let errors = [];
    const withRegExpPatterns = filter_default(tokenTypes, (currTokType) => isRegExp_default(currTokType[PATTERN]));
    errors = errors.concat(findEndOfInputAnchor(withRegExpPatterns));
    errors = errors.concat(findStartOfInputAnchor(withRegExpPatterns));
    errors = errors.concat(findUnsupportedFlags(withRegExpPatterns));
    errors = errors.concat(findDuplicatePatterns(withRegExpPatterns));
    errors = errors.concat(findEmptyMatchRegExps(withRegExpPatterns));
    return errors;
  }
  function findMissingPatterns(tokenTypes) {
    const tokenTypesWithMissingPattern = filter_default(tokenTypes, (currType) => {
      return !has_default(currType, PATTERN);
    });
    const errors = map_default(tokenTypesWithMissingPattern, (currType) => {
      return {
        message: "Token Type: ->" + currType.name + "<- missing static 'PATTERN' property",
        type: LexerDefinitionErrorType.MISSING_PATTERN,
        tokenTypes: [currType]
      };
    });
    const valid = difference_default(tokenTypes, tokenTypesWithMissingPattern);
    return { errors, valid };
  }
  function findInvalidPatterns(tokenTypes) {
    const tokenTypesWithInvalidPattern = filter_default(tokenTypes, (currType) => {
      const pattern = currType[PATTERN];
      return !isRegExp_default(pattern) && !isFunction_default(pattern) && !has_default(pattern, "exec") && !isString_default(pattern);
    });
    const errors = map_default(tokenTypesWithInvalidPattern, (currType) => {
      return {
        message: "Token Type: ->" + currType.name + "<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",
        type: LexerDefinitionErrorType.INVALID_PATTERN,
        tokenTypes: [currType]
      };
    });
    const valid = difference_default(tokenTypes, tokenTypesWithInvalidPattern);
    return { errors, valid };
  }
  var end_of_input = /[^\\][$]/;
  function findEndOfInputAnchor(tokenTypes) {
    class EndAnchorFinder extends BaseRegExpVisitor {
      constructor() {
        super(...arguments);
        this.found = false;
      }
      visitEndAnchor(node) {
        this.found = true;
      }
    }
    const invalidRegex = filter_default(tokenTypes, (currType) => {
      const pattern = currType.PATTERN;
      try {
        const regexpAst = getRegExpAst(pattern);
        const endAnchorVisitor = new EndAnchorFinder();
        endAnchorVisitor.visit(regexpAst);
        return endAnchorVisitor.found;
      } catch (e) {
        return end_of_input.test(pattern.source);
      }
    });
    const errors = map_default(invalidRegex, (currType) => {
      return {
        message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
        type: LexerDefinitionErrorType.EOI_ANCHOR_FOUND,
        tokenTypes: [currType]
      };
    });
    return errors;
  }
  function findEmptyMatchRegExps(tokenTypes) {
    const matchesEmptyString = filter_default(tokenTypes, (currType) => {
      const pattern = currType.PATTERN;
      return pattern.test("");
    });
    const errors = map_default(matchesEmptyString, (currType) => {
      return {
        message: "Token Type: ->" + currType.name + "<- static 'PATTERN' must not match an empty string",
        type: LexerDefinitionErrorType.EMPTY_MATCH_PATTERN,
        tokenTypes: [currType]
      };
    });
    return errors;
  }
  var start_of_input = /[^\\[][\^]|^\^/;
  function findStartOfInputAnchor(tokenTypes) {
    class StartAnchorFinder extends BaseRegExpVisitor {
      constructor() {
        super(...arguments);
        this.found = false;
      }
      visitStartAnchor(node) {
        this.found = true;
      }
    }
    const invalidRegex = filter_default(tokenTypes, (currType) => {
      const pattern = currType.PATTERN;
      try {
        const regexpAst = getRegExpAst(pattern);
        const startAnchorVisitor = new StartAnchorFinder();
        startAnchorVisitor.visit(regexpAst);
        return startAnchorVisitor.found;
      } catch (e) {
        return start_of_input.test(pattern.source);
      }
    });
    const errors = map_default(invalidRegex, (currType) => {
      return {
        message: "Unexpected RegExp Anchor Error:\n	Token Type: ->" + currType.name + "<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",
        type: LexerDefinitionErrorType.SOI_ANCHOR_FOUND,
        tokenTypes: [currType]
      };
    });
    return errors;
  }
  function findUnsupportedFlags(tokenTypes) {
    const invalidFlags = filter_default(tokenTypes, (currType) => {
      const pattern = currType[PATTERN];
      return pattern instanceof RegExp && (pattern.multiline || pattern.global);
    });
    const errors = map_default(invalidFlags, (currType) => {
      return {
        message: "Token Type: ->" + currType.name + "<- static 'PATTERN' may NOT contain global('g') or multiline('m')",
        type: LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND,
        tokenTypes: [currType]
      };
    });
    return errors;
  }
  function findDuplicatePatterns(tokenTypes) {
    const found = [];
    let identicalPatterns = map_default(tokenTypes, (outerType) => {
      return reduce_default(tokenTypes, (result, innerType) => {
        if (outerType.PATTERN.source === innerType.PATTERN.source && !includes_default(found, innerType) && innerType.PATTERN !== Lexer.NA) {
          found.push(innerType);
          result.push(innerType);
          return result;
        }
        return result;
      }, []);
    });
    identicalPatterns = compact_default(identicalPatterns);
    const duplicatePatterns = filter_default(identicalPatterns, (currIdenticalSet) => {
      return currIdenticalSet.length > 1;
    });
    const errors = map_default(duplicatePatterns, (setOfIdentical) => {
      const tokenTypeNames = map_default(setOfIdentical, (currType) => {
        return currType.name;
      });
      const dupPatternSrc = head_default(setOfIdentical).PATTERN;
      return {
        message: `The same RegExp pattern ->${dupPatternSrc}<-has been used in all of the following Token Types: ${tokenTypeNames.join(", ")} <-`,
        type: LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND,
        tokenTypes: setOfIdentical
      };
    });
    return errors;
  }
  function findInvalidGroupType(tokenTypes) {
    const invalidTypes = filter_default(tokenTypes, (clazz) => {
      if (!has_default(clazz, "GROUP")) {
        return false;
      }
      const group = clazz.GROUP;
      return group !== Lexer.SKIPPED && group !== Lexer.NA && !isString_default(group);
    });
    const errors = map_default(invalidTypes, (currType) => {
      return {
        message: "Token Type: ->" + currType.name + "<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",
        type: LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND,
        tokenTypes: [currType]
      };
    });
    return errors;
  }
  function findModesThatDoNotExist(tokenTypes, validModes) {
    const invalidModes = filter_default(tokenTypes, (clazz) => {
      return clazz.PUSH_MODE !== void 0 && !includes_default(validModes, clazz.PUSH_MODE);
    });
    const errors = map_default(invalidModes, (tokType) => {
      const msg = `Token Type: ->${tokType.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${tokType.PUSH_MODE}<-which does not exist`;
      return {
        message: msg,
        type: LexerDefinitionErrorType.PUSH_MODE_DOES_NOT_EXIST,
        tokenTypes: [tokType]
      };
    });
    return errors;
  }
  function findUnreachablePatterns(tokenTypes) {
    const errors = [];
    const canBeTested = reduce_default(tokenTypes, (result, tokType, idx) => {
      const pattern = tokType.PATTERN;
      if (pattern === Lexer.NA) {
        return result;
      }
      if (isString_default(pattern)) {
        result.push({ str: pattern, idx, tokenType: tokType });
      } else if (isRegExp_default(pattern) && noMetaChar(pattern)) {
        result.push({ str: pattern.source, idx, tokenType: tokType });
      }
      return result;
    }, []);
    forEach_default(tokenTypes, (aTokType, aIdx) => {
      forEach_default(canBeTested, ({ str: bStr, idx: bIdx, tokenType: bTokType }) => {
        if (aIdx < bIdx && tryToMatchStrToPattern(bStr, aTokType.PATTERN)) {
          const msg = `Token: ->${bTokType.name}<- can never be matched.
Because it appears AFTER the Token Type ->${aTokType.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;
          errors.push({
            message: msg,
            type: LexerDefinitionErrorType.UNREACHABLE_PATTERN,
            tokenTypes: [aTokType, bTokType]
          });
        }
      });
    });
    return errors;
  }
  function tryToMatchStrToPattern(str2, pattern) {
    if (isRegExp_default(pattern)) {
      if (usesLookAheadOrBehind(pattern)) {
        return false;
      }
      const regExpArray = pattern.exec(str2);
      return regExpArray !== null && regExpArray.index === 0;
    } else if (isFunction_default(pattern)) {
      return pattern(str2, 0, [], {});
    } else if (has_default(pattern, "exec")) {
      return pattern.exec(str2, 0, [], {});
    } else if (typeof pattern === "string") {
      return pattern === str2;
    } else {
      throw Error("non exhaustive match");
    }
  }
  function noMetaChar(regExp) {
    const metaChars = [
      ".",
      "\\",
      "[",
      "]",
      "|",
      "^",
      "$",
      "(",
      ")",
      "?",
      "*",
      "+",
      "{"
    ];
    return find_default(metaChars, (char) => regExp.source.indexOf(char) !== -1) === void 0;
  }
  function usesLookAheadOrBehind(regExp) {
    return /(\(\?=)|(\(\?!)|(\(\?<=)|(\(\?<!)/.test(regExp.source);
  }
  function addStartOfInput(pattern) {
    const flags = pattern.ignoreCase ? "i" : "";
    return new RegExp(`^(?:${pattern.source})`, flags);
  }
  function addStickyFlag(pattern) {
    const flags = pattern.ignoreCase ? "iy" : "y";
    return new RegExp(`${pattern.source}`, flags);
  }
  function performRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
    const errors = [];
    if (!has_default(lexerDefinition, DEFAULT_MODE)) {
      errors.push({
        message: "A MultiMode Lexer cannot be initialized without a <" + DEFAULT_MODE + "> property in its definition\n",
        type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE
      });
    }
    if (!has_default(lexerDefinition, MODES)) {
      errors.push({
        message: "A MultiMode Lexer cannot be initialized without a <" + MODES + "> property in its definition\n",
        type: LexerDefinitionErrorType.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY
      });
    }
    if (has_default(lexerDefinition, MODES) && has_default(lexerDefinition, DEFAULT_MODE) && !has_default(lexerDefinition.modes, lexerDefinition.defaultMode)) {
      errors.push({
        message: `A MultiMode Lexer cannot be initialized with a ${DEFAULT_MODE}: <${lexerDefinition.defaultMode}>which does not exist
`,
        type: LexerDefinitionErrorType.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST
      });
    }
    if (has_default(lexerDefinition, MODES)) {
      forEach_default(lexerDefinition.modes, (currModeValue, currModeName) => {
        forEach_default(currModeValue, (currTokType, currIdx) => {
          if (isUndefined_default(currTokType)) {
            errors.push({
              message: `A Lexer cannot be initialized using an undefined Token Type. Mode:<${currModeName}> at index: <${currIdx}>
`,
              type: LexerDefinitionErrorType.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED
            });
          } else if (has_default(currTokType, "LONGER_ALT")) {
            const longerAlt = isArray_default(currTokType.LONGER_ALT) ? currTokType.LONGER_ALT : [currTokType.LONGER_ALT];
            forEach_default(longerAlt, (currLongerAlt) => {
              if (!isUndefined_default(currLongerAlt) && !includes_default(currModeValue, currLongerAlt)) {
                errors.push({
                  message: `A MultiMode Lexer cannot be initialized with a longer_alt <${currLongerAlt.name}> on token <${currTokType.name}> outside of mode <${currModeName}>
`,
                  type: LexerDefinitionErrorType.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE
                });
              }
            });
          }
        });
      });
    }
    return errors;
  }
  function performWarningRuntimeChecks(lexerDefinition, trackLines, lineTerminatorCharacters) {
    const warnings = [];
    let hasAnyLineBreak = false;
    const allTokenTypes = compact_default(flatten_default(values_default(lexerDefinition.modes)));
    const concreteTokenTypes = reject_default(allTokenTypes, (currType) => currType[PATTERN] === Lexer.NA);
    const terminatorCharCodes = getCharCodes(lineTerminatorCharacters);
    if (trackLines) {
      forEach_default(concreteTokenTypes, (tokType) => {
        const currIssue = checkLineBreaksIssues(tokType, terminatorCharCodes);
        if (currIssue !== false) {
          const message = buildLineBreakIssueMessage(tokType, currIssue);
          const warningDescriptor = {
            message,
            type: currIssue.issue,
            tokenType: tokType
          };
          warnings.push(warningDescriptor);
        } else {
          if (has_default(tokType, "LINE_BREAKS")) {
            if (tokType.LINE_BREAKS === true) {
              hasAnyLineBreak = true;
            }
          } else {
            if (canMatchCharCode(terminatorCharCodes, tokType.PATTERN)) {
              hasAnyLineBreak = true;
            }
          }
        }
      });
    }
    if (trackLines && !hasAnyLineBreak) {
      warnings.push({
        message: "Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",
        type: LexerDefinitionErrorType.NO_LINE_BREAKS_FLAGS
      });
    }
    return warnings;
  }
  function cloneEmptyGroups(emptyGroups) {
    const clonedResult = {};
    const groupKeys = keys_default(emptyGroups);
    forEach_default(groupKeys, (currKey) => {
      const currGroupValue = emptyGroups[currKey];
      if (isArray_default(currGroupValue)) {
        clonedResult[currKey] = [];
      } else {
        throw Error("non exhaustive match");
      }
    });
    return clonedResult;
  }
  function isCustomPattern(tokenType) {
    const pattern = tokenType.PATTERN;
    if (isRegExp_default(pattern)) {
      return false;
    } else if (isFunction_default(pattern)) {
      return true;
    } else if (has_default(pattern, "exec")) {
      return true;
    } else if (isString_default(pattern)) {
      return false;
    } else {
      throw Error("non exhaustive match");
    }
  }
  function isShortPattern(pattern) {
    if (isString_default(pattern) && pattern.length === 1) {
      return pattern.charCodeAt(0);
    } else {
      return false;
    }
  }
  var LineTerminatorOptimizedTester = {
    // implements /\n|\r\n?/g.test
    test: function(text) {
      const len = text.length;
      for (let i = this.lastIndex; i < len; i++) {
        const c = text.charCodeAt(i);
        if (c === 10) {
          this.lastIndex = i + 1;
          return true;
        } else if (c === 13) {
          if (text.charCodeAt(i + 1) === 10) {
            this.lastIndex = i + 2;
          } else {
            this.lastIndex = i + 1;
          }
          return true;
        }
      }
      return false;
    },
    lastIndex: 0
  };
  function checkLineBreaksIssues(tokType, lineTerminatorCharCodes) {
    if (has_default(tokType, "LINE_BREAKS")) {
      return false;
    } else {
      if (isRegExp_default(tokType.PATTERN)) {
        try {
          canMatchCharCode(lineTerminatorCharCodes, tokType.PATTERN);
        } catch (e) {
          return {
            issue: LexerDefinitionErrorType.IDENTIFY_TERMINATOR,
            errMsg: e.message
          };
        }
        return false;
      } else if (isString_default(tokType.PATTERN)) {
        return false;
      } else if (isCustomPattern(tokType)) {
        return { issue: LexerDefinitionErrorType.CUSTOM_LINE_BREAK };
      } else {
        throw Error("non exhaustive match");
      }
    }
  }
  function buildLineBreakIssueMessage(tokType, details) {
    if (details.issue === LexerDefinitionErrorType.IDENTIFY_TERMINATOR) {
      return `Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${tokType.name}> Token Type
	 Root cause: ${details.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`;
    } else if (details.issue === LexerDefinitionErrorType.CUSTOM_LINE_BREAK) {
      return `Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${tokType.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`;
    } else {
      throw Error("non exhaustive match");
    }
  }
  function getCharCodes(charsOrCodes) {
    const charCodes = map_default(charsOrCodes, (numOrString) => {
      if (isString_default(numOrString)) {
        return numOrString.charCodeAt(0);
      } else {
        return numOrString;
      }
    });
    return charCodes;
  }
  function addToMapOfArrays(map3, key, value) {
    if (map3[key] === void 0) {
      map3[key] = [value];
    } else {
      map3[key].push(value);
    }
  }
  var minOptimizationVal = 256;
  var charCodeToOptimizedIdxMap = [];
  function charCodeToOptimizedIndex(charCode) {
    return charCode < minOptimizationVal ? charCode : charCodeToOptimizedIdxMap[charCode];
  }
  function initCharCodeToOptimizedIndexMap() {
    if (isEmpty_default(charCodeToOptimizedIdxMap)) {
      charCodeToOptimizedIdxMap = new Array(65536);
      for (let i = 0; i < 65536; i++) {
        charCodeToOptimizedIdxMap[i] = i > 255 ? 255 + ~~(i / 255) : i;
      }
    }
  }

  // ../../node_modules/chevrotain/lib/src/scan/tokens.js
  function tokenStructuredMatcher(tokInstance, tokConstructor) {
    const instanceType = tokInstance.tokenTypeIdx;
    if (instanceType === tokConstructor.tokenTypeIdx) {
      return true;
    } else {
      return tokConstructor.isParent === true && tokConstructor.categoryMatchesMap[instanceType] === true;
    }
  }
  function tokenStructuredMatcherNoCategories(token, tokType) {
    return token.tokenTypeIdx === tokType.tokenTypeIdx;
  }
  var tokenShortNameIdx = 1;
  var tokenIdxToClass = {};
  function augmentTokenTypes(tokenTypes) {
    const tokenTypesAndParents = expandCategories(tokenTypes);
    assignTokenDefaultProps(tokenTypesAndParents);
    assignCategoriesMapProp(tokenTypesAndParents);
    assignCategoriesTokensProp(tokenTypesAndParents);
    forEach_default(tokenTypesAndParents, (tokType) => {
      tokType.isParent = tokType.categoryMatches.length > 0;
    });
  }
  function expandCategories(tokenTypes) {
    let result = clone_default(tokenTypes);
    let categories = tokenTypes;
    let searching = true;
    while (searching) {
      categories = compact_default(flatten_default(map_default(categories, (currTokType) => currTokType.CATEGORIES)));
      const newCategories = difference_default(categories, result);
      result = result.concat(newCategories);
      if (isEmpty_default(newCategories)) {
        searching = false;
      } else {
        categories = newCategories;
      }
    }
    return result;
  }
  function assignTokenDefaultProps(tokenTypes) {
    forEach_default(tokenTypes, (currTokType) => {
      if (!hasShortKeyProperty(currTokType)) {
        tokenIdxToClass[tokenShortNameIdx] = currTokType;
        currTokType.tokenTypeIdx = tokenShortNameIdx++;
      }
      if (hasCategoriesProperty(currTokType) && !isArray_default(currTokType.CATEGORIES)) {
        currTokType.CATEGORIES = [currTokType.CATEGORIES];
      }
      if (!hasCategoriesProperty(currTokType)) {
        currTokType.CATEGORIES = [];
      }
      if (!hasExtendingTokensTypesProperty(currTokType)) {
        currTokType.categoryMatches = [];
      }
      if (!hasExtendingTokensTypesMapProperty(currTokType)) {
        currTokType.categoryMatchesMap = {};
      }
    });
  }
  function assignCategoriesTokensProp(tokenTypes) {
    forEach_default(tokenTypes, (currTokType) => {
      currTokType.categoryMatches = [];
      forEach_default(currTokType.categoryMatchesMap, (val, key) => {
        currTokType.categoryMatches.push(tokenIdxToClass[key].tokenTypeIdx);
      });
    });
  }
  function assignCategoriesMapProp(tokenTypes) {
    forEach_default(tokenTypes, (currTokType) => {
      singleAssignCategoriesToksMap([], currTokType);
    });
  }
  function singleAssignCategoriesToksMap(path, nextNode) {
    forEach_default(path, (pathNode) => {
      nextNode.categoryMatchesMap[pathNode.tokenTypeIdx] = true;
    });
    forEach_default(nextNode.CATEGORIES, (nextCategory) => {
      const newPath = path.concat(nextNode);
      if (!includes_default(newPath, nextCategory)) {
        singleAssignCategoriesToksMap(newPath, nextCategory);
      }
    });
  }
  function hasShortKeyProperty(tokType) {
    return has_default(tokType, "tokenTypeIdx");
  }
  function hasCategoriesProperty(tokType) {
    return has_default(tokType, "CATEGORIES");
  }
  function hasExtendingTokensTypesProperty(tokType) {
    return has_default(tokType, "categoryMatches");
  }
  function hasExtendingTokensTypesMapProperty(tokType) {
    return has_default(tokType, "categoryMatchesMap");
  }
  function isTokenType(tokType) {
    return has_default(tokType, "tokenTypeIdx");
  }

  // ../../node_modules/chevrotain/lib/src/scan/lexer_errors_public.js
  var defaultLexerErrorProvider = {
    buildUnableToPopLexerModeMessage(token) {
      return `Unable to pop Lexer Mode after encountering Token ->${token.image}<- The Mode Stack is empty`;
    },
    buildUnexpectedCharactersMessage(fullText, startOffset, length, line, column, mode) {
      return `unexpected character: ->${fullText.charAt(startOffset)}<- at offset: ${startOffset}, skipped ${length} characters.`;
    }
  };

  // ../../node_modules/chevrotain/lib/src/scan/lexer_public.js
  var LexerDefinitionErrorType;
  (function(LexerDefinitionErrorType2) {
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["MISSING_PATTERN"] = 0] = "MISSING_PATTERN";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["INVALID_PATTERN"] = 1] = "INVALID_PATTERN";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["EOI_ANCHOR_FOUND"] = 2] = "EOI_ANCHOR_FOUND";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["UNSUPPORTED_FLAGS_FOUND"] = 3] = "UNSUPPORTED_FLAGS_FOUND";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["DUPLICATE_PATTERNS_FOUND"] = 4] = "DUPLICATE_PATTERNS_FOUND";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["INVALID_GROUP_TYPE_FOUND"] = 5] = "INVALID_GROUP_TYPE_FOUND";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["PUSH_MODE_DOES_NOT_EXIST"] = 6] = "PUSH_MODE_DOES_NOT_EXIST";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"] = 7] = "MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"] = 8] = "MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"] = 9] = "MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"] = 10] = "LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["SOI_ANCHOR_FOUND"] = 11] = "SOI_ANCHOR_FOUND";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["EMPTY_MATCH_PATTERN"] = 12] = "EMPTY_MATCH_PATTERN";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["NO_LINE_BREAKS_FLAGS"] = 13] = "NO_LINE_BREAKS_FLAGS";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["UNREACHABLE_PATTERN"] = 14] = "UNREACHABLE_PATTERN";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["IDENTIFY_TERMINATOR"] = 15] = "IDENTIFY_TERMINATOR";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["CUSTOM_LINE_BREAK"] = 16] = "CUSTOM_LINE_BREAK";
    LexerDefinitionErrorType2[LexerDefinitionErrorType2["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"] = 17] = "MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE";
  })(LexerDefinitionErrorType || (LexerDefinitionErrorType = {}));
  var DEFAULT_LEXER_CONFIG = {
    deferDefinitionErrorsHandling: false,
    positionTracking: "full",
    lineTerminatorsPattern: /\n|\r\n?/g,
    lineTerminatorCharacters: ["\n", "\r"],
    ensureOptimizations: false,
    safeMode: false,
    errorMessageProvider: defaultLexerErrorProvider,
    traceInitPerf: false,
    skipValidations: false,
    recoveryEnabled: true
  };
  Object.freeze(DEFAULT_LEXER_CONFIG);
  var Lexer = class {
    constructor(lexerDefinition, config = DEFAULT_LEXER_CONFIG) {
      this.lexerDefinition = lexerDefinition;
      this.lexerDefinitionErrors = [];
      this.lexerDefinitionWarning = [];
      this.patternIdxToConfig = {};
      this.charCodeToPatternIdxToConfig = {};
      this.modes = [];
      this.emptyGroups = {};
      this.trackStartLines = true;
      this.trackEndLines = true;
      this.hasCustom = false;
      this.canModeBeOptimized = {};
      this.TRACE_INIT = (phaseDesc, phaseImpl) => {
        if (this.traceInitPerf === true) {
          this.traceInitIndent++;
          const indent = new Array(this.traceInitIndent + 1).join("	");
          if (this.traceInitIndent < this.traceInitMaxIdent) {
            console.log(`${indent}--> <${phaseDesc}>`);
          }
          const { time, value } = timer(phaseImpl);
          const traceMethod = time > 10 ? console.warn : console.log;
          if (this.traceInitIndent < this.traceInitMaxIdent) {
            traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
          }
          this.traceInitIndent--;
          return value;
        } else {
          return phaseImpl();
        }
      };
      if (typeof config === "boolean") {
        throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported");
      }
      this.config = assign_default({}, DEFAULT_LEXER_CONFIG, config);
      const traceInitVal = this.config.traceInitPerf;
      if (traceInitVal === true) {
        this.traceInitMaxIdent = Infinity;
        this.traceInitPerf = true;
      } else if (typeof traceInitVal === "number") {
        this.traceInitMaxIdent = traceInitVal;
        this.traceInitPerf = true;
      }
      this.traceInitIndent = -1;
      this.TRACE_INIT("Lexer Constructor", () => {
        let actualDefinition;
        let hasOnlySingleMode = true;
        this.TRACE_INIT("Lexer Config handling", () => {
          if (this.config.lineTerminatorsPattern === DEFAULT_LEXER_CONFIG.lineTerminatorsPattern) {
            this.config.lineTerminatorsPattern = LineTerminatorOptimizedTester;
          } else {
            if (this.config.lineTerminatorCharacters === DEFAULT_LEXER_CONFIG.lineTerminatorCharacters) {
              throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS");
            }
          }
          if (config.safeMode && config.ensureOptimizations) {
            throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.');
          }
          this.trackStartLines = /full|onlyStart/i.test(this.config.positionTracking);
          this.trackEndLines = /full/i.test(this.config.positionTracking);
          if (isArray_default(lexerDefinition)) {
            actualDefinition = {
              modes: { defaultMode: clone_default(lexerDefinition) },
              defaultMode: DEFAULT_MODE
            };
          } else {
            hasOnlySingleMode = false;
            actualDefinition = clone_default(lexerDefinition);
          }
        });
        if (this.config.skipValidations === false) {
          this.TRACE_INIT("performRuntimeChecks", () => {
            this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(performRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
          });
          this.TRACE_INIT("performWarningRuntimeChecks", () => {
            this.lexerDefinitionWarning = this.lexerDefinitionWarning.concat(performWarningRuntimeChecks(actualDefinition, this.trackStartLines, this.config.lineTerminatorCharacters));
          });
        }
        actualDefinition.modes = actualDefinition.modes ? actualDefinition.modes : {};
        forEach_default(actualDefinition.modes, (currModeValue, currModeName) => {
          actualDefinition.modes[currModeName] = reject_default(currModeValue, (currTokType) => isUndefined_default(currTokType));
        });
        const allModeNames = keys_default(actualDefinition.modes);
        forEach_default(actualDefinition.modes, (currModDef, currModName) => {
          this.TRACE_INIT(`Mode: <${currModName}> processing`, () => {
            this.modes.push(currModName);
            if (this.config.skipValidations === false) {
              this.TRACE_INIT(`validatePatterns`, () => {
                this.lexerDefinitionErrors = this.lexerDefinitionErrors.concat(validatePatterns(currModDef, allModeNames));
              });
            }
            if (isEmpty_default(this.lexerDefinitionErrors)) {
              augmentTokenTypes(currModDef);
              let currAnalyzeResult;
              this.TRACE_INIT(`analyzeTokenTypes`, () => {
                currAnalyzeResult = analyzeTokenTypes(currModDef, {
                  lineTerminatorCharacters: this.config.lineTerminatorCharacters,
                  positionTracking: config.positionTracking,
                  ensureOptimizations: config.ensureOptimizations,
                  safeMode: config.safeMode,
                  tracer: this.TRACE_INIT
                });
              });
              this.patternIdxToConfig[currModName] = currAnalyzeResult.patternIdxToConfig;
              this.charCodeToPatternIdxToConfig[currModName] = currAnalyzeResult.charCodeToPatternIdxToConfig;
              this.emptyGroups = assign_default({}, this.emptyGroups, currAnalyzeResult.emptyGroups);
              this.hasCustom = currAnalyzeResult.hasCustom || this.hasCustom;
              this.canModeBeOptimized[currModName] = currAnalyzeResult.canBeOptimized;
            }
          });
        });
        this.defaultMode = actualDefinition.defaultMode;
        if (!isEmpty_default(this.lexerDefinitionErrors) && !this.config.deferDefinitionErrorsHandling) {
          const allErrMessages = map_default(this.lexerDefinitionErrors, (error) => {
            return error.message;
          });
          const allErrMessagesString = allErrMessages.join("-----------------------\n");
          throw new Error("Errors detected in definition of Lexer:\n" + allErrMessagesString);
        }
        forEach_default(this.lexerDefinitionWarning, (warningDescriptor) => {
          PRINT_WARNING(warningDescriptor.message);
        });
        this.TRACE_INIT("Choosing sub-methods implementations", () => {
          if (SUPPORT_STICKY) {
            this.chopInput = identity_default;
            this.match = this.matchWithTest;
          } else {
            this.updateLastIndex = noop_default;
            this.match = this.matchWithExec;
          }
          if (hasOnlySingleMode) {
            this.handleModes = noop_default;
          }
          if (this.trackStartLines === false) {
            this.computeNewColumn = identity_default;
          }
          if (this.trackEndLines === false) {
            this.updateTokenEndLineColumnLocation = noop_default;
          }
          if (/full/i.test(this.config.positionTracking)) {
            this.createTokenInstance = this.createFullToken;
          } else if (/onlyStart/i.test(this.config.positionTracking)) {
            this.createTokenInstance = this.createStartOnlyToken;
          } else if (/onlyOffset/i.test(this.config.positionTracking)) {
            this.createTokenInstance = this.createOffsetOnlyToken;
          } else {
            throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`);
          }
          if (this.hasCustom) {
            this.addToken = this.addTokenUsingPush;
            this.handlePayload = this.handlePayloadWithCustom;
          } else {
            this.addToken = this.addTokenUsingMemberAccess;
            this.handlePayload = this.handlePayloadNoCustom;
          }
        });
        this.TRACE_INIT("Failed Optimization Warnings", () => {
          const unOptimizedModes = reduce_default(this.canModeBeOptimized, (cannotBeOptimized, canBeOptimized, modeName) => {
            if (canBeOptimized === false) {
              cannotBeOptimized.push(modeName);
            }
            return cannotBeOptimized;
          }, []);
          if (config.ensureOptimizations && !isEmpty_default(unOptimizedModes)) {
            throw Error(`Lexer Modes: < ${unOptimizedModes.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`);
          }
        });
        this.TRACE_INIT("clearRegExpParserCache", () => {
          clearRegExpParserCache();
        });
        this.TRACE_INIT("toFastProperties", () => {
          toFastProperties(this);
        });
      });
    }
    tokenize(text, initialMode = this.defaultMode) {
      if (!isEmpty_default(this.lexerDefinitionErrors)) {
        const allErrMessages = map_default(this.lexerDefinitionErrors, (error) => {
          return error.message;
        });
        const allErrMessagesString = allErrMessages.join("-----------------------\n");
        throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n" + allErrMessagesString);
      }
      return this.tokenizeInternal(text, initialMode);
    }
    // There is quite a bit of duplication between this and "tokenizeInternalLazy"
    // This is intentional due to performance considerations.
    // this method also used quite a bit of `!` none null assertions because it is too optimized
    // for `tsc` to always understand it is "safe"
    tokenizeInternal(text, initialMode) {
      let i, j, k2, matchAltImage, longerAlt, matchedImage, payload, altPayload, imageLength, group, tokType, newToken, errLength, droppedChar, msg, match;
      const orgText = text;
      const orgLength = orgText.length;
      let offset = 0;
      let matchedTokensIndex = 0;
      const guessedNumberOfTokens = this.hasCustom ? 0 : Math.floor(text.length / 10);
      const matchedTokens = new Array(guessedNumberOfTokens);
      const errors = [];
      let line = this.trackStartLines ? 1 : void 0;
      let column = this.trackStartLines ? 1 : void 0;
      const groups = cloneEmptyGroups(this.emptyGroups);
      const trackLines = this.trackStartLines;
      const lineTerminatorPattern = this.config.lineTerminatorsPattern;
      let currModePatternsLength = 0;
      let patternIdxToConfig = [];
      let currCharCodeToPatternIdxToConfig = [];
      const modeStack = [];
      const emptyArray = [];
      Object.freeze(emptyArray);
      let getPossiblePatterns;
      function getPossiblePatternsSlow() {
        return patternIdxToConfig;
      }
      function getPossiblePatternsOptimized(charCode) {
        const optimizedCharIdx = charCodeToOptimizedIndex(charCode);
        const possiblePatterns = currCharCodeToPatternIdxToConfig[optimizedCharIdx];
        if (possiblePatterns === void 0) {
          return emptyArray;
        } else {
          return possiblePatterns;
        }
      }
      const pop_mode = (popToken) => {
        if (modeStack.length === 1 && // if we have both a POP_MODE and a PUSH_MODE this is in-fact a "transition"
        // So no error should occur.
        popToken.tokenType.PUSH_MODE === void 0) {
          const msg2 = this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(popToken);
          errors.push({
            offset: popToken.startOffset,
            line: popToken.startLine,
            column: popToken.startColumn,
            length: popToken.image.length,
            message: msg2
          });
        } else {
          modeStack.pop();
          const newMode = last_default(modeStack);
          patternIdxToConfig = this.patternIdxToConfig[newMode];
          currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
          currModePatternsLength = patternIdxToConfig.length;
          const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
          if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) {
            getPossiblePatterns = getPossiblePatternsOptimized;
          } else {
            getPossiblePatterns = getPossiblePatternsSlow;
          }
        }
      };
      function push_mode(newMode) {
        modeStack.push(newMode);
        currCharCodeToPatternIdxToConfig = this.charCodeToPatternIdxToConfig[newMode];
        patternIdxToConfig = this.patternIdxToConfig[newMode];
        currModePatternsLength = patternIdxToConfig.length;
        currModePatternsLength = patternIdxToConfig.length;
        const modeCanBeOptimized = this.canModeBeOptimized[newMode] && this.config.safeMode === false;
        if (currCharCodeToPatternIdxToConfig && modeCanBeOptimized) {
          getPossiblePatterns = getPossiblePatternsOptimized;
        } else {
          getPossiblePatterns = getPossiblePatternsSlow;
        }
      }
      push_mode.call(this, initialMode);
      let currConfig;
      const recoveryEnabled = this.config.recoveryEnabled;
      while (offset < orgLength) {
        matchedImage = null;
        const nextCharCode = orgText.charCodeAt(offset);
        const chosenPatternIdxToConfig = getPossiblePatterns(nextCharCode);
        const chosenPatternsLength = chosenPatternIdxToConfig.length;
        for (i = 0; i < chosenPatternsLength; i++) {
          currConfig = chosenPatternIdxToConfig[i];
          const currPattern = currConfig.pattern;
          payload = null;
          const singleCharCode = currConfig.short;
          if (singleCharCode !== false) {
            if (nextCharCode === singleCharCode) {
              matchedImage = currPattern;
            }
          } else if (currConfig.isCustom === true) {
            match = currPattern.exec(orgText, offset, matchedTokens, groups);
            if (match !== null) {
              matchedImage = match[0];
              if (match.payload !== void 0) {
                payload = match.payload;
              }
            } else {
              matchedImage = null;
            }
          } else {
            this.updateLastIndex(currPattern, offset);
            matchedImage = this.match(currPattern, text, offset);
          }
          if (matchedImage !== null) {
            longerAlt = currConfig.longerAlt;
            if (longerAlt !== void 0) {
              const longerAltLength = longerAlt.length;
              for (k2 = 0; k2 < longerAltLength; k2++) {
                const longerAltConfig = patternIdxToConfig[longerAlt[k2]];
                const longerAltPattern = longerAltConfig.pattern;
                altPayload = null;
                if (longerAltConfig.isCustom === true) {
                  match = longerAltPattern.exec(orgText, offset, matchedTokens, groups);
                  if (match !== null) {
                    matchAltImage = match[0];
                    if (match.payload !== void 0) {
                      altPayload = match.payload;
                    }
                  } else {
                    matchAltImage = null;
                  }
                } else {
                  this.updateLastIndex(longerAltPattern, offset);
                  matchAltImage = this.match(longerAltPattern, text, offset);
                }
                if (matchAltImage && matchAltImage.length > matchedImage.length) {
                  matchedImage = matchAltImage;
                  payload = altPayload;
                  currConfig = longerAltConfig;
                  break;
                }
              }
            }
            break;
          }
        }
        if (matchedImage !== null) {
          imageLength = matchedImage.length;
          group = currConfig.group;
          if (group !== void 0) {
            tokType = currConfig.tokenTypeIdx;
            newToken = this.createTokenInstance(matchedImage, offset, tokType, currConfig.tokenType, line, column, imageLength);
            this.handlePayload(newToken, payload);
            if (group === false) {
              matchedTokensIndex = this.addToken(matchedTokens, matchedTokensIndex, newToken);
            } else {
              groups[group].push(newToken);
            }
          }
          text = this.chopInput(text, imageLength);
          offset = offset + imageLength;
          column = this.computeNewColumn(column, imageLength);
          if (trackLines === true && currConfig.canLineTerminator === true) {
            let numOfLTsInMatch = 0;
            let foundTerminator;
            let lastLTEndOffset;
            lineTerminatorPattern.lastIndex = 0;
            do {
              foundTerminator = lineTerminatorPattern.test(matchedImage);
              if (foundTerminator === true) {
                lastLTEndOffset = lineTerminatorPattern.lastIndex - 1;
                numOfLTsInMatch++;
              }
            } while (foundTerminator === true);
            if (numOfLTsInMatch !== 0) {
              line = line + numOfLTsInMatch;
              column = imageLength - lastLTEndOffset;
              this.updateTokenEndLineColumnLocation(newToken, group, lastLTEndOffset, numOfLTsInMatch, line, column, imageLength);
            }
          }
          this.handleModes(currConfig, pop_mode, push_mode, newToken);
        } else {
          const errorStartOffset = offset;
          const errorLine = line;
          const errorColumn = column;
          let foundResyncPoint = recoveryEnabled === false;
          while (foundResyncPoint === false && offset < orgLength) {
            text = this.chopInput(text, 1);
            offset++;
            for (j = 0; j < currModePatternsLength; j++) {
              const currConfig2 = patternIdxToConfig[j];
              const currPattern = currConfig2.pattern;
              const singleCharCode = currConfig2.short;
              if (singleCharCode !== false) {
                if (orgText.charCodeAt(offset) === singleCharCode) {
                  foundResyncPoint = true;
                }
              } else if (currConfig2.isCustom === true) {
                foundResyncPoint = currPattern.exec(orgText, offset, matchedTokens, groups) !== null;
              } else {
                this.updateLastIndex(currPattern, offset);
                foundResyncPoint = currPattern.exec(text) !== null;
              }
              if (foundResyncPoint === true) {
                break;
              }
            }
          }
          errLength = offset - errorStartOffset;
          column = this.computeNewColumn(column, errLength);
          msg = this.config.errorMessageProvider.buildUnexpectedCharactersMessage(orgText, errorStartOffset, errLength, errorLine, errorColumn, last_default(modeStack));
          errors.push({
            offset: errorStartOffset,
            line: errorLine,
            column: errorColumn,
            length: errLength,
            message: msg
          });
          if (recoveryEnabled === false) {
            break;
          }
        }
      }
      if (!this.hasCustom) {
        matchedTokens.length = matchedTokensIndex;
      }
      return {
        tokens: matchedTokens,
        groups,
        errors
      };
    }
    handleModes(config, pop_mode, push_mode, newToken) {
      if (config.pop === true) {
        const pushMode = config.push;
        pop_mode(newToken);
        if (pushMode !== void 0) {
          push_mode.call(this, pushMode);
        }
      } else if (config.push !== void 0) {
        push_mode.call(this, config.push);
      }
    }
    chopInput(text, length) {
      return text.substring(length);
    }
    updateLastIndex(regExp, newLastIndex) {
      regExp.lastIndex = newLastIndex;
    }
    // TODO: decrease this under 600 characters? inspect stripping comments option in TSC compiler
    updateTokenEndLineColumnLocation(newToken, group, lastLTIdx, numOfLTsInMatch, line, column, imageLength) {
      let lastCharIsLT, fixForEndingInLT;
      if (group !== void 0) {
        lastCharIsLT = lastLTIdx === imageLength - 1;
        fixForEndingInLT = lastCharIsLT ? -1 : 0;
        if (!(numOfLTsInMatch === 1 && lastCharIsLT === true)) {
          newToken.endLine = line + fixForEndingInLT;
          newToken.endColumn = column - 1 + -fixForEndingInLT;
        }
      }
    }
    computeNewColumn(oldColumn, imageLength) {
      return oldColumn + imageLength;
    }
    createOffsetOnlyToken(image, startOffset, tokenTypeIdx, tokenType) {
      return {
        image,
        startOffset,
        tokenTypeIdx,
        tokenType
      };
    }
    createStartOnlyToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn) {
      return {
        image,
        startOffset,
        startLine,
        startColumn,
        tokenTypeIdx,
        tokenType
      };
    }
    createFullToken(image, startOffset, tokenTypeIdx, tokenType, startLine, startColumn, imageLength) {
      return {
        image,
        startOffset,
        endOffset: startOffset + imageLength - 1,
        startLine,
        endLine: startLine,
        startColumn,
        endColumn: startColumn + imageLength - 1,
        tokenTypeIdx,
        tokenType
      };
    }
    addTokenUsingPush(tokenVector, index, tokenToAdd) {
      tokenVector.push(tokenToAdd);
      return index;
    }
    addTokenUsingMemberAccess(tokenVector, index, tokenToAdd) {
      tokenVector[index] = tokenToAdd;
      index++;
      return index;
    }
    handlePayloadNoCustom(token, payload) {
    }
    handlePayloadWithCustom(token, payload) {
      if (payload !== null) {
        token.payload = payload;
      }
    }
    matchWithTest(pattern, text, offset) {
      const found = pattern.test(text);
      if (found === true) {
        return text.substring(offset, pattern.lastIndex);
      }
      return null;
    }
    matchWithExec(pattern, text) {
      const regExpArray = pattern.exec(text);
      return regExpArray !== null ? regExpArray[0] : null;
    }
  };
  Lexer.SKIPPED = "This marks a skipped Token pattern, this means each token identified by it will be consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";
  Lexer.NA = /NOT_APPLICABLE/;

  // ../../node_modules/chevrotain/lib/src/scan/tokens_public.js
  function tokenLabel2(tokType) {
    if (hasTokenLabel2(tokType)) {
      return tokType.LABEL;
    } else {
      return tokType.name;
    }
  }
  function hasTokenLabel2(obj) {
    return isString_default(obj.LABEL) && obj.LABEL !== "";
  }
  var PARENT = "parent";
  var CATEGORIES = "categories";
  var LABEL = "label";
  var GROUP = "group";
  var PUSH_MODE = "push_mode";
  var POP_MODE = "pop_mode";
  var LONGER_ALT = "longer_alt";
  var LINE_BREAKS = "line_breaks";
  var START_CHARS_HINT = "start_chars_hint";
  function createToken(config) {
    return createTokenInternal(config);
  }
  function createTokenInternal(config) {
    const pattern = config.pattern;
    const tokenType = {};
    tokenType.name = config.name;
    if (!isUndefined_default(pattern)) {
      tokenType.PATTERN = pattern;
    }
    if (has_default(config, PARENT)) {
      throw "The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details.";
    }
    if (has_default(config, CATEGORIES)) {
      tokenType.CATEGORIES = config[CATEGORIES];
    }
    augmentTokenTypes([tokenType]);
    if (has_default(config, LABEL)) {
      tokenType.LABEL = config[LABEL];
    }
    if (has_default(config, GROUP)) {
      tokenType.GROUP = config[GROUP];
    }
    if (has_default(config, POP_MODE)) {
      tokenType.POP_MODE = config[POP_MODE];
    }
    if (has_default(config, PUSH_MODE)) {
      tokenType.PUSH_MODE = config[PUSH_MODE];
    }
    if (has_default(config, LONGER_ALT)) {
      tokenType.LONGER_ALT = config[LONGER_ALT];
    }
    if (has_default(config, LINE_BREAKS)) {
      tokenType.LINE_BREAKS = config[LINE_BREAKS];
    }
    if (has_default(config, START_CHARS_HINT)) {
      tokenType.START_CHARS_HINT = config[START_CHARS_HINT];
    }
    return tokenType;
  }
  var EOF = createToken({ name: "EOF", pattern: Lexer.NA });
  augmentTokenTypes([EOF]);
  function createTokenInstance(tokType, image, startOffset, endOffset, startLine, endLine, startColumn, endColumn) {
    return {
      image,
      startOffset,
      endOffset,
      startLine,
      endLine,
      startColumn,
      endColumn,
      tokenTypeIdx: tokType.tokenTypeIdx,
      tokenType: tokType
    };
  }
  function tokenMatcher(token, tokType) {
    return tokenStructuredMatcher(token, tokType);
  }

  // ../../node_modules/chevrotain/lib/src/parse/errors_public.js
  var defaultParserErrorProvider = {
    buildMismatchTokenMessage({ expected, actual, previous, ruleName }) {
      const hasLabel = hasTokenLabel2(expected);
      const expectedMsg = hasLabel ? `--> ${tokenLabel2(expected)} <--` : `token of type --> ${expected.name} <--`;
      const msg = `Expecting ${expectedMsg} but found --> '${actual.image}' <--`;
      return msg;
    },
    buildNotAllInputParsedMessage({ firstRedundant, ruleName }) {
      return "Redundant input, expecting EOF but found: " + firstRedundant.image;
    },
    buildNoViableAltMessage({ expectedPathsPerAlt, actual, previous, customUserDescription, ruleName }) {
      const errPrefix = "Expecting: ";
      const actualText = head_default(actual).image;
      const errSuffix = "\nbut found: '" + actualText + "'";
      if (customUserDescription) {
        return errPrefix + customUserDescription + errSuffix;
      } else {
        const allLookAheadPaths = reduce_default(expectedPathsPerAlt, (result, currAltPaths) => result.concat(currAltPaths), []);
        const nextValidTokenSequences = map_default(allLookAheadPaths, (currPath) => `[${map_default(currPath, (currTokenType) => tokenLabel2(currTokenType)).join(", ")}]`);
        const nextValidSequenceItems = map_default(nextValidTokenSequences, (itemMsg, idx) => `  ${idx + 1}. ${itemMsg}`);
        const calculatedDescription = `one of these possible Token sequences:
${nextValidSequenceItems.join("\n")}`;
        return errPrefix + calculatedDescription + errSuffix;
      }
    },
    buildEarlyExitMessage({ expectedIterationPaths, actual, customUserDescription, ruleName }) {
      const errPrefix = "Expecting: ";
      const actualText = head_default(actual).image;
      const errSuffix = "\nbut found: '" + actualText + "'";
      if (customUserDescription) {
        return errPrefix + customUserDescription + errSuffix;
      } else {
        const nextValidTokenSequences = map_default(expectedIterationPaths, (currPath) => `[${map_default(currPath, (currTokenType) => tokenLabel2(currTokenType)).join(",")}]`);
        const calculatedDescription = `expecting at least one iteration which starts with one of these possible Token sequences::
  <${nextValidTokenSequences.join(" ,")}>`;
        return errPrefix + calculatedDescription + errSuffix;
      }
    }
  };
  Object.freeze(defaultParserErrorProvider);
  var defaultGrammarResolverErrorProvider = {
    buildRuleNotFoundError(topLevelRule, undefinedRule) {
      const msg = "Invalid grammar, reference to a rule which is not defined: ->" + undefinedRule.nonTerminalName + "<-\ninside top level rule: ->" + topLevelRule.name + "<-";
      return msg;
    }
  };
  var defaultGrammarValidatorErrorProvider = {
    buildDuplicateFoundError(topLevelRule, duplicateProds) {
      function getExtraProductionArgument2(prod) {
        if (prod instanceof Terminal) {
          return prod.terminalType.name;
        } else if (prod instanceof NonTerminal) {
          return prod.nonTerminalName;
        } else {
          return "";
        }
      }
      const topLevelName = topLevelRule.name;
      const duplicateProd = head_default(duplicateProds);
      const index = duplicateProd.idx;
      const dslName = getProductionDslName(duplicateProd);
      const extraArgument = getExtraProductionArgument2(duplicateProd);
      const hasExplicitIndex = index > 0;
      let msg = `->${dslName}${hasExplicitIndex ? index : ""}<- ${extraArgument ? `with argument: ->${extraArgument}<-` : ""}
                  appears more than once (${duplicateProds.length} times) in the top level rule: ->${topLevelName}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;
      msg = msg.replace(/[ \t]+/g, " ");
      msg = msg.replace(/\s\s+/g, "\n");
      return msg;
    },
    buildNamespaceConflictError(rule) {
      const errMsg = `Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${rule.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;
      return errMsg;
    },
    buildAlternationPrefixAmbiguityError(options) {
      const pathMsg = map_default(options.prefixPath, (currTok) => tokenLabel2(currTok)).join(", ");
      const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
      const errMsg = `Ambiguous alternatives: <${options.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,
<${pathMsg}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;
      return errMsg;
    },
    buildAlternationAmbiguityError(options) {
      const pathMsg = map_default(options.prefixPath, (currtok) => tokenLabel2(currtok)).join(", ");
      const occurrence = options.alternation.idx === 0 ? "" : options.alternation.idx;
      let currMessage = `Ambiguous Alternatives Detected: <${options.ambiguityIndices.join(" ,")}> in <OR${occurrence}> inside <${options.topLevelRule.name}> Rule,
<${pathMsg}> may appears as a prefix path in all these alternatives.
`;
      currMessage = currMessage + `See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;
      return currMessage;
    },
    buildEmptyRepetitionError(options) {
      let dslName = getProductionDslName(options.repetition);
      if (options.repetition.idx !== 0) {
        dslName += options.repetition.idx;
      }
      const errMsg = `The repetition <${dslName}> within Rule <${options.topLevelRule.name}> can never consume any tokens.
This could lead to an infinite loop.`;
      return errMsg;
    },
    // TODO: remove - `errors_public` from nyc.config.js exclude
    //       once this method is fully removed from this file
    buildTokenNameError(options) {
      return "deprecated";
    },
    buildEmptyAlternationError(options) {
      const errMsg = `Ambiguous empty alternative: <${options.emptyChoiceIdx + 1}> in <OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.
Only the last alternative may be an empty alternative.`;
      return errMsg;
    },
    buildTooManyAlternativesError(options) {
      const errMsg = `An Alternation cannot have more than 256 alternatives:
<OR${options.alternation.idx}> inside <${options.topLevelRule.name}> Rule.
 has ${options.alternation.definition.length + 1} alternatives.`;
      return errMsg;
    },
    buildLeftRecursionError(options) {
      const ruleName = options.topLevelRule.name;
      const pathNames = map_default(options.leftRecursionPath, (currRule) => currRule.name);
      const leftRecursivePath = `${ruleName} --> ${pathNames.concat([ruleName]).join(" --> ")}`;
      const errMsg = `Left Recursion found in grammar.
rule: <${ruleName}> can be invoked from itself (directly or indirectly)
without consuming any Tokens. The grammar path that causes this is: 
 ${leftRecursivePath}
 To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;
      return errMsg;
    },
    // TODO: remove - `errors_public` from nyc.config.js exclude
    //       once this method is fully removed from this file
    buildInvalidRuleNameError(options) {
      return "deprecated";
    },
    buildDuplicateRuleNameError(options) {
      let ruleName;
      if (options.topLevelRule instanceof Rule) {
        ruleName = options.topLevelRule.name;
      } else {
        ruleName = options.topLevelRule;
      }
      const errMsg = `Duplicate definition, rule: ->${ruleName}<- is already defined in the grammar: ->${options.grammarName}<-`;
      return errMsg;
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/grammar/resolver.js
  function resolveGrammar(topLevels, errMsgProvider) {
    const refResolver = new GastRefResolverVisitor(topLevels, errMsgProvider);
    refResolver.resolveRefs();
    return refResolver.errors;
  }
  var GastRefResolverVisitor = class extends GAstVisitor {
    constructor(nameToTopRule, errMsgProvider) {
      super();
      this.nameToTopRule = nameToTopRule;
      this.errMsgProvider = errMsgProvider;
      this.errors = [];
    }
    resolveRefs() {
      forEach_default(values_default(this.nameToTopRule), (prod) => {
        this.currTopLevel = prod;
        prod.accept(this);
      });
    }
    visitNonTerminal(node) {
      const ref = this.nameToTopRule[node.nonTerminalName];
      if (!ref) {
        const msg = this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel, node);
        this.errors.push({
          message: msg,
          type: ParserDefinitionErrorType.UNRESOLVED_SUBRULE_REF,
          ruleName: this.currTopLevel.name,
          unresolvedRefName: node.nonTerminalName
        });
      } else {
        node.referencedRule = ref;
      }
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/grammar/interpreter.js
  var AbstractNextPossibleTokensWalker = class extends RestWalker {
    constructor(topProd, path) {
      super();
      this.topProd = topProd;
      this.path = path;
      this.possibleTokTypes = [];
      this.nextProductionName = "";
      this.nextProductionOccurrence = 0;
      this.found = false;
      this.isAtEndOfPath = false;
    }
    startWalking() {
      this.found = false;
      if (this.path.ruleStack[0] !== this.topProd.name) {
        throw Error("The path does not start with the walker's top Rule!");
      }
      this.ruleStack = clone_default(this.path.ruleStack).reverse();
      this.occurrenceStack = clone_default(this.path.occurrenceStack).reverse();
      this.ruleStack.pop();
      this.occurrenceStack.pop();
      this.updateExpectedNext();
      this.walk(this.topProd);
      return this.possibleTokTypes;
    }
    walk(prod, prevRest = []) {
      if (!this.found) {
        super.walk(prod, prevRest);
      }
    }
    walkProdRef(refProd, currRest, prevRest) {
      if (refProd.referencedRule.name === this.nextProductionName && refProd.idx === this.nextProductionOccurrence) {
        const fullRest = currRest.concat(prevRest);
        this.updateExpectedNext();
        this.walk(refProd.referencedRule, fullRest);
      }
    }
    updateExpectedNext() {
      if (isEmpty_default(this.ruleStack)) {
        this.nextProductionName = "";
        this.nextProductionOccurrence = 0;
        this.isAtEndOfPath = true;
      } else {
        this.nextProductionName = this.ruleStack.pop();
        this.nextProductionOccurrence = this.occurrenceStack.pop();
      }
    }
  };
  var NextAfterTokenWalker = class extends AbstractNextPossibleTokensWalker {
    constructor(topProd, path) {
      super(topProd, path);
      this.path = path;
      this.nextTerminalName = "";
      this.nextTerminalOccurrence = 0;
      this.nextTerminalName = this.path.lastTok.name;
      this.nextTerminalOccurrence = this.path.lastTokOccurrence;
    }
    walkTerminal(terminal, currRest, prevRest) {
      if (this.isAtEndOfPath && terminal.terminalType.name === this.nextTerminalName && terminal.idx === this.nextTerminalOccurrence && !this.found) {
        const fullRest = currRest.concat(prevRest);
        const restProd = new Alternative({ definition: fullRest });
        this.possibleTokTypes = first(restProd);
        this.found = true;
      }
    }
  };
  var AbstractNextTerminalAfterProductionWalker = class extends RestWalker {
    constructor(topRule, occurrence) {
      super();
      this.topRule = topRule;
      this.occurrence = occurrence;
      this.result = {
        token: void 0,
        occurrence: void 0,
        isEndOfRule: void 0
      };
    }
    startWalking() {
      this.walk(this.topRule);
      return this.result;
    }
  };
  var NextTerminalAfterManyWalker = class extends AbstractNextTerminalAfterProductionWalker {
    walkMany(manyProd, currRest, prevRest) {
      if (manyProd.idx === this.occurrence) {
        const firstAfterMany = head_default(currRest.concat(prevRest));
        this.result.isEndOfRule = firstAfterMany === void 0;
        if (firstAfterMany instanceof Terminal) {
          this.result.token = firstAfterMany.terminalType;
          this.result.occurrence = firstAfterMany.idx;
        }
      } else {
        super.walkMany(manyProd, currRest, prevRest);
      }
    }
  };
  var NextTerminalAfterManySepWalker = class extends AbstractNextTerminalAfterProductionWalker {
    walkManySep(manySepProd, currRest, prevRest) {
      if (manySepProd.idx === this.occurrence) {
        const firstAfterManySep = head_default(currRest.concat(prevRest));
        this.result.isEndOfRule = firstAfterManySep === void 0;
        if (firstAfterManySep instanceof Terminal) {
          this.result.token = firstAfterManySep.terminalType;
          this.result.occurrence = firstAfterManySep.idx;
        }
      } else {
        super.walkManySep(manySepProd, currRest, prevRest);
      }
    }
  };
  var NextTerminalAfterAtLeastOneWalker = class extends AbstractNextTerminalAfterProductionWalker {
    walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
      if (atLeastOneProd.idx === this.occurrence) {
        const firstAfterAtLeastOne = head_default(currRest.concat(prevRest));
        this.result.isEndOfRule = firstAfterAtLeastOne === void 0;
        if (firstAfterAtLeastOne instanceof Terminal) {
          this.result.token = firstAfterAtLeastOne.terminalType;
          this.result.occurrence = firstAfterAtLeastOne.idx;
        }
      } else {
        super.walkAtLeastOne(atLeastOneProd, currRest, prevRest);
      }
    }
  };
  var NextTerminalAfterAtLeastOneSepWalker = class extends AbstractNextTerminalAfterProductionWalker {
    walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest) {
      if (atleastOneSepProd.idx === this.occurrence) {
        const firstAfterfirstAfterAtLeastOneSep = head_default(currRest.concat(prevRest));
        this.result.isEndOfRule = firstAfterfirstAfterAtLeastOneSep === void 0;
        if (firstAfterfirstAfterAtLeastOneSep instanceof Terminal) {
          this.result.token = firstAfterfirstAfterAtLeastOneSep.terminalType;
          this.result.occurrence = firstAfterfirstAfterAtLeastOneSep.idx;
        }
      } else {
        super.walkAtLeastOneSep(atleastOneSepProd, currRest, prevRest);
      }
    }
  };
  function possiblePathsFrom(targetDef, maxLength, currPath = []) {
    currPath = clone_default(currPath);
    let result = [];
    let i = 0;
    function remainingPathWith(nextDef) {
      return nextDef.concat(drop_default(targetDef, i + 1));
    }
    function getAlternativesForProd(definition) {
      const alternatives = possiblePathsFrom(remainingPathWith(definition), maxLength, currPath);
      return result.concat(alternatives);
    }
    while (currPath.length < maxLength && i < targetDef.length) {
      const prod = targetDef[i];
      if (prod instanceof Alternative) {
        return getAlternativesForProd(prod.definition);
      } else if (prod instanceof NonTerminal) {
        return getAlternativesForProd(prod.definition);
      } else if (prod instanceof Option) {
        result = getAlternativesForProd(prod.definition);
      } else if (prod instanceof RepetitionMandatory) {
        const newDef = prod.definition.concat([
          new Repetition({
            definition: prod.definition
          })
        ]);
        return getAlternativesForProd(newDef);
      } else if (prod instanceof RepetitionMandatoryWithSeparator) {
        const newDef = [
          new Alternative({ definition: prod.definition }),
          new Repetition({
            definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition)
          })
        ];
        return getAlternativesForProd(newDef);
      } else if (prod instanceof RepetitionWithSeparator) {
        const newDef = prod.definition.concat([
          new Repetition({
            definition: [new Terminal({ terminalType: prod.separator })].concat(prod.definition)
          })
        ]);
        result = getAlternativesForProd(newDef);
      } else if (prod instanceof Repetition) {
        const newDef = prod.definition.concat([
          new Repetition({
            definition: prod.definition
          })
        ]);
        result = getAlternativesForProd(newDef);
      } else if (prod instanceof Alternation) {
        forEach_default(prod.definition, (currAlt) => {
          if (isEmpty_default(currAlt.definition) === false) {
            result = getAlternativesForProd(currAlt.definition);
          }
        });
        return result;
      } else if (prod instanceof Terminal) {
        currPath.push(prod.terminalType);
      } else {
        throw Error("non exhaustive match");
      }
      i++;
    }
    result.push({
      partialPath: currPath,
      suffixDef: drop_default(targetDef, i)
    });
    return result;
  }
  function nextPossibleTokensAfter(initialDef, tokenVector, tokMatcher, maxLookAhead) {
    const EXIT_NON_TERMINAL = "EXIT_NONE_TERMINAL";
    const EXIT_NON_TERMINAL_ARR = [EXIT_NON_TERMINAL];
    const EXIT_ALTERNATIVE = "EXIT_ALTERNATIVE";
    let foundCompletePath = false;
    const tokenVectorLength = tokenVector.length;
    const minimalAlternativesIndex = tokenVectorLength - maxLookAhead - 1;
    const result = [];
    const possiblePaths = [];
    possiblePaths.push({
      idx: -1,
      def: initialDef,
      ruleStack: [],
      occurrenceStack: []
    });
    while (!isEmpty_default(possiblePaths)) {
      const currPath = possiblePaths.pop();
      if (currPath === EXIT_ALTERNATIVE) {
        if (foundCompletePath && last_default(possiblePaths).idx <= minimalAlternativesIndex) {
          possiblePaths.pop();
        }
        continue;
      }
      const currDef = currPath.def;
      const currIdx = currPath.idx;
      const currRuleStack = currPath.ruleStack;
      const currOccurrenceStack = currPath.occurrenceStack;
      if (isEmpty_default(currDef)) {
        continue;
      }
      const prod = currDef[0];
      if (prod === EXIT_NON_TERMINAL) {
        const nextPath = {
          idx: currIdx,
          def: drop_default(currDef),
          ruleStack: dropRight_default(currRuleStack),
          occurrenceStack: dropRight_default(currOccurrenceStack)
        };
        possiblePaths.push(nextPath);
      } else if (prod instanceof Terminal) {
        if (currIdx < tokenVectorLength - 1) {
          const nextIdx = currIdx + 1;
          const actualToken = tokenVector[nextIdx];
          if (tokMatcher(actualToken, prod.terminalType)) {
            const nextPath = {
              idx: nextIdx,
              def: drop_default(currDef),
              ruleStack: currRuleStack,
              occurrenceStack: currOccurrenceStack
            };
            possiblePaths.push(nextPath);
          }
        } else if (currIdx === tokenVectorLength - 1) {
          result.push({
            nextTokenType: prod.terminalType,
            nextTokenOccurrence: prod.idx,
            ruleStack: currRuleStack,
            occurrenceStack: currOccurrenceStack
          });
          foundCompletePath = true;
        } else {
          throw Error("non exhaustive match");
        }
      } else if (prod instanceof NonTerminal) {
        const newRuleStack = clone_default(currRuleStack);
        newRuleStack.push(prod.nonTerminalName);
        const newOccurrenceStack = clone_default(currOccurrenceStack);
        newOccurrenceStack.push(prod.idx);
        const nextPath = {
          idx: currIdx,
          def: prod.definition.concat(EXIT_NON_TERMINAL_ARR, drop_default(currDef)),
          ruleStack: newRuleStack,
          occurrenceStack: newOccurrenceStack
        };
        possiblePaths.push(nextPath);
      } else if (prod instanceof Option) {
        const nextPathWithout = {
          idx: currIdx,
          def: drop_default(currDef),
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(nextPathWithout);
        possiblePaths.push(EXIT_ALTERNATIVE);
        const nextPathWith = {
          idx: currIdx,
          def: prod.definition.concat(drop_default(currDef)),
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(nextPathWith);
      } else if (prod instanceof RepetitionMandatory) {
        const secondIteration = new Repetition({
          definition: prod.definition,
          idx: prod.idx
        });
        const nextDef = prod.definition.concat([secondIteration], drop_default(currDef));
        const nextPath = {
          idx: currIdx,
          def: nextDef,
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(nextPath);
      } else if (prod instanceof RepetitionMandatoryWithSeparator) {
        const separatorGast = new Terminal({
          terminalType: prod.separator
        });
        const secondIteration = new Repetition({
          definition: [separatorGast].concat(prod.definition),
          idx: prod.idx
        });
        const nextDef = prod.definition.concat([secondIteration], drop_default(currDef));
        const nextPath = {
          idx: currIdx,
          def: nextDef,
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(nextPath);
      } else if (prod instanceof RepetitionWithSeparator) {
        const nextPathWithout = {
          idx: currIdx,
          def: drop_default(currDef),
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(nextPathWithout);
        possiblePaths.push(EXIT_ALTERNATIVE);
        const separatorGast = new Terminal({
          terminalType: prod.separator
        });
        const nthRepetition = new Repetition({
          definition: [separatorGast].concat(prod.definition),
          idx: prod.idx
        });
        const nextDef = prod.definition.concat([nthRepetition], drop_default(currDef));
        const nextPathWith = {
          idx: currIdx,
          def: nextDef,
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(nextPathWith);
      } else if (prod instanceof Repetition) {
        const nextPathWithout = {
          idx: currIdx,
          def: drop_default(currDef),
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(nextPathWithout);
        possiblePaths.push(EXIT_ALTERNATIVE);
        const nthRepetition = new Repetition({
          definition: prod.definition,
          idx: prod.idx
        });
        const nextDef = prod.definition.concat([nthRepetition], drop_default(currDef));
        const nextPathWith = {
          idx: currIdx,
          def: nextDef,
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        };
        possiblePaths.push(nextPathWith);
      } else if (prod instanceof Alternation) {
        for (let i = prod.definition.length - 1; i >= 0; i--) {
          const currAlt = prod.definition[i];
          const currAltPath = {
            idx: currIdx,
            def: currAlt.definition.concat(drop_default(currDef)),
            ruleStack: currRuleStack,
            occurrenceStack: currOccurrenceStack
          };
          possiblePaths.push(currAltPath);
          possiblePaths.push(EXIT_ALTERNATIVE);
        }
      } else if (prod instanceof Alternative) {
        possiblePaths.push({
          idx: currIdx,
          def: prod.definition.concat(drop_default(currDef)),
          ruleStack: currRuleStack,
          occurrenceStack: currOccurrenceStack
        });
      } else if (prod instanceof Rule) {
        possiblePaths.push(expandTopLevelRule(prod, currIdx, currRuleStack, currOccurrenceStack));
      } else {
        throw Error("non exhaustive match");
      }
    }
    return result;
  }
  function expandTopLevelRule(topRule, currIdx, currRuleStack, currOccurrenceStack) {
    const newRuleStack = clone_default(currRuleStack);
    newRuleStack.push(topRule.name);
    const newCurrOccurrenceStack = clone_default(currOccurrenceStack);
    newCurrOccurrenceStack.push(1);
    return {
      idx: currIdx,
      def: topRule.definition,
      ruleStack: newRuleStack,
      occurrenceStack: newCurrOccurrenceStack
    };
  }

  // ../../node_modules/chevrotain/lib/src/parse/grammar/lookahead.js
  var PROD_TYPE;
  (function(PROD_TYPE2) {
    PROD_TYPE2[PROD_TYPE2["OPTION"] = 0] = "OPTION";
    PROD_TYPE2[PROD_TYPE2["REPETITION"] = 1] = "REPETITION";
    PROD_TYPE2[PROD_TYPE2["REPETITION_MANDATORY"] = 2] = "REPETITION_MANDATORY";
    PROD_TYPE2[PROD_TYPE2["REPETITION_MANDATORY_WITH_SEPARATOR"] = 3] = "REPETITION_MANDATORY_WITH_SEPARATOR";
    PROD_TYPE2[PROD_TYPE2["REPETITION_WITH_SEPARATOR"] = 4] = "REPETITION_WITH_SEPARATOR";
    PROD_TYPE2[PROD_TYPE2["ALTERNATION"] = 5] = "ALTERNATION";
  })(PROD_TYPE || (PROD_TYPE = {}));
  function getProdType(prod) {
    if (prod instanceof Option || prod === "Option") {
      return PROD_TYPE.OPTION;
    } else if (prod instanceof Repetition || prod === "Repetition") {
      return PROD_TYPE.REPETITION;
    } else if (prod instanceof RepetitionMandatory || prod === "RepetitionMandatory") {
      return PROD_TYPE.REPETITION_MANDATORY;
    } else if (prod instanceof RepetitionMandatoryWithSeparator || prod === "RepetitionMandatoryWithSeparator") {
      return PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR;
    } else if (prod instanceof RepetitionWithSeparator || prod === "RepetitionWithSeparator") {
      return PROD_TYPE.REPETITION_WITH_SEPARATOR;
    } else if (prod instanceof Alternation || prod === "Alternation") {
      return PROD_TYPE.ALTERNATION;
    } else {
      throw Error("non exhaustive match");
    }
  }
  function buildLookaheadFuncForOr(occurrence, ruleGrammar, maxLookahead, hasPredicates, dynamicTokensEnabled, laFuncBuilder) {
    const lookAheadPaths = getLookaheadPathsForOr(occurrence, ruleGrammar, maxLookahead);
    const tokenMatcher2 = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
    return laFuncBuilder(lookAheadPaths, hasPredicates, tokenMatcher2, dynamicTokensEnabled);
  }
  function buildLookaheadFuncForOptionalProd(occurrence, ruleGrammar, k2, dynamicTokensEnabled, prodType, lookaheadBuilder) {
    const lookAheadPaths = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k2);
    const tokenMatcher2 = areTokenCategoriesNotUsed(lookAheadPaths) ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
    return lookaheadBuilder(lookAheadPaths[0], tokenMatcher2, dynamicTokensEnabled);
  }
  function buildAlternativesLookAheadFunc(alts, hasPredicates, tokenMatcher2, dynamicTokensEnabled) {
    const numOfAlts = alts.length;
    const areAllOneTokenLookahead = every_default(alts, (currAlt) => {
      return every_default(currAlt, (currPath) => {
        return currPath.length === 1;
      });
    });
    if (hasPredicates) {
      return function(orAlts) {
        const predicates = map_default(orAlts, (currAlt) => currAlt.GATE);
        for (let t = 0; t < numOfAlts; t++) {
          const currAlt = alts[t];
          const currNumOfPaths = currAlt.length;
          const currPredicate = predicates[t];
          if (currPredicate !== void 0 && currPredicate.call(this) === false) {
            continue;
          }
          nextPath: for (let j = 0; j < currNumOfPaths; j++) {
            const currPath = currAlt[j];
            const currPathLength = currPath.length;
            for (let i = 0; i < currPathLength; i++) {
              const nextToken = this.LA(i + 1);
              if (tokenMatcher2(nextToken, currPath[i]) === false) {
                continue nextPath;
              }
            }
            return t;
          }
        }
        return void 0;
      };
    } else if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
      const singleTokenAlts = map_default(alts, (currAlt) => {
        return flatten_default(currAlt);
      });
      const choiceToAlt = reduce_default(singleTokenAlts, (result, currAlt, idx) => {
        forEach_default(currAlt, (currTokType) => {
          if (!has_default(result, currTokType.tokenTypeIdx)) {
            result[currTokType.tokenTypeIdx] = idx;
          }
          forEach_default(currTokType.categoryMatches, (currExtendingType) => {
            if (!has_default(result, currExtendingType)) {
              result[currExtendingType] = idx;
            }
          });
        });
        return result;
      }, {});
      return function() {
        const nextToken = this.LA(1);
        return choiceToAlt[nextToken.tokenTypeIdx];
      };
    } else {
      return function() {
        for (let t = 0; t < numOfAlts; t++) {
          const currAlt = alts[t];
          const currNumOfPaths = currAlt.length;
          nextPath: for (let j = 0; j < currNumOfPaths; j++) {
            const currPath = currAlt[j];
            const currPathLength = currPath.length;
            for (let i = 0; i < currPathLength; i++) {
              const nextToken = this.LA(i + 1);
              if (tokenMatcher2(nextToken, currPath[i]) === false) {
                continue nextPath;
              }
            }
            return t;
          }
        }
        return void 0;
      };
    }
  }
  function buildSingleAlternativeLookaheadFunction(alt, tokenMatcher2, dynamicTokensEnabled) {
    const areAllOneTokenLookahead = every_default(alt, (currPath) => {
      return currPath.length === 1;
    });
    const numOfPaths = alt.length;
    if (areAllOneTokenLookahead && !dynamicTokensEnabled) {
      const singleTokensTypes = flatten_default(alt);
      if (singleTokensTypes.length === 1 && isEmpty_default(singleTokensTypes[0].categoryMatches)) {
        const expectedTokenType = singleTokensTypes[0];
        const expectedTokenUniqueKey = expectedTokenType.tokenTypeIdx;
        return function() {
          return this.LA(1).tokenTypeIdx === expectedTokenUniqueKey;
        };
      } else {
        const choiceToAlt = reduce_default(singleTokensTypes, (result, currTokType, idx) => {
          result[currTokType.tokenTypeIdx] = true;
          forEach_default(currTokType.categoryMatches, (currExtendingType) => {
            result[currExtendingType] = true;
          });
          return result;
        }, []);
        return function() {
          const nextToken = this.LA(1);
          return choiceToAlt[nextToken.tokenTypeIdx] === true;
        };
      }
    } else {
      return function() {
        nextPath: for (let j = 0; j < numOfPaths; j++) {
          const currPath = alt[j];
          const currPathLength = currPath.length;
          for (let i = 0; i < currPathLength; i++) {
            const nextToken = this.LA(i + 1);
            if (tokenMatcher2(nextToken, currPath[i]) === false) {
              continue nextPath;
            }
          }
          return true;
        }
        return false;
      };
    }
  }
  var RestDefinitionFinderWalker = class extends RestWalker {
    constructor(topProd, targetOccurrence, targetProdType) {
      super();
      this.topProd = topProd;
      this.targetOccurrence = targetOccurrence;
      this.targetProdType = targetProdType;
    }
    startWalking() {
      this.walk(this.topProd);
      return this.restDef;
    }
    checkIsTarget(node, expectedProdType, currRest, prevRest) {
      if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdType) {
        this.restDef = currRest.concat(prevRest);
        return true;
      }
      return false;
    }
    walkOption(optionProd, currRest, prevRest) {
      if (!this.checkIsTarget(optionProd, PROD_TYPE.OPTION, currRest, prevRest)) {
        super.walkOption(optionProd, currRest, prevRest);
      }
    }
    walkAtLeastOne(atLeastOneProd, currRest, prevRest) {
      if (!this.checkIsTarget(atLeastOneProd, PROD_TYPE.REPETITION_MANDATORY, currRest, prevRest)) {
        super.walkOption(atLeastOneProd, currRest, prevRest);
      }
    }
    walkAtLeastOneSep(atLeastOneSepProd, currRest, prevRest) {
      if (!this.checkIsTarget(atLeastOneSepProd, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, currRest, prevRest)) {
        super.walkOption(atLeastOneSepProd, currRest, prevRest);
      }
    }
    walkMany(manyProd, currRest, prevRest) {
      if (!this.checkIsTarget(manyProd, PROD_TYPE.REPETITION, currRest, prevRest)) {
        super.walkOption(manyProd, currRest, prevRest);
      }
    }
    walkManySep(manySepProd, currRest, prevRest) {
      if (!this.checkIsTarget(manySepProd, PROD_TYPE.REPETITION_WITH_SEPARATOR, currRest, prevRest)) {
        super.walkOption(manySepProd, currRest, prevRest);
      }
    }
  };
  var InsideDefinitionFinderVisitor = class extends GAstVisitor {
    constructor(targetOccurrence, targetProdType, targetRef) {
      super();
      this.targetOccurrence = targetOccurrence;
      this.targetProdType = targetProdType;
      this.targetRef = targetRef;
      this.result = [];
    }
    checkIsTarget(node, expectedProdName) {
      if (node.idx === this.targetOccurrence && this.targetProdType === expectedProdName && (this.targetRef === void 0 || node === this.targetRef)) {
        this.result = node.definition;
      }
    }
    visitOption(node) {
      this.checkIsTarget(node, PROD_TYPE.OPTION);
    }
    visitRepetition(node) {
      this.checkIsTarget(node, PROD_TYPE.REPETITION);
    }
    visitRepetitionMandatory(node) {
      this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY);
    }
    visitRepetitionMandatoryWithSeparator(node) {
      this.checkIsTarget(node, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR);
    }
    visitRepetitionWithSeparator(node) {
      this.checkIsTarget(node, PROD_TYPE.REPETITION_WITH_SEPARATOR);
    }
    visitAlternation(node) {
      this.checkIsTarget(node, PROD_TYPE.ALTERNATION);
    }
  };
  function initializeArrayOfArrays(size) {
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = [];
    }
    return result;
  }
  function pathToHashKeys(path) {
    let keys2 = [""];
    for (let i = 0; i < path.length; i++) {
      const tokType = path[i];
      const longerKeys = [];
      for (let j = 0; j < keys2.length; j++) {
        const currShorterKey = keys2[j];
        longerKeys.push(currShorterKey + "_" + tokType.tokenTypeIdx);
        for (let t = 0; t < tokType.categoryMatches.length; t++) {
          const categoriesKeySuffix = "_" + tokType.categoryMatches[t];
          longerKeys.push(currShorterKey + categoriesKeySuffix);
        }
      }
      keys2 = longerKeys;
    }
    return keys2;
  }
  function isUniquePrefixHash(altKnownPathsKeys, searchPathKeys, idx) {
    for (let currAltIdx = 0; currAltIdx < altKnownPathsKeys.length; currAltIdx++) {
      if (currAltIdx === idx) {
        continue;
      }
      const otherAltKnownPathsKeys = altKnownPathsKeys[currAltIdx];
      for (let searchIdx = 0; searchIdx < searchPathKeys.length; searchIdx++) {
        const searchKey = searchPathKeys[searchIdx];
        if (otherAltKnownPathsKeys[searchKey] === true) {
          return false;
        }
      }
    }
    return true;
  }
  function lookAheadSequenceFromAlternatives(altsDefs, k2) {
    const partialAlts = map_default(altsDefs, (currAlt) => possiblePathsFrom([currAlt], 1));
    const finalResult = initializeArrayOfArrays(partialAlts.length);
    const altsHashes = map_default(partialAlts, (currAltPaths) => {
      const dict = {};
      forEach_default(currAltPaths, (item) => {
        const keys2 = pathToHashKeys(item.partialPath);
        forEach_default(keys2, (currKey) => {
          dict[currKey] = true;
        });
      });
      return dict;
    });
    let newData = partialAlts;
    for (let pathLength = 1; pathLength <= k2; pathLength++) {
      const currDataset = newData;
      newData = initializeArrayOfArrays(currDataset.length);
      for (let altIdx = 0; altIdx < currDataset.length; altIdx++) {
        const currAltPathsAndSuffixes = currDataset[altIdx];
        for (let currPathIdx = 0; currPathIdx < currAltPathsAndSuffixes.length; currPathIdx++) {
          const currPathPrefix = currAltPathsAndSuffixes[currPathIdx].partialPath;
          const suffixDef = currAltPathsAndSuffixes[currPathIdx].suffixDef;
          const prefixKeys = pathToHashKeys(currPathPrefix);
          const isUnique = isUniquePrefixHash(altsHashes, prefixKeys, altIdx);
          if (isUnique || isEmpty_default(suffixDef) || currPathPrefix.length === k2) {
            const currAltResult = finalResult[altIdx];
            if (containsPath(currAltResult, currPathPrefix) === false) {
              currAltResult.push(currPathPrefix);
              for (let j = 0; j < prefixKeys.length; j++) {
                const currKey = prefixKeys[j];
                altsHashes[altIdx][currKey] = true;
              }
            }
          } else {
            const newPartialPathsAndSuffixes = possiblePathsFrom(suffixDef, pathLength + 1, currPathPrefix);
            newData[altIdx] = newData[altIdx].concat(newPartialPathsAndSuffixes);
            forEach_default(newPartialPathsAndSuffixes, (item) => {
              const prefixKeys2 = pathToHashKeys(item.partialPath);
              forEach_default(prefixKeys2, (key) => {
                altsHashes[altIdx][key] = true;
              });
            });
          }
        }
      }
    }
    return finalResult;
  }
  function getLookaheadPathsForOr(occurrence, ruleGrammar, k2, orProd) {
    const visitor = new InsideDefinitionFinderVisitor(occurrence, PROD_TYPE.ALTERNATION, orProd);
    ruleGrammar.accept(visitor);
    return lookAheadSequenceFromAlternatives(visitor.result, k2);
  }
  function getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, k2) {
    const insideDefVisitor = new InsideDefinitionFinderVisitor(occurrence, prodType);
    ruleGrammar.accept(insideDefVisitor);
    const insideDef = insideDefVisitor.result;
    const afterDefWalker = new RestDefinitionFinderWalker(ruleGrammar, occurrence, prodType);
    const afterDef = afterDefWalker.startWalking();
    const insideFlat = new Alternative({ definition: insideDef });
    const afterFlat = new Alternative({ definition: afterDef });
    return lookAheadSequenceFromAlternatives([insideFlat, afterFlat], k2);
  }
  function containsPath(alternative, searchPath) {
    compareOtherPath: for (let i = 0; i < alternative.length; i++) {
      const otherPath = alternative[i];
      if (otherPath.length !== searchPath.length) {
        continue;
      }
      for (let j = 0; j < otherPath.length; j++) {
        const searchTok = searchPath[j];
        const otherTok = otherPath[j];
        const matchingTokens = searchTok === otherTok || otherTok.categoryMatchesMap[searchTok.tokenTypeIdx] !== void 0;
        if (matchingTokens === false) {
          continue compareOtherPath;
        }
      }
      return true;
    }
    return false;
  }
  function isStrictPrefixOfPath(prefix, other) {
    return prefix.length < other.length && every_default(prefix, (tokType, idx) => {
      const otherTokType = other[idx];
      return tokType === otherTokType || otherTokType.categoryMatchesMap[tokType.tokenTypeIdx];
    });
  }
  function areTokenCategoriesNotUsed(lookAheadPaths) {
    return every_default(lookAheadPaths, (singleAltPaths) => every_default(singleAltPaths, (singlePath) => every_default(singlePath, (token) => isEmpty_default(token.categoryMatches))));
  }

  // ../../node_modules/chevrotain/lib/src/parse/grammar/checks.js
  function validateLookahead(options) {
    const lookaheadValidationErrorMessages = options.lookaheadStrategy.validate({
      rules: options.rules,
      tokenTypes: options.tokenTypes,
      grammarName: options.grammarName
    });
    return map_default(lookaheadValidationErrorMessages, (errorMessage) => Object.assign({ type: ParserDefinitionErrorType.CUSTOM_LOOKAHEAD_VALIDATION }, errorMessage));
  }
  function validateGrammar(topLevels, tokenTypes, errMsgProvider, grammarName) {
    const duplicateErrors = flatMap_default(topLevels, (currTopLevel) => validateDuplicateProductions(currTopLevel, errMsgProvider));
    const termsNamespaceConflictErrors = checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider);
    const tooManyAltsErrors = flatMap_default(topLevels, (curRule) => validateTooManyAlts(curRule, errMsgProvider));
    const duplicateRulesError = flatMap_default(topLevels, (curRule) => validateRuleDoesNotAlreadyExist(curRule, topLevels, grammarName, errMsgProvider));
    return duplicateErrors.concat(termsNamespaceConflictErrors, tooManyAltsErrors, duplicateRulesError);
  }
  function validateDuplicateProductions(topLevelRule, errMsgProvider) {
    const collectorVisitor2 = new OccurrenceValidationCollector();
    topLevelRule.accept(collectorVisitor2);
    const allRuleProductions = collectorVisitor2.allProductions;
    const productionGroups = groupBy_default(allRuleProductions, identifyProductionForDuplicates);
    const duplicates = pickBy_default(productionGroups, (currGroup) => {
      return currGroup.length > 1;
    });
    const errors = map_default(values_default(duplicates), (currDuplicates) => {
      const firstProd = head_default(currDuplicates);
      const msg = errMsgProvider.buildDuplicateFoundError(topLevelRule, currDuplicates);
      const dslName = getProductionDslName(firstProd);
      const defError = {
        message: msg,
        type: ParserDefinitionErrorType.DUPLICATE_PRODUCTIONS,
        ruleName: topLevelRule.name,
        dslName,
        occurrence: firstProd.idx
      };
      const param = getExtraProductionArgument(firstProd);
      if (param) {
        defError.parameter = param;
      }
      return defError;
    });
    return errors;
  }
  function identifyProductionForDuplicates(prod) {
    return `${getProductionDslName(prod)}_#_${prod.idx}_#_${getExtraProductionArgument(prod)}`;
  }
  function getExtraProductionArgument(prod) {
    if (prod instanceof Terminal) {
      return prod.terminalType.name;
    } else if (prod instanceof NonTerminal) {
      return prod.nonTerminalName;
    } else {
      return "";
    }
  }
  var OccurrenceValidationCollector = class extends GAstVisitor {
    constructor() {
      super(...arguments);
      this.allProductions = [];
    }
    visitNonTerminal(subrule) {
      this.allProductions.push(subrule);
    }
    visitOption(option) {
      this.allProductions.push(option);
    }
    visitRepetitionWithSeparator(manySep) {
      this.allProductions.push(manySep);
    }
    visitRepetitionMandatory(atLeastOne) {
      this.allProductions.push(atLeastOne);
    }
    visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
      this.allProductions.push(atLeastOneSep);
    }
    visitRepetition(many) {
      this.allProductions.push(many);
    }
    visitAlternation(or) {
      this.allProductions.push(or);
    }
    visitTerminal(terminal) {
      this.allProductions.push(terminal);
    }
  };
  function validateRuleDoesNotAlreadyExist(rule, allRules, className, errMsgProvider) {
    const errors = [];
    const occurrences = reduce_default(allRules, (result, curRule) => {
      if (curRule.name === rule.name) {
        return result + 1;
      }
      return result;
    }, 0);
    if (occurrences > 1) {
      const errMsg = errMsgProvider.buildDuplicateRuleNameError({
        topLevelRule: rule,
        grammarName: className
      });
      errors.push({
        message: errMsg,
        type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
        ruleName: rule.name
      });
    }
    return errors;
  }
  function validateRuleIsOverridden(ruleName, definedRulesNames, className) {
    const errors = [];
    let errMsg;
    if (!includes_default(definedRulesNames, ruleName)) {
      errMsg = `Invalid rule override, rule: ->${ruleName}<- cannot be overridden in the grammar: ->${className}<-as it is not defined in any of the super grammars `;
      errors.push({
        message: errMsg,
        type: ParserDefinitionErrorType.INVALID_RULE_OVERRIDE,
        ruleName
      });
    }
    return errors;
  }
  function validateNoLeftRecursion(topRule, currRule, errMsgProvider, path = []) {
    const errors = [];
    const nextNonTerminals = getFirstNoneTerminal(currRule.definition);
    if (isEmpty_default(nextNonTerminals)) {
      return [];
    } else {
      const ruleName = topRule.name;
      const foundLeftRecursion = includes_default(nextNonTerminals, topRule);
      if (foundLeftRecursion) {
        errors.push({
          message: errMsgProvider.buildLeftRecursionError({
            topLevelRule: topRule,
            leftRecursionPath: path
          }),
          type: ParserDefinitionErrorType.LEFT_RECURSION,
          ruleName
        });
      }
      const validNextSteps = difference_default(nextNonTerminals, path.concat([topRule]));
      const errorsFromNextSteps = flatMap_default(validNextSteps, (currRefRule) => {
        const newPath = clone_default(path);
        newPath.push(currRefRule);
        return validateNoLeftRecursion(topRule, currRefRule, errMsgProvider, newPath);
      });
      return errors.concat(errorsFromNextSteps);
    }
  }
  function getFirstNoneTerminal(definition) {
    let result = [];
    if (isEmpty_default(definition)) {
      return result;
    }
    const firstProd = head_default(definition);
    if (firstProd instanceof NonTerminal) {
      result.push(firstProd.referencedRule);
    } else if (firstProd instanceof Alternative || firstProd instanceof Option || firstProd instanceof RepetitionMandatory || firstProd instanceof RepetitionMandatoryWithSeparator || firstProd instanceof RepetitionWithSeparator || firstProd instanceof Repetition) {
      result = result.concat(getFirstNoneTerminal(firstProd.definition));
    } else if (firstProd instanceof Alternation) {
      result = flatten_default(map_default(firstProd.definition, (currSubDef) => getFirstNoneTerminal(currSubDef.definition)));
    } else if (firstProd instanceof Terminal) {
    } else {
      throw Error("non exhaustive match");
    }
    const isFirstOptional = isOptionalProd(firstProd);
    const hasMore = definition.length > 1;
    if (isFirstOptional && hasMore) {
      const rest = drop_default(definition);
      return result.concat(getFirstNoneTerminal(rest));
    } else {
      return result;
    }
  }
  var OrCollector = class extends GAstVisitor {
    constructor() {
      super(...arguments);
      this.alternations = [];
    }
    visitAlternation(node) {
      this.alternations.push(node);
    }
  };
  function validateEmptyOrAlternative(topLevelRule, errMsgProvider) {
    const orCollector = new OrCollector();
    topLevelRule.accept(orCollector);
    const ors = orCollector.alternations;
    const errors = flatMap_default(ors, (currOr) => {
      const exceptLast = dropRight_default(currOr.definition);
      return flatMap_default(exceptLast, (currAlternative, currAltIdx) => {
        const possibleFirstInAlt = nextPossibleTokensAfter([currAlternative], [], tokenStructuredMatcher, 1);
        if (isEmpty_default(possibleFirstInAlt)) {
          return [
            {
              message: errMsgProvider.buildEmptyAlternationError({
                topLevelRule,
                alternation: currOr,
                emptyChoiceIdx: currAltIdx
              }),
              type: ParserDefinitionErrorType.NONE_LAST_EMPTY_ALT,
              ruleName: topLevelRule.name,
              occurrence: currOr.idx,
              alternative: currAltIdx + 1
            }
          ];
        } else {
          return [];
        }
      });
    });
    return errors;
  }
  function validateAmbiguousAlternationAlternatives(topLevelRule, globalMaxLookahead, errMsgProvider) {
    const orCollector = new OrCollector();
    topLevelRule.accept(orCollector);
    let ors = orCollector.alternations;
    ors = reject_default(ors, (currOr) => currOr.ignoreAmbiguities === true);
    const errors = flatMap_default(ors, (currOr) => {
      const currOccurrence = currOr.idx;
      const actualMaxLookahead = currOr.maxLookahead || globalMaxLookahead;
      const alternatives = getLookaheadPathsForOr(currOccurrence, topLevelRule, actualMaxLookahead, currOr);
      const altsAmbiguityErrors = checkAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
      const altsPrefixAmbiguityErrors = checkPrefixAlternativesAmbiguities(alternatives, currOr, topLevelRule, errMsgProvider);
      return altsAmbiguityErrors.concat(altsPrefixAmbiguityErrors);
    });
    return errors;
  }
  var RepetitionCollector = class extends GAstVisitor {
    constructor() {
      super(...arguments);
      this.allProductions = [];
    }
    visitRepetitionWithSeparator(manySep) {
      this.allProductions.push(manySep);
    }
    visitRepetitionMandatory(atLeastOne) {
      this.allProductions.push(atLeastOne);
    }
    visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
      this.allProductions.push(atLeastOneSep);
    }
    visitRepetition(many) {
      this.allProductions.push(many);
    }
  };
  function validateTooManyAlts(topLevelRule, errMsgProvider) {
    const orCollector = new OrCollector();
    topLevelRule.accept(orCollector);
    const ors = orCollector.alternations;
    const errors = flatMap_default(ors, (currOr) => {
      if (currOr.definition.length > 255) {
        return [
          {
            message: errMsgProvider.buildTooManyAlternativesError({
              topLevelRule,
              alternation: currOr
            }),
            type: ParserDefinitionErrorType.TOO_MANY_ALTS,
            ruleName: topLevelRule.name,
            occurrence: currOr.idx
          }
        ];
      } else {
        return [];
      }
    });
    return errors;
  }
  function validateSomeNonEmptyLookaheadPath(topLevelRules, maxLookahead, errMsgProvider) {
    const errors = [];
    forEach_default(topLevelRules, (currTopRule) => {
      const collectorVisitor2 = new RepetitionCollector();
      currTopRule.accept(collectorVisitor2);
      const allRuleProductions = collectorVisitor2.allProductions;
      forEach_default(allRuleProductions, (currProd) => {
        const prodType = getProdType(currProd);
        const actualMaxLookahead = currProd.maxLookahead || maxLookahead;
        const currOccurrence = currProd.idx;
        const paths = getLookaheadPathsForOptionalProd(currOccurrence, currTopRule, prodType, actualMaxLookahead);
        const pathsInsideProduction = paths[0];
        if (isEmpty_default(flatten_default(pathsInsideProduction))) {
          const errMsg = errMsgProvider.buildEmptyRepetitionError({
            topLevelRule: currTopRule,
            repetition: currProd
          });
          errors.push({
            message: errMsg,
            type: ParserDefinitionErrorType.NO_NON_EMPTY_LOOKAHEAD,
            ruleName: currTopRule.name
          });
        }
      });
    });
    return errors;
  }
  function checkAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
    const foundAmbiguousPaths = [];
    const identicalAmbiguities = reduce_default(alternatives, (result, currAlt, currAltIdx) => {
      if (alternation.definition[currAltIdx].ignoreAmbiguities === true) {
        return result;
      }
      forEach_default(currAlt, (currPath) => {
        const altsCurrPathAppearsIn = [currAltIdx];
        forEach_default(alternatives, (currOtherAlt, currOtherAltIdx) => {
          if (currAltIdx !== currOtherAltIdx && containsPath(currOtherAlt, currPath) && // ignore (skip) ambiguities with this "other" alternative
          alternation.definition[currOtherAltIdx].ignoreAmbiguities !== true) {
            altsCurrPathAppearsIn.push(currOtherAltIdx);
          }
        });
        if (altsCurrPathAppearsIn.length > 1 && !containsPath(foundAmbiguousPaths, currPath)) {
          foundAmbiguousPaths.push(currPath);
          result.push({
            alts: altsCurrPathAppearsIn,
            path: currPath
          });
        }
      });
      return result;
    }, []);
    const currErrors = map_default(identicalAmbiguities, (currAmbDescriptor) => {
      const ambgIndices = map_default(currAmbDescriptor.alts, (currAltIdx) => currAltIdx + 1);
      const currMessage = errMsgProvider.buildAlternationAmbiguityError({
        topLevelRule: rule,
        alternation,
        ambiguityIndices: ambgIndices,
        prefixPath: currAmbDescriptor.path
      });
      return {
        message: currMessage,
        type: ParserDefinitionErrorType.AMBIGUOUS_ALTS,
        ruleName: rule.name,
        occurrence: alternation.idx,
        alternatives: currAmbDescriptor.alts
      };
    });
    return currErrors;
  }
  function checkPrefixAlternativesAmbiguities(alternatives, alternation, rule, errMsgProvider) {
    const pathsAndIndices = reduce_default(alternatives, (result, currAlt, idx) => {
      const currPathsAndIdx = map_default(currAlt, (currPath) => {
        return { idx, path: currPath };
      });
      return result.concat(currPathsAndIdx);
    }, []);
    const errors = compact_default(flatMap_default(pathsAndIndices, (currPathAndIdx) => {
      const alternativeGast = alternation.definition[currPathAndIdx.idx];
      if (alternativeGast.ignoreAmbiguities === true) {
        return [];
      }
      const targetIdx = currPathAndIdx.idx;
      const targetPath = currPathAndIdx.path;
      const prefixAmbiguitiesPathsAndIndices = filter_default(pathsAndIndices, (searchPathAndIdx) => {
        return (
          // ignore (skip) ambiguities with this "other" alternative
          alternation.definition[searchPathAndIdx.idx].ignoreAmbiguities !== true && searchPathAndIdx.idx < targetIdx && // checking for strict prefix because identical lookaheads
          // will be be detected using a different validation.
          isStrictPrefixOfPath(searchPathAndIdx.path, targetPath)
        );
      });
      const currPathPrefixErrors = map_default(prefixAmbiguitiesPathsAndIndices, (currAmbPathAndIdx) => {
        const ambgIndices = [currAmbPathAndIdx.idx + 1, targetIdx + 1];
        const occurrence = alternation.idx === 0 ? "" : alternation.idx;
        const message = errMsgProvider.buildAlternationPrefixAmbiguityError({
          topLevelRule: rule,
          alternation,
          ambiguityIndices: ambgIndices,
          prefixPath: currAmbPathAndIdx.path
        });
        return {
          message,
          type: ParserDefinitionErrorType.AMBIGUOUS_PREFIX_ALTS,
          ruleName: rule.name,
          occurrence,
          alternatives: ambgIndices
        };
      });
      return currPathPrefixErrors;
    }));
    return errors;
  }
  function checkTerminalAndNoneTerminalsNameSpace(topLevels, tokenTypes, errMsgProvider) {
    const errors = [];
    const tokenNames = map_default(tokenTypes, (currToken) => currToken.name);
    forEach_default(topLevels, (currRule) => {
      const currRuleName = currRule.name;
      if (includes_default(tokenNames, currRuleName)) {
        const errMsg = errMsgProvider.buildNamespaceConflictError(currRule);
        errors.push({
          message: errMsg,
          type: ParserDefinitionErrorType.CONFLICT_TOKENS_RULES_NAMESPACE,
          ruleName: currRuleName
        });
      }
    });
    return errors;
  }

  // ../../node_modules/chevrotain/lib/src/parse/grammar/gast/gast_resolver_public.js
  function resolveGrammar2(options) {
    const actualOptions = defaults_default(options, {
      errMsgProvider: defaultGrammarResolverErrorProvider
    });
    const topRulesTable = {};
    forEach_default(options.rules, (rule) => {
      topRulesTable[rule.name] = rule;
    });
    return resolveGrammar(topRulesTable, actualOptions.errMsgProvider);
  }
  function validateGrammar2(options) {
    options = defaults_default(options, {
      errMsgProvider: defaultGrammarValidatorErrorProvider
    });
    return validateGrammar(options.rules, options.tokenTypes, options.errMsgProvider, options.grammarName);
  }

  // ../../node_modules/chevrotain/lib/src/parse/exceptions_public.js
  var MISMATCHED_TOKEN_EXCEPTION = "MismatchedTokenException";
  var NO_VIABLE_ALT_EXCEPTION = "NoViableAltException";
  var EARLY_EXIT_EXCEPTION = "EarlyExitException";
  var NOT_ALL_INPUT_PARSED_EXCEPTION = "NotAllInputParsedException";
  var RECOGNITION_EXCEPTION_NAMES = [
    MISMATCHED_TOKEN_EXCEPTION,
    NO_VIABLE_ALT_EXCEPTION,
    EARLY_EXIT_EXCEPTION,
    NOT_ALL_INPUT_PARSED_EXCEPTION
  ];
  Object.freeze(RECOGNITION_EXCEPTION_NAMES);
  function isRecognitionException(error) {
    return includes_default(RECOGNITION_EXCEPTION_NAMES, error.name);
  }
  var RecognitionException = class extends Error {
    constructor(message, token) {
      super(message);
      this.token = token;
      this.resyncedTokens = [];
      Object.setPrototypeOf(this, new.target.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  };
  var MismatchedTokenException = class extends RecognitionException {
    constructor(message, token, previousToken) {
      super(message, token);
      this.previousToken = previousToken;
      this.name = MISMATCHED_TOKEN_EXCEPTION;
    }
  };
  var NoViableAltException = class extends RecognitionException {
    constructor(message, token, previousToken) {
      super(message, token);
      this.previousToken = previousToken;
      this.name = NO_VIABLE_ALT_EXCEPTION;
    }
  };
  var NotAllInputParsedException = class extends RecognitionException {
    constructor(message, token) {
      super(message, token);
      this.name = NOT_ALL_INPUT_PARSED_EXCEPTION;
    }
  };
  var EarlyExitException = class extends RecognitionException {
    constructor(message, token, previousToken) {
      super(message, token);
      this.previousToken = previousToken;
      this.name = EARLY_EXIT_EXCEPTION;
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/recoverable.js
  var EOF_FOLLOW_KEY = {};
  var IN_RULE_RECOVERY_EXCEPTION = "InRuleRecoveryException";
  var InRuleRecoveryException = class extends Error {
    constructor(message) {
      super(message);
      this.name = IN_RULE_RECOVERY_EXCEPTION;
    }
  };
  var Recoverable = class {
    initRecoverable(config) {
      this.firstAfterRepMap = {};
      this.resyncFollows = {};
      this.recoveryEnabled = has_default(config, "recoveryEnabled") ? config.recoveryEnabled : DEFAULT_PARSER_CONFIG.recoveryEnabled;
      if (this.recoveryEnabled) {
        this.attemptInRepetitionRecovery = attemptInRepetitionRecovery;
      }
    }
    getTokenToInsert(tokType) {
      const tokToInsert = createTokenInstance(tokType, "", NaN, NaN, NaN, NaN, NaN, NaN);
      tokToInsert.isInsertedInRecovery = true;
      return tokToInsert;
    }
    canTokenTypeBeInsertedInRecovery(tokType) {
      return true;
    }
    canTokenTypeBeDeletedInRecovery(tokType) {
      return true;
    }
    tryInRepetitionRecovery(grammarRule, grammarRuleArgs, lookAheadFunc, expectedTokType) {
      const reSyncTokType = this.findReSyncTokenType();
      const savedLexerState = this.exportLexerState();
      const resyncedTokens = [];
      let passedResyncPoint = false;
      const nextTokenWithoutResync = this.LA(1);
      let currToken = this.LA(1);
      const generateErrorMessage = () => {
        const previousToken = this.LA(0);
        const msg = this.errorMessageProvider.buildMismatchTokenMessage({
          expected: expectedTokType,
          actual: nextTokenWithoutResync,
          previous: previousToken,
          ruleName: this.getCurrRuleFullName()
        });
        const error = new MismatchedTokenException(msg, nextTokenWithoutResync, this.LA(0));
        error.resyncedTokens = dropRight_default(resyncedTokens);
        this.SAVE_ERROR(error);
      };
      while (!passedResyncPoint) {
        if (this.tokenMatcher(currToken, expectedTokType)) {
          generateErrorMessage();
          return;
        } else if (lookAheadFunc.call(this)) {
          generateErrorMessage();
          grammarRule.apply(this, grammarRuleArgs);
          return;
        } else if (this.tokenMatcher(currToken, reSyncTokType)) {
          passedResyncPoint = true;
        } else {
          currToken = this.SKIP_TOKEN();
          this.addToResyncTokens(currToken, resyncedTokens);
        }
      }
      this.importLexerState(savedLexerState);
    }
    shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck) {
      if (notStuck === false) {
        return false;
      }
      if (this.tokenMatcher(this.LA(1), expectTokAfterLastMatch)) {
        return false;
      }
      if (this.isBackTracking()) {
        return false;
      }
      if (this.canPerformInRuleRecovery(expectTokAfterLastMatch, this.getFollowsForInRuleRecovery(expectTokAfterLastMatch, nextTokIdx))) {
        return false;
      }
      return true;
    }
    // Error Recovery functionality
    getFollowsForInRuleRecovery(tokType, tokIdxInRule) {
      const grammarPath = this.getCurrentGrammarPath(tokType, tokIdxInRule);
      const follows = this.getNextPossibleTokenTypes(grammarPath);
      return follows;
    }
    tryInRuleRecovery(expectedTokType, follows) {
      if (this.canRecoverWithSingleTokenInsertion(expectedTokType, follows)) {
        const tokToInsert = this.getTokenToInsert(expectedTokType);
        return tokToInsert;
      }
      if (this.canRecoverWithSingleTokenDeletion(expectedTokType)) {
        const nextTok = this.SKIP_TOKEN();
        this.consumeToken();
        return nextTok;
      }
      throw new InRuleRecoveryException("sad sad panda");
    }
    canPerformInRuleRecovery(expectedToken, follows) {
      return this.canRecoverWithSingleTokenInsertion(expectedToken, follows) || this.canRecoverWithSingleTokenDeletion(expectedToken);
    }
    canRecoverWithSingleTokenInsertion(expectedTokType, follows) {
      if (!this.canTokenTypeBeInsertedInRecovery(expectedTokType)) {
        return false;
      }
      if (isEmpty_default(follows)) {
        return false;
      }
      const mismatchedTok = this.LA(1);
      const isMisMatchedTokInFollows = find_default(follows, (possibleFollowsTokType) => {
        return this.tokenMatcher(mismatchedTok, possibleFollowsTokType);
      }) !== void 0;
      return isMisMatchedTokInFollows;
    }
    canRecoverWithSingleTokenDeletion(expectedTokType) {
      if (!this.canTokenTypeBeDeletedInRecovery(expectedTokType)) {
        return false;
      }
      const isNextTokenWhatIsExpected = this.tokenMatcher(this.LA(2), expectedTokType);
      return isNextTokenWhatIsExpected;
    }
    isInCurrentRuleReSyncSet(tokenTypeIdx) {
      const followKey = this.getCurrFollowKey();
      const currentRuleReSyncSet = this.getFollowSetFromFollowKey(followKey);
      return includes_default(currentRuleReSyncSet, tokenTypeIdx);
    }
    findReSyncTokenType() {
      const allPossibleReSyncTokTypes = this.flattenFollowSet();
      let nextToken = this.LA(1);
      let k2 = 2;
      while (true) {
        const foundMatch = find_default(allPossibleReSyncTokTypes, (resyncTokType) => {
          const canMatch = tokenMatcher(nextToken, resyncTokType);
          return canMatch;
        });
        if (foundMatch !== void 0) {
          return foundMatch;
        }
        nextToken = this.LA(k2);
        k2++;
      }
    }
    getCurrFollowKey() {
      if (this.RULE_STACK.length === 1) {
        return EOF_FOLLOW_KEY;
      }
      const currRuleShortName = this.getLastExplicitRuleShortName();
      const currRuleIdx = this.getLastExplicitRuleOccurrenceIndex();
      const prevRuleShortName = this.getPreviousExplicitRuleShortName();
      return {
        ruleName: this.shortRuleNameToFullName(currRuleShortName),
        idxInCallingRule: currRuleIdx,
        inRule: this.shortRuleNameToFullName(prevRuleShortName)
      };
    }
    buildFullFollowKeyStack() {
      const explicitRuleStack = this.RULE_STACK;
      const explicitOccurrenceStack = this.RULE_OCCURRENCE_STACK;
      return map_default(explicitRuleStack, (ruleName, idx) => {
        if (idx === 0) {
          return EOF_FOLLOW_KEY;
        }
        return {
          ruleName: this.shortRuleNameToFullName(ruleName),
          idxInCallingRule: explicitOccurrenceStack[idx],
          inRule: this.shortRuleNameToFullName(explicitRuleStack[idx - 1])
        };
      });
    }
    flattenFollowSet() {
      const followStack = map_default(this.buildFullFollowKeyStack(), (currKey) => {
        return this.getFollowSetFromFollowKey(currKey);
      });
      return flatten_default(followStack);
    }
    getFollowSetFromFollowKey(followKey) {
      if (followKey === EOF_FOLLOW_KEY) {
        return [EOF];
      }
      const followName = followKey.ruleName + followKey.idxInCallingRule + IN + followKey.inRule;
      return this.resyncFollows[followName];
    }
    // It does not make any sense to include a virtual EOF token in the list of resynced tokens
    // as EOF does not really exist and thus does not contain any useful information (line/column numbers)
    addToResyncTokens(token, resyncTokens) {
      if (!this.tokenMatcher(token, EOF)) {
        resyncTokens.push(token);
      }
      return resyncTokens;
    }
    reSyncTo(tokType) {
      const resyncedTokens = [];
      let nextTok = this.LA(1);
      while (this.tokenMatcher(nextTok, tokType) === false) {
        nextTok = this.SKIP_TOKEN();
        this.addToResyncTokens(nextTok, resyncedTokens);
      }
      return dropRight_default(resyncedTokens);
    }
    attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
    }
    getCurrentGrammarPath(tokType, tokIdxInRule) {
      const pathRuleStack = this.getHumanReadableRuleStack();
      const pathOccurrenceStack = clone_default(this.RULE_OCCURRENCE_STACK);
      const grammarPath = {
        ruleStack: pathRuleStack,
        occurrenceStack: pathOccurrenceStack,
        lastTok: tokType,
        lastTokOccurrence: tokIdxInRule
      };
      return grammarPath;
    }
    getHumanReadableRuleStack() {
      return map_default(this.RULE_STACK, (currShortName) => this.shortRuleNameToFullName(currShortName));
    }
  };
  function attemptInRepetitionRecovery(prodFunc, args, lookaheadFunc, dslMethodIdx, prodOccurrence, nextToksWalker, notStuck) {
    const key = this.getKeyForAutomaticLookahead(dslMethodIdx, prodOccurrence);
    let firstAfterRepInfo = this.firstAfterRepMap[key];
    if (firstAfterRepInfo === void 0) {
      const currRuleName = this.getCurrRuleFullName();
      const ruleGrammar = this.getGAstProductions()[currRuleName];
      const walker = new nextToksWalker(ruleGrammar, prodOccurrence);
      firstAfterRepInfo = walker.startWalking();
      this.firstAfterRepMap[key] = firstAfterRepInfo;
    }
    let expectTokAfterLastMatch = firstAfterRepInfo.token;
    let nextTokIdx = firstAfterRepInfo.occurrence;
    const isEndOfRule = firstAfterRepInfo.isEndOfRule;
    if (this.RULE_STACK.length === 1 && isEndOfRule && expectTokAfterLastMatch === void 0) {
      expectTokAfterLastMatch = EOF;
      nextTokIdx = 1;
    }
    if (expectTokAfterLastMatch === void 0 || nextTokIdx === void 0) {
      return;
    }
    if (this.shouldInRepetitionRecoveryBeTried(expectTokAfterLastMatch, nextTokIdx, notStuck)) {
      this.tryInRepetitionRecovery(prodFunc, args, lookaheadFunc, expectTokAfterLastMatch);
    }
  }

  // ../../node_modules/chevrotain/lib/src/parse/grammar/keys.js
  var BITS_FOR_METHOD_TYPE = 4;
  var BITS_FOR_OCCURRENCE_IDX = 8;
  var BITS_FOR_ALT_IDX = 8;
  var OR_IDX = 1 << BITS_FOR_OCCURRENCE_IDX;
  var OPTION_IDX = 2 << BITS_FOR_OCCURRENCE_IDX;
  var MANY_IDX = 3 << BITS_FOR_OCCURRENCE_IDX;
  var AT_LEAST_ONE_IDX = 4 << BITS_FOR_OCCURRENCE_IDX;
  var MANY_SEP_IDX = 5 << BITS_FOR_OCCURRENCE_IDX;
  var AT_LEAST_ONE_SEP_IDX = 6 << BITS_FOR_OCCURRENCE_IDX;
  function getKeyForAutomaticLookahead(ruleIdx, dslMethodIdx, occurrence) {
    return occurrence | dslMethodIdx | ruleIdx;
  }
  var BITS_START_FOR_ALT_IDX = 32 - BITS_FOR_ALT_IDX;

  // ../../node_modules/chevrotain/lib/src/parse/grammar/llk_lookahead.js
  var LLkLookaheadStrategy = class {
    constructor(options) {
      var _a;
      this.maxLookahead = (_a = options === null || options === void 0 ? void 0 : options.maxLookahead) !== null && _a !== void 0 ? _a : DEFAULT_PARSER_CONFIG.maxLookahead;
    }
    validate(options) {
      const leftRecursionErrors = this.validateNoLeftRecursion(options.rules);
      if (isEmpty_default(leftRecursionErrors)) {
        const emptyAltErrors = this.validateEmptyOrAlternatives(options.rules);
        const ambiguousAltsErrors = this.validateAmbiguousAlternationAlternatives(options.rules, this.maxLookahead);
        const emptyRepetitionErrors = this.validateSomeNonEmptyLookaheadPath(options.rules, this.maxLookahead);
        const allErrors = [
          ...leftRecursionErrors,
          ...emptyAltErrors,
          ...ambiguousAltsErrors,
          ...emptyRepetitionErrors
        ];
        return allErrors;
      }
      return leftRecursionErrors;
    }
    validateNoLeftRecursion(rules) {
      return flatMap_default(rules, (currTopRule) => validateNoLeftRecursion(currTopRule, currTopRule, defaultGrammarValidatorErrorProvider));
    }
    validateEmptyOrAlternatives(rules) {
      return flatMap_default(rules, (currTopRule) => validateEmptyOrAlternative(currTopRule, defaultGrammarValidatorErrorProvider));
    }
    validateAmbiguousAlternationAlternatives(rules, maxLookahead) {
      return flatMap_default(rules, (currTopRule) => validateAmbiguousAlternationAlternatives(currTopRule, maxLookahead, defaultGrammarValidatorErrorProvider));
    }
    validateSomeNonEmptyLookaheadPath(rules, maxLookahead) {
      return validateSomeNonEmptyLookaheadPath(rules, maxLookahead, defaultGrammarValidatorErrorProvider);
    }
    buildLookaheadForAlternation(options) {
      return buildLookaheadFuncForOr(options.prodOccurrence, options.rule, options.maxLookahead, options.hasPredicates, options.dynamicTokensEnabled, buildAlternativesLookAheadFunc);
    }
    buildLookaheadForOptional(options) {
      return buildLookaheadFuncForOptionalProd(options.prodOccurrence, options.rule, options.maxLookahead, options.dynamicTokensEnabled, getProdType(options.prodType), buildSingleAlternativeLookaheadFunction);
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/looksahead.js
  var LooksAhead = class {
    initLooksAhead(config) {
      this.dynamicTokensEnabled = has_default(config, "dynamicTokensEnabled") ? config.dynamicTokensEnabled : DEFAULT_PARSER_CONFIG.dynamicTokensEnabled;
      this.maxLookahead = has_default(config, "maxLookahead") ? config.maxLookahead : DEFAULT_PARSER_CONFIG.maxLookahead;
      this.lookaheadStrategy = has_default(config, "lookaheadStrategy") ? config.lookaheadStrategy : new LLkLookaheadStrategy({ maxLookahead: this.maxLookahead });
      this.lookAheadFuncsCache = /* @__PURE__ */ new Map();
    }
    preComputeLookaheadFunctions(rules) {
      forEach_default(rules, (currRule) => {
        this.TRACE_INIT(`${currRule.name} Rule Lookahead`, () => {
          const { alternation, repetition, option, repetitionMandatory, repetitionMandatoryWithSeparator, repetitionWithSeparator } = collectMethods(currRule);
          forEach_default(alternation, (currProd) => {
            const prodIdx = currProd.idx === 0 ? "" : currProd.idx;
            this.TRACE_INIT(`${getProductionDslName(currProd)}${prodIdx}`, () => {
              const laFunc = this.lookaheadStrategy.buildLookaheadForAlternation({
                prodOccurrence: currProd.idx,
                rule: currRule,
                maxLookahead: currProd.maxLookahead || this.maxLookahead,
                hasPredicates: currProd.hasPredicates,
                dynamicTokensEnabled: this.dynamicTokensEnabled
              });
              const key = getKeyForAutomaticLookahead(this.fullRuleNameToShort[currRule.name], OR_IDX, currProd.idx);
              this.setLaFuncCache(key, laFunc);
            });
          });
          forEach_default(repetition, (currProd) => {
            this.computeLookaheadFunc(currRule, currProd.idx, MANY_IDX, "Repetition", currProd.maxLookahead, getProductionDslName(currProd));
          });
          forEach_default(option, (currProd) => {
            this.computeLookaheadFunc(currRule, currProd.idx, OPTION_IDX, "Option", currProd.maxLookahead, getProductionDslName(currProd));
          });
          forEach_default(repetitionMandatory, (currProd) => {
            this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_IDX, "RepetitionMandatory", currProd.maxLookahead, getProductionDslName(currProd));
          });
          forEach_default(repetitionMandatoryWithSeparator, (currProd) => {
            this.computeLookaheadFunc(currRule, currProd.idx, AT_LEAST_ONE_SEP_IDX, "RepetitionMandatoryWithSeparator", currProd.maxLookahead, getProductionDslName(currProd));
          });
          forEach_default(repetitionWithSeparator, (currProd) => {
            this.computeLookaheadFunc(currRule, currProd.idx, MANY_SEP_IDX, "RepetitionWithSeparator", currProd.maxLookahead, getProductionDslName(currProd));
          });
        });
      });
    }
    computeLookaheadFunc(rule, prodOccurrence, prodKey, prodType, prodMaxLookahead, dslMethodName) {
      this.TRACE_INIT(`${dslMethodName}${prodOccurrence === 0 ? "" : prodOccurrence}`, () => {
        const laFunc = this.lookaheadStrategy.buildLookaheadForOptional({
          prodOccurrence,
          rule,
          maxLookahead: prodMaxLookahead || this.maxLookahead,
          dynamicTokensEnabled: this.dynamicTokensEnabled,
          prodType
        });
        const key = getKeyForAutomaticLookahead(this.fullRuleNameToShort[rule.name], prodKey, prodOccurrence);
        this.setLaFuncCache(key, laFunc);
      });
    }
    // this actually returns a number, but it is always used as a string (object prop key)
    getKeyForAutomaticLookahead(dslMethodIdx, occurrence) {
      const currRuleShortName = this.getLastExplicitRuleShortName();
      return getKeyForAutomaticLookahead(currRuleShortName, dslMethodIdx, occurrence);
    }
    getLaFuncFromCache(key) {
      return this.lookAheadFuncsCache.get(key);
    }
    /* istanbul ignore next */
    setLaFuncCache(key, value) {
      this.lookAheadFuncsCache.set(key, value);
    }
  };
  var DslMethodsCollectorVisitor = class extends GAstVisitor {
    constructor() {
      super(...arguments);
      this.dslMethods = {
        option: [],
        alternation: [],
        repetition: [],
        repetitionWithSeparator: [],
        repetitionMandatory: [],
        repetitionMandatoryWithSeparator: []
      };
    }
    reset() {
      this.dslMethods = {
        option: [],
        alternation: [],
        repetition: [],
        repetitionWithSeparator: [],
        repetitionMandatory: [],
        repetitionMandatoryWithSeparator: []
      };
    }
    visitOption(option) {
      this.dslMethods.option.push(option);
    }
    visitRepetitionWithSeparator(manySep) {
      this.dslMethods.repetitionWithSeparator.push(manySep);
    }
    visitRepetitionMandatory(atLeastOne) {
      this.dslMethods.repetitionMandatory.push(atLeastOne);
    }
    visitRepetitionMandatoryWithSeparator(atLeastOneSep) {
      this.dslMethods.repetitionMandatoryWithSeparator.push(atLeastOneSep);
    }
    visitRepetition(many) {
      this.dslMethods.repetition.push(many);
    }
    visitAlternation(or) {
      this.dslMethods.alternation.push(or);
    }
  };
  var collectorVisitor = new DslMethodsCollectorVisitor();
  function collectMethods(rule) {
    collectorVisitor.reset();
    rule.accept(collectorVisitor);
    const dslMethods = collectorVisitor.dslMethods;
    collectorVisitor.reset();
    return dslMethods;
  }

  // ../../node_modules/chevrotain/lib/src/parse/cst/cst.js
  function setNodeLocationOnlyOffset(currNodeLocation, newLocationInfo) {
    if (isNaN(currNodeLocation.startOffset) === true) {
      currNodeLocation.startOffset = newLocationInfo.startOffset;
      currNodeLocation.endOffset = newLocationInfo.endOffset;
    } else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
      currNodeLocation.endOffset = newLocationInfo.endOffset;
    }
  }
  function setNodeLocationFull(currNodeLocation, newLocationInfo) {
    if (isNaN(currNodeLocation.startOffset) === true) {
      currNodeLocation.startOffset = newLocationInfo.startOffset;
      currNodeLocation.startColumn = newLocationInfo.startColumn;
      currNodeLocation.startLine = newLocationInfo.startLine;
      currNodeLocation.endOffset = newLocationInfo.endOffset;
      currNodeLocation.endColumn = newLocationInfo.endColumn;
      currNodeLocation.endLine = newLocationInfo.endLine;
    } else if (currNodeLocation.endOffset < newLocationInfo.endOffset === true) {
      currNodeLocation.endOffset = newLocationInfo.endOffset;
      currNodeLocation.endColumn = newLocationInfo.endColumn;
      currNodeLocation.endLine = newLocationInfo.endLine;
    }
  }
  function addTerminalToCst(node, token, tokenTypeName) {
    if (node.children[tokenTypeName] === void 0) {
      node.children[tokenTypeName] = [token];
    } else {
      node.children[tokenTypeName].push(token);
    }
  }
  function addNoneTerminalToCst(node, ruleName, ruleResult) {
    if (node.children[ruleName] === void 0) {
      node.children[ruleName] = [ruleResult];
    } else {
      node.children[ruleName].push(ruleResult);
    }
  }

  // ../../node_modules/chevrotain/lib/src/lang/lang_extensions.js
  var NAME = "name";
  function defineNameProp(obj, nameValue) {
    Object.defineProperty(obj, NAME, {
      enumerable: false,
      configurable: true,
      writable: false,
      value: nameValue
    });
  }

  // ../../node_modules/chevrotain/lib/src/parse/cst/cst_visitor.js
  function defaultVisit(ctx, param) {
    const childrenNames = keys_default(ctx);
    const childrenNamesLength = childrenNames.length;
    for (let i = 0; i < childrenNamesLength; i++) {
      const currChildName = childrenNames[i];
      const currChildArray = ctx[currChildName];
      const currChildArrayLength = currChildArray.length;
      for (let j = 0; j < currChildArrayLength; j++) {
        const currChild = currChildArray[j];
        if (currChild.tokenTypeIdx === void 0) {
          this[currChild.name](currChild.children, param);
        }
      }
    }
  }
  function createBaseSemanticVisitorConstructor(grammarName, ruleNames) {
    const derivedConstructor = function() {
    };
    defineNameProp(derivedConstructor, grammarName + "BaseSemantics");
    const semanticProto = {
      visit: function(cstNode, param) {
        if (isArray_default(cstNode)) {
          cstNode = cstNode[0];
        }
        if (isUndefined_default(cstNode)) {
          return void 0;
        }
        return this[cstNode.name](cstNode.children, param);
      },
      validateVisitor: function() {
        const semanticDefinitionErrors = validateVisitor(this, ruleNames);
        if (!isEmpty_default(semanticDefinitionErrors)) {
          const errorMessages = map_default(semanticDefinitionErrors, (currDefError) => currDefError.msg);
          throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${errorMessages.join("\n\n").replace(/\n/g, "\n	")}`);
        }
      }
    };
    derivedConstructor.prototype = semanticProto;
    derivedConstructor.prototype.constructor = derivedConstructor;
    derivedConstructor._RULE_NAMES = ruleNames;
    return derivedConstructor;
  }
  function createBaseVisitorConstructorWithDefaults(grammarName, ruleNames, baseConstructor) {
    const derivedConstructor = function() {
    };
    defineNameProp(derivedConstructor, grammarName + "BaseSemanticsWithDefaults");
    const withDefaultsProto = Object.create(baseConstructor.prototype);
    forEach_default(ruleNames, (ruleName) => {
      withDefaultsProto[ruleName] = defaultVisit;
    });
    derivedConstructor.prototype = withDefaultsProto;
    derivedConstructor.prototype.constructor = derivedConstructor;
    return derivedConstructor;
  }
  var CstVisitorDefinitionError;
  (function(CstVisitorDefinitionError2) {
    CstVisitorDefinitionError2[CstVisitorDefinitionError2["REDUNDANT_METHOD"] = 0] = "REDUNDANT_METHOD";
    CstVisitorDefinitionError2[CstVisitorDefinitionError2["MISSING_METHOD"] = 1] = "MISSING_METHOD";
  })(CstVisitorDefinitionError || (CstVisitorDefinitionError = {}));
  function validateVisitor(visitorInstance, ruleNames) {
    const missingErrors = validateMissingCstMethods(visitorInstance, ruleNames);
    return missingErrors;
  }
  function validateMissingCstMethods(visitorInstance, ruleNames) {
    const missingRuleNames = filter_default(ruleNames, (currRuleName) => {
      return isFunction_default(visitorInstance[currRuleName]) === false;
    });
    const errors = map_default(missingRuleNames, (currRuleName) => {
      return {
        msg: `Missing visitor method: <${currRuleName}> on ${visitorInstance.constructor.name} CST Visitor.`,
        type: CstVisitorDefinitionError.MISSING_METHOD,
        methodName: currRuleName
      };
    });
    return compact_default(errors);
  }

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/tree_builder.js
  var TreeBuilder = class {
    initTreeBuilder(config) {
      this.CST_STACK = [];
      this.outputCst = config.outputCst;
      this.nodeLocationTracking = has_default(config, "nodeLocationTracking") ? config.nodeLocationTracking : DEFAULT_PARSER_CONFIG.nodeLocationTracking;
      if (!this.outputCst) {
        this.cstInvocationStateUpdate = noop_default;
        this.cstFinallyStateUpdate = noop_default;
        this.cstPostTerminal = noop_default;
        this.cstPostNonTerminal = noop_default;
        this.cstPostRule = noop_default;
      } else {
        if (/full/i.test(this.nodeLocationTracking)) {
          if (this.recoveryEnabled) {
            this.setNodeLocationFromToken = setNodeLocationFull;
            this.setNodeLocationFromNode = setNodeLocationFull;
            this.cstPostRule = noop_default;
            this.setInitialNodeLocation = this.setInitialNodeLocationFullRecovery;
          } else {
            this.setNodeLocationFromToken = noop_default;
            this.setNodeLocationFromNode = noop_default;
            this.cstPostRule = this.cstPostRuleFull;
            this.setInitialNodeLocation = this.setInitialNodeLocationFullRegular;
          }
        } else if (/onlyOffset/i.test(this.nodeLocationTracking)) {
          if (this.recoveryEnabled) {
            this.setNodeLocationFromToken = setNodeLocationOnlyOffset;
            this.setNodeLocationFromNode = setNodeLocationOnlyOffset;
            this.cstPostRule = noop_default;
            this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRecovery;
          } else {
            this.setNodeLocationFromToken = noop_default;
            this.setNodeLocationFromNode = noop_default;
            this.cstPostRule = this.cstPostRuleOnlyOffset;
            this.setInitialNodeLocation = this.setInitialNodeLocationOnlyOffsetRegular;
          }
        } else if (/none/i.test(this.nodeLocationTracking)) {
          this.setNodeLocationFromToken = noop_default;
          this.setNodeLocationFromNode = noop_default;
          this.cstPostRule = noop_default;
          this.setInitialNodeLocation = noop_default;
        } else {
          throw Error(`Invalid <nodeLocationTracking> config option: "${config.nodeLocationTracking}"`);
        }
      }
    }
    setInitialNodeLocationOnlyOffsetRecovery(cstNode) {
      cstNode.location = {
        startOffset: NaN,
        endOffset: NaN
      };
    }
    setInitialNodeLocationOnlyOffsetRegular(cstNode) {
      cstNode.location = {
        // without error recovery the starting Location of a new CstNode is guaranteed
        // To be the next Token's startOffset (for valid inputs).
        // For invalid inputs there won't be any CSTOutput so this potential
        // inaccuracy does not matter
        startOffset: this.LA(1).startOffset,
        endOffset: NaN
      };
    }
    setInitialNodeLocationFullRecovery(cstNode) {
      cstNode.location = {
        startOffset: NaN,
        startLine: NaN,
        startColumn: NaN,
        endOffset: NaN,
        endLine: NaN,
        endColumn: NaN
      };
    }
    /**
         *  @see setInitialNodeLocationOnlyOffsetRegular for explanation why this work
    
         * @param cstNode
         */
    setInitialNodeLocationFullRegular(cstNode) {
      const nextToken = this.LA(1);
      cstNode.location = {
        startOffset: nextToken.startOffset,
        startLine: nextToken.startLine,
        startColumn: nextToken.startColumn,
        endOffset: NaN,
        endLine: NaN,
        endColumn: NaN
      };
    }
    cstInvocationStateUpdate(fullRuleName) {
      const cstNode = {
        name: fullRuleName,
        children: /* @__PURE__ */ Object.create(null)
      };
      this.setInitialNodeLocation(cstNode);
      this.CST_STACK.push(cstNode);
    }
    cstFinallyStateUpdate() {
      this.CST_STACK.pop();
    }
    cstPostRuleFull(ruleCstNode) {
      const prevToken = this.LA(0);
      const loc = ruleCstNode.location;
      if (loc.startOffset <= prevToken.startOffset === true) {
        loc.endOffset = prevToken.endOffset;
        loc.endLine = prevToken.endLine;
        loc.endColumn = prevToken.endColumn;
      } else {
        loc.startOffset = NaN;
        loc.startLine = NaN;
        loc.startColumn = NaN;
      }
    }
    cstPostRuleOnlyOffset(ruleCstNode) {
      const prevToken = this.LA(0);
      const loc = ruleCstNode.location;
      if (loc.startOffset <= prevToken.startOffset === true) {
        loc.endOffset = prevToken.endOffset;
      } else {
        loc.startOffset = NaN;
      }
    }
    cstPostTerminal(key, consumedToken) {
      const rootCst = this.CST_STACK[this.CST_STACK.length - 1];
      addTerminalToCst(rootCst, consumedToken, key);
      this.setNodeLocationFromToken(rootCst.location, consumedToken);
    }
    cstPostNonTerminal(ruleCstResult, ruleName) {
      const preCstNode = this.CST_STACK[this.CST_STACK.length - 1];
      addNoneTerminalToCst(preCstNode, ruleName, ruleCstResult);
      this.setNodeLocationFromNode(preCstNode.location, ruleCstResult.location);
    }
    getBaseCstVisitorConstructor() {
      if (isUndefined_default(this.baseCstVisitorConstructor)) {
        const newBaseCstVisitorConstructor = createBaseSemanticVisitorConstructor(this.className, keys_default(this.gastProductionsCache));
        this.baseCstVisitorConstructor = newBaseCstVisitorConstructor;
        return newBaseCstVisitorConstructor;
      }
      return this.baseCstVisitorConstructor;
    }
    getBaseCstVisitorConstructorWithDefaults() {
      if (isUndefined_default(this.baseCstVisitorWithDefaultsConstructor)) {
        const newConstructor = createBaseVisitorConstructorWithDefaults(this.className, keys_default(this.gastProductionsCache), this.getBaseCstVisitorConstructor());
        this.baseCstVisitorWithDefaultsConstructor = newConstructor;
        return newConstructor;
      }
      return this.baseCstVisitorWithDefaultsConstructor;
    }
    getLastExplicitRuleShortName() {
      const ruleStack = this.RULE_STACK;
      return ruleStack[ruleStack.length - 1];
    }
    getPreviousExplicitRuleShortName() {
      const ruleStack = this.RULE_STACK;
      return ruleStack[ruleStack.length - 2];
    }
    getLastExplicitRuleOccurrenceIndex() {
      const occurrenceStack = this.RULE_OCCURRENCE_STACK;
      return occurrenceStack[occurrenceStack.length - 1];
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/lexer_adapter.js
  var LexerAdapter = class {
    initLexerAdapter() {
      this.tokVector = [];
      this.tokVectorLength = 0;
      this.currIdx = -1;
    }
    set input(newInput) {
      if (this.selfAnalysisDone !== true) {
        throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`);
      }
      this.reset();
      this.tokVector = newInput;
      this.tokVectorLength = newInput.length;
    }
    get input() {
      return this.tokVector;
    }
    // skips a token and returns the next token
    SKIP_TOKEN() {
      if (this.currIdx <= this.tokVector.length - 2) {
        this.consumeToken();
        return this.LA(1);
      } else {
        return END_OF_FILE;
      }
    }
    // Lexer (accessing Token vector) related methods which can be overridden to implement lazy lexers
    // or lexers dependent on parser context.
    LA(howMuch) {
      const soughtIdx = this.currIdx + howMuch;
      if (soughtIdx < 0 || this.tokVectorLength <= soughtIdx) {
        return END_OF_FILE;
      } else {
        return this.tokVector[soughtIdx];
      }
    }
    consumeToken() {
      this.currIdx++;
    }
    exportLexerState() {
      return this.currIdx;
    }
    importLexerState(newState) {
      this.currIdx = newState;
    }
    resetLexerState() {
      this.currIdx = -1;
    }
    moveToTerminatedState() {
      this.currIdx = this.tokVector.length - 1;
    }
    getLexerPosition() {
      return this.exportLexerState();
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_api.js
  var RecognizerApi = class {
    ACTION(impl) {
      return impl.call(this);
    }
    consume(idx, tokType, options) {
      return this.consumeInternal(tokType, idx, options);
    }
    subrule(idx, ruleToCall, options) {
      return this.subruleInternal(ruleToCall, idx, options);
    }
    option(idx, actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, idx);
    }
    or(idx, altsOrOpts) {
      return this.orInternal(altsOrOpts, idx);
    }
    many(idx, actionORMethodDef) {
      return this.manyInternal(idx, actionORMethodDef);
    }
    atLeastOne(idx, actionORMethodDef) {
      return this.atLeastOneInternal(idx, actionORMethodDef);
    }
    CONSUME(tokType, options) {
      return this.consumeInternal(tokType, 0, options);
    }
    CONSUME1(tokType, options) {
      return this.consumeInternal(tokType, 1, options);
    }
    CONSUME2(tokType, options) {
      return this.consumeInternal(tokType, 2, options);
    }
    CONSUME3(tokType, options) {
      return this.consumeInternal(tokType, 3, options);
    }
    CONSUME4(tokType, options) {
      return this.consumeInternal(tokType, 4, options);
    }
    CONSUME5(tokType, options) {
      return this.consumeInternal(tokType, 5, options);
    }
    CONSUME6(tokType, options) {
      return this.consumeInternal(tokType, 6, options);
    }
    CONSUME7(tokType, options) {
      return this.consumeInternal(tokType, 7, options);
    }
    CONSUME8(tokType, options) {
      return this.consumeInternal(tokType, 8, options);
    }
    CONSUME9(tokType, options) {
      return this.consumeInternal(tokType, 9, options);
    }
    SUBRULE(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 0, options);
    }
    SUBRULE1(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 1, options);
    }
    SUBRULE2(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 2, options);
    }
    SUBRULE3(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 3, options);
    }
    SUBRULE4(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 4, options);
    }
    SUBRULE5(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 5, options);
    }
    SUBRULE6(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 6, options);
    }
    SUBRULE7(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 7, options);
    }
    SUBRULE8(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 8, options);
    }
    SUBRULE9(ruleToCall, options) {
      return this.subruleInternal(ruleToCall, 9, options);
    }
    OPTION(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 0);
    }
    OPTION1(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 1);
    }
    OPTION2(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 2);
    }
    OPTION3(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 3);
    }
    OPTION4(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 4);
    }
    OPTION5(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 5);
    }
    OPTION6(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 6);
    }
    OPTION7(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 7);
    }
    OPTION8(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 8);
    }
    OPTION9(actionORMethodDef) {
      return this.optionInternal(actionORMethodDef, 9);
    }
    OR(altsOrOpts) {
      return this.orInternal(altsOrOpts, 0);
    }
    OR1(altsOrOpts) {
      return this.orInternal(altsOrOpts, 1);
    }
    OR2(altsOrOpts) {
      return this.orInternal(altsOrOpts, 2);
    }
    OR3(altsOrOpts) {
      return this.orInternal(altsOrOpts, 3);
    }
    OR4(altsOrOpts) {
      return this.orInternal(altsOrOpts, 4);
    }
    OR5(altsOrOpts) {
      return this.orInternal(altsOrOpts, 5);
    }
    OR6(altsOrOpts) {
      return this.orInternal(altsOrOpts, 6);
    }
    OR7(altsOrOpts) {
      return this.orInternal(altsOrOpts, 7);
    }
    OR8(altsOrOpts) {
      return this.orInternal(altsOrOpts, 8);
    }
    OR9(altsOrOpts) {
      return this.orInternal(altsOrOpts, 9);
    }
    MANY(actionORMethodDef) {
      this.manyInternal(0, actionORMethodDef);
    }
    MANY1(actionORMethodDef) {
      this.manyInternal(1, actionORMethodDef);
    }
    MANY2(actionORMethodDef) {
      this.manyInternal(2, actionORMethodDef);
    }
    MANY3(actionORMethodDef) {
      this.manyInternal(3, actionORMethodDef);
    }
    MANY4(actionORMethodDef) {
      this.manyInternal(4, actionORMethodDef);
    }
    MANY5(actionORMethodDef) {
      this.manyInternal(5, actionORMethodDef);
    }
    MANY6(actionORMethodDef) {
      this.manyInternal(6, actionORMethodDef);
    }
    MANY7(actionORMethodDef) {
      this.manyInternal(7, actionORMethodDef);
    }
    MANY8(actionORMethodDef) {
      this.manyInternal(8, actionORMethodDef);
    }
    MANY9(actionORMethodDef) {
      this.manyInternal(9, actionORMethodDef);
    }
    MANY_SEP(options) {
      this.manySepFirstInternal(0, options);
    }
    MANY_SEP1(options) {
      this.manySepFirstInternal(1, options);
    }
    MANY_SEP2(options) {
      this.manySepFirstInternal(2, options);
    }
    MANY_SEP3(options) {
      this.manySepFirstInternal(3, options);
    }
    MANY_SEP4(options) {
      this.manySepFirstInternal(4, options);
    }
    MANY_SEP5(options) {
      this.manySepFirstInternal(5, options);
    }
    MANY_SEP6(options) {
      this.manySepFirstInternal(6, options);
    }
    MANY_SEP7(options) {
      this.manySepFirstInternal(7, options);
    }
    MANY_SEP8(options) {
      this.manySepFirstInternal(8, options);
    }
    MANY_SEP9(options) {
      this.manySepFirstInternal(9, options);
    }
    AT_LEAST_ONE(actionORMethodDef) {
      this.atLeastOneInternal(0, actionORMethodDef);
    }
    AT_LEAST_ONE1(actionORMethodDef) {
      return this.atLeastOneInternal(1, actionORMethodDef);
    }
    AT_LEAST_ONE2(actionORMethodDef) {
      this.atLeastOneInternal(2, actionORMethodDef);
    }
    AT_LEAST_ONE3(actionORMethodDef) {
      this.atLeastOneInternal(3, actionORMethodDef);
    }
    AT_LEAST_ONE4(actionORMethodDef) {
      this.atLeastOneInternal(4, actionORMethodDef);
    }
    AT_LEAST_ONE5(actionORMethodDef) {
      this.atLeastOneInternal(5, actionORMethodDef);
    }
    AT_LEAST_ONE6(actionORMethodDef) {
      this.atLeastOneInternal(6, actionORMethodDef);
    }
    AT_LEAST_ONE7(actionORMethodDef) {
      this.atLeastOneInternal(7, actionORMethodDef);
    }
    AT_LEAST_ONE8(actionORMethodDef) {
      this.atLeastOneInternal(8, actionORMethodDef);
    }
    AT_LEAST_ONE9(actionORMethodDef) {
      this.atLeastOneInternal(9, actionORMethodDef);
    }
    AT_LEAST_ONE_SEP(options) {
      this.atLeastOneSepFirstInternal(0, options);
    }
    AT_LEAST_ONE_SEP1(options) {
      this.atLeastOneSepFirstInternal(1, options);
    }
    AT_LEAST_ONE_SEP2(options) {
      this.atLeastOneSepFirstInternal(2, options);
    }
    AT_LEAST_ONE_SEP3(options) {
      this.atLeastOneSepFirstInternal(3, options);
    }
    AT_LEAST_ONE_SEP4(options) {
      this.atLeastOneSepFirstInternal(4, options);
    }
    AT_LEAST_ONE_SEP5(options) {
      this.atLeastOneSepFirstInternal(5, options);
    }
    AT_LEAST_ONE_SEP6(options) {
      this.atLeastOneSepFirstInternal(6, options);
    }
    AT_LEAST_ONE_SEP7(options) {
      this.atLeastOneSepFirstInternal(7, options);
    }
    AT_LEAST_ONE_SEP8(options) {
      this.atLeastOneSepFirstInternal(8, options);
    }
    AT_LEAST_ONE_SEP9(options) {
      this.atLeastOneSepFirstInternal(9, options);
    }
    RULE(name, implementation, config = DEFAULT_RULE_CONFIG) {
      if (includes_default(this.definedRulesNames, name)) {
        const errMsg = defaultGrammarValidatorErrorProvider.buildDuplicateRuleNameError({
          topLevelRule: name,
          grammarName: this.className
        });
        const error = {
          message: errMsg,
          type: ParserDefinitionErrorType.DUPLICATE_RULE_NAME,
          ruleName: name
        };
        this.definitionErrors.push(error);
      }
      this.definedRulesNames.push(name);
      const ruleImplementation = this.defineRule(name, implementation, config);
      this[name] = ruleImplementation;
      return ruleImplementation;
    }
    OVERRIDE_RULE(name, impl, config = DEFAULT_RULE_CONFIG) {
      const ruleErrors = validateRuleIsOverridden(name, this.definedRulesNames, this.className);
      this.definitionErrors = this.definitionErrors.concat(ruleErrors);
      const ruleImplementation = this.defineRule(name, impl, config);
      this[name] = ruleImplementation;
      return ruleImplementation;
    }
    BACKTRACK(grammarRule, args) {
      return function() {
        this.isBackTrackingStack.push(1);
        const orgState = this.saveRecogState();
        try {
          grammarRule.apply(this, args);
          return true;
        } catch (e) {
          if (isRecognitionException(e)) {
            return false;
          } else {
            throw e;
          }
        } finally {
          this.reloadRecogState(orgState);
          this.isBackTrackingStack.pop();
        }
      };
    }
    // GAST export APIs
    getGAstProductions() {
      return this.gastProductionsCache;
    }
    getSerializedGastProductions() {
      return serializeGrammar(values_default(this.gastProductionsCache));
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/recognizer_engine.js
  var RecognizerEngine = class {
    initRecognizerEngine(tokenVocabulary, config) {
      this.className = this.constructor.name;
      this.shortRuleNameToFull = {};
      this.fullRuleNameToShort = {};
      this.ruleShortNameIdx = 256;
      this.tokenMatcher = tokenStructuredMatcherNoCategories;
      this.subruleIdx = 0;
      this.definedRulesNames = [];
      this.tokensMap = {};
      this.isBackTrackingStack = [];
      this.RULE_STACK = [];
      this.RULE_OCCURRENCE_STACK = [];
      this.gastProductionsCache = {};
      if (has_default(config, "serializedGrammar")) {
        throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.");
      }
      if (isArray_default(tokenVocabulary)) {
        if (isEmpty_default(tokenVocabulary)) {
          throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).");
        }
        if (typeof tokenVocabulary[0].startOffset === "number") {
          throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.");
        }
      }
      if (isArray_default(tokenVocabulary)) {
        this.tokensMap = reduce_default(tokenVocabulary, (acc, tokType) => {
          acc[tokType.name] = tokType;
          return acc;
        }, {});
      } else if (has_default(tokenVocabulary, "modes") && every_default(flatten_default(values_default(tokenVocabulary.modes)), isTokenType)) {
        const allTokenTypes2 = flatten_default(values_default(tokenVocabulary.modes));
        const uniqueTokens = uniq_default(allTokenTypes2);
        this.tokensMap = reduce_default(uniqueTokens, (acc, tokType) => {
          acc[tokType.name] = tokType;
          return acc;
        }, {});
      } else if (isObject_default(tokenVocabulary)) {
        this.tokensMap = clone_default(tokenVocabulary);
      } else {
        throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");
      }
      this.tokensMap["EOF"] = EOF;
      const allTokenTypes = has_default(tokenVocabulary, "modes") ? flatten_default(values_default(tokenVocabulary.modes)) : values_default(tokenVocabulary);
      const noTokenCategoriesUsed = every_default(allTokenTypes, (tokenConstructor) => isEmpty_default(tokenConstructor.categoryMatches));
      this.tokenMatcher = noTokenCategoriesUsed ? tokenStructuredMatcherNoCategories : tokenStructuredMatcher;
      augmentTokenTypes(values_default(this.tokensMap));
    }
    defineRule(ruleName, impl, config) {
      if (this.selfAnalysisDone) {
        throw Error(`Grammar rule <${ruleName}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`);
      }
      const resyncEnabled = has_default(config, "resyncEnabled") ? config.resyncEnabled : DEFAULT_RULE_CONFIG.resyncEnabled;
      const recoveryValueFunc = has_default(config, "recoveryValueFunc") ? config.recoveryValueFunc : DEFAULT_RULE_CONFIG.recoveryValueFunc;
      const shortName = this.ruleShortNameIdx << BITS_FOR_METHOD_TYPE + BITS_FOR_OCCURRENCE_IDX;
      this.ruleShortNameIdx++;
      this.shortRuleNameToFull[shortName] = ruleName;
      this.fullRuleNameToShort[ruleName] = shortName;
      let invokeRuleWithTry;
      if (this.outputCst === true) {
        invokeRuleWithTry = function invokeRuleWithTry2(...args) {
          try {
            this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
            impl.apply(this, args);
            const cst = this.CST_STACK[this.CST_STACK.length - 1];
            this.cstPostRule(cst);
            return cst;
          } catch (e) {
            return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
          } finally {
            this.ruleFinallyStateUpdate();
          }
        };
      } else {
        invokeRuleWithTry = function invokeRuleWithTryCst(...args) {
          try {
            this.ruleInvocationStateUpdate(shortName, ruleName, this.subruleIdx);
            return impl.apply(this, args);
          } catch (e) {
            return this.invokeRuleCatch(e, resyncEnabled, recoveryValueFunc);
          } finally {
            this.ruleFinallyStateUpdate();
          }
        };
      }
      const wrappedGrammarRule = Object.assign(invokeRuleWithTry, { ruleName, originalGrammarAction: impl });
      return wrappedGrammarRule;
    }
    invokeRuleCatch(e, resyncEnabledConfig, recoveryValueFunc) {
      const isFirstInvokedRule = this.RULE_STACK.length === 1;
      const reSyncEnabled = resyncEnabledConfig && !this.isBackTracking() && this.recoveryEnabled;
      if (isRecognitionException(e)) {
        const recogError = e;
        if (reSyncEnabled) {
          const reSyncTokType = this.findReSyncTokenType();
          if (this.isInCurrentRuleReSyncSet(reSyncTokType)) {
            recogError.resyncedTokens = this.reSyncTo(reSyncTokType);
            if (this.outputCst) {
              const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
              partialCstResult.recoveredNode = true;
              return partialCstResult;
            } else {
              return recoveryValueFunc(e);
            }
          } else {
            if (this.outputCst) {
              const partialCstResult = this.CST_STACK[this.CST_STACK.length - 1];
              partialCstResult.recoveredNode = true;
              recogError.partialCstResult = partialCstResult;
            }
            throw recogError;
          }
        } else if (isFirstInvokedRule) {
          this.moveToTerminatedState();
          return recoveryValueFunc(e);
        } else {
          throw recogError;
        }
      } else {
        throw e;
      }
    }
    // Implementation of parsing DSL
    optionInternal(actionORMethodDef, occurrence) {
      const key = this.getKeyForAutomaticLookahead(OPTION_IDX, occurrence);
      return this.optionInternalLogic(actionORMethodDef, occurrence, key);
    }
    optionInternalLogic(actionORMethodDef, occurrence, key) {
      let lookAheadFunc = this.getLaFuncFromCache(key);
      let action;
      if (typeof actionORMethodDef !== "function") {
        action = actionORMethodDef.DEF;
        const predicate = actionORMethodDef.GATE;
        if (predicate !== void 0) {
          const orgLookaheadFunction = lookAheadFunc;
          lookAheadFunc = () => {
            return predicate.call(this) && orgLookaheadFunction.call(this);
          };
        }
      } else {
        action = actionORMethodDef;
      }
      if (lookAheadFunc.call(this) === true) {
        return action.call(this);
      }
      return void 0;
    }
    atLeastOneInternal(prodOccurrence, actionORMethodDef) {
      const laKey = this.getKeyForAutomaticLookahead(AT_LEAST_ONE_IDX, prodOccurrence);
      return this.atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, laKey);
    }
    atLeastOneInternalLogic(prodOccurrence, actionORMethodDef, key) {
      let lookAheadFunc = this.getLaFuncFromCache(key);
      let action;
      if (typeof actionORMethodDef !== "function") {
        action = actionORMethodDef.DEF;
        const predicate = actionORMethodDef.GATE;
        if (predicate !== void 0) {
          const orgLookaheadFunction = lookAheadFunc;
          lookAheadFunc = () => {
            return predicate.call(this) && orgLookaheadFunction.call(this);
          };
        }
      } else {
        action = actionORMethodDef;
      }
      if (lookAheadFunc.call(this) === true) {
        let notStuck = this.doSingleRepetition(action);
        while (lookAheadFunc.call(this) === true && notStuck === true) {
          notStuck = this.doSingleRepetition(action);
        }
      } else {
        throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY, actionORMethodDef.ERR_MSG);
      }
      this.attemptInRepetitionRecovery(this.atLeastOneInternal, [prodOccurrence, actionORMethodDef], lookAheadFunc, AT_LEAST_ONE_IDX, prodOccurrence, NextTerminalAfterAtLeastOneWalker);
    }
    atLeastOneSepFirstInternal(prodOccurrence, options) {
      const laKey = this.getKeyForAutomaticLookahead(AT_LEAST_ONE_SEP_IDX, prodOccurrence);
      this.atLeastOneSepFirstInternalLogic(prodOccurrence, options, laKey);
    }
    atLeastOneSepFirstInternalLogic(prodOccurrence, options, key) {
      const action = options.DEF;
      const separator = options.SEP;
      const firstIterationLookaheadFunc = this.getLaFuncFromCache(key);
      if (firstIterationLookaheadFunc.call(this) === true) {
        action.call(this);
        const separatorLookAheadFunc = () => {
          return this.tokenMatcher(this.LA(1), separator);
        };
        while (this.tokenMatcher(this.LA(1), separator) === true) {
          this.CONSUME(separator);
          action.call(this);
        }
        this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
          prodOccurrence,
          separator,
          separatorLookAheadFunc,
          action,
          NextTerminalAfterAtLeastOneSepWalker
        ], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, NextTerminalAfterAtLeastOneSepWalker);
      } else {
        throw this.raiseEarlyExitException(prodOccurrence, PROD_TYPE.REPETITION_MANDATORY_WITH_SEPARATOR, options.ERR_MSG);
      }
    }
    manyInternal(prodOccurrence, actionORMethodDef) {
      const laKey = this.getKeyForAutomaticLookahead(MANY_IDX, prodOccurrence);
      return this.manyInternalLogic(prodOccurrence, actionORMethodDef, laKey);
    }
    manyInternalLogic(prodOccurrence, actionORMethodDef, key) {
      let lookaheadFunction = this.getLaFuncFromCache(key);
      let action;
      if (typeof actionORMethodDef !== "function") {
        action = actionORMethodDef.DEF;
        const predicate = actionORMethodDef.GATE;
        if (predicate !== void 0) {
          const orgLookaheadFunction = lookaheadFunction;
          lookaheadFunction = () => {
            return predicate.call(this) && orgLookaheadFunction.call(this);
          };
        }
      } else {
        action = actionORMethodDef;
      }
      let notStuck = true;
      while (lookaheadFunction.call(this) === true && notStuck === true) {
        notStuck = this.doSingleRepetition(action);
      }
      this.attemptInRepetitionRecovery(
        this.manyInternal,
        [prodOccurrence, actionORMethodDef],
        lookaheadFunction,
        MANY_IDX,
        prodOccurrence,
        NextTerminalAfterManyWalker,
        // The notStuck parameter is only relevant when "attemptInRepetitionRecovery"
        // is invoked from manyInternal, in the MANY_SEP case and AT_LEAST_ONE[_SEP]
        // An infinite loop cannot occur as:
        // - Either the lookahead is guaranteed to consume something (Single Token Separator)
        // - AT_LEAST_ONE by definition is guaranteed to consume something (or error out).
        notStuck
      );
    }
    manySepFirstInternal(prodOccurrence, options) {
      const laKey = this.getKeyForAutomaticLookahead(MANY_SEP_IDX, prodOccurrence);
      this.manySepFirstInternalLogic(prodOccurrence, options, laKey);
    }
    manySepFirstInternalLogic(prodOccurrence, options, key) {
      const action = options.DEF;
      const separator = options.SEP;
      const firstIterationLaFunc = this.getLaFuncFromCache(key);
      if (firstIterationLaFunc.call(this) === true) {
        action.call(this);
        const separatorLookAheadFunc = () => {
          return this.tokenMatcher(this.LA(1), separator);
        };
        while (this.tokenMatcher(this.LA(1), separator) === true) {
          this.CONSUME(separator);
          action.call(this);
        }
        this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
          prodOccurrence,
          separator,
          separatorLookAheadFunc,
          action,
          NextTerminalAfterManySepWalker
        ], separatorLookAheadFunc, MANY_SEP_IDX, prodOccurrence, NextTerminalAfterManySepWalker);
      }
    }
    repetitionSepSecondInternal(prodOccurrence, separator, separatorLookAheadFunc, action, nextTerminalAfterWalker) {
      while (separatorLookAheadFunc()) {
        this.CONSUME(separator);
        action.call(this);
      }
      this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal, [
        prodOccurrence,
        separator,
        separatorLookAheadFunc,
        action,
        nextTerminalAfterWalker
      ], separatorLookAheadFunc, AT_LEAST_ONE_SEP_IDX, prodOccurrence, nextTerminalAfterWalker);
    }
    doSingleRepetition(action) {
      const beforeIteration = this.getLexerPosition();
      action.call(this);
      const afterIteration = this.getLexerPosition();
      return afterIteration > beforeIteration;
    }
    orInternal(altsOrOpts, occurrence) {
      const laKey = this.getKeyForAutomaticLookahead(OR_IDX, occurrence);
      const alts = isArray_default(altsOrOpts) ? altsOrOpts : altsOrOpts.DEF;
      const laFunc = this.getLaFuncFromCache(laKey);
      const altIdxToTake = laFunc.call(this, alts);
      if (altIdxToTake !== void 0) {
        const chosenAlternative = alts[altIdxToTake];
        return chosenAlternative.ALT.call(this);
      }
      this.raiseNoAltException(occurrence, altsOrOpts.ERR_MSG);
    }
    ruleFinallyStateUpdate() {
      this.RULE_STACK.pop();
      this.RULE_OCCURRENCE_STACK.pop();
      this.cstFinallyStateUpdate();
      if (this.RULE_STACK.length === 0 && this.isAtEndOfInput() === false) {
        const firstRedundantTok = this.LA(1);
        const errMsg = this.errorMessageProvider.buildNotAllInputParsedMessage({
          firstRedundant: firstRedundantTok,
          ruleName: this.getCurrRuleFullName()
        });
        this.SAVE_ERROR(new NotAllInputParsedException(errMsg, firstRedundantTok));
      }
    }
    subruleInternal(ruleToCall, idx, options) {
      let ruleResult;
      try {
        const args = options !== void 0 ? options.ARGS : void 0;
        this.subruleIdx = idx;
        ruleResult = ruleToCall.apply(this, args);
        this.cstPostNonTerminal(ruleResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleToCall.ruleName);
        return ruleResult;
      } catch (e) {
        throw this.subruleInternalError(e, options, ruleToCall.ruleName);
      }
    }
    subruleInternalError(e, options, ruleName) {
      if (isRecognitionException(e) && e.partialCstResult !== void 0) {
        this.cstPostNonTerminal(e.partialCstResult, options !== void 0 && options.LABEL !== void 0 ? options.LABEL : ruleName);
        delete e.partialCstResult;
      }
      throw e;
    }
    consumeInternal(tokType, idx, options) {
      let consumedToken;
      try {
        const nextToken = this.LA(1);
        if (this.tokenMatcher(nextToken, tokType) === true) {
          this.consumeToken();
          consumedToken = nextToken;
        } else {
          this.consumeInternalError(tokType, nextToken, options);
        }
      } catch (eFromConsumption) {
        consumedToken = this.consumeInternalRecovery(tokType, idx, eFromConsumption);
      }
      this.cstPostTerminal(options !== void 0 && options.LABEL !== void 0 ? options.LABEL : tokType.name, consumedToken);
      return consumedToken;
    }
    consumeInternalError(tokType, nextToken, options) {
      let msg;
      const previousToken = this.LA(0);
      if (options !== void 0 && options.ERR_MSG) {
        msg = options.ERR_MSG;
      } else {
        msg = this.errorMessageProvider.buildMismatchTokenMessage({
          expected: tokType,
          actual: nextToken,
          previous: previousToken,
          ruleName: this.getCurrRuleFullName()
        });
      }
      throw this.SAVE_ERROR(new MismatchedTokenException(msg, nextToken, previousToken));
    }
    consumeInternalRecovery(tokType, idx, eFromConsumption) {
      if (this.recoveryEnabled && // TODO: more robust checking of the exception type. Perhaps Typescript extending expressions?
      eFromConsumption.name === "MismatchedTokenException" && !this.isBackTracking()) {
        const follows = this.getFollowsForInRuleRecovery(tokType, idx);
        try {
          return this.tryInRuleRecovery(tokType, follows);
        } catch (eFromInRuleRecovery) {
          if (eFromInRuleRecovery.name === IN_RULE_RECOVERY_EXCEPTION) {
            throw eFromConsumption;
          } else {
            throw eFromInRuleRecovery;
          }
        }
      } else {
        throw eFromConsumption;
      }
    }
    saveRecogState() {
      const savedErrors = this.errors;
      const savedRuleStack = clone_default(this.RULE_STACK);
      return {
        errors: savedErrors,
        lexerState: this.exportLexerState(),
        RULE_STACK: savedRuleStack,
        CST_STACK: this.CST_STACK
      };
    }
    reloadRecogState(newState) {
      this.errors = newState.errors;
      this.importLexerState(newState.lexerState);
      this.RULE_STACK = newState.RULE_STACK;
    }
    ruleInvocationStateUpdate(shortName, fullName, idxInCallingRule) {
      this.RULE_OCCURRENCE_STACK.push(idxInCallingRule);
      this.RULE_STACK.push(shortName);
      this.cstInvocationStateUpdate(fullName);
    }
    isBackTracking() {
      return this.isBackTrackingStack.length !== 0;
    }
    getCurrRuleFullName() {
      const shortName = this.getLastExplicitRuleShortName();
      return this.shortRuleNameToFull[shortName];
    }
    shortRuleNameToFullName(shortName) {
      return this.shortRuleNameToFull[shortName];
    }
    isAtEndOfInput() {
      return this.tokenMatcher(this.LA(1), EOF);
    }
    reset() {
      this.resetLexerState();
      this.subruleIdx = 0;
      this.isBackTrackingStack = [];
      this.errors = [];
      this.RULE_STACK = [];
      this.CST_STACK = [];
      this.RULE_OCCURRENCE_STACK = [];
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/error_handler.js
  var ErrorHandler = class {
    initErrorHandler(config) {
      this._errors = [];
      this.errorMessageProvider = has_default(config, "errorMessageProvider") ? config.errorMessageProvider : DEFAULT_PARSER_CONFIG.errorMessageProvider;
    }
    SAVE_ERROR(error) {
      if (isRecognitionException(error)) {
        error.context = {
          ruleStack: this.getHumanReadableRuleStack(),
          ruleOccurrenceStack: clone_default(this.RULE_OCCURRENCE_STACK)
        };
        this._errors.push(error);
        return error;
      } else {
        throw Error("Trying to save an Error which is not a RecognitionException");
      }
    }
    get errors() {
      return clone_default(this._errors);
    }
    set errors(newErrors) {
      this._errors = newErrors;
    }
    // TODO: consider caching the error message computed information
    raiseEarlyExitException(occurrence, prodType, userDefinedErrMsg) {
      const ruleName = this.getCurrRuleFullName();
      const ruleGrammar = this.getGAstProductions()[ruleName];
      const lookAheadPathsPerAlternative = getLookaheadPathsForOptionalProd(occurrence, ruleGrammar, prodType, this.maxLookahead);
      const insideProdPaths = lookAheadPathsPerAlternative[0];
      const actualTokens = [];
      for (let i = 1; i <= this.maxLookahead; i++) {
        actualTokens.push(this.LA(i));
      }
      const msg = this.errorMessageProvider.buildEarlyExitMessage({
        expectedIterationPaths: insideProdPaths,
        actual: actualTokens,
        previous: this.LA(0),
        customUserDescription: userDefinedErrMsg,
        ruleName
      });
      throw this.SAVE_ERROR(new EarlyExitException(msg, this.LA(1), this.LA(0)));
    }
    // TODO: consider caching the error message computed information
    raiseNoAltException(occurrence, errMsgTypes) {
      const ruleName = this.getCurrRuleFullName();
      const ruleGrammar = this.getGAstProductions()[ruleName];
      const lookAheadPathsPerAlternative = getLookaheadPathsForOr(occurrence, ruleGrammar, this.maxLookahead);
      const actualTokens = [];
      for (let i = 1; i <= this.maxLookahead; i++) {
        actualTokens.push(this.LA(i));
      }
      const previousToken = this.LA(0);
      const errMsg = this.errorMessageProvider.buildNoViableAltMessage({
        expectedPathsPerAlt: lookAheadPathsPerAlternative,
        actual: actualTokens,
        previous: previousToken,
        customUserDescription: errMsgTypes,
        ruleName: this.getCurrRuleFullName()
      });
      throw this.SAVE_ERROR(new NoViableAltException(errMsg, this.LA(1), previousToken));
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/context_assist.js
  var ContentAssist = class {
    initContentAssist() {
    }
    computeContentAssist(startRuleName, precedingInput) {
      const startRuleGast = this.gastProductionsCache[startRuleName];
      if (isUndefined_default(startRuleGast)) {
        throw Error(`Rule ->${startRuleName}<- does not exist in this grammar.`);
      }
      return nextPossibleTokensAfter([startRuleGast], precedingInput, this.tokenMatcher, this.maxLookahead);
    }
    // TODO: should this be a member method or a utility? it does not have any state or usage of 'this'...
    // TODO: should this be more explicitly part of the public API?
    getNextPossibleTokenTypes(grammarPath) {
      const topRuleName = head_default(grammarPath.ruleStack);
      const gastProductions = this.getGAstProductions();
      const topProduction = gastProductions[topRuleName];
      const nextPossibleTokenTypes = new NextAfterTokenWalker(topProduction, grammarPath).startWalking();
      return nextPossibleTokenTypes;
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/gast_recorder.js
  var RECORDING_NULL_OBJECT = {
    description: "This Object indicates the Parser is during Recording Phase"
  };
  Object.freeze(RECORDING_NULL_OBJECT);
  var HANDLE_SEPARATOR = true;
  var MAX_METHOD_IDX = Math.pow(2, BITS_FOR_OCCURRENCE_IDX) - 1;
  var RFT = createToken({ name: "RECORDING_PHASE_TOKEN", pattern: Lexer.NA });
  augmentTokenTypes([RFT]);
  var RECORDING_PHASE_TOKEN = createTokenInstance(
    RFT,
    "This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
    // Using "-1" instead of NaN (as in EOF) because an actual number is less likely to
    // cause errors if the output of LA or CONSUME would be (incorrectly) used during the recording phase.
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  );
  Object.freeze(RECORDING_PHASE_TOKEN);
  var RECORDING_PHASE_CSTNODE = {
    name: "This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",
    children: {}
  };
  var GastRecorder = class {
    initGastRecorder(config) {
      this.recordingProdStack = [];
      this.RECORDING_PHASE = false;
    }
    enableRecording() {
      this.RECORDING_PHASE = true;
      this.TRACE_INIT("Enable Recording", () => {
        for (let i = 0; i < 10; i++) {
          const idx = i > 0 ? i : "";
          this[`CONSUME${idx}`] = function(arg1, arg2) {
            return this.consumeInternalRecord(arg1, i, arg2);
          };
          this[`SUBRULE${idx}`] = function(arg1, arg2) {
            return this.subruleInternalRecord(arg1, i, arg2);
          };
          this[`OPTION${idx}`] = function(arg1) {
            return this.optionInternalRecord(arg1, i);
          };
          this[`OR${idx}`] = function(arg1) {
            return this.orInternalRecord(arg1, i);
          };
          this[`MANY${idx}`] = function(arg1) {
            this.manyInternalRecord(i, arg1);
          };
          this[`MANY_SEP${idx}`] = function(arg1) {
            this.manySepFirstInternalRecord(i, arg1);
          };
          this[`AT_LEAST_ONE${idx}`] = function(arg1) {
            this.atLeastOneInternalRecord(i, arg1);
          };
          this[`AT_LEAST_ONE_SEP${idx}`] = function(arg1) {
            this.atLeastOneSepFirstInternalRecord(i, arg1);
          };
        }
        this[`consume`] = function(idx, arg1, arg2) {
          return this.consumeInternalRecord(arg1, idx, arg2);
        };
        this[`subrule`] = function(idx, arg1, arg2) {
          return this.subruleInternalRecord(arg1, idx, arg2);
        };
        this[`option`] = function(idx, arg1) {
          return this.optionInternalRecord(arg1, idx);
        };
        this[`or`] = function(idx, arg1) {
          return this.orInternalRecord(arg1, idx);
        };
        this[`many`] = function(idx, arg1) {
          this.manyInternalRecord(idx, arg1);
        };
        this[`atLeastOne`] = function(idx, arg1) {
          this.atLeastOneInternalRecord(idx, arg1);
        };
        this.ACTION = this.ACTION_RECORD;
        this.BACKTRACK = this.BACKTRACK_RECORD;
        this.LA = this.LA_RECORD;
      });
    }
    disableRecording() {
      this.RECORDING_PHASE = false;
      this.TRACE_INIT("Deleting Recording methods", () => {
        const that = this;
        for (let i = 0; i < 10; i++) {
          const idx = i > 0 ? i : "";
          delete that[`CONSUME${idx}`];
          delete that[`SUBRULE${idx}`];
          delete that[`OPTION${idx}`];
          delete that[`OR${idx}`];
          delete that[`MANY${idx}`];
          delete that[`MANY_SEP${idx}`];
          delete that[`AT_LEAST_ONE${idx}`];
          delete that[`AT_LEAST_ONE_SEP${idx}`];
        }
        delete that[`consume`];
        delete that[`subrule`];
        delete that[`option`];
        delete that[`or`];
        delete that[`many`];
        delete that[`atLeastOne`];
        delete that.ACTION;
        delete that.BACKTRACK;
        delete that.LA;
      });
    }
    //   Parser methods are called inside an ACTION?
    //   Maybe try/catch/finally on ACTIONS while disabling the recorders state changes?
    // @ts-expect-error -- noop place holder
    ACTION_RECORD(impl) {
    }
    // Executing backtracking logic will break our recording logic assumptions
    BACKTRACK_RECORD(grammarRule, args) {
      return () => true;
    }
    // LA is part of the official API and may be used for custom lookahead logic
    // by end users who may forget to wrap it in ACTION or inside a GATE
    LA_RECORD(howMuch) {
      return END_OF_FILE;
    }
    topLevelRuleRecord(name, def) {
      try {
        const newTopLevelRule = new Rule({ definition: [], name });
        newTopLevelRule.name = name;
        this.recordingProdStack.push(newTopLevelRule);
        def.call(this);
        this.recordingProdStack.pop();
        return newTopLevelRule;
      } catch (originalError) {
        if (originalError.KNOWN_RECORDER_ERROR !== true) {
          try {
            originalError.message = originalError.message + '\n	 This error was thrown during the "grammar recording phase" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording';
          } catch (mutabilityError) {
            throw originalError;
          }
        }
        throw originalError;
      }
    }
    // Implementation of parsing DSL
    optionInternalRecord(actionORMethodDef, occurrence) {
      return recordProd.call(this, Option, actionORMethodDef, occurrence);
    }
    atLeastOneInternalRecord(occurrence, actionORMethodDef) {
      recordProd.call(this, RepetitionMandatory, actionORMethodDef, occurrence);
    }
    atLeastOneSepFirstInternalRecord(occurrence, options) {
      recordProd.call(this, RepetitionMandatoryWithSeparator, options, occurrence, HANDLE_SEPARATOR);
    }
    manyInternalRecord(occurrence, actionORMethodDef) {
      recordProd.call(this, Repetition, actionORMethodDef, occurrence);
    }
    manySepFirstInternalRecord(occurrence, options) {
      recordProd.call(this, RepetitionWithSeparator, options, occurrence, HANDLE_SEPARATOR);
    }
    orInternalRecord(altsOrOpts, occurrence) {
      return recordOrProd.call(this, altsOrOpts, occurrence);
    }
    subruleInternalRecord(ruleToCall, occurrence, options) {
      assertMethodIdxIsValid(occurrence);
      if (!ruleToCall || has_default(ruleToCall, "ruleName") === false) {
        const error = new Error(`<SUBRULE${getIdxSuffix(occurrence)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(ruleToCall)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);
        error.KNOWN_RECORDER_ERROR = true;
        throw error;
      }
      const prevProd = last_default(this.recordingProdStack);
      const ruleName = ruleToCall.ruleName;
      const newNoneTerminal = new NonTerminal({
        idx: occurrence,
        nonTerminalName: ruleName,
        label: options === null || options === void 0 ? void 0 : options.LABEL,
        // The resolving of the `referencedRule` property will be done once all the Rule's GASTs have been created
        referencedRule: void 0
      });
      prevProd.definition.push(newNoneTerminal);
      return this.outputCst ? RECORDING_PHASE_CSTNODE : RECORDING_NULL_OBJECT;
    }
    consumeInternalRecord(tokType, occurrence, options) {
      assertMethodIdxIsValid(occurrence);
      if (!hasShortKeyProperty(tokType)) {
        const error = new Error(`<CONSUME${getIdxSuffix(occurrence)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(tokType)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);
        error.KNOWN_RECORDER_ERROR = true;
        throw error;
      }
      const prevProd = last_default(this.recordingProdStack);
      const newNoneTerminal = new Terminal({
        idx: occurrence,
        terminalType: tokType,
        label: options === null || options === void 0 ? void 0 : options.LABEL
      });
      prevProd.definition.push(newNoneTerminal);
      return RECORDING_PHASE_TOKEN;
    }
  };
  function recordProd(prodConstructor, mainProdArg, occurrence, handleSep = false) {
    assertMethodIdxIsValid(occurrence);
    const prevProd = last_default(this.recordingProdStack);
    const grammarAction = isFunction_default(mainProdArg) ? mainProdArg : mainProdArg.DEF;
    const newProd = new prodConstructor({ definition: [], idx: occurrence });
    if (handleSep) {
      newProd.separator = mainProdArg.SEP;
    }
    if (has_default(mainProdArg, "MAX_LOOKAHEAD")) {
      newProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
    }
    this.recordingProdStack.push(newProd);
    grammarAction.call(this);
    prevProd.definition.push(newProd);
    this.recordingProdStack.pop();
    return RECORDING_NULL_OBJECT;
  }
  function recordOrProd(mainProdArg, occurrence) {
    assertMethodIdxIsValid(occurrence);
    const prevProd = last_default(this.recordingProdStack);
    const hasOptions = isArray_default(mainProdArg) === false;
    const alts = hasOptions === false ? mainProdArg : mainProdArg.DEF;
    const newOrProd = new Alternation({
      definition: [],
      idx: occurrence,
      ignoreAmbiguities: hasOptions && mainProdArg.IGNORE_AMBIGUITIES === true
    });
    if (has_default(mainProdArg, "MAX_LOOKAHEAD")) {
      newOrProd.maxLookahead = mainProdArg.MAX_LOOKAHEAD;
    }
    const hasPredicates = some_default(alts, (currAlt) => isFunction_default(currAlt.GATE));
    newOrProd.hasPredicates = hasPredicates;
    prevProd.definition.push(newOrProd);
    forEach_default(alts, (currAlt) => {
      const currAltFlat = new Alternative({ definition: [] });
      newOrProd.definition.push(currAltFlat);
      if (has_default(currAlt, "IGNORE_AMBIGUITIES")) {
        currAltFlat.ignoreAmbiguities = currAlt.IGNORE_AMBIGUITIES;
      } else if (has_default(currAlt, "GATE")) {
        currAltFlat.ignoreAmbiguities = true;
      }
      this.recordingProdStack.push(currAltFlat);
      currAlt.ALT.call(this);
      this.recordingProdStack.pop();
    });
    return RECORDING_NULL_OBJECT;
  }
  function getIdxSuffix(idx) {
    return idx === 0 ? "" : `${idx}`;
  }
  function assertMethodIdxIsValid(idx) {
    if (idx < 0 || idx > MAX_METHOD_IDX) {
      const error = new Error(
        // The stack trace will contain all the needed details
        `Invalid DSL Method idx value: <${idx}>
	Idx value must be a none negative value smaller than ${MAX_METHOD_IDX + 1}`
      );
      error.KNOWN_RECORDER_ERROR = true;
      throw error;
    }
  }

  // ../../node_modules/chevrotain/lib/src/parse/parser/traits/perf_tracer.js
  var PerformanceTracer = class {
    initPerformanceTracer(config) {
      if (has_default(config, "traceInitPerf")) {
        const userTraceInitPerf = config.traceInitPerf;
        const traceIsNumber = typeof userTraceInitPerf === "number";
        this.traceInitMaxIdent = traceIsNumber ? userTraceInitPerf : Infinity;
        this.traceInitPerf = traceIsNumber ? userTraceInitPerf > 0 : userTraceInitPerf;
      } else {
        this.traceInitMaxIdent = 0;
        this.traceInitPerf = DEFAULT_PARSER_CONFIG.traceInitPerf;
      }
      this.traceInitIndent = -1;
    }
    TRACE_INIT(phaseDesc, phaseImpl) {
      if (this.traceInitPerf === true) {
        this.traceInitIndent++;
        const indent = new Array(this.traceInitIndent + 1).join("	");
        if (this.traceInitIndent < this.traceInitMaxIdent) {
          console.log(`${indent}--> <${phaseDesc}>`);
        }
        const { time, value } = timer(phaseImpl);
        const traceMethod = time > 10 ? console.warn : console.log;
        if (this.traceInitIndent < this.traceInitMaxIdent) {
          traceMethod(`${indent}<-- <${phaseDesc}> time: ${time}ms`);
        }
        this.traceInitIndent--;
        return value;
      } else {
        return phaseImpl();
      }
    }
  };

  // ../../node_modules/chevrotain/lib/src/parse/parser/utils/apply_mixins.js
  function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach((baseCtor) => {
      const baseProto = baseCtor.prototype;
      Object.getOwnPropertyNames(baseProto).forEach((propName3) => {
        if (propName3 === "constructor") {
          return;
        }
        const basePropDescriptor = Object.getOwnPropertyDescriptor(baseProto, propName3);
        if (basePropDescriptor && (basePropDescriptor.get || basePropDescriptor.set)) {
          Object.defineProperty(derivedCtor.prototype, propName3, basePropDescriptor);
        } else {
          derivedCtor.prototype[propName3] = baseCtor.prototype[propName3];
        }
      });
    });
  }

  // ../../node_modules/chevrotain/lib/src/parse/parser/parser.js
  var END_OF_FILE = createTokenInstance(EOF, "", NaN, NaN, NaN, NaN, NaN, NaN);
  Object.freeze(END_OF_FILE);
  var DEFAULT_PARSER_CONFIG = Object.freeze({
    recoveryEnabled: false,
    maxLookahead: 3,
    dynamicTokensEnabled: false,
    outputCst: true,
    errorMessageProvider: defaultParserErrorProvider,
    nodeLocationTracking: "none",
    traceInitPerf: false,
    skipValidations: false
  });
  var DEFAULT_RULE_CONFIG = Object.freeze({
    recoveryValueFunc: () => void 0,
    resyncEnabled: true
  });
  var ParserDefinitionErrorType;
  (function(ParserDefinitionErrorType2) {
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_RULE_NAME"] = 0] = "INVALID_RULE_NAME";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["DUPLICATE_RULE_NAME"] = 1] = "DUPLICATE_RULE_NAME";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_RULE_OVERRIDE"] = 2] = "INVALID_RULE_OVERRIDE";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["DUPLICATE_PRODUCTIONS"] = 3] = "DUPLICATE_PRODUCTIONS";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["UNRESOLVED_SUBRULE_REF"] = 4] = "UNRESOLVED_SUBRULE_REF";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["LEFT_RECURSION"] = 5] = "LEFT_RECURSION";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["NONE_LAST_EMPTY_ALT"] = 6] = "NONE_LAST_EMPTY_ALT";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["AMBIGUOUS_ALTS"] = 7] = "AMBIGUOUS_ALTS";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["CONFLICT_TOKENS_RULES_NAMESPACE"] = 8] = "CONFLICT_TOKENS_RULES_NAMESPACE";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["INVALID_TOKEN_NAME"] = 9] = "INVALID_TOKEN_NAME";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["NO_NON_EMPTY_LOOKAHEAD"] = 10] = "NO_NON_EMPTY_LOOKAHEAD";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["AMBIGUOUS_PREFIX_ALTS"] = 11] = "AMBIGUOUS_PREFIX_ALTS";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["TOO_MANY_ALTS"] = 12] = "TOO_MANY_ALTS";
    ParserDefinitionErrorType2[ParserDefinitionErrorType2["CUSTOM_LOOKAHEAD_VALIDATION"] = 13] = "CUSTOM_LOOKAHEAD_VALIDATION";
  })(ParserDefinitionErrorType || (ParserDefinitionErrorType = {}));
  var Parser = class _Parser {
    /**
     *  @deprecated use the **instance** method with the same name instead
     */
    static performSelfAnalysis(parserInstance) {
      throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.");
    }
    performSelfAnalysis() {
      this.TRACE_INIT("performSelfAnalysis", () => {
        let defErrorsMsgs;
        this.selfAnalysisDone = true;
        const className = this.className;
        this.TRACE_INIT("toFastProps", () => {
          toFastProperties(this);
        });
        this.TRACE_INIT("Grammar Recording", () => {
          try {
            this.enableRecording();
            forEach_default(this.definedRulesNames, (currRuleName) => {
              const wrappedRule = this[currRuleName];
              const originalGrammarAction = wrappedRule["originalGrammarAction"];
              let recordedRuleGast;
              this.TRACE_INIT(`${currRuleName} Rule`, () => {
                recordedRuleGast = this.topLevelRuleRecord(currRuleName, originalGrammarAction);
              });
              this.gastProductionsCache[currRuleName] = recordedRuleGast;
            });
          } finally {
            this.disableRecording();
          }
        });
        let resolverErrors = [];
        this.TRACE_INIT("Grammar Resolving", () => {
          resolverErrors = resolveGrammar2({
            rules: values_default(this.gastProductionsCache)
          });
          this.definitionErrors = this.definitionErrors.concat(resolverErrors);
        });
        this.TRACE_INIT("Grammar Validations", () => {
          if (isEmpty_default(resolverErrors) && this.skipValidations === false) {
            const validationErrors = validateGrammar2({
              rules: values_default(this.gastProductionsCache),
              tokenTypes: values_default(this.tokensMap),
              errMsgProvider: defaultGrammarValidatorErrorProvider,
              grammarName: className
            });
            const lookaheadValidationErrors = validateLookahead({
              lookaheadStrategy: this.lookaheadStrategy,
              rules: values_default(this.gastProductionsCache),
              tokenTypes: values_default(this.tokensMap),
              grammarName: className
            });
            this.definitionErrors = this.definitionErrors.concat(validationErrors, lookaheadValidationErrors);
          }
        });
        if (isEmpty_default(this.definitionErrors)) {
          if (this.recoveryEnabled) {
            this.TRACE_INIT("computeAllProdsFollows", () => {
              const allFollows = computeAllProdsFollows(values_default(this.gastProductionsCache));
              this.resyncFollows = allFollows;
            });
          }
          this.TRACE_INIT("ComputeLookaheadFunctions", () => {
            var _a, _b;
            (_b = (_a = this.lookaheadStrategy).initialize) === null || _b === void 0 ? void 0 : _b.call(_a, {
              rules: values_default(this.gastProductionsCache)
            });
            this.preComputeLookaheadFunctions(values_default(this.gastProductionsCache));
          });
        }
        if (!_Parser.DEFER_DEFINITION_ERRORS_HANDLING && !isEmpty_default(this.definitionErrors)) {
          defErrorsMsgs = map_default(this.definitionErrors, (defError) => defError.message);
          throw new Error(`Parser Definition Errors detected:
 ${defErrorsMsgs.join("\n-------------------------------\n")}`);
        }
      });
    }
    constructor(tokenVocabulary, config) {
      this.definitionErrors = [];
      this.selfAnalysisDone = false;
      const that = this;
      that.initErrorHandler(config);
      that.initLexerAdapter();
      that.initLooksAhead(config);
      that.initRecognizerEngine(tokenVocabulary, config);
      that.initRecoverable(config);
      that.initTreeBuilder(config);
      that.initContentAssist();
      that.initGastRecorder(config);
      that.initPerformanceTracer(config);
      if (has_default(config, "ignoredIssues")) {
        throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.");
      }
      this.skipValidations = has_default(config, "skipValidations") ? config.skipValidations : DEFAULT_PARSER_CONFIG.skipValidations;
    }
  };
  Parser.DEFER_DEFINITION_ERRORS_HANDLING = false;
  applyMixins(Parser, [
    Recoverable,
    LooksAhead,
    TreeBuilder,
    LexerAdapter,
    RecognizerEngine,
    RecognizerApi,
    ErrorHandler,
    ContentAssist,
    GastRecorder,
    PerformanceTracer
  ]);
  var CstParser = class extends Parser {
    constructor(tokenVocabulary, config = DEFAULT_PARSER_CONFIG) {
      const configClone = clone_default(config);
      configClone.outputCst = true;
      super(tokenVocabulary, configClone);
    }
  };

  // ../../node_modules/fast-xml-parser/src/util.js
  var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
  var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
  var regexName = new RegExp("^" + nameRegexp + "$");
  function getAllMatches(string, regex) {
    const matches = [];
    let match = regex.exec(string);
    while (match) {
      const allmatches = [];
      allmatches.startIndex = regex.lastIndex - match[0].length;
      const len = match.length;
      for (let index = 0; index < len; index++) {
        allmatches.push(match[index]);
      }
      matches.push(allmatches);
      match = regex.exec(string);
    }
    return matches;
  }
  var isName = function(string) {
    const match = regexName.exec(string);
    return !(match === null || typeof match === "undefined");
  };
  function isExist(v2) {
    return typeof v2 !== "undefined";
  }

  // ../../node_modules/fast-xml-parser/src/validator.js
  var defaultOptions = {
    allowBooleanAttributes: false,
    //A tag can have attributes without any value
    unpairedTags: []
  };
  function validate(xmlData, options) {
    options = Object.assign({}, defaultOptions, options);
    const tags = [];
    let tagFound = false;
    let reachedRoot = false;
    if (xmlData[0] === "\uFEFF") {
      xmlData = xmlData.substr(1);
    }
    for (let i = 0; i < xmlData.length; i++) {
      if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
        i += 2;
        i = readPI(xmlData, i);
        if (i.err) return i;
      } else if (xmlData[i] === "<") {
        let tagStartPos = i;
        i++;
        if (xmlData[i] === "!") {
          i = readCommentAndCDATA(xmlData, i);
          continue;
        } else {
          let closingTag = false;
          if (xmlData[i] === "/") {
            closingTag = true;
            i++;
          }
          let tagName = "";
          for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
            tagName += xmlData[i];
          }
          tagName = tagName.trim();
          if (tagName[tagName.length - 1] === "/") {
            tagName = tagName.substring(0, tagName.length - 1);
            i--;
          }
          if (!validateTagName(tagName)) {
            let msg;
            if (tagName.trim().length === 0) {
              msg = "Invalid space after '<'.";
            } else {
              msg = "Tag '" + tagName + "' is an invalid name.";
            }
            return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
          }
          const result = readAttributeStr(xmlData, i);
          if (result === false) {
            return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
          }
          let attrStr = result.value;
          i = result.index;
          if (attrStr[attrStr.length - 1] === "/") {
            const attrStrStart = i - attrStr.length;
            attrStr = attrStr.substring(0, attrStr.length - 1);
            const isValid = validateAttributeString(attrStr, options);
            if (isValid === true) {
              tagFound = true;
            } else {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
            }
          } else if (closingTag) {
            if (!result.tagClosed) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
            } else if (attrStr.trim().length > 0) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
            } else if (tags.length === 0) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
            } else {
              const otg = tags.pop();
              if (tagName !== otg.tagName) {
                let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                return getErrorObject(
                  "InvalidTag",
                  "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                  getLineNumberForPosition(xmlData, tagStartPos)
                );
              }
              if (tags.length == 0) {
                reachedRoot = true;
              }
            }
          } else {
            const isValid = validateAttributeString(attrStr, options);
            if (isValid !== true) {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
            }
            if (reachedRoot === true) {
              return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
            } else if (options.unpairedTags.indexOf(tagName) !== -1) {
            } else {
              tags.push({ tagName, tagStartPos });
            }
            tagFound = true;
          }
          for (i++; i < xmlData.length; i++) {
            if (xmlData[i] === "<") {
              if (xmlData[i + 1] === "!") {
                i++;
                i = readCommentAndCDATA(xmlData, i);
                continue;
              } else if (xmlData[i + 1] === "?") {
                i = readPI(xmlData, ++i);
                if (i.err) return i;
              } else {
                break;
              }
            } else if (xmlData[i] === "&") {
              const afterAmp = validateAmpersand(xmlData, i);
              if (afterAmp == -1)
                return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
              i = afterAmp;
            } else {
              if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
              }
            }
          }
          if (xmlData[i] === "<") {
            i--;
          }
        }
      } else {
        if (isWhiteSpace(xmlData[i])) {
          continue;
        }
        return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
      }
    }
    if (!tagFound) {
      return getErrorObject("InvalidXml", "Start tag expected.", 1);
    } else if (tags.length == 1) {
      return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
    } else if (tags.length > 0) {
      return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
    }
    return true;
  }
  function isWhiteSpace(char) {
    return char === " " || char === "	" || char === "\n" || char === "\r";
  }
  function readPI(xmlData, i) {
    const start = i;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] == "?" || xmlData[i] == " ") {
        const tagname = xmlData.substr(start, i - start);
        if (i > 5 && tagname === "xml") {
          return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
        } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
          i++;
          break;
        } else {
          continue;
        }
      }
    }
    return i;
  }
  function readCommentAndCDATA(xmlData, i) {
    if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
      for (i += 3; i < xmlData.length; i++) {
        if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
          i += 2;
          break;
        }
      }
    } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
      let angleBracketsCount = 1;
      for (i += 8; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          angleBracketsCount++;
        } else if (xmlData[i] === ">") {
          angleBracketsCount--;
          if (angleBracketsCount === 0) {
            break;
          }
        }
      }
    } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
      for (i += 8; i < xmlData.length; i++) {
        if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
          i += 2;
          break;
        }
      }
    }
    return i;
  }
  var doubleQuote = '"';
  var singleQuote = "'";
  function readAttributeStr(xmlData, i) {
    let attrStr = "";
    let startChar = "";
    let tagClosed = false;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
        if (startChar === "") {
          startChar = xmlData[i];
        } else if (startChar !== xmlData[i]) {
        } else {
          startChar = "";
        }
      } else if (xmlData[i] === ">") {
        if (startChar === "") {
          tagClosed = true;
          break;
        }
      }
      attrStr += xmlData[i];
    }
    if (startChar !== "") {
      return false;
    }
    return {
      value: attrStr,
      index: i,
      tagClosed
    };
  }
  var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
  function validateAttributeString(attrStr, options) {
    const matches = getAllMatches(attrStr, validAttrStrRegxp);
    const attrNames = {};
    for (let i = 0; i < matches.length; i++) {
      if (matches[i][1].length === 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
      } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
      } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
        return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
      }
      const attrName = matches[i][2];
      if (!validateAttrName(attrName)) {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
      }
      if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) {
        attrNames[attrName] = 1;
      } else {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
      }
    }
    return true;
  }
  function validateNumberAmpersand(xmlData, i) {
    let re2 = /\d/;
    if (xmlData[i] === "x") {
      i++;
      re2 = /[\da-fA-F]/;
    }
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === ";")
        return i;
      if (!xmlData[i].match(re2))
        break;
    }
    return -1;
  }
  function validateAmpersand(xmlData, i) {
    i++;
    if (xmlData[i] === ";")
      return -1;
    if (xmlData[i] === "#") {
      i++;
      return validateNumberAmpersand(xmlData, i);
    }
    let count = 0;
    for (; i < xmlData.length; i++, count++) {
      if (xmlData[i].match(/\w/) && count < 20)
        continue;
      if (xmlData[i] === ";")
        break;
      return -1;
    }
    return i;
  }
  function getErrorObject(code, message, lineNumber) {
    return {
      err: {
        code,
        msg: message,
        line: lineNumber.line || lineNumber,
        col: lineNumber.col
      }
    };
  }
  function validateAttrName(attrName) {
    return isName(attrName);
  }
  function validateTagName(tagname) {
    return isName(tagname);
  }
  function getLineNumberForPosition(xmlData, index) {
    const lines = xmlData.substring(0, index).split(/\r?\n/);
    return {
      line: lines.length,
      // column number is last line's length + 1, because column numbering starts at 1:
      col: lines[lines.length - 1].length + 1
    };
  }
  function getPositionFromMatch(match) {
    return match.startIndex + match[1].length;
  }

  // ../../node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
  var defaultOptions2 = {
    preserveOrder: false,
    attributeNamePrefix: "@_",
    attributesGroupName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    removeNSPrefix: false,
    // remove NS from tag name or attribute name if true
    allowBooleanAttributes: false,
    //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true,
    //Trim string values of tag and attributes
    cdataPropName: false,
    numberParseOptions: {
      hex: true,
      leadingZeros: true,
      eNotation: true
    },
    tagValueProcessor: function(tagName, val) {
      return val;
    },
    attributeValueProcessor: function(attrName, val) {
      return val;
    },
    stopNodes: [],
    //nested tags will not be parsed even for errors
    alwaysCreateTextNode: false,
    isArray: () => false,
    commentPropName: false,
    unpairedTags: [],
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: false,
    ignorePiTags: false,
    transformTagName: false,
    transformAttributeName: false,
    updateTag: function(tagName, jPath, attrs) {
      return tagName;
    },
    // skipEmptyListItem: false
    captureMetaData: false,
    maxNestedTags: 100,
    strictReservedNames: true
  };
  function normalizeProcessEntities(value) {
    var _a, _b, _c, _d, _e2, _f, _g;
    if (typeof value === "boolean") {
      return {
        enabled: value,
        // true or false
        maxEntitySize: 1e4,
        maxExpansionDepth: 10,
        maxTotalExpansions: 1e3,
        maxExpandedLength: 1e5,
        maxEntityCount: 100,
        allowedTags: null,
        tagFilter: null
      };
    }
    if (typeof value === "object" && value !== null) {
      return {
        enabled: value.enabled !== false,
        // default true if not specified
        maxEntitySize: (_a = value.maxEntitySize) != null ? _a : 1e4,
        maxExpansionDepth: (_b = value.maxExpansionDepth) != null ? _b : 10,
        maxTotalExpansions: (_c = value.maxTotalExpansions) != null ? _c : 1e3,
        maxExpandedLength: (_d = value.maxExpandedLength) != null ? _d : 1e5,
        maxEntityCount: (_e2 = value.maxEntityCount) != null ? _e2 : 100,
        allowedTags: (_f = value.allowedTags) != null ? _f : null,
        tagFilter: (_g = value.tagFilter) != null ? _g : null
      };
    }
    return normalizeProcessEntities(true);
  }
  var buildOptions = function(options) {
    const built = Object.assign({}, defaultOptions2, options);
    built.processEntities = normalizeProcessEntities(built.processEntities);
    return built;
  };

  // ../../node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
  var METADATA_SYMBOL;
  if (typeof Symbol !== "function") {
    METADATA_SYMBOL = "@@xmlMetadata";
  } else {
    METADATA_SYMBOL = Symbol("XML Node Metadata");
  }
  var XmlNode = class {
    constructor(tagname) {
      this.tagname = tagname;
      this.child = [];
      this[":@"] = /* @__PURE__ */ Object.create(null);
    }
    add(key, val) {
      if (key === "__proto__") key = "#__proto__";
      this.child.push({ [key]: val });
    }
    addChild(node, startIndex) {
      if (node.tagname === "__proto__") node.tagname = "#__proto__";
      if (node[":@"] && Object.keys(node[":@"]).length > 0) {
        this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
      } else {
        this.child.push({ [node.tagname]: node.child });
      }
      if (startIndex !== void 0) {
        this.child[this.child.length - 1][METADATA_SYMBOL] = { startIndex };
      }
    }
    /** symbol used for metadata */
    static getMetaDataSymbol() {
      return METADATA_SYMBOL;
    }
  };

  // ../../node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
  var DocTypeReader = class {
    constructor(options) {
      this.suppressValidationErr = !options;
      this.options = options;
    }
    readDocType(xmlData, i) {
      const entities = /* @__PURE__ */ Object.create(null);
      let entityCount = 0;
      if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
        i = i + 9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for (; i < xmlData.length; i++) {
          if (xmlData[i] === "<" && !comment) {
            if (hasBody && hasSeq(xmlData, "!ENTITY", i)) {
              i += 7;
              let entityName, val;
              [entityName, val, i] = this.readEntityExp(xmlData, i + 1, this.suppressValidationErr);
              if (val.indexOf("&") === -1) {
                if (this.options.enabled !== false && this.options.maxEntityCount && entityCount >= this.options.maxEntityCount) {
                  throw new Error(
                    `Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`
                  );
                }
                const escaped = entityName.replace(/[.\-+*:]/g, "\\.");
                entities[entityName] = {
                  regx: RegExp(`&${escaped};`, "g"),
                  val
                };
                entityCount++;
              }
            } else if (hasBody && hasSeq(xmlData, "!ELEMENT", i)) {
              i += 8;
              const { index } = this.readElementExp(xmlData, i + 1);
              i = index;
            } else if (hasBody && hasSeq(xmlData, "!ATTLIST", i)) {
              i += 8;
            } else if (hasBody && hasSeq(xmlData, "!NOTATION", i)) {
              i += 9;
              const { index } = this.readNotationExp(xmlData, i + 1, this.suppressValidationErr);
              i = index;
            } else if (hasSeq(xmlData, "!--", i)) comment = true;
            else throw new Error(`Invalid DOCTYPE`);
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i] === ">") {
            if (comment) {
              if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i };
    }
    readEntityExp(xmlData, i) {
      i = skipWhitespace(xmlData, i);
      let entityName = "";
      while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== '"' && xmlData[i] !== "'") {
        entityName += xmlData[i];
        i++;
      }
      validateEntityName(entityName);
      i = skipWhitespace(xmlData, i);
      if (!this.suppressValidationErr) {
        if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") {
          throw new Error("External entities are not supported");
        } else if (xmlData[i] === "%") {
          throw new Error("Parameter entities are not supported");
        }
      }
      let entityValue = "";
      [i, entityValue] = this.readIdentifierVal(xmlData, i, "entity");
      if (this.options.enabled !== false && this.options.maxEntitySize && entityValue.length > this.options.maxEntitySize) {
        throw new Error(
          `Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`
        );
      }
      i--;
      return [entityName, entityValue, i];
    }
    readNotationExp(xmlData, i) {
      i = skipWhitespace(xmlData, i);
      let notationName = "";
      while (i < xmlData.length && !/\s/.test(xmlData[i])) {
        notationName += xmlData[i];
        i++;
      }
      !this.suppressValidationErr && validateEntityName(notationName);
      i = skipWhitespace(xmlData, i);
      const identifierType = xmlData.substring(i, i + 6).toUpperCase();
      if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
        throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
      }
      i += identifierType.length;
      i = skipWhitespace(xmlData, i);
      let publicIdentifier = null;
      let systemIdentifier = null;
      if (identifierType === "PUBLIC") {
        [i, publicIdentifier] = this.readIdentifierVal(xmlData, i, "publicIdentifier");
        i = skipWhitespace(xmlData, i);
        if (xmlData[i] === '"' || xmlData[i] === "'") {
          [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
        }
      } else if (identifierType === "SYSTEM") {
        [i, systemIdentifier] = this.readIdentifierVal(xmlData, i, "systemIdentifier");
        if (!this.suppressValidationErr && !systemIdentifier) {
          throw new Error("Missing mandatory system identifier for SYSTEM notation");
        }
      }
      return { notationName, publicIdentifier, systemIdentifier, index: --i };
    }
    readIdentifierVal(xmlData, i, type2) {
      let identifierVal = "";
      const startChar = xmlData[i];
      if (startChar !== '"' && startChar !== "'") {
        throw new Error(`Expected quoted string, found "${startChar}"`);
      }
      i++;
      while (i < xmlData.length && xmlData[i] !== startChar) {
        identifierVal += xmlData[i];
        i++;
      }
      if (xmlData[i] !== startChar) {
        throw new Error(`Unterminated ${type2} value`);
      }
      i++;
      return [i, identifierVal];
    }
    readElementExp(xmlData, i) {
      i = skipWhitespace(xmlData, i);
      let elementName = "";
      while (i < xmlData.length && !/\s/.test(xmlData[i])) {
        elementName += xmlData[i];
        i++;
      }
      if (!this.suppressValidationErr && !isName(elementName)) {
        throw new Error(`Invalid element name: "${elementName}"`);
      }
      i = skipWhitespace(xmlData, i);
      let contentModel = "";
      if (xmlData[i] === "E" && hasSeq(xmlData, "MPTY", i)) i += 4;
      else if (xmlData[i] === "A" && hasSeq(xmlData, "NY", i)) i += 2;
      else if (xmlData[i] === "(") {
        i++;
        while (i < xmlData.length && xmlData[i] !== ")") {
          contentModel += xmlData[i];
          i++;
        }
        if (xmlData[i] !== ")") {
          throw new Error("Unterminated content model");
        }
      } else if (!this.suppressValidationErr) {
        throw new Error(`Invalid Element Expression, found "${xmlData[i]}"`);
      }
      return {
        elementName,
        contentModel: contentModel.trim(),
        index: i
      };
    }
    readAttlistExp(xmlData, i) {
      i = skipWhitespace(xmlData, i);
      let elementName = "";
      while (i < xmlData.length && !/\s/.test(xmlData[i])) {
        elementName += xmlData[i];
        i++;
      }
      validateEntityName(elementName);
      i = skipWhitespace(xmlData, i);
      let attributeName = "";
      while (i < xmlData.length && !/\s/.test(xmlData[i])) {
        attributeName += xmlData[i];
        i++;
      }
      if (!validateEntityName(attributeName)) {
        throw new Error(`Invalid attribute name: "${attributeName}"`);
      }
      i = skipWhitespace(xmlData, i);
      let attributeType = "";
      if (xmlData.substring(i, i + 8).toUpperCase() === "NOTATION") {
        attributeType = "NOTATION";
        i += 8;
        i = skipWhitespace(xmlData, i);
        if (xmlData[i] !== "(") {
          throw new Error(`Expected '(', found "${xmlData[i]}"`);
        }
        i++;
        let allowedNotations = [];
        while (i < xmlData.length && xmlData[i] !== ")") {
          let notation = "";
          while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") {
            notation += xmlData[i];
            i++;
          }
          notation = notation.trim();
          if (!validateEntityName(notation)) {
            throw new Error(`Invalid notation name: "${notation}"`);
          }
          allowedNotations.push(notation);
          if (xmlData[i] === "|") {
            i++;
            i = skipWhitespace(xmlData, i);
          }
        }
        if (xmlData[i] !== ")") {
          throw new Error("Unterminated list of notations");
        }
        i++;
        attributeType += " (" + allowedNotations.join("|") + ")";
      } else {
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
          attributeType += xmlData[i];
          i++;
        }
        const validTypes = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
        if (!this.suppressValidationErr && !validTypes.includes(attributeType.toUpperCase())) {
          throw new Error(`Invalid attribute type: "${attributeType}"`);
        }
      }
      i = skipWhitespace(xmlData, i);
      let defaultValue = "";
      if (xmlData.substring(i, i + 8).toUpperCase() === "#REQUIRED") {
        defaultValue = "#REQUIRED";
        i += 8;
      } else if (xmlData.substring(i, i + 7).toUpperCase() === "#IMPLIED") {
        defaultValue = "#IMPLIED";
        i += 7;
      } else {
        [i, defaultValue] = this.readIdentifierVal(xmlData, i, "ATTLIST");
      }
      return {
        elementName,
        attributeName,
        attributeType,
        defaultValue,
        index: i
      };
    }
  };
  var skipWhitespace = (data, index) => {
    while (index < data.length && /\s/.test(data[index])) {
      index++;
    }
    return index;
  };
  function hasSeq(data, seq2, i) {
    for (let j = 0; j < seq2.length; j++) {
      if (seq2[j] !== data[i + j + 1]) return false;
    }
    return true;
  }
  function validateEntityName(name) {
    if (isName(name))
      return name;
    else
      throw new Error(`Invalid entity name ${name}`);
  }

  // ../../node_modules/strnum/strnum.js
  var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
  var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
  var consider = {
    hex: true,
    // oct: false,
    leadingZeros: true,
    decimalPoint: ".",
    eNotation: true
    //skipLike: /regex/
  };
  function toNumber2(str2, options = {}) {
    options = Object.assign({}, consider, options);
    if (!str2 || typeof str2 !== "string") return str2;
    let trimmedStr = str2.trim();
    if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str2;
    else if (str2 === "0") return 0;
    else if (options.hex && hexRegex.test(trimmedStr)) {
      return parse_int(trimmedStr, 16);
    } else if (trimmedStr.includes("e") || trimmedStr.includes("E")) {
      return resolveEnotation(str2, trimmedStr, options);
    } else {
      const match = numRegex.exec(trimmedStr);
      if (match) {
        const sign = match[1] || "";
        const leadingZeros = match[2];
        let numTrimmedByZeros = trimZeros(match[3]);
        const decimalAdjacentToLeadingZeros = sign ? (
          // 0., -00., 000.
          str2[leadingZeros.length + 1] === "."
        ) : str2[leadingZeros.length] === ".";
        if (!options.leadingZeros && (leadingZeros.length > 1 || leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros)) {
          return str2;
        } else {
          const num = Number(trimmedStr);
          const parsedStr = String(num);
          if (num === 0) return num;
          if (parsedStr.search(/[eE]/) !== -1) {
            if (options.eNotation) return num;
            else return str2;
          } else if (trimmedStr.indexOf(".") !== -1) {
            if (parsedStr === "0") return num;
            else if (parsedStr === numTrimmedByZeros) return num;
            else if (parsedStr === `${sign}${numTrimmedByZeros}`) return num;
            else return str2;
          }
          let n = leadingZeros ? numTrimmedByZeros : trimmedStr;
          if (leadingZeros) {
            return n === parsedStr || sign + n === parsedStr ? num : str2;
          } else {
            return n === parsedStr || n === sign + parsedStr ? num : str2;
          }
        }
      } else {
        return str2;
      }
    }
  }
  var eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
  function resolveEnotation(str2, trimmedStr, options) {
    if (!options.eNotation) return str2;
    const notation = trimmedStr.match(eNotationRegx);
    if (notation) {
      let sign = notation[1] || "";
      const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
      const leadingZeros = notation[2];
      const eAdjacentToLeadingZeros = sign ? (
        // 0E.
        str2[leadingZeros.length + 1] === eChar
      ) : str2[leadingZeros.length] === eChar;
      if (leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str2;
      else if (leadingZeros.length === 1 && (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)) {
        return Number(trimmedStr);
      } else if (options.leadingZeros && !eAdjacentToLeadingZeros) {
        trimmedStr = (notation[1] || "") + notation[3];
        return Number(trimmedStr);
      } else return str2;
    } else {
      return str2;
    }
  }
  function trimZeros(numStr) {
    if (numStr && numStr.indexOf(".") !== -1) {
      numStr = numStr.replace(/0+$/, "");
      if (numStr === ".") numStr = "0";
      else if (numStr[0] === ".") numStr = "0" + numStr;
      else if (numStr[numStr.length - 1] === ".") numStr = numStr.substring(0, numStr.length - 1);
      return numStr;
    }
    return numStr;
  }
  function parse_int(numStr, base) {
    if (parseInt) return parseInt(numStr, base);
    else if (Number.parseInt) return Number.parseInt(numStr, base);
    else if (window && window.parseInt) return window.parseInt(numStr, base);
    else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
  }

  // ../../node_modules/fast-xml-parser/src/ignoreAttributes.js
  function getIgnoreAttributesFn(ignoreAttributes) {
    if (typeof ignoreAttributes === "function") {
      return ignoreAttributes;
    }
    if (Array.isArray(ignoreAttributes)) {
      return (attrName) => {
        for (const pattern of ignoreAttributes) {
          if (typeof pattern === "string" && attrName === pattern) {
            return true;
          }
          if (pattern instanceof RegExp && pattern.test(attrName)) {
            return true;
          }
        }
      };
    }
    return () => false;
  }

  // ../../node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
  var OrderedObjParser = class {
    constructor(options) {
      this.options = options;
      this.currentNode = null;
      this.tagsNodeStack = [];
      this.docTypeEntities = {};
      this.lastEntities = {
        "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
        "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
        "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
        "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
      };
      this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
      this.htmlEntities = {
        "space": { regex: /&(nbsp|#160);/g, val: " " },
        // "lt" : { regex: /&(lt|#60);/g, val: "<" },
        // "gt" : { regex: /&(gt|#62);/g, val: ">" },
        // "amp" : { regex: /&(amp|#38);/g, val: "&" },
        // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
        // "apos" : { regex: /&(apos|#39);/g, val: "'" },
        "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
        "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
        "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
        "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
        "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
        "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
        "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" },
        "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_2, str2) => fromCodePoint(str2, 10, "&#") },
        "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_2, str2) => fromCodePoint(str2, 16, "&#x") }
      };
      this.addExternalEntities = addExternalEntities;
      this.parseXml = parseXml;
      this.parseTextData = parseTextData;
      this.resolveNameSpace = resolveNameSpace;
      this.buildAttributesMap = buildAttributesMap;
      this.isItStopNode = isItStopNode;
      this.replaceEntitiesValue = replaceEntitiesValue;
      this.readStopNodeData = readStopNodeData;
      this.saveTextToParentTag = saveTextToParentTag;
      this.addChild = addChild;
      this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
      this.entityExpansionCount = 0;
      this.currentExpandedLength = 0;
      if (this.options.stopNodes && this.options.stopNodes.length > 0) {
        this.stopNodesExact = /* @__PURE__ */ new Set();
        this.stopNodesWildcard = /* @__PURE__ */ new Set();
        for (let i = 0; i < this.options.stopNodes.length; i++) {
          const stopNodeExp = this.options.stopNodes[i];
          if (typeof stopNodeExp !== "string") continue;
          if (stopNodeExp.startsWith("*.")) {
            this.stopNodesWildcard.add(stopNodeExp.substring(2));
          } else {
            this.stopNodesExact.add(stopNodeExp);
          }
        }
      }
    }
  };
  function addExternalEntities(externalEntities) {
    const entKeys = Object.keys(externalEntities);
    for (let i = 0; i < entKeys.length; i++) {
      const ent = entKeys[i];
      const escaped = ent.replace(/[.\-+*:]/g, "\\.");
      this.lastEntities[ent] = {
        regex: new RegExp("&" + escaped + ";", "g"),
        val: externalEntities[ent]
      };
    }
  }
  function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
    if (val !== void 0) {
      if (this.options.trimValues && !dontTrim) {
        val = val.trim();
      }
      if (val.length > 0) {
        if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
        const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
        if (newval === null || newval === void 0) {
          return val;
        } else if (typeof newval !== typeof val || newval !== val) {
          return newval;
        } else if (this.options.trimValues) {
          return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
        } else {
          const trimmedVal = val.trim();
          if (trimmedVal === val) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            return val;
          }
        }
      }
    }
  }
  function resolveNameSpace(tagname) {
    if (this.options.removeNSPrefix) {
      const tags = tagname.split(":");
      const prefix = tagname.charAt(0) === "/" ? "/" : "";
      if (tags[0] === "xmlns") {
        return "";
      }
      if (tags.length === 2) {
        tagname = prefix + tags[1];
      }
    }
    return tagname;
  }
  var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
  function buildAttributesMap(attrStr, jPath, tagName) {
    if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
      const matches = getAllMatches(attrStr, attrsRegx);
      const len = matches.length;
      const attrs = {};
      for (let i = 0; i < len; i++) {
        const attrName = this.resolveNameSpace(matches[i][1]);
        if (this.ignoreAttributesFn(attrName, jPath)) {
          continue;
        }
        let oldVal = matches[i][4];
        let aName = this.options.attributeNamePrefix + attrName;
        if (attrName.length) {
          if (this.options.transformAttributeName) {
            aName = this.options.transformAttributeName(aName);
          }
          if (aName === "__proto__") aName = "#__proto__";
          if (oldVal !== void 0) {
            if (this.options.trimValues) {
              oldVal = oldVal.trim();
            }
            oldVal = this.replaceEntitiesValue(oldVal, tagName, jPath);
            const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
            if (newVal === null || newVal === void 0) {
              attrs[aName] = oldVal;
            } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
              attrs[aName] = newVal;
            } else {
              attrs[aName] = parseValue(
                oldVal,
                this.options.parseAttributeValue,
                this.options.numberParseOptions
              );
            }
          } else if (this.options.allowBooleanAttributes) {
            attrs[aName] = true;
          }
        }
      }
      if (!Object.keys(attrs).length) {
        return;
      }
      if (this.options.attributesGroupName) {
        const attrCollection = {};
        attrCollection[this.options.attributesGroupName] = attrs;
        return attrCollection;
      }
      return attrs;
    }
  }
  var parseXml = function(xmlData) {
    xmlData = xmlData.replace(/\r\n?/g, "\n");
    const xmlObj = new XmlNode("!xml");
    let currentNode = xmlObj;
    let textData = "";
    let jPath = "";
    this.entityExpansionCount = 0;
    this.currentExpandedLength = 0;
    const docTypeReader = new DocTypeReader(this.options.processEntities);
    for (let i = 0; i < xmlData.length; i++) {
      const ch = xmlData[i];
      if (ch === "<") {
        if (xmlData[i + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
          let tagName = xmlData.substring(i + 2, closeIndex).trim();
          if (this.options.removeNSPrefix) {
            const colonIndex = tagName.indexOf(":");
            if (colonIndex !== -1) {
              tagName = tagName.substr(colonIndex + 1);
            }
          }
          if (this.options.transformTagName) {
            tagName = this.options.transformTagName(tagName);
          }
          if (currentNode) {
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
          }
          const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
          if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
            throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
          }
          let propIndex = 0;
          if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
            propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
            this.tagsNodeStack.pop();
          } else {
            propIndex = jPath.lastIndexOf(".");
          }
          jPath = jPath.substring(0, propIndex);
          currentNode = this.tagsNodeStack.pop();
          textData = "";
          i = closeIndex;
        } else if (xmlData[i + 1] === "?") {
          let tagData = readTagExp(xmlData, i, false, "?>");
          if (!tagData) throw new Error("Pi Tag is not closed.");
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
          } else {
            const childNode = new XmlNode(tagData.tagName);
            childNode.add(this.options.textNodeName, "");
            if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
            }
            this.addChild(currentNode, childNode, jPath, i);
          }
          i = tagData.closeIndex + 1;
        } else if (xmlData.substr(i + 1, 3) === "!--") {
          const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
          if (this.options.commentPropName) {
            const comment = xmlData.substring(i + 4, endIndex - 2);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
          }
          i = endIndex;
        } else if (xmlData.substr(i + 1, 2) === "!D") {
          const result = docTypeReader.readDocType(xmlData, i);
          this.docTypeEntities = result.entities;
          i = result.i;
        } else if (xmlData.substr(i + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
          const tagExp = xmlData.substring(i + 9, closeIndex);
          textData = this.saveTextToParentTag(textData, currentNode, jPath);
          let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
          if (val == void 0) val = "";
          if (this.options.cdataPropName) {
            currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
          } else {
            currentNode.add(this.options.textNodeName, val);
          }
          i = closeIndex + 2;
        } else {
          let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
          let tagName = result.tagName;
          const rawTagName = result.rawTagName;
          let tagExp = result.tagExp;
          let attrExpPresent = result.attrExpPresent;
          let closeIndex = result.closeIndex;
          if (this.options.transformTagName) {
            const newTagName = this.options.transformTagName(tagName);
            if (tagExp === tagName) {
              tagExp = newTagName;
            }
            tagName = newTagName;
          }
          if (this.options.strictReservedNames && (tagName === this.options.commentPropName || tagName === this.options.cdataPropName)) {
            throw new Error(`Invalid tag name: ${tagName}`);
          }
          if (currentNode && textData) {
            if (currentNode.tagname !== "!xml") {
              textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
            }
          }
          const lastTag = currentNode;
          if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
            currentNode = this.tagsNodeStack.pop();
            jPath = jPath.substring(0, jPath.lastIndexOf("."));
          }
          if (tagName !== xmlObj.tagname) {
            jPath += jPath ? "." + tagName : tagName;
          }
          const startIndex = i;
          if (this.isItStopNode(this.stopNodesExact, this.stopNodesWildcard, jPath, tagName)) {
            let tagContent = "";
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                jPath = jPath.substr(0, jPath.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              i = result.closeIndex;
            } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
              i = result.closeIndex;
            } else {
              const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
              if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
              i = result2.i;
              tagContent = result2.tagContent;
            }
            const childNode = new XmlNode(tagName);
            if (tagName !== tagExp && attrExpPresent) {
              childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
            }
            if (tagContent) {
              tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
            }
            jPath = jPath.substr(0, jPath.lastIndexOf("."));
            childNode.add(this.options.textNodeName, tagContent);
            this.addChild(currentNode, childNode, jPath, startIndex);
          } else {
            if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
              if (tagName[tagName.length - 1] === "/") {
                tagName = tagName.substr(0, tagName.length - 1);
                jPath = jPath.substr(0, jPath.length - 1);
                tagExp = tagName;
              } else {
                tagExp = tagExp.substr(0, tagExp.length - 1);
              }
              if (this.options.transformTagName) {
                const newTagName = this.options.transformTagName(tagName);
                if (tagExp === tagName) {
                  tagExp = newTagName;
                }
                tagName = newTagName;
              }
              const childNode = new XmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              this.addChild(currentNode, childNode, jPath, startIndex);
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
            } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
              const childNode = new XmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath);
              }
              this.addChild(currentNode, childNode, jPath, startIndex);
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              i = result.closeIndex;
              continue;
            } else {
              const childNode = new XmlNode(tagName);
              if (this.tagsNodeStack.length > this.options.maxNestedTags) {
                throw new Error("Maximum nested tags exceeded");
              }
              this.tagsNodeStack.push(currentNode);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              this.addChild(currentNode, childNode, jPath, startIndex);
              currentNode = childNode;
            }
            textData = "";
            i = closeIndex;
          }
        }
      } else {
        textData += xmlData[i];
      }
    }
    return xmlObj.child;
  };
  function addChild(currentNode, childNode, jPath, startIndex) {
    if (!this.options.captureMetaData) startIndex = void 0;
    const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
    if (result === false) {
    } else if (typeof result === "string") {
      childNode.tagname = result;
      currentNode.addChild(childNode, startIndex);
    } else {
      currentNode.addChild(childNode, startIndex);
    }
  }
  var replaceEntitiesValue = function(val, tagName, jPath) {
    if (val.indexOf("&") === -1) {
      return val;
    }
    const entityConfig = this.options.processEntities;
    if (!entityConfig.enabled) {
      return val;
    }
    if (entityConfig.allowedTags) {
      if (!entityConfig.allowedTags.includes(tagName)) {
        return val;
      }
    }
    if (entityConfig.tagFilter) {
      if (!entityConfig.tagFilter(tagName, jPath)) {
        return val;
      }
    }
    for (let entityName in this.docTypeEntities) {
      const entity = this.docTypeEntities[entityName];
      const matches = val.match(entity.regx);
      if (matches) {
        this.entityExpansionCount += matches.length;
        if (entityConfig.maxTotalExpansions && this.entityExpansionCount > entityConfig.maxTotalExpansions) {
          throw new Error(
            `Entity expansion limit exceeded: ${this.entityExpansionCount} > ${entityConfig.maxTotalExpansions}`
          );
        }
        const lengthBefore = val.length;
        val = val.replace(entity.regx, entity.val);
        if (entityConfig.maxExpandedLength) {
          this.currentExpandedLength += val.length - lengthBefore;
          if (this.currentExpandedLength > entityConfig.maxExpandedLength) {
            throw new Error(
              `Total expanded content size exceeded: ${this.currentExpandedLength} > ${entityConfig.maxExpandedLength}`
            );
          }
        }
      }
    }
    if (val.indexOf("&") === -1) return val;
    for (let entityName in this.lastEntities) {
      const entity = this.lastEntities[entityName];
      val = val.replace(entity.regex, entity.val);
    }
    if (val.indexOf("&") === -1) return val;
    if (this.options.htmlEntities) {
      for (let entityName in this.htmlEntities) {
        const entity = this.htmlEntities[entityName];
        val = val.replace(entity.regex, entity.val);
      }
    }
    val = val.replace(this.ampEntity.regex, this.ampEntity.val);
    return val;
  };
  function saveTextToParentTag(textData, parentNode, jPath, isLeafNode) {
    if (textData) {
      if (isLeafNode === void 0) isLeafNode = parentNode.child.length === 0;
      textData = this.parseTextData(
        textData,
        parentNode.tagname,
        jPath,
        false,
        parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false,
        isLeafNode
      );
      if (textData !== void 0 && textData !== "")
        parentNode.add(this.options.textNodeName, textData);
      textData = "";
    }
    return textData;
  }
  function isItStopNode(stopNodesExact, stopNodesWildcard, jPath, currentTagName) {
    if (stopNodesWildcard && stopNodesWildcard.has(currentTagName)) return true;
    if (stopNodesExact && stopNodesExact.has(jPath)) return true;
    return false;
  }
  function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
    let attrBoundary;
    let tagExp = "";
    for (let index = i; index < xmlData.length; index++) {
      let ch = xmlData[index];
      if (attrBoundary) {
        if (ch === attrBoundary) attrBoundary = "";
      } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
      } else if (ch === closingChar[0]) {
        if (closingChar[1]) {
          if (xmlData[index + 1] === closingChar[1]) {
            return {
              data: tagExp,
              index
            };
          }
        } else {
          return {
            data: tagExp,
            index
          };
        }
      } else if (ch === "	") {
        ch = " ";
      }
      tagExp += ch;
    }
  }
  function findClosingIndex(xmlData, str2, i, errMsg) {
    const closingIndex = xmlData.indexOf(str2, i);
    if (closingIndex === -1) {
      throw new Error(errMsg);
    } else {
      return closingIndex + str2.length - 1;
    }
  }
  function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
    const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
    if (!result) return;
    let tagExp = result.data;
    const closeIndex = result.index;
    const separatorIndex = tagExp.search(/\s/);
    let tagName = tagExp;
    let attrExpPresent = true;
    if (separatorIndex !== -1) {
      tagName = tagExp.substring(0, separatorIndex);
      tagExp = tagExp.substring(separatorIndex + 1).trimStart();
    }
    const rawTagName = tagName;
    if (removeNSPrefix) {
      const colonIndex = tagName.indexOf(":");
      if (colonIndex !== -1) {
        tagName = tagName.substr(colonIndex + 1);
        attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
      }
    }
    return {
      tagName,
      tagExp,
      closeIndex,
      attrExpPresent,
      rawTagName
    };
  }
  function readStopNodeData(xmlData, tagName, i) {
    const startIndex = i;
    let openTagCount = 1;
    for (; i < xmlData.length; i++) {
      if (xmlData[i] === "<") {
        if (xmlData[i + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
          let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
          if (closeTagName === tagName) {
            openTagCount--;
            if (openTagCount === 0) {
              return {
                tagContent: xmlData.substring(startIndex, i),
                i: closeIndex
              };
            }
          }
          i = closeIndex;
        } else if (xmlData[i + 1] === "?") {
          const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
          i = closeIndex;
        } else if (xmlData.substr(i + 1, 3) === "!--") {
          const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
          i = closeIndex;
        } else if (xmlData.substr(i + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
          i = closeIndex;
        } else {
          const tagData = readTagExp(xmlData, i, ">");
          if (tagData) {
            const openTagName = tagData && tagData.tagName;
            if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
              openTagCount++;
            }
            i = tagData.closeIndex;
          }
        }
      }
    }
  }
  function parseValue(val, shouldParse, options) {
    if (shouldParse && typeof val === "string") {
      const newval = val.trim();
      if (newval === "true") return true;
      else if (newval === "false") return false;
      else return toNumber2(val, options);
    } else {
      if (isExist(val)) {
        return val;
      } else {
        return "";
      }
    }
  }
  function fromCodePoint(str2, base, prefix) {
    const codePoint = Number.parseInt(str2, base);
    if (codePoint >= 0 && codePoint <= 1114111) {
      return String.fromCodePoint(codePoint);
    } else {
      return prefix + str2 + ";";
    }
  }

  // ../../node_modules/fast-xml-parser/src/xmlparser/node2json.js
  var METADATA_SYMBOL2 = XmlNode.getMetaDataSymbol();
  function prettify(node, options) {
    return compress(node, options);
  }
  function compress(arr, options, jPath) {
    let text;
    const compressedObj = {};
    for (let i = 0; i < arr.length; i++) {
      const tagObj = arr[i];
      const property2 = propName(tagObj);
      let newJpath = "";
      if (jPath === void 0) newJpath = property2;
      else newJpath = jPath + "." + property2;
      if (property2 === options.textNodeName) {
        if (text === void 0) text = tagObj[property2];
        else text += "" + tagObj[property2];
      } else if (property2 === void 0) {
        continue;
      } else if (tagObj[property2]) {
        let val = compress(tagObj[property2], options, newJpath);
        const isLeaf = isLeafTag(val, options);
        if (tagObj[":@"]) {
          assignAttributes(val, tagObj[":@"], newJpath, options);
        } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
          val = val[options.textNodeName];
        } else if (Object.keys(val).length === 0) {
          if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
          else val = "";
        }
        if (tagObj[METADATA_SYMBOL2] !== void 0 && typeof val === "object" && val !== null) {
          val[METADATA_SYMBOL2] = tagObj[METADATA_SYMBOL2];
        }
        if (compressedObj[property2] !== void 0 && Object.prototype.hasOwnProperty.call(compressedObj, property2)) {
          if (!Array.isArray(compressedObj[property2])) {
            compressedObj[property2] = [compressedObj[property2]];
          }
          compressedObj[property2].push(val);
        } else {
          if (options.isArray(property2, newJpath, isLeaf)) {
            compressedObj[property2] = [val];
          } else {
            compressedObj[property2] = val;
          }
        }
      }
    }
    if (typeof text === "string") {
      if (text.length > 0) compressedObj[options.textNodeName] = text;
    } else if (text !== void 0) compressedObj[options.textNodeName] = text;
    return compressedObj;
  }
  function propName(obj) {
    const keys2 = Object.keys(obj);
    for (let i = 0; i < keys2.length; i++) {
      const key = keys2[i];
      if (key !== ":@") return key;
    }
  }
  function assignAttributes(obj, attrMap, jpath, options) {
    if (attrMap) {
      const keys2 = Object.keys(attrMap);
      const len = keys2.length;
      for (let i = 0; i < len; i++) {
        const atrrName = keys2[i];
        if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
          obj[atrrName] = [attrMap[atrrName]];
        } else {
          obj[atrrName] = attrMap[atrrName];
        }
      }
    }
  }
  function isLeafTag(obj, options) {
    const { textNodeName } = options;
    const propCount = Object.keys(obj).length;
    if (propCount === 0) {
      return true;
    }
    if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
      return true;
    }
    return false;
  }

  // ../../node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
  var XMLParser = class {
    constructor(options) {
      this.externalEntities = {};
      this.options = buildOptions(options);
    }
    /**
     * Parse XML dats to JS object 
     * @param {string|Uint8Array} xmlData 
     * @param {boolean|Object} validationOption 
     */
    parse(xmlData, validationOption) {
      if (typeof xmlData !== "string" && xmlData.toString) {
        xmlData = xmlData.toString();
      } else if (typeof xmlData !== "string") {
        throw new Error("XML data is accepted in String or Bytes[] form.");
      }
      if (validationOption) {
        if (validationOption === true) validationOption = {};
        const result = validate(xmlData, validationOption);
        if (result !== true) {
          throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
        }
      }
      const orderedObjParser = new OrderedObjParser(this.options);
      orderedObjParser.addExternalEntities(this.externalEntities);
      const orderedResult = orderedObjParser.parseXml(xmlData);
      if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
      else return prettify(orderedResult, this.options);
    }
    /**
     * Add Entity which is not by default supported by this library
     * @param {string} key 
     * @param {string} value 
     */
    addEntity(key, value) {
      if (value.indexOf("&") !== -1) {
        throw new Error("Entity value can't have '&'");
      } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
        throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
      } else if (value === "&") {
        throw new Error("An entity with value '&' is not permitted");
      } else {
        this.externalEntities[key] = value;
      }
    }
    /**
     * Returns a Symbol that can be used to access the metadata
     * property on a node.
     * 
     * If Symbol is not available in the environment, an ordinary property is used
     * and the name of the property is here returned.
     * 
     * The XMLMetaData property is only present when `captureMetaData`
     * is true in the options.
     */
    static getMetaDataSymbol() {
      return XmlNode.getMetaDataSymbol();
    }
  };

  // ../../node_modules/fast-xml-builder/src/orderedJs2Xml.js
  var EOL = "\n";
  function toXml(jArray, options) {
    let indentation = "";
    if (options.format && options.indentBy.length > 0) {
      indentation = EOL;
    }
    return arrToStr(jArray, options, "", indentation);
  }
  function arrToStr(arr, options, jPath, indentation) {
    let xmlStr = "";
    let isPreviousElementTag = false;
    if (!Array.isArray(arr)) {
      if (arr !== void 0 && arr !== null) {
        let text = arr.toString();
        text = replaceEntitiesValue2(text, options);
        return text;
      }
      return "";
    }
    for (let i = 0; i < arr.length; i++) {
      const tagObj = arr[i];
      const tagName = propName2(tagObj);
      if (tagName === void 0) continue;
      let newJPath = "";
      if (jPath.length === 0) newJPath = tagName;
      else newJPath = `${jPath}.${tagName}`;
      if (tagName === options.textNodeName) {
        let tagText = tagObj[tagName];
        if (!isStopNode(newJPath, options)) {
          tagText = options.tagValueProcessor(tagName, tagText);
          tagText = replaceEntitiesValue2(tagText, options);
        }
        if (isPreviousElementTag) {
          xmlStr += indentation;
        }
        xmlStr += tagText;
        isPreviousElementTag = false;
        continue;
      } else if (tagName === options.cdataPropName) {
        if (isPreviousElementTag) {
          xmlStr += indentation;
        }
        xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
        isPreviousElementTag = false;
        continue;
      } else if (tagName === options.commentPropName) {
        xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
        isPreviousElementTag = true;
        continue;
      } else if (tagName[0] === "?") {
        const attStr2 = attr_to_str(tagObj[":@"], options);
        const tempInd = tagName === "?xml" ? "" : indentation;
        let piTextNodeName = tagObj[tagName][0][options.textNodeName];
        piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
        xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
        isPreviousElementTag = true;
        continue;
      }
      let newIdentation = indentation;
      if (newIdentation !== "") {
        newIdentation += options.indentBy;
      }
      const attStr = attr_to_str(tagObj[":@"], options);
      const tagStart = indentation + `<${tagName}${attStr}`;
      const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
      if (options.unpairedTags.indexOf(tagName) !== -1) {
        if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
        else xmlStr += tagStart + "/>";
      } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
        xmlStr += tagStart + "/>";
      } else if (tagValue && tagValue.endsWith(">")) {
        xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
      } else {
        xmlStr += tagStart + ">";
        if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
          xmlStr += indentation + options.indentBy + tagValue + indentation;
        } else {
          xmlStr += tagValue;
        }
        xmlStr += `</${tagName}>`;
      }
      isPreviousElementTag = true;
    }
    return xmlStr;
  }
  function propName2(obj) {
    const keys2 = Object.keys(obj);
    for (let i = 0; i < keys2.length; i++) {
      const key = keys2[i];
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
      if (key !== ":@") return key;
    }
  }
  function attr_to_str(attrMap, options) {
    let attrStr = "";
    if (attrMap && !options.ignoreAttributes) {
      for (let attr in attrMap) {
        if (!Object.prototype.hasOwnProperty.call(attrMap, attr)) continue;
        let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
        attrVal = replaceEntitiesValue2(attrVal, options);
        if (attrVal === true && options.suppressBooleanAttributes) {
          attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
        } else {
          attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
        }
      }
    }
    return attrStr;
  }
  function isStopNode(jPath, options) {
    jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
    let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
    for (let index in options.stopNodes) {
      if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
    }
    return false;
  }
  function replaceEntitiesValue2(textValue, options) {
    if (textValue && textValue.length > 0 && options.processEntities) {
      for (let i = 0; i < options.entities.length; i++) {
        const entity = options.entities[i];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  }

  // ../../node_modules/fast-xml-builder/src/ignoreAttributes.js
  function getIgnoreAttributesFn2(ignoreAttributes) {
    if (typeof ignoreAttributes === "function") {
      return ignoreAttributes;
    }
    if (Array.isArray(ignoreAttributes)) {
      return (attrName) => {
        for (const pattern of ignoreAttributes) {
          if (typeof pattern === "string" && attrName === pattern) {
            return true;
          }
          if (pattern instanceof RegExp && pattern.test(attrName)) {
            return true;
          }
        }
      };
    }
    return () => false;
  }

  // ../../node_modules/fast-xml-builder/src/fxb.js
  var defaultOptions3 = {
    attributeNamePrefix: "@_",
    attributesGroupName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    cdataPropName: false,
    format: false,
    indentBy: "  ",
    suppressEmptyNode: false,
    suppressUnpairedNode: true,
    suppressBooleanAttributes: true,
    tagValueProcessor: function(key, a) {
      return a;
    },
    attributeValueProcessor: function(attrName, a) {
      return a;
    },
    preserveOrder: false,
    commentPropName: false,
    unpairedTags: [],
    entities: [
      { regex: new RegExp("&", "g"), val: "&amp;" },
      //it must be on top
      { regex: new RegExp(">", "g"), val: "&gt;" },
      { regex: new RegExp("<", "g"), val: "&lt;" },
      { regex: new RegExp("'", "g"), val: "&apos;" },
      { regex: new RegExp('"', "g"), val: "&quot;" }
    ],
    processEntities: true,
    stopNodes: [],
    // transformTagName: false,
    // transformAttributeName: false,
    oneListGroup: false
  };
  function Builder(options) {
    this.options = Object.assign({}, defaultOptions3, options);
    if (this.options.ignoreAttributes === true || this.options.attributesGroupName) {
      this.isAttribute = function() {
        return false;
      };
    } else {
      this.ignoreAttributesFn = getIgnoreAttributesFn2(this.options.ignoreAttributes);
      this.attrPrefixLen = this.options.attributeNamePrefix.length;
      this.isAttribute = isAttribute;
    }
    this.processTextOrObjNode = processTextOrObjNode;
    if (this.options.format) {
      this.indentate = indentate;
      this.tagEndChar = ">\n";
      this.newLine = "\n";
    } else {
      this.indentate = function() {
        return "";
      };
      this.tagEndChar = ">";
      this.newLine = "";
    }
  }
  Builder.prototype.build = function(jObj) {
    if (this.options.preserveOrder) {
      return toXml(jObj, this.options);
    } else {
      if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
        jObj = {
          [this.options.arrayNodeName]: jObj
        };
      }
      return this.j2x(jObj, 0, []).val;
    }
  };
  Builder.prototype.j2x = function(jObj, level, ajPath) {
    let attrStr = "";
    let val = "";
    const jPath = ajPath.join(".");
    for (let key in jObj) {
      if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
      if (typeof jObj[key] === "undefined") {
        if (this.isAttribute(key)) {
          val += "";
        }
      } else if (jObj[key] === null) {
        if (this.isAttribute(key)) {
          val += "";
        } else if (key === this.options.cdataPropName) {
          val += "";
        } else if (key[0] === "?") {
          val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
        } else {
          val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        }
      } else if (jObj[key] instanceof Date) {
        val += this.buildTextValNode(jObj[key], key, "", level);
      } else if (typeof jObj[key] !== "object") {
        const attr = this.isAttribute(key);
        if (attr && !this.ignoreAttributesFn(attr, jPath)) {
          attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
        } else if (!attr) {
          if (key === this.options.textNodeName) {
            let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
            val += this.replaceEntitiesValue(newval);
          } else {
            val += this.buildTextValNode(jObj[key], key, "", level);
          }
        }
      } else if (Array.isArray(jObj[key])) {
        const arrLen = jObj[key].length;
        let listTagVal = "";
        let listTagAttr = "";
        for (let j = 0; j < arrLen; j++) {
          const item = jObj[key][j];
          if (typeof item === "undefined") {
          } else if (item === null) {
            if (key[0] === "?") val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
            else val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          } else if (typeof item === "object") {
            if (this.options.oneListGroup) {
              const result = this.j2x(item, level + 1, ajPath.concat(key));
              listTagVal += result.val;
              if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                listTagAttr += result.attrStr;
              }
            } else {
              listTagVal += this.processTextOrObjNode(item, key, level, ajPath);
            }
          } else {
            if (this.options.oneListGroup) {
              let textValue = this.options.tagValueProcessor(key, item);
              textValue = this.replaceEntitiesValue(textValue);
              listTagVal += textValue;
            } else {
              listTagVal += this.buildTextValNode(item, key, "", level);
            }
          }
        }
        if (this.options.oneListGroup) {
          listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
        }
        val += listTagVal;
      } else {
        if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
          const Ks = Object.keys(jObj[key]);
          const L2 = Ks.length;
          for (let j = 0; j < L2; j++) {
            attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
          }
        } else {
          val += this.processTextOrObjNode(jObj[key], key, level, ajPath);
        }
      }
    }
    return { attrStr, val };
  };
  Builder.prototype.buildAttrPairStr = function(attrName, val) {
    val = this.options.attributeValueProcessor(attrName, "" + val);
    val = this.replaceEntitiesValue(val);
    if (this.options.suppressBooleanAttributes && val === "true") {
      return " " + attrName;
    } else return " " + attrName + '="' + val + '"';
  };
  function processTextOrObjNode(object, key, level, ajPath) {
    const result = this.j2x(object, level + 1, ajPath.concat(key));
    if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
      return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
    } else {
      return this.buildObjectNode(result.val, key, result.attrStr, level);
    }
  }
  Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
    if (val === "") {
      if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      else {
        return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
      }
    } else {
      let tagEndExp = "</" + key + this.tagEndChar;
      let piClosingChar = "";
      if (key[0] === "?") {
        piClosingChar = "?";
        tagEndExp = "";
      }
      if ((attrStr || attrStr === "") && val.indexOf("<") === -1) {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else {
        return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
      }
    }
  };
  Builder.prototype.closeTag = function(key) {
    let closeTag = "";
    if (this.options.unpairedTags.indexOf(key) !== -1) {
      if (!this.options.suppressUnpairedNode) closeTag = "/";
    } else if (this.options.suppressEmptyNode) {
      closeTag = "/";
    } else {
      closeTag = `></${key}`;
    }
    return closeTag;
  };
  Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
    if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
      return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
    } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
      return this.indentate(level) + `<!--${val}-->` + this.newLine;
    } else if (key[0] === "?") {
      return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
    } else {
      let textValue = this.options.tagValueProcessor(key, val);
      textValue = this.replaceEntitiesValue(textValue);
      if (textValue === "") {
        return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
      } else {
        return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
      }
    }
  };
  Builder.prototype.replaceEntitiesValue = function(textValue) {
    if (textValue && textValue.length > 0 && this.options.processEntities) {
      for (let i = 0; i < this.options.entities.length; i++) {
        const entity = this.options.entities[i];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  };
  function indentate(level) {
    return this.options.indentBy.repeat(level);
  }
  function isAttribute(name) {
    if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
      return name.substr(this.attrPrefixLen);
    } else {
      return false;
    }
  }

  // ../../node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
  var json2xml_default = Builder;

  // ../core/dist/index.js
  var import_papaparse = __toESM(require_papaparse_min(), 1);

  // ../../node_modules/js-yaml/dist/js-yaml.mjs
  function isNothing(subject) {
    return typeof subject === "undefined" || subject === null;
  }
  function isObject2(subject) {
    return typeof subject === "object" && subject !== null;
  }
  function toArray(sequence) {
    if (Array.isArray(sequence)) return sequence;
    else if (isNothing(sequence)) return [];
    return [sequence];
  }
  function extend(target, source) {
    var index, length, key, sourceKeys;
    if (source) {
      sourceKeys = Object.keys(source);
      for (index = 0, length = sourceKeys.length; index < length; index += 1) {
        key = sourceKeys[index];
        target[key] = source[key];
      }
    }
    return target;
  }
  function repeat(string, count) {
    var result = "", cycle;
    for (cycle = 0; cycle < count; cycle += 1) {
      result += string;
    }
    return result;
  }
  function isNegativeZero(number) {
    return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
  }
  var isNothing_1 = isNothing;
  var isObject_1 = isObject2;
  var toArray_1 = toArray;
  var repeat_1 = repeat;
  var isNegativeZero_1 = isNegativeZero;
  var extend_1 = extend;
  var common = {
    isNothing: isNothing_1,
    isObject: isObject_1,
    toArray: toArray_1,
    repeat: repeat_1,
    isNegativeZero: isNegativeZero_1,
    extend: extend_1
  };
  function formatError(exception2, compact2) {
    var where = "", message = exception2.reason || "(unknown reason)";
    if (!exception2.mark) return message;
    if (exception2.mark.name) {
      where += 'in "' + exception2.mark.name + '" ';
    }
    where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
    if (!compact2 && exception2.mark.snippet) {
      where += "\n\n" + exception2.mark.snippet;
    }
    return message + " " + where;
  }
  function YAMLException$1(reason, mark) {
    Error.call(this);
    this.name = "YAMLException";
    this.reason = reason;
    this.mark = mark;
    this.message = formatError(this, false);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack || "";
    }
  }
  YAMLException$1.prototype = Object.create(Error.prototype);
  YAMLException$1.prototype.constructor = YAMLException$1;
  YAMLException$1.prototype.toString = function toString2(compact2) {
    return this.name + ": " + formatError(this, compact2);
  };
  var exception = YAMLException$1;
  function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
    var head2 = "";
    var tail = "";
    var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
    if (position - lineStart > maxHalfLength) {
      head2 = " ... ";
      lineStart = position - maxHalfLength + head2.length;
    }
    if (lineEnd - position > maxHalfLength) {
      tail = " ...";
      lineEnd = position + maxHalfLength - tail.length;
    }
    return {
      str: head2 + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
      pos: position - lineStart + head2.length
      // relative position
    };
  }
  function padStart(string, max) {
    return common.repeat(" ", max - string.length) + string;
  }
  function makeSnippet(mark, options) {
    options = Object.create(options || null);
    if (!mark.buffer) return null;
    if (!options.maxLength) options.maxLength = 79;
    if (typeof options.indent !== "number") options.indent = 1;
    if (typeof options.linesBefore !== "number") options.linesBefore = 3;
    if (typeof options.linesAfter !== "number") options.linesAfter = 2;
    var re2 = /\r?\n|\r|\0/g;
    var lineStarts = [0];
    var lineEnds = [];
    var match;
    var foundLineNo = -1;
    while (match = re2.exec(mark.buffer)) {
      lineEnds.push(match.index);
      lineStarts.push(match.index + match[0].length);
      if (mark.position <= match.index && foundLineNo < 0) {
        foundLineNo = lineStarts.length - 2;
      }
    }
    if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
    var result = "", i, line;
    var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
    var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
    for (i = 1; i <= options.linesBefore; i++) {
      if (foundLineNo - i < 0) break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo - i],
        lineEnds[foundLineNo - i],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
        maxLineLength
      );
      result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
    }
    line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
    result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
    for (i = 1; i <= options.linesAfter; i++) {
      if (foundLineNo + i >= lineEnds.length) break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo + i],
        lineEnds[foundLineNo + i],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
        maxLineLength
      );
      result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    }
    return result.replace(/\n$/, "");
  }
  var snippet = makeSnippet;
  var TYPE_CONSTRUCTOR_OPTIONS = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ];
  var YAML_NODE_KINDS = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function compileStyleAliases(map3) {
    var result = {};
    if (map3 !== null) {
      Object.keys(map3).forEach(function(style) {
        map3[style].forEach(function(alias) {
          result[String(alias)] = style;
        });
      });
    }
    return result;
  }
  function Type$1(tag, options) {
    options = options || {};
    Object.keys(options).forEach(function(name) {
      if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
        throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
      }
    });
    this.options = options;
    this.tag = tag;
    this.kind = options["kind"] || null;
    this.resolve = options["resolve"] || function() {
      return true;
    };
    this.construct = options["construct"] || function(data) {
      return data;
    };
    this.instanceOf = options["instanceOf"] || null;
    this.predicate = options["predicate"] || null;
    this.represent = options["represent"] || null;
    this.representName = options["representName"] || null;
    this.defaultStyle = options["defaultStyle"] || null;
    this.multi = options["multi"] || false;
    this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
    if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
      throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
    }
  }
  var type = Type$1;
  function compileList(schema2, name) {
    var result = [];
    schema2[name].forEach(function(currentType) {
      var newIndex = result.length;
      result.forEach(function(previousType, previousIndex) {
        if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
          newIndex = previousIndex;
        }
      });
      result[newIndex] = currentType;
    });
    return result;
  }
  function compileMap() {
    var result = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, index, length;
    function collectType(type2) {
      if (type2.multi) {
        result.multi[type2.kind].push(type2);
        result.multi["fallback"].push(type2);
      } else {
        result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
      }
    }
    for (index = 0, length = arguments.length; index < length; index += 1) {
      arguments[index].forEach(collectType);
    }
    return result;
  }
  function Schema$1(definition) {
    return this.extend(definition);
  }
  Schema$1.prototype.extend = function extend2(definition) {
    var implicit = [];
    var explicit = [];
    if (definition instanceof type) {
      explicit.push(definition);
    } else if (Array.isArray(definition)) {
      explicit = explicit.concat(definition);
    } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
      if (definition.implicit) implicit = implicit.concat(definition.implicit);
      if (definition.explicit) explicit = explicit.concat(definition.explicit);
    } else {
      throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    }
    implicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      if (type$1.loadKind && type$1.loadKind !== "scalar") {
        throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      }
      if (type$1.multi) {
        throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
      }
    });
    explicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
    });
    var result = Object.create(Schema$1.prototype);
    result.implicit = (this.implicit || []).concat(implicit);
    result.explicit = (this.explicit || []).concat(explicit);
    result.compiledImplicit = compileList(result, "implicit");
    result.compiledExplicit = compileList(result, "explicit");
    result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
    return result;
  };
  var schema = Schema$1;
  var str = new type("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(data) {
      return data !== null ? data : "";
    }
  });
  var seq = new type("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(data) {
      return data !== null ? data : [];
    }
  });
  var map2 = new type("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(data) {
      return data !== null ? data : {};
    }
  });
  var failsafe = new schema({
    explicit: [
      str,
      seq,
      map2
    ]
  });
  function resolveYamlNull(data) {
    if (data === null) return true;
    var max = data.length;
    return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
  }
  function constructYamlNull() {
    return null;
  }
  function isNull(object) {
    return object === null;
  }
  var _null = new type("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: resolveYamlNull,
    construct: constructYamlNull,
    predicate: isNull,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  });
  function resolveYamlBoolean(data) {
    if (data === null) return false;
    var max = data.length;
    return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
  }
  function constructYamlBoolean(data) {
    return data === "true" || data === "True" || data === "TRUE";
  }
  function isBoolean(object) {
    return Object.prototype.toString.call(object) === "[object Boolean]";
  }
  var bool = new type("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: resolveYamlBoolean,
    construct: constructYamlBoolean,
    predicate: isBoolean,
    represent: {
      lowercase: function(object) {
        return object ? "true" : "false";
      },
      uppercase: function(object) {
        return object ? "TRUE" : "FALSE";
      },
      camelcase: function(object) {
        return object ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  });
  function isHexCode(c) {
    return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
  }
  function isOctCode(c) {
    return 48 <= c && c <= 55;
  }
  function isDecCode(c) {
    return 48 <= c && c <= 57;
  }
  function resolveYamlInteger(data) {
    if (data === null) return false;
    var max = data.length, index = 0, hasDigits = false, ch;
    if (!max) return false;
    ch = data[index];
    if (ch === "-" || ch === "+") {
      ch = data[++index];
    }
    if (ch === "0") {
      if (index + 1 === max) return true;
      ch = data[++index];
      if (ch === "b") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (ch !== "0" && ch !== "1") return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "x") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isHexCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "o") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_") continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
    }
    if (ch === "_") return false;
    for (; index < max; index++) {
      ch = data[index];
      if (ch === "_") continue;
      if (!isDecCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }
    if (!hasDigits || ch === "_") return false;
    return true;
  }
  function constructYamlInteger(data) {
    var value = data, sign = 1, ch;
    if (value.indexOf("_") !== -1) {
      value = value.replace(/_/g, "");
    }
    ch = value[0];
    if (ch === "-" || ch === "+") {
      if (ch === "-") sign = -1;
      value = value.slice(1);
      ch = value[0];
    }
    if (value === "0") return 0;
    if (ch === "0") {
      if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
      if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
      if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
    }
    return sign * parseInt(value, 10);
  }
  function isInteger(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
  }
  var int = new type("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: resolveYamlInteger,
    construct: constructYamlInteger,
    predicate: isInteger,
    represent: {
      binary: function(obj) {
        return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
      },
      octal: function(obj) {
        return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
      },
      decimal: function(obj) {
        return obj.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(obj) {
        return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  });
  var YAML_FLOAT_PATTERN = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function resolveYamlFloat(data) {
    if (data === null) return false;
    if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    data[data.length - 1] === "_") {
      return false;
    }
    return true;
  }
  function constructYamlFloat(data) {
    var value, sign;
    value = data.replace(/_/g, "").toLowerCase();
    sign = value[0] === "-" ? -1 : 1;
    if ("+-".indexOf(value[0]) >= 0) {
      value = value.slice(1);
    }
    if (value === ".inf") {
      return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    } else if (value === ".nan") {
      return NaN;
    }
    return sign * parseFloat(value, 10);
  }
  var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
  function representYamlFloat(object, style) {
    var res;
    if (isNaN(object)) {
      switch (style) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    } else if (Number.POSITIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    } else if (Number.NEGATIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    } else if (common.isNegativeZero(object)) {
      return "-0.0";
    }
    res = object.toString(10);
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
  }
  function isFloat(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
  }
  var float = new type("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: resolveYamlFloat,
    construct: constructYamlFloat,
    predicate: isFloat,
    represent: representYamlFloat,
    defaultStyle: "lowercase"
  });
  var json = failsafe.extend({
    implicit: [
      _null,
      bool,
      int,
      float
    ]
  });
  var core = json;
  var YAML_DATE_REGEXP = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  );
  var YAML_TIMESTAMP_REGEXP = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function resolveYamlTimestamp(data) {
    if (data === null) return false;
    if (YAML_DATE_REGEXP.exec(data) !== null) return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
    return false;
  }
  function constructYamlTimestamp(data) {
    var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
    match = YAML_DATE_REGEXP.exec(data);
    if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
    if (match === null) throw new Error("Date resolve error");
    year = +match[1];
    month = +match[2] - 1;
    day = +match[3];
    if (!match[4]) {
      return new Date(Date.UTC(year, month, day));
    }
    hour = +match[4];
    minute = +match[5];
    second = +match[6];
    if (match[7]) {
      fraction = match[7].slice(0, 3);
      while (fraction.length < 3) {
        fraction += "0";
      }
      fraction = +fraction;
    }
    if (match[9]) {
      tz_hour = +match[10];
      tz_minute = +(match[11] || 0);
      delta = (tz_hour * 60 + tz_minute) * 6e4;
      if (match[9] === "-") delta = -delta;
    }
    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (delta) date.setTime(date.getTime() - delta);
    return date;
  }
  function representYamlTimestamp(object) {
    return object.toISOString();
  }
  var timestamp = new type("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: resolveYamlTimestamp,
    construct: constructYamlTimestamp,
    instanceOf: Date,
    represent: representYamlTimestamp
  });
  function resolveYamlMerge(data) {
    return data === "<<" || data === null;
  }
  var merge = new type("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: resolveYamlMerge
  });
  var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
  function resolveYamlBinary(data) {
    if (data === null) return false;
    var code, idx, bitlen = 0, max = data.length, map3 = BASE64_MAP;
    for (idx = 0; idx < max; idx++) {
      code = map3.indexOf(data.charAt(idx));
      if (code > 64) continue;
      if (code < 0) return false;
      bitlen += 6;
    }
    return bitlen % 8 === 0;
  }
  function constructYamlBinary(data) {
    var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map3 = BASE64_MAP, bits = 0, result = [];
    for (idx = 0; idx < max; idx++) {
      if (idx % 4 === 0 && idx) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      }
      bits = bits << 6 | map3.indexOf(input.charAt(idx));
    }
    tailbits = max % 4 * 6;
    if (tailbits === 0) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    } else if (tailbits === 18) {
      result.push(bits >> 10 & 255);
      result.push(bits >> 2 & 255);
    } else if (tailbits === 12) {
      result.push(bits >> 4 & 255);
    }
    return new Uint8Array(result);
  }
  function representYamlBinary(object) {
    var result = "", bits = 0, idx, tail, max = object.length, map3 = BASE64_MAP;
    for (idx = 0; idx < max; idx++) {
      if (idx % 3 === 0 && idx) {
        result += map3[bits >> 18 & 63];
        result += map3[bits >> 12 & 63];
        result += map3[bits >> 6 & 63];
        result += map3[bits & 63];
      }
      bits = (bits << 8) + object[idx];
    }
    tail = max % 3;
    if (tail === 0) {
      result += map3[bits >> 18 & 63];
      result += map3[bits >> 12 & 63];
      result += map3[bits >> 6 & 63];
      result += map3[bits & 63];
    } else if (tail === 2) {
      result += map3[bits >> 10 & 63];
      result += map3[bits >> 4 & 63];
      result += map3[bits << 2 & 63];
      result += map3[64];
    } else if (tail === 1) {
      result += map3[bits >> 2 & 63];
      result += map3[bits << 4 & 63];
      result += map3[64];
      result += map3[64];
    }
    return result;
  }
  function isBinary(obj) {
    return Object.prototype.toString.call(obj) === "[object Uint8Array]";
  }
  var binary = new type("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: resolveYamlBinary,
    construct: constructYamlBinary,
    predicate: isBinary,
    represent: representYamlBinary
  });
  var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
  var _toString$2 = Object.prototype.toString;
  function resolveYamlOmap(data) {
    if (data === null) return true;
    var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      pairHasKey = false;
      if (_toString$2.call(pair) !== "[object Object]") return false;
      for (pairKey in pair) {
        if (_hasOwnProperty$3.call(pair, pairKey)) {
          if (!pairHasKey) pairHasKey = true;
          else return false;
        }
      }
      if (!pairHasKey) return false;
      if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
      else return false;
    }
    return true;
  }
  function constructYamlOmap(data) {
    return data !== null ? data : [];
  }
  var omap = new type("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: resolveYamlOmap,
    construct: constructYamlOmap
  });
  var _toString$1 = Object.prototype.toString;
  function resolveYamlPairs(data) {
    if (data === null) return true;
    var index, length, pair, keys2, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      if (_toString$1.call(pair) !== "[object Object]") return false;
      keys2 = Object.keys(pair);
      if (keys2.length !== 1) return false;
      result[index] = [keys2[0], pair[keys2[0]]];
    }
    return true;
  }
  function constructYamlPairs(data) {
    if (data === null) return [];
    var index, length, pair, keys2, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      keys2 = Object.keys(pair);
      result[index] = [keys2[0], pair[keys2[0]]];
    }
    return result;
  }
  var pairs = new type("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: resolveYamlPairs,
    construct: constructYamlPairs
  });
  var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  function resolveYamlSet(data) {
    if (data === null) return true;
    var key, object = data;
    for (key in object) {
      if (_hasOwnProperty$2.call(object, key)) {
        if (object[key] !== null) return false;
      }
    }
    return true;
  }
  function constructYamlSet(data) {
    return data !== null ? data : {};
  }
  var set = new type("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: resolveYamlSet,
    construct: constructYamlSet
  });
  var _default = core.extend({
    implicit: [
      timestamp,
      merge
    ],
    explicit: [
      binary,
      omap,
      pairs,
      set
    ]
  });
  var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var CONTEXT_FLOW_IN = 1;
  var CONTEXT_FLOW_OUT = 2;
  var CONTEXT_BLOCK_IN = 3;
  var CONTEXT_BLOCK_OUT = 4;
  var CHOMPING_CLIP = 1;
  var CHOMPING_STRIP = 2;
  var CHOMPING_KEEP = 3;
  var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
  var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
  var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function _class(obj) {
    return Object.prototype.toString.call(obj);
  }
  function is_EOL(c) {
    return c === 10 || c === 13;
  }
  function is_WHITE_SPACE(c) {
    return c === 9 || c === 32;
  }
  function is_WS_OR_EOL(c) {
    return c === 9 || c === 32 || c === 10 || c === 13;
  }
  function is_FLOW_INDICATOR(c) {
    return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
  }
  function fromHexCode(c) {
    var lc;
    if (48 <= c && c <= 57) {
      return c - 48;
    }
    lc = c | 32;
    if (97 <= lc && lc <= 102) {
      return lc - 97 + 10;
    }
    return -1;
  }
  function escapedHexLen(c) {
    if (c === 120) {
      return 2;
    }
    if (c === 117) {
      return 4;
    }
    if (c === 85) {
      return 8;
    }
    return 0;
  }
  function fromDecimalCode(c) {
    if (48 <= c && c <= 57) {
      return c - 48;
    }
    return -1;
  }
  function simpleEscapeSequence(c) {
    return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
  }
  function charFromCodepoint(c) {
    if (c <= 65535) {
      return String.fromCharCode(c);
    }
    return String.fromCharCode(
      (c - 65536 >> 10) + 55296,
      (c - 65536 & 1023) + 56320
    );
  }
  function setProperty(object, key, value) {
    if (key === "__proto__") {
      Object.defineProperty(object, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value
      });
    } else {
      object[key] = value;
    }
  }
  var simpleEscapeCheck = new Array(256);
  var simpleEscapeMap = new Array(256);
  for (i = 0; i < 256; i++) {
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
  }
  var i;
  function State$1(input, options) {
    this.input = input;
    this.filename = options["filename"] || null;
    this.schema = options["schema"] || _default;
    this.onWarning = options["onWarning"] || null;
    this.legacy = options["legacy"] || false;
    this.json = options["json"] || false;
    this.listener = options["listener"] || null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap = this.schema.compiledTypeMap;
    this.length = input.length;
    this.position = 0;
    this.line = 0;
    this.lineStart = 0;
    this.lineIndent = 0;
    this.firstTabInLine = -1;
    this.documents = [];
  }
  function generateError(state, message) {
    var mark = {
      name: state.filename,
      buffer: state.input.slice(0, -1),
      // omit trailing \0
      position: state.position,
      line: state.line,
      column: state.position - state.lineStart
    };
    mark.snippet = snippet(mark);
    return new exception(message, mark);
  }
  function throwError(state, message) {
    throw generateError(state, message);
  }
  function throwWarning(state, message) {
    if (state.onWarning) {
      state.onWarning.call(null, generateError(state, message));
    }
  }
  var directiveHandlers = {
    YAML: function handleYamlDirective(state, name, args) {
      var match, major, minor;
      if (state.version !== null) {
        throwError(state, "duplication of %YAML directive");
      }
      if (args.length !== 1) {
        throwError(state, "YAML directive accepts exactly one argument");
      }
      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
      if (match === null) {
        throwError(state, "ill-formed argument of the YAML directive");
      }
      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);
      if (major !== 1) {
        throwError(state, "unacceptable YAML version of the document");
      }
      state.version = args[0];
      state.checkLineBreaks = minor < 2;
      if (minor !== 1 && minor !== 2) {
        throwWarning(state, "unsupported YAML version of the document");
      }
    },
    TAG: function handleTagDirective(state, name, args) {
      var handle, prefix;
      if (args.length !== 2) {
        throwError(state, "TAG directive accepts exactly two arguments");
      }
      handle = args[0];
      prefix = args[1];
      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
      }
      if (_hasOwnProperty$1.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }
      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
      }
      try {
        prefix = decodeURIComponent(prefix);
      } catch (err) {
        throwError(state, "tag prefix is malformed: " + prefix);
      }
      state.tagMap[handle] = prefix;
    }
  };
  function captureSegment(state, start, end, checkJson) {
    var _position, _length, _character, _result;
    if (start < end) {
      _result = state.input.slice(start, end);
      if (checkJson) {
        for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
          _character = _result.charCodeAt(_position);
          if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
            throwError(state, "expected valid JSON character");
          }
        }
      } else if (PATTERN_NON_PRINTABLE.test(_result)) {
        throwError(state, "the stream contains non-printable characters");
      }
      state.result += _result;
    }
  }
  function mergeMappings(state, destination, source, overridableKeys) {
    var sourceKeys, key, index, quantity;
    if (!common.isObject(source)) {
      throwError(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    sourceKeys = Object.keys(source);
    for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
      key = sourceKeys[index];
      if (!_hasOwnProperty$1.call(destination, key)) {
        setProperty(destination, key, source[key]);
        overridableKeys[key] = true;
      }
    }
  }
  function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
    var index, quantity;
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);
      for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
        if (Array.isArray(keyNode[index])) {
          throwError(state, "nested arrays are not supported inside keys");
        }
        if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
          keyNode[index] = "[object Object]";
        }
      }
    }
    if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
      keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (_result === null) {
      _result = {};
    }
    if (keyTag === "tag:yaml.org,2002:merge") {
      if (Array.isArray(valueNode)) {
        for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
          mergeMappings(state, _result, valueNode[index], overridableKeys);
        }
      } else {
        mergeMappings(state, _result, valueNode, overridableKeys);
      }
    } else {
      if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
        state.line = startLine || state.line;
        state.lineStart = startLineStart || state.lineStart;
        state.position = startPos || state.position;
        throwError(state, "duplicated mapping key");
      }
      setProperty(_result, keyNode, valueNode);
      delete overridableKeys[keyNode];
    }
    return _result;
  }
  function readLineBreak(state) {
    var ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 10) {
      state.position++;
    } else if (ch === 13) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 10) {
        state.position++;
      }
    } else {
      throwError(state, "a line break is expected");
    }
    state.line += 1;
    state.lineStart = state.position;
    state.firstTabInLine = -1;
  }
  function skipSeparationSpace(state, allowComments, checkIndent) {
    var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        if (ch === 9 && state.firstTabInLine === -1) {
          state.firstTabInLine = state.position;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      if (allowComments && ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 10 && ch !== 13 && ch !== 0);
      }
      if (is_EOL(ch)) {
        readLineBreak(state);
        ch = state.input.charCodeAt(state.position);
        lineBreaks++;
        state.lineIndent = 0;
        while (ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      } else {
        break;
      }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
      throwWarning(state, "deficient indentation");
    }
    return lineBreaks;
  }
  function testDocumentSeparator(state) {
    var _position = state.position, ch;
    ch = state.input.charCodeAt(_position);
    if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
      _position += 3;
      ch = state.input.charCodeAt(_position);
      if (ch === 0 || is_WS_OR_EOL(ch)) {
        return true;
      }
    }
    return false;
  }
  function writeFoldedLines(state, count) {
    if (count === 1) {
      state.result += " ";
    } else if (count > 1) {
      state.result += common.repeat("\n", count - 1);
    }
  }
  function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
    ch = state.input.charCodeAt(state.position);
    if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
      return false;
    }
    if (ch === 63 || ch === 45) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }
    state.kind = "scalar";
    state.result = "";
    captureStart = captureEnd = state.position;
    hasPendingContent = false;
    while (ch !== 0) {
      if (ch === 58) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }
      } else if (ch === 35) {
        preceding = state.input.charCodeAt(state.position - 1);
        if (is_WS_OR_EOL(preceding)) {
          break;
        }
      } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
        break;
      } else if (is_EOL(ch)) {
        _line = state.line;
        _lineStart = state.lineStart;
        _lineIndent = state.lineIndent;
        skipSeparationSpace(state, false, -1);
        if (state.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = state.input.charCodeAt(state.position);
          continue;
        } else {
          state.position = captureEnd;
          state.line = _line;
          state.lineStart = _lineStart;
          state.lineIndent = _lineIndent;
          break;
        }
      }
      if (hasPendingContent) {
        captureSegment(state, captureStart, captureEnd, false);
        writeFoldedLines(state, state.line - _line);
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
      }
      if (!is_WHITE_SPACE(ch)) {
        captureEnd = state.position + 1;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, captureEnd, false);
    if (state.result) {
      return true;
    }
    state.kind = _kind;
    state.result = _result;
    return false;
  }
  function readSingleQuotedScalar(state, nodeIndent) {
    var ch, captureStart, captureEnd;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 39) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 39) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (ch === 39) {
          captureStart = state.position;
          state.position++;
          captureEnd = state.position;
        } else {
          return true;
        }
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a single quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a single quoted scalar");
  }
  function readDoubleQuotedScalar(state, nodeIndent) {
    var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 34) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 34) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;
      } else if (ch === 92) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;
        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;
          for (; hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);
            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;
            } else {
              throwError(state, "expected hexadecimal character");
            }
          }
          state.result += charFromCodepoint(hexResult);
          state.position++;
        } else {
          throwError(state, "unknown escape sequence");
        }
        captureStart = captureEnd = state.position;
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a double quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a double quoted scalar");
  }
  function readFlowCollection(state, nodeIndent) {
    var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 91) {
      terminator = 93;
      isMapping = false;
      _result = [];
    } else if (ch === 123) {
      terminator = 125;
      isMapping = true;
      _result = {};
    } else {
      return false;
    }
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(++state.position);
    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? "mapping" : "sequence";
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, "missed comma between flow collection entries");
      } else if (ch === 44) {
        throwError(state, "expected the node content, but found ','");
      }
      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;
      if (ch === 63) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }
      _line = state.line;
      _lineStart = state.lineStart;
      _pos = state.position;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if ((isExplicitPair || state.line === _line) && ch === 58) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }
      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
      } else {
        _result.push(keyNode);
      }
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === 44) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }
    throwError(state, "unexpected end of the stream within a flow collection");
  }
  function readBlockScalar(state, nodeIndent) {
    var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 124) {
      folding = false;
    } else if (ch === 62) {
      folding = true;
    } else {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    while (ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
      if (ch === 43 || ch === 45) {
        if (CHOMPING_CLIP === chomping) {
          chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, "repeat of a chomping mode identifier");
        }
      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
        if (tmp === 0) {
          throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throwError(state, "repeat of an indentation width identifier");
        }
      } else {
        break;
      }
    }
    if (is_WHITE_SPACE(ch)) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (is_WHITE_SPACE(ch));
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (!is_EOL(ch) && ch !== 0);
      }
    }
    while (ch !== 0) {
      readLineBreak(state);
      state.lineIndent = 0;
      ch = state.input.charCodeAt(state.position);
      while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
      if (!detectedIndent && state.lineIndent > textIndent) {
        textIndent = state.lineIndent;
      }
      if (is_EOL(ch)) {
        emptyLines++;
        continue;
      }
      if (state.lineIndent < textIndent) {
        if (chomping === CHOMPING_KEEP) {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) {
            state.result += "\n";
          }
        }
        break;
      }
      if (folding) {
        if (is_WHITE_SPACE(ch)) {
          atMoreIndented = true;
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (atMoreIndented) {
          atMoreIndented = false;
          state.result += common.repeat("\n", emptyLines + 1);
        } else if (emptyLines === 0) {
          if (didReadContent) {
            state.result += " ";
          }
        } else {
          state.result += common.repeat("\n", emptyLines);
        }
      } else {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      }
      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      captureStart = state.position;
      while (!is_EOL(ch) && ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, state.position, false);
    }
    return true;
  }
  function readBlockSequence(state, nodeIndent) {
    var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
    if (state.firstTabInLine !== -1) return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      if (ch !== 45) {
        break;
      }
      following = state.input.charCodeAt(state.position + 1);
      if (!is_WS_OR_EOL(following)) {
        break;
      }
      detected = true;
      state.position++;
      if (skipSeparationSpace(state, true, -1)) {
        if (state.lineIndent <= nodeIndent) {
          _result.push(null);
          ch = state.input.charCodeAt(state.position);
          continue;
        }
      }
      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
      _result.push(state.result);
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a sequence entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "sequence";
      state.result = _result;
      return true;
    }
    return false;
  }
  function readBlockMapping(state, nodeIndent, flowIndent) {
    var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.firstTabInLine !== -1) return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (!atExplicitKey && state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      following = state.input.charCodeAt(state.position + 1);
      _line = state.line;
      if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
        if (ch === 63) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = true;
          allowCompact = true;
        } else if (atExplicitKey) {
          atExplicitKey = false;
          allowCompact = true;
        } else {
          throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
        }
        state.position += 1;
        ch = following;
      } else {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
        if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          break;
        }
        if (state.line === _line) {
          ch = state.input.charCodeAt(state.position);
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 58) {
            ch = state.input.charCodeAt(++state.position);
            if (!is_WS_OR_EOL(ch)) {
              throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
            }
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;
          } else if (detected) {
            throwError(state, "can not read an implicit mapping pair; a colon is missed");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else if (detected) {
          throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      }
      if (state.line === _line || state.lineIndent > nodeIndent) {
        if (atExplicitKey) {
          _keyLine = state.line;
          _keyLineStart = state.lineStart;
          _keyPos = state.position;
        }
        if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
          if (atExplicitKey) {
            keyNode = state.result;
          } else {
            valueNode = state.result;
          }
        }
        if (!atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
      }
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a mapping entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "mapping";
      state.result = _result;
    }
    return detected;
  }
  function readTagProperty(state) {
    var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 33) return false;
    if (state.tag !== null) {
      throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 60) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);
    } else if (ch === 33) {
      isNamed = true;
      tagHandle = "!!";
      ch = state.input.charCodeAt(++state.position);
    } else {
      tagHandle = "!";
    }
    _position = state.position;
    if (isVerbatim) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0 && ch !== 62);
      if (state.position < state.length) {
        tagName = state.input.slice(_position, state.position);
        ch = state.input.charCodeAt(++state.position);
      } else {
        throwError(state, "unexpected end of the stream within a verbatim tag");
      }
    } else {
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        if (ch === 33) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);
            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, "named tag handle cannot contain such characters");
            }
            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, "tag suffix cannot contain exclamation marks");
          }
        }
        ch = state.input.charCodeAt(++state.position);
      }
      tagName = state.input.slice(_position, state.position);
      if (PATTERN_FLOW_INDICATORS.test(tagName)) {
        throwError(state, "tag suffix cannot contain flow indicator characters");
      }
    }
    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
      throwError(state, "tag name cannot contain such characters: " + tagName);
    }
    try {
      tagName = decodeURIComponent(tagName);
    } catch (err) {
      throwError(state, "tag name is malformed: " + tagName);
    }
    if (isVerbatim) {
      state.tag = tagName;
    } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
      state.tag = state.tagMap[tagHandle] + tagName;
    } else if (tagHandle === "!") {
      state.tag = "!" + tagName;
    } else if (tagHandle === "!!") {
      state.tag = "tag:yaml.org,2002:" + tagName;
    } else {
      throwError(state, 'undeclared tag handle "' + tagHandle + '"');
    }
    return true;
  }
  function readAnchorProperty(state) {
    var _position, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 38) return false;
    if (state.anchor !== null) {
      throwError(state, "duplication of an anchor property");
    }
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(_position, state.position);
    return true;
  }
  function readAlias(state) {
    var _position, alias, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 42) return false;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an alias node must contain at least one character");
    }
    alias = state.input.slice(_position, state.position);
    if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
      throwError(state, 'unidentified alias "' + alias + '"');
    }
    state.result = state.anchorMap[alias];
    skipSeparationSpace(state, true, -1);
    return true;
  }
  function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
    if (state.listener !== null) {
      state.listener("open", state);
    }
    state.tag = null;
    state.anchor = null;
    state.kind = null;
    state.result = null;
    allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    if (allowToSeek) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      }
    }
    if (indentStatus === 1) {
      while (readTagProperty(state) || readAnchorProperty(state)) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        } else {
          allowBlockCollections = false;
        }
      }
    }
    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
      if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
        flowIndent = parentIndent;
      } else {
        flowIndent = parentIndent + 1;
      }
      blockIndent = state.position - state.lineStart;
      if (indentStatus === 1) {
        if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
          hasContent = true;
        } else {
          if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
            hasContent = true;
          } else if (readAlias(state)) {
            hasContent = true;
            if (state.tag !== null || state.anchor !== null) {
              throwError(state, "alias node should not have any properties");
            }
          } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
            hasContent = true;
            if (state.tag === null) {
              state.tag = "?";
            }
          }
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else if (indentStatus === 0) {
        hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
      }
    }
    if (state.tag === null) {
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    } else if (state.tag === "?") {
      if (state.result !== null && state.kind !== "scalar") {
        throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
      }
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
        type2 = state.implicitTypes[typeIndex];
        if (type2.resolve(state.result)) {
          state.result = type2.construct(state.result);
          state.tag = type2.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (state.tag !== "!") {
      if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
        type2 = state.typeMap[state.kind || "fallback"][state.tag];
      } else {
        type2 = null;
        typeList = state.typeMap.multi[state.kind || "fallback"];
        for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
          if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
            type2 = typeList[typeIndex];
            break;
          }
        }
      }
      if (!type2) {
        throwError(state, "unknown tag !<" + state.tag + ">");
      }
      if (state.result !== null && type2.kind !== state.kind) {
        throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
      }
      if (!type2.resolve(state.result, state.tag)) {
        throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
      } else {
        state.result = type2.construct(state.result, state.tag);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    }
    if (state.listener !== null) {
      state.listener("close", state);
    }
    return state.tag !== null || state.anchor !== null || hasContent;
  }
  function readDocument(state) {
    var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = /* @__PURE__ */ Object.create(null);
    state.anchorMap = /* @__PURE__ */ Object.create(null);
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if (state.lineIndent > 0 || ch !== 37) {
        break;
      }
      hasDirectives = true;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveName = state.input.slice(_position, state.position);
      directiveArgs = [];
      if (directiveName.length < 1) {
        throwError(state, "directive name must not be less than one character in length");
      }
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && !is_EOL(ch));
          break;
        }
        if (is_EOL(ch)) break;
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveArgs.push(state.input.slice(_position, state.position));
      }
      if (ch !== 0) readLineBreak(state);
      if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
        directiveHandlers[directiveName](state, directiveName, directiveArgs);
      } else {
        throwWarning(state, 'unknown document directive "' + directiveName + '"');
      }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
      throwError(state, "directives end mark is expected");
    }
    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);
    if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
      throwWarning(state, "non-ASCII line breaks are interpreted as content");
    }
    state.documents.push(state.result);
    if (state.position === state.lineStart && testDocumentSeparator(state)) {
      if (state.input.charCodeAt(state.position) === 46) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
      return;
    }
    if (state.position < state.length - 1) {
      throwError(state, "end of the stream or a document separator is expected");
    } else {
      return;
    }
  }
  function loadDocuments(input, options) {
    input = String(input);
    options = options || {};
    if (input.length !== 0) {
      if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
        input += "\n";
      }
      if (input.charCodeAt(0) === 65279) {
        input = input.slice(1);
      }
    }
    var state = new State$1(input, options);
    var nullpos = input.indexOf("\0");
    if (nullpos !== -1) {
      state.position = nullpos;
      throwError(state, "null byte is not allowed in input");
    }
    state.input += "\0";
    while (state.input.charCodeAt(state.position) === 32) {
      state.lineIndent += 1;
      state.position += 1;
    }
    while (state.position < state.length - 1) {
      readDocument(state);
    }
    return state.documents;
  }
  function loadAll$1(input, iterator, options) {
    if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
      options = iterator;
      iterator = null;
    }
    var documents = loadDocuments(input, options);
    if (typeof iterator !== "function") {
      return documents;
    }
    for (var index = 0, length = documents.length; index < length; index += 1) {
      iterator(documents[index]);
    }
  }
  function load$1(input, options) {
    var documents = loadDocuments(input, options);
    if (documents.length === 0) {
      return void 0;
    } else if (documents.length === 1) {
      return documents[0];
    }
    throw new exception("expected a single document in the stream, but found more");
  }
  var loadAll_1 = loadAll$1;
  var load_1 = load$1;
  var loader = {
    loadAll: loadAll_1,
    load: load_1
  };
  var _toString = Object.prototype.toString;
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var CHAR_BOM = 65279;
  var CHAR_TAB = 9;
  var CHAR_LINE_FEED = 10;
  var CHAR_CARRIAGE_RETURN = 13;
  var CHAR_SPACE = 32;
  var CHAR_EXCLAMATION = 33;
  var CHAR_DOUBLE_QUOTE = 34;
  var CHAR_SHARP = 35;
  var CHAR_PERCENT = 37;
  var CHAR_AMPERSAND = 38;
  var CHAR_SINGLE_QUOTE = 39;
  var CHAR_ASTERISK = 42;
  var CHAR_COMMA = 44;
  var CHAR_MINUS = 45;
  var CHAR_COLON = 58;
  var CHAR_EQUALS = 61;
  var CHAR_GREATER_THAN = 62;
  var CHAR_QUESTION = 63;
  var CHAR_COMMERCIAL_AT = 64;
  var CHAR_LEFT_SQUARE_BRACKET = 91;
  var CHAR_RIGHT_SQUARE_BRACKET = 93;
  var CHAR_GRAVE_ACCENT = 96;
  var CHAR_LEFT_CURLY_BRACKET = 123;
  var CHAR_VERTICAL_LINE = 124;
  var CHAR_RIGHT_CURLY_BRACKET = 125;
  var ESCAPE_SEQUENCES = {};
  ESCAPE_SEQUENCES[0] = "\\0";
  ESCAPE_SEQUENCES[7] = "\\a";
  ESCAPE_SEQUENCES[8] = "\\b";
  ESCAPE_SEQUENCES[9] = "\\t";
  ESCAPE_SEQUENCES[10] = "\\n";
  ESCAPE_SEQUENCES[11] = "\\v";
  ESCAPE_SEQUENCES[12] = "\\f";
  ESCAPE_SEQUENCES[13] = "\\r";
  ESCAPE_SEQUENCES[27] = "\\e";
  ESCAPE_SEQUENCES[34] = '\\"';
  ESCAPE_SEQUENCES[92] = "\\\\";
  ESCAPE_SEQUENCES[133] = "\\N";
  ESCAPE_SEQUENCES[160] = "\\_";
  ESCAPE_SEQUENCES[8232] = "\\L";
  ESCAPE_SEQUENCES[8233] = "\\P";
  var DEPRECATED_BOOLEANS_SYNTAX = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ];
  var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function compileStyleMap(schema2, map3) {
    var result, keys2, index, length, tag, style, type2;
    if (map3 === null) return {};
    result = {};
    keys2 = Object.keys(map3);
    for (index = 0, length = keys2.length; index < length; index += 1) {
      tag = keys2[index];
      style = String(map3[tag]);
      if (tag.slice(0, 2) === "!!") {
        tag = "tag:yaml.org,2002:" + tag.slice(2);
      }
      type2 = schema2.compiledTypeMap["fallback"][tag];
      if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
        style = type2.styleAliases[style];
      }
      result[tag] = style;
    }
    return result;
  }
  function encodeHex(character) {
    var string, handle, length;
    string = character.toString(16).toUpperCase();
    if (character <= 255) {
      handle = "x";
      length = 2;
    } else if (character <= 65535) {
      handle = "u";
      length = 4;
    } else if (character <= 4294967295) {
      handle = "U";
      length = 8;
    } else {
      throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
    }
    return "\\" + handle + common.repeat("0", length - string.length) + string;
  }
  var QUOTING_TYPE_SINGLE = 1;
  var QUOTING_TYPE_DOUBLE = 2;
  function State(options) {
    this.schema = options["schema"] || _default;
    this.indent = Math.max(1, options["indent"] || 2);
    this.noArrayIndent = options["noArrayIndent"] || false;
    this.skipInvalid = options["skipInvalid"] || false;
    this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
    this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
    this.sortKeys = options["sortKeys"] || false;
    this.lineWidth = options["lineWidth"] || 80;
    this.noRefs = options["noRefs"] || false;
    this.noCompatMode = options["noCompatMode"] || false;
    this.condenseFlow = options["condenseFlow"] || false;
    this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
    this.forceQuotes = options["forceQuotes"] || false;
    this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;
    this.tag = null;
    this.result = "";
    this.duplicates = [];
    this.usedDuplicates = null;
  }
  function indentString(string, spaces) {
    var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
    while (position < length) {
      next = string.indexOf("\n", position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }
      if (line.length && line !== "\n") result += ind;
      result += line;
    }
    return result;
  }
  function generateNextLine(state, level) {
    return "\n" + common.repeat(" ", state.indent * level);
  }
  function testImplicitResolving(state, str2) {
    var index, length, type2;
    for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
      type2 = state.implicitTypes[index];
      if (type2.resolve(str2)) {
        return true;
      }
    }
    return false;
  }
  function isWhitespace(c) {
    return c === CHAR_SPACE || c === CHAR_TAB;
  }
  function isPrintable(c) {
    return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
  }
  function isNsCharOrWhitespace(c) {
    return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
  }
  function isPlainSafe(c, prev, inblock) {
    var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
    var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
    return (
      // ns-plain-safe
      (inblock ? (
        // c = flow-in
        cIsNsCharOrWhitespace
      ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
    );
  }
  function isPlainSafeFirst(c) {
    return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
  }
  function isPlainSafeLast(c) {
    return !isWhitespace(c) && c !== CHAR_COLON;
  }
  function codePointAt(string, pos) {
    var first2 = string.charCodeAt(pos), second;
    if (first2 >= 55296 && first2 <= 56319 && pos + 1 < string.length) {
      second = string.charCodeAt(pos + 1);
      if (second >= 56320 && second <= 57343) {
        return (first2 - 55296) * 1024 + second - 56320 + 65536;
      }
    }
    return first2;
  }
  function needIndentIndicator(string) {
    var leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
  }
  var STYLE_PLAIN = 1;
  var STYLE_SINGLE = 2;
  var STYLE_LITERAL = 3;
  var STYLE_FOLDED = 4;
  var STYLE_DOUBLE = 5;
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
    var i;
    var char = 0;
    var prevChar = null;
    var hasLineBreak = false;
    var hasFoldableLine = false;
    var shouldTrackWidth = lineWidth !== -1;
    var previousLineBreak = -1;
    var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
    if (singleLineOnly || forceQuotes) {
      for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
    } else {
      for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (char === CHAR_LINE_FEED) {
          hasLineBreak = true;
          if (shouldTrackWidth) {
            hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
            i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
            previousLineBreak = i;
          }
        } else if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
      hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
    }
    if (!hasLineBreak && !hasFoldableLine) {
      if (plain && !forceQuotes && !testAmbiguousType(string)) {
        return STYLE_PLAIN;
      }
      return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
    }
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
      return STYLE_DOUBLE;
    }
    if (!forceQuotes) {
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  function writeScalar(state, string, level, iskey, inblock) {
    state.dump = (function() {
      if (string.length === 0) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
      }
      if (!state.noCompatMode) {
        if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
          return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
        }
      }
      var indent = state.indent * Math.max(1, level);
      var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
      var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
      function testAmbiguity(string2) {
        return testImplicitResolving(state, string2);
      }
      switch (chooseScalarStyle(
        string,
        singleLineOnly,
        state.indent,
        lineWidth,
        testAmbiguity,
        state.quotingType,
        state.forceQuotes && !iskey,
        inblock
      )) {
        case STYLE_PLAIN:
          return string;
        case STYLE_SINGLE:
          return "'" + string.replace(/'/g, "''") + "'";
        case STYLE_LITERAL:
          return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
        case STYLE_FOLDED:
          return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
        case STYLE_DOUBLE:
          return '"' + escapeString(string) + '"';
        default:
          throw new exception("impossible error: invalid scalar style");
      }
    })();
  }
  function blockHeader(string, indentPerLevel) {
    var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
    var clip = string[string.length - 1] === "\n";
    var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
    var chomp = keep ? "+" : clip ? "" : "-";
    return indentIndicator + chomp + "\n";
  }
  function dropEndingNewline(string) {
    return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
  }
  function foldString(string, width) {
    var lineRe = /(\n+)([^\n]*)/g;
    var result = (function() {
      var nextLF = string.indexOf("\n");
      nextLF = nextLF !== -1 ? nextLF : string.length;
      lineRe.lastIndex = nextLF;
      return foldLine(string.slice(0, nextLF), width);
    })();
    var prevMoreIndented = string[0] === "\n" || string[0] === " ";
    var moreIndented;
    var match;
    while (match = lineRe.exec(string)) {
      var prefix = match[1], line = match[2];
      moreIndented = line[0] === " ";
      result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
      prevMoreIndented = moreIndented;
    }
    return result;
  }
  function foldLine(line, width) {
    if (line === "" || line[0] === " ") return line;
    var breakRe = / [^ ]/g;
    var match;
    var start = 0, end, curr = 0, next = 0;
    var result = "";
    while (match = breakRe.exec(line)) {
      next = match.index;
      if (next - start > width) {
        end = curr > start ? curr : next;
        result += "\n" + line.slice(start, end);
        start = end + 1;
      }
      curr = next;
    }
    result += "\n";
    if (line.length - start > width && curr > start) {
      result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
    } else {
      result += line.slice(start);
    }
    return result.slice(1);
  }
  function escapeString(string) {
    var result = "";
    var char = 0;
    var escapeSeq;
    for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      escapeSeq = ESCAPE_SEQUENCES[char];
      if (!escapeSeq && isPrintable(char)) {
        result += string[i];
        if (char >= 65536) result += string[i + 1];
      } else {
        result += escapeSeq || encodeHex(char);
      }
    }
    return result;
  }
  function writeFlowSequence(state, level, object) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];
      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }
      if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
        if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = "[" + _result + "]";
  }
  function writeBlockSequence(state, level, object, compact2) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];
      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }
      if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
        if (!compact2 || _result !== "") {
          _result += generateNextLine(state, level);
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          _result += "-";
        } else {
          _result += "- ";
        }
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = _result || "[]";
  }
  function writeFlowMapping(state, level, object) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (_result !== "") pairBuffer += ", ";
      if (state.condenseFlow) pairBuffer += '"';
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }
      if (!writeNode(state, level, objectKey, false, false)) {
        continue;
      }
      if (state.dump.length > 1024) pairBuffer += "? ";
      pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
      if (!writeNode(state, level, objectValue, false, false)) {
        continue;
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = "{" + _result + "}";
  }
  function writeBlockMapping(state, level, object, compact2) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
    if (state.sortKeys === true) {
      objectKeyList.sort();
    } else if (typeof state.sortKeys === "function") {
      objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
      throw new exception("sortKeys must be a boolean or a function");
    }
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (!compact2 || _result !== "") {
        pairBuffer += generateNextLine(state, level);
      }
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }
      if (!writeNode(state, level + 1, objectKey, true, true, true)) {
        continue;
      }
      explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
      if (explicitPair) {
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += "?";
        } else {
          pairBuffer += "? ";
        }
      }
      pairBuffer += state.dump;
      if (explicitPair) {
        pairBuffer += generateNextLine(state, level);
      }
      if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
        continue;
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += ":";
      } else {
        pairBuffer += ": ";
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = _result || "{}";
  }
  function detectType(state, object, explicit) {
    var _result, typeList, index, length, type2, style;
    typeList = explicit ? state.explicitTypes : state.implicitTypes;
    for (index = 0, length = typeList.length; index < length; index += 1) {
      type2 = typeList[index];
      if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
        if (explicit) {
          if (type2.multi && type2.representName) {
            state.tag = type2.representName(object);
          } else {
            state.tag = type2.tag;
          }
        } else {
          state.tag = "?";
        }
        if (type2.represent) {
          style = state.styleMap[type2.tag] || type2.defaultStyle;
          if (_toString.call(type2.represent) === "[object Function]") {
            _result = type2.represent(object, style);
          } else if (_hasOwnProperty.call(type2.represent, style)) {
            _result = type2.represent[style](object, style);
          } else {
            throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
          }
          state.dump = _result;
        }
        return true;
      }
    }
    return false;
  }
  function writeNode(state, level, object, block, compact2, iskey, isblockseq) {
    state.tag = null;
    state.dump = object;
    if (!detectType(state, object, false)) {
      detectType(state, object, true);
    }
    var type2 = _toString.call(state.dump);
    var inblock = block;
    var tagStr;
    if (block) {
      block = state.flowLevel < 0 || state.flowLevel > level;
    }
    var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
    if (objectOrArray) {
      duplicateIndex = state.duplicates.indexOf(object);
      duplicate = duplicateIndex !== -1;
    }
    if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
      compact2 = false;
    }
    if (duplicate && state.usedDuplicates[duplicateIndex]) {
      state.dump = "*ref_" + duplicateIndex;
    } else {
      if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
        state.usedDuplicates[duplicateIndex] = true;
      }
      if (type2 === "[object Object]") {
        if (block && Object.keys(state.dump).length !== 0) {
          writeBlockMapping(state, level, state.dump, compact2);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowMapping(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type2 === "[object Array]") {
        if (block && state.dump.length !== 0) {
          if (state.noArrayIndent && !isblockseq && level > 0) {
            writeBlockSequence(state, level - 1, state.dump, compact2);
          } else {
            writeBlockSequence(state, level, state.dump, compact2);
          }
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowSequence(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type2 === "[object String]") {
        if (state.tag !== "?") {
          writeScalar(state, state.dump, level, iskey, inblock);
        }
      } else if (type2 === "[object Undefined]") {
        return false;
      } else {
        if (state.skipInvalid) return false;
        throw new exception("unacceptable kind of an object to dump " + type2);
      }
      if (state.tag !== null && state.tag !== "?") {
        tagStr = encodeURI(
          state.tag[0] === "!" ? state.tag.slice(1) : state.tag
        ).replace(/!/g, "%21");
        if (state.tag[0] === "!") {
          tagStr = "!" + tagStr;
        } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
          tagStr = "!!" + tagStr.slice(18);
        } else {
          tagStr = "!<" + tagStr + ">";
        }
        state.dump = tagStr + " " + state.dump;
      }
    }
    return true;
  }
  function getDuplicateReferences(object, state) {
    var objects = [], duplicatesIndexes = [], index, length;
    inspectNode(object, objects, duplicatesIndexes);
    for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
      state.duplicates.push(objects[duplicatesIndexes[index]]);
    }
    state.usedDuplicates = new Array(length);
  }
  function inspectNode(object, objects, duplicatesIndexes) {
    var objectKeyList, index, length;
    if (object !== null && typeof object === "object") {
      index = objects.indexOf(object);
      if (index !== -1) {
        if (duplicatesIndexes.indexOf(index) === -1) {
          duplicatesIndexes.push(index);
        }
      } else {
        objects.push(object);
        if (Array.isArray(object)) {
          for (index = 0, length = object.length; index < length; index += 1) {
            inspectNode(object[index], objects, duplicatesIndexes);
          }
        } else {
          objectKeyList = Object.keys(object);
          for (index = 0, length = objectKeyList.length; index < length; index += 1) {
            inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
          }
        }
      }
    }
  }
  function dump$1(input, options) {
    options = options || {};
    var state = new State(options);
    if (!state.noRefs) getDuplicateReferences(input, state);
    var value = input;
    if (state.replacer) {
      value = state.replacer.call({ "": value }, "", value);
    }
    if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
    return "";
  }
  var dump_1 = dump$1;
  var dumper = {
    dump: dump_1
  };
  function renamed(from, to) {
    return function() {
      throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
    };
  }
  var Type = type;
  var Schema = schema;
  var FAILSAFE_SCHEMA = failsafe;
  var JSON_SCHEMA = json;
  var CORE_SCHEMA = core;
  var DEFAULT_SCHEMA = _default;
  var load = loader.load;
  var loadAll = loader.loadAll;
  var dump = dumper.dump;
  var YAMLException = exception;
  var types = {
    binary,
    float,
    map: map2,
    null: _null,
    pairs,
    set,
    timestamp,
    bool,
    int,
    merge,
    omap,
    seq,
    str
  };
  var safeLoad = renamed("safeLoad", "load");
  var safeLoadAll = renamed("safeLoadAll", "loadAll");
  var safeDump = renamed("safeDump", "dump");
  var jsYaml = {
    Type,
    Schema,
    FAILSAFE_SCHEMA,
    JSON_SCHEMA,
    CORE_SCHEMA,
    DEFAULT_SCHEMA,
    load,
    loadAll,
    dump,
    YAMLException,
    types,
    safeLoad,
    safeLoadAll,
    safeDump
  };

  // ../core/dist/index.js
  var import_js_beautify = __toESM(require_js(), 1);
  var Oe = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });
  var $e = createToken({ name: "LineComment", pattern: /\/\/[^\n\r]*/, group: Lexer.SKIPPED });
  var Ie = createToken({ name: "BlockComment", pattern: /\/\*[\s\S]*?\*\//, group: Lexer.SKIPPED });
  var d = createToken({ name: "Identifier", pattern: /[a-zA-Z_$][a-zA-Z0-9_.[\]]*/ });
  var M = createToken({ name: "QuotedIdentifier", pattern: /`([^`\\]|\\.)*`/ });
  var x = createToken({ name: "From", pattern: /from/i, longer_alt: d });
  var $ = createToken({ name: "To", pattern: /to/i, longer_alt: d });
  var I = createToken({ name: "Transform", pattern: /transform/i, longer_alt: d });
  var P = createToken({ name: "Set", pattern: /set/i, longer_alt: d });
  var _ = createToken({ name: "Section", pattern: /section/i, longer_alt: d });
  var B = createToken({ name: "Multiple", pattern: /multiple/i, longer_alt: d });
  var q = createToken({ name: "Clone", pattern: /clone/i, longer_alt: d });
  var F = createToken({ name: "Delete", pattern: /delete/i, longer_alt: d });
  var D = createToken({ name: "Define", pattern: /define/i, longer_alt: d });
  var W = createToken({ name: "Modify", pattern: /modify/i, longer_alt: d });
  var U = createToken({ name: "If", pattern: /if/i, longer_alt: d });
  var z = createToken({ name: "Else", pattern: /else/i, longer_alt: d });
  var Q = createToken({ name: "True", pattern: /true/i, longer_alt: d });
  var V = createToken({ name: "False", pattern: /false/i, longer_alt: d });
  var Y = createToken({ name: "Null", pattern: /null/i, longer_alt: d });
  var J = createToken({ name: "Return", pattern: /return/i, longer_alt: d });
  var G = createToken({ name: "Unsafe", pattern: /unsafe/i, longer_alt: d });
  var H = createToken({ name: "Where", pattern: /where/i, longer_alt: d });
  var X = createToken({ name: "EqualsEquals", pattern: /==/ });
  var Z = createToken({ name: "EqualsEqualsEquals", pattern: /===/ });
  var K = createToken({ name: "NotEquals", pattern: /!=/ });
  var ee = createToken({ name: "NotEqualsEquals", pattern: /!==/ });
  var te = createToken({ name: "LessThanOrEqual", pattern: /<=/ });
  var re = createToken({ name: "GreaterThanOrEqual", pattern: />=/ });
  var se = createToken({ name: "LessThan", pattern: /</ });
  var ne = createToken({ name: "GreaterThan", pattern: />/ });
  var ie = createToken({ name: "And", pattern: /&&/ });
  var oe = createToken({ name: "Or", pattern: /\|\|/ });
  var ae = createToken({ name: "Not", pattern: /!/ });
  var w = createToken({ name: "Equals", pattern: /=/ });
  var ue = createToken({ name: "Plus", pattern: /\+/ });
  var C = createToken({ name: "Minus", pattern: /-/ });
  var le = createToken({ name: "Times", pattern: /\*/ });
  var ce = createToken({ name: "Divide", pattern: /\// });
  var pe = createToken({ name: "Modulo", pattern: /%/ });
  var E = createToken({ name: "LParen", pattern: /\(/ });
  var v = createToken({ name: "RParen", pattern: /\)/ });
  var T = createToken({ name: "Comma", pattern: /,/ });
  var me = createToken({ name: "StringLiteral", pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/ });
  var fe = createToken({ name: "NumericLiteral", pattern: /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/ });
  var he = [Oe, $e, Ie, x, $, I, P, _, B, q, F, D, W, U, z, Q, V, Y, J, G, H, Z, X, ee, K, te, re, ie, oe, w, se, ne, ae, ue, C, le, ce, pe, E, v, T, me, fe, M, d];
  var de = new Lexer(he);
  var ge = class extends CstParser {
    constructor() {
      super(he);
      __publicField(this, "query", this.RULE("query", () => {
        this.CONSUME(x), this.SUBRULE(this.typeFormat, { LABEL: "sourceType" }), this.CONSUME($), this.SUBRULE1(this.typeFormat, { LABEL: "targetType" }), this.OPTION(() => {
          this.CONSUME(I), this.OPTION1(() => {
            this.CONSUME(G);
          }), this.MANY(() => {
            this.SUBRULE(this.action);
          });
        });
      }));
      __publicField(this, "typeFormat", this.RULE("typeFormat", () => {
        this.SUBRULE(this.anyIdentifier, { LABEL: "name" }), this.OPTION(() => {
          this.CONSUME(E), this.MANY_SEP({ SEP: T, DEF: () => {
            this.SUBRULE(this.typeFormatParameter, { LABEL: "params" });
          } }), this.CONSUME(v);
        });
      }));
      __publicField(this, "typeFormatParameter", this.RULE("typeFormatParameter", () => {
        this.OR([{ GATE: () => this.LA(2).tokenType === w, ALT: () => this.SUBRULE(this.namedParameter) }, { ALT: () => this.SUBRULE(this.literal) }]);
      }));
      __publicField(this, "namedParameter", this.RULE("namedParameter", () => {
        this.SUBRULE(this.anyIdentifier, { LABEL: "key" }), this.CONSUME(w), this.SUBRULE(this.literal, { LABEL: "value" });
      }));
      __publicField(this, "anyIdentifier", this.RULE("anyIdentifier", () => {
        this.OR([{ ALT: () => this.CONSUME(d) }, { ALT: () => this.CONSUME(M) }]);
      }));
      __publicField(this, "literal", this.RULE("literal", () => {
        this.OR([{ ALT: () => this.CONSUME(me) }, { ALT: () => this.CONSUME(fe) }, { ALT: () => this.CONSUME(Q) }, { ALT: () => this.CONSUME(V) }, { ALT: () => this.CONSUME(Y) }]);
      }));
      __publicField(this, "action", this.RULE("action", () => {
        this.OR([{ ALT: () => this.SUBRULE(this.setRule) }, { ALT: () => this.SUBRULE(this.modifyRule) }, { ALT: () => this.SUBRULE(this.sectionRule) }, { ALT: () => this.SUBRULE(this.cloneRule) }, { ALT: () => this.SUBRULE(this.deleteRule) }, { ALT: () => this.SUBRULE(this.ifAction) }, { ALT: () => this.SUBRULE(this.defineRule) }, { ALT: () => this.SUBRULE(this.returnRule) }]);
      }));
      __publicField(this, "returnRule", this.RULE("returnRule", () => {
        this.CONSUME(J), this.SUBRULE(this.expression, { LABEL: "expr" });
      }));
      __publicField(this, "deleteRule", this.RULE("deleteRule", () => {
        this.CONSUME(F), this.SUBRULE(this.anyIdentifier, { LABEL: "field" });
      }));
      __publicField(this, "ifAction", this.RULE("ifAction", () => {
        this.CONSUME(U), this.CONSUME(E), this.SUBRULE(this.expression, { LABEL: "condition" }), this.CONSUME(v), this.CONSUME2(E), this.MANY(() => {
          this.SUBRULE(this.action, { LABEL: "thenActions" });
        }), this.CONSUME2(v), this.OPTION(() => {
          this.CONSUME(z), this.CONSUME3(E), this.MANY2(() => {
            this.SUBRULE2(this.action, { LABEL: "elseActions" });
          }), this.CONSUME3(v);
        });
      }));
      __publicField(this, "cloneRule", this.RULE("cloneRule", () => {
        this.CONSUME(q), this.OPTION(() => {
          this.CONSUME(E), this.MANY_SEP({ SEP: T, DEF: () => {
            this.SUBRULE(this.anyIdentifier, { LABEL: "fields" });
          } }), this.CONSUME(v);
        });
      }));
      __publicField(this, "setRule", this.RULE("setRule", () => {
        this.CONSUME(P), this.SUBRULE(this.anyIdentifier, { LABEL: "left" }), this.CONSUME(w), this.SUBRULE(this.expression, { LABEL: "right" });
      }));
      __publicField(this, "modifyRule", this.RULE("modifyRule", () => {
        this.CONSUME(W), this.SUBRULE(this.anyIdentifier, { LABEL: "left" }), this.CONSUME(w), this.SUBRULE(this.expression, { LABEL: "right" });
      }));
      __publicField(this, "expression", this.RULE("expression", () => {
        this.SUBRULE(this.logicalOr);
      }));
      __publicField(this, "logicalOr", this.RULE("logicalOr", () => {
        this.SUBRULE(this.logicalAnd, { LABEL: "lhs" }), this.MANY(() => {
          this.CONSUME(oe), this.SUBRULE1(this.logicalAnd, { LABEL: "rhs" });
        });
      }));
      __publicField(this, "logicalAnd", this.RULE("logicalAnd", () => {
        this.SUBRULE(this.comparison, { LABEL: "lhs" }), this.MANY(() => {
          this.CONSUME(ie), this.SUBRULE1(this.comparison, { LABEL: "rhs" });
        });
      }));
      __publicField(this, "comparison", this.RULE("comparison", () => {
        this.SUBRULE(this.addition, { LABEL: "lhs" }), this.OPTION(() => {
          this.OR([{ ALT: () => this.CONSUME(X, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(Z, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(K, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(ee, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(te, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(re, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(se, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(ne, { LABEL: "ops" }) }]), this.SUBRULE1(this.addition, { LABEL: "rhs" });
        });
      }));
      __publicField(this, "addition", this.RULE("addition", () => {
        this.SUBRULE(this.multiplication, { LABEL: "lhs" }), this.MANY(() => {
          this.OR([{ ALT: () => this.CONSUME(ue, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(C, { LABEL: "ops" }) }]), this.SUBRULE1(this.multiplication, { LABEL: "rhs" });
        });
      }));
      __publicField(this, "multiplication", this.RULE("multiplication", () => {
        this.SUBRULE(this.unaryExpression, { LABEL: "lhs" }), this.MANY(() => {
          this.OR([{ ALT: () => this.CONSUME(le, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(ce, { LABEL: "ops" }) }, { ALT: () => this.CONSUME(pe, { LABEL: "ops" }) }]), this.SUBRULE1(this.unaryExpression, { LABEL: "rhs" });
        });
      }));
      __publicField(this, "unaryExpression", this.RULE("unaryExpression", () => {
        this.OPTION(() => {
          this.OR([{ ALT: () => this.CONSUME(C, { LABEL: "sign" }) }, { ALT: () => this.CONSUME(ae, { LABEL: "sign" }) }]);
        }), this.SUBRULE(this.atomic);
      }));
      __publicField(this, "atomic", this.RULE("atomic", () => {
        this.OR([{ ALT: () => this.SUBRULE(this.literal) }, { GATE: () => this.LA(2).tokenType === E, ALT: () => this.SUBRULE(this.functionCall) }, { ALT: () => this.SUBRULE(this.anyIdentifier) }, { ALT: () => {
          this.CONSUME(E), this.SUBRULE(this.expression), this.CONSUME(v);
        } }]);
      }));
      __publicField(this, "functionCall", this.RULE("functionCall", () => {
        this.OR([{ ALT: () => this.CONSUME(d, { LABEL: "name" }) }, { ALT: () => this.CONSUME(U, { LABEL: "name" }) }]), this.CONSUME(E), this.MANY_SEP({ SEP: T, DEF: () => {
          this.SUBRULE(this.expression, { LABEL: "args" });
        } }), this.CONSUME(v);
      }));
      __publicField(this, "sectionRule", this.RULE("sectionRule", () => {
        this.CONSUME(_), this.OPTION(() => {
          this.CONSUME(B);
        }), this.SUBRULE(this.anyIdentifier, { LABEL: "sectionName" }), this.CONSUME(E), this.OPTION1(() => {
          this.CONSUME(x, { LABEL: "subqueryFrom" }), this.SUBRULE(this.typeFormat, { LABEL: "subquerySourceType" }), this.CONSUME($, { LABEL: "subqueryTo" }), this.SUBRULE1(this.typeFormat, { LABEL: "subqueryTargetType" }), this.OPTION2(() => {
            this.CONSUME(I, { LABEL: "subqueryTransform" });
          });
        }), this.MANY(() => {
          this.SUBRULE(this.action);
        }), this.CONSUME(v), this.OPTION3(() => {
          this.CONSUME1(x, { LABEL: "followFrom" }), this.SUBRULE(this.expression, { LABEL: "followExpr" });
        }), this.OPTION4(() => {
          this.CONSUME(H, { LABEL: "whereClause" }), this.SUBRULE1(this.expression, { LABEL: "whereExpr" });
        });
      }));
      __publicField(this, "defineRule", this.RULE("defineRule", () => {
        this.CONSUME(D), this.SUBRULE(this.anyIdentifier, { LABEL: "left" }), this.CONSUME(w), this.SUBRULE(this.expression, { LABEL: "right" });
      }));
      this.performSelfAnalysis();
    }
  };
  var A = new ge();
  var k = { substring: (r, e) => {
    if (r.length < 2) throw new Error("substring() requires at least 2 arguments (string, start, [length])");
    let [t, s, i] = r;
    return i !== void 0 ? `String(${t}).slice(${s}, (${s}) + (${i}))` : `String(${t}).slice(${s})`;
  }, if: (r, e) => {
    if (r.length !== 3) throw new Error("if() requires exactly 3 arguments (condition, trueValue, falseValue)");
    let [t, s, i] = r;
    return `((${t}) ? (${s}) : (${i}))`;
  }, text: (r, e) => {
    if (r.length !== 1) throw new Error("text() requires exactly 1 argument (string or number)");
    let [t] = r;
    return `String(${t})`;
  }, replace: (r, e) => {
    if (r.length !== 3) throw new Error("replace() requires exactly 3 arguments (string, search, replacement)");
    let [t, s, i] = r;
    return `String(${t}).replace(${s}, ${i})`;
  }, number: (r, e) => {
    if (r.length !== 1) throw new Error("number() requires exactly 1 argument (string)");
    let [t] = r;
    return `Number(${t})`;
  }, extractnumber: (r, e) => {
    if (r.length !== 1) throw new Error("extractNumber() requires exactly 1 argument (string)");
    let [t] = r;
    return `(() => { const match = String(${t}).match(/\\d+(\\.\\d+)?/); return match ? Number(match[0]) : null; })()`;
  }, uppercase: (r, e) => {
    if (r.length !== 1) throw new Error("uppercase() requires exactly 1 argument (string)");
    let [t] = r;
    return `String(${t}).toUpperCase()`;
  }, lowercase: (r, e) => {
    if (r.length !== 1) throw new Error("lowercase() requires exactly 1 argument (string)");
    let [t] = r;
    return `String(${t}).toLowerCase()`;
  }, xmlnode: (r, e) => {
    if (r.length < 1) throw new Error("xmlnode() requires at least 1 argument (string)");
    let [t, ...s] = r, i = s.join(", ");
    return `env.functions.xmlnode(${t}${i ? ", " + i : ""})`;
  }, split: (r, e) => {
    if (r.length < 1) throw new Error("split() requires at least 1 argument (string)");
    let [t, s, i] = r, n = s !== void 0 ? s : '""', o = i !== void 0 ? `, ${i}` : "";
    return `String(${t}).split(${n}${o})`;
  }, to_base64: (r, e) => {
    if (r.length !== 1) throw new Error("to_base64() requires exactly 1 argument (string)");
    let [t] = r;
    return `env.functions.to_base64(${t})`;
  }, from_base64: (r, e) => {
    if (r.length !== 1) throw new Error("from_base64() requires exactly 1 argument (string)");
    let [t] = r;
    return `env.functions.from_base64(${t})`;
  }, aslist: (r, e) => {
    if (r.length !== 1) throw new Error("aslist() requires exactly 1 argument");
    let [t] = r;
    return `env.functions.aslist(${t})`;
  }, spreadsheet: (r, e) => {
    if (r.length !== 1) throw new Error("spreadsheet() requires exactly 1 argument");
    let [t] = r;
    return `env.functions.spreadsheet(${t})`;
  }, unpack: (r, e) => {
    if (r.length < 2) throw new Error("unpack() requires at least 2 arguments (string, fieldSpec1, [fieldSpec2, ...])");
    let [t, ...s] = r;
    s.forEach((n) => {
      let o = n.replace(/^["']|["']$/g, ""), a = o.split(":");
      if (a.length < 3) throw new Error(`Invalid field spec for unpack(): ${o}. Expected "name:start:length[:modifier]"`);
      let [u, c, m] = a;
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(u)) throw new Error(`Invalid field name in unpack() spec: "${u}". Must be a valid JavaScript identifier.`);
      let l = parseInt(c, 10), f = parseInt(m, 10);
      if (isNaN(l) || isNaN(f)) throw new Error(`Invalid character positions in unpack() spec: ${o}`);
    });
    let i = s.join(", ");
    return `env.functions.unpack(${t}, ${i})`;
  }, pack: (r, e) => {
    if (r.length < 2) throw new Error("pack() requires at least 2 arguments (object, fieldSpec1, [fieldSpec2, ...])");
    let [t, ...s] = r;
    s.forEach((n) => {
      let o = n.replace(/^["']|["']$/g, ""), a = o.split(":");
      if (a.length < 3) throw new Error(`Invalid field spec for pack(): ${o}. Expected "name:start:length[:modifier]"`);
      let [u, c, m] = a;
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(u)) throw new Error(`Invalid field name in pack() spec: "${u}". Must be a valid JavaScript identifier.`);
      let l = parseInt(c, 10), f = parseInt(m, 10);
      if (isNaN(l) || isNaN(f)) throw new Error(`Invalid character positions in pack() spec: ${o}`);
    });
    let i = s.join(", ");
    return `env.functions.pack(${t}, ${i})`;
  }, concat: (r, e) => `env.functions.concat(${r.join(", ")})`, avg: (r, e) => {
    if (r.length !== 2) throw new Error("avg() requires exactly 2 arguments (array, valueExpression)");
    let [t, s] = r, i = `(item) => { const source = _safeSource(item); return ${s}; }`;
    return `env.functions.avg(${t}, ${i})`;
  }, minof: (r, e) => {
    if (r.length !== 2) throw new Error("minof() requires exactly 2 arguments (array, valueExpression)");
    let [t, s] = r, i = `(item) => { const source = _safeSource(item); return ${s}; }`;
    return `env.functions.minof(${t}, ${i})`;
  }, maxof: (r, e) => {
    if (r.length !== 2) throw new Error("maxof() requires exactly 2 arguments (array, valueExpression)");
    let [t, s] = r, i = `(item) => { const source = _safeSource(item); return ${s}; }`;
    return `env.functions.maxof(${t}, ${i})`;
  }, every: (r, e) => {
    if (r.length !== 2) throw new Error("every() requires exactly 2 arguments (array, conditionExpression)");
    let [t, s] = r, i = `(item) => { const source = _safeSource(item); return ${s}; }`;
    return `env.functions.every(${t}, ${i})`;
  }, some: (r, e) => {
    if (r.length !== 2) throw new Error("some() requires exactly 2 arguments (array, conditionExpression)");
    let [t, s] = r, i = `(item) => { const source = _safeSource(item); return ${s}; }`;
    return `env.functions.some(${t}, ${i})`;
  }, distinct: (r, e) => {
    if (r.length !== 2) throw new Error("distinct() requires exactly 2 arguments (array, valueExpression)");
    let [t, s] = r, i = `(item) => { const source = _safeSource(item); return ${s}; }`;
    return `env.functions.distinct(${t}, ${i})`;
  }, sum: (r, e) => {
    if (r.length !== 2) throw new Error("sum() requires exactly 2 arguments (array, valueExpression)");
    let [t, s] = r, i = `(item) => { const source = _safeSource(item); return ${s}; }`;
    return `env.functions.sum(${t}, ${i})`;
  }, groupby: (r, e) => {
    if (r.length !== 2) throw new Error("groupby() requires exactly 2 arguments (array, keyExpression)");
    let [t, s] = r, i = `(item) => { const source = _safeSource(item); return ${s}; }`;
    return `env.functions.groupby(${t}, ${i})`;
  }, transpose: (r, e) => {
    if (r.length < 2) throw new Error("transpose() requires at least 2 arguments (source, key1, [key2, ...])");
    return `env.functions.transpose(${r.join(", ")})`;
  }, list: (r, e) => `[${r.join(", ")}]`, array: (r, e) => `[${r.join(", ")}]`, extract: (r, e) => {
    if (r.length < 2) throw new Error("extract() requires at least 2 arguments (source, key1, [key2, ...])");
    let [t, ...s] = r;
    return `env.functions.extract(${t}, ${e.safeMode}, ${s.join(", ")})`;
  }, floor: (r, e) => {
    if (r.length !== 1) throw new Error("floor() requires exactly 1 argument");
    return `Math.floor(${r[0]})`;
  }, ceil: (r, e) => {
    if (r.length !== 1) throw new Error("ceil() requires exactly 1 argument");
    return `Math.ceil(${r[0]})`;
  }, round: (r, e) => {
    if (r.length < 1 || r.length > 2) throw new Error("round() requires 1 or 2 arguments (value, [mode])");
    return `env.functions.round(${r.join(", ")})`;
  }, abs: (r, e) => {
    if (r.length !== 1) throw new Error("abs() requires exactly 1 argument");
    return `Math.abs(${r[0]})`;
  }, fixed: (r, e) => {
    if (r.length < 1 || r.length > 3) throw new Error("fixed() requires 1 to 3 arguments (value, [decimals], [mode])");
    return `env.functions.fixed(${r.join(", ")})`;
  }, min: (r, e) => {
    if (r.length < 2) throw new Error("min() requires at least 2 arguments");
    return `Math.min(${r.join(", ")})`;
  }, max: (r, e) => {
    if (r.length < 2) throw new Error("max() requires at least 2 arguments");
    return `Math.max(${r.join(", ")})`;
  }, trim: (r, e) => {
    if (r.length !== 1) throw new Error("trim() requires exactly 1 argument");
    return `String(${r[0]}).trim()`;
  }, padstart: (r, e) => {
    if (r.length < 2) throw new Error("padstart() requires at least 2 arguments (str, length, [char])");
    let [t, s, i] = r;
    return i !== void 0 ? `String(${t}).padStart(${s}, ${i})` : `String(${t}).padStart(${s})`;
  }, padend: (r, e) => {
    if (r.length < 2) throw new Error("padend() requires at least 2 arguments (str, length, [char])");
    let [t, s, i] = r;
    return i !== void 0 ? `String(${t}).padEnd(${s}, ${i})` : `String(${t}).padEnd(${s})`;
  }, indexof: (r, e) => {
    if (r.length !== 2) throw new Error("indexof() requires exactly 2 arguments (str, search)");
    return `String(${r[0]}).indexOf(${r[1]})`;
  }, startswith: (r, e) => {
    if (r.length !== 2) throw new Error("startswith() requires exactly 2 arguments (str, prefix)");
    return `String(${r[0]}).startsWith(${r[1]})`;
  }, endswith: (r, e) => {
    if (r.length !== 2) throw new Error("endswith() requires exactly 2 arguments (str, suffix)");
    return `String(${r[0]}).endsWith(${r[1]})`;
  }, fromunix: (r, e) => {
    if (r.length !== 1) throw new Error("fromUnix() requires exactly 1 argument (unix timestamp string)");
    return `env.functions.fromunix(${r[0]})`;
  }, tounix: (r, e) => {
    if (r.length !== 1) throw new Error("toUnix() requires exactly 1 argument (ISO 8601 string)");
    return `env.functions.tounix(${r[0]})`;
  }, lookup: (r, e) => {
    if (r.length < 2) throw new Error('lookup() requires at least 2 arguments (value, "key1:val1", "key2:val2", ...)');
    let [t, ...s] = r;
    return `(({${s.map((n) => {
      let o = n.replace(/^["']|["']$/g, ""), a = o.indexOf(":");
      if (a === -1) throw new Error(`Invalid lookup() spec: ${n}. Expected "key:value" format (e.g. "1:open").`);
      let u = JSON.stringify(o.substring(0, a)), c = JSON.stringify(o.substring(a + 1));
      return `${u}: ${c}`;
    }).join(", ")}})[(${t})] ?? null)`;
  } };
  var N = class {
    constructor() {
      __publicField(this, "sourceRoot", { type: "object", properties: {} });
      __publicField(this, "targetRoot", { type: "object", properties: {} });
      __publicField(this, "sourceStack", [this.sourceRoot]);
      __publicField(this, "targetStack", [this.targetRoot]);
    }
    getCurrentSource() {
      return this.sourceStack[this.sourceStack.length - 1];
    }
    getCurrentTarget() {
      return this.targetStack[this.targetStack.length - 1];
    }
    recordAccess(e, t = "any", s = false) {
      let i = s ? this.getCurrentTarget() : this.getCurrentSource();
      this.setInNode(i, e, t);
    }
    recordAssignment(e, t = "any") {
      this.setInNode(this.getCurrentTarget(), e, t);
    }
    recordClone(e) {
      let t = this.getCurrentTarget();
      e ? e.forEach((s) => {
        this.setInNode(this.getCurrentSource(), s, "any"), this.setInNode(t, s, "any");
      }) : t.isOpen = true;
    }
    recordDelete(e) {
      let t = this.getCurrentTarget();
      this.deleteInNode(t, e);
    }
    pushSection(e, t, s) {
      t !== "parent" && this.setInNode(this.getCurrentSource(), t, s ? "array" : "object");
      let i = { type: s ? "array" : "object" };
      s ? i.items = { type: "object", properties: {} } : i.properties = {};
      let n = { type: "object", properties: {} };
      this.setInNodeExplicit(this.getCurrentTarget(), e, i), this.targetStack.push(s ? i.items : i), this.sourceStack.push(n);
    }
    popSection(e, t) {
      let s = this.sourceStack.pop();
      this.targetStack.pop();
      let i = this.getCurrentSource();
      if (e !== "parent") {
        let n = this.getOrSetNode(i, e, t ? "array" : "object"), o = t ? n.items : n;
        o && (o.properties || (o.properties = {}), Object.assign(o.properties, s.properties || {}));
      } else i.properties || (i.properties = {}), Object.assign(i.properties, s.properties || {});
    }
    parsePath(e) {
      if (!e) return [];
      let t = [], s = e.split(".");
      for (let i of s) {
        let n = i.match(/^([^[\]]*)((?:\[\d+\])*)$/);
        if (n) {
          n[1] && t.push(n[1]);
          let o = n[2].match(/\[\d+\]/g);
          if (o) for (let a of o) t.push("[]");
        } else t.push(i);
      }
      return t;
    }
    setInNode(e, t, s) {
      let i = this.parsePath(t), n = e;
      for (let o = 0; o < i.length; o++) {
        let a = i[o], u = o === i.length - 1;
        if (a === "[]") {
          n.type = "array", n.items || (n.items = { type: u ? s : "object", properties: {} }), n = n.items;
          continue;
        }
        n.properties || (n.properties = {}), u ? (!n.properties[a] || n.properties[a].type === "any") && (n.properties[a] = { type: s }, s === "object" ? n.properties[a].properties = {} : s === "array" && (n.properties[a].items = { type: "object", properties: {} })) : (n.properties[a] || (n.properties[a] = { type: "object", properties: {} }), n = n.properties[a]);
      }
    }
    setInNodeExplicit(e, t, s) {
      let i = this.parsePath(t), n = e;
      for (let o = 0; o < i.length; o++) {
        let a = i[o], u = o === i.length - 1;
        if (a === "[]") {
          n.type = "array", n.items || (n.items = { type: u ? s.type : "object", properties: {} }), u ? n.items = s : n = n.items;
          continue;
        }
        n.properties || (n.properties = {}), u ? n.properties[a] = s : (n.properties[a] || (n.properties[a] = { type: "object", properties: {} }), n = n.properties[a]);
      }
    }
    deleteInNode(e, t) {
      let s = this.parsePath(t), i = e;
      for (let n = 0; n < s.length; n++) {
        let o = s[n], a = n === s.length - 1;
        if (o === "[]") {
          if (!i.items) return;
          a ? (delete i.items, i.type = "any") : i = i.items;
          continue;
        }
        if (!i.properties) return;
        if (a) delete i.properties[o];
        else if (i = i.properties[o], !i) return;
      }
    }
    getOrSetNode(e, t, s) {
      let i = this.parsePath(t), n = e;
      for (let o = 0; o < i.length; o++) {
        let a = i[o], u = o === i.length - 1;
        if (a === "[]") {
          if (n.type = "array", !n.items) {
            let m = u ? s : "object";
            n.items = { type: m }, m === "object" ? n.items.properties = {} : m === "array" && (n.items.items = { type: "object", properties: {} });
          }
          n = n.items;
          continue;
        }
        let c = u ? s : "object";
        n.properties || (n.properties = {}), n.properties[a] || (n.properties[a] = { type: c }, c === "object" ? n.properties[a].properties = {} : c === "array" && (n.properties[a].items = { type: "object", properties: {} })), n = n.properties[a];
      }
      return n;
    }
    getResult() {
      return { source: this.sourceRoot, target: this.targetRoot };
    }
  };
  var ke = A.getBaseCstVisitorConstructor();
  var ye = class extends ke {
    constructor() {
      super();
      __publicField(this, "readFrom", "source");
      __publicField(this, "scopeStack", []);
      __publicField(this, "safeMode", true);
      __publicField(this, "isAnalyzing", false);
      __publicField(this, "tracker", new N());
      __publicField(this, "lastInferredType", "any");
      this.validateVisitor();
    }
    reset() {
      this.readFrom = "source", this.scopeStack = [], this.tracker = new N(), this.lastInferredType = "any";
    }
    visitWithContext(e, t) {
      let s = this.readFrom;
      this.readFrom = t.readFrom;
      try {
        return this.visit(e);
      } finally {
        this.readFrom = s;
      }
    }
    query(e) {
      this.reset(), this.isAnalyzing && (this.tracker = new N());
      let t = this.visit(e.sourceType), s = this.visit(e.targetType), i = !!e.Unsafe;
      this.safeMode = !i, this.scopeStack.push({ format: s.name, options: s.options, isSerializationScope: true });
      try {
        let n = e.action ? e.action.map((f) => this.visit(f)) : [];
        e.Transform || n.push("Object.assign(target, source);");
        let o = t.name, a = s.name, u = JSON.stringify(t.options), c = JSON.stringify(s.options), m = n.some((f) => typeof f == "string" && f.trim().startsWith("return "));
        return { code: `
      return function(input, env) {
        // 1. Parse Input
        const _safeSource = (v) => (typeof v === 'object' && v !== null) ? (Array.isArray(v) ? [...v] : { ...v }) : (v || {});
        const _parsedSource = env.parse('${o}', input, ${u});
        const source = _safeSource(_parsedSource);
        const _rootSource = source;
        
        // 2. Transform
        const target = {};
        const _rootTarget = target;
        ${n.join(`
        `)}

        // 3. Serialize Output
        ${m ? "" : `return env.serialize('${a}', target, ${c});`}
      }
    `, sourceType: t, targetType: s, analysis: this.isAnalyzing ? this.tracker.getResult() : void 0 };
      } finally {
        this.scopeStack.pop();
      }
    }
    typeFormat(e) {
      let t = this.visit(e.name), s = { params: [] };
      return e.params && e.params.forEach((i) => {
        let n = this.visit(i);
        typeof n == "object" && "key" in n ? s[n.key] = this.parseLiteral(n.value) : s.params.push(this.parseLiteral(n));
      }), { name: t.name, options: s };
    }
    typeFormatParameter(e) {
      if (e.namedParameter) return this.visit(e.namedParameter);
      if (e.literal) return this.visit(e.literal);
    }
    namedParameter(e) {
      let t = this.visit(e.key).name, s = this.visit(e.value);
      return { key: t, value: s };
    }
    parseLiteral(e) {
      if (e === "true") return true;
      if (e === "false") return false;
      if (e === "null") return null;
      if (e.startsWith('"') && e.endsWith('"') || e.startsWith("'") && e.endsWith("'")) return e.slice(1, -1);
      let t = Number(e);
      return isNaN(t) ? e : t;
    }
    isSimplePath(e) {
      return e ? !/[()+*/-]/.test(e) && !e.includes(" ") : false;
    }
    safify(e) {
      return this.safeMode ? e.replace(/\.(?!\?)/g, "?.").replace(/\[/g, "?.[") : e;
    }
    genAccess(e, t, s = false) {
      if (!this.safeMode || s) return t.quoted || t.name.includes("-") && !t.name.includes(".") && !t.name.includes("[") ? `${e}["${t.name}"]` : `${e}.${t.name}`;
      if (t.quoted) return `${e}?.[${JSON.stringify(t.name)}]`;
      let i = this.safify(t.name);
      return `${e}?.${i}`;
    }
    anyIdentifier(e) {
      if (e.Identifier) return { name: e.Identifier[0].image, quoted: false };
      if (e.QuotedIdentifier) return { name: e.QuotedIdentifier[0].image.slice(1, -1).replace(/\\(.)/g, "$1"), quoted: true };
    }
    literal(e) {
      if (e.StringLiteral) return this.lastInferredType = "string", e.StringLiteral[0].image;
      if (e.NumericLiteral) return this.lastInferredType = "number", e.NumericLiteral[0].image;
      if (e.True) return this.lastInferredType = "boolean", "true";
      if (e.False) return this.lastInferredType = "boolean", "false";
      if (e.Null) return this.lastInferredType = "null", "null";
    }
    action(e) {
      if (e.setRule) return this.visit(e.setRule);
      if (e.modifyRule) return this.visit(e.modifyRule);
      if (e.sectionRule) return this.visit(e.sectionRule);
      if (e.cloneRule) return this.visit(e.cloneRule);
      if (e.ifAction) return this.visit(e.ifAction);
      if (e.deleteRule) return this.visit(e.deleteRule);
      if (e.defineRule) return this.visit(e.defineRule);
      if (e.returnRule) return this.visit(e.returnRule);
    }
    deleteRule(e) {
      let t = this.visit(e.field);
      return this.isAnalyzing && this.tracker.recordDelete(t.name), `delete ${this.genAccess("target", t, true)};`;
    }
    ifAction(e) {
      let t = this.visit(e.condition), s = e.thenActions ? e.thenActions.map((n) => this.visit(n)).join(`
`) : "", i = e.elseActions ? `else { ${e.elseActions.map((n) => this.visit(n)).join(`
`)} }` : "";
      return `if (${t}) {
       ${s}
     } ${i}`;
    }
    cloneRule(e) {
      if (e.fields) {
        let t = e.fields.map((s) => this.visit(s));
        return this.isAnalyzing && this.tracker.recordClone(t.map((s) => s.name)), t.map((s) => `${this.genAccess("target", s, true)} = ${this.genAccess("source", s)};`).join(`
        `);
      }
      return this.isAnalyzing && this.tracker.recordClone(), "Object.assign(target, source);";
    }
    setRule(e) {
      let t = this.visit(e.left);
      this.lastInferredType = "any";
      let s = this.visit(e.right);
      return this.isAnalyzing && this.tracker.recordAssignment(t.name, this.lastInferredType), `${this.genAccess("target", t, true)} = ${s};`;
    }
    modifyRule(e) {
      let t = this.visit(e.left);
      this.lastInferredType = "any";
      let s = this.visitWithContext(e.right, { readFrom: "target" });
      return this.isAnalyzing && this.tracker.recordAssignment(t.name, this.lastInferredType), `${this.genAccess("target", t, true)} = ${s};`;
    }
    defineRule(e) {
      let t = this.visit(e.left);
      this.lastInferredType = "any";
      let s = this.visit(e.right);
      return this.isAnalyzing && this.tracker.recordAssignment(t.name, this.lastInferredType), `${this.genAccess("source", t, true)} = ${s};`;
    }
    returnRule(e) {
      let t = this.visitWithContext(e.expr, { readFrom: "target" }), s = this.scopeStack[this.scopeStack.length - 1];
      if (s && s.isSerializationScope) {
        let i = JSON.stringify(s.options);
        return `return env.serialize('${s.format}', ${t}, ${i});`;
      }
      return `return ${t};`;
    }
    expression(e) {
      return this.visit(e.logicalOr);
    }
    logicalOr(e) {
      let t = this.visit(e.lhs);
      if (e.rhs && e.rhs.length > 0) {
        this.lastInferredType = "boolean";
        for (let s = 0; s < e.rhs.length; s++) {
          let i = this.visit(e.rhs[s]);
          t = `${t} || ${i}`;
        }
      }
      return t;
    }
    logicalAnd(e) {
      let t = this.visit(e.lhs);
      if (e.rhs && e.rhs.length > 0) {
        this.lastInferredType = "boolean";
        for (let s = 0; s < e.rhs.length; s++) {
          let i = this.visit(e.rhs[s]);
          t = `${t} && ${i}`;
        }
      }
      return t;
    }
    comparison(e) {
      let t = this.visit(e.lhs);
      if (e.rhs) {
        this.lastInferredType = "boolean";
        let s = e.ops[0].image, i = this.visit(e.rhs[0]);
        t = `${t} ${s} ${i}`;
      }
      return t;
    }
    addition(e) {
      let t = this.visit(e.lhs), s = this.lastInferredType, i = t;
      if (e.rhs && e.rhs.length > 0) {
        let n = s === "string", o = s === "number";
        for (let a = 0; a < e.rhs.length; a++) {
          let u = e.ops[a].image, c = this.visit(e.rhs[a]);
          this.lastInferredType === "string" && (n = true), this.lastInferredType !== "number" && (o = false), i = `${i} ${u} ${c}`;
        }
        n ? this.lastInferredType = "string" : o ? this.lastInferredType = "number" : this.lastInferredType = "any";
      } else this.lastInferredType = s;
      return i;
    }
    multiplication(e) {
      let t = this.visit(e.lhs);
      if (e.rhs && e.rhs.length > 0) {
        this.lastInferredType = "number";
        for (let s = 0; s < e.rhs.length; s++) {
          let i = e.ops[s].image, n = this.visit(e.rhs[s]);
          t = `${t} ${i} ${n}`;
        }
      }
      return t;
    }
    unaryExpression(e) {
      let t = this.visit(e.atomic);
      if (e.sign) {
        let s = e.sign[0].image;
        return s === "!" && (this.lastInferredType = "boolean"), s === "-" && (this.lastInferredType = "number"), `${s}${t}`;
      }
      return t;
    }
    atomic(e) {
      if (e.literal) return this.visit(e.literal);
      if (e.functionCall) return this.visit(e.functionCall);
      if (e.anyIdentifier) {
        this.lastInferredType = "any";
        let t = this.visit(e.anyIdentifier);
        if (["true", "false", "null"].includes(t.name) && !t.quoted) return t.name;
        if (t.name === "_key" && !t.quoted) return "_key";
        if (!t.quoted) {
          if (t.name.startsWith("source.") || t.name.startsWith("source[")) {
            let s = t.name.startsWith("source.") ? t.name.substring(7) : t.name.substring(6);
            return this.isAnalyzing && s && this.tracker.recordAccess(s, "any", false), this.safeMode ? this.safify(t.name) : t.name;
          }
          if (t.name.startsWith("target.") || t.name.startsWith("target[")) {
            let s = t.name.startsWith("target.") ? t.name.substring(7) : t.name.substring(6);
            return this.isAnalyzing && s && this.tracker.recordAccess(s, "any", true), this.safeMode ? this.safify(t.name) : t.name;
          }
          if (t.name === "target") return "target";
          if (t.name === "source") return "source";
          if (t.name === "_source" || t.name.startsWith("_source.") || t.name.startsWith("_source[")) {
            let s = t.name.substring(7);
            if (this.isAnalyzing) {
              let n = s.startsWith(".") ? s.substring(1) : s;
              n && this.tracker.recordAccess(n, "any", false);
            }
            return `_rootSource${this.safeMode ? this.safify(s) : s}`;
          }
          if (t.name === "_target" || t.name.startsWith("_target.") || t.name.startsWith("_target[")) {
            let s = t.name.substring(7);
            if (this.isAnalyzing) {
              let n = s.startsWith(".") ? s.substring(1) : s;
              n && this.tracker.recordAccess(n, "any", true);
            }
            return `_rootTarget${this.safeMode ? this.safify(s) : s}`;
          }
        }
        return this.isAnalyzing && this.tracker.recordAccess(t.name, "any", this.readFrom === "target"), this.genAccess(this.readFrom, t);
      }
      if (e.expression) return `(${this.visit(e.expression)})`;
    }
    functionCall(e) {
      let t = e.name[0].image, s = (t.startsWith("`") ? t.slice(1, -1) : t).toLowerCase(), i = e.args ? e.args.map((o) => this.visit(o)) : [], n = k[s];
      if (n) return ["substring", "text", "replace", "uppercase", "lowercase", "to_base64", "from_base64", "trim", "padstart", "padend", "fixed"].includes(s) ? this.lastInferredType = "string" : ["number", "extractnumber", "floor", "ceil", "round", "abs", "min", "max", "indexof"].includes(s) ? this.lastInferredType = "number" : ["startswith", "endswith"].includes(s) ? this.lastInferredType = "boolean" : ["aslist", "transpose", "list", "array"].includes(s) ? this.lastInferredType = "array" : s === "asobject" && (this.lastInferredType = "object"), n(i, this);
      throw new Error(`Unknown function: ${t}`);
    }
    sectionRule(e) {
      let t = this.visit(e.sectionName), s = t.name, i = this.genAccess("target", t, true), n, o;
      if (e.followExpr) {
        let l = this.visit(e.followExpr), f = l.replace(/\?\./g, ".");
        f === "source.parent" || f === "this.source.parent" || f === `${this.readFrom.replace(/\?\./g, ".")}.parent` ? (n = "source", o = "parent") : (n = l, o = n);
      } else n = this.genAccess("source", t), o = t.name;
      let a = !!e.Multiple, u = !!e.whereExpr, c = "";
      if (u && (c = this.visit(e.whereExpr)), !!e.subqueryFrom) {
        let l = this.visit(e.subquerySourceType), f = this.visit(e.subqueryTargetType);
        this.scopeStack.push({ format: f.name, options: f.options, isSerializationScope: true });
        try {
          let h = !!e.subqueryTransform, g = e.action ? e.action.map((j) => this.visit(j)) : [];
          h || g.push("Object.assign(target, source);");
          let S = JSON.stringify(l.options), b = JSON.stringify(f.options), y = n.includes("(") || n.includes("[") || n.includes(" ") ? "_sectionSource" : n, R = y === "_sectionSource" ? `const _sectionSource = ${n};
` : "";
          if (a) {
            let j = u ? `.filter((item, index) => { const source = item; const _key = index; return ${c}; })` : "";
            return `
        {
          ${R}if (${y} && Array.isArray(${y})) {
            ${i} = ${y}${j}.map((item, index) => {
              const subSource = env.parse('${l.name}', item, ${S});
              const source = _safeSource(subSource);
              const _key = index;
              const target = {};
              ${g.join(`
              `)}
              return env.serialize('${f.name}', target, ${b});
            });
          }
        }
        `;
          } else return u ? `
        {
          ${R}if (${y} && Array.isArray(${y})) {
            const _filtered = ${y}.find((item, index) => { const source = item; const _key = index; return ${c}; });
            if (_filtered) {
              ${i} = (function(innerSource, innerIndex) {
                const subSource = env.parse('${l.name}', innerSource, ${S});
                const source = _safeSource(subSource);
                const _key = innerIndex;
                const target = {};
                ${g.join(`
                `)}
                return env.serialize('${f.name}', target, ${b});
              })(_filtered, ${y}.indexOf(_filtered));
            }
          }
        }
        ` : `
        {
          ${R}if (${y}) {
            ${i} = (function(innerSource) {
              const subSource = env.parse('${l.name}', innerSource, ${S});
              const source = _safeSource(subSource);
              const _key = 0; // Single section without where, index is effectively 0 if we consider it an "iteration"
              const target = {};
              ${g.join(`
              `)}
              return env.serialize('${f.name}', target, ${b});
            })(${y});
          }
        }
        `;
        } finally {
          this.scopeStack.pop();
        }
      }
      this.scopeStack.push({ format: "object", options: {}, isSerializationScope: false });
      try {
        let l = o;
        l !== "parent" && (l = l.replace(/^source\??\./, "").replace(/^this\.source\??\./, "").replace(/\?\./g, ".")), this.isAnalyzing && (l === "parent" || this.isSimplePath(l) ? this.tracker.pushSection(s, l, a) : this.tracker.pushSection(s, "parent", a));
        try {
          let f = e.action ? e.action.map((S) => this.visit(S)) : [], h = n.includes("(") || n.includes("[") || n.includes(" ") ? "_sectionSource" : n, g = h === "_sectionSource" ? `const _sectionSource = ${n};
` : "";
          if (a) {
            let S = u ? `.filter((item, index) => { const source = _safeSource(item); const _key = index; return ${c}; })` : "";
            return `
      {
        ${g}if (${h} && Array.isArray(${h})) {
          ${i} = ${h}${S}.map((item, index) => {
            const source = _safeSource(item);
            const _key = index;
            const target = {};
            ${f.join(`
            `)}
            return target;
          });
        }
      }
      `;
          } else return u ? `
      {
        ${g}if (${h} && Array.isArray(${h})) {
          const _filtered = ${h}.find((item, index) => { const source = _safeSource(item); const _key = index; return ${c}; });
          if (_filtered) {
            ${i} = (function(innerSource, innerIndex) {
              const source = _safeSource(innerSource);
              const _key = innerIndex;
              const target = {};
              ${f.join(`
              `)}
              return target;
            })(_filtered, ${h}.indexOf(_filtered));
          }
        }
      }
      ` : `
      {
        ${g}if (${h}) {
          ${i} = (function(innerSource) {
            const source = _safeSource(innerSource);
            const _key = 0;
            const target = {};
            ${f.join(`
            `)}
            return target;
          })(${h});
        }
      }
      `;
        } finally {
          if (this.isAnalyzing) {
            let f = l === "parent" || this.isSimplePath(l) ? l : "parent";
            this.tracker.popSection(f, a);
          }
        }
      } finally {
        this.scopeStack.pop();
      }
    }
  };
  var Se = new ye();
  var je = A.getBaseCstVisitorConstructor();
  var Ae = class extends je {
    constructor() {
      super(), this.validateVisitor();
    }
    query(e) {
      let t = this.visit(e.sourceType), s = this.visit(e.targetType), i = !!e.Unsafe, n = e.action ? e.action.map((a) => this.visit(a)) : [], o = { from: t, to: s, actions: n };
      return i && (o.unsafe = true), o;
    }
    typeFormat(e) {
      return this.visit(e.name).name;
    }
    typeFormatParameter(e) {
    }
    namedParameter(e) {
    }
    anyIdentifier(e) {
      if (e.Identifier) {
        let i = e.Identifier[0].image;
        return { name: i, quoted: false, raw: i };
      }
      let t = e.QuotedIdentifier[0].image;
      return { name: t.slice(1, -1).replace(/\\(.)/g, "$1"), quoted: true, raw: t };
    }
    literal(e) {
      return e.StringLiteral ? e.StringLiteral[0].image : e.NumericLiteral ? e.NumericLiteral[0].image : e.True ? "true" : e.False ? "false" : e.Null ? "null" : "";
    }
    action(e) {
      if (e.setRule) return this.visit(e.setRule);
      if (e.modifyRule) return this.visit(e.modifyRule);
      if (e.sectionRule) return this.visit(e.sectionRule);
      if (e.cloneRule) return this.visit(e.cloneRule);
      if (e.ifAction) return this.visit(e.ifAction);
      if (e.deleteRule) return this.visit(e.deleteRule);
      if (e.defineRule) return this.visit(e.defineRule);
      if (e.returnRule) return this.visit(e.returnRule);
      throw new Error("Unknown action type in CST");
    }
    setRule(e) {
      let t = this.visit(e.left), s = this.visit(e.right);
      return { type: "set", target: t.name, expression: s };
    }
    modifyRule(e) {
      let t = this.visit(e.left), s = this.visit(e.right);
      return { type: "modify", target: t.name, expression: s };
    }
    deleteRule(e) {
      return { type: "delete", field: this.visit(e.field).name };
    }
    defineRule(e) {
      let t = this.visit(e.left), s = this.visit(e.right);
      return { type: "define", variable: t.name, expression: s };
    }
    cloneRule(e) {
      return e.fields && e.fields.length > 0 ? { type: "clone", fields: e.fields.map((s) => this.visit(s).name) } : { type: "clone" };
    }
    returnRule(e) {
      return { type: "return", expression: this.visit(e.expr) };
    }
    ifAction(e) {
      let t = this.visit(e.condition), s = e.thenActions ? e.thenActions.map((o) => this.visit(o)) : [], i = e.elseActions && e.elseActions.length > 0 ? e.elseActions.map((o) => this.visit(o)) : void 0, n = { type: "if", condition: t, thenActions: s };
      return i !== void 0 && (n.elseActions = i), n;
    }
    sectionRule(e) {
      let s = this.visit(e.sectionName).name, i = !!e.Multiple, n = !!e.subqueryFrom, o = e.action ? e.action.map((m) => this.visit(m)) : [], a = e.followExpr ? this.visit(e.followExpr) : void 0, u = e.whereExpr ? this.visit(e.whereExpr) : void 0, c = { type: "section", name: s, actions: o };
      return i && (c.multiple = true), a !== void 0 && (c.from = a), u !== void 0 && (c.where = u), n && (c.isSubquery = true, c.sourceFormat = this.visit(e.subquerySourceType), c.targetFormat = this.visit(e.subqueryTargetType)), c;
    }
    expression(e) {
      return this.visit(e.logicalOr);
    }
    logicalOr(e) {
      let t = this.visit(e.lhs);
      if (e.rhs && e.rhs.length > 0) for (let s = 0; s < e.rhs.length; s++) t += ` || ${this.visit(e.rhs[s])}`;
      return t;
    }
    logicalAnd(e) {
      let t = this.visit(e.lhs);
      if (e.rhs && e.rhs.length > 0) for (let s = 0; s < e.rhs.length; s++) t += ` && ${this.visit(e.rhs[s])}`;
      return t;
    }
    comparison(e) {
      let t = this.visit(e.lhs);
      if (e.rhs && e.rhs.length > 0) {
        let s = e.ops[0].image;
        t += ` ${s} ${this.visit(e.rhs[0])}`;
      }
      return t;
    }
    addition(e) {
      let t = this.visit(e.lhs);
      if (e.rhs && e.rhs.length > 0) for (let s = 0; s < e.rhs.length; s++) {
        let i = e.ops[s].image;
        t += ` ${i} ${this.visit(e.rhs[s])}`;
      }
      return t;
    }
    multiplication(e) {
      let t = this.visit(e.lhs);
      if (e.rhs && e.rhs.length > 0) for (let s = 0; s < e.rhs.length; s++) {
        let i = e.ops[s].image;
        t += ` ${i} ${this.visit(e.rhs[s])}`;
      }
      return t;
    }
    unaryExpression(e) {
      let t = this.visit(e.atomic);
      return e.sign && e.sign.length > 0 ? `${e.sign[0].image}${t}` : t;
    }
    atomic(e) {
      return e.literal ? this.visit(e.literal) : e.functionCall ? this.visit(e.functionCall) : e.anyIdentifier ? this.visit(e.anyIdentifier).raw : e.expression ? `(${this.visit(e.expression)})` : "";
    }
    functionCall(e) {
      let t = e.name[0].image, s = e.args ? e.args.map((i) => this.visit(i)) : [];
      return `${t}(${s.join(", ")})`;
    }
  };
  var we = new Ae();
  var Ee = {};
  function L(r, e) {
    Ee[r.toLowerCase()] = e;
  }
  function be(r) {
    let e = Ee[r.toLowerCase()];
    if (!e) throw new Error(`No adapter found for format: ${r}`);
    return e;
  }
  function _e(r) {
    let e = "";
    for (; r >= 0; ) e = String.fromCharCode(r % 26 + 65) + e, r = Math.floor(r / 26) - 1;
    return e;
  }
  L("json", { parse: (r) => typeof r != "string" ? r : JSON.parse(r), serialize: (r) => JSON.stringify(r, null, 2) });
  var Be = new json2xml_default({ ignoreAttributes: false, attributeNamePrefix: "$", textNodeName: "_", format: true });
  L("xml", { parse: (r, e) => typeof r != "string" ? r : new XMLParser(__spreadValues({ ignoreAttributes: false, removeNSPrefix: true }, e)).parse(r), serialize: (r, e) => {
    var _a, _b, _c;
    let t = (_c = (_b = e == null ? void 0 : e.rootGenerated) != null ? _b : (_a = e == null ? void 0 : e.params) == null ? void 0 : _a[0]) != null ? _c : "root";
    return (e ? new json2xml_default(__spreadValues({ ignoreAttributes: false, attributeNamePrefix: "$", textNodeName: "_", format: true }, e)) : Be).build({ [t]: r });
  } });
  L("csv", { parse: (r, e) => {
    var _a, _b, _c;
    if (typeof r != "string") return r;
    let t = (_c = (_b = e == null ? void 0 : e.delimiter) != null ? _b : (_a = e == null ? void 0 : e.params) == null ? void 0 : _a[0]) != null ? _c : ",";
    return { rows: import_papaparse.default.parse(r, __spreadValues({ delimiter: t, skipEmptyLines: true }, e)).data.map((n) => {
      let o = {};
      return Array.isArray(n) && n.forEach((a, u) => {
        o[_e(u)] = a;
      }), o;
    }) };
  }, serialize: (r, e) => {
    var _a, _b, _c;
    if (!r || !Array.isArray(r.rows)) return "";
    let t = (_c = (_b = e == null ? void 0 : e.delimiter) != null ? _b : (_a = e == null ? void 0 : e.params) == null ? void 0 : _a[0]) != null ? _c : ",", s = r.rows.map((i) => Object.keys(i).filter((o) => /^[A-Z]+$/.test(o)).sort((o, a) => o.length !== a.length ? o.length - a.length : o.localeCompare(a)).map((o) => i[o]));
    return import_papaparse.default.unparse(s, __spreadValues({ delimiter: t }, e));
  } });
  L("edifact", { parse: (r, e) => {
    if (typeof r != "string") return r;
    let t = "'", s = "+", i = ":", n = "?", o = r.trim();
    if (o.startsWith("UNA")) {
      let l = o.substring(3, 9);
      i = l[0], s = l[1], n = l[3], t = l[5], o = o.substring(9).trim();
    }
    e && (e.segmentTerminator && (t = e.segmentTerminator), e.elementSeparator && (s = e.elementSeparator), e.componentSeparator && (i = e.componentSeparator), e.releaseChar && (n = e.releaseChar));
    let a = {}, u = (l, f, h) => {
      let g = [], S = "";
      for (let b = 0; b < l.length; b++) {
        let y = l[b];
        y === h && b + 1 < l.length ? S += h + l[++b] : y === f ? (g.push(S), S = "") : S += y;
      }
      return g.push(S), g;
    }, c = (l, f) => {
      let h = "";
      for (let g = 0; g < l.length; g++) l[g] === f && g + 1 < l.length ? h += l[++g] : h += l[g];
      return h;
    }, m = u(o, t, n).map((l) => l.trim()).filter((l) => l.length > 0);
    for (let l of m) {
      let f = u(l, s, n), h = c(f[0], n), g = f.slice(1).map((S) => {
        let y = u(S, i, n).map((R) => c(R, n));
        return y.length > 1 ? y : y[0];
      });
      a[h] || (a[h] = []), a[h].push(g);
    }
    return a;
  }, serialize: (r, e) => {
    var _a, _b, _c, _d;
    if (!r || typeof r != "object") return "";
    let t = (_a = e == null ? void 0 : e.segmentTerminator) != null ? _a : "'", s = (_b = e == null ? void 0 : e.elementSeparator) != null ? _b : "+", i = (_c = e == null ? void 0 : e.componentSeparator) != null ? _c : ":", n = (_d = e == null ? void 0 : e.releaseChar) != null ? _d : "?", o = (u) => {
      if (u == null) return "";
      let c = String(u), m = "";
      for (let l of c) (l === t || l === s || l === i || l === n) && (m += n), m += l;
      return m;
    }, a = "";
    (e == null ? void 0 : e.includeUNA) && (a += `UNA${i}${s}.${n} ${t}`);
    for (let u in r) {
      let c = Array.isArray(r[u]) ? r[u] : [r[u]];
      for (let m of c) {
        if (a += u, Array.isArray(m)) for (let l of m) a += s, Array.isArray(l) ? a += l.map(o).join(i) : a += o(l);
        a += t;
      }
    }
    return a;
  } });
  L("yaml", { parse: (r, e) => typeof r != "string" ? r : jsYaml.load(r, e), serialize: (r, e) => jsYaml.dump(r, e) });
  L("object", { parse: (r) => {
    if (typeof r == "string" && (r.trim().startsWith("{") || r.trim().startsWith("["))) try {
      return JSON.parse(r);
    } catch (e) {
      return r;
    }
    return r;
  }, serialize: (r) => r });
  L("plaintext", { parse: (r, e) => {
    var _a, _b, _c;
    if (typeof r != "string") return r;
    let t = (_c = (_b = e == null ? void 0 : e.separator) != null ? _b : (_a = e == null ? void 0 : e.params) == null ? void 0 : _a[0]) != null ? _c : /\r?\n/;
    return { rows: r.split(t).filter((s) => s.length > 0) };
  }, serialize: (r, e) => {
    var _a, _b, _c;
    if (!r || !Array.isArray(r.rows)) return "";
    let t = (_c = (_b = e == null ? void 0 : e.separator) != null ? _b : (_a = e == null ? void 0 : e.params) == null ? void 0 : _a[0]) != null ? _c : `
`;
    return r.rows.join(t);
  } });
  var ve = { spreadsheet: (r) => {
    let e = Array.isArray(r) ? r : r == null ? [] : [r];
    if (!Array.isArray(r) && r && typeof r == "object" && Array.isArray(r.rows) && (e = r.rows), e.length === 0) return [];
    let t = [], s = [], i = [];
    for (let n = 0; n < e.length; n++) {
      let o = e[n];
      if (!(!o || typeof o != "object")) if (n === 0) {
        i = Object.keys(o);
        for (let a of i) s.push(String(o[a]));
      } else {
        let a = {};
        for (let u = 0; u < i.length; u++) {
          let c = i[u], m = s[u];
          a[m] = o[c];
        }
        t.push(a);
      }
    }
    return t;
  }, aslist: (r) => Array.isArray(r) ? r : r == null ? [] : [r], to_base64: (r) => {
    let e = String(r);
    return typeof btoa == "function" ? btoa(unescape(encodeURIComponent(e))) : Buffer.from(e, "utf-8").toString("base64");
  }, from_base64: (r) => {
    let e = String(r);
    return typeof atob == "function" ? decodeURIComponent(escape(atob(e))) : Buffer.from(e, "base64").toString("utf-8");
  }, xmlnode: (r, ...e) => {
    if (e.length > 0) {
      let t = [];
      for (let n = 0; n < e.length; n += 2) t.push([e[n], e[n + 1]]);
      let s = t.map(([n, o]) => [`$${n}`, o]), i = Object.fromEntries(s);
      return __spreadValues({ _: r }, i);
    }
    return r;
  }, unpack: (r, ...e) => {
    let t = String(r || ""), s = {};
    for (let i of e) {
      let n = i.split(":");
      if (n.length < 3) continue;
      let [o, a, u, c] = n, m = parseInt(a, 10), l = parseInt(u, 10);
      if (isNaN(m) || isNaN(l)) continue;
      let f = t.substring(m, m + l);
      c !== "raw" && (f = f.trim()), s[o] = f;
    }
    return s;
  }, pack: (r, ...e) => {
    var _a;
    let t = r || {}, s = e.map((o) => {
      let a = o.split(":");
      if (a.length < 3) return null;
      let [u, c, m, l] = a;
      return { name: u, start: parseInt(c, 10), length: parseInt(m, 10), left: l === "left" };
    }).filter((o) => o !== null), i = s.reduce((o, a) => Math.max(o, a.start + a.length), 0), n = " ".repeat(i);
    for (let o of s) {
      let a = String((_a = t[o.name]) != null ? _a : ""), c = (o.left ? a.padStart(o.length) : a.padEnd(o.length)).substring(0, o.length);
      n = n.substring(0, o.start) + c + n.substring(o.start + o.length);
    }
    return n;
  }, sum: (r, e) => Array.isArray(r) ? r.reduce((t, s) => {
    let i = Number(e(s));
    return t + (isNaN(i) ? 0 : i);
  }, 0) : 0, avg: (r, e) => {
    if (!Array.isArray(r) || r.length === 0) return 0;
    let t = 0, s = 0;
    for (let i of r) {
      let n = e(i);
      if (n == null) continue;
      let o = Number(n);
      isNaN(o) || (t += o, s++);
    }
    return s === 0 ? 0 : t / s;
  }, minof: (r, e) => {
    if (!Array.isArray(r)) return null;
    let t = null;
    for (let s of r) {
      let i = e(s);
      if (i == null) continue;
      let n = Number(i);
      !isNaN(n) && (t === null || n < t) && (t = n);
    }
    return t;
  }, maxof: (r, e) => {
    if (!Array.isArray(r)) return null;
    let t = null;
    for (let s of r) {
      let i = e(s);
      if (i == null) continue;
      let n = Number(i);
      !isNaN(n) && (t === null || n > t) && (t = n);
    }
    return t;
  }, every: (r, e) => Array.isArray(r) ? r.every((t) => !!e(t)) : true, some: (r, e) => Array.isArray(r) ? r.some((t) => !!e(t)) : false, distinct: (r, e) => {
    if (!Array.isArray(r)) return [];
    let t = /* @__PURE__ */ new Set(), s = [];
    for (let i of r) {
      let n = e(i), o = String(n);
      t.has(o) || (t.add(o), s.push(n));
    }
    return s;
  }, groupby: (r, e) => {
    if (!Array.isArray(r)) return [];
    let t = /* @__PURE__ */ new Map();
    for (let s of r) {
      let i = e(s), n = String(i);
      t.has(n) || t.set(n, { key: i, items: [] }), t.get(n).items.push(s);
    }
    return Array.from(t.values());
  }, concat: (...r) => r.reduce((e, t) => e.concat(Array.isArray(t) ? t : t == null ? [] : [t]), []), transpose: (r, ...e) => {
    if (!r || typeof r != "object" || e.length === 0) return [];
    let t = 0;
    for (let i of e) {
      let n = r[i];
      Array.isArray(n) ? t = Math.max(t, n.length) : n != null && (t = Math.max(t, 1));
    }
    let s = [];
    for (let i = 0; i < t; i++) {
      let n = {};
      for (let o of e) {
        let a = r[o];
        Array.isArray(a) ? n[o] = a[i] : n[o] = i === 0 ? a : void 0;
      }
      s.push(n);
    }
    return s;
  }, extract: (r, e, ...t) => {
    if (!r || typeof r != "object") return {};
    let s = (n, o, a) => {
      if (!o) return n;
      let u = o.split("."), c = n;
      for (let m of u) if (a) {
        if (c == null) return;
        c = c[m];
      } else c = c[m];
      return c;
    }, i = {};
    for (let n of t) {
      let o = n.indexOf(":"), a, u;
      o !== -1 ? (a = n.substring(0, o), u = n.substring(o + 1)) : (a = n, u = n), i[a] = s(r, u, e);
    }
    return i;
  }, round: (r, e = "half-up") => {
    let t = Number(r);
    if (e === "half-even") {
      let s = Math.floor(t);
      return t - s === 0.5 ? s % 2 === 0 ? s : s + 1 : Math.round(t);
    }
    return Math.round(t);
  }, fixed: (r, e = 2, t = "half-up") => {
    let s = Number(r), i = Math.max(0, Math.floor(Number(e))), n = Math.pow(10, i), o;
    if (t === "half-even") {
      let a = Math.abs(s) * n, u = Math.floor(a);
      o = (a - u === 0.5 ? u % 2 === 0 ? u : u + 1 : Math.round(a)) / n * Math.sign(s || 1);
    } else o = Math.round(Math.abs(s) * n) / n * Math.sign(s || 1);
    return o.toFixed(i);
  }, fromunix: (r) => {
    if (r == null) return null;
    let e = Number(r) * 1e3;
    return isNaN(e) ? null : new Date(e).toISOString();
  }, tounix: (r) => {
    if (r == null) return null;
    let e = new Date(String(r)).getTime();
    return isNaN(e) ? null : String(Math.floor(e / 1e3));
  } };
  async function Lt(r, e) {
    if (e == null ? void 0 : e.cache) {
      let m = await e.cache.retrieve(r);
      if (m) return Te(m);
    }
    let t = de.tokenize(r);
    if (t.errors.length > 0) throw new Error(`Lexing errors: ${t.errors[0].message}`);
    A.input = t.tokens;
    let s = A.query();
    if (A.errors.length > 0) throw new Error(`Parsing errors: ${A.errors[0].message}`);
    Se.isAnalyzing = !!(e == null ? void 0 : e.analyze);
    let { code: i, analysis: n, sourceType: o, targetType: a } = Se.visit(s), u = import_js_beautify.default.js(i, { indent_size: 2, space_in_empty_paren: true, end_with_newline: true });
    (e == null ? void 0 : e.cache) && await e.cache.save(r, u);
    let c = Te(u);
    return n && (n.sourceFormat = o.name, n.targetFormat = a.name, c.analysis = n), c;
  }
  function Te(r) {
    let t = new Function(r)(), s = { parse: (n, o, a) => be(n).parse(o, a), serialize: (n, o, a) => be(n).serialize(o, a), functions: ve }, i = ((n) => t(n, s));
    return i.code = r, i;
  }

  // src/panel.ts
  var import_prismjs = __toESM(require_prism(), 1);

  // ../../node_modules/prismjs/components/prism-javascript.js
  Prism.languages.javascript = Prism.languages.extend("clike", {
    "class-name": [
      Prism.languages.clike["class-name"],
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: true
      }
    ],
    "keyword": [
      {
        pattern: /((?:^|\})\s*)catch\b/,
        lookbehind: true
      },
      {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: true
      }
    ],
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    "number": {
      pattern: RegExp(
        /(^|[^\w$])/.source + "(?:" + // constant
        (/NaN|Infinity/.source + "|" + // binary integer
        /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
        /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
        /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
        /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
        /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
      ),
      lookbehind: true
    },
    "operator": /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
  });
  Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
  Prism.languages.insertBefore("javascript", "keyword", {
    "regex": {
      pattern: RegExp(
        // lookbehind
        // eslint-disable-next-line regexp/no-dupe-characters-character-class
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
        // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
        // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
        // with the only syntax, so we have to define 2 different regex patterns.
        /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
        /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
        /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        "regex-source": {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: true,
          alias: "language-regex",
          inside: Prism.languages.regex
        },
        "regex-delimiter": /^\/|\/$/,
        "regex-flags": /^[a-z]+$/
      }
    },
    // This must be declared before keyword because we use "function" inside the look-forward
    "function-variable": {
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: "function"
    },
    "parameter": [
      {
        pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: true,
        inside: Prism.languages.javascript
      },
      {
        pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: true,
        inside: Prism.languages.javascript
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: true,
        inside: Prism.languages.javascript
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: true,
        inside: Prism.languages.javascript
      }
    ],
    "constant": /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  });
  Prism.languages.insertBefore("javascript", "string", {
    "hashbang": {
      pattern: /^#!.*/,
      greedy: true,
      alias: "comment"
    },
    "template-string": {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: true,
      inside: {
        "template-punctuation": {
          pattern: /^`|`$/,
          alias: "string"
        },
        "interpolation": {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: true,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation"
            },
            rest: Prism.languages.javascript
          }
        },
        "string": /[\s\S]+/
      }
    },
    "string-property": {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: true,
      greedy: true,
      alias: "property"
    }
  });
  Prism.languages.insertBefore("javascript", "operator", {
    "literal-property": {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: true,
      alias: "property"
    }
  });
  if (Prism.languages.markup) {
    Prism.languages.markup.tag.addInlined("script", "javascript");
    Prism.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
      "javascript"
    );
  }
  Prism.languages.js = Prism.languages.javascript;

  // ../../node_modules/prismjs/components/prism-json.js
  Prism.languages.json = {
    "property": {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
      lookbehind: true,
      greedy: true
    },
    "string": {
      pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
      lookbehind: true,
      greedy: true
    },
    "comment": {
      pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
      greedy: true
    },
    "number": /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    "punctuation": /[{}[\],]/,
    "operator": /:/,
    "boolean": /\b(?:false|true)\b/,
    "null": {
      pattern: /\bnull\b/,
      alias: "keyword"
    }
  };
  Prism.languages.webmanifest = Prism.languages.json;

  // ../../node_modules/prismjs/components/prism-markup.js
  Prism.languages.markup = {
    "comment": {
      pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
      greedy: true
    },
    "prolog": {
      pattern: /<\?[\s\S]+?\?>/,
      greedy: true
    },
    "doctype": {
      // https://www.w3.org/TR/xml/#NT-doctypedecl
      pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
      greedy: true,
      inside: {
        "internal-subset": {
          pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
          lookbehind: true,
          greedy: true,
          inside: null
          // see below
        },
        "string": {
          pattern: /"[^"]*"|'[^']*'/,
          greedy: true
        },
        "punctuation": /^<!|>$|[[\]]/,
        "doctype-tag": /^DOCTYPE/i,
        "name": /[^\s<>'"]+/
      }
    },
    "cdata": {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      greedy: true
    },
    "tag": {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: true,
      inside: {
        "tag": {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            "punctuation": /^<\/?/,
            "namespace": /^[^\s>\/:]+:/
          }
        },
        "special-attr": [],
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            "punctuation": [
              {
                pattern: /^=/,
                alias: "attr-equals"
              },
              {
                pattern: /^(\s*)["']|["']$/,
                lookbehind: true
              }
            ]
          }
        },
        "punctuation": /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            "namespace": /^[^\s>\/:]+:/
          }
        }
      }
    },
    "entity": [
      {
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
      },
      /&#x?[\da-f]{1,8};/i
    ]
  };
  Prism.languages.markup["tag"].inside["attr-value"].inside["entity"] = Prism.languages.markup["entity"];
  Prism.languages.markup["doctype"].inside["internal-subset"].inside = Prism.languages.markup;
  Prism.hooks.add("wrap", function(env) {
    if (env.type === "entity") {
      env.attributes["title"] = env.content.replace(/&amp;/, "&");
    }
  });
  Object.defineProperty(Prism.languages.markup.tag, "addInlined", {
    /**
     * Adds an inlined language to markup.
     *
     * An example of an inlined language is CSS with `<style>` tags.
     *
     * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addInlined('style', 'css');
     */
    value: function addInlined(tagName, lang) {
      var includedCdataInside = {};
      includedCdataInside["language-" + lang] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: true,
        inside: Prism.languages[lang]
      };
      includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;
      var inside = {
        "included-cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: includedCdataInside
        }
      };
      inside["language-" + lang] = {
        pattern: /[\s\S]+/,
        inside: Prism.languages[lang]
      };
      var def = {};
      def[tagName] = {
        pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
          return tagName;
        }), "i"),
        lookbehind: true,
        greedy: true,
        inside
      };
      Prism.languages.insertBefore("markup", "cdata", def);
    }
  });
  Object.defineProperty(Prism.languages.markup.tag, "addAttribute", {
    /**
     * Adds an pattern to highlight languages embedded in HTML attributes.
     *
     * An example of an inlined language is CSS with `style` attributes.
     *
     * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
     * case insensitive.
     * @param {string} lang The language key.
     * @example
     * addAttribute('style', 'css');
     */
    value: function(attrName, lang) {
      Prism.languages.markup.tag.inside["special-attr"].push({
        pattern: RegExp(
          /(^|["'\s])/.source + "(?:" + attrName + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
          "i"
        ),
        lookbehind: true,
        inside: {
          "attr-name": /^[^\s=]+/,
          "attr-value": {
            pattern: /=[\s\S]+/,
            inside: {
              "value": {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: true,
                alias: [lang, "language-" + lang],
                inside: Prism.languages[lang]
              },
              "punctuation": [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                /"|'/
              ]
            }
          }
        }
      });
    }
  });
  Prism.languages.html = Prism.languages.markup;
  Prism.languages.mathml = Prism.languages.markup;
  Prism.languages.svg = Prism.languages.markup;
  Prism.languages.xml = Prism.languages.extend("markup", {});
  Prism.languages.ssml = Prism.languages.xml;
  Prism.languages.atom = Prism.languages.xml;
  Prism.languages.rss = Prism.languages.xml;

  // ../../node_modules/prismjs/components/prism-yaml.js
  (function(Prism3) {
    var anchorOrAlias = /[*&][^\s[\]{},]+/;
    var tag = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/;
    var properties = "(?:" + tag.source + "(?:[ 	]+" + anchorOrAlias.source + ")?|" + anchorOrAlias.source + "(?:[ 	]+" + tag.source + ")?)";
    var plainKey = /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g, function() {
      return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source;
    });
    var string = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;
    function createValuePattern(value, flags) {
      flags = (flags || "").replace(/m/g, "") + "m";
      var pattern = /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g, function() {
        return properties;
      }).replace(/<<value>>/g, function() {
        return value;
      });
      return RegExp(pattern, flags);
    }
    Prism3.languages.yaml = {
      "scalar": {
        pattern: RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g, function() {
          return properties;
        })),
        lookbehind: true,
        alias: "string"
      },
      "comment": /#.*/,
      "key": {
        pattern: RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g, function() {
          return properties;
        }).replace(/<<key>>/g, function() {
          return "(?:" + plainKey + "|" + string + ")";
        })),
        lookbehind: true,
        greedy: true,
        alias: "atrule"
      },
      "directive": {
        pattern: /(^[ \t]*)%.+/m,
        lookbehind: true,
        alias: "important"
      },
      "datetime": {
        pattern: createValuePattern(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),
        lookbehind: true,
        alias: "number"
      },
      "boolean": {
        pattern: createValuePattern(/false|true/.source, "i"),
        lookbehind: true,
        alias: "important"
      },
      "null": {
        pattern: createValuePattern(/null|~/.source, "i"),
        lookbehind: true,
        alias: "important"
      },
      "string": {
        pattern: createValuePattern(string),
        lookbehind: true,
        greedy: true
      },
      "number": {
        pattern: createValuePattern(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source, "i"),
        lookbehind: true
      },
      "tag": tag,
      "important": anchorOrAlias,
      "punctuation": /---|[:[\]{}\-,|>?]|\.\.\./
    };
    Prism3.languages.yml = Prism3.languages.yaml;
  })(Prism);

  // src/panel.ts
  function createBridge() {
    const g = globalThis;
    if (typeof g["acquireVsCodeApi"] === "function") {
      const vscode = g["acquireVsCodeApi"]();
      return { postMessage: (msg) => vscode.postMessage(msg) };
    }
    if (typeof g["__morphqlSend"] === "function") {
      const send = g["__morphqlSend"];
      return { postMessage: (msg) => send(JSON.stringify(msg)) };
    }
    return { postMessage: (msg) => console.log("[MorphQL Panel \u2192 Host]", msg) };
  }
  var host = createBridge();
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".pane").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("pane-" + tab.dataset["pane"]).classList.add("active");
    });
  });
  document.getElementById("btn-open-source").addEventListener("click", () => {
    host.postMessage({ type: "openSourceFile" });
  });
  document.getElementById("btn-change-source").addEventListener("click", () => {
    host.postMessage({ type: "selectSourceFile" });
  });
  window.addEventListener("message", async ({ data: msg }) => {
    var _a, _b;
    if (msg.type === "noQuery") {
      document.getElementById("filename").textContent = "No MorphQL file active";
      setStatus("idle", "Idle");
      setSourceFile(null);
      showEmpty();
      resetCode();
      renderStructure(null);
      return;
    }
    if (msg.type === "data") {
      const { query, sourceData, fileName, sourceFileName } = msg;
      document.getElementById("filename").textContent = fileName;
      setSourceFile(sourceFileName);
      try {
        const engine = await Lt(query, { analyze: true });
        const output = engine(sourceData != null ? sourceData : "{}");
        const result = typeof output === "string" ? output : JSON.stringify(output, null, 2);
        setStatus("ok", "OK");
        showOutput(result);
        const code = (_a = engine.code) != null ? _a : "";
        if (code) {
          document.getElementById("code-empty").style.display = "none";
          document.getElementById("code-output").style.display = "block";
          const codeInner = document.getElementById("code-code");
          codeInner.textContent = code;
          import_prismjs.default.highlightElement(codeInner);
        } else {
          resetCode();
        }
        renderStructure((_b = engine.analysis) != null ? _b : null);
      } catch (err) {
        const msg2 = err instanceof Error ? err.message : String(err);
        setStatus("err", "Error");
        showError(msg2);
        resetCode();
        renderStructure(null);
      }
    }
  });
  function setSourceFile(name) {
    const nameEl = document.getElementById("source-name");
    const openBtn = document.getElementById("btn-open-source");
    if (name) {
      nameEl.textContent = name;
      nameEl.classList.remove("none");
      openBtn.style.display = "";
    } else {
      nameEl.textContent = "no source file";
      nameEl.classList.add("none");
      openBtn.style.display = "none";
    }
  }
  function setStatus(cls, text) {
    const el = document.getElementById("status");
    el.className = "status status-" + cls;
    el.textContent = text;
  }
  function showEmpty() {
    document.getElementById("result-empty").style.display = "flex";
    document.getElementById("result-output").style.display = "none";
    document.getElementById("result-error").style.display = "none";
  }
  function detectLang(text) {
    const t = text.trim();
    if (t.startsWith("{") || t.startsWith("[")) return "json";
    if (t.startsWith("<")) return "markup";
    const firstLine = t.split("\n")[0];
    if (/^\s*\w[\w\s.-]*\s*:/.test(firstLine) || /^\s*-\s/.test(firstLine)) return "yaml";
    return "plaintext";
  }
  function showOutput(text) {
    document.getElementById("result-empty").style.display = "none";
    document.getElementById("result-output").style.display = "block";
    document.getElementById("result-error").style.display = "none";
    const codeEl = document.getElementById("result-code");
    codeEl.textContent = text;
    codeEl.className = "language-" + detectLang(text);
    import_prismjs.default.highlightElement(codeEl);
  }
  function showError(message) {
    document.getElementById("result-empty").style.display = "none";
    document.getElementById("result-output").style.display = "none";
    document.getElementById("result-error").style.display = "block";
    document.getElementById("result-error-msg").textContent = message;
  }
  function resetCode() {
    document.getElementById("code-empty").style.display = "flex";
    document.getElementById("code-output").style.display = "none";
    document.getElementById("code-code").textContent = "";
  }
  function renderStructure(analysis) {
    const container = document.getElementById("structure-tree");
    const a = analysis;
    if (!a || !a.source && !a.target) {
      container.innerHTML = '<div class="empty-state" style="padding:20px 0">No structure detected</div>';
      return;
    }
    let html = "";
    if (a.source) {
      html += '<div class="tree-label">Input Structure</div>';
      html += renderNode(a.source, null);
    }
    if (a.source && a.target) {
      html += '<div class="tree-divider"></div>';
    }
    if (a.target) {
      html += '<div class="tree-label">Output Structure</div>';
      html += renderNode(a.target, null);
    }
    container.innerHTML = html;
  }
  function renderNode(node, name) {
    var _a, _b;
    if (!node) return "";
    const n = node;
    const hasProps = n.properties && Object.keys(n.properties).length > 0;
    const hasItems = !!n.items;
    const isLeaf = !hasProps && !hasItems;
    const nameHtml = name != null ? '<span class="fname">' + esc(name) + ":</span> " : "";
    const openBadge = n.isOpen ? '<span class="open-badge">(open)</span>' : "";
    const typeHtml = '<span class="ftype t-' + esc((_a = n.type) != null ? _a : "unknown") + '">' + esc((_b = n.type) != null ? _b : "unknown") + openBadge + "</span>";
    if (isLeaf) {
      return '<details class="leaf"><summary><span class="leaf-spacer"></span>' + nameHtml + typeHtml + "</summary></details>";
    }
    let children = "";
    if (hasProps && n.properties) {
      for (const [k2, v2] of Object.entries(n.properties)) {
        children += renderNode(v2, k2);
      }
    }
    if (hasItems) children += renderNode(n.items, "items[]");
    return '<details open><summary><span class="chevron">\u25B6</span>' + nameHtml + typeHtml + "</summary>" + children + "</details>";
  }
  function esc(str2) {
    return String(str2).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.5.3
  https://github.com/mholt/PapaParse
  License: MIT
  *)

prismjs/prism.js:
  (**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   *)

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)
*/
