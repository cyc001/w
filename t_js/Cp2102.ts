
//import * as BasicCalls from './basicUsbCalls'
//import * as Constants from './constants'

const CP210x_IFC_ENABLE = 0x00;
const CP210x_UART_ENABLE = 0x0001;
const CP210x_SET_LINE_CTL = 0x03;
const CP210x_LINE_CTL_DEFAULT = 0x0800;
const CP210x_SET_MHS = 0x07;
const CP210x_MHS_DEFAULT = 0x0000;
const CP210x_PURGE = 0x12;
const CP210x_PURGE_ALL = 0x000f;
const CP210x_UART_DISABLE = 0x0000;
const CP210x_SET_BAUDRATE = 0x1e;
const CP210x_GET_COMM_STATUS = 0x10;

class CP210x {
    BasicCalls: BasicCalls;
    constructor() {
        this.BasicCalls = new BasicCalls();
    }
    public async  open(usbDevice): Promise<void> {
       
        await usbDevice.open();

        // Check configuration?
        // https://wicg.github.io/webusb/#ref-for-dom-usbdevice-selectconfiguration

        await usbDevice.claimInterface(0);

        await this.BasicCalls._out_vendor_interface_control_transfer(
            usbDevice,
            CP210x_IFC_ENABLE,
            CP210x_UART_ENABLE,
            0,
            null
        );

        await this.setBaudRate(usbDevice, 115200);

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

    }

    public async close(usbDevice): Promise<void>  {
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

        await usbDevice.releaseInterface(0);
        await usbDevice.close();
    }

    //TODO: Currently endpoints are hardcoded in both read and write
    public async read(usbDevice) {
        let result = await usbDevice.transferIn(1, 512);
        return result.data;
    }

    public async  write(usbDevice, data): Promise<void>  {
        await usbDevice.transferOut(2, data)
    }

    async setBaudRate(usbDevice, baudRate) {
        let buffer = new ArrayBuffer(4);
        let data = new Uint8Array(buffer);
        data[0] = baudRate & 0xff;
        data[1] = baudRate >> 8 & 0xff;
        data[2] = baudRate >> 16 & 0xff;
        data[3] = baudRate >> 24 & 0xff;

        await this.BasicCalls._out_vendor_interface_control_transfer(
            usbDevice,
            CP210x_SET_BAUDRATE,
            0,
            0,
            data
        );

        //TODO: Maybe return something?
    }

    async  setDataBits(usbDevice, dataBits) {
        let result = await this.BasicCalls._in_vendor_interface_control_transfer(
            usbDevice,
            CP210x_GET_COMM_STATUS,
            0,
            0,
            2
        );

        if (result.data != null) {
            let lsb = result.data.getInt8(0);
            let msb = result.data.getInt8(1);
            let wValue = (msb << 8) | (lsb & 0xff);
            wValue &= ~0x0f00;
            /*
            switch (dataBits) {
                case Constants.DATA_BITS_5:
                    wValue |= 0x0500;
                    break;
                case Constants.DATA_BITS_6:
                    wValue |= 0x0600;
                    break;
                case Constants.DATA_BITS_7:
                    wValue |= 0x0700;
                    break;
                case Constants.DATA_BITS_8:
                    wValue |= 0x0800;
                    break;
            }*/
            wValue |= 0x0800;
            await this.BasicCalls._out_vendor_interface_control_transfer(
                usbDevice,
                CP210x_SET_LINE_CTL,
                wValue,
                0,
                null
            );
        }
    }

    async   setStopBits(usbDevice, stopBits) {
        let result = await this.BasicCalls._in_vendor_interface_control_transfer(
            usbDevice,
            CP210x_GET_COMM_STATUS,
            0,
            0,
            2
        );

        if (result.data != null) {
            let lsb = result.data.getInt8(0);
            let msb = result.data.getInt8(1);
            let wValue = (msb << 8) | (lsb & 0xff);
            wValue &= ~0x0003;
            /*
            switch (stopBits) {
                case Constants.STOP_BITS_1:
                    wValue |= 0;
                    break;
                case Constants.STOP_BITS_15:
                    wValue |= 1;
                    break;
                case Constants.STOP_BITS_2:
                    wValue |= 2;
                    break;
                default:
                    return;
            }*/
            wValue |= 1;
            await this.BasicCalls._out_vendor_interface_control_transfer(
                usbDevice,
                CP210x_SET_LINE_CTL,
                wValue,
                0,
                null
            );
        }
    }

    async   setParity(usbDevice, parity) {
        let result = await this.BasicCalls._in_vendor_interface_control_transfer(
            usbDevice,
            CP210x_GET_COMM_STATUS,
            0,
            0,
            2
        );

        if (result.data != null) {
            let lsb = result.data.getInt8(0);
            let msb = result.data.getInt8(1);
            let wValue = (msb << 8) | (lsb & 0xff);
            wValue &= ~0x0f00;
            /*
            switch (parity) {
                case Constants.PARITY_NONE:
                    wValue |= 0x0000;
                    break;
                case Constants.PARITY_ODD:
                    wValue |= 0x0010;
                    break;
                case Constants.PARITY_EVEN:
                    wValue |= 0x0020;
                    break;
                case Constants.PARITY_MARK:
                    wValue |= 0x0030;
                    break;
                case Constants.PARITY_SPACE:
                    wValue |= 0x0040;
                    break;
                default:
                    return;
            }*/
            wValue |= 0x0000;
            await this.BasicCalls._out_vendor_interface_control_transfer(
                usbDevice,
                CP210x_SET_LINE_CTL,
                wValue,
                0,
                null
            );
        }
    }
}