/*globals window, document, navigator, jQuery, setTimeout*/
(function ($, window) {
    "use strict";

    $(function () {
        // Disabling validation for also elements with .ignore class (:hidden are by default).
        var firstForm = $("form")[0],
            $validator = firstForm && $.data(firstForm, "validator"),
            validatorSettings = $validator && $validator.settings;

        if (validatorSettings) {
            validatorSettings.ignore = validatorSettings.ignore + ", .ignore";
        }

        //// Detecting if chrome.
        //$.browser.chrome = (typeof window.chrome === "object");
        //if ($.browser.chrome) { // If Chrome disable the date type to hide the datepicker.
        //    $("input[type='date']").prop("type", "text");
        //}
    });

    $.fn.extend({
        limit: function (maxAllowedChars, infoMessage) {
            var interval, f;
            var self = $(this);
            $(this).focus(function () {
                interval = window.setInterval(substring, 100);
            });
            $(this).blur(function () {
                clearInterval(interval);
                substring();
            });
            function substring() {
                var val = $(self).val();
                var length = val.length;
                if (length > maxAllowedChars) {
                    $(self).val($(self).val().substring(0, maxAllowedChars));
                    $(infoMessage).show();
                }
                if (length == maxAllowedChars) {
                    $(infoMessage).show();
                }
                else {
                    $(infoMessage).hide();
                }
            };
        }
    });
    window.onerror = function (message, url, linenumber) {
        // Try to show the generic error dialog. If it doesn't work and the console is displayed (which assumes we are debugging), throw an alert.
        try {
            $.ALZ.ShowDialog("overlay-UnknownError");
        } catch (e) {
            if (window.console && window.console.log) {
                window.console.log("Error raised: " + message + " on line " + linenumber + " for " + url);
            }
            window.alert(":( We are very sorry. An error has occurred or your session has timed out. Please try again later.");
        }
    };

    $(document).ajaxError(function (e, jqxhr) { // parameters accepted: e, jqxhr, settings, exception
        if (jqxhr) { // If you need error info you can get it from jqxhr but firebug is already showing that info so no need.
            $.ALZ.ShowDialog();
        }
    });

    if ($.ALZ === undefined) {
        // CR: This are field specific functions, put inside a .Field function for more clear separation of concerns.
        $.ALZ = {
            //#region CONSTANTS
            ALZ_MIN_DATE: "01/01/0001",
            DROPDOWN_PLEASE_SELECT: "-- Please select --",
            PAGE_ONE_ID: "#page1",
            DISABLE_OPACITY_VALUE: 0.1,
            RESET_OPACITY: 1,
            DISPLAY_DELAY_TIME: 300,
            //#endregion

            MakeJQueryId: function (id) {
                /// <summary>Returns a string that has the # to form a proper jquery id, and replaces "." with "_"s. If the id already has the # symbol it doesn't add twice.</summary>
                /// <param name="id" type="String">The id of the DOM element.</param>
                if (!id) {
                    throw new Error("id cannot resolve to false");
                }
                if (id instanceof jQuery) {
                    return id;
                }

                var sanitizedId = (id.charAt(0) !== "#") ? "#" + id : id;
                return sanitizedId.replace(".", "_");
            },

            IsViewedInMobile: function () {
                /// <summary>Returns true if the user agent specifies that it is a mobile device. IMPORTANT: It's not 100% reliable.</summary>
                if (navigator) {
                    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
                }
                return false;
            },

            IsNorthernIreland: function () {
                return ($("#IsNorthernIreland[type=hidden]").val() === "True");
            },

            GetCurrencySymbol: function (isNorthernIreland) {
                isNorthernIreland = isNorthernIreland || $.ALZ.IsNorthernIreland() || false;
                if (isNorthernIreland) {
                    return "\u00A3"; // £
                }
                return "\u20AC"; // €
            },

            IsEmptyField: function (id) {
                /// <summary>This function checks the input field whether it is empty</summary>
                /// <param name="id" type="string">The id of the DOM element that we want to check.</param>
                return ($.trim($(id).val()).length === 0);
            },

            IsMinDate: function (date) {
                /// <summary>This function evaluates that the date supplied is minimum date[01/01/0001]</summary>
                /// <param name="date" type="string">The id of the DOM element that we want to check.</param>
                return $.trim($(date).val()) === $.ALZ.ALZ_MIN_DATE;
            },

            ClearMinDate: function (datefield) {
                /// <summary>This function clears the date supplied if it is minimum date[01/01/0001]</summary>
                /// <param name="datefield" type="string">The id of the DOM element that we want to clear.</param>
                if ($.ALZ.IsMinDate(datefield)) {
                    $(datefield).val('');
                }
            },

            FormatDateOnly: function (dateTime) {
                return dateTime.replace(" 00:00:00", "");
            },

            RestrictMaxCharacters: function (id, numberOfCharacters) {
                $(id).attr("maxlength", numberOfCharacters);
            },

            AlphaNumericOnly: function (id) {
                $(id).keydown(function (e) {
                    var key = e.which || e.keyCode;
                    if ((!e.shiftKey && !e.altKey && !e.ctrlKey &&
                        // Numbers
                        key >= 48 && key <= 57 ||
                        // Numeric keypad
                        key >= 96 && key <= 105 ||
                        // Backspace, Tab and Enter
                        key === 8 || key === 9 || key === 13 ||
                        // Home and End
                        key === 35 || key === 36 ||
                        // Left and Right arrows
                        key === 37 || key === 39 ||
                        // Delete and Insert
                        key === 46 || key === 45 ||
                        // Space and plus
                        key === 32 || key === 107
                        ) || (key >= 65 && key <= 90) ||
                         (key >= 97 && key <= 105))
                        return true;
                    return false;
                });
            },

            NumericOnly: function (id) {
                /// <summary>This function forces the input element to accepts only numeric values[0-9]</summary>
                /// <param name="id" type="string">The id of the DOM element that we want to check.</param>
                $(id).keydown(function (e) {
                    var key = e.which || e.keyCode;
                    if (key === 9 || key === 8 || (key >= 35 && key <= 40)) { // 9: tab, 8: backspace, 35: Home, 36: End, 37: Left arrow, 39: Right arrow, 38: up arrow, 40: down arrow
                        return true;
                    }
                    if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                            ((key >= 48 && key <= 57) ||    // Numbers
                            (key >= 96 && key <= 105) ||    // Numeric keypad
                            (key === 13) ||                 // Enter
                            (key === 46 || key === 45))) {  // Delete and Insert
                        return true;
                    }

                    if (key === 33 || key === 34 || (e.ctrlKey && (key === 35 || key === 36))) { // 61 plus, 33: page up, 34: page down, 35: Home, 36: End
                        return true;
                    }

                    return false;
                });
            },

            NoSpaces: function (id) {
                /// <summary>This function forces the input element not to have spaces; useful for email, or numeric type input fields.</summary>
                /// <param name="id" type="string">The id of the DOM element that we want to check.</param>
                $(id).keydown(function (e) {
                    var key = e.which || e.keyCode;
                    if (key === 32) { // Space not allowed
                        return false;
                    }
                    return true;
                });
            },

            PhoneOnly: function (id) {
                /// <summary>This function forces the input element to accepts numeric values[0-9], spaces and plus symbol</summary>
                /// <param name="id" type="string">The id of the DOM element that we want to check.</param>
                $(id).keydown(function (e) {
                    var key = e.which || e.keyCode;
                    if (key === 9 || key === 8 || (key >= 35 && key <= 40)) { // 9: tab, 8: backspace, 35: Home, 36: End, 37: Left arrow, 39: Right arrow, 38: up arrow, 40: down arrow
                        return true;
                    }
                    if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                            ((key >= 48 && key <= 57) ||    // Numbers
                            (key >= 96 && key <= 105) ||    // Numeric keypad
                            (key === 13) ||                 // Enter
                            (key === 46 || key === 45) ||   // Delete and Insert
                            (key === 32 || key === 107))) { // Space and plus
                        return true;
                    }

                    if ((e.shiftKey && key === 61) || key === 33 || key === 34 || (e.ctrlKey && (key === 35 || key === 36))) { // 61 plus, 33: page up, 34: page down, 35: Home, 36: End
                        return true;
                    }
                    return false;
                });
            },

            DisableNotAllowedKeysInSpecialInputs: function (inputs) {
                /// <summary>Disables keyboard inputs for special html input tags; e.g.: number, tel, email...</summary>
                /// <param name="inputs" type="array">jQuery input objects. If not specified, takes default ones.</param>
                var $specialInputFields = inputs || $("input[type='numeric'], input[type='tel'], input[type='email']", "#page0, #page1, #page2, #page4");
                $.ALZ.NumericOnly("input[type='number']", $specialInputFields);
                $.ALZ.NoSpaces("input[type='email']", $specialInputFields);
                $.ALZ.PhoneOnly("input[type='tel']", $specialInputFields);
            },

            ConvertToCurrency: function (value, toPounds) {
                /// <summary>Returns a string representation of the value passed as currency; e.g.: €1,200.</summary>
                /// <param name="value" type="int">The value to return as currency.</param>
                /// <param name="toPounds" type="bool">If false or not present, it defaults to euros.</param>

                var result,
                    valueString = value.toString(),
                    valueLength = valueString.length;

                if (valueLength > 3) {
                    result = this.GetCurrencySymbol(toPounds) + valueString.substring(0, valueLength - 3) + "," + valueString.substring(valueLength - 3, valueLength);
                } else {
                    result = this.GetCurrencySymbol(toPounds) + valueString;
                }
                return result;
            },

            GetApplicationRoot: function () {
                return $.ALZ.AddressConfiguration.ApplicationRoot || "";
            },

            GetSessionTimeOut: function () {
                return $.ALZ.SessionTimeOut;
            },

            GetLoginUrl: function(){
                return $.ALZ.LoginUrl;
            },

            DisableButton: function (selector, enable, context, dontUseDisableProperty) {
                var $selector, elementType, $container, $buttons,
                    $alz = $.ALZ;
                if (context) {
                    $selector = $(selector, context);
                } else {
                    $selector = $(selector);
                }

                elementType = $selector.prop("tagName");
                if (elementType === "DIV") {
                    $container = $selector;
                    $buttons = $("button, input[type=button]", $container);
                } else if (elementType === "BUTTON" || elementType === "INPUT") {
                    $container = $selector.closest("div");
                    $buttons = $selector;
                } else {
                    throw new Error("This selector is not of the correct type.");
                }

                if (enable) {
                    if (!dontUseDisableProperty) {
                        $buttons.prop("disabled", false);
                    }
                    $container.animate({ opacity: $alz.RESET_OPACITY }, $alz.DISPLAY_DELAY_TIME);
                } else {
                    if (!dontUseDisableProperty) {
                        $buttons.prop("disabled", true);
                    }
                    $container.stop().animate({ opacity: $alz.DISABLE_OPACITY_VALUE }, $alz.DISPLAY_DELAY_TIME);
                }
            },

            DisableButtonsWhenSubmit: function () {
                $(function () {
                    var $forms = $("form"),
                        $submitButtons = $("button[type=submit].primary, input[type=submit].primary"),

                        submitForm = function (event) {
                            /// <summary>Is done in this way to make Chrome able to submit when buttons are disabled.</summary>
                            var form = this.form;
                            event.preventDefault();
                            $.ALZ.DisableButton(this);
                            if (!$(form).valid()) {
                                $.ALZ.DisableButton(this, true);
                                $.ALZ.FocusFirstError();
                            } else { // form is valid.
                                setTimeout(function () { // Enabling submit buttons after some time, in case something went wrong.
                                    $submitButtons.each(function () {
                                        $submitButtons.one("click", submitForm);
                                        if ($(this).is(":disabled")) {
                                            $.ALZ.DisableButton(this, true);
                                        }
                                    });
                                }, 30000); // 30 seconds.
                                form.submit();
                            }
                        };

                    $forms.on("invalid-form.validate", function () { // Enabling submit buttons as there were client errors.
                        $submitButtons.each(function () {
                            $.ALZ.DisableButton(this, true);
                        });
                    });

                    $submitButtons.click(submitForm);
                });
            },

            AddOptionsToDropdown: function ($dropdown, data, extraEndNotValidOption, extraBeginNotValidOption, valueFieldName, textFieldName) {

                function GetOptionTag(text, value, data) {
                    if (value === undefined) {
                        return "<option value=''>" + text + "</option>";
                    }
                    if (data === undefined || data === null) {
                        return "<option value='" + value + "'>" + text + "</option>";
                    } else {
                        var dataAttributes = "";
                        $.each(data, function (key, item) {
                            dataAttributes += " data-" + key + " = '" + item + "' ";
                        });
                        return "<option value='" + value + "'" + dataAttributes + ">" + text + "</option>";
                    }
                }

                var newOptions = "";
                valueFieldName = valueFieldName || "Value";
                textFieldName = textFieldName || "Text";

                if (extraBeginNotValidOption) {
                    newOptions = GetOptionTag(extraBeginNotValidOption);
                }
                $.each(data, function () {
                    newOptions += GetOptionTag(this[textFieldName], this[valueFieldName], this["DataAttributes"]);
                });

                if (extraEndNotValidOption) {
                    newOptions += GetOptionTag(extraEndNotValidOption);
                }
                $dropdown.html(newOptions);
            },

            GetSelectedValueFromDropdown: function (id) {
                id = $.ALZ.MakeJQueryId(id);
                return $("option:selected", id).val();
            },

            GetSelectedValueFromDropdownWithComposedValue: function (id) {
                var selectedValue = $.ALZ.GetSelectedValueFromDropdown(id);
                return selectedValue.substring(selectedValue.indexOf("|") + 1);
            },

            SelectOptionInDropdownWithComposedValue: function (controlId, realValue) {
                controlId = $.ALZ.MakeJQueryId(controlId);
                $("option[value $= '|" + realValue + "']", controlId).prop("selected", true);
            },

            ToggleCheckboxes: function (className) {
                /// <summary>To make checkboxes user friendly.</summary>
                /// <param name="className" type="string">jQuery className to specify these checkboxes. If not provided: ".toggleCheckbox" is used</param>

                var $toggleCheckboxContainers;
                className = className || ".toggleCheckbox";
                $toggleCheckboxContainers = $(className);

                $toggleCheckboxContainers.click(function (e) {
                    var $this = $(this),
                        $checkbox = $("input[type=checkbox]", $this),
                        eventCausedByClickingOnCheckbox = $(e.target).is(":checkbox");

                    if (!eventCausedByClickingOnCheckbox) {
                        if ($checkbox.is(":checked")) {
                            $checkbox.prop("checked", false);
                        } else {
                            $checkbox.prop("checked", true);
                        }
                    }

                    if ($checkbox.is(":checked")) {
                        $this.prev("div.alertmsg").hide();
                    } else {
                        $this.prev("div.alertmsg").show();
                    }
                });
            },

            ValidateMandatoryCheckboxes: function (className) {
                /// <summary>Necessary when the checkboxes aren't contained inside a form.</summary>
                /// <param name="className" type="string">jQuery className to specify these checkboxes. If not provided: ".mandatoryCheckbox" is used</param>

                var $toggleCheckboxContainers,
                    $checkboxes,
                    isValid = true;
                className = className || ".mandatoryCheckbox";
                $toggleCheckboxContainers = $(className);
                $checkboxes = $("input[type=checkbox]", $toggleCheckboxContainers).filter(":visible").not(".ignore");
                $checkboxes.each(function () {
                    if (!this.checked) {
                        isValid = false;
                        $(this).closest("DIV").prev("div.alertmsg").show();
                    } else {
                        $(this).closest("DIV").prev("div.alertmsg").hide();
                    }
                });
                return isValid;
            },

            ShowDialog: function (errorDivId) {
                var $errorDivId;
                errorDivId = errorDivId || "#overlay-domainError"; // overlay-domainError is a div in the layout with the generic domain error message.
                $errorDivId = $($.ALZ.MakeJQueryId(errorDivId));

                if ($errorDivId.length < 1) {
                    throw new Error("The generic error message div doesn't exist in the page.");
                }

                $errorDivId.overlay({
                    top: 'center',
                    mask: {
                        color: '#003781',
                        loadSpeed: 400,
                        opacity: 0.6
                    },
                    closeOnClick: true
                });
                $errorDivId.data("overlay").load(); // Although looks strange, this is the way to make it appear everytime we need programatically.
                return true;
            },

            DisplayDomainError: function (id, messageInDiv) {
                /// <summary>This function display the domain error message based on the value provided in id field and display the info contained in div</summary>
                /// <param name="id" type="String">This boolean value decides to display message; e.g.: #IsDomainError</param>
                /// <param name="messageInDiv" type="String">The message to display wrapeed inside div; e.g.: #btnDomainError</param>
                var $id = $($.ALZ.MakeJQueryId(id)),
                    $messageInDiv = $($.ALZ.MakeJQueryId(messageInDiv));
                if (($id.length > 0) && ($messageInDiv.length > 0)) {
                    if ($id.val().toLowerCase() === 'true') {
                        $.ALZ.ShowDialog();
                    }
                } else {
                    throw new Error("Make sure that there is a hidden field tag for each domain error; e.g.: #IsDomainError");
                }
            },

            GetSelectedValueFromRadioButton: function (name, container) {
                if (container) {
                    container = $.ALZ.MakeJQueryId(container);
                } else {
                    container = $("form")[0];
                }
                return $("input[name='" + name + "']", container).filter(":radio:checked").val();
            },

            // CR: This should be improved for performance reasons.
            DropdownsCallbackSuccess: function (dropdownHtmlId) {
                return function (sumsInsuredList) {
                    var $sumsInsuredDropdown = $(dropdownHtmlId);
                    $sumsInsuredDropdown.empty();

                    if (parseInt($sumsInsuredDropdown[0].Value, 10) > -1) {
                        $sumsInsuredDropdown.append("<option value = ''>" + $.ALZ.DROPDOWN_PLEASE_SELECT + "</option>");
                    }
                    $.each(sumsInsuredList, function (index, sumInsuredData) {
                        $sumsInsuredDropdown.append(
                            $("<option></option>").val(sumInsuredData.Value).html(sumInsuredData.Text)
                        );
                    });
                };
            },

            GetDropdownSubscribe: function (dropdownHtmlId, relativeUrl, getAjaxObject) {
                var applicationRoot = $.ALZ.GetApplicationRoot(),
                    getDropdownsCallSuccess = $.ALZ.DropdownsCallbackSuccess(dropdownHtmlId);
                $.getJSON(applicationRoot + relativeUrl, getAjaxObject(), getDropdownsCallSuccess).error(function () {
                    window.location.href = applicationRoot + "/Error/IndexAjax";
                });
            },

            MakeUserFriendlyRadioButtons: function () {
                /// <summary>Creates real "buttons" for radio buttons, making the entire "box" selectable.</summary>
                $("label > input[type='radio']", "span.radiobtn").closest("span.radiobtn").click(function () {
                    var $radioButton = $("label > input[type='radio']", this).filter(":first");
                    if (!$radioButton.prop("checked")) {
                        $radioButton.prop("checked", true);
                        $radioButton.trigger("click", null);
                        $radioButton.trigger("change", null); // Required as the change event isn't triggered and is used like in 2nd page for showing recalculate button.
                        if ($radioButton.is(":visible")) { // Important- There is a risk in this. There can be senario that trigger event does not processed before arriving to this point. This was added due to Motor Cover page.
                            $radioButton.valid();
                        }
                    }
                    $radioButton.trigger("focus", null); // Required as otherwise it seems not triggered and must be outside the if as we always want to focus.
                });
            },

            ShowIfRadioYes: function (radioButtonYesName, selectorToShow) {
                /// <summary>Shows/Hides the elements that match the selectorToShow parameter if the radio clicked is "Yes".</summary>
                /// <param name="radioButtonYesName" type="String">The name attribute of the DOM radio button element.</param>
                /// <param name="selectorToShow" type="String">The jquery selector to show/hide.</param>
                var $radio = $("input[type='radio'][name='" + radioButtonYesName + "']");
                $.each($radio, function () {
                    this.selectorToShow = selectorToShow;
                });
                $radio.on("ALZ.RedisplayDependants", null, null, function (event) {
                    var element = event.target;
                    $.ALZ.RedisplayByRadio(element);
                });
                $radio.click(function () {
                    $(this).trigger("ALZ.RedisplayDependants");
                });
            },

            Focus: function (controlIdToFocus) {
                var $controlToFocus = $(controlIdToFocus),
                    offsetToRemove = ($controlToFocus.is(":checkbox")) ? 90 : 20;
                if ($controlToFocus.length) {
                    $('html, body').animate({
                        scrollTop: ($controlToFocus.offset().top - offsetToRemove)
                    }, 750);
                    $controlToFocus.focus();
                }
            },

            FocusNextInput: function (currentElement) {
                /// <summary>Sets the focus in the next user input element.</summary>
                /// <param name="currentElement" type="Object">The current input element selected.</param>
                $(currentElement).closest("div.formitem")
                                 .nextAll()
                                 .filter(":visible")
                                 .filter(":first")
                                 .find(".forminput:visible")
                                 .filter(":first")
                                 .children()
                                 .filter(":first")
                                 .focus();
            },

            FocusNextWhenTab: function (event) {
                var code = event.keyCode || event.which;
                if (code === 9 && !event.shiftKey) { // Tab key but not Shift Tab key)
                    $.ALZ.FocusNextInput(this);
                }
            },

            FocusFirstError: function () {
                $.ALZ.FocusFirstInputWithAnError();
            },

            RedisplayByRadio: function (element) {
                /// <summary>IMPORTANT: Don't use this function directly. It should be used only internally by the ALZ library.</summary>
                /// <param name="element" type="Object">The jQuery selector to show.</param>
                if (element.selectorToShow) {
                    var $radioButton = $(element);
                    if ($radioButton.val().toLowerCase() === 'true') {
                        $(element.selectorToShow).show();
                    } else {
                        $(element.selectorToShow).hide();
                    }
                }
            },

            RedisplayByDropdown: function (element) {
                /// <summary>IMPORTANT: Don't use this function directly. It should be used only internally by the ALZ library.</summary>
                /// <param name="element" type="Object">The jQuery selector to show.</param>
                var toShow = element.selectorToShow,
                    conditionFunction = element.conditionFunction,
                    selected;
                if (toShow && conditionFunction) { // Checking this as it can happen that in ROI there is a dependancy but not in NI; e.g.: LendingInstitutionLocation.
                    selected = $("option", element).filter(":selected").val();
                    if (conditionFunction(selected)) {
                        $(toShow).removeClass("initialstatehidden").show();
                    } else {
                        $(toShow).hide();
                    }
                }
            },

            ShowIfDropdownWith: function (dropdownId, selectorToShow, conditionFunction) {
                /// <summary>Shows/Hides elements depending on the value of the selected item in a dropdown. IMPORTANT: it's not valid for all scenarios.
                ///             Only works for scenarios in where the selectorToShow needs to be hidden if the condition doesn't match.</summary>
                /// <param name="dropdownId" type="String">Defines the DOM id of the dropdown.</param>
                /// <param name="selectorToShow" type="String">A jQuery selector to apply the .show(); e.g.: .buildingsuminsured"</param>
                /// <param name="conditionFunction" type="Object">This can be a function or a string. 
                ///             If a string or number it refers to the value to match against the selected value in the dropdown.
                ///             If it's a function, must return true or false and must have a parameter that will contain the selected value of the dropdown.</param>
                var valueToMatch, $dropdown;
                if (typeof conditionFunction !== "function") { // This assumes that what we are passing is a value (string or number) to match the selected dropdown value.
                    // Creating a simple function that checks for equality of the passing value.
                    valueToMatch = conditionFunction;
                    conditionFunction = function (selectedValue) {
                        return selectedValue === valueToMatch;
                    };
                }

                dropdownId = $.ALZ.MakeJQueryId(dropdownId);
                $dropdown = $(dropdownId);
                if ($dropdown.length > 0) {
                    $dropdown[0].conditionFunction = conditionFunction;
                    $dropdown[0].selectorToShow = selectorToShow;
                    this.MarkAsHavingDependants($dropdown);
                    $dropdown.on("ALZ.RedisplayDependants", null, null, function (event) {
                        var element = event.target;
                        $.ALZ.RedisplayByDropdown(element);
                    });
                    $dropdown.on("change", null, $dropdown[0], function (event) {
                        var element = event.target;
                        $(element).trigger("ALZ.RedisplayDependants");
                    });
                }
            },

            MarkAsHavingDependants: function (id) {
                $(id).addClass("hasDependants");
            },

            RedisplayDependants: function () {
                /// <summary>Runs the hide/show of all basic radio buttons and dropdowns.</summary>
                $("input[type='radio']").filter(":checked").each(function () {
                    $(this).trigger("ALZ.RedisplayDependants");
                });
                // Showing/hiding dropdown dependants.
                $("select.hasDependants").each(function () {
                    $(this).trigger("ALZ.RedisplayDependants");
                });
            },

            FocusFirstInputWithAnError: function () {
                var $firtInputWithError = $(".invalid, .input-validation-error, #page0, #page1, #page2, #page3, #page4").filter(":visible:first");
                if ($firtInputWithError.length) {
                    $.ALZ.Focus($firtInputWithError);
                }
            },

            GetQueryStringValueByName: function (queryStringParamName) {
                /// <summary>Get the value of input parameter from the querystring.</summary>
                /// <param name="queryStringParamName" type="String">The input parameter whose value is to be extracted.</param>
                var pattern = '[\\?&]' + queryStringParamName + '=([^&#]*)',
                    regex = new RegExp(pattern),
                    matches = regex.exec(window.location.href);
                if (matches === null) {
                    return '';
                }
                return decodeURIComponent(matches[1].replace(/\+/g, ' '));
            },

            ConfigureValidators: function () {
                /// <summary>Uniforms dropdowns and radio button client validation LOOK AND FEEL.</summary>
                var $firstForm = $("form"),
                    settings,
                    oldErrorHandler;
                if ($firstForm.length > 0) { // To avoid errors; Thank you page for instance doesn't contain a form.
                    settings = $.data($firstForm[0], 'validator').settings;
                    oldErrorHandler = settings.errorPlacement;
                    settings.errorPlacement = function (error, inputElement) {
                        oldErrorHandler(error, inputElement);
                        if (error.text()) {
                            if ($(inputElement).is("select")) {
                                $(inputElement).parent().addClass("invaliddropdown");
                            } else if ($(inputElement).is("input[type='radio']")) {
                                $(inputElement).closest("div.forminput").addClass("invalidradiobutton");
                            }
                        } else {
                            if ($(inputElement).is("select")) {
                                $(inputElement).parent().removeClass("invaliddropdown");
                            } else if ($(inputElement).is("input[type='radio']")) {
                                $(inputElement).closest("div.forminput").removeClass("invalidradiobutton");
                            }
                        }
                    };
                }
            },

            DisableCallablePhoneNumbersIfNotInMobile: function () {
                var $callableLinks;
                if ((!$.ALZ.IsViewedInMobile()) && ($(window).width() >= 800)) {
                    $callableLinks = $("a.callable");
                    $callableLinks.css("cursor", "default");
                    $callableLinks.click(function (e) {
                        e.preventDefault();
                    });
                }
            }
        };
    }
    $.validator.unobtrusive.adapters.add("mandatory", function (options) {
        options.rules.required = true;
        if (options.message) {
            options.messages.required = options.message;
        }
    });
    $.validator.unobtrusive.adapters.addBool("mandatory", "required");

    //// This is a method that checks if checkboxes decorated with data-mandatorycheckbox attribute, which makes them mandatory, are checked or not.
    //// This is due to "data-required" not working with checkboxes due to Microsoft interpretation of required, that is not the same as mandatory.
    //$.validator.addMethod("mandatory", function (value, element, parameters) { //options contains {element, form, message, params, rules, messages}
    //    var $element = $(element);
    //    if ($element.is(":checkbox")) {
    //        return ($element.filter(":checked").val());
    //    } else {
    //        throw new Error("data-mandatory validation attribute is only for checkboxes. '" + $element.attr("name") + "' is not a checkbox.");
    //    }
    //});
    ////, "You need to agree with this statement to be able to continue, tick the checkbox if so.");
    //$.validator.unobtrusive.adapters.addBool("mandatory");


    // This is a HACK to allow chrome to validate the date input in DD/MM/YYYY format.
    // Reference: http://stackoverflow.com/questions/6866172/override-jquery-date
    $.validator.addMethod("date", function (inputdate, element) {
        var changedDate,
            bits = inputdate.match(/([0-9]+)/gi);
        if (!bits) {
            return this.optional(element) || false;
        }
        changedDate = bits[1] + '/' + bits[0] + '/' + bits[2];
        return this.optional(element) || !/Invalid|NaN/.test(new Date(changedDate));
    }, "Please enter a date in the format dd/mm/yyyy");

    $.cachedScript = function (url, options) {
        options = $.extend(options || {}, {
            dataType: "script",
            cache: true,
            url: url
        });
        return jQuery.ajax(options);
    };
}(jQuery, window));