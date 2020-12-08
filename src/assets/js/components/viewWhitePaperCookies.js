define(function (require) {
    //TODO allow rewriting these members/classes - get them as arguments (so someone can change them in sitecore and in code easily)
    //scfCheckboxBorder - stays for checkbox
    //scfCheckBoxListBorder - checkboxlist
    //addUniqueFormCookieKey(keyString)
    //code under $(document).ready(function () {}) including subscribeStoreCookiesOnSumbit()

    //consider adding scfMultipleLineTextBorder type at some point (maybe for other forms it will be required)


    return function () {

      $(document).ready(function () {
          if (getQueryVariable("White Paper Title")) {
            init($(".viewWhitePaperForm"));
          }
        });

        //form must be jQuery object
        function init(form) {
            //TODO refactor this to be as a private variable (inside the module)
            window.FORM_FIELD_TYPES = {
                SingleLine: 0,
                DropDownList: 1,
                Checkbox: 2,
                CheckBoxList: 3
            };

            var $form = form;
            //if form is present
            if ($form.length == 0) {
                return;
            }

            //extracting all we have in cookies
            var cookieFields = getFormDataFromCookies($form);

            if (checkSomeCookies(cookieFields)) {
                setFormData($form, cookieFields);
            }

            //even when there is some data in cookies already, we need to refresh cookies data as user might change them 
            //therefore subscribing setting cookies on submit
            
            $('input.btn:submit').bind('click', { form: $form }, saveCookiesOnSubmit);
        }

        //on submit pressed we are collecting form data(only filled in) and setting cookie
        function saveCookiesOnSubmit(e) {
            //putting this logic on top of the other functional to have possibility to pass the specific form as an argument
            var $form = e.data.form,
                formCookies = getFormData($form);
            for (var i = 0; i < formCookies.length; i++) { 
                setCookie(formCookies[i].key, formCookies[i].value);
            }
        }

        //need to check that we have at least some data stored in cookies
        function checkSomeCookies(cookieFields) {
            return cookieFields.some(function (element) {
                //we know for sure that element has one property, but we don't know its name so checking first one (instead of getting by property name)
                return !!element.value;
            });
        }

        //get view white paper form values from cookies by keys
        function getFormDataFromCookies(form) {
            var cookieKeys = getFormKeys(form),
                cookieFields = [];

            for (var i = 0; i < cookieKeys.length; i++) {
                //basically this is creation of the array with cookie objects, each of them contains key and value
                var newCookieField = { "key": cookieKeys[i], "value": getCookie(cookieKeys[i]) };
                cookieFields.push(newCookieField);
            }
            return cookieFields;
        }

        //getting keys for form is including parsing part, so maybe it would be good to move parsing into single method
        function getFormKeys(form) {
            var $form = form,
                fields = getFormFields($form),
                cookieKeys = [];

            for (var i = 0; i < fields.length; i++) {
                var $field = $(fields[i]),
                    fieldData = parseField($field),
                    keyString = fieldData.keyString;

                cookieKeys.push(addUniqueFormCookieKey(keyString));
            }
            return cookieKeys;
        }

        //we need to go through all form fields that have something valuable and to form keys/values for each of these fields
        function getFormData(form) {
            var $form = form,
                fields = getFormFields($form),
                cookieFields = [];

            for (var i = 0; i < fields.length; i++) {
                var $field = $(fields[i]),
                    fieldData = parseField($field),
                    keyString = fieldData.keyString,
                    valueString = fieldData.valueString.value;

                if (valueString == "") {
                    //we're not going to store empty values as we might override already stored  
                    // TODO how to know that checkList/checkboxes weren't changed ? 
                    // It might be ok, that if person leaves checkboxes blank, we updating them on submit (but in this case it should be ok for other fields?)
                    // in that case we can remove this check and let user rewrite cookies each time
                } else {
                    //forming key by adding unique formId to each cookie key
                    cookieKey = addUniqueFormCookieKey(keyString);
                    //array with cookie objects, each of them contains key and value (this might be put into new method as there are two places in code with this logic)
                    var newCookieField = {"key" : cookieKey, "value" : valueString};
                    cookieFields.push(newCookieField);
                }
            }
            return cookieFields;
        }

        //this method parses form and returns data for each field in extended object
        function parseField(field) {

            var $field = field,
                //returned type
                parsedField = {
                    type: window.FORM_FIELD_TYPES.SingleLine,   //showing type
                    keyString: '',                              //storing key
                    valueString: {
                        element: null,                          //storing link to the element(s), where we extract value
                        value: ''                               //storing value
                    }
                };

            //checking if this is simple text fields
            //this variant of getting elements is suitable for scfSingleLineTextBorder, scfEmailBorder
            if ($field.hasClass('scfSingleLineTextBorder') || $field.hasClass('scfEmailBorder')) {
                parsedField.type = window.FORM_FIELD_TYPES.SingleLine;
                parsedField.keyString = $field.find('.control-label').text();
                parsedField.valueString.element = $field.find('.form-control'); 
                parsedField.valueString.value = $field.find('.form-control').val();
            }

            //checking if this is DropDownList
            if ($field.hasClass('scfDroplistBorder')) {
                parsedField.type = window.FORM_FIELD_TYPES.DropDownList;
                parsedField.keyString = $field.find('.control-label').text();
                parsedField.valueString.element = $field.find('.form-control'); 
                parsedField.valueString.value = $field.find('.form-control').val();
            }

            //checking if this is checkboxList
            if ($field.hasClass('scfCheckBoxListBorder')) {
                parsedField.type = window.FORM_FIELD_TYPES.CheckBoxList;
                //keyString is taking the same way as from simple text fields/droplists
                parsedField.keyString = $field.find('.control-label').text();
                //but valueString would be complex and we will parse it to get data
                parsedField.valueString.element = $field.find('table.scfCheckBoxListBorder td'); 
                parsedField.valueString.value = encodeCheckListString($field);
            }

            //checking if this is checkbox
            if ($field.hasClass('scfCheckboxBorder')) {
                parsedField.type = window.FORM_FIELD_TYPES.Checkbox;
                //removing return carriage symbols
                parsedField.keyString = $field.find('label').text().trim();
                parsedField.valueString.element = $field.find('input:checkbox'); //??
                parsedField.valueString.value = $field.find('input:checkbox').prop("checked").toString();
            }

            return parsedField;
        }
        
        //reverse for the getFormData method
        //basically we're comparing keys from form fields with keys stored in cookies and then take cookieValues for that keys and paste em into proper places
        function setFormData(form, cookieFields) {
            var $form = form,
                fields = getFormFields($form),
                cookieFields = cookieFields;

            for (var i = 0; i < fields.length; i++) {
                var $field = $(fields[i]),
                    fieldData = parseField($field),
                    fieldElement = fieldData.valueString.element;

                var cookieField = cookieFields.filter(function (element) {
                    var cookieKey = removeUniqueFormCookieKey(element.key);
                    return cookieKey == fieldData.keyString;
                })[0]; // taking first object from filtered objects as it should be the only one (if no duplicate keys!)

                //we won't insert empty values (I mean seriously what's the point?)
                if (cookieField.value) {
                 
                    switch (fieldData.type) {
                        case window.FORM_FIELD_TYPES.SingleLine:
                            fieldElement.val(cookieField.value);
                            //hiding label as value is set
                            fieldElement.parent().find(".control-label").addClass('completed');
                            break;
                        case window.FORM_FIELD_TYPES.DropDownList:
                            fieldElement.val(cookieField.value); 
                            fieldElement.selectric('refresh');

                            //hiding label as value is set 
                            //TODO it would be better to have such constructions either been rewritten or at least put into separate function, i.e getControlLabel(fieldData)
                            fieldElement.parent().parent().parent().find(".control-label").addClass('completed');
                            //TODO this is hack so it should be moved to the separate function. But even if we haven't such classes, this code will have no impact
                            if (fieldElement.parents('.selectState').length > 0
                                && $(".formCountryField").find(".selectric").find("span.label").text() == $('.hiddenCountryForSelectState .form-control').val()) {
                                $('.selectState').removeClass('hiddenFormField');
                            }
                            break;
                        case window.FORM_FIELD_TYPES.Checkbox:
                            var isChecked = (cookieField.value == 'true');
                            fieldElement.prop("checked", isChecked); 
                            //need to manually update visuals
                            if (isChecked){
                                fieldElement.parent().addClass('checked');
                            }
                            break;
                        case window.FORM_FIELD_TYPES.CheckBoxList:
                            var formCheckBoxList = fieldElement,
                                cookiesCheckBoxList = decodeCheckListString(cookieField.value);

                            for (var j = 0; j < formCheckBoxList.length; j++) {

                                var formCheckBox = $(formCheckBoxList[j]),
                                //taking checkbox label (which we have previously converted in encodeCheckListString method)
                                //removing return carriage symbols
                                    formCheckBoxKey = formCheckBox.find('label').text().trim();

                                //find checkbox stored in cookie for the current field
                                var cookieCheckBox = cookiesCheckBoxList.filter(function (element) {
                                    return element.key == formCheckBoxKey;
                                })[0]; // taking first object from filtered objects as it should be the only one

                                //paste its value to the form field
                                var isChecked = (cookieCheckBox.value == 'true');
                                formCheckBox.find('input:checkbox').prop("checked", isChecked);
                                //need to manually update visuals
                                if (isChecked) {
                                    formCheckBox.find('input:checkbox').parent().addClass('checked');
                                }
                            }
                            break;
                        default:
                            console.warn('viewWhitePaperCookies.js: unlisted field type detected!');
                    }

                }
            }
        }

        //this method translates checkBoxList into format "item1==false;item2==true"
        function encodeCheckListString($field) {
            var valueString = '';
            var checkBoxList = $field.find('table.scfCheckBoxListBorder td');
            for (var j = 0; j < checkBoxList.length; j++) {
                var $checkBox = $(checkBoxList[j]);
                //removing return carriage symbols
                valueString += $checkBox.find('label').text().trim();
                valueString += '==';
                valueString += $checkBox.find('input:checkbox').prop("checked").toString();
                //on last iteration we don't need this sign as we would receive additional array element on doing .split()
                if (j < checkBoxList.length - 1){
                    valueString += ';';
                }
            }
            return valueString;
        }

        //this method translates string cookie value "item1==false;item2==true" into the array with the following structure:
        //[{
        //    'key' : 'item1', 
        //    'value' : 'false'
        //}, 
        //{
        //    'key' : 'item2', 
        //    'value' : 'true'
        //}]
        function decodeCheckListString(cookieValue) {
            var checkList = cookieValue.split(";"),
                resultingCheckList = [];
            for (var i = 0; i < checkList.length; i++) {
                var keyValueArray = checkList[i].split("==");
                resultingCheckList.push({
                    'key': keyValueArray[0],
                    'value': keyValueArray[1]
                });
            }
            return resultingCheckList;
        }

        //having id attached to the data will allow us to store data for different whitepapers for the same user
        //TODO make this shared method (to be overwritten)
        function addUniqueFormCookieKey(keyString) {
            var whitePaperTitleId = getQueryVariable("White Paper Id").replace("}", "").replace("{", ""); 
            return whitePaperTitleId + "_" + keyString;
        }

        //detach id from the key so we can use cookie key for checking
        //TODO make this shared method (to be overwritten)
        function removeUniqueFormCookieKey(uniqueKey) {
            //extracting all value after id (which will be cookieS)
            return uniqueKey.substring(uniqueKey.indexOf("_") + 1); //"_" sign also needs to be cut, so we increment index
        }

        //TODO make this shared method (to be overwritten)
        function getFormFields(form) {
            return form.find(".form-group:not(.hiddenCountryForSelectState)");
        }

        //getting value by variable from the query string
        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (decodeURIComponent(pair[0]) == variable) { return pair[1]; }
            }
            return (false);
        }

        //basic stuff
        function setCookie(name, value) {
            var today = new Date();
            var expiry = new Date(today.getTime() + 365 * 24 * 3600 * 1000); // plus 1 year
            document.cookie = name + "=" + escape(value) + "; path=/; expires=" + expiry.toGMTString();
        }
        function getCookie(name) {
            var re = new RegExp(name + "=([^;]+)");
            var value = re.exec(document.cookie);
            return (value != null) ? unescape(value[1]) : null;
        }

    }
});