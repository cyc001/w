
//import * as CP210x from './Cp2102'
var USBDevice: any;
//var navigator: Navigator;
class WebUsbSerial {
    usbDevice: any;
   cp210x: CP210x;
    constructor() {
        this.usbDevice = USBDevice;
        (navigator as any).USBDevice.open()
        this.cp210x = new CP210x()
    }


   
    open() {
        this.cp210x.open(this.usbDevice);
    }

    close() {
        this.cp210x.close(this.usbDevice);
    }

    read() {
        return this.cp210x.read(this.usbDevice);
    }

    write(data) {
        this.cp210x.write(this.usbDevice,data);
    }
    
}