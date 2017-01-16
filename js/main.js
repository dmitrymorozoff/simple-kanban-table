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

function createModalContent(modal, element) {
    var div = document.createElement('div');
    var descElem = element.getElementsByClassName('card-desc')[0];
    div.innerHTML = descElem.innerHTML;
    modal.appendChild(div);
}

function onClickCard(event) {
    if (!modal.classList.contains('active')) {
        if (event.target.tagName !== 'LABEL' && event.target.tagName !== 'INPUT') {
            modal.classList.add('active');
            createModalContent(modal.getElementsByClassName('modal-content')[0], this);
        }
    }
}
closeModalButton.addEventListener('click', function() {
    modal.classList.remove('active');
    var content = modal.getElementsByClassName('modal-content')[0];
    console.log(content);
    content.innerHTML = '';
});

var cards = document.querySelectorAll('.card');
[].forEach.call(cards, function(card) {
    card.addEventListener('dragstart', startDragging, false);
    card.addEventListener('dragend', stopDragging, false);
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
function createNewCard(title, desc) {
    var li = document.createElement('li');
    li.className = 'card';
    li.setAttribute("draggable", true);
    var p = document.createElement('p');
    p.className = 'card-desc';
    p.innerText = desc;
    li.appendChild(p);
    return li;
    // var descElem = getChildrenElementByClassName(element, 'card-desc');
    // div.className = "alert alert-success";
    // div.innerHTML = descElem.innerHTML;
}

function onClickNewCardButton(e) {
    e.preventDefault();
    //получили все данные необходимые для вставки нового элемента
    //.....
    //создаем новую карточку с полученными параметрами
    var newCard = createNewCard('item', 'New card with new description!');
    newCard.addEventListener('dragstart', startDragging, false);
    newCard.addEventListener('dragend', stopDragging, false);
    newCard.addEventListener('click', onClickCard, false);
    var targetUl = this.parentElement.getElementsByClassName('card-list')[0];
    targetUl.appendChild(newCard);
}
var newCardButtons = document.getElementsByClassName('add-task-button');
[].forEach.call(newCardButtons, function(newCardButton) {
    newCardButton.addEventListener('click', onClickNewCardButton, false);
});
