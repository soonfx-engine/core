#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build/fx');
const packagePath = path.join(buildDir, 'package.json');

console.log('🔧 本地安装 SoonFx Engine...\n');

// 检查构建目录是否存在
if (!fs.existsSync(buildDir)) {
    console.error('❌ 构建目录不存在，请先运行 npm run build');
    process.exit(1);
}

try {
    // 读取包信息
    const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`📦 包名: ${packageInfo.name}`);
    console.log(`📋 版本: ${packageInfo.version}\n`);

    // 进入构建目录
    process.chdir(buildDir);

    // 创建本地链接
    console.log('🔗 创建全局链接...');
    execSync('npm link', { stdio: 'inherit' });

    console.log('\n✅ 本地安装完成！');
    console.log('\n📋 使用方法:');
    console.log('1. 在其他项目中使用: npm link fx');
    console.log('2. 或者直接安装: npm install file:' + buildDir);
    console.log('\n💡 测试导入:');
    console.log('   import { fx } from "@soonfx/fx";');
    console.log('   const { fx } = require("@soonfx/fx");');

    // 创建测试文件
    const testDir = path.join(__dirname, '../test-local');
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }

    // 创建测试 package.json
    const testPackageJson = {
        "name": "fx-engine-test",
        "version": "1.0.0",
        "type": "module",
        "dependencies": {
            "fx": `file:${buildDir}`
        }
    };

    fs.writeFileSync(
        path.join(testDir, 'package.json'),
        JSON.stringify(testPackageJson, null, 2)
    );

    // 创建测试文件
    const testCode = `import { fx } from 'fx';

console.log('🎮 SoonFx Engine 测试');
console.log('版本检查:', typeof fx);

// 测试数学函数
const distance = fx.distance(0, 0, 3, 4);
console.log('距离计算 (0,0) 到 (3,4):', distance);

// 测试表达式计算
const result = fx.evaluateExpression('2 + 3 * 4');
console.log('表达式 "2 + 3 * 4" 结果:', result);

// 测试复制功能
const original = { x: 10, y: 20, nested: { a: 1, b: 2 } };
const copied = fx.copy(original);
console.log('深拷贝测试:', copied);

console.log('✅ 所有测试通过！');
`;

    fs.writeFileSync(path.join(testDir, 'test.js'), testCode);

    console.log(`\n🧪 测试文件已创建: ${testDir}/test.js`);
    console.log('运行测试: cd test-local && npm install && node test.js');

} catch (error) {
    console.error('❌ 本地安装失败:', error.message);
    process.exit(1);
}
