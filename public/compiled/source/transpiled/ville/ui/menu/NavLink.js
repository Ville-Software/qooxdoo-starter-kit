(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.menu.RadioButton": {
        "construct": true,
        "require": true
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
  qx.Class.define("ville.ui.menu.NavLink", {
    extend: qx.ui.menu.RadioButton,
    construct(label, menu, component) {
      if (component != null) {
        this.__componenttag__P_18_0 = component;
      }
      qx.ui.menu.RadioButton.constructor.call(this, label, menu);

      /*if (icon != null) {
          if (qx.lang.Type.isString(icon)) {
              super(label, icon, command, menu);
          } else {
              super(label, null, command, menu);
              this.setInlineIcon(icon);
              this._createChildControl("inlineicon");
          }
      } else {
          super(label, null, command, menu);
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
      // overridden
      appearance: {
        refine: true,
        init: "menu-navlink"
      },
      href: {
        apply: "_applyHref",
        nullable: true,
        check: "String"
      },
      target: {
        apply: "_applyTarget",
        nullable: true,
        check: "String"
      }
    },
    members: {
      __componenttag__P_18_0: "a",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_18_0);
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
        return control || ville.ui.menu.NavLink.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // overridden
      _applyEnabled(value, old) {
        ville.ui.menu.NavLink.superclass.prototype._applyEnabled.call(this, value, old);
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
      /*_handleIcon() {
           if (this.getIcon() == null) {
               this._excludeChildControl("icon");
           } else {
               this._showChildControl("icon");
           }
            if (this.getInlineIcon() == null) {
               this._excludeChildControl("inlineicon");
           } else {
               if (this.getIcon() == null)
                   this._showChildControl("inlineicon");
           }
       },*/

      // property apply
      _applyVariant(value, old) {
        if (value) {
          this.getContentElement().setAttribute("data-variant", value);
        }
      },
      // property apply
      _applyHref(value) {
        // only apply if tag is an anchor "a"
        if (this.__componenttag__P_18_0 === "a") {
          if (value) {
            this.getContentElement().setAttribute("href", value);
            this.__clickpreventListnerId__P_18_1 = this.addListener("click", e => {
              e.preventDefault();
            });
          } else {
            this.getContentElement().removeAttribute("href");
            if (this.__clickpreventListnerId__P_18_1 !== null) this.getContentElement().removeListener(this.__clickpreventListnerId__P_18_1);
          }
        }
      },
      // property apply
      _applyTarget(value) {
        // only apply if tag is an anchor "a"
        if (this.__componenttag__P_18_0 === "a") {
          if (value) {
            this.getContentElement().setAttribute("target", value);
          } else {
            this.getContentElement().removeAttribute("target");
          }
        }
      }
    }
  });
  ville.ui.menu.NavLink.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=NavLink.js.map?dt=1791841649756