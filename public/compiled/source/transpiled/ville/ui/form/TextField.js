(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.TextField": {
        "construct": true,
        "require": true
      },
      "ville.ui.core.MWidget": {
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * TextField
   * @external(mantine/core/styles/Input.css)
   */
  qx.Class.define("ville.ui.form.TextField", {
    extend: qx.ui.form.TextField,
    include: ville.ui.core.MWidget,
    construct() {
      qx.ui.form.TextField.constructor.call(this);
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      this.setRemoveCssClasses(["qx-abstract-field", "qx-placeholder-color"]);
      this.setCssUtilityClass("m_8fb7ebe7 mantine-Input-input mantine-TextInput-input");
    }
  });
  ville.ui.form.TextField.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=TextField.js.map?dt=1769806686570