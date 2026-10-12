/**
 * NavLink
 * @external(mantine/core/styles/UnstyledButton.css)
 * @external(mantine/core/styles/NavLink.css)
 */
qx.Class.define("ville.ui.form.NavLink", {
    extend: ville.ui.form.UnstyledToggleButton,

    construct(label, component) {
        if (component != null)
            this.__componenttag = component;

        super();

        this.setCssUtilityClass("mantine-focus-auto m_f0824112 mantine-NavLink-root m_87cf2631 mantine-UnstyledButton-root");

        if (this.__componenttag !== "button") {
            this.removeAttribute('type');
            this.removeAttribute('role');
        }

        if (label != null) {
            this.setAttribute('html', label);
        }
    },

    properties: {

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

        // property apply
        _applyHref(value) {
            // only apply if tag is an anchor "a"
            if (this.__componenttag == "a") {
                if (value) {
                    this.setAttribute("href", value);
                    this.__clickpreventListnerId = this.addListener("click", (e) => {e.preventDefault()});
                } else {
                    this.removeAttribute("href");
                    if (this.__clickpreventListnerId != null)
                        this.removeListener(this.__clickpreventListnerId);
                }
            }
        },

        // property apply
        _applyTarget(value) {
            // only apply if tag is an anchor "a"
            if (this.__componenttag == "a") {
                if (value) {
                    this.setAttribute("target", value);
                } else {
                    this.removeAttribute("target");
                }
            }
        }
    }
  });
