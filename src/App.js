import React, {useState, useEffect} from 'react';
import fetch from 'cross-fetch'
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import unescape from 'lodash/unescape';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  link: {
    "&:hover": {
      backgroundColor: "green"
    }
  }
}));

function App(props) {
  const classes = useStyles()

  const [subredditState,setSubredditState] = useState(
    []
  );

/*return fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))*/
  const fetchPopularSubreddits = ()=>{
    fetch (`https://www.reddit.com/subreddits/popular.json`)
      .then(response => response.json())
      .then(json => {
        var children = json.data.children
        setSubredditState(children)
      })
  }

  const fetchSubredditPost = (subreddit)=>{
    fetch (`https://www.reddit.com/r/${subreddit}/hot.json`)
      .then(response => response.json())
      .then(json => {
        var children = json.data.children
        setSubredditPostState(children)
      })
  }

  const clickSubredditHandler = (event, value, index)=>{
    //value.data.display_name
    /*var tempSubredditState = subredditState
    tempSubredditState[index].selected = true
    setSubredditState(tempSubredditState)*/
    var tempMiscState = miscState
    tempMiscState.value = value.data.display_name
    tempMiscState.selectedSubredditIndex = index
    setMiscState(tempMiscState)
    fetchSubredditPost(tempMiscState.value)
  }

  const clickSubredditPostHandler = (event, value, index)=>{
    var tempMiscState = {count:miscState.count, value:miscState.value, selectedSubredditIndex:miscState.selectedSubredditIndex,
      selectedSubredditPostIndex:index}
    //tempMiscState.selectedSubredditPostIndex = index
    setMiscState(tempMiscState)
    console.log("clicked on in clickSubredditPostHandler: " + miscState.selectedSubredditPostIndex)
  }

  const [subredditPostState, setSubredditPostState] = useState(
    []
  );

  const [miscState, setMiscState] = useState(
    {count: 0, value: '', selectedSubredditIndex: -1, 
    selectedSubredditPostIndex: -1}
  );

  useEffect(() => {
    //var tempMiscState = miscState
    //tempMiscState.count++
    fetchPopularSubreddits()
    //setMiscState(tempMiscState)
    // Update the document title using the browser API
    //document.title = `You clicked ${miscState.value} times`;
  }, []);

  return (
    <div className={classes.root}>
      <header>
        <h3>Subreddit POC</h3>  
      </header>
    <Paper>
    <Grid container spacing={3}>
      <Grid item xs={4}>
      <Paper className={classes.paper}>
        <h5>Subreddits</h5>
      <table style={{borderCollapse: 'collapse'}}>
        <tbody>
      {subredditState.map((value, index) => {
        return <tr key={index} className={classes.link} 
        style={{backgroundColor: index === miscState.selectedSubredditIndex ? 'grey':'white'}}>
          <td><a href='#' onClick={
            (event) => {
              event.preventDefault()
              clickSubredditHandler(event, value, index)
            }
            }>show</a></td>
          <td>{value.data.display_name}</td>
        </tr>
      })}
      </tbody>
      </table>
      </Paper>
      </Grid>
      <Grid item xs={7}>
        <Grid container spacing={1}>
        <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h5>Subreddit posts for {miscState.value}</h5>
          <table style={{borderCollapse: 'collapse'}}>
            <tbody>
            {subredditPostState.map((value, index) => {
              return <tr key={index} className={classes.link}
                style={{backgroundColor: 
                  index === miscState.selectedSubredditPostIndex 
                  ? 'grey':'white'}}>
                <td><a href='#' onClick={
                  (event) => {
                    event.preventDefault()
                    clickSubredditPostHandler(event, value, index)
                  }
                }>show</a></td>
                <td>{value.data.title}</td>
              </tr>
            })}
            </tbody>
          </table>  
        </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            {miscState.selectedSubredditPostIndex >= 0 &&
            <React.Fragment>
              <h5>Details for subreddit post</h5>
              <ul style={{listStyleType:'none'}}>
                <li>selected post index: {miscState.selectedSubredditPostIndex}</li>
                {/*
                post title, author, image/preview if there is any, 
                text if there is any
                */}
                <li>post title: {subredditPostState[miscState.selectedSubredditPostIndex].data.title}</li>
                <li>author: {subredditPostState[miscState.selectedSubredditPostIndex].data.author_fullname}</li>
                <li>image/preview: {
                  typeof subredditPostState[miscState.selectedSubredditPostIndex].data.preview !== 'undefined'
                  ?
                  <img src={unescape(subredditPostState[miscState.selectedSubredditPostIndex].data.preview.images[0].resolutions[0].url)}/>
                  :
                  ''
                }</li>
                <li>text: {
                  typeof subredditPostState[miscState.selectedSubredditPostIndex].data.selftext_html !== 'undefined'
                  ?
                  subredditPostState[miscState.selectedSubredditPostIndex].data.selftext_html
                  :
                  ''  
                }</li>
              </ul>
              </React.Fragment>
            }
            {miscState.selectedSubredditPostIndex < 0 &&
              <ul style={{listStyleType:'none'}}>
                <li>no post selected</li>
              </ul>
            }
          </Paper>
        </Grid>
        </Grid>
      </Grid>
    </Grid>
    </Paper>
    </div>
  );
}

export default App;
