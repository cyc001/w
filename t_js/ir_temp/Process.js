let run_status = 0;
let cpu_id = "";
let dev_info_has_read = false;
let version_info = "";
let pid = "";
let process_state = 0;
let mcu_emissivity = 1;
let rt_obj = 0;
let rt_amb = 0;
let obj_list = [];
let amb_list = [];
class Process extends Draw_Canvas {
    constructor() {
        super();
        this.recv_buf = [];
        this.sample_count = 0;
        this.package_size = 64;
        this.recv_total_pack_count = 0;
        this.recv_data_pack_count = 0;
        this.obj_text_div = document.getElementById("rt_obj_div");
        this.amb_text_div = document.getElementById("rt_amb_div");
        // this.recv_buf = new Int8Array();
    }
    draw_chart_0() {
        var t_head;
        if (this.recv_data_pack_count < 1) {
            return;
        }
        if (this.recv_data_pack_count < chart_max_len) {
            this.draw_chart(0, this.sample_count);
        }
        else {
            var sc = this.sample_count;
            var sc1 = this.sample_count;
            if (sc == sc1) {
                if (sc >= chart_max_len) {
                    t_head = sc - chart_max_len;
                }
                else {
                    t_head = 512 - chart_max_len + sc;
                }
                this.draw_chart(t_head, chart_max_len);
            }
        }
    }
    rcv_data_input(d) {
        var kk = Array.prototype.slice.call(new Uint8Array(d.buffer));
        this.recv_buf = this.recv_buf.concat(kk);
        while (1 == this.rcv_data_process()) { }
        ;
    }
    rcv_data_process() {
        var len = this.recv_buf.length;
        if (len < 16)
            return 0; //this.package_size
        this.recv_total_pack_count++;
        if (this.recv_buf[0] == 0x30 && this.recv_buf[15] == 'A'.charCodeAt(0)) {
            switch (this.recv_buf[1]) {
                case 'h'.charCodeAt(0):
                    db_msg("\r\nhello");
                    break;
                case 'p'.charCodeAt(0):
                    cpu_id = "";
                    for (var i = 0; i < 12; i++) {
                        cpu_id += this.recv_buf[2 + i].toString(16);
                        //  s_pid1 += device_pid[i].ToString("X2") + "";
                    }
                    dev_info_has_read = true;
                    break;
                case 'q'.charCodeAt(0):
                    version_info = "";
                    for (var i = 0; i < 12; i++) {
                        version_info += this.recv_buf[2 + i].toString(16);
                    }
                    break;
                case 'e'.charCodeAt(0):
                    var loc = 3;
                    mcu_emissivity = this.recv_buf[loc] * 1 + this.recv_buf[loc + 1] * 0.1 + this.recv_buf[loc + 2] * 0.01 + this.recv_buf[loc + 3] * 0.001 + this.recv_buf[loc + 4] * 0.0001;
                    break;
                case 't'.charCodeAt(0):
                    switch (process_state) {
                        case 1:
                            process_state = 2;
                            //save data
                            break;
                        case 2:
                            break;
                        case 0:
                            rt_obj = this.Cal_temp(2, this.recv_buf);
                            rt_amb = this.Cal_temp(7, this.recv_buf);
                            obj_list[this.sample_count] = rt_obj;
                            amb_list[this.sample_count] = rt_amb;
                            this.sample_count = (this.sample_count + 1) & 0x1ff;
                            this.recv_data_pack_count++;
                            this.obj_text_div.innerText = rt_obj.toFixed(2) + degree_str + " ";
                            this.amb_text_div.innerHTML = "<br> <br>  @ " + rt_amb.toFixed(2) + degree_str;
                            break;
                    }
                    break;
                default:
                    db_msg("E1");
                    break;
            }
            this.recv_buf.splice(0, 16);
        }
        else {
            this.recv_buf.splice(0, 1);
        }
        return 1;
    }
    Cal_temp(loc, data) {
        return data[loc] * 100.0 + data[loc + 1] * 10.0 + data[loc + 2] + data[loc + 3] * 0.1 + data[loc + 4] * 0.01 - 273.15;
    }
    Cal_cent_Fah(c, is_centigrade) {
        return is_centigrade ? c : (32 + c * 1.8);
    }
}
//# sourceMappingURL=Process.js.map