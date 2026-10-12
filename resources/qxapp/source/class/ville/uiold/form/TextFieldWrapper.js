/**
 * TextFieldWrapper
 * @childControl innerwrapper {ville.ui.core.InnerWrapper}
 * @childControl inputwrapper {ville.ui.core.InnerWrapper}
 * @childControl sectionleft {ville.ui.form.InputSection}
 * @childControl sectionright {ville.ui.form.InputSection}
 * @external(mantine/core/styles/Input.css)
 */
qx.Class.define("ville.ui.form.TextFieldWrapper", {
    extend: ville.ui.core.Widget,

    construct(textfield, variant, sectionleft, sectionright) {
        super();

        this.setCssUtilityClass("m_46b77525 mantine-InputWrapper-root mantine-TextInput-root");

        if (textfield) {
            this.setTextField(textfield);
        }

        if (variant) {
            this.setVariant(variant);
        } else {
            this.initVariant();
        }

        if (sectionleft) {
            this.setSectionLeft(sectionleft);
        }

        if (sectionright) {
            this.setSectionRight(sectionright);
        }

        this.initSize();
        this.initRadius();

    },

    properties: {

        textField: {
            check: "qx.ui.form.AbstractField",
            apply: "_applyTextField",
            nullable: false,
            event: "changeTextField"
        },

        variant: {
            init: "default",
            check: ["default", "filled", "light", "outline", "subtle", "transparent", "white"],
            apply: "_applyVariant",
            themeable: true,
            event: "changeVariant"
        },

        size: {
            init: "sm",
            check: ["xs", "sm", "md", "lg", "xl"],
            apply: "_applySize",
            nullable: true,
            themeable: true,
            event: "changeSize"
        },

        radius: {
            init: "sm",
            check: ["xs", "sm", "md", "lg", "xl"],
            apply: "_applyRadius",
            nullable: true,
            themeable: true,
            event: "changeRadius"
        },

        sectionLeft: {
            check: "qx.ui.core.Widget",
            apply: "_applySectionLeft",
            nullable: true,
            event: "changeSectionLeft"
        },

        sectionRight: {
            check: "qx.ui.core.Widget",
            apply: "_applySectionRight",
            nullable: true,
            event: "changeSectionRight"
        },

        nestLabel: {
            check: "Boolean",
            init: false,
            nullable: false,
            themeable: true
        },

        label: {
            check: "qx.ui.core.Widget",
            apply: "_applyLabel",
            nullable: true,
            event: "changeLabel"
        }

    },

    members: {

        // overridden
        _createContentElement() {
            return new qx.html.Element("div");
        },

        // overridden
        _createChildControlImpl(id, hash) {
            var control;
            var innerwrapper;

            switch (id) {
                case "innerwrapper":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_6c018570 mantine-Input-wrapper mantine-TextInput-wrapper");
                    this._add(control);
                    break;

                case "sectionleft":
                    control = new ville.ui.form.InputSection();
                    control.setAnonymous(true);
                    control.setCssUtilityClass("m_82577fc2 mantine-Input-section mantine-TextInput-section");
                    control.setAttribute("data-position", "left");
                    innerwrapper = this.getChildControl("innerwrapper");
                    innerwrapper.add(control);
                    break;

                case "sectionright":
                    control = new ville.ui.form.InputSection();
                    control.setAnonymous(true);
                    control.setCssUtilityClass("m_82577fc2 mantine-Input-section mantine-TextInput-section");
                    control.setAttribute("data-position", "right");
                    innerwrapper = this.getChildControl("innerwrapper");
                    innerwrapper.add(control);
                    break;

                case "inputwrapper":
                    control = new ville.ui.core.InnerWrapper("div");
                    control.setCssUtilityClass("m_8fb7ebe7 mantine-Input-input");
                    innerwrapper = this.getChildControl("innerwrapper");
                    innerwrapper.add(control);
                    break;
            }

            return control || super._createChildControlImpl(id);
        },

        // property apply
        _applyTextField(value, old) {
            if (value) {
                var innerwrapper = this.getChildControl("innerwrapper");
                if (innerwrapper) {
                    innerwrapper.add(value);
                }
            }
        },

        // property apply
        _applyLabel(value, old) {
            if (value) {
                var innerwrapper = this.getChildControl("innerwrapper");
                if (innerwrapper) {
                    if (!this.getNestLabel()) {
                        this._add(value);
                        value.getContentElement().moveTo(0);
                    } else {
                        value.add(innerwrapper);
                        this._add(value);
                    }
                }
            }
        },

        // property apply
        _applyVariant(value, old) {
            if (value) {
                var innerwrapper = this.getChildControl("innerwrapper");
                if (innerwrapper) {
                    innerwrapper.setAttribute("data-variant", value);
                }
            }
        },

        _applySize(value, old) {
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
        },

        _applyRadius(value, old) {
            if (value) {
                var innerwrapper = this.getChildControl("innerwrapper");
                if (innerwrapper) {
                    innerwrapper.setStyle("--input-radius", `var(--mantine-radius-${value})`);
                }
            }
        },

        // property apply
        _applySectionLeft(value, old) {
            var innerwrapper = this.getChildControl("innerwrapper");
            if (innerwrapper) {
                var section = this.getChildControl("sectionleft");
                if (section) {
                    if (old) {
                        section.removeAll();
                    }

                    if (value) {
                        section.add(value);
                        this.setAttribute("data-with-left-section", "true");
                    } else {
                        this.removeAttribute("data-with-left-section");
                    }
                }
            }
        },

        _applySectionRight(value, old) {
            var innerwrapper = this.getChildControl("innerwrapper");
            if (innerwrapper) {
                var section = this.getChildControl("sectionright");
                if (section) {
                    if (old) {
                        section.removeAll();
                    }

                    if (value) {
                        section.add(value);
                        this.setAttribute("data-with-right-section", "true");
                    } else {
                        this.removeAttribute("data-with-right-section");
                    }
                }
            }
        }

    }
  });
