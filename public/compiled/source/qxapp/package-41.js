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
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */
  /**
   * This class is responsible for validation in all asynchronous cases and
   * should always be used with {@link qx.ui.form.validation.Manager}.
   *
   *
   * It acts like a wrapper for asynchronous validation functions. These
   * validation function must be set in the constructor. The form manager will
   * invoke the validation and the validator function will be called with two
   * arguments:
   * <ul>
   *  <li>asyncValidator: A reference to the corresponding validator.</li>
   *  <li>value: The value of the assigned input field.</li>
   * </ul>
   * These two parameters are needed to set the validation status of the current
   * validator. {@link #setValid} is responsible for doing that.
   *
   *
   * *Warning:* Instances of this class can only be used with one input
   * field at a time. Multi usage is not supported!
   *
   * *Warning:* Calling {@link #setValid} synchronously does not work. If you
   * have an synchronous validator, please check
   * {@link qx.ui.form.validation.Manager#add}. If you have both cases, you have
   * to wrap the synchronous call in a timeout to make it asynchronous.
   */
  qx.Class.define("qx.ui.form.validation.AsyncValidator", {
    extend: qx.core.Object,
    /**
     * @param validator {Function} The validator function, which has to be
     *   asynchronous.
     */
    construct(validator) {
      qx.core.Object.constructor.call(this);
      // save the validator function
      this.__validatorFunction__P_166_0 = validator;
    },
    members: {
      __validatorFunction__P_166_0: null,
      __item__P_166_1: null,
      __manager__P_166_2: null,
      __usedForForm__P_166_3: null,
      /**
       * The validate function should only be called by
       * {@link qx.ui.form.validation.Manager}.
       *
       * It stores the given information and calls the validation function set in
       * the constructor. The method is used for form fields only. Validating a
       * form itself will be invokes with {@link #validateForm}.
       *
       * @param item {qx.ui.core.Widget} The form item which should be validated.
       * @param value {var} The value of the form item.
       * @param manager {qx.ui.form.validation.Manager} A reference to the form
       *   manager.
       * @param context {var?null} The context of the validator.
       *
       * @internal
       */
      validate(item, value, manager, context) {
        // mark as item validator
        this.__usedForForm__P_166_3 = false;
        // store the item and the manager
        this.__item__P_166_1 = item;
        this.__manager__P_166_2 = manager;
        // invoke the user set validator function
        this.__validatorFunction__P_166_0.call(context || this, this, value);
      },
      /**
       * The validateForm function should only be called by
       * {@link qx.ui.form.validation.Manager}.
       *
       * It stores the given information and calls the validation function set in
       * the constructor. The method is used for forms only. Validating a
       * form item will be invokes with {@link #validate}.
       *
       * @param items {qx.ui.core.Widget[]} All form items of the form manager.
       * @param manager {qx.ui.form.validation.Manager} A reference to the form
       *   manager.
       * @param context {var?null} The context of the validator.
       *
       * @internal
       */
      validateForm(items, manager, context) {
        this.__usedForForm__P_166_3 = true;
        this.__manager__P_166_2 = manager;
        this.__validatorFunction__P_166_0.call(context, items, this);
      },
      /**
       * This method should be called within the asynchronous callback to tell the
       * validator the result of the validation.
       *
       * @param valid {Boolean} The boolean state of the validation.
       * @param message {String?} The invalidMessage of the validation.
       */
      setValid(valid, message) {
        // valid processing
        if (this.__usedForForm__P_166_3) {
          // message processing
          if (message !== undefined) {
            this.__manager__P_166_2.setInvalidMessage(message);
          }
          this.__manager__P_166_2.setFormValid(valid);
        } else {
          // message processing
          if (message !== undefined) {
            this.__item__P_166_1.setInvalidMessage(message);
          }
          this.__manager__P_166_2.setItemValid(this.__item__P_166_1, valid);
        }
      }
    },
    /*
     *****************************************************************************
        DESTRUCT
     *****************************************************************************
     */

    destruct() {
      this.__manager__P_166_2 = this.__item__P_166_1 = null;
    }
  });
  qx.ui.form.validation.AsyncValidator.$$dbClassInfo = $$dbClassInfo;
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
       2004-2012 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * Interface for data binding classes offering a selection.
   */
  qx.Interface.define("qx.data.controller.ISelection", {
    members: {
      /**
       * Setter for the selection.
       * @param value {qx.data.IListData} The data of the selection.
       */
      setSelection(value) {},
      /**
       * Getter for the selection list.
       * @return {qx.data.IListData} The current selection.
       */
      getSelection() {},
      /**
       * Resets the selection to its default value.
       */
      resetSelection() {}
    }
  });
  qx.data.controller.ISelection.$$dbClassInfo = $$dbClassInfo;
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
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Generic escaping and unescaping of DOM strings.
   *
   * {@link qx.bom.String} for (un)escaping of HTML strings.
   * {@link qx.xml.String} for (un)escaping of XML strings.
   */
  qx.Bootstrap.define("qx.util.StringEscape", {
    statics: {
      /**
       * generic escaping method
       *
       * @param str {String} string to escape
       * @param charCodeToEntities {Map} entity to charcode map
       * @return {String} escaped string
       */
      escape(str, charCodeToEntities) {
        var entity,
          result = "";
        for (var i = 0, l = str.length; i < l; i++) {
          var chr = str.charAt(i);
          var code = str.codePointAt(i);
          i += String.fromCodePoint(code).length - 1;
          if (charCodeToEntities[code]) {
            entity = "&" + charCodeToEntities[code] + ";";
          } else {
            if (code > 0x7f) {
              entity = "&#" + code + ";";
            } else {
              entity = chr;
            }
          }
          result += entity;
        }
        return result;
      },
      /**
       * generic unescaping method
       *
       * @param str {String} string to unescape
       * @param entitiesToCharCode {Map} charcode to entity map
       * @return {String} unescaped string
       */
      unescape(str, entitiesToCharCode) {
        return str.replace(/&[#\w]+;/gi, function (entity) {
          var chr = entity;
          var entity = entity.substring(1, entity.length - 1);
          var code = entitiesToCharCode[entity];
          if (code) {
            chr = String.fromCharCode(code);
          } else {
            if (entity.charAt(0) == "#") {
              if (entity.charAt(1).toUpperCase() == "X") {
                code = entity.substring(2);

                // match hex number
                if (code.match(/^[0-9A-Fa-f]+$/gi)) {
                  chr = String.fromCodePoint(parseInt(code, 16));
                }
              } else {
                code = entity.substring(1);

                // match integer
                if (code.match(/^\d+$/gi)) {
                  chr = String.fromCodePoint(parseInt(code, 10));
                }
              }
            }
          }
          return chr;
        });
      }
    }
  });
  qx.util.StringEscape.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-41.js.map?dt=1769807054452
qx.$$packageData['41'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
