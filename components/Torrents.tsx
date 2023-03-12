import React, { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import QBittorrentClient from "qbittorrent-api-client";
//import useSelect from "../hooks/useSelect.tsx";

import * as api from 'qbittorrent-api-v2'
import axios from "axios";

const Torrents = () => {
  const containerStyles = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontSize: "0.8rem",
  };
  const textAreaStyles = {
    border: "1px solid gray",
    height: "50px",
    width: "50%",
    fontSize: "0.8rem",
    paddingLeft: "20px",
  };

  const fieldStyles = {
    borderBottom: "1px solid gray",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
  };

  const buttonStyles =
    "bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer";

  const [torrents, setTorrents] = useState([])
  const [link, setLink] = useState('')
  const [linkmusica, setLinkmusica] = useState('')

  const addLink = async () => {
    const savepath = !!link ? '/downloads' : !!linkmusica ? '/musica' : '';
    if (savepath) {
      const resp = await axios.post('/api/addtorrent', {urls: !!link ? link : !!linkmusica ? linkmusica : '', savepath: savepath}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (resp.data) {
        getList()
        setLink('')
        setLinkmusica('')
       }   
    }
  }
  
  const getList = async () => {
    const resp = await axios.post('/api/listtorrent', {}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (resp.data) setTorrents(resp.data)
  }

  useEffect(() => {
    getList()
  },[])

  const movies = torrents.filter(torrent => torrent.save_path === '/downloads')
  const musica = torrents.filter(torrent => torrent.save_path === '/musica')

return (
     <Card style={{ marginTop: "10px" }}>
       <CardBody>
        <input value={link} placeholder={'movie'} onChange={e => setLink(e.target.value) } name={'link'} style={textAreaStyles} />
        <input  value={linkmusica} placeholder={'musica'} onChange={e => setLinkmusica(e.target.value) } name={'linkmusica'} style={textAreaStyles} />
        <button className={`mt-5 ${buttonStyles}`} onClick={addLink}>add</button>
      </CardBody>
      <CardFooter>
        <div className={'flex flex-col'}>
        {movies.map(torrent => {
            return <div key={torrent.name} style={fieldStyles}>{torrent.name}</div>
          })}
        
      </div>
      <div className={ 'flex flex-col'}>
        {musica.map(torrent => {
          return <div className={'pl-10'} key={torrent.name} style={fieldStyles}>{torrent.name}</div>
          })}
        
        </div>
      </CardFooter>
     </Card>
  )
};

export default Torrents;

