qx.Class.define("ville.ui.basic.InlineSvg", {
    extend: ville.ui.icon.Abstract,

    construct(body) {

        this.__fulliconmarkup = `<svg
            viewBox="${this.getViewBox()}"
            xmlns="${this.getXmlns()}"
            fill="${this.getFill()}">
                ${body}
        </svg>`;

        super();

    },

    members: {

        // overridden
        _createContentElement() {
            var thiselem = new qx.html.Element();
            thiselem.useMarkup(this.__fulliconmarkup);
            this.__fulliconmarkup = null;
            return thiselem;
        }
    }
  });
