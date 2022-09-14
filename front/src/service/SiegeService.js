import axios from 'axios';

export class SiegeService {

    getSiege() {
        return axios.get('/sieges').then(res => res.data);
    }
    postSiege(data) {
        return axios.post('/sieges',data).then(res => res.data);
    }
    putSiege(data) {
        return axios.put('/sieges/'+data.id,data).then(res => res.data);
    }
    deleteSiege(data) {
        return axios.delete('/sieges/'+data.id).then(res => res.data);
    }

 
}