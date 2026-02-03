/**
 * TextField
 * @external(mantine/core/styles/PasswordInput.css)
 */
qx.Class.define("ville.ui.form.PasswordField", {
    extend: qx.ui.form.PasswordField,

    include: ville.ui.core.MWidget,

    construct() {
        super();

        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);
        this.setRemoveCssClasses(["qx-abstract-field", "qx-placeholder-color"]);
        this.setCssUtilityClass("m_f2d85dd2 mantine-PasswordInput-innerInput");
    }
  });
