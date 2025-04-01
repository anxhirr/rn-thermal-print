import { NativeEventEmitter } from "react-native";
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
export declare const USBPrinter: {
    init: () => Promise<void>;
    getDevices: () => Promise<IUSBPrinter[]>;
    connect: (vendorId: string, productId: string) => Promise<IUSBPrinter>;
    disconnect: () => Promise<void>;
    printQrCode: (qrCode: string, opts?: PrinterOptions) => any;
    printRaw: (rawData: string, opts?: PrinterOptions) => any;
};
export declare const BLEPrinter: {
    init: () => Promise<void>;
    getDevices: () => Promise<IBLEPrinter[]>;
    connect: (inner_mac_address: string) => Promise<IBLEPrinter>;
    disconnect: () => Promise<void>;
    printQrCode: (qrCode: string, opts: PrinterOptions) => void;
    printRaw: (rawData: string, opts: PrinterOptions) => void;
};
export declare const NetPrinter: {
    init: () => Promise<void>;
    getDevices: () => Promise<INetPrinter[]>;
    connect: (host: string, port: number) => Promise<INetPrinter>;
    disconnect: () => Promise<void>;
    printQrCode: (qrCode: string, opts: PrinterOptions) => void;
    printRaw: (rawData: string, opts: PrinterOptions) => void;
};
export declare const NetPrinterEventEmitter: NativeEventEmitter;
export declare enum RN_THERMAL_PRINT_EVENTS {
    EVENT_NET_PRINTER_SCANNED_SUCCESS = "scannerResolved",
    EVENT_NET_PRINTER_SCANNING = "scannerRunning",
    EVENT_NET_PRINTER_SCANNED_ERROR = "registerError"
}
