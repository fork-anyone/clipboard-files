const path = require('path');
const clipboard = require('../lib');
const assert = require('assert');

// 测试用文件路径（绝对路径）
const testFiles = [
  path.resolve(__dirname, '..', 'README.md'),
  path.resolve(__dirname, '..', 'package.json'),
];

function runTests() {
  console.log('?? 开始测试 clipboard-files');
  console.log(`📋 测试平台: ${process.platform}`);

  // 测试1：版本信息
  console.log(`?? 版本: ${clipboard.version()}`);
  assert.strictEqual(typeof clipboard.version(), 'string', '版本应为字符串');
  console.log('✅ 版本测试通过');

  // 测试2：文件API - 空数组
  clipboard.writeFiles([]);
  assert.deepStrictEqual(clipboard.readFiles(), [], '空数组读取应为空');
  console.log('✅ 文件API空数组测试通过');

  // 测试3：文件API - 单个文件
  clipboard.writeFiles([testFiles[0]]);
  const singleFile = clipboard.readFiles();
  assert.strictEqual(singleFile.length, 1, '单文件长度应为1');
  assert.strictEqual(singleFile[0], testFiles[0], '单文件路径应一致');
  console.log('✅ 文件API单文件测试通过');

  // 测试4：文件API - 多个文件
  clipboard.writeFiles(testFiles);
  const multipleFiles = clipboard.readFiles();
  assert.strictEqual(multipleFiles.length, 2, '多文件长度应为2');
  assert.ok(multipleFiles.includes(testFiles[0]), '应包含第一个文件');
  assert.ok(multipleFiles.includes(testFiles[1]), '应包含第二个文件');
  console.log('✅ 文件API多文件测试通过');

  // 测试5：文本API - 基本功能
  const testText = 'Hello, clipboard-files! 🎉';
  clipboard.writeText(testText);
  const readText = clipboard.readText();
  assert.strictEqual(readText, testText, '文本读写应一致');
  console.log('✅ 文本API基本功能测试通过');

  // 测试6：文本API - 空字符串
  clipboard.writeText('');
  assert.strictEqual(clipboard.readText(), '', '空字符串应正确处理');
  console.log('✅ 文本API空字符串测试通过');

  // 测试7：文本API - 特殊字符
  const specialText = '测试中文 🚀 Unicode: émojis ✨';
  clipboard.writeText(specialText);
  assert.strictEqual(clipboard.readText(), specialText, '特殊字符应正确处理');
  console.log('✅ 文本API特殊字符测试通过');

  // 测试8：文本API - 长文本
  const longText = 'A'.repeat(1000);
  clipboard.writeText(longText);
  assert.strictEqual(clipboard.readText(), longText, '长文本应正确处理');
  console.log('✅ 文本API长文本测试通过');

  // 测试9：API类型检查
  assert.strictEqual(typeof clipboard.readFiles, 'function', 'readFiles应为函数');
  assert.strictEqual(typeof clipboard.writeFiles, 'function', 'writeFiles应为函数');
  assert.strictEqual(typeof clipboard.readText, 'function', 'readText应为函数');
  assert.strictEqual(typeof clipboard.writeText, 'function', 'writeText应为函数');
  console.log('✅ API类型检查通过');

  // 测试10：错误参数处理
  try {
    clipboard.writeFiles(null);
    clipboard.writeFiles(undefined);
    clipboard.writeFiles('invalid');
    console.log('⚠️  错误参数处理 - 非数组参数已静默处理');
  } catch (e) {
    console.log('✅ 错误参数处理 - 已捕获异常');
  }

  try {
    clipboard.writeText(null);
    clipboard.writeText(undefined);
    console.log('⚠️  错误参数处理 - 非字符串参数已静默处理');
  } catch (e) {
    console.log('✅ 错误参数处理 - 已捕获异常');
  }

  // 测试11：并发性测试（基本）
  const texts = ['test1', 'test2', 'test3'];
  texts.forEach(text => clipboard.writeText(text));
  const lastText = clipboard.readText();
  assert.strictEqual(lastText, texts[texts.length - 1], '并发写入应保留最后一次');
  console.log('✅ 并发性测试通过');

  // 清理
  clipboard.writeFiles([]);
  clipboard.writeText('');
  console.log('🎉 所有测试通过！');
}

// 运行测试
if (require.main === module) {
  try {
    runTests();
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

module.exports = { runTests };