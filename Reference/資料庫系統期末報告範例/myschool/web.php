<!DOCTYPE html>
<html lang="zh-Hant-Tw">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>圖片輪播</title>
    <link rel="stylesheet" href="style2.css"> <!--自己定義的CSS檔 可以編修內容-->
    <link rel="stylesheet" href="all.min.css"> <!--來自於Jquery官方的CSS檔 不能編修內容-->
    <style> @import url "style2.css";
    </style>
    <style>
      .dropdown {
  position: relative;
  display: inline-block;
  margin-right: 20px;
}

.dropdown {
  position: relative;
  display: inline-block;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 下拉主按鈕 */
.dropbtn {
  background-color: #444; /* 深灰色背景 */
  color: #fff;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropbtn:hover {
  background-color: #666; /* hover 淺灰色 */
}

/* 下拉選單內容 */
.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #fff;
  min-width: 180px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  z-index: 1;
}

/* 下拉選項樣式 */
.dropdown-content a {
  color: #333;
  padding: 14px 20px;
  text-decoration: none;
  display: block;
  font-size: 15px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-content a:hover {
  background-color: #f2f2f2;
  color: #006699;
}

/* 顯示下拉選單 */
.dropdown:hover .dropdown-content {
  display: block;
}
      .container {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-areas: "ttt ui"
  "whpic whpic"
  "inf inf";
  grid-template-columns: 400px 680px;
  grid-template-rows: 160px 1fr 80px;
}
.container > div {
  border: 1px dashed #888;
}

.ttt {
  grid-area: ttt;
}
.ui {
  grid-area: ui;
}
.whpic {
  grid-area: whpic;
}
.inf {
  grid-area: inf;
}
    </style>
    <style>
      .container {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-areas: "header-1 header-1 header-2"
  "left right right"

  "footer-0 footer-0 footer-2"
  "a-PjKkD-0 a-PjKkD-1 a-PjKkD-1";
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 400px 400px 400px 400px;
}

.header-1 {
  grid-area: header-1;
  
}
.header-2 {
  grid-area: header-2;
}

.left {
  grid-area: left;
}
.right {
  grid-area: right;
  
}
.footer-0 {
  grid-area: footer-0;
 
}
.footer-2 {
  grid-area: footer-2;
}
.a-PjKkD-0 {
  grid-area: a-PjKkD-0;
}
.a-PjKkD-1 {
  grid-area: a-PjKkD-1;
}
            
 @media screen and (max-width:800px){  
     .container {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-areas: 
      "header-1"
      "header-2"
      "right"
      "left"
      "footer-0"
      "footer-2"
      "a-PjKkD-1"
      "a-PjKkD-0" ;
     }
  grid-template-columns: 1fr;
  grid-template-rows: 600px 600px 600px 600px 600px 600px 600px 600px;
}
.container > div {
  border: 1px dashed transparent;
}
 


.header-1 {
  grid-area: header-1;
  background-color: floralwhite;
  
}
.header-2 {
  grid-area: header-2;
}
            .header-2 {
                position: relative;
            }
            .header-2 img{
                display: block;
            }
            .header-2 .hoverimage {
                position: absolute;
                top: 0;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .header-2:hover .hoverimage{
                opacity: 1;
            }
            .header-2:hover .normalimage{
                opacity: 0;
            }
.left {
  grid-area: left;
}
.right {
  grid-area: right;
  background-color: azure;
}
.footer-0 {
  grid-area: footer-0;
  background-color: floralwhite;
}
.footer-2 {
  grid-area: footer-2;
}
.a-PjKkD-0 {
  grid-area: a-PjKkD-0;
}
.a-PjKkD-1 {
  grid-area: a-PjKkD-1;
  background-color: azure;
}
.header-container {
  display: flex;
  justify-content: space-between; /* 在 x 軸上均勻分佈 */
  align-items: center; /* 垂直方向置中 */
  padding: 0 400px; /* 增加左右內距 */
  background-color: #333; /* 背景色 */
  color: white; /* 字體顏色 */
}

/* 標誌區域 */
.header-container .logo img {
  height: 80px; /* 控制標誌大小 */
}

/* 標題區域 */
.header-container .title h1,
.header-container .title h2 {
  margin: 0;
  text-align: center; /* 標題置中 */
  color: white;
}
.box99{
  justify-content: space-between;
  height: 100px;
  width: 400px;
  padding: 0 10px;
              }
            
   a0 {
      text-align: center;
      margin-top: 100px;
      font-size: 48px;
      color:rgb(0, 0, 0);
      text-shadow: 2px 2px 8px rgba(0,0,0,0.1);
      letter-spacing: 4px;
      background: linear-gradient(to right,rgb(0, 0, 0),rgb(0, 0, 0));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }           
   /*自體設定*/
   a1 {color: darkgoldenrod;
        font-size: 20px;
        text-align: center; }
        a11 {color: darkgoldenrod;
        font-size: 40px;
        text-align: center; }
        
    a2 {color: darkcyan;
        font-size: 20px;
        text-align: center;}
    a22 {color: darkcyan;
        font-size: 40px;
        text-align: center; }
    
  </style>          

    </style>

    
</head>
<body>
<div class="header-container">
  <div class="title">
    <h1>綠電好棒棒(°∀°)</h1>
    <h2> ECO friendly</h2>
  </div>
  
  <!-- 功能列下拉式選單 -->
  <div class="dropdown">
    <button class="dropbtn">功能列 ▾</button>
    <div class="dropdown-content">
      <a href="member.php">會員系統</a>
      <a href="search.php">查詢系統</a>
      <a href="collections.php">資料系統</a>
      <a href="board.php">留言板</a>
    </div>
  </div>
</div>
 
  
  <div class="header">
             <div class="mySlideshows fade">  <!--mySlideshows會讓所有圖片放在同一位置 此選擇器來自於all.min.css檔 選擇器fade來自於style2.css檔-->
		    <img src="https://images.chinatimes.com/newsphoto/2022-08-06/656/20220806002517.jpg" style="width:60%" height="800px"> <!--載入圖片 -->
		  
		</div>	  
		<div class="mySlideshows fade">
		    <img src="https://i0.wp.com/pgesolar.com.tw/wp-content/uploads/migra/blog/38bcd513f73c20260342f6861a6a25133a9737ac.jpg?quality=100&ssl=1" style="width:60%" height="800px">
		 
		</div>	  
		<div class="mySlideshows fade">         
		    <img src="https://cdn2.ettoday.net/images/2731/2731668.jpg" style="width:60%" height="800px">

		</div>
        <div class="mySlideshows fade">         
		    <img src="https://www.upmedia.mg/upload/article/20220427095614066484.jpg" style="width:60%" height="800px">
	
		</div>
         <!--如果要擴充第4張圖 複製此上述div區塊內容 到這裡貼上 並修改圖片位置和名稱 還有圖片說明文-->
            
        <div> <!--控制左右移動，當觸及時會啟動mySlides.js內部plusSlides的function-->
		    <a class="prev" onclick="plusSlides(-1)">&#10094;</a> <!--前一張圖片按鈕 此會啟動mySlides.js內部函數plusSlides-->
		    <a class="next" onclick="plusSlides(1)">&#10095;</a> <!--下一張圖片按鈕 此會啟動mySlides.js內部函數plusSlides-->
	    </div>   
	    <!--是包覆圓點的元件，每一個span都是一個點，觸及後會啟動mySlides.js內部的currentSlide的function-->
	    <div style="text-align:center"> 
		    <span class="dot" onclick="currentSlide(1)"></span>
		    <span class="dot" onclick="currentSlide(2)"></span>
		    <span class="dot" onclick="currentSlide(3)"></span>
            <span class="dot" onclick="currentSlide(4)"></span>
             <!--如果要擴充第4張圖 複製此上一個Span列 到這裡貼上 並修改onclick="currentSlide(4)-->
            
        </div>
       </div>
      
    
        
       <!-- <script src="mySlides.js"></script> --> <!-- 如果要能手動控制上下一張圖片 選用這script --> 
       <script src="mySlidesAuto.js"></script> <!--如果要自動輪播圖片圖片 選用這script 這兩個script會互相干擾 只能啟用其中一個-->
        </div>
        
        <a0>-------------------------------------------最新消息-----------------------------------------</a0>
        
    <div class="inf">
     
      <div class="container">
  <div class="header-1">
    <ul>
    <a11>穩定供電靠核能！</a11>
        <li><a1>核能發電是一種高效率且低碳排的能源選項，透過核分裂反應產生大量電力，穩定供應基載電力。相較於化石燃料，核能可大幅降低二氧化碳排放，有助於減緩氣候變遷。然而，核能發電也需嚴格管理核廢料與確保設施安全，降低潛在的輻射風險。透過妥善規劃與技術提升，核能有機會成為穩定與環保的能源之一。</a1></li>

        <br><a1>(點擊圖片有連結)</a1></li></ul></div>
<div class="header-2"><a href="https://www.taipower.com.tw/1136/1146/1153/3054/normalPost" target="_blank">
                      <img src="https://cdn-www.cw.com.tw/article/202401/article-65b2312a37e50.jpg" width="700" height="400" class="normalimage">
                      <img src="img/nuc.png" width="700" height="400" class="hoverimage"></a></div>

  <div class="left"><div class="header-2"><a href="https://www.taipower.com.tw/1136/1146/1153/3048/normalPost" target="_blank">
                    <img src="https://www.greenpeace.org/static/planet4-taiwan-stateless/2013/06/3e093c78-shutterstock_1111382855-scaled.jpg" width="700" height="400" class="normalimage">
                    <img src="https://img.shoplineapp.com/media/image_clips/5ce399afdf026200261f0f78/large.jpg?1558419886" width="700" height="400" class="hoverimage">  </a></div></div>
<div class="right">
    <ul>
        <a22>自然之力造福人類：水力發電！</a22>
        <li><a2>水力發電利用水流的位能或動能轉換成電力，是最成熟且穩定的再生能源之一。除了不產生溫室氣體外，大型水壩還能兼具防洪、灌溉等多重功能。但也需考量對生態環境與水域社區的影響。適度開發、與生態共存的水力設施，將能使這項能源永續利用，為人類創造長遠效益。</a2></li>
        <a2>(點擊圖片有連結)</a2></ul></div>
<div class="footer-0">
  <ul>
      <a11>曬太陽也能發電！</a11>
      <li><a1>太陽能發電透過光伏技術將陽光轉換為電能，是近年來成長最快速的綠能之一。其優點是來源取之不盡、無污染，特別適合屋頂或偏鄉地區使用。雖然受天氣與日照時間影響較大，但隨著儲能技術發展與成本下降，太陽能在能源轉型中扮演日益重要的角色，邁向更乾淨、更永續的未來。

</a1></li>
        <a1>(點擊圖片有連結)</a1></ul></div>
  <div class="footer-2"><div class="header-2">
                        <a href="https://service.taipower.com.tw/greennet/sustainable/green-energy/solar-energy" Target ="_blank">
                        <img src="https://itritech.itri.org.tw/wp-content/uploads/2020/06/80651025_s.jpg" width="700" height="400" class="normalimage">
                        <img src="https://mewcare.com/wp-content/uploads/2018/09/1463958379_9874.jpg" width="700" height="400" class="hoverimage"></a></div></div>
<div class="a-PjKkD-0"><div class="header-2">
                       <a href="https://www.taipower.com.tw/1136/1146/1153/3056/normalPost" Target ="_blank">
                       <img src="https://agritech-foresight.atri.org.tw/archive/news/20220919aba00fb4-9a4b-4524-9cd5-04bcd7c5602a.jpg" width="700" height="400" class="normalimage">
                       <img src="https://i.pinimg.com/736x/57/8b/54/578b54c8632ea28ce24edd1a79e29ebe.jpg" width="700" height="400" class="hoverimage"></a></div></div>
<div class="a-PjKkD-1">
  <ul>
    <a22>風來發電最環保！</a22>
      <li><a2>風力發電利用風的動能推動風機葉片轉動進而產生電力，是最具潛力的再生能源之一。不但不排碳、不耗水，風力資源分布廣泛，尤其適合離岸與高原地區。雖然面臨風力穩定性與噪音、景觀爭議等挑戰，但透過科技進步與智慧電網輔助，風力發電正快速擴展，推動全球能源結構綠色轉型。

</a2></li>
        <a2>(點擊圖片有連結)</a2></ul></div>
</div>
</body></div>
  </div>
  </body>