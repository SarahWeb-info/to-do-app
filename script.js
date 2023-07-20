// frontend codes
function setTodayDate() {
    const now = new Date().toISOString().slice(0, 16);
    let inputDate = document.getElementById("alarmDate");
    inputDate.value = now;
}
setTodayDate();

function toggleHide() {
    var alarmDate = document.getElementById('alarmDate');
    alarmDate.classList.toggle("hide");
}
 
function stringDate(x) {
    let d = new Date(x);
    let months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","NOV","DEC"]
    let stringDate = d.getDate() +" "+ months[d.getMonth()] + " at " + d.getHours()+":"+ d.getMinutes();
    return stringDate;
}

// crud functions
function modifyDate() {
    let alarmSwitch = document.getElementById('alarmSwitch');
    let setAlarm = (alarmSwitch.checked) ? true : false;  

    let today =new Date();
    today = Date.parse(today);
    let inputDate = document.getElementById('alarmDate');
    inputDate = Date.parse(inputDate.value);   
    
    let alarmNotice = document.getElementsByClassName('alarmNotice')[0];
    if (setAlarm == true) {
        let msg = "";
        if (inputDate < today) {
            setAlarm=false;
            msg = 'No Alarm is set because the selected date have passed';
        } else if (inputDate == today) {
            setAlarm=false;
            msg = 'This date is current, no alarm is set';    
        } else {
            setAlarm=true;
            let read_date = stringDate(inputDate);
            msg ='The alarm is set for ' + read_date; 
        }
        alarmNotice.innerHTML = msg;
    }else{
        inputDate = today;
    }
    alarmNotice.classList.remove("hide"); 
    setTimeout(() => {
        alarmNotice.classList.add("hide");
    }, 2000);
    return [setAlarm ,inputDate];
}

function getNewKey() {
    let maxNo = [];
    if (localStorage.length) {
        for (let i = 0; i < localStorage.length; i++) {
            maxNo.push(localStorage.key(i));
        }
    }else{
        maxNo.push(0);
    }
    return maxNo;
 }
function updateTotals() {
    let todoTask = document.getElementsByClassName('todoTask')[0];
    let doneTask = document.getElementsByClassName('doneTask')[0];
    document.getElementById("totalToDoTasks").innerHTML = todoTask.childElementCount;
    document.getElementById("totalDoneTasks").innerHTML = doneTask.childElementCount;
}

let createObj = ()=>{
    // get form values
    let inputTask = document.getElementById('task').value;
    let inputSmartList = document.getElementById('smartList').value;
    
    // modify task and smartlisk 
    let task = inputTask.replace(/[^a-zA-Z0-9\s]/g, ' ');
    let smartList = inputSmartList.replace(/[^a-zA-Z0-9]/g, '');    

    //get and modify dates
    let [setAlarm ,date] =  modifyDate();
    // save the obj
    let objToSave={task:task,status:"todo",setalarm:setAlarm,date:date,smartList:smartList};
    // save in local storage
    let keyArr =  getNewKey();
    let key = Math.max.apply(null, keyArr);
    key++;
    localStorage.setItem(key,JSON.stringify(objToSave));

    // reset form
    setTimeout(() => {
        let form = document.getElementById('form');
        form.reset();
        setTodayDate();    
        let alarmSwitch = document.getElementById('alarmSwitch');
        alarmSwitch.checked = false;
        alarmSwitch.nextElementSibling.classList.add('hide');
    }, 2000); 
}
function delBtn(btn,key){
    let getCard = btn.closest('.card');
    getCard.remove();
    localStorage.removeItem(key);
    updateTotals();
}
function doneBtn(key){
    let strObj = localStorage.getItem(key);
    let obj = JSON.parse(strObj);
    obj.status = "done";
    localStorage.setItem(key,JSON.stringify(obj));
    viewCards();
}
function edit(key){
    console.log('edit');
    // let strObj = localStorage.getItem(key);
    // let obj = JSON.parse(strObj);
    // obj.status = "todo";
    // localStorage.setItem(key,JSON.stringify(obj));
    // viewCards();
}
function undoBtn(key){
     let strObj = localStorage.getItem(key);
     let obj = JSON.parse(strObj);
     obj.status = "todo";
     localStorage.setItem(key,JSON.stringify(obj));
     viewCards();
 }
//create object has its element name:name,innerHTML:text,class:class,attr:attri,event:event
function createElem(elemtype,elemtext=null,elemclass=null,elemattr=null) {
    let elem =  document.createElement(elemtype);
    if(elemtext){
        elem.innerHTML=elemtext;
    }
    if (elemclass) {
        // set loop for array
        elemclass.forEach(element => {
            elem.classList.add(element);
        });
    }
    if (elemattr) {
        // set attr in loop object
        for (const key in elemattr) {
            elem.setAttribute(key,elemattr[key]);
          }      
    }
    return elem;
}

let createTaskdiv = (key,taskObj) =>{
    let status = taskObj.status;
    let card = createElem("div",null,["card"]);
    let subDiv1 = createElem("div",null,["row","justifyBetween"]);
    let smartlistElem = createElem("p",taskObj.smartList);

    let read_date = stringDate(taskObj.date);
    if (taskObj.setalarm == true) {
        var alarmElem = createElem("p",read_date,["alarmDisplay"] );
    }else{
        var alarmElem = createElem("p",read_date);
    }    
    subDiv1.appendChild(smartlistElem);
    subDiv1.appendChild(alarmElem);
    
    const delEvent = {onclick:"delBtn(this,"+key+")"};
    let delBtn = createElem("button","<i class='fa-regular fa-trash-can'></i>",["btn"],delEvent);
    let spanElem = createElem("span",null,["row"]);
    spanElem.appendChild(delBtn);
    
    if(status=="todo"){
        const doneEvent = {onclick:"doneBtn("+key+")"};
        let checkBtn = createElem("button","<i class='fa fa-check' aria-hidden='true'></i>",["btn"],doneEvent);
        spanElem.appendChild(checkBtn);
    }else{
        const undoEvent = {onclick:"undoBtn("+key+")"};
        let undoBtn = createElem("button","<i class='fa fa-repeat' aria-hidden='true'></i>",["btn"],undoEvent);
        spanElem.appendChild(undoBtn);
    }

    subDiv1.appendChild(spanElem);
    card.appendChild(subDiv1);

    let taskElem = createElem("p",taskObj.task);
    card.appendChild(taskElem);
    return card;
}
function viewCards() {
    let todoTask = document.getElementsByClassName('todoTask')[0];
    let doneTask = document.getElementsByClassName('doneTask')[0];
    todoTask.innerHTML = "";
    doneTask.innerHTML = "";
    let keyArr =  getNewKey();
    for (let i = 0; i < localStorage.length; i++) {
        let getTask = localStorage.getItem(keyArr[i]);
        let taskObj = JSON.parse(getTask);          
        var card = createTaskdiv(keyArr[i],taskObj);
            
            if (taskObj.status=="todo") {
                todoTask.appendChild(card);
            }else{
                doneTask.appendChild(card);
            }         
        }
        updateTotals();
    }

document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    createObj();
    viewCards();
});
viewCards();
