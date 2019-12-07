import {songsDB} from "../indexedDB";
import { songData } from "../../types/data";
import { _isSingle } from "../settings";

export interface B{
  error:boolean,bpi:number,reason?:any,difficultyLevel?:string
}

export default class bpiCalcuator{
  private songsDB:any = new songsDB();
  private isSingle: number;
  private totalKaidens: number;
  private propData:songData[]|null = null;

  private m:number = 1;
  private s:number = 0;
  private k:number = 0;
  private z:number = 0;
  private powCoef:number = 1.175;
  private pgf = (j:number):number=> j === this.m ? this.m : 1 + ( j / this.m - 0.5 ) / ( 1 - j / this.m );

  private _allTwelvesLength:number = 0;
  private _allTwelvesBPI:number[] = [];

  constructor(){
    this.isSingle = _isSingle();
    this.totalKaidens = this.isSingle ? 2645 : 612;
  }

  getTotalKaidens(){
    return this.totalKaidens;
  }

  setPropData(data:songData,exScore:number,isSingle:number):number{
    try{
      this.isSingle = isSingle;
      this.s = exScore;
      this.k = data["avg"];
      this.z = data["wr"];
      this.m = data["notes"] * 2;
      return this.exec();
    }catch(e){
      return -15;
    }
  }

  setIsSingle(isSingle:number = 1){
    this.isSingle = isSingle;
    return this;
  }

  async calc(songTitle:string,difficulty:string,exScore:number):Promise<B>{
    try{
      this.propData = this.isSingle === 1 ?
      await this.songsDB.getOneItemIsSingle(songTitle,difficulty) :
      await this.songsDB.getOneItemIsDouble(songTitle,difficulty);
      if(!this.propData || !this.propData[0]){
        throw new Error("楽曲情報が見つかりませんでした");
      }
      this.s = exScore;
      this.k = this.propData[0]["avg"];
      this.z = this.propData[0]["wr"];
      this.m = this.propData[0]["notes"] * 2;
      return {error:false,bpi:this.exec(),difficultyLevel:this.propData[0]["difficultyLevel"]};

    }catch(e){
      return {error:true,bpi:NaN,reason:e.message || e};
    }
  }

  exec(){
    const {k,z,s} = this;
    if( s > this.m ){
      throw new Error("理論値を超えています");
    }
    if( s < 0 ){
      throw new Error("スコアは自然数で入力してください");
    }
    const _s = this.pgf(s),_k = this.pgf(k),_z = this.pgf(z);
    const _s_ = _s / _k, _z_ = _z / _k;
    const p = s >= k;

    return Math.max(-15,Math.round((p ? 100 : -100 ) * ( Math.pow((p ? Math.log(_s_) : -Math.log(_s_)),this.powCoef) / Math.pow(Math.log(_z_),this.powCoef) ) * 100) / 100);
  }

  setData(max:number,avg:number,wr:number):void{
    this.m = max;
    this.k = avg;
    this.z = wr;
  }

  calcFromBPI(bpi:number,ceiled:boolean = false):number{
    const k = this.pgf(this.k);
    const N = Math.pow(Math.E,Math.pow(Math.pow(Math.log(this.pgf(this.z) / k),this.powCoef)  * bpi / 100, 1 / this.powCoef)) * k;
    const res = this.m * ( ( N - 0.5 ) / N );
    return ceiled ? Math.ceil(res) : res;
  }

  rank(bpi:number,s:boolean = true):number{
    const p = s ? 100 : 95;
    return Math.ceil(Math.pow(this.totalKaidens, (p - bpi ) / p ));
  }

  set allTwelvesLength(val: number){ this._allTwelvesLength = val }
  set allTwelvesBPI(val: number[]){ this._allTwelvesBPI = val }

  totalBPI():number{
    const playedSongs = this._allTwelvesBPI.length;
    if(playedSongs === 0) return -15;
    let sum = 0,k = Math.log2(this._allTwelvesLength);

    for (let i=0; i < this._allTwelvesLength; ++i){
      if(i < playedSongs){
        const bpi = this._allTwelvesBPI[i],m = Math.pow( Math.abs(bpi) , k ) / this._allTwelvesLength;
        sum += bpi > 0 ? m : -m;
      }
    }
    const res = Math.round(Math.pow(Math.abs(sum), 1 / k) * 100) / 100;

    return sum > 0 ? res : -res;
  }
}
