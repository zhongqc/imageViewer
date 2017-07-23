/**
 * Created by Zhongqc on 2017/7/7.
 */
class imageViewer {
    images: Array<string>;
    minScale: number;
    maxScale: number;
    showIndex: number;
    imageShowCell: HTMLElement;

    private startPoints: TouchList;

    private matrix: {X: number, Y: number, scale: number};

    constructor(images: Array<string>, minScale: number = 1, maxScale: number = 3, showIndex: number = 0) {
        this.images = images;
        this.minScale = minScale;
        this.maxScale = maxScale;
        this.showIndex = showIndex;
        this.showImages();
    }

    showImages() {
        let imageViewerContent = document.createElement("div");
        imageViewerContent.id = "imageViewer";
        for (let i: number = 0; i < this.images.length; i++) {
            imageViewerContent.appendChild(this.getImageCell(i));
        }
        document.getElementsByTagName("body")[0].appendChild(imageViewerContent);
        this.showIndexImage();
    }

    getImageCell(i: number) {
        let imgCell = document.createElement("div");
        imgCell.className = "imgCell";
        let img = document.createElement("img");
        img.src = this.images[i];
        imgCell.appendChild(img);
        return imgCell;
    }

    showIndexImage() {
        this.showIndex = this.showIndex % this.images.length;
        //上次显示的cell
        let lastImageShowCell = document.getElementById("imageViewer").getElementsByClassName("imageShow")[0];
        //移除显示cell的imageShow class
        if (lastImageShowCell != null) {
            let classNameArr = lastImageShowCell.className.split(' ');
            for (let i: number = 0; i < classNameArr.length; i++) {
                if (classNameArr[i] == "imageShow") {
                    classNameArr.splice(i, 1);
                    break;
                }
            }
            lastImageShowCell.className = classNameArr.join(" ");
        }
        this.imageShowCell = <HTMLElement>document.getElementById("imageViewer").getElementsByClassName("imgCell")[this.showIndex];
        this.imageShowCell.className += " imageShow";
        this.bindTouchEvent();
    }

    unbindTouchEvent() {
        document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].removeEventListener("touchstart", this.imageShowTouchStart, false);
    }

    bindTouchEvent() {
        this.imageShowCell.addEventListener("touchstart", this.imageShowTouchStart, false);
    }

    imageShowTouchStart(e: TouchEvent) {
        if (e.touches.length >= 2) {
            this.startPoints = e.touches;
            document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].removeEventListener("touchmove", this.imageShowTouchMove, false);
            document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].addEventListener("touchmove", this.imageShowTouchScale, false);
            document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].addEventListener("touchend", this.imageShowTouchEnd, false);
        } else {

        }
    }

    imageShowTouchScale(e: TouchEvent) {
        let nowPoints = e.touches;
        // console.log(nowPoints);
        this.showScaleImg(imageViewer.getMovingScale(this.startPoints, nowPoints));

    }

    imageShowTouchMove(e: TouchEvent) {

    }

    imageShowTouchEnd(e: TouchEvent) {

    }

    private static getMovingScale(startPoints: TouchList, nowPoints: TouchList) {
        let distanceX1 = startPoints[0].pageX - startPoints[1].pageX;
        let distanceY1 = startPoints[0].pageY - startPoints[1].pageY;
        let distanceX2 = nowPoints[0].pageX - nowPoints[1].pageY;
        let distanceY2 = nowPoints[0].pageY - nowPoints[1].pageY;
        return Math.sqrt(((distanceY2 * distanceY2) + (distanceX2 * distanceX2)) / ((distanceY1 * distanceY1) + (distanceX1 * distanceX1)));
    }


    showScaleImg(scale) {
        this.matrix.scale = scale;
        this.showTransformImg();
    }

    showPositionImg(x, y) {
        this.matrix.X = x;
        this.matrix.Y = y;
        this.showTransformImg();
    }

    showTransformImg() {
        this.imageShowCell.style.transform = `matrix(${this.getMatrixStr()})`;
    }

    getMatrixStr () {
        return [this.matrix.scale, 0, 0, this.matrix.scale, this.matrix.X, this.matrix.Y].toString();
    }
}