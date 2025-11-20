#include "clip_win_async.h"
#include "clip_win.h"
#include <napi.h>
#include <vector>

class ReadFilesWorker : public Napi::AsyncWorker
{
public:
    ReadFilesWorker(Napi::Function &cb) : Napi::AsyncWorker(cb) {}

protected:
    void Execute() override
    {
        Napi::Array arr = GetFileNames(Env()); // 复用已有的同步实现，但放在后台线程
        for (size_t i = 0; i < arr.Length(); ++i) {
            result_.push_back(arr.Get(i).ToString().Utf8Value());
        }
    }
    void OnOK() override
    {
        Napi::Env env = Env();
        Napi::Array arr = Napi::Array::New(env, result_.size());
        for (size_t i = 0; i < result_.size(); ++i)
            arr.Set(i, Napi::String::New(env, result_[i]));
        Callback().Call({env.Null(), arr});
    }

private:
    std::vector<std::string> result_;
};

class WriteFilesWorker : public Napi::AsyncWorker
{
public:
    WriteFilesWorker(Napi::Function &cb, const Napi::Array &files)
        : AsyncWorker(cb)
    {
        uint32_t len = files.Length();
        for (uint32_t i = 0; i < len; ++i) {
            files_.push_back(files.Get(i).As<Napi::String>().Utf8Value());
        }
    }

protected:
    void Execute() override
    {
        WriteFileNames(Env(), files_); // 需同步实现支持 vector<string>
    }
    void OnOK() override
    {
        Callback().Call({Env().Null()});
    }

private:
    std::vector<std::string> files_;
};

Napi::Value GetFileNamesAsync(const Napi::CallbackInfo &info)
{
    Napi::Function cb = info[0].As<Napi::Function>();
    (new ReadFilesWorker(cb))->Queue();
    return info.Env().Undefined();
}

Napi::Value WriteFileNamesAsync(const Napi::CallbackInfo &info)
{
    Napi::Function cb = info[0].As<Napi::Function>();
    Napi::Array files = info[1].As<Napi::Array>();
    (new WriteFilesWorker(cb, files))->Queue();
    return info.Env().Undefined();
}