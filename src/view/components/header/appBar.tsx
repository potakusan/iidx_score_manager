import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Hidden from '@material-ui/core/Hidden';
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {Link as RefLink, Collapse, Avatar, Chip} from '@material-ui/core/';
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import SettingsIcon from "@material-ui/icons/Settings";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import BorderColorIcon from '@material-ui/icons/BorderColor';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import HelpIcon from '@material-ui/icons/Help';
import { FormattedMessage } from "react-intl";
import PeopleIcon from '@material-ui/icons/People';
import Slide from "@material-ui/core/Slide";
import ShowSnackBar from "../snackBar";
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import { withStyles } from '@material-ui/core/styles';
import { config } from "@/config";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import LanguageIcon from '@material-ui/icons/Language';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import { getAltTwitterIcon } from "@/components/rivals";
import { alternativeImg } from "@/components/common";
import fbActions from "@/components/firebase/actions";
import {ReactComponent as Logo} from "@/assets/aix2f-q5h7x.svg";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { _currentVersion } from "@/components/settings";
import CameraAltIcon from '@material-ui/icons/CameraAlt';

interface navBars {
  to:string,
  id:string,
  icon:JSX.Element
}

const drawerWidth = 231;
const styles = (theme:any) => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX:"hidden" as "hidden",
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(7),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});


function HideOnScroll(props:HideOnScrollProps) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

interface HideOnScrollProps {
  children?: React.ReactElement,
  window?: () => Window,
};

