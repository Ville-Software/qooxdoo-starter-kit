/**
 * default node is <p>
 * @external(mantine/core/styles/Text.css)
 */
qx.Class.define("ville.ui.typography.Text", {
    extend: ville.ui.core.Widget,

    include: qx.ui.core.MChildrenHandling,

    construct(text, component) {
        if (component) {
            this.__componenttag = component;
        }
        
        super();

        this.setCssUtilityClass("m_b6d8b162 mantine-Text-root");
        
        if (text) {
            this.setText(text);
        }
    },

    properties: {
        
        text: {
            apply: "_applyText",
            nullable: true,
            check: "String"
        },

        size: {
            init: "sm",
            check: ["xs", "sm", "md", "lg", "xl"],
            apply: "_applySize",
            nullable: true,
            themeable: true,
            event: "changeSize"
        },

        fontWeight: {
            check: "Number",
            apply: "_applyFontWeight",
            nullable: true,
            themeable: true,
            event: "changeFontWeight"
        }
    },

    members: {

        __componenttag : "p",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        // property apply
        _applyText(value) {
            if (value) {
                this.getContentElement().setAttribute("html", value);
            }
        },

        _applySize(value, old) {
            if (value) {
                this.getContentElement().setAttribute("data-size", value);
                this.getContentElement().setStyles({
                    "--text-fz" : `var(--mantine-font-size-${value})`, 
                    "--text-lh" : `var(--mantine-line-height-${value})`
                });
            }
        },

        _applyFontWeight(value, old) {
            if (value) {
                this.getContentElement().setStyle("font-weight", value);
            }
        }
    }
  });
