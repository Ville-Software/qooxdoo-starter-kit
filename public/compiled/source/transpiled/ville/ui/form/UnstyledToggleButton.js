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
  qx.Class.define("ville.ui.form.UnstyledToggleButton", {
    extend: qx.ui.form.ToggleButton,
    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],
    construct(label) {
      qx.ui.form.ToggleButton.constructor.call(this);
      this._setLayout(new qx.ui.layout.Basic());
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      this.setCssUtilityClass("m_87cf2631 mantine-UnstyledButton-root");
      this.getContentElement().setAttribute('type', 'button');
      if (label) {
        this.getContentElement().setAttribute('html', label);
      }
    },
    members: {
      // overridden
      _createContentElement() {
        return new qx.html.Element("button");
      }
    }
  });
  ville.ui.form.UnstyledToggleButton.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=UnstyledToggleButton.js.map?dt=1769806688315