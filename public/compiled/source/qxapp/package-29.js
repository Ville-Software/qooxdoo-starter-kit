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
      "qx.Promise": {
        "construct": true
      },
      "qx.bom.Label": {},
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.event.Timer": {},
      "qx.bom.element.Dimension": {},
      "qx.lang.Object": {},
      "qx.bom.element.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "browser.name": {
          "className": "qx.bom.client.Browser"
        },
        "browser.version": {
          "className": "qx.bom.client.Browser"
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
   * Checks whether a given font is available on the document and fires events
   * accordingly.
   *
   * This class does not need to be disposed, unless you want to abort the validation
   * early
   */
  qx.Class.define("qx.bom.webfonts.Validator", {
    extend: qx.core.Object,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param fontFamily {String} The name of the font to be verified
     * @param comparisonString {String?} String to be used to detect whether a font was loaded or not
     * @param fontWeight {String?} the weight of the font to be verified
     * @param fontStyle {String?} the style of the font to be verified
     * whether the font has loaded properly
     */
    construct(fontFamily, comparisonString, fontWeight, fontStyle) {
      qx.core.Object.constructor.call(this);
      if (comparisonString) {
        this.setComparisonString(comparisonString);
      }
      if (fontWeight) {
        this.setFontWeight(fontWeight);
      }
      if (fontStyle) {
        this.setFontStyle(fontStyle);
      }
      if (fontFamily) {
        this.setFontFamily(fontFamily);
        this.__requestedHelpers__P_219_0 = this._getRequestedHelpers();
      }
      this.__promiseValid__P_219_1 = new qx.Promise();
    },
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Sets of serif and sans-serif fonts to be used for size comparisons.
       * At least one of these fonts should be present on any system.
       */
      COMPARISON_FONTS: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        serif: ["Times New Roman", "Georgia", "serif"]
      },
      /**
       * Map of common CSS attributes to be used for all  size comparison elements
       */
      HELPER_CSS: {
        position: "absolute",
        margin: "0",
        padding: "0",
        top: "-1000px",
        left: "-1000px",
        fontSize: "350px",
        width: "auto",
        height: "auto",
        lineHeight: "normal",
        fontVariant: "normal",
        visibility: "hidden"
      },
      /**
       * The string to be used in the size comparison elements. This is the default string
       * which is used for the {@link #COMPARISON_FONTS} and the font to be validated. It
       * can be overridden for the font to be validated using the {@link #comparisonString}
       * property.
       */
      COMPARISON_STRING: "WEei",
      __defaultSizes__P_219_2: null,
      __defaultHelpers__P_219_3: null,
      /**
       * Removes the two common helper elements used for all size comparisons from
       * the DOM
       */
      removeDefaultHelperElements() {
        var defaultHelpers = qx.bom.webfonts.Validator.__defaultHelpers__P_219_3;
        if (defaultHelpers) {
          for (var prop in defaultHelpers) {
            document.body.removeChild(defaultHelpers[prop]);
          }
        }
        delete qx.bom.webfonts.Validator.__defaultHelpers__P_219_3;
      }
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * The font-family this validator should check
       */
      fontFamily: {
        nullable: true,
        init: null,
        apply: "_applyFontFamily"
      },
      /** The font weight to check */
      fontWeight: {
        nullable: true,
        check: "String",
        apply: "_applyFontWeight"
      },
      /** The font style to check */
      fontStyle: {
        nullable: true,
        check: "String",
        apply: "_applyFontStyle"
      },
      /**
       * Comparison string used to check whether the font has loaded or not.
       */
      comparisonString: {
        nullable: true,
        init: null
      },
      /**
       * Time in milliseconds from the beginning of the check until it is assumed
       * that a font is not available
       */
      timeout: {
        check: "Integer",
        init: 5000
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired when the status of a web font has been determined. The event data
       * is a map with the keys "family" (the font-family name) and "valid"
       * (Boolean).
       */
      changeStatus: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __requestedHelpers__P_219_0: null,
      __checkTimer__P_219_4: null,
      __checkStarted__P_219_5: null,
      __promiseValid__P_219_1: null,
      /*
      ---------------------------------------------------------------------------
        PUBLIC API
      ---------------------------------------------------------------------------
      */

      /**
       * Validates the font
       */
      validate() {
        if (this.__checkStarted__P_219_5) {
          return;
        }
        const setValidImpl = valid => {
          if (this.__checkTimer__P_219_4) {
            this.__checkTimer__P_219_4.stop();
          }
          this._reset();
          this.__promiseValid__P_219_1.resolve(valid);
          this.fireDataEvent("changeStatus", {
            family: this.getFontFamily(),
            valid: valid
          });
        };
        if (document.fonts && typeof document.fonts.load == "function") {
          this.__checkStarted__P_219_5 = new Date().getTime();
          let fontExpr = `${this.getFontStyle() || "normal"} ${this.getFontWeight() || "normal"} 14px ${this.getFontFamily()}`;
          const loadImpl = async () => {
            try {
              await document.fonts.load(fontExpr);
              await document.fonts.ready;
              qx.bom.Label.getTextSize("Hello World", {
                fontFamily: this.getFontFamily(),
                fontStyle: this.getFontStyle(),
                fontWeight: this.getFontWeight()
              });
              setTimeout(() => setValidImpl(this._isFontValid()), 100);
            } catch (ex) {
              this.warn(`Exception while loading font ${fontExpr}: ` + ex);
              setValidImpl(false);
            }
          };
          loadImpl();
        } else {
          this.__checkStarted__P_219_5 = new Date().getTime();
          let fontExpr = `${this.getFontStyle() || "normal"} ${this.getFontWeight() || "normal"} 14px ${this.getFontFamily()}`;
          const timerCheck = () => {
            if (this._isFontValid()) {
              // safari has trouble resizing, adding it again fixed the issue [BUG #8786]
              if (qx.core.Environment.get("browser.name") == "safari" && parseFloat(qx.core.Environment.get("browser.version")) >= 8) {
                setTimeout(() => setValidImpl(true), 100);
              } else {
                setValidImpl(true);
              }
            } else {
              var now = new Date().getTime();
              if (now - this.__checkStarted__P_219_5 >= this.getTimeout()) {
                setValidImpl(false);
              }
            }
          };

          // Give the browser a chance to render the new elements
          qx.event.Timer.once(() => {
            this.__checkTimer__P_219_4 = new qx.event.Timer(100);
            this.__checkTimer__P_219_4.addListener("interval", timerCheck);
            this.__checkTimer__P_219_4.start();
          }, this, 0);
        }
      },
      /**
       * Waits for the font to become invalid or valid
       *
       * @returns {Boolean} whether valid or not
       */
      async isValid() {
        return await this.__promiseValid__P_219_1;
      },
      /*
      ---------------------------------------------------------------------------
        PROTECTED API
      ---------------------------------------------------------------------------
      */

      /**
       * Removes the helper elements from the DOM
       */
      _reset() {
        if (this.__requestedHelpers__P_219_0) {
          for (var prop in this.__requestedHelpers__P_219_0) {
            var elem = this.__requestedHelpers__P_219_0[prop];
            document.body.removeChild(elem);
          }
          this.__requestedHelpers__P_219_0 = null;
        }
      },
      /**
       * Checks if the font is available by comparing the widths of the elements
       * using the generic fonts to the widths of the elements using the font to
       * be validated
       *
       * @return {Boolean} Whether or not the font caused the elements to differ
       * in size
       */
      _isFontValid() {
        if (!qx.bom.webfonts.Validator.__defaultSizes__P_219_2) {
          this.__init__P_219_6();
        }
        if (!this.__requestedHelpers__P_219_0) {
          this.__requestedHelpers__P_219_0 = this._getRequestedHelpers();
        }

        // force rerendering for chrome
        this.__requestedHelpers__P_219_0.sans.style.visibility = "visible";
        this.__requestedHelpers__P_219_0.sans.style.visibility = "hidden";
        this.__requestedHelpers__P_219_0.serif.style.visibility = "visible";
        this.__requestedHelpers__P_219_0.serif.style.visibility = "hidden";
        var requestedSans = qx.bom.element.Dimension.getWidth(this.__requestedHelpers__P_219_0.sans);
        var requestedSerif = qx.bom.element.Dimension.getWidth(this.__requestedHelpers__P_219_0.serif);
        var cls = qx.bom.webfonts.Validator;
        if (requestedSans !== cls.__defaultSizes__P_219_2.sans || requestedSerif !== cls.__defaultSizes__P_219_2.serif) {
          return true;
        }
        return false;
      },
      /**
       * Creates the two helper elements styled with the font to be checked
       *
       * @return {Map} A map with the keys <pre>sans</pre> and <pre>serif</pre>
       * and the created span elements as values
       */
      _getRequestedHelpers() {
        var fontsSans = [this.getFontFamily()].concat(qx.bom.webfonts.Validator.COMPARISON_FONTS.sans);
        var fontsSerif = [this.getFontFamily()].concat(qx.bom.webfonts.Validator.COMPARISON_FONTS.serif);
        return {
          sans: this._getHelperElement(fontsSans, this.getComparisonString()),
          serif: this._getHelperElement(fontsSerif, this.getComparisonString())
        };
      },
      /**
       * Creates a span element with the comparison text (either {@link #COMPARISON_STRING} or
       * {@link #comparisonString}) and styled with the default CSS ({@link #HELPER_CSS}) plus
       * the given font-family value and appends it to the DOM
       *
       * @param fontFamily {String} font-family string
       * @param comparisonString {String?} String to be used to detect whether a font was loaded or not
       * @return {Element} the created DOM element
       */
      _getHelperElement(fontFamily, comparisonString) {
        var styleMap = qx.lang.Object.clone(qx.bom.webfonts.Validator.HELPER_CSS);
        if (fontFamily) {
          if (styleMap.fontFamily) {
            styleMap.fontFamily += "," + fontFamily.join(",");
          } else {
            styleMap.fontFamily = fontFamily.join(",");
          }
        }
        if (this.getFontWeight()) {
          styleMap.fontWeight = this.getFontWeight();
        }
        if (this.getFontStyle()) {
          styleMap.fontStyle = this.getFontStyle();
        }
        var elem = document.createElement("span");
        elem.innerHTML = comparisonString || qx.bom.webfonts.Validator.COMPARISON_STRING;
        qx.bom.element.Style.setStyles(elem, styleMap);
        document.body.appendChild(elem);
        return elem;
      },
      // property apply
      _applyFontFamily(value, old) {
        if (value !== old) {
          this._reset();
        }
      },
      // property apply
      _applyFontWeight(value, old) {
        if (value !== old) {
          this._reset();
        }
      },
      // property apply
      _applyFontStyle(value, old) {
        if (value !== old) {
          this._reset();
        }
      },
      /*
      ---------------------------------------------------------------------------
        PRIVATE API
      ---------------------------------------------------------------------------
      */

      /**
       * Creates the default helper elements and gets their widths
       */
      __init__P_219_6() {
        var cls = qx.bom.webfonts.Validator;
        if (!cls.__defaultHelpers__P_219_3) {
          cls.__defaultHelpers__P_219_3 = {
            sans: this._getHelperElement(cls.COMPARISON_FONTS.sans),
            serif: this._getHelperElement(cls.COMPARISON_FONTS.serif)
          };
        }
        cls.__defaultSizes__P_219_2 = {
          sans: qx.bom.element.Dimension.getWidth(cls.__defaultHelpers__P_219_3.sans),
          serif: qx.bom.element.Dimension.getWidth(cls.__defaultHelpers__P_219_3.serif)
        };
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      this._reset();
      if (this.__checkTimer__P_219_4 != null) {
        this.__checkTimer__P_219_4.stop();
      }
      this._disposeObjects("__checkTimer__P_219_4");
    }
  });
  qx.bom.webfonts.Validator.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.MChildrenHandling": {
        "require": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "qx.ui.menu.Menu": {},
      "qx.util.PropertyUtil": {},
      "qx.ui.core.Spacer": {},
      "qx.ui.toolbar.Separator": {},
      "qx.ui.menubar.Button": {},
      "qx.ui.toolbar.Part": {}
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
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * The Toolbar class is the main part of the toolbar widget.
   *
   * It can handle added {@link Button}s, {@link CheckBox}es, {@link RadioButton}s
   * and {@link Separator}s in its {@link #add} method. The {@link #addSpacer} method
   * adds a spacer at the current toolbar position. This means that the widgets
   * added after the method call of {@link #addSpacer} are aligned to the right of
   * the toolbar.
   *
   * For more details on the documentation of the toolbar widget, take a look at the
   * documentation of the {@link qx.ui.toolbar}-Package.
   */
  qx.Class.define("qx.ui.toolbar.ToolBar", {
    extend: qx.ui.core.Widget,
    include: qx.ui.core.MChildrenHandling,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Constructor
     * @param {qx.ui.layout.Abstract?} layout optional layout, defaults to qx.ui.layout.HBox
     */
    construct(layout) {
      qx.ui.core.Widget.constructor.call(this);

      // ARIA attrs
      this.getContentElement().setAttribute("role", "toolbar");

      // add needed layout
      this._setLayout(layout || new qx.ui.layout.HBox());

      // initialize the overflow handling
      this.__removedItems__P_220_0 = [];
      this.__removePriority__P_220_1 = [];
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** Appearance of the widget */
      appearance: {
        refine: true,
        init: "toolbar"
      },
      /** Holds the currently open menu (when the toolbar is used for menus) */
      openMenu: {
        check: "qx.ui.menu.Menu",
        event: "changeOpenMenu",
        nullable: true
      },
      /** Whether icons, labels, both or none should be shown. */
      show: {
        init: "both",
        check: ["both", "label", "icon"],
        inheritable: true,
        apply: "_applyShow",
        event: "changeShow"
      },
      /** The spacing between every child of the toolbar */
      spacing: {
        nullable: true,
        check: "Integer",
        themeable: true,
        apply: "_applySpacing"
      },
      /**
       * Widget which will be shown if at least one toolbar item is hidden.
       * Keep in mind to add this widget to the toolbar before you set it as
       * indicator!
       */
      overflowIndicator: {
        check: "qx.ui.core.Widget",
        nullable: true,
        apply: "_applyOverflowIndicator"
      },
      /** Enables the overflow handling which automatically removes items.*/
      overflowHandling: {
        init: false,
        check: "Boolean",
        apply: "_applyOverflowHandling"
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /** Fired if an item will be hidden by the {@link #overflowHandling}.*/
      hideItem: "qx.event.type.Data",
      /** Fired if an item will be shown by the {@link #overflowHandling}.*/
      showItem: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        OVERFLOW HANDLING
      ---------------------------------------------------------------------------
      */

      __removedItems__P_220_0: null,
      __removePriority__P_220_1: null,
      // overridden
      _computeSizeHint() {
        // get the original hint
        var hint = qx.ui.toolbar.ToolBar.superclass.prototype._computeSizeHint.call(this);
        if (true && this.getOverflowHandling()) {
          var minWidth = 0;
          // if an overflow widget is given, use its width + spacing as min width
          var overflowWidget = this.getOverflowIndicator();
          if (overflowWidget) {
            minWidth = overflowWidget.getSizeHint().width + this.getSpacing();
          }
          // reset the minWidth because we reduce the count of elements
          hint.minWidth = minWidth;
        }
        return hint;
      },
      /**
       * Resize event handler.
       *
       * @param e {qx.event.type.Data} The resize event.
       */
      _onResize(e) {
        this._recalculateOverflow(e.getData().width);
      },
      /**
       * Responsible for calculation the overflow based on the available width.
       *
       * @param width {Integer?null} The available width.
       * @param requiredWidth {Integer?null} The required width for the widget
       *   if available.
       */
      _recalculateOverflow(width, requiredWidth) {
        // do nothing if overflow handling is not enabled
        if (!this.getOverflowHandling()) {
          return;
        }

        // get all required sizes
        requiredWidth = requiredWidth || this.getSizeHint().width;
        var overflowWidget = this.getOverflowIndicator();
        var overflowWidgetWidth = 0;
        if (overflowWidget) {
          overflowWidgetWidth = overflowWidget.getSizeHint().width;
        }
        if (width == undefined && this.getBounds() != null) {
          width = this.getBounds().width;
        }

        // if we still don't have a width, than we are not added to a parent
        if (width == undefined) {
          // we should ignore it in that case
          return;
        }

        // if we have not enough space
        if (width < requiredWidth) {
          do {
            // get the next child
            var childToHide = this._getNextToHide();
            // if there is no child to hide, just do nothing
            if (!childToHide) {
              return;
            }
            // get margins or spacing
            var margins = childToHide.getMarginLeft() + childToHide.getMarginRight();
            margins = Math.max(margins, this.getSpacing());
            var childWidth = childToHide.getSizeHint().width + margins;
            this.__hideChild__P_220_2(childToHide);

            // new width is the requiredWidth - the removed childs width
            requiredWidth -= childWidth;

            // show the overflowWidgetWidth
            if (overflowWidget && overflowWidget.getVisibility() != "visible") {
              overflowWidget.setVisibility("visible");
              // if we need to add the overflow indicator, we need to add its width
              requiredWidth += overflowWidgetWidth;
              // add spacing or margins
              var overflowWidgetMargins = overflowWidget.getMarginLeft() + overflowWidget.getMarginRight();
              requiredWidth += Math.max(overflowWidgetMargins, this.getSpacing());
            }
          } while (requiredWidth > width);

          // if we can possibly show something
        } else if (this.__removedItems__P_220_0.length > 0) {
          do {
            var removedChild = this.__removedItems__P_220_0[0];
            // if we have something we can show
            if (removedChild) {
              // get the margins or spacing
              var margins = removedChild.getMarginLeft() + removedChild.getMarginRight();
              margins = Math.max(margins, this.getSpacing());

              // check if the element has been rendered before [BUG #4542]
              if (removedChild.getContentElement().getDomElement() == null) {
                // if not, apply the decorator element because it can change the
                // width of the child with padding e.g.
                removedChild.syncAppearance();
                // also invalidate the layout cache to trigger size hint
                // recalculation
                removedChild.invalidateLayoutCache();
              }
              var removedChildWidth = removedChild.getSizeHint().width;

              // check if it fits in in case its the last child to replace
              var fits = false;
              // if we can remove the overflow widget if its available

              if (this.__removedItems__P_220_0.length == 1 && overflowWidgetWidth > 0) {
                var addedMargin = margins - this.getSpacing();
                var wouldRequiredWidth = requiredWidth - overflowWidgetWidth + removedChildWidth + addedMargin;
                fits = width > wouldRequiredWidth;
              }

              // if it just fits in || it fits in when we remove the overflow widget
              if (width > requiredWidth + removedChildWidth + margins || fits) {
                this.__showChild__P_220_3(removedChild);
                requiredWidth += removedChildWidth;
                // check if we need to remove the overflow widget
                if (overflowWidget && this.__removedItems__P_220_0.length == 0) {
                  overflowWidget.setVisibility("excluded");
                }
              } else {
                return;
              }
            }
          } while (width >= requiredWidth && this.__removedItems__P_220_0.length > 0);
        }
      },
      /**
       * Helper to show a toolbar item.
       *
       * @param child {qx.ui.core.Widget} The widget to show.
       */
      __showChild__P_220_3(child) {
        child.setVisibility("visible");
        this.__removedItems__P_220_0.shift();
        this.fireDataEvent("showItem", child);
      },
      /**
       * Helper to exclude a toolbar item.
       *
       * @param child {qx.ui.core.Widget} The widget to exclude.
       */
      __hideChild__P_220_2(child) {
        // ignore the call if no child is given
        if (!child) {
          return;
        }
        this.__removedItems__P_220_0.unshift(child);
        child.setVisibility("excluded");
        this.fireDataEvent("hideItem", child);
      },
      /**
       * Responsible for returning the next item to remove. In It checks the
       * priorities added by {@link #setRemovePriority}. If all priorized widgets
       * already excluded, it takes the widget added at last.
       *
       * @return {qx.ui.core.Widget|null} The widget which should be removed next.
       *   If null is returned, no widget is available to remove.
       */
      _getNextToHide() {
        // get the elements by priority
        for (var i = this.__removePriority__P_220_1.length - 1; i >= 0; i--) {
          var item = this.__removePriority__P_220_1[i];
          // maybe a priority is left out and spacers don't have the visibility
          if (item && item.getVisibility && item.getVisibility() == "visible") {
            return item;
          }
        }

        // if there is non found by priority, check all available widgets
        var children = this._getChildren();
        for (var i = children.length - 1; i >= 0; i--) {
          var child = children[i];
          // ignore the overflow widget
          if (child == this.getOverflowIndicator()) {
            continue;
          }
          // spacer don't have the visibility
          if (child.getVisibility && child.getVisibility() == "visible") {
            return child;
          }
        }
      },
      /**
       * The removal of the toolbar items is priority based. You can change these
       * priorities with this method. The higher a priority, the earlier it will
       * be excluded. Remember to use every priority only once! If you want
       * override an already set priority, use the override parameter.
       * Keep in mind to only use already added items.
       *
       * @param item {qx.ui.core.Widget} The item to give the priority.
       * @param priority {Integer} The priority, higher means removed earlier.
       * @param override {Boolean} true, if the priority should be overridden.
       */
      setRemovePriority(item, priority, override) {
        // security check for overriding priorities
        if (!override && this.__removePriority__P_220_1[priority] != undefined) {
          throw new Error("Priority already in use!");
        }
        this.__removePriority__P_220_1[priority] = item;
      },
      // property apply
      _applyOverflowHandling(value, old) {
        // invalidate the own and the parents layout cache because the size hint changes
        this.invalidateLayoutCache();
        var parent = this.getLayoutParent();
        if (parent) {
          parent.invalidateLayoutCache();
        }

        // recalculate if possible
        var bounds = this.getBounds();
        if (bounds && bounds.width) {
          this._recalculateOverflow(bounds.width);
        }

        // if the handling has been enabled
        if (value) {
          // add the resize listener
          this.addListener("resize", this._onResize, this);

          // if the handles has been disabled
        } else {
          this.removeListener("resize", this._onResize, this);

          // set the overflow indicator to excluded
          var overflowIndicator = this.getOverflowIndicator();
          if (overflowIndicator) {
            overflowIndicator.setVisibility("excluded");
          }

          // set all buttons back to visible
          for (var i = 0; i < this.__removedItems__P_220_0.length; i++) {
            this.__removedItems__P_220_0[i].setVisibility("visible");
          }
          // reset the removed items
          this.__removedItems__P_220_0 = [];
        }
      },
      // property apply
      _applyOverflowIndicator(value, old) {
        if (old) {
          this._remove(old);
        }
        if (value) {
          // check if its a child of the toolbar
          if (this._indexOf(value) == -1) {
            throw new Error("Widget must be child of the toolbar.");
          }
          // hide the widget
          value.setVisibility("excluded");
        }
      },
      /*
      ---------------------------------------------------------------------------
        MENU OPEN
      ---------------------------------------------------------------------------
      */

      __allowMenuOpenHover__P_220_4: false,
      /**
       * Indicate if a menu could be opened on hover or not.
       *
       * @internal
       * @param value {Boolean} <code>true</code> if a menu could be opened,
       *    <code>false</code> otherwise.
       */
      _setAllowMenuOpenHover(value) {
        this.__allowMenuOpenHover__P_220_4 = value;
      },
      /**
       * Return if a menu could be opened on hover or not.
       *
       * @internal
       * @return {Boolean} <code>true</code> if a menu could be opened,
       *    <code>false</code> otherwise.
       */
      _isAllowMenuOpenHover() {
        return this.__allowMenuOpenHover__P_220_4;
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applySpacing(value, old) {
        var layout = this._getLayout();
        value == null ? layout.resetSpacing() : layout.setSpacing(value);
      },
      // property apply
      _applyShow(value) {
        var children = this._getChildren();
        for (var i = 0; i < children.length; i++) {
          if (children[i].setShow) {
            children[i].setShow(value);
          }
        }
      },
      /*
      ---------------------------------------------------------------------------
        CHILD HANDLING
      ---------------------------------------------------------------------------
      */
      // overridden
      _add(child, options) {
        qx.ui.toolbar.ToolBar.superclass.prototype._add.call(this, child, options);
        // sync the show property (bug #6743) - but only if show wasn't explicitly set for the child (bug #6823)
        if (child.setShow && !qx.util.PropertyUtil.getUserValue(child, "show")) {
          child.setShow(this.getShow());
        }
        var newWidth = this.getSizeHint().width + child.getSizeHint().width + 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _addAt(child, index, options) {
        qx.ui.toolbar.ToolBar.superclass.prototype._addAt.call(this, child, index, options);
        // sync the show property (bug #6743) - but only if show wasn't explicitly set for the child (bug #6823)
        if (child.setShow && !qx.util.PropertyUtil.getUserValue(child, "show")) {
          child.setShow(this.getShow());
        }
        var newWidth = this.getSizeHint().width + child.getSizeHint().width + 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _addBefore(child, before, options) {
        qx.ui.toolbar.ToolBar.superclass.prototype._addBefore.call(this, child, before, options);
        // sync the show property (bug #6743) - but only if show wasn't explicitly set for the child (bug #6823)
        if (child.setShow && !qx.util.PropertyUtil.getUserValue(child, "show")) {
          child.setShow(this.getShow());
        }
        var newWidth = this.getSizeHint().width + child.getSizeHint().width + 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _addAfter(child, after, options) {
        qx.ui.toolbar.ToolBar.superclass.prototype._addAfter.call(this, child, after, options);
        // sync the show property (bug #6743) - but only if show wasn't explicitly set for the child (bug #6823)
        if (child.setShow && !qx.util.PropertyUtil.getUserValue(child, "show")) {
          child.setShow(this.getShow());
        }
        var newWidth = this.getSizeHint().width + child.getSizeHint().width + 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _remove(child) {
        qx.ui.toolbar.ToolBar.superclass.prototype._remove.call(this, child);
        var newWidth = this.getSizeHint().width - child.getSizeHint().width - 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
      },
      // overridden
      _removeAt(index) {
        var child = this._getChildren()[index];
        qx.ui.toolbar.ToolBar.superclass.prototype._removeAt.call(this, index);
        var newWidth = this.getSizeHint().width - child.getSizeHint().width - 2 * this.getSpacing();
        this._recalculateOverflow(null, newWidth);
        return child;
      },
      // overridden
      _removeAll() {
        var children = qx.ui.toolbar.ToolBar.superclass.prototype._removeAll.call(this);
        this._recalculateOverflow(null, 0);
        return children;
      },
      /*
      ---------------------------------------------------------------------------
        UTILITIES
      ---------------------------------------------------------------------------
      */

      /**
       * Add a spacer to the toolbar. The spacer has a flex
       * value of one and will stretch to the available space.
       *
       * @return {qx.ui.core.Spacer} The newly added spacer object. A reference
       *   to the spacer is needed to remove this spacer from the layout.
       */
      addSpacer() {
        var spacer = new qx.ui.core.Spacer();
        this._add(spacer, {
          flex: 1
        });
        return spacer;
      },
      /**
       * Adds a separator to the toolbar.
       */
      addSeparator() {
        this.add(new qx.ui.toolbar.Separator());
      },
      /**
       * Returns all nested buttons which contains a menu to show. This is mainly
       * used for keyboard support.
       *
       * @return {Array} List of all menu buttons
       */
      getMenuButtons() {
        var children = this.getChildren();
        var buttons = [];
        var child;
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          if (child instanceof qx.ui.menubar.Button) {
            buttons.push(child);
          } else if (child instanceof qx.ui.toolbar.Part) {
            buttons.push.apply(buttons, child.getMenuButtons());
          }
        }
        return buttons;
      }
    },
    destruct() {
      if (this.hasListener("resize")) {
        this.removeListener("resize", this._onResize, this);
      }
    }
  });
  qx.ui.toolbar.ToolBar.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Registration": {},
      "qx.event.util.Keyboard": {},
      "qx.lang.String": {},
      "qx.locale.Key": {}
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
   * Shortcuts can be used to globally define keyboard shortcuts.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.bom.Shortcut", {
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * Create a new instance of Command
     *
     * @param shortcut {String} shortcuts can be composed of optional modifier
     *    keys Control, Alt, Shift, Meta and a non modifier key.
     *    If no non modifier key is specified, the second parameter is evaluated.
     *    The key must be separated by a <code>+</code> or <code>-</code> character.
     *    Examples: Alt+F1, Control+C, Control+Alt+Delete
     */
    construct(shortcut) {
      qx.core.Object.constructor.call(this);
      this.__modifier__P_224_0 = {};
      this.__key__P_224_1 = null;
      if (shortcut != null) {
        this.setShortcut(shortcut);
      }
      this.initEnabled();
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * Fired when the command is executed. Sets the "data" property of the event to
       * the object that issued the command.
       */
      execute: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** whether the command should be respected/enabled */
      enabled: {
        init: true,
        check: "Boolean",
        event: "changeEnabled",
        apply: "_applyEnabled"
      },
      /** The command shortcut */
      shortcut: {
        check: "String",
        apply: "_applyShortcut",
        nullable: true
      },
      /**
       * Whether the execute event should be fired repeatedly if the user keep
       * the keys pressed.
       */
      autoRepeat: {
        check: "Boolean",
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
      __modifier__P_224_0: "",
      __key__P_224_1: "",
      /*
      ---------------------------------------------------------------------------
        USER METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Fire the "execute" event on this shortcut.
       *
       * @param target {Object} Object which issued the execute event
       */
      execute(target) {
        this.fireDataEvent("execute", target);
      },
      /**
       * Key down event handler.
       *
       * @param event {qx.event.type.KeySequence} The key event object
       */
      __onKeyDown__P_224_2(event) {
        if (this.getEnabled() && this.__matchesKeyEvent__P_224_3(event)) {
          if (!this.isAutoRepeat()) {
            this.execute(event.getTarget());
          }
          event.stop();
        }
      },
      /**
       * Key press event handler.
       *
       * @param event {qx.event.type.KeySequence} The key event object
       */
      __onKeyPress__P_224_4(event) {
        if (this.getEnabled() && this.__matchesKeyEvent__P_224_3(event)) {
          if (this.isAutoRepeat()) {
            this.execute(event.getTarget());
          }
          event.stop();
        }
      },
      /*
      ---------------------------------------------------------------------------
        APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyEnabled(value, old) {
        if (value) {
          qx.event.Registration.addListener(document.documentElement, "keydown", this.__onKeyDown__P_224_2, this);
          qx.event.Registration.addListener(document.documentElement, "keypress", this.__onKeyPress__P_224_4, this);
        } else {
          qx.event.Registration.removeListener(document.documentElement, "keydown", this.__onKeyDown__P_224_2, this);
          qx.event.Registration.removeListener(document.documentElement, "keypress", this.__onKeyPress__P_224_4, this);
        }
      },
      // property apply
      _applyShortcut(value, old) {
        if (value) {
          // do not allow whitespaces within shortcuts
          if (value.search(/[\s]+/) != -1) {
            var msg = "Whitespaces are not allowed within shortcuts";
            this.error(msg);
            throw new Error(msg);
          }
          this.__modifier__P_224_0 = {
            Control: false,
            Shift: false,
            Meta: false,
            Alt: false
          };
          this.__key__P_224_1 = null;

          // To support shortcuts with "+" and "-" as keys it is necessary
          // to split the given value in a different way to determine the
          // several keyIdentifiers
          var index;
          var a = [];
          while (value.length > 0 && index != -1) {
            // search for delimiters "+" and "-"
            index = value.search(/[-+]+/);

            // add identifiers - take value if no separator was found or
            // only one char is left (second part of shortcut)
            a.push(value.length == 1 || index == -1 ? value : value.substring(0, index));

            // extract the already detected identifier
            value = value.substring(index + 1);
          }
          var al = a.length;
          for (var i = 0; i < al; i++) {
            var identifier = this.__normalizeKeyIdentifier__P_224_5(a[i]);
            switch (identifier) {
              case "Control":
              case "Shift":
              case "Meta":
              case "Alt":
                this.__modifier__P_224_0[identifier] = true;
                break;
              case "Unidentified":
                var msg = "Not a valid key name for a shortcut: " + a[i];
                this.error(msg);
                throw msg;
              default:
                if (this.__key__P_224_1) {
                  var msg = "You can only specify one non modifier key!";
                  this.error(msg);
                  throw msg;
                }
                this.__key__P_224_1 = identifier;
            }
          }
        }
        return true;
      },
      /*
      --------------------------------------------------------------------------
        INTERNAL MATCHING LOGIC
      ---------------------------------------------------------------------------
      */

      /**
       * Checks whether the given key event matches the shortcut's shortcut
       *
       * @param e {qx.event.type.KeySequence} the key event object
       * @return {Boolean} whether the shortcuts shortcut matches the key event
       */
      __matchesKeyEvent__P_224_3(e) {
        var key = this.__key__P_224_1;
        if (!key) {
          // no shortcut defined.
          return false;
        }

        // for check special keys
        // and check if a shortcut is a single char and special keys are pressed
        if (!this.__modifier__P_224_0.Shift && e.isShiftPressed() || this.__modifier__P_224_0.Shift && !e.isShiftPressed() || !this.__modifier__P_224_0.Control && e.isCtrlPressed() || this.__modifier__P_224_0.Control && !e.isCtrlPressed() || !this.__modifier__P_224_0.Meta && e.isMetaPressed() || this.__modifier__P_224_0.Meta && !e.isMetaPressed() || !this.__modifier__P_224_0.Alt && e.isAltPressed() || this.__modifier__P_224_0.Alt && !e.isAltPressed()) {
          return false;
        }
        if (key == e.getKeyIdentifier()) {
          return true;
        }
        return false;
      },
      /*
      ---------------------------------------------------------------------------
        COMPATIBILITY TO COMMAND
      ---------------------------------------------------------------------------
      */

      /**
       * @lint ignoreReferenceField(__oldKeyNameToKeyIdentifierMap)
       */
      __oldKeyNameToKeyIdentifierMap__P_224_6: {
        // all other keys are converted by converting the first letter to uppercase
        esc: "Escape",
        ctrl: "Control",
        print: "PrintScreen",
        del: "Delete",
        pageup: "PageUp",
        pagedown: "PageDown",
        numlock: "NumLock",
        numpad_0: "0",
        numpad_1: "1",
        numpad_2: "2",
        numpad_3: "3",
        numpad_4: "4",
        numpad_5: "5",
        numpad_6: "6",
        numpad_7: "7",
        numpad_8: "8",
        numpad_9: "9",
        numpad_divide: "/",
        numpad_multiply: "*",
        numpad_minus: "-",
        numpad_plus: "+"
      },
      /**
       * Checks and normalizes the key identifier.
       *
       * @param keyName {String} name of the key.
       * @return {String} normalized keyIdentifier or "Unidentified" if a conversion was not possible
       */
      __normalizeKeyIdentifier__P_224_5(keyName) {
        var kbUtil = qx.event.util.Keyboard;
        var keyIdentifier = "Unidentified";
        if (kbUtil.isValidKeyIdentifier(keyName)) {
          return keyName;
        }
        if (keyName.length == 1 && keyName >= "a" && keyName <= "z") {
          return keyName.toUpperCase();
        }
        keyName = keyName.toLowerCase();
        var keyIdentifier = this.__oldKeyNameToKeyIdentifierMap__P_224_6[keyName] || qx.lang.String.firstUp(keyName);
        if (kbUtil.isValidKeyIdentifier(keyIdentifier)) {
          return keyIdentifier;
        } else {
          return "Unidentified";
        }
      },
      /*
      ---------------------------------------------------------------------------
        STRING CONVERSION
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the shortcut as string using the currently selected locale.
       *
       * @return {String} shortcut
       */
      toString() {
        var key = this.__key__P_224_1;
        var str = [];
        for (var modifier in this.__modifier__P_224_0) {
          // this.__modifier holds a map with shortcut combination keys
          // like "Control", "Alt", "Meta" and "Shift" as keys with
          // Boolean values
          if (this.__modifier__P_224_0[modifier]) {
            str.push(qx.locale.Key.getKeyName("short", modifier));
          }
        }
        if (key) {
          str.push(qx.locale.Key.getKeyName("short", key));
        }
        return str.join("+");
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */

    destruct() {
      // this will remove the event listener
      this.setEnabled(false);
      this.__modifier__P_224_0 = this.__key__P_224_1 = null;
    }
  });
  qx.bom.Shortcut.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Timer": {
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
   * Timer, which accelerates after each interval. The initial delay and the
   * interval time can be set using the properties {@link #firstInterval}
   * and {@link #interval}. The {@link #interval} events will be fired with
   * decreasing interval times while the timer is running, until the {@link #minimum}
   * is reached. The {@link #decrease} property sets the amount of milliseconds
   * which will decreased after every firing.
   *
   * This class is e.g. used in the {@link qx.ui.form.RepeatButton} and
   * {@link qx.ui.form.HoverButton} widgets.
   *
   * NOTE: Instances of this class must be disposed of after use
   *
   */
  qx.Class.define("qx.event.AcceleratingTimer", {
    extend: qx.core.Object,
    implement: [qx.core.IDisposable],
    construct() {
      qx.core.Object.constructor.call(this);
      this.__timer__P_223_0 = new qx.event.Timer(this.getInterval());
      this.__timer__P_223_0.addListener("interval", this._onInterval, this);
    },
    events: {
      /** This event if fired each time the interval time has elapsed */
      interval: "qx.event.type.Event"
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
      minimum: {
        check: "Integer",
        init: 20
      },
      /** Decrease of the timer on each interval (for the next interval) until minTimer reached. */
      decrease: {
        check: "Integer",
        init: 2
      }
    },
    members: {
      __timer__P_223_0: null,
      __currentInterval__P_223_1: null,
      /**
       * Reset and start the timer.
       */
      start() {
        this.__timer__P_223_0.setInterval(this.getFirstInterval());
        this.__timer__P_223_0.start();
      },
      /**
       * Stop the timer
       */
      stop() {
        this.__timer__P_223_0.stop();
        this.__currentInterval__P_223_1 = null;
      },
      /**
       * Interval event handler
       */
      _onInterval() {
        this.__timer__P_223_0.stop();
        if (this.__currentInterval__P_223_1 == null) {
          this.__currentInterval__P_223_1 = this.getInterval();
        }
        this.__currentInterval__P_223_1 = Math.max(this.getMinimum(), this.__currentInterval__P_223_1 - this.getDecrease());
        this.__timer__P_223_0.setInterval(this.__currentInterval__P_223_1);
        this.__timer__P_223_0.start();
        this.fireEvent("interval");
      }
    },
    destruct() {
      this._disposeObjects("__timer__P_223_0");
    }
  });
  qx.event.AcceleratingTimer.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "require": true
      },
      "qx.event.IEventHandler": {
        "require": true
      },
      "qx.event.Registration": {
        "defer": "runtime",
        "require": true
      },
      "qx.event.GlobalError": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Iframe": {},
      "qx.event.type.Data": {}
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
   * This handler provides a "load" event for iframes
   */
  qx.Class.define("qx.event.handler.Iframe", {
    extend: qx.core.Object,
    implement: qx.event.IEventHandler,
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** @type {Integer} Priority of this handler */
      PRIORITY: qx.event.Registration.PRIORITY_NORMAL,
      /** @type {Map} Supported event types */
      SUPPORTED_TYPES: {
        load: 1,
        navigate: 1
      },
      /** @type {Integer} Which target check to use */
      TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE,
      /** @type {Integer} Whether the method "canHandleEvent" must be called */
      IGNORE_CAN_HANDLE: false,
      /**
       * Internal function called by iframes created using {@link qx.bom.Iframe}.
       *
       * @signature function(target)
       * @internal
       * @param target {Element} DOM element which is the target of this event
       */
      onevent: qx.event.GlobalError.observeMethod(function (target) {
        // Fire navigate event when actual URL diverges from stored URL
        var currentUrl = qx.bom.Iframe.queryCurrentUrl(target);
        if (currentUrl !== target.$$url) {
          qx.event.Registration.fireEvent(target, "navigate", qx.event.type.Data, [currentUrl]);
          target.$$url = currentUrl;
        }

        // Always fire load event
        qx.event.Registration.fireEvent(target, "load");
      })
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        EVENT HANDLER INTERFACE
      ---------------------------------------------------------------------------
      */

      // interface implementation
      canHandleEvent(target, type) {
        return target.tagName.toLowerCase() === "iframe";
      },
      // interface implementation
      registerEvent(target, type, capture) {
        // Nothing needs to be done here
      },
      // interface implementation
      unregisterEvent(target, type, capture) {
        // Nothing needs to be done here
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      qx.event.Registration.addHandler(statics);
    }
  });
  qx.event.handler.Iframe.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.event.handler.Iframe": {
        "require": true
      },
      "qx.core.Environment": {
        "defer": "load",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.lang.Object": {},
      "qx.dom.Element": {},
      "qx.dom.Hierarchy": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.log.Logger": {},
      "qx.bom.Event": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "os.name": {
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
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Andreas Ecker (ecker)
       * Jonathan Weiß (jonathan_rass)
       * Christian Hagendorn (Chris_schmidt)
  
  ************************************************************************ */

  /**
   * Cross browser abstractions to work with iframes.
   *
   * @require(qx.event.handler.Iframe)
   */
  qx.Class.define("qx.bom.Iframe", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * @type {Map} Default attributes for creation {@link #create}.
       */
      DEFAULT_ATTRIBUTES: {
        frameBorder: 0,
        frameSpacing: 0,
        marginWidth: 0,
        marginHeight: 0,
        hspace: 0,
        vspace: 0,
        border: 0,
        allowTransparency: true
      },
      /**
       * Creates an DOM element.
       *
       * Attributes may be given directly with this call. This is critical
       * for some attributes e.g. name, type, ... in many clients.
       *
       * @param attributes {Map?null} Map of attributes to apply
       * @param win {Window?null} Window to create the element for
       * @return {Element} The created iframe node
       */
      create(attributes, win) {
        // Work on a copy to not modify given attributes map
        var attributes = attributes ? qx.lang.Object.clone(attributes) : {};
        var initValues = qx.bom.Iframe.DEFAULT_ATTRIBUTES;
        for (var key in initValues) {
          if (!(key in attributes)) {
            attributes[key] = initValues[key];
          }
        }
        var elem = qx.dom.Element.create("iframe", attributes, win);
        if (!("onload" in attributes)) {
          elem.onload = function () {
            qx.event.handler.Iframe.onevent(elem);
          };
        }
        return elem;
      },
      /**
       * Get the DOM window object of an iframe.
       *
       * @param iframe {Element} DOM element of the iframe.
       * @return {Window?null} The DOM window object of the iframe or null.
       * @signature function(iframe)
       */
      getWindow(iframe) {
        try {
          return iframe.contentWindow;
        } catch (ex) {
          return null;
        }
      },
      /**
       * Get the DOM document object of an iframe.
       *
       * @param iframe {Element} DOM element of the iframe.
       * @return {Document} The DOM document object of the iframe.
       */
      getDocument(iframe) {
        if ("contentDocument" in iframe) {
          try {
            return iframe.contentDocument;
          } catch (ex) {
            return null;
          }
        }
        try {
          var win = this.getWindow(iframe);
          return win ? win.document : null;
        } catch (ex) {
          return null;
        }
      },
      /**
       * Get the HTML body element of the iframe.
       *
       * @param iframe {Element} DOM element of the iframe.
       * @return {Element} The DOM node of the <code>body</code> element of the iframe.
       */
      getBody(iframe) {
        try {
          var doc = this.getDocument(iframe);
          return doc ? doc.getElementsByTagName("body")[0] : null;
        } catch (ex) {
          return null;
        }
      },
      /**
       * Sets iframe's source attribute to given value
       *
       * @param iframe {Element} DOM element of the iframe.
       * @param source {String} URL to be set.
       * @signature function(iframe, source)
       */
      setSource(iframe, source) {
        try {
          // the guru says ...
          // it is better to use 'replace' than 'src'-attribute, since 'replace'
          // does not interfere with the history (which is taken care of by the
          // history manager), but there has to be a loaded document
          if (this.getWindow(iframe) && qx.dom.Hierarchy.isRendered(iframe)) {
            /*
              Some gecko users might have an exception here:
              Exception... "Component returned failure code: 0x805e000a
              [nsIDOMLocation.replace]"  nsresult: "0x805e000a (<unknown>)"
            */
            try {
              // Webkit on Mac can't set the source when the iframe is still
              // loading its current page
              if (qx.core.Environment.get("engine.name") == "webkit" && qx.core.Environment.get("os.name") == "osx") {
                var contentWindow = this.getWindow(iframe);
                if (contentWindow) {
                  contentWindow.stop();
                }
              }
              this.getWindow(iframe).location.replace(source);
            } catch (ex) {
              iframe.src = source;
            }
          } else {
            iframe.src = source;
          }

          // This is a programmer provided source. Remember URL for this source
          // for later comparison with current URL. The current URL can diverge
          // if the end-user navigates in the Iframe.
          this.__rememberUrl__P_225_0(iframe);
        } catch (ex) {
          qx.log.Logger.warn("Iframe source could not be set!");
        }
      },
      /**
       * Returns the current (served) URL inside the iframe
       *
       * @param iframe {Element} DOM element of the iframe.
       * @return {String} Returns the location href or null (if a query is not possible/allowed)
       */
      queryCurrentUrl(iframe) {
        var doc = this.getDocument(iframe);
        try {
          if (doc && doc.location) {
            return doc.location.href;
          }
        } catch (ex) {}
        return "";
      },
      /**
       * Remember actual URL of iframe.
       *
       * @param iframe {Element} DOM element of the iframe.
       */
      __rememberUrl__P_225_0(iframe) {
        // URL can only be detected after load. Retrieve and store URL once.
        var callback = function () {
          qx.bom.Event.removeNativeListener(iframe, "load", callback);
          iframe.$$url = qx.bom.Iframe.queryCurrentUrl(iframe);
        };
        qx.bom.Event.addNativeListener(iframe, "load", callback);
      }
    }
  });
  qx.bom.Iframe.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "construct": true,
        "require": true
      },
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.event.Emitter": {
        "require": true
      },
      "qx.bom.client.CssAnimation": {
        "construct": true,
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "css.animation": {
          "construct": true,
          "className": "qx.bom.client.CssAnimation"
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
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * This is a simple handle, which will be returned when an animation is
   * started using the {@link qx.bom.element.Animation#animate} method. It
   * basically controls the animation.
   *
   * @ignore(qx.bom.element.AnimationJs)
   */
  qx.Bootstrap.define("qx.bom.element.AnimationHandle", {
    extend: qx.event.Emitter,
    construct() {
      var css = qx.core.Environment.get("css.animation");
      this.__playState__P_232_0 = css && css["play-state"];
      this.__playing__P_232_1 = true;
      this.addListenerOnce("end", this.__setEnded__P_232_2, this);
    },
    events: {
      /** Fired when the animation started via {@link qx.bom.element.Animation}. */
      start: "Element",
      /**
       * Fired when the animation started via {@link qx.bom.element.Animation} has
       * ended.
       */
      end: "Element",
      /** Fired on every iteration of the animation. */
      iteration: "Element"
    },
    members: {
      __playState__P_232_0: null,
      __playing__P_232_1: false,
      __ended__P_232_3: false,
      /**
       * Accessor of the playing state.
       * @return {Boolean} <code>true</code>, if the animations is playing.
       */
      isPlaying() {
        return this.__playing__P_232_1;
      },
      /**
       * Accessor of the ended state.
       * @return {Boolean} <code>true</code>, if the animations has ended.
       */
      isEnded() {
        return this.__ended__P_232_3;
      },
      /**
       * Accessor of the paused state.
       * @return {Boolean} <code>true</code>, if the animations is paused.
       */
      isPaused() {
        return this.el.style[this.__playState__P_232_0] == "paused";
      },
      /**
       * Pauses the animation, if running. If not running, it will be ignored.
       */
      pause() {
        if (this.el) {
          this.el.style[this.__playState__P_232_0] = "paused";
          this.el.$$animation.__playing__P_232_1 = false;
          // in case the animation is based on JS
          if (this.animationId && qx.bom.element.AnimationJs) {
            qx.bom.element.AnimationJs.pause(this);
          }
        }
      },
      /**
       * Resumes an animation. This does not start the animation once it has ended.
       * In this case you need to start a new Animation.
       */
      play() {
        if (this.el) {
          this.el.style[this.__playState__P_232_0] = "running";
          this.el.$$animation.__playing__P_232_1 = true;
          // in case the animation is based on JS
          if (this.i != undefined && qx.bom.element.AnimationJs) {
            qx.bom.element.AnimationJs.play(this);
          }
        }
      },
      /**
       * Stops the animation if running.
       */
      stop() {
        if (this.el && qx.core.Environment.get("css.animation") && !this.jsAnimation) {
          this.el.style[this.__playState__P_232_0] = "";
          this.el.style[qx.core.Environment.get("css.animation").name] = "";
          this.el.$$animation.__playing__P_232_1 = false;
          this.el.$$animation.__ended__P_232_3 = true;
        }
        // in case the animation is based on JS
        else if (this.jsAnimation) {
          this.stopped = true;
          qx.bom.element.AnimationJs.stop(this);
        }
      },
      /**
       * Set the animation state to ended
       */
      __setEnded__P_232_2() {
        this.__playing__P_232_1 = false;
        this.__ended__P_232_3 = true;
      }
    }
  });
  qx.bom.element.AnimationHandle.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.bom.Style": {},
      "qx.core.Environment": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": ["css.transform", "css.transform.3d"],
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
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * Responsible for checking all relevant CSS transform properties.
   *
   * Specs:
   * http://www.w3.org/TR/css3-2d-transforms/
   * http://www.w3.org/TR/css3-3d-transforms/
   *
   * @internal
   */
  qx.Bootstrap.define("qx.bom.client.CssTransform", {
    statics: {
      /**
       * Main check method which returns an object if CSS animations are
       * supported. This object contains all necessary keys to work with CSS
       * animations.
       * <ul>
       *  <li><code>name</code> The name of the css transform style</li>
       *  <li><code>style</code> The name of the css transform-style style</li>
       *  <li><code>origin</code> The name of the transform-origin style</li>
       *  <li><code>3d</code> Whether 3d transforms are supported</li>
       *  <li><code>perspective</code> The name of the perspective style</li>
       *  <li><code>perspective-origin</code> The name of the perspective-origin style</li>
       *  <li><code>backface-visibility</code> The name of the backface-visibility style</li>
       * </ul>
       *
       * @internal
       * @return {Object|null} The described object or null, if animations are
       *   not supported.
       */
      getSupport() {
        var name = qx.bom.client.CssTransform.getName();
        if (name != null) {
          return {
            name: name,
            style: qx.bom.client.CssTransform.getStyle(),
            origin: qx.bom.client.CssTransform.getOrigin(),
            "3d": qx.bom.client.CssTransform.get3D(),
            perspective: qx.bom.client.CssTransform.getPerspective(),
            "perspective-origin": qx.bom.client.CssTransform.getPerspectiveOrigin(),
            "backface-visibility": qx.bom.client.CssTransform.getBackFaceVisibility()
          };
        }
        return null;
      },
      /**
       * Checks for the style name used to set the transform origin.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getStyle() {
        return qx.bom.Style.getPropertyName("transformStyle");
      },
      /**
       * Checks for the style name used to set the transform origin.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getPerspective() {
        return qx.bom.Style.getPropertyName("perspective");
      },
      /**
       * Checks for the style name used to set the perspective origin.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getPerspectiveOrigin() {
        return qx.bom.Style.getPropertyName("perspectiveOrigin");
      },
      /**
       * Checks for the style name used to set the backface visibility.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getBackFaceVisibility() {
        return qx.bom.Style.getPropertyName("backfaceVisibility");
      },
      /**
       * Checks for the style name used to set the transform origin.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getOrigin() {
        return qx.bom.Style.getPropertyName("transformOrigin");
      },
      /**
       * Checks for the style name used for transforms.
       * @internal
       * @return {String|null} The name of the style or null, if the style is
       *   not supported.
       */
      getName() {
        return qx.bom.Style.getPropertyName("transform");
      },
      /**
       * Checks if 3D transforms are supported.
       * @internal
       * @return {Boolean} <code>true</code>, if 3D transformations are supported
       */
      get3D() {
        return qx.bom.client.CssTransform.getPerspective() != null;
      }
    },
    defer(statics) {
      qx.core.Environment.add("css.transform", statics.getSupport);
      qx.core.Environment.add("css.transform.3d", statics.get3D);
    }
  });
  qx.bom.client.CssTransform.$$dbClassInfo = $$dbClassInfo;
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
      "qx.bom.client.CssTransform": {
        "require": true
      },
      "qx.bom.Style": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "css.transform": {
          "load": true,
          "className": "qx.bom.client.CssTransform"
        },
        "css.transform.3d": {
          "className": "qx.bom.client.CssTransform"
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
  
     Authors:
       * Martin Wittemann (wittemann)
  
  ************************************************************************ */

  /**
   * This class is responsible for applying CSS3 transforms to plain DOM elements.
   * The implementation is mostly a cross browser wrapper for applying the
   * transforms.
   * The API is keep to the spec as close as possible.
   *
   * http://www.w3.org/TR/css3-3d-transforms/
   */
  qx.Bootstrap.define("qx.bom.element.Transform", {
    statics: {
      /** Internal storage of the CSS names */
      __cssKeys__P_233_0: qx.core.Environment.get("css.transform"),
      /**
       * Method to apply multiple transforms at once to the given element. It
       * takes a map containing the transforms you want to apply plus the values
       * e.g.<code>{scale: 2, rotate: "5deg"}</code>.
       * The values can be either singular, which means a single value will
       * be added to the CSS. If you give an array, the values will be split up
       * and each array entry will be used for the X, Y or Z dimension in that
       * order e.g. <code>{scale: [2, 0.5]}</code> will result in a element
       * double the size in X direction and half the size in Y direction.
       * The values can be either singular, which means a single value will
       * be added to the CSS. If you give an array, the values will be join to
       * a string.
       * 3d suffixed properties will be taken for translate and scale if they are
       * available and an array with three values is given.
       * Make sure your browser supports all transformations you apply.
       *
       * @param el {Element} The element to apply the transformation.
       * @param transforms {Map} The map containing the transforms and value.
       */
      transform(el, transforms) {
        var transformCss = this.getTransformValue(transforms);
        if (this.__cssKeys__P_233_0 != null) {
          var style = this.__cssKeys__P_233_0["name"];
          el.style[style] = transformCss;
        }
      },
      /**
       * Translates the given element by the given value. For further details, take
       * a look at the {@link #transform} method.
       * @param el {Element} The element to apply the transformation.
       * @param value {String|Array} The value to translate e.g. <code>"10px"</code>.
       */
      translate(el, value) {
        this.transform(el, {
          translate: value
        });
      },
      /**
       * Scales the given element by the given value. For further details, take
       * a look at the {@link #transform} method.
       * @param el {Element} The element to apply the transformation.
       * @param value {Number|Array} The value to scale.
       */
      scale(el, value) {
        this.transform(el, {
          scale: value
        });
      },
      /**
       * Rotates the given element by the given value. For further details, take
       * a look at the {@link #transform} method.
       * @param el {Element} The element to apply the transformation.
       * @param value {String|Array} The value to rotate e.g. <code>"90deg"</code>.
       */
      rotate(el, value) {
        this.transform(el, {
          rotate: value
        });
      },
      /**
       * Skews the given element by the given value. For further details, take
       * a look at the {@link #transform} method.
       * @param el {Element} The element to apply the transformation.
       * @param value {String|Array} The value to skew e.g. <code>"90deg"</code>.
       */
      skew(el, value) {
        this.transform(el, {
          skew: value
        });
      },
      /**
       * Converts the given map to a string which could be added to a css
       * stylesheet.
       * @param transforms {Map} The transforms map. For a detailed description,
       * take a look at the {@link #transform} method.
       * @return {String} The CSS value.
       */
      getCss(transforms) {
        var transformCss = this.getTransformValue(transforms);
        if (this.__cssKeys__P_233_0 != null) {
          var style = this.__cssKeys__P_233_0["name"];
          return qx.bom.Style.getCssName(style) + ":" + transformCss + ";";
        }
        return "";
      },
      /**
       * Sets the transform-origin property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#transform-origin-property
       * @param el {Element} The dom element to set the property.
       * @param value {String} CSS position values like <code>50% 50%</code> or
       *   <code>left top</code>.
       */
      setOrigin(el, value) {
        if (this.__cssKeys__P_233_0 != null) {
          el.style[this.__cssKeys__P_233_0["origin"]] = value;
        }
      },
      /**
       * Returns the transform-origin property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#transform-origin-property
       * @param el {Element} The dom element to read the property.
       * @return {String} The set property, e.g. <code>50% 50%</code>
       */
      getOrigin(el) {
        if (this.__cssKeys__P_233_0 != null) {
          return el.style[this.__cssKeys__P_233_0["origin"]];
        }
        return "";
      },
      /**
       * Sets the transform-style property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#transform-style-property
       * @param el {Element} The dom element to set the property.
       * @param value {String} Either <code>flat</code> or <code>preserve-3d</code>.
       */
      setStyle(el, value) {
        if (this.__cssKeys__P_233_0 != null) {
          el.style[this.__cssKeys__P_233_0["style"]] = value;
        }
      },
      /**
       * Returns the transform-style property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#transform-style-property
       * @param el {Element} The dom element to read the property.
       * @return {String} The set property, either <code>flat</code> or
       *   <code>preserve-3d</code>.
       */
      getStyle(el) {
        if (this.__cssKeys__P_233_0 != null) {
          return el.style[this.__cssKeys__P_233_0["style"]];
        }
        return "";
      },
      /**
       * Sets the perspective property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#perspective-property
       * @param el {Element} The dom element to set the property.
       * @param value {Number} The perspective layer. Numbers between 100
       *   and 5000 give the best results.
       */
      setPerspective(el, value) {
        if (this.__cssKeys__P_233_0 != null) {
          el.style[this.__cssKeys__P_233_0["perspective"]] = value + "px";
        }
      },
      /**
       * Returns the perspective property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#perspective-property
       * @param el {Element} The dom element to read the property.
       * @return {String} The set property, e.g. <code>500</code>
       */
      getPerspective(el) {
        if (this.__cssKeys__P_233_0 != null) {
          return el.style[this.__cssKeys__P_233_0["perspective"]];
        }
        return "";
      },
      /**
       * Sets the perspective-origin property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#perspective-origin-property
       * @param el {Element} The dom element to set the property.
       * @param value {String} CSS position values like <code>50% 50%</code> or
       *   <code>left top</code>.
       */
      setPerspectiveOrigin(el, value) {
        if (this.__cssKeys__P_233_0 != null) {
          el.style[this.__cssKeys__P_233_0["perspective-origin"]] = value;
        }
      },
      /**
       * Returns the perspective-origin property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#perspective-origin-property
       * @param el {Element} The dom element to read the property.
       * @return {String} The set property, e.g. <code>50% 50%</code>
       */
      getPerspectiveOrigin(el) {
        if (this.__cssKeys__P_233_0 != null) {
          var value = el.style[this.__cssKeys__P_233_0["perspective-origin"]];
          if (value != "") {
            return value;
          } else {
            var valueX = el.style[this.__cssKeys__P_233_0["perspective-origin"] + "X"];
            var valueY = el.style[this.__cssKeys__P_233_0["perspective-origin"] + "Y"];
            if (valueX != "") {
              return valueX + " " + valueY;
            }
          }
        }
        return "";
      },
      /**
       * Sets the backface-visibility property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#backface-visibility-property
       * @param el {Element} The dom element to set the property.
       * @param value {Boolean} <code>true</code> if the backface should be visible.
       */
      setBackfaceVisibility(el, value) {
        if (this.__cssKeys__P_233_0 != null) {
          el.style[this.__cssKeys__P_233_0["backface-visibility"]] = value ? "visible" : "hidden";
        }
      },
      /**
       * Returns the backface-visibility property of the given element.
       *
       * Spec: http://www.w3.org/TR/css3-3d-transforms/#backface-visibility-property
       * @param el {Element} The dom element to read the property.
       * @return {Boolean} <code>true</code>, if the backface is visible.
       */
      getBackfaceVisibility(el) {
        if (this.__cssKeys__P_233_0 != null) {
          return el.style[this.__cssKeys__P_233_0["backface-visibility"]] == "visible";
        }
        return true;
      },
      /**
       * Converts the given transforms map to a valid CSS string.
       *
       * @param transforms {Map} A map containing the transforms.
       * @return {String} The CSS transforms.
       */
      getTransformValue(transforms) {
        var value = "";
        var properties3d = ["translate", "scale"];
        for (var property in transforms) {
          var params = transforms[property];

          // if an array is given
          if (qx.Bootstrap.isArray(params)) {
            // use 3d properties for translate and scale if all 3 parameter are given
            if (params.length === 3 && properties3d.indexOf(property) > -1 && qx.core.Environment.get("css.transform.3d")) {
              value += this._compute3dProperty(property, params);
            }

            // use axis related properties
            else {
              value += this._computeAxisProperties(property, params);
            }

            // case for single values given
          } else {
            // single value case
            value += property + "(" + params + ") ";
          }
        }
        return value.trim();
      },
      /**
       * Helper function to create 3d property.
       *
       * @param property {String} Property of transform, e.g. translate
       * @param params {Array} Array with three values, each one stands for an axis.
       *
       * @return {String} Computed property and its value
       */
      _compute3dProperty(property, params) {
        var cssValue = "";
        property += "3d";
        for (var i = 0; i < params.length; i++) {
          if (params[i] == null) {
            params[i] = 0;
          }
        }
        cssValue += property + "(" + params.join(", ") + ") ";
        return cssValue;
      },
      /**
       * Helper function to create axis related properties.
       *
       * @param property {String} Property of transform, e.g. rotate
       * @param params {Array} Array with values, each one stands for an axis.
       *
       * @return {String} Computed property and its value
       */
      _computeAxisProperties(property, params) {
        var value = "";
        var dimensions = ["X", "Y", "Z"];
        for (var i = 0; i < params.length; i++) {
          if (params[i] == null || i == 2 && !qx.core.Environment.get("css.transform.3d")) {
            continue;
          }
          value += property + dimensions[i] + "(";
          value += params[i];
          value += ") ";
        }
        return value;
      }
    }
  });
  qx.bom.element.Transform.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "construct": true,
        "require": true
      },
      "qx.core.IDisposable": {
        "require": true
      },
      "qx.event.Emitter": {
        "construct": true
      },
      "qx.util.Uri": {},
      "qx.bom.client.Engine": {},
      "qx.bom.client.Browser": {}
    },
    "environment": {
      "provided": ["qx.debug.io"],
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
       * Tristan Koch (tristankoch)
  
  ************************************************************************ */

  /**
   * Script loader with interface similar to
   * <a href="http://www.w3.org/TR/XMLHttpRequest/">XmlHttpRequest</a>.
   *
   * The script loader can be used to load scripts from arbitrary sources.
   * <span class="desktop">
   * For JSONP requests, consider the {@link qx.bom.request.Jsonp} transport
   * that derives from the script loader.
   * </span>
   *
   * <div class="desktop">
   * Example:
   *
   * <pre class="javascript">
   *  var req = new qx.bom.request.Script();
   *  req.onload = function() {
   *    // Script is loaded and parsed and
   *    // globals set are available
   *  }
   *
   *  req.open("GET", url);
   *  req.send();
   * </pre>
   * </div>
   *
   * @ignore(qx.core, qx.core.Environment.*)
   * @require(qx.bom.request.Script#_success)
   * @require(qx.bom.request.Script#abort)
   * @require(qx.bom.request.Script#dispose)
   * @require(qx.bom.request.Script#isDisposed)
   * @require(qx.bom.request.Script#getAllResponseHeaders)
   * @require(qx.bom.request.Script#getResponseHeader)
   * @require(qx.bom.request.Script#setDetermineSuccess)
   * @require(qx.bom.request.Script#setRequestHeader)
   *
   * @group (IO)
   */

  qx.Bootstrap.define("qx.bom.request.Script", {
    implement: [qx.core.IDisposable],
    construct() {
      this.__initXhrProperties__P_190_0();
      this.__onNativeLoadBound__P_190_1 = qx.Bootstrap.bind(this._onNativeLoad, this);
      this.__onNativeErrorBound__P_190_2 = qx.Bootstrap.bind(this._onNativeError, this);
      this.__onTimeoutBound__P_190_3 = qx.Bootstrap.bind(this._onTimeout, this);
      this.__headElement__P_190_4 = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
      this._emitter = new qx.event.Emitter();

      // BUGFIX: Browsers not supporting error handler
      // Set default timeout to capture network errors
      //
      // Note: The script is parsed and executed, before a "load" is fired.
      this.timeout = this.__supportsErrorHandler__P_190_5() ? 0 : 15000;
    },
    events: {
      /** Fired at ready state changes. */
      readystatechange: "qx.bom.request.Script",
      /** Fired on error. */
      error: "qx.bom.request.Script",
      /** Fired at loadend. */
      loadend: "qx.bom.request.Script",
      /** Fired on timeouts. */
      timeout: "qx.bom.request.Script",
      /** Fired when the request is aborted. */
      abort: "qx.bom.request.Script",
      /** Fired on successful retrieval. */
      load: "qx.bom.request.Script"
    },
    members: {
      /**
       * @type {Number} Ready state.
       *
       * States can be:
       * UNSENT:           0,
       * OPENED:           1,
       * LOADING:          2,
       * LOADING:          3,
       * DONE:             4
       *
       * Contrary to {@link qx.bom.request.Xhr#readyState}, the script transport
       * does not receive response headers. For compatibility, another LOADING
       * state is implemented that replaces the HEADERS_RECEIVED state.
       */
      readyState: null,
      /**
       * @type {Number} The status code.
       *
       * Note: The script transport cannot determine the HTTP status code.
       */
      status: null,
      /**
       * @type {String} The status text.
       *
       * The script transport does not receive response headers. For compatibility,
       * the statusText property is set to the status casted to string.
       */
      statusText: null,
      /**
       * @type {Number} Timeout limit in milliseconds.
       *
       * 0 (default) means no timeout.
       */
      timeout: null,
      /**
       * @type {Function} Function that is executed once the script was loaded.
       */
      __determineSuccess__P_190_6: null,
      /**
       * Add an event listener for the given event name.
       *
       * @param name {String} The name of the event to listen to.
       * @param listener {Function} The function to execute when the event is fired
       * @param ctx {var?} The context of the listener.
       * @return {qx.bom.request.Script} Self for chaining.
       */
      on(name, listener, ctx) {
        this._emitter.on(name, listener, ctx);
        return this;
      },
      /**
       * Initializes (prepares) request.
       *
       * @param method {String}
       *   The HTTP method to use.
       *   This parameter exists for compatibility reasons. The script transport
       *   does not support methods other than GET.
       * @param url {String}
       *   The URL to which to send the request.
       */
      open(method, url) {
        if (this.__disposed__P_190_7) {
          return;
        }

        // Reset XHR properties that may have been set by previous request
        this.__initXhrProperties__P_190_0();
        this.__abort__P_190_8 = null;
        this.__url__P_190_9 = url;
        if (this.__environmentGet__P_190_10("qx.debug.io")) {
          qx.Bootstrap.debug(qx.bom.request.Script, "Open native request with url: " + url);
        }
        this._readyStateChange(1);
      },
      /**
       * Appends a query parameter to URL.
       *
       * This method exists for compatibility reasons. The script transport
       * does not support request headers. However, many services parse query
       * parameters like request headers.
       *
       * Note: The request must be initialized before using this method.
       *
       * @param key {String}
       *  The name of the header whose value is to be set.
       * @param value {String}
       *  The value to set as the body of the header.
       * @return {qx.bom.request.Script} Self for chaining.
       */
      setRequestHeader(key, value) {
        if (this.__disposed__P_190_7) {
          return null;
        }
        var param = {};
        if (this.readyState !== 1) {
          throw new Error("Invalid state");
        }
        param[key] = value;
        this.__url__P_190_9 = qx.util.Uri.appendParamsToUrl(this.__url__P_190_9, param);
        return this;
      },
      /**
       * Sends request.
       * @return {qx.bom.request.Script} Self for chaining.
       */
      send() {
        if (this.__disposed__P_190_7) {
          return null;
        }
        var script = this.__createScriptElement__P_190_11(),
          head = this.__headElement__P_190_4,
          that = this;
        if (this.timeout > 0) {
          this.__timeoutId__P_190_12 = window.setTimeout(this.__onTimeoutBound__P_190_3, this.timeout);
        }
        if (this.__environmentGet__P_190_10("qx.debug.io")) {
          qx.Bootstrap.debug(qx.bom.request.Script, "Send native request");
        }

        // Attach script to DOM
        head.insertBefore(script, head.firstChild);

        // The resource is loaded once the script is in DOM.
        // Assume HEADERS_RECEIVED and LOADING and dispatch async.
        window.setTimeout(function () {
          that._readyStateChange(2);
          that._readyStateChange(3);
        });
        return this;
      },
      /**
       * Aborts request.
       * @return {qx.bom.request.Script} Self for chaining.
       */
      abort() {
        if (this.__disposed__P_190_7) {
          return null;
        }
        this.__abort__P_190_8 = true;
        this.__disposeScriptElement__P_190_13();
        this._emit("abort");
        return this;
      },
      /**
       * Helper to emit events and call the callback methods.
       * @param event {String} The name of the event.
       */
      _emit(event) {
        this["on" + event]();
        this._emitter.emit(event, this);
      },
      /**
       * Event handler for an event that fires at every state change.
       *
       * Replace with custom method to get informed about the communication progress.
       */
      onreadystatechange() {},
      /**
       * Event handler for XHR event "load" that is fired on successful retrieval.
       *
       * Note: This handler is called even when an invalid script is returned.
       *
       * Warning: Internet Explorer < 9 receives a false "load" for invalid URLs.
       * This "load" is fired about 2 seconds after sending the request. To
       * distinguish from a real "load", consider defining a custom check
       * function using {@link #setDetermineSuccess} and query the status
       * property. However, the script loaded needs to have a known impact on
       * the global namespace. If this does not work for you, you may be able
       * to set a timeout lower than 2 seconds, depending on script size,
       * complexity and execution time.
       *
       * Replace with custom method to listen to the "load" event.
       */
      onload() {},
      /**
       * Event handler for XHR event "loadend" that is fired on retrieval.
       *
       * Note: This handler is called even when a network error (or similar)
       * occurred.
       *
       * Replace with custom method to listen to the "loadend" event.
       */
      onloadend() {},
      /**
       * Event handler for XHR event "error" that is fired on a network error.
       *
       * Note: Some browsers do not support the "error" event.
       *
       * Replace with custom method to listen to the "error" event.
       */
      onerror() {},
      /**
       * Event handler for XHR event "abort" that is fired when request
       * is aborted.
       *
       * Replace with custom method to listen to the "abort" event.
       */
      onabort() {},
      /**
       * Event handler for XHR event "timeout" that is fired when timeout
       * interval has passed.
       *
       * Replace with custom method to listen to the "timeout" event.
       */
      ontimeout() {},
      /**
       * Get a single response header from response.
       *
       * Note: This method exists for compatibility reasons. The script
       * transport does not receive response headers.
       *
       * @param key {String}
       *  Key of the header to get the value from.
       * @return {String|null} Warning message or <code>null</code> if the request
       * is disposed
       */
      getResponseHeader(key) {
        if (this.__disposed__P_190_7) {
          return null;
        }
        if (this.__environmentGet__P_190_10("qx.debug")) {
          qx.Bootstrap.debug("Response header cannot be determined for requests made with script transport.");
        }
        return "unknown";
      },
      /**
       * Get all response headers from response.
       *
       * Note: This method exists for compatibility reasons. The script
       * transport does not receive response headers.
       * @return {String|null} Warning message or <code>null</code> if the request
       * is disposed
       */
      getAllResponseHeaders() {
        if (this.__disposed__P_190_7) {
          return null;
        }
        if (this.__environmentGet__P_190_10("qx.debug")) {
          qx.Bootstrap.debug("Response headers cannot be determined forrequests made with script transport.");
        }
        return "Unknown response headers";
      },
      /**
       * Determine if loaded script has expected impact on global namespace.
       *
       * The function is called once the script was loaded and must return a
       * boolean indicating if the response is to be considered successful.
       *
       * @param check {Function} Function executed once the script was loaded.
       *
       */
      setDetermineSuccess(check) {
        this.__determineSuccess__P_190_6 = check;
      },
      /**
       * Dispose object.
       */
      dispose() {
        var script = this.__scriptElement__P_190_14;
        if (!this.__disposed__P_190_7) {
          // Prevent memory leaks
          if (script) {
            script.onload = script.onreadystatechange = null;
            this.__disposeScriptElement__P_190_13();
          }
          if (this.__timeoutId__P_190_12) {
            window.clearTimeout(this.__timeoutId__P_190_12);
          }
          this.__disposed__P_190_7 = true;
        }
      },
      /**
       * Check if the request has already beed disposed.
       * @return {Boolean} <code>true</code>, if the request has been disposed.
       */
      isDisposed() {
        return !!this.__disposed__P_190_7;
      },
      /*
      ---------------------------------------------------------------------------
        PROTECTED
      ---------------------------------------------------------------------------
      */

      /**
       * Get URL of request.
       *
       * @return {String} URL of request.
       */
      _getUrl() {
        return this.__url__P_190_9;
      },
      /**
       * Get script element used for request.
       *
       * @return {Element} Script element.
       */
      _getScriptElement() {
        return this.__scriptElement__P_190_14;
      },
      /**
       * Handle timeout.
       */
      _onTimeout() {
        this.__failure__P_190_15();
        if (!this.__supportsErrorHandler__P_190_5()) {
          this._emit("error");
        }
        this._emit("timeout");
        if (!this.__supportsErrorHandler__P_190_5()) {
          this._emit("loadend");
        }
      },
      /**
       * Handle native load.
       */
      _onNativeLoad() {
        var script = this.__scriptElement__P_190_14,
          determineSuccess = this.__determineSuccess__P_190_6,
          that = this;

        // Aborted request must not fire load
        if (this.__abort__P_190_8) {
          return;
        }

        // BUGFIX: IE < 9
        // When handling "readystatechange" event, skip if readyState
        // does not signal loaded script
        if (this.__environmentGet__P_190_10("engine.name") === "mshtml" && this.__environmentGet__P_190_10("browser.documentmode") < 9) {
          if (!/loaded|complete/.test(script.readyState)) {
            return;
          } else {
            if (this.__environmentGet__P_190_10("qx.debug.io")) {
              qx.Bootstrap.debug(qx.bom.request.Script, "Received native readyState: loaded");
            }
          }
        }
        if (this.__environmentGet__P_190_10("qx.debug.io")) {
          qx.Bootstrap.debug(qx.bom.request.Script, "Received native load");
        }

        // Determine status by calling user-provided check function
        if (determineSuccess) {
          // Status set before has higher precedence
          if (!this.status) {
            this.status = determineSuccess() ? 200 : 500;
          }
        }
        if (this.status === 500) {
          if (this.__environmentGet__P_190_10("qx.debug.io")) {
            qx.Bootstrap.debug(qx.bom.request.Script, "Detected error");
          }
        }
        if (this.__timeoutId__P_190_12) {
          window.clearTimeout(this.__timeoutId__P_190_12);
        }
        window.setTimeout(function () {
          that._success();
          that._readyStateChange(4);
          that._emit("load");
          that._emit("loadend");
        });
      },
      /**
       * Handle native error.
       */
      _onNativeError() {
        this.__failure__P_190_15();
        this._emit("error");
        this._emit("loadend");
      },
      /*
      ---------------------------------------------------------------------------
        PRIVATE
      ---------------------------------------------------------------------------
      */

      /**
       * @type {Element} Script element
       */
      __scriptElement__P_190_14: null,
      /**
       * @type {Element} Head element
       */
      __headElement__P_190_4: null,
      /**
       * @type {String} URL
       */
      __url__P_190_9: "",
      /**
       * @type {Function} Bound _onNativeLoad handler.
       */
      __onNativeLoadBound__P_190_1: null,
      /**
       * @type {Function} Bound _onNativeError handler.
       */
      __onNativeErrorBound__P_190_2: null,
      /**
       * @type {Function} Bound _onTimeout handler.
       */
      __onTimeoutBound__P_190_3: null,
      /**
       * @type {Number} Timeout timer iD.
       */
      __timeoutId__P_190_12: null,
      /**
       * @type {Boolean} Whether request was aborted.
       */
      __abort__P_190_8: null,
      /**
       * @type {Boolean} Whether request was disposed.
       */
      __disposed__P_190_7: null,
      /*
      ---------------------------------------------------------------------------
        HELPER
      ---------------------------------------------------------------------------
      */

      /**
       * Initialize properties.
       */
      __initXhrProperties__P_190_0() {
        this.readyState = 0;
        this.status = 0;
        this.statusText = "";
      },
      /**
       * Change readyState.
       *
       * @param readyState {Number} The desired readyState
       */
      _readyStateChange(readyState) {
        this.readyState = readyState;
        this._emit("readystatechange");
      },
      /**
       * Handle success.
       */
      _success() {
        this.__disposeScriptElement__P_190_13();
        this.readyState = 4;

        // By default, load is considered successful
        if (!this.status) {
          this.status = 200;
        }
        this.statusText = "" + this.status;
      },
      /**
       * Handle failure.
       */
      __failure__P_190_15() {
        this.__disposeScriptElement__P_190_13();
        this.readyState = 4;
        this.status = 0;
        this.statusText = null;
      },
      /**
       * Looks up whether browser supports error handler.
       *
       * @return {Boolean} Whether browser supports error handler.
       */
      __supportsErrorHandler__P_190_5() {
        var isLegacyIe = this.__environmentGet__P_190_10("engine.name") === "mshtml" && this.__environmentGet__P_190_10("browser.documentmode") < 9;
        var isOpera = this.__environmentGet__P_190_10("engine.name") === "opera";
        return !(isLegacyIe || isOpera);
      },
      /**
       * Create and configure script element.
       *
       * @return {Element} Configured script element.
       */
      __createScriptElement__P_190_11() {
        var script = this.__scriptElement__P_190_14 = document.createElement("script");
        script.src = this.__url__P_190_9;
        script.onerror = this.__onNativeErrorBound__P_190_2;
        script.onload = this.__onNativeLoadBound__P_190_1;

        // BUGFIX: IE < 9
        // Legacy IEs do not fire the "load" event for script elements.
        // Instead, they support the "readystatechange" event
        if (this.__environmentGet__P_190_10("engine.name") === "mshtml" && this.__environmentGet__P_190_10("browser.documentmode") < 9) {
          script.onreadystatechange = this.__onNativeLoadBound__P_190_1;
        }
        return script;
      },
      /**
       * Remove script element from DOM.
       */
      __disposeScriptElement__P_190_13() {
        var script = this.__scriptElement__P_190_14;
        if (script && script.parentNode) {
          this.__headElement__P_190_4.removeChild(script);
        }
      },
      /**
       * Proxy Environment.get to guard against env not being present yet.
       *
       * @param key {String} Environment key.
       * @return {var} Value of the queried environment key
       * @lint environmentNonLiteralKey(key)
       */
      __environmentGet__P_190_10(key) {
        if (qx && qx.core && qx.core.Environment) {
          return qx.core.Environment.get(key);
        } else {
          if (key === "engine.name") {
            return qx.bom.client.Engine.getName();
          }
          if (key === "browser.documentmode") {
            return qx.bom.client.Browser.getDocumentMode();
          }
          if (key == "qx.debug.io") {
            return false;
          }
          throw new Error("Unknown environment key at this phase");
        }
      }
    },
    defer() {
      if (qx && qx.core && qx.core.Environment) {
        qx.core.Environment.add("qx.debug.io", false);
      }
    }
  });
  qx.bom.request.Script.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.LayoutItem": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.queue.Dispose": {}
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
   * A Spacer is a "virtual" widget, which can be placed into any layout and takes
   * the space a normal widget of the same size would take.
   *
   * Spacers are invisible and very light weight because they don't require any
   * DOM modifications.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   var container = new qx.ui.container.Composite(new qx.ui.layout.HBox());
   *   container.add(new qx.ui.core.Widget());
   *   container.add(new qx.ui.core.Spacer(50));
   *   container.add(new qx.ui.core.Widget());
   * </pre>
   *
   * This example places two widgets and a spacer into a container with a
   * horizontal box layout. In this scenario the spacer creates an empty area of
   * 50 pixel width between the two widgets.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/spacer.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.core.Spacer", {
    extend: qx.ui.core.LayoutItem,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param width {Integer?null} the initial width
     * @param height {Integer?null} the initial height
     */
    construct(width, height) {
      qx.ui.core.LayoutItem.constructor.call(this);

      // Initialize dimensions
      this.setWidth(width != null ? width : 0);
      this.setHeight(height != null ? height : 0);
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Helper method called from the visibility queue to detect outstanding changes
       * to the appearance.
       *
       * @internal
       */
      checkAppearanceNeeds() {
        // placeholder to improve compatibility with Widget.
      },
      /**
       * Recursively adds all children to the given queue
       *
       * @param queue {Map} The queue to add widgets to
       */
      addChildrenToQueue(queue) {
        // placeholder to improve compatibility with Widget.
      },
      /**
       * Removes this widget from its parent and dispose it.
       *
       * Please note that the widget is not disposed synchronously. The
       * real dispose happens after the next queue flush.
       *
       */
      destroy() {
        if (this.$$disposed) {
          return;
        }
        var parent = this.$$parent;
        if (parent) {
          parent._remove(this);
        }
        qx.ui.core.queue.Dispose.add(this);
      }
    }
  });
  qx.ui.core.Spacer.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.Widget": {
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
       * Andreas Ecker (ecker)
  
  ************************************************************************ */

  /**
   * A widget used for decoration proposes to structure a toolbar. Each
   * Separator renders a line between the buttons around.
   */
  qx.Class.define("qx.ui.toolbar.Separator", {
    extend: qx.ui.core.Widget,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "toolbar-separator"
      },
      // overridden
      anonymous: {
        refine: true,
        init: true
      },
      // overridden
      width: {
        refine: true,
        init: 0
      },
      // overridden
      height: {
        refine: true,
        init: 0
      }
    }
  });
  qx.ui.toolbar.Separator.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.core.MRemoteChildrenHandling": {
        "require": true
      },
      "qx.ui.layout.HBox": {
        "construct": true
      },
      "qx.ui.basic.Image": {},
      "qx.ui.toolbar.PartContainer": {},
      "qx.ui.toolbar.Separator": {},
      "qx.ui.menubar.Button": {}
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
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * A part is a container for multiple toolbar buttons. Each part comes
   * with a handle which may be used in later versions to drag the part
   * around and move it to another position. Currently mainly used
   * for structuring large toolbars beyond the capabilities of the
   * {@link Separator}.
   *
   * @childControl handle {qx.ui.basic.Image} prat handle to visualize the separation
   * @childControl container {qx.ui.toolbar.PartContainer} holds the content of the toolbar part
   */
  qx.Class.define("qx.ui.toolbar.Part", {
    extend: qx.ui.core.Widget,
    include: [qx.ui.core.MRemoteChildrenHandling],
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    construct() {
      qx.ui.core.Widget.constructor.call(this);

      // Hard coded HBox layout
      this._setLayout(new qx.ui.layout.HBox());

      // Force creation of the handle
      this._createChildControl("handle");
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      appearance: {
        refine: true,
        init: "toolbar/part"
      },
      /** Whether icons, labels, both or none should be shown. */
      show: {
        init: "both",
        check: ["both", "label", "icon"],
        inheritable: true,
        event: "changeShow"
      },
      /** The spacing between every child of the toolbar */
      spacing: {
        nullable: true,
        check: "Integer",
        themeable: true,
        apply: "_applySpacing"
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
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "handle":
            control = new qx.ui.basic.Image();
            control.setAlignY("middle");
            this._add(control);
            break;
          case "container":
            control = new qx.ui.toolbar.PartContainer();
            control.addListener("syncAppearance", this.__onSyncAppearance__P_231_0, this);
            this._add(control);
            control.addListener("changeChildren", () => {
              this.__onSyncAppearance__P_231_0();
            });
            break;
        }
        return control || qx.ui.toolbar.Part.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      getChildrenContainer() {
        return this.getChildControl("container");
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      _applySpacing(value, old) {
        var layout = this.getChildControl("container").getLayout();
        value == null ? layout.resetSpacing() : layout.setSpacing(value);
      },
      /*
      ---------------------------------------------------------------------------
        UTILITIES
      ---------------------------------------------------------------------------
      */
      /**
       * Helper which applies the left, right and middle states.
       */
      __onSyncAppearance__P_231_0() {
        // check every child
        var children = this.getChildrenContainer().getChildren();
        children = children.filter(function (child) {
          return child.getVisibility() == "visible";
        });
        for (var i = 0; i < children.length; i++) {
          // if its the first child
          if (i == 0 && i != children.length - 1) {
            children[i].addState("left");
            children[i].removeState("right");
            children[i].removeState("middle");
            // if its the last child
          } else if (i == children.length - 1 && i != 0) {
            children[i].addState("right");
            children[i].removeState("left");
            children[i].removeState("middle");
            // if there is only one child
          } else if (i == 0 && i == children.length - 1) {
            children[i].removeState("left");
            children[i].removeState("middle");
            children[i].removeState("right");
          } else {
            children[i].addState("middle");
            children[i].removeState("right");
            children[i].removeState("left");
          }
        }
      },
      /**
       * Adds a separator to the toolbar part.
       */
      addSeparator() {
        this.add(new qx.ui.toolbar.Separator());
      },
      /**
       * Returns all nested buttons which contains a menu to show. This is mainly
       * used for keyboard support.
       *
       * @return {Array} List of all menu buttons
       */
      getMenuButtons() {
        var children = this.getChildren();
        var buttons = [];
        var child;
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          if (child instanceof qx.ui.menubar.Button) {
            buttons.push(child);
          }
        }
        return buttons;
      }
    }
  });
  qx.ui.toolbar.Part.$$dbClassInfo = $$dbClassInfo;
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
      "qx.core.Assert": {},
      "qx.bom.client.OperatingSystem": {
        "require": true
      },
      "qx.locale.Manager": {
        "defer": "runtime"
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "os.name": {
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
   * Static class, which contains functionality to localize the names of keyboard keys.
   */

  qx.Class.define("qx.locale.Key", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /**
       * Return localized name of a key identifier
       * {@link qx.event.type.KeySequence}
       *
       * @param size {String} format of the key identifier.
       *       Possible values: "short", "full"
       * @param keyIdentifier {String} key identifier to translate {@link qx.event.type.KeySequence}
       * @param locale {String} optional locale to be used
       * @return {String} localized key name
       */
      getKeyName(size, keyIdentifier, locale) {
        {
          qx.core.Assert.assertInArray(size, ["short", "full"]);
        }
        var key = "key_" + size + "_" + keyIdentifier;
        // Control is always named control on a mac and not Strg in German e.g.
        if (qx.core.Environment.get("os.name") == "osx" && keyIdentifier == "Control") {
          key += "_Mac";
        }
        var localizedKey = qx.locale.Manager.getInstance().translate(key, [], locale);
        if (localizedKey == key) {
          return qx.locale.Key._keyNames[key] || keyIdentifier;
        } else {
          return localizedKey;
        }
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      var keyNames = {};
      var Manager = qx.locale.Manager;

      // TRANSLATION: short representation of key names
      keyNames[Manager.marktr("key_short_Backspace")] = "Backspace";
      keyNames[Manager.marktr("key_short_Tab")] = "Tab";
      keyNames[Manager.marktr("key_short_Space")] = "Space";
      keyNames[Manager.marktr("key_short_Enter")] = "Enter";
      keyNames[Manager.marktr("key_short_Shift")] = "Shift";
      keyNames[Manager.marktr("key_short_Control")] = "Ctrl";
      keyNames[Manager.marktr("key_short_Control_Mac")] = "Ctrl";
      keyNames[Manager.marktr("key_short_Alt")] = "Alt";
      keyNames[Manager.marktr("key_short_CapsLock")] = "Caps";
      keyNames[Manager.marktr("key_short_Meta")] = "Meta";
      keyNames[Manager.marktr("key_short_Escape")] = "Esc";
      keyNames[Manager.marktr("key_short_Left")] = "Left";
      keyNames[Manager.marktr("key_short_Up")] = "Up";
      keyNames[Manager.marktr("key_short_Right")] = "Right";
      keyNames[Manager.marktr("key_short_Down")] = "Down";
      keyNames[Manager.marktr("key_short_PageUp")] = "PgUp";
      keyNames[Manager.marktr("key_short_PageDown")] = "PgDn";
      keyNames[Manager.marktr("key_short_End")] = "End";
      keyNames[Manager.marktr("key_short_Home")] = "Home";
      keyNames[Manager.marktr("key_short_Insert")] = "Ins";
      keyNames[Manager.marktr("key_short_Delete")] = "Del";
      keyNames[Manager.marktr("key_short_NumLock")] = "Num";
      keyNames[Manager.marktr("key_short_PrintScreen")] = "Print";
      keyNames[Manager.marktr("key_short_Scroll")] = "Scroll";
      keyNames[Manager.marktr("key_short_Pause")] = "Pause";
      keyNames[Manager.marktr("key_short_Win")] = "Win";
      keyNames[Manager.marktr("key_short_Apps")] = "Apps";

      // TRANSLATION: full/long representation of key names
      keyNames[Manager.marktr("key_full_Backspace")] = "Backspace";
      keyNames[Manager.marktr("key_full_Tab")] = "Tabulator";
      keyNames[Manager.marktr("key_full_Space")] = "Space";
      keyNames[Manager.marktr("key_full_Enter")] = "Enter";
      keyNames[Manager.marktr("key_full_Shift")] = "Shift";
      keyNames[Manager.marktr("key_full_Control")] = "Control";
      keyNames[Manager.marktr("key_full_Control_Mac")] = "Control";
      keyNames[Manager.marktr("key_full_Alt")] = "Alt";
      keyNames[Manager.marktr("key_full_CapsLock")] = "CapsLock";
      keyNames[Manager.marktr("key_full_Meta")] = "Meta";
      keyNames[Manager.marktr("key_full_Escape")] = "Escape";
      keyNames[Manager.marktr("key_full_Left")] = "Left";
      keyNames[Manager.marktr("key_full_Up")] = "Up";
      keyNames[Manager.marktr("key_full_Right")] = "Right";
      keyNames[Manager.marktr("key_full_Down")] = "Down";
      keyNames[Manager.marktr("key_full_PageUp")] = "PageUp";
      keyNames[Manager.marktr("key_full_PageDown")] = "PageDown";
      keyNames[Manager.marktr("key_full_End")] = "End";
      keyNames[Manager.marktr("key_full_Home")] = "Home";
      keyNames[Manager.marktr("key_full_Insert")] = "Insert";
      keyNames[Manager.marktr("key_full_Delete")] = "Delete";
      keyNames[Manager.marktr("key_full_NumLock")] = "NumLock";
      keyNames[Manager.marktr("key_full_PrintScreen")] = "PrintScreen";
      keyNames[Manager.marktr("key_full_Scroll")] = "Scroll";
      keyNames[Manager.marktr("key_full_Pause")] = "Pause";
      keyNames[Manager.marktr("key_full_Win")] = "Win";
      keyNames[Manager.marktr("key_full_Apps")] = "Apps";

      // Save
      statics._keyNames = keyNames;
    }
  });
  qx.locale.Key.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.container.Composite": {
        "construct": true,
        "require": true
      },
      "qx.ui.layout.HBox": {
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
       * Jonathan Weiß (jonathan_rass)
  
  ************************************************************************ */

  /**
   * The container used by {@link Part} to insert the buttons.
   *
   * @internal
   */
  qx.Class.define("qx.ui.toolbar.PartContainer", {
    extend: qx.ui.container.Composite,
    construct() {
      qx.ui.container.Composite.constructor.call(this);
      this._setLayout(new qx.ui.layout.HBox());
    },
    events: {
      /** Fired if a child has been added or removed */
      changeChildren: "qx.event.type.Event"
    },
    properties: {
      appearance: {
        refine: true,
        init: "toolbar/part/container"
      },
      /** Whether icons, labels, both or none should be shown. */
      show: {
        init: "both",
        check: ["both", "label", "icon"],
        inheritable: true,
        event: "changeShow"
      }
    },
    members: {
      // overridden
      _afterAddChild(child) {
        this.fireEvent("changeChildren");
      },
      // overridden
      _afterRemoveChild(child) {
        this.fireEvent("changeChildren");
      }
    }
  });
  qx.ui.toolbar.PartContainer.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-29.js.map?dt=1769807054337
qx.$$packageData['29'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
