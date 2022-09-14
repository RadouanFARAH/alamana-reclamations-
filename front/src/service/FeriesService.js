import axios from 'axios';

export class FeriesService {

    getJoursFeries() { 
        return axios.get('/JoursFeries').then(res => res.data);
    }
    postJoursFeries(data) {
        return axios.post('/JoursFeries',data).then(res => res.data);
    }
    putJoursFeries(data) {
        return axios.put('/JoursFeries/'+data.id,data).then(res => res.data);
    }
    deleteJoursFeries(data) {
        return axios.delete('/JoursFeries/'+data.id).then(res => res.data);
    }

 
}  