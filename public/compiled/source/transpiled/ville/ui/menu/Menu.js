(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.menu.Menu": {
        "construct": true,
        "require": true
      },
      "ville.ui.core.MWidget": {
        "require": true
      },
      "qx.html.Element": {},
      "qx.ui.core.Widget": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /**
   * Menu
   * @external(mantine/core/styles/Popover.css)
   * @external(mantine/core/styles/Menu.css)
   */
  qx.Class.define("ville.ui.menu.Menu", {
    extend: qx.ui.menu.Menu,
    include: ville.ui.core.MWidget,
    construct() {
      qx.ui.menu.Menu.constructor.call(this);
      this.setExcludeBoundsFromDom(true);
      this.setClearAllInlineStyles(true);
      this.setExcludeBoundsFromDomMods(["width", "height"]);
      this.setCssUtilityClass("m_38a85659 mantine-Menu-dropdown m_dc9b7c9f");
      this.setAttribute('role', "menu");
    },
    members: {
      // overridden
      _createContentElement() {
        return new qx.html.Element();
      },
      // overridden
      _createChildControlImpl(id, hash) {},
      open() {
        if (this.getOpener() != null) {
          var isPlaced = this.placeToWidget(this.getOpener(), true);
          if (isPlaced) {
            //this.__updateSlideBar();
            this.show();
            this._placementTarget = this.getOpener();
          } else {
            this.warn("Could not open menu instance because 'opener' widget is not visible");
          }
        } else {
          this.warn("The menu instance needs a configured 'opener' widget!");
        }
      },
      openAtPointer(e) {
        this.placeToPointer(e);
        //this.__updateSlideBar();
        this.show();
        this._placementTarget = {
          left: e.getDocumentLeft(),
          top: e.getDocumentTop()
        };
      },
      openAtPoint(point) {
        this.placeToPoint(point);
        //this.__updateSlideBar();
        this.show();
        this._placementTarget = point;
      },
      _onResize() {
        if (this.isVisible()) {
          var target = this._placementTarget;
          if (!target) {
            return;
          } else if (target instanceof qx.ui.core.Widget) {
            this.placeToWidget(target, true);
          } else if (target.top !== undefined) {
            this.placeToPoint(target);
          } else {
            throw new Error("Unknown target: " + target);
          }
          //this.__updateSlideBar();
        }
      }
    }
  });
  ville.ui.menu.Menu.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Menu.js.map?dt=1769806686025