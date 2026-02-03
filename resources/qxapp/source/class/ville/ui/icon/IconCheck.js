qx.Class.define("ville.ui.icon.IconCheck", {
    extend: ville.ui.icon.Abstract,

    construct() {

        var paths = `<path 
            fill="currentColor" 
            fill-rule="evenodd" 
            clip-rule="evenodd" 
            d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z">
        </path>`;

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
