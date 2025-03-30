package com.pinmi.react.printer;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.pinmi.react.printer.adapter.BLEPrinterAdapter;
import com.pinmi.react.printer.adapter.BLEPrinterDeviceId;
import com.pinmi.react.printer.adapter.PrinterAdapter;
import com.pinmi.react.printer.adapter.PrinterDevice;

import java.util.ArrayList;
import java.util.List;

public class RNBLEPrinterModule extends ReactContextBaseJavaModule implements RNPrinterModule {

    protected ReactApplicationContext reactContext;

    protected PrinterAdapter adapter;

    public RNBLEPrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    @Override
    public void init(Callback successCb, Callback errorCb) {
        this.adapter = BLEPrinterAdapter.getInstance();
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
    public void connectPrinter(String innerAddress, Callback successCb, Callback errorCb) {
        adapter.selectDevice(BLEPrinterDeviceId.valueOf(innerAddress), successCb, errorCb);
    }

    // Required for EventEmitter Calls.
    @ReactMethod
    public void addListener(String eventName) {
    }

    // Required for EventEmitter Calls.
    @ReactMethod
    public void removeListeners(Integer count) {
    }

    @Override
    public String getName() {
        return "RNBLEPrinter";
    }
}
