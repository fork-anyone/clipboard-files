#include <napi.h>

#ifdef _WIN32
#include "clip_win.h"
#include "clip_win_async.h"
#elif __APPLE__
#include "clip_osx.h"
#include "clip_osx_async.h"
#endif

// 同步封装
Napi::Array ReadFiles(const Napi::CallbackInfo& info) {
    return GetFileNames(info.Env());
}
void WriteFiles(const Napi::CallbackInfo& info) {
    if (info.Length() < 1 || !info[0].IsArray()) return;
    WriteFileNames(info.Env(), info[0].As<Napi::Array>());
}
Napi::String ReadText(const Napi::CallbackInfo& info) {
    return GetText(info.Env());
}
void WriteTextCallback(const Napi::CallbackInfo& info) {
    if (info.Length() < 1 || !info[0].IsString()) return;
    ::WriteText(info.Env(), info[0].As<Napi::String>());
}
Napi::String Version(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), PACKAGE_VERSION);
}

// 导出表
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("readFiles",      Napi::Function::New(env, ReadFiles));
    exports.Set("writeFiles",     Napi::Function::New(env, WriteFiles));
    exports.Set("readText",       Napi::Function::New(env, ReadText));
    exports.Set("writeText",      Napi::Function::New(env, WriteTextCallback));
    exports.Set("version",        Napi::Function::New(env, Version));
    exports.Set("readFilesAsync",  Napi::Function::New(env, GetFileNamesAsync));
    exports.Set("writeFilesAsync", Napi::Function::New(env, WriteFileNamesAsync));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);