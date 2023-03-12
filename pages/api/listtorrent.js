import axios from 'axios';

export default async function handler(req, res) {

  const api = require('../../utils/qbt.js')

  api.connect('http://10.0.0.4:9865', 'admin', '!Bt3,14159265@')
    .then(qbt => {
      qbt.torrents()
        .then(torrents => {
          res.status(200).json(torrents);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        })
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })
  
  // const loginUrl = 'http://10.0.0.4:9865/api/v2/auth/login';
  // const apiUrl = 'http://10.0.0.4:9865/api/v2';

  // // Make the login request to get the cookies
  // try {
  //   await axios.post(loginUrl, {
  //     username: 'admin',
  //     password: '!Bt3,14159265@'
  //   }, {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     withCredentials: true
  //   });
  // } catch (error) {
  //   console.error('Login request failed:', error);
  //   return res.status(500).json({ message: 'Login request failed' });
  // }

  // // Make subsequent requests with the cookies
  // try {
  //   const response = await axios.post(`${apiUrl}/torrents/info`, {
  //     //withCredentials: true
  //   });

  //   res.status(200).json({ message: 'Subsequent request successful', data: response.data });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
}
