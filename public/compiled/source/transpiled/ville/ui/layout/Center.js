(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "ville.ui.core.Box": {
        "construct": true,
        "require": true
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Center
   * @external(mantine/core/styles/Center.css)
   */
  qx.Class.define("ville.ui.layout.Center", {
    extend: ville.ui.core.Box,
    construct(component) {
      ville.ui.core.Box.constructor.call(this, component);
      this.setCssUtilityClass("m_4451eb3a mantine-Center-root");
    }
  });
  ville.ui.layout.Center.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Center.js.map?dt=1769806686301