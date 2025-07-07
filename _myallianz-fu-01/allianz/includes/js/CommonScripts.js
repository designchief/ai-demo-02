var cookieName = "SIVISITOR";
var mobileURL = "http://m.allianzni.co.uk";
String.prototype.startsWith = function(str)
{ return (this.match("^" + str) == str) }

function GetQueryValue(ji) {
    hu = window.location.search.substring(1);
    gy = hu.split("&");
    for (i = 0; i < gy.length; i++) {
        ft = gy[i].split("=");
        if (ft[0] == ji) {
            return ft[1];
        }
    }
}

//Tag Quicklinks areas(1-4)
function TagQuicklinks() {

    $('.link-col').each(function(index) {
        $(this).find("a").each(function(i) {
            $(this).click(function() { return sitracker.trackLink($(this).attr('id')); });

            //Add Id Value
            var boxNumber = index;
            if (index > 3) { //deal with adding last 3 boxes
                boxNumber = 3;
            }

            $(this).attr("id", "QuickLink" + (boxNumber + 1) + "_" + replaceSpaces($(this).text()));


        });
    });
}

//Tag rotating images on home page carousel
function TagRotatinglinks() {
    if ($("#slides").length) { //save cpu if element is not present
        $('.slides_container a').each(function(index) {
            $(this).attr("id", "RotatingBanner" + (index + 1) + "_" + replaceSpaces($(this).attr("href")));

            if (($(this).attr("href").startsWith("/"))) {
                $(this).click(function() { sitracker.trackLink($(this).attr("id")); });
            }
            else {
                $(this).click(function() { sitracker.trackExternalLink($(this).attr("id"), function() { }); });
            }
        });
    }
}

//Tag Mash Headers on landing/inside pages
function TagHeadBannerlinks() {
    if ($(".masthead a").length) { //save cpu if element is not present
        $('.masthead a:first').attr("id", "LandingBanner_" + replaceSpaces($('.masthead a:first').attr("href")));
        if (($(".masthead a:first").attr("href").startsWith("/"))) {
            $(".masthead a:first").click(function() { sitracker.trackLink($('.masthead a:first').attr("id")); });
        }
        else {

            $(".masthead a:first").click(function() { sitracker.trackExternalLink($('.masthead a:first').attr("id"), function() { }); });
        }   
    }
}

//Tag all social links on footer
function TagSociallinks() {
    if ($(".social-links").length) {
        //add individual id's
        $(".social-links li#blog a").attr("id", "SocialLink-Blog");
        $(".social-links li#facebook a").attr("id", "SocialLink-Facebook");
        $(".social-links li#twitter a").attr("id", "SocialLink-Twitter");
        $(".social-links li#youtube a").attr("id", "SocialLink-Youtube");
        $(".social-links li#newsletter a").attr("id", "SocialLink-newsletter");
        //apply event to all
        //change blog for enternal link
        $(".social-links li#blog a").click(function() { return sitracker.trackLink($(".social-links li#blog a").attr("id")); }); //internal
        $(".social-links li#facebook a").click(function() { return sitracker.trackExternalLink($(".social-links li#facebook a").attr("id"), function() { }); });
        $(".social-links li#twitter a").click(function() { return sitracker.trackExternalLink($(".social-links li#twitter a").attr("id"), function() { }); });
        $(".social-links li#youtube a").click(function() { return sitracker.trackExternalLink($(".social-links li#youtube a").attr("id"), function() { }); });
        $(".social-links li#newsletter a").click(function() { return sitracker.trackExternalLink($(".social-links li#newsletter a").attr("id"), function() { }); });

    }
}


function replaceSpaces(string) {

    var regex = new RegExp(" ", "g");
    return string.replace(regex, "_");

}


$(document).ready(function() {
    BindEvents();
    LoadFontSize();
    CheckRightBannerDividers();
    AssignAccordion();
    CheckHomePageDividers();
    TagQuicklinks();
    TagRotatinglinks();
    TagHeadBannerlinks();
    TagSociallinks();
    CookieManagement();
});


function CheckScreenSize() {

    if (GetQueryValue("mobiRef") == undefined) {
        //do nothing
    }
    else {
        $.cookie("SitePreference", "1", { path: '/' });
    }

    if (!$.cookie("SitePreference")) {
        RedirectSmartphone(mobileURL + document.URL.substring(document.URL.indexOf('.co.uk') + 6, document.URL.length));
       // RedirectSmartphone(mobileURL + document.URL.substring(document.URL.indexOf('986') + 3, document.URL.length));

        //alert(mobileURL + document.URL.substring(document.URL.indexOf('986') + 3, document.URL.length))   
    
    }

}

