/**
 * body variable contains path svg from Iconify Icon Sets
 *
 * Iconify:
 * https://icon-sets.iconify.design/
 *
 * Iconify's Tabler icons:
 * https://github.com/iconify/icon-sets/blob/master/json/tabler.json
 *
 * Tabler icon in json - "sun"
 */
qx.Class.define("ville.ui.icon.tabler.IconSun", {
    extend: ville.ui.icon.tabler.Abstract,

    construct() {

        // Taken from Iconify icon-set tabler.json sun.body value
		var body = "<path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7\"/>"

        this.__fulliconmarkup = `<svg
            viewBox="${this.getViewBox()}"
            xmlns="${this.getXmlns()}"
            fill="${this.getFill()}"
            stroke-width="${this.getStrokeWidth()}"
            stroke="${this.getStroke()}"
            stroke-linecap="${this.getStrokeLinecap()}"
            stroke-linejoin="${this.getStrokeLinejoin()}">
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
