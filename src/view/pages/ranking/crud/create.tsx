import * as React from 'react';
import { _currentTheme, _currentStore } from '@/components/settings';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from "@material-ui/icons/Close";
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert/Alert';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import MomentUtils from '@date-io/dayjs';
import Link from '@material-ui/core/Link';
import {Link as RLink} from "react-router-dom";
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers';
import { toMoment, toMomentHHMM, d_add, isBeforeSpecificDate, toDate } from '@/components/common/timeFormatter';
import Button from '@material-ui/core/Button';
import { songData } from '@/types/data';
import SongSearchDialog from './songSearch';
import { _prefixFromNum } from '@/components/songs/filter';
import CreateIcon from '@material-ui/icons/Create';
import UpdateIcon from '@material-ui/icons/Update';
import Loader from '@/view/components/common/loader';
import { functions } from '@/components/firebase';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { config } from '@/config';

export default class CreateModal extends React.Component<{
  isOpen:boolean,
  handleOpen:(isCreating:boolean)=>void,
},{
  rankingName:string,
  startDate:string,
  endDate:string,
  info:string,
  song:songData|null,
  isDialogOpen:boolean,

  display:number,
  isCreating:boolean,
  result:any,
  rankId:string
}>{

  constructor(props:any){
    super(props);
    this.state = {
      rankingName:"",
      startDate:toMoment(new Date()),
      endDate:toMoment(d_add(7,"day")),
      song:null,
      info:"",
      isDialogOpen:false,
      display:0,
      isCreating:false,
      result:null,
      rankId:"",
    }
  }

  handleStartDateInput = (date:any) => {
    this.setState({startDate:toMomentHHMM(date || new Date())});
  };

  handleEndDateInput = (date:any) => {
    this.setState({endDate:toMomentHHMM(date || new Date())});
  };

  dialogToggle = ()=> this.setState({isDialogOpen:!this.state.isDialogOpen});
  decide = (input:songData)=> {
    this.setState({
      song:input,
      isDialogOpen:false
    });
  }

  changeView = (newState:number)=>{
    window.scrollTo(0, 0);
    this.setState({
      display: newState
    })
  }

  create = async()=>{
    const {startDate,endDate,rankingName,song,info} = this.state;
    this.setState({isCreating:true,display:2});
    let data = {
      start:toDate(startDate),
      end:toDate(endDate),
      title:rankingName,
      song:song,
      info:info,
      version:_currentStore(),
    };
    const p = await functions.httpsCallable("createRanking")(data);
    if(p.data.error){
      alert(p.data.errorMessage);
    }
    this.setState({isCreating:false,display:3,result:p,rankId:p.data.rankId || ""})
  }

  render(){
    const c = _currentTheme();
    const {isOpen,handleOpen} = this.props;
    const {startDate,endDate,rankingName,song,info,isDialogOpen,display,isCreating} = this.state;
    const isDisabled = ()=>{
      if(!rankingName){
        return true;
      }
      if(!song){
        return true;
      }
      if(isBeforeSpecificDate(endDate,startDate)){
        return true;
      }
      if(isBeforeSpecificDate(endDate,new Date())){
        return true;
      }
      return false;
    }

    const titleError = rankingName.length > 16;

    const form = (readOnly:boolean = false)=>{
      return (
      <form noValidate autoComplete="off">
      <TextField
        required
        error={titleError}
        label="ランキングの名称"
        variant="outlined"
        fullWidth
        value={rankingName}
        onChange={(e)=>readOnly ? ()=>null : this.setState({rankingName:e.target.value})}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: readOnly,
        }}
        disabled={readOnly}
        helperText={titleError ? "タイトルが長すぎます" : ""}
      />
      <div style={{margin:"20px 0"}}/>
      <TextField
        fullWidth
        required
        label="対象楽曲"
        onClick={readOnly ? ()=>null : this.dialogToggle}
        value={song ? song.title + _prefixFromNum(song.difficulty) + ` / ☆${song.difficultyLevel}` : ""}
        placeholder="タップして選択"
        variant="outlined"
        disabled={readOnly}
        InputProps={{
          readOnly: true,
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <div style={{margin:"20px 0"}}/>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimePicker
          ampm={false}
          margin="normal"
          label="開始日付"
          format="YYYY/MM/DD HH:mm"
          value={startDate}
          fullWidth
          inputVariant="outlined"
          disabled={readOnly}
          onChange={readOnly ? ()=>null : this.handleStartDateInput}
        />
        <div style={{margin:"20px 0"}}/>
        <DateTimePicker
          ampm={false}
          margin="normal"
          label="終了日付"
          format="YYYY/MM/DD HH:mm"
          disablePast
          inputVariant="outlined"
          fullWidth
          value={endDate}
          disabled={readOnly}
          onChange={readOnly ? ()=>null : this.handleEndDateInput}
        />
      </MuiPickersUtilsProvider>
      <div style={{margin:"20px 0"}}/>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="ランキングの概要(オプション)"
        variant="outlined"
        placeholder=""
        value={info}
        disabled={readOnly}
        onChange={(e)=>readOnly ? ()=>null : this.setState({info:e.target.value})}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          readOnly: readOnly,
        }}
      />
      </form>
      )
    }
    const errors = ()=>{
      const res = [];
      if(isBeforeSpecificDate(endDate,startDate)){
        res.push("開始日より前の日付が終了日として指定されています");
      }
      if(isBeforeSpecificDate(endDate,new Date())){
        res.push("終了日は本日の日付より未来である必要があります");
      }
      return res;
    }

    return (
      <Dialog
        id="detailedScreen"
        className={c === "dark" ? "darkDetailedScreen" : c === "light" ? "lightDetailedScreen" : "deepSeaDetailedScreen"}
        fullScreen open={isOpen} onClose={()=>handleOpen(isCreating)} style={{overflowX:"hidden",width:"100%"}}>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={()=>handleOpen(isCreating)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className="be-ellipsis" style={{flexGrow:1}}>
              ランキングを作成
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar/>
        <Container className="commonLayout">

          {display === 3 && (
            <div>
              <Alert severity="success" icon={<AssignmentTurnedInIcon/>}>
                <AlertTitle>ランキングが作成されました</AlertTitle>
                <p><RLink to={"/ranking/id/" + this.state.rankId} style={{textDecoration:"none"}}><Link color="secondary" component="span">こちらをクリックしてランキングを表示します</Link></RLink>。または以下のボタンをクリックし、作成したランキングを友達に共有することができます。</p>
              </Alert>
              <Button color="secondary" fullWidth variant="outlined" size="large"
                onClick={()=>window.open(`http://twitter.com/share?url=${config.baseUrl}/ranking/id/${this.state.rankId}&hashtags=BPIM&related=BPIManager`)}>
                Twitterで共有
              </Button>
            </div>
          )}

          {display === 2 && (
            <Loader text="ランキングを作成しています"/>
          )}

          {display === 1 && (
            <div>
            <Alert icon={false} severity="success">
              以下の設定でランキングを作成します。<br/>
              よろしい場合は「作成」ボタンを、修正がある場合は「戻る」ボタンをタップしてください。
            </Alert>
            <Divider style={{margin:"20px 0"}}/>
            {form(true)}
            <Divider style={{margin:"20px 0"}}/>
            <Button
              startIcon={<UpdateIcon/>} color="secondary" fullWidth variant="outlined" size="large" onClick={()=>this.changeView(0)}>
              戻る
            </Button>
            <Button style={{margin:"10px 0"}}
              startIcon={<CreateIcon />} color="secondary" fullWidth variant="contained" size="large" onClick={this.create}>
              作成
            </Button>

            </div>
          )}

          {display === 0 && (
          <div>
          <Alert icon={false} severity="success">
            新しくランキングを作成します。<br/>
            対象楽曲・開始日時は作成後変更することはできません。
          </Alert>
          {(_currentStore() !== config.latestStore ) && (
            <Alert severity="error" style={{margin:"10px 0"}}>
              <AlertTitle>スコア保存先をご確認ください</AlertTitle>
              <p>
                スコアデータの保存先が最新のアーケード版IIDXバージョンではありません。<br/>
                このまま続行すると、最新バージョンを利用中のユーザーにランキングが表示されません。<br/>
                <RLink to="/settings" style={{textDecoration:"none"}}><Link color="secondary" component="span">設定画面からスコアの保存先を変更する</Link></RLink>。
              </p>
            </Alert>
          )}
          <Divider style={{margin:"20px 0"}}/>
          {form()}
          <Divider style={{margin:"20px 0"}}/>
          <Button color="secondary" fullWidth variant="outlined" size="large" disabled={isDisabled()} onClick={()=>this.changeView(1)}>
            確認画面へ
          </Button>
            {errors().length > 0 && (
              <Alert icon={false} severity="error" style={{margin:"15px 0"}}>
                {errors().map((item)=><span>{item}<br/></span>)}
              </Alert>
            )}
          </div>
          )}
        </Container>
        {isDialogOpen && <SongSearchDialog isDialogOpen={isDialogOpen} close={this.dialogToggle} decide={this.decide}/>}
      </Dialog>
    )
  }

}
