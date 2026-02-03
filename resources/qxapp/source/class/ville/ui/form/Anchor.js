/**
 *
 * @external(mantine/core/styles/Text.css)
 * @external(mantine/core/styles/Anchor.css)
 */
qx.Class.define("ville.ui.form.Anchor", {
    extend: qx.ui.form.Button,

    include: ville.ui.core.MWidget,

    construct(label, component) {
        if (component) {
            this.__componenttag = component;
        }

        super();

        this._setLayout(new qx.ui.layout.Basic());
        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);
        this.setCssUtilityClass("m_b6d8b162 m_849cf0da mantine-Text-root mantine-Anchor-root");

        if (component)
            if (component = "button")
                this.setAttribute('type', 'button');

        if (label) {
            this.setLabel(label);
        }

        this.initUnderline();

    },

    properties: {

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

        __componenttag : "a",

        __clickpreventListnerId : null,

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        // overridden
        _applyLabel(value, old) {
            if (value) {
                this.setAttribute("html", value);
            }
        },

        _applyUnderline(value, old) {
            if (value) {
                this.setAttribute("data-underline", value);
            }
        },

        // property apply
        _applyHref(value) {
            if (value) {
                this.setAttribute("href", value);
                this.__clickpreventListnerId = this.addListener("click", (e) => {e.preventDefault()});
            } else {
                this.removeAttribute("href");
                if (this.__clickpreventListnerId != null)
                    this.removeListener(this.__clickpreventListnerId);
            }
        },

        // property apply
        _applyTarget(value) {
            if (value) {
                this.setAttribute("target", value);
            } else {
                this.removeAttribute("target");
            }
        }
    }
  });
