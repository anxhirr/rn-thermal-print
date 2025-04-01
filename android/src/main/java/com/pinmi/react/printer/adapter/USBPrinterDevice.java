package com.pinmi.react.printer.adapter;

import android.hardware.usb.UsbDevice;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class USBPrinterDevice implements PrinterDevice {
    private UsbDevice mDevice;
    private USBPrinterDeviceId usbPrinterDeviceId;

    public USBPrinterDevice(UsbDevice device) {
        this.usbPrinterDeviceId = USBPrinterDeviceId.valueOf(device.getVendorId(), device.getProductId());
        this.mDevice = device;
    }

    @Override
    public PrinterDeviceId getPrinterDeviceId() {
        return this.usbPrinterDeviceId;
    }

    public UsbDevice getUsbDevice() {
        return this.mDevice;
    }

    @Override
    public WritableMap toRNWritableMap() {
        WritableMap deviceMap = Arguments.createMap();
        deviceMap.putString("name", this.mDevice.getDeviceName());
        deviceMap.putInt("deviceId", this.mDevice.getDeviceId());
        deviceMap.putInt("vendorId", this.mDevice.getVendorId());
        deviceMap.putInt("productId", this.mDevice.getProductId());
        return deviceMap;
    }

}
