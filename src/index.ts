import { NativeEventEmitter, NativeModules, Platform } from "react-native";

const RNUSBPrinter = NativeModules.RNUSBPrinter;
const RNBLEPrinter = NativeModules.RNBLEPrinter;
const RNNetPrinter = NativeModules.RNNetPrinter;
export interface IUSBPrinter {
  name: string;
  vendorId: string;
  productId: string;
}

export interface IBLEPrinter {
  name: string;
  macAddress: string;
}

export interface INetPrinter {
  name: string;
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

  printQrCode: function (qrCode: string) {
    return RNUSBPrinter.printQrCode(qrCode, console.warn);
  },

  printRaw: function (rawData: string) {
    return RNUSBPrinter.printRawData(rawData, console.warn);
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

  connect: (macAddress: string): Promise<IBLEPrinter> =>
    new Promise((resolve, reject) =>
      RNBLEPrinter.connectPrinter(
        macAddress,
        (printer: IBLEPrinter) => resolve(printer),
        (error: Error) => reject(error)
      )
    ),

  disconnect: (): Promise<void> =>
    new Promise((resolve) => {
      RNBLEPrinter.closeConn();
      resolve();
    }),

  printQrCode: function (qrCode: string) {
    if (Platform.OS === "ios") {
      RNBLEPrinter.printQrCode(qrCode, {}, console.warn);
    } else {
      RNBLEPrinter.printQrCode(qrCode, console.warn);
    }
  },

  printRaw: function (rawData: string) {
    if (Platform.OS === "ios") {
      RNBLEPrinter.printRawData(rawData, {}, console.warn);
    } else {
      RNBLEPrinter.printRawData(rawData, console.warn);
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

  printQrCode: function (qrCode: string) {
    if (Platform.OS === "ios") {
      RNNetPrinter.printQrCode(qrCode, {}, console.warn);
    } else {
      RNNetPrinter.printQrCode(qrCode, console.warn);
    }
  },

  printRaw: function (rawData: string) {
    if (Platform.OS === "ios") {
      RNNetPrinter.printRawData(rawData, {}, console.warn);
    } else {
      RNNetPrinter.printRawData(rawData, console.warn);
    }
  },
};

export const NetPrinterEventEmitter = new NativeEventEmitter(RNNetPrinter);

export enum RN_THERMAL_PRINT_EVENTS {
  EVENT_NET_PRINTER_SCANNED_SUCCESS = "scannerResolved",
  EVENT_NET_PRINTER_SCANNING = "scannerRunning",
  EVENT_NET_PRINTER_SCANNED_ERROR = "registerError",
}
