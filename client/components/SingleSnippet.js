import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link as RouterLink } from 'react-router-dom';
import firebase from 'firebase/app';
import { db } from '../firebase';

import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import AceEditor from 'react-ace';

import {
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  makeStyles,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SendIcon from '@material-ui/icons/Send';

const languages = ['javascript', 'python', 'html', 'css'];
const themes = ['monokai', 'tomorrow', 'xcode', 'solarized_dark'];
languages.forEach((lang) => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});
themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`));

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    display: 'inline-block',
    marginRight: '1rem',
  },
  commentBox: {
    border: '1px solid black',
    flex: 1,
    padding: 10,
  },
  comment: {
    border: '1px solid black',
  },
}));

function SingleSnippet() {
  const snippets = useSelector((state) => state.snippets);
  const users = useSelector((state) => state.users);
  const user = useSelector((state) => state.auth);
  const { snippetId } = useParams();
  const [comment, setComment] = useState('');

  const singleSnippet = snippets.find((snippet) => snippet.id === snippetId);
  const isOwner = singleSnippet.userId === user.id;
  const author = isOwner ? user : users[singleSnippet.userId];

  const isLiked = singleSnippet.likedBy.includes(user.id);
  const classes = useStyles();

  const toggleLike = async () => {
    let update = isLiked
      ? firebase.firestore.FieldValue.arrayRemove(user.id)
      : firebase.firestore.FieldValue.arrayUnion(user.id);
    await db.collection('snippets').doc(snippetId).update({ likedBy: update });
  };

  const postComment = async () => {
    let update = firebase.firestore.FieldValue.arrayUnion({ userId: user.id, comment });
    setComment('');
    await db.collection('snippets').doc(snippetId).update({ comments: update });
  };

  return (
    <Box mt={3}>
      <Grid container justify="center">
        <Grid item xs={12} md={6} container direction="column">
          {!isOwner && (
            <>
              <Link to={`/users/${author.id}`} component={RouterLink}>
                <Avatar src={author.profilePicture} className={classes.large} />
                <Typography variant="h5" style={{ display: 'inline-block' }}>
                  {author.name}
                </Typography>
              </Link>
            </>
          )}
          <AceEditor
            mode={singleSnippet.mode}
            theme={singleSnippet.theme}
            name={singleSnippet.id}
            value={singleSnippet.code}
            fontSize={14}
            style={{ flexGrow: 1, maxWidth: '100%', maxHeight: 350 }}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              readOnly: true,
            }}
          />
          <Box>
            <Typography variant="h5">{singleSnippet.name}</Typography>
            <Typography>{singleSnippet.description}</Typography>
            <IconButton style={{ color: isLiked ? '#ff4a7d' : 'white' }} onClick={toggleLike}>
              <FavoriteIcon stroke={'black'} strokeWidth={1} />
            </IconButton>
            <span>{singleSnippet.likedBy.length}</span>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} container direction="column-reverse">
          <Box>
            <TextField
              id="comment"
              name="comment"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              rowsMax={Infinity}
              value={comment}
              onChange={(evt) => setComment(evt.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={postComment}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box className={classes.commentBox}>
            {singleSnippet.comments.map((comment, index) => (
              <Box key={index}>
                <Typography>
                  <strong>
                    {comment.userId === user.id ? 'You' : users[comment.userId].name}:
                  </strong>{' '}
                  {comment.comment}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SingleSnippet;
