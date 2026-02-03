(function(){

if (!window.qx)
  window.qx = {};

qx.$$start = new Date();

if (!qx.$$appRoot) {
  var strBase = null;
  var pos;
  var bootScriptElement = document.currentScript; // Everything except IE11 https://caniuse.com/#feat=document-currentscript
  if (!bootScriptElement) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.match(/index\.js/)) {
        bootScriptElement = scripts[i];
        break;
      }
    }
  }

  if (bootScriptElement) {
    strBase = bootScriptElement.src;
    pos = strBase.indexOf('?');
    if (pos > -1)
      strBase = strBase.substring(0, pos);
    pos = strBase.lastIndexOf('/');
    if (pos > -1) {
      strBase = strBase.substring(0, pos + 1);
    } else {
      strBase = "";
    }
  }
  if (!strBase) {
    strBase = document.location.href;
    pos = strBase.lastIndexOf('/');
    if (pos > -1) {
      strBase = strBase.substring(0, pos + 1);
    } else if (strBase[strBase.length - 1] != '/') {
      strBase += "/";
    }
    if (qx.$$appRoot) {
      strBase += qx.$$appRoot;
      if (strBase[strBase.length - 1] != '/') {
        strBase += "/";
      }
    }
  }
  qx.$$appRoot = strBase;
} else {
  if (qx.$$appRoot[qx.$$appRoot.length - 1] != "/")
    qx.$$appRoot += "/";
}
qx.$$resourceRoot = qx.$$appRoot;

if (!qx.$$environment)
  qx.$$environment = {};

var envinfo = {
  "qx.application": "qxapp.Application",
  "qx.revision": "",
  "qx.theme": "ville.cssuc.theme.blankslate.Theme",
  "qx.libraryInfoMap": {
    "qx": {
      "name": "qooxdoo framework",
      "summary": "The qooxdoo framework library",
      "description": "This library contains the qooxdoo Javascript framework classes for website, mobile, desktop and server.",
      "keywords": [
        "qooxdoo",
        "framework",
        "widget",
        "cross-browser",
        "ajax"
      ],
      "homepage": "http://qooxdoo.org",
      "license": "MIT",
      "authors": [
        {
          "name": "Alexander Steitz (asteitz)",
          "email": "alexander DOT steitz AT 1und1 DOT de"
        },
        {
          "name": "Christopher Zündorf (czuendorf)",
          "email": "christopher DOT zuendorf AT 1und1 DOT de"
        },
        {
          "name": "Daniel Wagner (danielwagner)",
          "email": "daniel DOT wagner AT 1und1 DOT de"
        },
        {
          "name": "Derrell Lipman (derrell)",
          "email": "derrell DOT lipman AT unwireduniverse DOT com"
        },
        {
          "name": "Andreas Ecker (ecker)",
          "email": "andreas DOT ecker AT 1und1 DOT de"
        },
        {
          "name": "Christian Hagendorn (Hagendorn)",
          "email": "christian DOT hagendorn AT 1und1 DOT de"
        },
        {
          "name": "Mustafa Sak (msak)",
          "email": "Mustafa DOT Sak AT 1und1 DOT de"
        },
        {
          "name": "Thomas Herchenröder (thron7)",
          "email": "thron7 AT users DOT sourceforge DOT net"
        },
        {
          "name": "Tino Butz (tjbutz)",
          "email": "tino DOT butz AT 1und1 DOT de"
        },
        {
          "name": "Tristan Koch (trkoch)",
          "email": "tristan DOT koch AT 1und1 DOT de"
        },
        {
          "name": "Martin Wittemann (wittemann)",
          "email": "martin DOT wittemann AT 1und1 DOT de"
        },
        {
          "name": "John Spackman (johnspackman)",
          "email": "john.spackman@zenesis.com"
        },
        {
          "name": "Christian Boulanger (cboulanger)",
          "email": "info@bibliograph.org"
        },
        {
          "name": "Henner Kollmann (hkollmann)",
          "email": "Henner.Kollmann.gmx.de"
        },
        {
          "name": "Tobias Oetiker (oetiker)",
          "email": "tobi@oetiker.ch"
        },
        {
          "name": "Dietrich Streifert (level420)",
          "email": "dietrich.streifert@visionet.de"
        }
      ],
      "version": "7.9.2",
      "sourceViewUri": "https://github.com/qooxdoo/qooxdoo/blob//framework/source/class/#L"
    },
    "qxapp": {
      "name": "qxapp",
      "summary": "",
      "description": "",
      "homepage": "",
      "license": "MIT license",
      "authors": [
        {
          "name": "Chris Eskew",
          "email": "sqville@gmail.com"
        }
      ],
      "version": "1.0.0"
    }
  },
  "true": true,
  "qx.allowUrlSettings": false,
  "qx.allowUrlVariants": false,
  "qx.debug.property.level": 0,
  "qx.debug": true,
  "qx.debug.ui.queue": true,
  "qx.debug.touchpad.detection": false,
  "qx.aspects": false,
  "qx.dynlocale": true,
  "qx.dyntheme": false,
  "qx.blankpage": "qx/static/blank.html",
  "qx.debug.databinding": false,
  "qx.debug.dispose": false,
  "qx.optimization.basecalls": false,
  "qx.optimization.comments": false,
  "qx.optimization.privates": false,
  "qx.optimization.strings": false,
  "qx.optimization.variables": false,
  "qx.optimization.variants": false,
  "module.databinding": true,
  "module.logger": true,
  "module.property": true,
  "module.events": true,
  "qx.nativeScrollBars": true,
  "qx.automaticMemoryManagement": true,
  "qx.promise": true,
  "qx.promise.warnings": true,
  "qx.promise.longStackTraces": true,
  "qx.compiler": true,
  "qx.compiler.version": "7.9.2",
  "ville.cssuc": true,
  "qx.version": "7.9.2",
  "qx.compiler.targetType": "source",
  "qx.compiler.outputDir": "../../public/compiled/source/",
  "qx.target.privateArtifacts": false,
  "qx.headless": false,
  "qx.compiler.applicationName": "qxapp",
  "qx.compiler.applicationType": "browser"
};
for (var k in envinfo)
  qx.$$environment[k] = envinfo[k];

