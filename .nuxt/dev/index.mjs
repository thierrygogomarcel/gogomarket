import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { mkdirSync } from 'node:fs';
import { Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parentPort, threadId } from 'node:worker_threads';
import { getRequestHeader, splitCookiesString, setResponseStatus, setResponseHeader, send, getRequestHeaders, eventHandler, createError, defineEventHandler, handleCacheHeaders, createEvent, fetchWithEvent, isEvent, setHeaders, sendRedirect, proxyRequest, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, setResponseHeaders, getRouterParam, getQuery as getQuery$1, readBody, readMultipartFormData, getResponseStatusText } from 'file://C:/Users/thier/Documents/agroproject/node_modules/h3/dist/index.mjs';
import jwt from 'file://C:/Users/thier/Documents/agroproject/node_modules/jsonwebtoken/index.js';
import bcrypt from 'file://C:/Users/thier/Documents/agroproject/node_modules/bcryptjs/index.js';
import mongoose from 'file://C:/Users/thier/Documents/agroproject/node_modules/mongoose/index.js';
import { z } from 'file://C:/Users/thier/Documents/agroproject/node_modules/zod/lib/index.mjs';
import { promises } from 'fs';
import path from 'path';
import { getRequestDependencies, getPreloadLinks, getPrefetchLinks, createRenderer } from 'file://C:/Users/thier/Documents/agroproject/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { stringify, uneval } from 'file://C:/Users/thier/Documents/agroproject/node_modules/devalue/index.js';
import destr from 'file://C:/Users/thier/Documents/agroproject/node_modules/destr/dist/index.mjs';
import { withQuery, joinURL, withTrailingSlash, parseURL, withoutBase, getQuery, joinRelativeURL } from 'file://C:/Users/thier/Documents/agroproject/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file://C:/Users/thier/Documents/agroproject/node_modules/vue/server-renderer/index.mjs';
import { propsToString, renderSSRHead } from 'file://C:/Users/thier/Documents/agroproject/node_modules/@unhead/ssr/dist/index.mjs';
import { createServerHead as createServerHead$1, CapoPlugin } from 'file://C:/Users/thier/Documents/agroproject/node_modules/unhead/dist/index.mjs';
import { klona } from 'file://C:/Users/thier/Documents/agroproject/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://C:/Users/thier/Documents/agroproject/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file://C:/Users/thier/Documents/agroproject/node_modules/scule/dist/index.mjs';
import { createHooks } from 'file://C:/Users/thier/Documents/agroproject/node_modules/hookable/dist/index.mjs';
import { createFetch as createFetch$1, Headers as Headers$1 } from 'file://C:/Users/thier/Documents/agroproject/node_modules/ofetch/dist/node.mjs';
import { createCall, createFetch } from 'file://C:/Users/thier/Documents/agroproject/node_modules/unenv/runtime/fetch/index.mjs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { consola } from 'file://C:/Users/thier/Documents/agroproject/node_modules/consola/dist/index.mjs';
import { getContext } from 'file://C:/Users/thier/Documents/agroproject/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://C:/Users/thier/Documents/agroproject/node_modules/errx/dist/index.js';
import { isVNode, version, unref } from 'file://C:/Users/thier/Documents/agroproject/node_modules/vue/index.mjs';
import winston from 'file://C:/Users/thier/Documents/agroproject/node_modules/winston/lib/winston.js';
import { hash } from 'file://C:/Users/thier/Documents/agroproject/node_modules/ohash/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://C:/Users/thier/Documents/agroproject/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://C:/Users/thier/Documents/agroproject/node_modules/unstorage/drivers/fs.mjs';
import { toRouteMatcher, createRouter } from 'file://C:/Users/thier/Documents/agroproject/node_modules/radix3/dist/index.mjs';
import { defineHeadPlugin } from 'file://C:/Users/thier/Documents/agroproject/node_modules/@unhead/shared/dist/index.mjs';

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error, isDev) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.unhandled || error.fatal) ? [] : (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.unhandled ? "internal server error" : error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function _captureError(error, type) {
  console.error(`[nitro] [${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.path,
    statusCode,
    statusMessage,
    message,
    stack: statusCode !== 404 ? `<pre>${stack.map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n")}</pre>` : "",
    // TODO: check and validate error.data for serialisation into query
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, (error.message || error.toString() || "internal server error") + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    return send(event, JSON.stringify(errorObject));
  }
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : undefined, res.statusText);
  return send(event, html);
});

