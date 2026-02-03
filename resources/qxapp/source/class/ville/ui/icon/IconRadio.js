qx.Class.define("ville.ui.icon.IconRadio", {
    extend: ville.ui.icon.Abstract,

    construct() {

        var paths = `<circle cx="2.5" cy="2.5" r="2.5" fill="currentColor"></circle>`;

        this.__fulliconmarkup = `<svg 
            viewBox="${this.getViewBox()}" 
            xmlns="${this.getXmlns()}" 
            fill="${this.getFill()}">
                ${paths}
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
