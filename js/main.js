var movingCard = null;
/***Обработка событий Drag and Drop***/
function startDragging(e) {
    this.classList.add('dragging');
    movingCard = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function dragInto(e) {
    if (movingCard.parentNode.parentNode !== this) {
        this.classList.add('over');
    }
}

function dragWithin(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function dragOut(e) {
    this.classList.remove('over');
}

function drop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (movingCard.parentNode.parentNode !== this) {
        this.getElementsByClassName('card-list')[0].appendChild(movingCard);
    }
    return false;
}

function stopDragging(e) {
    [].forEach.call(columns, function(column) {
        column.classList.remove('over');
    });
    movingCard.classList.remove('dragging');
    movingCard = null;
}
/***Работа с модальным окном***/
var modal = document.getElementsByClassName('modal')[0];
var closeModalButton = document.getElementsByClassName('close-modal')[0];
var closeCardButton = document.getElementsByClassName('close-card')[0];

function createModalContent(modal, element) {
    var div = document.createElement('div');
    var descElem = element.getElementsByClassName('card-desc')[0];
    div.innerHTML = descElem.innerHTML;
    modal.appendChild(div);
}

function createModalNewCard(modal, targetUl) {
    var spanTitle = document.createElement('span');
    spanTitle.className = 'modal-label';
    spanTitle.innerText = 'Title';
    var inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.classList.add('modal-input', 'modal-input-title');
    var spanDesc = document.createElement('span');
    spanDesc.className = 'modal-label';
    spanDesc.innerText = 'Description';
    var textarea = document.createElement('textarea');
    textarea.name = 'modal-desc';
    textarea.classList.add('modal-textarea', 'modal-textarea-desc');
    var addButton = document.createElement('a');
    addButton.href = '#';
    addButton.classList.add('add-task-button', 'modal-create-button');
    addButton.innerText = 'Create new card';
    modal.appendChild(spanTitle);
    modal.appendChild(inputTitle);
    modal.appendChild(spanDesc);
    modal.appendChild(textarea);
    modal.appendChild(addButton);
    addButton.onclick = function(event) {
        event.preventDefault();
        var newCard = createNewCard('item', 'New card with new description!', targetUl);
        newCard.addEventListener('dragstart', startDragging, false);
        newCard.addEventListener('dragend', stopDragging, false);
        newCard.addEventListener('click', onClickCard, false);
        newCard.addEventListener('mouseover', showCloseButtonAndRemoveCard, false);
        newCard.addEventListener('mouseout', hideCloseButton, false);
        targetUi.appendChild(newCard);
    };
}

function onClickCard(event) {
    if (!modal.classList.contains('active')) {
        if (event.target.tagName !== 'LABEL' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'I') {
            modal.classList.add('active');
            createModalContent(modal.getElementsByClassName('modal-content')[0], this);
        }
    }
}
closeModalButton.addEventListener('click', function() {
    modal.classList.remove('active');
    var content = modal.getElementsByClassName('modal-content')[0];
    content.innerHTML = '';
});

function showCloseButtonAndRemoveCard() {
    var closeButton = this.getElementsByClassName('close-card')[0];
    closeButton.style.opacity = '1';
    closeButton.onclick = function(event) {
        var currentCard = this.parentElement;
        var ul = currentCard.parentElement;
        ul.removeChild(currentCard);
    };
}

function hideCloseButton() {
    this.getElementsByClassName('close-card')[0].style.opacity = '0';
}
var cards = document.querySelectorAll('.card');
[].forEach.call(cards, function(card) {
    card.addEventListener('dragstart', startDragging, false);
    card.addEventListener('dragend', stopDragging, false);
    card.addEventListener('mouseover', showCloseButtonAndRemoveCard, false);
    card.addEventListener('mouseout', hideCloseButton, false);
    card.addEventListener('click', onClickCard, false);
});
var columns = document.querySelectorAll('.column');
[].forEach.call(columns, function(column) {
    column.addEventListener('dragenter', dragInto, false);
    column.addEventListener('dragover', dragWithin, false);
    column.addEventListener('dragleave', dragOut, false);
    column.addEventListener('drop', drop, false);
});
/***Добавление новой карточки***/
function createNewCard(title, desc, targetUl) {
    var li = document.createElement('li');
    li.className = 'card';
    li.setAttribute("draggable", true);
    var p = document.createElement('p');
    p.className = 'card-desc';
    p.innerText = desc;
    var i = document.createElement('i');
    i.classList.add('ionicons', 'ion-android-close', 'close-card');
    var input = document.createElement('i');
    li.appendChild(p);
    li.appendChild(i);
    targetUl.appendChild(li);
    // var descElem = getChildrenElementByClassName(element, 'card-desc');
    // div.className = "alert alert-success";
    // div.innerHTML = descElem.innerHTML;
}

function onClickNewCardButton(e) {
    e.preventDefault();
    //получили все данные необходимые для вставки нового элемента
    //.....
    //создаем новую карточку с полученными параметрами
    var targetUl = this.parentElement.getElementsByClassName('card-list')[0];
    if (!modal.classList.contains('active')) {
        modal.classList.add('active');
        createModalNewCard(modal.getElementsByClassName('modal-content')[0], targetUl);
    }


    //targetUl.appendChild(newCard);
}
var newCardButtons = document.getElementsByClassName('add-task-button');
[].forEach.call(newCardButtons, function(newCardButton) {
    newCardButton.addEventListener('click', onClickNewCardButton, false);
});
