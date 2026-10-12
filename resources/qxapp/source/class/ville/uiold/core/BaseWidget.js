/**
 * Base widget
 */
qx.Class.define("ville.ui.core.BaseWidget", {
    extend: ville.ui.core.Widget,

    construct(component) {
        if (component) {
            this.__componentmap = component;
        }
        super();
    },

    members: {

        __componentmap: {"basetag" : "div", "type" : "na"},

        // overridden
        _createContentElement() {
            var newelem;
            if (this.__componentmap.basetag = "input") {
                newelem = new qx.html.Input(this.__componentmap.type);
            } else {
                newelem = new qx.html.Element(this.__componentmap.basetag);
            }
            return newelem; 
        }
    }
  });
