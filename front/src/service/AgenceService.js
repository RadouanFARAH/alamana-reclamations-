import axios from 'axios';

export class AgenceService {

    getAgence() {
        return axios.get('/agences').then(res => res.data);
    }
    postAgence(data) {
        return axios.post('/agences',data).then(res => res.data);
    }
    putAgence(data) {
        return axios.put('/agences/'+data.id,data).then(res => res.data);
    }
    deleteAgence(data) {
        return axios.delete('/agences/'+data.id).then(res => res.data);
    }

 
}