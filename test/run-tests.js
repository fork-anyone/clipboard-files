#!/usr/bin/env node

const { runTests } = require('./index');

console.log('🔍 运行跨平台测试...');
console.log(`🖥️  操作系统: ${process.platform}`);
console.log(`📟 架构: ${process.arch}`);
console.log(`🟢 Node.js版本: ${process.version}`);
console.log('');

// 检查模块是否已正确构建
try {
  require('../lib');
  console.log('✅ 模块加载成功');
} catch (error) {
  console.error('❌ 模块加载失败:', error.message);
  console.log('💡 请先运行: npm run rebuild');
  process.exit(1);
}

// 运行测试
runTests();