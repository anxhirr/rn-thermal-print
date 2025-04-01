import { NativeEventEmitter, NativeModules, Platform } from "react-native";
var RNUSBPrinter = NativeModules.RNUSBPrinter;
var RNBLEPrinter = NativeModules.RNBLEPrinter;
var RNNetPrinter = NativeModules.RNNetPrinter;
export var USBPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDevices: function () {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connect: function (vendorId, productId) {
        return new Promise(function (resolve, reject) {
            return RNUSBPrinter.connectPrinter(vendorId, productId, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    disconnect: function () {
        return new Promise(function (resolve) {
            RNUSBPrinter.closeConn();
            resolve();
        });
    },
    printQrCode: function (qrCode, opts) {
        if (opts === void 0) { opts = {}; }
        if (opts === void 0) {
            opts = {};
        }
        return RNUSBPrinter.printQrCode(qrCode, function (error) {
            return console.warn(error);
        });
    },
    printRaw: function (rawData, opts) {
        if (opts === void 0) { opts = {}; }
        if (opts === void 0) {
            opts = {};
        }
        return RNUSBPrinter.printRawData(rawData, function (error) {
            return console.warn(error);
        });
    },
};
export var BLEPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDevices: function () {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connect: function (inner_mac_address) {
        return new Promise(function (resolve, reject) {
            return RNBLEPrinter.connectPrinter(inner_mac_address, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    disconnect: function () {
        return new Promise(function (resolve) {
            RNBLEPrinter.closeConn();
            resolve();
        });
    },
    printQrCode: function (qrCode, opts) {
        if (opts === void 0) {
            opts = {};
        }
        if (Platform.OS === "ios") {
            RNBLEPrinter.printQrCode(qrCode, opts, function (error) {
                return console.warn(error);
            });
        }
        else {
            RNBLEPrinter.printQrCode(qrCode, function (error) {
                return console.warn(error);
            });
        }
    },
    printRaw: function (rawData, opts) {
        if (opts === void 0) {
            opts = {};
        }
        if (Platform.OS === "ios") {
            RNBLEPrinter.printRawData(rawData, opts, function (error) {
                return console.warn(error);
            });
        }
        else {
            RNBLEPrinter.printRawData(rawData, function (error) {
                return console.warn(error);
            });
        }
    },
};
export var NetPrinter = {
    init: function () {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.init(function () { return resolve(); }, function (error) { return reject(error); });
        });
    },
    getDevices: function () {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.getDeviceList(function (printers) { return resolve(printers); }, function (error) { return reject(error); });
        });
    },
    connect: function (host, port) {
        return new Promise(function (resolve, reject) {
            return RNNetPrinter.connectPrinter(host, port, function (printer) { return resolve(printer); }, function (error) { return reject(error); });
        });
    },
    disconnect: function () {
        return new Promise(function (resolve) {
            RNNetPrinter.closeConn();
            resolve();
        });
    },
    printQrCode: function (qrCode, opts) {
        if (opts === void 0) {
            opts = {};
        }
        if (Platform.OS === "ios") {
            RNNetPrinter.printQrCode(qrCode, opts, function (error) {
                return console.warn(error);
            });
        }
        else {
            RNNetPrinter.printQrCode(qrCode, function (error) {
                return console.warn(error);
            });
        }
    },
    printRaw: function (rawData, opts) {
        if (opts === void 0) {
            opts = {};
        }
        if (Platform.OS === "ios") {
            RNNetPrinter.printRawData(rawData, opts, function (error) {
                return console.warn(error);
            });
        }
        else {
            RNNetPrinter.printRawData(rawData, function (error) {
                return console.warn(error);
            });
        }
    },
};
export var NetPrinterEventEmitter = new NativeEventEmitter(RNNetPrinter);
export var RN_THERMAL_PRINT_EVENTS;
(function (RN_THERMAL_PRINT_EVENTS) {
    RN_THERMAL_PRINT_EVENTS["EVENT_NET_PRINTER_SCANNED_SUCCESS"] = "scannerResolved";
    RN_THERMAL_PRINT_EVENTS["EVENT_NET_PRINTER_SCANNING"] = "scannerRunning";
    RN_THERMAL_PRINT_EVENTS["EVENT_NET_PRINTER_SCANNED_ERROR"] = "registerError";
})(RN_THERMAL_PRINT_EVENTS || (RN_THERMAL_PRINT_EVENTS = {}));
