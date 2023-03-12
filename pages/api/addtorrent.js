export default async function handler(req, res) {

  const api = require('../../utils/qbt.js')

  api.connect('http://10.0.0.4:9865', 'admin', '!Bt3,14159265@')
    .then(qbt => {
      qbt.addTorrent(req.body.urls, req.body.savepath)
        .then(torrents => {
          res.status(200).json({ message: torrents });
        })
        .catch(err => {
          res.status(500).json({ message: err.message });
        })
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    })

}
