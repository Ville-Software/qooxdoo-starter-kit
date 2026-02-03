/**
 * Used as a base component or as a replacement for HTML elements
 * @external(mantine/core/styles/Image.css)
 */
qx.Class.define("ville.ui.basic.Image", {

    extend: ville.ui.core.Widget,

    construct(component) {

        if (component != null)
            this.__componenttag = component;

        super();

        this.setCssUtilityClass("m_9e117634 mantine-Image-root");
    },

    members: {

        __componenttag: "img",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }
    }
  });
