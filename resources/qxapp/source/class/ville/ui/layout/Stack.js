/**
 * Stack Container - created specifically for TabView panes
 */
qx.Class.define("ville.ui.layout.Stack", {
    
    extend: qx.ui.container.Stack,

    include: ville.ui.core.MWidget,

    construct(component) {
        
        if (component) {
            this.__componenttag = component;
        }
        super();

        //this._setLayout(new qx.ui.layout.Basic());
        this.setExcludeBoundsFromDom(true);
        this.setClearAllInlineStyles(true);
        //this.setCssUtilityClass("m_7485cace mantine-Container-root");

    },

    members: {

        __componenttag: "div",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }

    }
  });
