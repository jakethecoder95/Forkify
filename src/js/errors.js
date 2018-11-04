import { elements } from './views/base';

export default class Error {

    renderError (type, des = null) {
        let markup;

        if (!des) {
            markup = `
                <div class="error">
                    <p>ERROR: Something went wrong processing that ${type}</p>
                    <i class='fa fa-times'></i>
                </div>
            `;
        } else if (des) {
            markup = `
                <div class="error">
                    <p>ERROR: Something went wrong processing that ${type}: ${des}</p>
                    <i class='fa fa-times'></i>
                </div>
            `;
        }

        elements.errorWindow.insertAdjacentHTML('afterbegin', markup);
    }

    removeError () {
        elements.errorWindow.innerHTML = '';
    }


}