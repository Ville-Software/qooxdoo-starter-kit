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
      "qx.ui.core.MChildrenHandling": {
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
   * Unstyled Button
   * @external(mantine/core/styles/UnstyledButton.css)
   */
  qx.Class.define("ville.ui.form.UnstyledButton", {
    extend: qx.ui.form.Button,
    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],
    construct(component, label) {
      if (component != null) this.__componenttag__P_87_0 = component;
      qx.ui.form.Button.constructor.call(this);
      this._setLayout(new qx.ui.layout.Basic());
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      this.setCssUtilityClass("m_87cf2631 mantine-UnstyledButton-root");
      if (this.__componenttag__P_87_0 !== "button") this.getContentElement().removeAttribute('type');
      if (label != null) this.getContentElement().setAttribute('html', label);
    },
    members: {
      __componenttag__P_87_0: "button",
      // overridden
      _createContentElement() {
        return new qx.html.Element(this.__componenttag__P_87_0);
      }
    }
  });
  ville.ui.form.UnstyledButton.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=UnstyledButton.js.map?dt=1769806689515