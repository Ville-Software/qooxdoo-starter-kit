/**
 *
 * external(mantine/core/styles/Text.css)
 * @external(mantine/core/styles/Anchor.css)
 */
qx.Class.define("ville.ui.navigation.AnchorButton", {

    extend: qx.ui.form.Button,

    construct(label, component) {

        if (component) {
            this.__componenttag = component;
        }

        super(label);

        this.setCssUtilityClass("m_849cf0da mantine-Anchor-root");

        this.getContentElement().removeAttribute('role', 'button');

        this.initUnderline();

    },

    properties: {

        /*label: {
            check: "String",
            apply: "_applyLabel",
            themeable: true,
            nullable: false,
            event: "changeLabel"
        },*/

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

        __componenttag : "a",

        __clickpreventListnerId : null,

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        /*_applyLabel(value, old) {
            if (value) {
                this.setAttribute("html", value);
            }
        },*/

        _applyUnderline(value, old) {
            if (value) {
                var label = this.getChildControl("label");
                if (label != null) {
                    //label.getContentElement().setAttribute("data-underline", value);
                    label.getContentElement().setStyle("text-decoration", value);
                }

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
