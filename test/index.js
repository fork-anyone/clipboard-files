const path = require('path');
const clipboard = require('../lib');
const assert = require('assert');

// 测试用文件路径（绝对路径）
const testFiles = [
  path.resolve(__dirname, '..', 'README.md'),
  path.resolve(__dirname, '..', 'package.json'),
];

function runTests() {
  console.log('🧪 开始测试 clipboard-files');

  // 测试1：空数组
  clipboard.writeFiles([]);
  assert.deepStrictEqual(clipboard.readFiles(), [], '空数组读取应为空');
  console.log('✅ 空数组测试通过');

  // 测试2：单个文件
  clipboard.writeFiles([testFiles[0]]);
  assert.deepStrictEqual(clipboard.readFiles(), [testFiles[0]], '单文件读取应一致');
  console.log('✅ 单文件测试通过');

  // 测试3：多个文件
  clipboard.writeFiles(testFiles);
  assert.deepStrictEqual(
    clipboard.readFiles().sort(),
    testFiles.sort(),
    '多文件读取应一致'
  );
  console.log('✅ 多文件测试通过');

  // 清理剪贴板
  clipboard.writeFiles([]);
  console.log('🎉 所有测试通过！');
}

runTests();