var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//TODO: Simplify this with Closures???
class BasicCalls {
    _out_vendor_interface_control_transfer(usbDevice, request, value, index, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var parameters = {
                requestType: 'vendor',
                recipient: 'interface',
                request: request,
                value: value,
                index: index
            };
            let result;
            if (data != null) {
                result = yield usbDevice.controlTransferOut(parameters, data);
            }
            else {
                result = yield usbDevice.controlTransferOut(parameters);
            }
            return result;
        });
    }
    _in_vendor_interface_control_transfer(usbDevice, request, value, index, length) {
        return __awaiter(this, void 0, void 0, function* () {
            var parameters = {
                requestType: 'vendor',
                recipient: 'interface',
                request: request,
                value: value,
                index: index
            };
            let result = yield usbDevice.controlTransferIn(parameters, length);
            return result;
        });
    }
}
//# sourceMappingURL=basicUsbCalls.js.map