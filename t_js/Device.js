class Dev {
    constructor() {
        this.status = "";
        this.ic = new STM32();
    }
    requestDevice() {
        db.textContent = "*";
        navigator.usb.getDevices()
            .then(devices => {
            console.log("Total devices: " + devices.length);
            devices.forEach(device => {
                db.textContent = db.textContent + "\r\nProduct name: " + device.productName + ", serial number " + device.serialNumber;
                console.log("Product name: " + device.productName + ", serial number " + device.serialNumber);
            });
        });
        //-----
        const filters = [];
        if (navigator) {
            db.textContent = db.textContent + "+1";
        }
        else {
            db.textContent = db.textContent + "+2";
        }
        db.textContent = db.textContent + "+" + navigator.platform;
        if (navigator.usb) {
            db.textContent = db.textContent + "+10";
        }
        else {
            db.textContent = db.textContent + "+20";
        }
        //(navigator as any
        //    <meta content="width=device-width, initial-scale=1,allowpaymentrequest allow='usb fullscreen'" />
        navigator.usb.requestDevice({ filters: [] })
            .then(usbDevice => {
            console.log("Product name: " + usbDevice.productName);
            db.textContent = db.textContent + "\r\n" + "con:" + usbDevice.productName;
            this.port = usbDevice;
            this.open();
            this.status = "OK";
            //this.read();
        })
            .catch(e => {
            console.log("+There is no device. +" + e);
            db.textContent = db.textContent + "+\r\n" + e;
            this.status = "";
        });
        db.textContent = db.textContent + "+adf4";
    }
    open() {
        this.ic.open(this.port);
    }
    close() {
        this.ic.close(this.port);
        this.status = "";
    }
    read() {
        this.ic.read(this.port).then(data => {
            let textDecoder = new TextDecoder();
            document.getElementById('output').innerText += textDecoder.decode(data);
        });
        /*
        let textDecoder = new TextDecoder();
        console.log("Received:", textDecoder.decode(data));*/
        ;
    }
    write(data) {
        if (this.status == "")
            return;
        this.ic.write(this.port, data);
    }
}
//# sourceMappingURL=Device.js.map