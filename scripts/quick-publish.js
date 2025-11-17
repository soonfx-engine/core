#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 快速发布 SoonFx Engine 到 npm...\n');

try {
    // 0. 准备必要文件
    console.log('📋 准备必要文件...');
    const rootDir = path.join(__dirname, '..');
    const buildDir = path.join(__dirname, '../build/fx');
    
    // 复制 LICENSE
    const licenseSource = path.join(rootDir, 'LICENSE');
    const licenseTarget = path.join(buildDir, 'LICENSE');
    if (fs.existsSync(licenseSource)) {
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir, { recursive: true });
        }
        fs.copyFileSync(licenseSource, licenseTarget);
        console.log('  ✅ 已复制 LICENSE');
    }
    
    // 复制 README.MD
    const readmeSource = path.join(rootDir, 'README.MD');
    const readmeTarget = path.join(buildDir, 'README.md');
    if (fs.existsSync(readmeSource)) {
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir, { recursive: true });
        }
        fs.copyFileSync(readmeSource, readmeTarget);
        console.log('  ✅ 已复制 README.MD\n');
    }

    // 1. 重新构建
    console.log('📦 重新构建项目...');
    execSync('npm run build', { stdio: 'inherit' });

    // 2. 验证包结构
    console.log('\n🔍 验证包结构...');
    execSync('npm run verify', { stdio: 'inherit' });

    // 3. 本地测试
    console.log('\n🧪 运行本地测试...');
    execSync('npm run test:local', { stdio: 'inherit' });

    // 4. 发布确认
    const buildDir = path.join(__dirname, '../build/fx');
    const packageInfo = JSON.parse(fs.readFileSync(path.join(buildDir, 'package.json'), 'utf8'));

    console.log('\n📋 准备发布信息:');
    console.log(`   📦 包名: ${packageInfo.name}`);
    console.log(`   📋 版本: ${packageInfo.version}`);
    console.log(`   📝 描述: ${packageInfo.description}`);

    console.log('\n⚠️  请确认以下事项:');
    console.log('   1. 已登录 npm (运行 npm whoami 检查)');
    console.log('   2. 版本号正确');
    console.log('   3. 所有测试通过');

    // 5. 发布
    console.log('\n📤 开始发布...');
    process.chdir(buildDir);

    // 检查登录状态
    try {
        const username = execSync('npm whoami', { encoding: 'utf8' }).trim();
        console.log(`✅ npm 已登录，用户: ${username}`);
    } catch (error) {
        console.log('❌ 请先登录 npm:');
        console.log('   npm login');
        process.exit(1);
    }

    // 执行发布
    execSync('npm publish --access public', { stdio: 'inherit' });

    console.log('\n🎉 发布成功！');
    console.log(`📦 包地址: https://www.npmjs.com/package/${packageInfo.name}`);
    console.log(`💾 安装命令: npm install ${packageInfo.name}`);
    console.log('\n🧪 验证安装:');
    console.log(`   npm install ${packageInfo.name}`);
    console.log('   node -e "const {fx} = require(\'@soonfx/fx\'); console.log(typeof fx);"');

    // 清理临时复制的文件
    console.log('\n🧹 清理临时文件...');
    const licenseTarget = path.join(buildDir, 'LICENSE');
    const readmeTarget = path.join(buildDir, 'README.md');
    if (fs.existsSync(licenseTarget)) {
        fs.unlinkSync(licenseTarget);
        console.log('  ✅ 已删除 build/fx/LICENSE');
    }
    if (fs.existsSync(readmeTarget)) {
        fs.unlinkSync(readmeTarget);
        console.log('  ✅ 已删除 build/fx/README.md');
    }

} catch (error) {
    console.error('\n❌ 发布失败:', error.message);
    
    // 即使失败也要清理临时文件
    const rootDir = path.join(__dirname, '..');
    const buildDir = path.join(__dirname, '../build/fx');
    const licenseTarget = path.join(buildDir, 'LICENSE');
    const readmeTarget = path.join(buildDir, 'README.md');
    if (fs.existsSync(licenseTarget)) {
        fs.unlinkSync(licenseTarget);
    }
    if (fs.existsSync(readmeTarget)) {
        fs.unlinkSync(readmeTarget);
    }
    
    process.exit(1);
}
