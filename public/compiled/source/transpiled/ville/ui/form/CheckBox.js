(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "ville.ui.icon.tabler.IconCheck": {
        "require": true
      },
      "ville.ui.icon.tabler.IconIndeterminate": {
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.CheckBox": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.Widget": {},
      "ville.ui.core.InnerWrapper": {},
      "ville.ui.core.BaseWidget": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * CheckBox
   *
   * Data Attributes (defaults)
   *  data-size="sm"
   *
   * @external(mantine/core/styles/Checkbox.css)
   * @require(ville.ui.icon.tabler.IconCheck)
   * @require(ville.ui.icon.tabler.IconIndeterminate)
   */
  qx.Class.define("ville.ui.form.CheckBox", {
    extend: qx.ui.form.CheckBox,
    construct(label, alticon, altindeterminateicon) {
      qx.ui.form.CheckBox.constructor.call(this, label);
      var cbinput = this.getChildControl("input");
      if (alticon) this.setInlineIcon(alticon);
      if (altindeterminateicon) this.setIndeterminateIcon(altindeterminateicon);
      this._createChildControl("icon");
      this._createChildControl("indeterminateicon");

      // Set attributes
      this.getContentElement().setAttributes({
        "data-variant": this.getVariant()
      });

      /* If I can figure out how to expose qx.html.Input classes checked value
      * then I will want to use single binding feature
      * this.bind("value", cbinput, "checked");
      * cbinput.bind("checked", this, "value");
      * */

      // Sync up input to checkbox value on inital load
      this.addListenerOnce("appear", () => {
        var value = this.getValue();
        var cbinputelem = cbinput.getContentElement();
        if (this.isTriState() && value == null) {
          // replace entire svg inline icon
          cbinputelem.setAttribute("data-indeterminate", "true");
          cbinputelem.getDomElement().indeterminate = true;
        } else if (this.isTriState() && value) {
          cbinputelem.removeAttribute("data-indeterminate");
          cbinputelem.getDomElement().indeterminate = false;
          cbinputelem.getDomElement().checked = true;
        } else if (!this.isTriState()) {
          cbinput.getContentElement().getDomElement().indeterminate = false;
          cbinputelem.removeAttribute("data-indeterminate");
          if (value) cbinputelem.getDomElement().checked = true;else cbinputelem.getDomElement().checked = false;
        }
      });

      // Keep input and checkbox value in sync on value change
      this.addListener("changeValue", e => {
        var cbbody = this.getChildControl("body");
        if (this.isTriState() && e.getData() == null) {
          // replace entire svg inline icon
          cbinput.getContentElement().setAttribute("data-indeterminate", "true");
          cbbody.remove(this.getInlineIcon());
          cbbody.add(this.getIndeterminateIcon());
          cbinput.getContentElement().getDomElement().indeterminate = true;
        } else if (this.isTriState() && e.getData() && e.getOldData() == null) {
          cbinput.getContentElement().removeAttribute("data-indeterminate");
          cbbody.remove(this.getIndeterminateIcon());
          cbbody.add(this.getInlineIcon());
          cbinput.getContentElement().getDomElement().indeterminate = false;
          cbinput.getContentElement().getDomElement().checked = e.getData();
        } else if (!this.isTriState()) {
          cbinput.getContentElement().getDomElement().indeterminate = false;
          cbinput.getContentElement().getDomElement().checked = e.getData();
        }
      });
    },
    properties: {
      variant: {
        init: "filled",
        check: ["filled", "outline"],
        apply: "_applyVariant",
        themeable: true,
        event: "changeVariant"
      },
      inlineIcon: {
        check: "qx.ui.core.Widget",
        init: null,
        nullable: true,
        themeable: true
      },
      indeterminateIcon: {
        check: "qx.ui.core.Widget",
        init: null,
        nullable: true,
        themeable: true
      }
    },
    members: {
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        var cbbody;
        switch (id) {
          case "body":
            control = new ville.ui.core.InnerWrapper("div");
            control.setAnonymous(true);
            control.setCssUtilityClass("m_5f6e695e mantine-Checkbox-body");
            this._add(control);
            break;
          case "input":
            control = new ville.ui.core.BaseWidget({
              "basetag": "input",
              "type": "checkbox"
            });
            control.setAnonymous(true);
            cbbody = this.getChildControl("body");
            cbbody.add(control);
            break;
          case "icon":
            // check to see if there is an alternative icon, otherwise use default
            if (!this.getInlineIcon()) {
              control = new ville.ui.icon.tabler.IconCheck();
              control.setViewBox("0 0 10 7");
              this.setInlineIcon(control);
            } else {
              control = this.getInlineIcon();
            }
            control.setCssUtilityClass("m_bf295423 mantine-Checkbox-icon");
            control.getContentElement().setAttribute("aria-hidden", "true");
            control.setAnonymous(true);
            cbbody = this.getChildControl("body");
            cbbody.add(control);
            break;
          case "indeterminateicon":
            // check to see if there is an alternative icon, otherwise use default
            if (!this.getIndeterminateIcon()) {
              control = new ville.ui.icon.tabler.IconIndeterminate();
              control.setViewBox("0 0 32 6");
              this.setIndeterminateIcon(control);
            } else {
              control = this.getIndeterminateIcon();
            }
            control.setCssUtilityClass("m_bf295423 mantine-Checkbox-icon");
            control.getContentElement().setAttribute("aria-hidden", "true");
            control.setAnonymous(true);
            break;
        }
        return control || ville.ui.form.CheckBox.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // property apply
      _applyVariant(value, old) {
        if (value) {
          this.getContentElement().setAttribute("data-variant", value);
          var input = this.getChildControl("input");
          if (input) {
            if (value === "outline") {
              input.getContentElement().addClass("m_215c4542");
            } else {
              input.getContentElement().removeClass("m_215c4542");
            }
          }
        }
      },
      // overridden
      _applyIcon() {}
    }
  });
  ville.ui.form.CheckBox.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=CheckBox.js.map?dt=1791841649898