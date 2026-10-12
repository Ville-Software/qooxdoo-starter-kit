/**
 * Horizontal flex layout
 * @external(mantine/core/styles/Group.css)
 */
qx.Class.define("ville.ui.layout.HGroup", {

    extend: ville.ui.core.Widget,

    include: qx.ui.core.MChildrenHandling,

    construct(component) {

        if (component)
            this.__componenttag = component;

        super();

        this.setCssUtilityClass("m_4081bf90 mantine-Group-root");

    },

    properties: {

        gap: {
            init: "md",
            check: ["xs", "sm", "md", "lg", "xl"],
            apply: "_applyGap",
            themeable: true,
            nullable: true,
            event: "changeGap"
        },

        grow: {
            init: false,
            check: "Boolean",
            apply: "_applyGrow",
            nullable: true,
            themeable: true,
            event: "changeGrow"
        }

    },

    members: {

        __componenttag: "div",

        // overridden
        _createContentElement() {
            return new qx.html.Element(this.__componenttag);
        },

        _applyGap(value, old) {
            if (value) {
                this.getContentElement().setStyle("--group-gap", `var(--mantine-spacing-${value})`);
            } else if (old && value == null) {
                this.getContentElement().removeStyle("--group-gap");
            }
        },

        _applyGrow(value, old) {
            var elem = this.getContentElement();
            if (value) {
                elem.setAttribute("data-grow", "true");
                if (this.hasChildren()) {
                    const childcount = this.getChildren().length;
                    const percent = 100/childcount;
                    const gap = this.getGap();
                    const newstr = `calc(${percent}% - (var(--mantine-spacing-${gap}) - var(--mantine-spacing-${gap}) / ${childcount}))`;
                    elem.setStyle("--group-child-width", newstr);
                }

            } else {
                elem.removeAttribute("data-grow");
                elem.removeStyles("--group-child-width");
            }
        }

    }
  });
