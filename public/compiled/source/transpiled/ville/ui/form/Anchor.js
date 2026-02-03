(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.Button": {
        "construct": true,
        "require": true
      },
      "ville.ui.core.MWidget": {
        "require": true
      },
      "qx.ui.layout.Basic": {
        "construct": true
      },
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   *
   * @external(mantine/core/styles/Text.css)
   * @external(mantine/core/styles/Anchor.css)
   */
  qx.Class.define("ville.ui.form.Anchor", {
    extend: qx.ui.form.Button,
    include: ville.ui.core.MWidget,
    construct(label, component) {
      if (component) {
        this.__componenttag__P_23_0 = component;
      }
      qx.ui.form.Button.constructor.call(this);
      this._setLayout(new qx.ui.layout.Basic());
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      this.setCssUtilityClass("m_b6d8b162 m_849cf0da mantine-Text-root mantine-Anchor-root");
      if (component) if (component = "button") this.setAttribute('type', 'button');
      if (label) {
        this.setLabel(label);
      }
      this.initUnderline();
    },
    properties: {
      underline: {
        init: "hover",
        check: ["always", "hover", "not-hover", "never"],
        apply: "_applyUnderline",
        themeable: true,
        event: "changeUnderline"
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
      __componenttag__P_23_0: "a",
      __clickpreventListnerId__P_23_1: null,
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_23_0);
      },
      // overridden
      _applyLabel(value, old) {
        if (value) {
          this.setAttribute("html", value);
        }
      },
      _applyUnderline(value, old) {
        if (value) {
          this.setAttribute("data-underline", value);
        }
      },
      // property apply
      _applyHref(value) {
        if (value) {
          this.setAttribute("href", value);
          this.__clickpreventListnerId__P_23_1 = this.addListener("click", e => {
            e.preventDefault();
          });
        } else {
          this.removeAttribute("href");
          if (this.__clickpreventListnerId__P_23_1 != null) this.removeListener(this.__clickpreventListnerId__P_23_1);
        }
      },
      // property apply
      _applyTarget(value) {
        if (value) {
          this.setAttribute("target", value);
        } else {
          this.removeAttribute("target");
        }
      }
    }
  });
  ville.ui.form.Anchor.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Anchor.js.map?dt=1769806686280