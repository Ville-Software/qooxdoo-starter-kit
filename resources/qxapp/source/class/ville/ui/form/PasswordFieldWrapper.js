/**
 * PasswordFieldWrapper
 *
 * @childControl passwordfield {qx.ui.form.PasswordField}
 * @childControl sectionleft {qx.ui.core.Widget}
 * @childControl sectionright {ville.ui.form.ToggleActionIcon}
 */
qx.Class.define("ville.ui.form.PasswordFieldWrapper", {
    extend: qx.ui.core.Widget,

    construct(passwordfield, variant, sectionleft, sectionright) {
        super();

        var layout = new qx.ui.layout.Canvas();
        this._setLayout(layout);

        if (sectionleft != null) {
            this.setSectionLeft(sectionleft);
            this._createChildControl("inputsectionleft");
        }

        if (passwordfield != null) {
            passwordfield.getContentElement().removeClass("qx-abstract-field");
            passwordfield.getContentElement().removeClass("m_6c018570");
            this.setPasswordField(passwordfield);
            this._createChildControl("passwordfield");
        }

        if (sectionright != null) {
            this.setSectionRight(sectionright);
            this._createChildControl("inputsectionright");
            sectionright.addListener("changeValue", (e) => {
                if (e.getData()) {
                    passwordfield.getContentElement().setAttribute("type", "text");
                } else {
                    passwordfield.getContentElement().setAttribute("type", "password");
                }
            });
        }

        if (variant != null) {
            this.setVariant(variant);
        } else {
            this.initVariant();
        }

        //this.initSize();
        //this.initRadius();

    },

    properties: {

        // overridden
        appearance: {
            refine: true,
            init: "passwordfield-wrapper"
        },

        passwordField: {
            check: "qx.ui.form.PasswordField",
            nullable: false
        },

        variant: {
            init: "default",
            check: ["default", "filled", "light", "outline", "subtle", "transparent", "white"],
            apply: "_applyVariant",
            themeable: true,
            event: "changeVariant"
        },

        /*size: {
            init: "sm",
            check: ["xs", "sm", "md", "lg", "xl"],
            apply: "_applySize",
            nullable: true,
            themeable: true,
            event: "changeSize"
        },

        radius: {
            init: "md",
            check: ["xs", "sm", "md", "lg", "xl"],
            apply: "_applyRadius",
            nullable: true,
            themeable: true,
            event: "changeRadius"
        },*/

        sectionLeft: {
            check: "qx.ui.core.Widget",
            nullable: true
        },

        sectionRight: {
            check: "ville.ui.form.ToggleActionIcon",
            nullable: true
        }

    },

    members: {

        // overridden
        _createChildControlImpl(id, hash) {
            var control;

            switch (id) {
                case "passwordfield":
                    control = this.getPasswordField();
                    this._add(control);
                    break;

                case "inputsectionleft":
                    control = this.getSectionLeft();
                    control.setAnonymous(true);
                    control.getContentElement().setAttribute("data-position", "left");
                    this.getContentElement().setAttribute("data-with-left-section", true);
                    this._add(control, { left: 0 });
                    break;

                case "inputsectionright":
                    control = this.getSectionRight();
                    //control.setAnonymous(true);
                    control.getContentElement().setAttribute("data-position", "right");
                    this.getContentElement().setAttribute("data-with-right-section", true);
                    this._add(control, { right: 0 });
                    break;

            }

            return control || super._createChildControlImpl(id);
        },

        // property apply
        _applyVariant(value, old) {
            if (value) {
                var textfield = this.getChildControl("passwordfield");
                if (textfield) {
                    textfield.getContentElement().setAttribute("data-variant", value);
                    this.getContentElement().setAttribute("data-variant", value);
                }
            }
        }

        /*_applySize(value, old) {
            if (value) {
                var innerwrapper = this.getChildControl("innerwrapper");
                if (innerwrapper) {
                    this.setAttribute("data-size", value);
                    innerwrapper.setAttribute("data-size", value);
                    innerwrapper.setStyles({
                        "--input-height" : `var(--input-height-${value})`,
                        "--input-fz" : `var(--mantine-font-size-${value})`
                    });
                    var label = this.getLabel();
                    if (label) {
                        label.setSize(value);
                    }
                }
            }
        },*/

        /*_applyRadius(value, old) {
            if (value) {
                var innerwrapper = this.getChildControl("innerwrapper");
                if (innerwrapper) {
                    innerwrapper.setStyle("--input-radius", `var(--mantine-radius-${value})`);
                }
            }
        },*/

        // property apply
        /*_applySectionLeft(value, old) {
            var section = this.getChildControl("inputsectionleft");
            if (section) {
                if (old) {
                    section.getContentElement().removeAll();
                }

                if (value) {
                    section.add(value);
                    this.getContentElement().setAttribute("data-with-left-section", "true");
                } else {
                    this.getContentElement().removeAttribute("data-with-left-section");
                }
            }
        },

        _applySectionRight(value, old) {
            var section = this.getChildControl("inputsectionright");
            if (section) {
                if (old) {
                    section.getContentElement().removeAll();
                }

                if (value) {
                    section.add(value);
                    this.getContentElement().setAttribute("data-with-right-section", "true");
                } else {
                    this.getContentElement().removeAttribute("data-with-right-section");
                }
            }
        }*/

    }
  });
