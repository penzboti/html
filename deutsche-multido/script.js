let auxiliary = "ist";

function changeAuxiliary() {
    switch(auxiliary){
        case "ist":
            auxiliary = "hat";
            break;
        case "hat":
            auxiliary = "ist";
            break;
    }
    auxiliaryButton.value = auxiliary;
}