import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
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

import { Grid, TextField, Button, MenuItem } from '@material-ui/core';

const NewSnippet = ({ closeModal }) => {
  const [mode, setMode] = useState('javascript');
  const [theme, setTheme] = useState('monokai');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  const { currentUser } = useContext(UserContext);

  const handleSubmit = () => {
    db.collection('snippets').add({
      userId: currentUser.uid,
      name,
      description,
      code,
      mode,
      theme,
    });
    closeModal();
  };

  return (
    <Grid container justify="center" align="center" spacing={2}>
      <Grid item xs={12} sm={6} container spacing={2} justify="center">
        <Grid item xs={12} sm={6}>
          <TextField
            select
            id="mode"
            name="mode"
            label="Mode"
            variant="outlined"
            fullWidth
            value={mode}
            onChange={(evt) => setMode(evt.target.value)}
          >
            <MenuItem value="javascript">Javascript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="html">HTML</MenuItem>
            <MenuItem value="css">CSS</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            id="theme"
            name="theme"
            label="Theme"
            variant="outlined"
            fullWidth
            value={theme}
            onChange={(evt) => setTheme(evt.target.value)}
          >
            <MenuItem value="monokai">Monokai</MenuItem>
            <MenuItem value="tomorrow">Tomorrow</MenuItem>
            <MenuItem value="xcode">xCode</MenuItem>
            <MenuItem value="solarized_dark">Solarized Dark</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(evt) => setName(evt.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="description"
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            rowsMax={Infinity}
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
          />
        </Grid>
        <Button type="submit" variant="contained" fullWidth onClick={handleSubmit}>
          Add Snippet
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <AceEditor
          mode={mode}
          theme={theme}
          name={name}
          value={code}
          fontSize={14}
          height="auto"
          minLines={10}
          setOptions={{
            useWorker: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
          }}
          style={{ minHeight: 500 }}
          onChange={(newVal) => setCode(newVal)}
        />
      </Grid>
    </Grid>
  );
};

export default NewSnippet;
