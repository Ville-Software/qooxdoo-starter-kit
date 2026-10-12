qx.Class.define("ville.ui.icon.IconMoon", {
    extend: ville.ui.icon.Abstract,

    construct() {

        this.__fulliconmarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="" class="tabler-icon tabler-icon-moon">
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
        </svg>`;
        
        super();

        /*this.addListenerOnce("appear", (e) => {
            const fulliconmarkupParser = new DOMParser();
            const doc = fulliconmarkupParser.parseFromString(this.__fulliconmarkup, "image/svg+xml");
            const svgNode = doc.documentElement;
            e.getTarget().getContentElement().getDomElement().appendChild(svgNode);
            //thiselem.add(svgNode);
            this.__fulliconmarkup = null; 
        });*/
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
