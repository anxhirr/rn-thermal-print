//
//  RNUSBPrinter.m
//  RNThermalReceiptPrinter
//
//  Created by MTT on 06/12/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNUSBPrinter.h"
#import "PrinterSDK.h"

@implementation RNUSBPrinter

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(init:(RCTResponseSenderBlock)successCb
                  fail:(RCTResponseSenderBlock)errorCb) {
    // TODO
    successCb(@[@"Init successful"]);
}

RCT_EXPORT_METHOD(getDeviceList:(RCTResponseSenderBlock)successCb
                  fail:(RCTResponseSenderBlock)errorCb) {
    // TODO
    NSMutableArray *printerArray = [NSMutableArray new];
    successCb(@[printerArray]);
}

RCT_EXPORT_METHOD(connectPrinter:(NSInteger)vendorId
                  withProductID:(NSInteger)productId
                  success:(RCTResponseSenderBlock)successCb
                  fail:(RCTResponseSenderBlock)errorCb) {
    // TODO
    errorCb(@[@"This function is not supported"]);
}

RCT_EXPORT_METHOD(printRawData:(NSString *)text
                  printerOptions:(NSDictionary *)options
                  fail:(RCTResponseSenderBlock)errorCb) {
    // TODO
    errorCb(@[@"This function is not supported"]);
}

RCT_EXPORT_METHOD(closeConn) {
    // TODO
}

@end

