#pragma once
#include <napi.h>

Napi::Value GetFileNamesAsync(const Napi::CallbackInfo& info);
Napi::Value WriteFileNamesAsync(const Napi::CallbackInfo& info);