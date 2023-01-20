inputNArray = [];
mode = 1;

decimal = document.getElementById("decimal");
binary = document.getElementById("binary");

document.addEventListener("keydown", (event) => {
    
    key = event.key;
    num = parseInt(key);
    
    if (key == "c") {
        changeMode();
    }
    
    if (key == "Backspace") {
        inputNArray.pop();
        
        updateInput(inputNArray);
    }
    
    if (key == "Delete") {
        inputNArray = [];
        
        updateInput(inputNArray);
    }

    switch (mode) {
        case 1:
            
            if (num >= 0 && num <= 9) {
                inputNArray.push(num);
                
                updateInput(inputNArray);
            }
            
            break;
            
        case -1:

            if (num == 0 || num == 1) {
                inputNArray.push(num);

                updateInput(inputNArray);
            }

            break;
    }

});

function updateInput(nums) {

    if (typeof(nums[0]) != "undefined" && nums[0] != 0) {

        var inputNums = "";
        
        nums.forEach(e => {
            inputNums += e;
        });

        updateOutput(inputNums);
    
        switch (mode) {
            case 1:
                decimal.innerText = inputNums;
                break;
            case -1:
                binary.innerText = inputNums;
                break;
        }

    } else { inputNArray = []; decimal.innerText = 0; binary.innerText = 0; }
}

function updateOutput(nums) {

    if (typeof nums[0] != "undefined") {

        switch (mode) {
            case 1:
                var outputNums = (nums >>> 0).toString(2);
                binary.innerText = outputNums;
                break;
        
            case -1:
                var outputNums = parseInt(nums, 2);
                decimal.innerText = outputNums;
                break;
        }
    }

}

function changeMode() {

    mode *= -1;

    decimal.classList.toggle("output"); decimal.classList.toggle("input");
    binary.classList.toggle("output"); binary.classList.toggle("input");

    inputNArray.splice(0, inputNArray.length);
    switch (mode) {

        case 1:
            decimal.innerText.split("").forEach(e => {
                inputNArray.push(e);
            });

            document.getElementById("modeinfo").innerHTML = "to-<b>binary</b>";
            break;
    
        case -1:
            binary.innerText.split("").forEach(e => {
                inputNArray.push(e);
            });

            updateInput(inputNArray);

            document.getElementById("modeinfo").innerHTML = "to-<b>decimal</b>";
            break;
    }

}