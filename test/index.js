const path = require('path');
const clipboard = require('../lib');
const assert = require('assert');

// 测试用文件路径（绝对路径）
const testFiles = [
  path.resolve(__dirname, '..', 'README.md'),
  path.resolve(__dirname, '..', 'package.json'),
];

// --- 同步测试 ---
function testSync() {
  console.log('🧪 开始同步测试...\n');
  console.log(`📋 测试平台: ${process.platform}`);

  // 版本
  assert.strictEqual(typeof clipboard.version(), 'string');
  console.log('✅ 版本测试通过');

  // 空数组
  clipboard.writeFiles([]);
  assert.deepStrictEqual(clipboard.readFiles(), []);
  console.log('✅ 空文件测试通过');

  // 单文件
  clipboard.writeFiles([testFiles[0]]);
  const single = clipboard.readFiles();
  assert.strictEqual(single.length, 1);
  assert.strictEqual(single[0], testFiles[0]);
  console.log('✅ 单文件测试通过');

  // 多文件
  clipboard.writeFiles(testFiles);
  const multiple = clipboard.readFiles();
  assert.strictEqual(multiple.length, 2);
  assert.ok(multiple.includes(testFiles[0]) && multiple.includes(testFiles[1]));
  console.log('✅ 多文件测试通过');

  // 文本
  const txt = '测试文本 🚀';
  clipboard.writeText(txt);
  assert.strictEqual(clipboard.readText(), txt);
  console.log('✅ 文本测试通过');

  console.log('🎉 同步测试全部通过！\n');
}

// --- 异步测试（Promise 风格） ---
async function testAsync() {
  console.log('🧪 开始异步测试...\n');

  const testPaths = [__filename];

  // 写文件
  await clipboard.writeFilesAsync(testPaths);
  console.log('✅ writeFilesAsync 写入成功');

  // 读文件
  const paths = await clipboard.readFilesAsync();
  assert.strictEqual(paths.length, 1);
  assert.strictEqual(paths[0], __filename);
  console.log('✅ readFilesAsync 读取成功');

  // 并发读写
  const tasks = Array(3).fill(null).map((_, i) =>
    clipboard.writeFilesAsync([...testPaths, String(i)])
      .then(() => clipboard.readFilesAsync())
      .then(result => assert.strictEqual(result.length, 2))
  );
  await Promise.all(tasks);
  console.log('✅ 并发读写测试通过');

  console.log('🎉 异步测试全部通过！\n');
}

// --- 统一入口 ---
async function runAllTests() {
  try {
    testSync();        // 同步测试
    await testAsync(); // 异步测试
    console.log('🎉 所有测试通过！');
  } catch (e) {
    console.error('❌ 测试失败:', e);
    process.exit(1);
  }
}

if (require.main === module) runAllTests();
module.exports = { runAllTests };