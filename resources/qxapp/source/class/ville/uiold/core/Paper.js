/**
 * This is the most basic ui component
 * @external(mantine/core/styles/Paper.css)
 */
qx.Class.define("ville.ui.core.Paper", {
    extend: ville.ui.core.Widget,

    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],

    construct(component) {
        if (component) {
            this.__componenttag = component;
        }
        
        super();

        this._setLayout(new qx.ui.layout.Basic());
        this.setExcludeBoundsFromDom(true);
        //this.setSelectable(null);
        this.setExcludeInlineStyles(["position"]);
        this.setCssUtilityClass("m_1b7284a3 mantine-Paper-root");
    },

    members: {

        __componenttag: "div",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }

    }
  });
