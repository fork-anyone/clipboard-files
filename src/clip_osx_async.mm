#import <AppKit/NSPasteboard.h>
#import <Foundation/Foundation.h>
#include <napi.h>

class ReadFilesWorker : public Napi::AsyncWorker {
public:
    ReadFilesWorker(Napi::Function& cb) : Napi::AsyncWorker(cb) {}
protected:
    void Execute() override {
        @autoreleasepool {
            NSPasteboard* pb = [NSPasteboard generalPasteboard];
            NSArray* paths = [pb propertyListForType:@"NSFilenamesPboardType"];
            if ([paths isKindOfClass:[NSArray class]]) {
                for (NSString* p in paths)
                    if ([p isKindOfClass:[NSString class]])
                        result_.push_back([p UTF8String]);
            }
        }
    }
    void OnOK() override {
        Napi::Env env = Env();
        Napi::Array arr = Napi::Array::New(env, result_.size());
        for (size_t i = 0; i < result_.size(); ++i)
            arr.Set(i, Napi::String::New(env, result_[i]));
        Callback().Call({env.Null(), arr});
    }
private:
    std::vector<std::string> result_;
};

class WriteFilesWorker : public Napi::AsyncWorker {
public:
    WriteFilesWorker(Napi::Function& cb, const Napi::Array& files)
        : AsyncWorker(cb) {
        uint32_t len = files.Length();
        for (uint32_t i = 0; i < len; ++i) {
            std::string s = files.Get(i).As<Napi::String>();
            files_.push_back(s);
        }
    }
protected:
    void Execute() override {
        NSMutableArray* paths = [NSMutableArray array];
        for (const std::string& path : files_) {
            [paths addObject:[NSString stringWithUTF8String:path.c_str()]];
        }
        @autoreleasepool {
            NSPasteboard* pb = [NSPasteboard generalPasteboard];
            [pb declareTypes:@[@"NSFilenamesPboardType"] owner:nil];
            [pb setPropertyList:paths forType:@"NSFilenamesPboardType"];
        }
    }
    void OnOK() override {
        Callback().Call({Env().Null()});
    }
private:
    std::vector<std::string> files_;
};

Napi::Value GetFileNamesAsync(const Napi::CallbackInfo& info) {
    Napi::Function cb = info[0].As<Napi::Function>();
    (new ReadFilesWorker(cb))->Queue();
    return info.Env().Undefined();
}

Napi::Value WriteFileNamesAsync(const Napi::CallbackInfo& info) {
    Napi::Function cb = info[0].As<Napi::Function>();
    Napi::Array files = info[1].As<Napi::Array>();
    (new WriteFilesWorker(cb, files))->Queue();
    return info.Env().Undefined();
}