if (!qx.$$libraries)
  qx.$$libraries = {};
[
  "qx",
  "qxapp"
].forEach(function(ns) {
   qx.$$libraries[ns] = {
     sourceUri: qx.$$appRoot + "../transpiled/",
     resourceUri: qx.$$appRoot + "../resource"
   }
});

qx.$$resources = {};
qx.$$translations = {
  "C": null,
  "en": null
};
qx.$$locales = {
  "C": null,
  "en": null
};
qx.$$packageData = {};
qx.$$g = {};
qx.$$createdAt = function (obj, filename, lineNumber, column, verbose) {
  if (obj && obj.hasOwnProperty && !obj.hasOwnProperty("$$createdAt")) {
    var value = {
      filename: filename,
      lineNumber: lineNumber,
      column: column
    };
    var stack = new Error().stack;
    if (verbose && !!stack) {
      Object.assign(value, { stack: stack.split("\n").slice(2).map(line => line.trim()) });
    }
    Object.defineProperty(obj, "$$createdAt", {
      value: value,
      enumerable: false,
      configurable: false,
      writable: false
    });
  }
  return obj;
};

var isWebkit = /AppleWebKit\/([^ ]+)/.test(navigator.userAgent);
var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

qx.$$loader = {
  parts : {
  "boot": [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44"
  ],
  "Welcome": [
    "45"
  ],
  "Dashboard": [
    "46"
  ],
  "appshell": [
    "47"
  ],
  "auth.Login": [
    "48"
  ],
  "auth.Register": [
    "49"
  ],
  "auth.ForgotPassword": [
    "50"
  ],
  "settings": [
    "51"
  ]
},
  packages : {
  "0": {
    "uris": [
      "package-0.js",
      "polyfill.js",
      "commonjs-browserify.js"
    ]
  },
  "1": {
    "uris": [
      "package-1.js"
    ]
  },
  "2": {
    "uris": [
      "../transpiled/ville/ui/root/Application.js",
      "../transpiled/ville/cssuc/MControl.js",
      "../transpiled/ville/cssuc/MCssUtilityClass.js",
      "../transpiled/ville/cssuc/patch/MLabel.js"
    ]
  },
  "3": {
    "uris": [
      "package-3.js"
    ]
  },
  "4": {
    "uris": [
      "../transpiled/ville/ui/application/Standalone.js",
      "../transpiled/qxapp/Application.js"
    ]
  },
  "5": {
    "uris": [
      "package-5.js"
    ]
  },
  "6": {
    "uris": [
      "../transpiled/qxWeb.js"
    ]
  },
  "7": {
    "uris": [
      "package-7.js"
    ]
  },
  "8": {
    "uris": [
      "../transpiled/ville/cssuc/patch/MAbstractField.js"
    ]
  },
  "9": {
    "uris": [
      "package-9.js"
    ]
  },
  "10": {
    "uris": [
      "../transpiled/ville/ui/core/MWidget.js",
      "../transpiled/ville/ui/core/Widget.js"
    ]
  },
  "11": {
    "uris": [
      "package-11.js"
    ]
  },
  "12": {
    "uris": [
      "../transpiled/ville/ui/basic/Element.js"
    ]
  },
  "13": {
    "uris": [
      "package-13.js"
    ]
  },
  "14": {
    "uris": [
      "../transpiled/ville/ui/layout/Stack.js",
      "../transpiled/qxapp/Routing.js",
      "../transpiled/ville/ui/layout/Container.js"
    ]
  },
  "15": {
    "uris": [
      "package-15.js"
    ]
  },
  "16": {
    "uris": [
      "../transpiled/ville/ui/core/Box.js",
      "../transpiled/ville/ui/layout/HGroup.js"
    ]
  },
  "17": {
    "uris": [
      "package-17.js"
    ]
  },
  "18": {
    "uris": [
      "../transpiled/ville/ui/form/UnstyledToggleButton.js",
      "../transpiled/ville/ui/form/NavLink.js",
      "../transpiled/ville/ui/menu/Menu.js"
    ]
  },
  "19": {
    "uris": [
      "package-19.js"
    ]
  },
  "20": {
    "uris": [
      "../transpiled/ville/ui/menu/NavLink.js"
    ]
  },
  "21": {
    "uris": [
      "package-21.js"
    ]
  },
  "22": {
    "uris": [
      "../transpiled/ville/ui/menu/Button.js"
    ]
  },
  "23": {
    "uris": [
      "package-23.js"
    ]
  },
  "24": {
    "uris": [
      "../transpiled/ville/ui/form/MenuButton.js"
    ]
  },
  "25": {
    "uris": [
      "package-25.js"
    ]
  },
  "26": {
    "uris": [
      "../transpiled/ville/ui/layout/VStack.js",
      "../transpiled/qxapp/app/SettingsView.js"
    ]
  },
  "27": {
    "uris": [
      "package-27.js"
    ]
  },
  "28": {
    "uris": [
      "../transpiled/ville/ui/basic/Label.js",
      "../transpiled/ville/ui/core/InnerWrapper.js",
      "../transpiled/ville/ui/typography/Title.js",
      "../transpiled/ville/ui/typography/Text.js"
    ]
  },
  "29": {
    "uris": [
      "package-29.js"
    ]
  },
  "30": {
    "uris": [
      "../transpiled/ville/ui/layout/Flex.js",
      "../transpiled/qxapp/pages/MPage.js",
      "../transpiled/ville/ui/form/Anchor.js",
      "../transpiled/ville/ui/layout/Center.js"
    ]
  },
  "31": {
    "uris": [
      "package-31.js"
    ]
  },
  "32": {
    "uris": [
      "../transpiled/ville/ui/form/TextField.js"
    ]
  },
  "33": {
    "uris": [
      "package-33.js"
    ]
  },
  "34": {
    "uris": [
      "../transpiled/ville/ui/form/PasswordField.js",
      "../transpiled/ville/ui/icon/Abstract.js",
      "../transpiled/ville/ui/icon/IconCheck.js",
      "../transpiled/ville/ui/icon/IconIndeterminate.js"
    ]
  },
  "35": {
    "uris": [
      "package-35.js"
    ]
  },
  "36": {
    "uris": [
      "../transpiled/ville/ui/form/CheckBox.js",
      "../transpiled/ville/ui/form/UnstyledButton.js",
      "../transpiled/ville/ui/form/Button.js"
    ]
  },
  "37": {
    "uris": [
      "package-37.js"
    ]
  },
  "38": {
    "uris": [
      "../transpiled/ville/ui/form/renderer/AbstractRenderer.js",
      "../transpiled/qxapp/components/form/renderer/LoginForm.js"
    ]
  },
  "39": {
    "uris": [
      "package-39.js"
    ]
  },
  "40": {
    "uris": [
      "../transpiled/ville/ui/form/Label.js",
      "../transpiled/ville/ui/core/BaseWidget.js",
      "../transpiled/ville/ui/form/TextFieldWrapper.js",
      "../transpiled/ville/ui/icon/IconEye.js",
      "../transpiled/ville/ui/icon/IconEyeOff.js",
      "../transpiled/ville/ui/form/ToggleActionIcon.js",
      "../transpiled/ville/ui/form/PasswordWrapper.js"
    ]
  },
  "41": {
    "uris": [
      "package-41.js"
    ]
  },
  "42": {
    "uris": [
      "../transpiled/ville/ui/form/InputSection.js",
      "../transpiled/ville/ui/tabview/Page.js"
    ]
  },
  "43": {
    "uris": [
      "package-43.js"
    ]
  },
  "44": {
    "uris": [
      "../transpiled/ville/ui/tabview/TabButton.js",
      "../transpiled/ville/cssuc/theme/blankslate/Color.js",
      "../transpiled/ville/cssuc/theme/blankslate/Decoration.js",
      "../transpiled/ville/cssuc/theme/blankslate/Font.js",
      "../transpiled/ville/cssuc/theme/blankslate/Icon.js",
      "../transpiled/ville/cssuc/theme/blankslate/Appearance.js",
      "../transpiled/ville/cssuc/theme/blankslate/Theme.js"
    ]
  },
  "45": {
    "uris": [
      "../transpiled/qxapp/pages/Welcome.js"
    ]
  },
  "46": {
    "uris": [
      "../transpiled/qxapp/pages/Dashboard.js"
    ]
  },
  "47": {
    "uris": [
      "../transpiled/qxapp/app/AppShell.js"
    ]
  },
  "48": {
    "uris": [
      "../transpiled/qxapp/pages/auth/Login.js"
    ]
  },
  "49": {
    "uris": [
      "../transpiled/qxapp/pages/auth/Register.js"
    ]
  },
  "50": {
    "uris": [
      "../transpiled/qxapp/pages/auth/ForgotPassword.js"
    ]
  },
  "51": {
    "uris": [
      "../transpiled/qxapp/pages/settings/Appearance.js",
      "../transpiled/qxapp/pages/settings/Password.js",
      "../transpiled/qxapp/pages/settings/Profile.js"
    ]
  }
},
  urisBefore : [],
  cssBefore : [
  "../resource/mantine/core/styles/baseline.css",
  "../resource/mantine/core/styles/default-css-variables.css",
  "../resource/mantine/core/styles/global.css",
  "../resource/mantine/core/styles/Container.css",
  "../resource/mantine/core/styles/Group.css",
  "../resource/mantine/core/styles/UnstyledButton.css",
  "../resource/mantine/core/styles/NavLink.css",
  "../resource/mantine/core/styles/Popover.css",
  "../resource/mantine/core/styles/Menu.css",
  "../resource/mantine/core/styles/Button.css",
  "../resource/mantine/core/styles/Stack.css",
  "../resource/mantine/core/styles/InlineInput.css",
  "../resource/mantine/core/styles/Title.css",
  "../resource/mantine/core/styles/Text.css",
  "../resource/mantine/core/styles/Flex.css",
  "../resource/mantine/core/styles/Anchor.css",
  "../resource/mantine/core/styles/Center.css",
  "../resource/mantine/core/styles/Input.css",
  "../resource/mantine/core/styles/PasswordInput.css",
  "../resource/mantine/core/styles/Checkbox.css",
  "../resource/mantine/core/styles/ActionIcon.css",
  "../resource/qxapp/welcome-qxvui-01.css",
  "../resource/mantine/core/styles/AppShell.css",
  "../resource/qxapp/appshell-qxvui-inline-01.css"
],
  boot : "boot",
  closureParts : {},
  bootIsInline : false,
  addNoCacheParam : false,
  isLoadParallel: !isIE11 && 'async' in document.createElement('script'),
  delayDefer: true,
  splashscreen: window.QOOXDOO_SPLASH_SCREEN || null,
  isLoadChunked: false,
  loadChunkSize: null,

  decodeUris : function(compressedUris, pathName) {
    if (!pathName)
      pathName = "sourceUri";
    var libs = qx.$$libraries;
    var uris = [];
    for (var i = 0; i < compressedUris.length; i++) {
      var uri = compressedUris[i].split(":");
      var euri;
      if (uri.length > 2) {
        uri.shift();
        euri = uri.join(":");
      } else {
        euri = qx.$$appRoot + compressedUris[i];
      }
      if (qx.$$loader.addNoCacheParam) {
        euri += "?nocache=" + Math.random();
      }
      
      uris.push(euri);
    }
    return uris;
  },

  deferredEvents: null,

  /*
   * Adds event handlers
   */
  on: function(eventType, handler) {
    if (qx.$$loader.applicationHandlerReady) {
      if (window.qx && qx.event && qx.event.handler && qx.event.handler.Application) {
        var Application = qx.event.handler.Application.$$instance;
        if (eventType == "ready" && Application.isApplicationReady()) {
          handler(null);
          return;
        } else if (eventType == "appinitialized" && Application.isApplicationInitialized()) {
          handler(null);
          return;
        }
      }
      qx.event.Registration.addListener(window, eventType, handler);
      return;
    }
    
    if (this.deferredEvents === null)
      this.deferredEvents = {};
    var handlers = this.deferredEvents[eventType];
    if (handlers === undefined)
      handlers = this.deferredEvents[eventType] = [];
    handlers.push({ eventType: eventType, handler: handler });
  },
  
  /*
   * Startup handler, hooks into Qooxdoo proper
   */
  signalStartup: function () {
    qx.Bootstrap.executePendingDefers();
    qx.$$loader.delayDefer = false;
    qx.$$loader.scriptLoaded = true;
    function done() {
      if (window.qx && qx.event && qx.event.handler && qx.event.handler.Application) {
        if (qx.$$loader.deferredEvents) {
          Object.keys(qx.$$loader.deferredEvents).forEach(function(eventType) {
            var handlers = qx.$$loader.deferredEvents[eventType];
            handlers.forEach(function(handler) {
              qx.event.Registration.addListener(window, eventType, handler.handler);
            });
          });
        }
        
        qx.event.handler.Application.onScriptLoaded();
        qx.$$loader.applicationHandlerReady = true;
      } else {
        if (qx.$$loader.deferredEvents) {
          Object.keys(qx.$$loader.deferredEvents).forEach(function(eventType) {
            if (eventType === "ready") {
              qx.$$loader.deferredEvents[eventType].forEach(function(handler) {
                handler.handler(null);
              });
            }
          });
        }
        qx.$$loader.applicationHandlerReady = true;
      }
    }
    if (qx.Class.$$brokenClassDefinitions) {
      console.error("**************\n" + 
        "One or more class definitions did not load properly - please see error messages above for details.\n" + 
        "It is probable that your application will have unexpected errors.  Please fix the class problems above before continuing.\n" + 
        "**************");
    } else if (qx.$$loader.splashscreen) {
      qx.$$loader.splashscreen.loadComplete(done);
    } else {
      done();
    }
  },

  /*
   * Starts the whole loading process
   */
  init: function(){
    var l = qx.$$loader;
    l.decodeUris(l.cssBefore, "resourceUri").forEach(function(uri) {
      loadCss(uri);
    });
    allScripts = l.decodeUris(l.urisBefore, "resourceUri");
    if (!l.bootIsInline) {
      l.parts[l.boot].forEach(function(pkg) {
        var add = l.decodeUris(l.packages[pkg].uris);
        Array.prototype.push.apply(allScripts, add);
      });
    }

    function begin() {
      flushScriptQueue(function(){
        // Opera needs this extra time to parse the scripts
        window.setTimeout(function(){
          l.parts[l.boot].forEach(function(pkg) {
            l.importPackageData(qx.$$packageData[pkg] || {});
          });
          l.signalStartup();
        }, 0);
      });
    }

    if (qx.$$loader.splashscreen)
      qx.$$loader.splashscreen.loadBegin(begin);
    else
      begin();
  }
};

