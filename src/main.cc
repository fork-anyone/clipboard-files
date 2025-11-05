#include <napi.h>
#ifdef __WIN32__
#include "clip_win.h"
#elif __APPLE__
#include "clip_osx.h"
#endif

Napi::Array ReadFiles(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    return GetFileNames(env);
}

void WriteFiles(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsArray()) {
        return;
    }
    
    Napi::Array files = info[0].As<Napi::Array>();
    WriteFileNames(env, files);
}

Napi::String ReadText(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    return GetText(env);
}

void WriteTextCallback(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsString()) {
        return;
    }
    
    Napi::String text = info[0].As<Napi::String>();
    ::WriteText(env, text);
}

/**
* 获取当前包的版本信息
*
* @param info 回调信息对象，包含环境等信息
* @return 返回包含版本号的字符串
*/
Napi::String Version(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    return Napi::String::New(env, PACKAGE_VERSION);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("readFiles", Napi::Function::New(env, ReadFiles));
    exports.Set("writeFiles", Napi::Function::New(env, WriteFiles));
    exports.Set("readText", Napi::Function::New(env, ReadText));
    exports.Set("writeText", Napi::Function::New(env, WriteTextCallback));
    exports.Set("version", Napi::Function::New(env, Version));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);
