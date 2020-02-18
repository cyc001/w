var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const USB_WRITE_TIMEOUT_MILLIS = 5000;
const USB_RECIP_INTERFACE = 0x01;
//const  USB_RT_AM = UsbConstants.UsbTypeClass | USB_RECIP_INTERFACE;
const SET_LINE_CODING = 0x20; // USB CDC 1.1 section 6.2
const SET_CONTROL_LINE_STATE = 0x22;
class STM32 {
    constructor() {
        this.BasicCalls = new BasicCalls();
    }
    open(usbDevice) {
        return __awaiter(this, void 0, void 0, function* () {
            yield usbDevice.open();
            if (usbDevice.configuration === null)
                yield usbDevice.selectConfiguration(0);
            yield usbDevice.claimInterface(0);
            yield usbDevice.claimInterface(1);
            // Check configuration?
            // https://wicg.github.io/webusb/#ref-for-dom-usbdevice-selectconfiguration
            yield this.SetParameters(usbDevice, 115200);
            /*
            await this.BasicCalls._out_vendor_interface_control_transfer(
                usbDevice,
                CP210x_IFC_ENABLE,
                CP210x_UART_ENABLE,
                0,
                null
            );
           
            await this.SetParameters(usbDevice, 115200);
    
            await this.BasicCalls._out_vendor_interface_control_transfer(
                usbDevice,
                CP210x_SET_LINE_CTL,
                CP210x_LINE_CTL_DEFAULT,
                0,
                null
            );
    
            await this.BasicCalls._out_vendor_interface_control_transfer(
                usbDevice,
                CP210x_SET_MHS,
                CP210x_MHS_DEFAULT,
                0,
                null
            );
             */
        });
    }
    close(usbDevice) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
               await this.BasicCalls._out_vendor_interface_control_transfer(
                   usbDevice,
                   CP210x_PURGE,
                   CP210x_PURGE_ALL,
                   0,
                   null
               );
       
               await this.BasicCalls._out_vendor_interface_control_transfer(
                   usbDevice,
                   CP210x_IFC_ENABLE,
                   CP210x_UART_DISABLE,
                   0,
                   null
               );
               */
            yield usbDevice.releaseInterface(0);
            yield usbDevice.close();
        });
    }
    //TODO: Currently endpoints are hardcoded in both read and write
    read(usbDevice) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield usbDevice.transferIn(1, 64);
            return result.data;
        });
    }
    write(usbDevice, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield usbDevice.transferOut(1, data);
        });
    }
    SetParameters(usbDevice, baudRate) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = new ArrayBuffer(7);
            let data = new Uint8Array(buffer);
            data[0] = baudRate & 0xff;
            data[1] = baudRate >> 8 & 0xff;
            data[2] = baudRate >> 16 & 0xff;
            data[3] = baudRate >> 24 & 0xff;
            data[4] = 1; //stop
            data[5] = 0; //parity
            data[6] = 8; //data
            yield this.BasicCalls._out_vendor_interface_control_transfer(usbDevice, SET_LINE_CODING, 0, 0, data);
        });
    }
}
//# sourceMappingURL=STM32SerialDriver.js.map