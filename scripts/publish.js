#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build/fx');
const rootDir = path.join(__dirname, '..');
const packagePath = path.join(buildDir, 'package.json');

console.log('🚀 开始发布 SoonFx Engine 到 npm...\n');

// 在发布之前，确保 LICENSE 和 README 是最新的
console.log('📋 准备必要文件...');

// 复制 LICENSE
const licenseSource = path.join(rootDir, 'LICENSE');
const licenseTarget = path.join(buildDir, 'LICENSE');
if (fs.existsSync(licenseSource)) {
    fs.copyFileSync(licenseSource, licenseTarget);
    console.log('  ✅ 已复制 LICENSE');
} else {
    console.error('  ❌ 根目录的 LICENSE 不存在');
    process.exit(1);
}

// 复制 README.MD
const readmeSource = path.join(rootDir, 'README.MD');
const readmeTarget = path.join(buildDir, 'README.md');
if (fs.existsSync(readmeSource)) {
    fs.copyFileSync(readmeSource, readmeTarget);
    console.log('  ✅ 已复制 README.MD');
} else {
    console.error('  ❌ 根目录的 README.MD 不存在');
    process.exit(1);
}

console.log();

// 检查构建目录是否存在
if (!fs.existsSync(buildDir)) {
    console.error('❌ 构建目录不存在，请先运行 npm run build');
    process.exit(1);
}

// 检查必要文件
const requiredFiles = ['package.json', 'lib/index.mjs', 'lib/index.d.ts', 'README.md', 'LICENSE'];
for (const file of requiredFiles) {
    const filePath = path.join(buildDir, file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ 缺少必要文件: ${file}`);
        process.exit(1);
    }
}

try {
    // 读取包信息
    const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`📦 包名: ${packageInfo.name}`);
    console.log(`📋 版本: ${packageInfo.version}`);
    console.log(`📝 描述: ${packageInfo.description}\n`);

    // 检查 npm registry 配置
    try {
        const registry = execSync('npm config get registry', { 
            encoding: 'utf8',
            shell: true,
            windowsHide: true
        }).trim();
        console.log(`📍 npm registry: ${registry}`);
    } catch (error) {
        console.warn('⚠️  无法获取 registry 配置');
    }

    // 检查是否已登录 npm（在切换目录前检查）
    let npmUsername = '';
    try {
        const result = execSync('npm whoami --registry https://registry.npmjs.org/', { 
            encoding: 'utf8',
            shell: true,
            windowsHide: true,
            env: process.env
        });
        npmUsername = result.trim();
        console.log(`✅ npm 已登录，用户: ${npmUsername}\n`);
    } catch (error) {
        console.error('\n❌ npm 登录检查失败');
        console.error('错误信息:', error.message);
        if (error.stderr) {
            const stderr = error.stderr.toString().trim();
            if (stderr) console.error('详细错误:', stderr);
        }
        if (error.stdout) {
            const stdout = error.stdout.toString().trim();
            if (stdout) console.error('输出:', stdout);
        }
        console.error('\n💡 解决方案:');
        console.error('1. 请先执行: npm login');
        console.error('2. 如果使用淘宝镜像，请临时切换到官方源:');
        console.error('   npm config set registry https://registry.npmjs.org/');
        console.error('3. 检查网络连接是否正常');
        process.exit(1);
    }

    // 检查 scoped package 权限
    if (packageInfo.name.startsWith('@')) {
        const scope = packageInfo.name.split('/')[0].substring(1); // 去掉 @ 符号
        console.log(`📦 检测到 scoped package: ${packageInfo.name}`);
        console.log(`🔍 Scope: ${scope}`);
        
        if (npmUsername !== scope) {
            console.log(`\n⚠️  注意: 你的 npm 用户名是 "${npmUsername}"，但包的 scope 是 "${scope}"`);
            console.log(`\n💡 要发布 scoped package，你需要：`);
            console.log(`   1. 在 npmjs.com 上创建组织 "${scope}": https://www.npmjs.com/org/create`);
            console.log(`   2. 或者将包名改为 "${scope}" (如果这是你的用户名)`);
            console.log(`   3. 或者改为无 scope 的包名，例如: "soonfx" 或 "soon-fx"\n`);
            
            // 询问是否继续
            console.log('如果你已经创建了组织，按 Ctrl+C 取消，否则将尝试继续发布...\n');
        }
    }

    // 进入构建目录
    process.chdir(buildDir);

    // 执行发布前检查
    console.log('🔍 执行发布前检查...');
    try {
        execSync('npm run prepublishOnly', { stdio: 'inherit', shell: true });
    } catch (error) {
        console.warn('⚠️  prepublishOnly 脚本执行失败或不存在，继续发布流程...');
    }

    // 发布到 npm（强制使用官方源）
    console.log('📤 发布到 npmjs.com...');
    execSync('npm publish --access public --registry https://registry.npmjs.org/', { 
        stdio: 'inherit',
        shell: true,
        env: process.env
    });

    console.log('\n🎉 发布成功！');
    console.log(`📦 包地址: https://www.npmjs.com/package/${packageInfo.name}`);
    console.log(`💾 安装命令: npm install ${packageInfo.name}`);

    // 清理临时复制的文件
    console.log('\n🧹 清理临时文件...');
    if (fs.existsSync(licenseTarget)) {
        fs.unlinkSync(licenseTarget);
        console.log('  ✅ 已删除 build/fx/LICENSE');
    }
    if (fs.existsSync(readmeTarget)) {
        fs.unlinkSync(readmeTarget);
        console.log('  ✅ 已删除 build/fx/README.md');
    }

} catch (error) {
    console.error('❌ 发布失败:', error.message);
    
    // 即使失败也要清理临时文件
    if (fs.existsSync(licenseTarget)) {
        fs.unlinkSync(licenseTarget);
    }
    if (fs.existsSync(readmeTarget)) {
        fs.unlinkSync(readmeTarget);
    }
    
    process.exit(1);
}
