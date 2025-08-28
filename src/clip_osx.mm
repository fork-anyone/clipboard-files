#import <Foundation/Foundation.h>
#import <AppKit/NSPasteboard.h>  // 只引入必要的头文件
#include "clip_osx.h"

// 定义必要的常量
#ifndef NSFilenamesPboardType
#define NSFilenamesPboardType @"NSFilenamesPboardType"
#endif

Napi::Array GetFileNames(Napi::Env env) {
    Napi::Array result = Napi::Array::New(env);
    uint32_t index = 0;
    
    @autoreleasepool {
        NSPasteboard* pasteboard = [NSPasteboard generalPasteboard];
        NSString* str = [pasteboard stringForType:NSFilenamesPboardType];
        
        if (str) {
            NSArray* paths = [str componentsSeparatedByString:@"\n"];
            for (NSString* path in paths) {
                if ([path length] > 0) {
                    result.Set(index++, Napi::String::New(env, [path UTF8String]));
                }
            }
        }
    }
    
    return result;
}

void WriteFileNames(Napi::Env env, Napi::Array files) {
    @autoreleasepool {
        NSMutableString* pathsStr = [NSMutableString string];
        uint32_t length = files.Length();
        
        for (uint32_t i = 0; i < length; i++) {
            Napi::Value value = files[i];
            if (value.IsString()) {
                std::string utf8Path = value.As<Napi::String>();
                NSString *path = [NSString stringWithUTF8String:utf8Path.c_str()];
                if (i > 0) [pathsStr appendString:@"\n"];
                [pathsStr appendString:path];
            }
        }
        
        if ([pathsStr length] > 0) {
            NSPasteboard* pasteboard = [NSPasteboard generalPasteboard];
            [pasteboard declareTypes:[NSArray arrayWithObject:NSFilenamesPboardType] owner:nil];
            [pasteboard setString:pathsStr forType:NSFilenamesPboardType];
        }
    }
}
