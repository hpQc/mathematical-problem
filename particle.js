window.onload = function () {
    // 获取画布
    var canvas = document.querySelector("#content");
    var context = canvas.getContext("2d");

    // 封装函数工具
    // 画点
    function drawCircle(x, y, r, color) {
        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, r, Math.PI / 180 * 0, Math.PI / 180 * 360);
        context.fill();
    }

    // 画粒子的图像和方法
    class ball {
        constructor(dx, dy) {
            this.x = range(w);
            this.y = range(h);
            this.dx = dx;
            this.dy = dy;
            this.initialX = this.dx - this.x;
            this.initialY = this.dy - this.y;
            this.time = 100;
            this.r = 1.5;
            this.color = colorR();
        }

        draw(count) {
            this.x += this.initialX * 2 / this.time * (1 - count / this.time);
            this.y += this.initialY * 2 / this.time * (1 - count / this.time);
            drawCircle(this.x, this.y, this.r, this.color);
        }
    }

    // 生成随机数
    function range(i) {
        return Math.random() * i;
    }

    function intR(i) {
        return Math.floor(Math.random() * i);
    }

    // 随机颜色
    function colorR() {
        let key = range(1);
        if (key > 0.3) {
            return '#fff';
        } else return '#838383';
    }

    // 筛选粒子位置
    function getImgData(img) {
        context.clearRect(0, 0, w, h);
        context.drawImage(img, 0, 0, w, h);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        var copy = context.getImageData(0, 0, w, h);
        img.ballArr = [];
        context.clearRect(0, 0, w, h);
        for (var y = 0; y < h; y += 8) {
            for (var x = 0; x < w; x += 8) {
                var index = x + y * w;
                var a = copy.data[index * 4 + 3];
                if (a > 100) {
                    let bal = new ball(x, y);
                    img.ballArr.push(bal);
                }
            }
        }
    }

    // 设置动画
    function animateBall(img) {
        var count = 1;
        clearInterval(t1);
        t1 = setInterval(function () {
            context.clearRect(0, 0, w, h);
            for (var i = 0; i < img.ballArr.length; i++) {
                img.ballArr[i].draw(count);
            }
            if (count == 100) {
                clearInterval(t1);
            }
            count++;
        }, 30);
    }

    // 开始动画
    function start(a, b, t) {
        setTimeout(() => {
            relateTow(a, b);
            animateBall(a);
        }, 7500 * t);
    }

    //连接两个数组
    function relateTow(a, b) {
        for (let i = 0; i < a.ballArr.length; i++) {
            let v = intR(b.ballArr.length);
            a.ballArr[i].x = b.ballArr[v].dx;
            a.ballArr[i].initialX = a.ballArr[i].dx - a.ballArr[i].x;
            a.ballArr[i].y = b.ballArr[v].dy;
            a.ballArr[i].initialY = a.ballArr[i].dy - a.ballArr[i].y;
        }
    }

    // 获取所有的图形，粒子位置信息
    var img1 = new Image();
    var img2 = new Image();

    img1.src = './image/加油.png';
    img2.src = './image/氵了鸭_ba-style@nulla.top.png';

    var t1; //定时器

    // 初始画布宽高
    var w = 500;
    var h = 500;
    canvas.width = w;
    canvas.height = h;

    window.addEventListener('resize', function () {
        // 当屏幕宽度小于500px时，以屏幕宽度为准
        if (window.innerWidth < 500) {
            w = window.innerWidth;
            h = window.innerWidth;
        } else {
            w = 500;
            h = 500;
        }
        canvas.width = w;
        canvas.height = h;
        getImgData(img1);
        getImgData(img2);
    });

    img1.onload = function () {
        getImgData(img1);
    };

    img2.onload = function () {
        getImgData(img2);
    };

    setTimeout(() => {
        const target = () => {
            start(img1, img2, 0);
            start(img2, img1, 1);
            return target;
        };
        setInterval(target(), 15000);
    }, 100);
};