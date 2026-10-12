/**
 * Base Container
 * @external(mantine/core/styles/FloatingIndicator.css)
 */
qx.Class.define("ville.ui.overlay.FloatingIndicator", {
    
    extend: ville.ui.core.Widget,

    construct(component) {
        
        if (component) {
            this.__componenttag = component;
        }
        super();

        this.setCssUtilityClass("m_f9a45e7b m_96b553a6 mantine-FloatingIndicator-root");

    },

    members: {

        __componenttag: "div",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }

    }
  });
