console.log (1111)
// グローバル
// div要素を格納
var cards = [];
// 1枚目かどうかのフラグ   1枚目: true   2枚目: false
var flgFirst = true;
// 1枚目のカードを格納
var cardFirst;
// そろえた枚数
var countUnit = 0;
var mode;					// ストップウォッチのモード	RUN/STOP
var startTime;				// スタートした時刻
var nowTime;				// ストップした時刻
var addTime;				// 経過時間（ストップウォッチ再開時に加算する）
var millisec;					// 1000分の1秒
var sec100;					// 100分の1秒
var sec;						// 秒
var min;						// 分
var hour;					// 時
var gmt;						// タイムゾーンのオフセット値
							//	例）GMT+0900 なら 標準時より9時間後をさしているので-9する
var timerId;					// タイマー

/*
 * 定数
 */
var RUN = 1;				// 動作中
var STOP = 0;				// 停止中


/*
 * 実行時の処理
 */
// window.onload = function(){
// 	resetStopWatch();
// }

window.onload = function(){
    // 数字格納 一時配列
    var arr = [];
    
    for (var i = 1; i < 14; i++){
        // 4つの数字＊13
        arr.push(i);
        arr.push(i);
        arr.push(i);
        arr.push(i);
    }

    window.addEventListener('DOMContentLoaded', function(){
        var img_element = document.createElement("img");
        img_element.alt = "";
        img_element.width = 60;
        img_element.height = 80;
    
        var article_element = document.querySelector("article");
        article_element.appendChild(img_element);
    });
    
    // シャッフル
    shuffle(arr);
    
    var panel = document.getElementById('panel');
    
    // div要素作成
    for (i = 0; i < 52; i++){
        var div = document.createElement('div');
        div.className = 'card back';
        div.index = i;
        div.number = arr[i];
        div.innerHTML = '';
        div.onclick = turn;
        panel.appendChild(div);
        cards.push(div);
    }
    
    
}

// シャッフル用関数
function shuffle(arr) {
    var n = arr.length;
    var temp, i;

    while (n) {
        i = Math.floor(Math.random() * n--);
        temp = arr[n];
        arr[n] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

// クリック時の処理
function turn(e){
    
    var div = e.target;
    
    // カードのタイマー処理が動作中は return
    if (backTimer) return;

    // 裏向きのカードをクリックした場合は数字を表示する
    if (div.innerHTML == ''){
        div.className = 'card';
        div.innerHTML = div.number; 
    }else{
        // 数字が表示されているカードは return
        return;
    }
    
    // 1枚目の処理
    if (flgFirst){
        // cardFirst は2枚目の処理のときに使う
        cardFirst = div;
        // フラグ変更
        flgFirst = false;
        
    // 2枚目の処理
    }else{
        
        // 数字が1枚目と一致する場合
        if (cardFirst.number == div.number){
            countUnit++;
            // 見えない状態にする
            backTimer = setTimeout(function(){
                div.className = 'card finish';
                cardFirst.className = 'card finish';
                backTimer = NaN;
                
                if (countUnit == 26){
                    clearInterval(timer);  // timer終了
                }
            }, 500)

        // 一致しない場合
        }else{  
            // カードを裏側に戻す
            backTimer = setTimeout(function(){
                div.className = 'card back';
                div.innerHTML = '';
                cardFirst.className = 'card back';
                cardFirst.innerHTML = '';
                cardFirst = null;
                backTimer = NaN;
            }, 500);
        }
        
        flgFirst = true;
    }  
}


/*
 * ストップウォッチのリセット
 */
function resetStopWatch(){
	mode = STOP;
	addTime = 0;
	millisec = sec100 = sec = min = hour = 0;
	gmt = new Date().getTimezoneOffset() / 60;	// 戻り値は分のため60で割る
	document.getElementById("time").innerHTML = "00:00:00.00";
}
		
/*
 * ボタン処理
 */
function startStop(){
	switch(mode){
		case STOP:		// スタートを押したとき
			mode = RUN;
			timerId = setTimeout(runStopWatch, 10);
			document.getElementById("btnClear").disabled = "true";	// クリアボタンを使用不可
			document.getElementById("btnStart").innerHTML = "ストップ";
			// スタート時刻を設定（ストップウォッチが進んでいれば加算）
			startTime = new Date().getTime();
			addTime = (hour*60*60*1000 + min*60*1000 + sec * 1000 + millisec);
			startTime -= addTime;
			break;

		case RUN:		// ストップを押したとき
			mode = STOP;
			clearTimeout(timerId);
//			nowTime = new Date().getTime();
			document.getElementById("btnStart").innerHTML = "スタート";
			document.getElementById("btnClear").disabled = "";		// クリアボタンを使用可
			drawTime();
	}
}

/*
 * 時間表示
 */
function drawTime(){
	var strTime = "";
	var strSec100, strSec, strMin, strHour;

	// 数値を文字に変換及び2桁表示設定
	strSec100 = "" + sec100;
	if ( strSec100.length < 2){
		strSec100 = "0" + strSec100;
	}
	strSec = "" + sec;
	if ( strSec.length < 2){
		strSec = "0" + strSec;
	}
	strMin = "" + min;
	if ( strMin.length < 2){
		strMin = "0" + strMin;
	}
	strHour = "" + hour;
	if ( strHour.length < 2){
		strHour = "0" + strHour;
	}
	// 表示形式を設定
	strTime = strHour + ":" + strMin + ":" + strSec + "." + strSec100;
	document.getElementById("time").innerHTML = strTime;
}

/*
 * 時間計測
 */
function runStopWatch(){
	// スタートからの差分をとる
	nowTime = new Date().getTime();
	diff = new Date(nowTime - startTime);
	// ミリ秒、100分の1秒、秒、分、時を設定
	millisec = diff.getMilliseconds();
	sec100 = Math.floor(millisec / 10);
	sec = diff.getSeconds();
	min = diff.getMinutes();
	hour = diff.getHours() + gmt;	// タイムゾーンのオフセットを考慮する

	drawTime();			// 時間表示
	timerId = setTimeout(runStopWatch, 10);
}



