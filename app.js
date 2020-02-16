//import * as CP210x from './t_js/WebUsbSerial'
class Greeter {
    constructor(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }
    stop() {
        clearTimeout(this.timerToken);
    }
}
var serial = {};
window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
    var t = document.getElementById("output");
    document.getElementById("connect").addEventListener("click", () => {
        /*
     //   let ds = (navigator as any).usb.getDevices();
        (navigator as any).usb.getDevices()
            .then(devices => {
                console.log("Total devices: " + devices.length);
                devices.forEach(device => {
                    console.log("Product name: " + device.productName + ", serial number " + device.serialNumber);
                });
            });
        const filters = [
            { 'vendorId': 0x8086, 'productId': 0x3B3C },
            { 'vendorId': 0x8086, 'productId': 0x3b34 },
        ];
        { "vendorId": 0x10c4 }
      */
        const filters = [];
        t.textContent = "*";
        if (navigator) {
            t.textContent = t.textContent + "+1";
        }
        else {
            t.textContent = t.textContent + "+2";
        }
        t.textContent = t.textContent + "+" + navigator.platform;
        if (navigator.usb) {
            t.textContent = t.textContent + "+10";
        }
        else {
            t.textContent = t.textContent + "+20";
        }
        //(navigator as any
        //    <meta content="width=device-width, initial-scale=1,allowpaymentrequest allow='usb fullscreen'" />
        navigator.usb.requestDevice({ filters: [] })
            .then(usbDevice => {
            console.log("Product name: " + usbDevice.productName);
            t.textContent = t.textContent + "+" + "con:" + usbDevice.productName;
        })
            .catch(e => {
            console.log("+There is no device. +" + e);
            t.textContent = t.textContent + "+" + e;
        });
        t.textContent = t.textContent + "+adf4";
    });
    //(navigator as any)
    /*
    var u: WebUsbSerial = new WebUsbSerial();
    u.open();
    u.write("1234");
    u.read().then(d => { console.log(d) })
    u.close()
    */
};
//# sourceMappingURL=app.js.map