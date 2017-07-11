/**
 * Created by Zhongqc on 2017/7/7.
 */
class imageViewer {
    images: Array<string>;
    minScale: number;
    maxScale: number;
    showIndex: number;
    imageShowCell: Element;

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
        let lastImageShowCell = document.getElementById("imageViewer").getElementsByClassName("imageShow")[0];
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
        this.imageShowCell = document.getElementById("imageViewer").getElementsByClassName("imgCell")[this.showIndex];
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
            let startPoints = e.touches;
            document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].removeEventListener("touchmove", this.imageShowTouchMove, false);
            document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].addEventListener("touchmove", this.imageShowTouchScale, false);
            document.getElementById("imageViewer").getElementsByClassName("imageShow")[0].addEventListener("touchend", this.imageShowTouchEnd, false);
        } else {

        }
    }

    imageShowTouchScale(e: TouchEvent) {
        let nowPoints = e.touches;
        console.log(nowPoints);
    }

    imageShowTouchMove(e: TouchEvent) {

    }

    imageShowTouchEnd(e: TouchEvent) {

    }
}