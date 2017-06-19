;
(function (w, d) {
	//获取类名元素
	var $ = function (id, parent) {
			return (parent || document).querySelectorAll(id);
		}
		//创建id元素
	var crtEle = function (id) {
		return document.createElement(id);
	}

	let index = 0,
		clsName = "layer",
		loop = function () {},
		extend = function (target, opts) {
			for (var key in opts) {
				target[key] = opts[key];
			}

			return target;
		},
		timer = {}; //定时器初始值

	function mLayer(opts) {
		this.settings = {
			shadow: true,
			type: 1,
			shadowClose: true,
			init: loop,
			yes: loop,
			cancel: loop,
			end: loop,
		}

		extend(this.settings, opts)
		this.render();
	}

	mLayer.prototype.render = function () {
		this.index = index;
		var settings = this.settings;


		//主体
		var layerBox = this.layerBox = document.createElement("div");
		this.id = layerBox.id = clsName + index;
		layerBox.className = clsName + " " + clsName + settings.type;

		//阴影
		let shadeEle = settings.shadow ? "<div class='" + clsName + "-mask layer-fadeIn'></div>" : "";
		let titleEle = settings.title ? "<div class='" + clsName + "-title" + "'> " + settings.title + " </div>" : "";
		let contentEle = this.contentEle = settings.content ? "<div class='layer-content'>" + settings.content + "</div>" : "";

		if (settings.type === 2) {
			let msgEle = "<div class='layer-msg layer-fadeIn'>" + settings.content + "</div>";
			this.layerBox.innerHTML = shadeEle + msgEle;
			this.show();
			return
		}

		if (settings.type === 3) {
			//??????
			mlayer.closeAll(3);
			let loadEle = "<div class='layer-loading layer-fadeIn'></div>";
			this.layerBox.innerHTML = shadeEle + loadEle;
			this.show();
			return
		}

		var btnEle = "";
		if (settings.btns) {
			typeof settings.btns === "string" && (settings.btns = [settings.btns]);
			var btnEle = "<span class='layer-btn layer-btn-yes'>" + settings.btns[0] + "</span>";
			//如果按钮的个数大于2个
			if (settings.btns.length >= 2) {
				btnEle += "<span class='layer-btn layer-btn-no'>" + settings.btns[1] + "</span>";
			}
			btnsEle = "<div class='layer-btns'>" + btnEle + "</div>";
		}

		layerBox.innerHTML = shadeEle + "<div class='layer-main layer-scaleIn'>" + titleEle + contentEle + btnsEle + "</div>";

		this.show();
	}

	//显示
	mLayer.prototype.show = function () {
			this.settings.init();

			document.body.appendChild(this.layerBox);
			this.ele = $("#" + clsName + index)[0];
			index++;
			this.action();
		}
		//点击
	mLayer.prototype.action = function () {
		var that = this;
		var settings = this.settings;

		if (settings.time) {
			timer[this.index] = setTimeout(mlayer.close, settings.time, this);
		}

		this.shadowEle = $(".layer-mask", this.ele)[0];
		this.yesBtn = $(".layer-btn-yes", this.ele)[0];
		this.noBtn = $(".layer-btn-no", this.ele)[0];

		if (settings.shadowClose && this.shadowEle) {
			this.shadowEle.addEventListener("click", function () {
				var cliked = this.getAttribute("click");

				if (!cliked) {
					settings.cancel(that);
					mlayer.close(that);
				}

				this.setAttribute("click", "clicked")
			});
		}

		if (this.yesBtn) {
			this.yesBtn.addEventListener("click", function (e) {
				let cliked = this.getAttribute('click');

				if (!cliked) {
					settings.yes(that);
					mlayer.close(that);
				}

				this.setAttribute("click", "clicked")
			});
		}

		if (this.noBtn) {
			this.noBtn.addEventListener("click", function (e) {
				let cliked = this.getAttribute('click');

				if (!cliked) {
					settings.cancel(that);
					mlayer.close(that);
				}

				this.setAttribute("click", "clicked")
			});
		}
	}

	w.mlayer = {
		//实例化对象
		open(opts) {
				return new mLayer(opts)
			},
			//
			close(layer) {
				clearInterval(timer[layer.index]);

				layer.ele.innerHTML = "";
				document.body.removeChild(layer.ele);
				layer.settings.end(layer);
			},
			//删除元素
			closeAll(type) {
				let eles = $("." + clsName + (type ? type : ""));
				for (let i = 0; i < eles.length; i++) {
					eles[i].innnerHTML = "";
					eles[i].parentNode.removeChild(eles[i]);
				}
			},
			//弹出框
			alert(content, opts) {
				return new mLayer(extend({
					type: 1,
					title: "信息",
					content: content,
					btns: "确定",
					shadowClose: false
				}, opts));
			},
			//确认框
			confirm(content, opts) {
				return new mLayer(extend({
					type: 1,
					title: "信息",
					content: content,
					btns: ["确定", "取消"],
					shadowClose: false
				}, opts));
			},
			load(opts) {
				opts = opts || {}
				opts.type = 3;
				opts.shadowClose = false;
				return new mLayer(opts);
			},
			msg(content, time) {
				return new mLayer({
					type: 2,
					shadowClose: false,
					content: content || '',
					time: time || 4000,
					shadow: false
				});
			}
	}


})(window, document)