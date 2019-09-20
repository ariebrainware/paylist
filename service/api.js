import Axios from 'axios';

const API = {
    all(callback) {
      Axios.create('http://localhost:8000')
        .then((resp) => {
          callback(resp)
        })
    }
}

export default API