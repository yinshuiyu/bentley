document.addEventListener('touchmove', function (event) {
	if(swipe.scrollCurrent != 2){
		event.preventDefault();
		return true
	}
	if(swipeHor.scrollCurrentHor < 1 || (swipeHor.scrollCurrentHor > 0 && is_down()) ){
		event.preventDefault();
	}
}, false);

$(function(){
    FastClick.attach(document.body);
    /*
    //禁止橡皮筋
	function stopScrolling( touchEvent ) { 
		touchEvent.preventDefault(); 
	} 
	document.addEventListener( 'touchstart' , stopScrolling , false ); 
	document.addEventListener( 'touchmove' , stopScrolling , false );
	*/
})

var grey = {
	init: function(){
		this.bind()
	},
	bind: function(){
		var self = this
		$('.grey').click(function(event) {
			var oThis = $(this),
				sId = $(this).attr('id')

			self.hideGrey('#'+sId)
		});
	},
	showGrey: function(target){
		$(target)
			.css('opacity', 1)
			.removeClass('none')

		swipe.able = false
		swipeHor.ableHor = false	
	},
	hideGrey: function(target){
		$(target).animate({
			opacity: 0
		}, function(){
			$(target).addClass('none')
		})

		swipe.able = true
		swipeHor.ableHor = true	
	}
}
grey.init()

/*
//获取canvas要设置的宽高
var width = parseInt($(window).width());
// var height = width * 1194 / 750;
var height = parseInt($(window).height());
var coverImg = 'img/loading.jpg',
	underImg = 'img/page_1.jpg';


//判断刮了百分多少了
function scratcherChanged() {
	var per = (this.fullAmount(32) * 100)|0;
	if (per>1) {		
		var scratch_wrap = $('#load_scratch');
		scratch_wrap.removeClass('show');
		oPage.show('1_1');
	}
}

var scratcher = new Scratcher('scratcher',underImg,coverImg,width,height);


scratcher.on('reset', function () {
	
});

scratcher.on('scratchesended', scratcherChanged);
*/

var oPage = {
	pages: $('.main'),
	images: $('img'),
	init: function(){
		var self = this

		self.bind()
		self.load()
	},
	bind: function(){

	},
	show: function(target){
		var self = this

		self.pages.show()
		// $('#page_'+target).show()
	},
	load: function(){
		var self = this,
			iImgCount = self.images.length,
			iImgTmp = 0

		self.images.each(function(){
			var oThis = $(this),
				sSrc = oThis.attr('src')

			oThis
				.attr('src', '')
				.on('load', function(){
					iImgTmp ++

					if(iImgTmp == iImgCount){
						$('#load_loading').remove()
						$('#load_scratch').addClass('show')
					}
				})
				.attr('src', sSrc)
		})
	}
}

$(function(){
	// oPage.init()
	// oPage.show('1_1');
});


