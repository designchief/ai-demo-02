// JavaScript Document

$(function () {
    'use strict';

    $.ALZ.DisableCallablePhoneNumbersIfNotInMobile();

    // This is to achieve unobtrusive validatin for custom fluent validation (EqualCaseInsensitive).
    $.validator.addMethod('caseinsensitiveequalto', function (value, element, params) {
        return value.toLowerCase() === $('#' + params.field).val().toLowerCase();
    }, "Both field must match.");

    $.validator.unobtrusive.adapters.add('caseinsensitiveequalto', ['field'], function (options) {
        options.rules['caseinsensitiveequalto'] = options.params;
        if (options.message) options.messages['caseinsensitiveequalto'] = options.message;
    });

    // WAM: Logout the active session if user clicks any external link.
    $(".sessionlogout").click(function (e) {
        if ($('#logoutForm').length > 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#browesaway").prop('href', $(this).attr('href'));
            $('#confirm-browse').foundation('reveal', 'open');
        }
    });

    $('#browesaway').click(function () {
        var $browseaway = $(this);
        window.open($browseaway.attr('href'), $browseaway.attr('target'));
        $('#logoutForm').submit();
        return false;
    });

    // Reloading the page if hash changes. It is required for Inbox page.
    $(window).on('hashchange', function () {
        var hash = window.location.hash.substring(1);
        if (hash !== '' && hash.match('^message-')) {
            window.location.reload();
        }
    });

    var rcMainSectionClass = ".rc-accordion-sections";

    // call functions for Request Changes save, edit, cancel buttons
    rcSaveButtonAction(rcMainSectionClass);
    rcEditButtonAction(rcMainSectionClass);
    rcCancelButtonAction(rcMainSectionClass);

    // remove links default refresh event from rc links
    removeHrefDefault("#rc-forms a");

    // remove default refresh event from links
    function removeHrefDefault(element) {
        $(element).click(function (event) {
            if (!($(this).hasClass('hrefRequired'))) {
                event.preventDefault();
            }
        });
    }

    // get main section
    function rcMainSection(thisEvent) {
        var getSection = thisEvent.closest(rcMainSectionClass);
        return getSection;
    }

    // get main section child element
    function rcMainSectionChild(thisEvent, element) {
        var getSectionChild = rcMainSection(thisEvent).children(element);
        return getSectionChild;
    }

    // close accordion tab
    function rcCloseRcTab(thisEvent) {
        rcMainSection(thisEvent).removeClass("active");
    }

    // add or remove "saved" button 
    function rcRemoveSavedBut(thisEvent) {
        rcMainSectionChild(thisEvent, "p.title").removeClass("rc-saved");
    }

    function rcAddSavedBut(thisEvent) {
        rcMainSectionChild(thisEvent, "p.title").addClass("rc-saved");
    }

    // form that will appears after saving changes
    function rcShowSavedContent(thisEvent) {
        rcMainSectionChild(thisEvent, "div").find(".rc-request").show();
    }

    function rcHideSavedContent(thisEvent) {
        rcMainSectionChild(thisEvent, "div").find(".rc-request").hide();
    }

    // show or hide tabs main fields
    function rcShowTabsContent(thisEvent) {
        rcMainSectionChild(thisEvent, "div").find(".rc-form").show();
    }

    function rcHideTabsContent(thisEvent) {
        rcMainSectionChild(thisEvent, "div").find(".rc-form").hide();
    }

    // Notification for users to submit changes
    function rcShowUnsubmitedAlert(thisEvent) {
        $(".rc-submit-general").show();
    }

    function rcHideUnsubmitedAlert(thisEvent) {
        if ($(".rc-accordion-sections>p.rc-saved").length == 0) {
            $(".rc-submit-general").hide();
            $("#rc-submit-box-01").hide();
        }
    }

    // To Display Message when Claims Doesnt exist for the Policy Number
    var claimsExists = $("#IsClaimExists").val();
    if (claimsExists == "False") {
        $('#claimsdoesntexist').foundation('reveal', 'open');
    }

    // To Display Message when Documents Doesnt exist for the Policy Number
    var documentExists = $("#IsDocumentExists").val();
    if (documentExists == "False") {
        $('#documentdoesntexist').foundation('reveal', 'open');
    }

    // It shows the confirmation message for payment success.
    if (($("#DirectDebitOk").val() !== undefined) && $("#DirectDebitOk").val().toLowerCase() === 'true') {
        $('#payment-success-directDebit').foundation('reveal', 'open');       
    }

    if (($("#CreditCardOk").val() !== undefined) && $("#CreditCardOk").val().toLowerCase() === 'true') {
        $('#payment-success-creditCard').foundation('reveal', 'open');
    }

    if (($("#isMobileChangeNotAllowed").val() !== undefined) && $("#isMobileChangeNotAllowed").val().toLowerCase() === 'true') {
        $('#mobile-change-cancelled').foundation('reveal', 'open');
    }

    // function that will be triggered, when user clicks: "Save & request another change" button
    function rcSaveButtonAction(id) {
        $(rcMainSectionClass).on("click", " .rc-save-btn", function () {
            var thisEvent = $(this);
            if (!thisEvent.hasClass('invalid')) {
                rcAddSavedBut(thisEvent);
                rcShowUnsubmitedAlert(thisEvent);
                rcHideTabsContent(thisEvent);
                rcShowSavedContent(thisEvent);
            }
        });
    }

    // function that will be triggered, when user clicks: "Edit Changes" button
    function rcEditButtonAction(id) {
        $(rcMainSectionClass).on("click", " .rc-edit-btn", function () {
            var thisEvent = $(this);
            rcRemoveSavedBut(thisEvent);
            rcHideSavedContent(thisEvent);
            rcShowTabsContent(thisEvent);
        });
    }

    // function that will be triggered, when user clicks: "Cancel" button
    function rcCancelButtonAction(id) {
        $(rcMainSectionClass).on("click", " .rc-cancel-btn", function () {
            var thisEvent = $(this);
            rcHideSavedContent(thisEvent);
            rcShowTabsContent(thisEvent);
            rcRemoveSavedBut(thisEvent);
            rcCloseRcTab(thisEvent);
            rcHideUnsubmitedAlert(thisEvent);
        });
    }

    //close button for notifications	
    $(document).on("click", ".close-btn", function () {
        $(this).hide();
        $(this).parent().hide();
    });

    //inbox button	
    $("#nav-inbox").click(function () {
        $(this).removeClass("notification");
    });

    //payment filter	
    var payTabsClass = ".tabs-buttons";

    // remove links default refresh event from payments tab links
    removeHrefDefault(payTabsClass + " a");

    // Tabs Switcher
    $(payTabsClass + " dd").click(function () {
        var thisEvent = $(this);
        //thisEvent.addClass("active");
        //thisEvent.siblings().removeClass("active");
        // $('.paymentcontent').show();
        var getTabContentClass = thisEvent.children().attr('event-data');

        var activeTabContentId = $("#" + getTabContentClass);
        activeTabContentId.show();
        activeTabContentId.siblings('.tabs-content').hide();
    });

    //payment list alert	
    $("#pay-alert-trigger").click(function () {
        $("#pay-alert").toggle();
    });

    // remove links default refresh event from star raters
    removeHrefDefault(".star-rater a");

    // star rater functionality	
    $(".star-rater a").click(function () {
        var thisEvent = $(this);
        var curStar = thisEvent.attr("event-data");
        for (var star = 1; star <= 5; star++) {
            if (curStar >= star) {
                $(".star-" + star).addClass("star-icn-blue");
            } else {
                $(".star-" + star).removeClass("star-icn-blue");
            }
        }
    });

    // Inbox functionality.
    $(".inboxmessageunread").click(function () {
        $(this).closest('.rc-accordion-sections').attr('style', "color: black");
    })

    $(rcMainSectionClass).on("click", ".rc-ppc-y", function () {
        var thisEvent = $(this);
        thisEvent.closest(".rc-form").find(".rc-pcc-content-02").hide();
        thisEvent.closest(".rc-form").find(".rc-pcc-content-01").show();
    });

    $(rcMainSectionClass).on("click", ".rc-ppc-n", function () {
        var thisEvent = $(this);
        thisEvent.closest(".rc-form").find(".rc-pcc-content-01").hide();
        thisEvent.closest(".rc-form").find(".rc-pcc-content-02").show();
    });

    $("#rcAddPet").click(function (e) {
        e.preventDefault();
        $('#terms-conditions').foundation('reveal', 'open');
    });

    $("#next").click(function (e) {
        e.preventDefault();
        if ($("#AcceptTermsandConditions").is(':checked')) {
            $('#checkboxNotSelectedErrorMessage').hide();
            $('#terms-conditions').foundation('reveal', 'close');
            $('#validaddpetlink')[0].click();
        }
        else {
            $('#checkboxNotSelectedErrorMessage').show();
        }
    });

    $(".date-picker-01").pickadate();
    $(".time-picker-01").pickatime();

    // select inputs empty by default
    // TODO: It is not required as the first item is "-- Please Select --" in the drop downs. 
    // $("select").prop("selectedIndex", -1);
    var waitDots = window.setInterval(function () {
        $(".waitingdots:visible").each(function () {
            var noOfDots = $(this).attr('data-noofdots');
            if (this.innerHTML.length > noOfDots)
                this.innerHTML = "";
            else
                this.innerHTML += ".";
        });
    }, 200);

    $("#claimsoption").change(function () {

        var selectedclaimScenario = $("#claimsoption option:selected").val();

        if (selectedclaimScenario == "01") {
            $("#userActions").show();
            $("#accident").show();
            $("#theft").hide();
            $("#windscreen").hide();
            $("#topButtons").show();
            $("#bottomButtons").show();
        }

        else if (selectedclaimScenario == "02") {
            $("#accident").hide();
            $("#theft").show();
            $("#windscreen").hide();
            $("#userActions").show();
            $("#topButtons").show();
            $("#bottomButtons").show();
        }

        else if (selectedclaimScenario == "03") {
            $("#accident").hide();
            $("#theft").hide();
            $("#windscreen").show();
            $("#userActions").show();
        }

        else {
            $("#accident").hide();
            $("#theft").hide();
            $("#windscreen").hide();
            $("#userActions").hide();
            $("#topButtons").hide();
            $("#bottomButtons").hide();
        }

    });

    claimOptions("ThirdParty", "ThirdPartyDetails");
    claimOptions("Passengers", "PassengerDetails");
    claimOptions("Garda", "GradaDetails");
    claimOptions("Witness", "WitnessDetails");

    function claimOptions(name, containerId) {
        $("input[name=" + name + "]").change(function () {
            var selectedValue = $(this).val();
            if (selectedValue == "Yes") {
                $("#" + containerId).show();
            }
            else {
                $("#" + containerId).hide();
            }
        });
    }

    // File Upload scripts -- start.
    // FIX: Added document to handle events if html is loaded dynamically.
    $(document).on('click', '.uploadDialogLink', function () {
        var iframelink = $(this).attr("data-upload-link");
        var divId = $(this).attr("data-reveal-id");
        $('#' + divId + "> iframe").remove();
        setTimeout(function () {
            $('<iframe />', {
                src: iframelink,
                width: "100%",
                height: "600px"
            }).appendTo('#' + divId);
        }, 500);
    });

    //preventing double click
    $("body").on("submit", "form", function () {
        var $form = $(this);
        if ($form.valid && $form.valid()) {
            $(":submit", $form).attr("disabled", true);
            return true;
        }
    });

    //preventing double click on claims
    $("#ConfirmSubmit").on("click", function () {
        $(this).attr("disabled", true);
    });

});






