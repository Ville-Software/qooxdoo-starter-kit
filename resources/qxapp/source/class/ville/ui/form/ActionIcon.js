/**
 * Button
 * @external(mantine/core/styles/ActionIcon.css)
 */
qx.Class.define("ville.ui.form.ActionIcon", {
    extend: ville.ui.form.UnstyledButton,

    include: qx.ui.core.MChildrenHandling,

    construct(icon, variant, component) {
        if (component) {
            this.__componenttag = component;
        }
        super(); 

        this.setCssUtilityClass("mantine-focus-auto mantine-active m_8d3f4000 mantine-ActionIcon-root " + this.getCssUtilityClass());

        if (icon) {
            this.setInlineIcon(icon);
        }
        
        if (variant) {
            this.setVariant(variant);
        } else {
            this.initVariant();
        }
        
    },

    properties: {

        inlineIcon: {
            check: "qx.ui.core.Widget",
            apply: "_applyInlineIcon",
            nullable: true,
            themeable: true,
            event: "changeInlineIcon"
        },

        variant: {
            init: "default",
            check: ["default", "filled", "light", "outline", "subtle", "transparent", "white"],
            apply: "_applyVariant",
            themeable: true,
            event: "changeVariant"
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

            switch (id) {
                case "innerwrapper":
                    control = new ville.ui.core.InnerWrapper();
                    control.setCssUtilityClass("m_8d3afb97 mantine-ActionIcon-icon");
                    this._add(control);
                    break;

            }

            return control || super._createChildControlImpl(id);
        },

        // property apply
        _applyVariant(value, old) {
            if (value) {
                this.setAttribute("data-variant", value);
            }
        },

        // overridden
        _applyLabel(value, old) {},

        // overridden
        _applyIcon(value, old) {},

        // overridden
        _applyShow(value, old) {},

        // overridden
        _applyInlineIcon(value, old) {
            var innerwrapper = this.getChildControl("innerwrapper");
            if (innerwrapper) {
                innerwrapper.add(value);
            }
        }

    }
  });
