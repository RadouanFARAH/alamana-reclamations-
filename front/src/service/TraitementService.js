import axios from 'axios';

export class TraitementService {

    affecter(data) {
        return axios.post('/traitements/affecter',data).then(res => res.data);
    }
    taffecter(data) {
        return axios.post('/traitements/taffecter',data).then(res => res.data);
    }
    traiter(data) {
        return axios.post('/traitements/traiter',data).then(res => res.data);
    }
    cloturer(data) {
        return axios.post('/traitements/cloturer',data).then(res => res.data);
    }
    getTraiterService() {
        return axios.get('/traitements/nontraiter').then(res => res.data);
    }
    getCloturerService() {
        return axios.get('/traitements/noncloturer').then(res => res.data);
    }
    relancerService(data) {
        return axios.post('/traitements/relancer',data).then(res => res.data);
    } 
 
} 