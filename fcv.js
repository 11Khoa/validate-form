var FCMailer = window.FCMailer || {};
// submit
$('body')
.on("click", ".fc-form .form-submit", function(e) { // form submit
    e.preventDefault();
    console.clear();

    var $btn = $(this),
        $form = $btn.parents(".fc-form"),
        __form__ = {};

    __form__.idx = $form.attr("data-index") !== undefined && $.trim($form.attr("data-index")).length > 0 ? $.trim($form.attr("data-index")).toLowerCase() : $(".fc-form").index($form);
    __form__.error = false;
    __form__.offset = false;
    __form__.display = $form.attr("data-display") !== undefined && $.trim($form.attr("data-display")).length > 0 && $.inArray($.trim($form.attr("data-display")).toLowerCase(), ["slide", "fade", "show", "fixed"]) >= 0 ? $.trim($form.attr("data-display")).toLowerCase() : "fixed";
    __form__.root = $form.attr("data-root") !== undefined && $.trim($form.attr("data-root")).length > 0 ? $.trim($form.attr("data-root")).toLowerCase() : false;
    __form__.email = $form.attr("data-email") !== undefined && $.trim($form.attr("data-email")).length > 0 ? $.trim($form.attr("data-email")).toLowerCase() : false;
    __form__.language = $form.attr("data-language") !== undefined && $.trim($form.attr("data-language")).length > 0 ? $.trim($form.attr("data-language")).toLowerCase() : false;
    __form__.multiple = $form.attr("data-multiple") !== undefined && $.trim($form.attr("data-multiple")).length > 0 ? $.trim($form.attr("data-multiple")).toLowerCase() : false;
    __form__.keep = $form.attr("data-keep") !== undefined && $.trim($form.attr("data-keep")).length > 0 ? $.trim($form.attr("data-keep")).operand() : true;
    // __form__.debug = $form.attr("data-debug") !== undefined && $.trim($form.attr("data-debug")).length > 0 ? $.trim($form.attr("data-debug")).operand() : false;
    __form__.confirm = $form.attr("data-confirm") !== undefined && $.trim($form.attr("data-confirm")).length > 0 ? $.trim($form.attr("data-confirm")).operand() : true;
    __form__.radio = {};
    __form__.checkbox = {};
    __form__.serialize = {};
    __form__.removed = [];
    __form__.files = [];

    // reset
    if (FCMailer[__form__.idx] === undefined) FCMailer[__form__.idx] = {};
    FCMailer[__form__.idx].email = [];
    FCMailer[__form__.idx].serializes = [];

    $form.find("[class^='error']").hide();
    $form.nextAll(".fc-confirm").remove();

    // validate
    $form.find(":input").each(function() {
        var $formInput = $(this),
            $formRow = $formInput.parents(".form-row").first(),
            $formValue = $formInput.parents(".form-value").first(),
            iName = $formInput.attr("name"),
            iValue = $.trim($formInput.val());

        if ($formInput.hasClass("form-submit") || $formInput.hasClass("form-back") || ($formInput.attr("readonly") && !$formInput.hasClass("require"))) return;

        if ($formRow.length < 1) FCM.rowMissing(iName);

        if ($formInput.hasClass("require")) {
            var $elmError = $formRow.find(".error").first();
            if ($formValue.find(".error").first().length > 0) $elmError = $formValue.find(".error").first();
            else if ($formValue.siblings(".error").length > 0) $elmError = $formValue.siblings(".error");

            if ($elmError.length < 1) FCM.errorMissing(iName, "error");

            if ($formInput.is(":radio")) {
                if (__form__.radio[iName] === undefined) __form__.radio[iName] = false;
                if ($formInput.is(":checked")) __form__.radio[iName] = true;

                if ($formValue.find("input[name='" + iName + "']:checked").length < 1 && __form__.radio[iName] === false) {
                    $elmError.show();

                    __form__.error = true;
                    if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
                }
            } else if ($formInput.is(":checkbox")) {
                if (__form__.checkbox[iName] === undefined) __form__.checkbox[iName] = false;
                if ($formInput.is(":checked")) __form__.checkbox[iName] = true;

                if ($formValue.find("input[name='" + iName + "']:checked").length < 1 && __form__.checkbox[iName] === false) {
                    $elmError.show();

                    __form__.error = true;
                    if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
                }
            } else if ($formInput.is("select")) {
                if ($("option:disabled", this).is(":selected") || iValue.length < 1) {
                    $elmError.show();

                    __form__.error = true;
                    if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
                }
            } else {
                if (iValue.length < 1) {
                    $elmError.show();

                    __form__.error = true;
                    if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
                }
            }
        }

        if ($formInput.hasClass("check-phone")) {
            var phoneNumber = iValue.replace(/[\-\s\.\(\)\+]+/g, "");

            var $elmError = $formRow.find(".error-phone").first();
            if ($formValue.find(".error-phone").first().length > 0) $elmError = $formValue.find(".error-phone").first();
            else if ($formValue.siblings(".error-phone").length > 0) $elmError = $formValue.siblings(".error-phone");

            if ($elmError.length < 1) FCM.errorMissing(iName, "error-phone");

            if (iValue.length > 0 && (!/^[(]?[\+]?[0-9]{1,5}[)]?[\-\s\.]?[0-9]{2,5}[\-\s\.]?[0-9]{2,5}[\-\s\.]?[0-9]{2,7}$/.test(iValue) || phoneNumber.length < 10 || phoneNumber.length > 15)) {
                $elmError.show();

                __form__.error = true;
                if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
            }
        }

        if ($formInput.hasClass("check-email")) {
            var $elmError = $formRow.find(".error-email").first();
            if ($formValue.find(".error-email").first().length > 0) $elmError = $formValue.find(".error-email").first();
            else if ($formValue.siblings(".error-email").length > 0) $elmError = $formValue.siblings(".error-email");

            if ($elmError.length < 1) FCM.errorMissing(iName, "error-email");

            if (iValue.length > 0 && !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(iValue)) {
                $elmError.show();

                __form__.error = true;
                if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
            }
        }

        if ($formInput.hasClass("check-number")) {
            var $elmError = $formRow.find(".error-number").first();
            if ($formValue.find(".error-number").first().length > 0) $elmError = $formValue.find(".error-number").first();
            else if ($formValue.siblings(".error-number").length > 0) $elmError = $formValue.siblings(".error-number");

            if ($elmError.length < 1) FCM.errorMissing(iName, "error-number");

            if (iValue.length > 0 && !/^\d+$/.test(iValue)) {
                $elmError.show();

                __form__.error = true;
                if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
            }
        }

        // check postal-code
        // /^([0-9]){3}[-]([0-9]){4}$/

        if ($formValue.attr("data-match") && $.trim($formValue.attr("data-match")).length > 0) {
            var $matchInput = $form.find("input[name='" + $.trim($formValue.attr("data-match")).toLowerCase() + "']");

            var $elmError = $formRow.find(".error-match").first();
            if ($formValue.find(".error-match").first().length > 0) $elmError = $formValue.find(".error-match").first();
            else if ($formValue.siblings(".error-match").length > 0) $elmError = $formValue.siblings(".error-match");

            if ($elmError.length < 1) FCM.errorMissing(iName, "error-match");
            if ($matchInput.length < 1) FCM.matchMissing($.trim($formValue.attr("data-match")).toLowerCase());
            else {
                if ($matchInput.val().length > 0 && $matchInput.val() !== iValue) {
                    $elmError.show();

                    __form__.error = true;
                    if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
                }
            }
        }

        if (($formValue.attr("data-min") && $.trim($formValue.attr("data-min")).length > 0) || ($formValue.attr("data-max") && $.trim($formValue.attr("data-max")).length > 0)) {
            var $elmError = $formRow.find(".error-length").first();
            if ($formValue.find(".error-length").first().length > 0) $elmError = $formValue.find(".error-length").first();
            else if ($formValue.siblings(".error-length").length > 0) $elmError = $formValue.siblings(".error-length");

            var iTotal = iValue.length,
                iMin = parseInt($.trim($formValue.attr("data-min"))),
                iMax = parseInt($.trim($formValue.attr("data-max")));

            if ($elmError.length < 1) FCM.errorMissing(iName, "error-length");
            else {
                var txtMsg = $elmError.html();
                if ($elmError.data("txt-length")) txtMsg = $elmError.data("txt-length");

                txtMsg =
                    txtMsg
                    .replace(/\{min\}/i, iMin)
                    .replace(/\{max\}/i, iMax);

                $elmError.html(txtMsg);
            }

            if ($formInput.is(":file") && $formInput.attr("multiple")) iTotal = $formInput.parents(".form-attachment").first().find(".attachment-list").children(".attachment-item").length;
            else if ($formInput.is(":checkbox")) iTotal = $formValue.find("input[name='" + iName + "']:checked").length;
            else if ($formValue.attr("data-count") !== undefined) { // default - letter
                if ($formValue.attr("data-count").toLowerCase() == "number") iTotal = iTotal > 0 ? Number(iValue) : 0;
                else if ($formValue.attr("data-count").toLowerCase() == "word") iTotal = iTotal > 0 ? iValue.split(" ").length : 0;
            }

            if ($formValue.attr("data-min") && $.trim($formValue.attr("data-min")).length > 0) {
                if (isNaN(iTotal) || (iTotal > 0 && iTotal < iMin)) {
                    $elmError.show();

                    __form__.error = true;
                    if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
                }
            }

            if ($formValue.attr("data-max") && $.trim($formValue.attr("data-max")).length > 0) {
                if (isNaN(iTotal) || (iTotal > 0 && iTotal > iMax)) {
                    $elmError.show();

                    __form__.error = true;
                    if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
                }
            }
        }
    });

    if (__form__.email === false) __form__.email = "email"; // default
    if (__form__.email) {
        var fields = __form__.email.split(" ");

        for (var i in fields) {
            var iName = fields[i],
                $formInput = $form.find(":input[name='" + iName + "']");

            if ($formInput.length > 0) {
                if ($formInput.hasClass("check-email")) break;
                else {
                    var iValue = $formInput.val(),
                        $formRow = $formInput.parents(".form-row").first(),
                        $formValue = $formInput.parents(".form-value").first();

                    var $elmError = $formRow.find(".error-email").first();
                    if ($formValue.find(".error-email").first().length > 0) $elmError = $formValue.find(".error-email").first();
                    else if ($formValue.siblings(".error-email").length > 0) $elmError = $formValue.siblings(".error-email");

                    if ($elmError.length < 1) FCM.errorMissing(iName, "error-email");

                    if (iValue.length > 0 && !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(iValue)) {
                        $elmError.show();

                        __form__.error = true;
                        if ($formRow.length > 0 && __form__.offset === false) __form__.offset = $formRow.offset().top;
                    }
                }
            }
        }
    }

    // console.log(__form__);



    if (__form__.offset === false) __form__.offset = $form.offset().top;
    if ($(".fc-nav-fixed").length > 0) __form__.offset -= $(".fc-nav-fixed").outerHeight();

    if (__form__.error) { // error
        $("html, body").stop().animate({
            scrollTop: __form__.offset
        }, 300);
    } else { // continue
        if (FCMailer[__form__.idx] === undefined) FCMailer[__form__.idx] = {};
        if (FCMailer[__form__.idx].email === undefined) FCMailer[__form__.idx].email = [];
        if (FCMailer[__form__.idx].serializes === undefined) FCMailer[__form__.idx].serializes = [];

        __form__.serialize = {};
        __form__.removed = [];

        // get value
        $form.find("[data-for]").each(function() {
            var $elm = $(this),
                $formRow = $elm.hasClass("form-row") ? $elm : $elm.parents(".form-row").first(),
                joinGroup = $elm.attr("data-join"),
                key = $.trim($elm.attr("data-for")).toLowerCase(),
                arrs = key.split(" "),
                aValue = [];
                

            // console.log(arrs);

            for (var i in arrs) {
                if (arrs[i].length > 0) {
                    var $formInput = $formRow.find(":input[name='" + arrs[i] + "']").length > 0 ? $formRow.find(":input[name='" + arrs[i] + "']") : $formRow.find(":input[name='" + arrs[i] + "[]']"),
                        $formValue = $formInput.parents(".form-value").first(),
                        joinValue = $formValue.attr("data-join");

                    if ($formValue.siblings(".form-value").length < 1 && joinValue !== undefined && $.trim(joinValue).length > 0) joinGroup = joinValue; // single :input

                    if (!$formRow.hasClass("form-remove") && !$formValue.attr("data-match")) {
                        if ($formInput.length > 0) {
                            if ($formInput.is(":file")) __form__.files.push(arrs[i]);
                            else {
                                if (joinValue !== undefined && $.trim(joinValue).toLowerCase() == "br") joinValue = "\n";

                                var mValue = false;
                                if ($formInput.is(":checkbox")) {
                                    var cValue = [];
                                    $formRow.find(":input[name='" + arrs[i] + "']:checked").each(function() {
                                        cValue.push($(this).val());
                                    });

                                    mValue = cValue.join(joinValue);
                                } else if ($formInput.is(":radio")) mValue = $formRow.find(":input[name='" + arrs[i] + "']:checked").val();
                                else if ($formInput.is("select") && $formInput.attr("multiple")) mValue = $formInput.val().join(joinValue);
                                // else mValue = $formInput.val();
                                else if ($formInput.val().length > 0 || __form__.keep) mValue = $formInput.val();

                                // adding value - value
                                if (mValue) {
                                    if ($.trim($formValue.attr("data-before"))) mValue = $.trim($formValue.attr("data-before")) + " " + mValue;
                                    if ($.trim($formValue.attr("data-after"))) mValue += " " + $.trim($formValue.attr("data-after"));
                                } else if ($formValue.attr("data-empty") && $.trim($formValue.attr("data-empty")).length > 0) mValue = $.trim($formValue.attr("data-empty")).operand();

                                // aValue.push(mValue); // push data
                                if (mValue) aValue.push(mValue); // push data
                                // console.log(aValue);
                            }
                        } else FCM.inputMissing(key); // invalid structure
                    } else __form__.removed.push(arrs[i]);
                }
            }

            if (aValue.length > 0) {
                if (joinGroup !== undefined && $.trim(joinGroup).toLowerCase() == "br") joinGroup = "\n";

                aValue = aValue.join(joinGroup);
            } else if ($formRow.attr("data-empty") && $.trim($formRow.attr("data-empty")).length > 0) aValue = $.trim($formRow.attr("data-empty")).operand();
            else aValue = null;

            // adding value - group
            if (aValue !== null && $.trim($elm.attr("data-before"))) aValue = $.trim($elm.attr("data-before")) + " " + aValue;
            if (aValue !== null && $.trim($elm.attr("data-after"))) aValue += " " + $.trim($elm.attr("data-after"));

            if ($.inArray(key, __form__.removed) < 0 && $.inArray(key, __form__.files) < 0) {
                FCMailer[__form__.idx].serializes.push({
                    key: key,
                    txt: $elm.text(),
                    value: aValue
                });

                __form__.serialize[key] = aValue;
            }
        });

        if (__form__.confirm === false) FCM.send($form, __form__);
        else {
            var $formClone = $("<div />").append($form.clone(true, true));

            $formClone = $formClone.children(); // itself
            $formClone.children().wrapAll('<div class="confirm-main" />');

            // cleaning
            $formClone
                .removeClass("fc-form")
                .addClass("fc-confirm")
                    .find(".confirm-hide")
                        .remove()
                        .end() // traverse back
                    .find(".form-remove")
                        .remove()
                        .end() // traverse back
                    .find(".submit-form")
                        .remove()
                        .end() // traverse back
                    .find("[class^='error']")
                        .remove()
                        .end() // traverse back
                    .find("script")
                        .remove()
                        .end(); // traverse back

            // parsing value
            $formClone.find("[data-for]").each(function() {
                var $elm = $(this),
                    $formRow = $elm.hasClass("form-row") ? $elm : $elm.parents(".form-row").first(),
                    key = $.trim($elm.attr("data-for")).toLowerCase(),
                    arrs = key.split(" ");

                for (var i in arrs) {
                    if (arrs[i].length > 0) {
                        // if (arrs[i].length > 1 && Number(i) > 0) continue;

                        var $formInput = $formRow.find(":input[name='" + arrs[i] + "']").length > 0 ? $formRow.find(":input[name='" + arrs[i] + "']") : $formRow.find(":input[name='" + arrs[i] + "[]']"),
                            $formTag = $formInput.length > 0 ? $formInput.get(0).nodeName.toLowerCase() : false,
                            $formType = $formTag == "input" ? $formInput.attr("type") : false,
                            $formValue = $formInput.parents(".form-value").first(),
                            iValue = __form__.serialize[key] !== undefined ? (__form__.serialize[key] + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2') : false;

                            console.log( $formValue.context.outerText);

/*
https://www.w3schools.com/tags/tag_input.asp

button
checkbox
color
date 
datetime-local 
email 
file
hidden
image
month 
number 
password
radio
range 
reset
search
submit
tel
text
time 
url
week
*/

                        if ($formInput.length > 0) {
                            if ($formInput.parents(".form-attachment").first().length > 0) {
                                var aName = arrs[i].replace(/(\[.*\])*$/, "");
                                if (FCMailer[__form__.idx] === undefined) FCMailer[__form__.idx] = {};
                                if (FCMailer[__form__.idx].files === undefined) FCMailer[__form__.idx].files = {};

                                if (__form__.keep === false && FCMailer[__form__.idx].files[aName] && Object.keys(FCMailer[__form__.idx].files[aName]).length < 1) {
                                    var $aForm = $formInput.parents(".form-attachment").first(),
                                        $aPreview = $aForm.find(".attachment-preview");

                                    if ($aForm.hasClass("multiple") && $aForm.find(".attachment-list").children().length < 1) $formRow.remove();
                                    else if ($aPreview.children("img").length < 1 && $aPreview.children("span").length < 1) $formRow.remove();
                                }
                            } else {
                                if (arrs[i].length > 1 && Number(i) > 0 && $formValue.siblings(".form-value").length > 0) $formValue.remove();
                                else if ($formRow.hasClass("form-remove") || ($formValue.attr("data-match") && $.trim($formValue.attr("data-match")).length > 0)) {
                                    if ($formValue.parents(".form-remove").first().length > 0) $formValue.parents(".form-remove").first().remove(); // ???
                                    else $formRow.remove();
                                } else if ($formTag) {
                                    // if (($formValue.siblings(".form-value").length > 0 || ($elm.attr("data-join") && $.trim($elm.attr("data-join")).length > 0)) && !$formValue.attr("data-join")) $formValue.siblings(".form-value").remove(); // check [11-2017 - tenshinoniwa]
                                        console.log(iValue);
                                    // if (iValue && iValue.operand() !== null) {
                                    if (iValue !== null) {
                                        var iAlone = true;

                                        if ($formValue.find(":input").length > 1) {
                                            $formValue.find(":input").each(function() {
                                                var iN = $(this).attr("name");
                                                if (iN != arrs[i]) iAlone = false;
                                            });
                                        }

                                        var cVal = '<span class="confirm-value confirm-' + $formTag + ($formType ? "-" + $formType : "") + ' confirm-' + key.split(" ").join(" confirm-") + '">' + iValue + '</span>';

                                        $formInput.remove();
                                        if (iAlone === false) $formValue.append(cVal);
                                        else $formValue.html(cVal);
                                    } else if ($formRow.hasClass("form-remove-empty")) $formRow.remove();
                                    else if (__form__.keep !== false) $formValue.html('<span class="confirm-value confirm-' + $formTag + ($formType ? "-" + $formType : "") + ' confirm-empty">&#0182;</span>');
                                    else $formRow.remove();
                                }
                            }
                        } else $formRow.remove(); // remove - missed :input
                    }
                }

                // clean attributes
                // $formRow
                //     .find(".form-value")
                //         .alterAttr("data-*")
                //     .end() // traverse back
                //     .alterAttr("data-*");
                // $elm.alterAttr("data-*");
            });

            // $formClone
            //     .alterAttr("data-*") // clean attributes
            //         .find(".attachment-remove")
            //             .remove()
            //             .end() // traverse back
            //         .find(".attachment-button")
            //             .remove();

            $formClone.addClass("display-" + __form__.display);

            $form.after($formClone.parent().html()); // adding cloned


            $("html, body").stop().animate({
                scrollTop: __form__.offset
            }, 300);

            if ($btn.attr("data-beforeClick") && $btn.attr("data-beforeClick").length > 0 && typeof window[$btn.attr("data-beforeClick")] === "function") window[$btn.attr("data-beforeClick")]($btn); // run callback

            if (__form__.display == "slide") { // slide
                $form.stop().slideUp(300, function() {
                    $(this).removeAttr("style").hide();
                }).next(".fc-confirm").stop().slideDown(300, function() {
                    $(this).removeAttr("style").show();

                    if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback
                });
            } else if (__form__.display == "fade") { // fade
                $form.stop().fadeOut(300, function() {
                    $(this).removeAttr("style").hide();
                }).next(".fc-confirm").stop().delay(300).fadeIn(300, function() {
                    $(this).removeAttr("style").show();

                    if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback
                });
            } else if (__form__.display == "show") { // show
                $form.stop().hide(0, function() {
                    $(this).removeAttr("style").hide();
                }).next(".fc-confirm").stop().show(0, function() {
                    $(this).removeAttr("style").show();

                    if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback
                });
            } else { // fixed
                $form.next(".fc-confirm").stop().fadeIn(300, function() {
                    $(this).removeAttr("style").show();

                    $("body").addClass("confirm-fixed");

                    if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback
                });
            }
        }
    }

    // FCMailer.ascii();
})

/// button back and reset form
.on("click", ".fc-form .form-back", function(e) { // form reset
    e.preventDefault();

    var $btn = $(this),
        $form = $btn.parents(".fc-form");

    $form.find("[class^='error']").hide();

    if ($btn.attr("data-beforeClick") && $btn.attr("data-beforeClick").length > 0 && typeof window[$btn.attr("data-beforeClick")] === "function") window[$btn.attr("data-beforeClick")]($btn); // run callback

    // if ($btn.parents(".fc-form").first().is("form") || $btn.parents(".fc-form").first().find("form").length) $btn.get(0).reset();  // reset the form - DOM
    if ($form.is("form") || $form.find("form").length) $btn.get(0).reset();  // reset the form - DOM
    else {
        // reset any form field
        $form.find(":input").each(function() {
            if ($(this).is(":file")) {
                var idx = $form.attr("data-index") !== undefined && $.trim($form.attr("data-index")).length > 0 ? $.trim($form.attr("data-index")).toLowerCase() : $(".fc-form").index($form),
                    aName = $(this).attr("name");

                if (aName) aName = aName.replace(/(\[.*\])*$/, "");

                if (FCMailer[idx] === undefined) FCMailer[idx] = {};
                if (FCMailer[idx].files === undefined) FCMailer[idx].files = {};

                FCMailer[idx].files[aName] = {}; // clear

                var $aForm = $(this).parents(".form-attachment").first();

                if ($aForm.hasClass("multiple")) {
                    $aForm.find(".attachment-item").each(function() {
                        $(this).find(".attachment-remove").click();
                    });
                } else $aForm.find(".attachment-remove").click();

                $(this).replaceWith($(this).val("").clone(true, true));
            } else if ($(this).is(":radio, :checkbox")) $(this).prop("checked", this.defaultChecked);
            else if ($(this).is("select")) {
                $(this).find("option").each(function () {
                    $(this).prop("selected", this.defaultSelected);
                });
            } else if (this.defaultValue) $(this).val(this.defaultValue);
            else $(this).val($(this).data("fc-remember"));
        });
    }

    if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback

    $("html, body").stop().animate({
        // scrollTop: $(this).parents(".fc-form").offset().top - ($(".fc-nav-fixed").length > 0 ? $(".fc-nav-fixed").outerHeight() : 0)
        scrollTop: $form.offset().top - ($(".fc-nav-fixed").length > 0 ? $(".fc-nav-fixed").outerHeight() : 0)
    }, 300);
})
.on("click", ".fc-confirm .form-submit", function(e) { // confirm submit
    e.preventDefault();

    

    console.clear();

    var $btn = $(this),
        $confirm = $btn.parents(".fc-confirm"),
        $form = $confirm.prev(".fc-form"),
        __form__ = {};

    // __form__.idx = $form.attr("data-index") !== undefined && $.trim($form.attr("data-index")).length > 0 ? $.trim($form.attr("data-index")).toLowerCase() : $(".fc-form").index($form);
    // __form__.root = $form.attr("data-root") !== undefined && $.trim($form.attr("data-root")).length > 0 ? $.trim($form.attr("data-root")).toLowerCase() : false;
    __form__.email = $form.attr("data-email") !== undefined && $.trim($form.attr("data-email")).length > 0 ? $.trim($form.attr("data-email")).toLowerCase() : false;
    // __form__.language = $form.attr("data-language") !== undefined && $.trim($form.attr("data-language")).length > 0 ? $.trim($form.attr("data-language")).toLowerCase() : false;
    // __form__.multiple = $form.attr("data-multiple") !== undefined && $.trim($form.attr("data-multiple")).length > 0 ? $.trim($form.attr("data-multiple")).toLowerCase() : false;
    // __form__.debug = $form.attr("data-debug") !== undefined && FCMailer.debug == false ? $.trim($form.attr("data-debug")).operand() : false;
    // __form__.debug = $form.attr("data-debug") !== undefined ? $.trim($form.attr("data-debug")).operand() : false;

    if ($btn.attr("data-beforeClick") && $btn.attr("data-beforeClick").length > 0 && typeof window[$btn.attr("data-beforeClick")] === "function") window[$btn.attr("data-beforeClick")]($btn); // run callback

    console.log(__form__);
    // FCM.send($confirm, $btn, __form__);
})
.on("click", ".fc-confirm .form-back", function(e) { // confirm back
    var $btn = $(this),
        $confirm = $btn.parents(".fc-confirm").first(),
        $form = $confirm.prev(".fc-form").length > 0 ? $confirm.prev(".fc-form") : false,
        idx = $form && $form.attr("data-index") !== undefined && $.trim($form.attr("data-index")).length > 0 ? $.trim($form.attr("data-index")).toLowerCase() : $(".fc-form").index($form);

    // reset
    if (FCMailer[idx] === undefined) FCMailer[idx] = {};
    FCMailer[idx].email = [];
    FCMailer[idx].serializes = [];

    $("html, body").stop().animate({
        scrollTop: $confirm.offset().top - ($(".fc-nav-fixed").length > 0 ? $(".fc-nav-fixed").outerHeight() : 0)
    }, 300);

    if ($btn.attr("data-beforeClick") && $btn.attr("data-beforeClick").length > 0 && typeof window[$btn.attr("data-beforeClick")] === "function") window[$btn.attr("data-beforeClick")]($btn); // run callback

    if ($form) {
        var formDisplay = ($form.attr("data-display") !== undefined && $.trim($form.attr("data-display")).length > 0 && $.inArray($.trim($form.attr("data-display")).toLowerCase(), ["slide", "fade", "show", "fixed"]) >= 0) ? $.trim($form.attr("data-display")).toLowerCase() : "fixed";

        if (formDisplay == "slide") { // slide
            $confirm.stop().slideUp(300, function() {
                $(this).hide();
            }).prev(".fc-form").stop().slideDown(300, function() {
                $(this).removeAttr("style").show();

                if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback

                $confirm.remove();
            });
        } else if (formDisplay == "fade") { // fade
            $confirm.stop().fadeOut(300, function() {
                $(this).hide();
            }).prev(".fc-form").stop().delay(300).fadeIn(300, function() {
                $(this).removeAttr("style").show();

                if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback

                $confirm.remove();
            });
        } else if (formDisplay == "show") { // show
            $confirm.stop().hide(0, function() {
                $(this).hide();
            }).prev(".fc-form").stop().show(0, function() {
                $(this).removeAttr("style").show();

                if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback

                $confirm.remove();
            });
        } else { // fixed
            $confirm.stop().fadeOut(300, function() {
                $(this).hide();
                $("body").removeClass("confirm-fixed");
            }).prev(".fc-form").stop().fadeIn(300, function() {
                $(this).removeAttr("style").show();

                if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback

                $confirm.remove();
            });
        }
    } else {
        $confirm.stop().fadeOut(300, function() {
            $("body").removeClass("confirm-fixed");

            if ($btn.attr("data-afterClick") && $btn.attr("data-afterClick").length > 0 && typeof window[$btn.attr("data-afterClick")] === "function") window[$btn.attr("data-afterClick")]($btn); // run callback

            $(this).remove();
        });
    }
})

