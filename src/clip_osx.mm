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
        NSArray* paths = [pasteboard propertyListForType:NSFilenamesPboardType];
        
        if ([paths isKindOfClass:[NSArray class]]) {
            for (NSString* path in paths) {
                if ([path isKindOfClass:[NSString class]] && [path length] > 0) {
                    result.Set(index++, Napi::String::New(env, [path UTF8String]));
                }
            }
        }
    }
    
    return result;
}

void WriteFileNames(Napi::Env env, Napi::Array files) {
    @autoreleasepool {
        NSMutableArray *paths = [NSMutableArray array];
        uint32_t length = files.Length();

        for (uint32_t i = 0; i < length; i++) {
            Napi::Value value = files[i];
            if (value.IsString()) {
                std::string utf8Path = value.As<Napi::String>();
                NSString *path = [NSString stringWithUTF8String:utf8Path.c_str()];
                [paths addObject:path];
            }
        }

        NSPasteboard* pasteboard = [NSPasteboard generalPasteboard];
        [pasteboard declareTypes:[NSArray arrayWithObject:NSFilenamesPboardType] owner:nil];
        [pasteboard setPropertyList:paths forType:NSFilenamesPboardType];
    }
}
