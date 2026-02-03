/**
 * This is the innerwrapper widget for Button, TextFieldWrapper
 * @external(mantine/core/styles/InlineInput.css)
 */
qx.Class.define("ville.ui.core.InnerWrapper", {
    extend: ville.ui.core.Widget,

    include: [qx.ui.core.MChildrenHandling, ville.ui.core.MWidget],

    construct(component) {
        if (component) {
            this.__componenttag = component;
        }
        super();

        this._setLayout(new qx.ui.layout.Basic());
        this.setExcludeBoundsFromDom(true);
        //this.setExcludeInlineStyles(["position"]);
    },

    members: {

        __componenttag: "span",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        }
    }
  });
