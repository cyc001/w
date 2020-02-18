
const  USB_WRITE_TIMEOUT_MILLIS = 5000;

const  USB_RECIP_INTERFACE = 0x01;
//const  USB_RT_AM = UsbConstants.UsbTypeClass | USB_RECIP_INTERFACE;

const  SET_LINE_CODING = 0x20; // USB CDC 1.1 section 6.2
const  SET_CONTROL_LINE_STATE = 0x22;

class STM32 {
    BasicCalls: BasicCalls;
    constructor() {
        this.BasicCalls = new BasicCalls();
    }
    public async  open(usbDevice): Promise<void> {

        await usbDevice.open();

        if (usbDevice.configuration === null)
            await usbDevice.selectConfiguration(0);
        await usbDevice.claimInterface(0);

        await usbDevice.claimInterface(1);



        // Check configuration?
        // https://wicg.github.io/webusb/#ref-for-dom-usbdevice-selectconfiguration



        await this.SetParameters(usbDevice, 115200);
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
    }

    public async close(usbDevice): Promise<void> {
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
        await usbDevice.releaseInterface(0);
        await usbDevice.close();
    }

    //TODO: Currently endpoints are hardcoded in both read and write
    public async read(usbDevice) {
        let result = await usbDevice.transferIn(1, 64);
        return result.data;
    }

    public async  write(usbDevice, data): Promise<void> {
        await usbDevice.transferOut(1, data)
    }
    public async SetParameters(usbDevice, baudRate) {
        let buffer = new ArrayBuffer(7);
        let data = new Uint8Array(buffer);
     

        data[0] = baudRate & 0xff;
        data[1] = baudRate >> 8 & 0xff;
        data[2] = baudRate >> 16 & 0xff;
        data[3] = baudRate >> 24 & 0xff;
        data[4] = 1; //stop
        data[5] = 0;//parity
        data[6] = 8;//data

        await this.BasicCalls._out_vendor_interface_control_transfer(
            usbDevice,
            SET_LINE_CODING,
            0,
            0,
            data
        );
    }



}