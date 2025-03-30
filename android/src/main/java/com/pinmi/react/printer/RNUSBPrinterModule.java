package com.pinmi.react.printer;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.pinmi.react.printer.adapter.PrinterAdapter;
import com.pinmi.react.printer.adapter.PrinterDevice;
import com.pinmi.react.printer.adapter.USBPrinterAdapter;
import com.pinmi.react.printer.adapter.USBPrinterDeviceId;

import java.util.List;

public class RNUSBPrinterModule extends ReactContextBaseJavaModule implements RNPrinterModule {

    protected ReactApplicationContext reactContext;

    protected PrinterAdapter adapter;

    public RNUSBPrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    @Override
    public void init(Callback successCb, Callback errorCb) {
        this.adapter = USBPrinterAdapter.getInstance();
        this.adapter.init(reactContext, successCb, errorCb);
    }

    @ReactMethod
    @Override
    public void closeConn() {
        adapter.closeConnectionIfExists();
    }

    @ReactMethod
    @Override
    public void getDeviceList(Callback successCb, Callback errorCb) {
        List<PrinterDevice> printerDevices = adapter.getDeviceList(errorCb);
        WritableArray pairedDeviceList = Arguments.createArray();
        if (printerDevices.size() > 0) {
            for (PrinterDevice printerDevice : printerDevices) {
                pairedDeviceList.pushMap(printerDevice.toRNWritableMap());
            }
            successCb.invoke(pairedDeviceList);
        } else {
            errorCb.invoke("No Device Found");
        }
    }

    @ReactMethod
    @Override
    public void printRawData(String base64Data, Callback errorCb) {
        adapter.printRawData(base64Data, errorCb);
    }

    @ReactMethod
    @Override
    public void printImageData(String imageUrl, Callback errorCb) {
        adapter.printImageData(imageUrl, errorCb);
    }

    @ReactMethod
    @Override
    public void printQrCode(String qrCode, Callback errorCb) {
        adapter.printQrCode(qrCode, errorCb);
    }

    @ReactMethod
    public void connectPrinter(Integer vendorId, Integer productId, Callback successCb, Callback errorCb) {
        adapter.selectDevice(USBPrinterDeviceId.valueOf(vendorId, productId), successCb, errorCb);
    }

    @Override
    public String getName() {
        return "RNUSBPrinter";
    }
}
