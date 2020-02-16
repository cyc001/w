//TODO: Simplify this with Closures???
 class BasicCalls {
    public async   _out_vendor_interface_control_transfer(usbDevice, request, value, index, data): Promise<any> {
        var parameters = {
            requestType: 'vendor',
            recipient: 'interface',
            request: request,
            value: value,
            index: index
        };
        let result;
        if (data != null) {
            result = await usbDevice.controlTransferOut(parameters, data);
        } else {
            result = await usbDevice.controlTransferOut(parameters);
        }

        return result;
    }

    public async   _in_vendor_interface_control_transfer(usbDevice, request, value, index, length) {
        var parameters = {
            requestType: 'vendor',
            recipient: 'interface',
            request: request,
            value: value,
            index: index
        };
        let result = await usbDevice.controlTransferIn(parameters, length);
        return result;
    }
}