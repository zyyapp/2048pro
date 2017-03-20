class Num extends eui.Image {
	public constructor(type) {
		super();
		this.NumType = type;
	}

	private _NumType: Number;
	public get NumType(): Number {
		return this._NumType;
	}
	public set NumType(v: Number) {
		this._NumType = v;
		var str = "number_" + <number>v;
		//console.log(str);
		this.source = RES.getRes(str);
	}

}