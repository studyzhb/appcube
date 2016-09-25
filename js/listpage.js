$(function(){
	
	
	$(window).resize(function(){
//		listLiWidth=0.2*$(document).width();
		listPage.getData();
	});
	
	$("#listApp ul").on('mouseenter','li',function(e){
		var dir=listPage.checkInarea(this,e);
		var $div=$(this).find('div');
		var w=$(this).width();
		var h=$(this).height();
		console.log(dir);
		console.log(w,h);
		switch(dir){
			case 1:
				$div.css({
					left:0,
					top:-h+"px",
					display:'block'
				}).animate({top:0},500);
				break;
			case 2:
				$div.css({
					top:0,
					left:w+"px",
					display:'block'
				}).animate({left:0},500);
				break;
			case 3:
				$div.css({
					left:0,
					top:h+"px",
					display:'block'
				}).animate({top:0},500);
				break;
			case 4:
				$div.css({
					top:0,
					left:-w+"px",
					display:'block'
				}).animate({left:0},500);
				break;
			default:
				break;
		}
	});
	
	$("#listApp ul").on('mouseleave','li',function(e){
		var dir=listPage.checkInarea(this,e);
		var $div=$(this).find('div');
		var w=$(this).width();
		var h=$(this).height();
		switch(dir){
			case 1:
				$div.animate({top:-h},500,function(){
					$(this).css('display','none');
				});
				break;
			case 2:
				$div.animate({left:w},500,function(){
					$(this).css('display','none');
				});
				break;
			case 3:
				$div.animate({top:h},500,function(){
					$(this).css('display','none');
				});
				break;
			case 4:
				$div.animate({left:-w},500,function(){
					$(this).css('display','none');
				});
				break;
			default:
				break;
		}
	});
	
	var listPage={
		/**
		 * @param {String} kind 分类
		 * @param {Number} pn 当前显示的哪一页内容
		 */
		getData:function(kind,pn){
			this.getWidth();
			this.pn=pn||1;
			this.rows=2;
			kind?this.kind=kind:'';
			var me=this;
			$.get("jsontxt/list.txt",function(data){
				$("#listApp ul li").css({width:0,padding:0,margin:0});
				$('#listApp footer a').remove();
				var objGoods=eval("("+data+")");
				me.kindAll=objGoods['all'];
				me.index=0;
				me.page=1;
				me.cols=Math.floor($(document).width()/me.listLiWidth)-1;
				me.pageTotal=me.cols*me.rows;
				me.firstLoad=true;
				console.log(me.pageTotal,me.cols);
				if(me.kind&&me.kind!="all"){
					me.con=me.kindAll[me.kind];
					me.updatePage(me.con);
				}else{
					if(me.kindAll){
						if(me.firstLoad){
							for (var i in me.kindAll) {
								me.updatePage(me.kindAll[i]);
							}
							me.firstLoad=false;
						}
					}else{
						alert("数据有误，请重新选择！！！！");
						return;
					}
				}
				
			});
		},
		getWidth:function(){
			this.width=$(document).width();
			if(this.width>1000){
				this.listLiWidth=this.width*0.2;
			}else if(this.width>=700){
				this.listLiWidth=this.width*0.25;
			}else{
				this.listLiWidth=this.width*0.5;
			}
		},
		updateTitle:function(str){
//			$("<li>").appendTo($("#kindDetail")).html("<a href='javascript:;'>"+str+"</a>");
		},
		showPageNum:function(){
			var me=this;
			$('#listApp footer').html('');
			if(me.page>1){
				for (var i=0;i<me.page-1;i++) {
					var $a=$('<a>').appendTo($('#listApp footer')).html(i+1);
					if(me.page==me.pn){
						$a.addClass('current').siblings('a').removeClass();
					}
				}
				
			}
		},
		updatePageCon:function(){
			
		},
		showCon:function($obj){
			var me=this;
			if(me.index>=me.pageTotal*(me.pn-1)&&me.index<me.pageTotal*me.pn){
				$obj.css({
					"width":me.listLiWidth,
					"margin-left":"10px",
					"padding":"10px"
				});
			}
		},
		updatePage:function(arr){
			$('#listApp footer a:first').addClass('current');
			var me=this;
			$.each(arr,function(index,item){
				if(me.firstLoad){
					if(me.index%me.pageTotal==0){
						me.page++;
					}
					var $li=$("<li>").appendTo($("#listApp ul"))
									.css({
										"background-image":"url("+item.imgsrc+")",
										"width":0,
										padding:0,
										margin:0
									});
					$("<div>").appendTo($li).html("<a>"+item.con+"</a>").css('display','none');
				}
				me.showCon($li);
				me.index++;
			});
			
			me.showPageNum();
		},
		checkInarea:function(obj,e){
			var lT={x:-$(obj).width()/2,y:$(obj).height()/2};
			var rT={x:$(obj).width()/2,y:$(obj).height()/2};
			var lB={x:-$(obj).width()/2,y:-$(obj).height()/2};
			var rB={x:$(obj).width()/2,y:-$(obj).height()/2};
		
			var lTH=Math.atan2(lT.y,lT.x);
			var rTH=Math.atan2(rT.y,rT.x);
			var lBH=Math.atan2(lB.y,lB.x);
			var rBH=Math.atan2(rB.y,rB.x);
			
			var cenBaseX=$(obj).offset().left+$(obj).width()/2;
			var cenBaseY=$(obj).offset().top+$(obj).height()/2;
			
			var dX=e.pageX-cenBaseX;
			var dY=e.pageY-cenBaseY;
			
			var mH=Math.atan2(-dY,dX);
			
			if(mH>=rBH&&mH<rTH){
			//右边 
			return 2;
			}else if(mH>=rTH&&mH<lTH){
			//上边 
			return 1;
			}else if(mH>=lBH&&mH<rBH){
			//下边 
			return 3;
			}else{
			//左边 
			return 4;
			}
		}
	};
	
	listPage.getData();
	
	/**
	 * 绑定分类的点击事件
	 */
	$("#appKind").on("click","div",function(){
		$(this).addClass('selc').siblings().removeClass();
		listPage.getData($(this).data('name'));
		console.log($(this).data('name'));
	});
	
	/**
	 * 分页的点击事件
	 */
	$('#listApp footer').on('click','a',function(){
		listPage.getData('',Number($(this).text()));
		$(this).addClass('current').siblings('a').removeClass();
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	



});
