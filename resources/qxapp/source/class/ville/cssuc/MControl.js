qx.Mixin.define("ville.cssuc.MControl",
{      
  properties :
  {

    bypassRenderLayout: {
      check: "Boolean",
      init: false,
      themeable: true
    },

    excludeBoundsFromDom: {
      check: "Boolean",
      init: false,
      themeable: true
    },

    excludeBoundsFromDomMods: {
      check: "Array",
      nullable: true,
      init: null,
      themeable: true
    }
  }
});