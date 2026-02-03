/**
 * PasswordWrapper
 * @childControl innerwrapper {ville.ui.core.InnerWrapper}
 * @childControl inputwrapper {ville.ui.core.InnerWrapper}
 * @childControl sectionleft {ville.ui.form.InputSection}
 * @childControl sectionright {ville.ui.form.InputSection}
 * @external(mantine/core/styles/PasswordInput.css)
 */
qx.Class.define("ville.ui.form.PasswordWrapper", {
    extend: ville.ui.form.TextFieldWrapper,

    construct(textfield, variant, sectionleft, sectionright) {
        super(textfield, variant, sectionleft, sectionright); 

        this.setCssUtilityClass("m_f61ca620 mantine-PasswordInput-root m_46b77525 mantine-InputWrapper-root mantine-PasswordInput-root");
        this.getChildControl("innerwrapper").setCssUtilityClass("m_6c018570 mantine-Input-wrapper mantine-PasswordInput-wrapper");
        this.getChildControl("inputwrapper").addClass("m_8fb7ebe7 mantine-PasswordInput-input");

        if (sectionright) {
            var secrt = this.getChildControl("sectionright");
            secrt.removeClass("mantine-TextInput-section");
            secrt.addClass("mantine-PasswordInput-section");
            secrt.add(sectionright);
            // add show password click event
            sectionright.addListener("changeValue", (e) => {
                if (e.getData()) {
                    textfield.setAttribute("type", "text");
                } else {
                    textfield.setAttribute("type", "password");
                }
            });
        }
    },

    members: {

        // overridden
        _applyTextField(value, old) {
            if (value) {
                var innerwrapper = this.getChildControl("innerwrapper");
                if (innerwrapper) {
                    var inputwrapper = this.getChildControl("inputwrapper");
                    if (inputwrapper) {
                        inputwrapper.add(value);
                        innerwrapper.add(inputwrapper);
                    }
                }
            }
        }

    }
  });