const script$1 = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _Z8SGtNbgNd = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script$1}<\/script>`);
  });
});

const rootDir = "C:/Users/thier/Documents/agroproject";

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"name":"description","content":"Plateforme de mise en relation entre producteurs et acheteurs de produits agricoles"}],"link":[{"rel":"icon","type":"image/png","href":"/logo.png"}],"style":[],"script":[],"noscript":[],"title":"GoGoMarket"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : undefined,
  URL: (data) => data instanceof URL ? data.toString() : undefined
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _maHvPADrq6 = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola.wrapConsole();
}

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"light\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _IeraNIYa5f = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

function defineNitroPlugin(def) {
  return def;
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);
const logger = winston.createLogger({
  level: "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    }),
    new winston.transports.File({
      filename: "logs/combined.log"
    })
  ]
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      // Changed to true to allow buffering
      serverSelectionTimeoutMS: 5e3,
      socketTimeoutMS: 45e3
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose2) => {
      logger.info("MongoDB connected successfully");
      return mongoose2;
    }).catch((error) => {
      logger.error("MongoDB connection error:", error);
      throw error;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

const _GSeDLHACSY = defineNitroPlugin(async () => {
  try {
    await connectDB();
    logger.info("MongoDB plugin initialized");
  } catch (error) {
    logger.error("Failed to initialize MongoDB plugin:", error);
    throw error;
  }
});

const plugins = [
  _Z8SGtNbgNd,
_maHvPADrq6,
_IeraNIYa5f,
_GSeDLHACSY
];

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === undefined) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /{{(.*?)}}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "apiBase": "http://localhost:3000"
  },
  "jwtSecret": "ed68fc31d9acf97131a42a95987c9dddbb390f5befdf646c324c8f86f443b0f7",
  "jwtExpiresIn": "7d",
  "mongodbUri": "mongodb+srv://thierry_gogo:M2024Mano@cluster0.rf9zo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return undefined;
  }
});

const _atjrSP = eventHandler(async (event) => {
  const publicRoutes = [
    "/",
    "/api/auth/login",
    "/api/auth/register",
    "/connexion",
    "/inscription",
    "/explorer"
  ];
  if (publicRoutes.some((route) => event.path.startsWith(route))) {
    return;
  }
  try {
    const config = useRuntimeConfig();
    const authHeader = getRequestHeader(event, "Authorization");
    if (!(authHeader == null ? void 0 : authHeader.startsWith("Bearer "))) {
      throw createError({
        statusCode: 401,
        message: "No token provided"
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, config.jwtSecret);
    event.context.auth = decoded;
    return decoded;
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: error.message || "Invalid or expired token"
    });
  }
});

const _lazy_iwdmKo = () => Promise.resolve().then(function () { return recentProducts_get$1; });
const _lazy_6Q9c7C = () => Promise.resolve().then(function () { return recentUsers_get$1; });
const _lazy_tq4jRi = () => Promise.resolve().then(function () { return stats_get$3; });
const _lazy_c1Zfcf = () => Promise.resolve().then(function () { return create_post$1; });
const _lazy_8XRS6a = () => Promise.resolve().then(function () { return sponsored_get$1; });
const _lazy_aCgYZL = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_fj1z0Z = () => Promise.resolve().then(function () { return me_get$1; });
const _lazy_toYQ2i = () => Promise.resolve().then(function () { return register_post$3; });
const _lazy_0ZDqMC = () => Promise.resolve().then(function () { return fees_post$1; });
const _lazy_EjiZrG = () => Promise.resolve().then(function () { return _id__delete$7; });
const _lazy_EPomog = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_JRI8mZ = () => Promise.resolve().then(function () { return list_get$7; });
const _lazy_RoJtLV = () => Promise.resolve().then(function () { return publish$1; });
const _lazy_BHRKUx = () => Promise.resolve().then(function () { return initiate_post$1; });
const _lazy_2gEq11 = () => Promise.resolve().then(function () { return _transaction_id__get$1; });
const _lazy_Kd1pv0 = () => Promise.resolve().then(function () { return _id__delete$5; });
const _lazy_6ZwYQf = () => Promise.resolve().then(function () { return _id__get$3; });
const _lazy_EzV7jJ = () => Promise.resolve().then(function () { return _id__put$3; });
const _lazy_3TmK91 = () => Promise.resolve().then(function () { return add_post$1; });
const _lazy_ipmr0n = () => Promise.resolve().then(function () { return compare_post$1; });
const _lazy_Ta8MG0 = () => Promise.resolve().then(function () { return deleteAll$3; });
const _lazy_zQ1hV7 = () => Promise.resolve().then(function () { return list_get$5; });
const _lazy_MI27pG = () => Promise.resolve().then(function () { return list_get$3; });
const _lazy_aWTn5h = () => Promise.resolve().then(function () { return _id__delete$3; });
const _lazy_qIVmpr = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_cPMoxM = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_DrjY15 = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_zQFeMp = () => Promise.resolve().then(function () { return _id__get$1; });
const _lazy_W4RV7z = () => Promise.resolve().then(function () { return _id__put$1; });
const _lazy_Gpj79u = () => Promise.resolve().then(function () { return role_put$1; });
const _lazy_NNSqrP = () => Promise.resolve().then(function () { return avatar_patch$1; });
const _lazy_O8OujQ = () => Promise.resolve().then(function () { return deleteAll$1; });
const _lazy_HVVXHt = () => Promise.resolve().then(function () { return list_get$1; });
const _lazy_rGChXW = () => Promise.resolve().then(function () { return profile_get$1; });
const _lazy_IdtL2j = () => Promise.resolve().then(function () { return register_post$1; });
const _lazy_YjSNXt = () => Promise.resolve().then(function () { return roles_get$1; });
const _lazy_nzaURk = () => Promise.resolve().then(function () { return stats_get$1; });
const _lazy_WCTmbK = () => Promise.resolve().then(function () { return topup_post$1; });
const _lazy_wdinP7 = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _atjrSP, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/recent-products', handler: _lazy_iwdmKo, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/recent-users', handler: _lazy_6Q9c7C, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/stats', handler: _lazy_tq4jRi, lazy: true, middleware: false, method: "get" },
  { route: '/api/ads/create', handler: _lazy_c1Zfcf, lazy: true, middleware: false, method: "post" },
  { route: '/api/ads/sponsored', handler: _lazy_8XRS6a, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/login', handler: _lazy_aCgYZL, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/me', handler: _lazy_fj1z0Z, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/register', handler: _lazy_toYQ2i, lazy: true, middleware: false, method: "post" },
  { route: '/api/delivery/fees', handler: _lazy_0ZDqMC, lazy: true, middleware: false, method: "post" },
  { route: '/api/favorites/:id', handler: _lazy_EjiZrG, lazy: true, middleware: false, method: "delete" },
  { route: '/api/favorites', handler: _lazy_EPomog, lazy: true, middleware: false, method: "get" },
  { route: '/api/offers/list', handler: _lazy_JRI8mZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/offers/publish', handler: _lazy_RoJtLV, lazy: true, middleware: false, method: undefined },
  { route: '/api/payments/initiate', handler: _lazy_BHRKUx, lazy: true, middleware: false, method: "post" },
  { route: '/api/payments/status/:transaction_id', handler: _lazy_2gEq11, lazy: true, middleware: false, method: "get" },
  { route: '/api/products/:id', handler: _lazy_Kd1pv0, lazy: true, middleware: false, method: "delete" },
  { route: '/api/products/:id', handler: _lazy_6ZwYQf, lazy: true, middleware: false, method: "get" },
  { route: '/api/products/:id', handler: _lazy_EzV7jJ, lazy: true, middleware: false, method: "put" },
  { route: '/api/products/add', handler: _lazy_3TmK91, lazy: true, middleware: false, method: "post" },
  { route: '/api/products/compare', handler: _lazy_ipmr0n, lazy: true, middleware: false, method: "post" },
  { route: '/api/products/delete-all', handler: _lazy_Ta8MG0, lazy: true, middleware: false, method: undefined },
  { route: '/api/products/list', handler: _lazy_zQ1hV7, lazy: true, middleware: false, method: "get" },
  { route: '/api/sales/list', handler: _lazy_MI27pG, lazy: true, middleware: false, method: "get" },
  { route: '/api/transactions/:id', handler: _lazy_aWTn5h, lazy: true, middleware: false, method: "delete" },
  { route: '/api/transactions', handler: _lazy_qIVmpr, lazy: true, middleware: false, method: "get" },
  { route: '/api/transactions', handler: _lazy_cPMoxM, lazy: true, middleware: false, method: "post" },
  { route: '/api/users/:id', handler: _lazy_DrjY15, lazy: true, middleware: false, method: "delete" },
  { route: '/api/users/:id', handler: _lazy_zQFeMp, lazy: true, middleware: false, method: "get" },
  { route: '/api/users/:id', handler: _lazy_W4RV7z, lazy: true, middleware: false, method: "put" },
  { route: '/api/users/:id/role', handler: _lazy_Gpj79u, lazy: true, middleware: false, method: "put" },
  { route: '/api/users/avatar', handler: _lazy_NNSqrP, lazy: true, middleware: false, method: "patch" },
  { route: '/api/users/delete-all', handler: _lazy_O8OujQ, lazy: true, middleware: false, method: undefined },
  { route: '/api/users/list', handler: _lazy_HVVXHt, lazy: true, middleware: false, method: "get" },
  { route: '/api/users/profile', handler: _lazy_rGChXW, lazy: true, middleware: false, method: "get" },
  { route: '/api/users/register', handler: _lazy_IdtL2j, lazy: true, middleware: false, method: "post" },
  { route: '/api/users/roles', handler: _lazy_YjSNXt, lazy: true, middleware: false, method: "get" },
  { route: '/api/users/stats', handler: _lazy_nzaURk, lazy: true, middleware: false, method: "get" },
  { route: '/api/wallet/topup', handler: _lazy_WCTmbK, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_wdinP7, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_wdinP7, lazy: true, middleware: false, method: undefined }
];

const serverAssets = [{"baseName":"server","dir":"C:/Users/thier/Documents/agroproject/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:\\Users\\thier\\Documents\\agroproject","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:\\Users\\thier\\Documents\\agroproject\\server","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:\\Users\\thier\\Documents\\agroproject\\.nuxt","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:\\Users\\thier\\Documents\\agroproject\\.nuxt\\cache","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"C:\\Users\\thier\\Documents\\agroproject\\.data\\kv","ignore":["**/node_modules/**","**/.git/**"]}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== undefined);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[nitro] [cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[nitro] [cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== undefined && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = undefined;
          entry.integrity = undefined;
          entry.mtime = undefined;
          entry.expires = undefined;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[nitro] [cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === undefined) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[nitro] [cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : undefined
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === undefined) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== undefined) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(undefined);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== undefined) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== undefined) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const localCall = createCall(toNodeListener(h3App));
  const _localFetch = createFetch(localCall, globalThis.fetch);
  const localFetch = (input, init) => _localFetch(input, init).then(
    (response) => normalizeFetchResponse(response)
  );
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: undefined };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const r=Object.create(null),i=e=>globalThis.process?.env||globalThis._importMeta_.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?r:globalThis),s=new Proxy(r,{get(e,o){return i()[o]??r[o]},has(e,o){const E=i();return o in E||o in r},set(e,o,E){const b=i(true);return b[o]=E,true},deleteProperty(e,o){if(!o)return  false;const E=i(true);return delete E[o],true},ownKeys(){const e=i(true);return Object.keys(e)}}),t=typeof process<"u"&&process.env&&"development"||"",B=[["APPVEYOR"],["AWS_AMPLIFY","AWS_APP_ID",{ci:true}],["AZURE_PIPELINES","SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],["AZURE_STATIC","INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],["APPCIRCLE","AC_APPCIRCLE"],["BAMBOO","bamboo_planKey"],["BITBUCKET","BITBUCKET_COMMIT"],["BITRISE","BITRISE_IO"],["BUDDY","BUDDY_WORKSPACE_ID"],["BUILDKITE"],["CIRCLE","CIRCLECI"],["CIRRUS","CIRRUS_CI"],["CLOUDFLARE_PAGES","CF_PAGES",{ci:true}],["CODEBUILD","CODEBUILD_BUILD_ARN"],["CODEFRESH","CF_BUILD_ID"],["DRONE"],["DRONE","DRONE_BUILD_EVENT"],["DSARI"],["GITHUB_ACTIONS"],["GITLAB","GITLAB_CI"],["GITLAB","CI_MERGE_REQUEST_ID"],["GOCD","GO_PIPELINE_LABEL"],["LAYERCI"],["HUDSON","HUDSON_URL"],["JENKINS","JENKINS_URL"],["MAGNUM"],["NETLIFY"],["NETLIFY","NETLIFY_LOCAL",{ci:false}],["NEVERCODE"],["RENDER"],["SAIL","SAILCI"],["SEMAPHORE"],["SCREWDRIVER"],["SHIPPABLE"],["SOLANO","TDDIUM"],["STRIDER"],["TEAMCITY","TEAMCITY_VERSION"],["TRAVIS"],["VERCEL","NOW_BUILDER"],["VERCEL","VERCEL",{ci:false}],["VERCEL","VERCEL_ENV",{ci:false}],["APPCENTER","APPCENTER_BUILD_ID"],["CODESANDBOX","CODESANDBOX_SSE",{ci:false}],["STACKBLITZ"],["STORMKIT"],["CLEAVR"],["ZEABUR"],["CODESPHERE","CODESPHERE_APP_ID",{ci:true}],["RAILWAY","RAILWAY_PROJECT_ID"],["RAILWAY","RAILWAY_SERVICE_ID"],["DENO-DEPLOY","DENO_DEPLOYMENT_ID"],["FIREBASE_APP_HOSTING","FIREBASE_APP_HOSTING",{ci:true}]];function p(){if(globalThis.process?.env)for(const e of B){const o=e[1]||e[0];if(globalThis.process?.env[o])return {name:e[0].toLowerCase(),...e[2]}}return globalThis.process?.env?.SHELL==="/bin/jsh"&&globalThis.process?.versions?.webcontainer?{name:"stackblitz",ci:false}:{name:"",ci:false}}const l=p(),d=l.name;function n(e){return e?e!=="false":false}const I=globalThis.process?.platform||"",T=n(s.CI)||l.ci!==false,R=n(globalThis.process?.stdout&&globalThis.process?.stdout.isTTY);n(s.DEBUG);const A=t==="test"||n(s.TEST);n(s.MINIMAL)||T||A||!R;const _=/^win/i.test(I);!n(s.NO_COLOR)&&(n(s.FORCE_COLOR)||(R||_)&&s.TERM!=="dumb"||T);const C=(globalThis.process?.versions?.node||"").replace(/^v/,"")||null;Number(C?.split(".")[0])||null;const y=globalThis.process||Object.create(null),c={versions:{}};new Proxy(y,{get(e,o){if(o==="env")return s;if(o in e)return e[o];if(o in c)return c[o]}});const L=globalThis.process?.release?.name==="node",a=!!globalThis.Bun||!!globalThis.process?.versions?.bun,D=!!globalThis.Deno,O=!!globalThis.fastly,S=!!globalThis.Netlify,N=!!globalThis.EdgeRuntime,P=globalThis.navigator?.userAgent==="Cloudflare-Workers",F=[[S,"netlify"],[N,"edge-light"],[P,"workerd"],[O,"fastly"],[D,"deno"],[a,"bun"],[L,"node"]];function G(){const e=F.find(o=>o[0]);if(e)return {name:e[1]}}const u=G();u?.name||"";

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
function getAddress() {
  if (d === "stackblitz" || process.env.NITRO_NO_UNIX_SOCKET || process.versions.bun) {
    return 0;
  }
  const socketName = `worker-${process.pid}-${threadId}.sock`;
  if (_) {
    return join(String.raw`\\.\pipe\nitro`, socketName);
  }
  const socketDir = join(tmpdir(), "nitro");
  mkdirSync(socketDir, { recursive: true });
  return join(socketDir, socketName);
}
const listenAddress = getAddress();
server.listen(listenAddress, () => {
  const _address = server.address();
  parentPort?.postMessage({
    event: "listen",
    address: typeof _address === "string" ? { socketPath: _address } : { host: "localhost", port: _address?.port }
  });
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
trapUnhandledNodeErrors();
async function onShutdown(signal) {
  await nitroApp.hooks.callHook("close");
}
parentPort?.on("message", async (msg) => {
  if (msg && msg.event === "shutdown") {
    await onShutdown();
    parentPort?.postMessage({ event: "exit" });
  }
});

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + messages.statusCode + " - " + messages.statusMessage + " | " + messages.appName + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-40vh;filter:blur(30vh);height:60vh;opacity:.8}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-size:1em;font-variation-settings:normal}h1,p,pre{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-black\\/5{background-color:#0000000d}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:bg-white\\/10{background-color:#ffffff1a}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white flex flex-col font-sans min-h-screen pt-14 px-10 text-black"><div class="fixed left-0 right-0 spotlight"></div><h1 class="font-medium mb-6 sm:text-8xl text-6xl">` + messages.statusCode + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + messages.description + '</p><div class="bg-black/5 bg-white dark:bg-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><pre class="font-light leading-tight p-8 text-xl z-10">' + messages.stack + "</pre></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template$1
});

