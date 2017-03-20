class Game extends eui.Component {
	public lb_score: eui.Label;
	public lb_best: eui.Label;
	public btn_restart: eui.Button;
	public bg: eui.Image;
	public gp_tile: eui.Group;
	public gp_num: eui.Group;
	public back_tile: Tile = null;
	public num: Num = null;
	public size: number = 4;
	public num_array: number[] = [];
	//tile之间的缝隙
	public gap: number = 10;
	//每个tile的尺寸
	public tile_size: number;
	private isover: boolean = false;
	public img_over: eui.Image;
	public img_failed: eui.Image;
	public img_success: eui.Image;
	public btn_restart1: eui.Button;//降低
	public btn_restart2: eui.Button;//提高
	public score: number = 0;
	public best: number = 0;
	public lb_explain: eui.Label;//说明
	public lb_title: eui.Label;//标题
	public level: number = 3;
	public goal: number = 2048;
	public img_win: eui.Image;
	public img_bad: eui.Image;
	public btn_more: eui.Button;
	public constructor() {
		super();

		this.skinName = "resource/skins/game.exml";
		this.btn_restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_restart, this);
		this.btn_restart1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_restart1, this);
		this.btn_restart2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_restart2, this);
		this.btn_more.addEventListener(egret.TouchEvent.TOUCH_TAP, this.more, this);
		if (egret.MainContext.deviceType != egret.MainContext.DEVICE_MOBILE) {
			var self = this;
			document.addEventListener("keydown", function (event: KeyboardEvent) {
				switch (event.keyCode) {
					case 38://up
						self.doMove("up");
						break;
					case 39://right
						self.doMove("right");
						break;
					case 40://down
						self.doMove("down");
						break;
					case 37://left
						self.doMove("left");
						break;
					case 87://up
						self.doMove("up");
						break;
					case 68://right
						self.doMove("right");
						break;
					case 83://down
						self.doMove("down");
						break;
					case 65://left
						self.doMove("left");
						break;
				}
			});
		} else {
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN , this.mouseDownHandle , this);
		}
       

		//九宫格放大背景图
		this.bg.scale9Grid = new egret.Rectangle(20, 20, 65, 65);
		//放大后的尺寸
		this.bg.width = 520;
		this.bg.height = this.bg.width;
		this.game_bg();
		for (var i = 0; i < Math.pow(this.size, 2); i++) {
			this.num_array[i] = 0;
		}
		//console.log(this.num_array);

		this.random_num();
		this.random_num();
		this.best = Number(egret.localStorage.getItem("best"));
		this.lb_best.text = this.best.toString();
	}
	public title(type) {
		this.lb_title.text = type;
		this.lb_explain.text = "合并数字直到出现" + type;
		this.goal = type;
	}
private downPoint:egret.Point;
private movePoint:egret.Point;
private mouseDownHandle(event:egret.TouchEvent):void
{
    this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.stage_mouseMoveHandler,this);
    this.addEventListener(egret.TouchEvent.TOUCH_END,this.stage_mouseUpHandler,this);
    this.addEventListener(egret.Event.LEAVE_STAGE,this.stage_mouseUpHandler,this);

    this.downPoint = this.globalToLocal(event.stageX, event.stageY);
}

private needMove:boolean;
private stage_mouseMoveHandler(event:egret.TouchEvent):void{
    if(!this.movePoint)
        this.movePoint = new egret.Point();
    this.movePoint.x = event.stageX;
    this.movePoint.y = event.stageY;
    if (this.needMove)
        return;
    this.needMove = true;
}

public stage_mouseUpHandler(event:egret.Event):void{
   this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,
        this.stage_mouseMoveHandler,
        this);
    this.removeEventListener(egret.TouchEvent.TOUCH_END,
        this.stage_mouseUpHandler,
        this);
    this.addEventListener(egret.Event.LEAVE_STAGE,
        this.stage_mouseUpHandler,
        this);
    if(this.needMove){
        this.updateWhenMouseUp();
        this.needMove = false;
    }
}

/**
 * 移动设备上，判断移动方向
 */
