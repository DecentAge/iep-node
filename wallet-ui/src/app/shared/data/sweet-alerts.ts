import swal from "sweetalert2";
import { AppConstants } from '../../config/constants';
import * as enJson from '../../../assets/i18n/en.json';
import * as deJson from '../../../assets/i18n/de.json';

let keyData: any;
var getTranslationJson = function () {
    var selectedLanguage = JSON.parse(sessionStorage.getItem(AppConstants.languageConfig.SESSION_SELECTED_LANGUAGE_KEY));
    if (selectedLanguage == "en") {
        keyData = enJson;
    } else {
        keyData = deJson;
    }
}

getTranslationJson();

// Confirm Button Action
export function confirmText(title, text, confirmButtonText, cancelButtonText) {
    return swal({
        title: keyData['sweet-alert'][title],
        text: keyData['sweet-alert'][text],
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "transparent",
        cancelButtonColor: "transparent",
        confirmButtonText: keyData['sweet-alert'][confirmButtonText],
        cancelButtonText: keyData['sweet-alert'][cancelButtonText]
    });
}

// Confirm & Cancel Button
export function confirmLogoutButton(
    title,
    text,
    inputPlaceholder,
    confirmButtonText,
    cancelButtonText
) {
    return swal({
        title: title,
        text: text,
        type: "warning",
        input: "checkbox",
        inputValue: "",
        inputPlaceholder: inputPlaceholder,
        showCancelButton: true,
        confirmButtonColor: "#0CC27E",
        cancelButtonColor: "#FF586B",
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        confirmButtonClass: "btn btn-success btn-raised mr-5",
        cancelButtonClass: "btn btn-danger btn-raised",
        buttonsStyling: false
    });
}

// Confirm Button Action
export function bookmarkSuccess() {
    return swal({
        title: "Bookmark Added!",
        text: "Do you want to check bookmark?",
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#0CC27E",
        cancelButtonColor: "#FF586B",
        confirmButtonText: "Go, bookmark",
        cancelButtonText: "No, cancel"
    }).catch(swal.noop);
}


export function InfoAlertBox(
    messageTitle,
    messageText,
    buttonText,
    messageType
)
{
    return swal({
        title: messageTitle,
        text: messageText,
        type: messageType,
        showCancelButton: false,
        confirmButtonText: buttonText,
        confirmButtonClass: "btn btn-" + messageType + " btn-raised"
    });
}
