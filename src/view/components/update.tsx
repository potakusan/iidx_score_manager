import { Component } from "react";
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class ReloadModal extends Component<{registration: ServiceWorkerRegistration},{show:boolean}> {
  state = {
    show: !!this.props.registration.waiting
  };

  handleClose = () =>{
    this.setState({show:false});
  }

  componentDidMount(){
    if((this.props.registration && this.props.registration.waiting)){
      this.handleUpdate();
    }
  }

  handleUpdate = () => {
    (this.props.registration && this.props.registration.waiting) && this.props.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    this.handleClose();
    window.location.reload();
  };

  render() {
    const {show} = this.state;
    if (!show) {
      return null;
    }
    return (
    <div>
      <Dialog
        open={show}
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <Container className="loaderCentered" style={{flexDirection:"column"}}>
            <CircularProgress />
            <p style={{marginTop:"15px"}}>アプリケーションの更新中...</p>
          </Container>
        </DialogContent>
      </Dialog>
    </div>
    );
  }
}
