import { NativeEventEmitter, NativeModules, Platform } from "react-native";

const RNUSBPrinter = NativeModules.RNUSBPrinter;
const RNBLEPrinter = NativeModules.RNBLEPrinter;
const RNNetPrinter = NativeModules.RNNetPrinter;

export interface PrinterOptions {
  beep?: boolean;
  cut?: boolean;
  tailingLine?: boolean;
  encoding?: string;
}

export interface IUSBPrinter {
  device_name: string;
  vendor_id: string;
  product_id: string;
}

export interface IBLEPrinter {
  device_name: string;
  inner_mac_address: string;
}

export interface INetPrinter {
  device_name: string;
  host: string;
  port: number;
}

export const USBPrinter = {
  init: (): Promise<void> =>
    new Promise((resolve, reject) =>
      RNUSBPrinter.init(
        () => resolve(),
        (error: Error) => reject(error)
      )
    ),

  getDevices: (): Promise<IUSBPrinter[]> =>
    new Promise((resolve, reject) =>
      RNUSBPrinter.getDeviceList(
        (printers: IUSBPrinter[]) => resolve(printers),
        (error: Error) => reject(error)
      )
    ),

  connect: (vendorId: string, productId: string): Promise<IUSBPrinter> =>
    new Promise((resolve, reject) =>
      RNUSBPrinter.connectPrinter(
        vendorId,
        productId,
        (printer: IUSBPrinter) => resolve(printer),
        (error: Error) => reject(error)
      )
    ),

  disconnect: (): Promise<void> =>
    new Promise((resolve) => {
      RNUSBPrinter.closeConn();
      resolve();
    }),

  printQrCode: function (qrCode: string, opts: PrinterOptions = {}) {
    if (opts === void 0) {
      opts = {};
    }
    return RNUSBPrinter.printQrCode(qrCode, function (error: Error) {
      return console.warn(error);
    });
  },

  printRaw: function (rawData: string, opts: PrinterOptions = {}) {
    if (opts === void 0) {
      opts = {};
    }
    return RNUSBPrinter.printRawData(rawData, function (error: Error) {
      return console.warn(error);
    });
  },
};

export const BLEPrinter = {
  init: (): Promise<void> =>
    new Promise((resolve, reject) =>
      RNBLEPrinter.init(
        () => resolve(),
        (error: Error) => reject(error)
      )
    ),

  getDevices: (): Promise<IBLEPrinter[]> =>
    new Promise((resolve, reject) =>
      RNBLEPrinter.getDeviceList(
        (printers: IBLEPrinter[]) => resolve(printers),
        (error: Error) => reject(error)
      )
    ),

  connect: (inner_mac_address: string): Promise<IBLEPrinter> =>
    new Promise((resolve, reject) =>
      RNBLEPrinter.connectPrinter(
        inner_mac_address,
        (printer: IBLEPrinter) => resolve(printer),
        (error: Error) => reject(error)
      )
    ),

  disconnect: (): Promise<void> =>
    new Promise((resolve) => {
      RNBLEPrinter.closeConn();
      resolve();
    }),

  printQrCode: function (qrCode: string, opts: PrinterOptions) {
    if (opts === void 0) {
      opts = {};
    }
    if (Platform.OS === "ios") {
      RNBLEPrinter.printQrCode(qrCode, opts, function (error: Error) {
        return console.warn(error);
      });
    } else {
      RNBLEPrinter.printQrCode(qrCode, function (error: Error) {
        return console.warn(error);
      });
    }
  },

  printRaw: function (rawData: string, opts: PrinterOptions) {
    if (opts === void 0) {
      opts = {};
    }
    if (Platform.OS === "ios") {
      RNBLEPrinter.printRawData(rawData, opts, function (error: Error) {
        return console.warn(error);
      });
    } else {
      RNBLEPrinter.printRawData(rawData, function (error: Error) {
        return console.warn(error);
      });
    }
  },
};

export const NetPrinter = {
  init: (): Promise<void> =>
    new Promise((resolve, reject) =>
      RNNetPrinter.init(
        () => resolve(),
        (error: Error) => reject(error)
      )
    ),

  getDevices: (): Promise<INetPrinter[]> =>
    new Promise((resolve, reject) =>
      RNNetPrinter.getDeviceList(
        (printers: INetPrinter[]) => resolve(printers),
        (error: Error) => reject(error)
      )
    ),

  connect: (host: string, port: number): Promise<INetPrinter> =>
    new Promise((resolve, reject) =>
      RNNetPrinter.connectPrinter(
        host,
        port,
        (printer: INetPrinter) => resolve(printer),
        (error: Error) => reject(error)
      )
    ),

  disconnect: (): Promise<void> =>
    new Promise((resolve) => {
      RNNetPrinter.closeConn();
      resolve();
    }),

  printQrCode: function (qrCode: string, opts: PrinterOptions) {
    if (opts === void 0) {
      opts = {};
    }
    if (Platform.OS === "ios") {
      RNNetPrinter.printQrCode(qrCode, opts, function (error: Error) {
        return console.warn(error);
      });
    } else {
      RNNetPrinter.printQrCode(qrCode, function (error: Error) {
        return console.warn(error);
      });
    }
  },

  printRaw: function (rawData: string, opts: PrinterOptions) {
    if (opts === void 0) {
      opts = {};
    }
    if (Platform.OS === "ios") {
      RNNetPrinter.printRawData(rawData, opts, function (error: Error) {
        return console.warn(error);
      });
    } else {
      RNNetPrinter.printRawData(rawData, function (error: Error) {
        return console.warn(error);
      });
    }
  },
};

export const NetPrinterEventEmitter = new NativeEventEmitter(RNNetPrinter);

export enum RN_THERMAL_PRINT_EVENTS {
  EVENT_NET_PRINTER_SCANNED_SUCCESS = "scannerResolved",
  EVENT_NET_PRINTER_SCANNING = "scannerRunning",
  EVENT_NET_PRINTER_SCANNED_ERROR = "registerError",
}
