/**
 * Unstyled Button
 * @external(mantine/core/styles/UnstyledButton.css)
 */
qx.Class.define("ville.ui.form.UnstyledToggleButton", {
    extend: qx.ui.form.ToggleButton,

    construct(label, icon) {
        if (icon) {
            if (qx.lang.Type.isString(icon)) {
                super(label, icon);
            } else {
                super(label);
                this.setInlineIcon(icon);
                this._createChildControl("inlineicon");
            }
        } else {
            super(label);
        }

        this.setCssUtilityClass("m_87cf2631 mantine-UnstyledButton-root");
        //this.getContentElement().setAttribute('type', 'button');

        //if (label) {
          //  this.getContentElement().setAttribute('html', label);
        //}
    },

    properties: {

        inlineIcon: {
            check: "qx.ui.core.Widget",
            apply: "_applyInlineIcon",
            nullable: true,
            themeable: true,
            event: "changeInlineIcon"
        }
    },

    members: {

        // overridden
        _createContentElement() {
            return new qx.html.Element("button");
        },

        // overridden
        _createChildControlImpl(id, hash) {
            var control;

            switch (id) {

                case "inlineicon":
                    control = this.getInlineIcon();
                    control.setAnonymous(true);
                    control.getContentElement().setAttribute("data-position", "left");
                    this.getContentElement().setAttribute("data-with-left-section", true);
                    this._add(control, { column: 0 });
                    if (control == null) {
                        control.exclude();
                    }
                    break;

            }

            return control || super._createChildControlImpl(id);
        },

        // overridden
        _applyEnabled(value, old) {
            super._applyEnabled(value, old);
            if (value == false) {
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
            if (this.getIcon() == null) {
                this._excludeChildControl("icon");
            } else {
                this._showChildControl("icon");
            }

            if (this.getInlineIcon() == null) {
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
