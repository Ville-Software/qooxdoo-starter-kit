(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.menu.Button": {
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
   * Button
   *
   *
   * Data attributes:
   * data-variant
   * data-disabled
   * data-loading
   * data-block
   *
   * @childControl inlineicon {qx.ui.core.Widget}
   *
   */
  qx.Class.define("ville.ui.menu.Button", {
    extend: qx.ui.menu.Button,
    construct(label, icon, command, menu, component) {
      if (component != null) {
        this.__componenttag__P_19_0 = component;
      }
      if (icon != null) {
        if (qx.lang.Type.isString(icon)) {
          qx.ui.menu.Button.constructor.call(this, label, icon, command, menu);
        } else {
          qx.ui.menu.Button.constructor.call(this, label, null, command, menu);
          this.setInlineIcon(icon);
          this._createChildControl("inlineicon");
        }
      } else {
        qx.ui.menu.Button.constructor.call(this, label, null, command, menu);
      }
    },
    properties: {
      inlineIcon: {
        check: "qx.ui.core.Widget",
        apply: "_applyInlineIcon",
        nullable: true,
        themeable: true,
        event: "changeInlineIcon"
      }
    },
    members: {
      __componenttag__P_19_0: "button",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_19_0);
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
        }
        return control || ville.ui.menu.Button.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      _applyEnabled(value, old) {
        ville.ui.menu.Button.superclass.prototype._applyEnabled.call(this, value, old);
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
    }
  });
  ville.ui.menu.Button.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Button.js.map?dt=1791841649761