layer.close(loading);
$(function(){
	var queue = {
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			//点击条件变颜色
			$(".conditions span").click(function(){
				var $this = $(this);
				$this.siblings().removeClass("checked");
				$this.addClass("checked");
				if($this.attr("type") == "custom"){
					$(".designer-box").show();
				}else if($this.attr("type") == "all"){
					$(".designer-box").hide();
					$(".choiced-box").hide();
				}
			});
			//确定选择设计师
			$("#certainBtn").click(function(){
				$(".designer-box").hide();
				$(".choiced-box").show();
			});
			//点击三角形
			$(".fa-caret-down").click(function(){
				$(".choiced-box").hide();
				$(".designer-box").show();
			});
			//清除选择设计师
			$("#removeBtn").click(function(){
				$(".choiced-box").hide();
				$(".designer-box").show();
			});

			//取消按钮
			$("#cancelBtn").click(function(){
				$(".designer-box input").each(function(){
					this.checked = false;
				});
			});

		}
	};

	queue.init();
});

