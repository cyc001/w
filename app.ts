
//import * as CP210x from './t_js/WebUsbSerial'
var dev:Dev;
var db;
class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();

        db = document.getElementById('debug');
        dev = new Dev();
    }

    start() {
        this.timerToken = setInterval(() => this.test(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

    test() {

    }
}
var serial = {};
window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();

    var t = document.getElementById("editor");
    document.getElementById("connect").addEventListener("click", () => {
        dev.requestDevice();
    });
    var td = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39];
    var d: Uint8Array = Uint8Array.from(td);
   // d[0] = 'a'.charCodeAt(0);

    document.getElementById("submit").addEventListener("click", () => {
        dev.write(d);
    });

    document.getElementById("read").addEventListener("click", () => {
        dev.read();
    });

    document.getElementById("close").addEventListener("click", () => {
        dev.close();
    });
};