const recentProducts_get = defineEventHandler(async (event) => {
  return [
    {
      id: 1,
      name: "Produit exemple 1",
      price: 29.99,
      imageUrl: "/example-product-1.jpg"
    },
    {
      id: 2,
      name: "Produit exemple 2",
      price: 49.99,
      imageUrl: "/example-product-2.jpg"
    }
  ];
});

const recentProducts_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: recentProducts_get
});

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
const verifyToken$1 = (token, config) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Token invalide ou expir\xE9"
    });
  }
};
const getUserFromToken = async (event) => {
  const authHeader = event.node.req.headers.authorization;
  if (!(authHeader == null ? undefined : authHeader.startsWith("Bearer "))) {
    return null;
  }
  const token = authHeader.replace("Bearer ", "");
  const config = useRuntimeConfig();
  return verifyToken$1(token, config);
};
const requireAuth$1 = async (event) => {
  const user = await getUserFromToken(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Token manquant ou invalide"
    });
  }
  return user;
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ["producer", "buyer", "transport", "admin"]
  },
  entityType: {
    type: String,
    required: true,
    enum: ["particulier", "structure_privee", "ong"]
  },
  role: {
    type: String,
    required: true,
    enum: ["producer", "buyer", "transport", "admin"],
    default: function() {
      return this.userType || "producer";
    }
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"]
  },
  avatarUrl: {
    type: String
  }
}, {
  timestamps: true
});
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
const User$1 = mongoose.models.User || mongoose.model("User", userSchema);

