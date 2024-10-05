const inputSlider=document.querySelector("[data-lengthSlider]");
const dataLength=document.querySelector("[data-lengthNumber]");
const pswdDisplay=document.querySelector(".display");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*()_+[]{}<>?/\|';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value =passwordLength;
    dataLength.innerText=passwordLength;
    const min=0;
    const max=20;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+ "% 100%";
}
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(min,max){
     return Math.floor(Math.random()*(max-min)+min);
}
function generateRndNumber(){
    return getRndInteger(0,10);
}
function generateRndLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateRndUppercase(){
    let num=getRndInteger(65,91);
    return String.fromCharCode(num);
}
function generateRndSymbol(){
    return symbols.charAt(getRndInteger(0,symbols.length));
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("green");
    } 
    else if ( 
        (hasLower || hasUpper) &&
        (hasNum || hasSym) && 
        passwordLength >= 6
    ){
        setIndicator("yellow");
    } 
    else {
        setIndicator("red");
    }
}
async function copyContent() {
    try{
        await navigator.clipboard.writeText(pswdDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',(e) => {
    if(pswdDisplay.value) copyContent();
})
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)checkCount++;
    });

    //special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
function shufflePassword(array) {
    //Fisher yates algorithm
    for (let i=array.length-1;i>0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>(str += el));
    return str;
}
generateBtn.addEventListener('click',()=>{
    if(checkCount<=0){
        return ;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    //remove old password
    password="";

    // if(uppercaseCheck.checked){
    //     password+=generateRndUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateRndLowercase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRndNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateRndSymbol();
    // }

    let funArr=[];
    if(uppercaseCheck.checked){
        funArr.push(generateRndUppercase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateRndLowercase);
    }
    if(numbersCheck.checked){
        funArr.push(generateRndNumber);
    }
    if(symbolsCheck.checked){
        funArr.push(generateRndSymbol);
    }

    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }
    for(let i=0;i<passwordLength-funArr.length;i++){
        let num=getRndInteger(0,funArr.length-1);
        password+=funArr[num]();
    }
    password=shufflePassword(Array.from(password));
    pswdDisplay.value=password;
    calcStrength();
})