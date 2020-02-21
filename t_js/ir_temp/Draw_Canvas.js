var obj_a_buf = new Array(1024);
var amb_a_buf = new Array(1024);
let chart_max_len = 50;
class Draw_Canvas {
    constructor() {
        screen.orientation.lock("portrait-primary");
        this.screen_width = screen.width;
        this.x_scale = (this.screen_width - 100) / chart_max_len;
        this.canva = document.getElementById("rt_canvas");
        //canvas.addEventListener('mousedown', down, false);
        this.canva.width = this.screen_width;
        this.canva.height = 400;
        this.x_scale = (this.screen_width - 100) / chart_max_len;
        // this.canva.style.zIndex = '10';
        //this.canva.left = "50";
        this.ctx = this.canva.getContext("2d");
        // this.ctx.globalAlpha = 0.8;
        // this.ctx.lineWidth = 1;
        // this.ctx.lineCap = "butt";
        //this.ctx.webkitImageSmoothingEnabled = false;
        //this.ctx.imageSmoothingEnabled = false;
        //this.ctx.oImageSmoothingEnabled = false;
        //this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = true;
        this.canva.addEventListener("mousedown", () => {
            if (timer_status != "null") {
                timer_status = timer_status == "pause" ? "run" : "pause";
            }
        });
    }
    get_x(w) {
        return Math.floor(w * this.x_scale + 50);
    }
    draw_chart(start, size) {
        //  ctx.setFillStyle('white')
        //  ctx.fillRect(0, 0, screen_width, 350)
        this.canva.height = this.canva.height;
        if (size >= 100) {
            for (var k = 0; k < 100; k++) {
                obj_a_buf[k] = obj_list[(k + start) & 0x1ff];
                amb_a_buf[k] = amb_list[(k + start) & 0x1ff];
            }
            //   this.alg_30102.maxim_heart_rate_and_oxygen_saturation(ir_a_buf, red_a_buf, 100, start);
            // alg_30102.maxim_heart_rate_and_oxygen_saturation(app.globalData.ir_list, app.globalData.red_list, size, start);
            //   this.alg_30102.get_30102_result(this.res_30102);
        }
        /*
        rt_page.setData({
            hr: (res_30102[1] == 1 ? res_30102[0] : " --"),
            spo2: (res_30102[3] == 1 ? res_30102[2] : " --")
        })
        */
        this.draw_line(start, size);
        this.draw_chart_frame();
        //////////// this.ctx..draw(false)
    }
    draw_line(start, size) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        //var that = this;
        var list = obj_list;
        var max = 0, min = 0xfffff;
        var delta;
        var k;
        for (var i = 0; i < size; i++) {
            k = list[(i + start) & 0x1ff];
            if (k > max)
                max = k;
            if (k < min)
                min = k;
        }
        delta = (max - min + 0.0001) * 2;
        //min=min+delta/5;
        for (var i = 0; i < size; i++) {
            var x = this.get_x(i);
            var y = 10 + (max - list[(i + start) & 0x1ff]) * 300 / delta;
            if (i == 0) {
                this.ctx.moveTo(x, y);
            }
            else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
        /*
       this.ctx.beginPath()
       this.ctx.setStrokeStyle('blue')
      
       list = obj_list;

       max = 0;
       min = 0xfffff;

       for (var i = 0; i < size; i++) {
           k = list[(i + start) & 0x1ff];
           if (k > max) max = k;
           if (k < min) min = k;
       }
       delta = (max - min + 1) * 2;
       // min = min + delta;

       for (var i = 0; i < size; i++) {

           var x = this.get_x(i)
           var y = 10 + (max - list[(i + start) & 0x1ff]) * 300 / delta;
           if (i == 0) {
               this.ctx.moveTo(x, y)
           } else {
               this.ctx.lineTo(x, y)

           }

       }
       
       this.ctx.stroke()
       */
    }
    draw_chart_frame() {
        // <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1;
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        const leftX = 50;
        const rightX = this.canva.width - 50; // parseInt(this.canva.style.width) - 50;// screen.width - 50
        const topY = 10;
        const bottomY = this.canva.height - 10;
        this.ctx.moveTo(leftX, topY);
        this.ctx.lineTo(rightX, topY);
        this.ctx.lineTo(rightX, bottomY);
        this.ctx.lineTo(leftX, bottomY);
        this.ctx.lineTo(leftX, topY);
        this.ctx.stroke();
    }
}
//# sourceMappingURL=Draw_Canvas.js.map