const recentUsers_get = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    if (user.role !== "admin") {
      throw createError({
        statusCode: 403,
        message: "Acc\xE8s non autoris\xE9"
      });
    }
    const recentUsers = await User$1.find().select("-password").sort({ createdAt: -1 }).limit(5);
    return recentUsers;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur serveur"
    });
  }
});

const recentUsers_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: recentUsers_get
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom du produit est requis"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "La description est requise"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Le prix est requis"],
    min: [0, "Le prix doit \xEAtre positif"]
  },
  category: {
    type: String,
    required: [true, "La cat\xE9gorie est requise"],
    trim: true
  },
  location: {
    type: String,
    required: [true, "La localisation est requise"],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, "Le stock est requis"],
    min: [0, "Le stock doit \xEAtre positif"]
  },
  images: [{
    type: String,
    default: ["https://via.placeholder.com/300x200?text=Produit"]
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "L'ID du vendeur est requis"]
  }
}, {
  timestamps: true
});
productSchema.index({ category: 1 });
productSchema.index({ location: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ price: 1 });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const transactionSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending"
  }
}, {
  timestamps: true
});
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

const stats_get$2 = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    if (user.role !== "admin") {
      throw createError({
        statusCode: 403,
        message: "Acc\xE8s non autoris\xE9"
      });
    }
    const [totalUsers, totalProducts, transactions] = await Promise.all([
      User$1.countDocuments(),
      Product.countDocuments(),
      Transaction.find({ status: "completed" })
    ]);
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    return {
      totalUsers,
      totalProducts,
      totalTransactions: transactions.length,
      totalRevenue
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur serveur"
    });
  }
});

const stats_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: stats_get$2
});

const create_post = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const { productId, duration, budget } = await readBody(event);
    if (!productId || !duration || !budget) {
      throw createError({
        statusCode: 400,
        message: "ID produit, dur\xE9e et budget requis"
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw createError({
        statusCode: 404,
        message: "Produit non trouv\xE9"
      });
    }
    if (product.sellerId.toString() !== user.userId) {
      throw createError({
        statusCode: 403,
        message: "Non autoris\xE9 \xE0 sponsoriser ce produit"
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        sponsored: true,
        sponsoredUntil: new Date(Date.now() + duration * 24 * 60 * 60 * 1e3),
        sponsoredBudget: budget,
        sponsoredRank: Math.floor(budget / duration)
        // Calcul simple du rang basé sur le budget quotidien
      },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la cr\xE9ation de l'annonce sponsoris\xE9e"
    });
  }
});

const create_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: create_post
});

const sponsored_get = defineEventHandler(async (event) => {
  try {
    const { category, location } = getQuery$1(event);
    const filter = {
      sponsored: true
    };
    if (category) filter.category = category;
    if (location) filter.location = location;
    const sponsoredProducts = await Product.find(filter).populate("sellerId", "fullName location rating").sort({ sponsoredRank: -1 }).limit(5);
    return {
      products: sponsoredProducts,
      total: sponsoredProducts.length
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la r\xE9cup\xE9ration des annonces sponsoris\xE9es"
    });
  }
});

const sponsored_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: sponsored_get
});

const login_post = defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { email, password } = await readBody(event);
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: "Email et mot de passe requis"
      });
    }
    const user = await User$1.findOne({ email }).select("+password");
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Email ou mot de passe incorrect"
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: "Email ou mot de passe incorrect"
      });
    }
    if (user.status !== "active") {
      throw createError({
        statusCode: 403,
        message: "Votre compte est inactif"
      });
    }
    const config = useRuntimeConfig();
    if (!config.jwtSecret) {
      logger.error("JWT_SECRET is not defined");
      throw createError({
        statusCode: 500,
        message: "Erreur de configuration"
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role || "user",
        userType: user.userType
      },
      config.jwtSecret,
      { expiresIn: "7d" }
    );
    const userResponse = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      role: user.role || "user",
      status: user.status,
      avatarUrl: user.avatarUrl
    };
    return {
      token,
      user: userResponse
    };
  } catch (error) {
    logger.error("Login error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur interne du serveur"
    });
  }
});

