qx.Class.define("ville.ui.form.Label", {
    extend: qx.ui.basic.Label,

    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],

    construct(text) {
        super();

        this._setLayout(new qx.ui.layout.Basic());

        if (text) {
            this.setValue(text);
        }

        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);

    },

    properties: {
        
        size: {
            init: "xs",
            check: ["xs", "sm", "md", "lg", "xl"],
            apply: "_applySize",
            nullable: true,
            themeable: true,
            event: "changeSize"
        }
    },

    members: {

        // overridden
        _createContentElement() {
            return new qx.html.Element("label");
        },

        _applySize(value, old) {
            if (value) {
                this.setAttribute("data-size", value);
                this.setStyle("--input-label-size", `var(--mantine-font-size-${value})`);
            }
        },

        // overridden
        _applyValue: qx.core.Environment.select("qx.dynlocale", {
            true(value, old) {
                // Sync with content element
                if (value && value.translate) {
                    this.setAttribute("html", value.translate());
                } else {
                    this.setAttribute("html", value);
                }

                // Mark text size cache as invalid
                this.__invalidContentSize = true;

                // Update layout
                qx.ui.core.queue.Layout.add(this);
            },

            false(value, old) {
                this.getContentElement().setAttribute("html", value);

                // Mark text size cache as invalid
                this.__invalidContentSize = true;

                // Update layout
                qx.ui.core.queue.Layout.add(this);
            }
            })
    }
  });
