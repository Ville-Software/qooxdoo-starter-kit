/**
 * TextInput
 * @childControl textfield {qx.ui.form.TextField} holds the current value
 * @childControl sectionleft {qx.ui.core.Widget}
 * @childControl sectionright {qx.ui.core.Widget}
 * @external(mantine/core/styles/Input.css)
 */
qx.Class.define("ville.ui.form.TextInput", {
    extend: ville.ui.core.Widget,

    construct(variant, size, radius, sectionleft, sectionright) {
        super(); 

        this.setCssUtilityClass("m_46b77525 mantine-InputWrapper-root mantine-TextInput-root");

        // CREATE CONTROLS
        this._createChildControl("innerwrapper");
        this._createChildControl("textfield");

        if (variant) {
            this.setVariant(variant);
        } else {
            this.initVariant();
        }

        if (size) {
            this.setSize(size);
        } else {
            this.initSize();
        }

        if (radius) {
            this.setRadius(radius);
        } else {
            this.initRadius();
        }

        if (sectionleft) {
            this.setSectionLeft(sectionleft);
        }

        if (sectionright) {
            this.setSectionRight(sectionright);
        }

    },

    properties: {

        variant: {
            init: "default",
            check: ["default", "filled", "light", "outline", "subtle", "transparent", "white"],
            apply: "_applyVariant",
            themeable: true,
            event: "changeVariant"
        },

        size: {
            init: "xs",
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
                    control = new ville.ui.core.InnerWrapper();
                    control.setCssUtilityClass("m_6c018570 mantine-Input-wrapper mantine-TextInput-wrapper");
                    this._add(control);
                    break;

                case "textfield":
                    control = new qx.ui.form.TextField();
                    control.setCssUtilityClass("m_8fb7ebe7 mantine-Input-input mantine-TextInput-input");
                    innerwrapper = this.getChildControl("innerwrapper");
                    innerwrapper.add(control);
                    break;

                case "sectionleft":
                    control = new ville.ui.basic.Label();
                    control.setAnonymous(true);
                    control.setCssUtilityClass("m_82577fc2 mantine-Input-section mantine-TextInput-section");
                    control.getContentElement().setAttribute("data-position", "left");
                    innerwrapper = this.getChildControl("innerwrapper");
                    innerwrapper.add(control);
                    break;

                case "sectionright":
                    control = new ville.ui.basic.Label();
                    control.setAnonymous(true);
                    control.setCssUtilityClass("m_82577fc2 mantine-Input-section mantine-TextInput-section");
                    control.getContentElement().setAttribute("data-position", "right");
                    innerwrapper = this.getChildControl("innerwrapper");
                    innerwrapper.add(control);
                    break;
            }

            return control || super._createChildControlImpl(id);
        },

        // property apply
        _applyVariant(value, old) {
            if (value) {
                this.getContentElement().setAttribute("data-variant", value);
            }
        },

        _applySize(value, old) {
            if (value) {
                var innerwrapper = this.getChildControl("innerwrapper");
                if (innerwrapper) {
                    var elem = innerwrapper.getContentElement(); 
                    this.getContentElement().setAttribute("data-size", value);
                    elem.setAttribute("data-size", value);
                    elem.setStyles({
                        "--input-height" : `var(--input-height-${value})`, 
                        "--input-fz" : `var(--mantine-font-size-${value})`
                    });
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
                        this.getContentElement().setAttribute("data-with-left-section", "true");
                    } else {
                        this.getContentElement().removeAttribute("data-with-left-section");
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
                        this.getContentElement().setAttribute("data-with-right-section", "true");
                    } else {
                        this.getContentElement().removeAttribute("data-with-right-section");
                    }
                }
            }
        }

    }
  });
