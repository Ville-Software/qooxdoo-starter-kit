qx.Class.define("ville.ui.icon.IconSun", {
    extend: ville.ui.icon.Abstract,

    construct() {

        this.__fulliconmarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="" class="tabler-icon tabler-icon-sun">
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
        <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
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
