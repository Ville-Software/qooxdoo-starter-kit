/**
 * PasswordField
 * @external(mantine/core/styles/PasswordInput.css)
 */
qx.Class.define("ville.ui.form.PasswordField", {
    extend: qx.ui.form.PasswordField,

    construct(value, variant) {
        super(value);

        this.getContentElement().removeClass("qx-abstract-field");

        if (variant) {
            this.setVariant(variant);
        } else {
            this.initVariant();
        }

    },

    properties: {

        // overridden
        appearance: {
            refine: true,
            init: "passwordfield"
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
        // property apply
        _applyVariant(value, old) {
            if (value) {
                this.getContentElement().setAttribute("data-variant", value);
            }
        }
    }
  });
