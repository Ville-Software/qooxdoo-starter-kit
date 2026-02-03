/**
 * Horizontal flex layout
 * @external(mantine/core/styles/Flex.css)
 */
qx.Class.define("ville.ui.layout.Flex", {

    extend: ville.ui.core.Widget,

    include: qx.ui.core.MChildrenHandling,

    construct(component) {

        if (component)
            this.__componenttag = component;

        super();

        this.setCssUtilityClass("m_8bffd616 mantine-Flex-root");

    },

    members: {

        __componenttag: "div",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }

    }

  });
