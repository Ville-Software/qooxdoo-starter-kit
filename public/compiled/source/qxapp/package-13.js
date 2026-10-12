(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.core.Environment": {
        "defer": "load",
        "usage": "dynamic",
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.Abstract": {
        "require": true
      }
    },
    "environment": {
      "provided": [],
      "required": {
        "qx.debug": {
          "load": true
        }
      }
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A basic layout, which supports positioning of child widgets by absolute
   * left/top coordinates. This layout is very simple but should also
   * perform best.
   *
   * *Features*
   *
   * * Basic positioning using <code>left</code> and <code>top</code> properties
   * * Respects minimum and maximum dimensions without shrinking/growing
   * * Margins for top and left side (including negative ones)
   * * Respects right and bottom margins in the size hint
   * * Auto-sizing
   *
   * *Item Properties*
   *
   * <ul>
   * <li><strong>left</strong> <em>(Integer)</em>: The left coordinate in pixel</li>
   * <li><strong>top</strong> <em>(Integer)</em>: The top coordinate in pixel</li>
   * </ul>
   *
   * *Details*
   *
   * The default location of any widget is zero for both
   * <code>left</code> and <code>top</code>.
   *
   * *Example*
   *
   * Here is a little example of how to use the basic layout.
   *
   * <pre class="javascript">
   * var container = new qx.ui.container.Composite(new qx.ui.layout.Basic());
   *
   * // simple positioning
   * container.add(new qx.ui.core.Widget(), {left: 10, top: 10});
   * container.add(new qx.ui.core.Widget(), {left: 100, top: 50});
   * </pre>
   *
   * *External Documentation*
   *
   * <a href='https://qooxdoo.org/documentation/#/desktop/layout/basic.md'>
   * Extended documentation</a> and links to demos of this layout in the qooxdoo manual.
   */
  qx.Class.define("qx.ui.layout.Basic", {
    extend: qx.ui.layout.Abstract,
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      verifyLayoutProperty: qx.core.Environment.select("qx.debug", {
        true(item, name, value) {
          this.assert(name == "left" || name == "top", "The property '" + name + "' is not supported by the Basic layout!");
          this.assertInteger(value);
        },
        false: null
      }),
      // overridden
      renderLayout(availWidth, availHeight, padding) {
        var children = this._getLayoutChildren();
        var child, size, props, left, top;

        // Render children
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          size = child.getSizeHint();
          props = child.getLayoutProperties();
          left = padding.left + (props.left || 0) + child.getMarginLeft();
          top = padding.top + (props.top || 0) + child.getMarginTop();
          child.renderLayout(left, top, size.width, size.height);
        }
      },
      // overridden
      _computeSizeHint() {
        var children = this._getLayoutChildren();
        var child, size, props;
        var neededWidth = 0,
          neededHeight = 0;
        var localWidth, localHeight;

        // Iterate over children
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          size = child.getSizeHint();
          props = child.getLayoutProperties();
          localWidth = size.width + (props.left || 0) + child.getMarginLeft() + child.getMarginRight();
          localHeight = size.height + (props.top || 0) + child.getMarginTop() + child.getMarginBottom();
          if (localWidth > neededWidth) {
            neededWidth = localWidth;
          }
          if (localHeight > neededHeight) {
            neededHeight = localHeight;
          }
        }

        // Return hint
        return {
          width: neededWidth,
          height: neededHeight
        };
      }
    }
  });
  qx.ui.layout.Basic.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.core.LayoutItem": {
        "construct": true,
        "require": true
      },
      "qx.ui.core.queue.Dispose": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A Spacer is a "virtual" widget, which can be placed into any layout and takes
   * the space a normal widget of the same size would take.
   *
   * Spacers are invisible and very light weight because they don't require any
   * DOM modifications.
   *
   * *Example*
   *
   * Here is a little example of how to use the widget.
   *
   * <pre class='javascript'>
   *   var container = new qx.ui.container.Composite(new qx.ui.layout.HBox());
   *   container.add(new qx.ui.core.Widget());
   *   container.add(new qx.ui.core.Spacer(50));
   *   container.add(new qx.ui.core.Widget());
   * </pre>
   *
   * This example places two widgets and a spacer into a container with a
   * horizontal box layout. In this scenario the spacer creates an empty area of
   * 50 pixel width between the two widgets.
   *
   * *External Documentation*
   *
   * <a href='http://qooxdoo.org/docs/#desktop/widget/spacer.md' target='_blank'>
   * Documentation of this widget in the qooxdoo manual.</a>
   */
  qx.Class.define("qx.ui.core.Spacer", {
    extend: qx.ui.core.LayoutItem,
    /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
    */

    /**
     * @param width {Integer?null} the initial width
     * @param height {Integer?null} the initial height
     */
    construct(width, height) {
      qx.ui.core.LayoutItem.constructor.call(this);

      // Initialize dimensions
      this.setWidth(width != null ? width : 0);
      this.setHeight(height != null ? height : 0);
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      /**
       * Helper method called from the visibility queue to detect outstanding changes
       * to the appearance.
       *
       * @internal
       */
      checkAppearanceNeeds() {
        // placeholder to improve compatibility with Widget.
      },
      /**
       * Recursively adds all children to the given queue
       *
       * @param queue {Map} The queue to add widgets to
       */
      addChildrenToQueue(queue) {
        // placeholder to improve compatibility with Widget.
      },
      /**
       * Removes this widget from its parent and dispose it.
       *
       * Please note that the widget is not disposed synchronously. The
       * real dispose happens after the next queue flush.
       *
       */
      destroy() {
        if (this.$$disposed) {
          return;
        }
        var parent = this.$$parent;
        if (parent) {
          parent._remove(this);
        }
        qx.ui.core.queue.Dispose.add(this);
      }
    }
  });
  qx.ui.core.Spacer.$$dbClassInfo = $$dbClassInfo;
})();

