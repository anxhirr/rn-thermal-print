import * as React from "react";
import {
  Button,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  BLEPrinter,
  IBLEPrinter,
  INetPrinter,
  IUSBPrinter,
  NetPrinter,
  USBPrinter,
} from "rn-thermal-print";

const printerList = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
};

interface SelectedPrinter
  extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
  printerType?: keyof typeof printerList;
}

export default function App() {
  const [selectedValue, setSelectedValue] =
    React.useState<keyof typeof printerList>("ble");
  const [devices, setDevices] = React.useState<SelectedPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = React.useState<SelectedPrinter>(
    {}
  );

  const Printer = printerList[selectedValue];

  React.useEffect(() => {
    (async () => {
      try {
        await Printer.init();
        const results = await Printer.getDevices();
        if (!results) return;
        setDevices(
          results.map((item: any) => ({ ...item, printerType: selectedValue }))
        );
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [selectedValue]);

  const handleConnectSelectedPrinter = () => {
    if (!selectedPrinter) return;
    const connect = async () => {
      try {
        switch (selectedPrinter.printerType) {
          case "ble":
            await BLEPrinter.connect(selectedPrinter?.inner_mac_address || "");
            break;
          case "net":
            await NetPrinter.connect("192.168.1.100", 9100);
            break;
          case "usb":
            await USBPrinter.connect(
              selectedPrinter?.vendor_id || "",
              selectedPrinter?.product_id || ""
            );
            break;
          default:
        }
      } catch (err) {
        console.warn(err);
      }
    };
    connect();
  };

  const handlePrint = async () => {
    try {
      await Printer.printRaw("SGVsbG8gd29ybCBob3cgYXJlIHlvdQ==", {});
      await Printer.printQrCode("Hello World! This is a test QR code.", {});
    } catch (err) {
      console.warn(err);
    }
  };

  const handleChangePrinterType = async (type: keyof typeof printerList) => {
    setSelectedValue((prev) => {
      printerList[prev].disconnect();
      return type;
    });
    setSelectedPrinter({});
  };

  const handleChangeHostAndPort = (params: string) => (text: string) =>
    setSelectedPrinter((prev) => ({
      ...prev,
      device_name: "Net Printer",
      [params]: text,
      printerType: "net",
    }));

  const _renderNet = () => (
    <View style={{ paddingVertical: 16 }}>
      <View style={styles.rowDirection}>
        <Text>Host: </Text>
        <TextInput
          placeholder="192.168.100.19"
          onChangeText={handleChangeHostAndPort("host")}
        />
      </View>
      <View style={styles.rowDirection}>
        <Text>Port: </Text>
        <TextInput
          placeholder="9100"
          onChangeText={handleChangeHostAndPort("port")}
        />
      </View>
    </View>
  );

  const _renderOther = () => (
    <Picker selectedValue={selectedPrinter} onValueChange={setSelectedPrinter}>
      {devices.map((item: any, index) => (
        <Picker.Item
          label={item.device_name}
          value={item}
          key={`printer-item-${index}`}
        />
      ))}
    </Picker>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text>Select printer type: </Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={handleChangePrinterType}
        >
          {Object.keys(printerList).map((item, index) => (
            <Picker.Item
              label={item.toUpperCase()}
              value={item}
              key={`printer-type-item-${index}`}
            />
          ))}
        </Picker>
      </View>
      <Button
        disabled={!selectedPrinter?.device_name}
        title="Connect"
        onPress={handleConnectSelectedPrinter}
      />
      <Button
        disabled={!selectedPrinter?.device_name}
        title="Print sample"
        onPress={handlePrint}
      />
      <View style={styles.section}>
        <Text>Select printer: </Text>
        {selectedValue === "net" ? _renderNet() : _renderOther()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  section: {
    flex: 1,
  },
  rowDirection: {
    flexDirection: "row",
  },
});
