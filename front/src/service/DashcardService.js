import axios from 'axios';

export class DashcardService {

//dash
    getDatas() {
        return axios.get('/dashCard/').then(res => res.data);
    }
}   