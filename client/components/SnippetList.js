import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import NewSnippet from './NewSnippet';
import firebase from 'firebase/app';

import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import AceEditor from 'react-ace';

const languages = ['javascript', 'python', 'html', 'css'];
const themes = ['monokai', 'tomorrow', 'xcode', 'solarized_dark'];
languages.forEach((lang) => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});
themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`));

import {
  Modal,
  Backdrop,
  Fade,
  makeStyles,
  Button,
  Grid,
  Box,
  Typography,
  Link,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import LiveTvIcon from '@material-ui/icons/LiveTv';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  editor: {
    maxWidth: '95%',
    maxHeight: 350,
    margin: '0 auto',
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const SnippetList = ({ self }) => {
  const classes = useStyles();
  const { currentUser } = useUser();
  const snippets = useSelector((state) => state.snippets);
  const { userId } = useParams();
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth);
  const author = self ? user : useSelector((state) => state.users)[userId];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (snippetId) => {
    db.collection('snippets').doc(snippetId).delete();
  };

  const handleClick = async (following, id) => {
    let myUpdate = following
      ? firebase.firestore.FieldValue.arrayRemove(id)
      : firebase.firestore.FieldValue.arrayUnion(id);
    let theirUpdate = following
      ? firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
      : firebase.firestore.FieldValue.arrayUnion(currentUser.uid);
    await db.collection('users').doc(currentUser.uid).update({ following: myUpdate });
    await db.collection('users').doc(id).update({ followers: theirUpdate });
  };

  const filteredSnippets = snippets.filter((snippet) => {
    return self ? snippet.userId == currentUser.uid : snippet.userId == userId;
  });

  return (
    <Box mt={3}>
      {self ? (
        <Box mb={2}>
          <Typography variant="h4">My Snippets</Typography>
          <Box py={2}>
            <Button type="button" onClick={handleOpen} variant="contained" color="primary">
              New Snippet
            </Button>
          </Box>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <NewSnippet closeModal={handleClose} />
              </div>
            </Fade>
          </Modal>
        </Box>
      ) : (
        <Box mb={2}>
          <Avatar src={author.profilePicture} className={classes.large} />
          <Typography variant="h4">{`${author.name}'s`} Snippets</Typography>
          <Box mt={1}>
            <Button
              to={`/livestream/${author.id}`}
              component={RouterLink}
              variant="contained"
              color="primary"
              style={{ marginRight: '1rem' }}
              startIcon={<LiveTvIcon />}
            >
              Livestream
            </Button>
            <Button
              onClick={() => handleClick(user.following.includes(author.id), author.id)}
              variant="contained"
              style={{
                backgroundColor: user.following.includes(author.id) ? 'tomato' : 'dodgerblue',
              }}
            >
              {user.following.includes(author.id) ? 'unfollow' : 'follow'}
            </Button>
          </Box>
        </Box>
      )}
      {filteredSnippets.length > 0 && (
        <Grid container spacing={2} justify="center">
          {filteredSnippets.map((snippet) => {
            return (
              <Grid key={snippet.id} item xs={12} sm={6} md={4}>
                <Card className={classes.root}>
                  <CardHeader
                    title={
                      <Link to={`/snippets/${snippet.id}`} component={RouterLink}>
                        <Typography align="center" variant="h5">
                          {snippet.name}
                        </Typography>
                      </Link>
                    }
                    subheader={new Date(snippet.createdAt).toLocaleString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  />
                  <CardContent>
                    <AceEditor
                      mode={snippet.mode}
                      theme={snippet.theme}
                      name={snippet.id}
                      value={snippet.code}
                      fontSize={14}
                      className={classes.editor}
                      setOptions={{
                        useWorker: false,
                        showLineNumbers: true,
                        readOnly: true,
                      }}
                    />
                  </CardContent>
                  {self && (
                    <CardActions disableSpacing>
                      <IconButton
                        type="button"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(snippet.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default SnippetList;
