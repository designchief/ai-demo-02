(function ($) {

    //#passwordComplexity = id of the field that contains the UI of the indicator
    //[data-val-meetpasswordpolicy] = field that needs to be validated
    //#ruleX (x=1..5) = indicators of the rules that need to be meet by the field 
    //#rulesmet = id of the image that shows all rules are met
    //meetpasswordpolicy = name of the rule (comes from the validator in the server side and it's the hook between unobtrusive and mvc and jquery
    $(function () {
       $.validator.addMethod("meetpasswordpolicy", function (value, element, param) {
            return RulesMeetPasswordPolicy(value);
        }, "");

        $.validator.unobtrusive.adapters.add("meetpasswordpolicy", function (options) {
            options.rules['meetpasswordpolicy'] = options.params;
            if (options.message) options.messages['meetpasswordpolicy'] = options.message;
        });

        function RulesMeetPasswordPolicy(value) {
            var $pwdComplex = $("#passwordComplexity");
            var $rulesmet = $("#rulesmet");

            $pwdComplex.show();
            $("[id^=rule]").show();
            $("#rule1").attr("class", "");
            $("#rule2").attr("class", "");
            $("#rule3").attr("class", "");
            $("#rule4").attr("class", "");
            $("#rule5").attr("class", "");
            $rulesmet.hide();

            var rulesmet = 0;
            var val = value; //$('#' + param).val();
            if (val.length >= 8) {
                $("#rule5", $pwdComplex).attr("class", "meet");
                rulesmet++;
            }
            if (/[a-z]/.test(val)) {
                $("#rule2", $pwdComplex).attr("class", "meet");
                rulesmet++;
            }
            if (/[A-Z]/.test(val)) {
                $("#rule1", $pwdComplex).attr("class", "meet");
                rulesmet++;
            }
            if (/[0-9]/.test(val)) {
                $("#rule3", $pwdComplex).attr("class", "meet");
                rulesmet++;
            }
            if (/[!"£$%^&*()?.,#~@:;{}]/.test(val)) {
                $("#rule4", $pwdComplex).attr("class", "meet");
                rulesmet++;
            }

            if (rulesmet == 5) {
                $("[id^=rule]").hide();
                $rulesmet.show();
            }

            return rulesmet == 5;
        }

        $("[data-val-meetpasswordpolicy]").on("focus", function () {

            $("#passwordComplexity").show();
            //media-query: if small devices then scroll
            if ($(".footer-links").css("margin-bottom") == "7.5px") {
                $("body").animate({
                    'scrollTop': $("label[for='" + $("[data-val-meetpasswordpolicy]").attr("id") + "'").offset().top
                }, 500)
            }
        }).on("keyup", function (e) {
            RulesMeetPasswordPolicy($(this).val());
        });

        var $pwdinvalid = $("[data-val-meetpasswordpolicy].input-validation-error");
        if ($pwdinvalid.length > 0) {
            $pwdinvalid.next().html("");
            RulesMeetPasswordPolicy("");
        }
    });
}(jQuery));