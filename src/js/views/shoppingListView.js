import { elements } from './base';

export const renderItem = item => {
    const itemMarkup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;

    elements.shopping.insertAdjacentHTML('beforeend', itemMarkup);
}; 

export const renderDeleteBtn = () => {
    const clearAllBtn = document.querySelector('.btn__delete--all');
    if (!clearAllBtn) {
        const btnMarkup = `
        <button class="btn-tiny btn__delete--all">
            <i class="fa fa-trash-alt"></i>
        </button>`;

        elements.btnAddItem.insertAdjacentHTML('afterend', btnMarkup);
    }
};

export const renderInputs = () => {
    const inputsMarkup = `
        <i>*</i><input required class="item__input quantity" type="number" placeholder="Quantity">
        <i id="dummy"><br/>*</i><input class="item__input measure" type="text" placeholder="cups, tbsp?">
        <i id="last"><br/>*</i><textarea required class="item__input item__input-description" type="text" placeholder="ingredient..."></textarea>
        <button class="btn-tiny btn__add"><i class="fa fa-check"></i></button>
        <a id="cancel">cancel</a>
    `;

    !elements.inputShopItem.firstElementChild ? elements.inputShopItem.insertAdjacentHTML('afterbegin', inputsMarkup) : null;
}

export const removeInputs = () => {
    elements.inputShopItem.innerHTML = '';
}

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
};

export const clearList = () => {
    elements.shopping.innerHTML = '';
    const btn = document.querySelector('.btn__delete--all');
    btn.parentElement.removeChild(btn);
}