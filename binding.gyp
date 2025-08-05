{
	"variables":{"openssl_fips":0},
	"targets": [{
		"target_name": "binding",
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
				'ARCHS': ['x86_64', 'arm64'],
				"VALID_ARCHS": ["arm64", "x86_64"],
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
		"dependencies": ["binding"],
		"copies": [{
			"files": [ "<(PRODUCT_DIR)/binding.node" ],
			"destination": "./lib/binding/{node_abi}-{platform}-{arch}/"
		}]
	}]
}