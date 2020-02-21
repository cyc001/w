//import * as CP210x from './t_js/WebUsbSerial'
var dev;
var db;
var process;
var ble;
let begin_bytes = new Uint8Array([0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39]);
let pause_bytes = new Uint8Array([0x30, 0x30, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39]);
let heart_bytes = new Uint8Array([0x30, 'h'.charCodeAt(0), 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39]);
let get_emt_bytes = new Uint8Array([0x30, 0x32, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39]);
let degree_str = "℃"; //°F
let timerToken;
let timer_status = "null";
class Greeter {
    constructor(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
        db = document.getElementById('debug');
        process = new Process();
        dev = new Dev();
        ble = new BLE();
    }
    start() {
        timerToken = setInterval(() => this.test(), 500);
        timer_status = "run";
    }
    stop() {
        clearTimeout(timerToken);
    }
    test() {
        if (timer_status == "pause")
            return;
        process.draw_chart_0();
        dev.write(begin_bytes);
    }
}
window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
    var t = document.getElementById("editor");
    document.getElementById("connect").addEventListener("click", () => {
        var prefix = { "name": "cyccyc_ETH" };
        ble.requestAndConnectDevice(prefix)
            .then(device => {
            //device connected
            db_msg("ok: ");
        })
            .catch(e => {
            //error
            db_msg("ERROR: " + e);
        });
        // dev.requestDevice();
    });
    var td = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39];
    var d = Uint8Array.from(td);
    // d[0] = 'a'.charCodeAt(0);
    document.getElementById("submit").addEventListener("click", () => {
        dev.write(d);
    });
    /*  document.getElementById("read").addEventListener("click", () => {
          dev.read();
      });*/
    document.getElementById("close").addEventListener("click", () => {
        dev.close();
    });
};
window.onunload = (e) => {
    dev.close();
};
//# sourceMappingURL=app.js.map