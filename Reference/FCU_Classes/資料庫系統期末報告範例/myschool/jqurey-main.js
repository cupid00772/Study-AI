$(function(){
	var showArr =['1.jpeg','2.jpg','3.jpeg']; //圖片陣列  把要輪播的圖位置和檔名輸入在此 目前有三張圖輪播   
	setInterval(function(){	//定時更换背景
		$(".header").css("backgroundImage","url("+showArr[fRandomBy(0,2)]+")"); //fRandomBy(0,2)表示0~2, 而0表示圖片1.jpeg; 1表示圖片2.jpg; 2表示圖片3.jpeg
	},6000);//6000表示每張圖片停留6000毫秒, 1秒=1000毫秒 
	function fRandomBy(under, over){ //設定隨機數的範圍
		switch(arguments.length){ 
			case 1: return parseInt(Math.random()*under+1); 
			case 2: return parseInt(Math.random()*(over-under+1) + under); 
			default: return 0; 
		} 
	}
});
