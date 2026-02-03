/**
 * Fieldset
 * @external(mantine/core/styles/FieldSet.css)
 */
qx.Class.define("ville.ui.form.FieldSet", {
    
    extend: ville.ui.core.Box,

    construct(legend, variant) {
        
        super("fieldset");

        this.setCssUtilityClass("m_eda993d3 m_e9408a47 mantine-Fieldset-root");

        if (legend != null) {
            this.setLegend(legend);
        }

        if (variant != null) {
            this.setVariant(variant);
        } else {
            this.initVariant();
        }

    },

    statics: {

        fdsVariantClasses: {
            default: "m_84c9523a",
            filled: "m_ef274e49",
            unstyled: "m_eda993d3"
        },

        fdsLegendClasses: {
            unstyled: "m_74ca27fe"
        }
        
    },

    properties: {

        variant: {
            init: "default",
            check: ["default", "filled", "unstyled"],
            apply: "_applyVariant",
            themeable: true,
            event: "changeVariant"
        },

        legend: {
            check: "String",
            apply: "_applyLegend",
            nullable: true,
            themeable: true,
            event: "changeLegend"
        }

    },

    members: {
        // property apply
        _applyVariant(value, old) {
            if (value) {
                var elem = this.getContentElement();
                elem.setAttribute("data-variant", value, true);
                var legend = this.getChildControl("legend");

                if (old) {
                    elem.removeClass(this.constructor.fdsVariantClasses[old]);
                    if (legend)
                        legend.getContentElement().removeClass(this.constructor.fdsLegendClasses[old]);
                }
                    
                elem.addClass(this.constructor.fdsVariantClasses[value]);
                if (legend)
                    legend.getContentElement().addClass(this.constructor.fdsLegendClasses[value]);
                
            }
        },

        _applyLegend(value, old) {
            var legend = this.getChildControl("legend");
            if (legend) {
                if (value) {
                    legend.setAttribute("html", value);
                }
            }
        },

        // overridden
        _createChildControlImpl(id, hash) {
            var control;

            switch (id) {
                case "legend":
                control = new ville.ui.core.Box("legend");
                control.setCssUtilityClass("m_90794832 mantine-Fieldset-legend");
                this._add(control);
                break;
            }

            return control || super._createChildControlImpl(id);
        }

    }

  });
