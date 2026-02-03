(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "ville.ui.root.Application": {
        "require": true
      },
      "ville.cssuc.MControl": {
        "require": true
      },
      "ville.cssuc.MCssUtilityClass": {
        "require": true
      },
      "ville.cssuc.patch.MLabel": {
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.application.Standalone": {
        "require": true
      },
      "qx.ui.core.LayoutItem": {},
      "qx.ui.core.Widget": {},
      "qx.html.Label": {},
      "qx.ui.form.AbstractField": {},
      "ville.cssuc.patch.MAbstractField": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * This is the application class of a ville ui standalone app
   *
   * @external(mantine/core/styles/baseline.css)
   * @external(mantine/core/styles/default-css-variables.css)
   * @external(mantine/core/styles/global.css)
   * @require(ville.ui.root.Application)
   * @require(ville.cssuc.MControl)
   * @require(ville.cssuc.MCssUtilityClass)
   * @require(ville.cssuc.patch.MLabel)
   *
   */

  qx.Class.define("ville.ui.application.Standalone", {
    extend: qx.application.Standalone,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      main() {
        // Patch and include core classes
        qx.Class.include(qx.ui.core.LayoutItem, ville.cssuc.MControl);
        qx.Class.include(qx.ui.core.Widget, ville.cssuc.MCssUtilityClass);
        qx.Class.patch(qx.html.Label, ville.cssuc.patch.MLabel);
        qx.Class.patch(qx.ui.form.AbstractField, ville.cssuc.patch.MAbstractField);

        // Call super class
        ville.ui.application.Standalone.superclass.prototype.main.call(this);
      },
      // overridden
      _createRootWidget() {
        var rootwidget = new ville.ui.root.Application(document);
        rootwidget.setExcludeBoundsFromDom(true);
        rootwidget.setClearAllInlineStyles(true);
        return rootwidget;
      }
    }
  });
  ville.ui.application.Standalone.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Standalone.js.map?dt=1769806685807