/*
 * Collect URL parameters
 */
var URL_PARAMETERS = {}
if (document.location.search) {
  var args = document.location.search.substring(1).split('&');
  args.forEach(function(arg) {
    var match = arg.match(/^qooxdoo\:([^=]+)(=(.*))?/);
    if (match) {
      var key = match[1];
      var value = match[3];
      if (value === undefined || value === "true" || value === "1")
        value = true;
      else if (value === "false" || value === "0")
        value = false;
      URL_PARAMETERS[key] = value;
    }
  });
}

/*
 * Get settings from Splash Screen
 */
if (URL_PARAMETERS["splashscreen-disable"] === true)
  qx.$$loader.splashscreen = null;
if (qx.$$loader.splashscreen) {
  // If there's a Splash Screen, default to chunked
  qx.$$loader.isLoadChunked = true;
  var settings = qx.$$loader.splashscreen.getSettings()||{};
  if (typeof settings.isLoadChunked == "boolean")
    qx.$$loader.isLoadChunked = settings.isLoadChunked;
  if (typeof settings.loadChunkSize == "number" && settings.loadChunkSize > 1)
    qx.$$loader.loadChunkSize = settings.loadChunkSize;
}

/*
 * Override with URL parameters
 */
for (var key in URL_PARAMETERS) {
  var value = URL_PARAMETERS[key];
  switch(key) {
  case "add-no-cache":
    qx.$$loader.addNoCacheParam = value === true;
    break;

  case "load-parallel":
    qx.$$loader.isLoadParallel = value === true;
    break;

  case "load-chunked":
    qx.$$loader.isLoadChunked = value === true;
    break;
  }
}

