{
	"variables":{"openssl_fips":0},
	"targets": [{
		"target_name": "<(module_name)",
		"sources": [
			"src/main.cc"
		],
		"include_dirs": ["<!(node -e \"require('nan')\")"],
        "conditions": [
			['OS=="mac"',
			{
            "sources":[
                "src/clip_osx.h",
                "src/clip_osx.mm"
            ],
			'defines': [
				'__MACOSX_CORE__',
                '__MAC__',
			],
			'defines!': [
				'-std=c++11'
			],
			'link_settings': {
				'libraries': [
                    '-framework Cocoa',
					'-framework CoreFoundation',
				]
			},
			'xcode_settings': {
				'ARCHS': ['x86_64'],
				'MACOSX_DEPLOYMENT_TARGET': '10.13',
				'EXCUTABLE_EXTENSION': 'node',
				'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
				'OTHER_CFLAGS': [
					'-ObjC++',
					# '-std=c++14'
				]
			    }
			}
			],
			['OS=="win"',
			{
            "sources":[
                "src/clip_win.h",
                "src/clip_win.cc"
            ],
            'defines': [
				'__WIN32__'
			]
            }
			],
			['OS=="linux"',
				{}
			]
		]
	}, {
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
	}]
}