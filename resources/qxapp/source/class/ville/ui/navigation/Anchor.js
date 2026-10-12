/**
 *
 * external(mantine/core/styles/Text.css)
 * @external(mantine/core/styles/Anchor.css)
 */
qx.Class.define("ville.ui.navigation.Anchor", {
    extend: qx.ui.basic.Label,

    construct(text, component) {

        if (component != null) {
            this.__componenttag = component;
        }

        super();

        this.setCssUtilityClass("m_849cf0da mantine-Anchor-root");

        if (text)
            this.setValue(text);

        this.initUnderline();

    },

    properties: {

        // overridden
        appearance: {
            refine: true,
            init: "anchor"
        },

        underline: {
            init: "hover",
            check: ["always", "hover", "not-hover", "never"],
            apply: "_applyUnderline",
            themeable: true,
            event: "changeUnderline"
        },

        href: {
            apply: "_applyHref",
            nullable: true,
            check: "String"
        },

        target: {
            apply: "_applyTarget",
            nullable: true,
            check: "String"
        }

    },

    members: {

        __componenttag: "a",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        // overridden
        _applyValue: qx.core.Environment.select("qx.dynlocale", {
            true(value, old) {
                // Sync with content element
                if (value && value.translate) {
                    this.getContentElement().setAttribute("html", value.translate());
                } else {
                    this.getContentElement().setAttribute("html", value);
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
        }),

        _applyUnderline(value, old) {
            if (value) {
                this.getContentElement().setAttribute("data-underline", value);
            }
        },

        // property apply
        _applyHref(value) {
            if (value) {
                this.getContentElement().setAttribute("href", value);
                this.__clickpreventListnerId = this.addListener("click", (e) => {e.preventDefault()});
            } else {
                this.getContentElement().removeAttribute("href");
                if (this.__clickpreventListnerId != null)
                    this.removeListener(this.__clickpreventListnerId);
            }
        },

        // property apply
        _applyTarget(value) {
            if (value) {
                this.getContentElement().setAttribute("target", value);
            } else {
                this.getContentElement().removeAttribute("target");
            }
        }
    }
  });
