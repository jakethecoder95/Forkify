export const elements = {
    addDelete: document.querySelector('.add__delete'),
    btnAddItem: document.querySelector('.btn__add--item'),
    btnDeleteAll: document.querySelector('.btn__delete--all'),
    inputShopItem: document.querySelector('.input__list--item'),
    likesMenu: document.querySelector('.likes__field'),
    likesLink: document.querySelector('.likes__list'),
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    shopping: document.querySelector('.shopping__list'),
    recipe: document.querySelector('.recipe'),
};

export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
}

export const getManualListValues = () => {
    return {
        count: document.querySelector('.quantity').value,
        unit: document.querySelector('.measure').value,
        ingredient: document.querySelector('.item__input-description').value
    }
};

