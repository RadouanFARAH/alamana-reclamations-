import axios from 'axios';

let WS_URL = process.env.WS_URL;
let configdown = {
    key: "value",
    responseType: "blob",
};

export class ReclamationService {

    getReclamations() {
        return axios.get('/reclamations').then(res => res.data);
    }
    getReclamationFile(data) {
        return axios.post('/reclamations/downloadfile',data,configdown).then(res => res.data);
    }
    getReclamationsNotif() {
        return axios.get('/reclamations/reclamation').then(res => res.data);
    }
    getReclamationsCA() {
        return axios.get('/reclamations/chefagence').then(res => res.data);
    }
    getReclamationsGS() {
        return axios.get('/reclamations/gestionnaire').then(res => res.data);
    }
    getReclamationsRS() {
        return axios.get('/reclamations/responsable').then(res => res.data);
    }
    postReclamations(data) { 
        return axios.post('/reclamations',data).then(res => res.data);
    }
    putReclamations(data) {
        return axios.put('/reclamations/'+data.id,data).then(res => res.data);
    }


    getInfosClient(data) {
        return axios.post('/reclamations/findprospect',data).then(res => res.data);
    } 
}