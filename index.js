const form = document.getElementsByTagName('form')[0];
const item = document.querySelector('#item');
const listitems = document.querySelector('#listitems');
const list = document.querySelector('#list');
const alertt = document.querySelector('#alert');

const submitbtn = form.lastElementChild;
const clearbtn = document.querySelector('#clearbtn');

let editflag = false;
let editID;
let editelement;

form.addEventListener('submit', submitfunc);
clearbtn.addEventListener('click', clearitems);
window.addEventListener('DOMContentLoaded', loadlist);

function loadlist() {
    localitems = getlocalstorage();
    if (localitems.length >0) {
        localitems.forEach(function(item){
            createitem(item.id, item.value)
        })
    }
}

function createitem(id, value) {
    const newdiv = document.createElement('div');
    newdiv.classList.add('listitem');
    const newattr = document.createAttribute('data-id');
    newattr.value = id;
    newdiv.setAttributeNode(newattr);
    newdiv.innerHTML = `<p>${value}</p>
                <div id="listbtns">
                    <button class="editbtn">Edit</button>
                    <button class="delbtn">Del</button>
                </div>`;
    
    listitems.appendChild(newdiv);
    
    const editbtn = newdiv.querySelector('.editbtn');
    const delbtn = newdiv.querySelector('.delbtn');
    editbtn.addEventListener('click', editfunc);
    delbtn.addEventListener('click', delfunc);
    
    listitems.classList.add('showdiv');
    clearbtn.classList.add('showdiv');
}

//
function submitfunc(e) {
    e.preventDefault();
    const value = item.value;
    const id = new Date().getTime().toString();

    if (value && !editflag ) {
        console.log('submitting...');
        createitem(id, value);
        addtolocalstorage(id, value);
        setbacktodefault();
        displayalert('Item added...', 'success');

    } else if (value && editflag ) {
        console.log('editting...');
        editelement.innerHTML = value;
        editlocalstorage(editID, value);
        setbacktodefault();
        displayalert('Item editted successfully', 'success');

    } else {
        console.log('empty input...');
        displayalert('Plese input your item...', 'danger');
    }
}

function clearitems () {
    console.log('clearing...');
    
    const listofitem = document.querySelectorAll('.listitem');
    if (listofitem.length>0) {
        listofitem.forEach(function(listitem){
            listitems.removeChild(listitem);
        });

        clearbtn.classList.remove('showdiv');
        listitems.classList.remove('showdiv');

        localStorage.removeItem('list');
        setbacktodefault();
        displayalert('List cleared', 'danger');
    }
}

function delfunc(e) {
    console.log('del func');
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    listitems.removeChild(element);

    const listofitem = document.querySelectorAll('.listitem');
    // listofitem.children.length;
    if (listofitem.length === 0) {
        clearbtn.classList.remove('showdiv');
        listitems.classList.remove('showdiv');
    }
    
    removefromlocalstorage(id, e.currentTarget.parentElement.previousElementSibling.innerHTML);
    setbacktodefault();
    displayalert('Item Deleted', 'danger');
}

function editfunc(e) {
    console.log('edit func');
    const element = e.currentTarget.parentElement.parentElement;
    editelement = e.currentTarget.parentElement.previousElementSibling;
    item.value = editelement.innerHTML;

    editflag = true;
    editID = element.dataset.id;
    console.log(editID);
    submitbtn.textContent  = 'Edit';
}

//
function displayalert(message, type){
    alertt.classList.add(type);
    alertt.textContent = message;
    
    setTimeout (function(){
        alertt.classList.remove(type);
        alertt.textContent = '';
    }, 1000)
}

//
function setbacktodefault() {
    console.log(`setting back to default`);
    item.value = '';
    editflag = false;
    editID = '';
    submitbtn.textContent= 'Submit';
}


//
function addtolocalstorage(id, value) {
    const localitem = {id, value};
    let localitems = getlocalstorage();
    localitems.push(localitem);
    localStorage.setItem('list', JSON.stringify(localitems));
    
    console.log(`added ${id} ${value} to local storage`);     
}

function editlocalstorage(id, value) {
    let localitems = getlocalstorage();
    localitems = localitems.map(function(item){
        if (item.id === id) {
            item.value = value;
        } 
        return item;
    })
    localStorage.setItem('list', JSON.stringify(localitems));

    console.log(`edited ${id} ${value} in local storage`);     
}

function removefromlocalstorage(id, value) {
    let localitems = getlocalstorage();
    localitems = localitems.filter(function(item){
        if (item.id !== id) {
            return item;
        }
    })
    localStorage.setItem('list', JSON.stringify(localitems));

    console.log(`removed ${id} ${value} from local storage`); 
}

function getlocalstorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}
