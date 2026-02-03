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
  qx.Class.define("ville.ui.icon.IconIndeterminate", {
    extend: ville.ui.icon.Abstract,
    construct() {
      var paths = `<rect 
            width="32" 
            height="6" 
            fill="currentColor" 
            rx="3">
        </rect>`;
      this.__fulliconmarkup__P_84_0 = `<svg 
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
        thiselem.useMarkup(this.__fulliconmarkup__P_84_0);
        this.__fulliconmarkup__P_84_0 = null;
        return thiselem;
      }
    }
  });
  ville.ui.icon.IconIndeterminate.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=IconIndeterminate.js.map?dt=1769806689466