function IsSmartphone() {
    if (DetectUagent("android")) return true;
    else if (DetectUagent("ipad")) return false; //leave iPad on main website
    else if (DetectUagent("iphone")) return true;
    else if (DetectUagent("ipod")) return true;
    else if (DetectUagent("symbian")) return true;
    else if (DetectUagent("symbianos")) return true;
    else if (DetectUagent("windows ce")) return true;
    else if (DetectUagent("blackberry")) return true;
    else if (DetectUagent("opera mini")) return true;
    else if (DetectUagent("mobile")) return true;
    else if (DetectUagent("palm")) return true;
    else if (DetectUagent("windows phone")) return true;
    else if (DetectUagent("portable")) return true;
    else if (DetectUagent("lumia")) return true;
    return false;
}

function DetectUagent(name) {
    var uagent = navigator.userAgent.toLowerCase();
    if (uagent.search(name) > -1)
        return true;
    else
        return false;
}

function RedirectSmartphone(url) {
    if (url && url.length > 0 && IsSmartphone())
        window.location = url;
}

function CookieManagement() {

    //requires a paragraph or the function will not execute
    if ($("#consentBox p").size()) {

        if (!$.cookie("CookieAgreement")) {
            setTimeout(function() {
                // ------ SHOW/HIDE CONSENT BOX --------
                $('#consentBox').slideDown('slow');
                //add cookie box dynamically, to take functionality out of the CMS Banner tool
                $("#consentBox p").last().append("<a class='btn blue' id='consentClose' href='#'>Close message</a>.")

                $('#consentClose').click(function() {
                $.cookie("CookieAgreement", "1", { expires: 356, path: '/', domain: '.allianzni.co.uk' });
                    $('#consentBox').slideUp('slow');
                    sitracker.trackEvent("/CookieAgreement/");
                });
            }, 1000);
        }
    }
}


function AssignAccordion() {
$(".accordion").tabs(".accordion div.pane", {tabs: 'h3', effect: 'slide', initialIndex: 1000});
}

function loadEstimator(tabName) {

    var url = "/quick-estimators/estimator-modal.html";

    if ((tabName != null) && (tabName != undefined) && (tabName != ""))
    { url += "?est=" + tabName; }
    
    $("#overlayIframe").attr('src', url)
    $("#estimatorModal").overlay().load()

}

//Load the font size preferred throughout website visit
function LoadFontSize() {

    if ($.cookie("fontSizePreference")) {
        $(".lCol").css("font-size", $.cookie("fontSizePreference"));
        $(".singleCol-blank").css("font-size", $.cookie("fontSizePreference"));
    }

}

//bottom dividers under each banner need to be hidden if no banner is assigned
function CheckRightBannerDividers() {

    if ($('#rBanner2').children().size() > 0) {
        $('#rD2').css('display', 'block');
    }
    if ($('#rBanner3').children().size() > 0) {
        $('#rD3').css('display', 'block');
    }
    if ($('#rBanner4').children().size() > 0) {
        $('#rD4').css('display', 'block');
    }
}


//Check that at least one child item appears in the second row of the home page boxes
//If not then remove the divider line. There is no easier way of doing this as we cannot say
//if the box appears till after rendering
function CheckHomePageDividers() {

    if ($('.second-row').size() > 0) { //save some cpu time if not home page
        
        if ($('.second-row .box_standard').size() == 0) {
            
            $("#home_divider").css('display', 'none');
        }
    }

}


function BindEvents() {
    //Set click events for font resizing and save to cookie for future browsing
    $('#sizeup').click(function() {
        var size = $(".lCol").css("font-size");

        if (size == undefined) {
            size = $(".singleCol-blank").css("font-size");
        }

        var newSize = parseInt(size.replace(/px/, "")) + 1;
        if (newSize < 15) {
            $(".lCol").css("font-size", newSize + "px");
            $(".singleCol-blank").css("font-size", newSize + "px");  
            $.cookie("fontSizePreference", newSize + "px", {  path: '/' });
        }
    });
    $('#sizedown').click(function() {
    var size = $(".lCol").css("font-size");
    if (size == undefined) {
        size = $(".singleCol-blank").css("font-size");
    }
    var newSize = parseInt(size.replace(/px/, "")) - 1;
        if(newSize > 9)
        {
            $(".lCol").css("font-size", newSize + "px");
             $(".singleCol-blank").css("font-size", newSize + "px");
            $.cookie("fontSizePreference", newSize + "px", {  path: '/' });
        }
    });

}




  