//向上滑动方法
var swipe = {
	swipeHor: {},
	loading: $('#loading'),
	iHeight: $('body').height(),

	able: true,
	scrollWrap: '.main',
	scrolling: false,
	scrollCurrent: 0,
	scrollTarget: 1,

	init: function(){
		this.swipeHor = swipeHor
		this.bind()
	},
	bind: function(){
		var self = this,
			target = $(self.scrollWrap).find('.swipe')

		//页面向上滑动事件绑定
		target.swipeUp(function(){
			// $('.test').text((new Date()).valueOf())
			if(self.scrolling || self.swipeHor.scrollingHor){
				return false;
			}

			//最后一页不能继续滑动
			if(self.scrollTarget == 0){
				return false
			}

			self.fSwipe(self.scrollTarget)
		})
		target.swipeDown(function(){
			if(self.scrolling || self.swipeHor.scrollingHor){
				return false;
			}

			//第一页不能返回最后一页
			if(self.scrollCurrent - 1 < 0){
				// self.scrollTarget = target.length - 1
				return false
			}else{
				self.scrollTarget = self.scrollCurrent - 1
			}
			self.fSwipe(self.scrollTarget, true)
		})
	},
	go2page: function(i){
		var self = this,
			bBack = self.scrollTarget > i ? false : true

		if(self.scrollCurrent == i){
			return false
		}

		self.scrollTarget = i

		if(self.scrolling || self.swipeHor.scrollingHor){
			return false;
		}

		self.fSwipe(self.scrollTarget, bBack)
	},
	page: function(i){
		return $(this.scrollWrap).find('section.page'+(i+1));
	},
	fSwipe: function(i, bBack){
		if(!this.able || !this.swipeHor.ableHor){
			return false
		}

		if(is_down()){
			$('body').css('overflow', 'hidden')
		}

		if(!i){
			i = this.scrollTarget
		}
		this.beforeSwipe(i)

		var self = this,
			oThis = $(self.scrollWrap),
			oSons = oThis.find('section'),
			oTarget = self.page(self.scrollTarget)

		self.scrollTarget = i

		self.scrolling = !self.scrolling

		// oSons.eq(0).after(oThis.find('section.page'+(self.scrollTarget+1)));
		oTarget
			.addClass('show')

		if(!bBack){
			oSons.eq(0).after(oTarget);
		}else{
			oSons.eq(0).before(oTarget);
			oThis.css({marginTop: -self.iHeight})
		}

		var iScroll = bBack ? 0 : -self.iHeight
		oThis
			.animate({
				marginTop: iScroll
			}, 200, function() {
				oSons.eq(0).appendTo(oThis)
				oThis
					.css({marginTop: 0})

				self.scrollCurrent = self.scrollTarget
				self.scrollTarget ++
				if(self.scrollTarget >= oSons.length){
					self.scrollTarget = 0
				}

				self.scrolling = !self.scrolling

				// self.callback(self.scrollCurrent)
				var thisPage = self.page(self.scrollCurrent)

				thisPage.data('ended') === undefined ? thisPage.data('ended', 0) : void(0)

				self.callback(self.scrollCurrent)

				oTarget.siblings()
					.removeClass('show')
			});
	},
	beAble: function(){
		this.able = true
		$('.down_tip.hidden').removeClass('hidden')
	},
	beforeSwipe: function(i){
		console.log('beforeSwipe: ', i)

		var self = this,
			thisPage = self.page(i)
	},
	callback: function(i){
		console.log('callback: ', i)

		var self = this,
			thisPage = self.page(i),
			oGrey = $('#page3_grey')

		if(i == 2 && !oGrey.hasClass('none')){
			setTimeout(function(){
				grey.hideGrey('#page3_grey')
			}, 2000)
		}

		if(self.swipeHor.scrollCurrentHor > 0){
			$('body').css('overflow', 'auto')
		}

		if(i == 2 && !thisPage.find('.grey').hasClass('none')){
			self.able = false
		}else if(i == 2){
			swipeHor.go2pageHor(0)
		}
	}
}

