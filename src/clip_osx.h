#ifndef CLIP_OSX_H
#define CLIP_OSX_H

#include <napi.h>

Napi::Array GetFileNames(Napi::Env env);
void WriteFileNames(Napi::Env env, Napi::Array files);
Napi::String GetText(Napi::Env env);
void WriteText(Napi::Env env, const Napi::String& text);

#endif