/*
 * IE
 */
var readyStateValue = {"complete" : true};
if (document.documentMode && document.documentMode < 10 ||
    (typeof window.ActiveXObject !== "undefined" && !document.documentMode)) {
  readyStateValue["loaded"] = true;
}

/*
 * Load Javascript
 */
function loadScript(uri, callback) {
  var elem = document.createElement("script");
  elem.charset = "utf-8";
  elem.src = uri;
  elem.onreadystatechange = elem.onload = function() {
    if (!this.readyState || readyStateValue[this.readyState]) {
      elem.onreadystatechange = elem.onload = null;
      if (typeof callback === "function") {
        callback();
      }
    }
  };
  elem.onerror = function() {
    if (console && typeof console.error == "function")
      console.error("Cannot load script " + uri);
    callback && callback("Cannot load script " + uri);
  }

  if (qx.$$loader.isLoadParallel) {
    elem.async = null;
  }

  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

/*
 * Load CSS
 */
function loadCss(uri) {
  var elem = document.createElement("link");
  elem.rel = "stylesheet";
  elem.type= "text/css";
  elem.href= uri;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

/*
 * Used during initialisation and by `qx.io.part.Package` to load data for parts
 */
qx.$$loader.importPackageData = function (dataMap, callback) {
  if (dataMap["resources"]) {
    var resMap = dataMap["resources"];
    for (var k in resMap)
      qx.$$resources[k] = resMap[k];
  }
  if (dataMap["locales"]) {
    var locMap = dataMap["locales"];
    var qxlocs = qx.$$locales;
    for (var lang in locMap) {
      if (!qxlocs[lang])
        qxlocs[lang] = locMap[lang];
      else
        for (var k in locMap[lang]) qxlocs[lang][k] = locMap[lang][k];
    }
  }
  if (dataMap["translations"]) {
    var trMap   = dataMap["translations"];
    var qxtrans = qx.$$translations;
    for (var lang in trMap) {
      if (!qxtrans[lang])
        qxtrans[lang] = trMap[lang];
      else
        for (var k in trMap[lang])
          qxtrans[lang][k] = trMap[lang][k];
    }
  }
  if (callback){
    callback(dataMap);
  }
}

/*
 * Script queue
 */
var allScripts = [];
var nextScriptIndex = 0;

var flushScriptQueue =
  qx.$$loader.isLoadParallel && qx.$$loader.isLoadChunked ?
    function(callback) {
      if (nextScriptIndex >= allScripts.length)
        return callback();
      var options = {
          numScripts: allScripts.length,
          numScriptsLoaded: 0,
          numScriptsLoading: 0
      };
      var chunkSize = qx.$$loader.loadChunkSize;
      if (chunkSize === null)
        chunkSize = Math.round(options.numScripts / 20);
      if (chunkSize < 1)
        chunkSize = 1;
      function checkForEnd() {
        if (options.numScriptsLoaded == options.numScripts)
          callback && callback();
        else if (options.numScriptsLoading == 0)
          loadNextChunk();
      }
      function onLoad() {
        options.numScriptsLoaded++;
        options.numScriptsLoading--;
        if (qx.$$loader.splashscreen)
          qx.$$loader.splashscreen.scriptLoaded(options, checkForEnd);
        else
          checkForEnd();
      }
      function loadNextChunk() {
        //console.log("Loading next chunk; chunkSize=" + chunkSize + ", numScripts=" + options.numScripts + ", numScriptsLoaded=" + options.numScriptsLoaded + ", numScriptsLoading=" + options.numScriptsLoading)
        while (nextScriptIndex < allScripts.length && options.numScriptsLoading < chunkSize) {
          var uri = allScripts[nextScriptIndex++];
          options.numScriptsLoading++;
          loadScript(uri, onLoad);
        }
      }
      loadNextChunk();
    }

  : qx.$$loader.isLoadParallel ?
    function(callback) {
      if (nextScriptIndex >= allScripts.length)
        return callback();
      var options = {
          numScripts: allScripts.length,
          numScriptsLoaded: 0,
          numScriptsLoading: 0
      };
      function checkForEnd() {
        if (options.numScriptsLoaded == options.numScripts)
          callback && callback();
      }
      function onLoad() {
        options.numScriptsLoaded++;
        options.numScriptsLoading--;
        if (qx.$$loader.splashscreen)
          qx.$$loader.splashscreen.scriptLoaded(options, checkForEnd);
        else
          checkForEnd();
      }
      while (nextScriptIndex < allScripts.length) {
        var uri = allScripts[nextScriptIndex++];
        options.numScriptsLoading++;
        loadScript(uri, onLoad);
      }
    }

  :
    function(callback) {
      var options = {
          numScripts: allScripts.length,
          numScriptsLoaded: 0,
          numScriptsLoading: 1
      };
      function queueLoadNext() {
        if (isWebkit) {
          // force async, else Safari fails with a "maximum recursion depth exceeded"
          window.setTimeout(loadNext, 0);
        } else {
          loadNext();
        }
      }
      function loadNext() {
        if (nextScriptIndex >= allScripts.length)
          return callback();
        var uri = allScripts[nextScriptIndex++];
        //console.log("Loading next chunk; chunkSize=" + chunkSize + ", numScripts=" + options.numScripts + ", numScriptsLoaded=" + options.numScriptsLoaded + ", numScriptsLoading=" + options.numScriptsLoading)
        loadScript(uri, function() {
          options.numScriptsLoaded++;
          if (qx.$$loader.splashscreen)
            qx.$$loader.splashscreen.scriptLoaded(options, queueLoadNext);
          else
            queueLoadNext();
        });
      }
      loadNext();
    };

/*
 * DOM loading
 */
var fireContentLoadedEvent = function() {
  qx.$$domReady = true;
  document.removeEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
};
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
}

})();

qx.$$fontBootstrap={};

qx.$$packageData['2'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['4'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['6'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['8'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['10'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['12'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['14'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['16'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['18'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['20'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['22'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['24'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['26'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['28'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['30'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['32'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['34'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['36'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['38'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['40'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['42'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['44'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['45'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['46'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['47'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['48'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['49'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['50'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};

qx.$$packageData['51'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};



qx.$$loader.init();

