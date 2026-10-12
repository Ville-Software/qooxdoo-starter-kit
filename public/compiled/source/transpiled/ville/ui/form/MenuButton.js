(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.MenuButton": {
        "construct": true,
        "require": true
      },
      "qx.lang.Type": {
        "construct": true
      },
      "qx.ui.core.Widget": {},
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * A button which opens the connected menu when tapping on it.
   * @external(mantine/core/styles/UnstyledButton.css)
   * @external(mantine/core/styles/Button.css)
   */
  qx.Class.define("ville.ui.form.MenuButton", {
    extend: qx.ui.form.MenuButton,
    construct(label, icon, menu, component) {
      if (component != null) {
        this.__componenttag__P_20_0 = component;
      }
      if (icon != null) {
        if (qx.lang.Type.isString(icon)) {
          qx.ui.form.MenuButton.constructor.call(this, label, icon, menu);
        } else {
          qx.ui.form.MenuButton.constructor.call(this, label, null, menu);
          this.setInlineIcon(icon);
          this._createChildControl("inlineicon");
        }
      } else {
        qx.ui.form.MenuButton.constructor.call(this, label, null, menu);
      }

      /*if (arrowicon) {
          this.setArrowIcon(arrowicon);
          //this.setShowArrow(true);
      }*/
    },
    properties: {
      inlineIcon: {
        check: "qx.ui.core.Widget",
        apply: "_applyInlineIcon",
        nullable: true,
        themeable: true,
        event: "changeInlineIcon"
      },
      arrowIcon: {
        check: "qx.ui.core.Widget",
        init: null,
        nullable: true,
        themeable: true
      }

      /*showArrow: {
          check: "Boolean",
          init: false,
          apply: "_applyShowArrow",
          themeable: true,
          event: "changeShowArrow"
      }*/
    },
    members: {
      __componenttag__P_20_0: "button",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_20_0);
      },
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "inlineicon":
            control = this.getInlineIcon();
            control.setAnonymous(true);
            control.getContentElement().setAttribute("data-position", "left");
            this.getContentElement().setAttribute("data-with-left-section", true);
            this._add(control, {
              column: 0
            });
            if (control == null) {
              control.exclude();
            }
            break;

          /*case "arrowicon":
              // check to see if there is an icon, otherwise use default
              if (!this.getArrowIcon()) {
                  control = new ville.icon.phosphor.CaretDown(18);
                  //control.setViewBox("0 0 32 6");
                  this.setArrowIcon(control);
              } else {
                  control = this.getArrowIcon();
              }
              control.setAnonymous(true);
              this._add(control, { column: 3 });
               break;*/
        }
        return control || ville.ui.form.MenuButton.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      _applyEnabled(value, old) {
        ville.ui.form.MenuButton.superclass.prototype._applyEnabled.call(this, value, old);
        if (value === false) {
          // villeui-mantine attriubute setting
          this.getContentElement().setAttribute("data-disabled", true);
          //this.getContentElement().removeClass("mantine-active");
        } else {
          // villeui-mantine attriubute setting
          this.getContentElement().removeAttribute("data-disabled");
          //this.getContentElement().addClass("mantine-active");
        }
      },
      // property apply
      _applyInlineIcon(value, old) {
        if (this.getIcon() != null) {
          value.exclude();
        } else {
          if (old) this._removeAt(0);
          if (value) this.getChildControl("inlineicon", true);
        }
      },
      // overridden
      _handleIcon() {
        if (this.getIcon() == null) {
          this._excludeChildControl("icon");
        } else {
          this._showChildControl("icon");
        }
        if (this.getInlineIcon() == null) {
          this._excludeChildControl("inlineicon");
        } else {
          if (this.getIcon() == null) this._showChildControl("inlineicon");
        }
      },
      // property apply
      _applyVariant(value, old) {
        if (value) {
          this.getContentElement().setAttribute("data-variant", value);
        }
      }

      // property apply
      /*_applyShowArrow(value) {
          if (value) {
              var arrowicon = this.getChildControl("arrowicon", true);
              if (arrowicon)
                  arrowicon.show();
              else
                  arrowicon.exclude();
          }
      }*/
    }
  });
  ville.ui.form.MenuButton.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=MenuButton.js.map?dt=1791841649767