class GlobalHeader extends React.Component<{global:any,classes:any,theme:any,children:any} & HideOnScrollProps&RouteComponentProps,{
  isOpen:boolean,
  isOpenSongs:boolean,
  isOpenMyStat:boolean,
  isOpenSocial:boolean,
  errorSnack:boolean,
  user:any,
}>{

  constructor(props:{global:any,classes:any,theme:any,children:any} & HideOnScrollProps&RouteComponentProps){
    super(props);
    this.state = {
      isOpen:false,
      isOpenSongs:true,
      isOpenMyStat: false,
      isOpenSocial: false,
      errorSnack:false,
      user:null,
    }
  }

  async componentDidMount(){
    this.userData();
  }

  componentDidUpdate(prevProps:any) {
    if (
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      window.scrollTo(0, 0);
    }
  }

  userData = async ()=>{
    if(localStorage.getItem("social")){
      try{
        return this.setState({user:JSON.parse(localStorage.getItem("social") || "[]")});
      }catch(e){
        return this.setState({user:null});
      }
    }else{
        return new fbActions().auth().onAuthStateChanged(async(user: any)=> {
          if(!user){return this.setState({user:null})}
          const u = await new fbActions().setDocName(user.uid).getSelfUserData();
          if(u.exists){
            localStorage.setItem("social",JSON.stringify(u.data()))
          }
          return this.setState({user:u.data()});
        });
    }
  }

  toggleNav = ()=> this.setState({isOpen:!this.state.isOpen});
  handleClickStats = ()=> this.setState({isOpenMyStat:!this.state.isOpenMyStat});
  handleClickSongs = ()=>this.setState({isOpenSongs:!this.state.isOpenSongs});
  handleClickSocial = ()=>this.setState({isOpenSocial:!this.state.isOpenSocial});
  toggleErrorSnack = ()=> this.setState({errorSnack:!this.state.errorSnack});

  render(){
    const {isOpen,isOpenSongs,isOpenMyStat,isOpenSocial,user} = this.state;
    const page = this.props.location.pathname.split("/");
    const currentPage = ()=>{
      switch(page[1]){
        default:
        return "Top.Title";
        case "data":
        return "GlobalNav.Data";
        case "lists":
        return "GlobalNav.FavoriteSongs";
        case "songs":
        return "GlobalNav.SongList";
        case "notPlayed":
        return "GlobalNav.unregisteredSongs";
        case "compare":
        return "GlobalNav.compare";
        case "stats":
        return "GlobalNav.Statistics";
        case "rivals":
        return "GlobalNav.Rivals";
        case "rivalCompare":
        return "GlobalNav.RivalCompare";
        case "sync":
        return "GlobalNav.Sync";
        case "AAATable":
        return "GlobalNav.AAATable";
        case "tools":
        return "GlobalNav.Tools";
        case "settings":
        return "GlobalNav.Settings";
        case "help":
        return "GlobalNav.Help";
        case "notes":
        return "GlobalNav.Notes";
        case "ranking":
        return "GlobalNav.Weekly";
        case "u":
        return page[2];
        case "share":
        return "BPIManager"
      }
    }
    const songs:navBars[] = [
      {
        to:"/lists",
        id:"GlobalNav.FavoriteSongs",
        icon:<BookmarkIcon />
      },
      {
        to:"/songs",
        id:"GlobalNav.SongList",
        icon:<LibraryMusicIcon />
      },
      {
        to:"/notPlayed",
        id:"GlobalNav.unregisteredSongs",
        icon:<BorderColorIcon />
      },
    ];
    const myStat:navBars[] = [
      {
        to:"/compare",
        id:"GlobalNav.compare",
        icon:<FilterNoneIcon />
      },
      {
        to:"/stats",
        id:"GlobalNav.Statistics",
        icon:<TrendingUpIcon />
      },
      {
        to:"/AAATable",
        id:"GlobalNav.AAATable",
        icon:<WbIncandescentIcon />
      }
    ]
    const social:navBars[] = [
      {
        to:"/rivals",
        id:"GlobalNav.Rivals",
        icon:<PeopleIcon />
      },
      {
        to:"/rivalCompare",
        id:"GlobalNav.RivalCompare",
        icon:<ThumbsUpDownIcon />
      },
      {
        to:"/notes",
        id:"GlobalNav.Notes",
        icon:<SpeakerNotesIcon />
      },
      {
        to:"/ranking/",
        id:"GlobalNav.Weekly",
        icon:<EventNoteIcon />
      }
    ]
    const navBarTop:navBars[] = [
      {
        to:"/camera",
        id:"GlobalNav.Camera",
        icon:<CameraAltIcon/>
      },
      {
        to:"/data",
        id:"GlobalNav.Data",
        icon:<SaveAltIcon />
      },
    ]
    const navBarBottom:navBars[] = [
      {
        to:"/settings",
        id:"GlobalNav.Settings",
        icon:<SettingsIcon />
      },
      {
        to:"/help",
        id:"GlobalNav.Help",
        icon:<HelpIcon />
      }
    ]
    const { classes,history } = this.props;
    const drawer = (isPerment:boolean)=>(
      <React.Fragment>
        <div style={{margin:"8px 0",padding:"0 8px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <Logo onClick={()=>{history.push("/");if(!isPerment){this.toggleNav()}}} style={{width:"44px",height:"44px"}}/>
            {user && (
              <Chip
                avatar={(
                  <Avatar style={{width:"32px",height:"32px"}}>
                    <img src={user.photoURL ? user.photoURL.replace("_normal","") : "noimage"} style={{width:"100%",height:"100%"}}
                      alt={user.displayName || "Unpublished User"}
                      onError={(e)=>(e.target as HTMLImageElement).src = getAltTwitterIcon(user) || alternativeImg(user.displayName)}/>
                  </Avatar>
                )}
                onClick={()=>{history.push("/sync/settings");if(!isPerment){this.toggleNav()}}}
                label={"Sync"}
                clickable
                color="primary"
              />
            )}
            {!user && (
              <Chip
                avatar={(
                  <Avatar style={{width:"32px",height:"32px"}}>
                    <LockOpenIcon/>
                  </Avatar>
                )}
                onClick={()=>{history.push("/sync/settings");if(!isPerment){this.toggleNav()}}}
                label={"ログイン"}
                clickable
                color="primary"
              />
            )}
          </div>
        </div>
        <Divider />
        {navBarTop.map(item=>(
          <ListItem key={item.id} onClick={()=>{history.push(item.to);if(!isPerment){this.toggleNav()}}} button>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id={item.id}/>} />
          </ListItem>
        ))}
        <InnerList child={songs} handleClick={this.handleClickSongs} classes={classes} history={history} toggleNav={this.toggleNav} isPerment={isPerment}
          parent={{id:"GlobalNav.Parent.Songs",icon:<QueueMusicIcon />}} isOpen={isOpenSongs}/>
        <InnerList child={myStat} handleClick={this.handleClickStats} classes={classes} history={history} toggleNav={this.toggleNav} isPerment={isPerment}
          parent={{id:"GlobalNav.Parent.Stats",icon:<SportsEsportsIcon />}} isOpen={isOpenMyStat}/>
        <InnerList child={social} handleClick={this.handleClickSocial} classes={classes} history={history} toggleNav={this.toggleNav} isPerment={isPerment}
          parent={{id:"GlobalNav.Parent.Social",icon:<LanguageIcon />}} isOpen={isOpenSocial}/>
        <Divider />
        {navBarBottom.map(item=>(
          <ListItem key={item.id} onClick={()=>{history.push(item.to);if(!isPerment){this.toggleNav()}}} button>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id={item.id}/>} />
          </ListItem>
        ))}
        <Divider />
        <Typography align="center" variant="caption" style={{margin:"8px 0",width:"100%",display:"block",paddingBottom:"15px"}}>
          {config.versionString}&nbsp;
          {config.lastUpdate}<br/>
          <RefLink color="secondary" href="https://twitter.com/BPIManager">@BPIManager</RefLink><br/>
          <RefLink color="secondary" href="https://forms.gle/yVCa8sP2ndEQNaxg8">アンケートにご協力下さい </RefLink>
        </Typography>
      </React.Fragment>
    );

    return (
      <div className={classes.root}>
        <HideOnScroll {...this.props}>
          <AppBar className={window.location.href.split('/').pop() === "" ? "appBarIndex " + classes.appBar : classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu"
                className={classes.menuButton} onClick={()=>{
                if(!this.props.global.state.cannotMove){
                  return this.toggleNav();
                }else{
                  return this.toggleErrorSnack();
                }
              }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                {(page.length === 2 || page[1] === "lists" || page[1] === "notes" || page[1] === "help" || page[1] === "sync" || page[1] === "ranking") && <FormattedMessage id={currentPage()}/>}
                {(page.length > 2 && page[1] !== "lists" && page[1] !== "notes" && page[1] !== "help" && page[1] !== "sync" && page[1] !== "ranking") && currentPage()}
              </Typography>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer open={isOpen} onClose={this.toggleNav}
              classes={{
                paper: classes.drawerPaper,
            }}>
            {drawer(false)}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer(true)}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content} style={{width:"100%",marginBottom:"15px"}}>
          {this.props.children}
        </main>
        <div style={{position:"fixed",bottom:"0",zIndex:1000,textAlign:"center",padding:"5px 0",background:"#000",color:"#fff",width:"100%",fontSize:"9px"}}>
          {user && user.displayName}&nbsp;
          {(user && user.twitter) && <span>(@{user.twitter})</span>}&nbsp;
          定義:v{_currentVersion()}
        </div>
        <ShowSnackBar message={"実行中の処理があるため続行できません"} variant="warning"
            handleClose={this.toggleErrorSnack} open={this.state.errorSnack} autoHideDuration={3000}/>
      </div>
    );
  }

}

export default withRouter(withStyles(styles, { withTheme: true })(GlobalHeader));

class InnerList extends React.Component<{
  parent:{
    id:string,
    icon:JSX.Element
  },
  child:navBars[],
  handleClick:()=>void,
  isOpen:boolean,
  history:any,
  classes:any,
  toggleNav:()=>void,
  isPerment:boolean,
},{}>{

  render(){
    const {child,handleClick,isOpen,history,classes,parent,toggleNav,isPerment} = this.props;
    return (
      <List style={{width:"230px"}} disablePadding key={parent.id}>
        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            {parent.icon}
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id={parent.id}/>} />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {child.map(item=>(
              <ListItem onClick={()=>{history.push(item.to);if(!isPerment){toggleNav()}}} key={item.id} button className={classes.nested}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={<FormattedMessage id={item.id}/>} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    );
  }
}
