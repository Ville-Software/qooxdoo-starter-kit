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
      "ville.ui.core.MWidget": {
        "require": true
      },
      "qx.ui.core.Widget": {},
      "qx.html.Element": {},
      "ville.ui.basic.Label": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Menu Button
   * @external(mantine/core/styles/UnstyledButton.css)
   * @external(mantine/core/styles/Menu.css)
   */
  qx.Class.define("ville.ui.menu.Button", {
    extend: qx.ui.menu.Button,
    include: ville.ui.core.MWidget,
    construct(label, variant, sectionLeft, sectionRight, component) {
      if (component != null) this.__componenttag__P_15_0 = component;
      qx.ui.menu.Button.constructor.call(this);
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      this.setCssUtilityClass("mantine-focus-auto m_99ac2aa1 mantine-Menu-item m_87cf2631 mantine-UnstyledButton-root");
      if (variant) {
        this.setVariant(variant);
      } else {
        this.initVariant();
      }
      if (sectionLeft != null) {
        this.setSectionLeft(sectionLeft);
      }
      if (label != null) {
        this.setLabel(label);
      }
      if (sectionRight != null) {
        this.setSectionRight(sectionRight);
      }
    },
    properties: {
      variant: {
        init: "default",
        check: ["default", "filled", "light", "outline", "subtle", "transparent", "white"],
        apply: "_applyVariant",
        themeable: true,
        event: "changeVariant"
      },
      sectionLeft: {
        check: "qx.ui.core.Widget",
        apply: "_applySectionLeft",
        nullable: true,
        themeable: true,
        event: "changeSectionLeft"
      },
      sectionRight: {
        check: "qx.ui.core.Widget",
        apply: "_applySectionRight",
        nullable: true,
        themeable: true,
        event: "changeSectionRight"
      }
    },
    members: {
      __componenttag__P_15_0: "button",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_15_0);
      },
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "label":
            control = new ville.ui.basic.Label(null, "div");
            control.setAnonymous(true);
            control.setCssUtilityClass("m_5476e0d3 mantine-Menu-itemLabel");
            this._add(control);
            break;
          case "sectionleft":
            control = new ville.ui.basic.Label(null, "div");
            control.setAnonymous(true);
            control.setCssUtilityClass("m_8b75e504 mantine-Menu-itemSection");
            control.setAttribute("data-position", "left");
            this._add(control);
            break;
          case "sectionright":
            control = new ville.ui.basic.Label();
            control.setAnonymous(true);
            control.setCssUtilityClass("m_8b75e504 mantine-Menu-itemSection");
            control.getContentElement().setAttribute("data-position", "right");
            this._add(control);
            break;
        }
        return control || ville.ui.menu.Button.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // property apply
      _applyVariant(value, old) {
        if (value) {
          this.setAttribute("data-variant", value);
        }
      },
      // overridden
      // Replaced by Section Left and Right
      _applyIcon(value, old) {},
      // overridden
      _applyShow(value, old) {},
      // overridden
      _applyLabel(value, old) {
        var label = this.getChildControl("label");
        if (label) {
          label.setValue(value);
        }
      },
      _applySectionLeft(value, old) {
        var section = this.getChildControl("sectionleft");
        if (section) {
          if (old) {
            section.removeAll();
          }
          if (value) {
            section.add(value);
            this.setAttribute("data-with-left-section", "true");
          } else {
            this.removeAttribute("data-with-left-section");
          }
        }
      },
      _applySectionRight(value, old) {
        var section = this.getChildControl("sectionright");
        if (section) {
          if (old) {
            section.removeAll();
          }
          if (value) {
            section.add(value);
            this.setAttribute("data-with-right-section", "true");
          } else {
            this.removeAttribute("data-with-right-section");
          }
        }
      }
    }
  });
  ville.ui.menu.Button.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Button.js.map?dt=1769806686066