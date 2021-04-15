import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { db } from '../firebase';
import { setSnippets } from '../redux/reducers/snippets';
import { useSelector, useDispatch } from 'react-redux';
import NewSnippet from './NewSnippet';

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
} from '@material-ui/core';

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
}));

const SnippetList = ({ self }) => {
  const classes = useStyles();
  const { currentUser } = useContext(UserContext);
  const snippets = useSelector((state) => state.snippets);
  const dispatch = useDispatch();
  const { userId } = useParams();

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
  }, [currentUser, userId]);

  useEffect(() => {
    return db
      .collection('snippets')
      .where('userId', '==', self ? currentUser.uid : userId)
      .onSnapshot((snapshot) => {
        dispatch(setSnippets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
        setLoading(false);
      });
  }, [currentUser, userId]);

  const handleDelete = (snippetId) => {
    db.collection('snippets').doc(snippetId).delete();
  };

  return (
    <React.Fragment>
      {self && (
        <div>
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
        </div>
      )}
      {!loading && (
        <Grid container spacing={2} justify="center">
          {snippets.map((snippet) => {
            return (
              <Grid
                key={snippet.id}
                item
                xs={12}
                sm={6}
                md={4}
                container
                direction="column"
                alignItems="center"
              >
                <Typography>{snippet.name}</Typography>
                <AceEditor
                  mode={snippet.mode}
                  theme={snippet.theme}
                  name={snippet.id}
                  value={snippet.code}
                  fontSize={14}
                  style={{ flexGrow: 1, maxWidth: '100%', maxHeight: 350 }}
                  setOptions={{
                    useWorker: false,
                    showLineNumbers: true,
                    readOnly: true,
                  }}
                />
                {self && (
                  <Box pt={2}>
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(snippet.id)}
                    >
                      Delete Snippet
                    </Button>
                  </Box>
                )}
              </Grid>
            );
          })}
        </Grid>
      )}
    </React.Fragment>
  );
};

export default SnippetList;
