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
    height: "31px",
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
    "ml-2 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer";

  const [torrents, setTorrents] = useState([])
  const [link, setLink] = useState('')
  const [linkmusica, setLinkmusica] = useState('')
  const [linktvshows, setLinkTvShows] = useState('')

  const addLink = async (type) => {
    const config = {
      "movies": [link, '/downloads'],
      "musica": [linkmusica, "/musica"],
      "tvshows": [linktvshows, "/tvshows"]
    }
    
    const urls = config[type][0]
    const savepath = config[type][1];

    if (savepath) {
      const resp = await axios.post('/api/addtorrent', {urls: urls, savepath: savepath}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (resp.data) {
        getList()
        setLink('')
        setLinkmusica('')
        setLinkTvShows('')
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
  const tvshows = torrents.filter(torrent => torrent.save_path === '/tvshows')

return (
     <Card style={{ marginTop: "10px" }} fontSize={'3xs'}>
    <CardBody>
      <div className={'flex-col'}>
        <div><input value={link} placeholder={'movie'} onChange={e => setLink(e.target.value) } name={'link'} style={textAreaStyles} /><button className={`mt-5 ${buttonStyles}`} onClick={() => addLink('movies')}>add</button></div>
        <div><input  value={linkmusica} placeholder={'musica'} onChange={e => setLinkmusica(e.target.value) } name={'linkmusica'} style={textAreaStyles} /><button className={`mt-5 ${buttonStyles}`} onClick={() => addLink('musica')}>add</button></div>
        <div><input  value={linktvshows} placeholder={'tv shows'} onChange={e => setLinkTvShows(e.target.value) } name={'linktvshows'} style={textAreaStyles} /><button className={`mt-5 ${buttonStyles}`} onClick={() => addLink('tvshows')}>add</button></div>
      </div>
      </CardBody>
      <CardFooter className={'justify-evenly'}>
      <div className={'flex flex-col w-full'}>
        <span style={{backgroundColor: '#d2d2d2'}}>Movies:</span>
        {movies.map(torrent => {
            return <div key={torrent.name} style={fieldStyles}>{torrent.name}</div>
          })}
        
      </div>
      <div className={ 'flex flex-col w-full'}>
        <span style={{backgroundColor: '#d2d2d2'}}>Music:</span>
        {musica.map(torrent => {
          return <div key={torrent.name} style={fieldStyles}>{torrent.name}</div>
          })}
        
      </div>
      <div className={'flex flex-col w-full'}>
        <span style={{backgroundColor: '#d2d2d2'}}>TV Shows:</span>
        {tvshows.map(torrent => {
          return <div key={torrent.name} style={fieldStyles}>{torrent.name}</div>
          })}
        
        </div>
      </CardFooter>
     </Card>
  )
};

export default Torrents;