const login_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: login_post
});

const me_get = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const userDoc = await User$1.findById(user.userId).select("-password");
    if (!userDoc) {
      throw createError({
        statusCode: 404,
        message: "User not found"
      });
    }
    return userDoc;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const me_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: me_get
});

const register_post$2 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password, fullName, phone, userType, entityType } = body;
    if (!email || !password || !fullName || !phone || !userType || !entityType) {
      throw createError({
        statusCode: 400,
        message: "Tous les champs sont requis"
      });
    }
    const existingUser = await User$1.findOne({ email });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Cet email est d\xE9j\xE0 utilis\xE9"
      });
    }
    const user = await User$1.create({
      email,
      password,
      fullName,
      phone,
      userType,
      entityType,
      role: userType,
      status: "active"
    });
    const config = useRuntimeConfig();
    if (!config.jwtSecret) {
      throw createError({
        statusCode: 500,
        message: "JWT Secret is not configured"
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        userType: user.userType
      },
      config.jwtSecret,
      {
        expiresIn: "1d"
        // Token expires in 1 day
      }
    );
    return {
      message: "Inscription r\xE9ussie",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        entityType: user.entityType,
        role: user.role
      },
      token
    };
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'inscription"
    });
  }
});

const register_post$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: register_post$2
});

function calculateDistance(origin, destination) {
  const R = 6371;
  const dLat = (destination.latitude - origin.latitude) * Math.PI / 180;
  const dLon = (destination.longitude - origin.longitude) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
const fees_post = defineEventHandler(async (event) => {
  try {
    const { origin, destination, weight } = await readBody(event);
    if (!origin || !destination || !weight) {
      throw createError({
        statusCode: 400,
        message: "Origine, destination et poids requis"
      });
    }
    const distance = calculateDistance(origin, destination);
    const baseFee = 1e3;
    const distanceFee = distance * 100;
    const weightFee = weight * 200;
    const totalFees = baseFee + distanceFee + weightFee;
    return {
      distance: Math.round(distance * 100) / 100,
      // Arrondir à 2 décimales
      fees: Math.round(totalFees),
      details: {
        baseFee,
        distanceFee: Math.round(distanceFee),
        weightFee: Math.round(weightFee)
      },
      estimatedTime: Math.ceil(distance / 50) * 24
      // Estimation en heures (50km/h en moyenne)
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors du calcul des frais de livraison"
    });
  }
});

const fees_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: fees_post
});

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }
}, {
  timestamps: true
});
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });
const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);

const _id__delete$6 = defineEventHandler(async (event) => {
  var _a;
  try {
    const user = await requireAuth$1(event);
    const productId = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: "Product ID is required"
      });
    }
    await Favorite.findOneAndDelete({
      userId: user.userId,
      productId
    });
    return {
      message: "Favorite removed successfully"
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const _id__delete$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$6
});

const index_get$2 = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const favorites = await Favorite.find({ userId: user.userId }).populate("productId").sort({ createdAt: -1 });
    return {
      favorites: favorites.map((f) => f.productId)
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const index_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2
});

const OfferSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["publi\xE9", "en attente", "refus\xE9"], default: "publi\xE9" }
  },
  { timestamps: true }
);
const Offer = mongoose.model("Offer", OfferSchema);

const list_get$6 = defineEventHandler(async (event) => {
  try {
    const user = await getUserFromToken(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Non autoris\xE9" });
    }
    const offers = await Offer.find({ userId: user._id }).sort({ createdAt: -1 });
    return { offers };
  } catch (error) {
    return createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur serveur"
    });
  }
});

const list_get$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list_get$6
});

const PublishOfferSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters long").max(500, "Message cannot exceed 500 characters")
});
const publish = defineEventHandler(async (event) => {
  try {
    const user = await getUserFromToken(event);
    if (!user) {
      logger.warn("Unauthorized offer publication attempt");
      throw createError({
        statusCode: 401,
        message: "Vous devez \xEAtre connect\xE9 pour publier une offre"
      });
    }
    const body = await readBody(event);
    console.log("Received offer data:", body);
    const validationResult = PublishOfferSchema.safeParse(body);
    if (!validationResult.success) {
      logger.error("Invalid offer data", {
        errors: validationResult.error.errors,
        body
      });
      throw createError({
        statusCode: 400,
        message: validationResult.error.errors[0].message
      });
    }
    const { productId, message } = validationResult.data;
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const product = await Product.findOne({
      _id: productObjectId,
      userId: new mongoose.Types.ObjectId(user._id)
    });
    if (!product) {
      logger.warn(`Product not found or not owned by user`, {
        productId,
        userId: user._id
      });
      throw createError({
        statusCode: 404,
        message: "Produit non trouv\xE9 ou non autoris\xE9"
      });
    }
    const existingOffer = await Offer.findOne({ productId: productObjectId, userId: user._id });
    if (existingOffer) {
      logger.warn("Duplicate offer creation attempt", {
        productId,
        userId: user._id
      });
      throw createError({
        statusCode: 409,
        message: "Une offre existe d\xE9j\xE0 pour ce produit"
      });
    }
    const newOffer = new Offer({
      userId: user.userId,
      productId: productObjectId,
      message,
      status: "publi\xE9",
      createdAt: /* @__PURE__ */ new Date()
    });
    await newOffer.save();
    logger.info("Offer published successfully", {
      offerId: newOffer._id,
      productId,
      userId: user._id
    });
    return {
      success: true,
      message: "Offre publi\xE9e avec succ\xE8s",
      offer: newOffer
    };
  } catch (error) {
    logger.error("Error in offer publication", {
      error: error.message,
      stack: error.stack
    });
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la publication de l'offre"
    });
  }
});

const publish$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: publish
});

const initiate_post = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const { amount, productId, paymentMethod } = await readBody(event);
    if (!amount || !productId || !paymentMethod) {
      throw createError({
        statusCode: 400,
        message: "Montant, produit et m\xE9thode de paiement requis"
      });
    }
    const transaction = await Transaction.create({
      buyerId: user.userId,
      productId,
      amount,
      status: "pending",
      paymentMethod
    });
    const paymentInitiation = {
      transactionId: transaction._id,
      paymentUrl: `/pay/${transaction._id}`,
      amount,
      currency: "XOF"
    };
    return paymentInitiation;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'initiation du paiement"
    });
  }
});

const initiate_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: initiate_post
});

