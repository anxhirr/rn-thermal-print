package com.pinmi.react.printer.adapter;

import com.pinmi.react.printer.utils.AdapterUtils;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.graphics.Bitmap;
import android.util.Base64;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Callback;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.ArrayList;

import static android.app.Activity.RESULT_OK;

public class BLEPrinterAdapter implements PrinterAdapter {

    private static BLEPrinterAdapter mInstance;

    private BluetoothDevice mBluetoothDevice;
    private BluetoothSocket mBluetoothSocket;

    private final static char ESC_CHAR = 0x1B;
    private final static byte[] SELECT_BIT_IMAGE_MODE = { 0x1B, 0x2A, 33 };
    private final static byte[] SET_LINE_SPACE_24 = new byte[] { ESC_CHAR, 0x33, 24 };
    private final static byte[] SET_LINE_SPACE_32 = new byte[] { ESC_CHAR, 0x33, 32 };
    private final static byte[] LINE_FEED = new byte[] { 0x0A };
    private final static byte[] CENTER_ALIGN = { 0x1B, 0X61, 0X31 };

    private BLEPrinterAdapter() {
    }

    private void connectBluetoothDevice(BluetoothDevice device) throws IOException {
        UUID uuid = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb");
        this.mBluetoothSocket = device.createRfcommSocketToServiceRecord(uuid);
        this.mBluetoothSocket.connect();
        this.mBluetoothDevice = device; // Last step
    }

    private static BluetoothAdapter getBTAdapter() {
        return BluetoothAdapter.getDefaultAdapter();
    }

    public static BLEPrinterAdapter getInstance() {
        if (mInstance == null)
            mInstance = new BLEPrinterAdapter();

        return mInstance;
    }

    @Override
    public void init(ReactApplicationContext reactContext, Callback successCb, Callback errorCb) {
        BluetoothAdapter bluetoothAdapter = getBTAdapter();
        if (bluetoothAdapter == null) {
            errorCb.invoke("BLE_ADAPTER_NOT_AVAILABLE");
            return;
        }
        if (!bluetoothAdapter.isEnabled()) {
            errorCb.invoke("BLE_NOT_ENABLED");
            return;
        } else {
            successCb.invoke("BLE_INIT_SUCCESS");
        }
    }

    @Override
    public List<PrinterDevice> getDeviceList(Callback errorCb) {
        BluetoothAdapter bluetoothAdapter = getBTAdapter();
        List<PrinterDevice> printerDevices = new ArrayList<>();
        if (bluetoothAdapter == null) {
            errorCb.invoke("BLE_ADAPTER_NOT_AVAILABLE");
            return printerDevices;
        }
        if (!bluetoothAdapter.isEnabled()) {
            errorCb.invoke("BLE_NOT_ENABLED");
            return printerDevices;
        }
        Set<BluetoothDevice> pairedDevices = getBTAdapter().getBondedDevices();
        for (BluetoothDevice device : pairedDevices) {
            printerDevices.add(new BLEPrinterDevice(device));
        }
        return printerDevices;
    }

