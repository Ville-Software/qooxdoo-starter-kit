(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "ville.ui.icon.Abstract": {
        "construct": true,
        "require": true
      },
      "qx.html.Element": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  qx.Class.define("ville.ui.icon.IconCheck", {
    extend: ville.ui.icon.Abstract,
    construct() {
      var paths = `<path 
            fill="currentColor" 
            fill-rule="evenodd" 
            clip-rule="evenodd" 
            d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z">
        </path>`;
      this.__fulliconmarkup__P_83_0 = `<svg 
            viewBox="${this.getViewBox()}" 
            xmlns="${this.getXmlns()}" 
            fill="${this.getFill()}">
                ${paths}
        </svg>`;
      ville.ui.icon.Abstract.constructor.call(this);
    },
    members: {
      // overridden
      _createContentElement() {
        var thiselem = new qx.html.Element();
        thiselem.useMarkup(this.__fulliconmarkup__P_83_0);
        this.__fulliconmarkup__P_83_0 = null;
        return thiselem;
      }
    }
  });
  ville.ui.icon.IconCheck.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=IconCheck.js.map?dt=1769806689457