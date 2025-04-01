import { NativeEventEmitter } from "react-native";
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
export declare const USBPrinter: {
    init: () => Promise<void>;
    getDevices: () => Promise<IUSBPrinter[]>;
    connect: (vendorId: string, productId: string) => Promise<IUSBPrinter>;
    disconnect: () => Promise<void>;
    printQrCode: (qrCode: string) => any;
    printRaw: (rawData: string) => any;
};
export declare const BLEPrinter: {
    init: () => Promise<void>;
    getDevices: () => Promise<IBLEPrinter[]>;
    connect: (macAddress: string) => Promise<IBLEPrinter>;
    disconnect: () => Promise<void>;
    printQrCode: (qrCode: string) => void;
    printRaw: (rawData: string) => void;
};
export declare const NetPrinter: {
    init: () => Promise<void>;
    getDevices: () => Promise<INetPrinter[]>;
    connect: (host: string, port: number) => Promise<INetPrinter>;
    disconnect: () => Promise<void>;
    printQrCode: (qrCode: string) => void;
    printRaw: (rawData: string) => void;
};
export declare const NetPrinterEventEmitter: NativeEventEmitter;
export declare enum RN_THERMAL_PRINT_EVENTS {
    EVENT_NET_PRINTER_SCANNED_SUCCESS = "scannerResolved",
    EVENT_NET_PRINTER_SCANNING = "scannerRunning",
    EVENT_NET_PRINTER_SCANNED_ERROR = "registerError"
}