(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.ui.layout.VBox": {
        "require": true
      },
      "qx.lang.Array": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);
  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Sebastian Werner (wpbasti)
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * Layouter used by the qooxdoo menu's to render their buttons
   *
   * @internal
   */
  qx.Class.define("qx.ui.menu.Layout", {
    extend: qx.ui.layout.VBox,
    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */

    properties: {
      /** Spacing between each cell on the menu buttons */
      columnSpacing: {
        check: "Integer",
        init: 0,
        apply: "_applyLayoutChange"
      },
      /**
       * Whether a column and which column should automatically span
       * when the following cell is empty. Spanning may be disabled
       * through setting this property to <code>null</code>.
       */
      spanColumn: {
        check: "Integer",
        init: 1,
        nullable: true,
        apply: "_applyLayoutChange"
      },
      /** Default icon column width if no icons are rendered */
      iconColumnWidth: {
        check: "Integer",
        init: 0,
        themeable: true,
        apply: "_applyLayoutChange"
      },
      /** Default arrow column width if no sub menus are rendered */
      arrowColumnWidth: {
        check: "Integer",
        init: 0,
        themeable: true,
        apply: "_applyLayoutChange"
      }
    },
    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */

    members: {
      __columnSizes__P_110_0: null,
      /*
      ---------------------------------------------------------------------------
        LAYOUT INTERFACE
      ---------------------------------------------------------------------------
      */

      // overridden
      _computeSizeHint() {
        var children = this._getLayoutChildren();
        var child, sizes, spacing;
        var spanColumn = this.getSpanColumn();
        var columnSizes = this.__columnSizes__P_110_0 = [0, 0, 0, 0];
        var columnSpacing = this.getColumnSpacing();
        var spanColumnWidth = 0;
        var maxInset = 0;

        // Compute column sizes and insets
        for (var i = 0, l = children.length; i < l; i++) {
          child = children[i];
          if (child.isAnonymous()) {
            continue;
          }
          sizes = child.getChildrenSizes();
          for (var column = 0; column < sizes.length; column++) {
            if (spanColumn != null && column == spanColumn && sizes[spanColumn + 1] == 0) {
              spanColumnWidth = Math.max(spanColumnWidth, sizes[column]);
            } else {
              columnSizes[column] = Math.max(columnSizes[column], sizes[column]);
            }
          }
          var insets = children[i].getInsets();
          maxInset = Math.max(maxInset, insets.left + insets.right);
        }

        // Fix label column width is cases where the maximum button with no shortcut
        // is larger than the maximum button with a shortcut
        if (spanColumn != null && columnSizes[spanColumn] + columnSpacing + columnSizes[spanColumn + 1] < spanColumnWidth) {
          columnSizes[spanColumn] = spanColumnWidth - columnSizes[spanColumn + 1] - columnSpacing;
        }

        // When merging the cells for label and shortcut
        // ignore the spacing between them
        if (spanColumnWidth == 0) {
          spacing = columnSpacing * 2;
        } else {
          spacing = columnSpacing * 3;
        }

        // Fix zero size icon column
        if (columnSizes[0] == 0) {
          columnSizes[0] = this.getIconColumnWidth();
        }

        // Fix zero size arrow column
        if (columnSizes[3] == 0) {
          columnSizes[3] = this.getArrowColumnWidth();
        }
        var height = qx.ui.menu.Layout.superclass.prototype._computeSizeHint.call(this).height;

        // Build hint
        return {
          minHeight: height,
          height: height,
          width: qx.lang.Array.sum(columnSizes) + maxInset + spacing
        };
      },
      /*
      ---------------------------------------------------------------------------
        CUSTOM ADDONS
      ---------------------------------------------------------------------------
      */

      /**
       * Returns the column sizes detected during the pre-layout phase
       *
       * @return {Array} List of all column widths
       */
      getColumnSizes() {
        return this.__columnSizes__P_110_0 || null;
      }
    },
    /*
     *****************************************************************************
        DESTRUCT
     *****************************************************************************
     */

    destruct() {
      this.__columnSizes__P_110_0 = null;
    }
  });
  qx.ui.menu.Layout.$$dbClassInfo = $$dbClassInfo;
})();
//# sourceMappingURL=package-13.js.map?dt=1791845587547
qx.$$packageData['13'] = {
  "locales": {},
  "resources": {},
  "translations": {}
};
