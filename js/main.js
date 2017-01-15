var movingCard = null;

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
var cards = document.querySelectorAll('#board .card');
[].forEach.call(cards, function(card) {
    card.addEventListener('dragstart', startDragging, false);
    card.addEventListener('dragend', stopDragging, false);
});
var columns = document.querySelectorAll('#board .column');
[].forEach.call(columns, function(column) {
    column.addEventListener('dragenter', dragInto, false);
    column.addEventListener('dragover', dragWithin, false);
    column.addEventListener('dragleave', dragOut, false);
    column.addEventListener('drop', drop, false);
});