private updateWhenMouseUp():void
{
    var p:egret.Point = this.globalToLocal(this.movePoint.x, this.movePoint.y );
    var offSetX:number = p.x - this.downPoint.x;
    var offSetY:number = p.y - this.downPoint.y;

    if(offSetY<0 && Math.abs(offSetY)>Math.abs(offSetX))  //上
    {
        this.doMove("up");
    }
    else if(offSetX>0 &&offSetX>Math.abs(offSetY))  //右
    {
        this.doMove("right");
    }
    else if(offSetY>0 &&offSetY>Math.abs(offSetX))  //下
    {
        this.doMove("down");
    }
    else if(offSetX<0&&Math.abs(offSetX)>Math.abs(offSetY))  //左
    {
        this.doMove("left");
    }
}	
	//重新开始
	public onclick_restart() {
//this.gameove(0);
		switch (this.level) {
			case 1: //512
				this.title(512);
				break;
			case 2: //1024
				this.title(1024);
				break;
			case 3: //2048
				this.title(2048);
				break;
			case 4: //4096
				this.title(4096);
				break;
			case 5: //8192
				this.title(8192);
				break;
		}

		//移除所有图片
		for (var i = 0, len = this.num_array.length; i < len; i++) {
			if (this.num_array[i] != 0) {
				this.num_array[i] = 0;
				var num = <Num>this.gp_num.getChildByName(i.toString());
				this.gp_num.removeChild(num);
			}
		}
		this.score = 0;
		this.lb_score.text = this.score.toString();
		this.isover = false;
		this.img_over.visible = false;
		this.img_failed.visible = false;
		this.img_success.visible = false;
		this.btn_restart1.visible = false;
		this.btn_restart2.visible = false;
		this.img_bad.visible = false;
		this.img_win.visible = false;
		this.btn_more.visible = false;
		this.random_num();
		this.random_num();
	}
	public onclick_restart1() {
		if (this.level > 1) {
			this.level -= 1;
			this.onclick_restart();
		} else {
			this.img_bad.visible = true;
		}

	}
	public onclick_restart2() {
		if (this.level < 5) {
			this.level += 1;
			this.onclick_restart();
		} else {
			this.img_win.visible = true;
		}

	}

	//创建背景
	public game_bg() {
		this.tile_size = (this.gp_tile.width - (this.size + 1) * this.gap) / this.size;
		//循环放置tile
		for (var i = 0; i < this.size; i++) {
			for (var j = 0; j < this.size; j++) {
				this.back_tile = new Tile();
				this.back_tile.width = this.back_tile.height = this.tile_size;
				this.back_tile.x = j * (this.tile_size + this.gap) + this.gap;
				this.back_tile.y = i * (this.tile_size + this.gap) + this.gap;
				this.gp_tile.addChild(this.back_tile);
			}

		}
	}
	//创建随机数字
	public random_num() {

		//	var index = y * 4 + x;
		var j = 0;
		for (var i = 0, len = this.num_array.length; i < len; i++) {
			if (this.num_array[i] == 0) {
				//还有空格
				j = 1;
			}
		}
		if (j == 0) {
			//没有空格了就不增加了
			return;
		}
		var num = 1;
		//防止添加到重复的地方
		while (num > 0) {
			var index = Math.round(Math.random() * Math.pow(this.size, 2));
			num = this.num_array[index];
		}

		this.num_array[index] = 1;
		//console.log(index);

		this.create_num(index, 1);
	}

	public create_num(index, num) {
		var x = index % this.size;
		//	console.log(x);

		var y = Math.floor(index / this.size);
		//console.log(y);
		this.num = new Num(num);
		this.num.name = index;
		this.num.width = this.num.height = this.tile_size;
		this.num.x = x * (this.tile_size + this.gap) + this.gap;
		this.num.y = y * (this.tile_size + this.gap) + this.gap;
		//console.log(this.num.x);		
		this.gp_num.addChild(this.num);
	}
	public touch_begin(e: egret.TouchEvent) {
		//console.log(e.stageX);
	//	console.log(e.stageY);

	}
	public touch_end(e: egret.TouchEvent) {

	}
	public touch_move(e: egret.TouchEvent) {

	}
	//移动
	public doMove(direction) {
		if (this.isover) {
			return;
		}
		switch (direction) {
			case "up":
				//循环
				for (var i = 4, len = this.num_array.length; i < len; i++) {
					var j = i;
					while (j >= 4) {
						this.merge(j - 4, j);
						j -= 4;
					}
				}

				break;
			case "right":
				//console.log('right');
				for (var i = 14; i >= 0; i--) {
					j = i;
					while (j % 4 != 3) {
						this.merge(j + 1, j);
						j += 1;
					}
				}

				break;
			case "down":
				//console.log('down');
				for (var i = 11; i >= 0; i--) {
					j = i;
					while (j <= 11) {
						this.merge(j + 4, j);
						j += 4;
					}
				}

				break;
			case "left":
				//console.log('left');
				for (var i = 1, len = this.num_array.length; i < len; i++) {
					j = i;
					while (j % 4 != 0) {
						this.merge(j - 1, j);
						j -= 1;
					}
				}

				break;
		}
		this.random_num();
		if (this.iswin()) {
			this.gameove(1);
		}
		if (this.islose()) {
			this.gameove(0);
		}

	}
	//合并方块
	public merge(prevTile, currTile) {
		if (this.num_array[currTile] != 0) {

			this.setTile(prevTile, currTile);

		}
	}
	//设置方块
	public setTile(prevTile, currTile) {
		//如果目标数组不等于0
		if (this.num_array[prevTile] != 0) {
			//如果相同
			if (this.num_array[prevTile] == this.num_array[currTile]) {
				//移除目标图片
				var prevnum = <Num>this.gp_num.getChildByName(prevTile);
				this.gp_num.removeChild(prevnum);
				//设置目标数组
				this.num_array[prevTile] = this.num_array[prevTile] + 1;
				//设置目标图片
				this.create_num(prevTile, this.num_array[prevTile]);
				//移除现在的图片
				var currnum = <Num>this.gp_num.getChildByName(currTile);
				this.gp_num.removeChild(currnum);
				//设置现在的数组
				this.num_array[currTile] = 0;
				//设置现在的图片
				//已经移除不用设置
				//分数增加
				this.score += Math.pow(2, this.num_array[prevTile]);
				this.lb_score.text = this.score.toString();
				//更新最高分数
				if (this.score > this.best) {
					this.best = this.score;
					this.lb_best.text = this.best.toString();
					egret.localStorage.setItem("best", this.best.toString());
				}
			}

		} else {//如果目标数组是0
			//设置目标数组
			this.num_array[prevTile] = this.num_array[currTile];
			//目标图片变成现在的
			this.create_num(prevTile, this.num_array[prevTile]);
			//设置现在的数组
			this.num_array[currTile] = 0;
			//移除现在的图片
			var currnum = <Num>this.gp_num.getChildByName(currTile);
			this.gp_num.removeChild(currnum);
		}

	}
	//判断游戏是否结束
	public islose(): boolean {
		for (var i = 0, len = this.num_array.length; i < len; i++) {
			//如果还有空格说明没有结束
			if (this.num_array[i] == 0) {
				return false;
			}
			//如果不是每行的最后一个
			if (i % 4 != 3) {
				//判断相邻的两个的值是否相同,如果相同说明游戏还没有结束
				if (this.num_array[i] == this.num_array[i + 1]) {
					return false;
				}
			}
			//判断每列上下两个是否相同，如果有相同的说明游戏没有结束
			if (i < 12) {
				if (this.num_array[i] == this.num_array[i + 4]) {
					return false;
				}
			}
		}

		return true;
	}
	//判断是否胜利
	public iswin(): boolean {
		for (var i = 0, len = this.num_array.length; i < len; i++) {
			if (Math.pow(2, this.num_array[i]) == this.goal) {

				return true;
			}
		}
	}
	//游戏结束
	public gameove(type:number) {
		this.isover = true;
		//显示遮罩和重新开始按钮
		this.img_over.visible = true;
		this.btn_more.visible = true;
		if (type == 0) {
			this.img_failed.visible = true;
			this.btn_restart1.visible = true;
		} else {
			this.img_success.visible = true;
			this.btn_restart2.visible = true;
		}
		

	}
public more(){
	location.href="http://game.zyyapp.com";
}
}