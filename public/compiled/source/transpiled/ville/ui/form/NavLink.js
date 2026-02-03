(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "ville.ui.form.UnstyledToggleButton": {
        "construct": true,
        "require": true
      },
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * NavLink
   * @external(mantine/core/styles/UnstyledButton.css)
   * @external(mantine/core/styles/NavLink.css)
   */
  qx.Class.define("ville.ui.form.NavLink", {
    extend: ville.ui.form.UnstyledToggleButton,
    construct(label, component) {
      if (component != null) this.__componenttag__P_13_0 = component;
      ville.ui.form.UnstyledToggleButton.constructor.call(this);
      this.setCssUtilityClass("mantine-focus-auto m_f0824112 mantine-NavLink-root m_87cf2631 mantine-UnstyledButton-root");
      if (this.__componenttag__P_13_0 !== "button") {
        this.removeAttribute('type');
        this.removeAttribute('role');
      }
      if (label != null) {
        this.setAttribute('html', label);
      }
    },
    properties: {
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
      __componenttag__P_13_0: "a",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_13_0);
      },
      // property apply
      _applyHref(value) {
        // only apply if tag is an anchor "a"
        if (this.__componenttag__P_13_0 == "a") {
          if (value) {
            this.setAttribute("href", value);
            this.__clickpreventListnerId__P_13_1 = this.addListener("click", e => {
              e.preventDefault();
            });
          } else {
            this.removeAttribute("href");
            if (this.__clickpreventListnerId__P_13_1 != null) this.removeListener(this.__clickpreventListnerId__P_13_1);
          }
        }
      },
      // property apply
      _applyTarget(value) {
        // only apply if tag is an anchor "a"
        if (this.__componenttag__P_13_0 == "a") {
          if (value) {
            this.setAttribute("target", value);
          } else {
            this.removeAttribute("target");
          }
        }
      }
    }
  });
  ville.ui.form.NavLink.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=NavLink.js.map?dt=1769806686012