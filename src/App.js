import React, {useState, useEffect} from 'react';
import fetch from 'cross-fetch'
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import unescape from 'lodash/unescape';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
//import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
//import CheckBoxIcon from '@material-ui/icons/CheckBox';

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

  const fetchSubredditPost = (subreddit, hotOrNew)=>{
    //https://www.reddit.com/r/politics/new.json
    console.log("fetchSubredditPost: " + hotOrNew);
    fetch (`https://www.reddit.com/r/${subreddit}/`
    +(typeof hotOrNew !== 'undefined' && hotOrNew?
      hotOrNew
      :hotOrNewState.value?'hot':'new')+`.json`)
      .then(response => response.json())
      .then(json => {
        var children = json.data.children
        setSubredditPostState(children)
      })
  }

  const fetchPopularSubredditsSearch = ()=>{
    fetch (`https://www.reddit.com/subreddits/search.json?q=` + searchState.value)
      .then(response => response.json())
      .then(json => {
        var children = json.data.children
        setSubredditState(children)
      })
  }

  const subRedditChangeValue = (event)=>{
    setSearchState({value: event.currentTarget.value})
    console.log("subRedditChangeValue: " + event.currentTarget.value);
    if (typeof searchState.value === 'undefined' || searchState.value.length === 0)
      fetchPopularSubreddits()
  }

  const subRedditChangeSubmit = (event)=>{
    console.log("subRedditChangeSubmit: " + searchState.value);
    if (typeof searchState.value === 'undefined' || searchState.value.length === 0)
      fetchPopularSubreddits()
    else
      fetchPopularSubredditsSearch()
  }

  const handleHotOrNewChange = (event)=>{
    console.log("handleHotOrNewChange: " + event.target.checked);
    let hotOrNewHelper = !hotOrNewState.value
    console.log("before: " + hotOrNewHelper)
    
    setHotOrNewState({value: hotOrNewHelper})
    console.log("after: " + hotOrNewHelper)
    if (typeof miscState.value !== 'undefined' && miscState.value.length > 0)
      fetchSubredditPost(miscState.value, hotOrNewHelper?'hot':'new')
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

  const [searchState, setSearchState] = useState(
    {value: ''}
  );

  const [hotOrNewState, setHotOrNewState] = useState(
    {value: true}
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
        <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subreddit POC</h3>  
      </header>
    <Paper>
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Paper>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<TextField id="standard-search" label="Search field" 
          onChange={subRedditChangeValue} value={searchState.value} type="search" />
          <Button variant="contained" color="primary" onClick={subRedditChangeSubmit}>
            Search
          </Button>
        </Paper>
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
          <Paper>
          <Checkbox
            checked={hotOrNewState.value}
            onChange={handleHotOrNewChange}
            name='Hot\New'
            indeterminate
          />{hotOrNewState.value?"Hot":"New"}
          </Paper>
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
