/**
 * Button
 *
 * Required CSS files:
 * @external(mantine/core/styles/UnstyledButton.css)
 * @external(mantine/core/styles/Button.css)
 *
 * Data attributes:
 * data-variant
 * data-disabled
 * data-loading
 * data-block
 *
 * @childControl inlineicon {qx.ui.core.Widget}
 *
 */
qx.Class.define("ville.ui.form.Button", {

    extend: qx.ui.form.Button,

    construct(label, icon, command, variant, component) {

        if (component) {
            this.__componenttag = component;
        }

        if (icon) {
            if (qx.lang.Type.isString(icon)) {
                super(label, icon, command);
            } else {
                super(label, null, command);
                this.setInlineIcon(icon);
                this._createChildControl("inlineicon");
            }
        } else {
            super(label);
        }

        if (variant) {
            this.setVariant(variant);
        } else {
            this.initVariant();
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

        inlineIcon: {
            check: "qx.ui.core.Widget",
            apply: "_applyInlineIcon",
            nullable: true,
            themeable: true,
            event: "changeInlineIcon"
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

                case "inlineicon":
                    control = this.getInlineIcon();
                    control.setAnonymous(true);
                    this._addAt(control, 0);
                    if (control == null || this.getShow() === "label") {
                        control.exclude();
                    }
                    break;

            }

            return control || super._createChildControlImpl(id);
        },

        // overridden
        _applyEnabled(value, old) {
            super._applyEnabled(value, old);
            if (value === false) {
                // villeui-mantine attriubute setting
                this.getContentElement().setAttribute("data-disabled", true);
                this.getContentElement().removeClass("mantine-active");
            } else {
                // villeui-mantine attriubute setting
                this.getContentElement().removeAttribute("data-disabled");
                this.getContentElement().addClass("mantine-active");
            }
        },

        // property apply
        _applyInlineIcon (value, old)
        {
            if (this.getIcon() != null) {
                value.exclude();
            } else {
                if (old)
                    this._removeAt(0);

                if (value)
                    this.getChildControl("inlineicon", true);

            }
        },

        // overridden
        _handleIcon() {
            if (this.getIcon() == null || this.getShow() === "label") {
                this._excludeChildControl("icon");
            } else {
                this._showChildControl("icon");
            }

            if (this.getInlineIcon() == null || this.getShow() === "label") {
                this._excludeChildControl("inlineicon");
            } else {
                if (this.getIcon() == null)
                    this._showChildControl("inlineicon");
            }
        },

        // property apply
        _applyVariant(value, old) {
            if (value) {
                this.getContentElement().setAttribute("data-variant", value);
            }
        }

    }
  });
