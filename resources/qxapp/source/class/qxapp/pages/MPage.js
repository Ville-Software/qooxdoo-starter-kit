qx.Mixin.define("qxapp.pages.MPage",
{
    properties : {

    /** Page's url made externally available */
    pageUrl: {
      check: "String",
      init: null
    },

    /** Associated Inertia component name */
    componentName: {
        check: "String",
        init: null
    }

  }
});
