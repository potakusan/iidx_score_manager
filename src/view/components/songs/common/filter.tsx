import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

interface P {
  handleToggle:()=>void,
  applyFilter:(state:{bpm:B})=>void,
  bpm:B
}

interface S {
  bpm:B
}

export interface B {
  noSoflan:boolean,
  min:number|"",
  max:number|"",
  soflan:boolean
}

class SongsFilter extends React.Component<P,S> {

  constructor(props:P){
    super(props);
    this.state = {
      bpm:props.bpm,
    }
  }

  applyAndClose = ()=>{
    this.props.applyFilter(this.state);
    return this.props.handleToggle();
  }

  cloneState = ()=>{
    return this.state.bpm;
  }

  handleChkBox = (name:"soflan"|"noSoflan" = "soflan")=> (event: React.ChangeEvent<HTMLInputElement>)=>{
    let bpm = this.cloneState();
    bpm[name] = event.target.checked;
    return this.setState({
      bpm:bpm
    })
  }

  handleInput = (name:"min"|"max" = "min")=> (event: React.ChangeEvent<HTMLInputElement>)=>{
    let bpm = this.cloneState();
    const val = Number(event.target.value);
    bpm[name] = val <= 0 ? "" : val;
    return this.setState({
      bpm:bpm
    })
  }

  render(){
    const {handleToggle} = this.props;
    const {bpm} = this.state;
    return (
      <Dialog open={true} onClose={handleToggle} aria-labelledby="form-dialog-title">
        <DialogTitle>詳細フィルタ</DialogTitle>
        <DialogContent>
          <Typography component="h6" variant="h6">
            BPM
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={bpm.noSoflan}
                onChange={this.handleChkBox("noSoflan")}
                value="noSoflan"
                color="primary"
              />
            }
            label="ソフランなし"
          />
          <Grid container>
            <Grid item xs={6}>
              <form noValidate autoComplete="off" style={{margin:"10px 6px 0"}}>
                <TextField
                  type="number"
                  style={{width:"100%"}}
                  label="BPM下限"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={!bpm.noSoflan}
                  value={bpm.min}
                  onChange={this.handleInput("min")}
                />
              </form>
            </Grid>
            <Grid item xs={6}>
              <form noValidate autoComplete="off" style={{margin:"10px 6px 0"}}>
                <TextField
                  type="number"
                  style={{width:"100%"}}
                  label="BPM上限"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={!bpm.noSoflan}
                  value={bpm.max}
                  onChange={this.handleInput("max")}
                />
              </form>
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={bpm.soflan}
                onChange={this.handleChkBox("soflan")}
                value="soflan"
                color="primary"
              />
            }
            label="ソフランあり"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggle} color="primary">
            閉じる
          </Button>
          <Button onClick={this.applyAndClose} color="primary">
            適用
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default SongsFilter;