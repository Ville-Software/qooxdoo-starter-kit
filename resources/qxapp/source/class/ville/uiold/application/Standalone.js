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

    main () {

        // Patch and include core classes
        qx.Class.include(qx.ui.core.LayoutItem, ville.cssuc.MControl);
        qx.Class.include(qx.ui.core.Widget, ville.cssuc.MCssUtilityClass);
        qx.Class.patch(qx.html.Label, ville.cssuc.patch.MLabel);
        qx.Class.patch(qx.ui.form.AbstractField, ville.cssuc.patch.MAbstractField);

        // Call super class
        super.main();

    },

    // overridden
    _createRootWidget() {
        var rootwidget = new ville.ui.root.Application(document);
        return rootwidget;
    }
  }
});
