/**
 * Unstyled Button
 * @external(mantine/core/styles/UnstyledButton.css)
 */
qx.Class.define("ville.ui.form.UnstyledButton", {
    
    extend: qx.ui.form.Button,

    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],

    construct(component, label) {
        
        if (component != null)
            this.__componenttag = component;

        super();

        this._setLayout(new qx.ui.layout.Basic());

        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);
        this.setCssUtilityClass("m_87cf2631 mantine-UnstyledButton-root");

        if (this.__componenttag !== "button")
            this.getContentElement().removeAttribute('type');

        if (label != null)
            this.getContentElement().setAttribute('html', label);

    },

    members: {

        __componenttag: "button",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }
    }
  });
