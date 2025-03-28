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
  const [devices, setDevices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedPrinter, setSelectedPrinter] = React.useState<SelectedPrinter>(
    {}
  );

  React.useEffect(() => {
    const getListDevices = async () => {
      const Printer = printerList[selectedValue];
      // get list device for net printers is support scanning in local ip but not recommended
      if (selectedValue === "net") return;
      try {
        setLoading(true);
        await Printer.init();
        const results = await Printer.getDevices();
        setDevices(
          results.map((item: any) => ({ ...item, printerType: selectedValue }))
        );
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    getListDevices();
  }, [selectedValue]);

  const handleConnectSelectedPrinter = () => {
    if (!selectedPrinter) return;
    const connect = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    connect();
  };

  const handlePrint = async () => {
    try {
      const Printer = printerList[selectedValue];
      const testUrl =
        "https://efiskalizimi-app-test.tatime.gov.al/invoice-check/#/verify?iic=7345C1D3B43977764E1F1B12FC916E46&tin=L86412202Q&crtd=2022-09-05T19:04:24+02:00&ord=387&bu=bk089dh321&cr=lj817xj946&sw=mi380qe450&prc=400.00";
      await Printer.printQrCode(testUrl, {});
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
      <View style={styles.section}>
        <Text>Select printer: </Text>
        {selectedValue === "net" ? _renderNet() : _renderOther()}
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
