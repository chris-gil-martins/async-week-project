import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import firebase from 'firebase/app';
import { db } from '../firebase';

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
  Grid,
  Typography,
  Link,
  Box,
  Card,
  IconButton,
  CardHeader,
  CardContent,
  CardActions,
  makeStyles,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles(() => ({
  profilePicture: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: 'white',
  },
  editor: {
    maxWidth: '95%',
    maxHeight: 350,
    margin: '1rem auto 0',
  },
}));

function Feed() {
  const snippets = useSelector((state) => state.snippets);
  const user = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users);

  const classes = useStyles();

  const filteredSnippets = snippets.filter((snippet) => {
    return user.following.includes(snippet.userId);
  });

  const toggleLike = async (isLiked, snippetId) => {
    let update = isLiked
      ? firebase.firestore.FieldValue.arrayRemove(user.id)
      : firebase.firestore.FieldValue.arrayUnion(user.id);
    await db.collection('snippets').doc(snippetId).update({ likedBy: update });
  };

  return (
    <Box mt={3}>
      <Typography align="center" variant="h4">
        Your Feed
      </Typography>
      <Box mt={2}>
        {filteredSnippets.length > 0 && (
          <Grid container spacing={2} justify="center">
            {filteredSnippets.map((snippet) => {
              const matchUser = users[snippet.userId];
              const isLiked = snippet.likedBy.includes(user.id);

              return (
                <Grid key={snippet.id} item xs={12} sm={6} md={4}>
                  <Card className={classes.root}>
                    <CardHeader
                      avatar={
                        <IconButton color="inherit">
                          <img src={matchUser.profilePicture} className={classes.profilePicture} />
                        </IconButton>
                      }
                      title={
                        <Link to={`/users/${matchUser.id}`} component={RouterLink}>
                          <Typography>{matchUser.name}</Typography>
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
                      <Link to={`/snippets/${snippet.id}`} component={RouterLink}>
                        <Typography align="center" variant="h5">
                          {snippet.name}
                        </Typography>
                      </Link>
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
                    <CardActions disableSpacing>
                      <IconButton
                        style={{ color: isLiked ? '#ff4a7d' : 'white' }}
                        onClick={() => toggleLike(isLiked, snippet.id)}
                      >
                        <FavoriteIcon stroke={'black'} strokeWidth={1} />
                      </IconButton>
                      <span>{snippet.likedBy.length}</span>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default Feed;
