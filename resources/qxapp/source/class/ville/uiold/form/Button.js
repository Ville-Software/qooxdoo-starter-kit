/**
 * Button
 * @external(mantine/core/styles/Button.css)
 */
qx.Class.define("ville.ui.form.Button", {
    
    extend: ville.ui.form.UnstyledButton,

    construct(label, variant, sectionLeft, sectionRight, component) {
        
        if (component) {
            this.__componenttag = component;
        }
        
        super(); 

        this.setCssUtilityClass("m_77c9d27d mantine-Button-root " + this.getCssUtilityClass());

        if (variant) {
            this.setVariant(variant);
        } else {
            this.initVariant();
        }

        if (sectionLeft != null) {
            this.setSectionLeft(sectionLeft);
        }

        if (label != null) {
            this.setLabel(label);
        }

        if (sectionRight != null) {
            this.setSectionRight(sectionRight);
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

        sectionLeft: {
            check: "qx.ui.core.Widget",
            apply: "_applySectionLeft",
            nullable: true,
            themeable: true,
            event: "changeSectionLeft"
        },

        sectionRight: {
            check: "qx.ui.core.Widget",
            apply: "_applySectionRight",
            nullable: true,
            themeable: true,
            event: "changeSectionRight"
        }
    },

    members: {

        __componenttag: "button",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        // overridden
        _createChildControlImpl(id, hash) {
            var control;
            var innerwrapper;

            switch (id) {
                case "innerwrapper":
                    control = new ville.ui.core.InnerWrapper();
                    control.setCssUtilityClass("m_80f1301b mantine-Button-inner");
                    this._add(control);
                    break;
                
                case "label":
                    control = new ville.ui.basic.Label();
                    control.setAnonymous(true);
                    control.setSelectable(this.getSelectable());
                    control.setCssUtilityClass("m_811560b9 mantine-Button-label");
                    innerwrapper = this.getChildControl("innerwrapper");
                    innerwrapper.add(control);
                    break;

                case "sectionleft":
                    control = new ville.ui.basic.Label();
                    control.setAnonymous(true);
                    control.setCssUtilityClass("m_a74036a mantine-Button-section");
                    control.getContentElement().setAttribute("data-position", "left");
                    innerwrapper = this.getChildControl("innerwrapper");
                    innerwrapper.add(control);
                    break;

                case "sectionright":
                    control = new ville.ui.basic.Label();
                    control.setAnonymous(true);
                    control.setCssUtilityClass("m_a74036a mantine-Button-section");
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

        // overridden
        // Replaced by Section Left and Right
        _applyIcon(value, old) {},

        // overridden
        _applyShow(value, old) {},

        // overridden
        _applyLabel(value, old) {
            var innerwrapper = this.getChildControl("innerwrapper");
            if (innerwrapper) {
                var label = this.getChildControl("label");
                if (label) {
                    label.setValue(value);
                }
            }
        },

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
