'use strict';
//fs（file system ）モジュールを読み込んで使えるようにする
const fs = require('fs');
//const { listenerCount } = require('process');
//readline モジュールを読み込んで使えるようにする
const readline = require('readline');
// popu-pref.csv を　ファイルとして読み込める状態に準備する
const rs = fs.createReadStream('./popu-pref.csv');
//readline モジュールに　fsを設定する
const rl = readline.createInterface({ input: rs,output:{}});
const prefectureDateMap = new Map();//key：都道府県　value：集計データオブジェクト
//popu-pref.csv のデータを１行ずつ読み込んで設定された関数を実行する
rl.on('line',lineString => {
      //集計年,都道府県名,10〜14歳の人口,15〜19歳の人口
   //2010,北海道,237155,258530
    const colums = lineString.split(',');　//popu-pref.csvのデータを”，”でsplit（分ける）
    const year = parseInt(colums[0]);//列の０番目 parseIntは数値データにする　"２０１０”を2010 
    const prefecture = colums[1]; //prefecture＝県
    const popu = parseInt(colums[3]);//15〜19歳の人口は３番目
if(year === 2010 || year === 2015){
//都道府県ごとのデーターを作る
    let value = prefectureDateMap.get(prefecture);
    //データーがなければ初期化
    if(!value){//　!　は否定論理式　fulseを返す　falsyの場合　valueに初期値のオブジェクトを代入
        value = {
            popu10: 0,
            popu15: 0,
            cyange: null
        };
    }
    if(year === 2010){
        value.popu10 = popu; //２０１０年の１５〜１９歳の人口をpopu１０に設定　プロパティ
    }
    if(year === 2015){
        value.popu15 = popu;
    }
    prefectureDateMap.set(prefecture,value); //prefecture(県名)がのちにでてくるkeyの値になる
}
});
rl.on('close' , () => {
//close したあとでデータが揃ってるのでここで変化率を求める
for(let[key, date] of prefectureDateMap){ //北海道から沖縄まで１個１個処理できる
    date.cyange = date.popu15 / date.popu10;
}
const rankingArray = Array.from(prefectureDateMap).sort((pair1,pair2) => {
    return pair2[1].cyange-pair1[1].cyange;
});
const rankingStrings = rankingArray.map(([key,value]) => {
    return (
        key + 
        ': ' +
        value.popu10 +
        '=>' +
        value.popu15 +
        '変化率:' +
        value.cyange
    );
});
console.log(rankingStrings);
//console.log(rankingArray);    
//console.log(prefectureDateMap);//mapの中身を表示する　{"key" => "value","key" => "value"}
});

//　for(変数　of　配列){
    //繰り返しの処理
//}