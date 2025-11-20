{
    "targets": [{
        "target_name": "<(module_name)",
        "cflags!": ["-fno-exceptions"],
        "cflags_cc!": ["-fno-exceptions"],
        "sources": [
            "src/main.cc"
        ],
        "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        "defines": [
            "NAPI_DISABLE_CPP_EXCEPTIONS",
            'PACKAGE_VERSION="<!@(node -p \"require(\\\"./package.json\\\").version\")"'
        ],
        "conditions": [
            ['OS=="mac"', {
                'defines': [
                    '__MACOSX__'
                ],
                "sources": [
                    "src/clip_osx.mm",
                    "src/clip_osx_async.mm"
                ],
                "xcode_settings": {
                    "ONLY_ACTIVE_ARCH": "YES",
                    "CLANG_CXX_LANGUAGE_STANDARD": "c++14",
                    "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                    "CLANG_CXX_LIBRARY": "libc++",
                    "MACOSX_DEPLOYMENT_TARGET": "10.9",
                    "GCC_OPTIMIZATION_LEVEL": "0",
                    "GCC_GENERATE_DEBUGGING_SYMBOLS": "YES",
                    "DEBUG_INFORMATION_FORMAT": "dwarf-with-dsym",
                    "OTHER_LDFLAGS": [
                        "-framework Foundation",
                        "-framework Cocoa",
                        "-framework AppKit"
                    ],
                },
                "link_settings": {
                    "libraries": [
                        "-framework Foundation",
                        "-framework Cocoa", 
                        "-framework AppKit"
                    ]
                }
            }],
            ['OS=="win"', {
                'defines': [
				    '__WIN32__'
			    ],
                "sources": [
                    "src/clip_win.cc",
                    "src/clip_win_async.cc"
                ],
                "msvs_settings": {
                    "VCCLCompilerTool": {
                        "ExceptionHandling": 1,
                        "Optimization": 0,
                        "DebugInformationFormat": 3
                    },
                    "VCLinkerTool": {
                        "GenerateDebugInformation": "true"
                    }
                }
            }]
        ]
    },
    {
      "target_name": "action_after_build",
      "type": "none",
      "dependencies": [ "<(module_name)" ],
      "copies": [
        {
          "files": [ "<(PRODUCT_DIR)/<(module_name).node" ],
          "destination": "<(module_path)"
        }
      ],
      "conditions": [
        ["OS=='win'", {
          "copies": [
            {
              "files": [ "<(PRODUCT_DIR)/<(module_name).pdb" ],
              "destination": "<(module_path)"
            }
          ]
        }]
      ],
      "actions": []
    }
  ]
}
