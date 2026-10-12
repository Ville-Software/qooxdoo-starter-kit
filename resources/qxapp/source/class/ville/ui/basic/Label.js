qx.Class.define("ville.ui.basic.Label", {

    extend: qx.ui.basic.Label,

    construct(text, component) {

        if (component) {
            this.__componenttag = component;
        }

        //if (text)
          //  super(text);
        //else
            super();

        //this._setLayout(new qx.ui.layout.Basic());

        if (text)
            this.setValue(text);

    },

    members: {

        __componenttag: "div",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        // overridden
        _applyValue: qx.core.Environment.select("qx.dynlocale", {
            true(value, old) {
                // Sync with content element
                if (value && value.translate) {
                    this.getContentElement().setAttribute("html", value.translate());
                } else {
                    this.getContentElement().setAttribute("html", value);
                }

                // Mark text size cache as invalid
                this.__invalidContentSize = true;

                // Update layout
                qx.ui.core.queue.Layout.add(this);
            },

            false(value, old) {
                this.getContentElement().setAttribute("html", value);

                // Mark text size cache as invalid
                this.__invalidContentSize = true;

                // Update layout
                qx.ui.core.queue.Layout.add(this);
            }
        })
    }
  });
