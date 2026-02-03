/**
 * TextField
 * @external(mantine/core/styles/Input.css)
 */
qx.Class.define("ville.ui.form.TextField", {
    extend: qx.ui.form.TextField,

    include: ville.ui.core.MWidget,

    construct() {
        super();

        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);
        this.setRemoveCssClasses(["qx-abstract-field", "qx-placeholder-color"]);
        this.setCssUtilityClass("m_8fb7ebe7 mantine-Input-input mantine-TextInput-input");
    }
  });