const _transaction_id__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const user = await requireAuth$1(event);
    const transactionId = (_a = event.context.params) == null ? void 0 : _a.transaction_id;
    if (!transactionId) {
      throw createError({
        statusCode: 400,
        message: "ID de transaction requis"
      });
    }
    const transaction = await Transaction.findById(transactionId).populate("productId").populate("buyerId", "fullName email");
    if (!transaction) {
      throw createError({
        statusCode: 404,
        message: "Transaction non trouv\xE9e"
      });
    }
    if (transaction.buyerId.toString() !== user.userId && user.role !== "admin") {
      throw createError({
        statusCode: 403,
        message: "Non autoris\xE9 \xE0 voir cette transaction"
      });
    }
    return transaction;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la r\xE9cup\xE9ration du statut"
    });
  }
});

const _transaction_id__get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _transaction_id__get
});

const _id__delete$4 = defineEventHandler(async (event) => {
  var _a;
  try {
    const user = await requireAuth$1(event);
    const productId = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: "Product ID is required"
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw createError({
        statusCode: 404,
        message: "Product not found"
      });
    }
    if (product.sellerId.toString() !== user.userId && user.role !== "admin") {
      throw createError({
        statusCode: 403,
        message: "Not authorized to delete this product"
      });
    }
    await Product.findByIdAndDelete(productId);
    return {
      message: "Product deleted successfully"
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const _id__delete$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$4
});

const _id__get$2 = defineEventHandler(async (event) => {
  var _a;
  try {
    const productId = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: "Product ID is required"
      });
    }
    const product = await Product.findById(productId).populate("sellerId", "fullName location createdAt");
    if (!product) {
      throw createError({
        statusCode: 404,
        message: "Product not found"
      });
    }
    return product;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const _id__get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$2
});

const verifyToken = (token) => {
  const config = useRuntimeConfig();
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError({
        statusCode: 401,
        message: "Token expired"
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw createError({
        statusCode: 401,
        message: "Invalid token"
      });
    }
    throw createError({
      statusCode: 500,
      message: "Error verifying token"
    });
  }
};
const getUserFromEvent = (event) => {
  const token = event.headers.get("authorization");
  if (!token || !token.startsWith("Bearer ")) return null;
  const decoded = verifyToken(token.replace("Bearer ", ""));
  return decoded;
};
const requireAuth = async (event) => {
  const user = getUserFromEvent(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized"
    });
  }
  return user;
};

const _id__put$2 = defineEventHandler(async (event) => {
  var _a;
  try {
    const user = await requireAuth(event);
    const productId = (_a = event.context.params) == null ? void 0 : _a.id;
    const updates = await readBody(event);
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: "Product ID is required"
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw createError({
        statusCode: 404,
        message: "Product not found"
      });
    }
    if (product.sellerId.toString() !== user.userId) {
      throw createError({
        statusCode: 403,
        message: "Not authorized to update this product"
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const _id__put$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$2
});

const add_post = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const formData = await readMultipartFormData(event);
    console.log("FormData received:", formData);
    if (!formData || formData.length === 0) throw new Error("No form data received");
    const uploadDir = path.join(process.cwd(), "public/uploads/products");
    await promises.mkdir(uploadDir, { recursive: true });
    const productData = {};
    const images = [];
    for (const field of formData) {
      console.log("Field:", field);
      if (field.filename) {
        console.log("Detected file field:", field.filename);
        const filename = `${Date.now()}-${field.filename}`;
        const filepath = path.join(uploadDir, filename);
        console.log("Saving file to:", filepath);
        try {
          await promises.writeFile(filepath, field.data);
          console.log("File saved successfully:", filename);
        } catch (err) {
          console.error("File write error:", err);
        }
        images.push(`/uploads/products/${filename}`);
      } else {
        if (field.name) {
          productData[field.name] = field.data.toString();
        }
      }
    }
    if (!productData.name || !productData.description || !productData.price) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields"
      });
    }
    const product = await Product.create({
      ...productData,
      images,
      sellerId: user.userId,
      price: Number(productData.price),
      stock: Number(productData.stock)
    });
    return {
      statusCode: 201,
      message: "Product created successfully",
      product
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error creating product"
    });
  }
});

const add_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: add_post
});

const compare_post = defineEventHandler(async (event) => {
  try {
    const { productIds } = await readBody(event);
    if (!Array.isArray(productIds) || productIds.length < 2) {
      throw createError({
        statusCode: 400,
        message: "Au moins deux produits sont requis pour la comparaison"
      });
    }
    const products = await Product.find({
      _id: { $in: productIds }
    }).populate("sellerId", "fullName location rating");
    const comparison = {
      products: products.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category,
        location: p.location,
        seller: p.sellerId,
        stock: p.stock,
        rating: p.rating
      })),
      differences: {
        price: {
          min: Math.min(...products.map((p) => p.price)),
          max: Math.max(...products.map((p) => p.price)),
          difference: Math.max(...products.map((p) => p.price)) - Math.min(...products.map((p) => p.price))
        }
      }
    };
    return comparison;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la comparaison des produits"
    });
  }
});

const compare_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: compare_post
});

const deleteAll$2 = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event);
    if (user.role !== "admin") {
      throw createError({
        statusCode: 403,
        message: "Only administrators can delete all products"
      });
    }
    const result = await Product.deleteMany({});
    return {
      message: `${result.deletedCount} products deleted successfully`
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const deleteAll$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: deleteAll$2
});

const list_get$4 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const {
      category,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = query;
    const filter = {};
    if (category) filter.category = category;
    if (location) filter.location = location;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter).populate("sellerId", "fullName location").skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Product.countDocuments(filter);
    return {
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const list_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list_get$4
});

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["pending", "completed", "canceled"],
    default: "pending"
  }
}, { timestamps: true });
const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);

const list_get$2 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const { sellerId, buyerId, page = 1, limit = 10 } = query;
    const filter = {};
    if (sellerId) filter.sellerId = sellerId;
    if (buyerId) filter.buyerId = buyerId;
    const skip = (Number(page) - 1) * Number(limit);
    const sales = await Sale.find(filter).populate("productId", "name price images").populate("buyerId", "fullName email").skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await Sale.countDocuments(filter);
    return {
      sales,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };
  } catch (error) {
    console.error("Erreur API /api/sales/list:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const list_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list_get$2
});

const _id__delete$2 = defineEventHandler(async (event) => {
  var _a;
  try {
    const user = await requireAuth$1(event);
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Transaction ID is required"
      });
    }
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw createError({
        statusCode: 404,
        message: "Transaction not found"
      });
    }
    if (user.role !== "admin" && transaction.buyerId.toString() !== user.userId && transaction.sellerId.toString() !== user.userId) {
      throw createError({
        statusCode: 403,
        message: "Not authorized to delete this transaction"
      });
    }
    await Transaction.findByIdAndDelete(id);
    return {
      message: "Transaction deleted successfully"
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const _id__delete$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$2
});

