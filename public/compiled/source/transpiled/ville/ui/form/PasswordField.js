(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.form.PasswordField": {
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
   * @external(mantine/core/styles/PasswordInput.css)
   */
  qx.Class.define("ville.ui.form.PasswordField", {
    extend: qx.ui.form.PasswordField,
    include: ville.ui.core.MWidget,
    construct() {
      qx.ui.form.PasswordField.constructor.call(this);
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      this.setRemoveCssClasses(["qx-abstract-field", "qx-placeholder-color"]);
      this.setCssUtilityClass("m_f2d85dd2 mantine-PasswordInput-innerInput");
    }
  });
  ville.ui.form.PasswordField.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=PasswordField.js.map?dt=1769806686607