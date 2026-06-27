//導覽列
function navFunction() {
	var topNav = document.getElementById('myTopnav'); //找到一個區塊的id為myTopnav
	if (topNav.className === 'nav') {  //如果id=myTopnav區塊, class選擇器是nav的樣式
	  topNav.className += ' nav2';  //則把id=myTopnav區塊, class選擇器除了原先的nav的樣式之外 再套入nav2的樣式
	} else {
	  topNav.className = 'nav';  //否則id=myTopnav區塊的class選擇器只有nav的樣式
	}
}