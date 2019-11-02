import React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

import {scoreData, songData} from "../../../../types/data";
import { _prefix } from "../../../../components/songs/filter";
import DetailedSongInformation from "../detailsScreen";
import { diffColor, behindScore, bp } from "../common";

const columns = [
  { id: "difficultyLevel", label: "☆"},
  { id: "title", label: "曲名" },
  { id: "currentBPI", label: "BPI"},
  {
    id: "exScore",
    label: "EX",
  },
];

interface P{
  data:scoreData[],
  sort:number,
  isDesc:boolean,
  changeSort:(newNum:number)=>void,
  mode:number,
  allSongsData:{[key:string]:any}
  updateScoreData:()=>void,
}

interface S{
  page:number,
  rowsPerPage:number,
  isOpen:boolean,
  currentSongData:songData | null,
  currentScoreData:scoreData | null
}

export default class SongsTable extends React.Component<Readonly<P>,S>{

  constructor(props:Readonly<P>){
    super(props);
    this.state = {
      page : 0,
      rowsPerPage : 10,
      isOpen:false,
      currentSongData:null,
      currentScoreData:null
    }
  }

  handleOpen = async(updateFlag:boolean,row?:any,_willDeleteItems?:any):Promise<void>=> {
    if(updateFlag){await this.props.updateScoreData();}
    return this.setState({
      isOpen:!this.state.isOpen,
      currentSongData:row ? this.props.allSongsData[row.title + _prefix(row.difficulty)] : null,
      currentScoreData:row ? row : null
    });
  }

  handleChangePage = (_e:React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage:number):void => this.setState({page:newPage});

  handleChangeRowsPerPage = (event:React.ChangeEvent<HTMLInputElement>):void => this.setState({page:0,rowsPerPage:+event.target.value});

  render(){
    const {page,rowsPerPage,isOpen,currentSongData,currentScoreData} = this.state;
    const {data,changeSort,sort,isDesc,mode} = this.props;
    return (
      <Paper style={{width:"100%",overflowX:"auto"}}>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column,i) => (
                  <TableCell
                    key={column.id}
                    onClick={()=>changeSort(i)}
                  >
                    {(mode < 5 || i !== 2 ) && column.label}
                    {(mode > 4 && i === 2) && "BP"}
                    {i === sort &&
                      <span>
                        { isDesc && <span>▼</span> }
                        { !isDesc && <span>▲</span> }
                      </span>
                    }
                    {i !== sort && <span>△</span>}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any,i:number) => {
                return (
                  <TableRow
                    onClick={()=>this.handleOpen(false,row)}
                    hover role="checkbox" tabIndex={-1} key={row.title} style ={ i % 2? { background : "#f7f7f7" }:{ background : "white" }}>
                    {columns.map((column,j) => {
                      const prefix = row.difficulty === "hyper" ? "(H)" : row.difficulty === "leggendaria" ? "(†)" : "";
                      return (
                        <TableCell key={column.id + prefix} style={{backgroundColor : diffColor(j,row),position:"relative"}}>
                          {(mode < 5 || column.id !== "currentBPI") && row[column.id]}

                          {column.id === "title" && prefix}
                          {(mode > 0 && mode < 5 && column.id === "exScore") &&
                            <span>(-{behindScore(row,this.props.allSongsData,mode)})</span>
                          }
                          {(mode > 4 && column.id === "currentBPI") && bp(row.missCount)}
                          {(j === 3 && mode === 0 && row.lastScore > -1) && <span className="plusOverlayScore">
                            {row.exScore - row.lastScore > 0 ? "+" + Number(row.exScore - row.lastScore) : row.exScore - row.lastScore}
                            </span>
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={this.props.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage=""
          backIconButtonProps={{
            "aria-label": "previous page",
          }}
          nextIconButtonProps={{
            "aria-label": "next page",
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        {isOpen &&
          <DetailedSongInformation isOpen={isOpen} song={currentSongData} score={currentScoreData} handleOpen={this.handleOpen}/>
        }
      </Paper>
    );
  }
}