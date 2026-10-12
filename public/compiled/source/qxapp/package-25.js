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
      "qx.ui.form.validation.Manager": {},
      "qx.ui.form.Resetter": {}
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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The form object is responsible for managing form items. For that, it takes
   * advantage of two existing qooxdoo classes.
   * The {@link qx.ui.form.Resetter} is used for resetting and the
   * {@link qx.ui.form.validation.Manager} is used for all validation purposes.
   *
   * The view code can be found in the used renderer ({@link qx.ui.form.renderer}).
   */
  qx.Class.define("qx.ui.form.Form", {
    extend: qx.core.Object,
    construct() {
      qx.core.Object.constructor.call(this);
      this.__groups__P_25_0 = [];
      this._buttons = [];
      this._buttonOptions = [];
      this._validationManager = this._createValidationManager();
      this._resetter = this._createResetter();
    },
    events: {
      /** Fired as soon as something changes in the form.*/
      change: "qx.event.type.Event"
    },
    members: {
      __groups__P_25_0: null,
      _validationManager: null,
      _groupCounter: 0,
      _buttons: null,
      _buttonOptions: null,
      _resetter: null,
      /*
      ---------------------------------------------------------------------------
         ADD
      ---------------------------------------------------------------------------
      */

      /**
       * Adds a form item to the form including its internal
       * {@link qx.ui.form.validation.Manager} and {@link qx.ui.form.Resetter}.
       *
       * *Hint:* The order of all add calls represent the order in the layout.
       *
       * @param item {qx.ui.form.IForm} A supported form item.
       * @param label {String} The string, which should be used as label.
       * @param validator {Function | qx.ui.form.validation.AsyncValidator ? null}
       *   The validator which is used by the validation
       *   {@link qx.ui.form.validation.Manager}.
       * @param name {String?null} The name which is used by the data binding
       *   controller {@link qx.data.controller.Form}.
       * @param validatorContext {var?null} The context of the validator.
       * @param options {Map?null} An additional map containing custom data which
       *   will be available in your form renderer specific to the added item.
       */
      add(item, label, validator, name, validatorContext, options) {
        if (this.__isFirstAdd__P_25_1()) {
          this.__groups__P_25_0.push({
            title: null,
            items: [],
            labels: [],
            names: [],
            options: [],
            headerOptions: {}
          });
        }
        // save the given arguments
        this.__groups__P_25_0[this._groupCounter].items.push(item);
        this.__groups__P_25_0[this._groupCounter].labels.push(label);
        this.__groups__P_25_0[this._groupCounter].options.push(options);
        // if no name is given, use the label without not working character
        if (name == null) {
          name = label.replace(/\s+|&|-|\+|\*|\/|\||!|\.|,|:|\?|;|~|%|\{|\}|\(|\)|\[|\]|<|>|=|\^|@|\\/g, "");
        }
        this.__groups__P_25_0[this._groupCounter].names.push(name);

        // add the item to the validation manager
        this._validationManager.add(item, validator, validatorContext);
        // add the item to the reset manager
        this._resetter.add(item);
        // fire the change event
        this.fireEvent("change");
      },
      /**
       * Adds a group header to the form.
       *
       * *Hint:* The order of all add calls represent the order in the layout.
       *
       * @param title {String} The title of the group header.
       * @param options {Map?null} A special set of custom data which will be
       *   given to the renderer.
       */
      addGroupHeader(title, options) {
        if (!this.__isFirstAdd__P_25_1()) {
          this._groupCounter++;
        }
        this.__groups__P_25_0.push({
          title: title,
          items: [],
          labels: [],
          names: [],
          options: [],
          headerOptions: options
        });

        // fire the change event
        this.fireEvent("change");
      },
      /**
       * Adds a button to the form.
       *
       * *Hint:* The order of all add calls represent the order in the layout.
       *
       * @param button {qx.ui.form.Button} The button to add.
       * @param options {Map?null} An additional map containing custom data which
       *   will be available in your form renderer specific to the added button.
       */
      addButton(button, options) {
        this._buttons.push(button);
        this._buttonOptions.push(options || null);
        // fire the change event
        this.fireEvent("change");
      },
      /**
       * Returns whether something has already been added.
       *
       * @return {Boolean} true, if nothing has been added jet.
       */
      __isFirstAdd__P_25_1() {
        return this.__groups__P_25_0.length === 0;
      },
      /*
      ---------------------------------------------------------------------------
         REMOVE
      ---------------------------------------------------------------------------
      */

      /**
       * Removes the given item from the form.
       *
       * @param item {qx.ui.form.IForm} A supported form item.
       * @return {Boolean} <code>true</code>, if the item could be removed.
       */
      remove(item) {
        for (var i = 0; i < this.__groups__P_25_0.length; i++) {
          var group = this.__groups__P_25_0[i];
          for (var j = 0; j < group.items.length; j++) {
            var storedItem = group.items[j];
            if (storedItem === item) {
              // remove all stored data
              group.items.splice(j, 1);
              group.labels.splice(j, 1);
              group.names.splice(j, 1);
              group.options.splice(j, 1);

              // remove the item to the validation manager
              this._validationManager.remove(item);
              // remove the item to the reset manager
              this._resetter.remove(item);

              // fire the change event
              this.fireEvent("change");
              return true;
            }
          }
        }
        return false;
      },
      /**
       * Removes the given group header from the form. All items in the group will be moved to
       * another group (usually the previous group). If there is more than one group with
       * the same title, only the first group will be removed.
       *
       * @param title {String} The title.
       * @return {Boolean} <code>true</code>, if the header could be removed.
       */
      removeGroupHeader(title) {
        for (var i = 0; i < this.__groups__P_25_0.length; i++) {
          var group = this.__groups__P_25_0[i];
          if (group.title === title) {
            var targetGroup;

            // if it's the first group
            if (i == 0) {
              // if it's the only group
              if (this.__groups__P_25_0.length == 1) {
                // remove the title and the header options
                group.title = null;
                group.headerOptions = {};
                // fire the change event
                this.fireEvent("change");
                return true;
              } else {
                // add to the next
                targetGroup = this.__groups__P_25_0[i + 1];
              }
            } else {
              // add to the previous group
              targetGroup = this.__groups__P_25_0[i - 1];
            }

            // copy the data over
            targetGroup.items = targetGroup.items.concat(group.items);
            targetGroup.labels = targetGroup.labels.concat(group.labels);
            targetGroup.names = targetGroup.names.concat(group.names);
            targetGroup.options = targetGroup.options.concat(group.options);

            // delete the group
            this.__groups__P_25_0.splice(i, 1);
            this._groupCounter--;

            // fire the change event
            this.fireEvent("change");
            return true;
          }
        }
        return false;
      },
      /**
       * Removes the given button from the form.
       *
       * @param button {qx.ui.form.Button} The button to remove.
       * @return {Boolean} <code>true</code>, if the button could be removed.
       */
      removeButton(button) {
        for (var i = 0; i < this._buttons.length; i++) {
          var storedButton = this._buttons[i];
          if (storedButton === button) {
            this._buttons.splice(i, 1);
            this._buttonOptions.splice(i, 1);
            // fire the change event
            this.fireEvent("change");
            return true;
          }
        }
        return false;
      },
      /**
       * Returns all added items as a map.
       *
       * @return {Map} A map containing for every item an entry with its name.
       */
      getItems() {
        var items = {};
        // go threw all groups
        for (var i = 0; i < this.__groups__P_25_0.length; i++) {
          var group = this.__groups__P_25_0[i];
          // get all items
          for (var j = 0; j < group.names.length; j++) {
            var name = group.names[j];
            items[name] = group.items[j];
          }
        }
        return items;
      },
      /**
       * Return an item by name.
       *
       * @param name {string} Item name.
       * @return {qx.ui.form.IForm|null} The form item or null.
       */
      getItem(name) {
        for (var i = 0; i < this.__groups__P_25_0.length; i++) {
          var group = this.__groups__P_25_0[i];
          for (var j = 0; j < group.names.length; j++) {
            if (group.names[j] === name) {
              return group.items[j];
            }
          }
        }
        return null;
      },
      /*
      ---------------------------------------------------------------------------
         RESET SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Resets the form. This means reseting all form items and the validation.
       */
      reset() {
        this._resetter.reset();
        this._validationManager.reset();
      },
      /**
       * Redefines the values used for resetting. It calls
       * {@link qx.ui.form.Resetter#redefine} to get that.
       */
      redefineResetter() {
        this._resetter.redefine();
      },
      /**
       * Redefines the value used for resetting of the given item. It calls
       * {@link qx.ui.form.Resetter#redefineItem} to get that.
       *
       * @param item {qx.ui.core.Widget} The item to redefine.
       */
      redefineResetterItem(item) {
        this._resetter.redefineItem(item);
      },
      /*
      ---------------------------------------------------------------------------
         VALIDATION
      ---------------------------------------------------------------------------
      */

      /**
       * Validates the form using the
       * {@link qx.ui.form.validation.Manager#validate} method.
       *
       * @return {Boolean|null} The validation result.
       */
      validate() {
        return this._validationManager.validate();
      },
      /**
       * Returns the internally used validation manager. If you want to do some
       * enhanced validation tasks, you need to use the validation manager.
       *
       * @return {qx.ui.form.validation.Manager} The used manager.
       */
      getValidationManager() {
        return this._validationManager;
      },
      /*
      ---------------------------------------------------------------------------
         RENDERER SUPPORT
      ---------------------------------------------------------------------------
      */

      /**
       * Accessor method for the renderer which returns all added items in a
       * array containing a map of all items:
       * {title: title, items: [], labels: [], names: []}
       *
       * @return {Array} An array containing all necessary data for the renderer.
       * @internal
       */
      getGroups() {
        return this.__groups__P_25_0;
      },
      /**
       * Accessor method for the renderer which returns all added buttons in an
       * array.
       * @return {Array} An array containing all added buttons.
       * @internal
       */
      getButtons() {
        return this._buttons;
      },
      /**
       * Accessor method for the renderer which returns all added options for
       * the buttons in an array.
       * @return {Array} An array containing all added options for the buttons.
       * @internal
       */
      getButtonOptions() {
        return this._buttonOptions;
      },
      /*
      ---------------------------------------------------------------------------
         INTERNAL
      ---------------------------------------------------------------------------
      */

      /**
       * Creates and returns the used validation manager.
       *
       * @return {qx.ui.form.validation.Manager} The validation manager.
       */
      _createValidationManager() {
        return new qx.ui.form.validation.Manager();
      },
      /**
       * Creates and returns the used resetter.
       *
       * @return {qx.ui.form.Resetter} the resetter class.
       */
      _createResetter() {
        return new qx.ui.form.Resetter();
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct() {
      // holding references to widgets --> must set to null
      this.__groups__P_25_0 = this._buttons = this._buttonOptions = null;
      this._validationManager.dispose();
      this._resetter.dispose();
    }
  });
  qx.ui.form.Form.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "construct": true,
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
      "qx.ui.form.IForm": {
        "require": true
      },
      "qx.ui.form.MForm": {
        "require": true
      },
      "qx.theme.manager.Meta": {},
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.theme.manager.Color": {},
      "qx.theme.manager.Appearance": {},
      "qx.theme.manager.Font": {},
      "qx.lang.Object": {},
      "qx.ui.style.Stylesheet": {
        "defer": "runtime"
      },
      "qx.bom.client.Css": {
        "construct": true,
        "require": true
      },
      "qx.locale.Manager": {
        "construct": true,
        "defer": "runtime"
      },
      "qx.html.Input": {},
      "qx.util.ResourceManager": {},
      "qx.lang.Type": {},
      "qx.bom.webfonts.WebFont": {},
      "qx.bom.Font": {},
      "qx.html.Element": {},
      "qx.bom.Label": {},
      "qx.ui.core.queue.Layout": {},
      "qx.event.type.Data": {},
      "qx.html.Label": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "engine.name": {
          "className": "qx.bom.client.Engine"
        },
        "browser.name": {
          "className": "qx.bom.client.Browser"
        },
        "engine.version": {
          "className": "qx.bom.client.Engine"
        },
        "css.placeholder": {
          "construct": true,
          "className": "qx.bom.client.Css"
        },
        "browser.documentmode": {
          "className": "qx.bom.client.Browser"
        },
        "qx.dynlocale": {
          "load": true
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
   * This is a basic form field with common functionality for
   * {@link TextArea} and {@link TextField}.
   *
   * On every keystroke the value is synchronized with the
   * value of the textfield. Value changes can be monitored by listening to the
   * {@link #input} or {@link #changeValue} events, respectively.
   */
  qx.Class.define("qx.ui.form.AbstractField", {
    extend: qx.ui.core.Widget,
    implement: [qx.ui.form.IStringForm, qx.ui.form.IForm],
    include: [qx.ui.form.MForm],
    type: "abstract",
    statics: {
      __addedPlaceholderRules__P_159_0: "",
      /**
       * Adds the CSS rules needed to style the native placeholder element.
       */
      __addPlaceholderRules__P_159_1() {
        const theme = qx.theme.manager.Meta.getInstance().getTheme();
        const currentThemeName = theme ? theme.title || theme.name : "";
        if (qx.ui.form.AbstractField.__addedPlaceholderRules__P_159_0 === currentThemeName) {
          return;
        }
        qx.ui.form.AbstractField.__addedPlaceholderRules__P_159_0 = currentThemeName;
        var engine = qx.core.Environment.get("engine.name");
        var browser = qx.core.Environment.get("browser.name");
        var colorManager = qx.theme.manager.Color.getInstance();
        var appearanceProperties = qx.theme.manager.Appearance.getInstance().styleFrom("textfield", {
          showingPlaceholder: true
        });
        var styles = {};
        var color = null;
        var font = null;
        if (appearanceProperties) {
          color = appearanceProperties["textColor"] ? colorManager.resolve(appearanceProperties["textColor"]) : null;
          font = appearanceProperties["font"] ? qx.theme.manager.Font.getInstance().resolve(appearanceProperties["font"]) : null;
        }
        if (!color) {
          color = colorManager.resolve("text-placeholder");
        }
        if (color) {
          styles.color = color + " !important";
        }
        if (font) {
          qx.lang.Object.mergeWith(styles, font.getStyles(), false);
        }
        var selector;
        if (engine == "gecko") {
          // see https://developer.mozilla.org/de/docs/CSS/:-moz-placeholder for details
          if (parseFloat(qx.core.Environment.get("engine.version")) >= 19) {
            selector = "input::-moz-placeholder, textarea::-moz-placeholder";
          } else {
            selector = "input:-moz-placeholder, textarea:-moz-placeholder";
          }
        } else if (engine == "webkit" && browser != "edge") {
          selector = "input.qx-placeholder-color::-webkit-input-placeholder, textarea.qx-placeholder-color::-webkit-input-placeholder";
        } else if (engine == "mshtml" || browser == "edge") {
          var separator = browser == "edge" ? "::" : ":";
          selector = ["input.qx-placeholder-color", "-ms-input-placeholder, textarea.qx-placeholder-color", "-ms-input-placeholder"].join(separator);
        }
        if (qx.ui.style.Stylesheet.getInstance().hasRule(selector)) {
          qx.ui.style.Stylesheet.getInstance().removeRule(selector);
        }
        qx.ui.style.Stylesheet.getInstance().addRule(selector, "color: " + color + " !important");
      }
    },
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param value {String} initial text value of the input field ({@link #setValue}).
     */
    construct(value) {
      qx.ui.core.Widget.constructor.call(this);

      // shortcut for placeholder feature detection
      this.__useQxPlaceholder__P_159_2 = !qx.core.Environment.get("css.placeholder");
      if (value != null) {
        this.setValue(value);
      }
      let el = this.getContentElement();
      el.addListener("change", this._onChangeContent, this);

      // use qooxdoo placeholder if no native placeholder is supported
      if (this.__useQxPlaceholder__P_159_2) {
        // assign the placeholder text after the appearance has been applied
        this.addListener("syncAppearance", this._syncPlaceholder, this);
      } else {
        // add rules for native placeholder color
        qx.ui.form.AbstractField.__addPlaceholderRules__P_159_1();
        // add a class to the input to restrict the placeholder color
        this.getContentElement().addClass("qx-placeholder-color");
      }

      // translation support
      {
        this.__changeLocaleAbstractFieldListenerId__P_159_3 = qx.locale.Manager.getInstance().addListener("changeLocale", this._onChangeLocale, this);
      }
    },
    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */

    events: {
      /**
       * The event is fired on every keystroke modifying the value of the field.
       *
       * The method {@link qx.event.type.Data#getData} returns the
       * current value of the text field.
       */
      input: "qx.event.type.Data",
      /**
       * The event is fired each time the text field looses focus and the
       * text field values has changed.
       *
       * If you change {@link #liveUpdate} to true, the changeValue event will
       * be fired after every keystroke and not only after every focus loss. In
       * that mode, the changeValue event is equal to the {@link #input} event.
       *
       * The method {@link qx.event.type.Data#getData} returns the
       * current text value of the field.
       */
      changeValue: "qx.event.type.Data"
    },
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /**
       * Alignment of the text
       */
      textAlign: {
        check: ["left", "center", "right"],
        nullable: true,
        themeable: true,
        apply: "_applyTextAlign"
      },
      /** Whether the field is read only */
      readOnly: {
        check: "Boolean",
        apply: "_applyReadOnly",
        event: "changeReadOnly",
        init: false
      },
      // overridden
      selectable: {
        refine: true,
        init: true
      },
      // overridden
      focusable: {
        refine: true,
        init: true
      },
      /** Maximal number of characters that can be entered in the TextArea. */
      maxLength: {
        apply: "_applyMaxLength",
        check: "PositiveInteger",
        init: Infinity
      },
      /**
       * Whether the {@link #changeValue} event should be fired on every key
       * input. If set to true, the changeValue event is equal to the
       * {@link #input} event.
       */
      liveUpdate: {
        check: "Boolean",
        init: false
      },
      /**
       * Fire a {@link #changeValue} event whenever the content of the
       * field matches the given regular expression. Accepts both regular
       * expression objects as well as strings for input.
       */
      liveUpdateOnRxMatch: {
        check: "RegExp",
        transform: "_string2RegExp",
        init: null
      },
      /**
       * String value which will be shown as a hint if the field is all of:
       * unset, unfocused and enabled. Set to null to not show a placeholder
       * text.
       */
      placeholder: {
        check: "String",
        nullable: true,
        apply: "_applyPlaceholder"
      },
      /**
       * RegExp responsible for filtering the value of the textfield. the RegExp
       * gives the range of valid values.
       * Note: The regexp specified is applied to each character in turn,
       * NOT to the entire string. So only regular expressions matching a
       * single character make sense in the context.
       * The following example only allows digits in the textfield.
       * <pre class='javascript'>field.setFilter(/[0-9]/);</pre>
       */
      filter: {
        check: "RegExp",
        nullable: true,
        init: null
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    /* eslint-disable @qooxdoo/qx/no-refs-in-members */
    members: {
      __nullValue__P_159_4: true,
      _placeholder: null,
      __oldValue__P_159_5: null,
      __oldInputValue__P_159_6: null,
      __useQxPlaceholder__P_159_2: true,
      __font__P_159_7: null,
      __webfontListenerId__P_159_8: null,
      /*
      ---------------------------------------------------------------------------
        WIDGET API
      ---------------------------------------------------------------------------
      */

      // overridden
      getFocusElement() {
        var el = this.getContentElement();
        if (el) {
          return el;
        }
      },
      /**
       * Creates the input element. Derived classes may override this
       * method, to create different input elements.
       *
       * @return {qx.html.Input} a new input element.
       */
      _createInputElement() {
        return new qx.html.Input("text");
      },
      // overridden
      renderLayout(left, top, width, height) {
        var updateInsets = this._updateInsets;
        var changes = qx.ui.form.AbstractField.superclass.prototype.renderLayout.call(this, left, top, width, height);

        // Directly return if superclass has detected that no
        // changes needs to be applied
        if (!changes) {
          return;
        }
        var inner = changes.size || updateInsets;
        var pixel = "px";
        if (inner || changes.local || changes.margin) {
          var innerWidth = width;
          var innerHeight = height;
        }
        var input = this.getContentElement();

        // we don't need to update positions on native placeholders
        if (updateInsets && this.__useQxPlaceholder__P_159_2) {
          if (this.__useQxPlaceholder__P_159_2) {
            var insets = this.getInsets();
            this._getPlaceholderElement().setStyles({
              paddingTop: insets.top + pixel,
              paddingRight: insets.right + pixel,
              paddingBottom: insets.bottom + pixel,
              paddingLeft: insets.left + pixel
            });
          }
        }
        if (inner || changes.margin) {
          // we don't need to update dimensions on native placeholders
          if (this.__useQxPlaceholder__P_159_2) {
            var insets = this.getInsets();
            this._getPlaceholderElement().setStyles({
              width: innerWidth - insets.left - insets.right + pixel,
              height: innerHeight - insets.top - insets.bottom + pixel
            });
          }
          input.setStyles({
            width: innerWidth + pixel,
            height: innerHeight + pixel
          });
          this._renderContentElement(innerHeight, input);
        }
        if (changes.position) {
          if (this.__useQxPlaceholder__P_159_2) {
            this._getPlaceholderElement().setStyles({
              left: left + pixel,
              top: top + pixel
            });
          }
        }
      },
      /**
       * Hook into {@link qx.ui.form.AbstractField#renderLayout} method.
       * Called after the contentElement has a width and an innerWidth.
       *
       * Note: This was introduced to fix BUG#1585
       *
       * @param innerHeight {Integer} The inner height of the element.
       * @param element {Element} The element.
       */
      _renderContentElement(innerHeight, element) {
        //use it in child classes
      },
      // overridden
      _createContentElement() {
        // create and add the input element
        var el = this._createInputElement();

        // initialize the html input
        el.setSelectable(this.getSelectable());
        el.setEnabled(this.getEnabled());

        // Add listener for input event
        el.addListener("input", this._onHtmlInput, this);

        // Disable HTML5 spell checking
        el.setAttribute("spellcheck", "false");
        el.addClass("qx-abstract-field");

        // IE8 in standard mode needs some extra love here to receive events.
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") == 8) {
          el.setStyles({
            backgroundImage: "url(" + qx.util.ResourceManager.getInstance().toUri("qx/static/blank.gif") + ")"
          });
        }
        return el;
      },
      // overridden
      _applyEnabled(value, old) {
        qx.ui.form.AbstractField.superclass.prototype._applyEnabled.call(this, value, old);
        this.getContentElement().setEnabled(value);
        if (this.__useQxPlaceholder__P_159_2) {
          if (value) {
            this._showPlaceholder();
          } else {
            this._removePlaceholder();
          }
        } else {
          var input = this.getContentElement();
          // remove the placeholder on disabled input elements
          input.setAttribute("placeholder", value ? this.getPlaceholder() : "");
        }
      },
      // default text sizes
      /**
       * @lint ignoreReferenceField(__textSize)
       */
      __textSize__P_159_9: {
        width: 16,
        height: 16
      },
      // overridden
      _getContentHint() {
        return {
          width: this.__textSize__P_159_9.width * 10,
          height: this.__textSize__P_159_9.height || 16
        };
      },
      // overridden
      _applyFont(value, old) {
        if (old && this.__font__P_159_7 && this.__webfontListenerId__P_159_8) {
          this.__font__P_159_7.removeListenerById(this.__webfontListenerId__P_159_8);
          this.__webfontListenerId__P_159_8 = null;
        }

        // Apply
        var styles;
        if (value) {
          if (qx.lang.Type.isString(value)) {
            value = qx.theme.manager.Font.getInstance().resolve(value);
          }
          this.__font__P_159_7 = value;
          if (this.__font__P_159_7 instanceof qx.bom.webfonts.WebFont && !this.__font__P_159_7.isValid()) {
            this.__webfontListenerId__P_159_8 = this.__font__P_159_7.addListener("changeStatus", this._onWebFontStatusChange, this);
          }
          styles = this.__font__P_159_7.getStyles();
        } else {
          styles = qx.bom.Font.getDefaultStyles();
        }

        // check if text color already set - if so this local value has higher priority
        if (this.getTextColor() != null) {
          delete styles["color"];
        }

        // apply the font to the content element
        // IE 8 - 10 (but not 11 Preview) will ignore the lineHeight value
        // unless it's applied directly.
        if (qx.core.Environment.get("engine.name") == "mshtml" && qx.core.Environment.get("browser.documentmode") < 11) {
          qx.html.Element.flush();
          this.getContentElement().setStyles(styles, true);
        } else {
          this.getContentElement().setStyles(styles);
        }

        // the font will adjust automatically on native placeholders
        if (this.__useQxPlaceholder__P_159_2) {
          // don't apply the color to the placeholder
          delete styles["color"];
          // apply the font to the placeholder
          this._getPlaceholderElement().setStyles(styles);
        }

        // Compute text size
        if (value) {
          this.__textSize__P_159_9 = qx.bom.Label.getTextSize("A", styles);
        } else {
          delete this.__textSize__P_159_9;
        }

        // Update layout
        qx.ui.core.queue.Layout.add(this);
      },
      // overridden
      _applyTextColor(value, old) {
        if (value) {
          this.getContentElement().setStyle("color", qx.theme.manager.Color.getInstance().resolve(value));
        } else {
          this.getContentElement().removeStyle("color");
        }
      },
      // property apply
      _applyMaxLength(value, old) {
        if (value) {
          this.getContentElement().setAttribute("maxLength", value);
        } else {
          this.getContentElement().removeAttribute("maxLength");
        }
      },
      // property transform
      _string2RegExp(value, old) {
        if (qx.lang.Type.isString(value)) {
          value = new RegExp(value);
        }
        return value;
      },
      // overridden
      tabFocus() {
        qx.ui.form.AbstractField.superclass.prototype.tabFocus.call(this);
        this.selectAllText();
      },
      /**
       * Returns the text size.
       * @return {Map} The text size.
       */
      _getTextSize() {
        return this.__textSize__P_159_9;
      },
      /*
      ---------------------------------------------------------------------------
        EVENTS
      ---------------------------------------------------------------------------
      */

      /**
       * Event listener for native input events. Redirects the event
       * to the widget. Also checks for the filter and max length.
       *
       * @param e {qx.event.type.Data} Input event
       */
      _onHtmlInput(e) {
        var value = e.getData();
        var fireEvents = true;
        this.__nullValue__P_159_4 = false;

        // value unchanged; Firefox fires "input" when pressing ESC [BUG #5309]
        if (this.__oldInputValue__P_159_6 && this.__oldInputValue__P_159_6 === value) {
          fireEvents = false;
        }

        // check for the filter
        if (this.getFilter() != null) {
          var filteredValue = this._validateInput(value);
          if (filteredValue != value) {
            fireEvents = this.__oldInputValue__P_159_6 !== filteredValue;
            value = filteredValue;
            this.getContentElement().setValue(value);
          }
        }
        // fire the events, if necessary
        if (fireEvents) {
          // store the old input value
          this.fireDataEvent("input", value, this.__oldInputValue__P_159_6);
          this.__oldInputValue__P_159_6 = value;

          // check for the live change event
          if (this.getLiveUpdate()) {
            this.__fireChangeValueEvent__P_159_10(value);
          }
          // check for the liveUpdateOnRxMatch change event
          else {
            var fireRx = this.getLiveUpdateOnRxMatch();
            if (fireRx && value.match(fireRx)) {
              this.__fireChangeValueEvent__P_159_10(value);
            }
          }
        }
      },
      /**
       * Triggers text size recalculation after a web font was loaded
       *
       * @param ev {qx.event.type.Data} "changeStatus" event
       */
      _onWebFontStatusChange(ev) {
        if (ev.getData().valid === true) {
          var styles = this.__font__P_159_7.getStyles();
          this.__textSize__P_159_9 = qx.bom.Label.getTextSize("A", styles);
          qx.ui.core.queue.Layout.add(this);
        }
      },
      /**
       * Handles the firing of the changeValue event including the local cache
       * for sending the old value in the event.
       *
       * @param value {String} The new value.
       */
      __fireChangeValueEvent__P_159_10(value) {
        var old = this.__oldValue__P_159_5;
        this.__oldValue__P_159_5 = value;
        if (old != value) {
          this.fireNonBubblingEvent("changeValue", qx.event.type.Data, [value, old]);
        }
      },
      /*
      ---------------------------------------------------------------------------
        TEXTFIELD VALUE API
      ---------------------------------------------------------------------------
      */

      /**
       * Sets the value of the textfield to the given value.
       *
       * @param value {String} The new value
       */
      setValue(value) {
        if (this.isDisposed()) {
          return null;
        }

        // handle null values
        if (value === null) {
          // just do nothing if null is already set
          if (this.__nullValue__P_159_4) {
            return value;
          }
          value = "";
          this.__nullValue__P_159_4 = true;
        } else {
          this.__nullValue__P_159_4 = false;
          // native placeholders will be removed by the browser
          if (this.__useQxPlaceholder__P_159_2) {
            this._removePlaceholder();
          }
        }
        if (qx.lang.Type.isString(value)) {
          var elem = this.getContentElement();
          if (elem.getValue() != value) {
            var oldValue = elem.getValue();
            elem.setValue(value);
            var data = this.__nullValue__P_159_4 ? null : value;
            this.__oldValue__P_159_5 = oldValue;
            this.__fireChangeValueEvent__P_159_10(data);
            // reset the input value on setValue calls [BUG #6892]
            this.__oldInputValue__P_159_6 = this.__oldValue__P_159_5;
          }
          // native placeholders will be shown by the browser
          if (this.__useQxPlaceholder__P_159_2) {
            this._showPlaceholder();
          }
          return value;
        }
        throw new Error("Invalid value type: " + value);
      },
      /**
       * Returns the current value of the textfield.
       *
       * @return {String|null} The current value
       */
      getValue() {
        return this.isDisposed() || this.__nullValue__P_159_4 ? null : this.getContentElement().getValue();
      },
      /**
       * Resets the value to the default
       */
      resetValue() {
        this.setValue(null);
      },
      /**
       * Event listener for change event of content element
       *
       * @param e {qx.event.type.Data} Incoming change event
       */
      _onChangeContent(e) {
        this.__nullValue__P_159_4 = e.getData() === null;
        this.__fireChangeValueEvent__P_159_10(e.getData());
      },
      /*
      ---------------------------------------------------------------------------
        TEXTFIELD SELECTION API
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the current selection.
       * This method only works if the widget is already created and
       * added to the document.
       *
       * @return {String|null}
       */
      getTextSelection() {
        return this.getContentElement().getTextSelection();
      },
      /**
       * Returns the current selection length.
       * This method only works if the widget is already created and
       * added to the document.
       *
       * @return {Integer|null}
       */
      getTextSelectionLength() {
        return this.getContentElement().getTextSelectionLength();
      },
      /**
       * Returns the start of the text selection
       *
       * @return {Integer|null} Start of selection or null if not available
       */
      getTextSelectionStart() {
        return this.getContentElement().getTextSelectionStart();
      },
      /**
       * Returns the end of the text selection
       *
       * @return {Integer|null} End of selection or null if not available
       */
      getTextSelectionEnd() {
        return this.getContentElement().getTextSelectionEnd();
      },
      /**
       * Set the selection to the given start and end (zero-based).
       * If no end value is given the selection will extend to the
       * end of the textfield's content.
       * This method only works if the widget is already created and
       * added to the document.
       *
       * @param start {Integer} start of the selection (zero-based)
       * @param end {Integer} end of the selection
       */
      setTextSelection(start, end) {
        this.getContentElement().setTextSelection(start, end);
      },
      /**
       * Clears the current selection.
       * This method only works if the widget is already created and
       * added to the document.
       *
       */
      clearTextSelection() {
        this.getContentElement().clearTextSelection();
      },
      /**
       * Selects the whole content
       *
       */
      selectAllText() {
        this.setTextSelection(0);
      },
      /*
      ---------------------------------------------------------------------------
        PLACEHOLDER HELPERS
      ---------------------------------------------------------------------------
      */

      // overridden
      setLayoutParent(parent) {
        qx.ui.form.AbstractField.superclass.prototype.setLayoutParent.call(this, parent);
        if (this.__useQxPlaceholder__P_159_2) {
          if (parent) {
            this.getLayoutParent().getContentElement().add(this._getPlaceholderElement());
          } else {
            var placeholder = this._getPlaceholderElement();
            placeholder.getParent().remove(placeholder);
          }
        }
      },
      /**
       * Helper to show the placeholder text in the field. It checks for all
       * states and possible conditions and shows the placeholder only if allowed.
       */
      _showPlaceholder() {
        var fieldValue = this.getValue() || "";
        var placeholder = this.getPlaceholder();
        if (placeholder != null && fieldValue == "" && !this.hasState("focused") && !this.hasState("disabled")) {
          if (this.hasState("showingPlaceholder")) {
            this._syncPlaceholder();
          } else {
            // the placeholder will be set as soon as the appearance is applied
            this.addState("showingPlaceholder");
          }
        }
      },
      /**
       * Remove the fake placeholder
       */
      _onPointerDownPlaceholder() {
        window.setTimeout(function () {
          this.focus();
        }.bind(this), 0);
      },
      /**
       * Helper to remove the placeholder. Deletes the placeholder text from the
       * field and removes the state.
       */
      _removePlaceholder() {
        if (this.hasState("showingPlaceholder")) {
          if (this.__useQxPlaceholder__P_159_2) {
            this._getPlaceholderElement().setStyle("visibility", "hidden");
          }
          this.removeState("showingPlaceholder");
        }
      },
      /**
       * Updates the placeholder text with the DOM
       */
      _syncPlaceholder() {
        if (this.hasState("showingPlaceholder") && this.__useQxPlaceholder__P_159_2) {
          this._getPlaceholderElement().setStyle("visibility", "visible");
        }
      },
      /**
       * Returns the placeholder label and creates it if necessary.
       */
      _getPlaceholderElement() {
        if (this._placeholder == null) {
          // create the placeholder
          this._placeholder = new qx.html.Label();
          var colorManager = qx.theme.manager.Color.getInstance();
          this._placeholder.setStyles({
            zIndex: 11,
            position: "absolute",
            color: colorManager.resolve("text-placeholder"),
            whiteSpace: "normal",
            // enable wrap by default
            cursor: "text",
            visibility: "hidden"
          });
          this._placeholder.addListener("pointerdown", this._onPointerDownPlaceholder, this);
        }
        return this._placeholder;
      },
      /**
       * Locale change event handler
       *
       * @signature function(e)
       * @param e {Event} the change event
       */
      _onChangeLocale: qx.core.Environment.select("qx.dynlocale", {
        true(e) {
          var content = this.getPlaceholder();
          if (content && content.translate) {
            this.setPlaceholder(content.translate());
          }
        },
        false: null
      }),
      // overridden
      _onChangeTheme() {
        qx.ui.form.AbstractField.superclass.prototype._onChangeTheme.call(this);
        if (this._placeholder) {
          // delete the placeholder element because it uses a theme dependent color
          this._placeholder.dispose();
          this._placeholder = null;
        }
        if (!this.__useQxPlaceholder__P_159_2) {
          qx.ui.form.AbstractField.__addPlaceholderRules__P_159_1();
        }
      },
      /**
       * Validates the the input value.
       *
       * @param value {Object} The value to check
       * @returns The checked value
       */
      _validateInput(value) {
        var filteredValue = value;
        var filter = this.getFilter();

        // If no filter is set return just the value
        if (filter !== null) {
          filteredValue = "";
          var index = value.search(filter);
          var processedValue = value;
          while (index >= 0 && processedValue.length > 0) {
            filteredValue = filteredValue + processedValue.charAt(index);
            processedValue = processedValue.substring(index + 1, processedValue.length);
            index = processedValue.search(filter);
          }
        }
        return filteredValue;
      },
      /*
      ---------------------------------------------------------------------------
        PROPERTY APPLY ROUTINES
      ---------------------------------------------------------------------------
      */

      // property apply
      _applyPlaceholder(value, old) {
        if (this.__useQxPlaceholder__P_159_2) {
          this._getPlaceholderElement().setValue(value);
          if (value != null) {
            this.addListener("focusin", this._removePlaceholder, this);
            this.addListener("focusout", this._showPlaceholder, this);
            this._showPlaceholder();
          } else {
            this.removeListener("focusin", this._removePlaceholder, this);
            this.removeListener("focusout", this._showPlaceholder, this);
            this._removePlaceholder();
          }
        } else {
          // only apply if the widget is enabled
          if (this.getEnabled()) {
            this.getContentElement().setAttribute("placeholder", value);
            if (qx.core.Environment.get("browser.name") === "firefox" && parseFloat(qx.core.Environment.get("browser.version")) < 36 && this.getContentElement().getNodeName() === "textarea" && !this.getContentElement().getDomElement()) {
              /* qx Bug #8870: Firefox 35 will not display a text area's
                 placeholder text if the attribute is set before the
                 element is added to the DOM. This is fixed in FF 36. */
              this.addListenerOnce("appear", () => {
                this.getContentElement().getDomElement().removeAttribute("placeholder");
                this.getContentElement().getDomElement().setAttribute("placeholder", value);
              });
            }
          }
        }
      },
      // property apply
      _applyTextAlign(value, old) {
        this.getContentElement().setStyle("textAlign", value);
      },
      // property apply
      _applyReadOnly(value, old) {
        var element = this.getContentElement();
        element.setAttribute("readOnly", value);
        if (value) {
          this.addState("readonly");
          this.setFocusable(false);
        } else {
          this.removeState("readonly");
          this.setFocusable(true);
        }
      }
    },
    defer(statics) {
      var css = "border: none;padding: 0;margin: 0;display : block;background : transparent;outline: none;appearance: none;position: absolute;autoComplete: off;resize: none;border-radius: 0;";
      qx.ui.style.Stylesheet.getInstance().addRule(".qx-abstract-field", css);
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct() {
      if (this._placeholder) {
        this._placeholder.removeListener("pointerdown", this._onPointerDownPlaceholder, this);
        var parent = this._placeholder.getParent();
        if (parent) {
          parent.remove(this._placeholder);
        }
        this._placeholder.dispose();
      }
      this._placeholder = this.__font__P_159_7 = null;
      if (true && this.__changeLocaleAbstractFieldListenerId__P_159_3) {
        qx.locale.Manager.getInstance().removeListenerById(this.__changeLocaleAbstractFieldListenerId__P_159_3);
      }
      if (this.__font__P_159_7 && this.__webfontListenerId__P_159_8) {
        this.__font__P_159_7.removeListenerById(this.__webfontListenerId__P_159_8);
      }
      this.getContentElement().removeListener("input", this._onHtmlInput, this);
    }
  });
  qx.ui.form.AbstractField.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.form.AbstractField": {
        "require": true
      },
      "qx.bom.client.Engine": {
        "require": true
      },
      "qx.bom.client.Browser": {
        "require": true
      },
      "qx.bom.client.Device": {
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
        "device.type": {
          "className": "qx.bom.client.Device"
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
       * Adrian Olaru (adrianolaru)
  
  ************************************************************************ */

  /**
   * The TextField is a single-line text input field.
   */
  qx.Class.define("qx.ui.form.TextField", {
    extend: qx.ui.form.AbstractField,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      // overridden
      appearance: {
        refine: true,
        init: "textfield"
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
    members: {
      // overridden
      _renderContentElement(innerHeight, element) {
        if (qx.core.Environment.get("engine.name") == "mshtml" && (parseInt(qx.core.Environment.get("engine.version"), 10) < 9 || qx.core.Environment.get("browser.documentmode") < 9)) {
          element.setStyles({
            "line-height": innerHeight + "px"
          });
        }
      },
      // overridden
      _createContentElement() {
        var el = qx.ui.form.TextField.superclass.prototype._createContentElement.call(this);
        var deviceType = qx.core.Environment.get("device.type");
        if (deviceType == "tablet" || deviceType == "mobile") {
          el.addListener("keypress", this._onKeyPress, this);
        }
        return el;
      },
      /**
       * Close the virtual keyboard if the Enter key is pressed.
       * @param evt {qx.event.type.KeySequence} the keypress event.
       */
      _onKeyPress(evt) {
        // On return
        if (evt.getKeyIdentifier() == "Enter") {
          if (this.isFocusable()) {
            this.blur();
          } else {
            // When the text field is not focusable, blur() will raise an exception on
            // touch devices and the virtual keyboard is not closed. To work around this
            // issue, we're enabling the focus just for the blur() call.
            this.setFocusable(true);
            this.blur();
            this.setFocusable(false);
          }
        }
      }
    },
    destruct() {
      this.getContentElement().removeListener("keypress", this._onKeyPress, this);
    }
  });
  qx.ui.form.TextField.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-25.js.map?dt=1791845587645
qx.$$packageData['25'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
