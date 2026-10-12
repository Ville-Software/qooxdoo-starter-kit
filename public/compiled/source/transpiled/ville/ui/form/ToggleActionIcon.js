(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.ToggleButton": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.Widget": {},
      "qx.html.Element": {},
      "ville.ui.core.InnerWrapper": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Button
   * @external(mantine/core/styles/UnstyledButton.css)
   * @external(mantine/core/styles/ActionIcon.css)
   */
  qx.Class.define("ville.ui.form.ToggleActionIcon", {
    extend: qx.ui.form.ToggleButton,
    construct(trueicon, falseicon, variant, component) {
      if (component) {
        this.__componenttag__P_96_0 = component;
      }
      qx.ui.form.ToggleButton.constructor.call(this);
      this.setCssUtilityClass("mantine-focus-auto mantine-active m_8d3f4000 mantine-ActionIcon-root m_87cf2631 mantine-UnstyledButton-root");
      if (trueicon) {
        this.setTrueIcon(trueicon);
      }
      if (falseicon) {
        this.setFalseIcon(falseicon);
      }
      if (variant) {
        this.setVariant(variant);
      }
      var innerwrapper = this.getChildControl("innerwrapper");
      innerwrapper.add(trueicon);
      innerwrapper.add(falseicon);
      this.addListenerOnce("appear", e => {
        if (this.isValue()) {
          trueicon.getContentElement().setStyle("display", "block");
          falseicon.getContentElement().setStyle("display", "none");
        } else {
          trueicon.getContentElement().setStyle("display", "none");
          falseicon.getContentElement().setStyle("display", "block");
        }
      });

      // Add a change value listener to update the icon
      this.addListener("changeValue", e => {
        var innerwrapper = this.getChildControl("innerwrapper");
        if (this.isIconPathSwitch()) {
          // only replace the path d value in the svg inline icon
          var iwdom = innerwrapper.getContentElement().getDomElement();
          // get svg path node
          var pathnode = iwdom.firstChild.children[0];
          if (e.getData()) {
            pathnode.setAttribute("d", this.__trueiconpathd__P_96_1);
          } else {
            pathnode.setAttribute("d", this.__falseiconpathd__P_96_2);
          }
        } else {
          // replace entire svg inline icon
          //innerwrapper.removeAll();
          if (e.getData()) {
            //innerwrapper.add(this.getTrueIcon());
            trueicon.getContentElement().setStyle("display", "block");
            falseicon.getContentElement().setStyle("display", "none");
          } else {
            //innerwrapper.add(this.getFalseIcon());
            trueicon.getContentElement().setStyle("display", "none");
            falseicon.getContentElement().setStyle("display", "block");
          }
        }
      });
    },
    properties: {
      trueIcon: {
        check: "qx.ui.core.Widget",
        apply: "_applyTrueIcon",
        nullable: true,
        themeable: true
      },
      falseIcon: {
        check: "qx.ui.core.Widget",
        apply: "_applyFalseIcon",
        nullable: true,
        themeable: true
      },
      undefinedIcon: {
        check: "qx.ui.core.Widget",
        nullable: true,
        themeable: true
      },
      iconPathSwitch: {
        check: "Boolean",
        init: false,
        nullable: false
      },
      variant: {
        check: ["default", "filled", "light", "outline", "subtle", "transparent", "white"],
        init: "default",
        apply: "_applyVariant",
        themeable: true,
        event: "changeVariant"
      }
    },
    members: {
      __componenttag__P_96_0: "div",
      __trueiconpathd__P_96_1: null,
      __falseiconpathd__P_96_2: null,
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_96_0);
      },
      // overridden
      _createChildControlImpl(id, hash) {
        var control;
        switch (id) {
          case "innerwrapper":
            control = new ville.ui.core.InnerWrapper();
            control.setCssUtilityClass("m_8d3afb97 mantine-ActionIcon-icon");
            this._add(control);
            break;
        }
        return control || ville.ui.form.ToggleActionIcon.superclass.prototype._createChildControlImpl.call(this, id);
      },
      // property apply
      _applyVariant(value, old) {
        if (value) {
          this.getContentElement().setAttribute("data-variant", value);
        }
      },
      // property apply
      _applyTrueIcon(value, old) {
        if (value) {
          if (this.isIconPathSwitch()) {
            this.__trueiconpathd__P_96_1 = value.constructor.PATHD;
          }
        }
      },
      // property apply
      _applyFalseIcon(value, old) {
        if (value) {
          if (this.isIconPathSwitch()) {
            this.__falseiconpathd__P_96_2 = value.constructor.PATHD;
          }
        }
      },
      // overridden
      _applyLabel(value, old) {},
      // overridden
      _applyIcon(value, old) {},
      // overridden
      _applyShow(value, old) {}
    }
  });
  ville.ui.form.ToggleActionIcon.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=ToggleActionIcon.js.map?dt=1791841651286