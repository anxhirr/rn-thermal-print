package com.pinmi.react.printer;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.pinmi.react.printer.adapter.BLEPrinterDeviceId;
import com.pinmi.react.printer.adapter.NetPrinterAdapter;
import com.pinmi.react.printer.adapter.NetPrinterDeviceId;
import com.pinmi.react.printer.adapter.PrinterAdapter;

public class RNNetPrinterModule extends ReactContextBaseJavaModule implements RNPrinterModule {

    private PrinterAdapter adapter;
    private ReactApplicationContext reactContext;

    public RNNetPrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    @Override
    public void init(Callback successCb, Callback errorCb) {
        this.adapter = NetPrinterAdapter.getInstance();
        this.adapter.init(reactContext, successCb, errorCb);
    }

    @ReactMethod
    @Override
    public void closeConn() {
        this.adapter = NetPrinterAdapter.getInstance();
        this.adapter.closeConnectionIfExists();
    }

    @ReactMethod
    @Override
    public void getDeviceList(Callback successCb, Callback errorCb) {
        try {
            this.adapter.getDeviceList(errorCb);
            successCb.invoke();
        } catch (Exception ex) {
            errorCb.invoke(ex.getMessage());
        }
        // this.adapter.getDeviceList(errorCb);
    }

    @ReactMethod
    public void connectPrinter(String host, Integer port, Callback successCb, Callback errorCb) {
        adapter.selectDevice(NetPrinterDeviceId.valueOf(host, port), successCb, errorCb);
    }

    @ReactMethod
    @Override
    public void printRawData(String base64Data, Callback errorCb) {
        adapter.printRawData(base64Data, errorCb);
    }

    @ReactMethod
    @Override
    public void printImageData(String imageUrl, Callback errorCb) {
        Log.v("imageUrl", imageUrl);
        adapter.printImageData(imageUrl, errorCb);
    }

    @ReactMethod
    @Override
    public void printQrCode(String qrCode, Callback errorCb) {
        Log.v("qrCode", qrCode);
        adapter.printQrCode(qrCode, errorCb);
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
        return "RNNetPrinter";
    }
}
