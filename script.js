function toggleHide(e) {
    var showEle = e.nextElementSibling;
    showEle.classList.toggle("hide");
}

let createObj = ()=>{
    // var specialChars = /[^a-zA-Z0-9 ]/g;
    var task = document.getElementById('task').value;
    var refinedTask = task.replace(/[^a-zA-Z0-9\s]/g, ' ');
    
    var checkDate = document.getElementById("alarmDate").value;
    if (checkDate) {
        var refinedDate = Date.parse(checkDate);
        refinedDate =new Date(refinedDate);
        var today =new Date();
        var setAlarm = false;
    
        if (refinedDate.getTime() < today.getTime()) {
            console.log('This date have passed, no alert is set');
            setAlarm = false;
            } else if (refinedDate.getTime() == today.getTime()) {
            console.log('This date is current, no alert is set');
            setAlarm = false;
        } else {
            console.log('The alarm is set for ' + refinedDate);
            setAlarm = true;
        }          
    }else{
        setAlarm=false;
        refinedDate = null;
    }
    
    var selectedList = document.querySelector('input[name="smartList"]').value;
    var refinedList = selectedList.replace(/[^a-zA-Z0-9]/g, '');    
    
    let objToSave={task:refinedTask,status:"todo",setalarm:setAlarm,refinedDate:refinedDate,refinedList:refinedList};
    // save in local storage
    localStorage.setItem(localStorage.length,JSON.stringify(objToSave));
    task = null;
    setAlarm=false;
    checkDate = null;
    selectedList = null;
    
    return objToSave;
}

// create three event functions of card - delete , completed , refresh , edit
function delBtn(){
    console.log("del");
    // del the obj
    //call viewCard func
}
function doneBtn(){
    console.log("done");
    // change the status of the object to done
    //call viewCard func

}
function undoBtn(){
    console.log("undo");
    // change the status of the object to todo
    //call viewCard func

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
            // console.log(key + "="+ obj[key]);
            elem.setAttribute(key,elemattr[key]);
          }      
    }
    return elem;
}

let createTaskdiv = (status,taskObj) =>{
    // pick data from local storage and put it in the card
    let child1 = createElem("div",null,["row","justifyBetween"]);
    let smartlistElem = createElem("p",taskObj.refinedList);
    let alarmElem = createElem("p",taskObj.refinedDate);
    child1.appendChild(smartlistElem);
    child1.appendChild(alarmElem);
    
    const delEvent = {onclick:"delBtn()"};
    let delBtn = createElem("button","<i class='fa-regular fa-trash-can'></i>",["btn"],delEvent);
    let spanElem = createElem("span",null,["row"]);
    spanElem.appendChild(delBtn);
    
    if(status=="todo"){
        const doneEvent = {onclick:"doneBtn()"};
        let checkBtn = createElem("button","<i class='fa fa-check' aria-hidden='true'></i>",["btn"],doneEvent);
        spanElem.appendChild(checkBtn);
    }else{
        const undoEvent = {onclick:"undoBtn()"};
        let undoBtn = createElem("button","<i class='fa fa-check' aria-hidden='true'></i>",["btn"],undoEvent);
        spanElem.appendChild(undoBtn);
    }

    child1.appendChild(spanElem);

    let card = createElem("div",null,["card"]);
    card.appendChild(child1);

    let taskElem = createElem("p",taskObj.task);
    card.appendChild(taskElem);
    return card;
}

function viewCards(status) {
    //if localstorage.length is > 0
    var totalTask = localstorage.length;
    if (totalTask>0) {
        for (let i = 0; i < totalTask; i++) {
            // get the storage objects
            var getTask = localStorage.getItem(i);
            // Parse JSON string to object
            let taskObj = JSON.parse(getTask);          
            let card = createTaskdiv(status,taskObj);
        }
        if (status=="todo") {
            // put all the cards in tododiv
            let todoTask = document.getElementsByClassName('todoTask')[0];
            todoTask.appendChild(card);       
            let totalToDoTasks = document.getElementById('totalToDoTasks').innerHTML;
            totalToDoTasks = totalTask;
        }else{
            // put all the cards in donediv
            let doneTask = document.getElementsByClassName('doneTask')[0];
            doneTask.appendChild(card);
            let totalDoneTasks = document.getElementById('totalDoneTasks').innerHTML;
            totalDoneTasks = totalTask;
        }       
    }else{
        console.log("No tasks to show");
    }
}

let createTask = () =>{
    let taskObj = createObj();
    let card = createTaskdiv("todo",taskObj);
    let todoTask = document.getElementsByClassName('todoTask')[0];
    todoTask.appendChild(card);
}