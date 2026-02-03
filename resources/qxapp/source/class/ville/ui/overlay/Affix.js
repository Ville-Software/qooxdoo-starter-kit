/**
 * Base Container
 * @external(mantine/core/styles/Affix.css)
 */
qx.Class.define("ville.ui.overlay.Affix", {
    
    extend: ville.ui.core.Widget,

    include: qx.ui.core.MChildrenHandling,

    construct(component) {
        
        if (component) {
            this.__componenttag = component;
        }
        super();

        this.setCssUtilityClass("m_7f854edf mantine-Affix-root");

    },

    members: {

        __componenttag: "div",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }

    }
  });
