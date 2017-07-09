function imgViewer(params) {
    this.imgsArr = params.imgsArr;
    this.showIndex = params.showIndex || 0;
    this.minScale = params.minScale || 1;
    this.maxScale = params.maxScale || 3;

    //操作相关
    this.$scaleImgCell = null;
    this.lastScale = 1;
    this.lastX = 0;
    this.lastY = 0;
    this.scale = 1;
    this.X = 0;
    this.Y = 0;
    this.distanceX = 0;
    this.distanceY = 0;
    this.bounceFlag = false;
    this.imgOffsetTop = 0;
    this.imgOffsetLeft = 0;
    //this.matrix = [this.scale, 0, 0, this.scale, this.X, this.Y];
}

imgViewer.prototype = {
    init: function () {
        this.showImg();
        this.showIndexImg();
    },
    showImg: function () {
        var sb = "";
        sb += "<div class=\"imgViewer\">";
        for (var i = 0; i < this.imgsArr.length; i++) {
            sb += this.getImgHtml(i);
        }
        sb += "<span class=\"imgClose\">X</span>";
        sb += "<span class=\"imgRotate Left\">L</span>";
        sb += "<span class=\"imgRotate Right\">R</span>";
        sb += "</div>";
        $("body").append(sb);
    },
    getImgHtml: function (index) {
        return "<div class=\"imgCell\"><img class=\"\" src=\"" + this.imgsArr[index] + "\" /></div>";
    },
    offEvent: function () {
        $(document).off("touchstart touchmove touchend");
    },
    bindEvent: function () {
        this.lastScale = 1;
        this.lastX = 0;
        this.lastY = 0;
        this.scale = 1;
        this.X = 0;
        this.Y = 0;
        this.distanceX = 0;
        this.distanceY = 0;
        this.bounceFlag = false;
        this.imgOffsetTop = this.$scaleImgCell.position().top;
        this.imgOffsetLeft = this.$scaleImgCell.position().left;
        $(document).on("touchstart", ".imgViewer > .imgShow", function (e) {
            this.imgOffsetTop = this.$scaleImgCell.position().top;
            this.imgOffsetLeft = this.$scaleImgCell.position().left;
            if (e.touches.length >= 2) {
                var startPoints = e.touches;
                this.setImgCenterPoint(startPoints);
                $(document).off("touchmove");
                $(document).on("touchmove", function (e) {
                    var nowPoints = e.touches;
                    this.showScaleImg(this.lastScale * this.getScale(startPoints, nowPoints));
                }.bind(this));
                $(document).on("touchend", function (e) {
                    $(document).off("touchmove touchend");
                    this.showLastScaleImg();
                }.bind(this));
            } else {
                if (this.bounceFlag != true) {
                    var startX = e.pageX || e.originalEvent.touches[0].pageX;
                    var startY = e.pageY || e.originalEvent.touches[0].pageY;

                    $(document).on("touchmove", function (e) {
                        var x = e.pageX || e.originalEvent.touches[0].pageX;
                        var y = e.pageY || e.originalEvent.touches[0].pageY;
                        this.distanceX = x - startX;
                        this.distanceY = y - startY;
                        this.moveImg();
                    }.bind(this));
                    $(document).on("touchend", function (e) {
                        $(document).off("touchmove touchend");
                        this.showLast();
                    }.bind(this));
                }
            }
        }.bind(this));
    },
    setImgCenterPoint: function (points) {
        this.$scaleImgCell.css("transform-origin", ((points[0].pageX + points[1].pageX) / 2 - this.imgOffsetLeft) + "px " + ((points[0].pageY + points[1].pageY) / 2 - this.imgOffsetTop) + "px 0px");
    },
    getScale: function (startPoints, nowPoints) {
        var x1 = startPoints[0].pageX - startPoints[1].pageX;
        var y1 = startPoints[0].pageY - startPoints[1].pageY;
        var x2 = nowPoints[0].pageX - nowPoints[1].pageX;
        var y2 = nowPoints[0].pageY - nowPoints[1].pageY;
        return Math.sqrt(((y2 * y2) + (x2 * x2)) / ((y1 * y1) + (x1 * x1)));
    },
    showLastScaleImg: function () {
        //log oldScale;
        if (this.scale > this.maxScale) {
            this.scale = this.maxScale;
            this.bounceFlag = true;
        } else if (this.scale < this.minScale) {
            this.scale = this.minScale;
            this.bounceFlag = true;
        }
        this.lastScale = this.scale;
        this.showBounceImg();
    },
    showLast: function () {
        var eleWidth = this.$scaleImgCell[0].offsetWidth * this.scale;
        var offsetParentWidth = this.$scaleImgCell.offsetParent().width();
        var eleLeft = this.$scaleImgCell.position().left + this.$scaleImgCell[0].offsetLeft;
        if (eleLeft > offsetParentWidth / 3) {
            this.showIndex -= 1;
            this.showIndexImg()
        } else if (eleLeft + eleWidth < 2 * offsetParentWidth / 3) {
            this.showIndex += 1;
            this.showIndexImg()
        } else {
            this.showBounceImg();
        }
        this.distanceX = 0;
        this.distanceY = 0;
    },
    showBounceImg: function () {
        var imgWidth = this.$scaleImgCell.children("img")[0].offsetWidth * this.scale;
        var imgHeight = this.$scaleImgCell.children("img")[0].offsetHeight * this.scale;
        var cellWidth = this.$scaleImgCell[0].offsetWidth;
        var cellHeight = this.$scaleImgCell[0].offsetHeight;
        var cellLeft = parseFloat((this.$scaleImgCell[0].offsetLeft + this.$scaleImgCell.position().left).toFixed(2));
        var cellTop = parseFloat((this.$scaleImgCell[0].offsetTop + this.$scaleImgCell.position().top).toFixed(2));
        var imgLeft = parseFloat((this.$scaleImgCell.children("img")[0].offsetLeft * this.scale).toFixed(2));
        var imgTop = parseFloat((this.$scaleImgCell.children("img")[0].offsetTop * this.scale).toFixed(2));
        this.$scaleImgCell.siblings("div").css("visibility", "hidden");

        //横向
        if (imgWidth <= cellWidth) {
            this.$scaleImgCell.css("transform-origin", "");
            this.X = 0;
            this.bounceFlag = true;
        } else if (cellLeft + imgLeft > 0) {
            this.X = this.distanceX - cellLeft - imgLeft + this.lastX;
            this.bounceFlag = true;
        } else if (cellLeft + imgLeft < cellWidth - imgWidth) {
            this.X = this.distanceX + cellWidth - imgWidth - cellLeft - imgLeft + this.lastX;
            this.bounceFlag = true;
        }
        //纵向
        if (imgHeight <= cellHeight) {
            this.$scaleImgCell.css("transform-origin", "");
            this.Y = 0;
            this.bounceFlag = true;
        } else if (cellTop + imgTop > 0) {
            this.Y = this.distanceY - cellTop - imgTop + this.lastY;
            this.bounceFlag = true;
        } else if (cellTop + imgTop < cellHeight - imgHeight) {
            this.Y = this.distanceY + cellHeight - imgHeight - cellTop - imgTop + this.lastY;
            this.bounceFlag = true;
        }
        this.showTransformImg();
        if (this.bounceFlag == true) {
            this.$scaleImgCell.css("transition-duration", "300ms");
        }
        this.lastX = this.X;
        this.lastY = this.Y;
        setTimeout(function () {
            this.$scaleImgCell.css("transition-duration", "0ms");
            this.bounceFlag = false;
        }.bind(this), 300);
    },
    moveImg: function () {
        this.showPositionImg(this.distanceX + this.lastX, this.distanceY + this.lastY);
        var eleWidth = parseFloat((this.$scaleImgCell[0].offsetWidth * this.scale).toFixed(2));
        var cellWidth = parseFloat((this.$scaleImgCell[0].offsetWidth).toFixed(2));
        var eleLeft = parseFloat((this.$scaleImgCell.position().left + this.$scaleImgCell[0].offsetLeft).toFixed(2));

        //横向
        if (eleWidth < cellWidth) {
        } else if (eleLeft > 0) {
            this.getIndexImg(this.showIndex - 1).css({ "visibility": "visible", "transform": "matrix(1, 0, 0, 1, " + (this.distanceX - cellWidth + this.imgOffsetLeft - 50) + ", 0)" });
        } else if (eleLeft < cellWidth - eleWidth) {
            this.getIndexImg(this.showIndex + 1).css({ "visibility": "visible", "transform": "matrix(1, 0, 0, 1, " + (this.distanceX + eleWidth + this.imgOffsetLeft + 50) + ", 0)" });
        }
    },
    getIndexImg: function (index) {
        index = index % this.imgsArr.length;
        return $(".imgViewer > .imgCell").eq(index);
    },
    showIndexImg: function () {
        this.showIndex = this.showIndex % this.imgsArr.length;
        this.offEvent();
        $(".imgViewer > .imgCell").removeClass("imgShow");
        $(".imgViewer > .imgCell").eq(this.showIndex).addClass("imgShow");
        $(".imgViewer > .imgCell:not(.imgShow)").css("visibility", "hidden");
        this.$scaleImgCell = $(".imgViewer > .imgShow");
        this.$scaleImgCell.css({ "visibility": "visible", "transform": "matrix(1, 0, 0, 1, 0, 0)", "transition-duration": "300ms" });
        setTimeout(function () {
            this.$scaleImgCell.css("transition-duration", "0ms");
        }.bind(this), 300);
        this.bindEvent();
    },
    showScaleImg: function (scale) {
        this.scale = scale;
        this.showTransformImg();
    },
    showPositionImg: function (x, y) {
        this.X = x;
        this.Y = y;
        this.showTransformImg();
    },
    showTransformImg: function () {
        this.$scaleImgCell.css("transform", "matrix(" + this.matrix() + ")");
    },
    matrix: function () {
        return [this.scale, 0, 0, this.scale, this.X, this.Y].toString();
    }
}