const index_get = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const query = getQuery$1(event);
    const { role } = query;
    const filter = {};
    if (role === "buyer") {
      filter.buyerId = user.userId;
    } else if (role === "producer") {
      filter.sellerId = user.userId;
    } else if (user.role !== "admin") {
      filter.$or = [{ buyerId: user.userId }, { sellerId: user.userId }];
    }
    const transactions = await Transaction.find(filter).populate("buyerId", "fullName email").populate("sellerId", "fullName email").populate("productId").sort({ createdAt: -1 });
    return transactions;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const index_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get
});

const index_post = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const query = getQuery$1(event);
    const { role } = query;
    const filter = {};
    if (role === "buyer") {
      filter.buyerId = user.userId;
    } else if (role === "producer") {
      filter.sellerId = user.userId;
    } else if (user.role !== "admin") {
      filter.$or = [{ buyerId: user.userId }, { sellerId: user.userId }];
    }
    const transactions = await Transaction.find(filter).populate("buyerId", "fullName email").populate("sellerId", "fullName email").populate("productId").sort({ createdAt: -1 });
    return transactions;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const index_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post
});

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  try {
    const currentUser = await requireAuth(event);
    const userId = (_a = event.context.params) == null ? void 0 : _a.id;
    if (currentUser.role !== "admin" && currentUser.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: "Not authorized to delete this user"
      });
    }
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "User ID is required"
      });
    }
    const user = await User$1.findByIdAndDelete(userId);
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found"
      });
    }
    return {
      message: "User deleted successfully"
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const _id__delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete
});

const _id__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const currentUser = await requireAuth(event);
    const userId = (_a = event.context.params) == null ? void 0 : _a.id;
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "User ID is required"
      });
    }
    if (currentUser.role !== "admin" && currentUser.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: "Not authorized to access this user information"
      });
    }
    const user = await User$1.findById(userId).select("-password");
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found"
      });
    }
    return user;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const _id__get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get
});

const _id__put = defineEventHandler(async (event) => {
  const id = event.context.params.id;
  const body = await readBody(event);
  try {
    if (body.password) {
      body.password = await hashPassword(body.password);
    }
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true }).select("-password");
    if (!updatedUser) {
      throw createError({ statusCode: 404, message: "Utilisateur non trouv\xE9" });
    }
    return updatedUser;
  } catch (error) {
    throw createError({ statusCode: error.statusCode || 500, message: error.message });
  }
});

const _id__put$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put
});

const role_put = defineEventHandler(async (event) => {
  var _a;
  try {
    const currentUser = await requireAuth$1(event);
    if (currentUser.role !== "admin") {
      throw createError({
        statusCode: 403,
        message: "Seuls les administrateurs peuvent modifier les r\xF4les"
      });
    }
    const userId = (_a = event.context.params) == null ? void 0 : _a.id;
    const { role } = await readBody(event);
    if (!userId || !role) {
      throw createError({
        statusCode: 400,
        message: "ID utilisateur et r\xF4le requis"
      });
    }
    const user = await User$1.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "Utilisateur non trouv\xE9"
      });
    }
    return user;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la modification du r\xF4le"
    });
  }
});

const role_put$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: role_put
});

const avatar_patch = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const formData = await readMultipartFormData(event);
    if (!formData || !formData[0]) {
      throw createError({
        statusCode: 400,
        message: "No file uploaded"
      });
    }
    const file = formData[0];
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
    await promises.mkdir(uploadDir, { recursive: true });
    const filename = `${user.userId}-${Date.now()}${path.extname(file.filename || ".jpg")}`;
    const filepath = path.join(uploadDir, filename);
    await promises.writeFile(filepath, file.data);
    const avatarUrl = `/uploads/avatars/${filename}`;
    const updatedUser = await User$1.findByIdAndUpdate(
      user.userId,
      { avatarUrl },
      { new: true }
    ).select("-password");
    return updatedUser;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const avatar_patch$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: avatar_patch
});

const deleteAll = defineEventHandler(async (event) => {
  try {
    const user = await getUserFromToken(event);
    if (!user || user.role !== "admin") {
      throw createError({
        statusCode: 403,
        message: "Acc\xE8s refus\xE9. Seul un administrateur peut effectuer cette action."
      });
    }
    await User$1.deleteMany({ role: { $ne: "admin" } });
    await Product.deleteMany({});
    return {
      message: "Tous les utilisateurs (sauf admin) et produits ont \xE9t\xE9 supprim\xE9s"
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur interne du serveur"
    });
  }
});

const deleteAll$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: deleteAll
});

const list_get = defineEventHandler(async (event) => {
  try {
    const currentUser = await requireAuth(event);
    if (currentUser.role !== "admin") {
      throw createError({
        statusCode: 403,
        message: "Only administrators can list users"
      });
    }
    const query = getQuery$1(event);
    const {
      userType,
      status,
      search,
      page = 1,
      limit = 10
    } = query;
    const filter = {};
    if (userType) filter.userType = userType;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const users = await User$1.find(filter).select("-password").skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await User$1.countDocuments(filter);
    return {
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const list_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list_get
});

const profile_get = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const profile = await User$1.findById(user.userId).select("-password");
    if (!profile) {
      throw createError({
        statusCode: 404,
        message: "Profile not found"
      });
    }
    return profile;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error"
    });
  }
});

const profile_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: profile_get
});

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caract\xE8res"),
  fullName: z.string().min(2, "Le nom complet est requis"),
  phone: z.string().min(8, "Num\xE9ro de t\xE9l\xE9phone invalide"),
  userType: z.enum(["producer", "buyer"])
});
z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe invalide")
});
z.object({
  name: z.string().min(2, "Le nom du produit est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caract\xE8res"),
  price: z.number().min(0, "Le prix doit \xEAtre positif"),
  category: z.string(),
  location: z.string(),
  stock: z.number().min(0, "Le stock doit \xEAtre positif"),
  images: z.array(z.string()).optional()
});
const validateData = (schema, data) => {
  return schema.parse(data);
};

const register_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = validateData(registerSchema, body);
    const existingUser = await User$1.findOne({ email: validatedData.email });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Cet email est d\xE9j\xE0 utilis\xE9"
      });
    }
    const user = await User$1.create({
      ...validatedData,
      password: await hashPassword(validatedData.password),
      status: "active"
    });
    return {
      message: "Inscription r\xE9ussie",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'inscription"
    });
  }
});

const register_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: register_post
});

