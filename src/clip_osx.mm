#import <Foundation/Foundation.h>
#import <AppKit/NSPasteboard.h>  // 只引入必要的头文件
#include "clip_osx.h"
#include <napi.h>
#include <vector>
#include <thread>

// 定义必要的常量
#ifndef NSFilenamesPboardType
#define NSFilenamesPboardType @"NSFilenamesPboardType"
#endif

// ===== 原始同步实现保持不动 =====
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

Napi::String GetText(Napi::Env env) {
    @autoreleasepool {
        NSPasteboard* pasteboard = [NSPasteboard generalPasteboard];
        NSString* text = [pasteboard stringForType:NSPasteboardTypeString];

        if (text) {
            return Napi::String::New(env, [text UTF8String]);
        }
        return Napi::String::New(env, "");
    }
}

void WriteText(Napi::Env env, const Napi::String& text) {
    @autoreleasepool {
        std::string utf8Text = text.Utf8Value();
        NSString* str = [NSString stringWithUTF8String:utf8Text.c_str()];

        NSPasteboard* pasteboard = [NSPasteboard generalPasteboard];
        [pasteboard declareTypes:[NSArray arrayWithObject:NSPasteboardTypeString] owner:nil];
        [pasteboard setString:str forType:NSPasteboardTypeString];
    }
}

// ===== 新增异步实现 =====
class GetFileNamesWorker : public Napi::AsyncWorker {
public:
    GetFileNamesWorker(Napi::Function& callback) : AsyncWorker(callback) {}

protected:
    void Execute() override {
        @autoreleasepool {
            NSPasteboard* pasteboard = [NSPasteboard generalPasteboard];
            NSArray* paths = [pasteboard propertyListForType:NSFilenamesPboardType];
            if ([paths isKindOfClass:[NSArray class]]) {
                for (NSString* path in paths) {
                    if ([path isKindOfClass:[NSString class]] && [path length] > 0) {
                        fileNames_.push_back([path UTF8String]);
                    }
                }
            }
        }
    }

    void OnOK() override {
        Napi::Env env = Env();
        Napi::HandleScope scope(env);
        Napi::Array result = Napi::Array::New(env, fileNames_.size());
        for (size_t i = 0; i < fileNames_.size(); ++i) {
            result.Set(i, Napi::String::New(env, fileNames_[i]));
        }
        Callback().Call({env.Null(), result});
    }

private:
    std::vector<std::string> fileNames_;
};

/* 异步实现已移至 clip_osx_async.mm */