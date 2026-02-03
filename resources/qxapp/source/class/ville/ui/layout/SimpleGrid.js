/**
 * Base Container
 * @external(mantine/core/styles/SimpleGrid.css)
 */
qx.Class.define("ville.ui.layout.SimpleGrid", {
    
    extend: ville.ui.core.Widget,

    include: qx.ui.core.MChildrenHandling,

    construct(component) {
        
        if (component) {
            this.__componenttag = component;
        }
        super();

        this.setCssUtilityClass("m_2415a157 mantine-SimpleGrid-root");

    },

    members: {

        __componenttag: "div",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }

    }
  });
