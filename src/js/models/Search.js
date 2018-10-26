import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const proxy = 'http://cors-anywhere.herokuapp.com/'
        const key = '6b7344ad770c974efb9a900a95993e1f';
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipe;
            //console.log(this.result); ////// TODO
            console.log(res);
        } catch (error) {
            alert(error);
        }
    }
}