#ifndef CLIP_WIN_H
#define CLIP_WIN_H

#include <napi.h>
#include <windows.h>
#include <shlobj.h>
#include <vector>
#include <string>

Napi::Array GetFileNames(Napi::Env env);
void WriteFileNames(Napi::Env env, Napi::Array files);
Napi::String GetText(Napi::Env env);
void WriteText(Napi::Env env, const Napi::String& text);

#endif
