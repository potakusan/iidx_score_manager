import React from "react";
import { alternativeImg, arenaRankColor, bgColorByBPI } from "@/components/common";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import { updatedTime } from "@/components/common/timeFormatter";
import { getAltTwitterIcon } from "@/components/rivals";
import { _currentStore } from "@/components/settings";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";


export default class UserCard extends React.Component<{
  item:any,
  open:(q:string)=>void,
  processing:boolean,
  isAdded:boolean,
  myId?:string,
  addUser:(q:any)=>void,
  hideBottomButtons?:boolean
},{}>{

  render(){
    const {item,isAdded,myId} = this.props;
    return (
    <React.Fragment>
      <ListItem button alignItems="flex-start" onClick={()=>this.props.open(item.displayName)}>
        <ListItemAvatar>
          <Avatar onClick={()=>this.props.open(item.displayName)}>
            <img src={item.photoURL ? item.photoURL : "noimg"} style={{width:"100%",height:"100%"}}
              alt={item.displayName}
              onError={(e)=>(e.target as HTMLImageElement).src = getAltTwitterIcon(item,false,"normal") || alternativeImg(item.displayName)}/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<React.Fragment>{item.displayName}&nbsp;<small>{updatedTime(item.serverTime.toDate())}</small></React.Fragment>}
          secondary={<React.Fragment>
            <span>
              <Tooltip title={"アリーナランク"}>
                <Chip size="small" style={{backgroundColor:arenaRankColor(item.arenaRank),color:"#fff",margin:"5px 0"}} label={item.arenaRank || "-"} />
              </Tooltip>
              {item.totalBPI && (
                <Tooltip title={"総合BPI"}>
                  <Chip size="small" style={{backgroundColor:bgColorByBPI(item.totalBPI),color:"#fff",margin:"0 0 0 5px"}} label={item.totalBPIs ? item.totalBPIs[_currentStore()] : item.totalBPI} />
                </Tooltip>
              )}
            </span>
            {item.profile && <p style={{margin:"0"}}> {item.profile}</p>}
          </React.Fragment>}
        />
        <ListItemSecondaryAction>
          <Tooltip title={isAdded ? "すでにライバルです" : "ライバル登録"}>
            <IconButton edge="end" disabled={isAdded} onClick={()=>!isAdded && this.props.addUser(item)}>
              {(myId !== item.uid && !isAdded) ? <AddIcon/> : <CheckIcon/>}
            </IconButton>
          </Tooltip >
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
    )
  }
}
