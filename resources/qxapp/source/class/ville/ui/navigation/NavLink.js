/**
 * NavLink
 * @external(mantine/core/styles/NavLink.css)
 */
qx.Class.define("ville.ui.navigation.NavLink", {
    extend: ville.ui.form.UnstyledToggleButton,

    construct(label, icon, component) {
        if (component != null)
            this.__componenttag = component;

        super(label, icon);

        if (qx.core.Environment.get("qx.debug"))
            this.setCssUtilityClass("mantine-focus-auto m_f0824112 mantine-NavLink-root m_87cf2631 mantine-UnstyledButton-root");
        else
            this.setCssUtilityClass("mantine-focus-auto m_f0824112 m_87cf2631");

        if (this.__componenttag !== "button") {
            this.getContentElement().removeAttribute('type');
            this.getContentElement().removeAttribute('role');
        }

    },

    properties: {

        // overridden
        appearance: {
            refine: true,
            init: "navlink"
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

        // property apply
        _applyHref(value) {
            // only apply if tag is an anchor "a"
            if (this.__componenttag === "a") {
                if (value) {
                    this.getContentElement().setAttribute("href", value);
                    this.__clickpreventListnerId = this.addListener("click", (e) => {e.preventDefault()});
                } else {
                    this.getContentElement().removeAttribute("href");
                    if (this.__clickpreventListnerId !== null)
                        this.getContentElement().removeListener(this.__clickpreventListnerId);
                }
            }
        },

        // property apply
        _applyTarget(value) {
            // only apply if tag is an anchor "a"
            if (this.__componenttag === "a") {
                if (value) {
                    this.getContentElement().setAttribute("target", value);
                } else {
                    this.getContentElement().removeAttribute("target");
                }
            }
        }
    }
  });