    @Override
    public void selectDevice(PrinterDeviceId printerDeviceId, Callback successCb, Callback errorCb) {
        final BluetoothAdapter bluetoothAdapter = getBTAdapter();
        if (bluetoothAdapter == null) {
            errorCb.invoke("BLE_ADAPTER_NOT_AVAILABLE");
            return;
        }
        if (!bluetoothAdapter.isEnabled()) {
            errorCb.invoke("BLE_NOT_ENABLED");
            return;
        }

        final BLEPrinterDeviceId blePrinterDeviceId = (BLEPrinterDeviceId) printerDeviceId; // Declare as final
        final Callback finalSuccessCallback = successCb; // Declare as final
        final Callback finalErrorCallback = errorCb; // Declare as final

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (mBluetoothDevice != null) {
                        if (mBluetoothDevice.getAddress().equals(blePrinterDeviceId.getInnerMacAddress())
                                && mBluetoothSocket != null) {
                            finalSuccessCallback.invoke(new BLEPrinterDevice(mBluetoothDevice).toRNWritableMap());
                            return;
                        } else {
                            closeConnectionIfExists();
                        }
                    }

                    Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
                    for (BluetoothDevice device : pairedDevices) {
                        if (device.getAddress().equals(blePrinterDeviceId.getInnerMacAddress())) {
                            connectBluetoothDevice(device);
                            finalSuccessCallback.invoke(new BLEPrinterDevice(mBluetoothDevice).toRNWritableMap());
                            return;
                        }
                    }

                    final String errorText = "Cannot find the specified printing device. Please perform Bluetooth pairing in the system settings first.";
                    finalErrorCallback.invoke(errorText);
                } catch (IOException e) {
                    e.printStackTrace();
                    finalErrorCallback.invoke(e.getMessage());
                }
            }
        }).start();
    }

    @Override
    public void closeConnectionIfExists() {
        try {
            if (this.mBluetoothSocket != null) {
                this.mBluetoothSocket.close();
                this.mBluetoothSocket = null;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (this.mBluetoothDevice != null) {
            this.mBluetoothDevice = null;
        }
    }

    @Override
    public void printRawData(String rawBase64Data, Callback errorCb) {
        if (this.mBluetoothSocket == null) {
            errorCb.invoke("BLE_CONNECTION_NOT_BUILT");
            return;
        }
        final String rawData = rawBase64Data;
        final BluetoothSocket socket = this.mBluetoothSocket;
        new Thread(new Runnable() {
            @Override
            public void run() {
                byte[] bytes = Base64.decode(rawData, Base64.DEFAULT);
                try {
                    OutputStream printerOutputStream = socket.getOutputStream();
                    printerOutputStream.write(bytes, 0, bytes.length);
                    printerOutputStream.flush();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    @Override
    public void printImageData(String imageUrl, Callback errorCb) {

        final Bitmap bitmapImage = AdapterUtils.getBitmapFromURL(imageUrl);

        if (bitmapImage == null) {
            errorCb.invoke("IMAGE_NOT_FOUND");
            return;
        }
        if (this.mBluetoothSocket == null) {
            errorCb.invoke("BLE_CONNECTION_NOT_BUILT");
            return;
        }

        final BluetoothSocket socket = this.mBluetoothSocket;

        try {
            int[][] pixels = AdapterUtils.getPixelsSlow(bitmapImage);

            OutputStream printerOutputStream = socket.getOutputStream();

            printerOutputStream.write(SET_LINE_SPACE_24);
            printerOutputStream.write(CENTER_ALIGN);

            for (int y = 0; y < pixels.length; y += 24) {
                // Like I said before, when done sending data,
                // the printer will resume to normal text printing
                printerOutputStream.write(SELECT_BIT_IMAGE_MODE);
                // Set nL and nH based on the width of the image
                printerOutputStream.write(
                        new byte[] { (byte) (0x00ff & pixels[y].length), (byte) ((0xff00 & pixels[y].length) >> 8) });
                for (int x = 0; x < pixels[y].length; x++) {
                    // for each stripe, recollect 3 bytes (3 bytes = 24 bits)
                    printerOutputStream.write(AdapterUtils.recollectSlice(y, x, pixels));
                }

                // Do a line feed, if not the printing will resume on the same line
                printerOutputStream.write(LINE_FEED);
            }
            printerOutputStream.write(SET_LINE_SPACE_32);
            printerOutputStream.write(LINE_FEED);

            printerOutputStream.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void printQrCode(String qrCode, Callback errorCb) {
        final Bitmap bitmapImage = AdapterUtils.textToQrImageEncode(qrCode);

        if (bitmapImage == null) {
            errorCb.invoke("IMAGE_NOT_FOUND");
            return;
        }
        if (this.mBluetoothSocket == null) {
            errorCb.invoke("BLE_CONNECTION_NOT_BUILT");
            return;
        }

        final BluetoothSocket socket = this.mBluetoothSocket;

        try {
            int[][] pixels = AdapterUtils.getPixelsSlow(bitmapImage);

            OutputStream printerOutputStream = socket.getOutputStream();

            printerOutputStream.write(SET_LINE_SPACE_24);
            printerOutputStream.write(CENTER_ALIGN);

            for (int y = 0; y < pixels.length; y += 24) {
                // Like I said before, when done sending data,
                // the printer will resume to normal text printing
                printerOutputStream.write(SELECT_BIT_IMAGE_MODE);
                // Set nL and nH based on the width of the image
                printerOutputStream.write(
                        new byte[] { (byte) (0x00ff & pixels[y].length), (byte) ((0xff00 & pixels[y].length) >> 8) });
                for (int x = 0; x < pixels[y].length; x++) {
                    // for each stripe, recollect 3 bytes (3 bytes = 24 bits)
                    printerOutputStream.write(AdapterUtils.recollectSlice(y, x, pixels));
                }

                // Do a line feed, if not the printing will resume on the same line
                printerOutputStream.write(LINE_FEED);
            }
            printerOutputStream.write(SET_LINE_SPACE_32);
            printerOutputStream.write(LINE_FEED);

            printerOutputStream.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