//左右滑动方法
var swipeHor = {
	swipe: {},
	tabs: $('.tabs'),
	iWidth: $('body').width(),

	ableHor: true,
	scrollWrapHor: '.swipe_hor_wrap',
	scrollingHor: false,
	scrollCurrentHor: 0,
	scrollTargetHor: 1,

	init: function(){
		this.swipe = swipe
		this.bind()
	},
	bind: function(){
		var self = this

		//tab左右滑动事件绑定
		$(self.scrollWrapHor).find('.swipe_horizontal')
			.swipeLeft(function(){
				if(self.swipe.scrolling || self.scrollingHor){
					return false;
				}

				self.fSwipeHor(self.scrollTargetHor)
			})
			.swipeRight(function(){
				if(self.swipe.scrolling || self.scrollingHor){
					return false;
				}

				if(self.scrollCurrentHor - 1 < 0){
					self.scrollTargetHor = 3
				}else{
					self.scrollTargetHor = self.scrollCurrentHor - 1
				}
				self.fSwipeHor(self.scrollTargetHor, true)
			})
	},
	go2pageHor: function(i){
		var self = this,
			bRight = self.scrollTargetHor > i ? true : false

		if(self.scrollCurrentHor == i){
			return false
		}

		self.scrollTargetHor = i

		if(self.swipe.scrolling || self.scrollingHor){
			return false;
		}

		self.fSwipeHor(self.scrollTargetHor, bRight)
	},
	pageHor: function(i){
		return $(this.scrollWrapHor).find('.tabs_content_'+i);
	},
	animate: function(oThis, oSons, i, bRight){
		var self = this,
			sMargin = "marginLeft"

		oSons
			.eq(0)
				.appendTo(oThis)
				.css({marginLeft: -99999}).end()
		self.pageHor(self.scrollTargetHor)
			.css(sMargin, 0)

		oThis
			.css({
				marginLeft: 0,
				marginRight: 0
			})

		self.tabs.find('a').eq(i)
			.addClass('current')
		.siblings()
			.removeClass('current')

		self.scrollCurrentHor = self.scrollTargetHor
		self.scrollTargetHor  = self.scrollTargetHor+1
		if(self.scrollTargetHor > 3){
			self.scrollTargetHor = 0
		}else if(self.scrollTargetHor < 0){
			self.scrollTargetHor = 3
		}

		self.scrollingHor = !self.scrollingHor

		self.callbackHor(self.scrollCurrentHor)

		self.pageHor(self.scrollCurrentHor).siblings()
			.removeClass('show')
	},
	fSwipeHor: function(i, bRight){
		console.log('left')
		if(!this.ableHor || !this.swipe.able){
			return false
		}

		if(!i){
			i = this.scrollTargetHor
		}
		this.beforeSwipeHor(i)

		var self = this,
			oThis = $(self.scrollWrapHor),
			oSons = oThis.find('.swipe_horizontal'),
			sMargin = "marginLeft"
		self.scrollTargetHor = i

		self.scrollingHor = !self.scrollingHor

		if(!bRight){
			oSons.eq(0).after(self.pageHor(self.scrollTargetHor));
			self.pageHor(self.scrollTargetHor).css(sMargin, self.iWidth)
		}else{
			oSons.eq(0).before(self.pageHor(self.scrollTargetHor));
			self.pageHor(self.scrollTargetHor).css(sMargin, -self.iWidth)
		}

		self.pageHor(self.scrollTargetHor)
			.addClass('show')

		if(!bRight){
			oThis
				.animate({
					marginLeft: -self.iWidth
				}, 200, function() {
					self.animate(oThis, oSons, i, bRight)
				});
		}else{
			oThis
				.animate({
					marginLeft: self.iWidth
				}, 200, function() {
					self.animate(oThis, oSons, i, bRight)
				});
		}

		// $(self.scrollWrapHor).find('.swipe_horizontal')
		// 	.unbind('swipeUp')
	},
	beAbleHor: function(){
		this.ableHor = true
	},
	beforeSwipeHor: function(i){
		console.log('beforeSwipeHor: ', i)

		var self = this,
			thisPage = self.pageHor(i)
	},
	callbackHor: function(i){
		console.log('callbackHor: ', i)

		var self = this,
			thisPage = self.pageHor(i)

		if(i > 0){
			$('body').css('overflow', 'auto')
		}

		//所有页面横向切换后都要滚动到顶部
		$('body').scrollTop(0)
	}
}

function is_down(){
	var $window = $(window),
		$document = $(document),
		$body = $('body'),
		$target = $('.tabs_content.show .tabs_content_core')

	if ($body.scrollTop() + $window.height() >= $target.height()) {
		return true
	} else {
		return false
	}
}

/*
var $window = $(window),
	$document = $(document),
	$body = $('body'),
	$target = $('.tabs_content.show .tabs_content_core')
$window.scroll(function(){
	var $target = $('.tabs_content.show .tabs_content_core')
	if ($body.scrollTop() + $window.height() >= $target.height() + $('.tabs_wrap').height()) {
		console.log('down')
	} else {
		console.log('scrolling')
	}
})
*/

 $(window).scroll(function(){  
     var $this =$(this),  
		 viewH =$(this).height(),//可见高度  
		 contentH =$(this).get(0).scrollHeight,//内容高度  
		 scrollTop =$(this).scrollTop(),//滚动高度  
		 $target = $('.tabs_content.show .tabs_content_core')
		 // console.log('$target.height: ', $target.height())
		 // console.log('viewH: ', viewH)

    if(viewH + scrollTop > $target.height()){
    	$('#page_3 .down_tip').hide()
    }else{
    	$('#page_3 .down_tip').show()
    }
 });

swipe.init()
swipeHor.init()