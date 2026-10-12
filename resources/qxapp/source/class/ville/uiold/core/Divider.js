/**
 * This is the most basic ui component
 * @external(mantine/core/styles/Divider.css)
 */
qx.Class.define("ville.ui.core.Divider", {
    extend: ville.ui.core.Widget,

    construct() {
        super();

        this.initOrientation();
        this.initVariant();
        this.initSize();
        this.initSpacing();
        this.initLabelPosition();

        this._setLayout(new qx.ui.layout.Basic());
        this.setExcludeBoundsFromDom(true);
        //this.setExcludeInlineStyles(["position"]);
        this.setCssUtilityClass("m_3eebeb36 mantine-Divider-root");

        this.getContentElement().setAttribute('role', 'separator');
    },

    properties: {

        label: {
            check: "String",
            apply: "_applyLabel",
            nullable: true,
            event: "changeLabel"
        },

        labelPosition: {
            init: "center",
            check: ["left", "center", "right"],
            apply: "_applyLabelPosition",
            themeable: true,
            nullable: true,
            event: "changeLabelPosition"
        },

        orientation: {
            init: "horizontal",
            check: ["horizontal", "vertical"],
            apply: "_applyOrientation",
            themeable: true,
            nullable: false,
            event: "changeOrientation"
        },

        variant: {
            init: null,
            check: ["dashed", "dotted"],
            apply: "_applyVariant",
            themeable: true,
            nullable: true,
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

        spacing: {
            init: "xs",
            check: ["xs", "sm", "md", "lg", "xl"],
            apply: "_applySpacing",
            nullable: true,
            themeable: true,
            event: "changeSpacing"
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

            switch (id) {              
                case "label":
                    control = new ville.ui.basic.Label();
                    control.setAnonymous(true);
                    control.setCssUtilityClass("m_9e365f20 mantine-Divider-label");
                    this._add(control);
                    break;
            }

            return control || super._createChildControlImpl(id);
        },

        // property apply
        _applyLabel(value, old) {
            if (!value) {
                this.getContentElement().removeAttribute("data-with-label");
                if (old) {
                    this._removeAll();
                }
            } else {
                var label = this.getChildControl("label");
                if (label) {
                    this.getContentElement().setAttribute("data-with-label", "true");
                    label.setValue(value);
                    label.getContentElement().setAttribute("data-position", this.getLabelPosition());
                }
            }
        },

        // property apply
        _applyLabelPosition(value, old) {
            var label = this.getChildControl("label", true);
            if (label && value) {
                label.getContentElement().setAttribute("data-position", value);
            }
        },

        // property apply
        _applyOrientation(value, old) {
            if (value) {
                this.getContentElement().setAttribute("data-orientation", value);
            }
        },

        // property apply
        _applyVariant(value, old) {
            if (value) {
                this.getContentElement().setAttribute("data-variant", value);
            } else {
                this.getContentElement().removeAttribute("data-variant");
            }
        },

        _applySize(value, old) {
            if (value) {
                this.getContentElement().setAttribute("data-size", value);
                this.getContentElement().setStyle("--divider-size", `var(--divider-size-${value})`);
            }
        },

        _applySpacing(value, old) {
            if (value) {
                this.getContentElement().setStyle("margin-block", `var(--mantine-spacing-${value})`);
            }
        }
    }
  });
