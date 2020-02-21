class BLE {
    /*
     * cyccyc_ETH
       uuid: "FFF0", //FFE0
  status: 0, //可用状态 1 - 可用 0 - 不可用
  sousuo: 0, //搜索状态 1 - 搜索中  0 - 为搜索
  connectedDeviceId: "", //已连接设备uuid
  services: "", // 连接设备的服务
  characteristics: "", // 连接设备的状态值
  writeServicweId: "", // 可写服务uuid
  writeCharacteristicsId: "FFF2", //可写特征值uuid
  readServicweId: "", // 可读服务uuid
  readCharacteristicsId: "FFF1", //可读特征值uuid
     * */
    constructor() {
        this.EVENT_DISCONNECTED = "disconnected";
        this.events = {};
        this.LOG_EVENT = "Indigo (e): ";
        this.LOG_OUTPUT = "Indigo (->): ";
        this.LOG_INPUT = "Indigo (<-): ";
        this.SERVICE_UUID = 0xFFF0;
        this.NOTIFY_UUID = "0000fff7-0000-1000-8000-00805f9b34fb";
        this.WRITE_RESPONSE_UUID = "0000fff6-0000-1000-8000-00805f9b34fb";
        this.API_MAX_LENGTH = 20;
        this.notifyChar = null;
        this.writeReadChar = null;
        this.device = null;
        this.bluetooth = navigator.bluetooth;
        this.events = {};
        this.notifyFns = null;
    }
    getDeviceConnected(event) {
        this.device = this.bluetooth.referringDevice;
        return this.device;
    }
    ;
    isAvailable(event) {
        return this.bluetooth.getAvailability();
    }
    ;
    addEventListener(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    ;
    removeEventListener(event, listener) {
        var idx;
        var k;
        if (typeof this.events[event] === 'object') {
            //idx = indexOf(this.events[event], listener);
            idx == this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
    ;
    dispatchEvent(event) {
        var i, listeners, length, args = [].slice.call(arguments, 1);
        if (typeof this.events[event] === 'object') {
            listeners = this.events[event].slice();
            length = listeners.length;
            for (i = 0; i < length; i++) {
                listeners[i].apply(this, args);
            }
        }
    }
    ;
    requestDevice(prefix) {
        var options = {
            filters: [{
                    namePrefix: "[]",
                    services: [this.SERVICE_UUID],
                    name: 'cyccyc_ETH',
                }],
            optionalServices: [this.SERVICE_UUID]
        };
        ////    for (var p in prefix) {
        //       options.filters.push(prefix[p]);//{ namePrefix: p });// prefix[p] });
        //     }
        return this.bluetooth.requestDevice(options).then(function (device) {
            return device;
        });
    }
    ;
    requestAndConnectDevice(prefix, onConnectCallback = null) {
        var _this = this;
        return _this.requestDevice(prefix)
            .then(device => {
            if (onConnectCallback != null) {
                onConnectCallback();
            }
            return _this.connect(device)
                .then(device => {
                return device;
            });
        });
    }
    ;
    connect(device) {
        var _this = this;
        _this.notifyChar = null;
        _this.writeReadChar = null;
        _this.device = null;
        device.addEventListener("gattserverdisconnected", function () {
            _this.notifyChar = null;
            _this.writeReadChar = null;
            _this.device = null;
            _this.eventDisconnected();
        });
        return this.gattConnect(device)
            .then(function (characteristics) {
            db_msg(this.LOG_EVENT + "found " + characteristics.length + " characteristic(s)");
            _this.notifyChar = characteristics.find(function (characteristic) {
                return (characteristic.uuid === this.NOTIFY_UUID);
            });
            _this.writeReadChar = characteristics.find(function (characteristic) {
                return (characteristic.uuid === this.WRITE_RESPONSE_UUID);
            });
            if (_this.notifyChar && _this.writeReadChar) {
                //return device;
            }
            //device.ongattserverdisconnected = _this.disconnect;
            if (!_this.notifyChar || !_this.writeReadChar) {
                throw new Error("Unsupported device");
            }
            if (!_this.notifyChar.properties.notify) {
                throw new Error("Control characteristic does not allow notifications");
            }
            return _this.notifyChar.startNotifications();
        }).then(function () {
            _this.notifyChar.addEventListener("characteristicvaluechanged", _this.handleNotification.bind(_this));
            db_msg(this.LOG_EVENT + "enabled control notifications");
            _this.device = device;
            return device;
        });
    }
    ;
    gattConnect(device) {
        return Promise.resolve()
            .then(function () {
            if (device.gatt.connected)
                return device.gatt;
            return device.gatt.connect();
        })
            .then(function (server) {
            db_msg(this.LOG_EVENT + "connected to gatt server");
            return server.getPrimaryService(this.SERVICE_UUID);
        })
            .then(function (service) {
            db_msg(this.LOG_EVENT + "found DFU service" + service.getCharacteristics());
            return service.getCharacteristics();
        });
    }
    handleNotification(event) {
        var value = event.target.value;
        var len = value.byteLength;
        var bytes = [];
        for (var k = 0; k < len; k++) {
            var b = value.getUint8(k);
            bytes.push(b);
        }
        db_msg(this.LOG_INPUT + bytes);
        if (this.notifyFns != null) {
            this.notifyFns(bytes);
        }
        else {
            db_msg(this.LOG_EVENT + "notification handler is null");
        }
    }
    ;
    eventDisconnected() {
        this.dispatchEvent(this.EVENT_DISCONNECTED); //, null);
    }
    ;
    write(data) {
        var bytes = new Uint8Array(this.API_MAX_LENGTH);
        bytes.set(data);
        this.writeReadChar.writeValue(bytes);
        db_msg(this.LOG_OUTPUT + "(->)" + bytes);
    }
    ;
    write_cb(callback, data) {
        this.notifyFns = callback;
        var bytes = new Uint8Array(this.API_MAX_LENGTH);
        bytes.set(data);
        this.writeReadChar.writeValue(bytes);
        db_msg(this.LOG_OUTPUT + bytes);
    }
    ;
    disconnect() {
        db_msg("Device disconnected");
        this.device.gatt.disconnect();
        this.notifyChar = null;
        this.writeReadChar = null;
        this.device = null;
    }
    ;
}
//# sourceMappingURL=BLE.js.map