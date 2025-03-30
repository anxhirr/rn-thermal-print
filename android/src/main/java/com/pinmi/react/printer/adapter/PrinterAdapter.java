package com.pinmi.react.printer.adapter;

import android.app.Activity;
import android.content.Context;
import android.telecom.Call;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.List;

/**
 * Created by xiesubin on 2017/9/21.
 */

public interface PrinterAdapter {

    public void init(ReactApplicationContext reactContext, Callback successCb, Callback errorCb);

    public List<PrinterDevice> getDeviceList(Callback errorCb);

    public void selectDevice(PrinterDeviceId printerDeviceId, Callback successCb, Callback errorCb);

    public void closeConnectionIfExists();

    public void printRawData(String rawBase64Data, Callback errorCb);

    public void printImageData(String imageUrl, Callback errorCb);

    public void printQrCode(String qrCode, Callback errorCb);
}
