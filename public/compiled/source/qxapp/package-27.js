(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.bom.webfonts.Validator": {},
      "qx.bom.webfonts.WebFont": {},
      "qx.util.ResourceManager": {},
      "qx.lang.Array": {},
      "qx.Promise": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.Stylesheet": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "engine.version": {
          "className": "qx.bom.client.Engine"
        },
        "browser.documentmode": {
          "className": "qx.bom.client.Browser"
        },
        "browser.name": {
          "className": "qx.bom.client.Browser"
        },
        "browser.version": {
          "className": "qx.bom.client.Browser"
        },
        "os.name": {
          "className": "qx.bom.client.OperatingSystem"
        },
        "os.version": {
          "className": "qx.bom.client.OperatingSystem"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
  ************************************************************************ */

  /**
   * Loads web fonts
   */
  qx.Class.define("qx.bom.webfonts.WebFontLoader", {
    extend: qx.core.Object,
    construct(fontFamily) {
      qx.core.Object.constructor.call(this);
      this.setFontFamily(fontFamily);
      this.__validators__P_181_0 = {};
    },
    properties: {
      /** The font name that this font is known by */
      fontFamily: {
        check: "String"
      },
      /** The fontFaces which need to be defined */
      fontFaces: {
        nullable: true,
        apply: "_applyFontFaces"
      },
      /** CSS urls or paths which need to be loaded */
      css: {
        nullable: true,
        check: "Array"
      },
      /**
       * Characters that are used to test if the font has loaded properly. These
       * default to "WEei" in `qx.bom.webfont.Validator` and can be overridden
       * for certain cases like icon fonts that do not provide the predefined
       * characters.
       */
      comparisonString: {
        check: "String",
        init: null,
        nullable: true
      },
      /**
       * Version identifier that is appended to the URL to be loaded. Fonts
       * that are defined thru themes may be managed by the resource manager.
       * In this case updated fonts persist due to aggressive fontface caching
       * of some browsers. To get around this, set the `version` property to
       * the version of your font. It will be appended to the CSS URL and forces
       * the browser to re-validate.
       *
       * The version needs to be URL friendly, so only characters, numbers,
       * dash and dots are allowed here.
       */
      version: {
        check(value) {
          return value === null || typeof value === "string" && /^[a-zA-Z0-9.-]+$/.test(value);
        },
        init: null,
        nullable: true
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __fontFacesQueue__P_181_1: null,
      __fontFacesCreatedPromise__P_181_2: null,
      _validators: null,
      getValidator(fontWeight, fontStyle) {
        fontWeight = fontWeight || "normal";
        fontStyle = fontStyle || "normal";
        let id = fontWeight + "::" + fontStyle;
        let validator = this.__validators__P_181_0[id];
        if (!validator) {
          validator = this.__validators__P_181_0[id] = new qx.bom.webfonts.Validator(this.getFontFamily(), this.getComparisonString(), fontWeight, fontStyle);
          validator.setTimeout(qx.bom.webfonts.WebFont.VALIDATION_TIMEOUT);
          validator.validate();
        }
        return validator;
      },
      /**
       * Called to load the font details into the browser
       */
      async load() {
        (this.getCss() || []).forEach(url => {
          if (!url.match(/^https?:/)) {
            url = qx.util.ResourceManager.getInstance().toUri(url);
          }
          if (this.getVersion()) {
            url += url.indexOf("?") < 0 ? "?" : "&";
            url += this.getVersion();
          }
          qx.bom.webfonts.WebFontLoader.__loadStylesheet__P_181_3(url);
        });
        let fontFaces = this.getFontFaces();
        if (fontFaces) {
          fontFaces.forEach(fontFace => {
            if (fontFace.paths) {
              fontFace.paths = fontFace.paths.map(path => {
                if (!path.match(/^https?:/)) {
                  path = qx.util.ResourceManager.getInstance().toUri(path);
                }
                if (this.getVersion()) {
                  path += path.indexOf("?") < 0 ? "?" : "&";
                  path += this.getVersion();
                }
                return path;
              });
            }
          });
          this.__fontFacesQueue__P_181_1 = qx.lang.Array.clone(fontFaces);
          this.__fontFacesCreatedPromise__P_181_2 = new qx.Promise();
        }
        this.__dequeueFontFaces__P_181_4();
      },
      async promiseLoaded() {
        return await this.__fontFacesCreatedPromise__P_181_2;
      },
      /**
       * Adds the font faces in __fontFacesQueue
       */
      __dequeueFontFaces__P_181_4() {
        if (this.__fontFacesQueue__P_181_1 == null) {
          return;
        }
        let fontFace = this.__fontFacesQueue__P_181_1.pop();
        this.__addFontFace__P_181_5(fontFace);
        if (this.__fontFacesQueue__P_181_1.length == 0) {
          this.__fontFacesQueue__P_181_1 = null;
          this.__fontFacesCreatedPromise__P_181_2.resolve(true);
        }
        if (qx.core.Environment.get("engine.name") == "mshtml" && (parseInt(qx.core.Environment.get("engine.version")) < 9 || qx.core.Environment.get("browser.documentmode") < 9)) {
          // old IEs need a break in between adding @font-face rules
          setTimeout(() => this.__dequeueFontFaces__P_181_4(), 100);
        } else {
          this.__dequeueFontFaces__P_181_4();
        }
      },
      /**
       * Adds a font face definition to the browser
       *
       * @param {*} fontFace - POJO of from the array in Manifest.json
       * @returns
       */
      __addFontFace__P_181_5(fontFace) {
        let fontFamily = fontFace.fontFamily || this.getFontFamily();
        let fontLookupKey = qx.bom.webfonts.WebFontLoader.createFontLookupKey(fontFamily, fontFace.fontWeight || "normal", fontFace.fontStyle || "normal");
        if (qx.bom.webfonts.WebFontLoader.__addedFontFaces__P_181_6[fontLookupKey]) {
          return;
        }
        if (!qx.bom.webfonts.WebFontLoader.__styleSheet__P_181_7) {
          let styleSheet = qx.bom.Stylesheet.createElement();
          qx.bom.webfonts.WebFontLoader.__styleSheet__P_181_7 = styleSheet;
          {
            styleSheet.ownerNode.setAttribute("data-qx-created-by", qx.bom.webfonts.WebFontLoader.classname);
            styleSheet.ownerNode.$$qxObject = this;
          }
        }
        let sourcesMap = {};
        const MATCH_FORMAT = new RegExp(".(" + qx.bom.webfonts.WebFontLoader.getPreferredFormats().join("|") + ")");

        /*
         * When compiling a `@font-face` rule, note that the first "src:" must never specify a format
         * and that EOT must go first if there is one
         */

        let fontFaceSrcRules = [];
        for (let i = 0; i < fontFace.paths.length; i++) {
          let match = MATCH_FORMAT.exec(fontFace.paths[i]);
          if (!match) {
            continue;
          }
          let fontFormat = match[1];
          let url = fontFace.paths[i];
          if (this.getVersion()) {
            url += "?" + this.getVersion();
          }
          fontFaceSrcRules.push({
            url: url,
            format: fontFormat
          });
          if (fontFormat == "eot") {
            fontFaceSrcRules.push({
              url: url + "?#iefix'",
              format: "embedded-opentype"
            });
          }
        }
        fontFaceSrcRules = fontFaceSrcRules.sort((a, b) => {
          a.fontFormat == "embedded-opentype" ? -1 : 0;
        });
        let strSources = "src: ";
        for (let i = 0; i < fontFaceSrcRules.length; i++) {
          if (i > 0) {
            strSources += ", ";
          }
          strSources += "url('" + new URL(fontFaceSrcRules[i].url, document.baseURI).href + "')";
          if (i > 0) {
            strSources += " format('" + fontFaceSrcRules[i].format + "')";
          }
        }
        strSources += ";\n";
        let rule = "font-family: " + fontFamily + ";\n";
        rule += strSources + "\n";
        rule += "font-style: " + (fontFace.fontStyle || "normal") + ";\n";
        rule += "font-weight: " + (fontFace.fontWeight || "normal") + ";\n";
        rule = "@font-face {\n" + rule + "}\n";
        let styleSheet = qx.bom.webfonts.WebFontLoader.__styleSheet__P_181_7;
        try {
          if (qx.core.Environment.get("browser.name") == "ie" && qx.core.Environment.get("browser.documentmode") < 9) {
            let cssText = qx.bom.webfonts.WebFontLoader.__fixCssText__P_181_8(styleSheet.cssText);
            cssText += rule;
            styleSheet.cssText = cssText;
          } else {
            styleSheet.insertRule(rule, styleSheet.cssRules.length);
          }
        } catch (ex) {
          {
            this.warn("Error while adding @font-face rule:", ex.message);
            return;
          }
        }
        qx.bom.webfonts.WebFontLoader.__addedFontFaces__P_181_6[fontLookupKey] = true;
      },
      // property apply
      _applyFontFaces(fontFaces, old) {
        var families = [];
        for (var i = 0, l = fontFaces.length; i < l; i++) {
          let fontFace = fontFaces[i];
          var familyName = this._quoteFontFamily(fontFace.family || this.getFontFamily());
          if (families.indexOf(familyName) < 0) {
            families.push(familyName);
          }
        }
      },
      /**
       * Makes sure font-family names containing spaces are properly quoted
       *
       * @param familyName {String} A font-family CSS value
       * @return {String} The quoted family name
       */
      _quoteFontFamily(familyName) {
        return familyName.replace(/["']/g, "");
      }
    },
    statics: {
      /**
       * List of known font definition formats (i.e. file extensions). Used to
       * identify the type of each font file configured for a web font.
       */
      FONT_FORMATS: ["eot", "woff2", "woff", "ttf", "svg"],
      /**
       * Timeout (in ms) to wait before deciding that a web font was not loaded.
       */
      VALIDATION_TIMEOUT: 5000,
      /** @type{String[]} array of supported font formats, most preferred first */
      __preferredFormats__P_181_9: null,
      /** */
      __loadedStylesheets__P_181_10: {},
      __addedFontFaces__P_181_6: {},
      /** Loader instances indexed by font family name */
      __loaders__P_181_11: {},
      /**
       * Gets/creates a loader
       *
       * @param {String} name font family name
       * @param {Boolean?} create whether to create one if one does not exist (default to false)
       * @returns
       */
      getLoader(name, create) {
        let loader = qx.bom.webfonts.WebFontLoader.__loaders__P_181_11[name];
        if (!loader && create) {
          loader = qx.bom.webfonts.WebFontLoader.__loaders__P_181_11[name] = new qx.bom.webfonts.WebFontLoader(name);
        }
        return loader;
      },
      /**
       * Adds a stylesheet, once per url
       *
       * @param {String} url
       */
      __loadStylesheet__P_181_3(url) {
        if (qx.bom.webfonts.WebFontLoader.__loadedStylesheets__P_181_10[url]) {
          return;
        }
        qx.bom.Stylesheet.includeFile(url);
        qx.bom.webfonts.WebFontLoader.__loadedStylesheets__P_181_10[url] = true;
      },
      /**
       * Creates a lookup key to index the created fonts.
       * @param familyName {String} font-family name
       * @param fontWeight {String} the font-weight.
       * @param fontStyle {String} the font-style.
       * @return {string} the font lookup key
       */
      createFontLookupKey(familyName, fontWeight, fontStyle) {
        var lookupKey = familyName + "_" + (fontWeight ? fontWeight : "normal") + "_" + (fontStyle ? fontStyle : "normal");
        return lookupKey;
      },
      /**
       * Uses a naive regExp match to determine the format of each defined source
       * file for a webFont. Returns a map with the format names as keys and the
       * corresponding source URLs as values.
       *
       * @param sources {String[]} Array of source URLs
       * @return {Map} Map of formats and URLs
       */
      __getSourcesMap__P_181_12(sources) {
        var formats = qx.bom.webfonts.WebFontLoader.FONT_FORMATS;
        var sourcesMap = {};
        var reg = new RegExp(".(" + formats.join("|") + ")");
        for (var i = 0, l = sources.length; i < l; i++) {
          var match = reg.exec(sources[i]);
          if (match) {
            var type = match[1];
            sourcesMap[type] = sources[i];
          }
        }
        return sourcesMap;
      },
      /**
       * Returns the preferred font format(s) for the currently used browser. Some
       * browsers support multiple formats, e.g. WOFF and TTF or WOFF and EOT. In
       * those cases, WOFF is considered the preferred format.
       *
       * @return {String[]} List of supported font formats ordered by preference
       * or empty Array if none could be determined
       */
      getPreferredFormats() {
        if (qx.bom.webfonts.WebFontLoader.__preferredFormats__P_181_9) {
          return qx.bom.webfonts.WebFontLoader.__preferredFormats__P_181_9;
        }
        var preferredFormats = [];
        var browser = qx.core.Environment.get("browser.name");
        var browserVersion = qx.core.Environment.get("browser.version");
        var os = qx.core.Environment.get("os.name");
        var osVersion = qx.core.Environment.get("os.version");
        if (browser == "edge" && browserVersion >= 14 || browser == "firefox" && browserVersion >= 69 || browser == "chrome" && browserVersion >= 36) {
          preferredFormats.push("woff2");
        }
        if (browser == "ie" && qx.core.Environment.get("browser.documentmode") >= 9 || browser == "edge" && browserVersion >= 12 || browser == "firefox" && browserVersion >= 3.6 || browser == "chrome" && browserVersion >= 6) {
          preferredFormats.push("woff");
        }
        if (browser == "edge" && browserVersion >= 12 || browser == "opera" && browserVersion >= 10 || browser == "safari" && browserVersion >= 3.1 || browser == "firefox" && browserVersion >= 3.5 || browser == "chrome" && browserVersion >= 4 || browser == "mobile safari" && os == "ios" && osVersion >= 4.2) {
          preferredFormats.push("ttf");
        }
        if (browser == "ie" && browserVersion >= 4) {
          preferredFormats.push("eot");
        }
        if (browser == "mobileSafari" && os == "ios" && osVersion >= 4.1) {
          preferredFormats.push("svg");
        }
        return qx.bom.webfonts.WebFontLoader.__preferredFormats__P_181_9 = preferredFormats;
      },
      /**
       * IE 6 and 7 omit the trailing quote after the format name when
       * querying cssText. This needs to be fixed before cssText is replaced
       * or all rules will be invalid and no web fonts will work any more.
       *
       * @param cssText {String} CSS text
       * @return {String} Fixed CSS text
       */
      __fixCssText__P_181_8(cssText) {
        return cssText.replace("'eot)", "'eot')").replace("('embedded-opentype)", "('embedded-opentype')");
      }
    }
  });
  qx.bom.webfonts.WebFontLoader.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Abstract class to compute the position of an object on one axis.
   */
  qx.Bootstrap.define("qx.util.placement.AbstractAxis", {
    extend: Object,
    statics: {
      /**
       * Computes the start of the object on the axis
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param areaSize {Integer} Size of the axis.
       * @param position {String} Alignment of the object on the target. Valid values are
       *   <ul>
       *   <li><code>edge-start</code> The object is placed before the target</li>
       *   <li><code>edge-end</code> The object is placed after the target</li>
       *   <li><code>align-start</code>The start of the object is aligned with the start of the target</li>
       *   <li><code>align-center</code>The center of the object is aligned with the center of the target</li>
       *   <li><code>align-end</code>The end of the object is aligned with the end of the object</li>
       *   </ul>
       * @return {Integer} The computed start position of the object.
       * @abstract
       */
      computeStart(size, target, offsets, areaSize, position) {
        throw new Error("abstract method call!");
      },
      /**
       * Computes the start of the object by taking only the attachment and
       * alignment into account. The object by be not fully visible.
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param position {String} Accepts the same values as the <code> position</code>
       *   argument of {@link #computeStart}.
       * @return {Integer} The computed start position of the object.
       */
      _moveToEdgeAndAlign(size, target, offsets, position) {
        switch (position) {
          case "edge-start":
            return target.start - offsets.end - size;
          case "edge-end":
            return target.end + offsets.start;
          case "align-start":
            return target.start + offsets.start;
          case "align-center":
            return target.start + parseInt((target.end - target.start - size) / 2, 10) + offsets.start;
          case "align-end":
            return target.end - offsets.end - size;
        }
      },
      /**
       * Whether the object specified by <code>start</code> and <code>size</code>
       * is completely inside of the axis' range..
       *
       * @param start {Integer} Computed start position of the object
       * @param size {Integer} Size of the object
       * @param areaSize {Integer} The size of the axis
       * @return {Boolean} Whether the object is inside of the axis' range
       */
      _isInRange(start, size, areaSize) {
        return start >= 0 && start + size <= areaSize;
      }
    }
  });
  qx.util.placement.AbstractAxis.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.placement.AbstractAxis": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Places the object directly at the specified position. It is not moved if
   * parts of the object are outside of the axis' range.
   */
  qx.Bootstrap.define("qx.util.placement.DirectAxis", {
    statics: {
      /**
       * Computes the start of the object by taking only the attachment and
       * alignment into account. The object by be not fully visible.
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param position {String} Accepts the same values as the <code> position</code>
       *   argument of {@link #computeStart}.
       * @return {Integer} The computed start position of the object.
       */
      _moveToEdgeAndAlign: qx.util.placement.AbstractAxis._moveToEdgeAndAlign,
      /**
       * Computes the start of the object on the axis
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param areaSize {Integer} Size of the axis.
       * @param position {String} Alignment of the object on the target. Valid values are
       *   <ul>
       *   <li><code>edge-start</code> The object is placed before the target</li>
       *   <li><code>edge-end</code> The object is placed after the target</li>
       *   <li><code>align-start</code>The start of the object is aligned with the start of the target</li>
       *   <li><code>align-center</code>The center of the object is aligned with the center of the target</li>
       *   <li><code>align-end</code>The end of the object is aligned with the end of the object</li>
       *   </ul>
       * @return {Integer} The computed start position of the object.
       */
      computeStart(size, target, offsets, areaSize, position) {
        return this._moveToEdgeAndAlign(size, target, offsets, position);
      }
    }
  });
  qx.util.placement.DirectAxis.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.placement.AbstractAxis": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Places the object to the target. If parts of the object are outside of the
   * range this class places the object at the best "edge", "alignment"
   * combination so that the overlap between object and range is maximized.
   */
  qx.Bootstrap.define("qx.util.placement.KeepAlignAxis", {
    statics: {
      /**
       * Computes the start of the object by taking only the attachment and
       * alignment into account. The object by be not fully visible.
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param position {String} Accepts the same values as the <code> position</code>
       *   argument of {@link #computeStart}.
       * @return {Integer} The computed start position of the object.
       */
      _moveToEdgeAndAlign: qx.util.placement.AbstractAxis._moveToEdgeAndAlign,
      /**
       * Whether the object specified by <code>start</code> and <code>size</code>
       * is completely inside of the axis' range..
       *
       * @param start {Integer} Computed start position of the object
       * @param size {Integer} Size of the object
       * @param areaSize {Integer} The size of the axis
       * @return {Boolean} Whether the object is inside of the axis' range
       */
      _isInRange: qx.util.placement.AbstractAxis._isInRange,
      /**
       * Computes the start of the object on the axis
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param areaSize {Integer} Size of the axis.
       * @param position {String} Alignment of the object on the target. Valid values are
       *   <ul>
       *   <li><code>edge-start</code> The object is placed before the target</li>
       *   <li><code>edge-end</code> The object is placed after the target</li>
       *   <li><code>align-start</code>The start of the object is aligned with the start of the target</li>
       *   <li><code>align-center</code>The center of the object is aligned with the center of the target</li>
       *   <li><code>align-end</code>The end of the object is aligned with the end of the object</li>
       *   </ul>
       * @return {Integer} The computed start position of the object.
       */
      computeStart(size, target, offsets, areaSize, position) {
        var start = this._moveToEdgeAndAlign(size, target, offsets, position);
        var range1End, range2Start;
        if (this._isInRange(start, size, areaSize)) {
          return start;
        }
        if (position == "edge-start" || position == "edge-end") {
          range1End = target.start - offsets.end;
          range2Start = target.end + offsets.start;
        } else {
          range1End = target.end - offsets.end;
          range2Start = target.start + offsets.start;
        }
        if (range1End > areaSize - range2Start) {
          start = Math.max(0, range1End - size);
        } else {
          start = range2Start;
        }
        return start;
      }
    }
  });
  qx.util.placement.KeepAlignAxis.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.placement.AbstractAxis": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */

  /**
   * Places the object according to the target. If parts of the object are outside
   * of the axis' range the object's start is adjusted so that the overlap between
   * the object and the axis is maximized.
   */
  qx.Bootstrap.define("qx.util.placement.BestFitAxis", {
    statics: {
      /**
       * Whether the object specified by <code>start</code> and <code>size</code>
       * is completely inside of the axis' range..
       *
       * @param start {Integer} Computed start position of the object
       * @param size {Integer} Size of the object
       * @param areaSize {Integer} The size of the axis
       * @return {Boolean} Whether the object is inside of the axis' range
       */
      _isInRange: qx.util.placement.AbstractAxis._isInRange,
      /**
       * Computes the start of the object by taking only the attachment and
       * alignment into account. The object by be not fully visible.
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param position {String} Accepts the same values as the <code> position</code>
       *   argument of {@link #computeStart}.
       * @return {Integer} The computed start position of the object.
       */
      _moveToEdgeAndAlign: qx.util.placement.AbstractAxis._moveToEdgeAndAlign,
      /**
       * Computes the start of the object on the axis
       *
       * @param size {Integer} Size of the object to align
       * @param target {Map} Location of the object to align the object to. This map
       *   should have the keys <code>start</code> and <code>end</code>.
       * @param offsets {Map} Map with all offsets on each side.
       *   Comes with the keys <code>start</code> and <code>end</code>.
       * @param areaSize {Integer} Size of the axis.
       * @param position {String} Alignment of the object on the target. Valid values are
       *   <ul>
       *   <li><code>edge-start</code> The object is placed before the target</li>
       *   <li><code>edge-end</code> The object is placed after the target</li>
       *   <li><code>align-start</code>The start of the object is aligned with the start of the target</li>
       *   <li><code>align-center</code>The center of the object is aligned with the center of the target</li>
       *   <li><code>align-end</code>The end of the object is aligned with the end of the object</li>
       *   </ul>
       * @return {Integer} The computed start position of the object.
       */
      computeStart(size, target, offsets, areaSize, position) {
        var start = this._moveToEdgeAndAlign(size, target, offsets, position);
        if (this._isInRange(start, size, areaSize)) {
          return start;
        }
        if (start < 0) {
          start = Math.min(0, areaSize - size);
        }
        if (start + size > areaSize) {
          start = Math.max(0, areaSize - size);
        }
        return start;
      }
    }
  });
  qx.util.placement.BestFitAxis.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.form.IStringForm": {
        "require": true
      },
      "qx.locale.Manager": {
        "construct": true
      },
      "qx.bom.client.Css": {
        "require": true
      },
      "qx.bom.client.Html": {
        "require": true
      },
      "qx.html.Label": {},
      "qx.theme.manager.Color": {},
      "qx.lang.Type": {},
      "qx.theme.manager.Font": {},
      "qx.bom.webfonts.WebFont": {},
      "qx.ui.core.queue.Layout": {},
      "qx.bom.Font": {},
      "qx.bom.Label": {},
      "qx.lang.Object": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "css.textoverflow": {
          "className": "qx.bom.client.Css"
        },
        "html.xul": {
          "className": "qx.bom.client.Html"
        },
        "os.name": {
          "className": "qx.bom.client.OperatingSystem"
        },
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "engine.version": {
          "className": "qx.bom.client.Engine"
        },
        "qx.dynlocale": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The label class brings typical text content to the widget system.
   *
   * It supports simple text nodes and complex HTML (rich). The default
   * content mode is for text only. The mode is changeable through the property
   * {@link #rich}.
   *
   * The label supports heightForWidth when used in HTML mode. This means
   * that multi line HTML automatically computes the correct preferred height.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   // a simple text label without wrapping and markup support
   *   var label1 = new qx.ui.basic.Label("Simple text label");
   *   this.getRoot().add(label1, {left:20, top:10});
   *
   *   // a HTML label with automatic line wrapping
   *   var label2 = new qx.ui.basic.Label().set({
   *     value: "A <b>long label</b> text with auto-wrapping. This also may contain <b style='color:red'>rich HTML</b> markup.",
   *     rich : true,
   *     width: 120
   *   });
   *   this.getRoot().add(label2, {left:20, top:50});
   * </pre>
   *
   * The first label in this example is a basic text only label. As such no
   * automatic wrapping is supported. The second label is a long label containing
   * HTML markup with automatic line wrapping.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/label.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.ui.basic.Label", {
    extend: qx.ui.core.Widget,
    implement: [qx.ui.form.IStringForm],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param value {String} Text or HTML content to use
     */
    construct(value) {
      qx.ui.core.Widget.constructor.call(this);
      if (value != null) {
        this.setValue(value);
      }
      {
        this.__changeLocaleLabelListenerId__P_149_0 = qx.locale.Manager.getInstance().addListener("changeLocale", this._onChangeLocale, this);
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Switches between rich HTML and text content. The text mode (<code>false</code>) supports
       * advanced features like ellipsis when the available space is not
       * enough. HTML mode (<code>true</code>) supports multi-line content and all the
       * markup features of HTML content.
       */
      rich: {
        check: "Boolean",
        init: false,
        event: "changeRich",
        apply: "_applyRich"
      },
      /**
       * Controls whether text wrap is activated or not. But please note, that
       * this property works only in combination with the property {@link #rich}.
       * The {@link #wrap} has only an effect if the {@link #rich} property is
       * set to <code>true</code>, otherwise {@link #wrap} has no effect.
       */
      wrap: {
        check: "Boolean",
        init: true,
        apply: "_applyWrap"
      },
      /**
       * Controls whether line wrapping can occur in the middle of a word; this is
       * typically only useful when there is a restricted amount of horizontal space
       * and words would otherwise overflow beyond the width of the element.  Words
       * are typically considered as separated by spaces, so "abc/def/ghi" is a 11
       * character word that would not be split without `breakWithWords` set to true.
       */
      breakWithinWords: {
        check: "Boolean",
        init: false,
        apply: "_applyBreakWithinWords"
      },
      /**
       * Contains the HTML or text content. Interpretation depends on the value
       * of {@link #rich}. In text mode entities and other HTML special content
       * is not supported. But it is possible to use unicode escape sequences
       * to insert symbols and other non ASCII characters.
       */
      value: {
        check: "String",
        apply: "_applyValue",
        event: "changeValue",
        nullable: true
      },
      /**
       * The buddy property can be used to connect the label to another widget.
       * That causes two things:
       * <ul>
       *   <li>The label will always take the same enabled state as the buddy
       *       widget.
       *   </li>
       *   <li>A tap on the label will focus the buddy widget.</li>
       * </ul>
       * This is the behavior of the for attribute of HTML:
       * http://www.w3.org/TR/html401/interact/forms.html#adef-for
       */
      buddy: {
        check: "qx.ui.core.Widget",
        apply: "_applyBuddy",
        nullable: true,
        init: null,
        dereference: true
      },
      /** Control the text alignment */
      textAlign: {
        check: ["left", "center", "right", "justify"],
        nullable: true,
        themeable: true,
        apply: "_applyTextAlign",
        event: "changeTextAlign"
      },
      // overridden
      appearance: {
        refine: true,
        init: "label"
      },
      // overridden
      selectable: {
        refine: true,
        init: false
      },
      // overridden
      allowGrowX: {
        refine: true,
        init: false
      },
      // overridden
      allowGrowY: {
        refine: true,
        init: false
      },
      // overridden
      allowShrinkY: {
        refine: true,
        init: false
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      __font__P_149_1: null,
      __invalidContentSize__P_149_2: null,
      __tapListenerId__P_149_3: null,
      __webfontListenerId__P_149_4: null,
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      _getContentHint() {
        if (this.__invalidContentSize__P_149_2) {
          this.__contentSize__P_149_5 = this.__computeContentSize__P_149_6();
          delete this.__invalidContentSize__P_149_2;
        }
        return {
          width: this.__contentSize__P_149_5.width,
          height: this.__contentSize__P_149_5.height
        };
      },
      // overridden
      _hasHeightForWidth() {
        return this.getRich() && this.getWrap();
      },
      // overridden
      _applySelectable(value) {
        // This is needed for all browsers not having text-overflow:ellipsis
        // but supporting XUL (firefox < 4)
        // https://bugzilla.mozilla.org/show_bug.cgi?id=312156
        if (!qx.core.Environment.get("css.textoverflow") && qx.core.Environment.get("html.xul")) {
          if (value && !this.isRich()) {
            {
              this.warn("Only rich labels are selectable in browsers with Gecko engine!");
            }
            return;
          }
        }
        qx.ui.basic.Label.superclass.prototype._applySelectable.call(this, value);
      },
      // overridden
      _getContentHeightForWidth(width) {
        if (!this.getRich() && !this.getWrap()) {
          return null;
        }
        return this.__computeContentSize__P_149_6(width).height;
      },
      // overridden
      _createContentElement() {
        return new qx.html.Label();
      },
      // property apply
      _applyTextAlign(value, old) {
        this.getContentElement().setStyle("textAlign", value);
      },
      // overridden
      _applyTextColor(value, old) {
        if (value) {
          this.getContentElement().setStyle("color", qx.theme.manager.Color.getInstance().resolve(value));
        } else {
          this.getContentElement().removeStyle("color");
        }
      },
      /*
      ---------------------------------------------------------------------------
        LABEL ADDONS
      ---------------------------------------------------------------------------
      */

      /**
       * @type {Map} Internal fallback of label size when no font is defined
       *
       * @lint ignoreReferenceField(__contentSize)
       */
      __contentSize__P_149_5: {
        width: 0,
        height: 0
      },
      // property apply
      _applyFont(value, old) {
        if (old && this.__font__P_149_1 && this.__webfontListenerId__P_149_4) {
          this.__font__P_149_1.removeListenerById(this.__webfontListenerId__P_149_4);
          this.__webfontListenerId__P_149_4 = null;
        }
        // Apply
        var styles;
        if (value) {
          if (qx.lang.Type.isString(value)) {
            value = qx.theme.manager.Font.getInstance().resolve(value);
          }
          this.__font__P_149_1 = value;
          if (this.__font__P_149_1 instanceof qx.bom.webfonts.WebFont && !this.__font__P_149_1.isValid()) {
            this.__webfontListenerId__P_149_4 = this.__font__P_149_1.addListener("changeStatus", evt => {
              if (evt.getData().valid) {
                this.__invalidContentSize__P_149_2 = true;
                qx.ui.core.queue.Layout.add(this);
              }
            });
          }
          styles = this.__font__P_149_1.getStyles();
        } else {
          this.__font__P_149_1 = null;
          styles = qx.bom.Font.getDefaultStyles();
        }

        // check if text color already set - if so this local value has higher priority
        if (this.getTextColor() != null) {
          delete styles["color"];
        }
        this.getContentElement().setStyles(styles);

        // Invalidate text size
        this.__invalidContentSize__P_149_2 = true;

        // Update layout
        qx.ui.core.queue.Layout.add(this);
      },
      /**
       * Internal utility to compute the content dimensions.
       *
       * @param width {Integer?null} Optional width constraint
       * @return {Map} Map with <code>width</code> and <code>height</code> keys
       */
      __computeContentSize__P_149_6(width) {
        var Label = qx.bom.Label;
        var font = this.getFont();
        var styles = font ? this.__font__P_149_1.getStyles() : qx.bom.Font.getDefaultStyles();
        var content = this.getValue() || "A";
        var rich = this.getRich();
        if (this.__webfontListenerId__P_149_4) {
          this.__fixEllipsis__P_149_7();
        }
        if (rich && this.getBreakWithinWords()) {
          styles = qx.lang.Object.clone(styles);
          styles.wordBreak = "break-all";
        }
        return rich ? Label.getHtmlSize(content, styles, width) : Label.getTextSize(content, styles);
      },
      /**
       * Firefox > 9 on OS X will draw an ellipsis on top of the label content even
       * though there is enough space for the text. Re-applying the content forces
       * a recalculation and fixes the problem. See qx bug #6293
       */
      __fixEllipsis__P_149_7() {
        if (!this.getContentElement()) {
          return;
        }
        if (qx.core.Environment.get("os.name") == "osx" && qx.core.Environment.get("engine.name") == "gecko" && parseInt(qx.core.Environment.get("engine.version"), 10) < 16 && parseInt(qx.core.Environment.get("engine.version"), 10) > 9) {
          var domEl = this.getContentElement().getDomElement();
          if (domEl) {
            /* eslint-disable-next-line no-self-assign */
            domEl.innerHTML = domEl.innerHTML;
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLIER
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyBuddy(value, old) {
        if (old != null) {
          this.removeRelatedBindings(old);
          this.removeListenerById(this.__tapListenerId__P_149_3);
          this.__tapListenerId__P_149_3 = null;
        }
        if (value != null) {
          value.bind("enabled", this, "enabled");
          this.__tapListenerId__P_149_3 = this.addListener("tap", () => {
            // only focus focusable elements [BUG #3555]
            if (value.isFocusable()) {
              value.focus.apply(value);
            }
            // furthermore toggle if possible [BUG #6881]
            if ("toggleValue" in value && typeof value.toggleValue === "function") {
              value.toggleValue();
            }
          });
        }
      },
      // property apply
      _applyRich(value) {
        // Sync with content element
        this.getContentElement().setRich(value);

        // Mark text size cache as invalid
        this.__invalidContentSize__P_149_2 = true;

        // Update layout
        qx.ui.core.queue.Layout.add(this);
      },
      // property apply
      _applyWrap(value, old) {
        if (value && !this.isRich()) {
          {
            this.warn("Only rich labels support wrap.");
          }
        }
        if (this.isRich()) {
          // apply the white space style to the label to force it not
          // to wrap if wrap is set to false [BUG #3732]
          var whiteSpace = value ? "normal" : "nowrap";
          this.getContentElement().setStyle("whiteSpace", whiteSpace);
        }
      },
      // property apply
      _applyBreakWithinWords(value, old) {
        this.getContentElement().setStyle("wordBreak", this.isRich() && value ? "break-all" : "normal");
      },
      /**
       * Locale change event handler
       *
       * @signature function(e)
       * @param e {Event} the change event
       */
      _onChangeLocale: qx.core.Environment.select("qx.dynlocale", {
        true(e) {
          var content = this.getValue();
          if (content && content.translate) {
            this.setValue(content.translate());
          }
        },
        false: null
      }),
      // property apply
      _applyValue: qx.core.Environment.select("qx.dynlocale", {
        true(value, old) {
          // Sync with content element
          if (value && value.translate) {
            this.getContentElement().setValue(value.translate());
          } else {
            this.getContentElement().setValue(value);
          }

          // Mark text size cache as invalid
          this.__invalidContentSize__P_149_2 = true;

          // Update layout
          qx.ui.core.queue.Layout.add(this);
        },
        false(value, old) {
          this.getContentElement().setValue(value);

          // Mark text size cache as invalid
          this.__invalidContentSize__P_149_2 = true;

          // Update layout
          qx.ui.core.queue.Layout.add(this);
        }
      })
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      if (true && this.__changeLocaleLabelListenerId__P_149_0) {
        qx.locale.Manager.getInstance().removeListenerById(this.__changeLocaleLabelListenerId__P_149_0);
      }
      if (this.__font__P_149_1 && this.__webfontListenerId__P_149_4) {
        this.__font__P_149_1.removeListenerById(this.__webfontListenerId__P_149_4);
      }
      this.__font__P_149_1 = null;
    }
  });
  qx.ui.basic.Label.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.MenuButton": {
        "require": true
      },
      "qx.ui.toolbar.ToolBar": {},
      "qx.ui.menu.Manager": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * A menubar button
   */
  qx.Class.define("qx.ui.menubar.Button", {
    extend: qx.ui.form.MenuButton,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      appearance: {
        refine: true,
        init: "menubar-button"
      },
      show: {
        refine: true,
        init: "inherit"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        HELPER METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Inspects the parent chain to find the MenuBar
       *
       * @return {qx.ui.menubar.MenuBar} MenuBar instance or <code>null</code>.
       */
      getMenuBar() {
        var parent = this;
        while (parent) {
          /* this method is also used by toolbar.MenuButton, so we need to check
             for a ToolBar instance. */
          if (parent instanceof qx.ui.toolbar.ToolBar) {
            return parent;
          }
          parent = parent.getLayoutParent();
        }
        return null;
      },
      // overridden
      open(selectFirst) {
        qx.ui.menubar.Button.superclass.prototype.open.call(this, selectFirst);
        var menubar = this.getMenuBar();
        if (menubar) {
          menubar._setAllowMenuOpenHover(true);
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENERS
      ---------------------------------------------------------------------------
      */

      /**
       * Listener for visibility property changes of the attached menu
       *
       * @param e {qx.event.type.Data} Property change event
       */
      _onMenuChange(e) {
        var menu = this.getMenu();
        var menubar = this.getMenuBar();
        if (menu.isVisible()) {
          this.addState("pressed");

          // Sync with open menu property
          if (menubar) {
            menubar.setOpenMenu(menu);
          }
        } else {
          this.removeState("pressed");

          // Sync with open menu property
          if (menubar && menubar.getOpenMenu() == menu) {
            menubar.resetOpenMenu();
            menubar._setAllowMenuOpenHover(false);
          }
        }
      },
      // overridden
      _onPointerUp(e) {
        qx.ui.menubar.Button.superclass.prototype._onPointerUp.call(this, e);

        // Set state 'pressed' to visualize that the menu is open.
        var menu = this.getMenu();
        if (menu && menu.isVisible() && !this.hasState("pressed")) {
          this.addState("pressed");
        }
      },
      /**
       * Event listener for pointerover event
       *
       * @param e {qx.event.type.Pointer} pointerover event object
       */
      _onPointerOver(e) {
        // Add hovered state
        this.addState("hovered");

        // Open submenu
        if (this.getMenu() && e.getPointerType() == "mouse") {
          var menubar = this.getMenuBar();
          if (menubar && menubar._isAllowMenuOpenHover()) {
            // Hide all open menus
            qx.ui.menu.Manager.getInstance().hideAll();

            // Set it again, because hideAll remove it.
            menubar._setAllowMenuOpenHover(true);

            // Then show the attached menu
            if (this.isEnabled()) {
              this.open();
            }
          }
        }
      }
    }
  });
  qx.ui.menubar.Button.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.bom.Shortcut": {
        "construct": true
      },
      "qx.ui.menu.Menu": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2014 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
       * Mustafa Sak (msak)
  
  ************************************************************************ */
  /**
   * Commands can be used to globally define keyboard shortcuts. They could
   * also be used to assign an execution of a command sequence to multiple
   * widgets. It is possible to use the same Command in a MenuButton and
   * ToolBarButton for example.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.ui.command.Command", {
    extend: qx.core.Object,
    /**
     * @param shortcut {String} Shortcuts can be composed of optional modifier
     *    keys Control, Alt, Shift, Meta and a non modifier key.
     *    If no non modifier key is specified, the second parameter is evaluated.
     *    The key must be separated by a <code>+</code> or <code>-</code> character.
     *    Examples: Alt+F1, Control+C, Control+Alt+Delete
     */
    construct(shortcut) {
      qx.core.Object.constructor.call(this);
      this._shortcut = new qx.bom.Shortcut(shortcut);
      this._shortcut.addListener("execute", this.execute, this);
      if (shortcut !== undefined) {
        this.setShortcut(shortcut);
      }
    },
    events: {
      /**
       * Fired when the command is executed. Sets the "data" property of the
       * event to the object that issued the command.
       */
      execute: "qx.event.type.Data"
    },
    properties: {
      /** Whether the command should be activated. If 'false' execute event
       * wouldn't fire. This property will be used by command groups when
       * activating/deactivating all commands of the group.*/
      active: {
        init: true,
        check: "Boolean",
        event: "changeActive",
        apply: "_applyActive"
      },
      /** Whether the command should be respected/enabled. If 'false' execute event
       * wouldn't fire. If value of property {@link qx.ui.command.Command#active}
       * is 'false', enabled value can be set but has no effect until
       * {@link qx.ui.command.Command#active} will be set to 'true'.*/
      enabled: {
        init: true,
        check: "Boolean",
        event: "changeEnabled",
        apply: "_applyEnabled"
      },
      /** The command shortcut as a string */
      shortcut: {
        check: "String",
        apply: "_applyShortcut",
        nullable: true
      },
      /** The label, which will be set in all connected widgets (if available) */
      label: {
        check: "String",
        nullable: true,
        event: "changeLabel"
      },
      /** The icon, which will be set in all connected widgets (if available) */
      icon: {
        check: "String",
        nullable: true,
        event: "changeIcon"
      },
      /**
       * The tooltip text, which will be set in all connected
       * widgets (if available)
       */
      toolTipText: {
        check: "String",
        nullable: true,
        event: "changeToolTipText"
      },
      /** The value of the connected widgets */
      value: {
        nullable: true,
        event: "changeValue"
      },
      /** The menu, which will be set in all connected widgets (if available) */
      menu: {
        check: "qx.ui.menu.Menu",
        nullable: true,
        event: "changeMenu"
      }
    },
    members: {
      _shortcut: null,
      // property apply
      _applyActive(value) {
        if (value === false) {
          this._shortcut.setEnabled(false);
        } else {
          // synchronize value with current "enabled" value of this command
          this._shortcut.setEnabled(this.getEnabled());
        }
      },
      // property apply
      _applyEnabled(value) {
        if (this.getActive()) {
          this._shortcut.setEnabled(value);
        }
      },
      // property apply
      _applyShortcut(value) {
        this._shortcut.setShortcut(value);
      },
      /**
       * Fire the "execute" event on this command. If property
       * <code>active</code> and <code>enabled</code> set to
       * <code>true</code>.
       * @param target {Object?} Object which issued the execute event
       */
      execute(target) {
        if (this.getActive() && this.getEnabled()) {
          this.fireDataEvent("execute", target);
        }
      },
      /**
       * Returns the used shortcut as string using the currently selected locale.
       *
       * @return {String} shortcut
       */
      toString() {
        if (this._shortcut) {
          return this._shortcut.toString();
        }
        return qx.ui.command.Command.superclass.prototype.toString.call(this);
      }
    },
    destruct() {
      this._shortcut.removeListener("execute", this.execute, this);
      this._disposeObjects("_shortcut");
    }
  });
  qx.ui.command.Command.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.Button": {
        "construct": true,
        "require": true
      },
      "qx.event.AcceleratingTimer": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Martin Wittemann (martinwittemann)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The RepeatButton is a special button, which fires repeatedly {@link #execute}
   * events, while a button is pressed on the button. The initial delay
   * and the interval time can be set using the properties {@link #firstInterval}
   * and {@link #interval}. The {@link #execute} events will be fired in a shorter
   * amount of time if a button is hold, until the min {@link #minTimer}
   * is reached. The {@link #timerDecrease} property sets the amount of milliseconds
   * which will decreased after every firing.
   *
   * <pre class='javascript'>
   *   var button = new qx.ui.form.RepeatButton("Hello World");
   *
   *   button.addListener("execute", function(e) {
   *     alert("Button is executed");
   *   }, this);
   *
   *   this.getRoot.add(button);
   * </pre>
   *
   * This example creates a button with the label "Hello World" and attaches an
   * event listener to the {@link #execute} event.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/repeatbutton.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.form.RepeatButton", {
    extend: qx.ui.form.Button,
    /**
     * @param label {String} Label to use
     * @param icon {String?null} Icon to use
     */
    construct(label, icon) {
      qx.ui.form.Button.constructor.call(this, label, icon);

      // create the timer and add the listener
      this.__timer__P_221_0 = new qx.event.AcceleratingTimer();
      this.__timer__P_221_0.addListener("interval", this._onInterval, this);
    },
    events: {
      /**
       * This event gets dispatched with every interval. The timer gets executed
       * as long as the user holds down a button.
       */
      execute: "qx.event.type.Event",
      /**
       * This event gets dispatched when the button is pressed.
       */
      press: "qx.event.type.Event",
      /**
       * This event gets dispatched when the button is released.
       */
      release: "qx.event.type.Event"
    },
    properties: {
      /**
       * Interval used after the first run of the timer. Usually a smaller value
       * than the "firstInterval" property value to get a faster reaction.
       */
      interval: {
        check: "Integer",
        init: 100
      },
      /**
       * Interval used for the first run of the timer. Usually a greater value
       * than the "interval" property value to a little delayed reaction at the first
       * time.
       */
      firstInterval: {
        check: "Integer",
        init: 500
      },
      /** This configures the minimum value for the timer interval. */
      minTimer: {
        check: "Integer",
        init: 20
      },
      /** Decrease of the timer on each interval (for the next interval) until minTimer reached. */
      timerDecrease: {
        check: "Integer",
        init: 2
      }
    },
    members: {
      __executed__P_221_1: null,
      __timer__P_221_0: null,
      /**
       * Calling this function is like a tap from the user on the
       * button with all consequences.
       * <span style='color: red'>Be sure to call the {@link #release} function.</span>
       *
       */
      press() {
        // only if the button is enabled
        if (this.isEnabled()) {
          // if the state pressed must be applied (first call)
          if (!this.hasState("pressed")) {
            // start the timer
            this.__startInternalTimer__P_221_2();
          }

          // set the states
          this.removeState("abandoned");
          this.addState("pressed");
        }
      },
      /**
       * Calling this function is like a release from the user on the
       * button with all consequences.
       * Usually the {@link #release} function will be called before the call of
       * this function.
       *
       * @param fireExecuteEvent {Boolean?true} flag which signals, if an event should be fired
       */
      release(fireExecuteEvent) {
        // only if the button is enabled
        if (!this.isEnabled()) {
          return;
        }

        // only if the button is pressed
        if (this.hasState("pressed")) {
          // if the button has not been executed
          if (!this.__executed__P_221_1) {
            this.execute();
          }
        }

        // remove button states
        this.removeState("pressed");
        this.removeState("abandoned");

        // stop the repeat timer and therefore the execution
        this.__stopInternalTimer__P_221_3();
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // overridden
      _applyEnabled(value, old) {
        qx.ui.form.RepeatButton.superclass.prototype._applyEnabled.call(this, value, old);
        if (!value) {
          if (this.isCapturing()) {
            // also release capture because out event is missing on iOS
            this.releaseCapture();
          }

          // remove button states
          this.removeState("pressed");
          this.removeState("abandoned");

          // stop the repeat timer and therefore the execution
          this.__stopInternalTimer__P_221_3();
        }
      },
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER
      ---------------------------------------------------------------------------
      */

      /**
       * Listener method for "pointerover" event
       * <ul>
       * <li>Adds state "hovered"</li>
       * <li>Removes "abandoned" and adds "pressed" state (if "abandoned" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOver(e) {
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
        if (this.hasState("abandoned")) {
          this.removeState("abandoned");
          this.addState("pressed");
          this.__timer__P_221_0.start();
        }
        this.addState("hovered");
      },
      /**
       * Listener method for "pointerout" event
       * <ul>
       * <li>Removes "hovered" state</li>
       * <li>Adds "abandoned" and removes "pressed" state (if "pressed" state is set)</li>
       * </ul>
       *
       * @param e {qx.event.type.Pointer} Pointer event
       */
      _onPointerOut(e) {
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
        this.removeState("hovered");
        if (this.hasState("pressed")) {
          this.removeState("pressed");
          this.addState("abandoned");
          this.__timer__P_221_0.stop();
        }
      },
      /**
       * Callback method for the "pointerdown" method.
       *
       * Sets the interval of the timer (value of firstInterval property) and
       * starts the timer. Additionally removes the state "abandoned" and adds the
       * state "pressed".
       *
       * @param e {qx.event.type.Pointer} pointerdown event
       */
      _onPointerDown(e) {
        if (!e.isLeftPressed()) {
          return;
        }

        // Activate capturing if the button get a pointerout while
        // the button is pressed.
        this.capture();
        this.__startInternalTimer__P_221_2();
        e.stopPropagation();
      },
      /**
       * Callback method for the "pointerup" event.
       *
       * Handles the case that the user is releasing a button
       * before the timer interval method got executed. This way the
       * "execute" method get executed at least one time.
       *
       * @param e {qx.event.type.Pointer} pointerup event
       */
      _onPointerUp(e) {
        this.releaseCapture();
        if (!this.hasState("abandoned")) {
          this.addState("hovered");
          if (this.hasState("pressed") && !this.__executed__P_221_1) {
            this.execute();
          }
        }
        this.__stopInternalTimer__P_221_3();
        e.stopPropagation();
      },
      // Nothing to do, 'execute' is already fired by _onPointerUp.
      _onTap(e) {},
      /**
       * Listener method for "keyup" event.
       *
       * Removes "abandoned" and "pressed" state (if "pressed" state is set)
       * for the keys "Enter" or "Space" and stops the internal timer
       * (same like pointer up).
       *
       * @param e {Event} Key event
       */
      _onKeyUp(e) {
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            if (this.hasState("pressed")) {
              if (!this.__executed__P_221_1) {
                this.execute();
              }
              this.removeState("pressed");
              this.removeState("abandoned");
              e.stopPropagation();
              this.__stopInternalTimer__P_221_3();
            }
        }
      },
      /**
       * Listener method for "keydown" event.
       *
       * Removes "abandoned" and adds "pressed" state
       * for the keys "Enter" or "Space". It also starts
       * the internal timer (same like pointerdown).
       *
       * @param e {Event} Key event
       */
      _onKeyDown(e) {
        switch (e.getKeyIdentifier()) {
          case "Enter":
          case "Space":
            this.removeState("abandoned");
            this.addState("pressed");
            e.stopPropagation();
            this.__startInternalTimer__P_221_2();
        }
      },
      /**
       * Callback for the interval event.
       *
       * Stops the timer and starts it with a new interval
       * (value of the "interval" property - value of the "timerDecrease" property).
       * Dispatches the "execute" event.
       *
       * @param e {qx.event.type.Event} interval event
       */
      _onInterval(e) {
        this.__executed__P_221_1 = true;
        this.fireEvent("execute");
      },
      /*
      ---------------------------------------------------------------------------
        INTERNAL TIMER
      ---------------------------------------------------------------------------
      */

      /**
       * Starts the internal timer which causes firing of execution
       * events in an interval. It also presses the button.
       *
       */
      __startInternalTimer__P_221_2() {
        this.fireEvent("press");
        this.__executed__P_221_1 = false;
        this.__timer__P_221_0.set({
          interval: this.getInterval(),
          firstInterval: this.getFirstInterval(),
          minimum: this.getMinTimer(),
          decrease: this.getTimerDecrease()
        }).start();
        this.removeState("abandoned");
        this.addState("pressed");
      },
      /**
       * Stops the internal timer and releases the button.
       *
       */
      __stopInternalTimer__P_221_3() {
        this.fireEvent("release");
        this.__timer__P_221_0.stop();
        this.removeState("abandoned");
        this.removeState("pressed");
      }
    },
    /*
      *****************************************************************************
         DESTRUCTOR
      *****************************************************************************
      */

    destruct() {
      this._disposeObjects("__timer__P_221_0");
    }
  });
  qx.ui.form.RepeatButton.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.Grow": {
        "construct": true
      },
      "qx.bom.AnimationFrame": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * This class represents a scroll able pane. This means that this widget
   * may contain content which is bigger than the available (inner)
   * dimensions of this widget. The widget also offer methods to control
   * the scrolling position. It can only have exactly one child.
   */
  qx.Class.define("qx.ui.core.scroll.ScrollPane", {
    extend: qx.ui.core.Widget,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.core.Widget.constructor.call(this);
      this.set({
        minWidth: 0,
        minHeight: 0
      });

      // Automatically configure a "fixed" grow layout.
      this._setLayout(new qx.ui.layout.Grow());

      // Add resize listener to "translate" event
      this.addListener("resize", this._onUpdate);
      var contentEl = this.getContentElement();

      // Synchronizes the DOM scroll position with the properties
      contentEl.addListener("scroll", this._onScroll, this);

      // Fixed some browser quirks e.g. correcting scroll position
      // to the previous value on re-display of a pane
      contentEl.addListener("appear", this._onAppear, this);
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired on resize of both the container or the content. */
      update: "qx.event.type.Event",
      /** Fired on scroll animation end invoked by 'scroll*' methods. */
      scrollAnimationEnd: "qx.event.type.Event"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** The horizontal scroll position */
      scrollX: {
        check: "qx.lang.Type.isNumber(value)&&value>=0&&value<=this.getScrollMaxX()",
        apply: "_applyScrollX",
        transform: "_transformScrollX",
        event: "scrollX",
        init: 0
      },
      /** The vertical scroll position */
      scrollY: {
        check: "qx.lang.Type.isNumber(value)&&value>=0&&value<=this.getScrollMaxY()",
        apply: "_applyScrollY",
        transform: "_transformScrollY",
        event: "scrollY",
        init: 0
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __frame__P_222_0: null,
      /*
      ---------------------------------------------------------------------------
        CONTENT MANAGEMENT
      ---------------------------------------------------------------------------
      */

      /**
       * Configures the content of the scroll pane. Replaces any existing child
       * with the newly given one.
       *
       * @param widget {qx.ui.core.Widget?null} The content widget of the pane
       */
      add(widget) {
        var old = this._getChildren()[0];
        if (old) {
          this._remove(old);
          old.removeListener("resize", this._onUpdate, this);
        }
        if (widget) {
          this._add(widget);
          widget.addListener("resize", this._onUpdate, this);
        }
      },
      /**
       * Removes the given widget from the content. The pane is empty
       * afterwards as only one child is supported by the pane.
       *
       * @param widget {qx.ui.core.Widget?null} The content widget of the pane
       */
      remove(widget) {
        if (widget) {
          this._remove(widget);
          widget.removeListener("resize", this._onUpdate, this);
        }
      },
      /**
       * Returns an array containing the current content.
       *
       * @return {Object[]} The content array
       */
      getChildren() {
        return this._getChildren();
      },
      /*
      ---------------------------------------------------------------------------
        EVENT LISTENER
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for resize event of content and container
       *
       * @param e {Event} Resize event object
       */
      _onUpdate(e) {
        this.fireEvent("update");
      },
      /**
       * Event listener for scroll event of content
       *
       * @param e {qx.event.type.Event} Scroll event object
       */
      _onScroll(e) {
        var contentEl = this.getContentElement();
        this.setScrollX(contentEl.getScrollX());
        this.setScrollY(contentEl.getScrollY());
      },
      /**
       * Event listener for appear event of content
       *
       * @param e {qx.event.type.Event} Appear event object
       */
      _onAppear(e) {
        var contentEl = this.getContentElement();
        var internalX = this.getScrollX();
        var domX = contentEl.getScrollX();
        if (internalX != domX) {
          contentEl.scrollToX(internalX);
        }
        var internalY = this.getScrollY();
        var domY = contentEl.getScrollY();
        if (internalY != domY) {
          contentEl.scrollToY(internalY);
        }
      },
      /*
      ---------------------------------------------------------------------------
        ITEM LOCATION SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the top offset of the given item in relation to the
       * inner height of this widget.
       *
       * @param item {qx.ui.core.Widget} Item to query
       * @return {Integer} Top offset
       */
      getItemTop(item) {
        var top = 0;
        do {
          top += item.getBounds().top;
          item = item.getLayoutParent();
        } while (item && item !== this);
        return top;
      },
      /**
       * Returns the top offset of the end of the given item in relation to the
       * inner height of this widget.
       *
       * @param item {qx.ui.core.Widget} Item to query
       * @return {Integer} Top offset
       */
      getItemBottom(item) {
        return this.getItemTop(item) + item.getBounds().height;
      },
      /**
       * Returns the left offset of the given item in relation to the
       * inner width of this widget.
       *
       * @param item {qx.ui.core.Widget} Item to query
       * @return {Integer} Top offset
       */
      getItemLeft(item) {
        var left = 0;
        var parent;
        do {
          left += item.getBounds().left;
          parent = item.getLayoutParent();
          if (parent) {
            left += parent.getInsets().left;
          }
          item = parent;
        } while (item && item !== this);
        return left;
      },
      /**
       * Returns the left offset of the end of the given item in relation to the
       * inner width of this widget.
       *
       * @param item {qx.ui.core.Widget} Item to query
       * @return {Integer} Right offset
       */
      getItemRight(item) {
        return this.getItemLeft(item) + item.getBounds().width;
      },
      /*
      ---------------------------------------------------------------------------
        DIMENSIONS
      ---------------------------------------------------------------------------
      */

      /**
       * The size (identical with the preferred size) of the content.
       *
       * @return {Map} Size of the content (keys: <code>width</code> and <code>height</code>)
       */
      getScrollSize() {
        return this.getChildren()[0].getBounds();
      },
      /*
      ---------------------------------------------------------------------------
        SCROLL SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * The maximum horizontal scroll position.
       *
       * @return {Integer} Maximum horizontal scroll position.
       */
      getScrollMaxX() {
        var paneSize = this.getInnerSize();
        var scrollSize = this.getScrollSize();
        if (paneSize && scrollSize) {
          return Math.max(0, scrollSize.width - paneSize.width);
        }
        return 0;
      },
      /**
       * The maximum vertical scroll position.
       *
       * @return {Integer} Maximum vertical scroll position.
       */
      getScrollMaxY() {
        var paneSize = this.getInnerSize();
        var scrollSize = this.getScrollSize();
        if (paneSize && scrollSize) {
          return Math.max(0, scrollSize.height - paneSize.height);
        }
        return 0;
      },
      /**
       * Scrolls the element's content to the given left coordinate
       *
       * @param value {Integer} The vertical position to scroll to.
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollToX(value, duration) {
        var max = this.getScrollMaxX();
        if (value < 0) {
          value = 0;
        } else if (value > max) {
          value = max;
        }
        this.stopScrollAnimation();
        if (duration) {
          var from = this.getScrollX();
          this.__frame__P_222_0 = new qx.bom.AnimationFrame();
          this.__frame__P_222_0.on("end", function () {
            this.setScrollX(value);
            this.__frame__P_222_0 = null;
            this.fireEvent("scrollAnimationEnd");
          }, this);
          this.__frame__P_222_0.on("frame", function (timePassed) {
            var newX = parseInt(timePassed / duration * (value - from) + from);
            this.setScrollX(newX);
          }, this);
          this.__frame__P_222_0.startSequence(duration);
        } else {
          this.setScrollX(value);
        }
      },
      /**
       * Scrolls the element's content to the given top coordinate
       *
       * @param value {Integer} The horizontal position to scroll to.
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollToY(value, duration) {
        var max = this.getScrollMaxY();
        if (value < 0) {
          value = 0;
        } else if (value > max) {
          value = max;
        }
        this.stopScrollAnimation();
        if (duration) {
          var from = this.getScrollY();
          this.__frame__P_222_0 = new qx.bom.AnimationFrame();
          this.__frame__P_222_0.on("end", function () {
            this.setScrollY(value);
            this.__frame__P_222_0 = null;
            this.fireEvent("scrollAnimationEnd");
          }, this);
          this.__frame__P_222_0.on("frame", function (timePassed) {
            var newY = parseInt(timePassed / duration * (value - from) + from);
            this.setScrollY(newY);
          }, this);
          this.__frame__P_222_0.startSequence(duration);
        } else {
          this.setScrollY(value);
        }
      },
      /**
       * Scrolls the element's content horizontally by the given amount.
       *
       * @param x {Integer?0} Amount to scroll
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollByX(x, duration) {
        this.scrollToX(this.getScrollX() + x, duration);
      },
      /**
       * Scrolls the element's content vertically by the given amount.
       *
       * @param y {Integer?0} Amount to scroll
       * @param duration {Number?} The time in milliseconds the scroll to should take.
       */
      scrollByY(y, duration) {
        this.scrollToY(this.getScrollY() + y, duration);
      },
      /**
       * If an scroll animation is running, it will be stopped with that method.
       */
      stopScrollAnimation() {
        if (this.__frame__P_222_0) {
          this.__frame__P_222_0.cancelSequence();
          this.__frame__P_222_0 = null;
        }
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyScrollX(value) {
        this.getContentElement().scrollToX(value);
      },
      /**
       * Transform property
       *
       * @param value {Number} Value to transform
       * @return {Number} Rounded value
       */
      _transformScrollX(value) {
        return Math.round(value);
      },
      // property apply
      _applyScrollY(value) {
        this.getContentElement().scrollToY(value);
      },
      /**
       * Transform property
       *
       * @param value {Number} Value to transform
       * @return {Number} Rounded value
       */
      _transformScrollY(value) {
        return Math.round(value);
      }
    }
  });
  qx.ui.core.scroll.ScrollPane.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.basic.Atom": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.MExecutable": {
        "require": true
      },
      "qx.ui.form.IExecutable": {
        "require": true
      },
      "qx.event.AcceleratingTimer": {
        "construct": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * The HoverButton is an {@link qx.ui.basic.Atom}, which fires repeatedly
   * execute events while the pointer is over the widget.
   *
   * The rate at which the execute event is fired accelerates is the pointer keeps
   * inside of the widget. The initial delay and the interval time can be set using
   * the properties {@link #firstInterval} and {@link #interval}. The
   * {@link #execute} events will be fired in a shorter amount of time if the pointer
   * remains over the widget, until the min {@link #minTimer} is reached.
   * The {@link #timerDecrease} property sets the amount of milliseconds which will
   * decreased after every firing.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   var button = new qx.ui.form.HoverButton("Hello World");
   *
   *   button.addListener("execute", function(e) {
   *     alert("Button is hovered");
   *   }, this);
   *
   *   this.getRoot.add(button);
   * </pre>
   *
   * This example creates a button with the label "Hello World" and attaches an
   * event listener to the {@link #execute} event.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/hoverbutton.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.form.HoverButton", {
    extend: qx.ui.basic.Atom,
    include: [qx.ui.core.MExecutable],
    implement: [qx.ui.form.IExecutable],
    /**
     * @param label {String} Label to use
     * @param icon {String?null} Icon to use
     */
    construct(label, icon) {
      qx.ui.basic.Atom.constructor.call(this, label, icon);
      this.addListener("pointerover", this._onPointerOver, this);
      this.addListener("pointerout", this._onPointerOut, this);
      this.__timer__P_198_0 = new qx.event.AcceleratingTimer();
      this.__timer__P_198_0.addListener("interval", this._onInterval, this);
    },
    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "hover-button"
      },
      /**
       * Interval used after the first run of the timer. Usually a smaller value
       * than the "firstInterval" property value to get a faster reaction.
       */
      interval: {
        check: "Integer",
        init: 80
      },
      /**
       * Interval used for the first run of the timer. Usually a greater value
       * than the "interval" property value to a little delayed reaction at the first
       * time.
       */
      firstInterval: {
        check: "Integer",
        init: 200
      },
      /** This configures the minimum value for the timer interval. */
      minTimer: {
        check: "Integer",
        init: 20
      },
      /** Decrease of the timer on each interval (for the next interval) until minTimer reached. */
      timerDecrease: {
        check: "Integer",
        init: 2
      }
    },
    members: {
      __timer__P_198_0: null,
      /**
       * Start timer on pointer over
       *
       * @param e {qx.event.type.Pointer} The pointer event
       */
      _onPointerOver(e) {
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
        this.__timer__P_198_0.set({
          interval: this.getInterval(),
          firstInterval: this.getFirstInterval(),
          minimum: this.getMinTimer(),
          decrease: this.getTimerDecrease()
        }).start();
        this.addState("hovered");
      },
      /**
       * Stop timer on pointer out
       *
       * @param e {qx.event.type.Pointer} The pointer event
       */
      _onPointerOut(e) {
        this.__timer__P_198_0.stop();
        this.removeState("hovered");
        if (!this.isEnabled() || e.getTarget() !== this) {
          return;
        }
      },
      /**
       * Fire execute event on timer interval event
       */
      _onInterval() {
        if (this.isEnabled()) {
          this.execute();
        } else {
          this.__timer__P_198_0.stop();
        }
      }
    },
    destruct() {
      this._disposeObjects("__timer__P_198_0");
    }
  });
  qx.ui.form.HoverButton.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.html.Element": {
        "construct": true,
        "require": true
      },
      "qx.bom.Iframe": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * A cross browser iframe instance.
   */
  qx.Class.define("qx.html.Iframe", {
    extend: qx.html.Element,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Wrapper for the HTML Iframe element.
     * @param url {String} Location which should be loaded inside the Iframe.
     * @param styles {Map?null} optional map of CSS styles, where the key is the name
     *    of the style and the value is the value to use.
     * @param attributes {Map?null} optional map of element attributes, where the
     *    key is the name of the attribute and the value is the value to use.
     */
    construct(url, styles, attributes) {
      qx.html.Element.constructor.call(this, "iframe", styles, attributes);
      this.registerProperty("source", null, this._setSourceProperty);
      this.setSource(url);
      this.addListener("navigate", this.__onNavigate__P_199_0, this);

      // add yourself to the element queue to enforce the creation of DOM element
      qx.html.Element._modified[this.toHashCode()] = this;
      qx.html.Element._scheduleFlush("element");
    },
    /*
     *****************************************************************************
        EVENTS
     *****************************************************************************
     */

    events: {
      /**
       * The "load" event is fired after the iframe content has successfully been loaded.
       */
      load: "qx.event.type.Event",
      /**
       * The "navigate" event is fired whenever the location of the iframe
       * changes.
       *
       * Useful to track user navigation and internally used to keep the source
       * property in sync. Only works when the destination source is of same
       * origin than the page embedding the iframe.
       */
      navigate: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        ELEMENT API
      ---------------------------------------------------------------------------
      */

      /**
       * Implementation of setter for the "source" property
       *
       * @param value {String?} value to set
       */
      _setSourceProperty(value) {
        var element = this.getDomElement();
        var currentUrl = qx.bom.Iframe.queryCurrentUrl(element);

        // Skip if frame is already on URL.
        //
        // When URL of Iframe and source property get out of sync, the source
        // property needs to be updated [BUG #4481]. This is to make sure the
        // same source is not set twice on the BOM level.
        if (value === currentUrl) {
          return;
        }
        qx.bom.Iframe.setSource(element, value);
      },
      // overridden
      _createDomElement() {
        return qx.bom.Iframe.create();
      },
      /*
      ---------------------------------------------------------------------------
        IFRAME API
      ---------------------------------------------------------------------------
      */

      /**
       * Get the DOM window object of an iframe.
       *
       * @return {Window} The DOM window object of the iframe.
       */
      getWindow() {
        var element = this.getDomElement();
        if (element) {
          return qx.bom.Iframe.getWindow(element);
        } else {
          return null;
        }
      },
      /**
       * Get the DOM document object of an iframe.
       *
       * @return {Document} The DOM document object of the iframe.
       */
      getDocument() {
        var element = this.getDomElement();
        if (element) {
          return qx.bom.Iframe.getDocument(element);
        } else {
          return null;
        }
      },
      /**
       * Get the HTML body element of the iframe.
       *
       * @return {Element} The DOM node of the <code>body</code> element of the iframe.
       */
      getBody() {
        var element = this.getDomElement();
        if (element) {
          return qx.bom.Iframe.getBody(element);
        } else {
          return null;
        }
      },
      /**
       * Sets iframe's source attribute to given value
       *
       * @param source {String} URL to be set.
       * @return {qx.html.Iframe} The current instance for chaining
       */
      setSource(source) {
        // the source needs to be applied directly in case the iFrame is hidden
        this._setProperty("source", source, true);
        return this;
      },
      /**
       * Get the current source.
       *
       * @return {String} The iframe's source
       */
      getSource() {
        return this._getProperty("source");
      },
      /**
       * Sets iframe's name attribute to given value
       *
       * @param name {String} Name to be set.
       * @return {qx.html.Iframe} The current instance for chaining
       */
      setName(name) {
        this.setAttribute("name", name);
        return this;
      },
      /**
       * Get the current name.
       *
       * @return {String} The iframe's name.
       */
      getName() {
        return this.getAttribute("name");
      },
      /**
       * Reloads iframe
       */
      reload() {
        var element = this.getDomElement();
        if (element) {
          var url = this.getSource();
          this.setSource(null);
          this.setSource(url);
        }
      },
      /*
      ---------------------------------------------------------------------------
        LISTENER
      ---------------------------------------------------------------------------
      */

      /**
       * Handle user navigation. Sync actual URL of iframe with source property.
       *
       * @param e {qx.event.type.Data} navigate event
       */
      __onNavigate__P_199_0(e) {
        var actualUrl = e.getData();
        if (actualUrl) {
          this.setSource(actualUrl);
        }
      }
    }
  });
  qx.html.Iframe.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Mouse": {
        "require": true
      },
      "qx.util.Wheel": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Mouse wheel event object.
   */
  qx.Class.define("qx.event.type.MouseWheel", {
    extend: qx.event.type.Mouse,
    members: {
      // overridden
      stop() {
        this.stopPropagation();
        this.preventDefault();
      },
      /**
       * Get the amount the wheel has been scrolled
       *
       * @param axis {String?} Optional parameter which defines the scroll axis.
       *   The value can either be <code>"x"</code> or <code>"y"</code>.
       * @return {Integer} Scroll wheel movement for the given axis. If no axis
       *   is given, the y axis is used.
       */
      getWheelDelta(axis) {
        return qx.util.Wheel.getDelta(this._native, axis);
      }
    }
  });
  qx.event.type.MouseWheel.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Event": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Tino Butz (tbtz)
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * Unify Project
  
       Homepage:
         http://unify-project.org
  
       Copyright:
         2009-2010 Deutsche Telekom AG, Germany, http://telekom.com
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
  ************************************************************************ */

  /**
   * Orientation event object.
   */
  qx.Class.define("qx.event.type.Orientation", {
    extend: qx.event.type.Event,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __orientation__P_226_0: null,
      __mode__P_226_1: null,
      /**
       * Initialize the fields of the event. The event must be initialized before
       * it can be dispatched.
       *
       * @param orientation {String} One of <code>0</code>, <code>90</code> or <code>-90</code>
       * @param mode {String} <code>landscape</code> or <code>portrait</code>
       * @return {qx.event.type.Orientation} The initialized event instance
       */
      init(orientation, mode) {
        qx.event.type.Orientation.superclass.prototype.init.call(this, false, false);
        this.__orientation__P_226_0 = orientation;
        this.__mode__P_226_1 = mode;
        return this;
      },
      /**
       * Get a copy of this object
       *
       * @param embryo {qx.event.type.Orientation?null} Optional event class, which will
       *     be configured using the data of this event instance. The event must be
       *     an instance of this event class. If the data is <code>null</code>,
       *     a new pooled instance is created.
       *
       * @return {qx.event.type.Orientation} a copy of this object
       */
      clone(embryo) {
        var clone = qx.event.type.Orientation.superclass.prototype.clone.call(this, embryo);
        clone.__orientation__P_226_0 = this.__orientation__P_226_0;
        clone.__mode__P_226_1 = this.__mode__P_226_1;
        return clone;
      },
      /**
       * Returns the current orientation of the viewport in degree.
       *
       * All possible values and their meaning:
       *
       * * <code>0</code>: "Portrait"
       * * <code>-90</code>: "Landscape (right, screen turned clockwise)"
       * * <code>90</code>: "Landscape (left, screen turned counterclockwise)"
       * * <code>180</code>: "Portrait (upside-down portrait)"
       *
       * @return {Integer} The current orientation in degree
       */
      getOrientation() {
        return this.__orientation__P_226_0;
      },
      /**
       * Whether the viewport orientation is currently in landscape mode.
       *
       * @return {Boolean} <code>true</code> when the viewport orientation
       *     is currently in landscape mode.
       */
      isLandscape() {
        return this.__mode__P_226_1 == "landscape";
      },
      /**
       * Whether the viewport orientation is currently in portrait mode.
       *
       * @return {Boolean} <code>true</code> when the viewport orientation
       *     is currently in portrait mode.
       */
      isPortrait() {
        return this.__mode__P_226_1 == "portrait";
      }
    }
  });
  qx.event.type.Orientation.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.type.Dom": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
       * Tino Butz (tbtz)
  
  ************************************************************************ */

  /**
   * Touch event object.
   *
   * For more information see:
   *     https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html
   */
  qx.Class.define("qx.event.type.Touch", {
    extend: qx.event.type.Dom,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      // overridden
      _cloneNativeEvent(nativeEvent, clone) {
        var clone = qx.event.type.Touch.superclass.prototype._cloneNativeEvent.call(this, nativeEvent, clone);
        clone.pageX = nativeEvent.pageX;
        clone.pageY = nativeEvent.pageY;
        clone.offsetX = nativeEvent.offsetX;
        clone.offsetY = nativeEvent.offsetY;

        // Workaround for BUG #6491
        clone.layerX = nativeEvent.offsetX || nativeEvent.layerX;
        clone.layerY = nativeEvent.offsetY || nativeEvent.layerY;
        clone.scale = nativeEvent.scale;
        clone.rotation = nativeEvent.rotation;
        clone._rotation = nativeEvent._rotation;
        clone.delta = nativeEvent.delta;
        clone.srcElement = nativeEvent.srcElement;
        clone.targetTouches = [];
        for (var i = 0; i < nativeEvent.targetTouches.length; i++) {
          clone.targetTouches[i] = nativeEvent.targetTouches[i];
        }
        clone.changedTouches = [];
        for (i = 0; i < nativeEvent.changedTouches.length; i++) {
          clone.changedTouches[i] = nativeEvent.changedTouches[i];
        }
        clone.touches = [];
        for (i = 0; i < nativeEvent.touches.length; i++) {
          clone.touches[i] = nativeEvent.touches[i];
        }
        return clone;
      },
      // overridden
      stop() {
        this.stopPropagation();
      },
      /**
       * Returns an array of native Touch objects representing all current
       * touches on the document.
       * Returns an empty array for the "touchend" event.
       *
       * @return {Object[]} Array of touch objects. For more information see:
       *     https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html
       */
      getAllTouches() {
        return this._native.touches;
      },
      /**
       * Returns an array of native Touch objects representing all touches
       * associated with the event target element.
       * Returns an empty array for the "touchend" event.
       *
       * @return {Object[]} Array of touch objects. For more information see:
       *     https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html
       */
      getTargetTouches() {
        return this._native.targetTouches;
      },
      /**
       * Returns an array of native Touch objects representing all touches of
       * the target element that changed in this event.
       *
       * On the "touchstart" event the array contains all touches that were
       * added to the target element.
       * On the "touchmove" event the array contains all touches that were
       * moved on the target element.
       * On the "touchend" event the array contains all touches that used
       * to be on the target element.
       *
       * @return {Object[]} Array of touch objects. For more information see:
       *     https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html
       */
      getChangedTargetTouches() {
        return this._native.changedTouches;
      },
      /**
       * Checks whether more than one touch is associated with the event target
       * element.
       *
       * @return {Boolean} Is multi-touch
       */
      isMultiTouch() {
        return this.__getEventSpecificTouches__P_202_0().length > 1;
      },
      /**
       * Returns the distance between two fingers since the start of the event.
       * The distance is a multiplier of the initial distance.
       * Initial value: 1.0.
       * Gestures:
       * < 1.0, pinch close / zoom out.
       * > 1.0, pinch open / to zoom in.
       *
       * @return {Float} The scale distance between two fingers
       */
      getScale() {
        return this._native.scale;
      },
      /**
       * Returns the delta of the rotation since the start of the event, in degrees.
       * Initial value is 0.0
       * Clockwise > 0
       * Counter-clockwise < 0.
       *
       * @return {Float} The rotation delta
       */
      getRotation() {
        if (typeof this._native._rotation === "undefined") {
          return this._native.rotation;
        } else {
          return this._native._rotation;
        }
      },
      /**
       * Returns an array with the calculated delta coordinates of all active touches,
       * relative to the position on <code>touchstart</code> event.
       *
       * @return {Array} an array with objects for each active touch which contains the delta as <code>x</code> and
       * <code>y</code>, the touch identifier as <code>identifier</code> and the movement axis as <code>axis</code>.
       */
      getDelta() {
        return this._native.delta;
      },
      /**
       * Get the horizontal position at which the event occurred relative to the
       * left of the document. This property takes into account any scrolling of
       * the page.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The horizontal position of the touch in the document.
       */
      getDocumentLeft(touchIndex) {
        return this.__getEventSpecificTouch__P_202_1(touchIndex).pageX;
      },
      /**
       * Get the vertical position at which the event occurred relative to the
       * top of the document. This property takes into account any scrolling of
       * the page.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The vertical position of the touch in the document.
       */
      getDocumentTop(touchIndex) {
        return this.__getEventSpecificTouch__P_202_1(touchIndex).pageY;
      },
      /**
       * Get the horizontal coordinate at which the event occurred relative to
       * the origin of the screen coordinate system.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The horizontal position of the touch
       */
      getScreenLeft(touchIndex) {
        return this.__getEventSpecificTouch__P_202_1(touchIndex).screenX;
      },
      /**
       * Get the vertical coordinate at which the event occurred relative to
       * the origin of the screen coordinate system.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The vertical position of the touch
       */
      getScreenTop(touchIndex) {
        return this.__getEventSpecificTouch__P_202_1(touchIndex).screenY;
      },
      /**
       * Get the the horizontal coordinate at which the event occurred relative
       * to the viewport.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The horizontal position of the touch
       */
      getViewportLeft(touchIndex) {
        return this.__getEventSpecificTouch__P_202_1(touchIndex).clientX;
      },
      /**
       * Get the vertical coordinate at which the event occurred relative
       * to the viewport.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} The vertical position of the touch
       */
      getViewportTop(touchIndex) {
        return this.__getEventSpecificTouch__P_202_1(touchIndex).clientY;
      },
      /**
       * Returns the unique identifier for a certain touch object.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object
       * @return {Integer} Unique identifier of the touch object
       */
      getIdentifier(touchIndex) {
        return this.__getEventSpecificTouch__P_202_1(touchIndex).identifier;
      },
      /**
       * Returns an event specific touch on the target element. This function is
       * used as the "touchend" event only offers Touch objects in the
       * changedTouches array.
       *
       * @param touchIndex {Integer ? 0} The index of the Touch object to
       *     retrieve
       * @return {Object} A native Touch object
       */
      __getEventSpecificTouch__P_202_1(touchIndex) {
        touchIndex = touchIndex == null ? 0 : touchIndex;
        return this.__getEventSpecificTouches__P_202_0()[touchIndex];
      },
      /**
       * Returns the event specific touches on the target element. This function
       * is used as the "touchend" event only offers Touch objects in the
       * changedTouches array.
       *
       * @return {Object[]} Array of native Touch objects
       */
      __getEventSpecificTouches__P_202_0() {
        var touches = this._isTouchEnd() ? this.getChangedTargetTouches() : this.getTargetTouches();
        return touches;
      },
      /**
       * Indicates if the event occurs during the "touchend" phase. Needed to
       * determine the event specific touches. Override this method if you derive
       * from this class and want to indicate that the specific event occurred
       * during the "touchend" phase.
       *
       * @return {Boolean} Whether the event occurred during the "touchend" phase
       */
      _isTouchEnd() {
        return this.getType() == "touchend" || this.getType() == "touchcancel";
      }
    }
  });
  qx.event.type.Touch.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Engine": {},
      "qx.bom.client.Browser": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["plugin.gears", "plugin.quicktime", "plugin.quicktime.version", "plugin.windowsmedia", "plugin.windowsmedia.version", "plugin.divx", "plugin.divx.version", "plugin.silverlight", "plugin.silverlight.version", "plugin.pdf", "plugin.pdf.version", "plugin.activex", "plugin.skype"],
      "required": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * Contains detection for QuickTime, Windows Media, DivX, Silverlight and gears.
   * If no version could be detected the version is set to an empty string as
   * default.
   *
   * This class is used by {@link qx.core.Environment} and should not be used
   * directly. Please check its class comment for details how to use it.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Plugin", {
    statics: {
      /**
       * Checks for the availability of google gears plugin.
       *
       * @internal
       * @return {Boolean} <code>true</code> if gears is available
       */
      getGears() {
        return !!(window.google && window.google.gears);
      },
      /**
       * Checks for ActiveX availability.
       *
       * @internal
       * @return {Boolean} <code>true</code> if ActiveX is available
       *
       * @ignore(window.ActiveXObject)
       */
      getActiveX() {
        if (typeof window.ActiveXObject === "function") {
          return true;
        }
        try {
          // in IE11 Preview, ActiveXObject is undefined but instances can
          // still be created
          return window.ActiveXObject !== undefined && (typeof new window.ActiveXObject("Microsoft.XMLHTTP") === "object" || typeof new window.ActiveXObject("MSXML2.DOMDocument.6.0") === "object");
        } catch (ex) {
          return false;
        }
      },
      /**
       * Checks for Skypes 'Click to call' availability.
       *
       * @internal
       * @return {Boolean} <code>true</code> if the plugin is available.
       */
      getSkype() {
        // IE Support
        if (qx.bom.client.Plugin.getActiveX()) {
          try {
            new window.ActiveXObject("Skype.Detection");
            return true;
          } catch (e) {}
        }
        var mimeTypes = navigator.mimeTypes;
        if (mimeTypes) {
          // FF support
          if ("application/x-skype" in mimeTypes) {
            return true;
          }
          // webkit support
          for (var i = 0; i < mimeTypes.length; i++) {
            var desc = mimeTypes[i];
            if (desc.type.indexOf("skype.click2call") != -1) {
              return true;
            }
          }
        }
        return false;
      },
      /**
       * Database of supported features.
       * Filled with additional data at initialization
       */
      __db__P_203_0: {
        quicktime: {
          plugin: ["QuickTime"],
          control: "QuickTimeCheckObject.QuickTimeCheck.1"
          // call returns boolean: instance.IsQuickTimeAvailable(0)
        },
        wmv: {
          plugin: ["Windows Media"],
          control: "WMPlayer.OCX.7"
          // version string in: instance.versionInfo
        },
        divx: {
          plugin: ["DivX Web Player"],
          control: "npdivx.DivXBrowserPlugin.1"
        },
        silverlight: {
          plugin: ["Silverlight"],
          control: "AgControl.AgControl"
          // version string in: instance.version (Silverlight 1.0)
          // version string in: instance.settings.version (Silverlight 1.1)
          // version check possible using instance.IsVersionSupported
        },
        pdf: {
          plugin: ["Chrome PDF Viewer", "Adobe Acrobat"],
          control: "AcroPDF.PDF"
          // this is detecting Acrobat PDF version > 7 and Chrome PDF Viewer
        }
      },
      /**
       * Fetches the version of the quicktime plugin.
       * @return {String} The version of the plugin, if available,
       *   an empty string otherwise
       * @internal
       */
      getQuicktimeVersion() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["quicktime"];
        return qx.bom.client.Plugin.__getVersion__P_203_1(entry.control, entry.plugin);
      },
      /**
       * Fetches the version of the windows media plugin.
       * @return {String} The version of the plugin, if available,
       *   an empty string otherwise
       * @internal
       */
      getWindowsMediaVersion() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["wmv"];
        return qx.bom.client.Plugin.__getVersion__P_203_1(entry.control, entry.plugin, true);
      },
      /**
       * Fetches the version of the divx plugin.
       * @return {String} The version of the plugin, if available,
       *   an empty string otherwise
       * @internal
       */
      getDivXVersion() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["divx"];
        return qx.bom.client.Plugin.__getVersion__P_203_1(entry.control, entry.plugin);
      },
      /**
       * Fetches the version of the silverlight plugin.
       * @return {String} The version of the plugin, if available,
       *   an empty string otherwise
       * @internal
       */
      getSilverlightVersion() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["silverlight"];
        return qx.bom.client.Plugin.__getVersion__P_203_1(entry.control, entry.plugin);
      },
      /**
       * Fetches the version of the pdf plugin.
       *
       * There are two built-in PDF viewer shipped with browsers:
       *
       * <ul>
       *  <li>Chrome PDF Viewer</li>
       *  <li>PDF.js (Firefox)</li>
       * </ul>
       *
       * While the Chrome PDF Viewer is implemented as plugin and therefore
       * detected by this method PDF.js is <strong>not</strong>.
       *
       * See the dedicated environment key (<em>plugin.pdfjs</em>) instead,
       * which you might check additionally.
       *
       * @return {String} The version of the plugin, if available,
       *  an empty string otherwise
       * @internal
       */
      getPdfVersion() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["pdf"];
        return qx.bom.client.Plugin.__getVersion__P_203_1(entry.control, entry.plugin);
      },
      /**
       * Checks if the quicktime plugin is available.
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getQuicktime() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["quicktime"];
        return qx.bom.client.Plugin.__isAvailable__P_203_2(entry.control, entry.plugin);
      },
      /**
       * Checks if the windows media plugin is available.
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getWindowsMedia() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["wmv"];
        return qx.bom.client.Plugin.__isAvailable__P_203_2(entry.control, entry.plugin, true);
      },
      /**
       * Checks if the divx plugin is available.
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getDivX() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["divx"];
        return qx.bom.client.Plugin.__isAvailable__P_203_2(entry.control, entry.plugin);
      },
      /**
       * Checks if the silverlight plugin is available.
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getSilverlight() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["silverlight"];
        return qx.bom.client.Plugin.__isAvailable__P_203_2(entry.control, entry.plugin);
      },
      /**
       * Checks if the pdf plugin is available.
       *
       * There are two built-in PDF viewer shipped with browsers:
       *
       * <ul>
       *  <li>Chrome PDF Viewer</li>
       *  <li>PDF.js (Firefox)</li>
       * </ul>
       *
       * While the Chrome PDF Viewer is implemented as plugin and therefore
       * detected by this method PDF.js is <strong>not</strong>.
       *
       * See the dedicated environment key (<em>plugin.pdfjs</em>) instead,
       * which you might check additionally.
       *
       * @return {Boolean} <code>true</code> if the plugin is available
       * @internal
       */
      getPdf() {
        var entry = qx.bom.client.Plugin.__db__P_203_0["pdf"];
        return qx.bom.client.Plugin.__isAvailable__P_203_2(entry.control, entry.plugin);
      },
      /**
       * Internal helper for getting the version of a given plugin.
       *
       * @param activeXName {String} The name which should be used to generate
       *   the test ActiveX Object.
       * @param pluginNames {Array} The names with which the plugins are listed in
       *   the navigator.plugins list.
       * @param forceActiveX {Boolean?false} Force detection using ActiveX
       *   for IE11 plugins that aren't listed in navigator.plugins
       * @return {String} The version of the plugin as string.
       */
      __getVersion__P_203_1(activeXName, pluginNames, forceActiveX) {
        var available = qx.bom.client.Plugin.__isAvailable__P_203_2(activeXName, pluginNames, forceActiveX);

        // don't check if the plugin is not available
        if (!available) {
          return "";
        }

        // IE checks
        if (qx.bom.client.Engine.getName() == "mshtml" && (qx.bom.client.Browser.getDocumentMode() < 11 || forceActiveX)) {
          try {
            var obj = new window.ActiveXObject(activeXName);
            var version;

            // pdf version detection
            if (obj.GetVersions && obj.GetVersions()) {
              version = obj.GetVersions().split(",");
              if (version.length > 1) {
                version = version[0].split("=");
                if (version.length === 2) {
                  return version[1];
                }
              }
            }
            version = obj.versionInfo;
            if (version != undefined) {
              return version;
            }
            version = obj.version;
            if (version != undefined) {
              return version;
            }
            version = obj.settings.version;
            if (version != undefined) {
              return version;
            }
          } catch (ex) {
            return "";
          }
          return "";

          // all other browsers
        } else {
          var plugins = navigator.plugins;
          var verreg = /([0-9]\.[0-9])/g;
          for (var i = 0; i < plugins.length; i++) {
            var plugin = plugins[i];
            for (var j = 0; j < pluginNames.length; j++) {
              if (plugin.name.indexOf(pluginNames[j]) !== -1) {
                if (verreg.test(plugin.name) || verreg.test(plugin.description)) {
                  return RegExp.$1;
                }
              }
            }
          }
          return "";
        }
      },
      /**
       * Internal helper for getting the availability of a given plugin.
       *
       * @param activeXName {String} The name which should be used to generate
       *   the test ActiveX Object.
       * @param pluginNames {Array} The names with which the plugins are listed in
       *   the navigator.plugins list.
       * @param forceActiveX {Boolean?false} Force detection using ActiveX
       *   for IE11 plugins that aren't listed in navigator.plugins
       * @return {Boolean} <code>true</code>, if the plugin available
       */
      __isAvailable__P_203_2(activeXName, pluginNames, forceActiveX) {
        // IE checks
        if (qx.bom.client.Engine.getName() == "mshtml" && (qx.bom.client.Browser.getDocumentMode() < 11 || forceActiveX)) {
          if (!this.getActiveX()) {
            return false;
          }
          try {
            new window.ActiveXObject(activeXName);
          } catch (ex) {
            return false;
          }
          return true;
          // all other
        } else {
          var plugins = navigator.plugins;
          if (!plugins) {
            return false;
          }
          var name;
          for (var i = 0; i < plugins.length; i++) {
            name = plugins[i].name;
            for (var j = 0; j < pluginNames.length; j++) {
              if (name.indexOf(pluginNames[j]) !== -1) {
                return true;
              }
            }
          }
          return false;
        }
      }
    },
    defer(statics) {
      qx.core.Environment.add("plugin.gears", statics.getGears);
      qx.core.Environment.add("plugin.quicktime", statics.getQuicktime);
      qx.core.Environment.add("plugin.quicktime.version", statics.getQuicktimeVersion);
      qx.core.Environment.add("plugin.windowsmedia", statics.getWindowsMedia);
      qx.core.Environment.add("plugin.windowsmedia.version", statics.getWindowsMediaVersion);
      qx.core.Environment.add("plugin.divx", statics.getDivX);
      qx.core.Environment.add("plugin.divx.version", statics.getDivXVersion);
      qx.core.Environment.add("plugin.silverlight", statics.getSilverlight);
      qx.core.Environment.add("plugin.silverlight.version", statics.getSilverlightVersion);
      qx.core.Environment.add("plugin.pdf", statics.getPdf);
      qx.core.Environment.add("plugin.pdf.version", statics.getPdfVersion);
      qx.core.Environment.add("plugin.activex", statics.getActiveX);
      qx.core.Environment.add("plugin.skype", statics.getSkype);
    }
  });
  qx.bom.client.Plugin.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.xml.Document": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["xml.implementation", "xml.domparser", "xml.selectsinglenode", "xml.selectnodes", "xml.getelementsbytagnamens", "xml.domproperties", "xml.attributens", "xml.createelementns", "xml.createnode", "xml.getqualifieditem"],
      "required": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Daniel Wagner (d_wagner)
  
  ************************************************************************ */
  /**
   * Internal class which contains the checks used by {@link qx.core.Environment}.
   * All checks in here are marked as internal which means you should never use
   * them directly.
   *
   * This class should contain all XML-related checks
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.Xml", {
    statics: {
      /**
       * Checks if XML is supported
       *
       * @internal
       * @return {Boolean} <code>true</code> if XML is supported
       */
      getImplementation() {
        return document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("XML", "1.0");
      },
      /**
       * Checks if an XML DOMParser is available
       *
       * @internal
       * @return {Boolean} <code>true</code> if DOMParser is supported
       */
      getDomParser() {
        return typeof window.DOMParser !== "undefined";
      },
      /**
       * Checks if the proprietary selectSingleNode method is available on XML DOM
       * nodes.
       *
       * @internal
       * @return {Boolean} <code>true</code> if selectSingleNode is available
       */
      getSelectSingleNode() {
        return typeof qx.xml.Document.create().selectSingleNode !== "undefined";
      },
      /**
       * Checks if the proprietary selectNodes method is available on XML DOM
       * nodes.
       *
       * @internal
       * @return {Boolean} <code>true</code> if selectSingleNode is available
       */
      getSelectNodes() {
        return typeof qx.xml.Document.create().selectNodes !== "undefined";
      },
      /**
       * Checks availability of the getElementsByTagNameNS XML DOM method.
       *
       * @internal
       * @return {Boolean} <code>true</code> if getElementsByTagNameNS is available
       */
      getElementsByTagNameNS() {
        return typeof qx.xml.Document.create().getElementsByTagNameNS !== "undefined";
      },
      /**
       * Checks if MSXML-style DOM Level 2 properties are supported.
       *
       * @internal
       * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
       */
      getDomProperties() {
        var doc = qx.xml.Document.create();
        return "getProperty" in doc && typeof doc.getProperty("SelectionLanguage") === "string";
      },
      /**
       * Checks if the getAttributeNS and setAttributeNS methods are supported on
       * XML DOM elements
       *
       * @internal
       * @return {Boolean} <code>true</code> if get/setAttributeNS is supported
       */
      getAttributeNS() {
        var docElem = qx.xml.Document.fromString("<a></a>").documentElement;
        return typeof docElem.getAttributeNS === "function" && typeof docElem.setAttributeNS === "function";
      },
      /**
       * Checks if the createElementNS method is supported on XML DOM documents
       *
       * @internal
       * @return {Boolean} <code>true</code> if createElementNS is supported
       */
      getCreateElementNS() {
        return typeof qx.xml.Document.create().createElementNS === "function";
      },
      /**
       * Checks if the proprietary createNode method is supported on XML DOM
       * documents
       *
       * @internal
       * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
       */
      getCreateNode() {
        return typeof qx.xml.Document.create().createNode !== "undefined";
      },
      /**
       * Checks if the proprietary getQualifiedItem method is supported for XML
       * element attributes
       *
       * @internal
       * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
       */
      getQualifiedItem() {
        var docElem = qx.xml.Document.fromString("<a></a>").documentElement;
        return typeof docElem.attributes.getQualifiedItem !== "undefined";
      }
    },
    defer(statics) {
      qx.core.Environment.add("xml.implementation", statics.getImplementation);
      qx.core.Environment.add("xml.domparser", statics.getDomParser);
      qx.core.Environment.add("xml.selectsinglenode", statics.getSelectSingleNode);
      qx.core.Environment.add("xml.selectnodes", statics.getSelectNodes);
      qx.core.Environment.add("xml.getelementsbytagnamens", statics.getElementsByTagNameNS);
      qx.core.Environment.add("xml.domproperties", statics.getDomProperties);
      qx.core.Environment.add("xml.attributens", statics.getAttributeNS);
      qx.core.Environment.add("xml.createelementns", statics.getCreateElementNS);
      qx.core.Environment.add("xml.createnode", statics.getCreateNode);
      qx.core.Environment.add("xml.getqualifieditem", statics.getQualifiedItem);
    }
  });
  qx.bom.client.Xml.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Plugin": {
        "defer": "load",
        "require": true
      },
      "qx.bom.client.Xml": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "plugin.activex": {
          "className": "qx.bom.client.Plugin",
          "defer": true
        },
        "xml.implementation": {
          "className": "qx.bom.client.Xml"
        },
        "xml.domparser": {
          "className": "qx.bom.client.Xml"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Cross browser XML document creation API
   *
   * The main purpose of this class is to allow you to create XML document objects in a
   * cross-browser fashion. Use <code>create</code> to create an empty document,
   * <code>fromString</code> to create one from an existing XML text. Both methods
   * return a *native DOM object*. That means you use standard DOM methods on such
   * an object (e.g. <code>createElement</code>).
   *
   * The following links provide further information on XML documents:
   *
   * * <a href="http://www.w3.org/TR/DOM-Level-2-Core/core.html#i-Document">W3C Interface Specification</a>
   * * <a href="http://msdn2.microsoft.com/en-us/library/ms535918.aspx">MS xml Object</a>
   * * <a href="http://msdn2.microsoft.com/en-us/library/ms764622.aspx">MSXML GUIDs and ProgIDs</a>
   * * <a href="https://developer.mozilla.org/en-US/docs/Parsing_and_serializing_XML">MDN Parsing and Serializing XML</a>
   */
  /* global ActiveXObject */
  /* global window */
  qx.Bootstrap.define("qx.xml.Document", {
    statics: {
      /** @type {String} ActiveX class name of DOMDocument (IE specific) */
      DOMDOC: null,
      /** @type {String} ActiveX class name of XMLHttpRequest (IE specific) */
      XMLHTTP: null,
      /**
       * Whether the given element is a XML document or element
       * which is part of a XML document.
       *
       * @param elem {Document|Element} Any DOM Document or Element
       * @return {Boolean} Whether the document is a XML document
       */
      isXmlDocument(elem) {
        if (elem.nodeType === 9) {
          return elem.documentElement.nodeName !== "HTML";
        } else if (elem.ownerDocument) {
          return this.isXmlDocument(elem.ownerDocument);
        } else {
          return false;
        }
      },
      /**
       * Create an XML document.
       *
       * Returns a native DOM document object, set up for XML.
       *
       * @param namespaceUri {String ? null} The namespace URI of the document element to create or null.
       * @param qualifiedName {String ? null} The qualified name of the document element to be created or null.
       * @return {Document} empty XML object
       *
       * @ignore(ActiveXObject)
       */
      create(namespaceUri, qualifiedName) {
        // ActiveX - This is the preferred way for IE9 as well since it has no XPath
        // support when using the native implementation.createDocument
        if (qx.core.Environment.get("plugin.activex")) {
          var obj = new ActiveXObject(this.DOMDOC);
          //The SelectionLanguage property is no longer needed in MSXML 6; trying
          // to set it causes an exception in IE9.
          if (this.DOMDOC == "MSXML2.DOMDocument.3.0") {
            obj.setProperty("SelectionLanguage", "XPath");
          }
          if (qualifiedName) {
            var str = '<?xml version="1.0" encoding="utf-8"?>\n<';
            str += qualifiedName;
            if (namespaceUri) {
              str += " xmlns='" + namespaceUri + "'";
            }
            str += " />";
            obj.loadXML(str);
          }
          return obj;
        }
        if (qx.core.Environment.get("xml.implementation")) {
          return document.implementation.createDocument(namespaceUri || "", qualifiedName || "", null);
        }
        throw new Error("No XML implementation available!");
      },
      /**
       * The string passed in is parsed into a DOM document.
       *
       * @param str {String} the string to be parsed
       * @return {Document} XML document with given content
       * @signature function(str)
       *
       * @ignore(DOMParser)
       */
      fromString(str) {
        // Legacy IE/ActiveX
        if (qx.core.Environment.get("plugin.activex")) {
          var dom = qx.xml.Document.create();
          dom.loadXML(str);
          return dom;
        }
        if (qx.core.Environment.get("xml.domparser")) {
          var parser = new DOMParser();
          return parser.parseFromString(str, "text/xml");
        }
        throw new Error("No XML implementation available!");
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      // Detecting available ActiveX implementations.
      if (qx.core.Environment.get("plugin.activex")) {
        // According to information on the Microsoft XML Team's WebLog
        // it is recommended to check for availability of MSXML versions 6.0 and 3.0.
        // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
        var domDoc = ["MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0"];
        var httpReq = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0"];
        for (var i = 0, l = domDoc.length; i < l; i++) {
          try {
            // Keep both objects in sync with the same version.
            // This is important as there were compatibility issues detected.
            new ActiveXObject(domDoc[i]);
            new ActiveXObject(httpReq[i]);
          } catch (ex) {
            continue;
          }

          // Update static constants
          statics.DOMDOC = domDoc[i];
          statics.XMLHTTP = httpReq[i];

          // Stop loop here
          break;
        }
      }
    }
  });
  qx.xml.Document.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Html": {
        "require": true
      },
      "qx.dom.Node": {},
      "qx.bom.Selection": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "html.selection": {
          "load": true,
          "className": "qx.bom.client.Html"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Alexander Steitz (aback)
  
  ************************************************************************ */

  /**
   * Low-level Range API which is used together with the low-level Selection API.
   * This is especially useful whenever a developer want to work on text level,
   * e.g. for an editor.
   */
  qx.Bootstrap.define("qx.bom.Range", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Returns the range object of the given node.
       *
       * @signature function(node)
       * @param node {Node} node to get the range of
       * @return {Range} valid range of given selection
       */
      get: qx.core.Environment.select("html.selection", {
        selection(node) {
          // check for the type of the given node
          // for legacy IE the nodes input, textarea, button and body
          // have access to own TextRange objects. Everything else is
          // gathered via the selection object.
          if (qx.dom.Node.isElement(node)) {
            switch (node.nodeName.toLowerCase()) {
              case "input":
                switch (node.type) {
                  case "text":
                  case "password":
                  case "hidden":
                  case "button":
                  case "reset":
                  case "file":
                  case "submit":
                    return node.createTextRange();
                  default:
                    return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
                }
              case "textarea":
              case "body":
              case "button":
                return node.createTextRange();
              default:
                return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
            }
          } else {
            if (node == null) {
              node = window;
            }

            // need to pass the document node to work with multi-documents
            return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
          }
        },
        // suitable for gecko, opera and webkit
        default(node) {
          var doc = qx.dom.Node.getDocument(node);

          // get the selection object of the corresponding document
          var sel = qx.bom.Selection.getSelectionObject(doc);
          if (sel.rangeCount > 0) {
            return sel.getRangeAt(0);
          } else {
            return doc.createRange();
          }
        }
      })
    }
  });
  qx.bom.Range.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Adrian Olaru (adrianolaru)
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * Cross-Browser Split
       http://blog.stevenlevithan.com/archives/cross-browser-split
       Version 1.0.1
  
       Copyright:
         (c) 2006-2007, Steven Levithan <http://stevenlevithan.com>
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
       Authors:
         * Steven Levithan
  
  ************************************************************************ */

  /**
   * Implements an ECMA-compliant, uniform cross-browser split method
   */
  qx.Bootstrap.define("qx.util.StringSplit", {
    statics: {
      /**
       * ECMA-compliant, uniform cross-browser split method
       *
       * @param str {String} Incoming string to split
       * @param separator {RegExp} Specifies the character to use for separating the string.
       *   The separator is treated as a string or a  regular expression. If separator is
       *   omitted, the array returned contains one element consisting of the entire string.
       * @param limit {Integer?} Integer specifying a limit on the number of splits to be found.
       * @return {String[]} split string
       */
      split(str, separator, limit) {
        // if `separator` is not a regex, use the native `split`
        if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
          return String.prototype.split.call(str, separator, limit);
        }
        var output = [],
          lastLastIndex = 0,
          flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.sticky ? "y" : ""),
          separator = RegExp(separator.source, flags + "g"),
          // make `global` and avoid `lastIndex` issues by working with a copy
          separator2,
          match,
          lastIndex,
          lastLength,
          compliantExecNpcg = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group

        str = str + ""; // type conversion

        if (!compliantExecNpcg) {
          separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
        }

        /* behavior for `limit`: if it's...
        - `undefined`: no limit.
        - `NaN` or zero: return an empty array.
        - a positive number: use `Math.floor(limit)`.
        - a negative number: no limit.
        - other: type-convert, then use the above rules. */
        if (limit === undefined || +limit < 0) {
          limit = Infinity;
        } else {
          limit = Math.floor(+limit);
          if (!limit) {
            return [];
          }
        }
        while (match = separator.exec(str)) {
          lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser

          if (lastIndex > lastLastIndex) {
            output.push(str.slice(lastLastIndex, match.index));

            // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1) {
              match[0].replace(separator2, function () {
                for (var i = 1; i < arguments.length - 2; i++) {
                  if (arguments[i] === undefined) {
                    match[i] = undefined;
                  }
                }
              });
            }
            if (match.length > 1 && match.index < str.length) {
              Array.prototype.push.apply(output, match.slice(1));
            }
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= limit) {
              break;
            }
          }
          if (separator.lastIndex === match.index) {
            separator.lastIndex++; // avoid an infinite loop
          }
        }
        if (lastLastIndex === str.length) {
          if (lastLength || !separator.test("")) {
            output.push("");
          }
        } else {
          output.push(str.slice(lastLastIndex));
        }
        return output.length > limit ? output.slice(0, limit) : output;
      }
    }
  });
  qx.util.StringSplit.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.util.ResourceManager": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "engine.version": {
          "className": "qx.bom.client.Engine"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Sebastian Werner (wpbasti)
  
  ************************************************************************ */

  /**
   * The background class contains methods to compute and set the background image
   * of a DOM element.
   *
   * It fixes a background position issue in Firefox 2.
   */
  qx.Class.define("qx.bom.element.Background", {
    statics: {
      /** @type {Array} Internal helper to improve compile performance */
      __tmpl__P_230_0: ["background-image:url(", null, ");", "background-position:", null, ";", "background-repeat:", null, ";"],
      /** @type {Map} Empty styles when no image is given */
      __emptyStyles__P_230_1: {
        backgroundImage: null,
        backgroundPosition: null,
        backgroundRepeat: null
      },
      /**
       * Computes the background position CSS value
       *
       * @param left {Integer|String} either an integer pixel value or a CSS
       *    string value
       * @param top {Integer|String} either an integer pixel value or a CSS
       *    string value
       * @return {String} The background position CSS value
       */
      __computePosition__P_230_2(left, top) {
        // Correcting buggy Firefox background-position implementation
        // Have problems with identical values
        var engine = qx.core.Environment.get("engine.name");
        var version = qx.core.Environment.get("engine.version");
        if (engine == "gecko" && version < 1.9 && left == top && typeof left == "number") {
          top += 0.01;
        }
        if (left) {
          var leftCss = typeof left == "number" ? left + "px" : left;
        } else {
          leftCss = "0";
        }
        if (top) {
          var topCss = typeof top == "number" ? top + "px" : top;
        } else {
          topCss = "0";
        }
        return leftCss + " " + topCss;
      },
      /**
       * Compiles the background into a CSS compatible string.
       *
       * @param source {String?null} The URL of the background image
       * @param repeat {String?null} The background repeat property. valid values
       *     are <code>repeat</code>, <code>repeat-x</code>,
       *     <code>repeat-y</code>, <code>no-repeat</code>
       * @param left {Integer|String?null} The horizontal offset of the image
       *      inside of the image element. If the value is an integer it is
       *      interpreted as pixel value otherwise the value is taken as CSS value.
       *      CSS the values are "center", "left" and "right"
       * @param top {Integer|String?null} The vertical offset of the image
       *      inside of the image element. If the value is an integer it is
       *      interpreted as pixel value otherwise the value is taken as CSS value.
       *      CSS the values are "top", "bottom" and "center"
       * @return {String} CSS string
       */
      compile(source, repeat, left, top) {
        var position = this.__computePosition__P_230_2(left, top);
        var backgroundImageUrl = qx.util.ResourceManager.getInstance().toUri(source);

        // Updating template
        var tmpl = this.__tmpl__P_230_0;
        tmpl[1] = "'" + backgroundImageUrl + "'"; // Put in quotes so spaces work
        tmpl[4] = position;
        tmpl[7] = repeat;
        return tmpl.join("");
      },
      /**
       * Get standard css background styles
       *
       * @param source {String} The URL of the background image
       * @param repeat {String?null} The background repeat property. valid values
       *     are <code>repeat</code>, <code>repeat-x</code>,
       *     <code>repeat-y</code>, <code>no-repeat</code>
       * @param left {Integer|String?null} The horizontal offset of the image
       *      inside of the image element. If the value is an integer it is
       *      interpreted as pixel value otherwise the value is taken as CSS value.
       *      CSS the values are "center", "left" and "right"
       * @param top {Integer|String?null} The vertical offset of the image
       *      inside of the image element. If the value is an integer it is
       *      interpreted as pixel value otherwise the value is taken as CSS value.
       *      CSS the values are "top", "bottom" and "center"
       * @return {Map} A map of CSS styles
       */
      getStyles(source, repeat, left, top) {
        if (!source) {
          return this.__emptyStyles__P_230_1;
        }
        var position = this.__computePosition__P_230_2(left, top);
        var backgroundImageUrl = qx.util.ResourceManager.getInstance().toUri(source);
        var backgroundImageCssString = "url('" + backgroundImageUrl + "')"; // Put in quotes so spaces work
        var map = {
          backgroundPosition: position,
          backgroundImage: backgroundImageCssString
        };
        if (repeat != null) {
          map.backgroundRepeat = repeat;
        }
        return map;
      },
      /**
       * Set the background on the given DOM element
       *
       * @param element {Element} The element to modify
       * @param source {String?null} The URL of the background image
       * @param repeat {String?null} The background repeat property. valid values
       *     are <code>repeat</code>, <code>repeat-x</code>,
       *     <code>repeat-y</code>, <code>no-repeat</code>
       * @param left {Integer?null} The horizontal offset of the image inside of
       *     the image element.
       * @param top {Integer?null} The vertical offset of the image inside of
       *     the image element.
       */
      set(element, source, repeat, left, top) {
        var styles = this.getStyles(source, repeat, left, top);
        for (var prop in styles) {
          element.style[prop] = styles[prop];
        }
      }
    }
  });
  qx.bom.element.Background.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.client.CssAnimation": {
        "require": true
      },
      "qx.bom.Stylesheet": {},
      "qx.bom.Event": {},
      "qx.bom.element.Style": {},
      "qx.log.Logger": {},
      "qx.lang.String": {},
      "qx.bom.element.AnimationHandle": {},
      "qx.bom.element.Transform": {},
      "qx.bom.Style": {},
      "qx.bom.client.OperatingSystem": {
        "defer": "load",
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "css.animation": {
          "load": true,
          "className": "qx.bom.client.CssAnimation"
        },
        "qx.debug": {
          "load": true
        },
        "os.name": {
          "defer": true,
          "className": "qx.bom.client.OperatingSystem"
        },
        "os.version": {
          "defer": true,
          "className": "qx.bom.client.OperatingSystem"
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2011 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * This class is responsible for applying CSS3 animations to plain DOM elements.
   *
   * The implementation is mostly a cross-browser wrapper for applying the
   * animations, including transforms. If the browser does not support
   * CSS animations, but you have set a keep frame, the keep frame will be applied
   * immediately, thus making the animations optional.
   *
   * The API aligns closely to the spec wherever possible.
   *
   * http://www.w3.org/TR/css3-animations/
   *
   * {@link qx.bom.element.Animation} is the class, which takes care of the
   * feature detection for CSS animations and decides which implementation
   * (CSS or JavaScript) should be used. Most likely, this implementation should
   * be the one to use.
   */
  qx.Bootstrap.define("qx.bom.element.AnimationCss", {
    statics: {
      // initialization
      __sheet__P_228_0: null,
      __rulePrefix__P_228_1: "Anni",
      __id__P_228_2: 0,
      /** Static map of rules */
      __rules__P_228_3: {},
      /** The used keys for transforms. */
      __transitionKeys__P_228_4: {
        scale: true,
        rotate: true,
        skew: true,
        translate: true
      },
      /** Map of cross browser CSS keys. */
      __cssAnimationKeys__P_228_5: qx.core.Environment.get("css.animation"),
      /**
       * This is the main function to start the animation in reverse mode.
       * For further details, take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animateReverse(el, desc, duration) {
        return this._animate(el, desc, duration, true);
      },
      /**
       * This is the main function to start the animation. For further details,
       * take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animate(el, desc, duration) {
        return this._animate(el, desc, duration, false);
      },
      /**
       * Internal method to start an animation either reverse or not.
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @param reverse {Boolean} <code>true</code>, if the animation should be
       *   reversed.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      _animate(el, desc, duration, reverse) {
        this.__normalizeDesc__P_228_6(desc);

        // debug validation
        {
          this.__validateDesc__P_228_7(desc);
        }

        // reverse the keep property if the animation is reverse as well
        var keep = desc.keep;
        if (keep != null && (reverse || desc.alternate && desc.repeat % 2 == 0)) {
          keep = 100 - keep;
        }
        if (!this.__sheet__P_228_0) {
          this.__sheet__P_228_0 = qx.bom.Stylesheet.createElement();
        }
        var keyFrames = desc.keyFrames;
        if (duration == undefined) {
          duration = desc.duration;
        }

        // if animations are supported
        if (this.__cssAnimationKeys__P_228_5 != null) {
          var name = this.__addKeyFrames__P_228_8(keyFrames, reverse);
          var style = name + " " + duration + "ms " + desc.timing + " " + (desc.delay ? desc.delay + "ms " : "") + desc.repeat + " " + (desc.alternate ? "alternate" : "");
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_228_5["start-event"], this.__onAnimationStart__P_228_9);
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_228_5["iteration-event"], this.__onAnimationIteration__P_228_10);
          qx.bom.Event.addNativeListener(el, this.__cssAnimationKeys__P_228_5["end-event"], this.__onAnimationEnd__P_228_11);
          {
            if (qx.bom.element.Style.get(el, "display") == "none") {
              qx.log.Logger.warn(el, "Some browsers will not animate elements with display==none");
            }
          }
          el.style[qx.lang.String.camelCase(this.__cssAnimationKeys__P_228_5["name"])] = style;
          // use the fill mode property if available and suitable
          if (keep && keep == 100 && this.__cssAnimationKeys__P_228_5["fill-mode"]) {
            el.style[this.__cssAnimationKeys__P_228_5["fill-mode"]] = "forwards";
          }
        }
        var animation = new qx.bom.element.AnimationHandle();
        animation.desc = desc;
        animation.el = el;
        animation.keep = keep;
        el.$$animation = animation;

        // additional transform keys
        if (desc.origin != null) {
          qx.bom.element.Transform.setOrigin(el, desc.origin);
        }

        // fallback for browsers not supporting animations
        if (this.__cssAnimationKeys__P_228_5 == null) {
          window.setTimeout(function () {
            qx.bom.element.AnimationCss.__onAnimationEnd__P_228_11({
              target: el
            });
          }, 0);
        }
        return animation;
      },
      /**
       * Handler for the animation start.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationStart__P_228_9(e) {
        if (e.target.$$animation) {
          e.target.$$animation.emit("start", e.target);
        }
      },
      /**
       * Handler for the animation iteration.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationIteration__P_228_10(e) {
        // It could happen that an animation end event is fired before an
        // animation iteration appears [BUG #6928]
        if (e.target != null && e.target.$$animation != null) {
          e.target.$$animation.emit("iteration", e.target);
        }
      },
      /**
       * Handler for the animation end.
       * @param e {Event} The native event from the browser.
       */
      __onAnimationEnd__P_228_11(e) {
        var el = e.target;
        var animation = el.$$animation;

        // ignore events when already cleaned up
        if (!animation) {
          return;
        }
        var desc = animation.desc;
        if (qx.bom.element.AnimationCss.__cssAnimationKeys__P_228_5 != null) {
          // reset the styling
          var key = qx.lang.String.camelCase(qx.bom.element.AnimationCss.__cssAnimationKeys__P_228_5["name"]);
          el.style[key] = "";
          qx.bom.Event.removeNativeListener(el, qx.bom.element.AnimationCss.__cssAnimationKeys__P_228_5["name"], qx.bom.element.AnimationCss.__onAnimationEnd__P_228_11);
        }
        if (desc.origin != null) {
          qx.bom.element.Transform.setOrigin(el, "");
        }
        qx.bom.element.AnimationCss.__keepFrame__P_228_12(el, desc.keyFrames[animation.keep]);
        el.$$animation = null;
        animation.el = null;
        animation.ended = true;
        animation.emit("end", el);
      },
      /**
       * Helper method which takes an element and a key frame description and
       * applies the properties defined in the given frame to the element. This
       * method is used to keep the state of the animation.
       * @param el {Element} The element to apply the frame to.
       * @param endFrame {Map} The description of the end frame, which is basically
       *   a map containing CSS properties and values including transforms.
       */
      __keepFrame__P_228_12(el, endFrame) {
        // keep the element at this animation step
        var transforms;
        for (var style in endFrame) {
          if (style in qx.bom.element.AnimationCss.__transitionKeys__P_228_4) {
            if (!transforms) {
              transforms = {};
            }
            transforms[style] = endFrame[style];
          } else {
            el.style[qx.lang.String.camelCase(style)] = endFrame[style];
          }
        }

        // transform keeping
        if (transforms) {
          qx.bom.element.Transform.transform(el, transforms);
        }
      },
      /**
       * Preprocessing of the description to make sure every necessary key is
       * set to its default.
       * @param desc {Map} The description of the animation.
       */
      __normalizeDesc__P_228_6(desc) {
        if (!desc.hasOwnProperty("alternate")) {
          desc.alternate = false;
        }
        if (!desc.hasOwnProperty("keep")) {
          desc.keep = null;
        }
        if (!desc.hasOwnProperty("repeat")) {
          desc.repeat = 1;
        }
        if (!desc.hasOwnProperty("timing")) {
          desc.timing = "linear";
        }
        if (!desc.hasOwnProperty("origin")) {
          desc.origin = null;
        }
      },
      /**
       * Debugging helper to validate the description.
       * @signature function(desc)
       * @param desc {Map} The description of the animation.
       */
      __validateDesc__P_228_7: qx.core.Environment.select("qx.debug", {
        true(desc) {
          var possibleKeys = ["origin", "duration", "keep", "keyFrames", "delay", "repeat", "timing", "alternate"];

          // check for unknown keys
          for (var name in desc) {
            if (!(possibleKeys.indexOf(name) != -1)) {
              qx.Bootstrap.warn("Unknown key '" + name + "' in the animation description.");
            }
          }
          if (desc.keyFrames == null) {
            qx.Bootstrap.warn("No 'keyFrames' given > 0");
          } else {
            // check the key frames
            for (var pos in desc.keyFrames) {
              if (pos < 0 || pos > 100) {
                qx.Bootstrap.warn("Keyframe position needs to be between 0 and 100");
              }
            }
          }
        },
        default: null
      }),
      /**
       * Helper to add the given frames to an internal CSS stylesheet. It parses
       * the description and adds the key frames to the sheet.
       * @param frames {Map} A map of key frames that describe the animation.
       * @param reverse {Boolean} <code>true</code>, if the key frames should
       *   be added in reverse order.
       * @return {String} The generated name of the keyframes rule.
       */
      __addKeyFrames__P_228_8(frames, reverse) {
        var rule = "";

        // for each key frame
        for (var position in frames) {
          rule += (reverse ? -(position - 100) : position) + "% {";
          var frame = frames[position];
          var transforms;
          // each style
          for (var style in frame) {
            if (style in this.__transitionKeys__P_228_4) {
              if (!transforms) {
                transforms = {};
              }
              transforms[style] = frame[style];
            } else {
              var propName = qx.bom.Style.getPropertyName(style);
              var prefixed = propName !== null ? qx.bom.Style.getCssName(propName) : "";
              rule += (prefixed || style) + ":" + frame[style] + ";";
            }
          }

          // transform handling
          if (transforms) {
            rule += qx.bom.element.Transform.getCss(transforms);
          }
          rule += "} ";
        }

        // cached shorthand
        if (this.__rules__P_228_3[rule]) {
          return this.__rules__P_228_3[rule];
        }
        var name = this.__rulePrefix__P_228_1 + this.__id__P_228_2++;
        var selector = this.__cssAnimationKeys__P_228_5["keyframes"] + " " + name;
        qx.bom.Stylesheet.addRule(this.__sheet__P_228_0, selector, rule);
        this.__rules__P_228_3[rule] = name;
        return name;
      },
      /**
       * Internal helper to reset the cache.
       */
      __clearCache__P_228_13() {
        this.__id__P_228_2 = 0;
        if (this.__sheet__P_228_0) {
          this.__sheet__P_228_0.ownerNode.remove();
          this.__sheet__P_228_0 = null;
          this.__rules__P_228_3 = {};
        }
      }
    },
    defer(statics) {
      // iOS 8 seems to stumble over the old sheet object on tab
      // changes or leaving the browser [BUG #8986]
      if (qx.core.Environment.get("os.name") === "ios" && parseInt(qx.core.Environment.get("os.version")) >= 8) {
        document.addEventListener("visibilitychange", function () {
          if (!document.hidden) {
            statics.__clearCache__P_228_13();
          }
        }, false);
      }
    }
  });
  qx.bom.element.AnimationCss.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Object": {},
      "qx.bom.element.AnimationHandle": {},
      "qx.bom.Style": {},
      "qx.bom.element.Transform": {},
      "qx.util.ColorUtil": {},
      "qx.bom.AnimationFrame": {},
      "qx.lang.String": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * This class offers the same API as the CSS3 animation layer in
   * {@link qx.bom.element.AnimationCss} but uses JavaScript to fake the behavior.
   *
   * {@link qx.bom.element.Animation} is the class, which takes care of the
   * feature detection for CSS animations and decides which implementation
   * (CSS or JavaScript) should be used. Most likely, this implementation should
   * be the one to use.
   *
   * @ignore(qx.bom.element.Style.*)
   * @use(qx.bom.element.AnimationJs#play)
   */
  qx.Bootstrap.define("qx.bom.element.AnimationJs", {
    statics: {
      /**
       * The maximal time a frame should take.
       */
      __maxStepTime__P_229_0: 30,
      /**
       * The supported CSS units.
       */
      __units__P_229_1: ["%", "in", "cm", "mm", "em", "ex", "pt", "pc", "px"],
      /** The used keys for transforms. */
      __transitionKeys__P_229_2: {
        scale: true,
        rotate: true,
        skew: true,
        translate: true
      },
      /**
       * This is the main function to start the animation. For further details,
       * take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animate(el, desc, duration) {
        return this._animate(el, desc, duration, false);
      },
      /**
       * This is the main function to start the animation in reversed mode.
       * For further details, take a look at the documentation of the wrapper
       * {@link qx.bom.element.Animation}.
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      animateReverse(el, desc, duration) {
        return this._animate(el, desc, duration, true);
      },
      /**
       * Helper to start the animation, either in reversed order or not.
       *
       * @param el {Element} The element to animate.
       * @param desc {Map} Animation description.
       * @param duration {Integer?} The duration of the animation which will
       *   override the duration given in the description.
       * @param reverse {Boolean} <code>true</code>, if the animation should be
       *   reversed.
       * @return {qx.bom.element.AnimationHandle} The handle.
       */
      _animate(el, desc, duration, reverse) {
        // stop if an animation is already running
        if (el.$$animation) {
          return el.$$animation;
        }
        desc = qx.lang.Object.clone(desc, true);
        if (duration == undefined) {
          duration = desc.duration;
        }
        var keyFrames = desc.keyFrames;
        var keys = this.__getOrderedKeys__P_229_3(keyFrames);
        var stepTime = this.__getStepTime__P_229_4(duration, keys);
        var steps = parseInt(duration / stepTime, 10);
        this.__normalizeKeyFrames__P_229_5(keyFrames, el);
        var delta = this.__calculateDelta__P_229_6(steps, stepTime, keys, keyFrames, duration, desc.timing);
        var handle = new qx.bom.element.AnimationHandle();
        handle.jsAnimation = true;
        if (reverse) {
          delta.reverse();
          handle.reverse = true;
        }
        handle.desc = desc;
        handle.el = el;
        handle.delta = delta;
        handle.stepTime = stepTime;
        handle.steps = steps;
        el.$$animation = handle;
        handle.i = 0;
        handle.initValues = {};
        handle.repeatSteps = this.__applyRepeat__P_229_7(steps, desc.repeat);
        var delay = desc.delay || 0;
        var self = this;
        handle.delayId = window.setTimeout(function () {
          handle.delayId = null;
          self.play(handle);
        }, delay);
        return handle;
      },
      /**
       * Try to normalize the keyFrames by adding the default / set values of the
       * element.
       * @param keyFrames {Map} The map of key frames.
       * @param el {Element} The element to animate.
       */
      __normalizeKeyFrames__P_229_5(keyFrames, el) {
        // collect all possible keys and its units
        var units = {};
        for (var percent in keyFrames) {
          for (var name in keyFrames[percent]) {
            // prefixed key calculation
            var prefixed = qx.bom.Style.getPropertyName(name);
            if (prefixed && prefixed != name) {
              var prefixedName = qx.bom.Style.getCssName(prefixed);
              keyFrames[percent][prefixedName] = keyFrames[percent][name];
              delete keyFrames[percent][name];
              name = prefixedName;
            }
            // check for the available units
            if (units[name] == undefined) {
              var item = keyFrames[percent][name];
              if (typeof item == "string") {
                units[name] = this.__getUnit__P_229_8(item);
              } else {
                units[name] = "";
              }
            }
          }
        }
        // add all missing keys
        for (var percent in keyFrames) {
          var frame = keyFrames[percent];
          for (var name in units) {
            if (frame[name] == undefined) {
              if (name in el.style) {
                // get the computed style if possible
                if (window.getComputedStyle) {
                  frame[name] = window.getComputedStyle(el, null)[name];
                } else {
                  frame[name] = el.style[name];
                }
              } else {
                frame[name] = el[name];
              }
              // if its a unit we know, set 0 as fallback
              if (frame[name] === "" && this.__units__P_229_1.indexOf(units[name]) != -1) {
                frame[name] = "0" + units[name];
              }
            }
          }
        }
      },
      /**
       * Checks for transform keys and returns a cloned frame
       * with the right transform style set.
       * @param frame {Map} A single key frame of the description.
       * @return {Map} A modified clone of the given frame.
       */
      __normalizeKeyFrameTransforms__P_229_9(frame) {
        frame = qx.lang.Object.clone(frame);
        var transforms;
        for (var name in frame) {
          if (name in this.__transitionKeys__P_229_2) {
            if (!transforms) {
              transforms = {};
            }
            transforms[name] = frame[name];
            delete frame[name];
          }
        }
        if (transforms) {
          var transformStyle = qx.bom.element.Transform.getCss(transforms).split(":");
          if (transformStyle.length > 1) {
            frame[transformStyle[0]] = transformStyle[1].replace(";", "");
          }
        }
        return frame;
      },
      /**
       * Precalculation of the delta which will be applied during the animation.
       * The whole deltas will be calculated prior to the animation and stored
       * in a single array. This method takes care of that calculation.
       *
       * @param steps {Integer} The amount of steps to take to the end of the
       *   animation.
       * @param stepTime {Integer} The amount of milliseconds each step takes.
       * @param keys {Array} Ordered list of keys in the key frames map.
       * @param keyFrames {Map} The map of key frames.
       * @param duration {Integer} Time in milliseconds the animation should take.
       * @param timing {String} The given timing function.
       * @return {Array} An array containing the animation deltas.
       */
      __calculateDelta__P_229_6(steps, stepTime, keys, keyFrames, duration, timing) {
        var delta = new Array(steps);
        var keyIndex = 1;
        delta[0] = this.__normalizeKeyFrameTransforms__P_229_9(keyFrames[0]);
        var last = keyFrames[0];
        var next = keyFrames[keys[keyIndex]];
        var stepsToNext = Math.floor(keys[keyIndex] / (stepTime / duration * 100));
        var calculationIndex = 1; // is used as counter for the timing calculation
        // for every step
        for (var i = 1; i < delta.length; i++) {
          // switch key frames if we crossed a percent border
          if (i * stepTime / duration * 100 > keys[keyIndex]) {
            last = next;
            keyIndex++;
            next = keyFrames[keys[keyIndex]];
            stepsToNext = Math.floor(keys[keyIndex] / (stepTime / duration * 100)) - stepsToNext;
            calculationIndex = 1;
          }
          delta[i] = {};
          var transforms;
          // for every property
          for (var name in next) {
            var nItem = next[name] + "";

            // transform values
            if (name in this.__transitionKeys__P_229_2) {
              if (!transforms) {
                transforms = {};
              }
              if (qx.Bootstrap.isArray(last[name])) {
                if (!qx.Bootstrap.isArray(next[name])) {
                  next[name] = [next[name]];
                }
                transforms[name] = [];
                for (var j = 0; j < next[name].length; j++) {
                  var item = next[name][j] + "";
                  var x = calculationIndex / stepsToNext;
                  transforms[name][j] = this.__getNextValue__P_229_10(item, last[name], timing, x);
                }
              } else {
                var x = calculationIndex / stepsToNext;
                transforms[name] = this.__getNextValue__P_229_10(nItem, last[name], timing, x);
              }

              // color values
            } else if (nItem.charAt(0) == "#") {
              // get the two values from the frames as RGB arrays
              var value0 = qx.util.ColorUtil.cssStringToRgb(last[name]);
              var value1 = qx.util.ColorUtil.cssStringToRgb(nItem);
              var stepValue = [];
              // calculate every color channel
              for (var j = 0; j < value0.length; j++) {
                var range = value0[j] - value1[j];
                var x = calculationIndex / stepsToNext;
                var timingX = qx.bom.AnimationFrame.calculateTiming(timing, x);
                stepValue[j] = parseInt(value0[j] - range * timingX, 10);
              }
              delta[i][name] = qx.util.ColorUtil.rgbToHexString(stepValue);
            } else if (!isNaN(parseFloat(nItem))) {
              var x = calculationIndex / stepsToNext;
              delta[i][name] = this.__getNextValue__P_229_10(nItem, last[name], timing, x);
            } else {
              delta[i][name] = last[name] + "";
            }
          }
          // save all transformations in the delta values
          if (transforms) {
            var transformStyle = qx.bom.element.Transform.getCss(transforms).split(":");
            if (transformStyle.length > 1) {
              delta[i][transformStyle[0]] = transformStyle[1].replace(";", "");
            }
          }
          calculationIndex++;
        }
        // make sure the last key frame is right
        delta[delta.length - 1] = this.__normalizeKeyFrameTransforms__P_229_9(keyFrames[100]);
        return delta;
      },
      /**
       * Ties to parse out the unit of the given value.
       *
       * @param item {String} A CSS value including its unit.
       * @return {String} The unit of the given value.
       */
      __getUnit__P_229_8(item) {
        return item.substring((parseFloat(item) + "").length, item.length);
      },
      /**
       * Returns the next value based on the given arguments.
       *
       * @param nextItem {String} The CSS value of the next frame
       * @param lastItem {String} The CSS value of the last frame
       * @param timing {String} The timing used for the calculation
       * @param x {Number} The x position of the animation on the time axis
       * @return {String} The calculated value including its unit.
       */
      __getNextValue__P_229_10(nextItem, lastItem, timing, x) {
        var range = parseFloat(nextItem) - parseFloat(lastItem);
        return parseFloat(lastItem) + range * qx.bom.AnimationFrame.calculateTiming(timing, x) + this.__getUnit__P_229_8(nextItem);
      },
      /**
       * Internal helper for the {@link qx.bom.element.AnimationHandle} to play
       * the animation.
       * @internal
       * @param handle {qx.bom.element.AnimationHandle} The hand which
       *   represents the animation.
       * @return {qx.bom.element.AnimationHandle} The handle for chaining.
       */
      play(handle) {
        handle.emit("start", handle.el);
        var id = window.setInterval(function () {
          handle.repeatSteps--;
          var values = handle.delta[handle.i % handle.steps];
          // save the init values
          if (handle.i === 0) {
            for (var name in values) {
              if (handle.initValues[name] === undefined) {
                // animate element property
                if (handle.el[name] !== undefined) {
                  handle.initValues[name] = handle.el[name];
                }
                // animate CSS property
                else if (qx.bom.element.Style) {
                  handle.initValues[name] = qx.bom.element.Style.get(handle.el, qx.lang.String.camelCase(name));
                } else {
                  handle.initValues[name] = handle.el.style[qx.lang.String.camelCase(name)];
                }
              }
            }
          }
          qx.bom.element.AnimationJs.__applyStyles__P_229_11(handle.el, values);
          handle.i++;
          // iteration condition
          if (handle.i % handle.steps == 0) {
            handle.emit("iteration", handle.el);
            if (handle.desc.alternate) {
              handle.delta.reverse();
            }
          }
          // end condition
          if (handle.repeatSteps < 0) {
            qx.bom.element.AnimationJs.stop(handle);
          }
        }, handle.stepTime);
        handle.animationId = id;
        return handle;
      },
      /**
       * Internal helper for the {@link qx.bom.element.AnimationHandle} to pause
       * the animation.
       * @internal
       * @param handle {qx.bom.element.AnimationHandle} The hand which
       *   represents the animation.
       * @return {qx.bom.element.AnimationHandle} The handle for chaining.
       */

      pause(handle) {
        // stop the interval
        window.clearInterval(handle.animationId);
        handle.animationId = null;
        return handle;
      },
      /**
       * Internal helper for the {@link qx.bom.element.AnimationHandle} to stop
       * the animation.
       * @internal
       * @param handle {qx.bom.element.AnimationHandle} The hand which
       *   represents the animation.
       * @return {qx.bom.element.AnimationHandle} The handle for chaining.
       */
      stop(handle) {
        var desc = handle.desc;
        var el = handle.el;
        var initValues = handle.initValues;
        if (handle.animationId) {
          window.clearInterval(handle.animationId);
        }

        // clear the delay if the animation has not been started
        if (handle.delayId) {
          window.clearTimeout(handle.delayId);
        }

        // check if animation is already stopped
        if (el == undefined) {
          return handle;
        }

        // if we should keep a frame
        var keep = desc.keep;
        if (keep != undefined && !handle.stopped) {
          if (handle.reverse || desc.alternate && desc.repeat && desc.repeat % 2 == 0) {
            keep = 100 - keep;
          }
          this.__applyStyles__P_229_11(el, this.__normalizeKeyFrameTransforms__P_229_9(desc.keyFrames[keep]));
        } else {
          this.__applyStyles__P_229_11(el, initValues);
        }
        el.$$animation = null;
        handle.el = null;
        handle.ended = true;
        handle.animationId = null;
        handle.emit("end", el);
        return handle;
      },
      /**
       * Takes care of the repeat key of the description.
       * @param steps {Integer} The number of steps one iteration would take.
       * @param repeat {Integer|String} It can be either a number how often the
       * animation should be repeated or the string 'infinite'.
       * @return {Integer} The number of steps to animate.
       */
      __applyRepeat__P_229_7(steps, repeat) {
        if (repeat == undefined) {
          return steps;
        }
        if (repeat == "infinite") {
          return Number.MAX_VALUE;
        }
        return steps * repeat;
      },
      /**
       * Central method to apply css styles and element properties.
       * @param el {Element} The DOM element to apply the styles.
       * @param styles {Map} A map containing styles and values.
       */
      __applyStyles__P_229_11(el, styles) {
        for (var key in styles) {
          // ignore undefined values (might be a bad detection)
          if (styles[key] === undefined) {
            continue;
          }

          // apply element property value - only if a CSS property
          // is *not* available
          if (typeof el.style[key] === "undefined" && key in el) {
            el[key] = styles[key];
            continue;
          }
          var name = qx.bom.Style.getPropertyName(key) || key;
          if (qx.bom.element.Style) {
            qx.bom.element.Style.set(el, name, styles[key]);
          } else {
            el.style[name] = styles[key];
          }
        }
      },
      /**
       * Dynamic calculation of the steps time considering a max step time.
       * @param duration {Number} The duration of the animation.
       * @param keys {Array} An array containing the ordered set of key frame keys.
       * @return {Integer} The best suited step time.
       */
      __getStepTime__P_229_4(duration, keys) {
        // get min difference
        var minDiff = 100;
        for (var i = 0; i < keys.length - 1; i++) {
          minDiff = Math.min(minDiff, keys[i + 1] - keys[i]);
        }
        var stepTime = duration * minDiff / 100;
        while (stepTime > this.__maxStepTime__P_229_0) {
          stepTime = stepTime / 2;
        }
        return Math.round(stepTime);
      },
      /**
       * Helper which returns the ordered keys of the key frame map.
       * @param keyFrames {Map} The map of key frames.
       * @return {Array} An ordered list of keys.
       */
      __getOrderedKeys__P_229_3(keyFrames) {
        var keys = Object.keys(keyFrames);
        for (var i = 0; i < keys.length; i++) {
          keys[i] = parseInt(keys[i], 10);
        }
        keys.sort(function (a, b) {
          return a - b;
        });
        return keys;
      }
    }
  });
  qx.bom.element.AnimationJs.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Assert": {},
      "qx.lang.Object": {},
      "qx.dom.Element": {},
      "qx.lang.Type": {},
      "qx.bom.client.Engine": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine",
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
  
     ======================================================================
  
     This class contains code based on the following work:
  
     * jQuery
       http://jquery.com
       Version 1.3.1
  
       Copyright:
         2009 John Resig
  
       License:
         MIT: http://www.opensource.org/licenses/mit-license.php
  
  ************************************************************************ */

  /**
   * Cross browser abstractions to work with input elements.
   */
  qx.Bootstrap.define("qx.bom.Input", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Map} Internal data structures with all supported input types */
      __types__P_182_0: {
        textarea: true,
        select: true,
        button: true,
        checkbox: true,
        color: true,
        date: true,
        "datetime-local": true,
        email: true,
        file: true,
        hidden: true,
        image: true,
        month: true,
        number: true,
        password: true,
        radio: true,
        range: true,
        reset: true,
        search: true,
        submit: true,
        tel: true,
        text: true,
        time: true,
        url: true,
        week: true
      },
      /**
       * Creates an DOM input/textarea/select element.
       *
       * Attributes may be given directly with this call. This is critical
       * for some attributes e.g. name, type, ... in many clients.
       *
       * Note: <code>select</code> and <code>textarea</code> elements are created
       * using the identically named <code>type</code>.
       *
       * @param type {String} Any valid type for HTML, <code>select</code>
       *   and <code>textarea</code>
       * @param attributes {Map} Map of attributes to apply
       * @param win {Window} Window to create the element for
       * @return {Element} The created input node
       */
      create(type, attributes, win) {
        {
          qx.core.Assert.assertKeyInMap(type, this.__types__P_182_0, "Unsupported input type.");
        }

        // Work on a copy to not modify given attributes map
        var attributes = attributes ? qx.lang.Object.clone(attributes) : {};
        var tag;
        if (type === "textarea" || type === "select") {
          tag = type;
        } else {
          tag = "input";
          attributes.type = type;
        }
        return qx.dom.Element.create(tag, attributes, win);
      },
      /**
       * Applies the given value to the element.
       *
       * Normally the value is given as a string/number value and applied
       * to the field content (textfield, textarea) or used to
       * detect whether the field is checked (checkbox, radiobutton).
       *
       * Supports array values for selectboxes (multiple-selection)
       * and checkboxes or radiobuttons (for convenience).
       *
       * Please note: To modify the value attribute of a checkbox or
       * radiobutton use {@link qx.bom.element.Attribute#set} instead.
       *
       * @param element {Element} element to update
       * @param value {String|Number|Array} the value to apply
       */
      setValue(element, value) {
        var tag = element.nodeName.toLowerCase();
        var type = element.type;
        var Type = qx.lang.Type;
        if (typeof value === "number") {
          value += "";
        }
        if (type === "checkbox" || type === "radio") {
          if (Type.isArray(value)) {
            element.checked = value.includes(element.value);
          } else {
            element.checked = element.value == value;
          }
        } else if (tag === "select") {
          var isArray = Type.isArray(value);
          var options = element.options;
          var subel, subval;
          for (var i = 0, l = options.length; i < l; i++) {
            subel = options[i];
            subval = subel.getAttribute("value");
            if (subval == null) {
              subval = subel.text;
            }
            subel.selected = isArray ? value.includes(subval) : value == subval;
          }
          if (isArray && value.length == 0) {
            element.selectedIndex = -1;
          }
        } else if ((type === "text" || type === "textarea") && qx.core.Environment.get("engine.name") == "mshtml") {
          // These flags are required to detect self-made property-change
          // events during value modification. They are used by the Input
          // event handler to filter events.
          element.$$inValueSet = true;
          element.value = value;
          element.$$inValueSet = null;
        } else {
          element.value = value;
        }
      },
      /**
       * Returns the currently configured value.
       *
       * Works with simple input fields as well as with
       * select boxes or option elements.
       *
       * Returns an array in cases of multi-selection in
       * select boxes but in all other cases a string.
       *
       * @param element {Element} DOM element to query
       * @return {String|Array} The value of the given element
       */
      getValue(element) {
        var tag = element.nodeName.toLowerCase();
        if (tag === "option") {
          return (element.attributes.value || {}).specified ? element.value : element.text;
        }
        if (tag === "select") {
          var index = element.selectedIndex;

          // Nothing was selected
          if (index < 0) {
            return null;
          }
          var values = [];
          var options = element.options;
          var one = element.type == "select-one";
          var clazz = qx.bom.Input;
          var value;

          // Loop through all the selected options
          for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
            var option = options[i];
            if (option.selected) {
              // Get the specific value for the option
              value = clazz.getValue(option);

              // We don't need an array for one selects
              if (one) {
                return value;
              }

              // Multi-Selects return an array
              values.push(value);
            }
          }
          return values;
        } else {
          return (element.value || "").replace(/\r/g, "");
        }
      },
      /**
       * Sets the text wrap behaviour of a text area element.
       * This property uses the attribute "wrap" respectively
       * the style property "whiteSpace"
       *
       * @signature function(element, wrap)
       * @param element {Element} DOM element to modify
       * @param wrap {Boolean} Whether to turn text wrap on or off.
       */
      setWrap: qx.core.Environment.select("engine.name", {
        mshtml(element, wrap) {
          var wrapValue = wrap ? "soft" : "off";

          // Explicitly set overflow-y CSS property to auto when wrapped,
          // allowing the vertical scroll-bar to appear if necessary
          var styleValue = wrap ? "auto" : "";
          element.wrap = wrapValue;
          element.style.overflowY = styleValue;
        },
        gecko(element, wrap) {
          var wrapValue = wrap ? "soft" : "off";
          var styleValue = wrap ? "" : "auto";
          element.setAttribute("wrap", wrapValue);
          element.style.overflow = styleValue;
        },
        webkit(element, wrap) {
          var wrapValue = wrap ? "soft" : "off";
          var styleValue = wrap ? "" : "auto";
          element.setAttribute("wrap", wrapValue);
          element.style.overflow = styleValue;
        },
        default(element, wrap) {
          element.style.whiteSpace = wrap ? "normal" : "nowrap";
        }
      })
    }
  });
  qx.bom.Input.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.locale.Manager": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Assert": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Static class that provides localized date information (like names of week
   * days, AM/PM markers, start of week, etc.).
   *
   * @cldr()
   */
  qx.Class.define("qx.locale.Date", {
    statics: {
      /**
       * Reference to the locale manager.
       *
       * @internal
       */
      __mgr__P_184_0: qx.locale.Manager.getInstance(),
      /**
       * Get AM marker for time definitions
       *
       * @param locale {String} optional locale to be used
       * @return {String} translated AM marker.
       */
      getAmMarker(locale) {
        return this.__mgr__P_184_0.localize("cldr_am", [], locale);
      },
      /**
       * Get PM marker for time definitions
       *
       * @param locale {String} optional locale to be used
       * @return {String} translated PM marker.
       */
      getPmMarker(locale) {
        return this.__mgr__P_184_0.localize("cldr_pm", [], locale);
      },
      /**
       * Return localized names of day names
       *
       * @param length {String} format of the day names.
       *       Possible values: "abbreviated", "narrow", "wide"
       * @param locale {String} optional locale to be used
       * @param context {String} (default: "format") intended context.
       *       Possible values: "format", "stand-alone"
       * @param withFallback {Boolean?} if true, the previous parameter's other value is tried
       * in order to find a localized name for the day
       * @return {String[]} array of localized day names starting with sunday.
       */
      getDayNames(length, locale, context, withFallback) {
        var context = context ? context : "format";
        {
          qx.core.Assert.assertInArray(length, ["abbreviated", "narrow", "wide"]);
          qx.core.Assert.assertInArray(context, ["format", "stand-alone"]);
        }
        var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var names = [];
        for (var i = 0; i < days.length; i++) {
          var key = "cldr_day_" + context + "_" + length + "_" + days[i];
          names.push(withFallback ? this.__localizeWithFallback__P_184_1(context, context === "format" ? "stand-alone" : "format", key, locale) : this.__mgr__P_184_0.localize(key, [], locale));
        }
        return names;
      },
      /**
       * Return localized name of a week day name
       *
       * @param length {String} format of the day name.
       *       Possible values: "abbreviated", "narrow", "wide"
       * @param day {Integer} day number. 0=sunday, 1=monday, ...
       * @param locale {String} optional locale to be used
       * @param context {String} (default: "format") intended context.
       *       Possible values: "format", "stand-alone"
       * @param withFallback {Boolean?} if true, the previous parameter's other value is tried
       * in order to find a localized name for the day
       * @return {String} localized day name
       */
      getDayName(length, day, locale, context, withFallback) {
        var context = context ? context : "format";
        {
          qx.core.Assert.assertInArray(length, ["abbreviated", "narrow", "wide"]);
          qx.core.Assert.assertInteger(day);
          qx.core.Assert.assertInRange(day, 0, 6);
          qx.core.Assert.assertInArray(context, ["format", "stand-alone"]);
        }
        var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var key = "cldr_day_" + context + "_" + length + "_" + days[day];
        return withFallback ? this.__localizeWithFallback__P_184_1(context, context === "format" ? "stand-alone" : "format", key, locale) : this.__mgr__P_184_0.localize(key, [], locale);
      },
      /**
       * Return localized names of month names
       *
       * @param length {String} format of the month names.
       *       Possible values: "abbreviated", "narrow", "wide"
       * @param locale {String} optional locale to be used
       * @param context {String} (default: "format") intended context.
       *       Possible values: "format", "stand-alone"
       * @param withFallback {Boolean?} if true, the previous parameter's other value is tried
       * in order to find a localized name for the month
       * @return {String[]} array of localized month names starting with january.
       */
      getMonthNames(length, locale, context, withFallback) {
        var context = context ? context : "format";
        {
          qx.core.Assert.assertInArray(length, ["abbreviated", "narrow", "wide"]);
          qx.core.Assert.assertInArray(context, ["format", "stand-alone"]);
        }
        var names = [];
        for (var i = 0; i < 12; i++) {
          var key = "cldr_month_" + context + "_" + length + "_" + (i + 1);
          names.push(withFallback ? this.__localizeWithFallback__P_184_1(context, context === "format" ? "stand-alone" : "format", key, locale) : this.__mgr__P_184_0.localize(key, [], locale));
        }
        return names;
      },
      /**
       * Return localized name of a month
       *
       * @param length {String} format of the month names.
       *       Possible values: "abbreviated", "narrow", "wide"
       * @param month {Integer} index of the month. 0=january, 1=february, ...
       * @param locale {String} optional locale to be used
       * @param context {String} (default: "format") intended context.
       *       Possible values: "format", "stand-alone"
       * @param withFallback {Boolean?} if true, the previous parameter's other value is tried
       * in order to find a localized name for the month
       * @return {String} localized month name
       */
      getMonthName(length, month, locale, context, withFallback) {
        var context = context ? context : "format";
        {
          qx.core.Assert.assertInArray(length, ["abbreviated", "narrow", "wide"]);
          qx.core.Assert.assertInArray(context, ["format", "stand-alone"]);
        }
        var key = "cldr_month_" + context + "_" + length + "_" + (month + 1);
        return withFallback ? this.__localizeWithFallback__P_184_1(context, context === "format" ? "stand-alone" : "format", key, locale) : this.__mgr__P_184_0.localize(key, [], locale);
      },
      /**
       * Return localized date format string to be used with {@link qx.util.format.DateFormat}.
       *
       * @param size {String} format of the date format.
       *      Possible values: "short", "medium", "long", "full"
       * @param locale {String?} optional locale to be used
       * @return {String} localized date format string
       */
      getDateFormat(size, locale) {
        {
          qx.core.Assert.assertInArray(size, ["short", "medium", "long", "full"]);
        }
        var key = "cldr_date_format_" + size;
        return this.__mgr__P_184_0.localize(key, [], locale);
      },
      /**
       * Try to localize a date/time format string. For format string possibilities see
       * <a href="http://cldr.unicode.org/translation/date-time">Date/Time Symbol reference</a>
       * at CLDR - Unicode Common Locale Data Repository.
       *
       * If no localization is available take the fallback format string.
       *
       * @param canonical {String} format string containing only field information, and in a canonical order.
       *       Examples are "yyyyMMMM" for year + full month, or "MMMd" for abbreviated month + day.
       * @param fallback {String} fallback format string if no localized version is found
       * @param locale {String} optional locale to be used
       * @return {String} best matching format string
       */
      getDateTimeFormat(canonical, fallback, locale) {
        var key = "cldr_date_time_format_" + canonical;
        var localizedFormat = this.__mgr__P_184_0.localize(key, [], locale);
        if (localizedFormat == key) {
          localizedFormat = fallback;
        }
        return localizedFormat;
      },
      /**
       * Return localized time format string to be used with {@link qx.util.format.DateFormat}.
       *
       * @param size {String} format of the time pattern.
       *      Possible values: "short", "medium", "long", "full"
       * @param locale {String} optional locale to be used
       * @return {String} localized time format string
       */
      getTimeFormat(size, locale) {
        {
          qx.core.Assert.assertInArray(size, ["short", "medium", "long", "full"]);
        }
        var key = "cldr_time_format_" + size;
        var localizedFormat = this.__mgr__P_184_0.localize(key, [], locale);
        if (localizedFormat != key) {
          return localizedFormat;
        }
        switch (size) {
          case "short":
          case "medium":
            return qx.locale.Date.getDateTimeFormat("HHmm", "HH:mm");
          case "long":
            return qx.locale.Date.getDateTimeFormat("HHmmss", "HH:mm:ss");
          case "full":
            return qx.locale.Date.getDateTimeFormat("HHmmsszz", "HH:mm:ss zz");
          default:
            throw new Error("This case should never happen.");
        }
      },
      /**
       * Return the day the week starts with
       *
       * Reference: Common Locale Data Repository (cldr) supplementalData.xml
       *
       * @param locale {String} optional locale to be used
       * @return {Integer} index of the first day of the week. 0=sunday, 1=monday, ...
       */
      getWeekStart(locale) {
        var weekStart = {
          // default is monday
          MV: 5,
          // friday
          AE: 6,
          // saturday
          AF: 6,
          BH: 6,
          DJ: 6,
          DZ: 6,
          EG: 6,
          ER: 6,
          ET: 6,
          IQ: 6,
          IR: 6,
          JO: 6,
          KE: 6,
          KW: 6,
          LB: 6,
          LY: 6,
          MA: 6,
          OM: 6,
          QA: 6,
          SA: 6,
          SD: 6,
          SO: 6,
          TN: 6,
          YE: 6,
          AS: 0,
          // sunday
          AU: 0,
          AZ: 0,
          BW: 0,
          CA: 0,
          CN: 0,
          FO: 0,
          GE: 0,
          GL: 0,
          GU: 0,
          HK: 0,
          IE: 0,
          IL: 0,
          IS: 0,
          JM: 0,
          JP: 0,
          KG: 0,
          KR: 0,
          LA: 0,
          MH: 0,
          MN: 0,
          MO: 0,
          MP: 0,
          MT: 0,
          NZ: 0,
          PH: 0,
          PK: 0,
          SG: 0,
          TH: 0,
          TT: 0,
          TW: 0,
          UM: 0,
          US: 0,
          UZ: 0,
          VI: 0,
          ZA: 0,
          ZW: 0,
          MW: 0,
          NG: 0,
          TJ: 0
        };
        var territory = qx.locale.Date._getTerritory(locale);

        // default is monday
        return weekStart[territory] != null ? weekStart[territory] : 1;
      },
      /**
       * Return the day the weekend starts with
       *
       * Reference: Common Locale Data Repository (cldr) supplementalData.xml
       *
       * @param locale {String} optional locale to be used
       * @return {Integer} index of the first day of the weekend. 0=sunday, 1=monday, ...
       */
      getWeekendStart(locale) {
        var weekendStart = {
          // default is saturday
          EG: 5,
          // friday
          IL: 5,
          SY: 5,
          IN: 0,
          // sunday
          AE: 4,
          // thursday
          BH: 4,
          DZ: 4,
          IQ: 4,
          JO: 4,
          KW: 4,
          LB: 4,
          LY: 4,
          MA: 4,
          OM: 4,
          QA: 4,
          SA: 4,
          SD: 4,
          TN: 4,
          YE: 4
        };
        var territory = qx.locale.Date._getTerritory(locale);

        // default is saturday
        return weekendStart[territory] != null ? weekendStart[territory] : 6;
      },
      /**
       * Return the day the weekend ends with
       *
       * Reference: Common Locale Data Repository (cldr) supplementalData.xml
       *
       * @param locale {String} optional locale to be used
       * @return {Integer} index of the last day of the weekend. 0=sunday, 1=monday, ...
       */
      getWeekendEnd(locale) {
        var weekendEnd = {
          // default is sunday
          AE: 5,
          // friday
          BH: 5,
          DZ: 5,
          IQ: 5,
          JO: 5,
          KW: 5,
          LB: 5,
          LY: 5,
          MA: 5,
          OM: 5,
          QA: 5,
          SA: 5,
          SD: 5,
          TN: 5,
          YE: 5,
          AF: 5,
          IR: 5,
          EG: 6,
          // saturday
          IL: 6,
          SY: 6
        };
        var territory = qx.locale.Date._getTerritory(locale);

        // default is sunday
        return weekendEnd[territory] != null ? weekendEnd[territory] : 0;
      },
      /**
       * Returns whether a certain day of week belongs to the week end.
       *
       * @param day {Integer} index of the day. 0=sunday, 1=monday, ...
       * @param locale {String} optional locale to be used
       * @return {Boolean} whether the given day is a weekend day
       */
      isWeekend(day, locale) {
        var weekendStart = qx.locale.Date.getWeekendStart(locale);
        var weekendEnd = qx.locale.Date.getWeekendEnd(locale);
        if (weekendEnd > weekendStart) {
          return day >= weekendStart && day <= weekendEnd;
        } else {
          return day >= weekendStart || day <= weekendEnd;
        }
      },
      /**
       * Extract the territory part from a locale
       *
       * @param locale {String} the locale
       * @return {String} territory
       */
      _getTerritory(locale) {
        if (locale) {
          var territory = locale.split("_")[1] || locale;
        } else {
          territory = this.__mgr__P_184_0.getTerritory() || this.__mgr__P_184_0.getLanguage();
        }
        return territory.toUpperCase();
      },
      /**
       * Provide localization (CLDR) data with fallback between "format" and "stand-alone" contexts.
       * It is used in {@link #getDayName} and {@link #getMonthName} methods.
       *
       * @param context {String} intended context.
       *       Possible values: "format", "stand-alone".
       * @param fallbackContext {String} the context used in case no localization is found for the key.
       * @param key {String} message id (may contain format strings)
       * @param locale {String} the locale
       * @return {String} localized name for the key
       *
       */
      __localizeWithFallback__P_184_1(context, fallbackContext, key, locale) {
        var localizedString = this.__mgr__P_184_0.localize(key, [], locale);
        if (localizedString == key) {
          var newKey = key.replace("_" + context + "_", "_" + fallbackContext + "_");
          return this.__mgr__P_184_0.localize(newKey, [], locale);
        } else {
          return localizedString;
        }
      }
    }
  });
  qx.locale.Date.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.Part": {},
      "qx.bom.request.Script": {},
      "qx.bom.client.Engine": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The Package wraps a list of related script URLs, which are required by one
   * or more parts.
   *
   * @internal
   * @ignore(qx.util.ResourceManager)
   */
  qx.Bootstrap.define("qx.io.part.Package", {
    /**
     * @param urls {String[]} A list of script URLs
     * @param id {var} Unique package hash key
     * @param loaded {Boolean?false} Whether the package is already loaded
     */
    construct(urls, id, loaded) {
      this.__readyState__P_136_0 = loaded ? "complete" : "initialized";
      this.__urls__P_136_1 = urls;
      this.__id__P_136_2 = id;
    },
    members: {
      __readyState__P_136_0: null,
      __urls__P_136_1: null,
      __id__P_136_2: null,
      __closure__P_136_3: null,
      __loadWithClosure__P_136_4: null,
      __timeoutId__P_136_5: null,
      __notifyPackageResult__P_136_6: null,
      /**
       * Get the package ID.
       *
       * @return {String} The package id
       */
      getId() {
        return this.__id__P_136_2;
      },
      /**
       * Get the ready state of the package. The value is one of
       * <ul>
       * <li>
       *   <b>initialized</b>: The package is initialized. The {@link #load}
       *   method has not yet been called
       * </li>
       * <li><b>loading</b>: The package is still loading.</li>
       * <li><b>complete</b>: The package has been loaded successfully</li>
       * <li><b>cached</b>: The package is loaded but is not executed
       *   (for closure parts)</li>
       * </li>
       *
       * @return {String} The ready state.
       */
      getReadyState() {
        return this.__readyState__P_136_0;
      },
      /**
       * Returns the urlsstored stored in the package.
       *
       * @internal
       * @return {String[]} An array of urls of this package.
       */
      getUrls() {
        return this.__urls__P_136_1;
      },
      /**
       * Method for storing the closure for this package. This is only relevant
       * if a {@link qx.io.part.ClosurePart} is used.
       *
       * @param closure {Function} The code of this package wrapped in a closure.
       */
      saveClosure(closure) {
        if (this.__readyState__P_136_0 == "error") {
          return;
        }
        this.__closure__P_136_3 = closure;
        if (!this.__loadWithClosure__P_136_4) {
          this.execute();
        } else {
          clearTimeout(this.__timeoutId__P_136_5);
          this.__readyState__P_136_0 = "cached";
          this.__notifyPackageResult__P_136_6(this);
        }
      },
      /**
       * Executes the stored closure. This is only relevant if a
       * {@link qx.io.part.ClosurePart} is used.
       */
      execute() {
        if (this.__closure__P_136_3) {
          this.__closure__P_136_3();
          delete this.__closure__P_136_3;
        }
        if (qx.$$packageData[this.__id__P_136_2]) {
          this.__importPackageData__P_136_7(qx.$$packageData[this.__id__P_136_2]);
          delete qx.$$packageData[this.__id__P_136_2];
        }
        this.__readyState__P_136_0 = "complete";
      },
      /**
       * Load method if the package loads a closure. This is only relevant if a
       * {@link qx.io.part.ClosurePart} is used.
       *
       * @param notifyPackageResult {Function} The callback if all scripts are
       *   done loading in this package.
       * @param self {Object?} The context of the callback.
       */
      loadClosure(notifyPackageResult, self) {
        if (this.__readyState__P_136_0 !== "initialized") {
          return;
        }
        this.__loadWithClosure__P_136_4 = true;
        this.__readyState__P_136_0 = "loading";
        this.__notifyPackageResult__P_136_6 = qx.Bootstrap.bind(notifyPackageResult, self);
        this.__loadScriptList__P_136_8(this.__urls__P_136_1, function () {}, function () {
          this.__readyState__P_136_0 = "error";
          notifyPackageResult.call(self, this);
        }, this);
        var pkg = this;
        this.__timeoutId__P_136_5 = setTimeout(function () {
          pkg.__readyState__P_136_0 = "error";
          notifyPackageResult.call(self, pkg);
        }, qx.Part.TIMEOUT);
      },
      /**
       * Load the part's script URLs in the correct order.
       *
       * @param notifyPackageResult {Function} The callback if all scripts are
       *   done loading in this package.
       * @param self {Object?} The context of the callback.
       */
      load(notifyPackageResult, self) {
        if (this.__readyState__P_136_0 !== "initialized") {
          return;
        }
        this.__loadWithClosure__P_136_4 = false;
        this.__readyState__P_136_0 = "loading";
        this.__loadScriptList__P_136_8(this.__urls__P_136_1, function () {
          this.__readyState__P_136_0 = "complete";
          this.execute();
          notifyPackageResult.call(self, this);
        }, function () {
          this.__readyState__P_136_0 = "error";
          notifyPackageResult.call(self, this);
        }, this);
      },
      /**
       * Loads a list of scripts in the correct order.
       *
       * @param urlList {String[]} List of script urls
       * @param callback {Function} Function to execute on completion
       * @param errBack {Function} Function to execute on error
       * @param self {Object?window} Context to execute the given function in
       */
      __loadScriptList__P_136_8(urlList, callback, errBack, self) {
        if (urlList.length == 0) {
          callback.call(self);
          return;
        }
        var urlsLoaded = 0;
        var self = this;
        var loadScripts = function (urls) {
          if (urlsLoaded >= urlList.length) {
            callback.call(self);
            return;
          }
          var loader = new qx.bom.request.Script();
          loader.open("GET", urls.shift());
          loader.onload = function () {
            urlsLoaded += 1;
            loader.dispose();

            // Important to use engine detection directly to keep the minimal
            // package size small [BUG #5068]
            if (qx.bom.client.Engine.getName() == "webkit") {
              // force asynchronous load
              // Safari fails with an "maximum recursion depth exceeded" error if it is
              // called sync.
              setTimeout(function () {
                loadScripts.call(self, urls, callback, self);
              }, 0);
            } else {
              loadScripts.call(self, urls, callback, self);
            }
          };
          loader.onerror = function () {
            if (self.__readyState__P_136_0 == "loading") {
              clearTimeout(self.__timeoutId__P_136_5);
              loader.dispose();
              return errBack.call(self);
            }
          };

          // Force loading script asynchronously (IE may load synchronously)
          window.setTimeout(function () {
            loader.send();
          });
        };
        loadScripts(urlList.concat());
      },
      /**
       * Import the data of a package. The function is defined in the loader
       * script.
       *
       * @signature function(packageData)
       * @param packageData {Map} Map of package data categories ("resources",...)
       */
      __importPackageData__P_136_7: qx.$$loader.importPackageData
    }
  });
  qx.io.part.Package.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Wrapper for a part as defined in the config file. This class knows about all
   * packages the part depends on and provides functionality to load the part.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.io.part.Part", {
    /**
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @param packages {qx.io.part.Package[]} List of dependent packages
     * @param loader {qx.Part} The loader of this part.
     */
    construct(name, packages, loader) {
      this.__name__P_138_0 = name;
      this._readyState = "complete";
      this._packages = packages;
      this._loader = loader;
      for (var i = 0; i < packages.length; i++) {
        if (packages[i].getReadyState() !== "complete") {
          this._readyState = "initialized";
          break;
        }
      }
    },
    members: {
      _readyState: null,
      _loader: null,
      _packages: null,
      __name__P_138_0: null,
      /**
       * Get the ready state of the part. The value is one of
       * <ul>
       * <li>
       *   <b>initialized</b>: The part is initialized. The {@link #load}
       *   method has not yet been called
       * </li>
       * <li><b>loading</b>: The part is still loading.</li>
       * <li><b>complete</b>: The part has been loaded successfully</li>
       * </li>
       *
       * @return {String} The ready state.
       */
      getReadyState() {
        return this._readyState;
      },
      /**
       * The part name as defined in the config file
       *
       * @return {String} The part name
       */
      getName() {
        return this.__name__P_138_0;
      },
      /**
       * Internal helper for testing purposes.
       * @internal
       * @return {qx.io.part.Package[]} All contained packages in an array.
       */
      getPackages() {
        return this._packages;
      },
      /**
       * Method for preloading this part.
       * Empty implementation! Regular parts can not be preloaded.
       *
       * @param callback {Function} Callback for the preload.
       * @param self {Object?} The context of the callback.
       */
      preload(callback, self) {
        // Just do nothing because you can not preload regular parts.
        // Also, loading the part here is not a good idea because it could break
        // the load order of the packages if someone uses preload right after
        // loading another part. So we just invoke the callback async.
        if (callback) {
          window.setTimeout(function () {
            callback.call(self, this);
          }, 0);
        }
      },
      /**
       * Loads the part asynchronously. The callback is called after the part and
       * its dependencies are fully loaded. If the part is already loaded the
       * callback is called immediately.
       *
       * @internal
       *
       * @param callback {Function} Function to execute on completion
       * @param self {Object?window} Context to execute the given function in
       */
      load(callback, self) {
        if (this._checkCompleteLoading(callback, self)) {
          return;
        }
        this._readyState = "loading";
        if (callback) {
          this._appendPartListener(callback, self, this);
        }
        var part = this;
        var onLoad = function () {
          part.load();
        };
        for (var i = 0; i < this._packages.length; i++) {
          var pkg = this._packages[i];
          switch (pkg.getReadyState()) {
            case "initialized":
              this._loader.addPackageListener(pkg, onLoad);
              pkg.load(this._loader.notifyPackageResult, this._loader);
              return;
            case "loading":
              this._loader.addPackageListener(pkg, onLoad);
              return;
            case "complete":
              break;
            case "error":
              this._markAsCompleted("error");
              return;
            default:
              throw new Error("Invalid case! " + pkg.getReadyState());
          }
        }
        this._markAsCompleted("complete");
      },
      /**
       * Helper for appending a listener for this part.
       *
       * @param callback {Function} The function to call when the part is loaded.
       * @param self {Object?} The context of the callback.
       * @param part {qx.io.part.Part|qx.io.part.ClosurePart} The part to listen
       *   to.
       */
      _appendPartListener(callback, self, part) {
        var that = this;
        this._loader.addPartListener(this, function () {
          that._signalStartup();
          callback.call(self, part._readyState);
        });
      },
      /**
       * Helper for marking the part as complete.
       *
       * @param readyState {String} The new ready state.
       */
      _markAsCompleted(readyState) {
        this._readyState = readyState;
        this._loader.notifyPartResult(this);
      },
      /**
       * Method used to start up the application in case not all parts
       * necessary to initialize the application are in the boot part. [BUG #3793]
       */
      _signalStartup() {
        // signal the application startup if not already done
        if (!qx.$$loader.applicationHandlerReady) {
          qx.$$loader.signalStartup();
        }
      },
      /**
       * Helper for checking if the part is loaded completely.
       *
       * @param callback {Function} The function to be called if the part has
       *   been loaded completely.
       * @param self {Object} The context of the callback function.
       * @return {Boolean} true, if the part is loading, complete or has an error.
       */
      _checkCompleteLoading(callback, self) {
        // check if its already loaded
        var readyState = this._readyState;
        if (readyState == "complete" || readyState == "error") {
          if (callback) {
            var that = this;
            setTimeout(function () {
              that._signalStartup();
              callback.call(self, readyState);
            }, 0);
          }
          return true;
        }
        // add a listener if it is currently loading
        else if (readyState == "loading" && callback) {
          this._appendPartListener(callback, self, this);
          return true;
        }
      }
    }
  });
  qx.io.part.Part.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.io.part.Part": {
        "construct": true,
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Wrapper for a part as defined in the config file. This class knows about all
   * packages the part depends on and provides functionality to load the part.
   *
   * @internal
   */
  qx.Bootstrap.define("qx.io.part.ClosurePart", {
    extend: qx.io.part.Part,
    /**
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @param packages {qx.io.part.Package[]} List of dependent packages
     * @param loader {qx.Part} The loader of this part.
     */
    construct(name, packages, loader) {
      qx.io.part.Part.call(this, name, packages, loader);
    },
    members: {
      __packagesToLoad__P_137_0: 0,
      // overridden
      preload(callback, self) {
        // store how many packages are already preloaded
        var packagesLoaded = 0;
        var that = this;
        for (var i = 0; i < this._packages.length; i++) {
          var pkg = this._packages[i];
          if (pkg.getReadyState() == "initialized") {
            pkg.loadClosure(function (pkg) {
              packagesLoaded++;
              that._loader.notifyPackageResult(pkg);
              // everything loaded?
              if (packagesLoaded >= that._packages.length && callback) {
                callback.call(self);
              }
            }, this._loader);
          }
        }
      },
      /**
       * Loads the closure part including all its packages. The loading will
       * be done parallel. After all packages are available, the closures are
       * executed in the correct order.
       *
       * @param callback {Function} The function to call after the loading.
       * @param self {Object?} The context of the callback.
       */
      load(callback, self) {
        if (this._checkCompleteLoading(callback, self)) {
          return;
        }
        this._readyState = "loading";
        if (callback) {
          this._appendPartListener(callback, self, this);
        }
        this.__packagesToLoad__P_137_0 = this._packages.length;
        for (var i = 0; i < this._packages.length; i++) {
          var pkg = this._packages[i];
          var pkgReadyState = pkg.getReadyState();

          // trigger loading
          if (pkgReadyState == "initialized") {
            pkg.loadClosure(this._loader.notifyPackageResult, this._loader);
          }

          // Listener for package changes
          if (pkgReadyState == "initialized" || pkgReadyState == "loading") {
            this._loader.addPackageListener(pkg, qx.Bootstrap.bind(this._onPackageLoad, this, pkg));
          } else if (pkgReadyState == "error") {
            this._markAsCompleted("error");
            return;
          } else {
            // "complete" and "cached"
            this.__packagesToLoad__P_137_0--;
          }
        }

        // execute closures in case everything is already loaded/cached
        if (this.__packagesToLoad__P_137_0 <= 0) {
          this.__executePackages__P_137_1();
        }
      },
      /**
       * Executes the packages in their correct order and marks the part as
       * complete after execution.
       */
      __executePackages__P_137_1() {
        for (var i = 0; i < this._packages.length; i++) {
          this._packages[i].execute();
        }
        this._markAsCompleted("complete");
      },
      /**
       * Handler for every package load. It checks for errors and decreases the
       * packages to load. If all packages has been loaded, it invokes the
       * execution.
       *
       * @param pkg {qx.io.part.Package} The loaded package.
       */
      _onPackageLoad(pkg) {
        // if the part already has an error, ignore the callback
        if (this._readyState == "error") {
          return;
        }

        // one error package results in an error part
        if (pkg.getReadyState() == "error") {
          this._markAsCompleted("error");
          return;
        }

        // every package could be loaded -> execute the closures
        this.__packagesToLoad__P_137_0--;
        if (this.__packagesToLoad__P_137_0 <= 0) {
          this.__executePackages__P_137_1();
        }
      }
    }
  });
  qx.io.part.ClosurePart.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Interface": {
        "usage": "dynamic",
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Christian Hagendorn (chris_schmidt)
  
  ************************************************************************ */
  /**
   * Defines the callback for the single selection manager.
   *
   * @internal
   */
  qx.Interface.define("qx.ui.core.ISingleSelectionProvider", {
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Returns the elements which are part of the selection.
       *
       * @return {qx.ui.core.Widget[]} The widgets for the selection.
       */
      getItems() {},
      /**
       * Returns whether the given item is selectable.
       *
       * @param item {qx.ui.core.Widget} The item to be checked
       * @return {Boolean} Whether the given item is selectable
       */
      isItemSelectable(item) {}
    }
  });
  qx.ui.core.ISingleSelectionProvider.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-27.js.map?dt=1769807054279
qx.$$packageData['27'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
