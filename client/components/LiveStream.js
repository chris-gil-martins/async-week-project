import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import Video from './Video';

import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import AceEditor from 'react-ace';

require(`ace-builds/src-noconflict/mode-javascript`);
require(`ace-builds/src-noconflict/snippets/javascript`);
require(`ace-builds/src-noconflict/theme-monokai`);

import { Grid, Box, TextField, IconButton, makeStyles, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  commentBox: {
    border: '1px solid black',
    flex: 1,
    padding: 10,
  },
}));

function LiveStream() {
  const { userId } = useParams();
  const { currentUser } = useUser();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');

  const socket = useSocket();

  const classes = useStyles();

  useEffect(() => {
    if (!socket) return;

    if (userId === currentUser.uid) {
      socket.emit('joinHost', userId);
    } else {
      socket.emit('joinGuest', userId);
    }

    socket.on('newMessage', (message) => {
      setChat((prevChat) => [message, ...prevChat]);
    });

    socket.on('codeUpdate', (code) => {
      setCode(code);
    });

    return () => socket.removeAllListeners();
  }, [socket]);

  const sendMessage = () => {
    setChat((prevChat) => [{ name: currentUser.displayName, message }, ...prevChat]);
    socket.emit('sendMessage', { name: currentUser.displayName, message, streamer: userId });
  };

  const updateCode = (newVal) => {
    setCode(newVal);
    socket.emit('codeUpdate', { newVal, streamer: userId });
  };

  return (
    <Box my={3}>
      <Grid container justify="space-between">
        <Grid item xs={12} md={6} container direction="column" style={{ height: 1000, width: 500 }}>
          <Grid
            item
            style={{ height: '50%', width: '100%' }}
            container
            justify="center"
            alignItems="center"
          >
            <Video streamerId={userId} userId={currentUser.uid} />
          </Grid>
          <Grid item style={{ height: '50%', width: '100%' }} container direction="column-reverse">
            <TextField
              id="message"
              name="message"
              variant="outlined"
              fullWidth
              value={message}
              onChange={(evt) => setMessage(evt.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={sendMessage}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
            <Box className={classes.commentBox}>
              <Grid container direction="column-reverse" style={{ height: '100%' }}>
                {chat.map((message, index) => (
                  <Box key={index}>
                    <Typography>{`${message.name}: ${message.message}`}</Typography>
                  </Box>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} style={{ height: 1000, width: 500 }} container justify="center">
          <AceEditor
            mode="javascript"
            theme="monokai"
            name={name}
            value={code}
            fontSize={14}
            height="1000px"
            width="500px"
            minLines={10}
            setOptions={{
              useWorker: false,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              showLineNumbers: true,
              readOnly: userId !== currentUser.uid,
            }}
            onChange={updateCode}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LiveStream;
