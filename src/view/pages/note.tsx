import * as React from 'react';
import Container from '@material-ui/core/Container';
import { injectIntl } from 'react-intl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NotesRecent from '../components/notes/recent';
import NotesLiked from '../components/notes/liked';
import MyNotes from '../components/notes/mynotes';
import WriteNotes from '../components/notes/writeNotes';

interface S {
  currentTab:number
}

class Tools extends React.Component<{intl:any},S> {

  constructor(props:{intl:any}){
    super(props);
    this.state ={
      currentTab:0,
    }
  }

  handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({currentTab:newValue});
  };

  render(){
    return (
      <Container fixed  className="commonLayout" id="stat">
        <Tabs
          value={this.state.currentTab}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="on"
          style={{margin:"5px 0"}}
        >
          <Tab label="最新の投稿" />
          <Tab label="書き込む・探す" />
          <Tab label="いいねした投稿" />
          <Tab label="Myノート" />
        </Tabs>
        {this.state.currentTab === 0 && <NotesRecent/>}
        {this.state.currentTab === 1 && <WriteNotes/>}
        {this.state.currentTab === 2 && <NotesLiked/>}
        {this.state.currentTab === 3 && <MyNotes/>}
      </Container>
    );
  }
}

export default injectIntl(Tools);
