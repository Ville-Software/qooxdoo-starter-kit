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
      "qx.locale.Manager": {
        "construct": true
      },
      "qx.lang.Type": {},
      "qx.lang.Object": {},
      "qx.core.ValidationError": {},
      "qx.type.BaseError": {},
      "qx.ui.form.validation.AsyncValidator": {},
      "qx.ui.form.IForm": {},
      "qx.ui.core.ISingleSelection": {},
      "qx.data.controller.ISelection": {}
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.ui.form.validation.Manager.allowDefaultInvalidMessage": {}
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
   * This validation manager is responsible for validation of forms.
   *
   * @ignore(qx.ui.tooltip)
   * @ignore(qx.ui.tooltip.Manager.*)
   */
  qx.Class.define("qx.ui.form.validation.Manager", {
    extend: qx.core.Object,
    construct() {
      qx.core.Object.constructor.call(this);

      // storage for all form items
      this.__formItems__P_88_0 = [];
      // storage for all results of async validation calls
      this.__asyncResults__P_88_1 = {};
      // set the default required field message
      this.setRequiredFieldMessage(qx.locale.Manager.tr("This field is required"));
    },
    events: {
      /**
       * Change event for the valid state.
       */
      changeValid: "qx.event.type.Data",
      /**
       * Signals that the validation is done. This is not needed on synchronous
       * validation (validation is done right after the call) but very important
       * in the case an asynchronous validator will be used.
       */
      complete: "qx.event.type.Event"
    },
    properties: {
      /**
       * The validator of the form itself. You can set a function (for
       * synchronous validation) or a {@link qx.ui.form.validation.AsyncValidator}.
       * In both cases, the function can have all added form items as first
       * argument and the manager as a second argument. The manager should be used
       * to set the {@link #invalidMessage}.
       *
       * Keep in mind that the validator is optional if you don't need the
       * validation in the context of the whole form.
       * @type {Function | AsyncValidator}
       */
      validator: {
        check: "value instanceof Function || qx.Class.isSubClassOf(value.constructor, qx.ui.form.validation.AsyncValidator)",
        init: null,
        nullable: true
      },
      /**
       * The invalid message stores the message why the form validation
       * failed. It will be added to the array returned by
       * {@link #getInvalidMessages}.
       */
      invalidMessage: {
        check: "String",
        init: ""
      },
      /**
       * This message will be shown if a required field is empty and no individual
       * {@link qx.ui.form.MForm#requiredInvalidMessage} is given.
       */
      requiredFieldMessage: {
        check: "String",
        init: ""
      },
      /**
       * The context for the form validation.
       */
      context: {
        nullable: true
      }
    },
    members: {
      __formItems__P_88_0: null,
      __valid__P_88_2: null,
      __asyncResults__P_88_1: null,
      __syncValid__P_88_3: null,
      /**
       * Add a form item to the validation manager.
       *
       * The form item has to implement at least two interfaces:
       * <ol>
       *   <li>The {@link qx.ui.form.IForm} Interface</li>
       *   <li>One of the following interfaces:
       *     <ul>
       *       <li>{@link qx.ui.form.IBooleanForm}</li>
       *       <li>{@link qx.ui.form.IColorForm}</li>
       *       <li>{@link qx.ui.form.IDateForm}</li>
       *       <li>{@link qx.ui.form.INumberForm}</li>
       *       <li>{@link qx.ui.form.IStringForm}</li>
       *     </ul>
       *   </li>
       * </ol>
       * The validator can be a synchronous or asynchronous validator. In
       * both cases the validator can either returns a boolean or fire an
       * {@link qx.core.ValidationError}. For synchronous validation, a plain
       * JavaScript function should be used. For all asynchronous validations,
       * a {@link qx.ui.form.validation.AsyncValidator} is needed to wrap the
       * plain function.
       *
       * @param formItem {qx.ui.core.Widget} The form item to add.
       * @param validator {Function | qx.ui.form.validation.AsyncValidator}
       *   The validator.
       * @param context {var?null} The context of the validator.
       */
      add(formItem, validator, context) {
        // check for the form API
        if (!this.__supportsInvalid__P_88_4(formItem)) {
          throw new Error("Added widget not supported.");
        }
        // check for the data type
        if (this.__supportsSingleSelection__P_88_5(formItem) && !formItem.getValue) {
          // check for a validator
          if (validator != null) {
            throw new Error("Widgets supporting selection can only be validated in the form validator");
          }
        }
        var dataEntry = {
          item: formItem,
          validator: validator,
          valid: null,
          context: context
        };
        this.__formItems__P_88_0.push(dataEntry);
      },
      /**
       * Remove a form item from the validation manager.
       *
       * @param formItem {qx.ui.core.Widget} The form item to remove.
       * @return {qx.ui.core.Widget?null} The removed form item or
       *  <code>null</code> if the item could not be found.
       */
      remove(formItem) {
        var items = this.__formItems__P_88_0;
        for (var i = 0, len = items.length; i < len; i++) {
          if (formItem === items[i].item) {
            items.splice(i, 1);
            return formItem;
          }
        }
        return null;
      },
      /**
       * Returns registered form items from the validation manager.
       *
       * @return {Array} The form items which will be validated.
       */
      getItems() {
        var items = [];
        for (var i = 0; i < this.__formItems__P_88_0.length; i++) {
          items.push(this.__formItems__P_88_0[i].item);
        }
        return items;
      },
      /**
       * Invokes the validation. If only synchronous validators are set, the
       * result of the whole validation is available at the end of the method
       * and can be returned. If an asynchronous validator is set, the result
       * is still unknown at the end of this method so nothing will be returned.
       * In both cases, a {@link #complete} event will be fired if the validation
       * has ended. The result of the validation can then be accessed with the
       * {@link #getValid} method.
       *
       * @return {Boolean|undefined} The validation result, if available.
       */
      validate() {
        var valid = true;
        this.__syncValid__P_88_3 = true; // collaboration of all synchronous validations
        var items = [];

        // check all validators for the added form items
        for (var i = 0; i < this.__formItems__P_88_0.length; i++) {
          var formItem = this.__formItems__P_88_0[i].item;
          var validator = this.__formItems__P_88_0[i].validator;

          // store the items in case of form validation
          items.push(formItem);

          // ignore all form items without a validator
          if (validator == null) {
            // check for the required property
            var validatorResult = this._validateRequired(formItem);
            valid = valid && validatorResult;
            this.__syncValid__P_88_3 = validatorResult && this.__syncValid__P_88_3;
            continue;
          }
          var validatorResult = this._validateItem(this.__formItems__P_88_0[i], formItem.getValue());

          // keep that order to ensure that null is returned on async cases
          valid = validatorResult && valid;
          if (validatorResult != null) {
            this.__syncValid__P_88_3 = validatorResult && this.__syncValid__P_88_3;
          }
        }

        // check the form validator (be sure to invoke it even if the form
        // items are already false, so keep the order!)
        var formValid = this.__validateForm__P_88_6(items);
        if (qx.lang.Type.isBoolean(formValid)) {
          this.__syncValid__P_88_3 = formValid && this.__syncValid__P_88_3;
        }
        valid = formValid && valid;
        this._setValid(valid);
        if (qx.lang.Object.isEmpty(this.__asyncResults__P_88_1)) {
          this.fireEvent("complete");
        }
        return valid;
      },
      /**
       * Checks if the form item is required. If so, the value is checked
       * and the result will be returned. If the form item is not required, true
       * will be returned.
       *
       * @param formItem {qx.ui.core.Widget} The form item to check.
       * @return {var} Validation result
       */
      _validateRequired(formItem) {
        if (formItem.getRequired()) {
          var validatorResult;
          // if its a widget supporting the selection
          if (this.__supportsSingleSelection__P_88_5(formItem)) {
            validatorResult = !!formItem.getSelection()[0];
          } else if (this.__supportsDataBindingSelection__P_88_7(formItem)) {
            validatorResult = formItem.getSelection().getLength() > 0;
          } else {
            var value = formItem.getValue();
            validatorResult = !!value || value === 0;
          }
          formItem.setValid(validatorResult);
          var individualMessage = formItem.getRequiredInvalidMessage();
          var message = individualMessage ? individualMessage : this.getRequiredFieldMessage();
          formItem.setInvalidMessage(message);
          return validatorResult;
        }
        return true;
      },
      /**
       * Validates a form item. This method handles the differences of
       * synchronous and asynchronous validation and returns the result of the
       * validation if possible (synchronous cases). If the validation is
       * asynchronous, null will be returned.
       *
       * @param dataEntry {Object} The map stored in {@link #add}
       * @param value {var} The currently set value
       * @return {Boolean|null} Validation result or <code>null</code> for async
       * validation
       */
      _validateItem(dataEntry, value) {
        var formItem = dataEntry.item;
        var context = dataEntry.context;
        var validator = dataEntry.validator;

        // check for asynchronous validation
        if (this.__isAsyncValidator__P_88_8(validator)) {
          // used to check if all async validations are done
          this.__asyncResults__P_88_1[formItem.toHashCode()] = null;
          validator.validate(formItem, formItem.getValue(), this, context);
          return null;
        }
        var validatorResult = null;
        try {
          var validatorResult = validator.call(context || this, value, formItem);
          if (validatorResult === undefined) {
            validatorResult = true;
          }
        } catch (e) {
          if (e instanceof qx.core.ValidationError) {
            validatorResult = false;
            if (e.message && e.message != qx.type.BaseError.DEFAULTMESSAGE) {
              var invalidMessage = e.message;
            } else {
              var invalidMessage = e.getComment();
            }
            formItem.setInvalidMessage(invalidMessage);
          } else {
            throw e;
          }
        }
        formItem.setValid(validatorResult);
        dataEntry.valid = validatorResult;
        return validatorResult;
      },
      /**
       * Validates the form. It checks for asynchronous validation and handles
       * the differences to synchronous validation. If no form validator is given,
       * true will be returned. If a synchronous validator is given, the
       * validation result will be returned. In asynchronous cases, null will be
       * returned cause the result is not available.
       *
       * @param items {qx.ui.core.Widget[]} An array of all form items.
       * @return {Boolean|null} description
       */
      __validateForm__P_88_6(items) {
        var formValidator = this.getValidator();
        var context = this.getContext() || this;
        if (formValidator == null) {
          return true;
        }

        // reset the invalidMessage
        this.setInvalidMessage("");
        if (this.__isAsyncValidator__P_88_8(formValidator)) {
          this.__asyncResults__P_88_1[this.toHashCode()] = null;
          formValidator.validateForm(items, this, context);
          return null;
        }
        try {
          var formValid = formValidator.call(context, items, this);
          if (formValid === undefined) {
            formValid = true;
          }
        } catch (e) {
          if (e instanceof qx.core.ValidationError) {
            formValid = false;
            if (e.message && e.message != qx.type.BaseError.DEFAULTMESSAGE) {
              var invalidMessage = e.message;
            } else {
              var invalidMessage = e.getComment();
            }
            this.setInvalidMessage(invalidMessage);
          } else {
            throw e;
          }
        }
        return formValid;
      },
      /**
       * Helper function which checks, if the given validator is synchronous
       * or asynchronous.
       *
       * @param validator {Function|qx.ui.form.validation.AsyncValidator}
       *   The validator to check.
       * @return {Boolean} True, if the given validator is asynchronous.
       */
      __isAsyncValidator__P_88_8(validator) {
        var async = false;
        if (!qx.lang.Type.isFunction(validator)) {
          async = qx.Class.isSubClassOf(validator.constructor, qx.ui.form.validation.AsyncValidator);
        }
        return async;
      },
      /**
       * Returns true, if the given item implements the {@link qx.ui.form.IForm}
       * interface.
       *
       * @param formItem {qx.core.Object} The item to check.
       * @return {Boolean} true, if the given item implements the
       *   necessary interface.
       */
      __supportsInvalid__P_88_4(formItem) {
        var clazz = formItem.constructor;
        return qx.Class.hasInterface(clazz, qx.ui.form.IForm);
      },
      /**
       * Returns true, if the given item implements the
       * {@link qx.ui.core.ISingleSelection} interface.
       *
       * @param formItem {qx.core.Object} The item to check.
       * @return {Boolean} true, if the given item implements the
       *   necessary interface.
       */
      __supportsSingleSelection__P_88_5(formItem) {
        var clazz = formItem.constructor;
        return qx.Class.hasInterface(clazz, qx.ui.core.ISingleSelection);
      },
      /**
       * Returns true, if the given item implements the
       * {@link qx.data.controller.ISelection} interface.
       *
       * @param formItem {qx.core.Object} The item to check.
       * @return {Boolean} true, if the given item implements the
       *   necessary interface.
       */
      __supportsDataBindingSelection__P_88_7(formItem) {
        var clazz = formItem.constructor;
        return qx.Class.hasInterface(clazz, qx.data.controller.ISelection);
      },
      /**
       * Sets the valid state of the manager. It generates the event if
       * necessary and stores the new value.
       *
       * @param value {Boolean|null} The new valid state of the manager.
       */
      _setValid(value) {
        this._showToolTip(value);
        var oldValue = this.__valid__P_88_2;
        this.__valid__P_88_2 = value;
        // check for the change event
        if (oldValue != value) {
          this.fireDataEvent("changeValid", value, oldValue);
        }
      },
      /**
       * Responsible for showing a tooltip in case the validation is done for
       * widgets based on qx.ui.core.Widget.
       * @param valid {Boolean} <code>false</code>, if the tooltip should be shown
       */
      _showToolTip(valid) {
        // ignore if we don't have a tooltip manager e.g. mobile apps
        if (!qx.ui.tooltip || !qx.ui.tooltip.Manager) {
          return;
        }
        var tooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
        if (!valid) {
          var firstInvalid;
          for (var i = 0; i < this.__formItems__P_88_0.length; i++) {
            var item = this.__formItems__P_88_0[i].item;
            if (!item.isValid()) {
              firstInvalid = item;
              // only for desktop widgets
              if (!item.getContentLocation) {
                return;
              }
              // only consider items on the screen
              if (item.isSeeable() === false) {
                continue;
              }
              let msg = item.getInvalidMessage();
              if (msg && qx.core.Environment.get("qx.ui.form.validation.Manager.allowDefaultInvalidMessage")) {
                msg = qx.locale.Manager.tr("Invalid field");
              } else {
                this.assertTrue(msg != null && msg.length > 0);
              }
              tooltip.setLabel(msg);
              if (tooltip.getPlaceMethod() == "mouse") {
                var location = item.getContentLocation();
                var top = location.top - tooltip.getOffsetTop();
                tooltip.placeToPoint({
                  left: location.right,
                  top: top
                });
              } else {
                tooltip.placeToWidget(item);
              }
              tooltip.show();
              return;
            }
          }
        } else {
          tooltip.exclude();
        }
      },
      /**
       * Returns the valid state of the manager.
       *
       * @return {Boolean|null} The valid state of the manager.
       */
      getValid() {
        return this.__valid__P_88_2;
      },
      /**
       * Returns the valid state of the manager.
       *
       * @return {Boolean|null} The valid state of the manager.
       */
      isValid() {
        return this.getValid();
      },
      /**
       * Returns an array of all invalid messages of the invalid form items and
       * the form manager itself.
       *
       * @return {String[]} All invalid messages.
       */
      getInvalidMessages() {
        var messages = [];
        // combine the messages of all form items
        for (var i = 0; i < this.__formItems__P_88_0.length; i++) {
          var formItem = this.__formItems__P_88_0[i].item;
          if (!formItem.getValid()) {
            let msg = formItem.getInvalidMessage();
            if (!msg && qx.core.Environment.get("qx.ui.form.validation.Manager.allowDefaultInvalidMessage")) {
              msg = qx.locale.Manager.tr("Invalid field");
            } else {
              this.assertTrue(msg !== null && msg.length > 0);
            }
            messages.push(msg);
          }
        }

        // add the forms fail message
        if (!this.isValid()) {
          let msg = this.getInvalidMessage();
          if (msg != "") {
            messages.push(msg);
          }
        }
        return messages;
      },
      /**
       * Selects invalid form items
       *
       * @return {Array} invalid form items
       */
      getInvalidFormItems() {
        var res = [];
        for (var i = 0; i < this.__formItems__P_88_0.length; i++) {
          var formItem = this.__formItems__P_88_0[i].item;
          if (!formItem.getValid()) {
            res.push(formItem);
          }
        }
        return res;
      },
      /**
       * Resets the validator.
       */
      reset() {
        // reset all form items
        for (var i = 0; i < this.__formItems__P_88_0.length; i++) {
          var dataEntry = this.__formItems__P_88_0[i];
          // set the field to valid
          dataEntry.item.setValid(true);
        }
        // set the manager to its initial valid value
        this.__valid__P_88_2 = null;
        this._showToolTip(true);
      },
      /**
       * Internal helper method to set the given item to valid for asynchronous
       * validation calls. This indirection is used to determinate if the
       * validation process is completed or if other asynchronous validators
       * are still validating. {@link #__checkValidationComplete} checks if the
       * validation is complete and will be called at the end of this method.
       *
       * @param formItem {qx.ui.core.Widget} The form item to set the valid state.
       * @param valid {Boolean} The valid state for the form item.
       *
       * @internal
       */
      setItemValid(formItem, valid) {
        // store the result
        this.__asyncResults__P_88_1[formItem.toHashCode()] = valid;
        formItem.setValid(valid);
        this.__checkValidationComplete__P_88_9();
      },
      /**
       * Internal helper method to set the form manager to valid for asynchronous
       * validation calls. This indirection is used to determinate if the
       * validation process is completed or if other asynchronous validators
       * are still validating. {@link #__checkValidationComplete} checks if the
       * validation is complete and will be called at the end of this method.
       *
       * @param valid {Boolean} The valid state for the form manager.
       *
       * @internal
       */
      setFormValid(valid) {
        this.__asyncResults__P_88_1[this.toHashCode()] = valid;
        this.__checkValidationComplete__P_88_9();
      },
      /**
       * Checks if all asynchronous validators have validated so the result
       * is final and the {@link #complete} event can be fired. If that's not
       * the case, nothing will happen in the method.
       */
      __checkValidationComplete__P_88_9() {
        var valid = this.__syncValid__P_88_3;

        // check if all async validators are done
        for (var hash in this.__asyncResults__P_88_1) {
          var currentResult = this.__asyncResults__P_88_1[hash];
          valid = currentResult && valid;
          // the validation is not done so just do nothing
          if (currentResult == null) {
            return;
          }
        }
        // set the actual valid state of the manager
        this._setValid(valid);
        // reset the results
        this.__asyncResults__P_88_1 = {};
        // fire the complete event (no entry in the results with null)
        this.fireEvent("complete");
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct() {
      this._showToolTip(true);
      this.__formItems__P_88_0 = null;
    },
    environment: {
      // Whether to assume a default "Invalid Field" message for invalid fields; if false, an
      //  exception will be raised if invalid fields do not have an `invalidMessage`
      "qx.ui.form.validation.Manager.allowDefaultInvalidMessage": true
    }
  });
  qx.ui.form.validation.Manager.$$dbClassInfo = $$dbClassInfo;
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
      "qx.ui.form.IField": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2009 1&1 Internet AG, Germany, http://www.1und1.de
       2017 Martijn Evers, The Netherlands
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
       * Martijn Evers (mever)
  
  ************************************************************************ */
  /**
   * The resetter is responsible for managing a set of fields and resetting these
   * fields on a {@link #reset} call. It can handle all form field implementing IField.
   */
  qx.Class.define("qx.ui.form.Resetter", {
    extend: qx.core.Object,
    construct() {
      qx.core.Object.constructor.call(this);
      this.__items__P_89_0 = [];
    },
    members: {
      __items__P_89_0: null,
      /**
       * Adding a field to the resetter will get its current value and store
       * it for resetting.
       *
       * @param field {qx.ui.form.IField} The field which should be added.
       * @throws {TypeError} When given argument is not a field.
       */
      add(field) {
        this.__typeCheck__P_89_1(field);
        this.__items__P_89_0.push({
          item: field,
          init: field.getValue()
        });
      },
      /**
       * Removes a field from the resetter.
       *
       * @param field {qx.ui.form.IField} The field which should be removed.
       * @throws {TypeError} When given argument is not a field.
       * @return {Boolean} <code>true</code>, if the field has been removed.
       */
      remove(field) {
        this.__typeCheck__P_89_1(field);
        for (var i = 0; i < this.__items__P_89_0.length; i++) {
          var storedItem = this.__items__P_89_0[i];
          if (storedItem.item === field) {
            this.__items__P_89_0.splice(i, 1);
            return true;
          }
        }
        return false;
      },
      /**
       * Resets all added fields to their initial value. The initial value
       * is the value in the widget during the {@link #add}.
       *
       * @return {null|Error} Returns an error when some fields could not be reset.
       */
      reset() {
        var dataEntry,
          e,
          errors = [];
        for (var i = 0; i < this.__items__P_89_0.length; i++) {
          dataEntry = this.__items__P_89_0[i];
          e = dataEntry.item.setValue(dataEntry.init);
          if (e && e instanceof Error) {
            errors.push(e);
          }
        }
        if (errors.length) {
          return new Error(errors.join(", "));
        } else {
          return null;
        }
      },
      /**
       * Resets a single given field. The field has to be added to the resetter
       * instance before. Otherwise, an error is thrown.
       *
       * @param field {qx.ui.form.IField} The field, which should be reset.
       * @throws {TypeError} When given argument is not a field.
       * @return {null|Error} Returns an error when the field value could not be set.
       */
      resetItem(field) {
        this.__typeCheck__P_89_1(field);
        for (var i = 0; i < this.__items__P_89_0.length; i++) {
          var dataEntry = this.__items__P_89_0[i];
          if (dataEntry.item === field) {
            return field.setValue(dataEntry.init);
          }
        }
        throw new Error("The given field has not been added.");
      },
      /**
       * Takes the current values of all added fields and uses these values as
       * init values for resetting.
       */
      redefine() {
        // go threw all added items
        for (var i = 0; i < this.__items__P_89_0.length; i++) {
          var item = this.__items__P_89_0[i].item;
          // set the new init value for the item
          this.__items__P_89_0[i].init = item.getValue();
        }
      },
      /**
       * Takes the current value of the given field and stores this value as init
       * value for resetting.
       *
       * @param field {qx.ui.form.IField} The field to redefine.
       * @throws {TypeError} When given argument is not a field.
       */
      redefineItem(field) {
        this.__typeCheck__P_89_1(field);

        // get the data entry
        var dataEntry;
        for (var i = 0; i < this.__items__P_89_0.length; i++) {
          if (this.__items__P_89_0[i].item === field) {
            dataEntry = this.__items__P_89_0[i];
            dataEntry.init = dataEntry.item.getValue();
            return;
          }
        }
        throw new Error("The given field has not been added.");
      },
      /**
       * Assert when given argument is not a field.
       *
       * @param field {qx.ui.form.IField|var} Any argument that should be a field.
       * @throws {TypeError} When given argument is not a field.
       * @private
       */
      __typeCheck__P_89_1(field) {
        if (!qx.Class.hasInterface(field.constructor, qx.ui.form.IField)) {
          throw new TypeError("Field " + field + " not supported for resetting.");
        }
      }
    },
    /*
    *****************************************************************************
       DESTRUCTOR
    *****************************************************************************
    */
    destruct() {
      // holding references to widgets --> must set to null
      this.__items__P_89_0 = null;
    }
  });
  qx.ui.form.Resetter.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Bootstrap": {
        "usage": "dynamic",
        "require": true
      },
      "qx.util.StringEscape": {},
      "qx.lang.Object": {
        "defer": "runtime"
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
   * A Collection of utility functions to escape and unescape strings.
   */
  qx.Bootstrap.define("qx.bom.String", {
    /*
    *****************************************************************************
       STATICS
    *****************************************************************************
    */

    statics: {
      /** Mapping of HTML entity names to the corresponding char code */
      TO_CHARCODE: {
        quot: 34,
        // " - double-quote
        amp: 38,
        // &
        lt: 60,
        // <
        gt: 62,
        // >

        // http://www.w3.org/TR/REC-html40/sgml/entities.html
        // ISO 8859-1 characters
        nbsp: 160,
        // no-break space
        iexcl: 161,
        // inverted exclamation mark
        cent: 162,
        // cent sign
        pound: 163,
        // pound sterling sign
        curren: 164,
        // general currency sign
        yen: 165,
        // yen sign
        brvbar: 166,
        // broken (vertical) bar
        sect: 167,
        // section sign
        uml: 168,
        // umlaut (dieresis)
        copy: 169,
        // copyright sign
        ordf: 170,
        // ordinal indicator, feminine
        laquo: 171,
        // angle quotation mark, left
        not: 172,
        // not sign
        shy: 173,
        // soft hyphen
        reg: 174,
        // registered sign
        macr: 175,
        // macron
        deg: 176,
        // degree sign
        plusmn: 177,
        // plus-or-minus sign
        sup2: 178,
        // superscript two
        sup3: 179,
        // superscript three
        acute: 180,
        // acute accent
        micro: 181,
        // micro sign
        para: 182,
        // pilcrow (paragraph sign)
        middot: 183,
        // middle dot
        cedil: 184,
        // cedilla
        sup1: 185,
        // superscript one
        ordm: 186,
        // ordinal indicator, masculine
        raquo: 187,
        // angle quotation mark, right
        frac14: 188,
        // fraction one-quarter
        frac12: 189,
        // fraction one-half
        frac34: 190,
        // fraction three-quarters
        iquest: 191,
        // inverted question mark
        Agrave: 192,
        // capital A, grave accent
        Aacute: 193,
        // capital A, acute accent
        Acirc: 194,
        // capital A, circumflex accent
        Atilde: 195,
        // capital A, tilde
        Auml: 196,
        // capital A, dieresis or umlaut mark
        Aring: 197,
        // capital A, ring
        AElig: 198,
        // capital AE diphthong (ligature)
        Ccedil: 199,
        // capital C, cedilla
        Egrave: 200,
        // capital E, grave accent
        Eacute: 201,
        // capital E, acute accent
        Ecirc: 202,
        // capital E, circumflex accent
        Euml: 203,
        // capital E, dieresis or umlaut mark
        Igrave: 204,
        // capital I, grave accent
        Iacute: 205,
        // capital I, acute accent
        Icirc: 206,
        // capital I, circumflex accent
        Iuml: 207,
        // capital I, dieresis or umlaut mark
        ETH: 208,
        // capital Eth, Icelandic
        Ntilde: 209,
        // capital N, tilde
        Ograve: 210,
        // capital O, grave accent
        Oacute: 211,
        // capital O, acute accent
        Ocirc: 212,
        // capital O, circumflex accent
        Otilde: 213,
        // capital O, tilde
        Ouml: 214,
        // capital O, dieresis or umlaut mark
        times: 215,
        // multiply sign
        Oslash: 216,
        // capital O, slash
        Ugrave: 217,
        // capital U, grave accent
        Uacute: 218,
        // capital U, acute accent
        Ucirc: 219,
        // capital U, circumflex accent
        Uuml: 220,
        // capital U, dieresis or umlaut mark
        Yacute: 221,
        // capital Y, acute accent
        THORN: 222,
        // capital THORN, Icelandic
        szlig: 223,
        // small sharp s, German (sz ligature)
        agrave: 224,
        // small a, grave accent
        aacute: 225,
        // small a, acute accent
        acirc: 226,
        // small a, circumflex accent
        atilde: 227,
        // small a, tilde
        auml: 228,
        // small a, dieresis or umlaut mark
        aring: 229,
        // small a, ring
        aelig: 230,
        // small ae diphthong (ligature)
        ccedil: 231,
        // small c, cedilla
        egrave: 232,
        // small e, grave accent
        eacute: 233,
        // small e, acute accent
        ecirc: 234,
        // small e, circumflex accent
        euml: 235,
        // small e, dieresis or umlaut mark
        igrave: 236,
        // small i, grave accent
        iacute: 237,
        // small i, acute accent
        icirc: 238,
        // small i, circumflex accent
        iuml: 239,
        // small i, dieresis or umlaut mark
        eth: 240,
        // small eth, Icelandic
        ntilde: 241,
        // small n, tilde
        ograve: 242,
        // small o, grave accent
        oacute: 243,
        // small o, acute accent
        ocirc: 244,
        // small o, circumflex accent
        otilde: 245,
        // small o, tilde
        ouml: 246,
        // small o, dieresis or umlaut mark
        divide: 247,
        // divide sign
        oslash: 248,
        // small o, slash
        ugrave: 249,
        // small u, grave accent
        uacute: 250,
        // small u, acute accent
        ucirc: 251,
        // small u, circumflex accent
        uuml: 252,
        // small u, dieresis or umlaut mark
        yacute: 253,
        // small y, acute accent
        thorn: 254,
        // small thorn, Icelandic
        yuml: 255,
        // small y, dieresis or umlaut mark

        // Latin Extended-B
        fnof: 402,
        // latin small f with hook = function= florin, U+0192 ISOtech

        // Greek
        Alpha: 913,
        // greek capital letter alpha, U+0391
        Beta: 914,
        // greek capital letter beta, U+0392
        Gamma: 915,
        // greek capital letter gamma,U+0393 ISOgrk3
        Delta: 916,
        // greek capital letter delta,U+0394 ISOgrk3
        Epsilon: 917,
        // greek capital letter epsilon, U+0395
        Zeta: 918,
        // greek capital letter zeta, U+0396
        Eta: 919,
        // greek capital letter eta, U+0397
        Theta: 920,
        // greek capital letter theta,U+0398 ISOgrk3
        Iota: 921,
        // greek capital letter iota, U+0399
        Kappa: 922,
        // greek capital letter kappa, U+039A
        Lambda: 923,
        // greek capital letter lambda,U+039B ISOgrk3
        Mu: 924,
        // greek capital letter mu, U+039C
        Nu: 925,
        // greek capital letter nu, U+039D
        Xi: 926,
        // greek capital letter xi, U+039E ISOgrk3
        Omicron: 927,
        // greek capital letter omicron, U+039F
        Pi: 928,
        // greek capital letter pi, U+03A0 ISOgrk3
        Rho: 929,
        // greek capital letter rho, U+03A1

        // there is no Sigmaf, and no U+03A2 character either
        Sigma: 931,
        // greek capital letter sigma,U+03A3 ISOgrk3
        Tau: 932,
        // greek capital letter tau, U+03A4
        Upsilon: 933,
        // greek capital letter upsilon,U+03A5 ISOgrk3
        Phi: 934,
        // greek capital letter phi,U+03A6 ISOgrk3
        Chi: 935,
        // greek capital letter chi, U+03A7
        Psi: 936,
        // greek capital letter psi,U+03A8 ISOgrk3
        Omega: 937,
        // greek capital letter omega,U+03A9 ISOgrk3
        alpha: 945,
        // greek small letter alpha,U+03B1 ISOgrk3
        beta: 946,
        // greek small letter beta, U+03B2 ISOgrk3
        gamma: 947,
        // greek small letter gamma,U+03B3 ISOgrk3
        delta: 948,
        // greek small letter delta,U+03B4 ISOgrk3
        epsilon: 949,
        // greek small letter epsilon,U+03B5 ISOgrk3
        zeta: 950,
        // greek small letter zeta, U+03B6 ISOgrk3
        eta: 951,
        // greek small letter eta, U+03B7 ISOgrk3
        theta: 952,
        // greek small letter theta,U+03B8 ISOgrk3
        iota: 953,
        // greek small letter iota, U+03B9 ISOgrk3
        kappa: 954,
        // greek small letter kappa,U+03BA ISOgrk3
        lambda: 955,
        // greek small letter lambda,U+03BB ISOgrk3
        mu: 956,
        // greek small letter mu, U+03BC ISOgrk3
        nu: 957,
        // greek small letter nu, U+03BD ISOgrk3
        xi: 958,
        // greek small letter xi, U+03BE ISOgrk3
        omicron: 959,
        // greek small letter omicron, U+03BF NEW
        pi: 960,
        // greek small letter pi, U+03C0 ISOgrk3
        rho: 961,
        // greek small letter rho, U+03C1 ISOgrk3
        sigmaf: 962,
        // greek small letter final sigma,U+03C2 ISOgrk3
        sigma: 963,
        // greek small letter sigma,U+03C3 ISOgrk3
        tau: 964,
        // greek small letter tau, U+03C4 ISOgrk3
        upsilon: 965,
        // greek small letter upsilon,U+03C5 ISOgrk3
        phi: 966,
        // greek small letter phi, U+03C6 ISOgrk3
        chi: 967,
        // greek small letter chi, U+03C7 ISOgrk3
        psi: 968,
        // greek small letter psi, U+03C8 ISOgrk3
        omega: 969,
        // greek small letter omega,U+03C9 ISOgrk3
        thetasym: 977,
        // greek small letter theta symbol,U+03D1 NEW
        upsih: 978,
        // greek upsilon with hook symbol,U+03D2 NEW
        piv: 982,
        // greek pi symbol, U+03D6 ISOgrk3

        // General Punctuation
        bull: 8226,
        // bullet = black small circle,U+2022 ISOpub

        // bullet is NOT the same as bullet operator, U+2219
        hellip: 8230,
        // horizontal ellipsis = three dot leader,U+2026 ISOpub
        prime: 8242,
        // prime = minutes = feet, U+2032 ISOtech
        Prime: 8243,
        // double prime = seconds = inches,U+2033 ISOtech
        oline: 8254,
        // overline = spacing overscore,U+203E NEW
        frasl: 8260,
        // fraction slash, U+2044 NEW

        // Letterlike Symbols
        weierp: 8472,
        // script capital P = power set= Weierstrass p, U+2118 ISOamso
        image: 8465,
        // blackletter capital I = imaginary part,U+2111 ISOamso
        real: 8476,
        // blackletter capital R = real part symbol,U+211C ISOamso
        trade: 8482,
        // trade mark sign, U+2122 ISOnum
        alefsym: 8501,
        // alef symbol = first transfinite cardinal,U+2135 NEW

        // alef symbol is NOT the same as hebrew letter alef,U+05D0 although the same glyph could be used to depict both characters
        // Arrows
        larr: 8592,
        // leftwards arrow, U+2190 ISOnum
        uarr: 8593,
        // upwards arrow, U+2191 ISOnum-->
        rarr: 8594,
        // rightwards arrow, U+2192 ISOnum
        darr: 8595,
        // downwards arrow, U+2193 ISOnum
        harr: 8596,
        // left right arrow, U+2194 ISOamsa
        crarr: 8629,
        // downwards arrow with corner leftwards= carriage return, U+21B5 NEW
        lArr: 8656,
        // leftwards double arrow, U+21D0 ISOtech

        // ISO 10646 does not say that lArr is the same as the 'is implied by' arrow but also does not have any other character for that function. So ? lArr can be used for 'is implied by' as ISOtech suggests
        uArr: 8657,
        // upwards double arrow, U+21D1 ISOamsa
        rArr: 8658,
        // rightwards double arrow,U+21D2 ISOtech

        // ISO 10646 does not say this is the 'implies' character but does not have another character with this function so ?rArr can be used for 'implies' as ISOtech suggests
        dArr: 8659,
        // downwards double arrow, U+21D3 ISOamsa
        hArr: 8660,
        // left right double arrow,U+21D4 ISOamsa

        // Mathematical Operators
        forall: 8704,
        // for all, U+2200 ISOtech
        part: 8706,
        // partial differential, U+2202 ISOtech
        exist: 8707,
        // there exists, U+2203 ISOtech
        empty: 8709,
        // empty set = null set = diameter,U+2205 ISOamso
        nabla: 8711,
        // nabla = backward difference,U+2207 ISOtech
        isin: 8712,
        // element of, U+2208 ISOtech
        notin: 8713,
        // not an element of, U+2209 ISOtech
        ni: 8715,
        // contains as member, U+220B ISOtech

        // should there be a more memorable name than 'ni'?
        prod: 8719,
        // n-ary product = product sign,U+220F ISOamsb

        // prod is NOT the same character as U+03A0 'greek capital letter pi' though the same glyph might be used for both
        sum: 8721,
        // n-ary summation, U+2211 ISOamsb

        // sum is NOT the same character as U+03A3 'greek capital letter sigma' though the same glyph might be used for both
        minus: 8722,
        // minus sign, U+2212 ISOtech
        lowast: 8727,
        // asterisk operator, U+2217 ISOtech
        radic: 8730,
        // square root = radical sign,U+221A ISOtech
        prop: 8733,
        // proportional to, U+221D ISOtech
        infin: 8734,
        // infinity, U+221E ISOtech
        ang: 8736,
        // angle, U+2220 ISOamso
        and: 8743,
        // logical and = wedge, U+2227 ISOtech
        or: 8744,
        // logical or = vee, U+2228 ISOtech
        cap: 8745,
        // intersection = cap, U+2229 ISOtech
        cup: 8746,
        // union = cup, U+222A ISOtech
        int: 8747,
        // integral, U+222B ISOtech
        there4: 8756,
        // therefore, U+2234 ISOtech
        sim: 8764,
        // tilde operator = varies with = similar to,U+223C ISOtech

        // tilde operator is NOT the same character as the tilde, U+007E,although the same glyph might be used to represent both
        cong: 8773,
        // approximately equal to, U+2245 ISOtech
        asymp: 8776,
        // almost equal to = asymptotic to,U+2248 ISOamsr
        ne: 8800,
        // not equal to, U+2260 ISOtech
        equiv: 8801,
        // identical to, U+2261 ISOtech
        le: 8804,
        // less-than or equal to, U+2264 ISOtech
        ge: 8805,
        // greater-than or equal to,U+2265 ISOtech
        sub: 8834,
        // subset of, U+2282 ISOtech
        sup: 8835,
        // superset of, U+2283 ISOtech

        // note that nsup, 'not a superset of, U+2283' is not covered by the Symbol font encoding and is not included. Should it be, for symmetry?It is in ISOamsn  --> <!ENTITY nsub": 8836,  //not a subset of, U+2284 ISOamsn
        sube: 8838,
        // subset of or equal to, U+2286 ISOtech
        supe: 8839,
        // superset of or equal to,U+2287 ISOtech
        oplus: 8853,
        // circled plus = direct sum,U+2295 ISOamsb
        otimes: 8855,
        // circled times = vector product,U+2297 ISOamsb
        perp: 8869,
        // up tack = orthogonal to = perpendicular,U+22A5 ISOtech
        sdot: 8901,
        // dot operator, U+22C5 ISOamsb

        // dot operator is NOT the same character as U+00B7 middle dot
        // Miscellaneous Technical
        lceil: 8968,
        // left ceiling = apl upstile,U+2308 ISOamsc
        rceil: 8969,
        // right ceiling, U+2309 ISOamsc
        lfloor: 8970,
        // left floor = apl downstile,U+230A ISOamsc
        rfloor: 8971,
        // right floor, U+230B ISOamsc
        lang: 9001,
        // left-pointing angle bracket = bra,U+2329 ISOtech

        // lang is NOT the same character as U+003C 'less than' or U+2039 'single left-pointing angle quotation mark'
        rang: 9002,
        // right-pointing angle bracket = ket,U+232A ISOtech

        // rang is NOT the same character as U+003E 'greater than' or U+203A 'single right-pointing angle quotation mark'
        // Geometric Shapes
        loz: 9674,
        // lozenge, U+25CA ISOpub

        // Miscellaneous Symbols
        spades: 9824,
        // black spade suit, U+2660 ISOpub

        // black here seems to mean filled as opposed to hollow
        clubs: 9827,
        // black club suit = shamrock,U+2663 ISOpub
        hearts: 9829,
        // black heart suit = valentine,U+2665 ISOpub
        diams: 9830,
        // black diamond suit, U+2666 ISOpub

        // Latin Extended-A
        OElig: 338,
        //  -- latin capital ligature OE,U+0152 ISOlat2
        oelig: 339,
        //  -- latin small ligature oe, U+0153 ISOlat2

        // ligature is a misnomer, this is a separate character in some languages
        Scaron: 352,
        //  -- latin capital letter S with caron,U+0160 ISOlat2
        scaron: 353,
        //  -- latin small letter s with caron,U+0161 ISOlat2
        Yuml: 376,
        //  -- latin capital letter Y with diaeresis,U+0178 ISOlat2

        // Spacing Modifier Letters
        circ: 710,
        //  -- modifier letter circumflex accent,U+02C6 ISOpub
        tilde: 732,
        // small tilde, U+02DC ISOdia

        // General Punctuation
        ensp: 8194,
        // en space, U+2002 ISOpub
        emsp: 8195,
        // em space, U+2003 ISOpub
        thinsp: 8201,
        // thin space, U+2009 ISOpub
        zwnj: 8204,
        // zero width non-joiner,U+200C NEW RFC 2070
        zwj: 8205,
        // zero width joiner, U+200D NEW RFC 2070
        lrm: 8206,
        // left-to-right mark, U+200E NEW RFC 2070
        rlm: 8207,
        // right-to-left mark, U+200F NEW RFC 2070
        ndash: 8211,
        // en dash, U+2013 ISOpub
        mdash: 8212,
        // em dash, U+2014 ISOpub
        lsquo: 8216,
        // left single quotation mark,U+2018 ISOnum
        rsquo: 8217,
        // right single quotation mark,U+2019 ISOnum
        sbquo: 8218,
        // single low-9 quotation mark, U+201A NEW
        ldquo: 8220,
        // left double quotation mark,U+201C ISOnum
        rdquo: 8221,
        // right double quotation mark,U+201D ISOnum
        bdquo: 8222,
        // double low-9 quotation mark, U+201E NEW
        dagger: 8224,
        // dagger, U+2020 ISOpub
        Dagger: 8225,
        // double dagger, U+2021 ISOpub
        permil: 8240,
        // per mille sign, U+2030 ISOtech
        lsaquo: 8249,
        // single left-pointing angle quotation mark,U+2039 ISO proposed
        // lsaquo is proposed but not yet ISO standardized
        rsaquo: 8250,
        // single right-pointing angle quotation mark,U+203A ISO proposed
        // rsaquo is proposed but not yet ISO standardized
        euro: 8364 //  -- euro sign, U+20AC NEW
      },
      /**
       * Escapes the characters in a <code>String</code> using HTML entities.
       *
       * For example: <tt>"bread" & "butter"</tt> => <tt>&amp;quot;bread&amp;quot; &amp;amp; &amp;quot;butter&amp;quot;</tt>.
       * Supports all known HTML 4.0 entities, including funky accents.
       *
       * * <a href="http://www.w3.org/TR/REC-html32#latin1">HTML 3.2 Character Entities for ISO Latin-1</a>
       * * <a href="http://www.w3.org/TR/REC-html40/sgml/entities.html">HTML 4.0 Character entity references</a>
       * * <a href="http://www.w3.org/TR/html401/charset.html#h-5.3">HTML 4.01 Character References</a>
       * * <a href="http://www.w3.org/TR/html401/charset.html#code-position">HTML 4.01 Code positions</a>
       *
       * @param str {String} the String to escape
       * @return {String} a new escaped String
       * @see #unescape
       */
      escape(str) {
        return qx.util.StringEscape.escape(str, qx.bom.String.FROM_CHARCODE);
      },
      /**
       * Unescapes a string containing entity escapes to a string
       * containing the actual Unicode characters corresponding to the
       * escapes. Supports HTML 4.0 entities.
       *
       * For example, the string "&amp;lt;Fran&amp;ccedil;ais&amp;gt;"
       * will become "&lt;Fran&ccedil;ais&gt;"
       *
       * If an entity is unrecognized, it is left alone, and inserted
       * verbatim into the result string. e.g. "&amp;gt;&amp;zzzz;x" will
       * become "&gt;&amp;zzzz;x".
       *
       * @param str {String} the String to unescape, may be null
       * @return {var} a new unescaped String
       * @see #escape
       */
      unescape(str) {
        return qx.util.StringEscape.unescape(str, qx.bom.String.TO_CHARCODE);
      },
      /**
       * Converts a plain text string into HTML.
       * This is similar to {@link #escape} but converts new lines to
       * <tt>&lt:br&gt:</tt> and preserves whitespaces.
       *
       * @param str {String} the String to convert
       * @return {String} a new converted String
       * @see #escape
       */
      fromText(str) {
        return qx.bom.String.escape(str).replace(/(  |\n)/g, function (chr) {
          var map = {
            "  ": " &nbsp;",
            "\n": "<br>"
          };
          return map[chr] || chr;
        });
      },
      /**
       * Converts HTML to plain text.
       *
       * * Strips all HTML tags
       * * converts <tt>&lt:br&gt:</tt> to new line
       * * unescapes HTML entities
       *
       * @param str {String} HTML string to converts
       * @return {String} plain text representation of the HTML string
       */
      toText(str) {
        return qx.bom.String.unescape(str.replace(/\s+|<([^>])+>/gi, function (chr)
        //return qx.bom.String.unescape(str.replace(/<\/?[^>]+(>|$)/gi, function(chr)
        {
          if (chr.indexOf("<br") === 0) {
            return "\n";
          } else if (chr.length > 0 && chr.replace(/^\s*/, "").replace(/\s*$/, "") == "") {
            return " ";
          } else {
            return "";
          }
        }));
      }
    },
    /*
    *****************************************************************************
       DEFER
    *****************************************************************************
    */

    defer(statics) {
      /** Mapping of char codes to HTML entity names */
      statics.FROM_CHARCODE = qx.lang.Object.invert(statics.TO_CHARCODE);
    }
  });
  qx.bom.String.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-33.js.map?dt=1791845587651
qx.$$packageData['33'] = {
  "locales": {},
  "resources": {},
  "translations": {
    "en": {}
  }
};
