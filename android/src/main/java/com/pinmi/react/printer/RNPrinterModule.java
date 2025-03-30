package com.pinmi.react.printer;

import android.hardware.usb.UsbDevice;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.pinmi.react.printer.adapter.PrinterAdapter;
import com.pinmi.react.printer.adapter.PrinterDevice;
import com.pinmi.react.printer.adapter.PrinterDeviceId;

import java.util.List;

public interface RNPrinterModule {

    public void init(Callback successCb, Callback errorCb);

    public void closeConn();

    public void getDeviceList(Callback successCb, Callback errorCb);

    @ReactMethod
    public void printRawData(String base64Data, Callback errorCb);

    @ReactMethod
    public void printImageData(String imageUrl, Callback errorCb);

    @ReactMethod
    public void printQrCode(String qrCode, Callback errorCb);

}
