import axios from 'axios';

export class UtilisateurService {

    getUtilisateur() {
        return axios.get('/users/All').then(res => res.data);
    }
    postUtilisateur(data) {
        return axios.post('/users/',data).then(res => res.data);
    }
    putUtilisateur(data) {
        return axios.put('/users/'+data.id,data).then(res => res.data);
    }
    deleteUtilisateur(data) {
        return axios.delete('/users/'+data.id).then(res => res.data);
    }
    login(data) {
        return axios.post('/users/login',data).then(res => res.data);
    }

 
}