const roles_get = defineEventHandler(async (event) => {
  try {
    await requireAuth$1(event);
    const roles = [
      {
        id: "admin",
        name: "Administrateur",
        permissions: ["all"]
      },
      {
        id: "producer",
        name: "Producteur",
        permissions: ["create_product", "edit_product", "delete_product"]
      },
      {
        id: "buyer",
        name: "Acheteur",
        permissions: ["view_product", "create_order"]
      },
      {
        id: "transport",
        name: "Transporteur",
        permissions: ["view_delivery", "update_delivery"]
      }
    ];
    return roles;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la r\xE9cup\xE9ration des r\xF4les"
    });
  }
});

const roles_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: roles_get
});

const stats_get = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const stats = {};
    if (user.userType === "producer") {
      stats.productsCount = await Product.countDocuments({ sellerId: user.userId });
      stats.salesCount = await Transaction.countDocuments({ sellerId: user.userId, status: "completed" });
    } else if (user.userType === "buyer") {
      stats.purchasesCount = await Transaction.countDocuments({ buyerId: user.userId, status: "completed" });
    }
    return stats;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Error fetching user stats"
    });
  }
});

const stats_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: stats_get
});

const topup_post = defineEventHandler(async (event) => {
  try {
    const user = await requireAuth$1(event);
    const { amount, paymentMethod } = await readBody(event);
    if (!amount || amount < 500) {
      throw createError({
        statusCode: 400,
        message: "Montant minimum de 500 FCFA requis"
      });
    }
    const transaction = await Transaction.create({
      userId: user.userId,
      type: "topup",
      amount,
      status: "pending",
      paymentMethod
    });
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    await Promise.all([
      Transaction.findByIdAndUpdate(transaction._id, { status: "completed" }),
      User$1.findByIdAndUpdate(user.userId, { $inc: { balance: amount } })
    ]);
    return {
      message: "Rechargement effectu\xE9 avec succ\xE8s",
      transactionId: transaction._id
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors du rechargement"
    });
  }
});

const topup_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: topup_post
});

const Vue3 = version[0] === "3";

function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref) {
  if (ref instanceof Promise || ref instanceof Date || ref instanceof RegExp)
    return ref;
  const root = resolveUnref(ref);
  if (!ref || !root)
    return root;
  if (Array.isArray(root))
    return root.map((r) => resolveUnrefHeadInput(r));
  if (typeof root === "object") {
    const resolved = {};
    for (const k in root) {
      if (!Object.prototype.hasOwnProperty.call(root, k)) {
        continue;
      }
      if (k === "titleTemplate" || k[0] === "o" && k[1] === "n") {
        resolved[k] = unref(root[k]);
        continue;
      }
      resolved[k] = resolveUnrefHeadInput(root[k]);
    }
    return resolved;
  }
  return root;
}

const VueReactivityPlugin = defineHeadPlugin({
  hooks: {
    "entries:resolve": (ctx) => {
      for (const entry of ctx.entries)
        entry.resolvedInput = resolveUnrefHeadInput(entry.input);
    }
  }
});

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      if (Vue3) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
      }
    }
  };
  return plugin.install;
}
function createServerHead(options = {}) {
  const head = createServerHead$1(options);
  head.use(VueReactivityPlugin);
  head.install = vueInstall(head);
  return head;
}

const unheadPlugins = true ? [CapoPlugin({ track: true })] : [];

const renderSSRHeadOptions = {"omitLineBreaks":false};

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const getClientManifest = () => import('file://C:/Users/thier/Documents/agroproject/.nuxt/dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getServerEntry = () => import('file://C:/Users/thier/Documents/agroproject/.nuxt/dist/server/server.mjs').then((r) => r.default || r);
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules = ssrContext.modules || /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
const ISLAND_SUFFIX_RE = /\.json(\?.*)?$/;
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const PAYLOAD_URL_RE = /\/_payload.json(\?.*)?$/ ;
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && ssrError.statusCode) {
    ssrError.statusCode = Number.parseInt(ssrError.statusCode);
  }
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const isRenderingIsland = event.path.startsWith("/__nuxt_island");
  const islandContext = isRenderingIsland ? await getIslandContext(event) : undefined;
  let url = ssrError?.url || islandContext?.url || event.path;
  const isRenderingPayload = PAYLOAD_URL_RE.test(url) && !isRenderingIsland;
  if (isRenderingPayload) {
    url = url.substring(0, url.lastIndexOf("/")) || "/";
    event._path = url;
    event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  const head = createServerHead({
    plugins: unheadPlugins
  });
  const headEntryOptions = { mode: "server" };
  if (!isRenderingIsland) {
    head.push(appHead, headEntryOptions);
  }
  const ssrContext = {
    url,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || routeOptions.ssr === false && !isRenderingIsland || (false),
    head,
    error: !!ssrError,
    nuxt: undefined,
    /* NuxtApp */
    payload: ssrError ? { error: ssrError } : {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set(),
    islandContext
  };
  const renderer = ssrContext.noSSR ? await getSPARenderer() : await getSSRRenderer();
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response2 = renderPayloadResponse(ssrContext);
    return response2;
  }
  const inlinedStyles = isRenderingIsland ? await renderInlineStyles(ssrContext.modules ?? []) : [];
  const NO_SCRIPTS = routeOptions.experimentalNoScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest) {
    head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    head.push({ style: inlinedStyles });
  }
  {
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (!isRenderingIsland || resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      head.push({ link }, headEntryOptions);
    }
  }
  if (!NO_SCRIPTS && !isRenderingIsland) {
    head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.experimentalNoScripts && !isRenderingIsland) {
    head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition: "head",
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(head, renderSSRHeadOptions);
  const htmlContext = {
    island: isRenderingIsland,
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  if (isRenderingIsland && islandContext) {
    const islandHead = {};
    for (const entry of head.headEntries()) {
      for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
        const currentValue = islandHead[key];
        if (Array.isArray(currentValue)) {
          currentValue.push(...value);
        }
        islandHead[key] = value;
      }
    }
    islandHead.link ||= [];
    islandHead.style ||= [];
    const islandResponse = {
      id: islandContext.id,
      head: islandHead,
      html: getServerComponentHTML(htmlContext.body),
      components: getClientIslandResponse(ssrContext),
      slots: getSlotIslandResponse(ssrContext)
    };
    await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
    const response2 = {
      body: JSON.stringify(islandResponse, null, 2),
      statusCode: getResponseStatus(event),
      statusMessage: getResponseStatusText(event),
      headers: {
        "content-type": "application/json;charset=utf-8",
        "x-powered-by": "Nuxt"
      }
    };
    return response2;
  }
  const response = {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
  return response;
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}
async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}
function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}
function getServerComponentHTML(body) {
  const match = body[0].match(ROOT_NODE_REGEX);
  return match?.[1] || body[0];
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=[^;]*;(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return undefined;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return undefined;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, slot] = match;
      if (!slot) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const renderer$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: renderer
});

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: styles
});

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template
});
//# sourceMappingURL=index.mjs.map
