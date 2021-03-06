import Error from './errors';
// Models
import Likes from './models/Likes';
import Search from './models/Search';
import ShoppingList from './models/ShoppingList';
import Recipe from './models/Recipe';
// Views
import * as likesView from './views/likesView';
import * as recipeView from './views/recipeView';
import * as searchView from './views/searchView';
import * as shoppingListView from './views/shoppingListView';
import { elements, renderLoader, clearLoader, getManualListValues } from './views/base';


/** Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */
const state = {};


/**
 * SEARCH Controller
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search obj and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            state.error = new Error();
            state.error.renderError('search');
            console.log(err);
            clearLoader();
        }
    } 
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE Controller
 */
const controlRecipe = async () => {

    // Remove ERROR message if it exists
    state.error ? state.error.removeError() : null 

    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Hightlight selected search items
        if(state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time 
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (err) {
            state.error = new Error();
            state.error.renderError('recipe');
            console.log(err);
            clearLoader();
        }
    }
}
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST Controller
 */
const controlList = () => {
    // Create a new list IF there is none
    if (!state.list) state.list = new ShoppingList(); 

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        shoppingListView.renderItem(item);
    });
    shoppingListView.renderDeleteBtn();
}

const controlListManual = () => {
    // Create a new list IF there is none
    if (!state.list) state.list = new ShoppingList();

    // Get the values
    const values = getManualListValues()
    const item = state.list.addItem(values.count, values.unit, values.ingredient);

    // Add each ingredient
    shoppingListView.renderItem(item);
}

// Retrieve local storage data and display it to the UI
window.addEventListener('load', () => {
    state.list = new ShoppingList();

    // Update retrieve stored data
    state.list.getStoredData();

    // Render lists
    state.list.items.forEach(el => shoppingListView.renderItem(el));
    
    // Render delete button if theres a list
    if (state.list.items.length) shoppingListView.renderDeleteBtn();
});

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delte from UI
        shoppingListView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    } 
});

// Handle clear list, add item, submit item buttons
elements.addDelete.addEventListener('click', e => {
    // Clear list
    if (e.target.matches('.btn__delete--all, .btn__delete--all *')) {
        if (state.list) {
            state.list.clearList();
            shoppingListView.clearList();
            state.list.persistData();
        }
    // Render input fields
    } else if (e.target.matches('.btn__add--item')) {
        shoppingListView.renderInputs();
    } else if (e.target.matches('#cancel')) {
        shoppingListView.removeInputs();
    }
});

// Manual list input form
elements.inputShopItem.addEventListener('submit', e => {
    e.preventDefault();

    // Add list item
    controlListManual();

    // Add the Clear all button
    shoppingListView.renderDeleteBtn();
    
    // Remove input fields
    shoppingListView.removeInputs();
    
});


/**
 * LIKES Controller
 */
const controlLike = (ev = 'click') => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI
        likesView.deleteLike(currentID);
        
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Get localStorage data when page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

// Handel delete error window 
elements.errorWindow.addEventListener('click', e => {
    e.target.matches('.fa-times') ? state.error.removeError() : null 
});

