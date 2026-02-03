qx.Class.define("ville.ui.icon.Abstract", {
    
    extend: ville.ui.core.Widget,

    type: "abstract",

    construct() {

        super();

    },

    properties: {

        xmlns: {
            check: "String",
            init: "http://www.w3.org/2000/svg",
            nullable: false,
        },

        viewBox: {
            check: "String",
            init: "0 0 24 24",
            apply: "_applyViewBox",
            nullable: false,
            themeable: true,
            event: "changeViewBox"
        },

        fill: {
            check: "String",
            init: "none",
            apply: "_applyFill",
            nullable: true,
            themeable: true,
            event: "changeFill"
        },

        strokeWidth: {
            check: "Number",
            init: "1",
            apply: "_applyStrokeWidth",
            nullable: true,
            themeable: true,
            event: "changeStrokeWidth"
        },

        stroke: {
            check: "String",
            init: "currentColor",
            nullable: true,
            themeable: true,
            event: "changeStroke"
        },

        strokeLinecap: {
            check: "String",
            init: "round",
            nullable: true,
            themeable: true,
            event: "changeStrokeLinecap"
        },

        strokeLinejoin: {
            check: "String",
            init: "round",
            nullable: true,
            themeable: true,
            event: "changeStrokeLinejoin"
        }

    },

    members: {

        __fulliconmarkup : null,

        _applyViewBox(value, old) {
            if (value) {
                this.setAttribute("viewBox", value);
            }
        },

        _applyFill(value, old) {
            if (value) {
                this.setAttribute("fill", value);
            }
        },

        _applyStrokeWidth(value, old) {
            if (value) {
                this.setAttribute("stroke-width", value);
            }
        },

        // overridden
        _applyCssUtilityClass(value, old) {
          var content = this.getContentElement().getDomElement();
          if (value) {
            content.setAttribute("class", value);
          }
        }

    },

    destruct() {
        this._disposeObjects("__fulliconmarkup");
    }
  });
