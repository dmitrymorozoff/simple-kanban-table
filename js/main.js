//Полифилл append для IE
(function(arr) {
    arr.forEach(function(item) {
        item.append = item.append || function() {
            var argArr = Array.prototype.slice.call(arguments),
                docFrag = document.createDocumentFragment();
            argArr.forEach(function(argItem) {
                var isNode = argItem instanceof Node;
                docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
            });
            this.appendChild(docFrag);
        };
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

var movingCard = null;
//Обработка событий Drag and Drop
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

var modal = document.getElementsByClassName('modal')[0];
var closeModalButton = document.getElementsByClassName('close-modal')[0];
var closeCardButton = document.getElementsByClassName('control-icons-item')[0];
//Добавляем подробную информацию о карточке в модальное окно
function createModalContent(modal, element) {
    if (element.getElementsByClassName('card-photo-item')[0]) {
        var photoWrapper = document.createElement('div');
        photoWrapper.className = 'modal-photo';
        var photo = document.createElement('img');
        photo.className = 'modal-photo-item';
        var photoFromCard = element.getElementsByClassName('card-photo-item')[0];
        photo.setAttribute('src', photoFromCard.getAttribute('src'));
        photoWrapper.appendChild(photo);
        modal.appendChild(photoWrapper);
    }
    if (element.getElementsByClassName('card-title')[0]) {
        var h3 = document.createElement('h3');
        h3.className = 'title-modal-content';
        var titleElem = element.getElementsByClassName('card-title')[0];
        h3.innerHTML = titleElem.innerText;
        modal.appendChild(h3);
    }
    if (element.getElementsByClassName('card-desc')[0]) {
        var p = document.createElement('p');
        p.className = 'desc-modal-content';
        var descElem = element.getElementsByClassName('card-desc')[0];
        p.innerHTML = descElem.innerText;
        modal.appendChild(p);
    }
    if (element.getAttribute('data-priority')) {
        var prior = document.createElement('p');
        prior.className = 'priority-modal-content';
        var priority = element.getAttribute('data-priority');
        prior.innerHTML = priority + ' priority';
        modal.appendChild(prior);
    }
}
//Массив объектов с информацией о радио-кнопках
var priorities = [{
    title: 'Low',
    dataAttr: 'low'
}, {
    title: 'Medium',
    dataAttr: 'medium'
}, {
    title: 'High',
    dataAttr: 'high'
}];
//Создание радио-кнопок
function createRadioGroup(items) {
    var ul = document.createElement('ul');
    ul.className = 'radio-list';
    for (var i = 0; i < items.length; i++) {
        var li = document.createElement('li');
        li.className = 'radio-list-item';
        var label = document.createElement('label');
        label.className = 'label-radio';
        var input = document.createElement('input');
        input.type = 'radio';
        input.className = 'radio';
        input.name = 'foo';
        input.setAttribute('data-priority', items[i].dataAttr);
        label.appendChild(input);
        label.append(items[i].title);
        li.appendChild(label);
        ul.appendChild(li);
    }
    return ul;
}

function getCheckedRadio(radioGroup) {
    for (var i = 0; i < radioGroup.length; i++) {
        var button = radioGroup[i];
        if (button.checked) {
            return button;
        }
    }
    return undefined;
}

function setRadioChecked(radioButtons, priority) {
    for (var i = 0; i < radioButtons.length; i++) {
        console.log('adsc;');
        if (radioButtons[i].getAttribute('data-priority') === priority) {
            radioButtons[i].checked = 'true';
        }
    }
}
//Модальное окно с созданием новой карточки
function workingWithModal(modal, type, targetElem) {
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
    var modalButton = document.createElement('a');
    modalButton.href = '#';
    modalButton.classList.add('add-task-button', 'modal-create-button');
    if (type === 'create') {
        modalButton.innerText = 'Create new card';
    }
    var spanPriority = document.createElement('span');
    spanPriority.className = 'modal-label';
    spanPriority.innerText = 'Priority';
    var radio = createRadioGroup(priorities);
    var radioButtons = radio.getElementsByClassName('radio');
    modal.appendChild(spanPriority);
    modal.appendChild(radio);
    modal.appendChild(spanTitle);
    modal.appendChild(inputTitle);
    modal.appendChild(spanDesc);
    modal.appendChild(textarea);
    modal.appendChild(modalButton);
    if (type === 'edit') {
        modalButton.innerText = 'Save card';
        inputTitle.value = targetElem.getElementsByClassName('card-title')[0].innerText;
        textarea.value = targetElem.getElementsByClassName('card-desc')[0].innerText;
        setRadioChecked(radioButtons, targetElem.getAttribute('data-priority'));
    }
    var currentCheckedRadio = null;
    radio.onchange = function(event) {
        currentCheckedRadio = event.target.getAttribute('data-priority');
    };
    modalButton.onclick = function(event) {
        if (type === 'create') {
            event.preventDefault();
            var newCard = createNewCard(modal.getElementsByClassName('modal-input-title')[0].value, modal.getElementsByClassName('modal-textarea-desc')[0].value, currentCheckedRadio, targetElem);
            newCard.addEventListener('dragstart', startDragging, false);
            newCard.addEventListener('dragend', stopDragging, false);
            newCard.addEventListener('click', onClickCard, false);
            newCard.addEventListener('mouseover', showControls, false);
            newCard.addEventListener('mouseout', hideControlsButton, false);
            targetElem.appendChild(newCard);
        }
        if (type === 'edit') {
            event.preventDefault();
            targetElem.getElementsByClassName('card-title')[0].innerText = inputTitle.value;
            targetElem.getElementsByClassName('card-desc')[0].innerText = textarea.value;
            targetElem.setAttribute('data-priority', getCheckedRadio(radioButtons).getAttribute('data-priority'));
        }
        this.parentElement.parentElement.classList.remove('active');
        var contentModal = this.parentElement.parentElement.getElementsByClassName('modal-content')[0];
        contentModal.innerHTML = '';
    };
}
//Обработка клика на карточку
function onClickCard(event) {
    if (!modal.classList.contains('active')) {
        if (event.target.tagName !== 'LABEL' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'I') {
            modal.classList.add('active');
            createModalContent(modal.getElementsByClassName('modal-content')[0], this);
        }
        console.log(this);
        if (event.target.tagName === 'I' && event.target.classList.contains('ion-close-round')) {
            removeCard(this);
        }
        if (event.target.tagName === 'I' && event.target.classList.contains('ion-edit')) {
            editCard(this);
        }
    }
}
//Закрываем модальное окно с подробной информацией о карточке
closeModalButton.addEventListener('click', function() {
    modal.classList.remove('active');
    var content = modal.getElementsByClassName('modal-content')[0];
    content.innerHTML = '';
});

function showControls() {
    var controlButtons = this.getElementsByClassName('control-icons')[0];
    controlButtons.style.opacity = '1';
}
//Удаление карточки
function removeCard(currentThis) {
    var closeButton = currentThis.getElementsByClassName('control-icons-item')[0];

    var that = currentThis;
    var alert = createAlert('Are you sure?', 'Are you sure that you want to delete this card?');
    alert.onclick = function(event) {
        if (event.target.classList.contains('alert-button-ok')) {
            this.parentNode.removeChild(this);
            var currentCard = that;
            var ul = currentCard.parentElement;
            ul.removeChild(currentCard);
        }
        if (event.target.classList.contains('alert-button-no')) {
            this.parentNode.removeChild(this);
        }
    };
}

function removeCard(currentThis) {
    var closeButton = currentThis.getElementsByClassName('control-icons-item')[0];

    var that = currentThis;
    var alert = createAlert('Are you sure?', 'Are you sure that you want to delete this card?');
    alert.onclick = function(event) {
        if (event.target.classList.contains('alert-button-ok')) {
            this.parentNode.removeChild(this);
            var currentCard = that;
            var ul = currentCard.parentElement;
            ul.removeChild(currentCard);
        }
        if (event.target.classList.contains('alert-button-no')) {
            this.parentNode.removeChild(this);
        }
    };
}

function editCard(currentThis) {
    var modal = document.getElementsByClassName('modal')[0];
    if (!modal.classList.contains('active')) {
        modal.classList.add('active');
        workingWithModal(modal.getElementsByClassName('modal-content')[0], 'edit', currentThis);
    }
}
//Прячем кнопку удаления
function hideControlsButton() {
    this.getElementsByClassName('control-icons')[0].style.opacity = '0';
}
//Вешаем обработчики событий на карточки и колонки
var cards = document.querySelectorAll('.card');
[].forEach.call(cards, function(card) {
    card.addEventListener('dragstart', startDragging, false);
    card.addEventListener('dragend', stopDragging, false);
    card.addEventListener('mouseover', showControls, false);
    card.addEventListener('mouseout', hideControlsButton, false);
    card.addEventListener('click', onClickCard, false);
});
var columns = document.querySelectorAll('.column');
[].forEach.call(columns, function(column) {
    column.addEventListener('dragenter', dragInto, false);
    column.addEventListener('dragover', dragWithin, false);
    column.addEventListener('dragleave', dragOut, false);
    column.addEventListener('drop', drop, false);
});
//Добавление новой карточки
function createNewCard(title, desc, priority, targetElem) {
    var li = document.createElement('li');
    li.className = 'card';
    li.setAttribute("draggable", true);
    li.setAttribute('data-priority', priority);
    var cardPhoto = document.createElement('div');
    cardPhoto.className = 'card-photo';
    var cardPhotoItem = document.createElement('img');
    cardPhotoItem.className = 'card-photo-item';
    cardPhotoItem.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/profile-sample1.jpg';
    cardPhotoItem.alt = 'ava';
    cardPhoto.appendChild(cardPhotoItem);
    var cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';
    var h3 = document.createElement('h3');
    h3.className = 'card-title';
    h3.innerText = title;
    var p = document.createElement('p');
    p.className = 'card-desc';
    p.innerText = desc;
    cardInfo.appendChild(h3);
    cardInfo.appendChild(p);
    var controlIcons = document.createElement('div');
    controlIcons.className = 'control-icons';
    var iClose = document.createElement('i');
    iClose.classList.add('ionicons', 'ion-close-round', 'control-icons-item');
    var iEdit = document.createElement('i');
    iEdit.classList.add('ionicons', 'ion-edit', 'control-icons-item');
    controlIcons.appendChild(iClose);
    controlIcons.appendChild(iEdit);
    li.appendChild(cardPhoto);
    li.appendChild(cardInfo);
    li.appendChild(controlIcons);
    targetElem.appendChild(li);
    return li;
}
//Обработка клика создания новой карточки
function onClickNewCardButton(e) {
    e.preventDefault();
    var targetElem = this.parentElement.getElementsByClassName('card-list')[0];
    if (!modal.classList.contains('active')) {
        modal.classList.add('active');
        workingWithModal(modal.getElementsByClassName('modal-content')[0], 'create', targetElem);
    }
}
//Вешаем событие на кнопку добавление карточки
var newCardButtons = document.getElementsByClassName('add-task-button');
[].forEach.call(newCardButtons, function(newCardButton) {
    newCardButton.addEventListener('click', onClickNewCardButton, false);
});
//Создание уведомлений
function createAlert(title, description) {
    var alert = document.createElement('div');
    alert.className = 'alert';
    var alertTitle = document.createElement('p');
    alertTitle.className = 'alert-title';
    alertTitle.innerText = title;
    var alertDesc = document.createElement('p');
    alertDesc.className = 'alert-desc';
    alertDesc.innerText = description;
    var alertButtonYes = document.createElement('a');
    alertButtonYes.classList.add('alert-button', 'alert-button-ok');
    alertButtonYes.innerText = 'Yes';
    var alertButtonNo = document.createElement('a');
    alertButtonNo.classList.add('alert-button', 'alert-button-no');
    alertButtonNo.innerText = 'No';
    alert.appendChild(alertTitle);
    alert.appendChild(alertDesc);
    alert.appendChild(alertButtonYes);
    alert.appendChild(alertButtonNo);
    document.body.appendChild(alert);
    return alert;
}
